"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CATEGORIES } from "@/lib/routine";
import { WEEKDAY_SHORT } from "@/lib/dates";
import { saveItem, type ItemFormState } from "./actions";

export type EditableItem = {
  id: string;
  title: string;
  category: string;
  target: string | null;
  days: number[];
  one_off_date: string | null;
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "#0c141b",
  border: "1px solid rgba(219,227,237,0.15)",
  borderRadius: 8,
  padding: "12px 14px",
  color: "#dbe3ed",
  fontSize: 15,
};

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#8e9099", letterSpacing: "0.04em" };

export default function RoutineForm({ item, today }: { item: EditableItem | null; today: string }) {
  const [state, action, pending] = useActionState<ItemFormState, FormData>(saveItem, {});
  const [mode, setMode] = useState<"recurring" | "once">(item?.one_off_date ? "once" : "recurring");

  return (
    <form action={action} className="glass-card rounded-xl p-5 flex flex-col gap-4">
      <h2 style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 600, textTransform: "uppercase", color: "#dbe3ed" }}>
        {item ? "Modifier l'action" : "Ajouter une action"}
      </h2>

      {item && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="mode" value={mode} />

      <div className="flex flex-col gap-2">
        <label htmlFor="title" style={labelStyle}>Action</label>
        <input id="title" name="title" required maxLength={120} defaultValue={item?.title} placeholder="Ex : Gainage, Basic-Fit jambes…" style={fieldStyle} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="category" style={labelStyle}>Catégorie</label>
          <select id="category" name="category" defaultValue={item?.category ?? "physique"} style={fieldStyle}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="target" style={labelStyle}>Objectif chiffré (facultatif)</label>
          <input id="target" name="target" maxLength={60} defaultValue={item?.target ?? ""} placeholder="Ex : 3 × 12, 20 min, 2 L" style={fieldStyle} />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend style={{ ...labelStyle, marginBottom: 8 }}>Quand ?</legend>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-lg" style={{ background: "rgba(219,227,237,0.05)" }}>
          {([["recurring", "Chaque semaine"], ["once", "Une seule fois"]] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
              className="py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
              style={{ fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: mode === value ? "#182028" : "transparent", color: mode === value ? "#e9c349" : "#8e9099" }}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "recurring" ? (
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAY_SHORT.map((label, i) => {
              const day = i + 1;
              return (
                <label key={day} className="flex flex-col items-center gap-1 py-2 rounded-md cursor-pointer" style={{ background: "#0c141b", border: "1px solid rgba(219,227,237,0.12)" }}>
                  <input type="checkbox" name="days" value={day} defaultChecked={item ? item.days.includes(day) : true} style={{ accentColor: "#e9c349", width: 18, height: 18 }} />
                  <span style={{ fontSize: 11, color: "#c4c6cf" }}>{label}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <input type="date" name="one_off_date" min={today} defaultValue={item?.one_off_date ?? today} aria-label="Date de l'action" style={{ ...fieldStyle, colorScheme: "dark" }} />
        )}
      </fieldset>

      {state.error && (
        <p role="alert" style={{ color: "#f87171", fontSize: 13, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, padding: "10px 12px" }}>
          {state.error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 py-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          style={{ background: "#e9c349", color: "#0c141b", fontFamily: "Oswald,sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", cursor: "pointer", opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Enregistrement…" : item ? "Enregistrer" : "Ajouter"}
        </button>
        {item && (
          <Link href="/admin/routine" className="px-4 py-3 rounded-lg" style={{ border: "1px solid rgba(219,227,237,0.15)", color: "#8e9099", fontSize: 14 }}>
            Annuler
          </Link>
        )}
      </div>
    </form>
  );
}
