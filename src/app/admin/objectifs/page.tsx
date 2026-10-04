import { ModulePending } from "../ModulePending";

export default function ObjectifsPage() {
  return (
    <ModulePending
      icon="flag"
      title="Objectifs"
      step={3}
      description={"Objectifs court, moyen et long terme (ex : passer en R1, 30 m sous 4\"0), découpés en étapes avec une feuille de route."}
    />
  );
}
