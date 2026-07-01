"use client";

import { motion } from "framer-motion";
import InViewVideo from "./InViewVideo";

export default function BrandBand({
  label,
  title,
  tagline,
  banner,
  video,
}: {
  label: string;
  title: string;
  tagline: string;
  banner?: string;
  video?: string;
}) {
  return (
    <section className="theater-surface relative left-1/2 my-20 w-screen -translate-x-1/2 overflow-hidden">
      <div className="gold-thread absolute left-1/2 top-0 w-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-7xl flex-col gap-2 px-8 pb-8 pt-14 sm:px-16"
      >
        <span className="text-[10px] uppercase tracking-[0.45em] text-gold/80">{label}</span>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-3">
          <h3 className="font-display text-3xl leading-tight text-washi sm:text-5xl">{title}</h3>
          <p className="max-w-md pb-1.5 text-sm font-light leading-relaxed text-washi/55">{tagline}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {video ? (
          <InViewVideo
            src={video}
            poster={banner}
            className="aspect-[21/9] w-full object-cover sm:aspect-[21/8]"
          />
        ) : banner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner}
            alt={title}
            loading="lazy"
            decoding="async"
            className="aspect-[21/9] w-full object-cover sm:aspect-[21/8]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-kuro to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-kuro to-transparent" />
      </motion.div>
    </section>
  );
}
