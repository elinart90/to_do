import { createClient } from '@/lib/supabase/server'
import CommandCenter from '@/components/CommandCenter'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: profile },
    { data: tasks },
    { data: habits },
    { data: goals },
    { data: todayRoutineLogs },
    { data: routines },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('tasks').select('*').eq('user_id', user!.id).neq('status', 'done'),
    supabase.from('habits').select('*').eq('user_id', user!.id),
    supabase.from('goals').select('*').eq('user_id', user!.id).eq('status', 'active'),
    supabase
      .from('routine_logs')
      .select('routine_id')
      .eq('user_id', user!.id)
      .eq('completed_date', new Date().toISOString().split('T')[0]),
    supabase.from('routines').select('*').eq('user_id', user!.id).eq('is_active', true),
  ])

  const completedToday = tasks?.filter(t => {
    const today = new Date().toISOString().split('T')[0]
    return t.completed_at?.startsWith(today)
  }).length ?? 0

  const totalTasks = (tasks?.length ?? 0) + completedToday
  const dailyScore = totalTasks === 0 ? 0 : Math.round((completedToday / totalTasks) * 100)

  return (
    <CommandCenter
      profile={profile}
      openTasks={tasks ?? []}
      habits={habits ?? []}
      goals={goals ?? []}
      dailyScore={dailyScore}
      completedToday={completedToday}
      routines={routines ?? []}
      completedRoutineIds={(todayRoutineLogs ?? []).map((l: { routine_id: string }) => l.routine_id)}
      userEmail={user!.email ?? ''}
    />
  )
}
