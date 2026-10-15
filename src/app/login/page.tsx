import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LoginForm from './login-form';
export const dynamic = 'force-dynamic';
export default async function LoginPage() {
  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect('/');
  }
  return <div className="auth-shell"><div className="auth-intro"><a className="brand" href="/">◈ <span>panel de vida<small>EL ESPACIO DE MARIO</small></span></a><div><p className="eyebrow">MENOS RUIDO. MÁS CLARIDAD.</p><h1>Un espacio para<br/>lo que importa.</h1><p>Tu día, tus contratos y las decisiones pendientes.<br/>Todo empieza con un poco de orden.</p></div><span>Tu espacio personal, a tu ritmo.</span></div><main className="auth-main"><section className="card auth-card"><span className="tag">Acceso personal</span><h1>Bienvenido.</h1><p className="muted">Entra con el usuario creado para esta aplicación.</p><LoginForm configured={!!supabase}/></section><p className="auth-caption">El panel sigue en construcción. Los contratos y las conexiones se añadirán en los próximos pasos.</p></main></div>;
}
