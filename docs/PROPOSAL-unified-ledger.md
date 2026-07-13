# Proposal: unified ledger spaces (merge `spend` + `fund`)

Status: **deferred — evaluating current implementation first** (2026-07-13).
Owner: user (JC). Revisit after real-world use of the current spend/fund split;
cheapest implementation window is before large-scale data seeding.

## The idea (user's framing)

Every space today is `spend` | `fund` | `invest`. In practice a space could be one
two-sided ledger: **expense entries group under the spend side, income entries group
under the fund side**, with a fixed recurring money breakdown for both — e.g.
"monthly contribution" (in) and "monthly commitment" (out). A user who wants only
spend or only fund behavior simply never uses the other side.

## Why it's sound

- **Personal spaces already work this way** — income `in` + spending `out` in one
  ledger, "left this month" = the difference. The Joint Fund also already receives
  `out` rows via "Paid from" mirrors. The merge admits every space is an account with
  a two-sided ledger; `spend` vs `fund` are lenses, not kinds.
- Refunds become natural (`in` entry in a spending context).
- One recurring model with direction covers both "commitments" and "contributions".
- Spend-only / fund-only degenerate cleanly if features are per-space toggles.

## Sketch of the v2 model

- `kind`: collapse `spend`/`fund` → one ledger kind; keep `invest` (and `personal`
  becomes near-identical to the merged kind).
- Per-space feature toggles replace the kind distinction:
  - **budget** (on → spend view: budget bar, counts in "total spent")
  - **balance tracking** (on → balance hero, `baseBalance` applies)
  - **payment source** (on → listed in the Add-entry "Paid from" dropdown)
- `RecurringItem` gains `dir: 'in' | 'out'` → Recurring tab shows two sections,
  Contributions and Commitments, with separate totals.
- Aggregation rules become explicit (see downside 2).

## Possible downsides (the reason to prototype-first)

1. **Hero/view ambiguity.** Kind currently *declares* what the space detail leads
   with (budget progress vs balance). Merged, the UI must be told (toggles) or must
   infer — and inference has edge cases (one stray income entry must not flip
   Everyday's layout to a balance view). The toggles fix this but re-introduce the
   spend/fund distinction at feature granularity; the merge relocates the concept,
   it does not delete it.
2. **"Total spent" needs a new explicit rule — sharpest edge.** Today: spend-space
   `out` counts as household spending; fund `out` never does (transfer, not
   consumption). That asymmetry is exactly what stops double-counting for
   "Paid from fund" mirrors. Merged rule proposal: *mirror/linked rows (`linkId`)
   never count in any roll-up; unlinked `out` counts as spending only in budgeted
   spaces.* Getting this wrong silently double-counts Home's headline number.
3. **Income double-counting.** Salary `in` (personal) → contribution `out`
   (personal) + `in` (joint) is the same ringgit twice if any report ever sums
   "all income". Safe today only because income is computed per-personal-space.
   Same cure as (2): transfer-linked pairs excluded from aggregates.
4. **"Paid from" dropdown scope.** If every space can hold a balance, every space
   is a candidate payment source → dropdown bloat. Needs the "payment source"
   toggle; default off except funds.
5. **Refund semantics.** Does the budget bar show gross spending or net-of-refunds?
   Decide once, document.
6. **Migration.** Cheap right now (fresh cloud DB, seeding not started): a kind
   collapse + check-constraint change + defaulting toggles from old kinds
   (spend → budget on; fund → balance+payment-source on). Cost grows with data
   and with any future features that branch on `kind`.

## Decision triggers for revisiting

While using the current implementation, watch for these; each is evidence the
merge is worth it:
- Wanting to record income/refunds in a spend space (e.g. cashback into Everyday).
- Wanting a budget on the Joint Fund's outflows.
- Recurring feeling split-brained (commitments live on spend spaces, contributions
  on funds, but conceptually one monthly breakdown).
- Confusion over where an entry "should" go because the space type forbids a side.

If none of these bite after a month of real use, the current model is probably
right and this proposal can be closed.
