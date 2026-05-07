"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, cartSelectors } from "@/lib/store/cart-store";
import { useOrderModalStore } from "@/lib/store/order-modal-store";

export function FloatingCartButton() {
  const openDrawer = useOrderModalStore((s) => s.openDrawer);
  const drawerOpen = useOrderModalStore((s) => s.drawerOpen);
  const productOpen = useOrderModalStore((s) => s.productOpen);
  const count = useCartStore(cartSelectors.count);
  const hydrated = useCartStore((s) => s.hasHydrated);

  const hidden = drawerOpen || productOpen;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.button
          key="floating-cart"
          onClick={() => openDrawer("cart")}
          aria-label="Ouvrir le panier"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 30 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 lg:bottom-8 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-dark shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, #BF933A 0%, #F0BF61 50%, #BF933A 100%)",
            boxShadow: "0 10px 40px rgba(191, 147, 58, 0.5)",
          }}
        >
          <span className="material-symbols-outlined text-[26px]">shopping_bag</span>

          {hydrated && count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-1.5 -left-1.5 min-w-6 h-6 px-1.5 rounded-full bg-white text-gold text-xs font-bold flex items-center justify-center shadow-lg border border-gold/20"
            >
              {count}
            </motion.span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
