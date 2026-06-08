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

/** Compute the discount in DH for a given coupon + subtotal (mirrors WC's math). */
function computeDiscount(coupon: AppliedCoupon, subtotal: number): number {
  if (coupon.discountType === "percent") {
    return +((subtotal * coupon.amount) / 100).toFixed(2);
  }
  // fixed_cart and fixed_product both reduce by the absolute amount, capped at subtotal
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

  // Coupon state
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
        className="max-w-xl mx-auto text-center py-16 space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-gold text-[40px]">
            check_circle
          </span>
        </div>
        <h2 className="font-display text-4xl">Commande confirmee</h2>
        <p className="text-gold text-[11px] uppercase tracking-[0.2em]">
          Numero de commande #{confirmed.orderNumber}
        </p>
        <p className="text-white/40">
          Merci. Votre commande sera preparee par le restaurant {confirmed.branchName}.
          Un email de confirmation suit.
        </p>
        <Link
          href="/"
          className="inline-block btn-gold px-10 py-4 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em]"
        >
          Retour a l&apos;accueil
        </Link>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <p className="text-white/40">Votre panier est vide.</p>
        <Link
          href="/menu"
          className="inline-block btn-gold px-10 py-4 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em]"
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
      // WC requires a billing email; we synthesize one from the phone so each
      // order still has a unique billing identity in WooCommerce admin.
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
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
    >
      <div className="lg:col-span-7 space-y-10">
        <Section title="Coordonnees">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-dark-3 border border-gold/10 rounded-2xl p-8 space-y-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/[0.04] rounded-full blur-[80px]" />
        <h2 className="font-display text-2xl relative z-10">Recapitulatif</h2>

        <ul className="space-y-3 relative z-10 max-h-[260px] overflow-y-auto pr-1">
          {items.map((it) => (
            <li key={it.id} className="flex gap-3 items-center">
              <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-dark-3">
                {it.image ? (
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/30">
                    <span className="material-symbols-outlined text-[16px]">
                      restaurant
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{it.name}</p>
                <p className="text-white/40 text-[11px]">x{it.quantity}</p>
              </div>
              <p className="text-gold text-sm tabular-nums">{it.price * it.quantity} DH</p>
            </li>
          ))}
        </ul>

        <div className="relative z-10 border-t border-white/5 pt-4">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
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
                  className="min-w-0 flex-1 bg-dark-3 border border-white/5 rounded-lg px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all uppercase tracking-wide"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponApplying || !couponInput.trim()}
                  className="btn-outline shrink-0 px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.12em] whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {couponApplying ? "..." : "Appliquer"}
                </button>
              </div>
              {couponError && (
                <p className="text-red-400 text-xs mt-2">{couponError}</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-gold/10 border border-gold/30">
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-gold text-[20px]">
                  local_offer
                </span>
                <div className="min-w-0">
                  <p className="text-gold text-sm font-bold uppercase tracking-wide truncate">
                    {coupon.code}
                  </p>
                  <p className="text-white/60 text-[10px] mt-0.5">
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
                className="text-white/50 hover:text-gold transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3 relative z-10 border-t border-white/5 pt-4 text-sm">
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
          <Row label="Total" value={`${total.toFixed(2)} DH`} bold />
        </div>

        {error && (
          <p className="relative z-10 text-red-400 text-xs leading-relaxed border border-red-400/30 bg-red-400/5 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-gold w-full px-7 py-4 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">
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
      <h3 className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-semibold">
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
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</span>
      <input
        name={name}
        className="mt-1.5 w-full bg-dark-3 border border-white/5 rounded-lg px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all read-only:opacity-70"
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
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</span>
      <textarea
        name={name}
        rows={3}
        className="mt-1.5 w-full bg-dark-3 border border-white/5 rounded-lg px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
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
      className={`flex items-center gap-4 p-5 rounded-lg border text-left transition-all ${
        active
          ? "border-gold bg-gold/10"
          : "border-white/5 bg-dark-3 hover:border-gold/30"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <div className="w-10 h-10 rounded-lg bg-dark-4 flex items-center justify-center text-gold">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[10px] text-white/40 mt-0.5">{hint}</p>
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
    ? "text-white text-base"
    : accent === "gold"
      ? "text-gold/90 text-sm"
      : "text-white/60 text-sm";
  const valueClass = bold
    ? "font-display text-2xl text-gold"
    : accent === "gold"
      ? "text-gold font-semibold"
      : "";
  return (
    <div className={`flex justify-between gap-3 ${labelClass}`}>
      <span className="truncate">{label}</span>
      <span className={`tabular-nums shrink-0 ${valueClass}`}>{value}</span>
    </div>
  );
}
