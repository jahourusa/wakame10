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
  const openDrawer = useOrderModalStore((s) => s.openDrawer);

  // Lock body scroll while open
  useEffect(() => {
    if (productOpen) document.body.classList.add("branch-lock");
    else document.body.classList.remove("branch-lock");
    return () => document.body.classList.remove("branch-lock");
  }, [productOpen]);

  // ESC closes
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
          className="fixed inset-0 z-[150] flex items-end md:items-center justify-center"
        >
          <div
            onClick={closeProduct}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.5, ease: easing }}
            className="relative w-full md:w-[90vw] max-w-5xl max-h-[92vh] overflow-y-auto bg-dark-2 border border-gold/10 rounded-t-3xl md:rounded-3xl shadow-2xl"
          >
            <button
              onClick={closeProduct}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-dark/70 backdrop-blur-sm border border-white/10 text-white/70 hover:text-gold hover:border-gold/30 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="p-6 md:p-10">
              <ProductCustomizer
                product={product}
                onAdded={() => {
                  closeProduct();
                  openDrawer("cart");
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
