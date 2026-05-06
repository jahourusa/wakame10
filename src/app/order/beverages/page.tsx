import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UpsellGrid } from "@/components/sections/UpsellGrid";
import { getProductsByCategory } from "@/lib/api/products";

export const revalidate = 60;

export default async function BeveragesStep() {
  const products = await getProductsByCategory("boissons-froides", { revalidate: 60 });

  return (
    <>
      <Header />
      <main className="pt-32 pb-32 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <UpsellGrid
            step={{ current: 1, total: 2 }}
            kicker="Boissons"
            title="Accompagnez votre commande"
            products={products}
            backHref="/cart"
            nextHref="/order/upsell"
            nextLabel="Etape suivante"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
