'use client'

import { useState } from 'react'
import { Plus, Trash2, TrendingUp, Trophy, DollarSign, Brain, Heart, Users, BookOpen, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'

interface Goal {
  id: string; title: string; description: string | null
  target_amount: number | null; current_amount: number
  target_date: string | null; category: string
  status: 'active' | 'completed' | 'paused'
}
interface Profile { millionaire_goal: number; current_net_worth: number }

const CATEGORIES = [
  { value: 'financial',  label: 'Financial',  icon: DollarSign, color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
  { value: 'skill',      label: 'Skill',       icon: Brain,      color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { value: 'network',    label: 'Network',     icon: Users,      color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  { value: 'health',     label: 'Health',      icon: Heart,      color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  { value: 'education',  label: 'Education',   icon: BookOpen,   color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
]

export default function GoalsClient({ initialGoals, profile, userId }: {
  initialGoals: Goal[]; profile: Profile | null; userId: string
}) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [showForm, setShowForm] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', target_amount: '', current_amount: '', category: 'financial', target_date: '' })

  const supabase = createClient()
  const netWorth = profile?.current_net_worth ?? 0
  const millGoal = profile?.millionaire_goal ?? 1_000_000
  const millProgress = Math.min(100, (netWorth / millGoal) * 100)

  async function addGoal() {
    if (!form.title.trim()) return
    const { data, error } = await supabase.from('goals').insert({
      user_id: userId, title: form.title.trim(), description: form.description || null,
      target_amount: form.target_amount ? parseInt(form.target_amount) : null,
      current_amount: parseInt(form.current_amount) || 0,
      category: form.category, target_date: form.target_date || null,
    }).select().single()
    if (!error && data) {
      setGoals(prev => [data, ...prev])
      setForm({ title: '', description: '', target_amount: '', current_amount: '', category: 'financial', target_date: '' })
      setShowForm(false)
    }
  }

  async function updateProgress(goal: Goal, amount: number) {
    const newAmount = Math.max(0, goal.current_amount + amount)
    setUpdating(goal.id)
    await supabase.from('goals').update({ current_amount: newAmount }).eq('id', goal.id)
    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, current_amount: newAmount } : g))
    setUpdating(null)
  }

  async function markCompleted(id: string) {
    await supabase.from('goals').update({ status: 'completed' }).eq('id', id)
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: 'completed' } : g))
  }

  async function deleteGoal(id: string) {
    await supabase.from('goals').delete().eq('id', id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  async function updateNetWorth(value: number) {
    await supabase.from('profiles').update({ current_net_worth: value }).eq('id', userId)
  }

  const active = goals.filter(g => g.status === 'active')
  const completed = goals.filter(g => g.status === 'completed')

  const FormContent = () => (
    <div className="space-y-4">
      <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        placeholder="Goal title — be specific and ambitious"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm" autoFocus />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Deadline</label>
          <input type="date" value={form.target_date} onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Target ($)</label>
          <input type="number" value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))}
            placeholder="10000" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Current ($)</label>
          <input type="number" value={form.current_amount} onChange={e => setForm(f => ({ ...f, current_amount: e.target.value }))}
            placeholder="0" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none" />
        </div>
      </div>
      <button onClick={addGoal} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
        Commit to This Goal
      </button>
    </div>
  )

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Goals</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">{active.length} active · {completed.length} completed</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all glow-accent">
          <Plus size={16} />
          <span className="hidden sm:inline">New Goal</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Millionaire Tracker */}
      <div className="glass-gold rounded-2xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} className="text-amber-400" />
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Millionaire Target</h2>
        </div>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-3xl md:text-4xl font-black text-amber-400">{formatCurrency(netWorth)}</span>
          <span className="text-gray-500 mb-0.5 text-sm">/ {formatCurrency(millGoal)}</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full progress-shimmer" style={{ width: `${Math.max(millProgress, 0.5)}%` }} />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-gray-500">Net worth:</span>
          <input type="number" defaultValue={netWorth} onBlur={e => updateNetWorth(parseInt(e.target.value) || 0)}
            className="w-32 px-3 py-1.5 rounded-lg bg-white/5 border border-amber-500/20 text-amber-300 text-sm focus:outline-none focus:border-amber-500" />
        </div>
      </div>

      {/* Mobile form sheet */}
      {showForm && (
        <>
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative bg-[#0d0d18] border-t border-white/[0.08] rounded-t-3xl p-5 animate-slide-up max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Goal</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500"><X size={16} /></button>
              </div>
              <FormContent />
            </div>
          </div>
          <div className="hidden md:block glass rounded-2xl p-5 border border-indigo-500/20 animate-slide-up">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Set a New Goal</h3>
            <FormContent />
          </div>
        </>
      )}

      {/* Active Goals */}
      <div className="space-y-4">
        {active.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-600">
            <Trophy size={32} className="mx-auto mb-3 opacity-30" />
            <p>No active goals. Set your first milestone to $1M.</p>
          </div>
        )}
        {active.map(goal => {
          const catConfig = CATEGORIES.find(c => c.value === goal.category)!
          const pct = goal.target_amount ? Math.min(100, (goal.current_amount / goal.target_amount) * 100) : 0
          const daysLeft = goal.target_date ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000) : null

          return (
            <div key={goal.id} className={cn('glass rounded-2xl p-4 md:p-5 border', catConfig.bg)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn('p-2 rounded-lg shrink-0', catConfig.bg)}>
                    <catConfig.icon size={15} className={catConfig.color} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{goal.title}</h3>
                    <span className={cn('text-xs font-medium', catConfig.color)}>{catConfig.label}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button onClick={() => markCompleted(goal.id)}
                    className="text-xs text-green-400 px-2 py-1 rounded-lg hover:bg-green-500/10 transition-all">✓</button>
                  <button onClick={() => deleteGoal(goal.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {goal.target_amount !== null && (
                <>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-gray-300">{formatCurrency(goal.current_amount)}</span>
                    <span className="font-bold text-white">{pct.toFixed(0)}%</span>
                    <span className="text-gray-500">{formatCurrency(goal.target_amount)}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                    <div className={cn('h-full rounded-full transition-all', catConfig.color.replace('text-', 'bg-'))}
                      style={{ width: `${Math.max(pct, 1)}%` }} />
                  </div>
                  {/* Quick update buttons — wrap on mobile */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-600">Quick:</span>
                    {[100, 500, 1000, 5000].map(amt => (
                      <button key={amt} onClick={() => updateProgress(goal, amt)} disabled={updating === goal.id}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-300 transition-all touch-manipulation">
                        +{formatCurrency(amt)}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {daysLeft !== null && (
                <p className={cn('text-xs mt-2', daysLeft < 7 ? 'text-red-400' : 'text-gray-600')}>
                  {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {completed.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Completed Goals 🏆</h2>
          <div className="space-y-2">
            {completed.map(goal => (
              <div key={goal.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 opacity-60">
                <Trophy size={14} className="text-amber-400 shrink-0" />
                <span className="text-sm text-gray-400 line-through flex-1 min-w-0 truncate">{goal.title}</span>
                <button onClick={() => deleteGoal(goal.id)} className="text-gray-700 hover:text-red-400 shrink-0"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
