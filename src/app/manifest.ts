import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Elite Scout — Talent Football",
    short_name: "Elite Scout",
    description:
      "Profil joueur professionnel — visibilité clubs européens et Moyen-Orient",
    start_url: "/",
    display: "standalone",
    background_color: "#0c141b",
    theme_color: "#e9c349",
    icons: [{ src: "/icon.png", sizes: "192x192", type: "image/png" }],
  };
}
