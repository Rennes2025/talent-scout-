import Link from "next/link";
import { getMember } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { parisDate } from "@/lib/dates";
import { HORIZONS, dueLabel, sortGoals, type Goal, type GoalStep } from "@/lib/goals";
import GoalCard from "./GoalCard";
import GoalForm from "./GoalForm";

export default async function ObjectifsPage({
  searchParams,
}: {
  searchParams: Promise<{ modifier?: string; nouveau?: string }>;
}) {
  await getMember();
  const today = parisDate();
  const { modifier, nouveau } = await searchParams;

  const supabase = await createClient();
  const [{ data: goalRows }, { data: stepRows }] = await Promise.all([
    supabase.from("goals").select("id, title, horizon, due_date, metric_label, unit, start_value, current_value, target_value, status, achieved_at, sort_order, created_at"),
    supabase.from("goal_steps").select("id, goal_id, title, done, sort_order, created_at").order("sort_order").order("created_at"),
  ]);

  const goals = sortGoals((goalRows ?? []) as Goal[]);
  const steps = (stepRows ?? []) as GoalStep[];
  const stepsOf = (goalId: string) => steps.filter((s) => s.goal_id === goalId);

  const editing = goals.find((g) => g.id === modifier) ?? null;
  const showForm = Boolean(editing) || nouveau === "1";
  const active = goals.filter((g) => g.status === "en_cours");
  const achieved = goals.filter((g) => g.status === "atteint");

  return (
    <div className="flex flex-col gap-8 max-w-[720px]">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <h1 style={{ fontFamily: "Oswald,sans-serif", fontSize: 28, fontWeight: 700, textTransform: "uppercase", color: "#dbe3ed" }}>
            Objectifs
          </h1>
          <p style={{ fontSize: 14, color: "#c4c6cf" }}>
            {active.length} en cours · {achieved.length} atteint{achieved.length > 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <Link
            href="/admin/objectifs?nouveau=1"
            className="flex items-center gap-2 px-4 py-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            style={{ background: "#e9c349", color: "#0c141b", fontFamily: "Oswald,sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Nouvel objectif
          </Link>
        )}
      </div>

      {showForm && <GoalForm key={editing?.id ?? "new"} goal={editing} />}

      {HORIZONS.map((horizon) => {
        const list = active.filter((g) => g.horizon === horizon.id);
        return (
          <section key={horizon.id} className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2" style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8e9099" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#e9c349" }}>{horizon.icon}</span>
              {horizon.label}
              <span style={{ color: "rgba(219,227,237,0.35)" }}>{list.length}</span>
            </h2>
            {list.length === 0 ? (
              <p style={{ fontSize: 13, color: "#8e9099" }}>Aucun objectif en cours.</p>
            ) : (
              list.map((goal) => (
                <GoalCard key={goal.id} goal={goal} steps={stepsOf(goal.id)} due={dueLabel(goal.due_date, today)} />
              ))
            )}
          </section>
        );
      })}

      {achieved.length > 0 && (
        <details className="flex flex-col gap-3">
          <summary className="cursor-pointer" style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4ade80" }}>
            Objectifs atteints ({achieved.length})
          </summary>
          <div className="flex flex-col gap-3 mt-3">
            {achieved.map((goal) => (
              <GoalCard key={goal.id} goal={goal} steps={stepsOf(goal.id)} due={null} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
