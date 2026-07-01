"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { BrushStroke } from "@/components/menu-experience/LineArt";
import { IMG } from "@/lib/constants/media";

const tiles = [
  { src: IMG.insta1, alt: "Nigiri", offset: false },
  { src: IMG.insta2, alt: "Rolls", offset: true },
  { src: IMG.insta3, alt: "Sashimi", offset: false },
  { src: IMG.insta4, alt: "Box", offset: true },
];

export function InstagramGrid() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
      <Reveal className="mb-14 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-bright/70">
          Suivez notre univers
        </span>
        <h3 className="mt-4 font-display text-3xl text-washi md:text-4xl">
          @wakamesushiofficiel
        </h3>
        <BrushStroke className="mx-auto mt-4 h-5 w-44 text-gold" />
      </Reveal>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {tiles.map((t, i) => (
          <Reveal
            key={t.alt}
            delay={0.1 * (i + 1)}
            className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-gold/15 transition-colors duration-500 hover:border-gold/45 ${
              t.offset ? "md:mt-8" : ""
            }`}
          >
            <Image
              src={t.src}
              alt={t.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-kuro/0 transition-colors duration-500 group-hover:bg-kuro/40">
              <span className="material-symbols-outlined text-3xl text-gold-bright opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                photo_camera
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
