import Link from "next/link";
import { getMember } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { addDays, formatLongDate, isDateString, isoWeekday, parisDate, WEEKDAY_LETTERS } from "@/lib/dates";
import {
  CATEGORIES,
  DAY_TYPES,
  EDITABLE_PAST_DAYS,
  currentStreak,
  dayCompletion,
  isScheduledOn,
  isSuccessful,
  sortItems,
  type RoutineItem,
  type RoutineLog,
} from "@/lib/routine";
import RoutineChecklist, { type ChecklistGroup } from "./RoutineChecklist";

const STREAK_LOOKBACK_DAYS = 60;

export default async function AdminTodayPage({
  searchParams,
}: {
  searchParams: Promise<{ jour?: string }>;
}) {
  const member = await getMember();
  const today = parisDate();
  const oldestEditable = addDays(today, -EDITABLE_PAST_DAYS);
  const { jour } = await searchParams;
  const date = isDateString(jour) && jour <= today && jour >= oldestEditable ? jour : today;

  const supabase = await createClient();
  const [{ data: itemRows }, { data: logRows }] = await Promise.all([
    supabase.from("routine_items").select("id, title, category, target, days, one_off_date, sort_order, created_at, archived_at"),
    supabase
      .from("routine_logs")
      .select("item_id, log_date, done, detail")
      .gte("log_date", addDays(today, -STREAK_LOOKBACK_DAYS)),
  ]);

  const items = sortItems((itemRows ?? []) as RoutineItem[]);
  const logs = (logRows ?? []) as RoutineLog[];
  const logsOfDay = new Map(logs.filter((l) => l.log_date === date).map((l) => [l.item_id, l]));

  const groups: ChecklistGroup[] = CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    icon: category.icon,
    rows: items
      .filter((item) => item.category === category.id && isScheduledOn(item, date))
      .map((item) => ({
        id: item.id,
        title: item.title,
        target: item.target,
        done: logsOfDay.get(item.id)?.done ?? false,
        detail: logsOfDay.get(item.id)?.detail ?? null,
      })),
  })).filter((group) => group.rows.length > 0);

  const completion = dayCompletion(items, logs, date);
  const percent = completion.total ? Math.round((completion.done / completion.total) * 100) : 0;
  const streak = currentStreak(items, logs, today, STREAK_LOOKBACK_DAYS);
  const dayType = DAY_TYPES[isoWeekday(date)];
  const isAthlete = member.role === "athlete";
  const firstName = member.fullName.split(" ")[0];
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const weekDone = week.reduce((sum, d) => sum + dayCompletion(items, logs, d).done, 0);
  const weekTotal = week.reduce((sum, d) => sum + dayCompletion(items, logs, d).total, 0);

  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      <header className="flex flex-col gap-1">
        <span style={{ fontSize: 13, color: "#8e9099", textTransform: "capitalize" }}>
          {date === today ? formatLongDate(date) : `${formatLongDate(date)} · jour passé`}
        </span>
        <h1 style={{ fontFamily: "Oswald,sans-serif", fontSize: "clamp(28px, 6vw, 38px)", fontWeight: 700, textTransform: "uppercase", color: "#dbe3ed", lineHeight: 1.05 }}>
          {isAthlete ? `Salut ${firstName}` : "Journée d'Anwar"}
        </h1>
        <p className="flex items-center gap-2 flex-wrap" style={{ fontSize: 14, color: "#c4c6cf" }}>
          <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: "rgba(233,195,73,0.12)", border: "1px solid rgba(233,195,73,0.3)", color: "#e9c349" }}>
            {dayType.label}
          </span>
          {dayType.hint}
        </p>
      </header>

      <section className="grid grid-cols-3 gap-2">
        <Stat value={`${completion.done}/${completion.total}`} label={date === today ? "Fait aujourd'hui" : "Fait ce jour-là"} accent={isSuccessful(completion)} />
        <Stat value={`${streak} j`} label="Série en cours" accent={streak > 0} icon="local_fire_department" />
        <Stat value={weekTotal ? `${Math.round((weekDone / weekTotal) * 100)} %` : "–"} label="Régularité 7 j" />
      </section>

      <div className="flex flex-col gap-2">
        <div style={{ height: 6, background: "rgba(219,227,237,0.08)", borderRadius: 999, overflow: "hidden" }} aria-hidden>
          <div style={{ height: "100%", width: `${percent}%`, background: percent >= 80 ? "#4ade80" : "#e9c349", borderRadius: 999, transition: "width 0.3s" }} />
        </div>
        <p style={{ fontSize: 12, color: "#8e9099" }}>
          Journée réussie à partir de 80 % des actions faites.
        </p>
      </div>

      <nav className="grid grid-cols-7 gap-1" aria-label="7 derniers jours">
        {week.map((d) => {
          const c = dayCompletion(items, logs, d);
          const ratio = c.total ? c.done / c.total : 0;
          const selected = d === date;
          return (
            <Link
              key={d}
              href={d === today ? "/admin" : `/admin?jour=${d}`}
              aria-current={selected ? "date" : undefined}
              className="flex flex-col items-center gap-1 py-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
              style={{ background: selected ? "rgba(233,195,73,0.1)" : "transparent", border: `1px solid ${selected ? "rgba(233,195,73,0.4)" : "transparent"}` }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: selected ? "#e9c349" : "#8e9099" }}>{WEEKDAY_LETTERS[isoWeekday(d) - 1]}</span>
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  fontVariantNumeric: "tabular-nums",
                  color: isSuccessful(c) ? "#0c141b" : "#dbe3ed",
                  background: isSuccessful(c) ? "#4ade80" : `rgba(233,195,73,${0.08 + ratio * 0.4})`,
                }}
              >
                {d.slice(8)}
              </span>
            </Link>
          );
        })}
      </nav>

      {groups.length > 0 ? (
        <RoutineChecklist date={date} canCheck={isAthlete} groups={groups} />
      ) : (
        <p className="glass-card rounded-xl p-5" style={{ color: "#c4c6cf", fontSize: 14 }}>
          Rien de prévu ce jour-là.
        </p>
      )}

      {!isAthlete && (
        <p style={{ fontSize: 12, color: "#8e9099" }}>Seul Anwar coche ses actions. Tu peux modifier la routine.</p>
      )}

      <Link
        href="/admin/routine"
        className="flex items-center justify-center gap-2 py-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
        style={{ border: "1px solid rgba(233,195,73,0.35)", color: "#e9c349", fontFamily: "Oswald,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit_note</span>
        Gérer la routine
      </Link>
    </div>
  );
}

function Stat({ value, label, accent = false, icon }: { value: string; label: string; accent?: boolean; icon?: string }) {
  return (
    <div className="rounded-xl px-3 py-3 flex flex-col gap-1" style={{ background: "#182028", border: "1px solid rgba(219,227,237,0.08)" }}>
      <span className="flex items-center gap-1" style={{ fontFamily: "Oswald,sans-serif", fontSize: 22, fontWeight: 700, color: accent ? "#4ade80" : "#dbe3ed", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {icon && <span className="material-symbols-outlined" style={{ fontSize: 20, color: accent ? "#f97316" : "#8e9099", fontVariationSettings: "'FILL' 1" }}>{icon}</span>}
        {value}
      </span>
      <span style={{ fontSize: 11, color: "#8e9099", lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}
