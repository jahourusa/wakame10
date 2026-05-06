"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { useCartStore } from "@/lib/store/cart-store";
import type { Product } from "@/lib/types/product";

interface Props {
  products: Product[];
}

export function BestSellers({ products }: Props) {
  const add = useCartStore((s) => s.add);
  const featured = products.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="py-32 md:py-40 bg-dark-2">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
              Best Sellers
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-3">
              Les Incontournables
            </h2>
          </div>
          <Link
            href="/menu"
            className="btn-outline px-8 py-3 rounded-lg font-semibold text-[11px] uppercase tracking-[0.12em] hidden md:inline-block"
          >
            Voir tout le menu
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((p, i) => {
            const isFirst = i === 0;
            return (
              <Reveal
                key={p.id}
                delay={0.1 * (i + 1)}
                className="group relative h-[480px] rounded-xl overflow-hidden"
              >
                <Link
                  href={`/product/${p.slug}`}
                  aria-label={p.name}
                  className="absolute inset-0 z-0"
                />
                <Image
                  src={p.images[0]?.src ?? ""}
                  alt={p.images[0]?.alt ?? p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                <div
                  className={`absolute top-4 left-4 ${
                    isFirst
                      ? "bg-gold text-dark"
                      : "bg-dark/70 backdrop-blur-sm text-white/70"
                  } px-3 py-1 rounded-full text-[9px] font-${
                    isFirst ? "bold" : "semibold"
                  } uppercase tracking-[0.1em] pointer-events-none`}
                >
                  {isFirst ? "Best Seller" : p.category || "Signature"}
                </div>

                <div className="absolute top-4 right-4 bg-dark/70 backdrop-blur-sm border border-gold/20 text-gold px-4 py-2 rounded-lg font-display text-lg pointer-events-none">
                  {p.price.amount} DH
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 pointer-events-none">
                  <h4 className="font-display text-xl text-white">{p.name}</h4>
                  <p className="text-white/40 text-xs font-light leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      add({
                        id: p.id,
                        slug: p.slug,
                        name: p.name,
                        price: p.price.amount,
                        image: p.images[0]?.src ?? "",
                      });
                    }}
                    className="pointer-events-auto relative z-10 w-full py-3 rounded-lg bg-gold/10 border border-gold/20 text-gold font-semibold tracking-[0.1em] text-[10px] uppercase hover:bg-gold hover:text-dark transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add_shopping_cart
                    </span>
                    Ajouter au panier
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
