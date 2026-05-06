"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: qty }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [] }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "wakame_cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);

export const cartSelectors = {
  count: (s: CartState) => s.items.reduce((acc, i) => acc + i.quantity, 0),
  subtotal: (s: CartState) =>
    s.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
};
