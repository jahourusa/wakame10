"use client";

import { Reveal } from "@/components/ui/Reveal";
import { BrushStroke } from "@/components/menu-experience/LineArt";

const items = [
  {
    icon: "inventory_2",
    title: "Produits Ultra Frais",
    desc: "Peche du jour selectionnee avec la plus grande rigueur par nos experts en produits de la mer.",
  },
  {
    icon: "skillet",
    title: "Chefs Experts",
    desc: "Maitres sushi formes aux techniques ancestrales du Japon avec plus de 10 ans d'experience.",
  },
  {
    icon: "local_shipping",
    title: "Livraison Premium",
    desc: "Conditionnement isotherme haute performance pour preserver chaque saveur jusqu'a votre porte.",
  },
  {
    icon: "loyalty",
    title: "Programme Fidelite",
    desc: "Avantages exclusifs et degustations privees reservees a nos clients les plus fideles.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="washi-surface relative overflow-hidden py-32 md:py-40">
      <span
        aria-hidden
        className="pointer-events-none absolute left-8 top-14 select-none font-display text-[8rem] leading-none text-ink/[0.05] sm:text-[13rem]"
      >
        &#35488;
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-16">
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
            Nos Engagements
          </span>
          <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">
            Pourquoi Wakame
          </h2>
          <BrushStroke className="mt-4 h-5 w-52 text-gold" />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <Reveal
              key={it.title}
              delay={0.1 * (i + 1)}
              className="group relative flex gap-6 rounded-xl border border-ink/10 bg-washi-2/50 p-7 transition-all duration-500 hover:border-gold/40 hover:bg-washi-2/80"
            >
              <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-gold/30" />
              <span className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-gold/30" />
              <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-gold/30" />
              <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-gold/30" />

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-washi text-gold-dim transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:text-gold">
                <span className="material-symbols-outlined text-[24px]">{it.icon}</span>
              </div>
              <div>
                <h5 className="font-display text-xl text-ink">{it.title}</h5>
                <div className="gold-thread mt-2 w-16" />
                <p className="mt-3 text-sm font-light leading-relaxed text-ink-soft">
                  {it.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
