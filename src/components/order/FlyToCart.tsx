"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useFlyStore, type Flight } from "@/lib/store/fly-store";
import { SushiBoxIcon } from "@/components/ui/SushiBoxIcon";

export function FlyToCart() {
  const flights = useFlyStore((s) => s.flights);
  const removeFlight = useFlyStore((s) => s.removeFlight);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      <AnimatePresence>
        {flights.map((f) => (
          <FlightParticle
            key={f.id}
            flight={f}
            onComplete={() => removeFlight(f.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FlightParticle({
  flight,
  onComplete,
}: {
  flight: Flight;
  onComplete: () => void;
}) {
  // Particle is 56x56; we offset by 28 so the (startX, startY) point lands at
  // its center, which is where the user actually clicked.
  const SIZE = 56;
  const HALF = SIZE / 2;

  // A parabolic arc: lift the midpoint up by 80px to feel like the item is
  // being thrown rather than sliding. We achieve this by giving x and y
  // different easings — x accelerates, y decelerates — combined with an
  // intermediate keyframe.
  const midY = Math.min(flight.startY, flight.targetY) - 80;

  return (
    <motion.div
      initial={{
        x: flight.startX - HALF,
        y: flight.startY - HALF,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        x: flight.targetX - HALF,
        y: [flight.startY - HALF, midY - HALF, flight.targetY - HALF],
        scale: [1, 0.9, 0.35],
        opacity: [1, 1, 0.4],
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.85,
        ease: [0.5, 0, 0.75, 0],
        x: { ease: [0.55, 0, 0.45, 1] },
        y: { times: [0, 0.5, 1], ease: "easeOut" },
        scale: { times: [0, 0.5, 1] },
        opacity: { times: [0, 0.7, 1] },
      }}
      onAnimationComplete={onComplete}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
      }}
      className="rounded-full overflow-hidden flex items-center justify-center text-dark shadow-2xl ring-2 ring-gold/40"
    >
      {flight.image ? (
        <div className="relative w-full h-full bg-[url('/background.webp')] bg-cover bg-center">
          <Image
            src={flight.image}
            alt=""
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        </div>
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #BF933A 0%, #F0BF61 50%, #BF933A 100%)",
          }}
        >
          <SushiBoxIcon size={26} strokeWidth={1.8} />
        </div>
      )}
    </motion.div>
  );
}
