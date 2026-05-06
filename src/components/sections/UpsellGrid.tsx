"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore, cartSelectors } from "@/lib/store/cart-store";
import type { Product } from "@/lib/types/product";

interface Props {
  step: { current: number; total: number };
  title: string;
  kicker: string;
  products: Product[];
  nextHref: string;
  nextLabel: string;
  backHref: string;
  /** Where to send the user if they tap "Skip". Defaults to /checkout. */
  skipHref?: string;
}

export function UpsellGrid({
  step,
  title,
  kicker,
  products,
  nextHref,
  nextLabel,
  backHref,
  skipHref = "/checkout",
}: Props) {
  const cartItems = useCartStore((s) => s.items);
  const cartSubtotal = useCartStore(cartSelectors.subtotal);
  const cartCount = useCartStore(cartSelectors.count);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);

  const inCart = (id: string) => cartItems.find((i) => i.id === id);
  const stepSelections = products.filter((p) => inCart(p.id)).length;

  const easing = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="space-y-12">
      <div className="text-center">
        <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
          {kicker}
        </span>
        <h1 className="font-display text-5xl md:text-6xl mt-4">{title}</h1>

        <div className="mt-10 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span>
              Etape {step.current} / {step.total}
            </span>
            <span className="text-gold">
              {Math.round((step.current / step.total) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-dark-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step.current / step.total) * 100}%` }}
              transition={{ duration: 0.8, ease: easing }}
              className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
            />
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-white/40 text-sm py-12">
          Aucun produit dans cette categorie pour l&apos;instant.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => {
            const present = !!inCart(p.id);
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easing, delay: i * 0.06 }}
                className={`group rounded-xl bg-dark-3 border overflow-hidden transition-all relative ${
                  present ? "border-gold" : "border-white/5 hover:border-gold/30"
                }`}
              >
                <Link
                  href={`/product/${p.slug}`}
                  aria-label={p.name}
                  className="absolute inset-0 z-0"
                />
                <div className="relative aspect-[4/3] pointer-events-none">
                  <Image
                    src={p.images[0]?.src ?? ""}
                    alt={p.images[0]?.alt ?? p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-dark/70 backdrop-blur-sm border border-gold/20 text-gold px-3 py-1 rounded-md font-display text-base">
                    {p.price.amount} DH
                  </div>
                </div>
                <div className="p-5 space-y-3 pointer-events-none">
                  <h4 className="font-display text-lg">{p.name}</h4>
                  {p.description && (
                    <p className="text-white/40 text-xs font-light line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (present) {
                        remove(p.id);
                      } else {
                        add({
                          id: p.id,
                          slug: p.slug,
                          name: p.name,
                          price: p.price.amount,
                          image: p.images[0]?.src ?? "",
                        });
                      }
                    }}
                    className={`pointer-events-auto relative z-10 w-full py-2.5 rounded-lg font-semibold tracking-[0.1em] text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${
                      present
                        ? "bg-gold text-dark"
                        : "bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-dark"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {present ? "check" : "add"}
                    </span>
                    {present ? "Ajoute" : "Ajouter"}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      <div className="pt-8 border-t border-white/5 space-y-5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em]">
          <span className="text-white/40">
            {stepSelections > 0 ? (
              <>
                <span className="text-gold font-semibold">{stepSelections}</span> ajout
                {stepSelections > 1 ? "s" : ""} a cette etape
              </>
            ) : (
              "Aucun ajout selectionne"
            )}
          </span>
          <span className="flex items-center gap-2 text-white/40">
            <span className="material-symbols-outlined text-[16px] text-gold">
              shopping_bag
            </span>
            <span>
              <span className="text-white">{cartCount}</span> article
              {cartCount > 1 ? "s" : ""} —{" "}
              <span className="text-gold font-display text-base tabular-nums">
                {cartSubtotal} DH
              </span>
            </span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Link
            href={backHref}
            className="btn-outline px-7 py-3 rounded-lg font-semibold text-[11px] uppercase tracking-[0.15em] text-center inline-flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Retour
          </Link>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={skipHref}
              className="px-7 py-3 rounded-lg font-semibold text-[11px] uppercase tracking-[0.15em] text-center text-white/40 hover:text-gold transition-colors inline-flex items-center justify-center gap-2"
            >
              Passer cette etape
            </Link>
            <Link
              href={nextHref}
              className="btn-gold px-10 py-3 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2"
            >
              {nextLabel}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
