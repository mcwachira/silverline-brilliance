// app//admin/dashboard/bookings/[id]/page.tsx
import { notFound } from 'next/navigation'
import { createServerSupabaseClient} from '@/src/lib/supabase/server'
import type { Booking } from '@/types/types'
import { format } from 'date-fns'
import Link from 'next/link'
import StatusBadge from '@/src/components/shared/StatusBadge'
import BookingDetailActions from '@/src/components/admin/bookings/BookingDetailActions'
import {
  ArrowLeft, User, Calendar, MapPin, FileText,
  DollarSign, History, CreditCard, Paperclip, Phone, Mail
} from 'lucide-react'

export const metadata = { title: 'Booking Details' }

interface Props {
  params: { id: string }
}

export default async function BookingDetailPage({ params }: Props) {
  const supabase = await createServerSupabaseClient()
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !booking) notFound()

  const b = booking as Booking

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start gap-4">
          <Link href="//admin/dashboard/bookings" className="btn-ghost p-2 mt-0.5">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="page-title">Booking #{b.id.slice(0, 8).toUpperCase()}</h1>
              <StatusBadge status={b.status} />
            </div>
            <p className="page-subtitle">
              Created {format(new Date(b.created_at), 'MMMM d, yyyy')} at {format(new Date(b.created_at), 'h:mm a')}
            </p>
          </div>
        </div>
        <BookingDetailActions booking={b} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">

          {/* Client Info */}
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-faint)' }}>
              <User className="w-3.5 h-3.5" /> Client Information
            </h2>
            <div className="space-y-3">
              <InfoRow icon={User} label="Name" value={b.client_name} highlight />
              <InfoRow icon={Mail} label="Email" value={b.client_email} />
              {b.client_phone && <InfoRow icon={Phone} label="Phone" value={b.client_phone} />}
            </div>
          </section>

          {/* Event Details */}
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-faint)' }}>
              <Calendar className="w-3.5 h-3.5" /> Event Details
            </h2>
            <div className="space-y-3">
              <InfoRow icon={Calendar} label="Event Date" value={format(new Date(b.event_date), 'EEEE, MMMM d, yyyy')} highlight />
              {b.event_time && <InfoRow icon={Calendar} label="Event Time" value={b.event_time} />}
              {b.event_location && <InfoRow icon={MapPin} label="Location" value={b.event_location} />}
              {b.event_type && <InfoRow icon={FileText} label="Event Type" value={b.event_type} />}
              {b.services?.length > 0 && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(139,31,168,0.1)' }}>
                    <FileText className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
                  </div>
                  <div>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-faint)' }}>Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {b.services.map(service => (
                        <span key={service} className="badge badge-confirmed" style={{ fontSize: '11px' }}>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          {(b.notes || b.admin_notes) && (
            <section className="card p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-faint)' }}>
                <FileText className="w-3.5 h-3.5" /> Notes
              </h2>
              {b.notes && (
                <div className="mb-4">
                  <p className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>Client Notes</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{b.notes}</p>
                </div>
              )}
              {b.admin_notes && (
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>Admin Notes (private)</p>
                  <p className="text-sm p-3 rounded-lg" style={{ color: 'var(--text-muted)', background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.1)' }}>
                    {b.admin_notes}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Activity Log */}
          {b.activity_log && b.activity_log.length > 0 && (
            <section className="card p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-faint)' }}>
                <History className="w-3.5 h-3.5" /> Activity Log
              </h2>
              <div className="space-y-3">
                {[...b.activity_log].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--purple)' }} />
                    <div>
                      <p className="text-sm font-medium capitalize" style={{ color: 'var(--text)' }}>{entry.action}</p>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        by {entry.performed_by} · {format(new Date(entry.performed_at), 'MMM d, yyyy h:mm a')}
                      </p>
                      {entry.details && (
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{entry.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Pricing */}
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-faint)' }}>
              <DollarSign className="w-3.5 h-3.5" /> Pricing
            </h2>
            <div className="space-y-2">
              {b.price_total != null && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-faint)' }}>Total</span>
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>
                    ${b.price_total.toLocaleString()}
                  </span>
                </div>
              )}
              {b.price_deposit != null && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-faint)' }}>Deposit</span>
                  <span style={{ color: 'var(--text-muted)' }}>${b.price_deposit.toLocaleString()}</span>
                </div>
              )}
              {b.payment_status && (
                <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <StatusBadge status={b.payment_status as any} />
                </div>
              )}
              {!b.price_total && !b.price_deposit && (
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>No pricing set</p>
              )}
            </div>
          </section>

          {/* Reschedule History */}
          {b.reschedule_history && b.reschedule_history.length > 0 && (
            <section className="card p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-faint)' }}>
                <Calendar className="w-3.5 h-3.5" /> Reschedule History
              </h2>
              <div className="space-y-3">
                {b.reschedule_history.map((record, i) => (
                  <div key={i} className="text-xs p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-faint)' }}>From: <span style={{ color: '#DC3545' }}>{format(new Date(record.from_date), 'MMM d, yyyy')}</span></p>
                    <p style={{ color: 'var(--text-faint)' }}>To: <span style={{ color: '#28A745' }}>{format(new Date(record.to_date), 'MMM d, yyyy')}</span></p>
                    {record.reason && <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{record.reason}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Uploaded Files */}
          {b.uploaded_files && b.uploaded_files.length > 0 && (
            <section className="card p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-faint)' }}>
                <Paperclip className="w-3.5 h-3.5" /> Uploaded Files
              </h2>
              <div className="space-y-2">
                {b.uploaded_files.map((file, i) => (
                  <a key={i} href={file} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs p-2 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: 'var(--gold)' }}>
                    <Paperclip className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{decodeURIComponent(file.split('/').pop() ?? 'File')}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, highlight }: {
  icon: React.ElementType; label: string; value: string; highlight?: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(139,31,168,0.1)' }}>
        <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: highlight ? 'var(--text)' : 'var(--text-muted)' }}>
          {value}
        </p>
      </div>
    </div>
  )
}