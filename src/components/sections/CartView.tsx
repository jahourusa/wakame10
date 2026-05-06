"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, cartSelectors } from "@/lib/store/cart-store";

const DELIVERY_FEE = 25;

export function CartView() {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore(cartSelectors.subtotal);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  if (!hasHydrated) {
    return <div className="text-white/40 text-center py-16">Chargement…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-gold text-[32px]">
            shopping_bag
          </span>
        </div>
        <h2 className="font-display text-3xl">Votre panier est vide</h2>
        <p className="text-white/40 text-sm">
          Decouvrez nos creations signature et ajoutez-les a votre panier.
        </p>
        <Link
          href="/menu"
          className="inline-block btn-gold px-10 py-4 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em]"
        >
          Voir le menu
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <section className="lg:col-span-8 space-y-4">
        <AnimatePresence mode="popLayout">
          {items.map((it) => (
            <motion.article
              key={it.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-5 p-5 rounded-xl bg-dark-3 border border-white/[0.04] hover:border-gold/20 transition-colors"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={it.image}
                  alt={it.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl truncate">{it.name}</h3>
                    <p className="text-gold text-sm font-medium mt-1">
                      {it.price} DH
                    </p>
                  </div>
                  <button
                    onClick={() => remove(it.id)}
                    aria-label="Retirer"
                    className="text-white/30 hover:text-gold transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="inline-flex items-center bg-dark-4 rounded-lg border border-white/5">
                    <button
                      onClick={() => setQty(it.id, it.quantity - 1)}
                      className="px-3 py-2 text-white/60 hover:text-gold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        remove
                      </span>
                    </button>
                    <span className="px-4 text-sm font-medium tabular-nums">
                      {it.quantity}
                    </span>
                    <button
                      onClick={() => setQty(it.id, it.quantity + 1)}
                      className="px-3 py-2 text-white/60 hover:text-gold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <p className="font-display text-lg text-white">
                    {it.price * it.quantity} DH
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        <div className="flex justify-between items-center pt-6">
          <Link
            href="/menu"
            className="text-white/50 hover:text-gold transition-colors text-[11px] uppercase tracking-[0.15em] font-semibold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Continuer mes achats
          </Link>
          <button
            onClick={clear}
            className="text-white/30 hover:text-gold transition-colors text-[11px] uppercase tracking-[0.15em] font-semibold"
          >
            Vider le panier
          </button>
        </div>
      </section>

      <aside className="lg:col-span-4 lg:sticky lg:top-28 bg-dark-3 border border-gold/10 rounded-2xl p-8 space-y-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/[0.04] rounded-full blur-[80px]" />
        <h2 className="font-display text-2xl relative z-10">Resume</h2>
        <div className="space-y-3 text-sm relative z-10">
          <div className="flex justify-between text-white/60">
            <span>Sous-total</span>
            <span className="tabular-nums">{subtotal} DH</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Livraison</span>
            <span className="tabular-nums">{DELIVERY_FEE} DH</span>
          </div>
          <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              Total
            </span>
            <span className="font-display text-3xl text-gold tabular-nums">
              {total} DH
            </span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="btn-gold block text-center w-full px-7 py-4 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em] relative z-10"
        >
          Passer la commande
        </Link>

        <Link
          href="/order/beverages"
          className="group relative z-10 flex items-center justify-between gap-3 px-5 py-4 rounded-lg bg-gold/5 border border-gold/20 hover:bg-gold/10 transition-all"
        >
          <span className="flex items-center gap-3 text-left">
            <span className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-gold text-[18px]">
                local_bar
              </span>
            </span>
            <span>
              <span className="block text-gold text-[10px] uppercase tracking-[0.2em] font-semibold">
                Suggestion
              </span>
              <span className="block text-white/70 text-[11px] mt-0.5">
                Ajouter boissons & desserts
              </span>
            </span>
          </span>
          <span className="material-symbols-outlined text-gold/60 text-[18px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </Link>

        <p className="text-white/30 text-[10px] text-center uppercase tracking-[0.2em] relative z-10">
          Paiement a la livraison disponible
        </p>
      </aside>
    </div>
  );
}
