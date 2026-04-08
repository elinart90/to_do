import { createClient } from '@/lib/supabase/server'
import HabitsClient from '@/components/HabitsClient'

export default async function HabitsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]
  const [{ data: habits }, { data: todayLogs }] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('habit_logs').select('habit_id').eq('user_id', user!.id).eq('completed_date', today),
  ])

  return (
    <HabitsClient
      initialHabits={habits ?? []}
      completedHabitIds={(todayLogs ?? []).map((l: { habit_id: string }) => l.habit_id)}
      userId={user!.id}
      today={today}
    />
  )
}
