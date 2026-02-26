'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { Booking } from '@/types/types'
import {
  MoreHorizontal, Eye, CheckCircle, CalendarRange,
  XCircle, Trash2, Mail, Star
} from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  booking: Booking
  onConfirm: () => void
  onComplete: () => void
  onCancel: () => void
  onReschedule: () => void
  onDelete: () => void
}

export default function BookingActionsMenu({ booking, onConfirm, onComplete, onCancel, onReschedule, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSendEmail() {
    try {
      const res = await fetch('/api/bookings/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'booking_confirmed', bookingId: booking.id }),
      })
      if (!res.ok) throw new Error()
      toast.success('Email sent to ' + booking.email)
    } catch {
      toast.error('Failed to send email')
    }
    setOpen(false)
  }

  const menuItems = [
    {
      label: 'View Details',
      icon: Eye,
      href: `//admin/dashboard/bookings/${booking.id}`,
    },
    booking.status === 'pending' && {
      label: 'Confirm Booking',
      icon: CheckCircle,
      color: '#28A745',
      onClick: () => { onConfirm(); setOpen(false) },
    },
    booking.status === 'confirmed' && {
      label: 'Mark Complete',
      icon: Star,
      color: 'var(--gold)',
      onClick: () => { onComplete(); setOpen(false) },
    },
    {
      label: 'Reschedule',
      icon: CalendarRange,
      color: '#17A2B8',
      onClick: () => { onReschedule(); setOpen(false) },
    },
    {
      label: 'Send Email',
      icon: Mail,
      onClick: handleSendEmail,
    },
    booking.status !== 'cancelled' && {
      label: 'Cancel Booking',
      icon: XCircle,
      color: '#FFC107',
      onClick: () => { onCancel(); setOpen(false) },
    },
    {
      label: 'Delete',
      icon: Trash2,
      color: '#DC3545',
      onClick: () => { onDelete(); setOpen(false) },
      divider: true,
    },
  ].filter(Boolean) as NonNullable<typeof menuItems[number]>[]

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn-ghost p-1.5"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 rounded-lg shadow-xl z-50 py-1"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', minWidth: '180px' }}
        >
          {menuItems.map((item, i) => (
            <div key={i}>
              {item.divider && <div className="my-1 mx-2 h-px" style={{ background: 'var(--border)' }} />}
              {'href' in item ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/5"
                  style={{ color: item.color ?? 'var(--text-muted)' }}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </Link>
              ) : (
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-white/5"
                  style={{ color: item.color ?? 'var(--text-muted)' }}
                  onClick={item.onClick}
                >
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}