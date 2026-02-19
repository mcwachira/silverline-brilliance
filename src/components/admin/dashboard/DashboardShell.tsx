'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClientSupabaseClient } from '@/src/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { AdminProfile } from '@/types/types'
import {
  LayoutDashboard, CalendarDays, FileText, Settings, LogOut,
  Menu, X, Bell, ChevronLeft, Users, BarChart3, Mail,
  ChevronDown
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/admin/dashboard/blog', label: 'Blog', icon: FileText },
  { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
]

interface Props {
  children: React.ReactNode
  user: User
  profile: AdminProfile | null
}

export default function DashboardShell({ children, user, profile }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/admin/login')
  }

  const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Admin'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ─── MOBILE OVERLAY ─── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300
          lg:relative
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'w-[68px]'}
        `}
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--purple-dark), var(--purple))' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--gold)' }}>A</span>
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)', fontFamily: 'Playfair Display, serif' }}>
                Admin
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="ml-auto btn-ghost p-1.5 hidden lg:flex"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-0.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  title={!sidebarOpen ? label : undefined}
                >
                  <Icon className="flex-shrink-0 w-5 h-5" />
                  {sidebarOpen && <span className="truncate">{label}</span>}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User area */}
        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className={`flex items-center gap-3 p-2 rounded-lg ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, var(--purple), var(--gold))', color: '#1a1225' }}>
              {initials}
            </div>
            {sidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{displayName}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{user.email}</p>
                </div>
                <button onClick={handleSignOut} className="btn-ghost p-1.5 flex-shrink-0" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Navbar */}
        <header className="flex items-center gap-3 px-6 py-4 border-b flex-shrink-0"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

          {/* Mobile menu toggle */}
          <button
            className="btn-ghost p-2 lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb-style title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
              {NAV_ITEMS.find(n =>
                n.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(n.href)
              )?.label ?? 'Dashboard'}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="btn-ghost p-2 relative" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}