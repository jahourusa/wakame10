"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";

export function Counter({
  to,
  duration = 1.6,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (inView) animate(motionValue, to, { duration, ease: "easeOut" });
  }, [inView, to, duration, motionValue]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
    </span>
  );
}
