"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
export default function LoginForm({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(''); setPending(true);
    try {
      const { error: authError } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
      if (authError) {
        setError(authError.status === 429 ? 'Demasiados intentos. Espera unos minutos y vuelve a probar.' : authError.code === 'email_not_confirmed' ? 'Tu correo todavía no está confirmado. Revisa el usuario en Supabase.' : 'No hemos podido iniciar sesión. Comprueba el correo y la contraseña de la aplicación.');
        return;
      }
      window.location.assign('/');
    } catch {
      setError('No se ha podido conectar. Comprueba tu conexión y vuelve a intentarlo.');
    } finally { setPending(false); }
  }
  return <><form className="auth-form" onSubmit={submit}><label htmlFor="email">Correo electrónico<input id="email" name="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" disabled={pending || !configured}/></label><label htmlFor="password">Contraseña de la aplicación<input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={e=>setPassword(e.target.value)} disabled={pending || !configured}/></label><div aria-live="polite">{error && <p className="auth-error" role="alert">{error}</p>}{!configured && <p className="auth-error" role="alert">Faltan las variables de conexión con Supabase. Añádelas en Vercel y vuelve a desplegar.</p>}</div><button className="primary" type="submit" disabled={pending || !configured}>{pending?'Entrando…':'Entrar a mi panel →'}</button></form><p className="muted auth-help">Esta cuenta es distinta de tu cuenta de GitHub o Supabase. Se crea en Supabase → Authentication → Users. Si no recuerdas la contraseña, puedes actualizarla desde la administración del usuario.</p></>;
}
