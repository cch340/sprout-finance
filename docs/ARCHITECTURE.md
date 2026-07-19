# Sprout — architecture & conventions

Sprout is a local-first PWA for couples/families tracking shared money in **spaces**.
This doc is the source of truth for implementation conventions. The design spec is
`design/design_handoff_sprout_pwa/README.md` (read it first); reference prototypes live in
`design/design_handoff_sprout_pwa/sprout/` and screenshots in `design/design_handoff_sprout_pwa/screenshots/`.

## Product decisions (agreed defaults)
- **Online-first**: Supabase (Postgres + Auth + Realtime) is the source of truth. All data is
  household-scoped with RLS (members only). Dexie/IndexedDB is kept ONLY as a boot cache of the
  last-loaded snapshot — never a second source of truth.
- **Auth**: email + password (chosen for a 2-person household — reliable in installed iOS PWAs
  where magic links break the standalone context, and works with iCloud keychain autofill).
  No session → Login. Session but no household → Onboarding. Session + household → the app.
- **Households & sharing**: `create_household()` provisions a household + owner membership and a
  6-char invite code; a partner `join_household(code)` joins and immediately loads the shared
  data. A user can belong to **many** households: `my_households()` lists them all (with the
  caller's role) at boot, and an active-household switcher (persisted per device in
  `localStorage`, key `sprout:activeHousehold`) picks which one is live. Households carry an
  optional `name` (renamed via a direct `households` update); the UI falls back to member names when unset.
  `join_household(code)` is usable any time from Settings, not just onboarding. `leave_household(id)`
  is joiners-only (owners can't leave). `reset_household()` is owner-only. Onboarding's first step
  is a choice: start a new household (the 5-step setup, which sets a default name from the partner
  names) or join a partner's with their invite code.
- **No seeding in the running app**: onboarding creates empty ledgers only. The spreadsheet seed
  (`seed-sheet.*`, `scripts/convert-sheet.py`) is retained in the repo for a future, deliberate
  import — nothing in the app calls it.
- **Online-only writes**: a mutation requires connectivity. On network failure the change is not
  applied to the snapshot (no optimistic write) and the user sees "You're offline — change not
  saved". If the initial cloud fetch fails but a cache exists, the app shows cached data behind a
  read-only offline banner and blocks mutations.
- **Real months**: transactions carry ISO dates. Home/Reports compute over the current month;
  history/trend derives from actual data.
- Currency: configurable label, default **RM** (Malaysian Ringgit), formatted `RM 4,182.50`,
  tabular figures, dimmed symbol/decimals (the `Amount` component owns this). Currency lives on
  the `households` row; `settings` holds theme + bill reminders.

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
- **Cloud tables** (all household-scoped, composite PK `(household_id, id)`, TEXT ids in the app's
  existing id style): `households`, `household_members`, `people`, `spaces`, `txs`, `recurring`,
  `settings`. Column mapping to the TS domain types: `spaces.grp ↔ group`,
  `spaces.base_balance ↔ baseBalance`, `spaces.sort_order ↔ sortOrder`, `txs.field_values ↔
  fieldValues`, `txs.link_id/link_space_id ↔ linkId/linkSpaceId` (jsonb ↔ objects). Domain types
  and `domain/selectors.ts` are unchanged — pure functions remain the core.
- **Repository** (`data/remote-repo.ts`, re-exported as `data/repo.ts`): the only module that
  talks to Supabase. Same surface the store already used (`loadSnapshot`, `addTx`/`addTxs`,
  `applyEntryUpdate`, `deleteTxs`, `addSpace`/`updateSpace`/`deleteSpace`, recurring CRUD,
  `saveHousehold`, `saveSettings`, `resetAll`, `createHousehold`/`joinHousehold`/`myHouseholds`/
  `leaveHousehold`/`renameHousehold`, `subscribeRealtime`, `newId`). The active `household_id` is
  a module-level value set at boot and re-pointed by the switcher (`setCurrentHousehold`).
  Entry + fund-mirror ops are single calls (`.insert([a,b])`, `.delete().in('id',[…])`).
- **Store** (`store/useAppStore.ts`): holds the in-memory snapshot. `boot()` — paint the Dexie
  cache instantly (with a `syncing` flag) → `getSession()` → `my_households()` → `loadHousehold()`
  (fetch snapshot, persist to cache, start realtime). Mutations write the cloud first; only on
  success do they update the snapshot and re-persist the cache; on failure they revert (skip the
  update) and toast offline. Gate flags `authed` / `hasHousehold` / `offline` drive routing in
  `App.tsx`.
- **Boot cache** (`data/db.ts`): Dexie v2 is a single `cache` row storing the whole snapshot.
- **Realtime partner sync**: one `supabase.channel` per session subscribes to `postgres_changes`
  on `txs`, `spaces`, `recurring`, `settings`, `people` filtered `household_id=eq.<hid>`. Each
  event schedules a 200ms-debounced refetch of just that table, which is spliced into the
  snapshot (idempotent — no skip-own-echo needed). Because a backgrounded iOS PWA suspends the
  WebSocket and missed events are not replayed on resume, `resync()` (wired to `visibilitychange`
  when the doc becomes visible and to the `online` event) does a throttled full-snapshot refetch
  and realtime resubscribe to recover any changes that arrived while the socket was dead.
- App boot routing: no session → Login; session + no household → Onboarding; else the app.
- Toast state is transient in the store.

## Verification bar for every task
- `npm run build` (tsc + vite) passes with zero errors before a task is "done".
- Screens must match `design/design_handoff_sprout_pwa/screenshots/` closely (layout, spacing,
  color usage, typography hierarchy) in both themes and both layouts where applicable.
- Commit at each milestone on branch `claude/design-branch-setup-o5nq6v`; clear messages.
