// Async repository over Dexie. The only module that talks to `db`.
// All reads/writes go through here; the store holds an in-memory Snapshot.

import { db } from './db';
import { buildSeed } from './seed-demo';
import {
  DEFAULT_HOUSEHOLD, DEFAULT_SETTINGS, HOUSEHOLD_ID, SETTINGS_ID,
} from '../domain/types';
import type {
  Household, RecurringItem, Settings, Snapshot, Space, Tx,
} from '../domain/types';

/** Load every table into a single Snapshot. Missing singletons fall back to defaults. */
export async function loadSnapshot(): Promise<Snapshot> {
  const [spaces, txs, recurring, household, settings] = await Promise.all([
    db.spaces.orderBy('sortOrder').toArray(),
    db.txs.toArray(),
    db.recurring.toArray(),
    db.household.get(HOUSEHOLD_ID),
    db.settings.get(SETTINGS_ID),
  ]);
  return {
    spaces,
    txs,
    recurring,
    household: household ?? { ...DEFAULT_HOUSEHOLD },
    settings: settings ?? { ...DEFAULT_SETTINGS },
  };
}

/** True when no household has been onboarded yet (fresh install). */
export async function isEmpty(): Promise<boolean> {
  const household = await db.household.get(HOUSEHOLD_ID);
  return !household || !household.onboarded;
}

// ---- transactions --------------------------------------------------------
export async function addTx(tx: Tx): Promise<void> {
  await db.txs.add(tx);
}
export async function updateTx(id: string, patch: Partial<Tx>): Promise<void> {
  await db.txs.update(id, patch);
}
export async function deleteTx(id: string): Promise<void> {
  await db.txs.delete(id);
}

// ---- spaces --------------------------------------------------------------
export async function addSpace(space: Space): Promise<void> {
  await db.spaces.add(space);
}
export async function updateSpace(id: string, patch: Partial<Space>): Promise<void> {
  await db.spaces.update(id, patch);
}
export async function deleteSpace(id: string): Promise<void> {
  await db.transaction('rw', db.spaces, db.txs, db.recurring, async () => {
    await db.spaces.delete(id);
    await db.txs.where('spaceId').equals(id).delete();
    await db.recurring.where('spaceId').equals(id).delete();
  });
}

// ---- recurring -----------------------------------------------------------
export async function addRecurring(item: RecurringItem): Promise<void> {
  await db.recurring.add(item);
}
export async function updateRecurring(id: string, patch: Partial<RecurringItem>): Promise<void> {
  await db.recurring.update(id, patch);
}
export async function deleteRecurring(id: string): Promise<void> {
  await db.recurring.delete(id);
}

// ---- singletons ----------------------------------------------------------
export async function saveHousehold(household: Household): Promise<void> {
  await db.household.put({ ...household, id: HOUSEHOLD_ID });
}
export async function saveSettings(settings: Settings): Promise<void> {
  await db.settings.put({ ...settings, id: SETTINGS_ID });
}

// ---- lifecycle -----------------------------------------------------------
export async function resetAll(): Promise<void> {
  await db.transaction('rw', db.spaces, db.txs, db.recurring, db.household, db.settings, async () => {
    await Promise.all([
      db.spaces.clear(), db.txs.clear(), db.recurring.clear(),
      db.household.clear(), db.settings.clear(),
    ]);
  });
}

/** Wipe everything and write the demo ledger. Returns the seeded snapshot. */
export async function seedDemo(ref: Date = new Date()): Promise<Snapshot> {
  const snap = buildSeed(ref);
  await db.transaction('rw', db.spaces, db.txs, db.recurring, db.household, db.settings, async () => {
    await Promise.all([
      db.spaces.clear(), db.txs.clear(), db.recurring.clear(),
      db.household.clear(), db.settings.clear(),
    ]);
    await db.spaces.bulkAdd(snap.spaces);
    await db.txs.bulkAdd(snap.txs);
    await db.recurring.bulkAdd(snap.recurring);
    await db.household.put(snap.household);
    await db.settings.put(snap.settings);
  });
  return snap;
}

/** Generate a unique id (UUID where available, timestamp+random fallback). */
export function newId(prefix = 'id'): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return `${prefix}-${c.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
