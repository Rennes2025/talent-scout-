export function ModulePending({ icon, title, step, description }: {
  icon: string;
  title: string;
  step: number;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined" style={{ color: "#e9c349", fontSize: 26 }}>{icon}</span>
        <h1 style={{ fontFamily: "Oswald,sans-serif", fontSize: 26, fontWeight: 700, textTransform: "uppercase", color: "#dbe3ed" }}>
          {title}
        </h1>
      </div>
      <div className="glass-card rounded-xl p-6 flex flex-col gap-2" style={{ maxWidth: 560 }}>
        <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8e9099" }}>
          Arrive à l&apos;étape {step}
        </span>
        <p style={{ color: "#c4c6cf", fontSize: 14, lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}
