
import 'server-only'
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

if (!process.env.EMAIL_FROM) {
  throw new Error('Missing EMAIL_FROM environment variable')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingConfirmationEmailData {
  to: string
  bookingReference: string
  customerName: string
  eventName: string
  eventDate: string
  eventTime: string
  selectedServices: string[]
  venueName: string
  expectedAttendees: number
}

export async function sendBookingConfirmationEmail(
  data: BookingConfirmationEmailData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: data.to,
      subject: `Booking Confirmed: ${data.bookingReference} — ${data.eventName}`,
      html: generateBookingConfirmationHTML(data),
      // Optional: attach a calendar invite
      // attachments: [{ filename: 'event.ics', content: generateICS(data) }],
    })

    if (error) {
      console.error('[sendBookingConfirmationEmail] Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[sendBookingConfirmationEmail] Unexpected error:', message)
    return { success: false, error: message }
  }
}


function generateBookingConfirmationHTML(data: BookingConfirmationEmailData): string {
  const formattedDate = new Date(data.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0 0 8px; color: #fbbf24; font-size: 28px; font-weight: 700; }
    .header p { margin: 0; color: #cbd5e1; font-size: 14px; }
    .content { padding: 32px 24px; }
    .reference { background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .reference-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; font-weight: 600; margin-bottom: 4px; }
    .reference-code { font-size: 24px; font-weight: 700; color: #92400e; font-family: 'Courier New', monospace; }
    .info-section { margin-bottom: 24px; }
    .info-section h2 { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 12px; }
    .info-grid { display: grid; grid-template-columns: 120px 1fr; gap: 8px; }
    .info-label { font-size: 13px; color: #64748b; font-weight: 500; }
    .info-value { font-size: 13px; color: #0f172a; font-weight: 400; }
    .services-list { list-style: none; padding: 0; margin: 8px 0 0; }
    .services-list li { padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #0f172a; }
    .services-list li:last-child { border-bottom: none; }
    .next-steps { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-top: 24px; }
    .next-steps h3 { margin: 0 0 12px; font-size: 14px; color: #1e40af; font-weight: 600; }
    .next-steps ol { margin: 0; padding-left: 20px; }
    .next-steps li { font-size: 13px; color: #1e40af; margin-bottom: 6px; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0 0 8px; font-size: 13px; color: #64748b; }
    .footer a { color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Request Received</h1>
      <p>Silverline Brilliance — Professional AV Services</p>
    </div>
    
    <div class="content">
      <p style="font-size: 15px; color: #0f172a; margin: 0 0 20px;">
        Dear ${escapeHtml(data.customerName)},
      </p>
      <p style="font-size: 15px; color: #475569; margin: 0 0 24px; line-height: 1.6;">
        Thank you for choosing Silverline Brilliance. We've received your booking request and our team will review it shortly. You should receive a detailed quote within <strong>24 hours</strong>.
      </p>

      <div class="reference">
        <div class="reference-label">Your Booking Reference</div>
        <div class="reference-code">${escapeHtml(data.bookingReference)}</div>
      </div>

      <div class="info-section">
        <h2>Event Details</h2>
        <div class="info-grid">
          <div class="info-label">Event:</div>
          <div class="info-value">${escapeHtml(data.eventName)}</div>
          <div class="info-label">Date:</div>
          <div class="info-value">${formattedDate}</div>
          <div class="info-label">Time:</div>
          <div class="info-value">${escapeHtml(data.eventTime)}</div>
          <div class="info-label">Venue:</div>
          <div class="info-value">${escapeHtml(data.venueName)}</div>
          <div class="info-label">Attendees:</div>
          <div class="info-value">${data.expectedAttendees.toLocaleString()}</div>
        </div>
      </div>

      <div class="info-section">
        <h2>Requested Services</h2>
        <ul class="services-list">
          ${data.selectedServices.map((service) => `<li>✓ ${escapeHtml(service)}</li>`).join('')}
        </ul>
      </div>

      <div class="next-steps">
        <h3>What Happens Next</h3>
        <ol>
          <li>Our team will review your requirements</li>
          <li>You'll receive an itemised quote within 24 hours</li>
          <li>Once approved, your date will be secured</li>
          <li>We'll send a written agreement for your signature</li>
        </ol>
      </div>
    </div>

    <div class="footer">
      <p><strong>Questions?</strong> Reply to this email or call us at <a href="tel:+254712345678">+254 712 345 678</a></p>
      <p>Email: <a href="mailto:bookings@silverlinebrilliance.com">bookings@silverlinebrilliance.com</a></p>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 16px;">
        © ${new Date().getFullYear()} Silverline Brilliance. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}