"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useBranchStore } from "@/lib/store/branch-store";
import { BRANCHES, type Branch, type BranchSlug } from "@/lib/types/branch";
import {
  EnsoCircle,
  WaveLines,
  Chopsticks,
  NoriLeaf,
  PinIcon,
} from "@/components/menu-experience/LineArt";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
};

const rise = {
  hidden: { opacity: 0, y: 34, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function BranchCard({
  branch,
  onSelect,
  comingSoon = false,
}: {
  branch: Branch;
  onSelect: (slug: BranchSlug) => void;
  comingSoon?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 180, damping: 18 });

  return (
    <motion.div variants={rise} style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className={`group relative w-[300px] rounded-2xl border px-9 py-8 text-center backdrop-blur-md transition-colors duration-500 sm:w-[330px] ${
          comingSoon
            ? "border-white/10 bg-white/[0.04]"
            : "border-gold/15 bg-kuro-2/70 hover:border-gold/45"
        }`}
      >
        {!comingSoon && (
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(201,164,92,0.14),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        )}

        <div
          className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border transition-transform duration-500 ${
            comingSoon
              ? "border-white/15 text-white/40"
              : "border-gold/25 text-gold group-hover:scale-110"
          }`}
        >
          <PinIcon className="h-7 w-7" />
        </div>

        <h3
          className={`font-display text-4xl ${
            comingSoon ? "text-white/50" : "text-washi"
          }`}
        >
          {branch.name}
        </h3>
        <p
          className={`mt-2 text-[11px] uppercase tracking-[0.3em] ${
            comingSoon ? "text-white/30" : "text-washi/40"
          }`}
        >
          {branch.area}
        </p>

        {comingSoon ? (
          <div
            aria-disabled="true"
            className="mt-7 w-full cursor-not-allowed rounded-lg border border-white/15 bg-white/[0.06] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.22em] text-white/55"
          >
            Bientot disponible
          </div>
        ) : (
          <button
            data-branch={branch.name}
            onClick={() => onSelect(branch.slug)}
            className="gold-breathe mt-7 w-full cursor-pointer rounded-lg bg-gradient-to-r from-gold to-gold-bright px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            Commander ici
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1.5">
              &rarr;
            </span>
          </button>
        )}

        <span
          className={`absolute left-3 top-3 h-3 w-3 border-l border-t ${
            comingSoon ? "border-white/15" : "border-gold/30"
          }`}
        />
        <span
          className={`absolute right-3 top-3 h-3 w-3 border-r border-t ${
            comingSoon ? "border-white/15" : "border-gold/30"
          }`}
        />
        <span
          className={`absolute bottom-3 left-3 h-3 w-3 border-b border-l ${
            comingSoon ? "border-white/15" : "border-gold/30"
          }`}
        />
        <span
          className={`absolute bottom-3 right-3 h-3 w-3 border-b border-r ${
            comingSoon ? "border-white/15" : "border-gold/30"
          }`}
        />
      </motion.div>
    </motion.div>
  );
}

const overlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

export function BranchModal() {
  const { modalOpen, branch, hasHydrated, setBranch, openModal, closeModal } =
    useBranchStore();

  useEffect(() => {
    if (hasHydrated && !branch) openModal();
  }, [hasHydrated, branch, openModal]);

  useEffect(() => {
    if (modalOpen) document.body.classList.add("branch-lock");
    else document.body.classList.remove("branch-lock");
    return () => document.body.classList.remove("branch-lock");
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && branch) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, branch, closeModal]);

  // Parallax layers — driven by cursor position across the whole overlay
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lx = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 50, damping: 20 });
  const ly = useSpring(useTransform(my, [-1, 1], [-12, 12]), { stiffness: 50, damping: 20 });
  const lx2 = useSpring(useTransform(mx, [-1, 1], [26, -26]), { stiffness: 40, damping: 22 });
  const ly2 = useSpring(useTransform(my, [-1, 1], [18, -18]), { stiffness: 40, damping: 22 });

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="branch-title"
          variants={overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onPointerMove={(e) => {
            mx.set((e.clientX / window.innerWidth) * 2 - 1);
            my.set((e.clientY / window.innerHeight) * 2 - 1);
          }}
          className="theater-surface fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center overflow-hidden overflow-y-auto px-6 py-16"
        >
          {/* --- drifting line art, back layer --- */}
          <motion.div style={{ x: lx, y: ly }} className="pointer-events-none absolute inset-0">
            <Chopsticks className="absolute left-[7%] top-[16%] h-28 w-28 rotate-12 text-gold/10" />
            <NoriLeaf className="absolute right-[9%] top-[58%] h-32 w-24 -rotate-12 text-gold/10" />
            <motion.img
              src="/assets/hero-platter.png"
              alt=""
              animate={{ y: [0, -14, 0], rotate: [0, 1.2, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[8%] right-[2%] w-[26vw] min-w-[260px] max-w-[460px] opacity-90"
              style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.65))" }}
            />
          </motion.div>

          {/* --- drifting line art, front layer --- */}
          <motion.div style={{ x: lx2, y: ly2 }} className="pointer-events-none absolute inset-0">
            <WaveLines
              className="absolute bottom-[10%] left-[12%] h-20 w-72 text-gold/15"
              delay={1.2}
            />
            <NoriLeaf className="absolute left-[16%] top-[55%] h-20 w-16 rotate-45 text-gold/[0.08]" />
            <Chopsticks className="absolute right-[14%] top-[12%] h-20 w-20 -rotate-6 text-gold/10" />
            <motion.img
              src="/assets/hero-ginger.png"
              alt=""
              animate={{ y: [0, -18, 0], rotate: [-6, -1, -6] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[4%] top-[8%] w-[10vw] min-w-[110px] max-w-[180px] opacity-85"
              style={{ filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.6))" }}
            />
            <motion.img
              src="/assets/hero-nigiri.png"
              alt=""
              animate={{ y: [0, 14, 0], rotate: [5, 9, 5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-[16%] left-[6%] w-[12vw] min-w-[120px] max-w-[210px] opacity-85"
              style={{ filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.6))" }}
            />
          </motion.div>

          {/* --- steam plumes --- */}
          <div className="steam left-[20%] top-[30%] h-72 w-44" style={{ animationDelay: "0s" }} />
          <div
            className="steam right-[22%] top-[40%] h-80 w-52"
            style={{ animationDelay: "-4s" }}
          />
          <div
            className="steam left-[55%] top-[60%] h-64 w-40"
            style={{ animationDelay: "-8s" }}
          />

          {/* --- ensō ring behind the title --- */}
          <EnsoCircle
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-[58%] text-gold/10"
            delay={0.6}
          />

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex flex-col items-center text-center"
          >
            <motion.div variants={rise}>
              <Image
                src="/logo.png"
                alt="Wakame"
                width={190}
                height={64}
                priority
                className="h-auto w-[170px] sm:w-[190px]"
              />
            </motion.div>

            <motion.p
              variants={rise}
              className="mt-4 font-cormorant text-xl italic text-gold-bright/90 sm:text-2xl"
            >
              l&apos;art de l&apos;omakase
            </motion.p>

            <motion.h1
              id="branch-title"
              variants={rise}
              className="mt-5 max-w-3xl font-display text-4xl leading-tight text-washi sm:text-6xl"
            >
              Choisissez votre <span className="text-gold">restaurant</span>
            </motion.h1>

            <motion.p
              variants={rise}
              className="mt-4 max-w-md text-sm font-light leading-relaxed text-washi/50"
            >
              Selectionnez votre ville pour commander aupres du restaurant le plus proche.
            </motion.p>

            <motion.div variants={rise} className="mt-8 flex flex-col gap-7 sm:flex-row">
              {BRANCHES.map((b) => (
                <BranchCard
                  key={b.slug}
                  branch={b}
                  onSelect={setBranch}
                  comingSoon={b.slug === "kenitra"}
                />
              ))}
            </motion.div>

            <motion.div variants={rise} className="mt-10 flex items-center gap-4">
              <span className="gold-thread w-16" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold/50">
                Sushis &amp; Fusion Asiatique
              </span>
              <span className="gold-thread w-16" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
