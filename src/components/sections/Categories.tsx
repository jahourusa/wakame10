"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { BrushStroke } from "@/components/menu-experience/LineArt";
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
      className={`group relative block overflow-hidden rounded-2xl border border-gold/15 transition-colors duration-500 hover:border-gold/40 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-kuro/85 via-kuro/20 to-transparent" />
      <div
        className={`absolute ${
          size === "lg" ? "bottom-6 left-6 md:bottom-8 md:left-8" : "bottom-5 left-5"
        }`}
      >
        <span
          className={`font-medium uppercase text-gold-bright/80 ${
            size === "lg" ? "text-[10px] tracking-[0.3em]" : "text-[9px] tracking-[0.25em]"
          }`}
        >
          {kicker}
        </span>
        <h3
          className={`mt-1 font-display text-washi ${
            size === "lg"
              ? "text-3xl md:text-4xl"
              : size === "md"
              ? "text-2xl"
              : "text-lg md:text-xl"
          }`}
        >
          {title}
        </h3>
      </div>
      <div
        className={`absolute flex items-center justify-center rounded-full border border-gold/40 bg-kuro/40 text-gold-bright backdrop-blur-sm transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-kuro ${
          size === "lg"
            ? "bottom-6 right-6 h-11 w-11 md:bottom-8 md:right-8"
            : "bottom-5 right-5 h-10 w-10"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">east</span>
      </div>
    </Link>
  );
}

export function Categories() {
  return (
    <section id="menu" className="washi-surface relative overflow-hidden py-28 md:py-36">
      <span
        aria-hidden
        className="pointer-events-none absolute right-6 top-10 select-none font-display text-[8rem] leading-none text-ink/[0.05] sm:text-[12rem]"
      >
        &#21280;
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-14 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
            Nos Univers
          </span>
          <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">
            Explorez nos Categories
          </h2>
          <BrushStroke className="mx-auto mt-4 h-5 w-56 text-gold" />
        </Reveal>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <Reveal delay={0.1} className="h-[280px] md:row-span-2 md:h-[520px]">
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

          <div className="grid h-[200px] grid-cols-2 gap-3 md:h-[254px] md:gap-4">
            <Reveal
              delay={0.3}
              className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-gold/20 bg-washi-2/70"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,164,92,0.12),transparent_70%)]" />
              <div className="relative z-10 px-4 text-center">
                <p className="font-cormorant text-2xl italic leading-tight text-gold-dim md:text-3xl">
                  Signature
                </p>
                <p className="mt-0.5 font-cormorant text-xs italic text-ink-soft/60">
                  collection
                </p>
                <div className="gold-thread mx-auto mt-3 w-10" />
                <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-ink-soft/50">
                  Sushis &amp; Fusion
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
