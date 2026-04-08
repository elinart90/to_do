import { createClient } from '@/lib/supabase/server'
import FocusClient from '@/components/FocusClient'

export default async function FocusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]
  const [{ data: tasks }, { data: sessions }] = await Promise.all([
    supabase.from('tasks').select('id, title').eq('user_id', user!.id).eq('status', 'todo'),
    supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user!.id)
      .eq('session_date', today)
      .eq('completed', true),
  ])

  const totalFocusMinutes = (sessions ?? []).reduce((sum: number, s: { duration_minutes: number }) => sum + s.duration_minutes, 0)

  return (
    <FocusClient
      tasks={tasks ?? []}
      todaySessions={sessions ?? []}
      totalFocusMinutes={totalFocusMinutes}
      userId={user!.id}
    />
  )
}
