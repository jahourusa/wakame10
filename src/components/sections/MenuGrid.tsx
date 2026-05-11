"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart-store";
import { useBranchStore } from "@/lib/store/branch-store";
import { useOrderModalStore } from "@/lib/store/order-modal-store";
import { useFlyStore } from "@/lib/store/fly-store";
import type { Product, Category } from "@/lib/types/product";

interface Props {
  initialProducts: Product[];
  initialCategories: Category[];
}

// Maps each WooCommerce category slug to a Material Symbols icon.
// Add new entries here whenever a new category is added in WP.
const CATEGORY_ICONS: Record<string, string> = {
  all: "restaurant_menu",
  assortiments: "dinner_dining",
  "assortiments-medium": "set_meal",
  bentos: "lunch_dining",
  "boissons-froides": "local_bar",
  "california-rolls": "rice_bowl",
  "crispy-rolls": "bakery_dining",
  "crunchy-rolls": "cookie",
  desserts: "cake",
  jus: "local_drink",
  large: "takeout_dining",
  medium: "restaurant",
  "nori-rolls": "rice_bowl",
  "poke-bowl": "ramen_dining",
  premium: "workspace_premium",
  salades: "eco",
  small: "breakfast_dining",
  soupes: "soup_kitchen",
  "special-rolls": "auto_awesome",
  "spring-roll": "kebab_dining",
  "sushi-pizza": "local_pizza",
  tacos: "restaurant",
  "tanuki-rolls": "ramen_dining",
  "x-large": "dinner_dining",
};

const iconFor = (slug: string) => CATEGORY_ICONS[slug] ?? "restaurant";

// Ordering: assortiment sizes first (after "Tout"), middle stays as-is,
// jus & desserts pushed to the end.
const PRIORITY_FIRST = ["all", "small", "medium", "large", "x-large"];
const PRIORITY_LAST = ["jus", "desserts"];

function sortCategories<T extends { slug: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const aF = PRIORITY_FIRST.indexOf(a.slug);
    const bF = PRIORITY_FIRST.indexOf(b.slug);
    if (aF !== -1 && bF !== -1) return aF - bF;
    if (aF !== -1) return -1;
    if (bF !== -1) return 1;

    const aL = PRIORITY_LAST.indexOf(a.slug);
    const bL = PRIORITY_LAST.indexOf(b.slug);
    if (aL !== -1 && bL !== -1) return aL - bL;
    if (aL !== -1) return 1;
    if (bL !== -1) return -1;

    return 0;
  });
}

export function MenuGrid({ initialProducts, initialCategories }: Props) {
  const [active, setActive] = useState<string>("all");
  const branch = useBranchStore((s) => s.branch);
  const add = useCartStore((s) => s.add);
  const openProduct = useOrderModalStore((s) => s.openProduct);
  const fly = useFlyStore((s) => s.fly);

  const categories = useMemo(
    () =>
      sortCategories([
        { slug: "all", name: "Tout" },
        ...initialCategories.map((c) => ({ slug: c.slug, name: c.name })),
      ]),
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
    <div>
      {/* MOBILE/TABLET — Horizontal sticky filter bar */}
      <div className="lg:hidden sticky top-20 z-30 -mx-6 md:-mx-12 px-6 md:px-12 py-3 bg-dark/95 backdrop-blur-xl border-y border-white/5 mb-8">
        <div
          className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((c) => {
            const isActive = active === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setActive(c.slug)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.12em] font-semibold transition-all ${
                  isActive
                    ? "bg-gold text-dark shadow-gold"
                    : "bg-dark-3 text-white/60 border border-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {iconFor(c.slug)}
                </span>
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP — Sidebar + Grid */}
      <div className="lg:grid lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr] lg:gap-12">
        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-5 px-3">
              Categories
            </p>
            <nav className="flex flex-col gap-1">
              {categories.map((c) => {
                const isActive = active === c.slug;
                return (
                  <button
                    key={c.slug}
                    onClick={() => setActive(c.slug)}
                    className={`group flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                      isActive
                        ? "bg-gold/10 text-gold"
                        : "text-white/55 hover:text-gold hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] transition-colors ${
                        isActive ? "text-gold" : "text-white/30 group-hover:text-gold"
                      }`}
                    >
                      {iconFor(c.slug)}
                    </span>
                    <span className="text-sm font-medium tracking-wide flex-1">
                      {c.name}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="active-cat-dot"
                        className="w-1.5 h-1.5 rounded-full bg-gold"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Product grid */}
        <div className="min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative h-[440px] rounded-xl overflow-hidden bg-dark-3 bg-[url('/background.webp')] bg-cover bg-center"
                >
                  <button
                    onClick={() => openProduct(p)}
                    aria-label={p.name}
                    className="absolute inset-0 z-0 cursor-pointer"
                  />
                  <Image
                    src={p.images[0]?.src ?? ""}
                    alt={p.images[0]?.alt ?? p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-105 pointer-events-none p-6"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute top-4 right-4 bg-dark/70 backdrop-blur-sm border border-gold/20 text-gold px-4 py-2 rounded-lg font-display text-lg pointer-events-none">
                    {p.price.amount} DH
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 pr-20 space-y-2 pointer-events-none">
                    <h4 className="font-display text-xl text-white">{p.name}</h4>
                    <p className="text-white/40 text-xs font-light leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                  </div>
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
                    className="pointer-events-auto absolute bottom-5 right-5 z-10 w-12 h-12 rounded-full bg-gold text-dark shadow-gold hover:shadow-gold-hover hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[22px]">add</span>
                  </button>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-white/30 text-xs uppercase tracking-[0.2em] py-16">
              Aucun produit pour cette categorie.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
