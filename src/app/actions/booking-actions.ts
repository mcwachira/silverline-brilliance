'use server'


import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/src/lib/supabase/server'
import { sendBookingEmail } from '@/src/lib/email/resend'
import { z } from 'zod'
import type { BookingStatus, PreferredContact, EmailEvent, QuoteRequestStatus } from '@/types/types'

// ── Auth helper ─────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorised')
  return { supabase, user }
}

// ── Update booking status ───────────────────────────────────────

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
  options?: { reason?: string }
) {
  const { supabase } = await requireAdmin()

  // Fetch current booking for email
  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  // Cast booking to proper type since DB returns preferred_contact as string
  if (!booking) return { success: false, error: 'Booking not found' }
  
  const typedBooking = {
    ...booking,
    preferred_contact: booking.preferred_contact as PreferredContact,
    status: booking.status as BookingStatus
  }

  // Update status
  const { error: updateErr } = await supabase
    .from('bookings')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', bookingId)

  if (updateErr) return { success: false, error: updateErr.message }

  // Send relevant email
  try {
    switch (newStatus) {
      case 'reviewing':
        await sendBookingEmail({ event: 'booking_created', booking: typedBooking })
        break
      case 'confirmed':
        await sendBookingEmail({ event: 'booking_confirmed', booking: typedBooking })
        break
      case 'rejected':
        await sendBookingEmail({ event: 'booking_cancelled', booking: typedBooking, meta: { reason: options?.reason } })
        break
      case 'completed':
        await sendBookingEmail({ event: 'booking_completed', booking: typedBooking })
        break
    }
  } catch (emailErr) {
    // Status update succeeded; email failure is non-fatal
    console.error('[email]', emailErr)
  }

  revalidatePath('//admin/dashboard/bookings')
  revalidatePath(`//admin/dashboard/bookings/${bookingId}`)
  return { success: true }
}

// ── Update internal notes ───────────────────────────────────────

const NotesSchema = z.object({
  bookingId: z.string().uuid(),
  internal_notes: z.string().max(5000).optional(),
  assigned_to: z.string().max(100).optional(),
})

export async function updateBookingNotes(formData: FormData) {
  const { supabase } = await requireAdmin()

  const parsed = NotesSchema.safeParse({
    bookingId: formData.get('bookingId'),
    internal_notes: formData.get('internal_notes') || undefined,
    assigned_to: formData.get('assigned_to') || undefined,
  })

  if (!parsed.success) return { success: false, error: 'Validation failed' }

  const { bookingId, ...fields } = parsed.data
  const { error } = await supabase
    .from('bookings')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', bookingId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`//admin/dashboard/bookings/${bookingId}`)
  return { success: true }
}

// ── Delete booking ──────────────────────────────────────────────

export async function deleteBooking(bookingId: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId)
  if (error) return { success: false, error: error.message }

  revalidatePath('//admin/dashboard/bookings')
  return { success: true }
}

// ── Send manual email ───────────────────────────────────────────

export async function sendManualEmail(bookingId: string, event: EmailEvent) {
  const { supabase } = await requireAdmin()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (!booking) return { success: false, error: 'Booking not found' }

  try {
    await sendBookingEmail({ 
      event, 
      booking: {
        ...booking,
        preferred_contact: booking.preferred_contact as PreferredContact,
        status: booking.status as BookingStatus
      }
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ── Update quote request status ─────────────────────────────────

export async function updateQuoteStatus(
  quoteId: string,
  status: QuoteRequestStatus
) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from('quote_requests')
    .update({ status })
    .eq('id', quoteId)

  if (error) return { success: false, error: error.message }

  revalidatePath('//admin/dashboard/bookings')
  return { success: true }
}