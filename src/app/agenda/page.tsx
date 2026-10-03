"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RdvClub {
  name: string;
  logo: string | null;
  country: string;
}

interface Rdv {
  id: string;
  title: string;
  date: string;
  location: string | null;
  type: string;
  status: string;
  club: RdvClub;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  location: string;
  country: string;
  type: string;
  importance: string;
  tags: string | null;
  website?: string;
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const RDV_TYPE_STYLE: Record<string, React.CSSProperties> = {
  VISIO:    { background: "rgba(177,199,242,0.15)", color: "#b1c7f2", border: "1px solid rgba(177,199,242,0.4)" },
  TERRAIN:  { background: "rgba(74,222,128,0.10)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.4)" },
  ESSAI:    { background: "rgba(233,195,73,0.10)", color: "#e9c349", border: "1px solid rgba(233,195,73,0.4)" },
  MATCH:    { background: "rgba(249,115,22,0.10)", color: "#f97316", border: "1px solid rgba(249,115,22,0.4)" },
  REUNION:  { background: "rgba(168,85,247,0.10)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.4)" },
};

const RDV_STATUS_STYLE: Record<string, React.CSSProperties> = {
  PLANIFIE:  { background: "rgba(255,255,255,0.05)", color: "#aaa", border: "1px solid #555" },
  CONFIRME:  { background: "rgba(74,222,128,0.10)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.4)" },
  EFFECTUE:  { background: "rgba(177,199,242,0.10)", color: "#b1c7f2", border: "1px solid rgba(177,199,242,0.4)" },
  ANNULE:    { background: "rgba(239,68,68,0.10)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" },
};

const EVENT_IMPORTANCE_STYLE: Record<string, React.CSSProperties> = {
  CRITIQUE:  { background: "rgba(233,195,73,0.15)", color: "#e9c349", border: "1px solid rgba(233,195,73,0.5)" },
  IMPORTANT: { background: "rgba(177,199,242,0.15)", color: "#b1c7f2", border: "1px solid rgba(177,199,242,0.5)" },
  NORMAL:    { background: "rgba(255,255,255,0.05)", color: "#888", border: "1px solid #444" },
};

const EVENT_FILTERS = ["TOUS", "CRITIQUE", "IMPORTANT", "NORMAL"] as const;
type EventFilter = (typeof EVENT_FILTERS)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeFormat(dateStr: string, fmt: string) {
  try {
    return format(new Date(dateStr), fmt, { locale: fr });
  } catch {
    return dateStr;
  }
}

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="glass-card rounded-xl p-5 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`h-4 bg-surface-variant rounded mb-3 ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
      ))}
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl p-6 text-center"
      style={{ border: "1px solid #e9c349", background: "rgba(233,195,73,0.05)" }}
    >
      <span className="material-symbols-outlined text-[32px] mb-2 block" style={{ color: "#e9c349" }}>
        error
      </span>
      <p className="font-body-md text-body-md" style={{ color: "#e9c349" }}>
        {message}
      </p>
    </div>
  );
}

function Badge({ label, style }: { label: string; style: React.CSSProperties }) {
  return (
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded text-xs" style={style}>
      {label}
    </span>
  );
}

function RdvCard({ rdv }: { rdv: Rdv }) {
  const typeStyle = RDV_TYPE_STYLE[rdv.type] ?? RDV_TYPE_STYLE.VISIO;
  const statusStyle = RDV_STATUS_STYLE[rdv.status] ?? RDV_STATUS_STYLE.PLANIFIE;

  return (
    <div className="glass-card rounded-lg p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-surface-variant/30 transition-colors group">
      {/* Date column */}
      <div className="w-24 shrink-0 text-center md:text-left md:border-r border-outline-variant/30 pr-4">
        <p className="font-stat-value text-stat-value text-on-surface group-hover:text-tertiary transition-colors text-2xl">
          {safeFormat(rdv.date, "dd")}
        </p>
        <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs">
          {safeFormat(rdv.date, "MMM yyyy")}
        </p>
      </div>

      {/* Club + content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg shrink-0">{rdv.club.logo ?? "🏟️"}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{rdv.club.name}</span>
        </div>
        <p className="font-headline-sm text-headline-sm text-on-surface mb-2 truncate">{rdv.title}</p>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge label={rdv.type} style={typeStyle} />
          <Badge label={rdv.status} style={statusStyle} />
          {rdv.location && (
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {rdv.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const importanceStyle = EVENT_IMPORTANCE_STYLE[event.importance] ?? EVENT_IMPORTANCE_STYLE.NORMAL;
  const tags = parseTags(event.tags);

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:bg-surface-variant/30 transition-colors">
      {/* Header badges */}
      <div className="flex flex-wrap gap-2 items-center">
        <Badge label={event.importance} style={importanceStyle} />
        <span
          className="font-label-caps text-label-caps px-2 py-0.5 rounded text-xs"
          style={{ background: "rgba(255,255,255,0.05)", color: "#888", border: "1px solid #444" }}
        >
          {event.type}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-headline-sm text-headline-sm text-on-surface">{event.title}</h4>

      {/* Location */}
      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">location_on</span>
        {event.location}, {event.country}
      </p>

      {/* Dates */}
      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px] text-tertiary">calendar_month</span>
        <span style={{ color: "#e9c349" }}>{safeFormat(event.startDate, "dd MMM yyyy")}</span>
        {event.endDate && (
          <>
            <span className="text-on-surface-variant mx-1">→</span>
            <span style={{ color: "#e9c349" }}>{safeFormat(event.endDate, "dd MMM yyyy")}</span>
          </>
        )}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1 border-t border-outline-variant/10">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-label-caps text-label-caps px-2 py-0.5 rounded-full text-xs"
              style={{ background: "rgba(233,195,73,0.08)", color: "#e9c349", border: "1px solid rgba(233,195,73,0.2)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Lien officiel */}
      {event.website && (
        <a
          href={event.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-1 py-2 rounded font-label-caps text-label-caps text-xs uppercase transition-all"
          style={{
            background: "rgba(233,195,73,0.1)",
            border: "1px solid rgba(233,195,73,0.4)",
            color: "#e9c349",
          }}
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          Site officiel · S&apos;inscrire
        </a>
      )}
    </div>
  );
}

// ─── Données statiques — Compétitions de recrutement oct 2026 → été 2027 ──────

const STATIC_EVENTS: Event[] = [
  {
    id: "1",
    title: "Détections de District U17 — Ligue de Bretagne",
    description: "Sélections de district organisées par la Ligue de Bretagne (Ille-et-Vilaine, Finistère, Morbihan, Côtes-d'Armor). Voie d'accès à la sélection régionale LBF.",
    startDate: "2026-10-01",
    endDate: "2026-11-30",
    location: "Bretagne (4 districts)",
    country: "France 🇫🇷",
    type: "DÉTECTION",
    importance: "CRITIQUE",
    tags: JSON.stringify(["U17", "Ligue Bretagne", "District", "Sélection régionale"]),
    website: "https://foot35.fff.fr",
  },
  {
    id: "2",
    title: "Qualifications Euro U17 2027",
    description: "Tour de qualification pour l'Euro U17 UEFA — vitrine internationale pour les jeunes talents nationaux. Suivi par tous les scouts européens.",
    startDate: "2026-11-11",
    endDate: "2026-11-17",
    location: "Arménie",
    country: "Arménie 🇦🇲",
    type: "TOURNOI",
    importance: "IMPORTANT",
    tags: JSON.stringify(["U17", "UEFA", "Équipe de France", "Scout européen"]),
    website: "https://www.fff.fr",
  },
  {
    id: "3",
    title: "Sélection Régionale LBF U17 — Rassemblements",
    description: "Rassemblements inter-districts de la Ligue de Bretagne. Les meilleurs joueurs de district sont convoqués pour intégrer la sélection régionale.",
    startDate: "2026-12-01",
    endDate: "2027-01-31",
    location: "Rennes / Brest",
    country: "France 🇫🇷",
    type: "DÉTECTION",
    importance: "CRITIQUE",
    tags: JSON.stringify(["U17", "Sélection régionale", "LBF", "Inter-districts"]),
    website: "https://footbretagne.fff.fr",
  },
  {
    id: "4",
    title: "Winter Cup Rennes 2027",
    description: "Tournoi hivernal organisé par le Stade Rennais — format rapide, idéal pour la visibilité auprès des recruteurs du club.",
    startDate: "2027-01-10",
    endDate: "2027-01-12",
    location: "Rennes",
    country: "France 🇫🇷",
    type: "TOURNOI",
    importance: "IMPORTANT",
    tags: JSON.stringify(["U17", "Stade Rennais", "Détection hivernale"]),
    website: "https://www.staderennais.com",
  },
  {
    id: "5",
    title: "Pré-recrutement FC Brest (Stade Brestois 29)",
    description: "Journées de pré-recrutement du centre de formation du Stade Brestois pour la saison 2027-2028. Catégories U17 et U19.",
    startDate: "2027-01-15",
    endDate: "2027-02-28",
    location: "Brest",
    country: "France 🇫🇷",
    type: "DÉTECTION",
    importance: "IMPORTANT",
    tags: JSON.stringify(["U17", "Centre formation", "Ligue 1", "Brestois"]),
    website: "https://detectionsfoot.fr/bretagne/finistere/brest-fc",
  },
  {
    id: "6",
    title: "Pré-recrutement Stade Rennais FC",
    description: "Phase d'inscriptions et de présélections pour intégrer le centre de formation du Stade Rennais (ex-Dembélé, Camavinga, Doué). Centre de formation classé élite en France.",
    startDate: "2027-02-01",
    endDate: "2027-03-31",
    location: "Rennes",
    country: "France 🇫🇷",
    type: "DÉTECTION",
    importance: "CRITIQUE",
    tags: JSON.stringify(["U17", "Centre formation élite", "Stade Rennais", "Ligue 1"]),
    website: "https://detectionsfoot.fr/bretagne/ille-et-vilaine/stade-rennais-fc",
  },
  {
    id: "7",
    title: "Pré-recrutement FC Lorient",
    description: "Sélection pour intégrer le centre de formation du FC Lorient U17 National. Contact : centre.formation@fclorient.bzh / 02 97 35 15 07.",
    startDate: "2027-02-01",
    endDate: "2027-03-31",
    location: "Lorient",
    country: "France 🇫🇷",
    type: "DÉTECTION",
    importance: "CRITIQUE",
    tags: JSON.stringify(["U17", "Centre formation", "FC Lorient", "Ligue 2"]),
    website: "https://detectionsfoot.fr/bretagne/morbihan/fc-lorient",
  },
  {
    id: "8",
    title: "MIC Football — Mediterranean International Cup",
    description: "Tournoi de référence en Espagne — clubs de La Liga, Serie A et Ligue 1 présents. Forte visibilité pour le recrutement international.",
    startDate: "2027-03-28",
    endDate: "2027-04-01",
    location: "Costa Brava",
    country: "Espagne 🇪🇸",
    type: "TOURNOI",
    importance: "IMPORTANT",
    tags: JSON.stringify(["U17", "International", "La Liga scouts", "Serie A"]),
    website: "https://www.micfootball.com",
  },
  {
    id: "9",
    title: "Tournoi de Montaigu 2027",
    description: "Tournoi de référence mondial pour les sélections nationales U16/U17. Présence de scouts de l'ensemble des fédérations européennes et africaines.",
    startDate: "2027-04-12",
    endDate: "2027-04-16",
    location: "Montaigu",
    country: "France 🇫🇷",
    type: "TOURNOI",
    importance: "CRITIQUE",
    tags: JSON.stringify(["U17", "Sélections nationales", "International", "FFF"]),
    website: "https://www.tournoiedemontaigu.com",
  },
  {
    id: "10",
    title: "CAN U17 2027 — Maroc",
    description: "Coupe d'Afrique des Nations U17 organisée au Maroc. Vitrine continentale maximale pour les U17 franco-marocains suivis par la FRMF. 73% des joueurs Maroc A nés hors Maroc.",
    startDate: "2027-04-20",
    endDate: "2027-05-10",
    location: "Maroc",
    country: "Maroc 🇲🇦",
    type: "TOURNOI",
    importance: "CRITIQUE",
    tags: JSON.stringify(["U17", "FRMF", "Diaspora", "CAF", "Sélection nationale"]),
    website: "https://www.frmf.ma",
  },
  {
    id: "11",
    title: "Détection FRMF — Diaspora Europe",
    description: "Session de détection officielle de la Fédération Royale Marocaine en France pour les binationaux franco-marocains. Antenne Paris. La FRMF suit +3 000 joueurs de la diaspora européenne.",
    startDate: "2027-05-01",
    endDate: "2027-05-31",
    location: "Paris",
    country: "France 🇫🇷",
    type: "DÉTECTION",
    importance: "CRITIQUE",
    tags: JSON.stringify(["Maroc", "FRMF", "Diaspora", "Franco-marocain", "U17"]),
    website: "https://www.frmf.ma",
  },
  {
    id: "12",
    title: "Paris World Games 2027",
    description: "Tournoi international de détection — présence de scouts de Ligue 1, Bundesliga et Premier League. L'un des meilleurs vitrines pour les profils franco-marocains.",
    startDate: "2027-06-27",
    endDate: "2027-07-03",
    location: "Paris",
    country: "France 🇫🇷",
    type: "TOURNOI",
    importance: "CRITIQUE",
    tags: JSON.stringify(["U17", "U18", "International", "Ligue 1", "Scouts"]),
    website: "https://www.parisworldgames.com",
  },
  {
    id: "13",
    title: "Gothia Cup 2027",
    description: "Le plus grand tournoi de football jeunes au monde. Catégorie U17. Présence de scouts UEFA et clubs européens d'élite.",
    startDate: "2027-07-11",
    endDate: "2027-07-17",
    location: "Göteborg",
    country: "Suède 🇸🇪",
    type: "TOURNOI",
    importance: "CRITIQUE",
    tags: JSON.stringify(["U17", "International", "Scouts UEFA", "Mondial"]),
    website: "https://www.gothiacup.se",
  },
  {
    id: "14",
    title: "Dana Cup 2027",
    description: "Tournoi international Scandinavie — forte présence de recruteurs nordiques et clubs de Premier League.",
    startDate: "2027-07-20",
    endDate: "2027-07-25",
    location: "Hjørring",
    country: "Danemark 🇩🇰",
    type: "TOURNOI",
    importance: "IMPORTANT",
    tags: JSON.stringify(["U17", "International", "Scouts PL", "Scandinavie"]),
    website: "https://www.danacup.com",
  },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AgendaPage() {
  const [rdvs] = useState<Rdv[]>([]);
  const [events] = useState<Event[]>(STATIC_EVENTS);
  const [loadingRdvs] = useState(false);
  const [loadingEvents] = useState(false);
  const [errorRdvs] = useState<string | null>(null);
  const [errorEvents] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<EventFilter>("TOUS");

  const filteredEvents =
    eventFilter === "TOUS"
      ? events
      : events.filter((e) => e.importance === eventFilter);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          "radial-gradient(circle at top right, rgba(12,20,27,1) 0%, rgba(7,15,22,1) 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter md:py-margin-desktop">
        {/* Header */}
        <div className="mb-gutter md:mb-margin-desktop">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-unit">
            Recruitment Agenda
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Suivi stratégique des rendez-vous clubs et événements de recrutement.
          </p>
        </div>

        {/* ── Section 1: Mes RDV clubs ───────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined" style={{ color: "#e9c349" }}>event_available</span>
            <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
              Mes RDV clubs
            </h3>
            {!loadingRdvs && rdvs.length > 0 && (
              <span
                className="font-label-caps text-label-caps px-2 py-0.5 rounded-full text-xs"
                style={{ background: "rgba(177,199,242,0.15)", color: "#b1c7f2", border: "1px solid rgba(177,199,242,0.4)" }}
              >
                {rdvs.length}
              </span>
            )}
          </div>

          {loadingRdvs ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => <SkeletonCard key={i} rows={2} />)}
            </div>
          ) : errorRdvs ? (
            <ErrorCard message={errorRdvs} />
          ) : rdvs.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2 block">
                event_busy
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Aucun rendez-vous planifié.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {rdvs.map((rdv) => (
                <RdvCard key={rdv.id} rdv={rdv} />
              ))}
            </div>
          )}
        </section>

        {/* ── Section 2: Grands événements recrutement ──────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined" style={{ color: "#e9c349" }}>stadium</span>
            <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
              Grands événements recrutement
            </h3>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {EVENT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setEventFilter(f)}
                className="font-label-caps text-label-caps px-4 py-2 rounded-full border transition-colors"
                style={
                  eventFilter === f
                    ? { background: "#e9c349", color: "#0c141b", border: "1px solid #e9c349", boxShadow: "0 0 15px rgba(233,195,73,0.3)" }
                    : { background: "transparent", color: "#ccc", border: "1px solid rgba(255,255,255,0.15)" }
                }
              >
                {f}
              </button>
            ))}
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} rows={4} />)}
            </div>
          ) : errorEvents ? (
            <ErrorCard message={errorEvents} />
          ) : filteredEvents.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Aucun événement pour ce filtre.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
