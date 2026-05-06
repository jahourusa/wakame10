"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_VIDEOS, IMG } from "@/lib/constants/media";

const easing = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: easing, delay },
});

export function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <video
          className="hidden md:block w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={IMG.heroPoster}
        >
          {HERO_VIDEOS.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
        <Image
          src={IMG.heroPoster}
          alt="Sushi"
          fill
          priority
          className="md:hidden object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,14,11,0.3) 0%, rgba(6,14,11,0.1) 30%, rgba(6,14,11,0.6) 70%, rgba(6,14,11,1) 100%), radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(6,14,11,0.5) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          {...fadeUp(0.15)}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gold/20 bg-gold/5 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold font-body text-[10px] uppercase tracking-[0.3em] font-semibold">
            Sushis & Fusion Asiatique
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.35)}
          className="font-display text-5xl md:text-7xl lg:text-[88px] font-bold leading-[1.05] mb-6"
        >
          L&apos;Art du Sushi,
          <br />
          <span className="text-gold italic">Reinvente</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.55)}
          className="text-white/50 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto mb-10"
        >
          Une experience culinaire asiatique unique ou la tradition rencontre la
          modernite dans chaque bouchee.
        </motion.p>

        <motion.div {...fadeUp(0.75)} className="flex flex-wrap justify-center gap-4">
          <Link
            href="/menu"
            className="btn-gold px-10 py-4 rounded-lg font-bold text-[12px] uppercase tracking-[0.15em]"
          >
            Commander Maintenant
          </Link>
          <Link
            href="#menu"
            className="btn-outline px-10 py-4 rounded-lg font-semibold text-[12px] uppercase tracking-[0.15em]"
          >
            Voir le Menu
          </Link>
        </motion.div>
      </div>

      <motion.div
        {...fadeUp(1.15)}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] uppercase tracking-[0.35em] text-white/30 font-body">
          Decouvrir
        </span>
        <motion.div
          className="w-[1px] h-10 bg-gold/40 origin-top"
          animate={{ scaleY: [0, 1, 1, 0], originY: [0, 0, 1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        {...fadeUp(0.95)}
        className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-10"
      >
        {[
          { icon: "speed", label: "Rapide" },
          { icon: "eco", label: "Frais" },
          { icon: "restaurant_menu", label: "Artisanal" },
        ].map((s, i, arr) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5">
            <span className="material-symbols-outlined text-gold text-lg">{s.icon}</span>
            <span
              className="text-[8px] uppercase tracking-[0.2em] text-white/40"
              style={{ writingMode: "vertical-lr" }}
            >
              {s.label}
            </span>
            {i < arr.length - 1 && <div className="w-[1px] h-8 bg-white/10 mt-6" />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
