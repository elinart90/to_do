import { createClient } from '@/lib/supabase/server'
import GoalsClient from '@/components/GoalsClient'

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: goals }, { data: profile }] = await Promise.all([
    supabase.from('goals').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
  ])

  return <GoalsClient initialGoals={goals ?? []} profile={profile} userId={user!.id} />
}
