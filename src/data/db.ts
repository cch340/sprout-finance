// Dexie (IndexedDB) is now used ONLY as a boot cache for the last-loaded cloud
// snapshot. A single row holds the whole snapshot; on boot we show it instantly
// (with a "Syncing…" hint) while the authoritative cloud fetch runs, and fall
// back to it read-only when the network is unavailable. All real reads/writes
// go through remote-repo.ts (Supabase).
import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Snapshot } from '../domain/types';

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
  }
}

export const db = new SproutDB();

const CACHE_ID = 'snapshot';

/** Persist the latest cloud snapshot for instant boot next time. Best-effort. */
export async function saveCache(snapshot: Snapshot): Promise<void> {
  try {
    await db.cache.put({ id: CACHE_ID, snapshot });
  } catch {
    /* cache is best-effort; ignore quota / private-mode failures */
  }
}

/** Read the cached snapshot, or null when none / unavailable. */
export async function loadCache(): Promise<Snapshot | null> {
  try {
    const row = await db.cache.get(CACHE_ID);
    return row?.snapshot ?? null;
  } catch {
    return null;
  }
}

/** Drop the cached snapshot (on sign-out). */
export async function clearCache(): Promise<void> {
  try {
    await db.cache.clear();
  } catch {
    /* ignore */
  }
}
