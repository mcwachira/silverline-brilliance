'use client'

import { useTransition, useState } from 'react'
import { toast } from 'sonner'
import { updateBookingNotes } from '@/src/app/actions/booking-actions'
import { Save, Loader2, StickyNote } from 'lucide-react'

interface Props {
  bookingId: string
  currentNotes?: string
  currentAssignedTo?: string
}

export default function InternalNotesForm({ bookingId, currentNotes, currentAssignedTo }: Props) {
  const [isPending, startTransition] = useTransition()
  const [notes, setNotes]         = useState(currentNotes ?? '')
  const [assignedTo, setAssigned] = useState(currentAssignedTo ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const fd = new FormData(form)

    startTransition(async () => {
      const result = await updateBookingNotes(fd)
      if (result.success) toast.success('Notes saved')
      else toast.error(result.error ?? 'Failed to save')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-3">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-faint)' }}>
        <StickyNote className="w-3.5 h-3.5" /> Internal Notes
      </h3>

      <input type="hidden" name="bookingId" value={bookingId} />

      <div>
        <label className="label text-xs">Assigned To</label>
        <input
          name="assigned_to"
          className="input"
          placeholder="Team member name..."
          value={assignedTo}
          onChange={e => setAssigned(e.target.value)}
        />
      </div>

      <div>
        <label className="label text-xs">Private Notes</label>
        <textarea
          name="internal_notes"
          className="input resize-none"
          rows={4}
          placeholder="Internal notes not visible to client..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isPending} className="btn-secondary w-full justify-center text-sm">
        {isPending
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
          : <><Save className="w-3.5 h-3.5" /> Save Notes</>
        }
      </button>
    </form>
  )
}