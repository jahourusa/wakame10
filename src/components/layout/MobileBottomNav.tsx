"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBranchStore } from "@/lib/store/branch-store";

const items = [
  { href: "/menu", icon: "restaurant_menu", label: "Menu" },
  { href: "/cart", icon: "shopping_bag", label: "Panier" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const openBranch = useBranchStore((s) => s.openModal);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-5 pt-3 bg-dark/95 backdrop-blur-2xl rounded-t-[20px] z-50 border-t border-gold/5">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-col items-center gap-0.5 ${
              active
                ? "bg-gold/10 text-gold rounded-full px-5 py-1.5"
                : "text-white/30 hover:text-gold transition-colors"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{it.icon}</span>
            <span className="text-[7px] uppercase tracking-[0.2em]">{it.label}</span>
          </Link>
        );
      })}
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
