-- Objectif « cumul » : chaque saisie s'ajoute au total (buts, passes décisives…)
-- au lieu de remplacer la dernière mesure (sprint, poids…).
alter table public.goals add column cumulative boolean not null default false;
update public.goals set cumulative = true where title = '15 buts + passes décisives en R2';
