import { getMember } from "@/lib/admin";

const roadmap = [
  { step: 1, label: "Connexion & espace privé", done: true },
  { step: 2, label: "Routine du jour", done: false },
  { step: 3, label: "Objectifs & feuille de route", done: false },
  { step: 4, label: "Mesures physiques", done: false },
  { step: 5, label: "Coach IA matin et soir", done: false },
  { step: 6, label: "Notifications & bilan hebdo", done: false },
];

export default async function AdminTodayPage() {
  const member = await getMember();
  const firstName = member.fullName.split(" ")[0];
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <span style={{ fontSize: 13, color: "#8e9099", textTransform: "capitalize" }}>{today}</span>
        <h1 style={{ fontFamily: "Oswald,sans-serif", fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 700, textTransform: "uppercase", color: "#dbe3ed", lineHeight: 1.05 }}>
          {member.role === "athlete" ? `Salut ${firstName}` : `Bonjour ${firstName}`}
        </h1>
        <p style={{ color: "#c4c6cf", fontSize: 14, lineHeight: 1.6, maxWidth: 520 }}>
          {member.role === "athlete"
            ? "Ton espace d'entraînement personnel. La routine du jour arrive ici à la prochaine étape."
            : "Ton espace de suivi. Tu verras ici la régularité d'Anwar, ses objectifs et ses progrès."}
        </p>
      </div>

      <section className="glass-card rounded-xl p-5 md:p-6" style={{ maxWidth: 560 }}>
        <h2 style={{ fontFamily: "Oswald,sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8e9099", marginBottom: 14 }}>
          Mise en place
        </h2>
        <ol className="flex flex-col gap-3">
          {roadmap.map((item) => (
            <li key={item.step} className="flex items-center gap-3">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, color: item.done ? "#4ade80" : "rgba(219,227,237,0.25)", fontVariationSettings: item.done ? "'FILL' 1" : "'FILL' 0" }}
                aria-hidden
              >
                {item.done ? "check_circle" : "radio_button_unchecked"}
              </span>
              <span style={{ fontSize: 14, color: item.done ? "#dbe3ed" : "#8e9099" }}>
                <span style={{ fontVariantNumeric: "tabular-nums", color: "#8e9099", marginRight: 8 }}>{item.step}.</span>
                {item.label}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
