'use client'

import { Flame, Target, CheckSquare, Zap, TrendingUp, Clock, Trophy } from 'lucide-react'
import { formatCurrency, getGreeting } from '@/lib/utils'

interface Task { id: string; title: string; priority: string; due_date: string | null; category: string }
interface Habit { id: string; title: string; current_streak: number; icon: string }
interface Goal { id: string; title: string; target_amount: number | null; current_amount: number; category: string }
interface Routine { id: string; title: string; type: string; duration_minutes: number }
interface Profile {
  millionaire_goal: number
  current_net_worth: number
  discipline_score: number
  longest_streak: number
}

interface Props {
  profile: Profile | null
  openTasks: Task[]
  habits: Habit[]
  goals: Goal[]
  dailyScore: number
  completedToday: number
  routines: Routine[]
  completedRoutineIds: string[]
  userEmail: string
}

const priorityColor: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-gray-500 bg-white/5 border-white/10',
}

export default function CommandCenter({
  profile, openTasks, habits, goals, dailyScore,
  completedToday, routines, completedRoutineIds, userEmail,
}: Props) {
  const netWorth = profile?.current_net_worth ?? 0
  const millionaireGoal = profile?.millionaire_goal ?? 1_000_000
  const millionaireProgress = Math.min(100, (netWorth / millionaireGoal) * 100)
  const topStreak = habits.reduce((max, h) => Math.max(max, h.current_streak), 0)
  const morningRoutines = routines.filter(r => r.type === 'morning')
  const nightRoutines = routines.filter(r => r.type === 'night')
  const morningDone = morningRoutines.filter(r => completedRoutineIds.includes(r.id)).length
  const nightDone = nightRoutines.filter(r => completedRoutineIds.includes(r.id)).length

  const criticalTasks = openTasks
    .filter(t => t.priority === 'critical' || t.priority === 'high')
    .slice(0, 4)

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const daysLeft = 365 - dayOfYear

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
            {getGreeting()}
          </p>
          <h1 className="text-xl md:text-2xl font-black text-white">
            {userEmail.split('@')[0]}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Day {dayOfYear} · {daysLeft} days left to make history.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-white">{dailyScore}%</div>
          <div className="text-xs text-gray-500">Daily Score</div>
        </div>
      </div>

      {/* Millionaire Progress — HERO */}
      <div className="glass-gold rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Millionaire Progress</span>
          </div>
          <span className="text-xs text-gray-500">{millionaireProgress.toFixed(2)}%</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl md:text-4xl font-black text-amber-400 text-gold-glow">
            {formatCurrency(netWorth)}
          </span>
          <span className="text-gray-500 text-sm mb-0.5">/ {formatCurrency(millionaireGoal)}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full progress-shimmer transition-all duration-1000"
            style={{ width: `${Math.max(millionaireProgress, 1)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Gap: {formatCurrency(millionaireGoal - netWorth)} remaining
        </p>
      </div>

      {/* Stat Cards — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {[
          { icon: CheckSquare, value: completedToday, label: 'Done Today',   color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
          { icon: Flame,       value: topStreak,       label: 'Top Streak',  color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
          { icon: Target,      value: goals.length,    label: 'Active Goals', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { icon: Zap,         value: openTasks.length, label: 'Open Tasks', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map(({ icon: Icon, value, label, color, bg }) => (
          <div key={label} className={`glass rounded-xl p-3 md:p-4 border ${bg}`}>
            <Icon size={16} className={`${color} mb-1.5`} />
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Fire Tasks + Routines — stack on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Priority Tasks */}
        <div className="glass rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap size={13} className="text-red-400" /> Fire Tasks
            </h2>
            <a href="/dashboard/tasks" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all →
            </a>
          </div>
          {criticalTasks.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-4">
              No critical tasks. Crushed it or haven&apos;t planned yet.
            </p>
          ) : (
            <div className="space-y-2">
              {criticalTasks.map(task => (
                <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border ${priorityColor[task.priority]}`}>
                  <span className="text-xs font-bold uppercase shrink-0">{task.priority[0]}</span>
                  <span className="text-sm text-gray-200 flex-1 min-w-0 truncate">{task.title}</span>
                  {task.due_date && (
                    <span className="text-xs text-gray-600 shrink-0">
                      {new Date(task.due_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Routines */}
        <div className="glass rounded-2xl p-4 md:p-5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock size={13} className="text-indigo-400" /> Today&apos;s Routines
          </h2>
          <div className="space-y-3">
            {[
              { emoji: '☀️', label: 'Morning (6am)', done: morningDone, total: morningRoutines.length, color: 'bg-amber-500' },
              { emoji: '🌙', label: 'Night (before 2am)', done: nightDone, total: nightRoutines.length, color: 'bg-indigo-500' },
            ].map(({ emoji, label, done, total, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{emoji}</span>
                    <span className="text-sm text-gray-300">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${done === total && total > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                    {done}/{total}
                  </span>
                </div>
                {total > 0 && (
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
                  </div>
                )}
              </div>
            ))}
            <a href="/dashboard/routines" className="block text-center text-xs text-indigo-400 hover:text-indigo-300 pt-1">
              Manage routines →
            </a>
          </div>
        </div>
      </div>

      {/* Habit Streaks */}
      {habits.length > 0 && (
        <div className="glass rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flame size={13} className="text-orange-400" /> Habit Streaks
            </h2>
            <a href="/dashboard/habits" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</a>
          </div>
          {/* Horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {habits.slice(0, 8).map(habit => (
              <div key={habit.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <span className="text-base">{habit.icon}</span>
                <div>
                  <div className="text-xs text-gray-300 font-medium whitespace-nowrap">{habit.title}</div>
                  <div className="text-xs text-orange-400 font-bold">{habit.current_streak}d 🔥</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals */}
      {goals.length > 0 && (
        <div className="glass rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={13} className="text-indigo-400" /> Active Goals
            </h2>
            <a href="/dashboard/goals" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</a>
          </div>
          <div className="space-y-3">
            {goals.slice(0, 3).map(goal => {
              const pct = goal.target_amount ? Math.min(100, (goal.current_amount / goal.target_amount) * 100) : 0
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 font-medium truncate">{goal.title}</span>
                    <span className="text-xs text-gray-500 ml-2 shrink-0">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${Math.max(pct, 1)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
