// app/newsletter/actions.ts
'use server'
// ─────────────────────────────────────────────────────────────
// Newsletter subscription Server Action
//
// Design decisions:
//   • Auto-confirms on signup (can add double opt-in later)
//   • Captures IP + User-Agent for GDPR compliance
//   • Handles duplicate emails gracefully (23505 = unique constraint)
//   • Optional: send welcome email via Resend
// ─────────────────────────────────────────────────────────────

import { headers } from 'next/headers'
import { adminSupabase } from '@/src/lib/supabase/service'
import { newsletterSchema } from '@/src/lib/newsletter/schema'
import type { NewsletterFormValues } from '@/src/lib/newsletter/schema'

type NewsletterActionResult =
  | { success: true }
  | { success: false; error: string; isDuplicate?: boolean }

// ─────────────────────────────────────────────────────────────
// Rate limiting (in-memory, single instance)
// For production: use Upstash Redis or Vercel KV
// ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(
  ip: string,
  limit = 3,
  windowMs = 60 * 60 * 1000,
): boolean {
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

async function getUserAgent(): Promise<string> {
  const headersList = await headers()
  return headersList.get('user-agent') ?? 'unknown'
}

// ─────────────────────────────────────────────────────────────
// SUBSCRIBE ACTION
// ─────────────────────────────────────────────────────────────
export async function subscribeToNewsletter(
  rawData: unknown,
  source?: string,
): Promise<NewsletterActionResult> {
  // 1. Rate limit (3 submissions per IP per hour)
  const ip = await getClientIp()
  if (!checkRateLimit(ip, 3, 60 * 60 * 1000)) {
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
    }
  }

  // 2. Validate email with Zod
  const parsed = newsletterSchema.safeParse(rawData)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    return {
      success: false,
      error: firstError?.message ?? 'Invalid email address',
    }
  }

  const { email } = parsed.data

  // 3. Insert subscriber (auto-confirm for now, can add double opt-in later)
  const { error: dbError } = await adminSupabase.from('subscribers').insert({
    email,
    status: 'confirmed', // Change to 'pending' if implementing double opt-in
    consent_given_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(), // Remove this for double opt-in
    source: source ?? 'website',
    ip_address: ip,
    user_agent: await getUserAgent(),
  })

  // 4. Handle errors
  if (dbError) {
    // Duplicate email (unique constraint violation)
    if (dbError.code === '23505') {
      return {
        success: false,
        error: 'This email is already subscribed to our newsletter.',
        isDuplicate: true,
      }
    }

    // Other database errors
    console.error('[subscribeToNewsletter] Database error:', {
      code: dbError.code,
      message: dbError.message,
      ip,
      timestamp: new Date().toISOString(),
    })

    return {
      success: false,
      error: 'Failed to subscribe. Please try again.',
    }
  }

  // 5. Optional: Send welcome email
  // await sendWelcomeEmail(email)

  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// UNSUBSCRIBE ACTION (for server-side unsubscribe handling)
// Frontend can also call the DB function directly via RPC
// ─────────────────────────────────────────────────────────────
export async function unsubscribeFromNewsletter(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const parsed = newsletterSchema.safeParse({ email })
  if (!parsed.success) {
    return { success: false, error: 'Invalid email address' }
  }

  const { error } = await adminSupabase
    .from('subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('email', parsed.data.email)

  if (error) {
    console.error('[unsubscribeFromNewsletter] Database error:', error.message)
    return { success: false, error: 'Failed to unsubscribe' }
  }

  return { success: true }
}