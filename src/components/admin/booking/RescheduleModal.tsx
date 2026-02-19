'use client'

import { useState } from 'react'
import {createClientSupabaseClient } from '@/src/lib/supabase/client'
import { toast } from 'sonner'
import type { Booking } from '@/types/types'
import { X, CalendarDays, Loader2, FileText } from 'lucide-react'

interface Props {
  booking: Booking
  onClose: () => void
  onSuccess: () => void
}

export default function RescheduleModal({ booking, onClose, onSuccess }: Props) {
  const supabase =createClientSupabaseClient()
  const [newDate, setNewDate] = useState(booking.event_date.split('T')[0])
  const [newTime, setNewTime] = useState(booking.event_start_time ?? '')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newDate) { toast.error('Please select a date'); return }

    setLoading(true)
    try {
      const oldDate = booking.event_date
      const rescheduleRecord = {
        from_date: oldDate,
        to_date: newDate,
        reason,
        rescheduled_at: new Date().toISOString(),
        rescheduled_by: 'admin',
      }

      const activityEntry = {
        action: 'rescheduled',
        performed_by: 'admin',
        performed_at: new Date().toISOString(),
        details: reason ? `Reason: ${reason}` : undefined,
      }

      const { error } = await supabase
        .from('bookings')
        .update({
          event_date: newDate,
          event_time: newTime || null,
          status: 'rescheduled',
          reschedule_reason: reason,
          reschedule_history: [...(booking.reschedule_history ?? []), rescheduleRecord],
          activity_log: [...(booking.activity_log ?? []), activityEntry],
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id)

      if (error) throw error

      // Send reschedule email
      await fetch('/api/bookings/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'booking_rescheduled',
          bookingId: booking.id,
          meta: { oldDate, reason },
        }),
      })

      toast.success('Booking rescheduled and customer notified')
      onSuccess()
    } catch (err) {
      toast.error('Failed to reschedule booking')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative card w-full max-w-md p-6 z-10 shadow-2xl" style={{ background: 'var(--surface-2)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(139,31,168,0.2)' }}>
              <CalendarDays className="w-5 h-5" style={{ color: 'var(--purple-light)' }} />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
                Reschedule Booking
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{booking.client_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current date info */}
          <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.2)' }}>
            <p style={{ color: 'var(--text-faint)' }}>Current date</p>
            <p className="font-medium" style={{ color: '#FFC107' }}>
              {new Date(booking.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* New date */}
          <div>
            <label className="label">New Event Date *</label>
            <input
              type="date"
              className="input"
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
          </div>

          {/* New time */}
          <div>
            <label className="label">New Event Time (optional)</label>
            <input
              type="time"
              className="input"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>

          {/* Reason */}
          <div>
            <label className="label">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Reason for Rescheduling
              </span>
            </label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Briefly explain the reason (will be included in the customer email)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Rescheduling...</>
                : 'Confirm Reschedule'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}