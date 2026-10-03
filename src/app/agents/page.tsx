"use client";

export default function AgentsPage() {
  return (
    <>
      <div className="flex-grow pt-6 pb-8 px-4 md:px-10 max-w-[1280px] w-full mx-auto">

        {/* Header */}
        <div className="mb-8 border-b pb-6" style={{ borderColor: "rgba(68,71,78,0.2)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined" style={{ color: "#e9c349" }}>handshake</span>
            <h2 style={{ fontFamily: "Oswald,sans-serif", fontSize: "22px", fontWeight: 700,
              textTransform: "uppercase", color: "#dbe3ed", letterSpacing: "-0.01em" }}>
              Agents &amp; Scouts — Bretagne
            </h2>
          </div>
          <p style={{ color: "#8e9099", fontSize: "13px", maxWidth: "560px" }}>
            Agents sportifs licenciés FFF et centres de formation identifiés en région Bretagne.
            Données issues de la liste officielle FFF et detectionsfoot.fr.
          </p>
        </div>

        {/* Carte + agents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* Carte SVG Bretagne */}
          <div className="glass-card rounded-xl p-5">
            <p style={{ fontFamily: "Oswald,sans-serif", fontSize: "10px", fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "#8e9099", marginBottom: "14px" }}>
              📍 Localisation — Région Bretagne
            </p>
            <svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block" }}>
              <path d="M420,160 L440,130 L460,100 L450,70 L430,50 L400,40 L370,45 L340,38 L310,30 L280,28 L250,32 L220,28 L190,25 L160,30 L130,40 L100,52 L70,60 L50,80 L30,100 L20,125 L18,150 L22,175 L30,195 L20,215 L22,235 L35,250 L55,255 L80,250 L100,260 L120,270 L145,278 L170,282 L195,288 L220,290 L250,292 L280,288 L310,285 L340,288 L365,295 L388,300 L405,295 L415,280 L420,260 L418,240 L430,220 L440,200 L435,180 L420,160 Z"
                fill="rgba(14,22,30,0.7)" stroke="rgba(219,227,237,0.18)" strokeWidth="1.5" strokeLinejoin="round" />

              {/* Rennes — agent identifié */}
              <g>
                <circle cx="368" cy="255" r="12" fill="rgba(233,195,73,0.12)" stroke="#e9c349" strokeWidth="1.5" />
                <circle cx="368" cy="255" r="5" fill="#e9c349" />
                <circle cx="368" cy="255" r="12" fill="none" stroke="#e9c349" strokeWidth="0.8" opacity="0.4">
                  <animate attributeName="r" from="12" to="24" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <text x="383" y="251" fontFamily="Oswald,sans-serif" fontSize="10" fill="#dbe3ed" textAnchor="start" letterSpacing="0.06em" style={{textTransform:"uppercase"}}>Rennes</text>
                <text x="383" y="263" fontFamily="Oswald,sans-serif" fontSize="8" fill="rgba(233,195,73,0.7)" textAnchor="start">Talentz Sport Mgmt</text>
              </g>

              {/* Brest */}
              <g>
                <circle cx="52" cy="135" r="8" fill="rgba(177,199,242,0.12)" stroke="rgba(177,199,242,0.35)" strokeWidth="1.5" />
                <circle cx="52" cy="135" r="3.5" fill="#b1c7f2" />
                <text x="63" y="131" fontFamily="Oswald,sans-serif" fontSize="10" fill="#8e9099" letterSpacing="0.06em">Brest</text>
                <text x="63" y="142" fontFamily="Oswald,sans-serif" fontSize="8" fill="rgba(177,199,242,0.6)">Stade Brestois 29</text>
              </g>

              {/* Lorient */}
              <g>
                <circle cx="165" cy="295" r="8" fill="rgba(177,199,242,0.12)" stroke="rgba(177,199,242,0.35)" strokeWidth="1.5" />
                <circle cx="165" cy="295" r="3.5" fill="#b1c7f2" />
                <text x="176" y="291" fontFamily="Oswald,sans-serif" fontSize="10" fill="#8e9099" letterSpacing="0.06em">Lorient</text>
                <text x="176" y="302" fontFamily="Oswald,sans-serif" fontSize="8" fill="rgba(177,199,242,0.6)">FC Lorient</text>
              </g>

              {/* Vannes */}
              <g>
                <circle cx="268" cy="295" r="7" fill="rgba(255,255,255,0.04)" stroke="rgba(219,227,237,0.2)" strokeWidth="1.2" />
                <circle cx="268" cy="295" r="3" fill="rgba(219,227,237,0.5)" />
                <text x="278" y="303" fontFamily="Oswald,sans-serif" fontSize="10" fill="#8e9099" letterSpacing="0.06em">Vannes</text>
              </g>

              {/* Saint-Brieuc */}
              <g>
                <circle cx="228" cy="68" r="7" fill="rgba(255,255,255,0.04)" stroke="rgba(219,227,237,0.2)" strokeWidth="1.2" />
                <circle cx="228" cy="68" r="3" fill="rgba(219,227,237,0.5)" />
                <text x="240" y="65" fontFamily="Oswald,sans-serif" fontSize="10" fill="#8e9099" letterSpacing="0.06em">St-Brieuc</text>
              </g>

              {/* Quimper */}
              <g>
                <circle cx="98" cy="240" r="7" fill="rgba(255,255,255,0.04)" stroke="rgba(219,227,237,0.2)" strokeWidth="1.2" />
                <circle cx="98" cy="240" r="3" fill="rgba(219,227,237,0.5)" />
                <text x="110" y="237" fontFamily="Oswald,sans-serif" fontSize="10" fill="#8e9099" letterSpacing="0.06em">Quimper</text>
              </g>

              {/* Légende */}
              <g transform="translate(12,308)">
                <circle r="5" cx="5" cy="5" fill="rgba(233,195,73,0.12)" stroke="#e9c349" strokeWidth="1.2" />
                <circle r="2" cx="5" cy="5" fill="#e9c349" />
                <text x="14" y="9" fontFamily="Oswald,sans-serif" fontSize="8.5" fill="rgba(233,195,73,0.8)" letterSpacing="0.05em">Agent licencié FFF</text>
                <circle r="5" cx="5" cy="20" fill="rgba(177,199,242,0.12)" stroke="rgba(177,199,242,0.35)" strokeWidth="1.2" />
                <circle r="2" cx="5" cy="20" fill="#b1c7f2" />
                <text x="14" y="24" fontFamily="Oswald,sans-serif" fontSize="8.5" fill="rgba(177,199,242,0.7)" letterSpacing="0.05em">Centre de formation pro</text>
              </g>
            </svg>
          </div>

          {/* Fiches agents */}
          <div className="flex flex-col gap-4">

            {/* Agent 1 — Talentz */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-3" style={{ border: "1px solid rgba(233,195,73,0.25)", background: "linear-gradient(135deg, #182028 0%, rgba(233,195,73,0.03) 100%)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(233,195,73,0.12)", border: "1px solid rgba(233,195,73,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏆</div>
                  <div>
                    <p style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 600, color: "#dbe3ed", lineHeight: 1.2 }}>Cédric Collin</p>
                    <p style={{ fontSize: 12, color: "#e9c349", fontWeight: 500, marginTop: 2 }}>Talentz Sport Management</p>
                  </div>
                </div>
                <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: "rgba(233,195,73,0.12)", border: "1px solid rgba(233,195,73,0.3)", color: "#e9c349", whiteSpace: "nowrap" }}>Rennes</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {["Agent licencié FFF", "Transferts pro", "Jeunes talents"].map(tag => (
                  <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8e9099", fontFamily: "Oswald,sans-serif", fontWeight: 500, letterSpacing: "0.05em" }}>{tag}</span>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid rgba(68,71,78,0.3)" }}>
                <div className="flex items-center gap-2" style={{ fontSize: 12.5, color: "#8e9099" }}>
                  <span style={{ fontSize: 13, color: "#e9c349", width: 16, textAlign: "center" }}>📍</span>
                  43 Rue de Vern, 35200 Rennes
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 12.5, color: "#8e9099" }}>
                  <span style={{ fontSize: 13, color: "#e9c349", width: 16, textAlign: "center" }}>📞</span>
                  <a href="tel:+33614793877" style={{ color: "#8e9099", textDecoration: "none" }}>06 14 79 38 77</a>
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 12.5, color: "#8e9099" }}>
                  <span style={{ fontSize: 13, color: "#e9c349", width: 16, textAlign: "center" }}>✉️</span>
                  <a href="mailto:c.collin@talentz.fr" style={{ color: "#8e9099", textDecoration: "none" }}>c.collin@talentz.fr</a>
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 12.5, color: "#8e9099" }}>
                  <span style={{ fontSize: 13, color: "#e9c349", width: 16, textAlign: "center" }}>🌐</span>
                  <a href="https://www.talentz.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#8e9099", textDecoration: "none" }}>talentz.fr</a>
                </div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "Oswald,sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", width: "fit-content" }}>✓ Listé FFF officiel</span>
            </div>

            {/* Agent 2 — SonastiTalent */}
            <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(177,199,242,0.12)", border: "1px solid rgba(177,199,242,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🌍</div>
                  <div>
                    <p style={{ fontFamily: "Oswald,sans-serif", fontSize: 16, fontWeight: 600, color: "#dbe3ed", lineHeight: 1.2 }}>Nassim Tireche</p>
                    <p style={{ fontSize: 12, color: "#b1c7f2", fontWeight: 500, marginTop: 2 }}>SonastiTalent</p>
                  </div>
                </div>
                <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: "rgba(177,199,242,0.12)", border: "1px solid rgba(177,199,242,0.3)", color: "#b1c7f2", whiteSpace: "nowrap" }}>Paris</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {["Agent licencié FFF", "Profils franco-marocains", "Ex-Canal+ / L'Équipe"].map(tag => (
                  <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8e9099", fontFamily: "Oswald,sans-serif", fontWeight: 500, letterSpacing: "0.05em" }}>{tag}</span>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid rgba(68,71,78,0.3)" }}>
                <div className="flex items-center gap-2" style={{ fontSize: 12.5, color: "#8e9099" }}>
                  <span style={{ fontSize: 13, color: "#b1c7f2", width: 16, textAlign: "center" }}>✉️</span>
                  <a href="mailto:nassim@sonastitalent.com" style={{ color: "#8e9099", textDecoration: "none" }}>nassim@sonastitalent.com</a>
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 12.5, color: "#8e9099" }}>
                  <span style={{ fontSize: 13, color: "#b1c7f2", width: 16, textAlign: "center" }}>🌐</span>
                  <a href="https://sonastitalent.com" target="_blank" rel="noopener noreferrer" style={{ color: "#8e9099", textDecoration: "none" }}>sonastitalent.com</a>
                </div>
              </div>
              <div style={{ background: "rgba(177,199,242,0.07)", border: "1px solid rgba(177,199,242,0.15)", borderRadius: 6, padding: "8px 10px", fontSize: 11.5, color: "#8e9099", lineHeight: 1.5 }}>
                Spécialiste diaspora franco-marocaine. Réseau FRMF et clubs nord-africains. Idéal pour la double filière France–Maroc.
              </div>
            </div>

            {/* Note FFF */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(68,71,78,0.3)", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8e9099", marginBottom: 6 }}>ℹ️ Trouver plus d&apos;agents</p>
              <p style={{ fontSize: 12, color: "#8e9099", lineHeight: 1.6 }}>
                Liste complète sur <strong style={{ color: "#dbe3ed" }}>fff.fr → agents licenciés</strong>. Rechercher «&nbsp;Bretagne&nbsp;» pour tous les intermédiaires actifs de la région.
              </p>
              <a href="https://www.fff.fr/agents-sportifs-fff/liste-des-agents-licencies.html" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 11, fontFamily: "Oswald,sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#e9c349", textDecoration: "none" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                Consulter la liste FFF
              </a>
            </div>
          </div>
        </div>

        {/* Centres de formation */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined" style={{ color: "#e9c349" }}>stadium</span>
            <h3 style={{ fontFamily: "Oswald,sans-serif", fontSize: 17, fontWeight: 600, textTransform: "uppercase", color: "#dbe3ed" }}>Centres de formation pro — Bretagne</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { city: "Rennes · Ligue 1", name: "Stade Rennais FC", desc: "Centre élite. Ex-Dembélé, Camavinga, Doué. Pré-recrutements fév–mars 2027.", url: "https://detectionsfoot.fr/bretagne/ille-et-vilaine/stade-rennais-fc", color: "#e9c349" },
              { city: "Lorient · Ligue 2", name: "FC Lorient", desc: "U19 National. Contact : 02 97 35 15 07 · secretariat.asso@fclorient.bzh", url: "https://detectionsfoot.fr/bretagne/morbihan/fc-lorient", color: "#b1c7f2" },
              { city: "Brest · Ligue 1", name: "Stade Brestois 29", desc: "Centre actif. Recrutement 2027-2028 ouvert. Vitrine UEFA Conference League.", url: "https://detectionsfoot.fr/bretagne/finistere/brest-fc", color: "#b1c7f2" },
              { city: "Vannes · National", name: "Vannes OC", desc: "Structure professionnalisée. Recrutement 2027 actif.", url: "https://detectionsfoot.fr/bretagne/morbihan/vannes-oc", color: "#8e9099" },
            ].map(c => (
              <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
                className="glass-card rounded-xl p-4 flex flex-col gap-2 hover:border-[rgba(233,195,73,0.3)] transition-colors"
                style={{ textDecoration: "none", borderColor: "rgba(68,71,78,0.2)" }}>
                <p style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: c.color }}>{c.city}</p>
                <p style={{ fontFamily: "Oswald,sans-serif", fontSize: 14, fontWeight: 600, color: "#dbe3ed" }}>{c.name}</p>
                <p style={{ fontSize: 11.5, color: "#8e9099", lineHeight: 1.5, flex: 1 }}>{c.desc}</p>
                <span style={{ fontSize: 18, color: "#e9c349", marginTop: "auto" }}>→</span>
              </a>
            ))}
          </div>
        </section>

        {/* Ressources */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined" style={{ color: "#e9c349" }}>link</span>
            <h3 style={{ fontFamily: "Oswald,sans-serif", fontSize: 17, fontWeight: 600, textTransform: "uppercase", color: "#dbe3ed" }}>Ressources officielles</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Officiel FFF", title: "Liste agents licenciés FFF", desc: "Rechercher « Bretagne » pour tous les agents actifs et leurs coordonnées.", url: "https://www.fff.fr/agents-sportifs-fff/liste-des-agents-licencies.html" },
              { label: "Plateforme nationale", title: "detectionsfoot.fr — Bretagne", desc: "Clubs bretons avec dates de détection, formulaires et contacts centres.", url: "https://detectionsfoot.fr/bretagne" },
              { label: "Maroc 🇲🇦", title: "FRMF — Diaspora Europe", desc: "Antenne Paris pour détection des binationaux. +3 000 joueurs diaspora suivis.", url: "https://www.frmf.ma" },
            ].map(r => (
              <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer"
                className="glass-card rounded-xl p-4 flex flex-col gap-2 hover:border-[rgba(233,195,73,0.3)] transition-colors"
                style={{ textDecoration: "none" }}>
                <p style={{ fontFamily: "Oswald,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e9c349" }}>{r.label}</p>
                <p style={{ fontFamily: "Oswald,sans-serif", fontSize: 14, fontWeight: 600, color: "#dbe3ed" }}>{r.title}</p>
                <p style={{ fontSize: 11.5, color: "#8e9099", lineHeight: 1.5, flex: 1 }}>{r.desc}</p>
                <span style={{ fontSize: 18, color: "#e9c349", marginTop: "auto" }}>→</span>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t px-4 md:px-10 py-8 w-full" style={{ borderColor: "rgba(68,71,78,0.2)", background: "#070f16" }}>
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span style={{ fontFamily: "Oswald,sans-serif", fontSize: 18, fontWeight: 700, color: "#e9c349", textTransform: "uppercase", letterSpacing: "-0.01em" }}>ANWAR MEKDADI</span>
          <span style={{ color: "#8e9099", fontSize: 12 }}>© 2026 · Profil officiel · Tous droits réservés</span>
        </div>
      </footer>
    </>
  );
}
