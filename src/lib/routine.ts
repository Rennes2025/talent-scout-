import { addDays, isoWeekday, parisDate, WEEKDAY_SHORT, formatShortDate } from "@/lib/dates";

export const CATEGORIES = [
  { id: "club",             label: "Club",                   icon: "stadium" },
  { id: "physique",         label: "Physique",               icon: "fitness_center" },
  { id: "technique",        label: "Technique ballon",       icon: "sports_soccer" },
  { id: "recuperation",     label: "Récupération & sommeil", icon: "bedtime" },
  { id: "nutrition_mental", label: "Nutrition & mental",     icon: "psychology" },
] as const;

export type Category = (typeof CATEGORIES)[number]["id"];

export const CATEGORY_IDS: readonly string[] = CATEGORIES.map((c) => c.id);

export type RoutineItem = {
  id: string;
  title: string;
  category: Category;
  target: string | null;
  days: number[];
  one_off_date: string | null;
  sort_order: number;
  created_at: string;
  archived_at: string | null;
};

export type RoutineLog = {
  item_id: string;
  log_date: string;
  done: boolean;
  detail: string | null;
};

/** Semaine type d'Anwar : club mardi + vendredi, match dimanche. */
export const DAY_TYPES: Record<number, { label: string; hint: string }> = {
  1: { label: "Lendemain de match", hint: "Le corps récupère, la tête analyse le match." },
  2: { label: "Entraînement club",  hint: "Donne tout à l'entraînement, le reste est léger." },
  3: { label: "Travail perso",      hint: "Grosse journée : c'est ici que tu fais la différence." },
  4: { label: "Vitesse & technique", hint: "Qualité avant quantité : vite et propre." },
  5: { label: "Entraînement club",  hint: "Dernière vraie séance avant le match." },
  6: { label: "Veille de match",    hint: "Activation légère, sommeil, tête au match." },
  7: { label: "Jour de match",      hint: "Tout ce que tu as travaillé, c'est maintenant." },
};

/** Une journée est réussie quand 80 % des actions prévues sont faites. */
export const SUCCESS_RATIO = 0.8;

/** Nombre de jours passés que le joueur peut encore compléter. */
export const EDITABLE_PAST_DAYS = 6;

export function isScheduledOn(item: RoutineItem, date: string): boolean {
  if (parisDate(new Date(item.created_at)) > date) return false;
  if (item.archived_at && parisDate(new Date(item.archived_at)) <= date) return false;
  if (item.one_off_date) return item.one_off_date === date;
  return item.days.includes(isoWeekday(date));
}

export function dayCompletion(items: RoutineItem[], logs: RoutineLog[], date: string) {
  const scheduled = items.filter((item) => isScheduledOn(item, date));
  const doneIds = new Set(logs.filter((l) => l.log_date === date && l.done).map((l) => l.item_id));
  return { total: scheduled.length, done: scheduled.filter((i) => doneIds.has(i.id)).length };
}

export function isSuccessful(completion: { total: number; done: number }): boolean {
  return completion.total > 0 && completion.done / completion.total >= SUCCESS_RATIO;
}

/** Jours réussis d'affilée ; aujourd'hui ne casse pas la série tant qu'il n'est pas fini. */
export function currentStreak(items: RoutineItem[], logs: RoutineLog[], today: string, lookback = 60): number {
  let day = isSuccessful(dayCompletion(items, logs, today)) ? today : addDays(today, -1);
  let streak = 0;

  for (let i = 0; i < lookback; i++, day = addDays(day, -1)) {
    const completion = dayCompletion(items, logs, day);
    if (completion.total === 0) continue;
    if (!isSuccessful(completion)) break;
    streak++;
  }
  return streak;
}

export function scheduleLabel(item: Pick<RoutineItem, "days" | "one_off_date">): string {
  if (item.one_off_date) return `Le ${formatShortDate(item.one_off_date)}`;
  if (item.days.length === 7) return "Tous les jours";
  return [...item.days].sort((a, b) => a - b).map((d) => WEEKDAY_SHORT[d - 1]).join(" · ");
}

export function sortItems(items: RoutineItem[]): RoutineItem[] {
  const order = new Map(CATEGORY_IDS.map((id, i) => [id, i]));
  return [...items].sort(
    (a, b) =>
      (order.get(a.category) ?? 0) - (order.get(b.category) ?? 0) ||
      a.sort_order - b.sort_order ||
      a.created_at.localeCompare(b.created_at)
  );
}
