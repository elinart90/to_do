'use client'

import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Sun, Moon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Routine {
  id: string; type: 'morning' | 'night'; title: string
  duration_minutes: number; sort_order: number; is_active: boolean
}

const MORNING_DEFAULTS = [
  { title: 'Drink 500ml water immediately',     duration_minutes: 1 },
  { title: 'Review today\'s top 3 priorities',  duration_minutes: 5 },
  { title: 'Quick meditation / breathwork',      duration_minutes: 5 },
  { title: 'Cold shower',                        duration_minutes: 5 },
  { title: 'Set intentions for the day',         duration_minutes: 3 },
]
const NIGHT_DEFAULTS = [
  { title: 'Review what you accomplished today', duration_minutes: 5 },
  { title: 'Plan tomorrow\'s top 3 tasks',        duration_minutes: 5 },
  { title: 'Read (not scrolling) for 15 mins',   duration_minutes: 15 },
  { title: 'Gratitude — 3 wins from today',      duration_minutes: 3 },
  { title: 'Phone face down, screen off by 2am', duration_minutes: 1 },
]

export default function RoutinesClient({ initialRoutines, completedIds, userId, today }: {
  initialRoutines: Routine[]; completedIds: string[]; userId: string; today: string
}) {
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines)
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedIds))
  const [showAddForm, setShowAddForm] = useState<'morning' | 'night' | null>(null)
  const [form, setForm] = useState({ title: '', duration_minutes: '5', type: 'morning' as 'morning' | 'night' })

  const supabase = createClient()

  const morning = routines.filter(r => r.type === 'morning' && r.is_active).sort((a, b) => a.sort_order - b.sort_order)
  const night   = routines.filter(r => r.type === 'night'   && r.is_active).sort((a, b) => a.sort_order - b.sort_order)
  const morningDone = morning.filter(r => completed.has(r.id)).length
  const nightDone   = night.filter(r => completed.has(r.id)).length
  const morningTime = morning.reduce((s, r) => s + r.duration_minutes, 0)
  const nightTime   = night.reduce((s, r) => s + r.duration_minutes, 0)

  async function toggleRoutine(routine: Routine) {
    if (completed.has(routine.id)) {
      await supabase.from('routine_logs').delete().eq('routine_id', routine.id).eq('completed_date', today)
      setCompleted(prev => { const s = new Set(prev); s.delete(routine.id); return s })
    } else {
      const { error } = await supabase.from('routine_logs').insert({ routine_id: routine.id, user_id: userId, completed_date: today })
      if (!error) setCompleted(prev => new Set([...prev, routine.id]))
    }
  }

  async function addRoutine() {
    if (!form.title.trim()) return
    const type = showAddForm ?? 'morning'
    const existing = routines.filter(r => r.type === type)
    const { data, error } = await supabase.from('routines').insert({
      user_id: userId, type, title: form.title.trim(),
      duration_minutes: parseInt(form.duration_minutes) || 5,
      sort_order: existing.length,
    }).select().single()
    if (!error && data) { setRoutines(prev => [...prev, data]); setForm({ title: '', duration_minutes: '5', type }); setShowAddForm(null) }
  }

  async function seedDefaults(type: 'morning' | 'night') {
    const defaults = type === 'morning' ? MORNING_DEFAULTS : NIGHT_DEFAULTS
    const existing = routines.filter(r => r.type === type)
    const rows = defaults.map((d, i) => ({ user_id: userId, type, title: d.title, duration_minutes: d.duration_minutes, sort_order: existing.length + i }))
    const { data, error } = await supabase.from('routines').insert(rows).select()
    if (!error && data) setRoutines(prev => [...prev, ...data])
  }

  async function deleteRoutine(id: string) {
    await supabase.from('routines').delete().eq('id', id)
    setRoutines(prev => prev.filter(r => r.id !== id))
    setCompleted(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  function RoutineSection({ type, items, doneCount, totalTime }: {
    type: 'morning' | 'night'; items: Routine[]; doneCount: number; totalTime: number
  }) {
    const isMorning = type === 'morning'
    const Icon = isMorning ? Sun : Moon
    const color = isMorning ? 'text-amber-400' : 'text-indigo-400'
    const barColor = isMorning ? 'bg-amber-500' : 'bg-indigo-500'
    const pct = items.length > 0 ? (doneCount / items.length) * 100 : 0

    return (
      <div className="glass rounded-2xl p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-xl', isMorning ? 'bg-amber-500/10' : 'bg-indigo-500/10')}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <h2 className="font-black text-white text-sm md:text-base">{isMorning ? 'Battle Station' : 'Wind-Down'}</h2>
              <p className="text-xs text-gray-500">{isMorning ? '6:00 AM' : 'Before 2:00 AM'} · {totalTime} min</p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-xl font-black', color)}>{doneCount}/{items.length}</div>
            <div className="text-xs text-gray-600">done</div>
          </div>
        </div>

        {items.length > 0 && (
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all duration-500', barColor)} style={{ width: `${pct}%` }} />
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-gray-600 mb-3">No {type} routine set yet.</p>
            <button onClick={() => seedDefaults(type)} className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-all touch-manipulation">
              Load {isMorning ? 'Morning' : 'Night'} Defaults
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(routine => {
              const isDone = completed.has(routine.id)
              return (
                <div key={routine.id} onClick={() => toggleRoutine(routine)}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer touch-manipulation',
                    isDone ? 'border-green-500/15 bg-green-500/5' : 'border-white/[0.07] bg-white/[0.02] active:bg-white/[0.05]'
                  )}>
                  {isDone
                    ? <CheckCircle2 size={20} className="text-green-400 shrink-0" />
                    : <Circle size={20} className="text-gray-600 shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium', isDone ? 'text-gray-500 line-through' : 'text-gray-200')}>
                      {routine.title}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 shrink-0">{routine.duration_minutes}m</span>
                  <button onClick={e => { e.stopPropagation(); deleteRoutine(routine.id) }}
                    className="shrink-0 text-gray-700 hover:text-red-400 transition-colors p-1 touch-manipulation">
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {showAddForm === type ? (
          <div className="flex gap-2 animate-slide-up">
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Routine step..." autoFocus onKeyDown={e => e.key === 'Enter' && addRoutine()}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600" />
            <input type="number" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
              className="w-14 px-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none text-center" min={1} />
            <button onClick={addRoutine} className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shrink-0">Add</button>
            <button onClick={() => setShowAddForm(null)} className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm shrink-0">✕</button>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(type)} className="flex items-center gap-2 text-xs text-gray-500 hover:text-indigo-400 transition-colors touch-manipulation py-1">
            <Plus size={13} /> Add step
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Smart Routines</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5">Discipline is your competitive advantage. Every single day.</p>
      </div>
      <RoutineSection type="morning" items={morning} doneCount={morningDone} totalTime={morningTime} />
      <RoutineSection type="night"   items={night}   doneCount={nightDone}   totalTime={nightTime} />
    </div>
  )
}
