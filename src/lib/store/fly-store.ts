"use client";

import { create } from "zustand";

export interface Flight {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  image?: string;
}

interface FlyState {
  flights: Flight[];
  fly: (startX: number, startY: number, image?: string) => void;
  removeFlight: (id: string) => void;
}

export const useFlyStore = create<FlyState>((set) => ({
  flights: [],
  fly: (startX, startY, image) => {
    if (typeof document === "undefined") return;
    const cartBtn = document.getElementById("floating-cart-btn");
    const rect = cartBtn?.getBoundingClientRect();
    const targetX = rect ? rect.left + rect.width / 2 : window.innerWidth - 50;
    const targetY = rect ? rect.top + rect.height / 2 : window.innerHeight - 50;

    set((s) => ({
      flights: [
        ...s.flights,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          startX,
          startY,
          targetX,
          targetY,
          image,
        },
      ],
    }));
  },
  removeFlight: (id) =>
    set((s) => ({ flights: s.flights.filter((f) => f.id !== id) })),
}));
