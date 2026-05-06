# Wakame10

Headless Next.js 15 storefront for [Wakame Sushi](https://wakame.ma) — Asian-fusion sushi delivery in Casablanca, Rabat, and Kenitra.

- **Frontend:** Next.js 15 App Router · TypeScript · Tailwind CSS · Framer Motion
- **State:** Zustand (cart, branch selector, UI) with `localStorage` persist
- **Backend:** WordPress + WooCommerce headless via Store API at `https://app.wakame.ma`
- **Deploy:** Vercel — live at https://wakame10.vercel.app

## Local development

```bash
npm install
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_BASE=https://app.wakame.ma
npm run dev
```

## Architecture

- `src/app/` — App Router pages (homepage, `/menu`, `/product/[slug]`, `/cart`, `/checkout`, `/order/beverages`, `/order/upsell`, `/contact`)
- `src/components/sections/` — page-level sections composed in pages
- `src/components/branch/` — city selector modal + badge
- `src/components/layout/` — header, footer, mobile drawer & bottom nav
- `src/components/ui/` — generic primitives (`Reveal`, `Counter`)
- `src/lib/api/` — service layer (swap WP for any other source here)
- `src/lib/store/` — Zustand stores
- `src/lib/types/` — domain types decoupled from any CMS
