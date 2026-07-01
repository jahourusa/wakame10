"use client";

import { motion } from "framer-motion";
import type { DishLike } from "@/lib/menu/dish";
export { productToDish, type DishLike } from "@/lib/menu/dish";
import InViewVideo from "./InViewVideo";

function MediaFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-washi-2/70">
      <svg viewBox="0 0 200 200" fill="none" className="h-2/5 w-2/5 text-gold/35">
        <path
          d="M 118 22 A 80 80 0 1 0 165 55"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const gridSrc = (url: string) => url.replace("&w=1080&", "&w=640&");

const appear = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i * 0.06, 0.4), duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function Price({ value, light = false }: { value: number | null; light?: boolean }) {
  if (value == null) return null;
  return (
    <span className={`font-display text-xl leading-none ${light ? "text-gold-bright" : "text-gold-dim"}`}>
      {value}
      <span className="ml-1 text-[11px] uppercase tracking-widest opacity-70">dh</span>
    </span>
  );
}

function PrepVideo({ src }: { src: string }) {
  return (
    <InViewVideo
      src={src}
      fadeIn
      className="absolute inset-0 h-full w-full rounded-xl object-cover"
    />
  );
}

export function DishCard({
  dish,
  index,
  onOpen,
  onAdd,
}: {
  dish: DishLike;
  index: number;
  onOpen: (d: DishLike) => void;
  onAdd: (d: DishLike, e: React.MouseEvent) => void;
}) {
  return (
    <motion.article
      variants={appear}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={index}
      className="group relative flex cursor-pointer flex-col rounded-xl p-4 transition-colors duration-500 hover:bg-washi-2/60"
      onClick={() => onOpen(dish)}
    >
      <span className="pointer-events-none absolute inset-0 rounded-xl border border-transparent transition-colors duration-500 group-hover:border-gold/35" />

      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
        {dish.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gridSrc(dish.img)}
            alt={dish.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.07] group-hover:-rotate-1"
            style={{ filter: "drop-shadow(0 18px 22px rgba(34,48,42,0.28))" }}
          />
        ) : (
          !dish.video && <MediaFallback />
        )}
        {dish.video && <PrepVideo src={dish.video} />}
        {dish.isNew && (
          <span className="hanko absolute left-1 top-2 rounded-sm px-2.5 py-1 text-[9px] font-medium uppercase">
            Nouveaute
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-lg leading-snug text-ink">{dish.name}</h4>
        <Price value={dish.price} />
      </div>
      {dish.desc && (
        <p className="mt-1.5 line-clamp-2 text-[13px] font-light leading-relaxed text-ink-soft">
          {dish.desc}
        </p>
      )}

      <button
        aria-label={`Ajouter ${dish.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onAdd(dish, e);
        }}
        className="absolute bottom-4 right-4 flex h-9 w-9 translate-y-2 cursor-pointer items-center justify-center rounded-full border border-ink/15 bg-washi text-ink opacity-0 transition-all duration-300 hover:scale-110 hover:border-gold hover:bg-gold hover:text-kuro group-hover:translate-y-0 group-hover:opacity-100"
      >
        +
      </button>
    </motion.article>
  );
}

export function FeaturedDishCard({
  dish,
  onOpen,
  onAdd,
}: {
  dish: DishLike;
  onOpen: (d: DishLike) => void;
  onAdd: (d: DishLike, e: React.MouseEvent) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid cursor-pointer grid-cols-1 items-center gap-2 overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-washi-2 to-washi-3/70 p-6 sm:col-span-2 sm:grid-cols-2 sm:p-8"
      onClick={() => onOpen(dish)}
    >
      <div className="relative aspect-square sm:aspect-[4/3]">
        {dish.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gridSrc(dish.img)}
            alt={dish.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:rotate-1"
            style={{ filter: "drop-shadow(0 26px 30px rgba(34,48,42,0.32))" }}
          />
        ) : (
          !dish.video && <MediaFallback />
        )}
        {dish.video && <PrepVideo src={dish.video} />}
        {dish.isNew && (
          <span className="hanko absolute left-0 top-2 rounded-sm px-3 py-1.5 text-[10px] font-medium uppercase">
            Nouveaute
          </span>
        )}
      </div>

      <div className="relative">
        <span className="text-[10px] uppercase tracking-[0.35em] text-gold-dim">
          Suggestion du chef
        </span>
        <h4 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">{dish.name}</h4>
        {dish.desc && (
          <p className="mt-4 line-clamp-3 text-sm font-light leading-relaxed text-ink-soft">{dish.desc}</p>
        )}
        <div className="mt-6 flex items-center gap-5">
          <Price value={dish.price} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(dish, e);
            }}
            className="cursor-pointer rounded-lg border border-ink/20 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:border-gold hover:bg-gold hover:text-kuro"
          >
            Ajouter +
          </button>
        </div>
      </div>
    </motion.article>
  );
}
