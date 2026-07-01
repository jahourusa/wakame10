import type { Product } from "@/lib/types/product";

/**
 * Adapter shape the redesign's DishCard renders. Uniform across client and
 * server — this file is intentionally NOT "use client" so it can be called
 * during static generation.
 */
export type DishLike = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  desc: string;
  img: string | null;
  video: string | null;
  isNew: boolean;
  product: Product;
};

export function productToDish(
  p: Product,
  video: string | null = null,
  isNew = false
): DishLike {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.available ? p.price.amount : null,
    desc: p.description,
    img: p.images[0]?.src ?? null,
    video,
    isNew,
    product: p,
  };
}
