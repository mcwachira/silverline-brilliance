// app/dashboard/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/src/lib/supabase/server'
import { sanityReadClient, BLOG_POSTS_QUERY } from '@/src/sanity/lib/client'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import StatCard from '@/src/components/admin/dashboard/StatCard'
import RecentBookings from '@/src/components/admin/booking/RecentBookings'
import BookingsByStatusChart from '@/src/components/admin//admin/dashboard/bookingsByStatusChart'
import { CalendarDays, FileText, TrendingUp, Users, Clock, CheckCircle2 } from 'lucide-react'

export const metadata = { title: 'Overview' }

async function getDashboardData() {
  const supabase = await createClient()
  const now = new Date()

  const [
    { count: totalBookings },
    { count: pendingBookings },
    { count: confirmedBookings },
    { count: thisMonthBookings },
    { data: recentBookings },
    { data: statusBreakdown },
    blogPosts,
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    supabase.from('bookings').select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth(now).toISOString())
      .lte('created_at', endOfMonth(now).toISOString()),
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('bookings').select('status'),
    sanityReadClient.fetch(`*[_type == "post"] { _id, title, status, _createdAt }`).catch(() => []),
  ])

  // Status breakdown for chart
  const statusCounts = (statusBreakdown ?? []).reduce((acc: Record<string, number>, row: { status: string }) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1
    return acc
  }, {})

  const publishedPosts = (blogPosts as Array<{ status: string }>)?.filter((p) => p.status === 'published').length ?? 0

  return {
    stats: {
      totalBookings: totalBookings ?? 0,
      pendingBookings: pendingBookings ?? 0,
      confirmedBookings: confirmedBookings ?? 0,
      thisMonthBookings: thisMonthBookings ?? 0,
      publishedPosts,
    },
    recentBookings: recentBookings ?? [],
    statusCounts,
  }
}

export default async function DashboardPage() {
  const { stats, recentBookings, statusCounts } = await getDashboardData()

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: CalendarDays,
      color: 'var(--purple)',
      description: 'All time',
    },
    {
      title: 'This Month',
      value: stats.thisMonthBookings,
      icon: TrendingUp,
      color: 'var(--gold)',
      description: format(new Date(), 'MMMM yyyy'),
    },
    {
      title: 'Pending Review',
      value: stats.pendingBookings,
      icon: Clock,
      color: '#FFC107',
      description: 'Awaiting confirmation',
    },
    {
      title: 'Confirmed',
      value: stats.confirmedBookings,
      icon: CheckCircle2,
      color: '#28A745',
      description: 'Upcoming events',
    },
    {
      title: 'Published Posts',
      value: stats.publishedPosts,
      icon: FileText,
      color: '#17A2B8',
      description: 'Live on your site',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Here&apos;s what&apos;s happening today — {format(new Date(), 'EEEE, MMMM do yyyy')}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Chart */}
        <div className="card p-5 lg:col-span-1">
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
            Bookings by Status
          </h2>
          <BookingsByStatusChart data={statusCounts} />
        </div>

        {/* Recent Bookings */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
              Recent Bookings
            </h2>
            <a href="//admin/dashboard/bookings" className="text-xs" style={{ color: 'var(--gold)' }}>
              View all →
            </a>
          </div>
          <RecentBookings bookings={recentBookings} />
        </div>
      </div>
    </div>
  )
}