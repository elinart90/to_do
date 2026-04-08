'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Zap, LayoutDashboard, CheckSquare, Target, Flame,
  Moon, Timer, BarChart2, LogOut, Map
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import NotificationSettings from '@/components/NotificationSettings'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
  { href: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/dashboard/goals', icon: Target, label: 'Goals' },
  { href: '/dashboard/habits', icon: Flame, label: 'Habits' },
  { href: '/dashboard/routines', icon: Moon, label: 'Routines' },
  { href: '/dashboard/focus', icon: Timer, label: 'Focus Mode' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/blueprint', icon: Map, label: '90-Day Blueprint' },
]

export default function Sidebar({ userId }: { userId: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full border-r border-white/[0.06] bg-[#0d0d18] py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center glow-accent">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-black text-base tracking-tight text-white">Power OS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              )}
            >
              <Icon size={16} className={active ? 'text-indigo-400' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom — notifications + sign out */}
      <div className="border-t border-white/[0.06] pt-4 mt-4 space-y-1">
        <NotificationSettings userId={userId} />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
