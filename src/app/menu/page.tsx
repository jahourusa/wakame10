import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MenuGrid } from "@/components/sections/MenuGrid";
import { getProducts, getCategories } from "@/lib/api/products";

// Revalidate the static HTML every 60s; individual fetches also opt into ISR.
export const revalidate = 60;

export default async function MenuPage() {
  const [products, categories] = await Promise.all([
    getProducts({ revalidate: 60 }),
    getCategories({ revalidate: 300 }),
  ]);

  return (
    <>
      <Header />
      <main className="pt-32 pb-32 min-h-screen">
        <div className="px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
              Notre Carte
            </span>
            <h1 className="font-display text-5xl md:text-7xl mt-4">Menu</h1>
            <div className="gold-line mx-auto mt-8" />
            <p className="text-white/40 mt-8 max-w-xl mx-auto font-light">
              Selectionnez une categorie pour decouvrir nos creations.
            </p>
          </div>
          <MenuGrid initialProducts={products} initialCategories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
