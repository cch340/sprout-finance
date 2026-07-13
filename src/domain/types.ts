// Domain model for Sprout — see docs/ARCHITECTURE.md ("Domain model").
// These interfaces are the source-of-truth shapes persisted in Dexie and held
// in the in-memory snapshot.

export type SpaceKind = 'spend' | 'fund' | 'invest' | 'personal';
export type SpaceGroup = 'shared' | 'personal';
export type TxDir = 'in' | 'out';
export type TxStatus = 'paid' | 'due';
export type Theme = 'light' | 'dark';

export type FieldType = 'text' | 'select' | 'date' | 'number';

/**
 * A space's custom "extra info" field. Values are always stored as strings in
 * `Tx.fieldValues`: `date` fields hold an ISO `yyyy-mm-dd`, `number` fields hold
 * a plain decimal string (e.g. `"12.5"`), `text`/`select` hold free text.
 * `options`/preset UI apply to `select` only.
 */
export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  primary?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface Category {
  key: string;
  label: string;
}

export interface Space {
  id: string;
  name: string;
  short?: string;
  sub?: string;
  group: SpaceGroup;
  icon: string;
  kind: SpaceKind;
  cats: Category[];
  fields: FieldDef[];
  budget?: number;
  /** Fund starting balance; live balance = baseBalance + sum(in) - sum(out). */
  baseBalance?: number;
  /** Investment holding value (static, user-maintained). */
  value?: number;
  sortOrder: number;
}

export interface RecurringItem {
  id: string;
  spaceId: string;
  label: string;
  cat: string;
  amount: number;
}

export interface Tx {
  id: string;
  spaceId: string;
  /** Row title — usually the primary field's value (e.g. vendor). */
  title: string;
  /** Values keyed by the space's FieldDef.key (vendor, location, provider, …). */
  fieldValues: Record<string, string>;
  note: string;
  cat: string;
  amount: number;
  /** ISO calendar date, yyyy-mm-dd. */
  date: string;
  payer?: 'Joint' | string;
  dir: TxDir;
  status?: TxStatus;
  /**
   * Links a spend entry and its fund "paid from" mirror tx. Both rows share the
   * same `linkId`; `linkSpaceId` points at the *other* space in the pair (the
   * fund for the origin entry, the origin space for the mirror).
   */
  linkId?: string;
  linkSpaceId?: string;
}

export interface Person {
  id: string;
  name: string;
}

/** Single-row table (id === 'main'). */
export interface Household {
  id: string;
  people: Person[];
  currency: string;
  onboarded: boolean;
}

/** Single-row table (id === 'main'). */
export interface Settings {
  id: string;
  theme: Theme;
  billReminders: boolean;
  currency: string;
}

/** Everything the app holds in memory at once. */
export interface Snapshot {
  spaces: Space[];
  txs: Tx[];
  recurring: RecurringItem[];
  household: Household;
  settings: Settings;
}

export const HOUSEHOLD_ID = 'main';
export const SETTINGS_ID = 'main';

export const DEFAULT_HOUSEHOLD: Household = {
  id: HOUSEHOLD_ID,
  people: [],
  currency: 'RM',
  onboarded: false,
};

export const DEFAULT_SETTINGS: Settings = {
  id: SETTINGS_ID,
  theme: 'light',
  billReminders: true,
  currency: 'RM',
};
