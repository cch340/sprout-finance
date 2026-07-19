// Dexie (IndexedDB) is now used ONLY as a boot cache for the last-loaded cloud
// snapshot. A single row holds the whole snapshot; on boot we show it instantly
// (with a "Syncing…" hint) while the authoritative cloud fetch runs, and fall
// back to it read-only when the network is unavailable. All real reads/writes
// go through remote-repo.ts (Supabase).
import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Snapshot } from '../domain/types';
import { migrateLegacyCategory } from '../domain/legacy-emoji';

interface CacheRow {
  id: string;
  snapshot: Snapshot;
}

export class SproutDB extends Dexie {
  cache!: Table<CacheRow, string>;

  constructor() {
    super('sprout');
    // v2: drop the old local-only tables (spaces/txs/recurring/household/settings)
    // in favour of a single snapshot cache row.
    this.version(2).stores({
      cache: 'id',
    });
    // v3: multi-household support — cache rows are now keyed by household id
    // instead of a single fixed 'snapshot' row. The schema string is unchanged
    // ('id' PK); the v2 single-row cache simply becomes stale, so clear it on
    // upgrade to avoid a mismatched row ever being read as a household snapshot.
    this.version(3).stores({
      cache: 'id',
    }).upgrade((tx) => tx.table('cache').clear());
  }
}

export const db = new SproutDB();

/** Persist a household's cloud snapshot for instant boot next time. Best-effort. */
export async function saveCache(householdId: string, snapshot: Snapshot): Promise<void> {
  try {
    await db.cache.put({ id: householdId, snapshot });
  } catch {
    /* cache is best-effort; ignore quota / private-mode failures */
  }
}

/** Read a household's cached snapshot, or null when none / unavailable. */
export async function loadCache(householdId: string): Promise<Snapshot | null> {
  try {
    const row = await db.cache.get(householdId);
    return row?.snapshot ? normalizeSnapshot(row.snapshot) : null;
  } catch {
    return null;
  }
}

/**
 * Normalize a snapshot read from the boot cache: migrate any category persisted
 * with the legacy `emoji` field to the current `icon` field, so a cached
 * snapshot from before the emoji→icon migration reaches the store normalized.
 */
function normalizeSnapshot(snapshot: Snapshot): Snapshot {
  return {
    ...snapshot,
    spaces: snapshot.spaces.map((s) => ({ ...s, cats: s.cats.map(migrateLegacyCategory) })),
  };
}

/** Drop the cached snapshot (on sign-out). */
export async function clearCache(): Promise<void> {
  try {
    await db.cache.clear();
  } catch {
    /* ignore */
  }
}
