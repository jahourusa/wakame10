"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore, cartSelectors } from "@/lib/store/cart-store";
import { useBranchStore } from "@/lib/store/branch-store";
import { BRANCHES } from "@/lib/types/branch";
import {
  placeOrder,
  validateCoupon,
  type ValidateCouponResult,
} from "@/app/checkout/actions";

const DELIVERY_FEE = 25;

type AppliedCoupon = Extract<ValidateCouponResult, { ok: true }>;

function computeDiscount(coupon: AppliedCoupon, subtotal: number): number {
  if (coupon.discountType === "percent") {
    return +((subtotal * coupon.amount) / 100).toFixed(2);
  }
  return Math.min(coupon.amount, subtotal);
}

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(cartSelectors.subtotal);
  const clear = useCartStore((s) => s.clear);
  const branch = useBranchStore((s) => s.branch);
  const branchMeta = BRANCHES.find((b) => b.slug === branch);

  const [pay, setPay] = useState<"cod" | "card">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{
    orderNumber: string;
    branchName: string;
  } | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const discount = coupon ? computeDiscount(coupon, subtotal) : 0;
  const deliveryFee = coupon?.freeShipping ? 0 : DELIVERY_FEE;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-xl space-y-6 py-16 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-washi-2/70 text-gold-dim">
          <span className="material-symbols-outlined text-[40px]">check_circle</span>
        </div>
        <h2 className="font-display text-4xl text-ink">Commande confirmee</h2>
        <span className="hanko inline-block rounded-sm px-3 py-1.5 text-[10px] font-medium uppercase">
          Commande #{confirmed.orderNumber}
        </span>
        <p className="text-ink-soft">
          Merci. Votre commande sera preparee par le restaurant {confirmed.branchName}.
          Un email de confirmation suit.
        </p>
        <Link
          href="/"
          className="gold-breathe inline-block rounded-lg bg-gradient-to-r from-gold to-gold-bright px-10 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.03]"
        >
          Retour a l&apos;accueil
        </Link>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6 py-16 text-center">
        <p className="text-ink-soft">Votre panier est vide.</p>
        <Link
          href="/menu"
          className="gold-breathe inline-block rounded-lg bg-gradient-to-r from-gold to-gold-bright px-10 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.03]"
        >
          Voir le menu
        </Link>
      </div>
    );
  }

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code || couponApplying) return;
    setCouponError(null);
    setCouponApplying(true);
    try {
      const result = await validateCoupon(code, subtotal);
      if (result.ok) {
        setCoupon(result);
        setCouponInput("");
      } else {
        setCouponError(result.error);
      }
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setCouponApplying(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!branchMeta) {
      setError("Veuillez choisir un restaurant avant de commander.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") ?? "").trim();
    const cleanPhone = phone.replace(/\D/g, "") || "guest";
    const customer = {
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      email: `${cleanPhone}@wakame.ma`,
      phone,
      address: String(fd.get("address") ?? "").trim(),
      city: branchMeta.name,
      zip: "",
      notes: String(fd.get("notes") ?? "").trim(),
    };

    setSubmitting(true);
    try {
      const result = await placeOrder({
        branch: { slug: branchMeta.slug, name: branchMeta.name },
        customer,
        items,
        shippingFee: deliveryFee,
        paymentMethod: pay,
        couponCode: coupon?.code ?? null,
      });

      if (result.ok) {
        setConfirmed({
          orderNumber: result.orderNumber,
          branchName: branchMeta.name,
        });
        clear();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12"
    >
      <div className="space-y-10 lg:col-span-7">
        <Section title="Coordonnees">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input name="firstName" label="Prenom" required />
            <Input name="lastName" label="Nom" required />
            <Input
              name="phone"
              label="Telephone"
              type="tel"
              required
              className="md:col-span-2"
            />
          </div>
        </Section>

        <Section title="Adresse de livraison">
          <div className="space-y-4">
            <Input name="address" label="Adresse" required />
            <Input
              name="city"
              label="Ville"
              defaultValue={branchMeta?.name ?? ""}
              readOnly
            />
            <Textarea name="notes" label="Instructions de livraison (optionnel)" />
          </div>
        </Section>

        <Section title="Paiement">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PaymentTile
              active={pay === "cod"}
              onClick={() => setPay("cod")}
              icon="payments"
              title="Paiement a la livraison"
              hint="Especes a la reception"
            />
            <PaymentTile
              active={pay === "card"}
              onClick={() => setPay("card")}
              icon="credit_card"
              title="Carte bancaire"
              hint="Bientot disponible"
              disabled
            />
          </div>
        </Section>
      </div>

      <aside className="relative space-y-6 overflow-hidden rounded-2xl border border-gold/20 bg-washi-2/60 p-8 backdrop-blur-md lg:sticky lg:top-28 lg:col-span-5">
        <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/40" />
        <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-gold/40" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-gold/40" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/40" />
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/[0.08] blur-[80px]" />

        <h2 className="relative z-10 font-display text-2xl text-ink">Recapitulatif</h2>

        <ul className="relative z-10 max-h-[260px] space-y-3 overflow-y-auto pr-1">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-ink/10 bg-washi">
                {it.image ? (
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-ink-soft/40">
                    <span className="material-symbols-outlined text-[16px]">
                      restaurant
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{it.name}</p>
                <p className="text-[11px] text-ink-soft/70">x{it.quantity}</p>
              </div>
              <p className="text-sm tabular-nums text-gold-dim">
                {it.price * it.quantity} DH
              </p>
            </li>
          ))}
        </ul>

        <div className="relative z-10 border-t border-ink/10 pt-4">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-ink-soft/70">
            Code promo
          </p>
          {!coupon ? (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCoupon();
                    }
                  }}
                  placeholder="CODE PROMO"
                  className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-washi px-4 py-3 text-sm uppercase tracking-wide text-ink placeholder:text-ink-soft/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/25"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponApplying || !couponInput.trim()}
                  className="shrink-0 whitespace-nowrap rounded-lg border border-ink/20 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:border-gold hover:bg-gold hover:text-kuro disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {couponApplying ? "..." : "Appliquer"}
                </button>
              </div>
              {couponError && (
                <p className="mt-2 text-xs text-hanko">{couponError}</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-gold-dim">
                  local_offer
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold uppercase tracking-wide text-ink">
                    {coupon.code}
                  </p>
                  <p className="mt-0.5 text-[10px] text-ink-soft">
                    {coupon.discountType === "percent"
                      ? `-${coupon.amount}%`
                      : `-${coupon.amount} DH`}
                    {coupon.freeShipping ? " + livraison offerte" : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeCoupon}
                aria-label="Retirer le code"
                className="shrink-0 text-ink-soft transition-colors hover:text-hanko"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}
        </div>

        <div className="relative z-10 space-y-3 border-t border-ink/10 pt-4 text-sm">
          <Row label="Sous-total" value={`${subtotal.toFixed(2)} DH`} />
          {coupon && discount > 0 && (
            <Row
              label={`Reduction (${coupon.code})`}
              value={`-${discount.toFixed(2)} DH`}
              accent="gold"
            />
          )}
          <Row
            label="Livraison"
            value={deliveryFee === 0 ? "Offerte" : `${deliveryFee} DH`}
          />
          <div className="gold-thread" />
          <Row label="Total" value={`${total.toFixed(2)} DH`} bold />
        </div>

        {error && (
          <p className="relative z-10 rounded-lg border border-hanko/40 bg-hanko/10 px-4 py-3 text-xs leading-relaxed text-hanko">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="gold-breathe relative z-10 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-bright px-7 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
              Envoi...
            </>
          ) : (
            <>
              Confirmer la commande
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </aside>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-gold-dim">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Input({
  label,
  name,
  className,
  ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">
        {label}
      </span>
      <input
        name={name}
        className="mt-1.5 w-full rounded-lg border border-ink/15 bg-washi px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/25 read-only:bg-washi-2/50 read-only:text-ink-soft"
        {...rest}
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  ...rest
}: { label: string; name: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">
        {label}
      </span>
      <textarea
        name={name}
        rows={3}
        className="mt-1.5 w-full rounded-lg border border-ink/15 bg-washi px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/25"
        {...rest}
      />
    </label>
  );
}

function PaymentTile({
  active,
  onClick,
  icon,
  title,
  hint,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  hint: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center gap-4 rounded-lg border p-5 text-left transition-all ${
        active
          ? "border-gold bg-gold/10"
          : "border-ink/15 bg-washi-2/50 hover:border-gold/50"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/30 bg-washi text-gold-dim">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-0.5 text-[10px] text-ink-soft/70">{hint}</p>
      </div>
    </button>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: "gold";
}) {
  const labelClass = bold
    ? "text-base text-ink"
    : accent === "gold"
      ? "text-sm text-gold-dim"
      : "text-sm text-ink-soft";
  const valueClass = bold
    ? "font-display text-2xl text-gold-dim"
    : accent === "gold"
      ? "font-semibold text-gold-dim"
      : "text-ink";
  return (
    <div className={`flex justify-between gap-3 ${labelClass}`}>
      <span className="truncate">{label}</span>
      <span className={`shrink-0 tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}
