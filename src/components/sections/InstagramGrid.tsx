"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { IMG } from "@/lib/constants/media";

const tiles = [
  { src: IMG.insta1, alt: "Nigiri", offset: false },
  { src: IMG.insta2, alt: "Rolls", offset: true },
  { src: IMG.insta3, alt: "Sashimi", offset: false },
  { src: IMG.insta4, alt: "Box", offset: true },
];

export function InstagramGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <Reveal className="text-center mb-14">
        <h3 className="font-display text-3xl md:text-4xl">Suivez notre Univers</h3>
        <p className="text-gold font-semibold tracking-[0.3em] uppercase text-[10px] mt-3">
          @wakamesushiofficiel
        </p>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {tiles.map((t, i) => (
          <Reveal
            key={t.alt}
            delay={0.1 * (i + 1)}
            className={`aspect-square overflow-hidden rounded-lg group relative cursor-pointer ${
              t.offset ? "md:mt-8" : ""
            }`}
          >
            <Image
              src={t.src}
              alt={t.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-colors duration-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                photo_camera
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
