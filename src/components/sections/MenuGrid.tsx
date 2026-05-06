"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart-store";
import { useBranchStore } from "@/lib/store/branch-store";
import type { Product, Category } from "@/lib/types/product";

interface Props {
  initialProducts: Product[];
  initialCategories: Category[];
}

export function MenuGrid({ initialProducts, initialCategories }: Props) {
  const [active, setActive] = useState<string>("all");
  const branch = useBranchStore((s) => s.branch);
  const add = useCartStore((s) => s.add);

  const categories = useMemo(
    () => [
      { slug: "all", name: "Tout" },
      ...initialCategories.map((c) => ({ slug: c.slug, name: c.name })),
    ],
    [initialCategories]
  );

  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const branchOk =
        !branch || p.branchSlugs.length === 0 || p.branchSlugs.includes(branch);
      const catOk = active === "all" || p.category === active;
      return branchOk && catOk;
    });
  }, [initialProducts, active, branch]);

  if (initialProducts.length === 0) {
    return (
      <p className="text-center text-white/40 text-sm py-16">
        Aucun produit disponible pour l&apos;instant.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((c) => {
          const isActive = active === c.slug;
          return (
            <button
              key={c.slug}
              onClick={() => setActive(c.slug)}
              className={`px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.15em] font-semibold transition-all ${
                isActive
                  ? "bg-gold text-dark shadow-gold"
                  : "bg-dark-3 text-white/50 border border-white/5 hover:text-gold hover:border-gold/30"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-[440px] rounded-xl overflow-hidden bg-dark-3"
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
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
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
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-white/30 text-xs uppercase tracking-[0.2em] py-12">
          Aucun produit pour cette categorie.
        </p>
      )}
    </div>
  );
}
