"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { BrushStroke } from "@/components/menu-experience/LineArt";
import { IMG } from "@/lib/constants/media";

export function About() {
  return (
    <section
      id="about"
      className="theater-surface relative overflow-hidden py-32 md:py-40"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute right-8 top-14 select-none font-display text-[8rem] leading-none text-washi/[0.04] sm:text-[13rem]"
      >
        &#24515;
      </span>
      <div className="gold-thread absolute left-1/2 top-0 w-1/2 -translate-x-1/2" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-0">
          <Reveal className="relative lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-gold/15">
              <Image
                src={IMG.chef}
                alt="Sushi chef"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-kuro/40 via-transparent to-transparent" />
              <span className="hanko absolute right-4 top-4 rounded-sm px-3 py-1.5 text-[10px] font-medium uppercase">
                Depuis 2013
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative z-10 lg:col-span-6 lg:-ml-20">
            <div className="space-y-8 rounded-xl border border-gold/15 bg-kuro-2/85 p-8 backdrop-blur-xl md:p-12">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-bright/70">
                  L&apos;Heritage
                </span>
                <h2 className="mt-4 font-display text-4xl leading-[1.1] text-washi md:text-5xl">
                  Qui Sommes-Nous?
                </h2>
                <BrushStroke className="mt-4 h-5 w-48 text-gold" />
              </div>
              <p className="font-cormorant text-xl italic leading-relaxed text-gold-bright/85">
                l&apos;art de l&apos;omakase
              </p>
              <p className="text-base font-light leading-relaxed text-washi/60">
                Depuis plus d&apos;une decennie, Wakame Sushi sublime les produits de la
                mer pour offrir une experience gustative hors du commun. Notre
                philosophie repose sur le respect absolu de la saisonnalite et de la
                fraicheur.
              </p>

              <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-gold/15">
                <div className="border-r border-gold/15 bg-gold/[0.05] p-5 text-center">
                  <Counter to={15} className="font-display text-2xl text-gold-bright md:text-3xl" />
                  <span className="font-display text-2xl text-gold-bright md:text-3xl">+</span>
                  <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.2em] text-washi/45">
                    Chefs
                  </p>
                </div>
                <div className="border-r border-gold/15 bg-gold/[0.05] p-5 text-center">
                  <Counter to={3} className="font-display text-2xl text-gold-bright md:text-3xl" />
                  <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.2em] text-washi/45">
                    Villes
                  </p>
                </div>
                <div className="bg-gold/[0.05] p-5 text-center">
                  <Counter to={100} className="font-display text-2xl text-gold-bright md:text-3xl" />
                  <span className="font-display text-2xl text-gold-bright md:text-3xl">%</span>
                  <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.2em] text-washi/45">
                    Frais
                  </p>
                </div>
              </div>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-gold-bright"
              >
                Notre Histoire
                <span className="h-[1px] w-8 bg-gold-bright transition-all duration-500 group-hover:w-16" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
