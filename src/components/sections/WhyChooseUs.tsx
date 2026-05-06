"use client";

import { Reveal } from "@/components/ui/Reveal";

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
    <section className="py-32 md:py-40 bg-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="mb-16">
          <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
            Nos Engagements
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-4">Pourquoi Wakame</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((it, i) => (
            <Reveal
              key={it.title}
              delay={0.1 * (i + 1)}
              className="group flex gap-6 p-7 rounded-xl bg-dark-3 border-l-2 border-gold/20 hover:border-gold transition-all duration-500"
            >
              <div className="w-14 h-14 shrink-0 rounded-lg bg-dark-4 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all duration-400">
                <span className="material-symbols-outlined text-[26px]">{it.icon}</span>
              </div>
              <div>
                <h5 className="font-display text-lg mb-2">{it.title}</h5>
                <p className="text-white/35 text-sm font-light leading-relaxed">
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
