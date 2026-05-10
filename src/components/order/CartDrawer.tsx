"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, cartSelectors } from "@/lib/store/cart-store";
import { useOrderModalStore, type DrawerStep } from "@/lib/store/order-modal-store";
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

  // Lock body scroll
  useEffect(() => {
    if (drawerOpen) document.body.classList.add("branch-lock");
    else document.body.classList.remove("branch-lock");
    return () => document.body.classList.remove("branch-lock");
  }, [drawerOpen]);

  // ESC closes
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  // -------- Step navigation -----------------------------------------------
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
        : "Boissons & Jus";

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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: easing }}
            className="absolute top-0 right-0 w-full sm:w-[480px] h-full bg-dark-2 border-l border-gold/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                {drawerStep !== "cart" && (
                  <button
                    onClick={onBack}
                    aria-label="Retour"
                    className="text-white/50 hover:text-gold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      arrow_back
                    </span>
                  </button>
                )}
                <div>
                  <p className="text-gold text-[9px] uppercase tracking-[0.3em] font-semibold">
                    Etape {drawerStep === "cart" ? 1 : drawerStep === "salades" ? 2 : 3}{" "}
                    / 3
                  </p>
                  <h2 className="font-display text-xl">{headerTitle}</h2>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Fermer"
                className="text-white/50 hover:text-gold transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Step progress bar */}
            <div className="h-1 bg-dark-3">
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
                className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
              />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
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
            <div className="border-t border-white/5 p-6 space-y-4 bg-dark-2/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-[10px] uppercase tracking-[0.2em]">
                  {drawerStep === "boissons" ? "Total" : "Sous-total"}
                </span>
                <span className="font-display text-2xl text-gold tabular-nums">
                  {total.toFixed(2)} DH
                </span>
              </div>
              <button
                onClick={onContinue}
                disabled={items.length === 0}
                className="btn-gold w-full px-7 py-4 rounded-full font-bold text-[12px] uppercase tracking-[0.15em] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
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
      <div className="px-6 py-16 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-gold text-[28px]">
            shopping_bag
          </span>
        </div>
        <p className="text-white/50 text-sm">Votre panier est vide</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/5">
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
            <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-[url('/background.webp')] bg-cover bg-center">
              <Image
                src={it.image}
                alt={it.name}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <h4 className="text-sm font-medium truncate">{it.name}</h4>
                <button
                  onClick={() => remove(it.id)}
                  aria-label="Retirer"
                  className="text-white/30 hover:text-gold transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <p className="text-gold text-xs mt-1">{it.price} DH</p>
              <div className="flex items-center justify-between mt-3">
                <div className="inline-flex items-center bg-dark-4 rounded-md border border-white/5">
                  <button
                    onClick={() => setQty(it.id, it.quantity - 1)}
                    className="px-2 py-1 text-white/60 hover:text-gold transition-colors"
                    aria-label="Diminuer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      remove
                    </span>
                  </button>
                  <span className="px-3 text-xs tabular-nums">{it.quantity}</span>
                  <button
                    onClick={() => setQty(it.id, it.quantity + 1)}
                    className="px-2 py-1 text-white/60 hover:text-gold transition-colors"
                    aria-label="Augmenter"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
                <span className="text-sm tabular-nums">
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
      <div className="px-6 py-12 text-center text-white/40 text-sm">
        Aucun produit dans cette categorie.
      </div>
    );
  }

  return (
    <div className="p-5">
      <p className="text-center text-white/50 text-sm mb-5 font-display italic">
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
                className={`relative aspect-square rounded-xl overflow-hidden bg-[url('/background.webp')] bg-cover bg-center transition-all ${
                  present ? "ring-2 ring-gold ring-offset-2 ring-offset-dark-2" : ""
                }`}
              >
                <Image
                  src={p.images[0]?.src ?? ""}
                  alt={p.images[0]?.alt ?? p.name}
                  fill
                  sizes="200px"
                  className="object-contain p-3"
                />
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
                  className={`absolute bottom-2 right-2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                    present
                      ? "bg-gold text-dark"
                      : "bg-dark text-gold border border-gold/30 hover:bg-gold hover:text-dark"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {present ? "check" : "add"}
                  </span>
                </button>
              </div>
              <div className="px-1">
                <h4 className="text-sm font-medium leading-tight line-clamp-2">
                  {p.name}
                </h4>
                <p className="text-gold text-xs mt-1 font-semibold">
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
