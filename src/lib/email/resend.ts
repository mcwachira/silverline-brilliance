// lib/email/send.ts

import { Resend } from 'resend'
import type { Booking, EmailEvent } from '@/types/types'

const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM_EMAIL = process.env.EMAIL_FROM ?? 'noreply@yourdomain.com'
const FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'Studio Admin'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@yourdomain.com'

// ============================================================
// HTML EMAIL TEMPLATES
// ============================================================

function baseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f0f13; font-family: 'Georgia', serif; color: #e8e0f0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #1a1225; border-radius: 12px; overflow: hidden; border: 1px solid #8B1FA8; }
    .header { background: linear-gradient(135deg, #8B1FA8 0%, #5c1070 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #FFD700; font-size: 24px; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
    .header p { color: rgba(255,255,255,0.7); font-size: 13px; }
    .body { padding: 40px; }
    .body p { font-size: 15px; line-height: 1.8; color: #d4c8e8; margin-bottom: 16px; }
    .detail-card { background: rgba(139,31,168,0.12); border: 1px solid rgba(139,31,168,0.3); border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
    .detail-card h3 { color: #FFD700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .detail-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #9d8fbe; font-size: 13px; }
    .detail-value { color: #e8e0f0; font-size: 13px; font-weight: 500; text-align: right; max-width: 60%; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FFD700, #f0bc00); color: #1a1225; font-weight: 700; font-size: 14px; text-decoration: none; border-radius: 8px; margin: 8px 4px; letter-spacing: 0.5px; }
    .btn-outline { background: transparent; border: 2px solid #8B1FA8; color: #c070e8; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-pending { background: rgba(255,193,7,0.2); color: #FFC107; border: 1px solid rgba(255,193,7,0.4); }
    .badge-confirmed { background: rgba(23,162,184,0.2); color: #17A2B8; border: 1px solid rgba(23,162,184,0.4); }
    .badge-cancelled { background: rgba(220,53,69,0.2); color: #DC3545; border: 1px solid rgba(220,53,69,0.4); }
    .badge-rescheduled { background: rgba(139,31,168,0.2); color: #c070e8; border: 1px solid rgba(139,31,168,0.4); }
    .badge-completed { background: rgba(40,167,69,0.2); color: #28A745; border: 1px solid rgba(40,167,69,0.4); }
    .footer { padding: 24px 40px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
    .footer p { color: #6b5f84; font-size: 12px; line-height: 1.6; }
    .footer a { color: #8B1FA8; text-decoration: none; }
    @media (max-width: 600px) {
      .body { padding: 24px 20px; }
      .header { padding: 24px 20px; }
      .detail-row { flex-direction: column; gap: 4px; }
      .detail-value { text-align: left; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${FROM_NAME}</h1>
      <p>Professional Event Services</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>You received this email because you have a booking with ${FROM_NAME}.<br/>
      If you have questions, reply to this email or contact us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>.</p>
    </div>
  </div>
</body>
</html>
`
}

function bookingDetailCard(booking: Booking): string {
  return `
<div class="detail-card">
  <h3>Booking Details</h3>
  <div class="detail-row">
    <span class="detail-label">Booking ID</span>
    <span class="detail-value">#${booking.id.slice(0, 8).toUpperCase()}</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Client Name</span>
    <span class="detail-value">${booking.full_name}</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Event Date</span>
    <span class="detail-value">${new Date(booking.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
  </div>
  ${booking.event_start_time ? `<div class="detail-row"><span class="detail-label">Event Time</span><span class="detail-value">${booking.event_start_time}</span></div>` : ''}
  ${booking.venue_address? `<div class="detail-row"><span class="detail-label">Location</span><span class="detail-value">${booking.venue_address}</span></div>` : ''}
  ${booking.selected_services?.length ? `<div class="detail-row"><span class="detail-label">Services</span><span class="detail-value">${booking.selected_services.join(', ')}</span></div>` : ''}
  ${booking.price_total ? `<div class="detail-row"><span class="detail-label">Total</span><span class="detail-value">$${booking.price_total.toLocaleString()}</span></div>` : ''}
</div>
`
}

// ============================================================
// TEMPLATE BUILDERS
// ============================================================

function bookingCreatedAdminEmail(booking: Booking): { subject: string; html: string } {
  return {
    subject: `🎉 New Booking Request — ${booking.full_name}`,
    html: baseTemplate(`
      <p>You have a <strong style="color:#FFD700;">new booking request</strong> from a client. Please review and confirm.</p>
      ${bookingDetailCard(booking)}
      ${booking?.notes ? `<p><strong style="color:#c070e8;">Client Notes:</strong><br/>${booking?.notes}</p>` : ''}
      <div style="text-align:center; margin-top:32px;">
        <a href="${process.env.NEXT_PUBLIC_ADMIN_URL}//admin/dashboard/bookings/${booking.id}" class="btn">View & Confirm Booking</a>
      </div>
    `, 'New Booking Request'),
  }
}

function bookingConfirmedClientEmail(booking: Booking): { subject: string; html: string } {
  return {
    subject: `✅ Booking Confirmed — ${new Date(booking.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    html: baseTemplate(`
      <p>Dear <strong style="color:#FFD700;">${booking.full_name}</strong>,</p>
      <p>We're thrilled to confirm your booking! We're looking forward to making your event truly special.</p>
      ${bookingDetailCard(booking)}
      <p>If you need to make any changes or have questions, please don't hesitate to reach out. We're here to help every step of the way.</p>
      <p style="color:#9d8fbe; font-size:14px;">Warm regards,<br/><strong style="color:#e8e0f0;">${FROM_NAME} Team</strong></p>
    `, 'Booking Confirmed'),
  }
}

function bookingRescheduledClientEmail(booking: Booking, oldDate: string, reason?: string): { subject: string; html: string } {
  return {
    subject: `📅 Booking Rescheduled — Updated to ${new Date(booking.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
    html: baseTemplate(`
      <p>Dear <strong style="color:#FFD700;">${booking.full_name}</strong>,</p>
      <p>Your booking has been <strong style="color:#c070e8;">rescheduled</strong>. Please see the updated details below.</p>
      <div class="detail-card" style="margin-bottom:8px; border-color:rgba(220,53,69,0.3); background:rgba(220,53,69,0.05);">
        <h3 style="color:#DC3545;">Previous Date</h3>
        <div class="detail-row">
          <span class="detail-label">Was</span>
          <span class="detail-value" style="color:#f77;">${new Date(oldDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      ${bookingDetailCard(booking)}
      ${reason ? `<p><strong style="color:#c070e8;">Reason for reschedule:</strong><br/>${reason}</p>` : ''}
      <p>If this change doesn't work for you, please contact us as soon as possible to discuss alternatives.</p>
      <p style="color:#9d8fbe; font-size:14px;">Warm regards,<br/><strong style="color:#e8e0f0;">${FROM_NAME} Team</strong></p>
    `, 'Booking Rescheduled'),
  }
}

function bookingCancelledClientEmail(booking: Booking): { subject: string; html: string } {
  return {
    subject: `Booking Cancellation Notice`,
    html: baseTemplate(`
      <p>Dear <strong style="color:#FFD700;">${booking.full_name}</strong>,</p>
      <p>We're writing to confirm that your booking scheduled for <strong>${new Date(booking.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong> has been cancelled.</p>
      ${bookingDetailCard(booking)}
      <p>We're sorry for any inconvenience. If you'd like to rebook or have any questions, please don't hesitate to get in touch.</p>
      <div style="text-align:center; margin-top:32px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/booking" class="btn">Book Again</a>
      </div>
      <p style="color:#9d8fbe; font-size:14px; margin-top:24px;">Warm regards,<br/><strong style="color:#e8e0f0;">${FROM_NAME} Team</strong></p>
    `, 'Booking Cancelled'),
  }
}

function bookingCompletedClientEmail(booking: Booking): { subject: string; html: string } {
  return {
    subject: `🌟 Thank You — We Hope You Loved Your Event!`,
    html: baseTemplate(`
      <p>Dear <strong style="color:#FFD700;">${booking.full_name}</strong>,</p>
      <p>It was an absolute pleasure working with you! We hope your event was everything you dreamed of and more. ✨</p>
      ${bookingDetailCard(booking)}
      <p>If you'd like to leave a review or share your experience, we'd love to hear from you. Your feedback means the world to us!</p>
      <p>We hope to have the pleasure of working with you again.</p>
      <p style="color:#9d8fbe; font-size:14px;">With gratitude,<br/><strong style="color:#e8e0f0;">${FROM_NAME} Team</strong></p>
    `, 'Event Complete — Thank You!'),
  }
}

// ============================================================
// MAIN SEND FUNCTION
// ============================================================

interface SendEmailOptions {
  event: EmailEvent
  booking: Booking
  meta?: { oldDate?: string; reason?: string }
}

type EmailEvent =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_rescheduled'
  | 'booking_cancelled'
  | 'booking_completed'

export async function sendBookingEmail({ event, booking, meta }: SendEmailOptions) {
  const emails: Array<{ to: string; subject: string; html: string }> = []

  switch (event) {
    case 'booking_created':
      emails.push({ to: ADMIN_EMAIL, ...bookingCreatedAdminEmail(booking) })
      break
    case 'booking_confirmed':
      emails.push({ to: booking.email, ...bookingConfirmedClientEmail(booking) })
      break
    case 'booking_rescheduled':
      emails.push({ to: booking.email, ...bookingRescheduledClientEmail(booking, meta?.oldDate ?? booking.event_date, meta?.reason) })
      break
    case 'booking_cancelled':
      emails.push({ to: booking.email, ...bookingCancelledClientEmail(booking) })
      break
    case 'booking_completed':
      emails.push({ to: booking.email, ...bookingCompletedClientEmail(booking) })
      break
  }

  const results = await Promise.allSettled(
    emails.map(({ to, subject, html }) =>
      resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to,
        subject,
        html,
      })
    )
  )

  const errors = results.filter((r) => r.status === 'rejected')
  if (errors.length > 0) {
    console.error('[Email] Send errors:', errors)
    throw new Error(`Failed to send ${errors.length} email(s)`)
  }

  return results
}