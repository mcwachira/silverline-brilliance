import type { BookingStatus, BlogPostStatus } from '@/types/types'

type AnyStatus = BookingStatus | BlogPostStatus

const CONFIG: Record<AnyStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'badge badge-pending' },
  confirmed: { label: 'Confirmed', className: 'badge badge-confirmed' },
  completed: { label: 'Completed', className: 'badge badge-completed' },
  cancelled: { label: 'Cancelled', className: 'badge badge-cancelled' },
  rescheduled: { label: 'Rescheduled', className: 'badge badge-rescheduled' },
  draft: { label: 'Draft', className: 'badge badge-draft' },
  published: { label: 'Published', className: 'badge badge-published' },
  scheduled: { label: 'Scheduled', className: 'badge badge-scheduled' },
  archived: { label: 'Archived', className: 'badge badge-draft' },
}

interface Props {
  status: AnyStatus
}

export default function StatusBadge({ status }: Props) {
  const config = CONFIG[status] ?? { label: status, className: 'badge badge-draft' }
  return <span className={config.className}>{config.label}</span>
}