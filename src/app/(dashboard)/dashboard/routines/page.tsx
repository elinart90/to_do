import { createClient } from '@/lib/supabase/server'
import RoutinesClient from '@/components/RoutinesClient'

export default async function RoutinesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]
  const [{ data: routines }, { data: todayLogs }] = await Promise.all([
    supabase.from('routines').select('*').eq('user_id', user!.id).order('sort_order'),
    supabase.from('routine_logs').select('routine_id').eq('user_id', user!.id).eq('completed_date', today),
  ])

  return (
    <RoutinesClient
      initialRoutines={routines ?? []}
      completedIds={(todayLogs ?? []).map((l: { routine_id: string }) => l.routine_id)}
      userId={user!.id}
      today={today}
    />
  )
}
