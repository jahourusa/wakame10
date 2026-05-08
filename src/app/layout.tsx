import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { BranchModal } from "@/components/branch/BranchModal";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ProductModal } from "@/components/order/ProductModal";
import { CartDrawer } from "@/components/order/CartDrawer";
import { FloatingCartButton } from "@/components/order/FloatingCartButton";
import { FlyToCart } from "@/components/order/FlyToCart";
import { OrderDataInit } from "@/components/order/OrderDataInit";
import { getProductsByCategory } from "@/lib/api/products";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch upsell categories server-side. Underlying call is a single
  // /products fetch deduplicated by Next; ISR cache is shared across pages.
  const [salades, soupes, boissons] = await Promise.all([
    getProductsByCategory("salades", { revalidate: 300 }),
    getProductsByCategory("soupes", { revalidate: 300 }),
    getProductsByCategory("boissons-froides", { revalidate: 300 }),
  ]);

  return (
    <html lang="fr" className={`dark ${playfair.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {/* Strip attributes injected by browser extensions (Bitdefender, ColorZilla, Grammarly...) before React hydrates, so they don't cause hydration mismatch warnings. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var A=['bis_skin_checked','bis_register','__processed','cz-shortcut-listen','data-gramm','data-gramm_editor','data-enable-grammarly'];function strip(){A.forEach(function(a){document.querySelectorAll('['+a+']').forEach(function(e){e.removeAttribute(a)})})}strip();try{new MutationObserver(strip).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:A})}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-dark text-white font-body antialiased selection:bg-gold/30 selection:text-white"
      >
        {children}
        <OrderDataInit salades={[...salades, ...soupes]} boissons={boissons} />
        <ProductModal />
        <CartDrawer />
        <FloatingCartButton />
        <FlyToCart />
        <MobileDrawer />
        <MobileBottomNav />
        <BranchModal />
      </body>
    </html>
  );
}
