import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BRANCHES } from "@/lib/types/branch";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 min-h-screen">
        <div className="px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
              Nous Trouver
            </span>
            <h1 className="font-display text-5xl md:text-6xl mt-4">Contact</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRANCHES.map((b) => (
              <div
                key={b.slug}
                className="branch-card rounded-2xl p-8 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-gold text-[28px]">
                    location_on
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  {b.name}
                </h3>
                <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] mt-2">
                  {b.area}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
