'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Timer, Brain, Coffee, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { notifyPomodoroComplete } from '@/lib/push-client'

interface Task { id: string; title: string }
interface Session { id: string; duration_minutes: number; task_id: string | null }

const MODES = [
  { key: 'focus', label: 'Deep Work', minutes: 25, icon: Brain, color: 'text-indigo-400', bg: 'bg-indigo-500' },
  { key: 'short', label: 'Short Break', minutes: 5, icon: Coffee, color: 'text-green-400', bg: 'bg-green-500' },
  { key: 'long', label: 'Long Break', minutes: 15, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500' },
] as const

type ModeKey = typeof MODES[number]['key']

export default function FocusClient({ tasks, todaySessions, totalFocusMinutes, userId }: {
  tasks: Task[]
  todaySessions: Session[]
  totalFocusMinutes: number
  userId: string
}) {
  const [mode, setMode] = useState<ModeKey>('focus')
  const [selectedTask, setSelectedTask] = useState<string>('')
  const [sessions, setSessions] = useState<Session[]>(todaySessions)
  const [focusMinutes, setFocusMinutes] = useState(totalFocusMinutes)

  const modeConfig = MODES.find(m => m.key === mode)!
  const [seconds, setSeconds] = useState(modeConfig.minutes * 60)
  const [running, setRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(
    todaySessions.filter(s => s.duration_minutes >= 25).length
  )

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startSecondsRef = useRef(modeConfig.minutes * 60)
  const supabase = createClient()

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  const handleComplete = useCallback(async () => {
    stopTimer()
    if (mode === 'focus') {
      const dur = modeConfig.minutes
      const { data } = await supabase.from('focus_sessions').insert({
        user_id: userId,
        task_id: selectedTask || null,
        duration_minutes: dur,
        completed: true,
        session_date: new Date().toISOString().split('T')[0],
      }).select().single()
      if (data) {
        setSessions(prev => [...prev, data])
        setFocusMinutes(prev => prev + dur)
        setSessionCount(prev => {
          const next = prev + 1
          // Fire browser notification for Pomodoro completion
          notifyPomodoroComplete(next)
          return next
        })
      }
    }
    setSeconds(modeConfig.minutes * 60)
  }, [mode, modeConfig.minutes, selectedTask, userId, supabase, stopTimer])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            handleComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, handleComplete])

  function switchMode(m: ModeKey) {
    stopTimer()
    setMode(m)
    const cfg = MODES.find(x => x.key === m)!
    setSeconds(cfg.minutes * 60)
    startSecondsRef.current = cfg.minutes * 60
  }

  function reset() {
    stopTimer()
    setSeconds(modeConfig.minutes * 60)
  }

  const totalSecs = modeConfig.minutes * 60
  const pct = ((totalSecs - seconds) / totalSecs) * 100
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const circumference = 2 * Math.PI * 120

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Focus Mode</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {sessionCount} sessions · {focusMinutes} min focused today
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2">
        {MODES.map(m => (
          <button
            key={m.key}
            onClick={() => switchMode(m.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
              mode === m.key
                ? `${m.bg} text-white`
                : 'bg-white/5 text-gray-500 hover:bg-white/10'
            )}
          >
            <m.icon size={14} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="flex flex-col items-center py-4 md:py-6">
        <div className="relative w-52 h-52 md:w-64 md:h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128" cy="128" r="120"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            <circle
              cx="128" cy="128" r="120"
              fill="none"
              stroke={mode === 'focus' ? '#6366f1' : mode === 'short' ? '#10b981' : '#f59e0b'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (pct / 100) * circumference}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl md:text-5xl font-black text-white tabular-nums">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className={cn('text-sm font-semibold mt-1', modeConfig.color)}>
              {modeConfig.label}
            </span>
            {running && (
              <span className="text-xs text-gray-600 mt-1 animate-pulse-glow">● LOCKED IN</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={reset}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-all"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setRunning(v => !v)}
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center transition-all text-white font-bold text-lg glow-accent',
              running ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'
            )}
          >
            {running ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <div className="w-12 h-12" />
        </div>
      </div>

      {/* Task Link */}
      {mode === 'focus' && tasks.length > 0 && (
        <div className="glass rounded-xl p-4">
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
            What are you working on?
          </label>
          <select
            value={selectedTask}
            onChange={e => setSelectedTask(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="">— Select a task (optional) —</option>
            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sessions', value: sessionCount, color: 'text-indigo-400' },
          { label: 'Minutes', value: focusMinutes, color: 'text-green-400' },
          { label: 'Hours', value: (focusMinutes / 60).toFixed(1), color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass rounded-xl p-4 text-center">
            <div className={cn('text-2xl font-black', color)}>{value}</div>
            <div className="text-xs text-gray-600 mt-0.5">{label} Today</div>
          </div>
        ))}
      </div>

      {/* Tips for Choleric */}
      <div className="glass rounded-xl p-4 border border-indigo-500/10">
        <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">Grind tip</p>
        <p className="text-sm text-gray-400">
          {mode === 'focus'
            ? 'Phone in another room. One task. No mercy. That\'s how empires are built.'
            : mode === 'short'
            ? 'Stand up, breathe, hydrate. You earned it. Back in 5.'
            : 'Real rest = real output. 15 minutes. Your brain is recharging for the next battle.'
          }
        </p>
      </div>
    </div>
  )
}
