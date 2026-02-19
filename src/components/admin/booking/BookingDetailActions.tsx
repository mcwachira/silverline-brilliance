'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Booking, BookingStatus } from '@/types/types'
import { updateBookingStatus, deleteBooking, sendManualEmail } from '@/src/app/actions/booking-actions'
import ConfirmDialog from '@/src/components/shared/ConfirmDialog'
import {
  CheckCircle, XCircle, Star, Mail, Trash2,
  Loader2, Eye, BookOpen
} from 'lucide-react'

interface Props { booking: Booking }

export default function BookingDetailActions({ booking: b }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [showDelete, setShowDelete]     = useState(false)
  const [showReject, setShowReject]     = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  function run(label: string, fn: () => Promise<{ success: boolean; error?: string }>) {
    setActiveAction(label)
    startTransition(async () => {
      const r = await fn()
      setActiveAction(null)
      if (!r.success) { toast.error(r.error ?? 'Failed'); return }
      toast.success(label + ' successful')
      router.refresh()
    })
  }

  async function handleDelete() {
    setShowDelete(false)
    run('Delete', () => deleteBooking(b.id))
    router.push('//admin/dashboard/bookings')
  }

  async function handleReject() {
    setShowReject(false)
    run('Rejection', () => updateBookingStatus(b.id, 'rejected', { reason: rejectReason }))
  }

  const loading = isPending

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {b.status === 'pending' && (
          <button disabled={loading} onClick={() => run('Review', () => updateBookingStatus(b.id, 'reviewing'))}
            className="btn-secondary text-sm" style={{ color: '#FFC107', borderColor: 'rgba(255,193,7,0.3)' }}>
            {activeAction === 'Review' && loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
            Mark Reviewing
          </button>
        )}

        {(b.status === 'pending' || b.status === 'reviewing') && (
          <button disabled={loading} onClick={() => run('Confirm', () => updateBookingStatus(b.id, 'confirmed'))}
            className="btn-primary text-sm">
            {activeAction === 'Confirm' && loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Confirm
          </button>
        )}

        {b.status === 'confirmed' && (
          <button disabled={loading} onClick={() => run('Complete', () => updateBookingStatus(b.id, 'completed'))}
            className="btn-secondary text-sm" style={{ color: '#28A745', borderColor: 'rgba(40,167,69,0.3)' }}>
            {activeAction === 'Complete' && loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
            Mark Complete
          </button>
        )}

        <button disabled={loading} onClick={() => run('Email', () => sendManualEmail(b.id, 'booking_confirmed'))}
          className="btn-secondary text-sm">
          {activeAction === 'Email' && loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          Send Email
        </button>

        {b.status !== 'rejected' && b.status !== 'completed' && (
          <button disabled={loading} onClick={() => setShowReject(true)}
            className="btn-secondary text-sm" style={{ color: '#DC3545', borderColor: 'rgba(220,53,69,0.2)' }}>
            <XCircle className="w-4 h-4" /> Reject
          </button>
        )}

        <button disabled={loading} onClick={() => setShowDelete(true)} className="btn-danger text-sm">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Reject modal with reason */}
      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowReject(false)} />
          <div className="relative card p-6 w-full max-w-sm z-10" style={{ background: 'var(--surface-2)' }}>
            <h3 className="text-base font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
              Reject Booking
            </h3>
            <label className="label">Reason (sent to client)</label>
            <textarea
              className="input resize-none mb-4"
              rows={3}
              placeholder="Optional — explain why the booking can't be accepted..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowReject(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleReject} className="btn-danger flex-1 justify-center">Reject Booking</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showDelete}
        title="Delete Booking"
        description={`Permanently delete booking ${b.booking_reference}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  )
}