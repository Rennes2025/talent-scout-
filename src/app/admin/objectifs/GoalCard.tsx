"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { formatValue, metricProgress, overallProgress, stepsProgress, type Goal, type GoalStep } from "@/lib/goals";
import { addStep, deleteGoal, deleteStep, setGoalAchieved, toggleStep, updateCurrentValue } from "./actions";

const iconButton: React.CSSProperties = {
  color: "#8e9099",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 6,
  borderRadius: 6,
};

export default function GoalCard({ goal, steps, due }: {
  goal: Goal;
  steps: GoalStep[];
  due: { text: string; late: boolean } | null;
}) {
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const achieved = goal.status === "atteint";
  const percent = Math.round(overallProgress(goal, steps) * 100);
  const metric = metricProgress(goal);
  const stepRatio = stepsProgress(steps);

  function run(action: () => Promise<unknown>) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
      } catch {
        setError("Non enregistré. Vérifie ta connexion puis réessaie.");
      }
    });
  }

  return (
    <article
      className="rounded-xl p-4 md:p-5 flex flex-col gap-4"
      style={{
        background: "#182028",
        border: `1px solid ${achieved ? "rgba(74,222,128,0.35)" : "rgba(219,227,237,0.08)"}`,
      }}
    >
      <header className="flex items-start gap-3">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3 style={{ fontFamily: "Oswald,sans-serif", fontSize: 18, fontWeight: 600, color: "#dbe3ed", lineHeight: 1.25, textWrap: "balance" }}>
            {goal.title}
          </h3>
          {achieved ? (
            <span style={{ fontSize: 12, color: "#4ade80" }}>Objectif atteint</span>
          ) : due && (
            <span style={{ fontSize: 12, color: due.late ? "#f87171" : "#8e9099" }}>{due.text}</span>
          )}
        </div>
        <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 22, fontWeight: 700, color: achieved || percent === 100 ? "#4ade80" : "#e9c349", fontVariantNumeric: "tabular-nums" }}>
          {achieved ? 100 : percent} %
        </span>
      </header>

      <div style={{ height: 6, background: "rgba(219,227,237,0.08)", borderRadius: 999, overflow: "hidden" }} aria-hidden>
        <div style={{ height: "100%", width: `${achieved ? 100 : percent}%`, background: achieved || percent === 100 ? "#4ade80" : "#e9c349", borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {goal.metric_label && <MetricBlock goal={goal} progress={metric} disabled={achieved} />}

      {steps.length > 0 && (
        <div className="flex flex-col gap-1">
          {stepRatio !== null && metric !== null && (
            <span style={{ fontSize: 11, color: "#8e9099", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>
              Étapes {steps.filter((s) => s.done).length}/{steps.length}
            </span>
          )}
          <ul className="flex flex-col">
            {steps.map((step) => (
              <StepRow
                key={step.id}
                step={step}
                onError={() => setError("Non enregistré. Vérifie ta connexion puis réessaie.")}
                onDelete={() => run(() => deleteStep(step.id))}
              />
            ))}
          </ul>
        </div>
      )}

      {!achieved && <AddStep onAdd={(title) => run(() => addStep(goal.id, title))} />}

      {error && <p role="alert" style={{ fontSize: 12, color: "#f87171" }}>{error}</p>}

      <footer className="flex items-center gap-1 pt-2" style={{ borderTop: "1px solid rgba(219,227,237,0.06)" }}>
        <button
          type="button"
          onClick={() => run(() => setGoalAchieved(goal.id, !achieved))}
          className="flex items-center gap-1 px-3 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
          style={{
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            border: `1px solid ${achieved ? "rgba(219,227,237,0.15)" : percent === 100 ? "#4ade80" : "rgba(74,222,128,0.35)"}`,
            background: !achieved && percent === 100 ? "rgba(74,222,128,0.12)" : "transparent",
            color: achieved ? "#8e9099" : "#4ade80",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{achieved ? "undo" : "verified"}</span>
          {achieved ? "Remettre en cours" : "Objectif atteint"}
        </button>
        <span className="flex-1" />
        <Link href={`/admin/objectifs?modifier=${goal.id}`} aria-label={`Modifier ${goal.title}`} style={iconButton} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
        </Link>
        <button
          type="button"
          aria-label={`Supprimer ${goal.title}`}
          onClick={() => window.confirm(`Supprimer l'objectif « ${goal.title} » et ses étapes ?`) && run(() => deleteGoal(goal.id))}
          style={iconButton}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
        </button>
      </footer>
    </article>
  );
}

function MetricBlock({ goal, progress, disabled }: { goal: Goal; progress: number | null; disabled: boolean }) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function send(raw: string) {
    startTransition(async () => {
      const result = await updateCurrentValue(goal.id, raw);
      if (result.error) {
        setMessage(result.error);
      } else {
        setValue("");
        setMessage(null);
      }
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    send(value);
  }

  return (
    <div className="rounded-lg p-3 flex flex-col gap-2" style={{ background: "#0c141b", border: "1px solid rgba(219,227,237,0.08)" }}>
      <span style={{ fontSize: 11, color: "#8e9099", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>{goal.metric_label}</span>
      <div className="grid grid-cols-3 gap-2" style={{ fontVariantNumeric: "tabular-nums" }}>
        <Figure label="Départ" value={formatValue(goal.start_value, goal.unit)} />
        <Figure label={goal.cumulative ? "Total" : "Actuel"} value={formatValue(goal.current_value, goal.unit)} strong />
        <Figure label="Cible" value={goal.target_value === null ? "À définir" : formatValue(goal.target_value, goal.unit)} />
      </div>
      {progress === null && (
        <p style={{ fontSize: 12, color: "#8e9099" }}>
          {goal.current_value === null ? "Entre la première mesure pour démarrer." : "Fixe une cible (bouton crayon) pour voir la progression."}
        </p>
      )}
      {!disabled && (
        <form onSubmit={submit} className="flex gap-2">
          {goal.cumulative && (
            <button
              type="button"
              onClick={() => send("1")}
              disabled={pending}
              aria-label={`Ajouter 1 à ${goal.metric_label}`}
              className="px-4 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.4)", fontWeight: 700, fontSize: 15, cursor: "pointer", opacity: pending ? 0.5 : 1 }}
            >
              +1
            </button>
          )}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode={goal.cumulative ? "numeric" : "decimal"}
            placeholder={goal.cumulative ? "À ajouter" : `Nouvelle mesure${goal.unit ? ` (${goal.unit})` : ""}`}
            aria-label={goal.cumulative ? `Nombre à ajouter à ${goal.metric_label}` : `Nouvelle mesure ${goal.metric_label}`}
            className="flex-1 min-w-0 rounded-md px-3 py-2"
            style={{ background: "#182028", border: "1px solid rgba(219,227,237,0.12)", color: "#dbe3ed", fontSize: 15 }}
          />
          <button
            type="submit"
            disabled={pending || !value.trim()}
            className="px-4 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            style={{ background: "#e9c349", color: "#0c141b", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", opacity: pending || !value.trim() ? 0.5 : 1 }}
          >
            {goal.cumulative ? "Ajouter" : "OK"}
          </button>
        </form>
      )}
      {goal.cumulative && !disabled && (
        <p style={{ fontSize: 12, color: "#8e9099" }}>Après chaque match, ajoute ce qu&apos;il a fait. Une erreur ? Tape −1 pour corriger.</p>
      )}
      {message && <p role="alert" style={{ fontSize: 12, color: "#f87171" }}>{message}</p>}
    </div>
  );
}

function Figure({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex flex-col">
      <span style={{ fontSize: 11, color: "#8e9099" }}>{label}</span>
      <span style={{ fontFamily: "Oswald,sans-serif", fontSize: strong ? 20 : 16, fontWeight: strong ? 700 : 500, color: strong ? "#dbe3ed" : "#c4c6cf" }}>{value}</span>
    </div>
  );
}

function StepRow({ step, onError, onDelete }: { step: GoalStep; onError: () => void; onDelete: () => void }) {
  const [done, setOptimisticDone] = useOptimistic(step.done);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !done;
    startTransition(async () => {
      setOptimisticDone(next);
      try {
        await toggleStep(step.id, next);
      } catch {
        onError();
      }
    });
  }

  return (
    <li className="flex items-center gap-1 group">
      <button
        type="button"
        aria-pressed={done}
        onClick={toggle}
        className="flex-1 flex items-center gap-3 py-2 text-left rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: "8px 0" }}
      >
        <span className="material-symbols-outlined shrink-0" style={{ fontSize: 22, color: done ? "#4ade80" : "rgba(219,227,237,0.3)", fontVariationSettings: done ? "'FILL' 1" : "'FILL' 0" }} aria-hidden>
          {done ? "check_circle" : "radio_button_unchecked"}
        </span>
        <span style={{ fontSize: 14, color: done ? "#8e9099" : "#dbe3ed", textDecoration: done ? "line-through" : "none", lineHeight: 1.4 }}>{step.title}</span>
      </button>
      <button
        type="button"
        aria-label={`Supprimer l'étape ${step.title}`}
        onClick={() => window.confirm(`Supprimer l'étape « ${step.title} » ?`) && onDelete()}
        className="opacity-60 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100"
        style={iconButton}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
      </button>
    </li>
  );
}

function AddStep({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title);
        setTitle("");
      }}
      className="flex gap-2"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        placeholder="Ajouter une étape…"
        aria-label="Nouvelle étape"
        className="flex-1 min-w-0 rounded-md px-3 py-2"
        style={{ background: "transparent", border: "1px dashed rgba(219,227,237,0.15)", color: "#dbe3ed", fontSize: 14 }}
      />
      {title.trim() && (
        <button type="submit" className="px-3 rounded-md" style={{ background: "rgba(233,195,73,0.12)", color: "#e9c349", border: "1px solid rgba(233,195,73,0.35)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Ajouter
        </button>
      )}
    </form>
  );
}
