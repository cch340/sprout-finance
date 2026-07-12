// Zustand app store — holds the in-memory Snapshot, boots from Dexie, and
// applies mutations (persist via repo, then update the snapshot optimistically).

import { create } from 'zustand';
import * as repo from '../data/repo';
import { formatMoney, isoMonth } from '../domain/format';
import { applyTheme, initTheme, nextTheme } from './theme';
import {
  DEFAULT_HOUSEHOLD, DEFAULT_SETTINGS,
} from '../domain/types';
import type {
  Household, RecurringItem, Settings, Snapshot, Space, Theme, Tx, TxDir,
} from '../domain/types';

export type Status = 'loading' | 'ready';

export interface Toast {
  msg: string;
  sub?: string;
  /** Epoch ms when this toast should auto-dismiss. */
  expiresAt: number;
}

/** Input accepted by addEntry; the store fills in id/date/title defaults. */
export interface NewEntryInput {
  spaceId: string;
  amount: number;
  cat: string;
  dir?: TxDir;
  payer?: string;
  note?: string;
  title?: string;
  fieldValues?: Record<string, string>;
  status?: Tx['status'];
  date?: string;
}

const TOAST_MS = 3200;

const EMPTY_SNAPSHOT: Snapshot = {
  spaces: [],
  txs: [],
  recurring: [],
  household: { ...DEFAULT_HOUSEHOLD },
  settings: { ...DEFAULT_SETTINGS },
};

export interface AppState {
  status: Status;
  snapshot: Snapshot;
  /** Current calendar month, ISO yyyy-mm. */
  month: string;
  toast: Toast | null;

  // UI / dialog state
  addEntryOpen: boolean;
  addEntrySpaceId: string | null;
  newSpaceOpen: boolean;
  settingsSpaceId: string | null;

  // lifecycle
  boot: () => Promise<void>;
  seedDemo: () => Promise<void>;
  resetAll: () => Promise<void>;

  // mutations
  addEntry: (input: NewEntryInput) => Promise<Tx>;
  updateTx: (id: string, patch: Partial<Tx>) => Promise<void>;
  deleteTx: (id: string) => Promise<void>;
  addSpace: (space: Omit<Space, 'sortOrder'> & { sortOrder?: number }) => Promise<Space>;
  updateSpace: (id: string, patch: Partial<Space>) => Promise<void>;
  deleteSpace: (id: string) => Promise<void>;
  addRecurring: (item: Omit<RecurringItem, 'id'>) => Promise<RecurringItem>;
  updateRecurring: (id: string, patch: Partial<RecurringItem>) => Promise<void>;
  deleteRecurring: (id: string) => Promise<void>;
  saveHousehold: (household: Household) => Promise<void>;
  saveSettings: (settings: Settings) => Promise<void>;

  // theme
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;

  // toast
  showToast: (msg: string, sub?: string) => void;
  dismissToast: () => void;

  // ui setters
  openAddEntry: (spaceId?: string) => void;
  closeAddEntry: () => void;
  openNewSpace: () => void;
  closeNewSpace: () => void;
  openSpaceSettings: (spaceId: string) => void;
  closeSpaceSettings: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  status: 'loading',
  snapshot: EMPTY_SNAPSHOT,
  month: isoMonth(new Date()),
  toast: null,

  addEntryOpen: false,
  addEntrySpaceId: null,
  newSpaceOpen: false,
  settingsSpaceId: null,

  async boot() {
    let snapshot = await repo.loadSnapshot();
    // Dev convenience: `?demo` seeds the sample ledger on a fresh install.
    const wantsDemo =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).has('demo');
    if (wantsDemo && !snapshot.household.onboarded) {
      snapshot = await repo.seedDemo(new Date());
    }
    initTheme(snapshot.settings.theme);
    set({ snapshot, status: 'ready', month: isoMonth(new Date()) });
  },

  async seedDemo() {
    const snapshot = await repo.seedDemo(new Date());
    applyTheme(snapshot.settings.theme);
    set({ snapshot, status: 'ready', month: isoMonth(new Date()) });
    get().showToast('Demo data loaded', 'Sample June ledger');
  },

  async resetAll() {
    await repo.resetAll();
    set({ snapshot: { ...EMPTY_SNAPSHOT, household: { ...DEFAULT_HOUSEHOLD }, settings: { ...DEFAULT_SETTINGS } } });
  },

  async addEntry(input) {
    const { snapshot } = get();
    const space = snapshot.spaces.find((s) => s.id === input.spaceId);
    const dir: TxDir = input.dir ?? 'out';
    const fieldValues = input.fieldValues ?? {};
    const title =
      input.title || fieldValues.vendor || input.note || input.cat || 'Entry';
    const tx: Tx = {
      id: repo.newId('tx'),
      spaceId: input.spaceId,
      title,
      fieldValues,
      note: input.note ?? '',
      cat: input.cat,
      amount: input.amount,
      date: input.date ?? new Date().toISOString().slice(0, 10),
      payer: space?.group === 'personal' ? undefined : input.payer ?? 'Joint',
      dir,
      status: input.status,
    };
    await repo.addTx(tx);
    set({ snapshot: { ...snapshot, txs: [tx, ...snapshot.txs] } });
    const money = formatMoney(input.amount, { currency: snapshot.settings.currency });
    const sub = `${money} · ${title}`;
    get().showToast(dir === 'in' ? 'Income added' : 'Entry added', sub);
    return tx;
  },

  async updateTx(id, patch) {
    await repo.updateTx(id, patch);
    const { snapshot } = get();
    set({
      snapshot: {
        ...snapshot,
        txs: snapshot.txs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      },
    });
  },

  async deleteTx(id) {
    await repo.deleteTx(id);
    const { snapshot } = get();
    set({ snapshot: { ...snapshot, txs: snapshot.txs.filter((t) => t.id !== id) } });
  },

  async addSpace(space) {
    const { snapshot } = get();
    const sortOrder =
      space.sortOrder ??
      snapshot.spaces.reduce((max, s) => Math.max(max, s.sortOrder), -1) + 1;
    const full: Space = { ...space, sortOrder } as Space;
    await repo.addSpace(full);
    set({ snapshot: { ...snapshot, spaces: [...snapshot.spaces, full] } });
    return full;
  },

  async updateSpace(id, patch) {
    await repo.updateSpace(id, patch);
    const { snapshot } = get();
    set({
      snapshot: {
        ...snapshot,
        spaces: snapshot.spaces.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      },
    });
  },

  async deleteSpace(id) {
    await repo.deleteSpace(id);
    const { snapshot } = get();
    set({
      snapshot: {
        ...snapshot,
        spaces: snapshot.spaces.filter((s) => s.id !== id),
        txs: snapshot.txs.filter((t) => t.spaceId !== id),
        recurring: snapshot.recurring.filter((r) => r.spaceId !== id),
      },
    });
  },

  async addRecurring(item) {
    const full: RecurringItem = { ...item, id: repo.newId('rec') };
    await repo.addRecurring(full);
    const { snapshot } = get();
    set({ snapshot: { ...snapshot, recurring: [...snapshot.recurring, full] } });
    return full;
  },

  async updateRecurring(id, patch) {
    await repo.updateRecurring(id, patch);
    const { snapshot } = get();
    set({
      snapshot: {
        ...snapshot,
        recurring: snapshot.recurring.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      },
    });
  },

  async deleteRecurring(id) {
    await repo.deleteRecurring(id);
    const { snapshot } = get();
    set({ snapshot: { ...snapshot, recurring: snapshot.recurring.filter((r) => r.id !== id) } });
  },

  async saveHousehold(household) {
    await repo.saveHousehold(household);
    const { snapshot } = get();
    set({ snapshot: { ...snapshot, household } });
  },

  async saveSettings(settings) {
    await repo.saveSettings(settings);
    const { snapshot } = get();
    applyTheme(settings.theme);
    set({ snapshot: { ...snapshot, settings } });
  },

  async setTheme(theme) {
    const { snapshot } = get();
    const settings: Settings = { ...snapshot.settings, theme };
    applyTheme(theme);
    set({ snapshot: { ...snapshot, settings } });
    await repo.saveSettings(settings);
  },

  async toggleTheme() {
    await get().setTheme(nextTheme(get().snapshot.settings.theme));
  },

  showToast(msg, sub) {
    set({ toast: { msg, sub, expiresAt: Date.now() + TOAST_MS } });
  },
  dismissToast() {
    set({ toast: null });
  },

  openAddEntry(spaceId) {
    set({ addEntryOpen: true, addEntrySpaceId: spaceId ?? null });
  },
  closeAddEntry() {
    set({ addEntryOpen: false });
  },
  openNewSpace() {
    set({ newSpaceOpen: true });
  },
  closeNewSpace() {
    set({ newSpaceOpen: false });
  },
  openSpaceSettings(spaceId) {
    set({ settingsSpaceId: spaceId });
  },
  closeSpaceSettings() {
    set({ settingsSpaceId: null });
  },
}));
