export type BranchSlug = "rabat" | "kenitra";

export interface Branch {
  slug: BranchSlug;
  name: string;
  area: string;
}

export const BRANCHES: Branch[] = [
  { slug: "rabat", name: "Rabat", area: "Agdal & Hay Riad" },
  { slug: "kenitra", name: "Kenitra", area: "Centre Ville" },
];
