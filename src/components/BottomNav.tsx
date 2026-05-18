"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "person", label: "Profile" },
  { href: "/stats", icon: "bar_chart", label: "Stats" },
  { href: "/videos", icon: "play_circle", label: "Videos" },
  { href: "/contact", icon: "mail", label: "Contact" },
  { href: "/agenda", icon: "calendar_month", label: "Agenda" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-2 pb-safe bg-surface-container-highest/80 backdrop-blur-xl border-t border-outline-variant/10 shadow-2xl rounded-t-xl z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-colors duration-150 ${
              isActive
                ? "text-tertiary bg-surface-bright/40 rounded-full px-4 py-1"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[24px] mb-1${isActive ? " fill" : ""}`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-[10px] uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
