"use client";

import { usePathname } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";

const PRIVATE_PREFIXES = ["/admin", "/login"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isPrivate) return <>{children}</>;

  return (
    <>
      <TopAppBar />
      <main className="flex-grow pt-16 pb-24 md:pb-0">{children}</main>
      <BottomNav />
    </>
  );
}
