"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import type { Product } from "@/lib/types/product";

interface Props {
  product: Product;
  /** Fired after the item is added to the cart. Modal uses this to close itself + open the drawer. */
  onAdded?: () => void;
}

export function ProductCustomizer({ product, onAdded }: Props) {
  const add = useCartStore((s) => s.add);
  const [qty, setQty] = useState(1);

  const unitPrice = product.price.amount;
  const totalPrice = unitPrice * qty;

  const onAddClick = () => {
    add(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: unitPrice,
        image: product.images[0]?.src ?? "",
      },
      qty
    );
    onAdded?.();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-3 bg-[url('/background.webp')] bg-cover bg-center">
        <Image
          src={product.images[0]?.src ?? ""}
          alt={product.images[0]?.alt ?? product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-8"
        />
        <div className="absolute top-5 left-5 bg-dark/70 backdrop-blur-sm border border-gold/20 text-gold px-4 py-2 rounded-lg font-display text-lg">
          {product.price.amount} DH
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
            Notre Creation
          </span>
          <h1 className="font-display text-4xl md:text-5xl mt-3">{product.name}</h1>
          <div className="gold-line mt-6" />
          <p className="text-white/50 mt-6 leading-relaxed">{product.description}</p>
        </div>

        <div className="bg-dark-3 border border-white/[0.04] rounded-2xl p-7 space-y-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/[0.04] rounded-full blur-[80px]" />

          <div className="relative z-10 grid grid-cols-2 gap-6 items-start">
            <div>
              <h3 className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
                Quantite
              </h3>
              <div className="inline-flex items-center bg-dark-4 rounded-lg border border-white/5">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-white/60 hover:text-gold transition-colors"
                  aria-label="Diminuer"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="px-5 text-base font-medium tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 text-white/60 hover:text-gold transition-colors"
                  aria-label="Augmenter"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>

            <div className="text-right">
              <h3 className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
                Sous-total
              </h3>
              <p className="font-display text-3xl md:text-4xl text-gold tabular-nums">
                {totalPrice.toFixed(2)} DH
              </p>
            </div>
          </div>

          <button
            onClick={onAddClick}
            className="btn-gold relative z-10 w-full px-7 py-4 rounded-full font-bold text-[13px] tracking-[0.05em] flex items-center justify-center gap-3"
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
