"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ClubStatus =
  | "PROSPECT"
  | "CONTACTE"
  | "RDV_PLANIFIE"
  | "EN_ATTENTE"
  | "RELANCE"
  | "INTERESSE"
  | "NEGOCIE"
  | "CLOTURE";

interface Rdv {
  id: string;
  title: string;
  date: string;
  location: string | null;
  type: string;
  status: string;
}

interface Relance {
  id: string;
  message: string;
  channel: string;
  dueDate: string;
  done: boolean;
  club: { name: string; logo: string | null; country: string };
}

interface Club {
  id: string;
  name: string;
  country: string;
  league: string;
  region: string;
  logo: string | null;
  contactName: string | null;
  contactEmail: string | null;
  status: ClubStatus;
  rdvs: Rdv[];
  relances: Relance[];
}

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ClubStatus, { label: string; style: React.CSSProperties }> = {
  PROSPECT:     { label: "Prospect",      style: { background: "#3a3a3a", color: "#aaa", border: "1px solid #555" } },
  CONTACTE:     { label: "Contacté",      style: { background: "#1a2d4a", color: "#b1c7f2", border: "1px solid #b1c7f2" } },
  RDV_PLANIFIE: { label: "RDV Planifié",  style: { background: "#2e2610", color: "#e9c349", border: "1px solid #e9c349" } },
  EN_ATTENTE:   { label: "En attente",    style: { background: "#3a2200", color: "#f59e0b", border: "1px solid #f59e0b" } },
  RELANCE:      { label: "Relance",       style: { background: "#3a1000", color: "#f97316", border: "1px solid #f97316" } },
  INTERESSE:    { label: "Intéressé",     style: { background: "#0a2e1a", color: "#4ade80", border: "1px solid #4ade80" } },
  NEGOCIE:      { label: "Négocié",       style: { background: "#052e10", color: "#22c55e", border: "1px solid #22c55e" } },
  CLOTURE:      { label: "Clôturé",       style: { background: "#2a2a2a", color: "#888", border: "1px solid #555" } },
};

const ALL_STATUSES: ClubStatus[] = [
  "PROSPECT", "CONTACTE", "RDV_PLANIFIE", "EN_ATTENTE",
  "RELANCE", "INTERESSE", "NEGOCIE", "CLOTURE",
];

const CHANNEL_ICONS: Record<string, string> = {
  EMAIL:    "mail",
  TELEPHONE: "call",
  WHATSAPP: "chat",
  LINKEDIN: "share",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-surface-container-highest/60 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 bg-surface-variant rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-surface-variant rounded w-3/4 mb-2" />
          <div className="h-3 bg-surface-variant rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-surface-variant rounded w-full mb-2" />
      <div className="h-3 bg-surface-variant rounded w-4/5" />
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

function StatusBadge({ status }: { status: ClubStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PROSPECT;
  return (
    <span
      className="font-label-caps text-label-caps px-3 py-1 rounded text-xs"
      style={cfg.style}
    >
      {cfg.label}
    </span>
  );
}

function ClubCard({
  club,
  onStatusChange,
}: {
  club: Club;
  onStatusChange: (id: string, status: ClubStatus) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setUpdating(true);
    await onStatusChange(club.id, e.target.value as ClubStatus);
    setUpdating(false);
  }

  const upcomingRdvs = club.rdvs.filter((r) => r.status !== "ANNULE").slice(0, 3);
  const pendingRelances = club.relances.length;

  return (
    <div className="bg-surface-container-highest/60 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-5 flex flex-col gap-3 hover:border-outline-variant/40 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{club.logo ?? "🏟️"}</span>
          <div className="min-w-0">
            <p className="font-headline-sm text-headline-sm text-on-surface truncate">{club.name}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {club.league} — {club.country}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={club.status} />
        </div>
      </div>

      {/* Contact */}
      {(club.contactName || club.contactEmail) && (
        <div className="flex flex-col gap-0.5 text-sm">
          {club.contactName && (
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              👤 {club.contactName}
            </span>
          )}
          {club.contactEmail && (
            <a
              href={`mailto:${club.contactEmail}`}
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-tertiary transition-colors truncate"
            >
              ✉️ {club.contactEmail}
            </a>
          )}
        </div>
      )}

      {/* Upcoming RDVs */}
      {upcomingRdvs.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase text-xs mb-1">
            Prochains RDV
          </p>
          {upcomingRdvs.map((rdv) => (
            <div key={rdv.id} className="flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-[14px] text-tertiary">event</span>
              <span className="text-on-surface-variant">
                {new Date(rdv.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-on-surface truncate">{rdv.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer: relances badge + dropdown */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-outline-variant/10 mt-auto">
        {pendingRelances > 0 ? (
          <span
            className="font-label-caps text-label-caps px-2 py-0.5 rounded text-xs"
            style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid #f97316" }}
          >
            {pendingRelances} relance{pendingRelances > 1 ? "s" : ""}
          </span>
        ) : (
          <span />
        )}

        <select
          disabled={updating}
          value={club.status}
          onChange={handleStatusChange}
          className="bg-surface-container border border-outline-variant rounded px-2 py-1 text-on-surface font-body-sm text-xs focus:outline-none focus:border-tertiary appearance-none disabled:opacity-50 cursor-pointer"
          style={{ fontSize: "11px" }}
          aria-label="Changer statut"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function RelanceRow({
  relance,
  onMarkDone,
}: {
  relance: Relance;
  onMarkDone: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const isOverdue = new Date(relance.dueDate) < new Date();

  async function handleDone() {
    setLoading(true);
    await onMarkDone(relance.id);
    setLoading(false);
  }

  return (
    <div
      className="flex items-center justify-between gap-4 py-3 px-4 rounded-lg border transition-colors"
      style={
        isOverdue
          ? { borderColor: "rgba(249,115,22,0.4)", background: "rgba(249,115,22,0.05)" }
          : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="material-symbols-outlined text-[18px] shrink-0" style={{ color: isOverdue ? "#f97316" : "#e9c349" }}>
          {CHANNEL_ICONS[relance.channel] ?? "notifications"}
        </span>
        <div className="min-w-0">
          <p className="font-body-sm text-body-sm text-on-surface truncate">
            <span className="font-semibold">{relance.club.name}</span>
            {" — "}
            {relance.message}
          </p>
          <p
            className="font-label-caps text-label-caps text-xs mt-0.5"
            style={{ color: isOverdue ? "#f97316" : "#888" }}
          >
            {isOverdue ? "⚠️ En retard · " : ""}
            {new Date(relance.dueDate).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <button
        disabled={loading}
        onClick={handleDone}
        className="shrink-0 font-label-caps text-label-caps px-3 py-1.5 rounded border transition-colors disabled:opacity-50 text-xs"
        style={{ borderColor: "#4ade80", color: "#4ade80", background: "rgba(74,222,128,0.05)" }}
      >
        {loading ? "..." : "✓ Fait"}
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"EU" | "MIDDLE_EAST">("EU");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [relances, setRelances] = useState<Relance[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loadingRelances, setLoadingRelances] = useState(true);
  const [errorClubs, setErrorClubs] = useState<string | null>(null);
  const [errorRelances, setErrorRelances] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    type: "trial",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch clubs for active tab
  const fetchClubs = useCallback(async (region: string) => {
    setLoadingClubs(true);
    setErrorClubs(null);
    try {
      const res = await fetch(`/api/clubs?region=${region}`);
      if (!res.ok) throw new Error("Erreur lors du chargement des clubs");
      const data: Club[] = await res.json();
      setClubs(data);
    } catch (err) {
      setErrorClubs(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoadingClubs(false);
    }
  }, []);

  // ── Fetch pending relances
  const fetchRelances = useCallback(async () => {
    setLoadingRelances(true);
    setErrorRelances(null);
    try {
      const res = await fetch("/api/relances");
      if (!res.ok) throw new Error("Erreur lors du chargement des relances");
      const data: Relance[] = await res.json();
      setRelances(data);
    } catch (err) {
      setErrorRelances(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoadingRelances(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs(activeTab);
  }, [activeTab, fetchClubs]);

  useEffect(() => {
    fetchRelances();
  }, [fetchRelances]);

  // ── Update club status
  async function handleStatusChange(id: string, status: ClubStatus) {
    const res = await fetch(`/api/clubs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setClubs((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    }
  }

  // ── Mark relance as done
  async function handleMarkDone(id: string) {
    const res = await fetch("/api/relances", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setRelances((prev) => prev.filter((r) => r.id !== id));
    }
  }

  // ── Submit contact form (POST new club)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.organization || formData.name,
          country: "—",
          league: "—",
          region: "EU",
          contactName: formData.name,
          contactEmail: formData.email,
          notes: `[${formData.type}] ${formData.message}`,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        fetchClubs(activeTab);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Ambient Background */}
      <div
        className="fixed inset-0 z-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyEDEixbVcSPrIg2WUeIqw8RQgR0p55lB1gTmeawHlDGUDzQILCwltKnqQtZRwL9vY6Xw9RLAOsF_MJe8heERfinOkudK3gVvJ3SXXJd4K2EtomUrQg-NxlgxVbBjPtuRo_k2L5zqn4k5No6a__mlR3Ea6HdVFn8WMP-RbFd--fhlkjlpRr-hup6kL-298jnFXdUMxeE9m5MhShzjtw-Barc-v99ZJSYut4tvxN8TOslecVV0q39cV7qOkB0IJTn5ymCxlfml8qjw')",
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />

      <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-16">

        {/* ── Relances en attente ───────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined" style={{ color: "#e9c349" }}>notifications_active</span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              Relances en attente
            </h2>
            {relances.length > 0 && (
              <span
                className="font-label-caps text-label-caps px-2 py-0.5 rounded-full text-xs"
                style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid #f97316" }}
              >
                {relances.length}
              </span>
            )}
          </div>

          {loadingRelances ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-surface-variant animate-pulse" />
              ))}
            </div>
          ) : errorRelances ? (
            <ErrorCard message={errorRelances} />
          ) : relances.length === 0 ? (
            <div className="bg-surface-container/40 border border-outline-variant/10 rounded-xl p-6 text-center">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2 block">check_circle</span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Aucune relance en attente. Bravo !
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {relances.map((r) => (
                <RelanceRow key={r.id} relance={r} onMarkDone={handleMarkDone} />
              ))}
            </div>
          )}
        </div>

        {/* ── Main grid: hero + form ────────────────────────────────── */}
        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter items-start">
          {/* Left Column */}
          <div className="col-span-4 md:col-span-5 flex flex-col gap-10">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-4 uppercase tracking-tighter shadow-sm">
                Agent Portal
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Direct communication channel for official club inquiries, representation discussions,
                and contract negotiations.
              </p>
            </div>

            {/* CV Download */}
            <div className="bg-surface-variant/40 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <span
                  className="material-symbols-outlined text-[120px] text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  description
                </span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase mb-2">
                  Comprehensive Dossier
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                  Download the full technical profile, including verified metrics, match history, and
                  medical clearance summary.
                </p>
              </div>
              <button className="bg-tertiary text-on-tertiary font-label-caps text-label-caps px-6 py-4 rounded hover:bg-tertiary-container transition-colors duration-300 flex items-center justify-center gap-3 w-full sm:w-auto uppercase tracking-widest shadow-lg">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  download
                </span>
                Download CV Sportif
              </button>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container/60 border border-outline-variant/10 rounded-lg p-5 flex flex-col gap-2">
                <span className="material-symbols-outlined text-tertiary">location_on</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Current Base
                </span>
                <span className="font-body-md text-body-md text-on-surface">London, UK</span>
              </div>
              <div className="bg-surface-container/60 border border-outline-variant/10 rounded-lg p-5 flex flex-col gap-2">
                <span className="material-symbols-outlined text-tertiary">verified_user</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Representation
                </span>
                <span className="font-body-md text-body-md text-on-surface">Pro Scout Agency</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="col-span-4 md:col-span-7 md:pl-8 mt-10 md:mt-0">
            <div className="bg-surface-container-highest/60 backdrop-blur-2xl border border-outline-variant/20 rounded-xl p-8 md:p-12 shadow-2xl relative">
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-tertiary/50 to-transparent" />
              <h3 className="font-headline-md text-headline-md text-on-surface uppercase mb-8 flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  mail
                </span>
                Official Inquiry
              </h3>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <span
                    className="material-symbols-outlined text-tertiary text-[48px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <p className="font-headline-sm text-headline-sm text-on-surface uppercase">
                    Message Sent
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-center">
                    Your inquiry has been received. We will respond within 48 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 border border-outline-variant/50 text-on-surface font-label-caps text-label-caps uppercase px-6 py-3 rounded hover:bg-surface-variant transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label
                        className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                        htmlFor="name"
                      >
                        Full Name
                      </label>
                      <input
                        className="rounded px-4 py-3 font-body-md text-body-md bg-surface-container border border-outline-variant text-on-surface transition-colors duration-200 focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                        htmlFor="organization"
                      >
                        Organization / Club
                      </label>
                      <input
                        className="rounded px-4 py-3 font-body-md text-body-md bg-surface-container border border-outline-variant text-on-surface transition-colors duration-200 focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary"
                        id="organization"
                        name="organization"
                        placeholder="e.g. Real Madrid CF"
                        type="text"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({ ...formData, organization: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                      htmlFor="email"
                    >
                      Official Email
                    </label>
                    <input
                      className="rounded px-4 py-3 font-body-md text-body-md bg-surface-container border border-outline-variant text-on-surface transition-colors duration-200 focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary"
                      id="email"
                      name="email"
                      placeholder="scouting@club.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                      htmlFor="type"
                    >
                      Nature of Inquiry
                    </label>
                    <select
                      className="bg-surface-container border border-outline-variant rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-tertiary focus:ring-0 appearance-none"
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="trial">Trial Request</option>
                      <option value="data">Detailed Data Request</option>
                      <option value="representation">Representation Offer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-label-caps text-label-caps text-on-surface-variant uppercase"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      className="rounded px-4 py-3 font-body-md text-body-md bg-surface-container border border-outline-variant text-on-surface transition-colors duration-200 resize-none focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary"
                      id="message"
                      name="message"
                      placeholder="Provide details regarding your inquiry..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button
                    className="mt-4 bg-transparent border border-tertiary text-tertiary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-tertiary/10 transition-colors duration-300 uppercase tracking-widest self-start w-full sm:w-auto disabled:opacity-50"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Envoi..." : "Send Secure Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── CRM Section ───────────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-tertiary">business</span>
            <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
              CRM — Clubs Cibles
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            {(["EU", "MIDDLE_EAST"] as const).map((region) => (
              <button
                key={region}
                onClick={() => setActiveTab(region)}
                className="font-label-caps text-label-caps px-5 py-2.5 rounded-full border transition-colors"
                style={
                  activeTab === region
                    ? { background: "#e9c349", color: "#0c141b", border: "1px solid #e9c349", boxShadow: "0 0 15px rgba(233,195,73,0.3)" }
                    : { background: "transparent", color: "#ccc", border: "1px solid rgba(255,255,255,0.15)" }
                }
              >
                {region === "EU" ? "🌍 Clubs Européens" : "🕌 Moyen-Orient"}
              </button>
            ))}
          </div>

          {/* Club cards grid */}
          {loadingClubs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : errorClubs ? (
            <ErrorCard message={errorClubs} />
          ) : clubs.length === 0 ? (
            <div className="bg-surface-container/40 border border-outline-variant/10 rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-3 block">
                sports_soccer
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Aucun club dans cette région.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pre-Footer Socials */}
      <div className="relative z-10 w-full bg-surface-container-low/50 border-t border-outline-variant/10 py-8 hidden md:block">
        <div className="max-w-container-max mx-auto px-margin-desktop flex justify-center gap-8">
          <a
            className="text-on-surface-variant hover:text-tertiary transition-colors flex items-center gap-2 font-label-caps text-label-caps"
            href="#"
          >
            <span className="material-symbols-outlined">share</span>
            LINKEDIN
          </a>
          <a
            className="text-on-surface-variant hover:text-tertiary transition-colors flex items-center gap-2 font-label-caps text-label-caps"
            href="#"
          >
            <span className="material-symbols-outlined">play_circle</span>
            YOUTUBE
          </a>
          <a
            className="text-on-surface-variant hover:text-tertiary transition-colors flex items-center gap-2 font-label-caps text-label-caps"
            href="#"
          >
            <span className="material-symbols-outlined">photo_camera</span>
            INSTAGRAM
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-outline-variant/20 bg-surface-container-lowest">
        <div className="flex flex-col md:flex-row justify-between items-center py-margin-desktop px-margin-desktop gap-unit w-full max-w-container-max mx-auto">
          <div className="font-headline-sm text-headline-sm text-tertiary uppercase tracking-tighter mb-4 md:mb-0">
            ANWAR MEKDADI
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <a
              className="text-on-surface-variant hover:text-tertiary transition-colors font-body-sm text-body-sm"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-surface-variant hover:text-tertiary transition-colors font-body-sm text-body-sm"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-tertiary underline hover:text-tertiary transition-colors font-body-sm text-body-sm"
              href="#"
            >
              Agent Portal
            </a>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface text-center md:text-right">
            © 2024 PROSPECT ANALYTICS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </>
  );
}
