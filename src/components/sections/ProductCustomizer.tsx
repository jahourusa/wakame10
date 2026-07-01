"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { useFlyStore } from "@/lib/store/fly-store";
import { BrushStroke } from "@/components/menu-experience/LineArt";
import type { Product } from "@/lib/types/product";

interface Props {
  product: Product;
  /** Fired after the item is added to the cart. Modal uses this to close itself + open the drawer. */
  onAdded?: () => void;
}

export function ProductCustomizer({ product, onAdded }: Props) {
  const add = useCartStore((s) => s.add);
  const fly = useFlyStore((s) => s.fly);
  const [qty, setQty] = useState(1);

  const unitPrice = product.price.amount;
  const totalPrice = unitPrice * qty;

  const onAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const image = product.images[0]?.src;

    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: unitPrice,
        image: image ?? "",
      },
      qty
    );
    onAdded?.();

    // Floating cart is hidden while modal is open — wait one frame so it mounts.
    requestAnimationFrame(() => {
      fly(startX, startY, image);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-gold/15 bg-washi-2/70">
        {product.images[0]?.src ? (
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt ?? product.name}
            fill
            priority
            quality={100}
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-contain p-4"
            style={{ filter: "drop-shadow(0 20px 26px rgba(34,48,42,0.22))" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-soft/30">
            <span className="material-symbols-outlined text-[120px]">restaurant</span>
          </div>
        )}
        <span className="hanko absolute left-5 top-5 rounded-sm px-3 py-1.5 font-display text-lg">
          {product.price.amount} DH
        </span>
      </div>

      <div className="space-y-7">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
            Notre Creation
          </span>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {product.name}
          </h1>
          <BrushStroke className="mt-4 h-5 w-40 text-gold" />

          {product.shortDescription && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-washi-2/70 px-4 py-1.5">
              <span className="material-symbols-outlined text-[16px] text-gold-dim">
                local_fire_department
              </span>
              <span className="text-[11px] font-medium tracking-wide text-ink">
                {product.shortDescription}
              </span>
            </div>
          )}

          {product.description &&
            product.description !== product.shortDescription && (
              <p className="mt-5 text-[15px] font-light leading-relaxed text-ink-soft">
                {product.description}
              </p>
            )}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-washi-2/60 p-7">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/[0.08] blur-[80px]" />

          <div className="relative z-10 grid grid-cols-2 items-start gap-6">
            <div>
              <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-ink-soft/70">
                Quantite
              </h3>
              <div className="inline-flex items-center rounded-lg border border-ink/15 bg-washi">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-ink-soft transition-colors hover:text-gold-dim"
                  aria-label="Diminuer"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="px-5 text-base font-medium tabular-nums text-ink">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-ink-soft transition-colors hover:text-gold-dim"
                  aria-label="Augmenter"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            <div className="text-right">
              <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-ink-soft/70">
                Sous-total
              </h3>
              <p className="font-display text-3xl tabular-nums text-gold-dim md:text-4xl">
                {totalPrice.toFixed(2)}
                <span className="ml-1 text-sm uppercase tracking-widest opacity-70">
                  dh
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onAddClick}
            className="gold-breathe relative z-10 mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-bright px-7 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">
              add_shopping_cart
            </span>
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
