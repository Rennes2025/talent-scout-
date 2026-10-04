"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin",           icon: "today",          label: "Aujourd'hui" },
  { href: "/admin/objectifs", icon: "flag",           label: "Objectifs" },
  { href: "/admin/mesures",   icon: "monitor_weight", label: "Mesures" },
  { href: "/admin/coach",     icon: "sports",         label: "Coach" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminTopTabs() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-1" aria-label="Espace admin">
      {tabs.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e9c349]"
            style={{
              fontFamily: "Oswald,sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: active ? "#e9c349" : "#8e9099",
              background: active ? "rgba(233,195,73,0.1)" : "transparent",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminBottomTabs() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4"
      style={{
        background: "rgba(16,24,32,0.95)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(219,227,237,0.08)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Espace admin"
    >
      {tabs.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center justify-center gap-1 py-3"
            style={{ color: active ? "#e9c349" : "#8e9099" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 24, fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em" }}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
