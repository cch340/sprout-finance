import { describe, expect, it } from 'vitest';
import { buildSeed } from '../data/seed-demo';
import { isoMonth } from './format';
import { fundBalance } from './selectors';
import {
  findMirror, planEntryUpdate, resolvePaidFromFund,
} from './entry-links';
import type { EntryEdit } from './entry-links';
import type { Space, Tx } from './types';

const REF = new Date(2026, 6, 12);
const MONTH = isoMonth(REF);
const snap = buildSeed(REF);
const spaceById = (id: string): Space => snap.spaces.find((s) => s.id === id)!;

// A spend origin paid from the Joint fund, plus its mirror.
function pairFixture(amount = 100): { origin: Tx; mirror: Tx; txs: Tx[] } {
  const origin: Tx = {
    id: 'origin-1', spaceId: 'expenses', title: 'Jaya Grocer', fieldValues: {},
    note: '', cat: 'grocery', amount, date: `${MONTH}-14`, dir: 'out',
    payer: 'Joint', linkId: 'origin-1', linkSpaceId: 'joint',
  };
  const mirror: Tx = {
    id: 'mirror-1', spaceId: 'joint', title: 'Jaya Grocer', fieldValues: {},
    note: 'Paid from fund · Everyday Expenses', cat: 'contribution', amount,
    date: `${MONTH}-14`, dir: 'out', linkId: 'origin-1', linkSpaceId: 'expenses',
  };
  return { origin, mirror, txs: [...snap.txs, origin, mirror] };
}

const baseEdit = (over: Partial<EntryEdit>): EntryEdit => ({
  amount: 100, date: `${MONTH}-14`, cat: 'grocery', fieldValues: {}, note: '',
  dir: 'out', payer: 'Joint', title: 'Jaya Grocer', paidFromFundId: 'joint', ...over,
});

describe('findMirror / resolvePaidFromFund', () => {
  it('finds the paired mirror by linkId', () => {
    const { origin, mirror, txs } = pairFixture();
    expect(findMirror(origin, txs)?.id).toBe(mirror.id);
    // a standalone origin (no link) has no mirror
    const solo: Tx = { ...origin, linkId: undefined, linkSpaceId: undefined };
    expect(findMirror(solo, txs)).toBeUndefined();
  });

  it('resolves only real funds, never the origin space or non-funds', () => {
    expect(resolvePaidFromFund('joint', 'expenses', snap.spaces)?.id).toBe('joint');
    expect(resolvePaidFromFund('expenses', 'expenses', snap.spaces)).toBeUndefined();
    expect(resolvePaidFromFund('joint', 'joint', snap.spaces)).toBeUndefined();
    expect(resolvePaidFromFund(undefined, 'expenses', snap.spaces)).toBeUndefined();
  });
});

describe('planEntryUpdate', () => {
  it('same fund + new amount → updates the mirror amount/date/title', () => {
    const { origin, mirror } = pairFixture(100);
    const plan = planEntryUpdate(origin, mirror, baseEdit({ amount: 250, title: 'Cold Storage' }), 'Everyday Expenses', spaceById('joint'), 'new-id');
    expect(plan.originPatch.amount).toBe(250);
    expect(plan.originPatch.linkSpaceId).toBe('joint');
    expect(plan.mirror.kind).toBe('update');
    expect(plan.mirror.id).toBe('mirror-1');
    expect(plan.mirror.patch).toMatchObject({ amount: 250, title: 'Cold Storage' });
  });

  it('drops the fund → deletes the mirror and clears the link', () => {
    const { origin, mirror } = pairFixture();
    const plan = planEntryUpdate(origin, mirror, baseEdit({ paidFromFundId: undefined, payer: 'JC' }), 'Everyday Expenses', undefined, 'new-id');
    expect(plan.originPatch.linkId).toBeUndefined();
    expect(plan.originPatch.linkSpaceId).toBeUndefined();
    expect(plan.mirror.kind).toBe('delete');
    expect(plan.mirror.id).toBe('mirror-1');
  });

  it('adds a fund to a previously unlinked entry → creates a mirror', () => {
    const solo: Tx = {
      id: 'solo-1', spaceId: 'expenses', title: 'Petrol', fieldValues: {},
      note: '', cat: 'grocery', amount: 60, date: `${MONTH}-10`, dir: 'out', payer: 'JC',
    };
    const plan = planEntryUpdate(solo, undefined, baseEdit({ amount: 60, title: 'Petrol' }), 'Everyday Expenses', spaceById('joint'), 'new-id');
    expect(plan.originPatch.linkId).toBe('solo-1'); // origin id becomes the link
    expect(plan.mirror.kind).toBe('create');
    expect(plan.mirror.create).toMatchObject({ id: 'new-id', spaceId: 'joint', amount: 60, dir: 'out', linkSpaceId: 'expenses', linkId: 'solo-1' });
  });

  it('mirror update keeps the fund balance reconciled', () => {
    const { origin, mirror, txs } = pairFixture(100);
    const before = fundBalance(spaceById('joint'), txs);
    const plan = planEntryUpdate(origin, mirror, baseEdit({ amount: 300 }), 'Everyday Expenses', spaceById('joint'), 'new-id');
    // apply the plan to the tx list
    const applied = txs.map((t) => (t.id === mirror.id ? { ...t, ...plan.mirror.patch } : t));
    const after = fundBalance(spaceById('joint'), applied);
    expect(after).toBeCloseTo(before - 200, 2); // extra 200 withdrawn
  });
});
