import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartView } from "@/components/sections/CartView";

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-32 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
              Panier
            </span>
            <h1 className="font-display text-5xl md:text-6xl mt-4">Votre Commande</h1>
          </div>
          <CartView />
        </div>
      </main>
      <Footer />
    </>
  );
}
