"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BranchBadge } from "@/components/branch/BranchBadge";
import { useUIStore } from "@/lib/store/ui-store";
import { useCartStore, cartSelectors } from "@/lib/store/cart-store";
import { useOrderModalStore } from "@/lib/store/order-modal-store";
import { SushiBoxIcon } from "@/components/ui/SushiBoxIcon";

export function Header({ forceGlass = false }: { forceGlass?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const openMenuDrawer = useUIStore((s) => s.openDrawer);
  const openCartDrawer = useOrderModalStore((s) => s.openDrawer);
  const cartCount = useCartStore(cartSelectors.count);
  const cartHydrated = useCartStore((s) => s.hasHydrated);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glass = forceGlass || scrolled;

  return (
    <header
      id="header"
      className={`fixed top-0 w-full z-50 ${glass ? "nav-glass" : "nav-transparent"}`}
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-5">
        <Link href="/#hero" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Wakame"
            width={130}
            height={44}
            priority
            className="w-[110px] md:w-[130px] h-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          <Link
            href="/#hero"
            className="text-gold text-[13px] uppercase tracking-[0.2em] font-medium border-b border-gold/40 pb-0.5"
          >
            Accueil
          </Link>
          <Link
            href="/menu"
            className="text-white/60 text-[13px] uppercase tracking-[0.2em] font-medium hover:text-gold transition-colors duration-300"
          >
            Menu
          </Link>
          <Link
            href="/#about"
            className="text-white/60 text-[13px] uppercase tracking-[0.2em] font-medium hover:text-gold transition-colors duration-300"
          >
            A Propos
          </Link>
          <Link
            href="/contact"
            className="text-white/60 text-[13px] uppercase tracking-[0.2em] font-medium hover:text-gold transition-colors duration-300"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <BranchBadge className="hidden md:flex" />
          <button
            onClick={() => openCartDrawer("cart")}
            aria-label="Ouvrir le panier"
            className="hidden lg:flex items-center text-white/50 hover:text-gold transition-colors relative"
          >
            <SushiBoxIcon size={22} />
            <span
              className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-gold rounded-full text-[8px] text-dark font-bold flex items-center justify-center"
              suppressHydrationWarning
            >
              {cartHydrated ? cartCount : 0}
            </span>
          </button>
          <Link
            href="/menu"
            className="hidden lg:block btn-gold px-7 py-2.5 rounded-lg font-semibold text-[12px] uppercase tracking-[0.15em]"
          >
            Commander
          </Link>
          <button
            onClick={openMenuDrawer}
            className="lg:hidden text-gold"
            aria-label="Ouvrir le menu"
          >
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
