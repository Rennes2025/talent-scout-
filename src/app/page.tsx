"use client";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "/hero-bg.jpg",
  "/hero1-bg.jpg",
  "/hero2-bg.jpg",
  "/hero3-bg.jpg",
];

export default function ProfilJoueur() {
  const [heroBg, setHeroBg] = useState(HERO_IMAGES[0]);

  useEffect(() => {
    setHeroBg(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);
  }, []);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full min-h-[480px] flex items-end pb-8 px-4 md:px-10"
        style={{
          backgroundImage: `url('${heroBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c141b] via-[#0c141b]/75 to-transparent" />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col gap-4">

          {/* Chips positions */}
          <div className="flex flex-wrap gap-2">
            <span className="scout-chip">⚽ MILIEU</span>
            <span className="scout-chip">AILIER</span>
            <span className="scout-chip">LATÉRAL</span>
            <span className="scout-chip" style={{color:'#dbe3ed', borderColor:'rgba(219,227,237,0.25)'}}>17 ANS</span>
            <span className="scout-chip" style={{color:'#dbe3ed', borderColor:'rgba(219,227,237,0.25)'}}>🇫🇷 FRANCE</span>
            <span className="scout-chip" style={{color:'#dbe3ed', borderColor:'rgba(219,227,237,0.25)'}}>🇲🇦 MAROC</span>
          </div>

          {/* Nom + bio + stats */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 style={{
                fontFamily: 'Oswald, sans-serif',
                fontSize: 'clamp(2.2rem, 8vw, 4.5rem)',
                fontWeight: 700,
                lineHeight: 1.0,
                textTransform: 'uppercase',
                color: '#dbe3ed',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 24px rgba(0,0,0,0.9)',
              }}>
                ANWAR<br />
                <span style={{color:'#e9c349'}}>MEKDADI</span>
              </h1>
              <p style={{color:'#c4c6cf', fontSize:'14px', marginTop:'8px', maxWidth:'480px', lineHeight:1.6}}>
                Né le 20 juin 2008 · 1m77 · Pied gauche — Talent polyvalent
                alliant technique, vision et explosivité sur les deux côtés du terrain.
              </p>
            </div>

            {/* Stats rapides */}
            <div className="flex gap-2">
              {[
                { val: '1M77', label: 'Taille' },
                { val: 'G', label: 'Pied' },
                { val: '3', label: 'Postes' },
              ].map((s) => (
                <div key={s.label} className="glass-card px-4 py-3 flex flex-col items-center min-w-[68px]">
                  <span style={{fontFamily:'Oswald,sans-serif', fontSize:'24px', fontWeight:700, color:'#e9c349', lineHeight:1}}>{s.val}</span>
                  <span style={{fontSize:'9px', fontWeight:700, letterSpacing:'0.1em', color:'#8e9099', textTransform:'uppercase', marginTop:'3px'}}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-1">
            <a href="/contact" style={{
              background:'#e9c349', color:'#0c141b',
              fontFamily:'Oswald,sans-serif', fontSize:'13px', fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase',
              padding:'12px 22px', borderRadius:'4px',
              display:'inline-flex', alignItems:'center', gap:'8px',
              boxShadow:'0 0 24px rgba(233,195,73,0.35)', textDecoration:'none',
            }}>
              <span className="material-symbols-outlined" style={{fontSize:'17px'}}>mail</span>
              Contacter l&apos;agent
            </a>
            <a href="/videos" style={{
              background:'transparent', color:'#dbe3ed',
              fontFamily:'Oswald,sans-serif', fontSize:'13px', fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase',
              padding:'11px 22px', borderRadius:'4px',
              border:'1px solid rgba(219,227,237,0.3)',
              display:'inline-flex', alignItems:'center', gap:'8px',
              textDecoration:'none',
            }}>
              <span className="material-symbols-outlined" style={{fontSize:'17px'}}>play_circle</span>
              Voir les vidéos
            </a>
            <a href="/stats" style={{
              background:'transparent', color:'#e9c349',
              fontFamily:'Oswald,sans-serif', fontSize:'13px', fontWeight:700,
              letterSpacing:'0.1em', textTransform:'uppercase',
              padding:'11px 22px', borderRadius:'4px',
              border:'1px solid rgba(233,195,73,0.3)',
              display:'inline-flex', alignItems:'center', gap:'8px',
              textDecoration:'none',
            }}>
              <span className="material-symbols-outlined" style={{fontSize:'17px'}}>bar_chart</span>
              Stats complètes
            </a>
          </div>
        </div>
      </section>

      {/* ── IDENTITÉ JOUEUR ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-10 py-8 w-full max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: 'cake',          label: 'Date de naissance', val: '20 juin 2008' },
            { icon: 'straighten',    label: 'Taille',             val: '1m77' },
            { icon: 'sports_soccer', label: 'Pied fort',          val: 'Gauche' },
            { icon: 'swap_horiz',    label: 'Polyvalence',        val: 'Milieu · Ailier · Latéral' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-4 flex flex-col gap-1">
              <span className="material-symbols-outlined" style={{color:'#e9c349', fontSize:'20px'}}>{item.icon}</span>
              <span style={{fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', color:'#8e9099', textTransform:'uppercase'}}>{item.label}</span>
              <span style={{fontSize:'14px', fontWeight:600, color:'#dbe3ed', fontFamily:'Oswald,sans-serif'}}>{item.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERFORMANCES SAISON ─────────────────────────────────────────── */}
      <section className="px-4 md:px-10 pb-6 w-full max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined" style={{color:'#e9c349'}}>leaderboard</span>
          <h2 style={{fontFamily:'Oswald,sans-serif', fontSize:'20px', fontWeight:600, textTransform:'uppercase', color:'#dbe3ed'}}>
            Performances saison
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon:'sports_soccer', label:'Buts',           val:'14', sub:'+3 ce mois', pct:'75%' },
            { icon:'moving',        label:'Passes décisives',val:'22', sub:'Leader ligue', pct:'90%' },
            { icon:'radar',         label:'Précision passe', val:'89%',sub:'Moy. par 90',  pct:'89%' },
          ].map((c) => (
            <div key={c.label} className="glass-card p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined" style={{fontSize:'56px', color:'#e9c349'}}>{c.icon}</span>
              </div>
              <span style={{fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', color:'#8e9099', textTransform:'uppercase', marginBottom:'12px'}}>{c.label}</span>
              <div className="flex items-end gap-2 mt-auto">
                <span style={{fontFamily:'Oswald,sans-serif', fontSize:'48px', fontWeight:700, color:'#dbe3ed', lineHeight:1}}>{c.val}</span>
                <span style={{fontSize:'12px', color:'#e9c349', paddingBottom:'6px'}}>{c.sub}</span>
              </div>
              <div className="w-full mt-4" style={{height:'3px', background:'#2e363d', borderRadius:'9999px', overflow:'hidden'}}>
                <div style={{height:'100%', background:'#e9c349', width:c.pct, borderRadius:'9999px'}} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALERIE PHOTOS ──────────────────────────────────────────────── */}
      <section className="px-4 md:px-10 py-6 w-full max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined" style={{color:'#e9c349'}}>photo_library</span>
          <h2 style={{fontFamily:'Oswald,sans-serif', fontSize:'20px', fontWeight:600, textTransform:'uppercase', color:'#dbe3ed'}}>
            Galerie
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { src:'/player-training-dribble.jpg',  alt:'Entraînement dribble',     label:'Entraînement' },
            { src:'/player-can-rennes.jpg',         alt:'CAN de Rennes U15',         label:'CAN Rennes U15' },
            { src:'/player-training-team.jpg',      alt:'Séance collective',         label:'Séance collective' },
            { src:'/player-bench.jpg',              alt:'Avant match',               label:'Avant match' },
            { src:'/player-action-1.jpg',           alt:'Action de jeu',             label:'Action' },
            { src:'/player-action-2.jpg',           alt:'Technique individuelle',    label:'Technique' },
            { src:'/player-tournament-may.jpg',     alt:'Tournoi mai 2026',          label:'Tournoi mai 2026' },
            { src:'/player-match-may.jpg',          alt:'Match mai 2026',            label:'Match mai 2026' },
          ].map((p) => (
            <div key={p.src} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c141b]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span style={{fontSize:'11px', fontWeight:700, color:'#e9c349', textTransform:'uppercase', letterSpacing:'0.08em'}}>{p.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BIO ─────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-10 py-6 w-full max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row gap-4 glass-card overflow-hidden rounded-xl">
          <div className="w-full md:w-2/5 min-h-[280px] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/player-training-dribble.jpg"
              alt="Anwar Mekdadi"
              className="absolute inset-0 w-full h-full object-cover"
              style={{filter:'grayscale(30%)'}}
            />
            <div className="absolute inset-0" style={{background:'linear-gradient(to right, transparent, #182028 95%)'}} />
          </div>
          <div className="w-full md:w-3/5 p-6 md:py-8 md:pr-8 flex flex-col justify-center">
            <span style={{fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', color:'#e9c349', textTransform:'uppercase', marginBottom:'8px'}}>Profil</span>
            <h3 style={{fontFamily:'Oswald,sans-serif', fontSize:'28px', fontWeight:600, textTransform:'uppercase', color:'#dbe3ed', marginBottom:'12px'}}>
              Un profil rare et complet
            </h3>
            <p style={{color:'#c4c6cf', fontSize:'14px', lineHeight:1.7, marginBottom:'16px'}}>
              Anwar MEKDADI est un joueur polyvalent né le 20 juin 2008 (17 ans), capable d&apos;évoluer
              aussi bien en milieu de terrain, ailier ou latéral. Pied gauche naturel mais à l&apos;aise
              des deux côtés, il allie vision du jeu, technique et explosivité.
            </p>
            <p style={{color:'#c4c6cf', fontSize:'14px', lineHeight:1.7, marginBottom:'20px'}}>
              Formé en France avec une double nationalité franco-marocaine, il a démontré
              sa qualité dans des compétitions régionales et internationales (CAN Rennes U15).
              Sa polyvalence et son intelligence tactique en font un profil très recherché
              par les clubs européens et du Moyen-Orient.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Vision du jeu','Vitesse','Technique','Ambidextre','Leadership','Pressing'].map((tag) => (
                <span key={tag} className="scout-chip">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="mt-8 border-t px-4 md:px-10 py-8 w-full" style={{borderColor:'rgba(68,71,78,0.2)', background:'#070f16'}}>
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span style={{fontFamily:'Oswald,sans-serif', fontSize:'18px', fontWeight:700, color:'#e9c349', textTransform:'uppercase', letterSpacing:'-0.01em'}}>
            ANWAR MEKDADI
          </span>
          <span style={{color:'#8e9099', fontSize:'12px'}}>
            © 2026 · Profil officiel · Tous droits réservés
          </span>
        </div>
      </footer>
    </>
  );
}
