import { ModulePending } from "../ModulePending";

export default function CoachPage() {
  return (
    <ModulePending
      icon="sports"
      title="Coach"
      step={5}
      description="Brief à 8 h avec le programme du jour, débrief à 21 h (séances faites, ressenti, fatigue). Le coach adapte le lendemain et prépare un bilan chaque dimanche."
    />
  );
}
