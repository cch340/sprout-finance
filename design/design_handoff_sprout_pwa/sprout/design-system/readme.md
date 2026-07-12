# Sprout — Design System

**Sprout** is a warm, friendly financial-tracking product for couples and families — a PWA that feels native on both phone and desktop. It grew out of a real Google Sheet a couple (JC & CH) used to track shared money: a Joint Fund, monthly commitments, per-person income & expenses, a car loan, and a detailed expense log. Sprout turns that spreadsheet into something calm and human.

> **Name origin:** *Sprout* — money you tend and grow together. The mark is three rising bars whose tallest sprouts two leaves (growth + finance in one glyph).

---

## Sources

This system was designed **from scratch** — there was no prior codebase, Figma, or brand. The single concrete input was the couple's spreadsheet, which grounded the domain model, vocabulary, and sample content:

- **Reference spreadsheet:** `uploads/sheet_data-1783830820459.xlsx` (Google Sheets export). Sheets: *Joint Fund, Money breakdown, AIA Investment, Car, CH (Personal), JC (Personal), TreeO, Expenses*. Currency is **Malaysian Ringgit (RM)**. Real categories drawn from it: House (installment + utility), Food/Grocery, Car (Myvi & Alza loans, road tax, insurance), Baby (Leo), Bills (electric ⚡ / water 💧), plus subscriptions (YouTube Premium, Apple One, Google AI Pro), PTPTN, insurance (Allianz/AIA), petrol, internet (Time Fibre). Vendors/locations: Shopee, Taobao, Aeon, Lotus, Jaya Grocer, Billion, Gurney Plaza, etc.

If you have access to that file, read it for authentic sample data. All names (JC, CH, Leo) and figures used in specimens are drawn from it.

---

## Content fundamentals

**Voice:** warm, plain, and encouraging — a calm friend who's good with money, never a bank or a scold.

- **Person:** second person, conversational. "You've got RM 818 left for June." "Nice — electric bill's settled."
- **Case:** sentence case everywhere (buttons, headings, labels). Never Title Case UI, never ALL-CAPS except tiny eyebrow labels (letter-spaced).
- **Money is neutral, not scary.** Expenses render in calm ink, not red. Red is reserved strictly for *over budget*. We never say "You overspent again."
- **Concise & concrete.** "Add expense", not "Submit transaction entry". Prefer the shortest true phrase.
- **Emoji:** used sparingly and purposefully as **category markers** (🏠 🛒 🚗 👶 ⚡ 💧 🧾 🛍️), mirroring how the couple already tags their sheet. Not used decoratively in body copy.
- **Numbers:** always `RM` prefix, tabular figures, thousands separators (`RM 4,182.50`). Whole ringgit where cents don't matter.
- **Tone examples** — see the *Voice & tone* Brand card.

---

## Visual foundations

The look is **"Meadow"**: cool cream paper, warm green-tinted neutrals, one confident sage accent. Soft but not childish; Apple/Google-simple.

- **Color:** mostly neutral + a single **sage** accent (`--sage-500 #4F8A6B`). Neutrals are warm grays with a faint green tint so nothing feels clinical. Semantic signals: income = fresh green, danger/over-budget = warm terracotta-red, warning = honey amber, info = muted blue. Category tints are pale, low-saturation washes.
- **Typography:** one humanist typeface — **Figtree** — across UI and display. Warm, highly legible, friendly without being round-and-cute. Amounts use `tabular-nums` with a dimmed currency symbol and decimals so figures align and the big number reads first.
- **Backgrounds:** flat cream canvas (`--surface-canvas`), white cards. **No gradients, no photographic backgrounds, no textures or patterns.** Depth comes from soft shadows, not color washes. (The one exception: a thin multi-stop *bar* on the total card showing category proportions — a data device, not decoration.)
- **Corners:** soft. Inputs/buttons 12px, cards 16px, sheets/large cards 20px, modals 28px; pills fully round. Nothing sharp.
- **Shadows:** soft, low-spread, green-tinted ink at low alpha (`--shadow-color: 37 41 31`). Cards use `sm`; hover lifts to `md`; modals `xl`. No hard or dark drop shadows.
- **Borders:** 1px hairlines in `--border-subtle`; slightly stronger on inputs (`--border-strong`). Focus is a 3px soft sage ring (`--shadow-focus`).
- **Animation:** gentle and quick. Standard ease `cubic-bezier(0.2,0,0.1,1)`; a soft `--ease-out` for rises/settles; a restrained `--ease-spring` for playful confirmations only (toggles, ticking a bill off, adding money). Durations 140–340ms. No looping/decorative motion. Honors `prefers-reduced-motion`.
- **Hover states:** buttons darken by one step (`--accent-hover`); ghost/secondary get a faint surface fill; cards lift 2px. **Press states:** scale down (0.98 for buttons, 0.92 for icon buttons) — a gentle squeeze, never a color flash.
- **Transparency & blur:** used only for the modal scrim (green ink at 42% + 3px blur). No frosted-glass panels elsewhere.
- **Imagery vibe:** the brand is illustration-light. Where a person/account is needed we use **initials avatars** with deterministic soft tints, not photos. Category glyphs are emoji in tinted tiles.
- **Layout:** generous whitespace, single clear focal number per screen, content in a centered column (mobile) or sidebar + content (desktop). Fixed bottom tab bar on mobile; fixed left sidebar on desktop.
- **Dark mode:** defined (`[data-theme="dark"]`) with deep green-black surfaces; light is the primary/default mode.

---

## Iconography

- **UI icons:** [Lucide](https://lucide.dev) (ISC license) — clean, rounded-stroke line icons that match the friendly, unfussy tone. A curated subset is **embedded directly in the `Icon` component** (`components/foundation/Icon.jsx`), so the bundle is self-contained with no CDN dependency. Default 20px, 2px stroke, round caps/joins, `currentColor`. Add glyphs by pasting a Lucide icon's inner SVG into the `PATHS` map.
- **Category markers:** **emoji**, not icons — 🏠 🛒 🚗 👶 ⚡ 💧 🧾 🛍️ 💊 🌱 💵 — rendered in soft tinted tiles via `CategoryIcon`. This deliberately echoes the ⚡💧 convention already in the couple's sheet, keeping it warm and instantly legible.
- **No hand-drawn SVG illustrations** in the system beyond the logo mark. Keep it clean.
- **Substitution flag:** Lucide is a substitute chosen for the brand (there was no source icon set). If you adopt a different icon language later, swap the `PATHS` map and update this section.

---

## Component index

Reusable primitives live in `components/<group>/`. Each is a `.jsx` with a sibling `.d.ts` (props), `.prompt.md` (usage), and one `@dsCard` HTML per group. Import from the bundle namespace `KiraDesignSystem_c378eb` (see any card, or run the design-system check).

**foundation/**
- `Icon` — curated, self-contained Lucide glyph set.

**forms/**
- `Button` — primary / soft / secondary / ghost / danger; sizes, icons, loading. *(Starting point)*
- `IconButton` — square icon-only button (+ round variant).
- `Input` — labelled field with icon / `prefix="RM"` / suffix / hint / error.
- `Textarea` — multi-line notes field.
- `Select` — styled native select with chevron.
- `Checkbox` — with optional description.
- `Radio` — single-choice, with description.
- `Switch` — on/off toggle; bare or as a settings row.
- `SegmentedControl` — iOS-style pill switch (time ranges, person filter).

**data-display/**
- `Amount` — the canonical RM money renderer (tabular, dimmed symbol/decimals; neutral/in/out/over).
- `CategoryIcon` — emoji-in-tinted-tile category marker.
- `Card` — the soft surface everything sits on. *(Starting point)*
- `StatCard` — headline metric tile with trend (sage `accent` hero variant). *(Starting point)*
- `Badge` — status pill (Paid / Due / Over budget / Recurring).
- `Tag` — selectable / removable filter chip.
- `Avatar` — initials or photo for JC / CH / Leo / Joint.
- `ProgressBar` — budget/commitment progress (auto-reddens over 100%; segmented mode).
- `ListRow` — the transaction/setting row that fills most screens. *(Starting point)*

**navigation/**
- `Tabs` — underline tabs with optional count pills and inline panels.

**feedback/**
- `Dialog` — centered modal (scrim + soft rise). Add-expense, confirmations.
- `Toast` — transient dark confirmation card (with action / dismiss).
- `Tooltip` — short hover/focus label.

### Intentional additions

Because there was no source component inventory, this is an authored standard set. Three additions are Sprout-specific rather than generic:
- **`Amount`** — money formatting is the single most repeated need in this product; centralizing it guarantees consistent RM formatting and semantics.
- **`CategoryIcon`** — encodes the emoji category convention from the couple's sheet.
- **`Icon`** — a wrapper over the embedded Lucide set (needed since there was no source glyph system).

---

## Product model — Spaces

Sprout does **not** use one global expense list. Money is organized into separate **spaces**, mirroring the couple's spreadsheet tabs. Each space is its own ledger with its **own scoped categories**.

- **Shared spaces:** Everyday Expenses · Housing (TreeO) · Car · Investment (AIA) · Joint Fund
- **Personal spaces:** JC · CH (each tracks income + personal spending)

**Categories are scoped to their space**, and each space also defines its **own generic extra-info fields** — Everyday has Store/Vendor + Location, Housing has Provider, Car has Workshop, etc. Fields can carry **preset values**, which render as a **dropdown** at entry time (with an "Other…" free-text escape hatch). The Add-entry flow picks a **space first, then a category + fields that belong to it**. Spaces, categories, fields and their presets are all **user-manageable** (New space + per-space Settings). `CategoryIcon` holds the union of all category glyphs; the *scoping* lives in the app data layer (`ui_kits/*/data.js`), not the component.

The **Home / Overview** is a roll-up across everything: total spent (Everyday + Housing + Car), Joint Fund balance, and investment value. Balances ("money you have") render in **sage**, not black; spending stays calm ink.

## UI kits

Full-screen recreations composing the primitives above. See each kit's `README.md`.

- `ui_kits/mobile/` — the PWA on a phone: **Home** roll-up, **Spaces** launcher, **Space detail** (scoped categories + fields), **Personal** (JC/CH), **Reports** (range + drill-downs), a scoped **Add-entry** flow, and a first-run **Onboarding** (`onboarding.html`).
- `ui_kits/desktop/` — the PWA on desktop: sidebar of spaces (Shared / Personal) + roll-up overview and scoped space views.
- `ui_kits/marketing/` — the product landing page.

---

## Root manifest

- `styles.css` — **the** entry point consumers link. `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadow.css`, `motion.css`, `fonts.css`.
- `components/` — reusable primitives (see index above).
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `ui_kits/` — full-screen product recreations.
- `assets/` — `sprout-mark.svg`, `sprout-mark-white.svg`, `sprout-icon.svg`.
- `SKILL.md` — makes this system usable as a downloadable Agent Skill.
- Generated (do not edit): `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`.

---

## Caveats & substitutions

- **Fonts are CDN-linked, not self-hosted.** `tokens/fonts.css` pulls **Figtree** + **Spline Sans Mono** from Google Fonts. For a production offline-capable PWA, download the `.woff2` files into `assets/fonts/` and replace the `@import` with local `@font-face` rules.
- **Icons are Lucide** — a brand-fit substitution, since no source icon set existed.
- **No photographic brand imagery** exists yet; the system is illustration-light by design.
