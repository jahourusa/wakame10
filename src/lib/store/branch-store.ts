"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BRANCHES, type BranchSlug } from "@/lib/types/branch";

const VALID_SLUGS = new Set(BRANCHES.map((b) => b.slug as string));

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
        // Wipe a stale branch slug (e.g. Casablanca was removed). The modal
        // will then re-open and the user picks again.
        if (state && state.branch && !VALID_SLUGS.has(state.branch)) {
          state.branch = null;
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
