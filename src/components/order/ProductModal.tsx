"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderModalStore } from "@/lib/store/order-modal-store";
import { ProductCustomizer } from "@/components/sections/ProductCustomizer";

const easing = [0.22, 1, 0.36, 1] as const;

export function ProductModal() {
  const productOpen = useOrderModalStore((s) => s.productOpen);
  const product = useOrderModalStore((s) => s.selectedProduct);
  const closeProduct = useOrderModalStore((s) => s.closeProduct);

  useEffect(() => {
    if (productOpen) document.body.classList.add("branch-lock");
    else document.body.classList.remove("branch-lock");
    return () => document.body.classList.remove("branch-lock");
  }, [productOpen]);

  useEffect(() => {
    if (!productOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProduct();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [productOpen, closeProduct]);

  return (
    <AnimatePresence>
      {productOpen && product && (
        <motion.div
          key="product-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[150] flex items-end justify-center md:items-center"
        >
          <div
            onClick={closeProduct}
            className="absolute inset-0 bg-kuro/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.5, ease: easing }}
            className="washi-surface relative max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-t-3xl border border-gold/25 shadow-2xl md:w-[92vw] md:rounded-3xl"
          >
            <span className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-gold/40" />
            <span className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-gold/40" />
            <span className="pointer-events-none absolute bottom-4 left-4 h-3 w-3 border-b border-l border-gold/40" />
            <span className="pointer-events-none absolute bottom-4 right-4 h-3 w-3 border-b border-r border-gold/40" />

            <button
              onClick={closeProduct}
              aria-label="Fermer"
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-washi text-ink-soft transition-all hover:border-gold hover:text-gold-dim"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="p-6 md:p-10">
              <ProductCustomizer
                product={product}
                onAdded={() => {
                  closeProduct();
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
