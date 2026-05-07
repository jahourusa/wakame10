"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { IMG } from "@/lib/constants/media";

function BentoCard({
  href,
  src,
  alt,
  kicker,
  title,
  className = "",
  size = "md",
}: {
  href: string;
  src: string;
  alt: string;
  kicker: string;
  title: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Link
      href={href}
      className={`group relative rounded-2xl overflow-hidden block ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div
        className={`absolute ${
          size === "lg" ? "bottom-5 left-5 md:bottom-7 md:left-7" : "bottom-4 left-4"
        }`}
      >
        <span
          className={`text-gold/60 ${
            size === "lg" ? "text-[9px] tracking-[0.25em]" : "text-[8px] tracking-[0.2em]"
          } uppercase font-semibold`}
        >
          {kicker}
        </span>
        <h3
          className={`font-display ${
            size === "lg" ? "text-2xl md:text-3xl" : size === "md" ? "text-xl" : "text-base md:text-lg"
          } text-white mt-0.5`}
        >
          {title}
        </h3>
      </div>
      <div
        className={`absolute ${
          size === "lg" ? "bottom-5 right-5 md:bottom-7 md:right-7 w-9 h-9" : "bottom-4 right-4 w-9 h-9"
        } rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-gold group-hover:text-dark transition-all duration-300`}
      >
        <span className="material-symbols-outlined text-[16px]">east</span>
      </div>
    </Link>
  );
}

export function Categories() {
  return (
    <section id="menu" className="py-28 md:py-36 bg-dark-2">
      <div className="px-6 md:px-12">
        <Reveal className="text-center mb-14">
          <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
            Nos Univers
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-4">
            Explorez nos Categories
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Reveal delay={0.1} className="md:row-span-2 h-[280px] md:h-[520px]">
            <BentoCard
              href="/menu"
              src={IMG.bento}
              alt="Bentos"
              kicker="Collection"
              title="Bentos"
              size="lg"
              className="h-full"
            />
          </Reveal>

          <Reveal delay={0.2} className="h-[200px] md:h-[254px]">
            <BentoCard
              href="/menu"
              src={IMG.tapas}
              alt="Tapas"
              kicker="Inspirations"
              title="Tapas"
              size="md"
              className="h-full"
            />
          </Reveal>

          <div className="grid grid-cols-2 gap-3 md:gap-4 h-[200px] md:h-[254px]">
            <Reveal
              delay={0.3}
              className="rounded-2xl bg-dark-3 border border-white/[0.04] flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(191,147,58,0.04),transparent_70%)]" />
              <div className="text-center relative z-10 px-4">
                <p className="font-display text-[22px] md:text-[26px] italic text-gold/70 leading-tight">
                  Signature
                </p>
                <p className="font-display text-xs italic text-white/25 mt-0.5">
                  collection
                </p>
                <div className="w-8 h-[1px] bg-gold/20 mx-auto mt-3 mb-2" />
                <p className="text-white/20 text-[8px] uppercase tracking-[0.2em]">
                  Sushis & Fusion
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4} className="h-full">
              <BentoCard
                href="/menu"
                src={IMG.crispyRice}
                alt="Crispy Rice"
                kicker="Signatures"
                title="Crispy Rice"
                size="sm"
                className="h-full"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
