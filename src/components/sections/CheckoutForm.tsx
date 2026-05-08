"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCartStore, cartSelectors } from "@/lib/store/cart-store";
import { useBranchStore } from "@/lib/store/branch-store";
import { BRANCHES } from "@/lib/types/branch";
import { placeOrder } from "@/app/checkout/actions";

const DELIVERY_FEE = 25;

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(cartSelectors.subtotal);
  const clear = useCartStore((s) => s.clear);
  const branch = useBranchStore((s) => s.branch);
  const branchMeta = BRANCHES.find((b) => b.slug === branch);
  const total = subtotal + DELIVERY_FEE;

  const [pay, setPay] = useState<"cod" | "card">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{
    orderNumber: string;
    branchName: string;
  } | null>(null);

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
        shippingFee: DELIVERY_FEE,
        paymentMethod: pay,
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
              <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
                <Image src={it.image} alt={it.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{it.name}</p>
                <p className="text-white/40 text-[11px]">x{it.quantity}</p>
              </div>
              <p className="text-gold text-sm tabular-nums">{it.price * it.quantity} DH</p>
            </li>
          ))}
        </ul>

        <div className="space-y-3 relative z-10 border-t border-white/5 pt-4 text-sm">
          <Row label="Sous-total" value={`${subtotal} DH`} />
          <Row label="Livraison" value={`${DELIVERY_FEE} DH`} />
          <Row label="Total" value={`${total} DH`} bold />
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

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex justify-between ${
        bold
          ? "text-white text-base"
          : "text-white/60 text-sm"
      }`}
    >
      <span>{label}</span>
      <span className={`tabular-nums ${bold ? "font-display text-2xl text-gold" : ""}`}>
        {value}
      </span>
    </div>
  );
}
