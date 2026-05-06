"use client";

import { useBranchStore } from "@/lib/store/branch-store";
import { BRANCHES } from "@/lib/types/branch";

export function BranchBadge({ className = "" }: { className?: string }) {
  const { branch, openModal, hasHydrated } = useBranchStore();
  const label = BRANCHES.find((b) => b.slug === branch)?.name ?? "Ville";

  return (
    <button
      type="button"
      onClick={openModal}
      title="Changer de ville"
      className={`flex items-center gap-1.5 text-white/50 hover:text-gold transition-colors text-[10px] uppercase tracking-[0.2em] font-medium ${className}`}
    >
      <span className="material-symbols-outlined text-[14px]">location_on</span>
      <span suppressHydrationWarning>{hasHydrated ? label : "Ville"}</span>
    </button>
  );
}
