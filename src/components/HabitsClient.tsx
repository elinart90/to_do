'use client'

import { useState } from 'react'
import { Plus, Trash2, Flame, CheckCircle2, Circle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Habit {
  id: string; title: string; description: string | null
  frequency: string; category: string
  current_streak: number; longest_streak: number
  total_completions: number; color: string; icon: string
}

const ICONS = ['⚡','💪','📚','🧠','💰','🔥','🎯','🏃','🧘','💊','📖','✍️','🌅','🥗','💤']
const DEFAULT_HABITS = [
  { title: 'Review daily goals',             icon: '🎯', category: 'morning' },
  { title: 'Exercise / workout',             icon: '💪', category: 'anytime' },
  { title: 'Read 30 minutes',                icon: '📚', category: 'anytime' },
  { title: 'No social media before noon',    icon: '⚡', category: 'morning' },
  { title: 'Review progress before sleep',   icon: '🧠', category: 'evening' },
]

export default function HabitsClient({ initialHabits, completedHabitIds, userId, today }: {
  initialHabits: Habit[]; completedHabitIds: string[]; userId: string; today: string
}) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedHabitIds))
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', icon: '⚡', category: 'anytime', frequency: 'daily' })

  const supabase = createClient()

  async function toggleHabit(habit: Habit) {
    const isCompleted = completed.has(habit.id)
    if (isCompleted) {
      await supabase.from('habit_logs').delete().eq('habit_id', habit.id).eq('completed_date', today)
      const newStreak = Math.max(0, habit.current_streak - 1)
      await supabase.from('habits').update({ current_streak: newStreak, total_completions: Math.max(0, habit.total_completions - 1) }).eq('id', habit.id)
      setCompleted(prev => { const s = new Set(prev); s.delete(habit.id); return s })
      setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, current_streak: newStreak } : h))
    } else {
      const { error } = await supabase.from('habit_logs').insert({ habit_id: habit.id, user_id: userId, completed_date: today })
      if (!error) {
        const newStreak = habit.current_streak + 1
        const newLongest = Math.max(habit.longest_streak, newStreak)
        await supabase.from('habits').update({ current_streak: newStreak, longest_streak: newLongest, total_completions: habit.total_completions + 1 }).eq('id', habit.id)
        setCompleted(prev => new Set([...prev, habit.id]))
        setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, current_streak: newStreak, longest_streak: newLongest } : h))
      }
    }
  }

  async function addHabit() {
    if (!form.title.trim()) return
    const { data, error } = await supabase.from('habits').insert({ user_id: userId, title: form.title.trim(), icon: form.icon, category: form.category, frequency: form.frequency }).select().single()
    if (!error && data) { setHabits(prev => [data, ...prev]); setForm({ title: '', icon: '⚡', category: 'anytime', frequency: 'daily' }); setShowForm(false) }
  }

  async function addDefaultHabit(h: typeof DEFAULT_HABITS[0]) {
    const { data, error } = await supabase.from('habits').insert({ user_id: userId, title: h.title, icon: h.icon, category: h.category, frequency: 'daily' }).select().single()
    if (!error && data) setHabits(prev => [data, ...prev])
  }

  async function deleteHabit(id: string) {
    await supabase.from('habits').delete().eq('id', id)
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const doneCount = habits.filter(h => completed.has(h.id)).length
  const totalScore = habits.length > 0 ? Math.round((doneCount / habits.length) * 100) : 0
  const morning = habits.filter(h => h.category === 'morning')
  const evening = habits.filter(h => h.category === 'evening')
  const anytime = habits.filter(h => h.category === 'anytime')

  const FormContent = () => (
    <div className="space-y-4">
      <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="Habit name — what will you do daily?"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm" autoFocus />
      <div>
        <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Icon</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map(icon => (
            <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))}
              className={cn('w-10 h-10 rounded-lg text-lg transition-all touch-manipulation',
                form.icon === icon ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-white/5 hover:bg-white/10')}>
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none">
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="anytime">Anytime</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Frequency</label>
          <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none">
            <option value="daily">Daily</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
      <button onClick={addHabit} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
        Build This Habit
      </button>
    </div>
  )

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Habits</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">{doneCount}/{habits.length} done today · Score: {totalScore}%</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all glow-accent">
          <Plus size={16} />
          <span className="hidden sm:inline">Add Habit</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Score Bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-bold text-white">Today&apos;s Discipline Score</span>
          </div>
          <span className="text-xl font-black text-orange-400">{totalScore}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500" style={{ width: `${totalScore}%` }} />
        </div>
      </div>

      {/* Mobile form sheet */}
      {showForm && (
        <>
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative bg-[#0d0d18] border-t border-white/[0.08] rounded-t-3xl p-5 animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Habit</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500"><X size={16} /></button>
              </div>
              <FormContent />
            </div>
          </div>
          <div className="hidden md:block glass rounded-2xl p-5 border border-indigo-500/20 animate-slide-up">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">New Habit</h3>
            <FormContent />
          </div>
        </>
      )}

      {/* Default habits seed */}
      {habits.length === 0 && (
        <div className="glass rounded-2xl p-4 md:p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-3">Quick Start — Millionaire Habits:</h3>
          <div className="space-y-2">
            {DEFAULT_HABITS.map(h => (
              <button key={h.title} onClick={() => addDefaultHabit(h)}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-all text-left touch-manipulation">
                <span className="text-xl">{h.icon}</span>
                <span className="text-sm text-gray-300 flex-1">{h.title}</span>
                <Plus size={14} className="text-indigo-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Habit Groups */}
      {[
        { label: '☀️ Morning', items: morning },
        { label: '🌙 Evening', items: evening },
        { label: '⚡ Anytime', items: anytime },
      ].map(({ label, items }) => {
        if (items.length === 0) return null
        return (
          <div key={label}>
            <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">{label}</h2>
            <div className="space-y-2">
              {items.map(habit => {
                const isDone = completed.has(habit.id)
                return (
                  <div key={habit.id} className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border transition-all',
                    isDone ? 'border-green-500/20 bg-green-500/5' : 'border-white/10 bg-white/[0.03]'
                  )}>
                    <button onClick={() => toggleHabit(habit)} className="shrink-0 touch-manipulation">
                      {isDone ? <CheckCircle2 size={22} className="text-green-400" /> : <Circle size={22} className="text-gray-600" />}
                    </button>
                    <span className="text-xl shrink-0">{habit.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium truncate', isDone ? 'text-gray-500 line-through' : 'text-gray-200')}>
                        {habit.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Flame size={11} className="text-orange-400" />
                        <span className="text-xs text-orange-400 font-bold">{habit.current_streak}d</span>
                        {habit.longest_streak > 0 && <span className="text-xs text-gray-600 hidden sm:inline">· best: {habit.longest_streak}d</span>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 shrink-0 hidden sm:block">{habit.total_completions}x</div>
                    <button onClick={() => deleteHabit(habit.id)} className="shrink-0 text-gray-600 hover:text-red-400 transition-colors touch-manipulation p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
