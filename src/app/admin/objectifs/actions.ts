"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { isDateString } from "@/lib/dates";
import { HORIZON_IDS, parseDecimal } from "@/lib/goals";

const PATH = "/admin/objectifs";

async function db() {
  await getMember();
  return createClient();
}

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function toggleStep(stepId: string, done: boolean) {
  const supabase = await db();
  const { error } = await supabase
    .from("goal_steps")
    .update({ done, done_at: done ? new Date().toISOString() : null })
    .eq("id", stepId);
  fail(error);
  revalidatePath(PATH);
}

export async function addStep(goalId: string, title: string) {
  const value = title.trim().slice(0, 120);
  if (!value) return;
  const supabase = await db();
  const { count } = await supabase.from("goal_steps").select("id", { count: "exact", head: true }).eq("goal_id", goalId);
  const { error } = await supabase.from("goal_steps").insert({ goal_id: goalId, title: value, sort_order: (count ?? 0) + 1 });
  fail(error);
  revalidatePath(PATH);
}

export async function deleteStep(stepId: string) {
  const supabase = await db();
  const { error } = await supabase.from("goal_steps").delete().eq("id", stepId);
  fail(error);
  revalidatePath(PATH);
}

export async function updateCurrentValue(goalId: string, raw: string): Promise<{ error?: string }> {
  const value = parseDecimal(raw);
  if (value === null) return { error: "Entre un nombre, par exemple 4,12." };

  const supabase = await db();
  const { data: goal } = await supabase.from("goals").select("start_value").eq("id", goalId).single();
  const patch: Record<string, number> = { current_value: value };
  if (goal && goal.start_value === null) patch.start_value = value;

  const { error } = await supabase.from("goals").update(patch).eq("id", goalId);
  if (error) return { error: "Enregistrement impossible. Réessaie." };
  revalidatePath(PATH);
  return {};
}

export async function setGoalAchieved(goalId: string, achieved: boolean) {
  const supabase = await db();
  const { error } = await supabase
    .from("goals")
    .update({ status: achieved ? "atteint" : "en_cours", achieved_at: achieved ? new Date().toISOString() : null })
    .eq("id", goalId);
  fail(error);
  revalidatePath(PATH);
}

export async function deleteGoal(goalId: string) {
  const supabase = await db();
  const { error } = await supabase.from("goals").delete().eq("id", goalId);
  fail(error);
  revalidatePath(PATH);
}

export type GoalFormState = { error?: string };

export async function saveGoal(_prev: GoalFormState, formData: FormData): Promise<GoalFormState> {
  const id = String(formData.get("id") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const horizon = String(formData.get("horizon") ?? "");
  const dueDate = String(formData.get("due_date") ?? "");
  const metricLabel = String(formData.get("metric_label") ?? "").trim().slice(0, 60) || null;
  const unit = String(formData.get("unit") ?? "").trim().slice(0, 12) || null;
  const startRaw = String(formData.get("start_value") ?? "");
  const currentRaw = String(formData.get("current_value") ?? "");
  const targetRaw = String(formData.get("target_value") ?? "");

  if (!title) return { error: "Donne un titre à l'objectif." };
  if (!HORIZON_IDS.includes(horizon)) return { error: "Choisis un horizon." };
  if (dueDate && !isDateString(dueDate)) return { error: "La date n'est pas valide." };

  const start = parseDecimal(startRaw);
  const current = parseDecimal(currentRaw);
  const target = parseDecimal(targetRaw);
  for (const [raw, parsed] of [[startRaw, start], [currentRaw, current], [targetRaw, target]] as const) {
    if (raw.trim() && parsed === null) return { error: "Les valeurs chiffrées doivent être des nombres (ex : 4,12)." };
  }

  const values = {
    title,
    horizon,
    due_date: dueDate || null,
    metric_label: metricLabel,
    unit: metricLabel ? unit : null,
    start_value: metricLabel ? start ?? current : null,
    current_value: metricLabel ? current : null,
    target_value: metricLabel ? target : null,
  };

  const supabase = await db();
  const { error } = id
    ? await supabase.from("goals").update(values).eq("id", id)
    : await supabase.from("goals").insert(values);
  if (error) return { error: "L'enregistrement a échoué. Réessaie." };

  revalidatePath(PATH);
  redirect(PATH);
}
