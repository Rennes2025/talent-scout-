"use client";

import { useOptimistic, useState, useTransition } from "react";
import { saveItemDetail, setItemDone } from "./routine/actions";

export type ChecklistRow = {
  id: string;
  title: string;
  target: string | null;
  done: boolean;
  detail: string | null;
};

export type ChecklistGroup = {
  id: string;
  label: string;
  icon: string;
  rows: ChecklistRow[];
};

export default function RoutineChecklist({
  date,
  canCheck,
  groups,
}: {
  date: string;
  canCheck: boolean;
  groups: ChecklistGroup[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.id} className="flex flex-col gap-2">
          <h3 className="flex items-center gap-2" style={{ fontFamily: "Oswald,sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8e9099" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#e9c349" }}>{group.icon}</span>
            {group.label}
          </h3>
          <ul className="flex flex-col gap-2">
            {group.rows.map((row) => (
              <ChecklistItem key={`${row.id}-${date}`} row={row} date={date} canCheck={canCheck} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ChecklistItem({ row, date, canCheck }: { row: ChecklistRow; date: string; canCheck: boolean }) {
  const [done, setOptimisticDone] = useOptimistic(row.done);
  const [, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);
  const [detail, setDetail] = useState(row.detail ?? "");

  function toggle() {
    if (!canCheck) return;
    const next = !done;
    setFailed(false);
    startTransition(async () => {
      setOptimisticDone(next);
      try {
        await setItemDone(row.id, date, next);
      } catch {
        setFailed(true);
      }
    });
  }

  function saveDetail() {
    if (detail === (row.detail ?? "")) return;
    startTransition(async () => {
      try {
        await saveItemDetail(row.id, date, detail);
      } catch {
        setFailed(true);
      }
    });
  }

  return (
    <li
      className="rounded-xl flex flex-col gap-2 px-4 py-3"
      style={{
        background: done ? "rgba(74,222,128,0.06)" : "#182028",
        border: `1px solid ${done ? "rgba(74,222,128,0.3)" : "rgba(219,227,237,0.08)"}`,
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={!canCheck}
        aria-pressed={done}
        className="flex items-center gap-3 text-left w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349] rounded-md"
        style={{ background: "none", border: "none", padding: 0, cursor: canCheck ? "pointer" : "default", color: "inherit" }}
      >
        <span
          className="material-symbols-outlined shrink-0"
          style={{ fontSize: 28, color: done ? "#4ade80" : "rgba(219,227,237,0.3)", fontVariationSettings: done ? "'FILL' 1" : "'FILL' 0" }}
          aria-hidden
        >
          {done ? "check_circle" : "radio_button_unchecked"}
        </span>
        <span className="flex-1 min-w-0 flex flex-col">
          <span style={{ fontSize: 15, fontWeight: 500, color: done ? "#c4c6cf" : "#dbe3ed", lineHeight: 1.35 }}>{row.title}</span>
          {row.target && <span style={{ fontSize: 12, color: "#8e9099", marginTop: 2 }}>Objectif : {row.target}</span>}
        </span>
      </button>

      {done && row.target && canCheck && (
        <div className="flex items-center gap-2" style={{ paddingLeft: 40 }}>
          <label htmlFor={`detail-${row.id}`} style={{ fontSize: 12, color: "#8e9099", whiteSpace: "nowrap" }}>Réalisé :</label>
          <input
            id={`detail-${row.id}`}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            onBlur={saveDetail}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            placeholder="Comme prévu"
            maxLength={200}
            className="flex-1 min-w-0 rounded-md px-3 py-2"
            style={{ background: "#0c141b", border: "1px solid rgba(219,227,237,0.12)", color: "#dbe3ed", fontSize: 14 }}
          />
        </div>
      )}

      {done && !canCheck && row.detail && (
        <p style={{ fontSize: 12, color: "#8e9099", paddingLeft: 40 }}>Réalisé : {row.detail}</p>
      )}

      {failed && (
        <p role="alert" style={{ fontSize: 12, color: "#f87171", paddingLeft: 40 }}>
          Non enregistré. Vérifie ta connexion puis réessaie.
        </p>
      )}
    </li>
  );
}
