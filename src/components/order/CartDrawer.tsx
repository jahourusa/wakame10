"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, cartSelectors } from "@/lib/store/cart-store";
import { useOrderModalStore, type DrawerStep } from "@/lib/store/order-modal-store";
import { SushiBoxIcon } from "@/components/ui/SushiBoxIcon";
import type { Product } from "@/lib/types/product";

const easing = [0.22, 1, 0.36, 1] as const;
const DELIVERY_FEE = 25;

export function CartDrawer() {
  const router = useRouter();
  const drawerOpen = useOrderModalStore((s) => s.drawerOpen);
  const drawerStep = useOrderModalStore((s) => s.drawerStep);
  const setStep = useOrderModalStore((s) => s.setStep);
  const closeDrawer = useOrderModalStore((s) => s.closeDrawer);
  const salades = useOrderModalStore((s) => s.salades);
  const boissons = useOrderModalStore((s) => s.boissons);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(cartSelectors.subtotal);
  const setQty = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  useEffect(() => {
    if (drawerOpen) document.body.classList.add("branch-lock");
    else document.body.classList.remove("branch-lock");
    return () => document.body.classList.remove("branch-lock");
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  const onContinue = () => {
    if (items.length === 0) return;
    if (drawerStep === "cart") setStep("salades");
    else if (drawerStep === "salades") setStep("boissons");
    else if (drawerStep === "boissons") {
      closeDrawer();
      router.push("/checkout");
    }
  };

  const onBack = () => {
    if (drawerStep === "salades") setStep("cart");
    else if (drawerStep === "boissons") setStep("salades");
  };

  const ctaLabel =
    drawerStep === "cart"
      ? "Continuer"
      : drawerStep === "salades"
        ? "Continuer vers Boissons"
        : "Passer au paiement";

  const headerTitle =
    drawerStep === "cart"
      ? "Votre Panier"
      : drawerStep === "salades"
        ? "Salades, Soupes & Desserts"
        : "Boissons";

  const total = subtotal + (drawerStep === "boissons" ? DELIVERY_FEE : 0);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          key="cart-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[140]"
        >
          <div
            onClick={closeDrawer}
            className="absolute inset-0 bg-kuro/70 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: easing }}
            className="washi-surface absolute right-0 top-0 flex h-full w-full flex-col border-l border-gold/25 shadow-2xl sm:w-[480px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 bg-washi/70 px-6 py-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                {drawerStep !== "cart" && (
                  <button
                    onClick={onBack}
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
                    Etape {drawerStep === "cart" ? 1 : drawerStep === "salades" ? 2 : 3}{" "}
                    / 3
                  </p>
                  <h2 className="mt-1 font-display text-xl text-ink">{headerTitle}</h2>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Fermer"
                className="text-ink-soft transition-colors hover:text-gold-dim"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Step progress bar */}
            <div className="h-1 bg-washi-2">
              <motion.div
                animate={{
                  width:
                    drawerStep === "cart"
                      ? "33%"
                      : drawerStep === "salades"
                        ? "66%"
                        : "100%",
                }}
                transition={{ duration: 0.45, ease: easing }}
                className="h-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright"
              />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              {drawerStep === "cart" && (
                <CartItemsList items={items} setQty={setQty} remove={remove} />
              )}

              {drawerStep === "salades" && (
                <UpsellList products={salades} step="salades" />
              )}

              {drawerStep === "boissons" && (
                <UpsellList products={boissons} step="boissons" />
              )}
            </div>

            {/* Footer */}
            <div className="space-y-4 border-t border-ink/10 bg-washi/90 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink-soft/70">
                  {drawerStep === "boissons" ? "Total" : "Sous-total"}
                </span>
                <span className="font-display text-2xl tabular-nums text-gold-dim">
                  {total.toFixed(2)}
                  <span className="ml-1 text-xs uppercase tracking-widest opacity-70">
                    dh
                  </span>
                </span>
              </div>
              <button
                onClick={onContinue}
                disabled={items.length === 0}
                className="gold-breathe flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-bright px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {ctaLabel}
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------- Step contents -------------------------------

function CartItemsList({
  items,
  setQty,
  remove,
}: {
  items: ReturnType<typeof useCartStore.getState>["items"];
  setQty: (id: string, q: number) => void;
  remove: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="space-y-5 px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/25 bg-washi-2/70 text-gold-dim">
          <SushiBoxIcon size={28} />
        </div>
        <p className="text-sm text-ink-soft">Votre panier est vide</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-ink/10">
      <AnimatePresence>
        {items.map((it) => (
          <motion.li
            key={it.id}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex gap-4 p-5"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-ink/10 bg-washi-2/70">
              {it.image ? (
                <Image
                  src={it.image}
                  alt={it.name}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                  style={{ filter: "drop-shadow(0 6px 8px rgba(34,48,42,0.18))" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ink-soft/30">
                  <span className="material-symbols-outlined text-[20px]">
                    restaurant
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <h4 className="truncate text-sm font-medium text-ink">{it.name}</h4>
                <button
                  onClick={() => remove(it.id)}
                  aria-label="Retirer"
                  className="shrink-0 text-ink-soft/50 transition-colors hover:text-hanko"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <p className="mt-1 text-xs font-medium text-gold-dim">{it.price} DH</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex items-center rounded-md border border-ink/15 bg-washi">
                  <button
                    onClick={() => setQty(it.id, it.quantity - 1)}
                    className="px-2 py-1 text-ink-soft transition-colors hover:text-gold-dim"
                    aria-label="Diminuer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      remove
                    </span>
                  </button>
                  <span className="px-3 text-xs tabular-nums text-ink">{it.quantity}</span>
                  <button
                    onClick={() => setQty(it.id, it.quantity + 1)}
                    className="px-2 py-1 text-ink-soft transition-colors hover:text-gold-dim"
                    aria-label="Augmenter"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
                <span className="text-sm tabular-nums text-ink">
                  {(it.price * it.quantity).toFixed(2)} DH
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function UpsellList({ products, step }: { products: Product[]; step: DrawerStep }) {
  const cartItems = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);
  const has = (id: string) => cartItems.some((i) => i.id === id);

  if (products.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-sm text-ink-soft/70">
        Aucun produit dans cette categorie.
      </div>
    );
  }

  return (
    <div className="p-5">
      <p className="mb-5 text-center font-cormorant text-base italic text-gold-dim">
        {step === "salades"
          ? "Completez votre festin"
          : "Que voulez-vous boire ?"}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => {
          const present = has(p.id);
          return (
            <article key={p.id} className="space-y-2">
              <div
                className={`relative aspect-square overflow-hidden rounded-xl border bg-washi-2/70 transition-all ${
                  present
                    ? "border-gold ring-2 ring-gold/40"
                    : "border-ink/10 hover:border-gold/45"
                }`}
              >
                {p.images[0]?.src ? (
                  <Image
                    src={p.images[0].src}
                    alt={p.images[0].alt ?? p.name}
                    fill
                    sizes="200px"
                    className="object-contain p-3"
                    style={{ filter: "drop-shadow(0 12px 16px rgba(34,48,42,0.22))" }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-ink-soft/30">
                    <span className="material-symbols-outlined text-[40px]">
                      restaurant
                    </span>
                  </div>
                )}
                <button
                  onClick={() =>
                    present
                      ? remove(p.id)
                      : add({
                          id: p.id,
                          slug: p.slug,
                          name: p.name,
                          price: p.price.amount,
                          image: p.images[0]?.src ?? "",
                        })
                  }
                  aria-label={present ? "Retirer" : "Ajouter"}
                  className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 ${
                    present
                      ? "bg-gold text-kuro"
                      : "border border-gold/40 bg-washi text-gold-dim hover:border-gold hover:bg-gold hover:text-kuro"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {present ? "check" : "add"}
                  </span>
                </button>
              </div>
              <div className="px-1">
                <h4 className="line-clamp-2 text-sm font-medium leading-tight text-ink">
                  {p.name}
                </h4>
                <p className="mt-1 text-xs font-medium text-gold-dim">
                  {p.price.amount} DH
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
