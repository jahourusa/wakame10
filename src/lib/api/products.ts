/**
 * Service layer for products. Components import from HERE — never from `client.ts`
 * directly. Backed by the WooCommerce Store API (public, no auth needed for reads).
 *
 *   Docs: https://github.com/woocommerce/woocommerce/blob/trunk/plugins/woocommerce/src/StoreApi/docs/products.md
 *
 * IMPORTANT: WC Store API returns `prices.price` as a STRING in MINOR units
 * (e.g. "5500" with `currency_minor_unit: 2` means 55.00 MAD). We normalize
 * everything to a Number in major units inside our domain `Money` type.
 */

import { apiFetch } from "./client";
import type { Money, Product, Category } from "@/lib/types/product";
import type { BranchSlug } from "@/lib/types/branch";

interface WCStoreImage {
  id?: number;
  src: string;
  thumbnail?: string;
  name?: string;
  alt?: string;
}

interface WCStoreCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  link?: string;
}

interface WCStorePrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_minor_unit: number;
  currency_symbol: string;
}

interface WCStoreProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  permalink?: string;
  on_sale?: boolean;
  is_in_stock?: boolean;
  prices: WCStorePrices;
  images: WCStoreImage[];
  categories: WCStoreCategory[];
}

interface WCStoreCategoryWithCount extends WCStoreCategory {
  count?: number;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function fromMinorUnits(value: string, minor: number): number {
  return Number(value) / Math.pow(10, minor);
}

/** Decode the handful of HTML entities WP can emit in product / category names. */
function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&ecirc;/g, "ê")
    .replace(/&agrave;/g, "à")
    .replace(/&acirc;/g, "â")
    .replace(/&ocirc;/g, "ô")
    .replace(/&ucirc;/g, "û")
    .replace(/&icirc;/g, "î")
    .replace(/&ccedil;/g, "ç");
}

/** "Eau gazeuse" -> "Eau Gazeuse"; "SALMON FRESH" -> "Salmon Fresh"; preserves accented chars. */
function toTitleCase(str: string): string {
  return str
    .toLocaleLowerCase("fr-FR")
    .split(/(\s+)/)
    .map((part) =>
      /\s+/.test(part)
        ? part
        : part.charAt(0).toLocaleUpperCase("fr-FR") + part.slice(1)
    )
    .join("");
}

function toMoney(prices: WCStorePrices): Money {
  return {
    amount: fromMinorUnits(prices.price, prices.currency_minor_unit),
    currency: (prices.currency_code as Money["currency"]) ?? "MAD",
  };
}

function mapProduct(wp: WCStoreProduct): Product {
  const desc = stripHtml(wp.description);
  const shortDesc = stripHtml(wp.short_description);
  return {
    id: String(wp.id),
    slug: wp.slug,
    name: toTitleCase(decodeEntities(wp.name)),
    description: desc || shortDesc,
    shortDescription: shortDesc,
    price: toMoney(wp.prices),
    images: wp.images.map((img) => ({
      src: img.src,
      alt: img.alt || img.name || wp.name,
    })),
    category: wp.categories[0]?.slug ?? "",
    available: wp.is_in_stock ?? true,
    // Store API has no built-in "branch" concept. Until a custom taxonomy
    // is added on the WP side (e.g. a `branch` term), every product is
    // available in every city.
    branchSlugs: [],
  };
}

const STORE_BASE = "/wp-json/wc/store/v1";
const PER_PAGE = 100;
const MAX_PAGES = 10; // safety cap; 10 * 100 = 1000 products

/**
 * Fetches every product across all WC Store API pages. Uses the X-WP-TotalPages
 * response header (the API caps `per_page` at 100, so a single request only
 * covers the first 100 products even though we ask for more).
 */
export async function getProducts(opts: { revalidate?: number } = {}): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) return [];

  const revalidate = opts.revalidate ?? 60;

  // First page — also reads X-WP-TotalPages so we know how many more to fetch.
  const firstRes = await fetch(
    `${base}${STORE_BASE}/products?per_page=${PER_PAGE}&page=1`,
    { next: { revalidate } }
  );
  if (!firstRes.ok) return [];

  const firstBatch = (await firstRes.json()) as WCStoreProduct[];
  const totalPages = Math.min(
    Number(firstRes.headers.get("X-WP-TotalPages") ?? "1") || 1,
    MAX_PAGES
  );

  if (totalPages <= 1) return firstBatch.map(mapProduct);

  // Remaining pages fetched in parallel.
  const restPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(
        `${base}${STORE_BASE}/products?per_page=${PER_PAGE}&page=${i + 2}`,
        { next: { revalidate } }
      )
        .then((r) => (r.ok ? (r.json() as Promise<WCStoreProduct[]>) : []))
        .catch(() => [] as WCStoreProduct[])
    )
  );

  const all = firstBatch.concat(...restPages);
  return all.map(mapProduct);
}

export async function getProductsByBranch(
  _branch: BranchSlug,
  opts: { revalidate?: number } = {}
): Promise<Product[]> {
  // Once WP has a `branch` product attribute or taxonomy, change this to:
  //   `${STORE_BASE}/products?per_page=100&attributes[0][attribute]=pa_branch&attributes[0][slug]=${_branch}`
  return getProducts(opts);
}

/**
 * Fetch products belonging to a specific WooCommerce category by slug.
 * Filters in-memory off `getProducts()` so we hit the same ISR cache
 * regardless of how many category pages we add.
 */
export async function getProductsByCategory(
  categorySlug: string,
  opts: { revalidate?: number } = {}
): Promise<Product[]> {
  const all = await getProducts(opts);
  return all.filter((p) => p.category === categorySlug);
}

export async function getProductBySlug(
  slug: string,
  opts: { revalidate?: number } = {}
): Promise<Product | null> {
  if (!process.env.NEXT_PUBLIC_API_BASE) return null;
  const list = await apiFetch<WCStoreProduct[]>(
    `${STORE_BASE}/products?slug=${encodeURIComponent(slug)}`,
    { revalidate: opts.revalidate ?? 60 }
  );
  return list[0] ? mapProduct(list[0]) : null;
}

export async function getCategories(
  opts: { revalidate?: number } = {}
): Promise<Category[]> {
  if (!process.env.NEXT_PUBLIC_API_BASE) return [];
  const list = await apiFetch<WCStoreCategoryWithCount[]>(
    `${STORE_BASE}/products/categories?per_page=100`,
    { revalidate: opts.revalidate ?? 300 }
  );
  // Hide empty categories and the default WooCommerce "Uncategorized" bucket
  // so they don't clutter the sidebar.
  const HIDDEN_SLUGS = new Set(["uncategorized", "non-classe", "non-classifie"]);
  return list
    .filter((c) => (c.count ?? 0) > 0 && !HIDDEN_SLUGS.has(c.slug))
    .map((c) => ({
      id: String(c.id),
      slug: c.slug,
      name: decodeEntities(c.name),
      description: stripHtml(c.description ?? ""),
      productCount: c.count ?? 0,
    }));
}
