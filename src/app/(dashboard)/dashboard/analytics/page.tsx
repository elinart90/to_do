import { createClient } from '@/lib/supabase/server'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]

  const [
    { data: tasks },
    { data: habitLogs },
    { data: focusSessions },
    { data: habits },
  ] = await Promise.all([
    supabase.from('tasks').select('status, completed_at, priority, category').eq('user_id', user!.id),
    supabase.from('habit_logs').select('completed_date, habit_id').eq('user_id', user!.id).gte('completed_date', thirtyDaysAgo),
    supabase.from('focus_sessions').select('duration_minutes, session_date').eq('user_id', user!.id).eq('completed', true).gte('session_date', thirtyDaysAgo),
    supabase.from('habits').select('id, title, current_streak, longest_streak, total_completions').eq('user_id', user!.id),
  ])

  const totalTasks = tasks?.length ?? 0
  const completedTasks = tasks?.filter(t => t.status === 'done').length ?? 0
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const totalFocusHours = ((focusSessions ?? []).reduce((s: number, f: { duration_minutes: number }) => s + f.duration_minutes, 0) / 60).toFixed(1)
  const topHabit = (habits ?? []).sort((a, b) => b.current_streak - a.current_streak)[0]
  const categoryBreakdown = tasks?.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + 1
    return acc
  }, {}) ?? {}

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Last 30 days of data. Track what matters.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {[
          { label: 'Tasks Done', value: completedTasks, sub: `of ${totalTasks} total`, color: 'text-green-400' },
          { label: 'Completion Rate', value: `${completionRate}%`, sub: 'all time', color: 'text-indigo-400' },
          { label: 'Focus Hours', value: totalFocusHours, sub: 'last 30 days', color: 'text-amber-400' },
          { label: 'Top Streak', value: `${topHabit?.current_streak ?? 0}d`, sub: topHabit?.title ?? '—', color: 'text-orange-400' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="glass rounded-xl p-5">
            <div className={`text-3xl font-black ${color} mb-1`}>{value}</div>
            <div className="text-sm font-medium text-gray-300">{label}</div>
            <div className="text-xs text-gray-600 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* Task Breakdown by Category */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tasks by Category</h2>
        <div className="space-y-3">
          {Object.entries(categoryBreakdown).map(([cat, count]) => {
            const pct = totalTasks > 0 ? (count / totalTasks) * 100 : 0
            const emojis: Record<string, string> = { millionaire: '💰', class: '📚', health: '💪', hustle: '⚡', personal: '🎯' }
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{emojis[cat] ?? '•'} {cat}</span>
                  <span className="text-xs text-gray-500">{count} tasks ({pct.toFixed(0)}%)</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Habit Leaderboard */}
      {(habits ?? []).length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Habit Rankings</h2>
          <div className="space-y-2">
            {[...(habits ?? [])].sort((a, b) => b.current_streak - a.current_streak).map((h, i) => (
              <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                <span className="text-xs font-black text-gray-600 w-5 text-center">#{i + 1}</span>
                <div className="flex-1">
                  <span className="text-sm text-gray-200">{h.title}</span>
                </div>
                <span className="text-xs text-orange-400 font-bold">{h.current_streak}d 🔥</span>
                <span className="text-xs text-gray-600">{h.total_completions}x done</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority breakdown */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Task Priority Split</h2>
        <div className="grid grid-cols-4 gap-3">
          {(['critical', 'high', 'medium', 'low'] as const).map(p => {
            const count = tasks?.filter(t => t.priority === p).length ?? 0
            const colors = {
              critical: 'text-red-400 border-red-500/20 bg-red-500/5',
              high: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
              medium: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
              low: 'text-gray-500 border-white/10 bg-white/[0.02]',
            }
            return (
              <div key={p} className={`rounded-xl border p-4 text-center ${colors[p]}`}>
                <div className="text-2xl font-black">{count}</div>
                <div className="text-xs mt-0.5 capitalize">{p}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
