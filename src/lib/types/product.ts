/**
 * Domain types are decoupled from any specific CMS.
 * The service layer (lib/api) maps WordPress responses into these.
 */

export interface Money {
  amount: number;
  currency: "MAD";
}

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Brief blurb from WC short_description — typically nutritional info (e.g. "540.1 kcal"). */
  shortDescription: string;
  price: Money;
  images: ProductImage[];
  category: string;
  available: boolean;
  branchSlugs: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  productCount: number;
}
