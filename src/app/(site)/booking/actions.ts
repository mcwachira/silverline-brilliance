// app/booking/actions.ts
'use server'
// ─────────────────────────────────────────────────────────────
// WHY SERVER ACTIONS OVER API ROUTES:
//
//   1. The service role key NEVER leaves the server process.
//      There is no way for client code to call this function
//      directly — it goes through Next.js's encrypted action IDs.
//
//   2. Zod validation runs server-side as a second defense layer
//      after client-side validation. A malformed/tampered POST
//      is rejected before reaching the database.
//
//   3. No additional fetch boilerplate. useTransition() handles
//      loading state in the component.
//
//   4. Structured return types give the client typed error maps
//      that React Hook Form can apply directly to specific fields.
// ─────────────────────────────────────────────────────────────

import { headers } from 'next/headers'
import { adminSupabase } from '@/src/lib/supabase/service'
import { bookingSchema, quickQuoteSchema } from '@/src/lib/booking/schema'
import type { BookingFormValues, QuickQuoteValues } from '@/src/lib/booking/schema'
import { sendBookingConfirmationEmail } from '@/src/lib/email/resend'

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
type FieldErrors = Partial<Record<keyof BookingFormValues, string[]>>

type BookingActionResult =
  | { success: true; bookingReference: string }
  | { success: false; error: string; fieldErrors?: FieldErrors }

type QuoteActionResult =
  | { success: true }
  | { success: false; error: string }

// ─────────────────────────────────────────────────────────────
// SIMPLE RATE LIMITING (in-memory, single instance)
// For production scale, replace with Upstash Redis:
//   npm install @upstash/ratelimit @upstash/redis
// ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

async function getClientIp(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown'
  )
}

// ─────────────────────────────────────────────────────────────
// BOOKING REFERENCE GENERATOR
// Format: SLB-XXXXXXXX (8 random alphanumeric chars)
// ─────────────────────────────────────────────────────────────
function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // ambiguous chars removed
  const random = Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join('')
  return `SLB-${random}`
}

function generateQuoteReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const random = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join('')
  return `QQ-${random}`
}

// ─────────────────────────────────────────────────────────────
// SUBMIT BOOKING — Main form Server Action
// ─────────────────────────────────────────────────────────────
export async function submitBooking(
  rawData: unknown,
): Promise<BookingActionResult> {
  // 1. Rate limit check
  const ip = await getClientIp()
  if (!checkRateLimit(ip, 5, 60 * 60 * 1000)) {
    return {
      success: false,
      error: 'Too many requests. Please wait before submitting again.',
    }
  }

  // 2. Server-side Zod validation (cannot be bypassed by the client)
  const parsed = bookingSchema.safeParse(rawData)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as FieldErrors
    return {
      success: false,
      error: 'Please correct the errors below.',
      fieldErrors,
    }
  }

  const data = parsed.data

  // 3. Generate reference server-side (only after validation passes)
  const bookingReference = generateBookingReference()

  // 4. Insert using service role — bypasses RLS, runs server-side only
  const { error: dbError } = await adminSupabase.from('bookings').insert({
    booking_reference: bookingReference,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    company: data.company || null,
    event_name: data.eventName,
    event_type:
      data.eventType === 'Other' ? (data.eventTypeOther ?? 'Other') : data.eventType,
    event_date: data.eventDate,
    event_start_time: data.eventStartTime,
    event_end_time: data.eventEndTime || null,
    expected_attendees: data.expectedAttendees,
    venue_name: data.venueName,
    venue_address: data.venueAddress || null,
    selected_services: data.selectedServices,
    special_requirements: data.specialRequirements || null,
    budget_range: data.budgetRange || null,
    how_heard: data.howHeard || null,
    preferred_contact: data.preferredContact,
    status: 'pending',
  })

  if (dbError) {
    // Log the full error server-side but never expose DB internals to client
    console.error('[submitBooking] Database error:', {
      code: dbError.code,
      message: dbError.message,
      ip,
      timestamp: new Date().toISOString(),
    })

    // Handle constraint violations gracefully
    if (dbError.code === '23514') {
      return {
        success: false,
        error: 'Some submitted values are invalid. Please review your entries.',
      }
    }

    return {
      success: false,
      error:
        'We could not process your booking at this time. Please try again or contact us directly.',
    }
  }

  // 5. Send confirmation email (non-blocking — don't fail booking if email fails)
  sendBookingConfirmationEmail({
    to: data.email,
    bookingReference,
    customerName: data.fullName,
    eventName: data.eventName,
    eventDate: data.eventDate,
    eventTime: data.eventStartTime,
    selectedServices: data.selectedServices,
    venueName: data.venueName,
    expectedAttendees: data.expectedAttendees,
  }).catch((err) => {
    // Log email failure but don't block the booking
    console.error('[submitBooking] Email send failed (non-fatal):', err)
  })

  return { success: true, bookingReference }
}

// ─────────────────────────────────────────────────────────────
// SUBMIT QUICK QUOTE — FAB modal Server Action
// Inserts to quote_requests table (not bookings)
// ─────────────────────────────────────────────────────────────
export async function submitQuoteRequest(
  rawData: unknown,
): Promise<QuoteActionResult> {
  const ip = await getClientIp()
  if (!checkRateLimit(`qq:${ip}`, 10, 60 * 60 * 1000)) {
    return { success: false, error: 'Too many requests. Please wait.' }
  }

  const parsed = quickQuoteSchema.safeParse(rawData)
  if (!parsed.success) {
    return { success: false, error: 'Please check your details and try again.' }
  }

  const data = parsed.data
  const reference = generateQuoteReference()

  const { error: dbError } = await adminSupabase.from('quote_requests').insert({
    reference,
    name: data.name,
    email: data.email,
    phone: data.phone,
    service: data.service || null,
    event_date: data.eventDate || null,
    message: data.message || null,
  })

  if (dbError) {
    console.error('[submitQuoteRequest] Database error:', dbError.message)
    return { success: false, error: 'Failed to submit quote request. Please try again.' }
  }

  return { success: true }
}