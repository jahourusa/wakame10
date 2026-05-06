"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import type { Product } from "@/lib/types/product";

const SIZES = [
  { id: "regular", label: "Standard", priceDelta: 0 },
  { id: "large", label: "Grand", priceDelta: 35 },
  { id: "family", label: "Famille", priceDelta: 90 },
];

const EXTRAS = [
  { id: "wasabi", label: "Wasabi premium", priceDelta: 10 },
  { id: "ginger", label: "Gingembre marine", priceDelta: 10 },
  { id: "sauce", label: "Sauce signature", priceDelta: 15 },
  { id: "tobiko", label: "Oeufs de tobiko", priceDelta: 25 },
];

interface Props {
  product: Product;
}

export function ProductCustomizer({ product }: Props) {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const [size, setSize] = useState(SIZES[0].id);
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  const sizeMeta = SIZES.find((s) => s.id === size)!;
  const extrasTotal = useMemo(
    () =>
      EXTRAS.filter((e) => extras.includes(e.id)).reduce((a, b) => a + b.priceDelta, 0),
    [extras]
  );
  const unitPrice = product.price.amount + sizeMeta.priceDelta + extrasTotal;
  const totalPrice = unitPrice * qty;

  const toggleExtra = (id: string) =>
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));

  const onContinue = () => {
    add(
      {
        id: `${product.id}-${size}-${extras.sort().join("-")}`,
        slug: product.slug,
        name: product.name,
        price: unitPrice,
        image: product.images[0]?.src ?? "",
        options: { size, extras: extras.join(",") || "aucun" },
      },
      qty
    );
    router.push("/order/beverages");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-3">
        <Image
          src={product.images[0]?.src ?? ""}
          alt={product.images[0]?.alt ?? product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute top-5 left-5 bg-dark/70 backdrop-blur-sm border border-gold/20 text-gold px-4 py-2 rounded-lg font-display text-lg">
          {product.price.amount} DH
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
            Personnalisation
          </span>
          <h1 className="font-display text-4xl md:text-5xl mt-3">{product.name}</h1>
          <div className="gold-line mt-6" />
          <p className="text-white/50 mt-6 leading-relaxed">{product.description}</p>
        </div>

        <Group title="Format">
          <div className="grid grid-cols-3 gap-3">
            {SIZES.map((s) => (
              <Pill
                key={s.id}
                active={size === s.id}
                onClick={() => setSize(s.id)}
                label={s.label}
                hint={s.priceDelta > 0 ? `+${s.priceDelta} DH` : "Inclus"}
              />
            ))}
          </div>
        </Group>

        <Group title="Suppléments">
          <div className="grid grid-cols-2 gap-3">
            {EXTRAS.map((e) => (
              <Pill
                key={e.id}
                active={extras.includes(e.id)}
                onClick={() => toggleExtra(e.id)}
                label={e.label}
                hint={`+${e.priceDelta} DH`}
              />
            ))}
          </div>
        </Group>

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

          <div className="relative z-10 flex justify-between items-center text-sm pt-2 border-t border-white/[0.04]">
            <span className="text-white/60">
              {product.name} ({sizeMeta.label})
            </span>
            <span className="text-white/60 tabular-nums">
              {(unitPrice * qty).toFixed(2)} DH
            </span>
          </div>

          <button
            onClick={onContinue}
            className="btn-gold relative z-10 w-full px-7 py-4 rounded-full font-bold text-[13px] tracking-[0.05em] flex items-center justify-center gap-3"
          >
            Continuer vers Boissons
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-semibold mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-lg border px-4 py-3 text-left transition-all ${
        active
          ? "border-gold bg-gold/10 text-white"
          : "border-white/5 bg-dark-3 text-white/60 hover:border-gold/30"
      }`}
    >
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="text-[10px] text-white/40 mt-1">{hint}</p>}
    </button>
  );
}
