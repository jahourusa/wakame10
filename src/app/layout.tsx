import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { BranchModal } from "@/components/branch/BranchModal";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wakame Sushi — Sushis & Fusion Asiatique",
  description:
    "Sushis et fusion asiatique a Casablanca, Rabat et Kenitra. Livraison premium en emballage isotherme.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`dark ${playfair.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-dark text-white font-body antialiased selection:bg-gold/30 selection:text-white">
        {children}
        <MobileDrawer />
        <MobileBottomNav />
        <BranchModal />
      </body>
    </html>
  );
}
