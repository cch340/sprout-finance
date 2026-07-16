import { describe, expect, it } from 'vitest';
import { buildSeed } from '../data/seed-demo';
import { isoMonth } from './format';
import {
  categoriesWithOther, fundBalance, history, incomeOf, leftThisMonth, monthsInRange,
  OTHER_CATEGORY, payerSpaceBreakdown, reorderedSortValues, resolveCatKey, spendByPerson,
  spendByPersonRange, spendBySpaceRange, spentOf, spentOfPersonal, topCategories,
  topCategoriesRange, totalBudget, totalSpent, UNSPECIFIED,
} from './selectors';
import { migrateLegacyCategory } from './legacy-emoji';
import type { Category, Space, Tx } from './types';

// Pin the reference month so the demo maps deterministically.
const REF = new Date(2026, 6, 12); // July 2026 (month index 6)
const MONTH = isoMonth(REF); // '2026-07'
const snap = buildSeed(REF);
const spaceById = (id: string): Space => snap.spaces.find((s) => s.id === id)!;

describe('spentOf', () => {
  it('sums non-income tx for a spend space', () => {
    expect(spentOf(spaceById('expenses'), snap.txs, MONTH)).toBeCloseTo(951.3, 2);
    expect(spentOf(spaceById('housing'), snap.txs, MONTH)).toBeCloseTo(1977.4, 2);
    expect(spentOf(spaceById('car'), snap.txs, MONTH)).toBeCloseTo(780, 2);
  });

  it('excludes fund dir:out movements from spending', () => {
    // Joint fund has in 3000 and out 1714.2 this month — spentOf must be 0.
    expect(spentOf(spaceById('joint'), snap.txs, MONTH)).toBe(0);
  });

  it('totals across every month when the month arg is omitted ("All time")', () => {
    const space = spaceById('expenses');
    const months = [
      ...new Set(snap.txs.filter((t) => t.spaceId === 'expenses').map((t) => t.date.slice(0, 7))),
    ];
    const perMonth = months.reduce((s, m) => s + spentOf(space, snap.txs, m), 0);
    // Omitting month sums the whole history and is never below a single month.
    expect(spentOf(space, snap.txs)).toBeCloseTo(perMonth, 2);
    expect(spentOf(space, snap.txs)).toBeGreaterThanOrEqual(spentOf(space, snap.txs, MONTH));
  });

  it('leftThisMonth/personal roll-ups accept an omitted month for all-time totals', () => {
    const jc = spaceById('jc');
    expect(leftThisMonth(jc.id, snap.txs)).toBeCloseTo(
      incomeOf(jc.id, snap.txs) - spentOfPersonal(jc.id, snap.txs),
      2,
    );
  });
});

describe('roll-ups', () => {
  it('totalSpent matches the data.js June total', () => {
    expect(totalSpent(snap.spaces, snap.txs, MONTH)).toBeCloseTo(3708.7, 2);
  });

  it('totalBudget sums shared spend-space budgets', () => {
    expect(totalBudget(snap.spaces)).toBe(4400);
  });

  it('spendByPerson buckets payers across spend spaces', () => {
    const byPerson = spendByPerson(snap.spaces, snap.txs, MONTH);
    expect(byPerson.JC).toBeCloseTo(966, 2); // 186 + 545 + 235
    expect(byPerson.CH).toBeCloseTo(531.4, 2); // 143.9+88+78.5+62 + 159
    expect(byPerson.Joint).toBeCloseTo(2211.3, 2);
    const sum = byPerson.JC + byPerson.CH + byPerson.Joint;
    expect(sum).toBeCloseTo(3708.7, 2);
  });

  it('topCategories ranks the biggest spend categories', () => {
    const top = topCategories(snap.spaces, snap.txs, MONTH);
    expect(top.length).toBeLessThanOrEqual(5);
    expect(top[0].cat).toBe('installment'); // 1450 + 545 = 1995
    expect(top[0].value).toBeCloseTo(1995, 2);
    // sorted descending
    for (let i = 1; i < top.length; i++) {
      expect(top[i - 1].value).toBeGreaterThanOrEqual(top[i].value);
    }
  });

  it('topCategories surfaces a category custom icon when set', () => {
    const spaces = snap.spaces.map((s) =>
      s.id === 'expenses'
        ? { ...s, cats: s.cats.map((c) => (c.key === 'grocery' ? { ...c, icon: 'coffee' } : c)) }
        : s,
    );
    const top = topCategories(spaces, snap.txs, MONTH);
    expect(top.find((t) => t.cat === 'grocery')?.icon).toBe('coffee');
    // categories without a custom icon stay undefined (keyed-icon fallback)
    expect(top.find((t) => t.cat === 'installment')?.icon).toBeUndefined();
  });
});

describe('migrateLegacyCategory', () => {
  it('converts a mapped legacy emoji to its icon name', () => {
    const c: Category & { emoji?: string } = { key: 'coffee', label: 'Coffee', emoji: '☕' };
    const out = migrateLegacyCategory(c);
    expect(out.icon).toBe('coffee');
    expect('emoji' in out).toBe(false);
  });

  it('matches emoji regardless of the U+FE0F variation selector', () => {
    expect(migrateLegacyCategory({ key: 'd', label: 'Dining', emoji: '🍽️' }).icon).toBe('utensils');
    expect(migrateLegacyCategory({ key: 'd', label: 'Dining', emoji: '🍽' }).icon).toBe('utensils');
  });

  it('drops an unmapped legacy emoji, leaving icon undefined', () => {
    const out = migrateLegacyCategory({ key: 'x', label: 'X', emoji: '🦄' });
    expect(out.icon).toBeUndefined();
    expect('emoji' in out).toBe(false);
  });

  it('passes an existing icon through and never keeps an emoji key', () => {
    const out = migrateLegacyCategory({ key: 'g', label: 'Groceries', icon: 'shopping-cart', emoji: '☕' });
    expect(out.icon).toBe('shopping-cart'); // explicit icon wins over legacy emoji
    expect('emoji' in out).toBe(false);
  });
});

describe('personal spaces', () => {
  it('incomeOf sums income-direction tx', () => {
    expect(incomeOf('jc', snap.txs, MONTH)).toBeCloseTo(6117, 2);
    expect(incomeOf('ch', snap.txs, MONTH)).toBeCloseTo(6600, 2);
  });
});

describe('fund balance', () => {
  it('derives displayed balance from baseBalance + in - out', () => {
    expect(fundBalance(spaceById('joint'), snap.txs)).toBeCloseTo(8420, 2);
  });

  it('a "paid from fund" mirror out tx lowers the fund balance by its amount', () => {
    const before = fundBalance(spaceById('joint'), snap.txs);
    const mirror: Tx = {
      id: 'mirror-1', spaceId: 'joint', title: 'Jaya Grocer', fieldValues: {},
      note: 'Paid from fund · Everyday Expenses', cat: 'grocery', amount: 120,
      date: MONTH + '-14', dir: 'out', linkId: 'origin-1', linkSpaceId: 'expenses',
    };
    const after = fundBalance(spaceById('joint'), [...snap.txs, mirror]);
    expect(after).toBeCloseTo(before - 120, 2);
    // …and the mirror must NOT count as household spending (fund out = 0).
    expect(spentOf(spaceById('joint'), [...snap.txs, mirror], MONTH)).toBe(0);
  });
});

describe('spendByPerson · Unspecified bucket', () => {
  it('buckets blank/missing payer under Unspecified without inflating others', () => {
    const base = spendByPerson(snap.spaces, snap.txs, MONTH);
    expect(base[UNSPECIFIED] ?? 0).toBe(0); // seed always attributes a payer
    const unattributed: Tx = {
      id: 'u1', spaceId: 'expenses', title: 'Cash buy', fieldValues: {},
      note: '', cat: 'grocery', amount: 40, date: MONTH + '-14', dir: 'out', payer: '',
    };
    const withU = spendByPerson(snap.spaces, [...snap.txs, unattributed], MONTH);
    expect(withU[UNSPECIFIED]).toBeCloseTo(40, 2);
    expect(withU.Joint).toBeCloseTo(base.Joint, 2); // Joint unchanged
  });

  it('payerSpaceBreakdown resolves the Unspecified payer', () => {
    const unattributed: Tx = {
      id: 'u2', spaceId: 'expenses', title: 'Cash buy', fieldValues: {},
      note: '', cat: 'grocery', amount: 40, date: MONTH + '-14', dir: 'out', payer: '',
    };
    const rows = payerSpaceBreakdown(snap.spaces, [...snap.txs, unattributed], [MONTH], UNSPECIFIED);
    expect(rows.reduce((a, r) => a + r.value, 0)).toBeCloseTo(40, 2);
  });
});

describe('demo month mapping & history', () => {
  it('maps sample days onto the reference month', () => {
    const anExpense = snap.txs.find((t) => t.spaceId === 'expenses' && t.title === 'Jaya Grocer')!;
    expect(anExpense.date).toBe('2026-07-14');
  });

  it('history returns a 6-month series ending at the reference month', () => {
    const series = history(snap.spaces, snap.txs, 6, REF);
    expect(series).toHaveLength(6);
    expect(series[5].month).toBe(MONTH);
    expect(series[5].value).toBeCloseTo(3708.7, 2);
    // prior months carry the synthetic aggregates (non-zero, ~history totals)
    expect(series[0].value).toBeCloseTo(4310, 0);
    expect(series[4].value).toBeCloseTo(4980, 0);
  });
});

describe('range-aware reports selectors', () => {
  it('monthsInRange returns the last n months incl current, oldest first', () => {
    expect(monthsInRange(3, REF)).toEqual(['2026-05', '2026-06', '2026-07']);
    expect(monthsInRange(6, REF)[0]).toBe('2026-02');
  });

  it('a single-month range equals the single-month selectors', () => {
    expect(spendByPersonRange(snap.spaces, snap.txs, [MONTH])).toEqual(
      spendByPerson(snap.spaces, snap.txs, MONTH),
    );
    expect(topCategoriesRange(snap.spaces, snap.txs, [MONTH])).toEqual(
      topCategories(snap.spaces, snap.txs, MONTH),
    );
  });

  it('spendBySpaceRange over 6 months sums to the history total', () => {
    const months = monthsInRange(6, REF);
    const bySpace = spendBySpaceRange(snap.spaces, snap.txs, months);
    const rangeSum = bySpace.reduce((a, s) => a + s.value, 0);
    const historySum = history(snap.spaces, snap.txs, 6, REF).reduce((a, h) => a + h.value, 0);
    expect(rangeSum).toBeCloseTo(historySum, 2);
  });

  it('categoriesWithOther appends the virtual Other, without duplicating it', () => {
    const withCats = { cats: [{ key: 'a', label: 'A' }] };
    const out = categoriesWithOther(withCats);
    expect(out.map((c) => c.key)).toEqual(['a', OTHER_CATEGORY.key]);
    // Empty space still offers Other.
    expect(categoriesWithOther({ cats: [] })).toEqual([OTHER_CATEGORY]);
    // Never doubled if a space somehow already carries an 'other'.
    const dup = { cats: [{ key: 'other', label: 'Other' }] };
    expect(categoriesWithOther(dup).filter((c) => c.key === 'other')).toHaveLength(1);
  });

  it('resolveCatKey maps unknown/deleted categories onto Other', () => {
    const space = { cats: [{ key: 'a', label: 'A' }] };
    expect(resolveCatKey(space, 'a')).toBe('a');
    expect(resolveCatKey(space, 'deleted-key')).toBe(OTHER_CATEGORY.key);
    expect(resolveCatKey(space, 'other')).toBe(OTHER_CATEGORY.key);
  });

  it('payerSpaceBreakdown yields non-zero per-space rows for a payer', () => {
    const rows = payerSpaceBreakdown(snap.spaces, snap.txs, [MONTH], 'JC');
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) expect(r.value).toBeGreaterThan(0);
    // JC's current-month total across spaces matches spendByPerson.JC (966).
    expect(rows.reduce((a, r) => a + r.value, 0)).toBeCloseTo(966, 2);
  });
});

describe('reorderedSortValues', () => {
  it('re-hands out the same slots down the new visual order', () => {
    // A,B,C currently occupy slots 2,5,9. Drag C to the front → C,A,B.
    const next = reorderedSortValues([
      { id: 'c', sortOrder: 9 },
      { id: 'a', sortOrder: 2 },
      { id: 'b', sortOrder: 5 },
    ]);
    // The pool of slots is preserved; the leading item gets the smallest.
    expect(next.get('c')).toBe(2);
    expect(next.get('a')).toBe(5);
    expect(next.get('b')).toBe(9);
    // Sorting the set by its new sortOrder reproduces the requested order.
    const order = [...next.entries()].sort((x, y) => x[1] - y[1]).map(([id]) => id);
    expect(order).toEqual(['c', 'a', 'b']);
  });

  it('only the moved items differ; untouched order is a no-op', () => {
    const same = reorderedSortValues([
      { id: 'a', sortOrder: 2 },
      { id: 'b', sortOrder: 5 },
      { id: 'c', sortOrder: 9 },
    ]);
    expect(same.get('a')).toBe(2);
    expect(same.get('b')).toBe(5);
    expect(same.get('c')).toBe(9);
  });

  it('preserves interleaving with spaces outside the reordered set', () => {
    // Only the odd-slotted group {1,3,5} is reordered; even slots stay free.
    const next = reorderedSortValues([
      { id: 'z', sortOrder: 5 },
      { id: 'x', sortOrder: 1 },
      { id: 'y', sortOrder: 3 },
    ]);
    // The values used are exactly {1,3,5} — nothing leaks onto other slots.
    expect([...next.values()].sort((a, b) => a - b)).toEqual([1, 3, 5]);
  });
});
