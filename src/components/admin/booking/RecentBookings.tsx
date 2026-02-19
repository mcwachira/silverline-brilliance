import Link from 'next/link'
import { format } from 'date-fns'
import type { Booking } from '@/types/types'
import StatusBadge from '@/src/components/shared/StatusBadge'
import { ArrowRight } from 'lucide-react'

interface Props {
  bookings: Booking[]
}

export default function RecentBookings({ bookings }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No bookings yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          href={`/admin/dashboard/bookings/${booking.id}`}
          className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-white/5 group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, var(--purple-dark), var(--purple))', color: 'var(--gold)' }}>
              {booking.full_name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                {booking.full_name}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>
                {format(new Date(booking.event_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={booking.status} />
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }} />
          </div>
        </Link>
      ))}
    </div>
  )
}
