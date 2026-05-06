"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { IMG } from "@/lib/constants/media";

export function Testimonial() {
  return (
    <section className="py-32 md:py-40 bg-dark-2 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[300px] md:text-[500px] text-gold/[0.02] leading-none select-none pointer-events-none">
        &ldquo;
      </div>
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <Reveal>
          <p className="font-display text-2xl md:text-3xl lg:text-[40px] italic leading-[1.35] text-white/85">
            &ldquo;Le meilleur sushi de Casablanca, sans aucun doute. La fraicheur du
            poisson et l&apos;originalite des recettes font de chaque commande une fete
            pour les papilles.&rdquo;
          </p>
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/20 p-[2px]">
              <Image
                src={IMG.testimonial}
                alt="Sofia El Fassi"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h6 className="text-gold text-[10px] font-bold uppercase tracking-[0.25em]">
                Sofia EL FASSI
              </h6>
              <p className="text-white/30 text-[10px] mt-1">Critique Gastronomique</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
