/**
 * Server-side helper to create WooCommerce orders via the WC REST API v3.
 *
 *   POST {WP}/wp-json/wc/v3/orders        (HTTP Basic Auth: consumer_key:secret)
 *
 * Requires three env vars set on the server runtime (NOT NEXT_PUBLIC_):
 *
 *   NEXT_PUBLIC_API_BASE  = https://app.wakame.ma
 *   WC_CONSUMER_KEY       = ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   WC_CONSUMER_SECRET    = cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *
 * Generate the key/secret in WP admin:
 *   WooCommerce -> Settings -> Advanced -> REST API -> Add key
 *   Permissions: Read/Write
 */

import type { CartItem } from "@/lib/store/cart-store";

export type PaymentMethod = "cod" | "card";

export interface CreateOrderInput {
  branch: { slug: string; name: string };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip?: string;
    notes?: string;
  };
  items: CartItem[];
  shippingFee: number;
  paymentMethod: PaymentMethod;
}

export interface WCOrderResponse {
  id: number;
  number: string;
  status: string;
  total: string;
}

export class OrderApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "OrderApiError";
  }
}

function basicAuthHeader(key: string, secret: string): string {
  // Works in both Node and Edge runtimes
  const encoded =
    typeof btoa === "function"
      ? btoa(`${key}:${secret}`)
      : Buffer.from(`${key}:${secret}`).toString("base64");
  return `Basic ${encoded}`;
}

export async function createWCOrder(input: CreateOrderInput): Promise<WCOrderResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;

  if (!base) {
    throw new OrderApiError(500, "NEXT_PUBLIC_API_BASE not configured");
  }
  if (!key || !secret) {
    throw new OrderApiError(
      500,
      "WC API credentials missing — set WC_CONSUMER_KEY and WC_CONSUMER_SECRET in Vercel env vars"
    );
  }

  const body = {
    payment_method: input.paymentMethod === "cod" ? "cod" : "stripe",
    payment_method_title:
      input.paymentMethod === "cod" ? "Paiement a la livraison" : "Carte bancaire",
    set_paid: false,
    billing: {
      first_name: input.customer.firstName,
      last_name: input.customer.lastName,
      email: input.customer.email,
      phone: input.customer.phone,
      address_1: input.customer.address,
      city: input.customer.city,
      postcode: input.customer.zip ?? "",
      country: "MA",
    },
    shipping: {
      first_name: input.customer.firstName,
      last_name: input.customer.lastName,
      address_1: input.customer.address,
      city: input.customer.city,
      postcode: input.customer.zip ?? "",
      country: "MA",
    },
    line_items: input.items.map((it) => ({
      product_id: Number(it.id),
      quantity: it.quantity,
    })),
    shipping_lines: [
      {
        method_id: "flat_rate",
        method_title: "Livraison",
        total: input.shippingFee.toFixed(2),
      },
    ],
    customer_note: input.customer.notes ?? "",
    // Branch attribution — the leading underscore on `_branch` keeps it hidden
    // from the default Custom Fields UI (used programmatically). The plain
    // `Restaurant` key is human-readable and shows in the admin order page.
    meta_data: [
      { key: "Restaurant", value: input.branch.name },
      { key: "_branch", value: input.branch.slug },
    ],
  };

  const res = await fetch(`${base}/wp-json/wc/v3/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader(key, secret),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    let detail = "";
    try {
      const errBody = await res.json();
      detail = errBody?.message ?? JSON.stringify(errBody).slice(0, 200);
    } catch {
      detail = (await res.text()).slice(0, 200);
    }
    throw new OrderApiError(res.status, `WC ${res.status}: ${detail}`);
  }

  return (await res.json()) as WCOrderResponse;
}
