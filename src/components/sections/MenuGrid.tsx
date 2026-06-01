"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
const CATEGORY_ICONS: Record<string, string> = {
  "small-assortiments": "breakfast_dining",
  "medium-assortiments": "restaurant",
  "large-assortiments": "takeout_dining",
  "x-large-assortiments": "dinner_dining",
  "base-de-salades": "eco",
  bentos: "lunch_dining",
  "california-rolls": "rice_bowl",
  combo: "dinner_dining",
  "crispy-rolls": "bakery_dining",
  "crunchy-rolls": "cookie",
  desserts: "cake",
  garnitures: "rice_bowl",
  jus: "local_drink",
  "le-petit-plus": "add_circle",
  "les-plats": "dinner_dining",
  "les-salades": "eco",
  "les-soupes": "soup_kitchen",
  "les-tapas": "tapas",
  "menu-kids": "child_care",
  "nori-rolls": "rice_bowl",
  nouilles: "ramen_dining",
  "poke-bowl": "ramen_dining",
  premium: "workspace_premium",
  "premium-rolls": "diamond",
  proteines: "egg",
  riz: "rice_bowl",
  "special-rolls": "auto_awesome",
  "spring-roll": "kebab_dining",
  "sushi-pizza": "local_pizza",
  tacos: "restaurant",
  "tanuki-rolls": "ramen_dining",
  woks: "skillet",
  yaki: "outdoor_grill",
};

const iconFor = (slug: string) => CATEGORY_ICONS[slug] ?? "restaurant";

// Promo videos shown as a square tile inserted *before* a specific product card
// in the menu grid. Add an entry per product slug to feature a new one.
// File must live in /public/ — e.g. /waka-dragon.mp4.
const PROMO_VIDEOS: Record<string, { src: string; title?: string }> = {
  "waka-dragon": { src: "/waka-dragon/waka-dragon.mp4", title: "Waka Dragon" },
  "salade-burratina": {
    src: "/salade-crevettes-vietnamienne/salade-crevettes-vietnamienne.mp4",
    title: "Salade crevettes a la vietnamienne",
  },
};

// Assortiment sizes first, jus + desserts last, others in WP order.
const PRIORITY_FIRST = [
  "small-assortiments",
  "medium-assortiments",
  "large-assortiments",
  "x-large-assortiments",
];
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

const sectionId = (slug: string) => `cat-${slug}`;

export function MenuGrid({ initialProducts, initialCategories }: Props) {
  const branch = useBranchStore((s) => s.branch);

  const categories = useMemo(() => sortCategories(initialCategories), [initialCategories]);

  // Group products by category, filtered by current branch.
  const productsByCat = useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const p of initialProducts) {
      const branchOk =
        !branch || p.branchSlugs.length === 0 || p.branchSlugs.includes(branch);
      if (!branchOk) continue;
      (map[p.category] = map[p.category] ?? []).push(p);
    }
    return map;
  }, [initialProducts, branch]);

  // Track which category section is currently visible — for sidebar highlight.
  const [active, setActive] = useState<string>(categories[0]?.slug ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that's actually intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const slug = visible[0].target.id.replace(/^cat-/, "");
          setActive(slug);
        }
      },
      {
        // Activate a section as it crosses the top quarter of the viewport.
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  const scrollTo = useCallback((slug: string) => {
    const el = document.getElementById(sectionId(slug));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (initialProducts.length === 0) {
    return (
      <p className="text-center text-white/40 text-sm py-16">
        Aucun produit disponible pour l&apos;instant.
      </p>
    );
  }

  return (
    <div>
      {/* MOBILE/TABLET — Horizontal sticky nav bar.
          top-[96px] keeps it below the fixed header.
          z-[60] keeps it above the header's bottom drop-shadow so chips don't get tinted. */}
      <div className="lg:hidden sticky top-[96px] z-[60] -mx-6 md:-mx-12 px-0 py-3 bg-dark/95 backdrop-blur-xl border-y border-white/5 mb-8">
        <div
          className="flex gap-2 overflow-x-auto px-6 md:px-12 snap-x scroll-px-6 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((c) => {
            const isActive = active === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => scrollTo(c.slug)}
                className={`shrink-0 snap-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.08em] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gold text-dark shadow-gold"
                    : "bg-dark-3 text-white/60 border border-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-[14px] shrink-0">
                  {iconFor(c.slug)}
                </span>
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP — Sidebar + stacked sections */}
      <div className="lg:grid lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
            <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-5 px-3">
              Categories
            </p>
            <nav className="flex flex-col gap-1 pb-6">
              {categories.map((c) => {
                const isActive = active === c.slug;
                return (
                  <button
                    key={c.slug}
                    onClick={() => scrollTo(c.slug)}
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

        {/* Stacked category sections */}
        <div className="min-w-0 space-y-20">
          {categories.map((cat) => {
            const products = productsByCat[cat.slug];
            if (!products || products.length === 0) return null;
            return (
              <section
                key={cat.slug}
                id={sectionId(cat.slug)}
                ref={(el) => {
                  sectionRefs.current[cat.slug] = el;
                }}
                className="scroll-mt-32"
              >
                <header className="mb-8">
                  <h2 className="font-display text-3xl md:text-5xl uppercase tracking-wide">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-white/55 mt-4 max-w-3xl leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.flatMap((p) => {
                    const promo = PROMO_VIDEOS[p.slug];
                    const card = <ProductCard key={p.id} product={p} />;
                    return promo
                      ? [
                          <VideoPromoTile
                            key={`promo-${p.slug}`}
                            src={promo.src}
                            title={promo.title}
                          />,
                          card,
                        ]
                      : [card];
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----- Product card ---------------------------------------------------------

function ProductCard({ product: p }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const openProduct = useOrderModalStore((s) => s.openProduct);
  const fly = useFlyStore((s) => s.fly);

  return (
    <article className="group relative h-[440px] rounded-xl overflow-hidden bg-dark-3 bg-[url('/background.webp')] bg-cover bg-center">
      <button
        onClick={() => openProduct(p)}
        aria-label={p.name}
        className="absolute inset-0 z-0 cursor-pointer"
      />
      {p.images[0]?.src ? (
        <Image
          src={p.images[0].src}
          alt={p.images[0].alt ?? p.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain transition-transform duration-700 group-hover:scale-105 pointer-events-none p-6"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/20 pointer-events-none">
          <span className="material-symbols-outlined text-[64px]">restaurant</span>
        </div>
      )}
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
    </article>
  );
}

// ----- Promo video tile ------------------------------------------------------
// Square (1:1) auto-playing muted looped video shown as a feature tile in the
// product grid. Hides itself if the video file is missing so the menu page
// doesn't break before the asset is uploaded.
function VideoPromoTile({ src }: { src: string; title?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <article className="group relative h-[440px] rounded-xl overflow-hidden bg-dark-3">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-dark text-[9px] uppercase tracking-[0.25em] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-dark animate-pulse" />
          Nouveaute
        </span>
      </div>
    </article>
  );
}
