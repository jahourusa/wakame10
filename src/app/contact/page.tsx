import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/sections/ContactForm";
import { BrushStroke, PinIcon } from "@/components/menu-experience/LineArt";
import { BRANCHES } from "@/lib/types/branch";

export default function ContactPage() {
  return (
    <>
      <Header forceGlass />
      <main className="washi-surface relative min-h-screen overflow-hidden pb-24 pt-32">
        <span
          aria-hidden
          className="pointer-events-none absolute right-8 top-24 select-none font-display text-[8rem] leading-none text-ink/[0.05] sm:text-[13rem]"
        >
          &#32257;
        </span>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-16 text-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
              Nous Trouver
            </span>
            <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Contact</h1>
            <BrushStroke className="mx-auto mt-4 h-5 w-44 text-gold" />
            <p className="mx-auto mt-6 max-w-lg font-cormorant text-lg italic text-gold-dim">
              A votre ecoute, du lundi au dimanche.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left column: branches + info */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
                  Nos Restaurants
                </span>
                <h2 className="mt-3 font-display text-3xl text-ink">Nous rendre visite</h2>
              </div>

              <div className="space-y-4">
                {BRANCHES.map((b) => (
                  <div
                    key={b.slug}
                    className="relative rounded-2xl border border-gold/20 bg-washi-2/60 p-6 backdrop-blur-md"
                  >
                    <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/40" />
                    <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-gold/40" />
                    <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-gold/40" />
                    <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/40" />

                    <div className="flex items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-washi text-gold-dim">
                        <PinIcon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-2xl text-ink">{b.name}</h3>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.3em] text-ink-soft/70">
                          {b.area}
                        </p>
                        <div className="gold-thread mt-4 w-16" />
                        <ul className="mt-4 space-y-2 text-sm font-light text-ink-soft">
                          <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[18px] text-gold-dim">
                              schedule
                            </span>
                            12h - 23h, 7 jours sur 7
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[18px] text-gold-dim">
                              phone
                            </span>
                            05 37 XX XX XX
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[18px] text-gold-dim">
                              mail
                            </span>
                            contact@wakame.ma
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: contact form */}
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
