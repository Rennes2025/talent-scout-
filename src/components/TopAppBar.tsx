"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Profile" },
  { href: "/stats", label: "Stats" },
  { href: "/videos", label: "Videos" },
  { href: "/contact", label: "Contact" },
  { href: "/agenda", label: "Agenda" },
];

export default function TopAppBar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16">
      <Link href="/" className="flex items-center gap-2 scale-95 active:opacity-80 transition-all cursor-pointer">
        <span className="material-symbols-outlined text-tertiary text-[28px]">sports_soccer</span>
        <span className="font-headline-md text-headline-md tracking-tighter text-tertiary uppercase">ANWAR MEKDADI</span>
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
      <button className="scale-95 active:opacity-80 transition-all text-on-surface-variant hover:text-tertiary flex items-center justify-center">
        <span className="material-symbols-outlined text-[28px]">account_circle</span>
      </button>
    </header>
  );
}
