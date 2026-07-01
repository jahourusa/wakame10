"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { BrushStroke } from "@/components/menu-experience/LineArt";
import { IMG } from "@/lib/constants/media";

export function Testimonial() {
  return (
    <section className="washi-surface relative overflow-hidden py-32 md:py-40">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[300px] leading-none text-gold-dim/[0.08] md:text-[500px]"
      >
        &ldquo;
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-8 top-14 select-none font-display text-[8rem] leading-none text-ink/[0.05] sm:text-[13rem]"
      >
        &#21619;
      </span>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-12">
        <Reveal>
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
            Ce qu&apos;on dit de nous
          </span>
          <BrushStroke className="mx-auto mt-4 h-5 w-40 text-gold" />

          <p className="mt-10 font-cormorant text-2xl italic leading-[1.35] text-ink md:text-3xl lg:text-[42px]">
            &ldquo;Le meilleur sushi du Maroc, sans aucun doute. La fraicheur du
            poisson et l&apos;originalite des recettes font de chaque commande une fete
            pour les papilles.&rdquo;
          </p>

          <div className="mt-14 flex flex-col items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-gold/40 p-[2px]">
              <Image
                src={IMG.testimonial}
                alt="Sofia El Fassi"
                width={64}
                height={64}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div>
              <h6 className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dim">
                Sofia El Fassi
              </h6>
              <p className="mt-1 text-[10px] font-light tracking-wide text-ink-soft/70">
                Critique Gastronomique
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
