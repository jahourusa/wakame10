"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBranchStore } from "@/lib/store/branch-store";
import { useOrderModalStore } from "@/lib/store/order-modal-store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const openBranch = useBranchStore((s) => s.openModal);
  const openCartDrawer = useOrderModalStore((s) => s.openDrawer);

  const menuActive = pathname === "/menu";

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-5 pt-3 bg-dark/95 backdrop-blur-2xl rounded-t-[20px] z-50 border-t border-gold/5">
      <Link
        href="/menu"
        className={`flex flex-col items-center gap-0.5 ${
          menuActive
            ? "bg-gold/10 text-gold rounded-full px-5 py-1.5"
            : "text-white/30 hover:text-gold transition-colors"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
        <span className="text-[7px] uppercase tracking-[0.2em]">Menu</span>
      </Link>

      <button
        onClick={() => openCartDrawer("cart")}
        className="flex flex-col items-center gap-0.5 text-white/30 hover:text-gold transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
        <span className="text-[7px] uppercase tracking-[0.2em]">Panier</span>
      </button>

      <button
        onClick={openBranch}
        className="flex flex-col items-center gap-0.5 text-white/30 hover:text-gold transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">location_on</span>
        <span className="text-[7px] uppercase tracking-[0.2em]">Villes</span>
      </button>

      <Link
        href="/contact"
        className="flex flex-col items-center gap-0.5 text-white/30 hover:text-gold transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">person</span>
        <span className="text-[7px] uppercase tracking-[0.2em]">Compte</span>
      </Link>
    </nav>
  );
}
