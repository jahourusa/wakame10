"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useBranchStore } from "@/lib/store/branch-store";
import { BRANCHES, type BranchSlug } from "@/lib/types/branch";

const easing = [0.22, 1, 0.36, 1] as const;

const overlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easing } },
};

export function BranchModal() {
  const { modalOpen, branch, hasHydrated, setBranch, openModal, closeModal } =
    useBranchStore();

  // Force-open if no branch ever picked, after hydration
  useEffect(() => {
    if (hasHydrated && !branch) openModal();
  }, [hasHydrated, branch, openModal]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (modalOpen) document.body.classList.add("branch-lock");
    else document.body.classList.remove("branch-lock");
    return () => document.body.classList.remove("branch-lock");
  }, [modalOpen]);

  // ESC closes (only allowed once a branch is set)
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && branch) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, branch, closeModal]);

  const onPick = (slug: BranchSlug) => setBranch(slug);

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="branch-title"
          variants={overlay}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[9999] flex items-center justify-center px-6 py-12 overflow-y-auto"
          style={{
            background:
              "radial-gradient(circle at center, rgba(6,14,11,0.92) 0%, rgba(6,14,11,0.99) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="w-full max-w-6xl mx-auto text-center"
          >
            <motion.div variants={item} className="flex justify-center mb-8">
              <Image
                src="/logo.png"
                alt="Wakame"
                width={140}
                height={48}
                priority
                className="h-auto w-[140px]"
              />
            </motion.div>

            <motion.div
              variants={item}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gold/20 bg-gold/5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-gold font-body text-[10px] uppercase tracking-[0.3em] font-semibold">
                Bienvenue
              </span>
            </motion.div>

            <motion.h2
              id="branch-title"
              variants={item}
              className="font-display text-4xl md:text-6xl font-bold mb-4"
            >
              Choisissez votre <span className="text-gold italic">restaurant</span>
            </motion.h2>

            <motion.p
              variants={item}
              className="text-white/50 text-base md:text-lg font-light max-w-xl mx-auto mb-12"
            >
              Selectionnez votre ville pour commander aupres du restaurant le plus proche.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BRANCHES.map((b) => (
                <motion.button
                  key={b.slug}
                  variants={item}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPick(b.slug)}
                  data-branch={b.name}
                  className="branch-card rounded-2xl p-8 md:p-10 flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-gold text-[28px]">
                      location_on
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 text-white">
                    {b.name}
                  </h3>
                  <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] mb-6">
                    {b.area}
                  </p>
                  <span className="mt-auto w-full py-3.5 px-6 rounded-lg branch-btn font-bold tracking-wide flex items-center justify-center gap-2 text-[12px] uppercase">
                    Commander ici
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.p
              variants={item}
              className="text-white/20 text-[9px] uppercase tracking-[0.3em] mt-10"
            >
              L&apos;art de l&apos;Omakase
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
