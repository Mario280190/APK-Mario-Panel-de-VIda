-- Prueba opcional de aislamiento. Ejecutar después de la migración.
-- Todo ocurre en una transacción que se revierte, incluidos los usuarios de prueba.
begin;
insert into auth.users(id,email) values
 ('00000000-0000-4000-8000-000000000001','tasks-test-a@example.invalid'),
 ('00000000-0000-4000-8000-000000000002','tasks-test-b@example.invalid');
insert into public.tasks(id,user_id,text) values
 ('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000001','Tarea A'),
 ('00000000-0000-4000-8000-000000000012','00000000-0000-4000-8000-000000000002','Tarea B');
set local role anon;
do $$ begin
 begin
  perform 1 from public.tasks;
  raise exception 'FAIL: anon tiene acceso a tareas';
 exception when insufficient_privilege then null;
 end;
end $$;
reset role;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
set local role authenticated;
do $$ declare changed integer; begin
 if (select count(*) from public.tasks) <> 1 then raise exception 'FAIL: aislamiento de lectura'; end if;
 insert into public.tasks(text) values ('Nueva tarea propia');
 update public.tasks set done=true where id='00000000-0000-4000-8000-000000000011';
 get diagnostics changed = row_count;
 if changed <> 1 then raise exception 'FAIL: actualizar tarea propia'; end if;
 update public.tasks set done=true where id='00000000-0000-4000-8000-000000000012';
 get diagnostics changed = row_count;
 if changed <> 0 then raise exception 'FAIL: actualizar tarea ajena'; end if;
 begin
  insert into public.tasks(user_id,text) values ('00000000-0000-4000-8000-000000000002','Invasión');
  raise exception 'FAIL: insertar tarea ajena';
 exception when insufficient_privilege then null;
 end;
 begin
  update public.tasks set user_id='00000000-0000-4000-8000-000000000002' where id='00000000-0000-4000-8000-000000000011';
  raise exception 'FAIL: transferir propietario';
 exception when insufficient_privilege then null;
 end;
 delete from public.tasks where id='00000000-0000-4000-8000-000000000012';
 get diagnostics changed = row_count;
 if changed <> 0 then raise exception 'FAIL: borrar tarea ajena'; end if;
 delete from public.tasks where id='00000000-0000-4000-8000-000000000011';
 get diagnostics changed = row_count;
 if changed <> 1 then raise exception 'FAIL: borrar tarea propia'; end if;
end $$;
reset role;
rollback;
