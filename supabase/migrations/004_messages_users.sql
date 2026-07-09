-- 004_messages_users.sql
-- Contact messages + user/admin roles

alter table public.profiles
  add column if not exists role text not null default 'user',
  add column if not exists phone text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('user', 'admin'));
  end if;
end $$;

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin(uuid) to anon, authenticated;

-- Si ya existían usuarios antes de esta migración, promover el perfil más antiguo
-- solo cuando todavía no hay ningún admin.
update public.profiles
set role = 'admin', updated_at = now()
where id = (
  select id
  from public.profiles
  order by created_at asc
  limit 1
)
and not exists (
  select 1
  from public.profiles
  where role = 'admin'
);

drop policy if exists "Usuarios ven su propio perfil" on public.profiles;
drop policy if exists "Usuarios editan su propio perfil" on public.profiles;
drop policy if exists "Usuarios ven perfiles permitidos" on public.profiles;
drop policy if exists "Admins editan perfiles" on public.profiles;

create policy "Usuarios ven perfiles permitidos"
  on public.profiles
  for select
  using (auth.uid() = id or public.is_admin());

create policy "Usuarios editan su propio perfil"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins editan perfiles"
  on public.profiles
  for update
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin(auth.uid()) then
    raise exception 'No puedes modificar tu rol.';
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_role_escalation();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_role text;
begin
  profile_role := case
    when not exists (select 1 from public.profiles where role = 'admin') then 'admin'
    else 'user'
  end;

  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'phone',
    profile_role
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    phone = coalesce(public.profiles.phone, excluded.phone),
    updated_at = now();

  return new;
end;
$$;

create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  nombre     text not null,
  telefono   text not null,
  servicio   text not null,
  fecha      date,
  mensaje    text,
  status     text not null default 'nuevo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'messages_status_check'
      and conrelid = 'public.messages'::regclass
  ) then
    alter table public.messages
      add constraint messages_status_check check (status in ('nuevo', 'leido', 'archivado'));
  end if;
end $$;

alter table public.messages enable row level security;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists messages_touch_updated_at on public.messages;
create trigger messages_touch_updated_at
  before update on public.messages
  for each row execute function public.touch_updated_at();

drop policy if exists "Cualquiera crea mensajes" on public.messages;
drop policy if exists "Admins leen mensajes" on public.messages;
drop policy if exists "Admins actualizan mensajes" on public.messages;

create policy "Cualquiera crea mensajes"
  on public.messages
  for insert
  with check (true);

create policy "Admins leen mensajes"
  on public.messages
  for select
  using (public.is_admin());

create policy "Admins actualizan mensajes"
  on public.messages
  for update
  using (public.is_admin())
  with check (public.is_admin());

grant select, update on public.profiles to authenticated;
grant insert on public.messages to anon, authenticated;
grant select, update on public.messages to authenticated;
grant usage, select on sequence public.messages_id_seq to anon, authenticated;
