import type { Metadata } from "next";
import "./globals.css";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Elite Scout — Talent Football",
  description: "Profil joueur professionnel — visibilité clubs européens et Moyen-Orient",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
        <TopAppBar />
        <main className="flex-grow pt-16 pb-24 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
