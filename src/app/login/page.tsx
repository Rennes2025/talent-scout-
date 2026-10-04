"use client";

import { useActionState, useState } from "react";
import { createAccess, signIn, type LoginState } from "./actions";

const initialState: LoginState = {};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#8e9099",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0c141b",
  border: "1px solid rgba(219,227,237,0.18)",
  borderRadius: 8,
  padding: "14px 16px",
  color: "#dbe3ed",
  fontSize: 16,
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  background: "#e9c349",
  color: "#0c141b",
  fontFamily: "Oswald,sans-serif",
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  padding: "14px 20px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  marginTop: 4,
};

function Field({ id, label, ...props }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input id={id} name={id} required style={inputStyle} {...props} />
    </div>
  );
}

function SignInForm() {
  const [state, action, pending] = useActionState(signIn, initialState);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field id="email" label="Email" type="email" autoComplete="email" placeholder="prenom@gmail.com" />
      <Field id="password" label="Mot de passe" type="password" autoComplete="current-password" />
      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.6 : 1 }}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
      {state.error && <ErrorMessage text={state.error} />}
    </form>
  );
}

function CreateAccessForm() {
  const [state, action, pending] = useActionState(createAccess, initialState);
  return (
    <form action={action} className="flex flex-col gap-4">
      <Field id="email" label="Email" type="email" autoComplete="email" placeholder="prenom@gmail.com" />
      <Field id="password" label="Choisis un mot de passe" type="password" autoComplete="new-password" minLength={8} />
      <Field id="confirm" label="Répète le mot de passe" type="password" autoComplete="new-password" minLength={8} />
      <p style={{ fontSize: 12, color: "#8e9099", lineHeight: 1.5 }}>8 caractères minimum.</p>
      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.6 : 1 }}>
        {pending ? "Création…" : "Créer mon accès"}
      </button>
      {state.error && <ErrorMessage text={state.error} />}
    </form>
  );
}

function ErrorMessage({ text }: { text: string }) {
  return (
    <p role="alert" style={{ color: "#f87171", fontSize: 13, lineHeight: 1.5, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, padding: "10px 12px" }}>
      {text}
    </p>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "create">("signin");

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: "#0c141b" }}>
      <div className="w-full max-w-[380px] flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e9c349" }}>
            Espace privé
          </span>
          <h1 style={{ fontFamily: "Oswald,sans-serif", fontSize: 32, fontWeight: 700, textTransform: "uppercase", color: "#dbe3ed", lineHeight: 1 }}>
            Vestiaire
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-lg" style={{ background: "rgba(219,227,237,0.05)" }} role="tablist">
          {([
            ["signin", "Se connecter"],
            ["create", "Première connexion"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className="py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
              style={{
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: mode === value ? "#182028" : "transparent",
                color: mode === value ? "#e9c349" : "#8e9099",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "signin" ? <SignInForm /> : <CreateAccessForm />}
      </div>
    </div>
  );
}
