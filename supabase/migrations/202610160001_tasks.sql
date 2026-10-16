-- Ejecutar una vez en Supabase > SQL Editor. No borra datos existentes.
begin;
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  text text not null check (char_length(btrim(text)) between 1 and 160),
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists tasks_user_created_idx on public.tasks(user_id, created_at, id);
alter table public.tasks enable row level security;
alter table public.tasks force row level security;
revoke all on table public.tasks from public, anon, authenticated;
grant select, insert, delete on table public.tasks to authenticated;
grant update (text, done) on table public.tasks to authenticated;
drop policy if exists tasks_select_own on public.tasks;
create policy tasks_select_own on public.tasks for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists tasks_insert_own on public.tasks;
create policy tasks_insert_own on public.tasks for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists tasks_update_own on public.tasks;
create policy tasks_update_own on public.tasks for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists tasks_delete_own on public.tasks;
create policy tasks_delete_own on public.tasks for delete to authenticated
  using ((select auth.uid()) = user_id);
commit;
