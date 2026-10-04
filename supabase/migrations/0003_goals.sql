-- Sprint 3 : objectifs (3 horizons) découpés en étapes, avec valeur chiffrée facultative.

create table public.goals (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (length(trim(title)) > 0),
  horizon       text not null check (horizon in ('mois', 'saison', 'carriere')),
  due_date      date,
  metric_label  text,
  unit          text,
  start_value   numeric,
  current_value numeric,
  target_value  numeric,
  status        text not null default 'en_cours' check (status in ('en_cours', 'atteint')),
  achieved_at   timestamptz,
  sort_order    integer not null default 0,
  created_by    uuid references public.profiles (id) on delete set null default auth.uid(),
  created_at    timestamptz not null default now()
);
alter table public.goals enable row level security;

create policy "Members read goals" on public.goals
  for select to authenticated using (public.is_member());
create policy "Members add goals" on public.goals
  for insert to authenticated with check (public.is_member());
create policy "Members edit goals" on public.goals
  for update to authenticated using (public.is_member()) with check (public.is_member());
create policy "Members delete goals" on public.goals
  for delete to authenticated using (public.is_member());

create index goals_created_by_idx on public.goals (created_by);

create table public.goal_steps (
  id         uuid primary key default gen_random_uuid(),
  goal_id    uuid not null references public.goals (id) on delete cascade,
  title      text not null check (length(trim(title)) > 0),
  done       boolean not null default false,
  done_at    timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.goal_steps enable row level security;

create policy "Members read goal steps" on public.goal_steps
  for select to authenticated using (public.is_member());
create policy "Members add goal steps" on public.goal_steps
  for insert to authenticated with check (public.is_member());
create policy "Members edit goal steps" on public.goal_steps
  for update to authenticated using (public.is_member()) with check (public.is_member());
create policy "Members delete goal steps" on public.goal_steps
  for delete to authenticated using (public.is_member());

create index goal_steps_goal_id_idx on public.goal_steps (goal_id);

-- Objectifs de départ.
do $$
declare g uuid;
begin
  insert into public.goals (title, horizon, due_date, sort_order) values
    ('Tenir la routine tout le mois', 'mois', '2026-10-31', 1) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Première semaine complète réussie', 1),
    (g, 'Deux semaines réussies d''affilée', 2),
    (g, 'Mois terminé à 80 % de régularité', 3);

  insert into public.goals (title, horizon, due_date, sort_order) values
    ('Faire le premier bilan physique complet', 'mois', '2026-10-31', 2) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Sprints 10, 30 et 40 m chronométrés', 1),
    (g, 'Saut vertical et saut en longueur sans élan', 2),
    (g, 'Pesée Basic-Fit : poids et masse musculaire', 3),
    (g, 'Test VMA', 4);

  insert into public.goals (title, horizon, due_date, sort_order) values
    ('Lancer les contacts agents', 'mois', '2026-10-31', 3) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Envoyer le profil à Talentz (Cédric Collin)', 1),
    (g, 'Envoyer le profil à SonastiTalent (Nassim Tireche)', 2),
    (g, 'Relancer les deux après 10 jours', 3);

  insert into public.goals (title, horizon, due_date, metric_label, unit, target_value, sort_order) values
    ('Courir le 30 m sous 4"0', 'saison', '2027-06-30', 'Sprint 30 m', 's', 4.0, 1) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Mesure de départ', 1),
    (g, 'Passer sous 4"2', 2),
    (g, 'Passer sous 4"1', 3),
    (g, 'Passer sous 4"0', 4);

  insert into public.goals (title, horizon, due_date, metric_label, unit, sort_order) values
    ('Prendre 3 kg de muscle', 'saison', '2027-06-30', 'Masse musculaire', 'kg', 2) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Première pesée (fixe la cible à +3 kg)', 1),
    (g, '+1 kg', 2),
    (g, '+2 kg', 3),
    (g, '+3 kg', 4);

  insert into public.goals (title, horizon, due_date, metric_label, unit, start_value, current_value, target_value, sort_order) values
    ('15 buts + passes décisives en R2', 'saison', '2027-06-30', 'Buts + passes décisives', null, 0, 0, 15, 3);

  insert into public.goals (title, horizon, due_date, sort_order) values
    ('Décrocher un essai en réserve pro', 'saison', '2027-03-31', 4) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Dossier envoyé au Stade Rennais', 1),
    (g, 'Dossier envoyé au FC Lorient', 2),
    (g, 'Dossier envoyé au Stade Brestois', 3),
    (g, 'Essai obtenu', 4);

  insert into public.goals (title, horizon, due_date, sort_order) values
    ('Entrer dans le radar de la FRMF (Maroc)', 'saison', '2027-05-31', 5) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Contact pris avec SonastiTalent', 1),
    (g, 'Dossier transmis à l''antenne FRMF de Paris', 2),
    (g, 'Convocation à une détection U20', 3);

  insert into public.goals (title, horizon, due_date, sort_order) values
    ('Jouer en National 3 ou plus haut', 'carriere', '2028-06-30', 1) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Jouer en Régional 1', 1),
    (g, 'Signer en National 3', 2);

  insert into public.goals (title, horizon, due_date, sort_order) values
    ('Signer un premier contrat semi-pro ou pro', 'carriere', '2028-06-30', 2) returning id into g;
  insert into public.goal_steps (goal_id, title, sort_order) values
    (g, 'Être représenté par un agent licencié FFF', 1),
    (g, 'Réussir un essai dans un club de niveau supérieur', 2),
    (g, 'Signer le contrat', 3);
end $$;
