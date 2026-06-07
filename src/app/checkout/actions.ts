"use server";

import { createWCOrder, OrderApiError, type CreateOrderInput } from "@/lib/api/orders";

export type PlaceOrderResult =
  | { ok: true; orderId: number; orderNumber: string; total: string }
  | { ok: false; error: string };

export type CouponDiscountType =
  | "percent"
  | "fixed_cart"
  | "fixed_product";

export type ValidateCouponResult =
  | {
      ok: true;
      code: string;
      discountType: CouponDiscountType;
      amount: number;
      freeShipping: boolean;
      minimumAmount: number;
      maximumAmount: number;
    }
  | { ok: false; error: string };

interface WCCoupon {
  id: number;
  code: string;
  amount: string;
  discount_type: string;
  date_expires_gmt: string | null;
  usage_limit: number | null;
  usage_count: number;
  minimum_amount: string;
  maximum_amount: string;
  free_shipping: boolean;
}

function wcBasicAuth(): string | null {
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!key || !secret) return null;
  const encoded =
    typeof btoa === "function"
      ? btoa(`${key}:${secret}`)
      : Buffer.from(`${key}:${secret}`).toString("base64");
  return `Basic ${encoded}`;
}

/**
 * Validates a coupon code against WooCommerce.
 * Doesn't mark the coupon as used — that only happens when the order is
 * actually placed (createWCOrder sends it as coupon_lines).
 */
export async function validateCoupon(
  rawCode: string,
  cartSubtotal: number
): Promise<ValidateCouponResult> {
  const code = rawCode.trim().toLowerCase();
  if (!code) return { ok: false, error: "Veuillez entrer un code." };

  const base = process.env.NEXT_PUBLIC_API_BASE;
  const auth = wcBasicAuth();
  if (!base || !auth) {
    return { ok: false, error: "Service indisponible (configuration manquante)." };
  }

  try {
    const url = `${base}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code)}&per_page=1`;
    const res = await fetch(url, {
      headers: { Authorization: auth },
      cache: "no-store",
    });
    if (!res.ok) {
      return { ok: false, error: "Impossible de verifier le code." };
    }
    const list = (await res.json()) as WCCoupon[];
    if (!Array.isArray(list) || list.length === 0) {
      return { ok: false, error: "Ce code n'existe pas." };
    }
    const coupon = list[0];

    // Expiry check
    if (coupon.date_expires_gmt) {
      const expiry = new Date(coupon.date_expires_gmt + "Z").getTime();
      if (!isNaN(expiry) && expiry < Date.now()) {
        return { ok: false, error: "Ce code a expire." };
      }
    }

    // Usage limit check
    if (
      coupon.usage_limit != null &&
      coupon.usage_count >= coupon.usage_limit
    ) {
      return { ok: false, error: "Ce code n'est plus disponible." };
    }

    // Minimum amount check
    const min = Number(coupon.minimum_amount) || 0;
    if (min > 0 && cartSubtotal < min) {
      return {
        ok: false,
        error: `Montant minimum ${min} DH requis pour ce code.`,
      };
    }
    const max = Number(coupon.maximum_amount) || 0;
    if (max > 0 && cartSubtotal > max) {
      return {
        ok: false,
        error: `Ce code n'est valable que jusqu'a ${max} DH.`,
      };
    }

    const discountType = (
      ["percent", "fixed_cart", "fixed_product"].includes(coupon.discount_type)
        ? coupon.discount_type
        : "fixed_cart"
    ) as CouponDiscountType;

    return {
      ok: true,
      code: coupon.code,
      discountType,
      amount: Number(coupon.amount) || 0,
      freeShipping: !!coupon.free_shipping,
      minimumAmount: min,
      maximumAmount: max,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { ok: false, error: message };
  }
}

export async function placeOrder(input: CreateOrderInput): Promise<PlaceOrderResult> {
  // Minimal server-side validation. The form already validates client-side,
  // but never trust the client.
  if (!input.items || input.items.length === 0) {
    return { ok: false, error: "Votre panier est vide." };
  }
  if (!input.branch?.slug) {
    return { ok: false, error: "Veuillez choisir un restaurant." };
  }
  const c = input.customer;
  if (!c.firstName || !c.lastName || !c.phone || !c.address) {
    return { ok: false, error: "Tous les champs obligatoires doivent etre remplis." };
  }

  try {
    const order = await createWCOrder(input);
    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.number,
      total: order.total,
    };
  } catch (err) {
    if (err instanceof OrderApiError) {
      return { ok: false, error: err.message };
    }
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return { ok: false, error: message };
  }
}
