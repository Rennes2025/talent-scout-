"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { Lang } from "@/lib/i18n";

const LANG_FLAGS: Record<Lang, string> = { fr: "🇫🇷", en: "🇬🇧", ar: "🇲🇦" };

export default function TopAppBar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();

  const navLinks = [
    { href: "/",        label: t.nav.profile },
    { href: "/stats",   label: t.nav.stats },
    { href: "/videos",  label: t.nav.videos },
    { href: "/contact", label: t.nav.contact },
    { href: "/agenda",  label: t.nav.agenda },
  ];

  const langs: Lang[] = ["fr", "en", "ar"];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 gap-4">
      <Link href="/" className="flex items-center gap-2 scale-95 active:opacity-80 transition-all cursor-pointer shrink-0">
        <span className="material-symbols-outlined text-tertiary text-[28px]">sports_soccer</span>
        <span className="font-headline-md text-headline-md tracking-tighter text-tertiary uppercase hidden sm:block">ANWAR MEKDADI</span>
      </Link>

      <nav className="hidden md:flex items-center gap-gutter font-label-caps text-label-caps uppercase">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors duration-200 ${
              pathname === link.href
                ? "text-tertiary"
                : "text-on-surface-variant hover:text-tertiary"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Sélecteur de langue */}
      <div className="flex items-center gap-1 shrink-0">
        {langs.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            title={l.toUpperCase()}
            style={{
              fontSize: "13px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "4px",
              border: `1px solid ${lang === l ? "#e9c349" : "rgba(68,71,78,0.4)"}`,
              background: lang === l ? "rgba(233,195,73,0.15)" : "transparent",
              color: lang === l ? "#e9c349" : "#8e9099",
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.05em",
            }}
          >
            {LANG_FLAGS[l]} {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
}
