"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode, ElementType } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
}

const easing = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 50,
  className,
  as = "div",
  once = true,
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: easing, delay },
    },
  };

  const MotionTag = motion(as as ElementType);

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </MotionTag>
  );
}
