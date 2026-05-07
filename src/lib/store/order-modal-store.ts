"use client";

import { create } from "zustand";
import type { Product } from "@/lib/types/product";

export type DrawerStep = "cart" | "salades" | "boissons";

interface OrderModalState {
  // Product popup
  productOpen: boolean;
  selectedProduct: Product | null;

  // Side cart drawer
  drawerOpen: boolean;
  drawerStep: DrawerStep;

  // Cached server-fetched products per upsell category
  salades: Product[];
  boissons: Product[];

  hydrated: boolean;

  openProduct: (p: Product) => void;
  closeProduct: () => void;

  openDrawer: (step?: DrawerStep) => void;
  setStep: (s: DrawerStep) => void;
  closeDrawer: () => void;

  setData: (salades: Product[], boissons: Product[]) => void;
}

export const useOrderModalStore = create<OrderModalState>((set) => ({
  productOpen: false,
  selectedProduct: null,
  drawerOpen: false,
  drawerStep: "cart",
  salades: [],
  boissons: [],
  hydrated: false,

  openProduct: (p) => set({ productOpen: true, selectedProduct: p }),
  closeProduct: () => set({ productOpen: false }),

  openDrawer: (step = "cart") => set({ drawerOpen: true, drawerStep: step }),
  setStep: (s) => set({ drawerStep: s }),
  closeDrawer: () => set({ drawerOpen: false }),

  setData: (salades, boissons) =>
    set((s) => (s.hydrated ? s : { salades, boissons, hydrated: true })),
}));
