const PARIS = "Europe/Paris";

/** Date du jour (ou d'un instant donné) à Paris, au format YYYY-MM-DD. */
export function parisDate(at: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

function atNoonUtc(date: string): Date {
  return new Date(`${date}T12:00:00Z`);
}

/** 1 = lundi … 7 = dimanche. */
export function isoWeekday(date: string): number {
  const day = atNoonUtc(date).getUTCDay();
  return day === 0 ? 7 : day;
}

export function addDays(date: string, amount: number): string {
  const d = atNoonUtc(date);
  d.setUTCDate(d.getUTCDate() + amount);
  return d.toISOString().slice(0, 10);
}

export function isDateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function formatLongDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(atNoonUtc(date));
}

export function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" }).format(atNoonUtc(date));
}

export const WEEKDAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];
export const WEEKDAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
