import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckoutForm } from "@/components/sections/CheckoutForm";
import { BrushStroke } from "@/components/menu-experience/LineArt";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="washi-surface relative min-h-screen overflow-hidden pb-32 pt-32">
        <span
          aria-hidden
          className="pointer-events-none absolute right-8 top-24 select-none font-display text-[8rem] leading-none text-ink/[0.05] sm:text-[13rem]"
        >
          &#24481;
        </span>

        <div className="relative z-10 px-6 md:px-12">
          <div className="mb-16 text-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
              Finalisation
            </span>
            <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">
              Commande
            </h1>
            <BrushStroke className="mx-auto mt-4 h-5 w-44 text-gold" />
          </div>
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
