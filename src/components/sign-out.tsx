"use client";
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
export default function SignOut() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return <div className="signout"><button disabled={pending} onClick={async()=>{
    setPending(true); setError('');
    try {
      const { error } = await createClient().auth.signOut({ scope: 'local' });
      if (error) { setError('No se pudo cerrar la sesión. Inténtalo de nuevo.'); setPending(false); return; }
      window.location.assign('/login');
    } catch { setError('No se pudo cerrar la sesión. Inténtalo de nuevo.'); setPending(false); }
  }}>{pending?'Cerrando…':'Cerrar sesión'}</button><span role="status">{error}</span></div>;
}
