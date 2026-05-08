"use server";

import { createWCOrder, OrderApiError, type CreateOrderInput } from "@/lib/api/orders";

export type PlaceOrderResult =
  | { ok: true; orderId: number; orderNumber: string; total: string }
  | { ok: false; error: string };

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
  if (!c.firstName || !c.lastName || !c.email || !c.phone || !c.address) {
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
