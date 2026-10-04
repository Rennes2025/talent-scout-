"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) return { error: "Entre ton email et ton mot de passe." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      error: error.status === 429
        ? "Trop de tentatives. Réessaie dans quelques minutes."
        : "Email ou mot de passe incorrect.",
    };
  }

  redirect("/admin");
}

export async function createAccess(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const { email, password } = readCredentials(formData);
  const confirm = String(formData.get("confirm") ?? "");

  if (!email || !password) return { error: "Entre l'email et un mot de passe." };
  if (password.length < 8) return { error: "Le mot de passe doit faire au moins 8 caractères." };
  if (password !== confirm) return { error: "Les deux mots de passe ne sont pas identiques." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.code === "user_already_exists") {
      return { error: "Cet accès existe déjà. Utilise « Se connecter »." };
    }
    return { error: "Cette adresse n'a pas accès à l'espace privé." };
  }

  // Confirmation email désactivée : pas de session = email déjà inscrit.
  if (!data.session) {
    return { error: "Cet accès existe déjà. Utilise « Se connecter »." };
  }

  redirect("/admin");
}
