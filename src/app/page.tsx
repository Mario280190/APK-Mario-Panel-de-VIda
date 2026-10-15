import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard';
import { createClient } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const supabase = await createClient();
  if (!supabase) redirect('/login');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <Dashboard email={user.email ?? 'Cuenta personal'} />;
}
