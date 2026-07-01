"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store/cart-store";
import { useFlyStore } from "@/lib/store/fly-store";
import { BrushStroke } from "./LineArt";
import type { Family, Category } from "@/lib/menu/families";
import type { DishLike } from "@/lib/menu/dish";

const easing = [0.22, 1, 0.36, 1] as const;
const STEP_LABELS = ["Base de salades", "Proteines", "Garnitures"] as const;

export default function HealthyMoodSection({ family }: { family: Family }) {
  const [open, setOpen] = useState(false);
  const add = useCartStore((s) => s.add);
  const fly = useFlyStore((s) => s.fly);

  // Categories in the family are already in the right order from families.ts:
  // 0 = base-de-salades, 1 = proteines, 2 = garnitures
  const steps = family.categories;

  const onConfirm = (selected: DishLike[], anchor: { x: number; y: number }) => {
    for (const d of selected) {
      if (d.price == null) continue;
      add({
        id: d.product.id,
        slug: d.product.slug,
        name: d.product.name,
        price: d.product.price.amount,
        image: d.product.images[0]?.src ?? "",
      });
    }
    fly(anchor.x, anchor.y, selected[0]?.product.images[0]?.src);
    setOpen(false);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-kuro">
        <div className="absolute inset-0">
          <Image
            src="/assets/banners/banner-feu.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-kuro via-kuro/80 to-kuro/40" />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-gold/40" />
        <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-gold/40" />
        <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-gold/40" />
        <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-gold/40" />

        <div className="relative z-10 flex flex-col gap-6 px-8 py-12 sm:px-14 sm:py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-bright/80">
              Healthy Mood
            </span>
            <h3 className="mt-3 font-display text-3xl leading-tight text-washi sm:text-5xl">
              Composez votre assiette equilibree
            </h3>
            <BrushStroke className="mt-4 h-5 w-52 text-gold" />
            <p className="mt-5 max-w-xl text-sm font-light leading-relaxed text-washi/70">
              Choisissez une base de salade, votre proteine grillee au feu de bois
              et la garniture qui vous ressemble — nous l&apos;assemblons a la
              minute.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="gold-breathe shrink-0 self-start rounded-full bg-gradient-to-r from-gold to-gold-bright px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] md:self-auto"
          >
            Composer mon assiette &rarr;
          </button>
        </div>
      </div>

      <ComposeModal
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        onConfirm={onConfirm}
      />
    </>
  );
}

// ---------------- Modal ----------------

function ComposeModal({
  open,
  onClose,
  steps,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  steps: Category[];
  onConfirm: (selected: DishLike[], anchor: { x: number; y: number }) => void;
}) {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<(DishLike | null)[]>(() => steps.map(() => null));

  // Reset when the modal opens or the steps change
  useMemo(() => {
    if (open) {
      setStep(0);
      setPicks(steps.map(() => null));
    }
  }, [open, steps]);

  if (steps.length === 0) return null;

  const current = steps[step];
  const currentPick = picks[step];
  const canContinue = currentPick !== null;
  const isLast = step === steps.length - 1;

  const total = picks.reduce((acc, p) => acc + (p?.price ?? 0), 0);

  const select = (d: DishLike) => {
    setPicks((prev) => {
      const next = [...prev];
      next[step] = next[step]?.id === d.id ? null : d;
      return next;
    });
  };

  const onNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canContinue) return;
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    onConfirm(
      picks.filter((p): p is DishLike => p !== null),
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="compose-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[160] flex items-end justify-center md:items-center"
        >
          <div
            onClick={onClose}
            className="absolute inset-0 bg-kuro/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.45, ease: easing }}
            className="washi-surface relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-gold/25 shadow-2xl md:w-[92vw] md:rounded-3xl"
          >
            <span className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-gold/40" />
            <span className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-gold/40" />
            <span className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-gold/40" />
            <span className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-gold/40" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 bg-washi/70 px-6 py-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    aria-label="Retour"
                    className="text-ink-soft transition-colors hover:text-gold-dim"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      arrow_back
                    </span>
                  </button>
                )}
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-dim">
                    Etape {step + 1} / {steps.length}
                  </p>
                  <h2 className="mt-1 font-display text-xl text-ink">
                    {STEP_LABELS[step] ?? current.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="text-ink-soft transition-colors hover:text-gold-dim"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-washi-2">
              <motion.div
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.45, ease: easing }}
                className="h-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright"
              />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7" data-lenis-prevent>
              <p className="mb-5 text-center font-cormorant text-lg italic text-gold-dim">
                {step === 0 && "Choisissez votre base"}
                {step === 1 && "Choisissez votre proteine"}
                {step === 2 && "Choisissez votre garniture"}
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {current.items.map((d) => {
                  const selected = currentPick?.id === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => select(d)}
                      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-washi-2/60 text-left transition-all ${
                        selected
                          ? "border-gold ring-2 ring-gold/40"
                          : "border-ink/10 hover:border-gold/45"
                      }`}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        {d.img ? (
                          <Image
                            src={d.img}
                            alt={d.name}
                            fill
                            sizes="(max-width: 640px) 45vw, 25vw"
                            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                            style={{
                              filter: "drop-shadow(0 12px 16px rgba(34,48,42,0.22))",
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-ink-soft/30">
                            <span className="material-symbols-outlined text-[40px]">
                              restaurant
                            </span>
                          </div>
                        )}
                        {selected && (
                          <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-kuro shadow-lg">
                            <span className="material-symbols-outlined text-[18px]">
                              check
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="px-3 pb-3 pt-2">
                        <h4 className="line-clamp-2 text-sm font-medium leading-tight text-ink">
                          {d.name}
                        </h4>
                        {d.price != null && (
                          <p className="mt-1 text-xs font-medium text-gold-dim">
                            {d.price} DH
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-4 border-t border-ink/10 bg-washi/90 p-5 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-soft/70">
                  Total assiette
                </span>
                <span className="font-display text-2xl tabular-nums text-gold-dim">
                  {total.toFixed(2)}
                  <span className="ml-1 text-xs uppercase tracking-widest opacity-70">
                    dh
                  </span>
                </span>
              </div>
              <button
                onClick={onNext}
                disabled={!canContinue}
                className="gold-breathe flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-bright px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLast ? "Confirmer et ajouter au panier" : "Continuer"}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
