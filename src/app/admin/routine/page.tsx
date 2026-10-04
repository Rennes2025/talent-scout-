import Link from "next/link";
import { getMember } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { parisDate } from "@/lib/dates";
import { CATEGORIES, scheduleLabel, sortItems, type RoutineItem } from "@/lib/routine";
import { archiveItem } from "./actions";
import RoutineForm from "./RoutineForm";

export default async function RoutinePage({
  searchParams,
}: {
  searchParams: Promise<{ modifier?: string }>;
}) {
  await getMember();
  const today = parisDate();
  const { modifier } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from("routine_items")
    .select("id, title, category, target, days, one_off_date, sort_order, created_at, archived_at")
    .is("archived_at", null);

  const items = sortItems((data ?? []) as RoutineItem[]).filter(
    (item) => !item.one_off_date || item.one_off_date >= today
  );
  const editing = items.find((item) => item.id === modifier) ?? null;

  return (
    <div className="flex flex-col gap-6 max-w-[640px]">
      <div className="flex flex-col gap-2">
        <Link href="/admin" className="flex items-center gap-1 w-fit" style={{ fontSize: 13, color: "#8e9099" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Aujourd&apos;hui
        </Link>
        <h1 style={{ fontFamily: "Oswald,sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", color: "#dbe3ed" }}>
          Routine
        </h1>
        <p style={{ fontSize: 14, color: "#c4c6cf", lineHeight: 1.6 }}>
          Les actions de la semaine type, plus les actions ponctuelles à venir.
        </p>
      </div>

      <RoutineForm key={editing?.id ?? "new"} item={editing} today={today} />

      {CATEGORIES.map((category) => {
        const rows = items.filter((item) => item.category === category.id);
        if (rows.length === 0) return null;
        return (
          <section key={category.id} className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2" style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8e9099" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#e9c349" }}>{category.icon}</span>
              {category.label}
            </h2>
            <ul className="flex flex-col gap-2">
              {rows.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "#182028", border: `1px solid ${item.id === editing?.id ? "rgba(233,195,73,0.5)" : "rgba(219,227,237,0.08)"}` }}
                >
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span style={{ fontSize: 15, color: "#dbe3ed", lineHeight: 1.35 }}>{item.title}</span>
                    <span style={{ fontSize: 12, color: "#8e9099", marginTop: 2 }}>
                      {scheduleLabel(item)}
                      {item.target ? ` · ${item.target}` : ""}
                    </span>
                  </div>
                  <Link
                    href={`/admin/routine?modifier=${item.id}`}
                    aria-label={`Modifier ${item.title}`}
                    className="p-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
                    style={{ color: "#8e9099" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                  </Link>
                  <form action={archiveItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      aria-label={`Retirer ${item.title}`}
                      className="p-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
                      style={{ color: "#8e9099", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p style={{ fontSize: 12, color: "#8e9099", lineHeight: 1.5 }}>
        Une action retirée disparaît à partir d&apos;aujourd&apos;hui. L&apos;historique des jours passés est conservé.
      </p>
    </div>
  );
}
