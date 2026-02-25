import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/src/lib/supabase/server'
import DashboardShell from '@/src/components/admin/dashboard/DashboardShell'
import "../../../globals.css";
import type { AdminProfile } from '@/types/admin';

 export const metadata = {
   title: {
     default: 'Admin Dashboard',
     template: '%s | Admin Dashboard',
   },
   robots: {
     index: false,
     follow: false,
     googleBot: {
       index: false,
       follow: false,
     },
   },
 };

export default async function DashboardLayout({ children}: { children: React.ReactNode  }) {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

     // Fetch admin profile
  const { data: profile } = (await supabase
    .from('admin_profiles')
    .select('id, full_name, email, phone, avatar_url, role, notification_settings, created_at, updated_at')
    .eq('id', user.id)
    .single()) as { data: AdminProfile | null }


  return (

        <html lang="en">
      <body className="antialiased">
    <DashboardShell user={user} profile={profile} unreadMessages={0} pendingBookings={0}>
      {children}
    </DashboardShell>
      </body>
    </html>

  )
}