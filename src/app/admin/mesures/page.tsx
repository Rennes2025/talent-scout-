import { ModulePending } from "../ModulePending";

export default function MesuresPage() {
  return (
    <ModulePending
      icon="monitor_weight"
      title="Mesures"
      step={4}
      description="Poids, masse musculaire, sprint 10 / 30 / 40 m, détente et VMA, testés toutes les 2 semaines, avec courbes de progression et records publiables sur la page Stats."
    />
  );
}
