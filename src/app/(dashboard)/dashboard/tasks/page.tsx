import { createClient } from '@/lib/supabase/server'
import TasksClient from '@/components/TasksClient'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user!.id)
    .is('parent_task_id', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  return <TasksClient initialTasks={tasks ?? []} userId={user!.id} />
}
