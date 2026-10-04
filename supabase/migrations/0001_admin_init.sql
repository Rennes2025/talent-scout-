-- Espace /admin : comptes autorisés et profils.
-- Seules les adresses présentes dans allowed_members peuvent créer un compte.

create table public.allowed_members (
  email     text primary key,
  role      text not null check (role in ('coach', 'athlete')),
  full_name text not null
);

-- RLS activée sans policy : table invisible depuis l'API publique.
alter table public.allowed_members enable row level security;

create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  full_name  text not null,
  role       text not null check (role in ('coach', 'athlete')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()));
$$;

create policy "Members can read profiles"
  on public.profiles for select
  to authenticated
  using (public.is_member());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  member public.allowed_members%rowtype;
begin
  select * into member from public.allowed_members where email = lower(new.email);

  if not found then
    raise exception 'Adresse non autorisée : %', new.email;
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (new.id, lower(new.email), member.full_name, member.role);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Fonctions internes : pas d'appel direct via l'API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_member() from public, anon;
grant execute on function public.is_member() to authenticated;
