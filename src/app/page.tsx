import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard';
import { createClient } from '@/lib/supabase/server';
import { TASK_COLUMNS, taskErrorMessage } from '@/lib/tasks';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const supabase = await createClient();
  if (!supabase) redirect('/login');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data, error } = await supabase.from('tasks').select(TASK_COLUMNS).eq('user_id', user.id).order('created_at').order('id');
  return <Dashboard email={user.email ?? 'Cuenta personal'} userId={user.id} initialTasks={data ?? []} tasksError={error ? taskErrorMessage(error.code) : ''} />;
}
