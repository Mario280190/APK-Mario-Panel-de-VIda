"use client";
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TASK_COLUMNS, taskErrorMessage, type Task } from '@/lib/tasks';
export default function Tasks({ initialTasks, initialError, userId }: { initialTasks: Task[]; initialError: string; userId: string }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [text, setText] = useState('');
  const [error, setError] = useState(initialError);
  const [loadError, setLoadError] = useState(!!initialError);
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  const locked = useRef(false);
  async function run(operation: () => Promise<void>) {
    if (locked.current) return;
    locked.current = true; setPending(true); setError(''); setStatus('');
    try { await operation(); }
    catch { setError('No se pudo completar la operación. Comprueba la conexión y vuelve a intentarlo.'); }
    finally { locked.current = false; setPending(false); }
  }
  async function refresh() {
    await run(async()=>{
      const {data,error} = await createClient().from('tasks').select(TASK_COLUMNS).eq('user_id',userId).order('created_at').order('id');
      if(error) { setError(taskErrorMessage(error.code)); setLoadError(true); return; }
      setTasks(data ?? []); setLoadError(false); setStatus('Lista actualizada.');
    });
  }
  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if(!value || [...value].length>160) { setError('Escribe una tarea de entre 1 y 160 caracteres.'); return; }
    await run(async()=>{
      const {data,error} = await createClient().from('tasks').insert({text:value,user_id:userId}).select(TASK_COLUMNS).single();
      if(error) { setError('No se ha guardado la tarea. '+taskErrorMessage(error.code)); return; }
      setTasks(current=>[...current,data]); setText(''); setStatus('Tarea guardada.');
    });
  }
  async function toggle(task: Task) {
    await run(async()=>{
      const {data,error} = await createClient().from('tasks').update({done:!task.done}).eq('id',task.id).eq('user_id',userId).select(TASK_COLUMNS).maybeSingle();
      if(error || !data) { setError('No se ha podido actualizar la tarea. Pulsa Actualizar para comprobar su estado.'); return; }
      setTasks(current=>current.map(t=>t.id===data.id?data:t)); setStatus(data.done?'Tarea completada.':'Tarea marcada como pendiente.');
    });
  }
  async function remove(task: Task) {
    if(!window.confirm('¿Eliminar esta tarea?')) return;
    await run(async()=>{
      const {data,error} = await createClient().from('tasks').delete().eq('id',task.id).eq('user_id',userId).select('id').maybeSingle();
      if(error || !data) { setError('No se ha podido eliminar la tarea. Pulsa Actualizar para comprobar su estado.'); return; }
      setTasks(current=>current.filter(t=>t.id!==task.id)); setStatus('Tarea eliminada.');
    });
  }
  const remaining=tasks.filter(t=>!t.done).length;
  return <section className="card tasks" aria-busy={pending}>
    <div className="card-title"><h2>Tus próximos pasos</h2><button className="refresh-tasks" onClick={refresh} disabled={pending}>Actualizar</button></div>
    <p className="muted">{loadError?'Tus tareas todavía no están disponibles.':`${remaining} ${remaining===1?'tarea pendiente':'tareas pendientes'}. Una cosa cada vez.`}</p>
    {error&&<p className="auth-error" role="alert">{error}</p>}
    {!tasks.length&&!loadError&&<p className="tasks-empty">Todavía no tienes tareas. Añade tu primer próximo paso.</p>}
    {tasks.map(task=><div className={task.done?'task done':'task'} key={task.id}><label className="task-label"><input type="checkbox" checked={task.done} disabled={pending||loadError} onChange={()=>toggle(task)}/><span>{task.text}</span></label><button className="delete-task" disabled={pending||loadError} aria-label={`Eliminar tarea: ${task.text}`} onClick={()=>remove(task)}>Eliminar</button></div>)}
    <form onSubmit={add}><input aria-label="Nueva tarea" value={text} onChange={e=>setText(e.target.value)} placeholder="Añade un próximo paso…" maxLength={160} disabled={pending||loadError} required/><button className="primary" disabled={pending||loadError||!text.trim()}>{pending?'Guardando…':'Añadir'}</button></form>
    <small className="muted">{loadError?'Activa la tabla para empezar.':'Guardadas en tu cuenta. En otro dispositivo, pulsa Actualizar para ver los últimos cambios.'}</small>
    <p className="task-status" role="status">{status}</p>
  </section>;
}
