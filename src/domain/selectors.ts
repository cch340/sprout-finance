// Pure selectors over an in-memory snapshot. Every function is
// (data, args) => value with no side effects. Month args are ISO 'yyyy-mm'.
// Semantics mirror the prototype's data.js exactly, parameterized by month.

import type { Category, RecurringItem, Snapshot, Space, Tx } from './types';
import { isoMonth, monthShort } from './format';

/**
 * Reserved fallback category. It is virtual — never stored in a space's `cats`
 * nor written as a DB row — and always available for selection/filtering. Any
 * entry whose `cat` isn't one of its space's categories (e.g. after that
 * category was deleted) is treated as "Other".
 */
export const OTHER_CATEGORY: Category = { key: 'other', label: 'Other' };

/** A space's own categories followed by the reserved virtual "Other". */
export function categoriesWithOther(space: Pick<Space, 'cats'>): Category[] {
  return space.cats.some((c) => c.key === OTHER_CATEGORY.key)
    ? space.cats
    : [...space.cats, OTHER_CATEGORY];
}

/** Map a tx's category key to one the space defines, else the "Other" key. */
export function resolveCatKey(space: Pick<Space, 'cats'>, catKey: string): string {
  return space.cats.some((c) => c.key === catKey) ? catKey : OTHER_CATEGORY.key;
}

const inMonth = (t: Tx, month: string): boolean => t.date.slice(0, 7) === month;

/** Bucket label for a tx with no attributed payer in "Who paid" roll-ups. */
export const UNSPECIFIED = 'Unspecified';

/** Payer bucket key for a tx: its payer, or UNSPECIFIED when blank/missing. */
const payerKey = (t: Tx): string => (t.payer && t.payer.trim() ? t.payer : UNSPECIFIED);

const spaceTxs = (spaceId: string, txs: Tx[], month?: string): Tx[] =>
  txs.filter((t) => t.spaceId === spaceId && (month ? inMonth(t, month) : true));

/** Shared spend spaces (the Home/Reports roll-up domain). */
export function spendSpaces(spaces: Space[]): Space[] {
  return spaces.filter((s) => s.group === 'shared' && s.kind === 'spend');
}

/**
 * spentOf — sum of non-income tx for a space in a month. For fund spaces a
 * `dir:'out'` movement is a transfer, not spending, so it contributes 0.
 */
export function spentOf(space: Space, txs: Tx[], month: string): number {
  return spaceTxs(space.id, txs, month)
    .filter((t) => t.dir !== 'in')
    .reduce((sum, t) => sum + (t.dir === 'out' && space.kind === 'fund' ? 0 : t.amount), 0);
}

/** Total spent across all shared spend spaces for the month. */
export function totalSpent(spaces: Space[], txs: Tx[], month: string): number {
  return spendSpaces(spaces).reduce((sum, s) => sum + spentOf(s, txs, month), 0);
}

/** Sum of budgets of shared spend spaces (month-independent). */
export function totalBudget(spaces: Space[]): number {
  return spendSpaces(spaces).reduce((sum, s) => sum + (s.budget ?? 0), 0);
}

/** Spend grouped by payer bucket (Joint / person names) across spend spaces. */
export function spendByPerson(
  spaces: Space[],
  txs: Tx[],
  month: string,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const space of spendSpaces(spaces)) {
    for (const t of spaceTxs(space.id, txs, month)) {
      if (t.dir === 'in') continue;
      const key = payerKey(t);
      out[key] = (out[key] ?? 0) + t.amount;
    }
  }
  return out;
}

export interface SpaceSpend {
  id: string;
  name: string;
  short?: string;
  icon: string;
  value: number;
}

/** Per-space spend totals across shared spend spaces. */
export function spendBySpace(spaces: Space[], txs: Tx[], month: string): SpaceSpend[] {
  return spendSpaces(spaces).map((s) => ({
    id: s.id,
    name: s.name,
    short: s.short,
    icon: s.icon,
    value: spentOf(s, txs, month),
  }));
}

export interface CategorySpend {
  cat: string;
  label: string;
  value: number;
  /** Explicit custom emoji if the category defines one; else undefined. */
  emoji?: string;
}

/** Top spending categories across shared spend spaces (default top 5). */
export function topCategories(
  spaces: Space[],
  txs: Tx[],
  month: string,
  limit = 5,
): CategorySpend[] {
  const agg = new Map<string, CategorySpend>();
  for (const space of spendSpaces(spaces)) {
    const defOf = (cat: string) => space.cats.find((c) => c.key === cat);
    for (const t of spaceTxs(space.id, txs, month)) {
      if (t.dir === 'in') continue;
      const cur = agg.get(t.cat);
      if (cur) cur.value += t.amount;
      else {
        const d = defOf(t.cat);
        agg.set(t.cat, { cat: t.cat, label: d?.label ?? t.cat, value: t.amount, emoji: d?.emoji });
      }
    }
  }
  return [...agg.values()].sort((a, b) => b.value - a.value).slice(0, limit);
}

/** Income = sum of dir:'in' tx in a personal space for the month. */
export function incomeOf(personalSpaceId: string, txs: Tx[], month: string): number {
  return spaceTxs(personalSpaceId, txs, month)
    .filter((t) => t.dir === 'in')
    .reduce((s, t) => s + t.amount, 0);
}

/** Spent = sum of dir:'out' tx in a personal space for the month. */
export function spentOfPersonal(personalSpaceId: string, txs: Tx[], month: string): number {
  return spaceTxs(personalSpaceId, txs, month)
    .filter((t) => t.dir === 'out')
    .reduce((s, t) => s + t.amount, 0);
}

/** Income − spent for a personal space in the month. */
export function leftThisMonth(personalSpaceId: string, txs: Tx[], month: string): number {
  return incomeOf(personalSpaceId, txs, month) - spentOfPersonal(personalSpaceId, txs, month);
}

/**
 * Live fund balance = baseBalance + sum(in) − sum(out) over the whole ledger
 * (all months). A fund's balance is a running figure, not month-scoped.
 */
export function fundBalance(space: Space, txs: Tx[]): number {
  let bal = space.baseBalance ?? 0;
  for (const t of txs) {
    if (t.spaceId !== space.id) continue;
    if (t.dir === 'in') bal += t.amount;
    else bal -= t.amount;
  }
  return bal;
}

export interface HistoryPoint {
  month: string; // yyyy-mm
  label: string; // 'Jan'..'Dec'
  value: number;
}

/**
 * Per-month totalSpent series ending at the reference month (inclusive),
 * oldest first. Uses real tx dates.
 */
export function history(
  spaces: Space[],
  txs: Tx[],
  nMonths: number,
  ref: Date = new Date(),
): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  for (let i = nMonths - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const month = isoMonth(d);
    points.push({ month, label: monthShort(month), value: totalSpent(spaces, txs, month) });
  }
  return points;
}

// ---- range-aware roll-ups (Reports) --------------------------------------
// A "range" is the last N calendar months including the current one. These
// mirror the single-month selectors above but aggregate across the range.

/** Last n calendar months (incl. current), oldest first, as yyyy-mm. */
export function monthsInRange(n: number, ref: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(isoMonth(new Date(ref.getFullYear(), ref.getMonth() - i, 1)));
  }
  return out;
}

const inMonths = (t: Tx, months: Set<string>): boolean => months.has(t.date.slice(0, 7));

/** Sum of non-income tx for a space across a set of months (fund out = 0). */
function spentOfRange(space: Space, txs: Tx[], months: Set<string>): number {
  return txs
    .filter((t) => t.spaceId === space.id && inMonths(t, months) && t.dir !== 'in')
    .reduce((sum, t) => sum + (t.dir === 'out' && space.kind === 'fund' ? 0 : t.amount), 0);
}

/** Per-space spend totals across shared spend spaces over a month range. */
export function spendBySpaceRange(spaces: Space[], txs: Tx[], months: string[]): SpaceSpend[] {
  const set = new Set(months);
  return spendSpaces(spaces).map((s) => ({
    id: s.id, name: s.name, short: s.short, icon: s.icon, value: spentOfRange(s, txs, set),
  }));
}

/** Spend grouped by payer bucket (Joint / person names) over a month range. */
export function spendByPersonRange(
  spaces: Space[],
  txs: Tx[],
  months: string[],
): Record<string, number> {
  const set = new Set(months);
  const out: Record<string, number> = {};
  for (const space of spendSpaces(spaces)) {
    for (const t of txs) {
      if (t.spaceId !== space.id || !inMonths(t, set) || t.dir === 'in') continue;
      const key = payerKey(t);
      out[key] = (out[key] ?? 0) + t.amount;
    }
  }
  return out;
}

/** For one payer, their spend per shared spend space over a range (non-zero only). */
export function payerSpaceBreakdown(
  spaces: Space[],
  txs: Tx[],
  months: string[],
  payer: string,
): SpaceSpend[] {
  const set = new Set(months);
  return spendSpaces(spaces)
    .map((s) => ({
      id: s.id,
      name: s.short ?? s.name,
      short: s.short,
      icon: s.icon,
      value: txs
        .filter((t) => t.spaceId === s.id && inMonths(t, set) && t.dir !== 'in' && payerKey(t) === payer)
        .reduce((a, t) => a + t.amount, 0),
    }))
    .filter((x) => x.value > 0);
}

/** Top spending categories across shared spend spaces over a range. */
export function topCategoriesRange(
  spaces: Space[],
  txs: Tx[],
  months: string[],
  limit = 5,
): CategorySpend[] {
  const set = new Set(months);
  const agg = new Map<string, CategorySpend>();
  for (const space of spendSpaces(spaces)) {
    const defOf = (cat: string) => space.cats.find((c) => c.key === cat);
    for (const t of txs) {
      if (t.spaceId !== space.id || !inMonths(t, set) || t.dir === 'in') continue;
      const cur = agg.get(t.cat);
      if (cur) cur.value += t.amount;
      else {
        const d = defOf(t.cat);
        agg.set(t.cat, { cat: t.cat, label: d?.label ?? t.cat, value: t.amount, emoji: d?.emoji });
      }
    }
  }
  return [...agg.values()].sort((a, b) => b.value - a.value).slice(0, limit);
}

/** Non-primary fields of a space (shown as secondary row detail). */
export function secondaryFields(space: Space) {
  return (space.fields ?? []).filter((f) => !f.primary);
}

/**
 * Resolve a category's explicit custom emoji (if the user picked one) for a tx
 * in a given space. Returns undefined so CategoryIcon falls back to its keyed
 * glyph / neutral tile.
 */
export function catEmojiOf(spaces: Space[], spaceId: string, catKey: string): string | undefined {
  return spaces.find((s) => s.id === spaceId)?.cats.find((c) => c.key === catKey)?.emoji || undefined;
}

/** Number of ledger entries for a space (optionally scoped to a month). */
export function entryCount(spaceId: string, txs: Tx[], month?: string): number {
  return spaceTxs(spaceId, txs, month).length;
}

/** Sum of a space's recurring commitments. */
export function recurringTotal(spaceId: string, recurring: RecurringItem[]): number {
  return recurring.filter((r) => r.spaceId === spaceId).reduce((s, r) => s + r.amount, 0);
}

// ---- snapshot-scoped convenience wrappers --------------------------------
// Thin helpers that read straight off a Snapshot for the common current-month
// case; views can use these or the parameterized forms above.

export const sel = {
  totalSpent: (s: Snapshot, month: string) => totalSpent(s.spaces, s.txs, month),
  totalBudget: (s: Snapshot) => totalBudget(s.spaces),
  spentOf: (s: Snapshot, space: Space, month: string) => spentOf(space, s.txs, month),
  spendByPerson: (s: Snapshot, month: string) => spendByPerson(s.spaces, s.txs, month),
  spendBySpace: (s: Snapshot, month: string) => spendBySpace(s.spaces, s.txs, month),
  topCategories: (s: Snapshot, month: string, limit?: number) =>
    topCategories(s.spaces, s.txs, month, limit),
  incomeOf: (s: Snapshot, id: string, month: string) => incomeOf(id, s.txs, month),
  leftThisMonth: (s: Snapshot, id: string, month: string) => leftThisMonth(id, s.txs, month),
  fundBalance: (s: Snapshot, space: Space) => fundBalance(space, s.txs),
  history: (s: Snapshot, n: number, ref?: Date) => history(s.spaces, s.txs, n, ref),
  recurringTotal: (s: Snapshot, id: string) => recurringTotal(id, s.recurring),
};
