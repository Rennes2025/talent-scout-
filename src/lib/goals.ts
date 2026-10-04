import { formatShortDate } from "@/lib/dates";

export const HORIZONS = [
  { id: "mois",     label: "Ce mois-ci",   icon: "event" },
  { id: "saison",   label: "Cette saison", icon: "emoji_events" },
  { id: "carriere", label: "Carrière",     icon: "trending_up" },
] as const;

export type Horizon = (typeof HORIZONS)[number]["id"];

export const HORIZON_IDS: readonly string[] = HORIZONS.map((h) => h.id);

export type GoalStep = {
  id: string;
  goal_id: string;
  title: string;
  done: boolean;
  sort_order: number;
  created_at: string;
};

export type Goal = {
  id: string;
  title: string;
  horizon: Horizon;
  due_date: string | null;
  metric_label: string | null;
  unit: string | null;
  start_value: number | null;
  current_value: number | null;
  target_value: number | null;
  status: "en_cours" | "atteint";
  achieved_at: string | null;
  sort_order: number;
  created_at: string;
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Fonctionne dans les deux sens : 4"3 → 4"0 (baisser) comme 0 → 15 (monter). */
export function metricProgress(goal: Goal): number | null {
  const { start_value: start, current_value: current, target_value: target } = goal;
  if (start === null || current === null || target === null || target === start) return null;
  return clamp((current - start) / (target - start));
}

export function stepsProgress(steps: GoalStep[]): number | null {
  if (steps.length === 0) return null;
  return steps.filter((s) => s.done).length / steps.length;
}

export function overallProgress(goal: Goal, steps: GoalStep[]): number {
  return metricProgress(goal) ?? stepsProgress(steps) ?? 0;
}

const numberFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

export function formatValue(value: number | null, unit: string | null): string {
  if (value === null) return "–";
  return unit ? `${numberFormat.format(value)} ${unit}` : numberFormat.format(value);
}

/** Accepte « 4,12 », « 4.12 » ou « 4"12 ». */
export function parseDecimal(raw: string): number | null {
  const cleaned = raw.trim().replace(/["\s]/g, (m) => (m === '"' ? "." : "")).replace(",", ".");
  if (!cleaned) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function dueLabel(dueDate: string | null, today: string): { text: string; late: boolean } | null {
  if (!dueDate) return null;
  const days = Math.round((Date.parse(`${dueDate}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86_400_000);
  if (days < 0) return { text: `Échéance dépassée (${formatShortDate(dueDate)})`, late: true };
  if (days === 0) return { text: "Échéance aujourd'hui", late: false };
  return { text: `Avant le ${formatShortDate(dueDate)} · ${days} j`, late: false };
}

export function sortGoals(goals: Goal[]): Goal[] {
  return [...goals].sort(
    (a, b) =>
      (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999") ||
      a.sort_order - b.sort_order ||
      a.created_at.localeCompare(b.created_at)
  );
}
