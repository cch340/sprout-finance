# Handoff: Sprout — shared-money PWA (mobile + desktop)

## Overview
Sprout is a warm, calm financial-tracking PWA for couples/families. Money is organized
into separate **spaces** (each its own ledger with its own scoped categories and fields),
with a roll-up **Home/Overview** across everything. This package contains two high-fidelity,
fully-interactive prototypes:

- **Mobile** (`Sprout Mobile.dc.html`) — the phone PWA (412px-wide app surface).
- **Desktop** (`Sprout Desktop.dc.html`) — the same product on a wide screen (sidebar + main).

Both are built entirely on the **Sprout / Kira design system** (a real React component
library + design tokens). Sample data is grounded in a real couple's spreadsheet
(JC, CH, baby Leo; currency **Malaysian Ringgit — RM**; June 2026).

## About the design files
The files in this bundle are **design references created in HTML/React** — interactive
prototypes that show the intended look and behavior. They are **not** production code to
ship as-is. The task is to **recreate these designs in your target codebase** using its
established framework, patterns, and libraries. If no codebase exists yet, Sprout is a PWA,
so a React + Vite (or Next.js) app is the natural choice — but any framework is fine.

Crucially, the prototype composes an existing **design-system component library** (buttons,
cards, inputs, amount formatter, category icons, etc.). In production you should consume that
same library (or its equivalent in your stack) rather than re-styling raw HTML. See
**Design System** below.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, shadows, motion, and
interactions are all intentional and come from the design-system tokens. Recreate the UI
faithfully. Exact values live in the design-system token files (see Design Tokens).

## Design System (read this first)
Every visual is a design-system primitive — do not hand-roll them. The library namespace in
the prototype is `KiraDesignSystem_c378eb`. Components used:

- **Layout/containers:** `Card`, `StatCard`, `ListRow`, `Dialog`
- **Money & data:** `Amount` (canonical RM formatter — tabular figures, dimmed symbol/decimals,
  `kind` = neutral/in/out/over, `showSign`), `CategoryIcon` (emoji-in-tinted-tile),
  `ProgressBar`, `Badge`, `Avatar`, `Tag`
- **Forms:** `Button`, `IconButton`, `Input` (supports `prefix="RM"`), `Select`, `Switch`,
  `SegmentedControl`, `Textarea`, `Checkbox`, `Radio`
- **Nav/feedback:** `Tabs`, `Toast`, `Tooltip`, `Icon` (curated Lucide set)

**Voice & tone:** warm, plain, second person, sentence case everywhere. Money is neutral,
not scary — expenses render in calm ink, **red is reserved strictly for over-budget**.
Balances ("money you have") render in **sage**, not black. Emoji are used only as category
markers (🏠 🛒 🚗 👶 ⚡ 💧 🧾 🛍️).

## Product model — Spaces
There is **no** single global expense list. Money lives in separate **spaces**:

- **Shared spaces:** Everyday Expenses, Housing (TreeO), Car, Investment (AIA), Joint Fund
- **Personal spaces:** JC, CH (each tracks income + personal spending)

Each space owns:
- its **scoped categories** (Everyday: Grocery/Meals/Baby/Shopping/Other; Housing:
  Installment/Electric/Water/Internet/…; Car: Installment/Road tax/Maintenance; etc.)
- its own **generic fields** — extra info shown at entry time. A field with preset values
  renders as a dropdown (+ an "Other…" free-text escape). Examples: Everyday →
  Store/Vendor (text, primary) + Location (dropdown); Housing → Bill/Item + Provider;
  Car → Item + Workshop/Station; Investment → Item + Platform.
- optional **budget** (spend spaces), **recurring commitments**, **balance** (fund),
  or **value** (investment).

Space "kinds": `spend` | `fund` | `invest`. The `primary` field becomes each row's title.
Spaces, categories, and fields are all meant to be **user-configurable**.

The **Home/Overview** roll-up = total spent across Everyday + Housing + Car, plus Joint Fund
balance and Investment value.

---

## Screens / Views

### MOBILE (app surface 412px wide, ~868px tall; rounded 40px; fixed bottom tab bar)

**Chrome:** a slim top utility bar (left: "start menu" icon `menu`; right: theme toggle
`moon`/`sun`), a scrolling content area (padding 4px 20px 120px), and a fixed **bottom tab bar**
(height 84px, translucent `surface-card` at 88% + 12px blur, top hairline). Tab bar order:
**Home · Spaces · ＋(FAB) · Reports · Settings** — the FAB is a 58px sage pill, centered,
raised −18px, shadow `0 6px 18px rgb(79 138 107 / .42)`, presses to scale .92.

1. **Start menu / Launcher** (prototype-only entry chooser)
   - Sprout icon + "Prototype · mobile", a theme toggle, "Where to start?" heading, and a list
     of `Card`+`ListRow` shortcuts (onboarding, Home, Spaces, Reports, Personal, Add entry).
   - *This launcher is a prototype convenience — omit it in production; the real app opens to
     onboarding (first run) or Home.*

2. **Home** — roll-up. Greeting ("Good evening, JC 🌿") + month + overlapping `Avatar`s
   (JC/CH/Leo). **Hero total card**: full sage (`--accent`) background, white text, label
   "Total spent · Everyday + Housing + Car", `Amount` size `hero`, "RM X left of RM Y budget",
   and a thin multi-segment proportion bar (Expenses/Housing/Car % — a data device, the one
   allowed multi-stop bar). Then two `StatCard`s (Joint Fund balance, Investment · AIA value)
   with sage figures. Then a **Spaces** list (`Card`+`ListRow`, each with an icon tile,
   name, entry count, `Amount`, budget meta, chevron → Space detail). Then **Recent activity**
   (`Card` of `ListRow`s with `CategoryIcon`, vendor, note·payer, amount, date).

3. **Spaces** — launcher. "Spaces" H1 + `Button variant="soft" iconStart="plus"` "New space".
   Grouped **Shared** (Card of ListRows: icon tile, name, sub/entry-count, Amount, and for
   budgeted spaces a % + mini progress bar that reddens over budget) and **Personal** (JC/CH
   with `Avatar`, "Income RM …" subtitle, spent amount).

4. **Space detail** — header row (back `IconButton`, space name, settings `IconButton`).
   **Hero**: spend spaces = white card, sage `Amount`, `ProgressBar` + "% of RM Y budget · Edit"
   + "RM Z left/over" (over = `--money-over`); fund/invest = sage card, white `Amount`.
   If the space has recurring items, a `SegmentedControl` toggles **Activity | Recurring**
   (fund label = "Contributions"). **Activity**: horizontal category filter `Tag`s (with an
   Edit mode to add/remove), then a `Card` of transaction `ListRow`s (CategoryIcon, vendor,
   subtitle from secondary fields · note · payer, `Amount`, and a `Badge` for status
   Paid/Due). **Recurring**: list of fixed monthly items + editable, with a total.
   Budget is editable via a `Dialog`.

5. **Personal** (JC / CH) — avatar + "X's money", a JC↔CH `SegmentedControl`, a sage hero
   "Left this month" = income − spent (Income RM …, Spent RM …), then a `Card` listing **all**
   transactions — income entries render green with `+` (`Amount kind="in" showSign`), expenses
   neutral. **Income is the sum of income-direction entries** (not a fixed number), so
   commission / OT / side income can be added.

6. **Reports** — "Reports" H1 + a 3M/6M `SegmentedControl` (re-slices trend + average).
   **Spending trend** bar chart (current month = sage `--accent`, others `--sage-200`).
   **By space** progress bars. **Who paid** — a proportion bar (JC `--sage-500`,
   CH `--sage-300`, Joint `--sage-700`) + tappable rows that expand a per-person breakdown by
   space. **Top categories** — CategoryIcon + label + mini bar + amount.

7. **Settings** — "Settings" H1. Household `Card` (JC/CH/Leo avatars, "JC & CH · Household").
   **Appearance**: `Switch` "Dark mode" (wired to the app theme). **Preferences**: Currency
   row (RM · Ringgit), `Switch` "Bill reminders". **Spaces**: "Manage spaces" → Spaces,
   "New space" → dialog. Footer "Sprout · prototype v1".

8. **Onboarding** (first run) — 5 steps with progress dots + back nav:
   welcome (logo, "Track money, together.", Get started) → household (name your two people,
   avatars update live) → choose spaces (toggle cards) → per-space budgets (RM inputs + total)
   → done ("You're all set, JC! 🌿", Open Sprout). `onDone` enters the app at Home.

9. **Dialogs** — **Add entry**, **New space**, **Space settings** (see below).

### DESKTOP (1280×820; grid: 264px sidebar + fluid main)

- **Sidebar** (`--surface-card`, right hairline): brand (mark + "Sprout"); nav **Overview**,
  **Reports**; **Shared** spaces list + "New space"; **Personal** (JC/CH); a footer with a
  "Start menu" button + theme toggle, and the household account row. Active item =
  `--accent-soft` bg / `--accent-soft-fg` text.
- **Main** = a `topbar` (eyebrow + H1 title on the left; avatars, search, bell, and a primary
  `Button iconStart="plus"` "Add entry" on the right) over a scrolling area.
- **Overview** — a `row-3` grid: wide sage hero (span 2, `Amount` ~54px, proportion bar with
  per-space RM labels) + a column of two `StatCard`s (Joint Fund, Investment). Then a `row-2`:
  **Recent · Everyday Expenses** and **Bills & installments** (with status `Badge`s).
- **Space view** — a `row-2`: sage hero (balance/spend, budget progress + edit) and, for
  personal spaces, an **Income** `StatCard` (dynamic sum of income entries). Then category
  `Tag`s + Activity/Recurring (same model as mobile). Personal views list **all** tx
  (income green +).
- **Reports** — full-width desktop layout: topbar with 3M/6M toggle; full-width **Spending
  trend** (bar height area 200px); a `row-2` of **By space** | **Who paid** (expandable);
  then full-width **Top categories**.

---

## Interactions & behavior
- **Navigation:** tab bar / sidebar switch top-level views; Space rows open Space detail;
  back button returns to Spaces. Content scroll resets to top on navigation.
- **Add entry (core flow):** open via FAB (mobile) / "Add entry" (desktop). Dialog order:
  1) **Space** dropdown (all spend spaces + "JC · Personal" / "CH · Personal");
  2) **Expense | Income** `SegmentedControl` (direction — Income records as profit, green +);
  3) **Amount** (`Input prefix="RM"`, `inputmode="decimal"`) beside a `CategoryIcon`;
  4) **Category** (scoped to the chosen space);
  5) the space's **generic fields** (text, or a preset dropdown with "Other…");
  6) **Paid by** (`SegmentedControl` Joint/JC/CH — hidden for personal spaces);
  7) **Note**; 8) **Recurring monthly** `Switch`.
  On save: the entry is prepended to that space's ledger, all roll-ups recompute, the dialog
  closes, and a `Toast` confirms ("Entry added" / "Income added · RM … · vendor").
  *(Note: the amount field is intentionally NOT auto-focused — auto-focus scrolls the top of
  the form out of view.)*
- **New space:** name, icon picker (`IconButton` grid), type (Spending/Fund/Investment),
  optional budget → Toast.
- **Space settings:** rename; add/remove **categories** (`Tag`s); add/remove **fields**;
  manage each field's **preset values** (adding presets turns a field into a dropdown).
- **Reports:** range toggle re-slices; who-paid rows expand/collapse a per-person breakdown.
- **Theme:** light default; a `[data-theme="dark"]` toggle (top bar + Settings on mobile,
  sidebar on desktop) swaps to a deep green-black palette. Honor `prefers-reduced-motion`.
- **Motion:** gentle, quick (140–340ms). Standard ease `cubic-bezier(0.2,0,0.1,1)`;
  `--ease-spring` only for playful confirmations (toggles, ticking a bill, adding money).
  Buttons darken one step on hover; cards lift 2px → shadow `md`; buttons press to scale .98,
  icon buttons .92.

## State management
Top-level app state (per platform):
- `route` (mobile: menu | onboarding | app), `view`/`active` (current screen/space),
  `spaceId`, `who` (jc/ch), `dark` (theme).
- Dialog flags: `addOpen` + `addSpace`, `newSpaceOpen`, `settingsSpace`, plus a transient
  `toast`.
- A data version counter bumped after any mutation so views re-read the ledger.

**Data model** (see `sprout/src/data.js` — `window.SproutData`):
- `spaces[]` (id, name, group, icon, kind, cats[], fields[], budget/balance/value,
  recurring[], tx[]), `personal.{jc,ch}` (income tx + spending tx), `history[]` (6-mo trend).
- Derived: `spentOf(space)`, `totalSpent` (live getter over Everyday+Housing+Car),
  `budget`, `spendByPerson()`, `spendBySpace()`, `topCategories()`, `secondaryFields()`.
- Mutation: `addTx(entry)` — resolves the target space/person, builds a tx (honoring
  `dir` = in/out and `payer`), and prepends it. In production this becomes your create-entry
  API + optimistic update.

Transaction shape: `{ id, vendor(title), <field values>, note, cat, amount, date, payer, dir }`
(`dir: 'in'` = income/green +; absent/`'out'` = expense/neutral).

## Design tokens
Full source: `sprout/design-system/tokens/*.css` (colors, typography, spacing, radius, shadow,
motion, fonts) — link `sprout/design-system/styles.css` to get them all. Key values:

- **Sage (accent):** 500 `#4F8A6B` (primary), 600 `#3F7357` (hover), 700 `#345E48` (active),
  400 `#6FAE8A`, 300 `#97BCA8`, 200 `#BCD3C6`, 100 `#DDE9E1`, soft-fg `#345E48`.
- **Neutrals (warm, green-tinted):** canvas `#F4F5F1`, card `#FFFFFF`, sunken `#F7F8F4`,
  border-subtle `#E2E6DD`, border-strong `#CDD2C7`, muted text `#858B7C`, ink `#25291F`.
- **Semantic:** income `#2E8B60`; danger / over-budget `#C7503F`; warning `#D98A3D`;
  info `#3E7CA8`. Money: in = income green, out = ink (neutral, never red), over = danger.
- **Category tints:** house `#E9F0EA`/`#4F8A6B`, food `#FBF1DF`/`#B26E28`, car
  `#E9F0F5`/`#3E7CA8`, baby `#F5EBF0`/`#A05780`, bills `#FBEDEA`/`#C7503F`,
  shopping `#EFEDF6`/`#6C63A6`.
- **Type:** one family — **Figtree** (UI + display); amounts use tabular figures. Scale via
  `--font-display/h1/h2/h3/label/body/caption` (see typography.css). Sentence case.
- **Radius:** inputs/buttons 12px, cards 16px, sheets/large 20px, modals 28px, pills full.
- **Shadow:** soft, low-spread, green-tinted ink (`--shadow-color: 37 41 31`) — cards `sm`,
  hover `md`, modals `xl`. No hard/dark shadows.
- **Dark mode:** `[data-theme="dark"]` overrides (canvas `#161A14`, card `#1E241B`,
  accent → `--sage-400`, etc.) — see colors.css.

**No gradients, no photographic/textured backgrounds** (the only multi-stop bar is the
proportion device on the total card). Depth = soft shadows, not color washes.

## Assets
- `sprout/assets/sprout-mark.svg`, `sprout-mark-white.svg`, `sprout-icon.svg` — the Sprout
  logo mark (three rising bars, tallest sprouts two leaves).
- **Icons:** Lucide (ISC) — a curated subset is embedded in the design system's `Icon`
  component (no CDN). Names used: home, wallet, pie-chart, bar-chart, receipt, repeat,
  trending-up, user, plus, menu, settings, moon, sun, banknote, tag, chevron-*, arrow-*, etc.
- **Category markers are emoji**, rendered in tinted tiles via `CategoryIcon`.
- **Avatars are initials** with deterministic soft tints (no photos).
- **Fonts:** Figtree (+ Spline Sans Mono) via Google Fonts in `tokens/fonts.css`; self-host
  for a real offline PWA.

## Files in this bundle
- `Sprout Mobile.dc.html` — mobile prototype entry (loads the DS bundle + mounts the app).
- `Sprout Desktop.dc.html` — desktop prototype entry.
- `sprout/mobile-app.jsx`, `sprout/desktop-app.jsx` — the assembled app bundles
  (screens + routing/shell orchestrator). **These are the primary behavior reference.**
- `sprout/src/*.jsx` — the individual screen sources (Home, Spaces, SpaceDetail, Personal,
  AddExpense, Reports, Manage, Onboarding, Dashboard) and `data.js` (the data model).
- `sprout/assets/*` — logo SVGs.
- `sprout/design-system/` — the Sprout / Kira design system this prototype consumes:
  `styles.css`, `tokens/*.css`, `_ds_bundle.js` (the compiled React component library),
  and `_ds_manifest.json`. In production, consume this library (or port it to your stack).
- `screenshots/` — reference captures. Mobile (`01-08`): launcher, Home, Spaces, Space
  detail, Reports, Settings, Add-entry dialog, Onboarding (household step). Desktop
  (`01-03`): Overview, Space view, Reports.

### How to run the prototype locally
Serve the folder statically (e.g. `npx serve`) and open either `.dc.html`. They load the
design-system bundle from `sprout/design-system/` and mount the app bundle from `sprout/`.
(The prototypes were authored in a live design environment; served statically they render the
same. If a `.dc.html` expects a runtime that isn't present, treat the `sprout/*.jsx` files as
the source of truth for layout + behavior.)
