import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/src/lib/supabase/server'
import DashboardShell from '@/src/components/admin/dashboard/DashboardShell'
import "../../../globals.css";

export default async function DashboardLayout({ children , user}: { children: React.ReactNode , user?: any }) {
  const supabase = await createServerSupabaseClient()

  // const { data: { user } } = await supabase.auth.getUser()

  // if (!user) redirect('/admin/login')

  return (

        <html lang="en">
      <body className="antialiased">
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
      </body>
    </html>

  )
}