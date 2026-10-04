"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { addDays, isDateString, parisDate } from "@/lib/dates";
import { CATEGORY_IDS, EDITABLE_PAST_DAYS } from "@/lib/routine";

async function requireAthleteOnEditableDay(date: string) {
  const member = await getMember();
  if (member.role !== "athlete") throw new Error("Seul le joueur coche ses actions.");

  const today = parisDate();
  if (!isDateString(date) || date > today || date < addDays(today, -EDITABLE_PAST_DAYS)) {
    throw new Error("Cette journée ne peut plus être modifiée.");
  }
}

export async function setItemDone(itemId: string, date: string, done: boolean) {
  await requireAthleteOnEditableDay(date);
  const supabase = await createClient();
  const { error } = await supabase
    .from("routine_logs")
    .upsert(
      { item_id: itemId, log_date: date, done, updated_at: new Date().toISOString() },
      { onConflict: "item_id,log_date" }
    );
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function saveItemDetail(itemId: string, date: string, detail: string) {
  await requireAthleteOnEditableDay(date);
  const value = detail.trim().slice(0, 200) || null;
  const supabase = await createClient();
  const { error } = await supabase
    .from("routine_logs")
    .upsert(
      { item_id: itemId, log_date: date, detail: value, updated_at: new Date().toISOString() },
      { onConflict: "item_id,log_date" }
    );
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export type ItemFormState = { error?: string };

export async function saveItem(_prev: ItemFormState, formData: FormData): Promise<ItemFormState> {
  await getMember();

  const id = String(formData.get("id") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const category = String(formData.get("category") ?? "");
  const target = String(formData.get("target") ?? "").trim().slice(0, 60) || null;
  const mode = String(formData.get("mode") ?? "recurring");
  const days = formData.getAll("days").map(Number).filter((d) => d >= 1 && d <= 7);
  const oneOffDate = String(formData.get("one_off_date") ?? "");

  if (!title) return { error: "Donne un nom à l'action." };
  if (!CATEGORY_IDS.includes(category)) return { error: "Choisis une catégorie." };
  if (mode === "recurring" && days.length === 0) return { error: "Coche au moins un jour." };
  if (mode === "once" && !isDateString(oneOffDate)) return { error: "Choisis la date de l'action." };

  const values = {
    title,
    category,
    target,
    days: mode === "recurring" ? days : [],
    one_off_date: mode === "once" ? oneOffDate : null,
  };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("routine_items").update(values).eq("id", id)
    : await supabase.from("routine_items").insert(values);

  if (error) return { error: "L'enregistrement a échoué. Réessaie." };

  revalidatePath("/admin");
  revalidatePath("/admin/routine");
  redirect("/admin/routine");
}

export async function archiveItem(formData: FormData) {
  await getMember();
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  await supabase.from("routine_items").update({ archived_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/routine");
}
