export type BranchSlug = "casablanca" | "rabat" | "kenitra";

export interface Branch {
  slug: BranchSlug;
  name: string;
  area: string;
}

export const BRANCHES: Branch[] = [
  { slug: "casablanca", name: "Casablanca", area: "Maarif & Gauthier" },
  { slug: "rabat", name: "Rabat", area: "Agdal & Hay Riad" },
  { slug: "kenitra", name: "Kenitra", area: "Centre Ville" },
];
