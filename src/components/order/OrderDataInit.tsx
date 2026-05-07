"use client";

import { useEffect } from "react";
import { useOrderModalStore } from "@/lib/store/order-modal-store";
import type { Product } from "@/lib/types/product";

export function OrderDataInit({
  salades,
  boissons,
}: {
  salades: Product[];
  boissons: Product[];
}) {
  const setData = useOrderModalStore((s) => s.setData);

  useEffect(() => {
    setData(salades, boissons);
  }, [salades, boissons, setData]);

  return null;
}
