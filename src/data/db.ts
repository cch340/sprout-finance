// Dexie (IndexedDB) schema — v1. One database, five tables.
import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Household, RecurringItem, Settings, Space, Tx } from '../domain/types';

export class SproutDB extends Dexie {
  spaces!: Table<Space, string>;
  txs!: Table<Tx, string>;
  recurring!: Table<RecurringItem, string>;
  household!: Table<Household, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super('sprout');
    this.version(1).stores({
      spaces: 'id, group, kind, sortOrder',
      txs: 'id, spaceId, date, [spaceId+date]',
      recurring: 'id, spaceId',
      household: 'id',
      settings: 'id',
    });
  }
}

export const db = new SproutDB();
