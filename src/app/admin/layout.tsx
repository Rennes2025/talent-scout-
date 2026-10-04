import type { Metadata } from "next";
import { getMember } from "@/lib/admin";
import { signOut } from "./actions";
import { AdminBottomTabs, AdminTopTabs } from "./AdminNav";

export const metadata: Metadata = {
  title: "Vestiaire — Anwar MEKDADI",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const member = await getMember();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0c141b" }}>
      <header
        className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 md:px-10 h-16"
        style={{ background: "rgba(12,20,27,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(219,227,237,0.08)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="material-symbols-outlined" style={{ color: "#e9c349", fontSize: 26 }}>sports_soccer</span>
          <div className="flex flex-col leading-tight min-w-0">
            <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 700, textTransform: "uppercase", color: "#dbe3ed" }}>
              Vestiaire
            </span>
            <span style={{ fontSize: 11, color: "#8e9099" }} className="truncate">
              {member.fullName} · {member.role === "coach" ? "Suivi" : "Joueur"}
            </span>
          </div>
        </div>

        <AdminTopTabs />

        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
            style={{ color: "#8e9099", fontSize: 12, background: "transparent", border: "1px solid rgba(219,227,237,0.12)", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </form>
      </header>

      <main className="flex-grow w-full max-w-[1100px] mx-auto px-4 md:px-10 pt-6 pb-28 md:pb-12">
        {children}
      </main>

      <AdminBottomTabs />
    </div>
  );
}
