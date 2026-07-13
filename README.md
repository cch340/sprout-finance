# Sprout

A warm, calm shared-money PWA for couples and families. Money is organized into
separate **spaces** — each its own ledger with scoped categories and fields — with a
roll-up **Home/Overview** across everything. Expenses read as calm ink, balances in
sage, and red is reserved strictly for over-budget. Sprout is **local-first**: all data
lives on-device in IndexedDB, no backend required.

## Stack

- **React 18 + Vite + TypeScript** (strict), **React Router v6**, **Zustand** for app state
- **Dexie** (IndexedDB) behind a repository interface for persistence
- **vite-plugin-pwa** (Workbox) for the manifest + offline service worker
- Self-hosted **Figtree** woff2 (no Google CDN); curated inline **Lucide** icon subset
- Design tokens copied verbatim from the design handoff; plain CSS consuming CSS custom
  properties (no CSS framework)

## Dev commands

```bash
npm install
npm run dev       # Vite dev server
npm run build     # tsc -b + vite build (production, emits PWA service worker)
npm test          # Vitest (domain selectors)
npm run preview   # serve the production build (needed to exercise the service worker)
```

## Design handoff

The source-of-truth design lives in `design/design_handoff_sprout_pwa/` — the high-fidelity
prototypes, the Sprout/Kira design-system tokens (`sprout/design-system/tokens/`), reference
screenshots (`screenshots/`), and a detailed `README.md`. Implementation conventions are in
`docs/ARCHITECTURE.md`.

## PWA / install

The production build emits a web manifest and a precaching service worker (app shell +
fonts), so Sprout is installable and works offline. Install via your browser's "Install app"
/ "Add to Home Screen" prompt. The service worker only runs against a real build — use
`npm run build && npm run preview` (not `npm run dev`) to try installation and offline mode.
Icons are generated from `design/design_handoff_sprout_pwa/sprout/assets/sprout-icon.svg`
via `scripts/gen-icons.mjs` (rasterized with Playwright/Chromium) into `public/`.

## Demo data

Onboarding creates a real, empty household. To explore the app with the sample JC/CH ledger:

- **Load demo data instead** on the onboarding welcome screen, or **Settings → Load demo data**, or
- append **`?demo`** to the URL on a fresh install (e.g. `/?demo`) to seed automatically.

Demo entries are mapped onto recent months, so Home/Reports always show live current-month figures.
