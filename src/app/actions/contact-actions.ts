'use server'

// actions/contact-action.ts
// Updated to accept typed object from react-hook-form (not FormData)

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import {createServerSupabaseClient } from '@/src/lib/supabase/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { ContactSchema } from "@/src/lib/validation/contact";

const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend       = new Resend(process.env.RESEND_API_KEY!)
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL    ?? 'silverlinetech@gmail.com'
const FROM_EMAIL   = process.env.EMAIL_FROM     ?? 'noreply@silverlinetech.com'
const FROM_NAME    = process.env.EMAIL_FROM_NAME ?? 'Silverline Technologies'

// ── Validation schema ────────────────────────────────────────────
// Exported so ContactForm can use it with zodResolver


export type ContactFormValues = z.infer<typeof ContactSchema>

export interface ContactActionResult {
  success: boolean
  error?: string
  reference?: string
}

// ── Email templates ──────────────────────────────────────────────

function adminEmail(data: ContactFormValues, reference: string) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0f0f1a;font-family:Georgia,serif;color:#e8e0f0}
  .wrap{max-width:600px;margin:32px auto;background:#1a1225;border-radius:12px;overflow:hidden;border:1px solid rgba(139,31,168,.4)}
  .hdr{background:linear-gradient(135deg,#3d0a5c,#8B1FA8);padding:28px 36px}
  .brand{color:#FFD700;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
  .ref{float:right;background:rgba(255,215,0,.15);color:#FFD700;border:1px solid rgba(255,215,0,.3);padding:3px 10px;border-radius:20px;font-size:11px}
  .hdr h1{color:#fff;font-size:19px;margin-top:14px}
  .hdr p{color:rgba(255,255,255,.55);font-size:11px;margin-top:4px}
  .body{padding:32px 36px}
  .card{background:rgba(139,31,168,.1);border:1px solid rgba(139,31,168,.25);border-radius:8px;padding:16px 20px;margin-bottom:18px}
  .card-title{color:#FFD700;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}
  .row{display:flex;gap:12px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px}
  .row:last-child{border-bottom:none}
  .lbl{color:#9d8fbe;min-width:110px;flex-shrink:0}.val{color:#e8e0f0;word-break:break-word}
  .msg{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:6px;padding:14px;margin-top:10px;font-size:13px;line-height:1.8;color:#d4c8e8;white-space:pre-wrap}
  .btn{display:inline-block;padding:12px 26px;background:linear-gradient(135deg,#FFD700,#e6c000);color:#1a1225;font-weight:700;font-size:13px;text-decoration:none;border-radius:8px;letter-spacing:.5px}
  .ftr{padding:18px 36px;border-top:1px solid rgba(255,255,255,.06);text-align:center;font-size:11px;color:#6b5f84}
</style>
</head><body>
<div class="wrap">
  <div class="hdr">
    <span class="brand">Silverline Technologies</span><span class="ref">${reference}</span>
    <h1>📬 New Contact Message</h1>
    <p>${new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
  </div>
  <div class="body">
    <div class="card">
      <p class="card-title">Sender</p>
      <div class="row"><span class="lbl">Name</span><span class="val"><strong>${data.full_name}</strong></span></div>
      <div class="row"><span class="lbl">Email</span><span class="val"><a href="mailto:${data.email}" style="color:#c070e8">${data.email}</a></span></div>
      ${data.phone ? `<div class="row"><span class="lbl">Phone</span><span class="val"><a href="tel:${data.phone}" style="color:#c070e8">${data.phone}</a></span></div>` : ''}
      ${data.service ? `<div class="row"><span class="lbl">Service</span><span class="val">${data.service}</span></div>` : ''}
      ${data.how_heard ? `<div class="row"><span class="lbl">How found you</span><span class="val">${data.how_heard}</span></div>` : ''}
    </div>
    <div class="card">
      <p class="card-title">Message</p>
      <p style="color:#FFD700;font-size:14px;font-weight:600;margin-bottom:8px">${data.subject}</p>
      <div class="msg">${data.message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
    </div>
    <div style="text-align:center;margin-top:6px">
      <a href="${process.env.NEXT_PUBLIC_ADMIN_URL ?? ''}/dashboard/messages" class="btn">View in Dashboard →</a>
    </div>
  </div>
  <div class="ftr">Reply to <strong style="color:#c070e8">${data.email}</strong> to respond.</div>
</div>
</body></html>`
}

function autoReplyEmail(data: ContactFormValues, reference: string) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0f0f1a;font-family:Georgia,serif;color:#e8e0f0}
  .wrap{max-width:600px;margin:32px auto;background:#1a1225;border-radius:12px;overflow:hidden;border:1px solid rgba(139,31,168,.4)}
  .hdr{background:linear-gradient(135deg,#3d0a5c,#8B1FA8);padding:32px 36px;text-align:center}
  .hdr h1{color:#FFD700;font-size:20px;font-weight:700;letter-spacing:.5px}
  .hdr p{color:rgba(255,255,255,.6);font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-top:6px}
  .body{padding:36px}
  .body p{font-size:14px;line-height:1.85;color:#d4c8e8;margin-bottom:14px}
  .ref-box{background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.25);border-radius:8px;padding:14px;text-align:center;margin:18px 0}
  .ref-lbl{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#9d8fbe;margin-bottom:6px}
  .ref-num{font-size:20px;font-weight:700;color:#FFD700;letter-spacing:1px}
  .hours{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:6px;padding:14px;margin:14px 0}
  .h-row{display:flex;justify-content:space-between;font-size:13px;padding:3px 0;color:#9d8fbe}
  .h-row span:last-child{color:#e8e0f0}
  .ftr{padding:20px 36px;border-top:1px solid rgba(255,255,255,.06);text-align:center;font-size:11px;color:#6b5f84}
  .contacts{display:flex;justify-content:center;gap:20px;margin-bottom:10px;font-size:12px}
  .contacts a{color:#c070e8;text-decoration:none}
</style>
</head><body>
<div class="wrap">
  <div class="hdr">
    <h1>SILVERLINE TECHNOLOGIES</h1>
    <p>Professional AudioVisual Services</p>
  </div>
  <div class="body">
    <p>Dear <strong style="color:#FFD700">${data.full_name}</strong>,</p>
    <p>Thank you for reaching out! We've received your message and will get back to you within <strong style="color:#c070e8">24–48 business hours</strong>.</p>
    <div class="ref-box">
      <div class="ref-lbl">Your Reference Number</div>
      <div class="ref-num">${reference}</div>
      <p style="font-size:10px;color:#6b5f84;margin-top:5px">Keep this for your records</p>
    </div>
    <div class="hours">
      <div class="h-row"><span>Monday – Friday</span><span>8:00 AM – 6:00 PM</span></div>
      <div class="h-row"><span>Saturday</span><span>9:00 AM – 4:00 PM</span></div>
      <div class="h-row"><span>Sunday</span><span style="color:#ff6b7a">Closed</span></div>
    </div>
    <p>For urgent matters, call us at <a href="tel:0700040225" style="color:#FFD700;font-weight:600;text-decoration:none">0700040225</a>.</p>
    <p style="color:#9d8fbe;font-size:13px;margin-top:18px">Warm regards,<br/><strong style="color:#e8e0f0">The Silverline Technologies Team</strong></p>
  </div>
  <div class="ftr">
    <div class="contacts">
      <a href="tel:0700040225">📞 0700040225</a>
      <a href="mailto:silverlinetech@gmail.com">✉️ silverlinetech@gmail.com</a>
      <span>📍 Nairobi, Kenya</span>
    </div>
    <p>© ${new Date().getFullYear()} Silverline Technologies. All rights reserved.</p>
  </div>
</div>
</body></html>`
}

// ── Main server action ────────────────────────────────────────────
// Accepts typed object — called directly from react-hook-form handleSubmit

export async function submitContactForm(
  data: ContactFormValues
): Promise<ContactActionResult> {

  // Server-side re-validation (never trust client data)
  const parsed = ContactSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Invalid form data. Please check your inputs.' }
  }

  const validated = parsed.data
  const reference = `MSG-${Date.now().toString().slice(-7)}`

  // Save to Supabase
  const { error: dbError } = await supabaseAdmin
    .from('contact_messages')
    .insert({
      reference,
      full_name: validated.full_name,
      email:     validated.email,
      phone:     validated.phone || null,
      subject:   validated.subject,
      message:   validated.message,
      service:   validated.service || null,
      how_heard: validated.how_heard || null,
      status:    'unread',
    })

  if (dbError) {
    console.error('[contact] DB error:', dbError)
    return { success: false, error: 'Failed to save your message. Please try again.' }
  }

  // Send both emails — non-fatal if they fail
  try {
    await Promise.allSettled([
      resend.emails.send({
        from:    `${FROM_NAME} <${FROM_EMAIL}>`,
        to:      ADMIN_EMAIL,
        replyTo: validated.email,
        subject: `📬 [${reference}] ${validated.full_name} — ${validated.subject}`,
        html:    adminEmail(validated, reference),
      }),
      resend.emails.send({
        from:    `${FROM_NAME} <${FROM_EMAIL}>`,
        to:      validated.email,
        subject: `We received your message — ${reference}`,
        html:    autoReplyEmail(validated, reference),
      }),
    ])
  } catch (e) {
    console.error('[contact] Email error:', e)
  }

  return { success: true, reference }
}

// ── Admin actions ─────────────────────────────────────────────────

export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived'

export async function updateMessageStatus(
  messageId: string,
  status: MessageStatus,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorised' }

  const updates: Record<string, unknown> = { status }
  if (adminNotes !== undefined) updates.admin_notes = adminNotes
  if (status === 'replied') updates.replied_at = new Date().toISOString()

  const { error } = await supabase
    .from('contact_messages')
    .update(updates)
    .eq('id', messageId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/messages')
  return { success: true }
}

export async function deleteMessage(
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorised' }

  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', messageId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/messages')
  return { success: true }
}