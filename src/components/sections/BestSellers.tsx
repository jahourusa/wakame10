"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { BrushStroke } from "@/components/menu-experience/LineArt";
import { useCartStore } from "@/lib/store/cart-store";
import { useOrderModalStore } from "@/lib/store/order-modal-store";
import { useFlyStore } from "@/lib/store/fly-store";
import type { Product } from "@/lib/types/product";

interface Props {
  products: Product[];
}

const PRIORITY_CATEGORIES = ["medium-assortiments", "bentos", "tacos-fusion"];

function priorityRank(slug: string): number {
  const i = PRIORITY_CATEGORIES.indexOf(slug);
  return i === -1 ? PRIORITY_CATEGORIES.length : i;
}

const gridSrc = (url: string) => url.replace("&w=1080&", "&w=640&");

export function BestSellers({ products }: Props) {
  const add = useCartStore((s) => s.add);
  const openProduct = useOrderModalStore((s) => s.openProduct);
  const fly = useFlyStore((s) => s.fly);
  const featured = [...products]
    .sort((a, b) => priorityRank(a.category) - priorityRank(b.category))
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="washi-surface relative overflow-hidden py-32 md:py-40">
      <span
        aria-hidden
        className="pointer-events-none absolute left-6 top-16 select-none font-display text-[8rem] leading-none text-ink/[0.05] sm:text-[12rem]"
      >
        &#23551;
      </span>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
              Best Sellers
            </span>
            <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
              Les Incontournables
            </h2>
            <BrushStroke className="mt-4 h-5 w-52 text-gold" />
          </div>
          <Link
            href="/menu"
            className="hidden rounded-lg border border-ink/20 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:border-gold hover:bg-gold hover:text-kuro md:inline-block"
          >
            Voir tout le menu
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((p, i) => {
            const isFirst = i === 0;
            return (
              <Reveal key={p.id} delay={0.1 * (i + 1)}>
                <article
                  onClick={() => openProduct(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openProduct(p);
                    }
                  }}
                  className="group relative flex cursor-pointer flex-col rounded-xl p-5 transition-colors duration-500 hover:bg-washi-2/60"
                >
                <span className="pointer-events-none absolute inset-0 rounded-xl border border-transparent transition-colors duration-500 group-hover:border-gold/35" />

                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-washi-2/50">
                  {p.images[0]?.src ? (
                    <Image
                      src={gridSrc(p.images[0].src)}
                      alt={p.images[0].alt ?? p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="pointer-events-none object-contain p-4 transition-transform duration-700 group-hover:scale-[1.07] group-hover:-rotate-1"
                      style={{ filter: "drop-shadow(0 18px 22px rgba(34,48,42,0.28))" }}
                    />
                  ) : (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-ink-soft/30">
                      <span className="material-symbols-outlined text-[64px]">restaurant</span>
                    </div>
                  )}

                  {isFirst && (
                    <span className="hanko pointer-events-none absolute left-2 top-2 rounded-sm px-2.5 py-1 text-[9px] font-medium uppercase">
                      Best Seller
                    </span>
                  )}
                </div>

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <h4 className="font-display text-xl leading-snug text-ink">{p.name}</h4>
                  <span className="font-display text-xl leading-none text-gold-dim">
                    {p.price.amount}
                    <span className="ml-1 text-[11px] uppercase tracking-widest opacity-70">
                      dh
                    </span>
                  </span>
                </div>
                {p.description && (
                  <p className="relative z-10 mt-1.5 line-clamp-2 text-[13px] font-light leading-relaxed text-ink-soft">
                    {p.description}
                  </p>
                )}

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    fly(
                      rect.left + rect.width / 2,
                      rect.top + rect.height / 2,
                      p.images[0]?.src
                    );
                    add({
                      id: p.id,
                      slug: p.slug,
                      name: p.name,
                      price: p.price.amount,
                      image: p.images[0]?.src ?? "",
                    });
                  }}
                  aria-label={`Ajouter ${p.name} au panier`}
                  className="absolute bottom-5 right-5 z-10 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-ink/15 bg-washi text-ink opacity-0 transition-all duration-300 hover:scale-110 hover:border-gold hover:bg-gold hover:text-kuro group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center md:hidden">
          <Link
            href="/menu"
            className="rounded-lg border border-ink/20 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink"
          >
            Voir tout le menu
          </Link>
        </div>
      </div>
    </section>
  );
}
