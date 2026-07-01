import type { Product, Category as WCCategory } from "@/lib/types/product";
import { productToDish, type DishLike } from "@/lib/menu/dish";

export type Category = { id: string; title: string; items: DishLike[] };
export type Family = { id: string; label: string; categories: Category[] };

export type FamilyId =
  | "entrees"
  | "bowls"
  | "feu"
  | "rolls"
  | "bentos"
  | "desserts";

interface FamilyDef {
  id: FamilyId;
  label: string;
  kanji: string;
  categorySlugs: string[];
}

/**
 * Maps our 6 curated families to the flat list of WooCommerce category slugs.
 * Order inside `categorySlugs` is the order the sub-categories will render.
 * Any WC category not present here is silently dropped from the /menu page.
 */
export const FAMILY_DEFS: FamilyDef[] = [
  {
    id: "entrees",
    label: "Entrees & Soupes",
    kanji: "前菜",
    categorySlugs: ["soupes-saveurs", "tapas-fusion"],
  },
  {
    id: "bowls",
    label: "Bowls & Salades",
    kanji: "丼",
    categorySlugs: ["fresh-bowls", "poke-bowl", "base-de-salades", "eat-clean"],
  },
  {
    id: "feu",
    label: "Feu de Bois & Wok",
    kanji: "炭火",
    categorySlugs: [
      "yakitori-du-chef-au-feu-de-bois",
      "proteines-au-feu-de-bois",
      "tacos-fusion",
      "nouilles",
      "riz",
      "woks",
      "coin-des-garnitures",
    ],
  },
  {
    id: "rolls",
    label: "Rolls & Sushi",
    kanji: "寿司",
    categorySlugs: [
      "california-rolls",
      "crunchy-rolls",
      "crispy-rolls",
      "sushi-pizza",
      "tanuki-rolls",
      "spring-roll",
      "nori-rolls",
      "special-rolls",
      "premium-rolls",
      "premium",
    ],
  },
  {
    id: "bentos",
    label: "Bentos & Assortiments",
    kanji: "弁当",
    categorySlugs: [
      "bentos",
      "combo",
      "menu-kids",
      "small-assortiments",
      "medium-assortiments",
      "large-assortiments",
      "x-large-assortiments",
    ],
  },
  {
    id: "desserts",
    label: "Desserts & Boissons",
    kanji: "甘味",
    categorySlugs: ["desserts", "jus", "le-petit-plus"],
  },
];

export const familyKanji = (id: string) =>
  FAMILY_DEFS.find((f) => f.id === id)?.kanji ?? "";

// Which WC category slug belongs to which family (reverse map).
const SLUG_TO_FAMILY: Map<string, FamilyId> = new Map();
for (const f of FAMILY_DEFS) {
  for (const slug of f.categorySlugs) SLUG_TO_FAMILY.set(slug, f.id);
}

/**
 * Videos to attach to specific product slugs. Same convention as the legacy
 * MenuGrid — files live in /public/ and are lazy-loaded via InViewVideo.
 */
const PRODUCT_VIDEO: Record<string, string> = {
  "waka-dragon": "/waka-dragon/waka-dragon.mp4",
  "salade-burratina": "/salade-crevettes-vietnamienne/salade-crevettes-vietnamienne.mp4",
  "tiger-roll": "/california-rolls/california-rolls.mp4",
};

/**
 * Group live WooCommerce products+categories into the 6 curated families.
 * The output preserves FAMILY_DEFS order for both families and their
 * sub-categories, and only surfaces sub-categories that actually have items.
 */
export function groupProductsByFamily(
  products: Product[],
  categories: WCCategory[]
): Family[] {
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));

  // Bucket products by WC category slug.
  const productsBySlug = new Map<string, Product[]>();
  for (const p of products) {
    const list = productsBySlug.get(p.category) ?? [];
    list.push(p);
    productsBySlug.set(p.category, list);
  }

  return FAMILY_DEFS.map((fam) => {
    const cats: Category[] = [];
    for (const slug of fam.categorySlugs) {
      const items = productsBySlug.get(slug);
      if (!items || items.length === 0) continue;
      const wc = catBySlug.get(slug);
      const title = wc?.name ?? slug.replace(/-/g, " ").toUpperCase();
      cats.push({
        id: slug,
        title,
        items: items.map((p) => productToDish(p, PRODUCT_VIDEO[p.slug] ?? null)),
      });
    }
    return { id: fam.id, label: fam.label, categories: cats };
  }).filter((f) => f.categories.length > 0);
}
