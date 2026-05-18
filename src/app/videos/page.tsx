"use client";

import { useState } from "react";

const videos = [
  { id: 1,  src: "/videos/video-01.mp4",  tag: "MATCH",        label: "Action en match",          cover: "/player-action-1.jpg" },
  { id: 2,  src: "/videos/video-02.mp4",  tag: "ENTRAÎNEMENT", label: "Technique individuelle",    cover: "/player-training-dribble.jpg" },
  { id: 3,  src: "/videos/video-03.mp4",  tag: "ENTRAÎNEMENT", label: "Dribble & contrôle",        cover: "/player-training-ball.jpg" },
  { id: 4,  src: "/videos/video-04.mp4",  tag: "ENTRAÎNEMENT", label: "Séance collective",         cover: "/player-training-team.jpg" },
  { id: 5,  src: "/videos/video-05.mp4",  tag: "MATCH",        label: "Action de jeu",             cover: "/player-action-2.jpg" },
  { id: 6,  src: "/videos/video-06.mp4",  tag: "ENTRAÎNEMENT", label: "Explosivité & vitesse",     cover: "/player-training-dribble.jpg" },
  { id: 7,  src: "/videos/video-07.mp4",  tag: "MATCH",        label: "Prise de balle",            cover: "/player-action-1.jpg" },
  { id: 8,  src: "/videos/video-08.mp4",  tag: "ENTRAÎNEMENT", label: "Passes & vision",           cover: "/player-training-ball.jpg" },
  { id: 9,  src: "/videos/video-09.mp4",  tag: "COMPÉTITION",  label: "CAN Rennes U15",            cover: "/player-can-rennes.jpg" },
  { id: 10, src: "/videos/video-10.mp4",  tag: "MATCH",        label: "Tournoi mai 2026",          cover: "/player-tournament-may.jpg" },
  { id: 11, src: "/videos/video-11.mp4",  tag: "MATCH",        label: "Match mai 2026 — Phase 1",  cover: "/player-match-may.jpg" },
  { id: 12, src: "/videos/video-12.mp4",  tag: "MATCH",        label: "Match mai 2026 — Phase 2",  cover: "/player-bench.jpg" },
  { id: 13, src: "/videos/video-13.mp4",  tag: "ENTRAÎNEMENT", label: "Préparation physique",      cover: "/player-training-team.jpg" },
];

const tagColor: Record<string, string> = {
  "MATCH":        "text-tertiary border-tertiary/40",
  "ENTRAÎNEMENT": "text-on-surface-variant border-outline-variant/40",
  "COMPÉTITION":  "text-tertiary border-tertiary/40",
};

const filterOptions = ["TOUT", "MATCH", "ENTRAÎNEMENT", "COMPÉTITION"];

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState("TOUT");
  const [playing, setPlaying] = useState<(typeof videos)[0] | null>(null);

  const filtered = videos.filter(
    (v) => activeFilter === "TOUT" || v.tag === activeFilter
  );

  return (
    <>
      <div className="flex-grow pt-6 pb-8 px-4 md:px-10 max-w-[1280px] w-full mx-auto">

        {/* Header */}
        <div className="mb-8 border-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4"
          style={{ borderColor: "rgba(68,71,78,0.2)" }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined" style={{ color: "#e9c349" }}>play_circle</span>
              <h2 style={{ fontFamily: "Oswald,sans-serif", fontSize: "22px", fontWeight: 700,
                textTransform: "uppercase", color: "#dbe3ed", letterSpacing: "-0.01em" }}>
                Vidéos &amp; Actions
              </h2>
            </div>
            <p style={{ color: "#8e9099", fontSize: "13px" }}>
              {videos.length} vidéos · Matchs, entraînements et compétitions — Anwar MEKDADI
            </p>
          </div>

          {/* Filtres */}
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  fontFamily: "Oswald,sans-serif", fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "6px 14px", borderRadius: "2px",
                  border: `1px solid ${activeFilter === f ? "#e9c349" : "rgba(68,71,78,0.4)"}`,
                  background: activeFilter === f ? "#e9c349" : "rgba(46,54,61,0.6)",
                  color: activeFilter === f ? "#0c141b" : "#8e9099",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grille vidéos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((video) => (
            <article
              key={video.id}
              onClick={() => setPlaying(video)}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
              style={{
                aspectRatio: "16/9",
                background: "#182028",
                border: "1px solid rgba(68,71,78,0.2)",
              }}
            >
              {/* Miniature */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.cover}
                alt={video.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c141b]/90 via-[#0c141b]/40 to-transparent" />

              {/* Bouton play */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "rgba(35,43,50,0.75)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(233,195,73,0.4)",
                    boxShadow: "0 0 20px rgba(233,195,73,0.2)",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: "#e9c349", fontSize: "28px",
                    fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                </div>
              </div>

              {/* Infos bas */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase mb-1 border backdrop-blur-sm bg-[#182028]/70 ${tagColor[video.tag]}`}
                >
                  {video.tag}
                </span>
                <p style={{ fontFamily: "Oswald,sans-serif", fontSize: "14px", fontWeight: 600,
                  color: "#dbe3ed", lineHeight: 1.2 }}>
                  {video.label}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t px-4 md:px-10 py-8 w-full" style={{ borderColor: "rgba(68,71,78,0.2)", background: "#070f16" }}>
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span style={{ fontFamily: "Oswald,sans-serif", fontSize: "18px", fontWeight: 700,
            color: "#e9c349", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
            ANWAR MEKDADI
          </span>
          <span style={{ color: "#8e9099", fontSize: "12px" }}>
            © 2026 · Profil officiel · Tous droits réservés
          </span>
        </div>
      </footer>

      {/* Modal lecteur vidéo */}
      {playing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(7,15,22,0.95)", backdropFilter: "blur(12px)" }}
          onClick={() => setPlaying(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(233,195,73,0.2)", boxShadow: "0 0 60px rgba(0,0,0,0.8)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: "#182028", borderBottom: "1px solid rgba(68,71,78,0.3)" }}>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border ${tagColor[playing.tag]}`}
                  style={{ background: "rgba(46,54,61,0.8)" }}>
                  {playing.tag}
                </span>
                <span style={{ fontFamily: "Oswald,sans-serif", fontSize: "15px", fontWeight: 600, color: "#dbe3ed" }}>
                  {playing.label}
                </span>
              </div>
              <button
                onClick={() => setPlaying(null)}
                style={{ color: "#8e9099", background: "none", border: "none", cursor: "pointer" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
              </button>
            </div>

            {/* Player */}
            <video
              src={playing.src}
              controls
              autoPlay
              playsInline
              className="w-full"
              style={{ background: "#0c141b", maxHeight: "70vh" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
