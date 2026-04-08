'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, CheckSquare, Flame, Timer, Map,
  Target, Moon, BarChart2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PRIMARY_NAV = [
  { href: '/dashboard',          icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/tasks',    icon: CheckSquare,     label: 'Tasks' },
  { href: '/dashboard/habits',   icon: Flame,           label: 'Habits' },
  { href: '/dashboard/focus',    icon: Timer,           label: 'Focus' },
  { href: '/dashboard/blueprint',icon: Map,             label: 'Blueprint' },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-[#0d0d18]/90 backdrop-blur-xl border-t border-white/[0.07]" />

      <div className="relative flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        {PRIMARY_NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-0 flex-1',
                active ? 'text-indigo-400' : 'text-gray-600 active:text-gray-300'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all',
                active ? 'bg-indigo-500/20' : ''
              )}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={cn(
                'text-[10px] font-bold tracking-tight truncate',
                active ? 'text-indigo-400' : 'text-gray-600'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
