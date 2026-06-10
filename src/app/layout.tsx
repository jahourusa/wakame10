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
    "Sushis et fusion asiatique a Rabat et Kenitra. Livraison premium en emballage isotherme.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch upsell categories server-side. Underlying call is a single
  // /products fetch deduplicated by Next; ISR cache is shared across pages.
  const [baseDeSalades, soupesSaveurs, desserts, jus] = await Promise.all([
    getProductsByCategory("base-de-salades", { revalidate: 300 }),
    getProductsByCategory("soupes-saveurs", { revalidate: 300 }),
    getProductsByCategory("desserts", { revalidate: 300 }),
    getProductsByCategory("jus", { revalidate: 300 }),
  ]);

  return (
    <html lang="fr" className={`dark ${playfair.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {/* Strip attributes injected by browser extensions (Bitdefender, ColorZilla, Grammarly, retriever/automation tools, ...) before React hydrates, so they don't cause hydration mismatch warnings. Matches both exact names and known prefixes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var EX=['bis_skin_checked','bis_register','cz-shortcut-listen','data-gramm','data-gramm_editor','data-enable-grammarly'];var PX=['rtrvr-','__processed','data-bis-','data-extension-','bis-'];function shouldStrip(n){if(EX.indexOf(n)!==-1)return true;for(var i=0;i<PX.length;i++)if(n.indexOf(PX[i])===0)return true;return false;}function stripEl(el){if(!el||!el.attributes)return;var rm=[];for(var i=0;i<el.attributes.length;i++){var n=el.attributes[i].name;if(shouldStrip(n))rm.push(n);}rm.forEach(function(n){el.removeAttribute(n);});}function stripAll(){stripEl(document.documentElement);var a=document.getElementsByTagName('*');for(var i=0;i<a.length;i++)stripEl(a[i]);}stripAll();try{new MutationObserver(function(ms){ms.forEach(function(m){stripEl(m.target);});}).observe(document.documentElement,{subtree:true,attributes:true});}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-dark text-white font-body antialiased selection:bg-gold/30 selection:text-white"
      >
        {children}
        <OrderDataInit
          salades={[...baseDeSalades, ...soupesSaveurs, ...desserts]}
          boissons={jus}
        />
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
