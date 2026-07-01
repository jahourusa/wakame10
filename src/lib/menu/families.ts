import type { Product, Category as WCCategory } from "@/lib/types/product";
import { productToDish, type DishLike } from "@/lib/menu/dish";

export type Category = { id: string; title: string; items: DishLike[] };
export type FamilyKind = "grid" | "compose";
export type Family = {
  id: string;
  label: string;
  categories: Category[];
  kind: FamilyKind;
};

export type FamilyId =
  | "entrees"
  | "bowls"
  | "healthy"
  | "feu"
  | "rolls"
  | "bentos"
  | "desserts";

interface FamilyDef {
  id: FamilyId;
  label: string;
  kanji: string;
  categorySlugs: string[];
  /**
   * "grid" (default) renders every sub-category as a normal dish grid.
   * "compose" replaces the whole family with a single banner + wizard —
   * used by Healthy Mood to bundle salade + protein + garniture into a plate.
   */
  kind?: FamilyKind;
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
    categorySlugs: ["fresh-bowls", "poke-bowl", "eat-clean"],
  },
  {
    id: "healthy",
    label: "Healthy Mood",
    kanji: "健",
    kind: "compose",
    categorySlugs: [
      "base-de-salades",
      "proteines-au-feu-de-bois",
      "coin-des-garnitures",
    ],
  },
  {
    id: "feu",
    label: "Feu de Bois & Wok",
    kanji: "炭火",
    categorySlugs: [
      "yakitori-du-chef-au-feu-de-bois",
      "tacos-fusion",
      "nouilles",
      "riz",
      "woks",
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
 * Curated product ordering derived from the official Wakame PDF menu.
 * Used as a stable tiebreaker when two products share the same price —
 * keeps the display predictable and matches the printed carte.
 */
const PDF_PRODUCT_ORDER: string[] = [
  // SOUPES & SAVEURS
  "SOUPE MISO",
  "SOUPE MISO SAUMON",
  "SOUPE MISO CREVETTES",
  "SOUPE ROYALE SYMPHONIE",
  "SOUPE TOM YUM GUN",
  "SOUPE HANO",
  // FRESH BOWLS
  "POULET A LA VIETNAMIENNE",
  "WAKA CHEESY",
  "CRISPY CREVETTE",
  "CREVETTE A LA VIETNAMIENNE",
  "LA BURRATINA",
  "VITELLO TONNATO",
  "TAKO TROPICAL",
  // POKE BOWLS
  "POKE BOWL POULET",
  "POKE BOWL POULET SAUCE TRUFFE",
  "POKE BOWL CREVETTE",
  "POKE BOWL CREVETTE SAUCE CACAHUETE",
  "POKE BOWL SAUMON",
  "POKE BOWL SAUMON SAUCE CACAHUETE",
  "POKE BOWL CRABE",
  "POKE BOWL BOEUF SAUCE TRUFFE",
  "POKE BOWL MIX",
  // TACOS FUSION
  "TACOS POULET TRUFFE",
  "TACOS CREVETTE CRUNCHY",
  "TACOS POULET AUX CHAMPIGNONS",
  "TACOS CREVETTES AUX CHAMPIGNONS",
  "TACOS BOEUF GUACAMOLE",
  "TACOS SAUMON TRUFFE",
  // TAPAS FUSION
  "AUBERGINE A LA SAUCE PONZU",
  "NEMS POULET",
  "POMMES DE TERRE GRENAILLES A LA SAUCE TRUFFE",
  "AVOCAT GRILLE AU FOUR A CHARBON",
  "CHEESY",
  "NEMS FROMAGE",
  "CREVETTES TEMPURA",
  "PATATES DOUCES A LA STRACIATELLA",
  "CREVETTES AUX AMANDES",
  "POULET SWEET & SOUR",
  "NEMS CREVETTE",
  "CREVETTE SWEET & SOUR",
  "CALAMAR GRILLE A LA SAUCE THAI",
  "GYOZA CREVETTES",
  "TRIO DE CHAMPIGNONS FARCIS AUX DELICES D'AMOUR",
  // YAKITORI DU CHEF AU FEU DE BOIS
  "BROCHETTE BOULETTES POULET",
  "BROCHETTE POULET",
  "BROCHETTE BOEUF FROMAGE",
  "BROCHETTE CREVETTES",
  "BROCHETTE BOEUF FROMAGE PANE",
  "BROCHETTE DE POULPE",
  "BROCHETTE SAUMON",
  "YAKI SIGNATURE",
  // BASE DE SALADES
  "MESCLUN DE SALADE A LA SAUCE BALSAMIQUE",
  "MESCLUN DE SALADE A LA SAUCE FRAMBOISE",
  "MESCLUN DE SALADE A LA SAUCE PONZU",
  // PROTEINES AU FEU DE BOIS
  "SUPREME DE POULET GRILLE",
  "SUPREME DE POULET GRILLE (PETITE PORTION)",
  "SUPREME DE POULET GRILLE (GRANDE PORTION)",
  "SAUMON GRILLE SAVEUR D'ASIE",
  "SAUMON GRILLE SAVEUR D'ASIE (PETITE PORTION)",
  "SAUMON GRILLE SAVEUR D'ASIE (GRANDE PORTION)",
  "CREVETTES GRILLES (TIGER)",
  "CREVETTES GRILLES (TIGER) (PETITE PORTION)",
  "CREVETTES GRILLES (TIGER) (GRANDE PORTION)",
  "POULPE GRILLE",
  "POULPE GRILLE (PETITE PORTION)",
  "POULPE GRILLE (GRANDE PORTION)",
  "FILET DE BOEUF MIGNON GRILLE",
  "FILET DE BOEUF MIGNON GRILLE (PETITE PORTION)",
  "FILET DE BOEUF MIGNON GRILLE (GRANDE PORTION)",
  // COIN DES GARNITURES
  "PATATES DOUCES A LA STRACIATELLA",
  "POMMES DE TERRE GRENAILLES A LA SAUCE TRUFFE",
  "AVOCAT GRILLE AU FOUR A CHARBON",
  "AUBERGINE A LA SAUCE PONZU",
  "BURRATINA",
  // EAT CLEAN
  "POULET FACON TEPPANYAKI",
  "POULET CURRY VERT",
  "FRUITS DE MER CURRY ROUGE",
  "CREVETTES FACON TEPPANYAKI",
  "PAVE DE SAUMON SAVEUR D'ASIE",
  "PULPO CELERI-RAVE",
  "LOUP-BAR A LA SAUCE DUO",
  // NOUILLES
  "NOUILLES VEGETARIENNES",
  "NOUILLES POULET",
  "NOUILLES FRUIT DE MER",
  "NOUILLES CREVETTE",
  "NOUILLES BOEUF",
  // RIZ
  "RIZ SAUTE VEGETARIEN",
  "RIZ SAUTE POULET",
  "RIZ SAUTE FRUITS DE MER",
  "RIZ SAUTE CREVETTE",
  "RIZ SAUTE BOEUF",
  // WOKS
  "WOK POULET NOIX DE CAJOU",
  "WOK BOEUF GINGEMBRE",
  "WOK GAMBAS NOIX DE CAJOU",
  "WOK SEA FOOD SYMPHONIE",
  // BENTOS
  "BENTO DELICE",
  "BENTO CRUNCHY",
  "BENTO EBI",
  "BENTO REGAL",
  "BENTO FRAICHEUR",
  "BENTO TRENDY",
  "BENTO DOUCEUR",
  "BENTO VOLCANO",
  "BENTO MIX",
  "BENTO LIGHTER",
  // COMBO
  "ELIT COMBO",
  "PRIME COMBO",
  // MENU KIDS
  "CRUNCHY KIDS",
  // ASSORTIMENTS SMALL
  "MINI DETENTE",
  "MINI TRIO",
  "MINI YUMMY",
  "WAKA SPRING",
  "MINI CALIFORNIA",
  "MINI REGAL",
  "WAKA TASTY",
  "WAKA DELICE",
  "WAKA FRY",
  "EBY CRUNCHY",
  "WAKA CALIFORNIA",
  "MINI SALMON",
  "WAKA DRAGON",
  // ASSORTIMENTS MEDIUM
  "WAKA FRESH",
  "WAKA CRUNCHY",
  "CRUNCHY TIME",
  "WAKA PARTY",
  "WAKA NORI",
  "WAKA ZEN",
  "SALMON FRESH",
  "WAKA MIX",
  "WAKA SLIM",
  // ASSORTIMENTS LARGE
  "SUSHI SYMPHONIE",
  "SUSHI FRAICHEUR",
  "SUSHI DREAM",
  "CRUNCHY BREAK",
  "CRUNCHY DELICE",
  "SUSHI RELAX",
  // ASSORTIMENTS X-LARGE
  "SUSHI PLAISIR",
  "SYMPHONIE ROYALE",
  "L'INCONTOURNABLE",
  "SUSHI FAMILY",
  "BIG FRESH",
  "CRUNCHY FAMILY",
  // CALIFORNIA ROLLS
  "CALIFORNIA CLASSIQUE",
  "CALIFORNIA SAUMON AVOCAT",
  "CALIFORNIA EBI FRY",
  "CALIFORNIA CREME CHEESE",
  "CALIFORNIA GREEN",
  "CALIFORNIA NORVEGIEN",
  "CALIFORNIA SHICHIMI",
  "CALIFORNIA RAINBOW",
  "CALIFORNIA TIGER ROLL",
  "TIGER ROLL",
  // CRUNCHY ROLLS
  "NEW DELHI",
  "BOMBAY",
  "BORA BORA",
  "MALMO",
  "NAPOLI",
  "FRY EBI FRY",
  "AGRA",
  "DRAGON EYE",
  // CRISPY ROLLS
  "CRISPY MAKI SURIMI",
  "CRISPY MAKI SAUMON",
  "CRISPY MAKI SPECIAL",
  "CRISPY KACHIWA",
  "CRISPY NARA",
  "CRISPY YATOMI",
  "CRISPY YOKOHAMA",
  // SUSHI PIZZA
  "PIZZA SAUMON AVOCAT",
  "PIZZA CREVETTE MOZZARELLA",
  "PIZZA SAUMON CRABE",
  "PIZZA SAUMON ANGUILLE",
  "PIZZA SAUMON MOZZARELLA",
  // TANUKI ROLLS
  "CRUNCHY CREVETTE",
  "CRUNCHY SAUMON",
  "SUPER CHEESY CRUNCHY",
  // SPRING ROLLS
  "ROULEAU DE PRINTEMPS SAUMON",
  "ROULEAU DE PRINTEMPS CREVETTE",
  "ROULEAU DE PRINTEMPS CREVETTE CRABE",
  "ROULEAU DE PRINTEMPS SAUMON FUME CRABE",
  "ROULEAU DE PRINTEMPS SAUMON CREVETTE",
  "SPRING CRABE MANGUE",
  "SLIM EXOTIQUE",
  // NORI ROLLS
  "NEW JERSEY",
  "LOS ANGELES",
  "TUCSON",
  "OMAHA",
  // SPECIAL ROLLS
  "MOSCOW",
  "WASHINGTON",
  "TOKYO",
  "VEGAS",
  "SAN JOSE",
  "HOT-EEL",
  "SPICY SALMON",
  // PREMIUM ROLLS
  "CRISTAL ROLL",
  "EBI CROWN",
  "SAMURAI",
  "OCEAN ROLL",
  "KOBE ROLL",
  "KAMAKURA",
  "TOYOSU",
  "SAKURA PEANUT ROLL",
  // LE CHEF PROPOSE (premium)
  "5 PIECES",
  "10 PIECES",
  "15 PIECES",
  "COFFRET PREMIUM 50 PCS",
  // PLAISIRS SUCRES (desserts)
  "FONDANT AU CHOCOLAT",
  "TIRAMISU",
  "CREME BRULEE PISTACHE",
  "COCO MANGO",
  // FRESH JUICES (jus)
  "JUS DE CITRON",
  "JUS ORANGE",
  "CITRON GINGEMBRE",
];

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]/g, "");
}

const PDF_RANK = new Map<string, number>(
  PDF_PRODUCT_ORDER.map((n, i) => [normalizeName(n), i])
);

function productRank(name: string): number {
  const r = PDF_RANK.get(normalizeName(name));
  return r === undefined ? Number.MAX_SAFE_INTEGER : r;
}

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

      // Cheapest first (matches the printed PDF menu); PDF name order as a
      // stable tiebreaker for items sharing the same price.
      const sorted = [...items].sort((a, b) => {
        const dp = a.price.amount - b.price.amount;
        if (dp !== 0) return dp;
        return productRank(a.name) - productRank(b.name);
      });

      cats.push({
        id: slug,
        title,
        items: sorted.map((p) => productToDish(p, PRODUCT_VIDEO[p.slug] ?? null)),
      });
    }
    return {
      id: fam.id,
      label: fam.label,
      categories: cats,
      kind: fam.kind ?? "grid",
    };
  }).filter((f) => f.categories.length > 0);
}
