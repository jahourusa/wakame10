"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BranchSlug } from "@/lib/types/branch";

interface BranchState {
  branch: BranchSlug | null;
  modalOpen: boolean;
  setBranch: (slug: BranchSlug) => void;
  openModal: () => void;
  closeModal: () => void;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      branch: null,
      modalOpen: false,
      hasHydrated: false,
      setBranch: (slug) => set({ branch: slug, modalOpen: false }),
      openModal: () => set({ modalOpen: true }),
      closeModal: () => set({ modalOpen: false }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "wakame_branch",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ branch: s.branch }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
