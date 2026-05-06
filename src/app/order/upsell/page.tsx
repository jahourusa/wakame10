import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UpsellGrid } from "@/components/sections/UpsellGrid";
import { getProductsByCategory } from "@/lib/api/products";

export const revalidate = 60;

export default async function SaladesStep() {
  const products = await getProductsByCategory("salades", { revalidate: 60 });

  return (
    <>
      <Header />
      <main className="pt-32 pb-32 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <UpsellGrid
            step={{ current: 2, total: 2 }}
            kicker="Salades"
            title="Une touche de fraicheur"
            products={products}
            backHref="/order/beverages"
            nextHref="/checkout"
            nextLabel="Passer la commande"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
