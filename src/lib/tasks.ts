export type Task = {
  id: string;
  text: string;
  done: boolean;
  created_at: string;
};
export const TASK_COLUMNS = 'id,text,done,created_at';
export function taskErrorMessage(code?: string) {
  if (code === 'PGRST205' || code === '42P01') return 'Falta activar las tareas en Supabase. Ejecuta el archivo de configuración de tareas en SQL Editor y pulsa Actualizar.';
  if (code === '42501') return 'No se ha podido acceder a tus tareas. Revisa los permisos de la tabla en Supabase.';
  if (code === 'PGRST301' || code === 'PGRST303') return 'Tu sesión ha caducado. Vuelve a iniciar sesión.';
  return 'No se han podido cargar tus tareas. Comprueba la conexión y pulsa Actualizar.';
}
