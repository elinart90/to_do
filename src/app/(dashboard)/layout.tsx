import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import MobileBottomNav from '@/components/MobileBottomNav'
import NotificationInit from '@/components/NotificationInit'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      <NotificationInit />

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar userId={user.id} />
      </div>

      {/* Main content — extra bottom padding on mobile for the nav bar */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  )
}
