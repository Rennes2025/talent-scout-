-- Sprint 2 : routine du jour (actions récurrentes ou ponctuelles + suivi quotidien).

create or replace function public.is_athlete()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and role = 'athlete'
  );
$$;
revoke execute on function public.is_athlete() from public, anon;
grant execute on function public.is_athlete() to authenticated;

-- days : jours ISO (1 = lundi … 7 = dimanche). one_off_date : action ponctuelle.
create table public.routine_items (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (length(trim(title)) > 0),
  category     text not null check (category in ('club', 'physique', 'technique', 'recuperation', 'nutrition_mental')),
  target       text,
  days         smallint[] not null default '{}',
  one_off_date date,
  sort_order   integer not null default 0,
  created_by   uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at   timestamptz not null default now(),
  archived_at  timestamptz,
  check (one_off_date is not null or cardinality(days) > 0),
  check (days <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[])
);
alter table public.routine_items enable row level security;

create policy "Members read routine items" on public.routine_items
  for select to authenticated using (public.is_member());
create policy "Members add routine items" on public.routine_items
  for insert to authenticated with check (public.is_member());
create policy "Members edit routine items" on public.routine_items
  for update to authenticated using (public.is_member()) with check (public.is_member());
create policy "Members delete routine items" on public.routine_items
  for delete to authenticated using (public.is_member());

create index routine_items_created_by_idx on public.routine_items (created_by);

-- Seul le joueur coche ses actions.
create table public.routine_logs (
  id         uuid primary key default gen_random_uuid(),
  item_id    uuid not null references public.routine_items (id) on delete cascade,
  log_date   date not null,
  done       boolean not null default true,
  detail     text,
  updated_at timestamptz not null default now(),
  unique (item_id, log_date)
);
alter table public.routine_logs enable row level security;

create policy "Members read routine logs" on public.routine_logs
  for select to authenticated using (public.is_member());
create policy "Athlete adds routine logs" on public.routine_logs
  for insert to authenticated with check (public.is_athlete());
create policy "Athlete edits routine logs" on public.routine_logs
  for update to authenticated using (public.is_athlete()) with check (public.is_athlete());
create policy "Athlete deletes routine logs" on public.routine_logs
  for delete to authenticated using (public.is_athlete());

create index routine_logs_log_date_idx on public.routine_logs (log_date);

-- Routine de départ : ailier/latéral Sénior R2, club mardi + vendredi, match dimanche, salle Basic-Fit.
insert into public.routine_items (title, category, target, days, sort_order) values
  ('Entraînement au club',                       'club',             null,                       '{2,5}',           1),
  ('Match',                                      'club',             null,                       '{7}',             2),
  ('Gainage (planche face + côtés)',             'physique',         '3 × 45 s',                 '{3,4,6}'  ,       1),
  ('Basic-Fit : bas du corps (squat, presse, fentes, ischios)', 'physique', '4 × 8, charge en progression', '{3}', 2),
  ('Pliométrie : sauts groupés et bondissements','physique',         '3 × 8',                    '{3}',             3),
  ('Sprints 30 m départ arrêté',                 'physique',         '6 × 30 m, récup 1 min 30', '{4}',             4),
  ('Footing de récupération',                    'physique',         '20 min',                   '{1}',             5),
  ('Activation veille de match',                 'physique',         '15 min',                   '{6}',             6),
  ('Basic-Fit : haut du corps et gainage',       'physique',         '45 min',                   '{1}',             7),
  ('Pied droit : passes et contrôles',           'technique',        '15 min',                   '{3,4}',           1),
  ('Conduite de balle et dribbles',              'technique',        '15 min',                   '{3}',             2),
  ('Centres et frappes du pied gauche',          'technique',        '30 ballons',               '{4}',             3),
  ('Étirements et mobilité',                     'recuperation',     '10 min',                   '{1,2,3,4,5,6,7}', 1),
  ('Sommeil',                                    'recuperation',     '8 h minimum',              '{1,2,3,4,5,6,7}', 2),
  ('Douche froide sur les jambes après le match','recuperation',     '3 min',                    '{7}',             3),
  ('Boire de l''eau',                            'nutrition_mental', '2 L',                      '{1,2,3,4,5,6,7}', 1),
  ('Ni fast-food ni soda',                       'nutrition_mental', null,                       '{1,2,3,4,5,6,7}', 2),
  ('Revoir une action de son match en vidéo',    'nutrition_mental', '10 min',                   '{1}',             3),
  ('Visualiser 3 actions qu''il va réussir',     'nutrition_mental', '5 min',                    '{6}',             4);
