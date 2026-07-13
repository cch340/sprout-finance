# Sprout — architecture & conventions

Sprout is a local-first PWA for couples/families tracking shared money in **spaces**.
This doc is the source of truth for implementation conventions. The design spec is
`design/design_handoff_sprout_pwa/README.md` (read it first); reference prototypes live in
`design/design_handoff_sprout_pwa/sprout/` and screenshots in `design/design_handoff_sprout_pwa/screenshots/`.

## Product decisions (agreed defaults)
- **Local-only**: persistence in IndexedDB (Dexie) behind a repository interface. No backend yet.
- **Demo seed optional**: onboarding creates a real empty household; a "Load demo data" action
  (Settings, and dev default via `?demo`) seeds the JC/CH June ledger from the handoff.
- **Real months**: transactions carry ISO dates. Home/Reports compute over the current month;
  history/trend derives from actual data. Demo seed maps sample entries onto recent months.
- Currency: configurable label, default **RM** (Malaysian Ringgit), formatted `RM 4,182.50`,
  tabular figures, dimmed symbol/decimals (the `Amount` component owns this).

## Stack
- React 18 + Vite + TypeScript (strict). React Router v6. Zustand for app state.
- Dexie for IndexedDB. vite-plugin-pwa for manifest/service worker.
- Fonts: Figtree self-hosted woff2 in `public/fonts/` + local `@font-face` (no Google CDN).
- Icons: curated inline Lucide subset in `src/design-system/Icon.tsx` (no icon package/CDN).
- No CSS framework. Plain CSS modules or plain .css files consuming the token custom properties.

## Folder structure (app at repo root)
```
src/
  design-system/      # ported Kira components + index.ts barrel
    tokens/           # colors.css, typography.css, spacing.css, radius.css, shadow.css, motion.css, fonts.css
  domain/             # types.ts, selectors.ts (pure functions), format.ts
  data/               # db.ts (Dexie), repo.ts, seed-demo.ts
  store/              # useAppStore.ts (Zustand), theme.ts
  shell/              # AppShell, MobileTabBar, Fab, DesktopSidebar, Topbar
  screens/            # Home, Spaces, SpaceDetail, Personal, Reports, Settings, Onboarding
  dialogs/            # AddEntryDialog, NewSpaceDialog, SpaceSettingsDialog
```

## Design system rules (non-negotiable)
- Copy token CSS **verbatim** from `design/design_handoff_sprout_pwa/sprout/design-system/tokens/`
  (except fonts.css → rewrite to local @font-face). Never invent color/spacing/radius values —
  always `var(--…)`.
- Port each component to a typed React component matching the prototype's API where sensible:
  Amount, Avatar, Badge, Card, CategoryIcon, ListRow, ProgressBar, StatCard, Tag, Dialog, Toast,
  Tooltip, Button, Checkbox, IconButton, Input, Radio, SegmentedControl, Select, Switch, Textarea,
  Icon, Tabs. Prototype sources for look/behavior: `_ds_bundle.js` (compiled) + usage in
  `sprout/src/*.jsx` and `sprout/mobile-app.jsx` / `desktop-app.jsx`.
- Money: neutral ink for expenses; `#C7503F` (--money-over) only for over-budget; balances sage.
  Income green with `+` (`kind="in" showSign`).
- Sentence case everywhere. No gradients, no textures. Dark mode via `[data-theme="dark"]` on <html>.
- Motion: 140–340ms, ease `cubic-bezier(0.2,0,0.1,1)`; honor `prefers-reduced-motion`.
  Buttons press scale .98, icon buttons .92; cards hover-lift 2px → shadow md.

## Domain model (TypeScript)
```ts
type SpaceKind = 'spend' | 'fund' | 'invest' | 'personal';
interface FieldDef { key: string; label: string; type: 'text' | 'select' | 'date' | 'number'; primary?: boolean; options?: string[]; placeholder?: string }
interface Category { key: string; label: string }
interface Space { id: string; name: string; short?: string; sub?: string; group: 'shared' | 'personal';
  icon: string; kind: SpaceKind; cats: Category[]; fields: FieldDef[];
  budget?: number; balance?: number; value?: number; sortOrder: number }
interface RecurringItem { id: string; spaceId: string; label: string; cat: string; amount: number }
interface Tx { id: string; spaceId: string; title: string; fieldValues: Record<string, string>;
  note: string; cat: string; amount: number; date: string /* ISO yyyy-mm-dd */;
  payer?: 'Joint' | string; dir: 'in' | 'out'; status?: 'paid' | 'due';
  linkId?: string; linkSpaceId?: string /* fund "paid from" pairing */ }
interface Household { people: { id: string; name: string }[]; currency: string; onboarded: boolean }
```
- **Custom field values are always strings** in `Tx.fieldValues`, keyed by `FieldDef.key`.
  `date` fields hold an ISO `yyyy-mm-dd`; `number` fields hold a plain decimal string
  (e.g. `"12.5"`); `text`/`select` hold free text. Preset options (dropdowns) apply to
  `select` only. Display: date field values render via the short-date formatter, numbers as-is.
- **Payment source ("Paid from").** An entry's `payer` is optional attribution: a person's
  name, a fund's short/name label, or blank (→ "Unspecified" bucket in Reports). Picking a
  **fund** as the source also writes a linked mirror `dir:'out'` tx into that fund's ledger
  (both rows share a `linkId`; `linkSpaceId` points at the paired space), so `fundBalance`
  (base + in − out) drops automatically. Fund `out` never counts as household spending.
  Back-compat: legacy `payer:'Joint'` maps to the Joint Fund option at display level (the fund
  option value is the fund's `short`, e.g. `'Joint'`) — stored data is not rewritten.
Personal spaces are spaces with `kind: 'personal'`, `group: 'personal'`, id = person id (e.g. `jc`).
Income = sum of `dir:'in'` tx in a personal space for the month (never a fixed number).
Home roll-up "total spent" = sum over spend spaces (Everyday+Housing+Car equivalents: all
`kind:'spend'` shared spaces) for the current month. Fund `dir:'out'` doesn't count as spending.
Selectors in `domain/selectors.ts` are pure `(state, args) => value`; mirror data.js:
`spentOf`, `totalSpent`, `totalBudget`, `spendByPerson`, `spendBySpace`, `topCategories`,
`secondaryFields`, plus `monthLabel`, month filtering, and history.

## State & data flow
- Dexie tables: `spaces`, `txs`, `recurring`, `household` (single row), `settings`.
- `data/repo.ts` exposes async CRUD; Zustand store holds an in-memory snapshot loaded at boot,
  mutations write Dexie then update the snapshot (optimistic). Views read via selectors.
- App boot: no household → `/onboarding`. Otherwise last route / Home.
- Toast state is transient in the store.

## Verification bar for every task
- `npm run build` (tsc + vite) passes with zero errors before a task is "done".
- Screens must match `design/design_handoff_sprout_pwa/screenshots/` closely (layout, spacing,
  color usage, typography hierarchy) in both themes and both layouts where applicable.
- Commit at each milestone on branch `claude/design-branch-setup-o5nq6v`; clear messages.
