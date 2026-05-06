"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store/ui-store";
import { useBranchStore } from "@/lib/store/branch-store";

const easing = [0.22, 1, 0.36, 1] as const;

export function MobileDrawer() {
  const { drawerOpen, closeDrawer } = useUIStore();
  const openBranchModal = useBranchStore((s) => s.openModal);

  const onBranchClick = () => {
    closeDrawer();
    openBranchModal();
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-black/70"
            onClick={closeDrawer}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: easing }}
            className="fixed top-0 right-0 w-[300px] h-full z-[70] bg-dark-3/95 backdrop-blur-2xl border-l border-gold/5"
          >
            <div className="p-8 pt-7 flex justify-between items-center">
              <Image
                src="/logo.png"
                alt="Wakame"
                width={100}
                height={32}
                className="w-[100px] h-auto"
              />
              <button onClick={closeDrawer} className="text-gold" aria-label="Fermer">
                <span className="material-symbols-outlined text-[28px]">close</span>
              </button>
            </div>
            <nav className="px-8 pt-4 flex flex-col gap-5">
              <Link
                href="/#hero"
                onClick={closeDrawer}
                className="text-gold text-lg font-display"
              >
                Accueil
              </Link>
              <Link
                href="/menu"
                onClick={closeDrawer}
                className="text-white/60 text-lg font-display hover:text-gold transition-colors"
              >
                Menu
              </Link>
              <Link
                href="/#about"
                onClick={closeDrawer}
                className="text-white/60 text-lg font-display hover:text-gold transition-colors"
              >
                A Propos
              </Link>
              <Link
                href="/contact"
                onClick={closeDrawer}
                className="text-white/60 text-lg font-display hover:text-gold transition-colors"
              >
                Contact
              </Link>
              <button
                onClick={onBranchClick}
                className="text-white/60 text-left text-lg font-display hover:text-gold transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">location_on</span>
                Changer de ville
              </button>
              <div className="mt-4 pt-6 border-t border-white/5">
                <Link
                  href="/menu"
                  onClick={closeDrawer}
                  className="block w-full btn-gold px-7 py-3.5 rounded-lg font-semibold text-[12px] uppercase tracking-[0.15em] text-center"
                >
                  Commander
                </Link>
              </div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
