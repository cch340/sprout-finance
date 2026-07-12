import { describe, expect, it } from 'vitest';
import { buildSeed } from '../data/seed-demo';
import { isoMonth } from './format';
import {
  fundBalance, history, incomeOf, spendByPerson, spentOf, topCategories,
  totalBudget, totalSpent,
} from './selectors';
import type { Space } from './types';

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
