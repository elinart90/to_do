'use client'

import { useState } from 'react'
import { Plus, CheckCircle2, Circle, Trash2, AlertCircle, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description: string | null
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: string
  status: 'todo' | 'in_progress' | 'done'
  due_date: string | null
  completed_at: string | null
  created_at: string
}

const PRIORITIES = ['critical', 'high', 'medium', 'low'] as const
const CATEGORIES = ['millionaire', 'class', 'health', 'hustle', 'personal'] as const

const priorityConfig = {
  critical: { label: 'Critical', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30',    dot: 'bg-red-500' },
  high:     { label: 'High',     color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', dot: 'bg-orange-500' },
  medium:   { label: 'Medium',   color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/30',  dot: 'bg-amber-500' },
  low:      { label: 'Low',      color: 'text-gray-500',   bg: 'bg-white/5 border-white/10',           dot: 'bg-gray-600' },
}

const categoryEmoji: Record<string, string> = {
  millionaire: '💰', class: '📚', health: '💪', hustle: '⚡', personal: '🎯',
}

interface Props { initialTasks: Task[]; userId: string }

export default function TasksClient({ initialTasks, userId }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)

  const [form, setForm] = useState({
    title: '', description: '', priority: 'high' as Task['priority'],
    category: 'millionaire' as string, due_date: '',
  })

  const supabase = createClient()

  const filtered = tasks.filter(t => {
    if (filter !== 'all' && t.status !== filter) return false
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    return true
  })

  const grouped = {
    critical: filtered.filter(t => t.priority === 'critical'),
    high:     filtered.filter(t => t.priority === 'high'),
    medium:   filtered.filter(t => t.priority === 'medium'),
    low:      filtered.filter(t => t.priority === 'low'),
  }

  async function addTask() {
    if (!form.title.trim()) return
    const { data, error } = await supabase.from('tasks').insert({
      user_id: userId,
      title: form.title.trim(),
      description: form.description || null,
      priority: form.priority,
      category: form.category,
      due_date: form.due_date || null,
      status: 'todo' as const,
    }).select().single()
    if (!error && data) {
      setTasks(prev => [data, ...prev])
      setForm({ title: '', description: '', priority: 'high', category: 'millionaire', due_date: '' })
      setShowAddForm(false)
    }
  }

  async function toggleTask(task: Task) {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    const updates = { status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : null }
    await supabase.from('tasks').update(updates).eq('id', task.id)
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...updates } : t))
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const todayCount = tasks.filter(t => t.completed_at?.startsWith(new Date().toISOString().split('T')[0])).length

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Task Engine</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            {todayCount} crushed · {tasks.filter(t => t.status !== 'done').length} remaining
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(v => !v)}
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all glow-accent"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Add Task Form — full-screen modal on mobile */}
      {showAddForm && (
        <>
          {/* Mobile: slide-up sheet */}
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
            <div className="relative bg-[#0d0d18] border-t border-white/[0.08] rounded-t-3xl p-5 space-y-4 animate-slide-up">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Task</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500">
                  <X size={16} />
                </button>
              </div>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="What must be done? Be specific."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm"
                autoFocus
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{categoryEmoji[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <button onClick={addTask} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
                Lock It In
              </button>
            </div>
          </div>

          {/* Desktop: inline form */}
          <div className="hidden md:block glass rounded-2xl p-5 border border-indigo-500/20 animate-slide-up space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Task</h3>
            <input
              type="text" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="What must be done? Be specific."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm"
              autoFocus onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Details (optional)" rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm resize-none" />
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500">
                  {CATEGORIES.map(c => <option key={c} value={c}>{categoryEmoji[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex items-end">
                <button onClick={addTask} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
                  Lock It In
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Filters — horizontally scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 min-w-max md:flex-wrap md:min-w-0">
          {(['all', 'todo', 'in_progress', 'done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                filter === f ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10')}>
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <div className="w-px bg-white/10 mx-0.5 shrink-0" />
          {(['all', ...PRIORITIES] as const).map(p => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap',
                priorityFilter === p ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10')}>
              {p === 'all' ? 'All Priority' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task Groups */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <AlertCircle size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No tasks match this filter.</p>
          <p className="text-sm mt-1">Add your first task and start dominating.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {(Object.entries(grouped) as [Task['priority'], Task[]][]).map(([priority, items]) => {
            if (items.length === 0) return null
            const cfg = priorityConfig[priority]
            return (
              <div key={priority}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                  <span className={cn('text-xs font-bold uppercase tracking-wider', cfg.color)}>{cfg.label} Priority</span>
                  <span className="text-xs text-gray-600">({items.length})</span>
                </div>
                <div className="space-y-2">
                  {items.map(task => (
                    <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task)} onDelete={() => deleteTask(task.id)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  const done = task.status === 'done'
  const isOverdue = task.due_date && !done && new Date(task.due_date) < new Date()

  return (
    <div className={cn(
      'flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200',
      done ? 'border-white/5 bg-white/[0.02] opacity-50' : 'border-white/10 bg-white/[0.03] hover:border-indigo-500/30'
    )}>
      <button onClick={onToggle} className="shrink-0 text-gray-500 hover:text-green-400 transition-colors touch-manipulation">
        {done ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} />}
      </button>

      <span className="text-base shrink-0">{({'millionaire':'💰','class':'📚','health':'💪','hustle':'⚡','personal':'🎯'} as Record<string,string>)[task.category] ?? '•'}</span>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', done ? 'line-through text-gray-600' : 'text-gray-200')}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-600 truncate mt-0.5">{task.description}</p>
        )}
      </div>

      {task.due_date && (
        <span className={cn('text-xs shrink-0 px-2 py-0.5 rounded-lg hidden sm:block', isOverdue ? 'text-red-400 bg-red-500/10' : 'text-gray-500 bg-white/5')}>
          {isOverdue ? '⚠ ' : ''}{new Date(task.due_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </span>
      )}

      {/* Delete — always visible on mobile (no hover), hover-only on desktop */}
      <button
        onClick={onDelete}
        className="shrink-0 text-gray-600 hover:text-red-400 transition-colors md:opacity-0 md:group-hover:opacity-100 touch-manipulation"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
