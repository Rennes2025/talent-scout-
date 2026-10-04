"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { HORIZONS, type Goal } from "@/lib/goals";
import { saveGoal, type GoalFormState } from "./actions";

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

const toText = (n: number | null | undefined) => (n === null || n === undefined ? "" : String(n).replace(".", ","));

export default function GoalForm({ goal }: { goal: Goal | null }) {
  const [state, action, pending] = useActionState<GoalFormState, FormData>(saveGoal, {});
  const [withMetric, setWithMetric] = useState(Boolean(goal?.metric_label));

  return (
    <form action={action} className="glass-card rounded-xl p-5 flex flex-col gap-4">
      <h2 style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 600, textTransform: "uppercase", color: "#dbe3ed" }}>
        {goal ? "Modifier l'objectif" : "Nouvel objectif"}
      </h2>
      {goal && <input type="hidden" name="id" value={goal.id} />}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" style={labelStyle}>Objectif</label>
        <input id="title" name="title" required maxLength={120} defaultValue={goal?.title} placeholder="Ex : Jouer en R1 la saison prochaine" style={fieldStyle} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="horizon" style={labelStyle}>Horizon</label>
          <select id="horizon" name="horizon" defaultValue={goal?.horizon ?? "saison"} style={fieldStyle}>
            {HORIZONS.map((h) => <option key={h.id} value={h.id}>{h.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="due_date" style={labelStyle}>Échéance (facultatif)</label>
          <input id="due_date" name="due_date" type="date" defaultValue={goal?.due_date ?? ""} style={{ ...fieldStyle, colorScheme: "dark" }} />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer" style={{ fontSize: 14, color: "#c4c6cf" }}>
        <input type="checkbox" checked={withMetric} onChange={(e) => setWithMetric(e.target.checked)} style={{ accentColor: "#e9c349", width: 18, height: 18 }} />
        Objectif chiffré (temps, poids, nombre…)
      </label>

      {withMetric && (
        <div className="flex flex-col gap-4 rounded-lg p-4" style={{ background: "rgba(219,227,237,0.03)", border: "1px solid rgba(219,227,237,0.08)" }}>
          <div className="grid grid-cols-[1fr_96px] gap-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="metric_label" style={labelStyle}>Ce qu&apos;on mesure</label>
              <input id="metric_label" name="metric_label" required maxLength={60} defaultValue={goal?.metric_label ?? ""} placeholder="Ex : Sprint 30 m" style={fieldStyle} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="unit" style={labelStyle}>Unité</label>
              <input id="unit" name="unit" maxLength={12} defaultValue={goal?.unit ?? ""} placeholder="s, kg…" style={fieldStyle} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([
              ["start_value", "Départ", goal?.start_value],
              ["current_value", "Actuel", goal?.current_value],
              ["target_value", "Cible", goal?.target_value],
            ] as const).map(([name, label, value]) => (
              <div key={name} className="flex flex-col gap-2">
                <label htmlFor={name} style={labelStyle}>{label}</label>
                <input id={name} name={name} inputMode="decimal" defaultValue={toText(value)} placeholder="–" style={{ ...fieldStyle, fontVariantNumeric: "tabular-nums" }} />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#8e9099", lineHeight: 1.5 }}>
            Marche dans les deux sens : un temps qui doit baisser (4,30 → 4,00 s) ou un total qui doit monter (0 → 15).
          </p>
        </div>
      )}

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
          {pending ? "Enregistrement…" : goal ? "Enregistrer" : "Créer l'objectif"}
        </button>
        <Link href="/admin/objectifs" className="px-4 py-3 rounded-lg" style={{ border: "1px solid rgba(219,227,237,0.15)", color: "#8e9099", fontSize: 14 }}>
          Annuler
        </Link>
      </div>
    </form>
  );
}
