"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DishCard, FeaturedDishCard, type DishLike } from "./DishCard";
import FamilyNav from "./FamilyNav";
import ParallaxDecor from "./ParallaxDecor";
import BrandBand from "./BrandBand";
import InViewVideo from "./InViewVideo";
import { BrushStroke, WaveLines } from "./LineArt";
import { familyKanji, type Family } from "@/lib/menu/families";
import { useCartStore } from "@/lib/store/cart-store";
import { useOrderModalStore } from "@/lib/store/order-modal-store";
import { useFlyStore } from "@/lib/store/fly-store";
import { useBranchStore } from "@/lib/store/branch-store";
import { BRANCHES } from "@/lib/types/branch";

const BANDS: Record<
  string,
  { label: string; title: string; tagline: string; banner?: string; video?: string }
> = {
  feu: {
    label: "Le feu de bois",
    title: "La braise, notre signature",
    tagline:
      "Yakitoris et proteines saisis au charbon binchotan — la flamme vive qui caramelise, le fume qui signe chaque assiette.",
    banner: "/assets/banners/banner-feu.jpg",
    video: "/assets/videos/flame-ambience.mp4",
  },
  rolls: {
    label: "L'atelier sushi",
    title: "Rolls roules a la minute",
    tagline:
      "California, crunchy, premium — chaque roll est faconne a la commande par nos chefs, du riz vinaigre a la derniere feuille de nori.",
    banner: "/assets/banners/banner-rolls.jpg",
  },
  bentos: {
    label: "A partager",
    title: "Bentos & assortiments",
    tagline:
      "Des coffrets composes pour deux, pour quatre, pour la table entiere — l'omakase de Wakame en format genereux.",
    banner: "/assets/banners/banner-bentos.jpg",
  },
};

export default function MenuExperience({ families }: { families: Family[] }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeFamily, setActiveFamily] = useState(families[0]?.id ?? "");

  const branchSlug = useBranchStore((s) => s.branch);
  const branch =
    BRANCHES.find((b) => b.slug === branchSlug) ?? BRANCHES[0];

  const openProduct = useOrderModalStore((s) => s.openProduct);
  const addToCart = useCartStore((s) => s.add);
  const fly = useFlyStore((s) => s.fly);

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 700], [1, 0.92]);
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0.25]);
  const heroY = useTransform(scrollY, [0, 700], [0, -60]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveFamily(e.target.id.replace("fam-", ""));
          }
        }
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    document.querySelectorAll("section[id^='fam-']").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [families]);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpen = (d: DishLike) => {
    openProduct(d.product);
  };

  const handleAdd = (d: DishLike, e: React.MouseEvent) => {
    if (d.price == null) return;
    addToCart({
      id: d.product.id,
      slug: d.product.slug,
      name: d.product.name,
      price: d.product.price.amount,
      image: d.product.images[0]?.src ?? "",
    });
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    fly(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      d.product.images[0]?.src
    );
  };

  return (
    <div className="relative grain">
      {/* ---------- dark hero, pinned under the paper ---------- */}
      <div
        ref={heroRef}
        className="theater-surface sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden"
      >
        <InViewVideo
          src="/assets/videos/hero-ambience.mp4"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(7,16,12,0.25),rgba(7,16,12,0.88))]" />
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          <span className="text-[11px] uppercase tracking-[0.5em] text-gold/70">Notre carte</span>
          <h1 className="mt-6 font-display text-[clamp(4rem,14vw,11rem)] leading-none text-washi">
            Menu
          </h1>
          <p className="mt-6 font-cormorant text-2xl italic text-gold-bright/90 sm:text-3xl">
            {branch.name} — {branch.area}
          </p>
          <WaveLines className="mt-10 h-14 w-56 text-gold/30" delay={0.4} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 flex flex-col items-center gap-3 text-gold/60"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">Decouvrir</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-lg"
          >
            &#8595;
          </motion.span>
        </motion.div>
      </div>

      {/* ---------- washi sheet slides up over the dark ---------- */}
      <div className="washi-surface relative z-10 -mt-[14vh] rounded-t-[2.5rem] px-6 pb-32 pt-2 text-ink shadow-[0_-30px_80px_rgba(0,0,0,0.55)] sm:px-10">
        <div className="gold-thread absolute left-1/2 top-0 w-2/3 -translate-x-1/2" />
        <div className="mx-auto mb-1 mt-4 h-1.5 w-14 rounded-full bg-ink/10" />

        <ParallaxDecor />

        <div className="relative z-10 mx-auto max-w-7xl">
          <FamilyNav families={families} activeFamily={activeFamily} onJump={jump} />

          {families.map((fam) => (
            <section key={fam.id} id={`fam-${fam.id}`} className="scroll-mt-48 pt-20">
              {BANDS[fam.id] && <BrandBand {...BANDS[fam.id]} />}
              <header className="relative mb-12">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[7rem] leading-none text-ink/[0.05] sm:text-[10rem]"
                >
                  {familyKanji(fam.id)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold-dim">
                  La carte — {branch.name}
                </span>
                <h2 className="mt-3 font-display text-5xl text-ink sm:text-6xl">{fam.label}</h2>
                <BrushStroke className="mt-4 h-5 w-52 text-gold" />
              </header>

              {fam.categories.map((cat) => {
                if (cat.items.length === 0) return null;
                const [first, ...rest] = cat.items;
                const featureFirst = cat.items.length > 3;
                return (
                  <div key={cat.id} id={`cat-${cat.id}`} className="cv-auto scroll-mt-52 pb-16">
                    <div className="mb-7 flex items-baseline gap-4">
                      <h3 className="font-display text-2xl uppercase tracking-wide text-ink/85">
                        {cat.title}
                      </h3>
                      <span className="gold-thread hidden w-24 sm:block" />
                      <span className="text-xs font-light text-ink-soft/70">
                        {cat.items.length} creations
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {featureFirst ? (
                        <>
                          <FeaturedDishCard dish={first} onOpen={handleOpen} onAdd={handleAdd} />
                          {rest.map((d, i) => (
                            <DishCard
                              key={d.id}
                              dish={d}
                              index={i}
                              onOpen={handleOpen}
                              onAdd={handleAdd}
                            />
                          ))}
                        </>
                      ) : (
                        cat.items.map((d, i) => (
                          <DishCard
                            key={d.id}
                            dish={d}
                            index={i}
                            onOpen={handleOpen}
                            onAdd={handleAdd}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
