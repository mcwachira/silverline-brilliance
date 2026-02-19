import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/src/lib/supabase/server'
import DashboardShell from '@/src/components/admin/dashboard/DashboardShell'
import "../../../globals.css";

export default async function DashboardLayout({ children}: { children: React.ReactNode  }) {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

     // Fetch admin profile
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', user.id)
    .single()


  return (

        <html lang="en">
      <body className="antialiased">
    <DashboardShell user={user} profile={profile}>
      {children}
    </DashboardShell>
      </body>
    </html>

  )
}