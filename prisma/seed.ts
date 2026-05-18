import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding Elite Scout database...");

  // ── Clubs Européens ──────────────────────────────────────────────────────────
  const euClubs = [
    { name: "Paris Saint-Germain", country: "France",     league: "Ligue 1",        logo: "🇫🇷", contactName: "Luis Campos",       contactEmail: "scouting@psg.fr",       status: "RDV_PLANIFIE" },
    { name: "Arsenal FC",          country: "Angleterre", league: "Premier League",  logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", contactName: "Edu Gaspar",         contactEmail: "scouting@arsenal.com",  status: "INTERESSE"    },
    { name: "Borussia Dortmund",   country: "Allemagne",  league: "Bundesliga",      logo: "🇩🇪", contactName: "Sven Mislintat",    contactEmail: "scout@bvb.de",          status: "CONTACTE"     },
    { name: "AFC Ajax",            country: "Pays-Bas",   league: "Eredivisie",      logo: "🇳🇱", contactName: "Hendrik Almstadt", contactEmail: "recruitment@ajax.nl",   status: "EN_ATTENTE"   },
    { name: "AS Monaco",           country: "France",     league: "Ligue 1",         logo: "🇲🇨", contactName: "Paul Mitchell",     contactEmail: "scout@asmonaco.com",    status: "RELANCE"      },
    { name: "Benfica",             country: "Portugal",   league: "Primeira Liga",   logo: "🇵🇹", contactName: "Rui Costa",         contactEmail: "scouting@slbenfica.pt", status: "PROSPECT"     },
    { name: "Atletico de Madrid",  country: "Espagne",    league: "LaLiga",          logo: "🇪🇸", contactName: "Andrea Berta",      contactEmail: "scouting@atletico.es",  status: "CONTACTE"     },
    { name: "Atalanta BC",         country: "Italie",     league: "Serie A",         logo: "🇮🇹", contactName: "Tony D'Amico",      contactEmail: "scout@atalanta.it",     status: "PROSPECT"     },
  ];

  const meClubs = [
    { name: "Al-Nassr FC",     country: "Arabie Saoudite", league: "Saudi Pro League",   logo: "🇸🇦", contactName: "Hamid Estili",     contactEmail: "scouting@alnassr.com",  status: "RDV_PLANIFIE" },
    { name: "Al-Hilal SFC",    country: "Arabie Saoudite", league: "Saudi Pro League",   logo: "🇸🇦", contactName: "Jorge Jesus",      contactEmail: "scout@alhilal.com",     status: "INTERESSE"    },
    { name: "Al-Ain FC",       country: "Émirats Arabes",  league: "UAE Pro League",     logo: "🇦🇪", contactName: "Hernan Crespo",    contactEmail: "recruitment@alain.ae",  status: "CONTACTE"     },
    { name: "Al Sadd SC",      country: "Qatar",           league: "Qatar Stars League", logo: "🇶🇦", contactName: "Xavi Hernandez",   contactEmail: "scout@alsadd.qa",       status: "EN_ATTENTE"   },
    { name: "Al-Ahli SC",      country: "Arabie Saoudite", league: "Saudi Pro League",   logo: "🇸🇦", contactName: "Matthias Jaissle", contactEmail: "scouting@alahli.sa",    status: "PROSPECT"     },
    { name: "Al Jazira Club",  country: "Émirats Arabes",  league: "UAE Pro League",     logo: "🇦🇪", contactName: "Costinha",         contactEmail: "scout@aljazira.ae",     status: "RELANCE"      },
  ];

  const mkId = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  for (const c of euClubs) {
    const id = mkId(c.name);
    await prisma.club.upsert({
      where:  { id },
      update: {},
      create: { id, region: "EU",          notes: "Club identifié par le réseau scouting France.", ...c },
    });
  }
  for (const c of meClubs) {
    const id = mkId(c.name);
    await prisma.club.upsert({
      where:  { id },
      update: {},
      create: { id, region: "MIDDLE_EAST", notes: "Club cible pour le marché Moyen-Orient.",       ...c },
    });
  }

  // ── RDV ──────────────────────────────────────────────────────────────────────
  const rdvs = [
    { id: "rdv-1", clubId: "paris-saint-germain", title: "Visio initiale avec le staff scouting", date: new Date("2026-06-05T14:00:00"), type: "VISIO",   status: "CONFIRME", location: "Zoom"               },
    { id: "rdv-2", clubId: "al-nassr-fc",          title: "Essai terrain Riyadh",                  date: new Date("2026-06-18T09:00:00"), type: "ESSAI",   status: "PLANIFIE", location: "Riyadh, Arabie Saoudite" },
    { id: "rdv-3", clubId: "arsenal-fc",           title: "Présentation vidéo staff technique",    date: new Date("2026-06-12T16:30:00"), type: "VISIO",   status: "PLANIFIE", location: "Teams"              },
    { id: "rdv-4", clubId: "al-hilal-sfc",         title: "Réunion directeur sportif",             date: new Date("2026-07-02T10:00:00"), type: "REUNION", status: "PLANIFIE", location: "Djeddah"            },
    { id: "rdv-5", clubId: "borussia-dortmund",    title: "Match test vs équipe réserve",          date: new Date("2026-07-10T15:00:00"), type: "MATCH",   status: "PLANIFIE", location: "Signal Iduna Park"  },
  ];
  for (const r of rdvs) {
    await prisma.rdv.upsert({ where: { id: r.id }, update: {}, create: r });
  }

  // ── Relances ──────────────────────────────────────────────────────────────────
  const d = (offset: number) => { const dt = new Date(); dt.setDate(dt.getDate() + offset); return dt; };
  const relances = [
    { id: "rel-1", clubId: "as-monaco",      message: "Relance suite à l'envoi du dossier vidéo — demander retour du staff.", channel: "EMAIL",     dueDate: d(3),  done: false },
    { id: "rel-2", clubId: "al-ain-fc",       message: "Appel de confirmation pour la venue du scouting en juin.",             channel: "TELEPHONE", dueDate: d(7),  done: false },
    { id: "rel-3", clubId: "al-jazira-club",  message: "WhatsApp au directeur Costinha — confirmer intérêt.",                  channel: "WHATSAPP",  dueDate: d(-1), done: false },
    { id: "rel-4", clubId: "afc-ajax",        message: "Email de suivi — 2 semaines sans retour.",                             channel: "EMAIL",     dueDate: d(3),  done: false },
  ];
  for (const r of relances) {
    await prisma.relance.upsert({ where: { id: r.id }, update: {}, create: r });
  }

  // ── Événements ────────────────────────────────────────────────────────────────
  const events = [
    { id: "evt-1", title: "Tournoi Maurice Revello (Toulon)",    description: "Tournoi international U21 — 8 sélections, scouts de 30 clubs pro.",               startDate: new Date("2026-05-25"), endDate: new Date("2026-06-08"), location: "Toulon, France",          country: "France",         type: "TOURNOI",            importance: "CRITIQUE",  tags: JSON.stringify(["France U21","International","Scouts EU"])         },
    { id: "evt-2", title: "Championnat Europe U19 UEFA",         description: "Phase finale U19 — visibilité maximale pour clubs européens et agents.",           startDate: new Date("2026-07-14"), endDate: new Date("2026-07-28"), location: "Munich, Allemagne",       country: "Allemagne",      type: "MATCH_INTERNATIONAL",importance: "CRITIQUE",  tags: JSON.stringify(["UEFA","U19","Scouts EU","Bundesliga"])            },
    { id: "evt-3", title: "Coupe du Monde des Clubs FIFA",       description: "Recruteurs de tous grands clubs — opportunité de visibilité internationale.",      startDate: new Date("2026-06-15"), endDate: new Date("2026-07-13"), location: "New York, USA",           country: "États-Unis",     type: "COUPE",              importance: "CRITIQUE",  tags: JSON.stringify(["FIFA","International","Moyen-Orient","EU"])       },
    { id: "evt-4", title: "Saudi Pro League — Journée Scouting", description: "Journée officielle scouting organisée par la Saudi Football Federation.",          startDate: new Date("2026-06-20"), endDate: null,                  location: "Riyadh, Arabie Saoudite", country: "Arabie Saoudite",type: "SHOWCASE",           importance: "IMPORTANT", tags: JSON.stringify(["Saudi Pro League","Moyen-Orient","SPL"])          },
    { id: "evt-5", title: "Dubai Football Combine",              description: "Combine recrutement — clubs UAE, Qatar et Arabie Saoudite présents.",              startDate: new Date("2026-07-05"), endDate: new Date("2026-07-07"), location: "Dubai, Émirats Arabes",   country: "Émirats Arabes", type: "COMBINE",            importance: "IMPORTANT", tags: JSON.stringify(["UAE Pro League","Dubai","Qatar","Moyen-Orient"])  },
    { id: "evt-6", title: "Stage Sélection France U19",          description: "Rassemblement national — vitrine pour les clubs et agents présents.",              startDate: new Date("2026-06-02"), endDate: new Date("2026-06-06"), location: "Clairefontaine, France",  country: "France",         type: "STAGE",              importance: "IMPORTANT", tags: JSON.stringify(["France U19","FFF","Clairefontaine"])              },
  ];
  for (const e of events) {
    await prisma.event.upsert({ where: { id: e.id }, update: {}, create: e });
  }

  console.log("✅ Seed terminé — 14 clubs, 5 RDV, 4 relances, 6 événements créés.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
