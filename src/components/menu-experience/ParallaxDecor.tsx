"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Chopsticks, MakiPiece, Nigiri, GingerSprig, SensuFan, NoriLeaf, WaveLines } from "./LineArt";

type DecorItem = {
  Comp?: React.ComponentType<{ className?: string }>;
  img?: string;
  top: string;
  side: "left" | "right";
  inset: string;
  size: string;
  speed: number;
  rotate: number;
  flip?: boolean;
};

const ITEMS: DecorItem[] = [
  { Comp: Chopsticks, top: "2%", side: "right", inset: "3%", size: "h-48 w-48", speed: -120, rotate: 14 },
  { Comp: MakiPiece, top: "7%", side: "left", inset: "2%", size: "h-40 w-40", speed: -220, rotate: -10 },
  { img: "/assets/hero-ginger.png", top: "12%", side: "right", inset: "2%", size: "h-32 w-32", speed: -150, rotate: 10 },
  { Comp: GingerSprig, top: "18%", side: "right", inset: "7%", size: "h-36 w-28", speed: -90, rotate: 8, flip: true },
  { Comp: Nigiri, top: "22%", side: "left", inset: "4%", size: "h-28 w-44", speed: -190, rotate: -6 },
  { Comp: WaveLines, top: "30%", side: "right", inset: "2%", size: "h-20 w-64", speed: -60, rotate: 0 },
  { Comp: SensuFan, top: "38%", side: "left", inset: "2.5%", size: "h-32 w-44", speed: -160, rotate: -12 },
  { Comp: MakiPiece, top: "47%", side: "right", inset: "5%", size: "h-24 w-24", speed: -240, rotate: 18 },
  { Comp: NoriLeaf, top: "55%", side: "left", inset: "6%", size: "h-36 w-28", speed: -110, rotate: 24 },
  { Comp: Chopsticks, top: "64%", side: "right", inset: "3%", size: "h-32 w-32", speed: -180, rotate: -18, flip: true },
  { img: "/assets/hero-chopsticks.png", top: "69%", side: "left", inset: "2%", size: "h-40 w-28", speed: -210, rotate: -8 },
  { Comp: Nigiri, top: "73%", side: "right", inset: "7%", size: "h-24 w-40", speed: -80, rotate: 8 },
  { Comp: GingerSprig, top: "81%", side: "left", inset: "3%", size: "h-32 w-24", speed: -200, rotate: -14 },
  { Comp: MakiPiece, top: "90%", side: "left", inset: "7%", size: "h-28 w-28", speed: -130, rotate: 9 },
];

function DecorPiece({ item, progress }: { item: DecorItem; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [0, item.speed]);
  const rotate = useTransform(progress, [0, 1], [item.rotate, item.rotate + (item.flip ? -22 : 22)]);
  const style: React.CSSProperties & Record<string, unknown> = {
    top: item.top,
    [item.side]: item.inset,
  };
  if (item.img) {
    return (
      <motion.div className="absolute opacity-70" style={{ ...style, y, rotate }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.img}
          alt=""
          loading="lazy"
          decoding="async"
          className={`${item.size} object-contain`}
          style={{ filter: "drop-shadow(0 14px 18px rgba(34,48,42,0.3))" }}
        />
      </motion.div>
    );
  }
  return (
    <motion.div className="absolute text-ink/[0.1]" style={{ ...style, y, rotate }}>
      {item.Comp && <item.Comp className={item.size} />}
    </motion.div>
  );
}

export default function ParallaxDecor() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {ITEMS.map((item, i) => (
        <DecorPiece key={i} item={item} progress={scrollYProgress} />
      ))}
    </div>
  );
}
