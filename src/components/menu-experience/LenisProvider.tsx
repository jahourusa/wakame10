"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useOrderModalStore } from "@/lib/store/order-modal-store";
import { useBranchStore } from "@/lib/store/branch-store";

/**
 * Smooth-scroll wrapper for the /menu page only.
 * Adds the `lenis` class to <html> on mount and removes it on unmount, so
 * other pages keep their native scroll behavior.
 * Pauses Lenis while any modal / drawer is open so their inner scroll wins.
 */
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const productOpen = useOrderModalStore((s) => s.productOpen);
  const drawerOpen = useOrderModalStore((s) => s.drawerOpen);
  const branchModalOpen = useBranchStore((s) => s.modalOpen);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.11 });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (productOpen || drawerOpen || branchModalOpen) lenis.stop();
    else lenis.start();
  }, [productOpen, drawerOpen, branchModalOpen]);

  return <>{children}</>;
}
