"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { IMG } from "@/lib/constants/media";

export function About() {
  return (
    <section
      id="about"
      className="py-32 md:py-40 bg-dark-2 relative overflow-hidden"
    >
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gold/[0.02] rounded-full blur-[150px]" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
          <Reveal className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden relative">
              <Image
                src={IMG.chef}
                alt="Sushi chef"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-6 lg:-ml-20 relative z-10">
            <div className="bg-dark-2/90 backdrop-blur-xl border border-white/[0.04] rounded-xl p-8 md:p-12 space-y-8">
              <div>
                <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
                  L&apos;Heritage
                </span>
                <h2 className="font-display text-4xl md:text-5xl mt-4 leading-[1.1]">
                  Qui Sommes-Nous?
                </h2>
              </div>
              <div className="gold-line" />
              <p className="text-white/50 text-base leading-relaxed font-light">
                Depuis plus d&apos;une decennie, Wakame Sushi sublime les produits de la
                mer pour offrir une experience gustative hors du commun. Notre
                philosophie repose sur le respect absolu de la saisonnalite et de la
                fraicheur.
              </p>

              <div className="grid grid-cols-3 gap-0 rounded-lg overflow-hidden border border-gold/10">
                <div className="bg-gold/[0.04] p-5 text-center border-r border-gold/10">
                  <Counter
                    to={15}
                    className="font-display text-2xl md:text-3xl text-gold"
                  />
                  <span className="font-display text-2xl md:text-3xl text-gold">+</span>
                  <p className="text-white/40 text-[8px] uppercase tracking-[0.15em] mt-1 font-medium">
                    Chefs
                  </p>
                </div>
                <div className="bg-gold/[0.04] p-5 text-center border-r border-gold/10">
                  <Counter
                    to={3}
                    className="font-display text-2xl md:text-3xl text-gold"
                  />
                  <p className="text-white/40 text-[8px] uppercase tracking-[0.15em] mt-1 font-medium">
                    Villes
                  </p>
                </div>
                <div className="bg-gold/[0.04] p-5 text-center">
                  <Counter
                    to={100}
                    className="font-display text-2xl md:text-3xl text-gold"
                  />
                  <span className="font-display text-2xl md:text-3xl text-gold">%</span>
                  <p className="text-white/40 text-[8px] uppercase tracking-[0.15em] mt-1 font-medium">
                    Frais
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 text-gold font-semibold tracking-[0.15em] uppercase text-[11px] group"
              >
                Notre Histoire
                <span className="w-8 h-[1px] bg-gold group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
