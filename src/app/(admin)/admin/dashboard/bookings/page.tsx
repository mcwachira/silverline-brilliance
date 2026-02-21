'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClientSupabaseClient } from '@/src/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import type { Booking, BookingStatus, FilterState } from '@/types/types'
import { updateBookingStatus, deleteBooking } from '@/src/app/actions/booking-actions'
import {StatusBadge }from '@/src/components/admin/shared/StatusBadge'
import ConfirmDialog from '@/src/components/admin/shared/ConfirmDialog'
import {
  Search, RefreshCw, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Eye, CheckCircle,
  XCircle, Loader2, Users
} from 'lucide-react'

const PAGE_SIZE = 15

const STATUS_OPTIONS: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
]

type SortField = 'event_date' | 'created_at' | 'full_name' | 'status'
type SortDir   = 'asc' | 'desc'

export default function BookingsPage() {
  const supabase = createClientSupabaseClient()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir]     = useState<SortDir>('desc')
  const [filters, setFilters]     = useState<FilterState>({ search: '', status: 'all' })
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      let q = supabase.from('bookings').select('*', { count: 'exact' })

      if (filters.search) {
        const s = filters.search
        q = q.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,booking_reference.ilike.%${s}%,event_name.ilike.%${s}%`)
      }
      if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
      if (filters.dateFrom) q = q.gte('event_date', filters.dateFrom)
      if (filters.dateTo)   q = q.lte('event_date', filters.dateTo)

      q = q.order(sortField, { ascending: sortDir === 'asc' })
           .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      const { data, count, error } = await q
      if (error) throw error
      setBookings(data ?? [])
      setTotal(count ?? 0)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [filters, page, sortField, sortDir])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  // Real-time
  useEffect(() => {
    const ch = supabase.channel('bookings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchBookings)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  function handleSort(f: SortField) {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDir('asc') }
    setPage(1)
  }

  async function handleStatusChange(booking: Booking, status: BookingStatus) {
    setActionLoading(booking.id + status)
    const result = await updateBookingStatus(booking.id, status)
    setActionLoading(null)
    if (!result.success) { toast.error(result.error ?? 'Failed'); return }
    toast.success(`Booking ${status}`)
    fetchBookings()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setActionLoading(deleteTarget.id + 'delete')
    const result = await deleteBooking(deleteTarget.id)
    setActionLoading(null)
    if (!result.success) { toast.error(result.error ?? 'Failed'); return }
    toast.success('Booking deleted')
    setDeleteTarget(null)
    fetchBookings()
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const SortIcon = ({ f }: { f: SortField }) =>
    sortField !== f
      ? <ChevronUp className="w-3 h-3 opacity-20" />
      : sortDir === 'asc'
        ? <ChevronUp   className="w-3 h-3" style={{ color: 'var(--gold)' }} />
        : <ChevronDown className="w-3 h-3" style={{ color: 'var(--gold)' }} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">{total.toLocaleString()} total</p>
        </div>
        <button onClick={fetchBookings} className="btn-ghost p-2" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map(o => (
          <button
            key={o.value}
            onClick={() => { setFilters(f => ({ ...f, status: o.value })); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.status === o.value ? 'btn-primary' : 'btn-secondary'}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Search + date filters */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
          <input
            className="input pl-9"
            placeholder="Search name, email, reference, event..."
            value={filters.search}
            onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1) }}
          />
        </div>
        <input type="date" className="input w-38" value={filters.dateFrom ?? ''} onChange={e => { setFilters(f => ({ ...f, dateFrom: e.target.value })); setPage(1) }} />
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>to</span>
        <input type="date" className="input w-38" value={filters.dateTo ?? ''} onChange={e => { setFilters(f => ({ ...f, dateTo: e.target.value })); setPage(1) }} />
        {(filters.search || (filters.status && filters.status !== 'all') || filters.dateFrom || filters.dateTo) && (
          <button className="btn-ghost text-xs" onClick={() => { setFilters({ search: '', status: 'all' }); setPage(1) }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <button className="flex items-center gap-1" onClick={() => handleSort('full_name')}>
                    Client <SortIcon f="full_name" />
                  </button>
                </th>
                <th>Event</th>
                <th>
                  <button className="flex items-center gap-1" onClick={() => handleSort('event_date')}>
                    Date <SortIcon f="event_date" />
                  </button>
                </th>
                <th>Services</th>
                <th>Attendees</th>
                <th>
                  <button className="flex items-center gap-1" onClick={() => handleSort('status')}>
                    Status <SortIcon f="status" />
                  </button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j}>
                          <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: `${50 + Math.random() * 40}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : bookings.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="text-center py-14">
                        <Users className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>No bookings found</p>
                      </td>
                    </tr>
                  )
                  : bookings.map(b => (
                    <tr key={b.id}>
                      {/* Client */}
                      <td>
                        <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{b.full_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{b.email}</p>
                        {b.company && <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{b.company}</p>}
                      </td>
                      {/* Event */}
                      <td>
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{b.event_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{b.event_type}</p>
                      </td>
                      {/* Date */}
                      <td>
                        <p className="text-sm" style={{ color: 'var(--text)' }}>{format(new Date(b.event_date), 'dd MMM yyyy')}</p>
                        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{b.event_start_time}{b.event_end_time ? ` – ${b.event_end_time}` : ''}</p>
                      </td>
                      {/* Services */}
                      <td>
                        <p className="text-xs max-w-36 truncate" title={b.selected_services.join(', ')}>
                          {b.selected_services.slice(0, 2).join(', ')}
                          {b.selected_services.length > 2 ? ` +${b.selected_services.length - 2}` : ''}
                        </p>
                      </td>
                      {/* Attendees */}
                      <td>
                        <span className="text-sm">{b.expected_attendees.toLocaleString()}</span>
                      </td>
                      {/* Status */}
                      <td><StatusBadge status={b.status} /></td>
                      {/* Actions */}
                      <td>
                        <div className="flex items-center gap-1">
                          <Link href={`//admin/dashboard/bookings/${b.id}`} className="btn-ghost p-1.5" title="View details">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(b, 'reviewing')}
                              disabled={!!actionLoading}
                              className="btn-ghost p-1.5 text-xs" title="Mark reviewing"
                              style={{ color: '#FFC107' }}
                            >
                              {actionLoading === b.id + 'reviewing' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '👀'}
                            </button>
                          )}
                          {(b.status === 'pending' || b.status === 'reviewing') && (
                            <button
                              onClick={() => handleStatusChange(b, 'confirmed')}
                              disabled={!!actionLoading}
                              className="btn-ghost p-1.5" title="Confirm"
                              style={{ color: '#28A745' }}
                            >
                              {actionLoading === b.id + 'confirmed' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          {b.status !== 'rejected' && b.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(b, 'rejected')}
                              disabled={!!actionLoading}
                              className="btn-ghost p-1.5" title="Reject"
                              style={{ color: '#DC3545' }}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              <button className="btn-ghost p-1.5" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded text-xs font-medium ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button className="btn-ghost p-1.5" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Booking"
        description={`Permanently delete booking ${deleteTarget?.booking_reference} for ${deleteTarget?.full_name}?`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}