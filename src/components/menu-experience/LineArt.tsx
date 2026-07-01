"use client";

import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration: 1.8, ease: "easeInOut" as const },
      opacity: { delay, duration: 0.3 },
    },
  }),
};

export function EnsoCircle({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
    >
      <motion.path
        d="M 118 22 A 80 80 0 1 0 165 55"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={draw}
        custom={delay}
      />
    </motion.svg>
  );
}

export function WaveLines({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 320 80"
      fill="none"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M 4 ${24 + i * 16} Q 44 ${8 + i * 16} 84 ${24 + i * 16} T 164 ${24 + i * 16} T 244 ${24 + i * 16} T 316 ${24 + i * 16}`}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          variants={draw}
          custom={delay + i * 0.25}
        />
      ))}
    </motion.svg>
  );
}

export function Chopsticks({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.1"
        d="m16.455 9.769l1.702 1.702m-4.426-3.426L12.03 6.343m8.523.714l.657.657a.97.97 0 0 1-.023 1.407L8.306 20.755a.97.97 0 0 1-1.339-.046l-.033-.033a.97.97 0 0 1-.012-1.374L19.179 7.045a.97.97 0 0 1 1.373.012m-4.109-3.11l-.657-.657a.97.97 0 0 0-1.407.023L2.745 16.194a.97.97 0 0 0 .045 1.34l.034.034a.97.97 0 0 0 1.374.011L16.455 5.321a.97.97 0 0 0-.012-1.373"
      />
    </svg>
  );
}

export function SushiSticks({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
        <path d="M2 18V2m20 16V2M6 11c0-2.8 2.2-5 5-5h2c2.8 0 5 2.2 5 5v6c0 2.8-2.2 5-5 5h-2c-2.8 0-5-2.2-5-5Z" />
        <path d="M18 13c0 2.8-2.2 5-5 5h-2c-2.8 0-5-2.2-5-5" />
        <path d="M11 14c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1Z" />
      </g>
    </svg>
  );
}

export function NoriLeaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" fill="none" className={className}>
      <path
        d="M 50 8 C 78 32 86 66 50 122 C 14 66 22 32 50 8 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M 50 22 L 50 108" stroke="currentColor" strokeWidth="1.2" />
      <path d="M 50 44 C 60 48 66 54 70 62 M 50 44 C 40 48 34 54 30 62 M 50 70 C 58 74 63 79 66 86 M 50 70 C 42 74 37 79 34 86" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function BrushStroke({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 260 24"
      fill="none"
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.path
        d="M 6 14 C 50 8 96 16 140 11 C 184 6 226 13 254 9"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        style={{ opacity: 0.85 }}
        variants={draw}
        custom={0.1}
      />
    </motion.svg>
  );
}

export function MakiPiece({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 5" />
      <circle cx="56" cy="56" r="11" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="72" cy="64" r="7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="58" cy="74" r="6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Nigiri({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 90" fill="none" className={className}>
      <path d="M 18 62 C 18 46 38 38 70 38 C 102 38 122 46 122 62 C 122 72 102 78 70 78 C 38 78 18 72 18 62 Z" stroke="currentColor" strokeWidth="2" />
      <path d="M 22 48 C 34 30 54 22 74 24 C 98 26 116 38 120 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 44 32 L 56 44 M 68 26 L 78 40 M 92 28 L 98 42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function GingerSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 130" fill="none" className={className}>
      <path d="M 45 122 C 42 86 40 56 48 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 46 38 C 32 34 24 24 24 12 C 38 14 46 22 48 34 M 47 62 C 60 58 68 48 70 36 C 56 38 48 46 47 56 M 45 88 C 32 84 24 74 23 62 C 36 64 44 72 45 82" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function SensuFan({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 100" fill="none" className={className}>
      <path d="M 70 88 L 16 30 A 70 70 0 0 1 124 30 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 70 88 L 38 18 M 70 88 L 70 10 M 70 88 L 102 18" stroke="currentColor" strokeWidth="1.3" />
      <path d="M 30 44 C 56 32 84 32 110 44" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M 24 4 C 15 4 8 11 8 20 C 8 32 24 44 24 44 C 24 44 40 32 40 20 C 40 11 33 4 24 4 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="20" r="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
