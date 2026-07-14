// Zustand app store — holds the in-memory Snapshot, boots from Dexie, and
// applies mutations (persist via repo, then update the snapshot optimistically).

import { create } from 'zustand';
import * as repo from '../data/repo';
import type { RealtimeTable } from '../data/remote-repo';
import { supabase } from '../data/supabase';
import { clearCache, loadCache, saveCache } from '../data/db';
import { findMirror, planEntryUpdate, resolvePaidFromFund } from '../domain/entry-links';
import type { EntryEdit } from '../domain/entry-links';
import { formatMoney, isoMonth } from '../domain/format';
import { applyTheme, initTheme, nextTheme } from './theme';
import {
  DEFAULT_HOUSEHOLD, DEFAULT_SETTINGS,
} from '../domain/types';
import type {
  Household, RecurringItem, Settings, Snapshot, Space, Theme, Tx, TxDir,
} from '../domain/types';

export type Status = 'loading' | 'ready';

const OFFLINE_MSG = "You're offline — change not saved";

// Realtime plumbing (module-level, one channel per session).
let unsubscribeRealtime: (() => void) | null = null;
const refetchTimers: Partial<Record<RealtimeTable, ReturnType<typeof setTimeout>>> = {};

// Foreground/online resync throttle (module-level; guards against duplicate
// visibilitychange + online firings and rapid re-foregrounding).
let resyncInFlight = false;
let lastResyncAt = 0;
const RESYNC_THROTTLE_MS = 2000;

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
  /**
   * When set to a fund space's id, the entry is "paid from" that fund: a linked
   * mirror `dir:'out'` tx is written into the fund's ledger so its balance drops
   * by the same amount. Ignored if the id isn't a fund or is the entry's own space.
   */
  paidFromFundId?: string;
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

  // auth + household gate
  /** True once a Supabase session exists. */
  authed: boolean;
  /** True once the caller's household is loaded (snapshot is cloud data). */
  hasHousehold: boolean;
  /** Showing cached data while the cloud fetch runs. */
  syncing: boolean;
  /** Cloud unreachable — showing cached data read-only; mutations are blocked. */
  offline: boolean;
  /** Signed-in user's email (for the Settings account card). */
  email: string | null;
  /** Active household id + invite code (for "Invite partner"). */
  householdId: string | null;
  inviteCode: string | null;

  // UI / dialog state
  addEntryOpen: boolean;
  addEntrySpaceId: string | null;
  /** When set, AddEntryDialog runs in edit mode against this tx (space locked). */
  editEntryId: string | null;
  /** When set, the read-only entry-detail dialog is open for this tx. */
  entryDetailId: string | null;
  newSpaceOpen: boolean;
  settingsSpaceId: string | null;

  // lifecycle + auth
  boot: () => Promise<void>;
  /** Sign in / sign up then re-run the boot gate. */
  refreshAfterAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Onboarding: create a new household (sets context + invite code). */
  createHousehold: () => Promise<void>;
  /** Onboarding: join a partner's household by invite code, then load it. */
  joinHousehold: (code: string) => Promise<void>;
  /** Load the active household's snapshot, cache it, and start realtime sync. */
  loadHousehold: () => Promise<void>;
  /**
   * Refetch a fresh snapshot and resubscribe realtime. Triggered when the app
   * returns to foreground or the network comes back, since a suspended socket
   * (backgrounded iOS PWA) won't replay missed partner events. Throttled + guarded.
   */
  resync: () => Promise<void>;
  resetAll: () => Promise<void>;

  // mutations
  addEntry: (input: NewEntryInput) => Promise<Tx>;
  updateTx: (id: string, patch: Partial<Tx>) => Promise<void>;
  deleteTx: (id: string) => Promise<void>;
  /** Edit an origin entry and reconcile its fund mirror. */
  updateEntry: (id: string, edit: EntryEdit) => Promise<void>;
  /** Delete an entry and its linked fund mirror (either direction). */
  deleteEntry: (id: string) => Promise<void>;
  /** Bulk-duplicate ledger entries into another month (Carry forward). Returns count added. */
  carryForward: (drafts: Omit<Tx, 'id'>[]) => Promise<number>;
  addSpace: (space: Omit<Space, 'sortOrder'> & { sortOrder?: number }) => Promise<Space>;
  updateSpace: (id: string, patch: Partial<Space>) => Promise<void>;
  /**
   * Remove a custom field from a space and strip its now-orphaned value from
   * every entry in that space, so deleted-field data doesn't linger in the DB
   * (or resurface if a same-keyed field is later recreated).
   */
  deleteField: (spaceId: string, fieldKey: string) => Promise<void>;
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
  openEditEntry: (id: string) => void;
  closeAddEntry: () => void;
  openEntryDetail: (id: string) => void;
  closeEntryDetail: () => void;
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

  authed: false,
  hasHousehold: false,
  syncing: false,
  offline: false,
  email: null,
  householdId: null,
  inviteCode: null,

  addEntryOpen: false,
  addEntrySpaceId: null,
  editEntryId: null,
  entryDetailId: null,
  newSpaceOpen: false,
  settingsSpaceId: null,

  async boot() {
    set({ status: 'loading', month: isoMonth(new Date()) });
    // Instant paint from the boot cache while we authenticate + fetch.
    const cached = await loadCache();
    if (cached) {
      initTheme(cached.settings.theme);
      set({ snapshot: cached, syncing: true });
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      teardownRealtime();
      repo.setCurrentHousehold(null);
      set({
        status: 'ready', authed: false, hasHousehold: false, syncing: false,
        offline: false, email: null, householdId: null, inviteCode: null,
        snapshot: EMPTY_SNAPSHOT,
      });
      return;
    }
    set({ authed: true, email: session.user.email ?? null });

    try {
      const hh = await repo.myHousehold();
      if (!hh) {
        set({ status: 'ready', hasHousehold: false, syncing: false, offline: false });
        return;
      }
      repo.setCurrentHousehold(hh.id);
      set({ householdId: hh.id, inviteCode: hh.invite_code });
      await get().loadHousehold();
    } catch {
      // Network / cloud failure: fall back to cached data read-only if we have it.
      if (cached) {
        set({ status: 'ready', hasHousehold: true, syncing: false, offline: true });
        get().showToast('Offline — showing your last synced data');
      } else {
        set({ status: 'ready', hasHousehold: false, syncing: false, offline: true });
      }
    }
  },

  async loadHousehold() {
    const snapshot = await repo.loadSnapshot();
    await saveCache(snapshot);
    initTheme(snapshot.settings.theme);
    set({
      snapshot, status: 'ready', hasHousehold: true, syncing: false, offline: false,
      month: isoMonth(new Date()),
    });
    startRealtime();
  },

  async resync() {
    const s = get();
    if (!(s.authed && s.hasHousehold) || s.status !== 'ready') return;
    // Concurrency + throttle: skip if one is in flight or one finished < 2s ago.
    if (resyncInFlight) return;
    if (Date.now() - lastResyncAt < RESYNC_THROTTLE_MS) return;
    resyncInFlight = true;
    set({ syncing: true });
    try {
      const snapshot = await repo.loadSnapshot();
      await saveCache(snapshot);
      set({ snapshot, syncing: false, offline: false });
      // A suspended socket may be dead — teardown + resubscribe.
      startRealtime();
      lastResyncAt = Date.now();
    } catch (err) {
      // Transient foreground/online hiccup — don't flip to offline read-only.
      console.error('[sprout] resync failed', err);
      set({ syncing: false });
    } finally {
      resyncInFlight = false;
    }
  },

  async refreshAfterAuth() {
    await get().boot();
  },

  async signOut() {
    teardownRealtime();
    await supabase.auth.signOut();
    await clearCache();
    repo.setCurrentHousehold(null);
    set({
      status: 'ready', authed: false, hasHousehold: false, syncing: false, offline: false,
      email: null, householdId: null, inviteCode: null, snapshot: EMPTY_SNAPSHOT,
    });
  },

  async createHousehold() {
    const row = await repo.createHousehold();
    set({ householdId: row.id, inviteCode: row.invite_code });
  },

  async joinHousehold(code) {
    const row = await repo.joinHousehold(code);
    set({ householdId: row.id, inviteCode: row.invite_code });
    await get().loadHousehold();
  },

  async resetAll() {
    await repo.resetAll();
    set({
      snapshot: { ...EMPTY_SNAPSHOT, household: { ...DEFAULT_HOUSEHOLD }, settings: { ...DEFAULT_SETTINGS } },
      hasHousehold: false,
    });
    await clearCache();
  },

  async addEntry(input) {
    const { snapshot } = get();
    const space = snapshot.spaces.find((s) => s.id === input.spaceId);
    const dir: TxDir = input.dir ?? 'out';
    const fieldValues = input.fieldValues ?? {};
    const title =
      input.title || fieldValues.vendor || input.note || input.cat || 'Entry';
    const date = input.date ?? new Date().toISOString().slice(0, 10);
    const originId = repo.newId('tx');

    // "Paid from a fund": mirror the spend as a fund withdrawal, linked to the
    // origin so fund balance (base + in − out) reflects it. Guard against a fund
    // paying from itself.
    const fund = input.paidFromFundId
      ? snapshot.spaces.find(
          (s) => s.id === input.paidFromFundId && s.kind === 'fund' && s.id !== input.spaceId,
        )
      : undefined;
    const linkId = fund ? originId : undefined;

    const tx: Tx = {
      id: originId,
      spaceId: input.spaceId,
      title,
      fieldValues,
      note: input.note ?? '',
      cat: input.cat,
      amount: input.amount,
      date,
      payer: space?.group === 'personal' ? undefined : input.payer ?? 'Joint',
      dir,
      status: input.status,
      linkId,
      linkSpaceId: fund?.id,
    };
    const added: Tx[] = [tx];
    if (fund) {
      const mirror: Tx = {
        id: repo.newId('tx'),
        spaceId: fund.id,
        title,
        fieldValues: {},
        note: `Paid from fund · ${space?.name ?? ''}`,
        cat: fund.cats[0]?.key ?? 'other',
        amount: input.amount,
        date,
        dir: 'out',
        linkId,
        linkSpaceId: input.spaceId,
      };
      added.unshift(mirror);
    }
    if (!(await guardWrite(get, () => repo.addTxs(added)))) return tx;
    commitSnapshot(get, set, { txs: [...added, ...snapshot.txs] });
    const money = formatMoney(input.amount, { currency: snapshot.settings.currency });
    const sub = `${money} · ${title}`;
    get().showToast(dir === 'in' ? 'Income added' : 'Entry added', sub);
    return tx;
  },

  async updateTx(id, patch) {
    if (!(await guardWrite(get, () => repo.updateTx(id, patch)))) return;
    const { snapshot } = get();
    commitSnapshot(get, set, {
      txs: snapshot.txs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  },

  async deleteTx(id) {
    if (!(await guardWrite(get, () => repo.deleteTx(id)))) return;
    const { snapshot } = get();
    commitSnapshot(get, set, { txs: snapshot.txs.filter((t) => t.id !== id) });
  },

  async updateEntry(id, edit) {
    const { snapshot } = get();
    const origin = snapshot.txs.find((t) => t.id === id);
    if (!origin) return;
    const originSpace = snapshot.spaces.find((s) => s.id === origin.spaceId);
    const mirror = findMirror(origin, snapshot.txs);
    const fund = resolvePaidFromFund(edit.paidFromFundId, origin.spaceId, snapshot.spaces);
    const plan = planEntryUpdate(
      origin,
      mirror,
      edit,
      originSpace?.name ?? '',
      fund,
      repo.newId('tx'),
    );
    if (!(await guardWrite(get, () => repo.applyEntryUpdate(id, plan.originPatch, plan.mirror)))) return;

    // Reflect the same changes in the in-memory snapshot.
    let txs = snapshot.txs.map((t) => (t.id === id ? { ...t, ...plan.originPatch } : t));
    const m = plan.mirror;
    if (m.kind === 'update' && m.id) {
      txs = txs.map((t) => (t.id === m.id ? { ...t, ...m.patch } : t));
    } else if (m.kind === 'delete' && m.id) {
      txs = txs.filter((t) => t.id !== m.id);
    } else if (m.kind === 'create' && m.create) {
      if (m.removeId) txs = txs.filter((t) => t.id !== m.removeId);
      txs = [m.create, ...txs];
    }
    commitSnapshot(get, set, { txs });
    get().showToast('Entry updated', `${formatMoney(edit.amount, { currency: snapshot.settings.currency })} · ${edit.title}`);
  },

  async deleteEntry(id) {
    const { snapshot } = get();
    const tx = snapshot.txs.find((t) => t.id === id);
    if (!tx) return;
    const linked = findMirror(tx, snapshot.txs);
    const ids = linked ? [id, linked.id] : [id];
    if (!(await guardWrite(get, () => repo.deleteTxs(ids)))) return;
    commitSnapshot(get, set, { txs: snapshot.txs.filter((t) => !ids.includes(t.id)) });
    get().showToast('Entry deleted');
  },

  async carryForward(drafts) {
    if (drafts.length === 0) return 0;
    // Fresh standalone rows in the target month — links are intentionally NOT
    // copied, so carrying forward a "paid from fund" expense never silently
    // re-deducts a fund balance. All rows go in one cloud write.
    const txs: Tx[] = drafts.map((d) => ({ ...d, id: repo.newId('tx') }));
    if (!(await guardWrite(get, () => repo.addTxs(txs)))) return 0;
    const { snapshot } = get();
    commitSnapshot(get, set, { txs: [...txs, ...snapshot.txs] });
    const n = txs.length;
    get().showToast(`Carried forward ${n} ${n === 1 ? 'entry' : 'entries'}`);
    return n;
  },

  async addSpace(space) {
    const { snapshot } = get();
    const sortOrder =
      space.sortOrder ??
      snapshot.spaces.reduce((max, s) => Math.max(max, s.sortOrder), -1) + 1;
    const full: Space = { ...space, sortOrder } as Space;
    if (!(await guardWrite(get, () => repo.addSpace(full)))) return full;
    commitSnapshot(get, set, { spaces: [...snapshot.spaces, full] });
    return full;
  },

  async updateSpace(id, patch) {
    if (!(await guardWrite(get, () => repo.updateSpace(id, patch)))) return;
    const { snapshot } = get();
    commitSnapshot(get, set, {
      spaces: snapshot.spaces.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  },

  async deleteField(spaceId, fieldKey) {
    const { snapshot } = get();
    const space = snapshot.spaces.find((s) => s.id === spaceId);
    if (!space) return;
    const nextFields = space.fields.filter((f) => f.key !== fieldKey);
    // Entries in this space that still carry a value under the removed key.
    const stripped = snapshot.txs
      .filter((t) => t.spaceId === spaceId && fieldKey in t.fieldValues)
      .map((t) => {
        const fieldValues = { ...t.fieldValues };
        delete fieldValues[fieldKey];
        return { id: t.id, fieldValues };
      });
    // Drop the field definition first, then clean up the orphaned values. If the
    // value cleanup fails, the worst case is the pre-existing behaviour (values
    // linger) rather than a field that renders empty cells.
    const ok = await guardWrite(get, async () => {
      await repo.updateSpace(spaceId, { fields: nextFields });
      if (stripped.length > 0) await repo.updateTxsFieldValues(stripped);
    });
    if (!ok) return;
    const strippedById = new Map(stripped.map((s) => [s.id, s.fieldValues]));
    commitSnapshot(get, set, {
      spaces: snapshot.spaces.map((s) => (s.id === spaceId ? { ...s, fields: nextFields } : s)),
      txs: snapshot.txs.map((t) =>
        strippedById.has(t.id) ? { ...t, fieldValues: strippedById.get(t.id)! } : t,
      ),
    });
  },

  async deleteSpace(id) {
    if (!(await guardWrite(get, () => repo.deleteSpace(id)))) return;
    const { snapshot } = get();
    commitSnapshot(get, set, {
      spaces: snapshot.spaces.filter((s) => s.id !== id),
      txs: snapshot.txs.filter((t) => t.spaceId !== id),
      recurring: snapshot.recurring.filter((r) => r.spaceId !== id),
    });
  },

  async addRecurring(item) {
    const full: RecurringItem = { ...item, id: repo.newId('rec') };
    if (!(await guardWrite(get, () => repo.addRecurring(full)))) return full;
    const { snapshot } = get();
    commitSnapshot(get, set, { recurring: [...snapshot.recurring, full] });
    return full;
  },

  async updateRecurring(id, patch) {
    if (!(await guardWrite(get, () => repo.updateRecurring(id, patch)))) return;
    const { snapshot } = get();
    commitSnapshot(get, set, {
      recurring: snapshot.recurring.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  },

  async deleteRecurring(id) {
    if (!(await guardWrite(get, () => repo.deleteRecurring(id)))) return;
    const { snapshot } = get();
    commitSnapshot(get, set, { recurring: snapshot.recurring.filter((r) => r.id !== id) });
  },

  async saveHousehold(household) {
    if (!(await guardWrite(get, () => repo.saveHousehold(household)))) return;
    commitSnapshot(get, set, { household });
  },

  async saveSettings(settings) {
    if (!(await guardWrite(get, () => repo.saveSettings(settings)))) return;
    applyTheme(settings.theme);
    commitSnapshot(get, set, { settings });
  },

  async setTheme(theme) {
    const { snapshot } = get();
    const settings: Settings = { ...snapshot.settings, theme };
    applyTheme(theme);
    if (!(await guardWrite(get, () => repo.saveSettings(settings)))) return;
    commitSnapshot(get, set, { settings });
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
    set({ addEntryOpen: true, addEntrySpaceId: spaceId ?? null, editEntryId: null });
  },
  openEditEntry(id) {
    const tx = get().snapshot.txs.find((t) => t.id === id);
    set({ addEntryOpen: true, editEntryId: id, addEntrySpaceId: tx?.spaceId ?? null, entryDetailId: null });
  },
  closeAddEntry() {
    set({ addEntryOpen: false, editEntryId: null });
  },
  openEntryDetail(id) {
    set({ entryDetailId: id });
  },
  closeEntryDetail() {
    set({ entryDetailId: null });
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

// ---- write guard + cache helpers -----------------------------------------
type Get = () => AppState;
type Set = (partial: Partial<AppState>) => void;

/**
 * Run a cloud write. Returns false (and toasts) when offline or the write fails,
 * so the caller skips the optimistic snapshot update (revert). True on success.
 */
async function guardWrite(get: Get, fn: () => Promise<void>): Promise<boolean> {
  if (get().offline) {
    get().showToast(OFFLINE_MSG);
    return false;
  }
  try {
    await fn();
    return true;
  } catch (err) {
    console.error('[sprout] cloud write failed', err);
    get().showToast(OFFLINE_MSG);
    return false;
  }
}

/** Merge a snapshot patch into state and persist to the boot cache. */
function commitSnapshot(get: Get, set: Set, patch: Partial<Snapshot>): void {
  const snapshot = { ...get().snapshot, ...patch };
  set({ snapshot });
  void saveCache(snapshot);
}

// ---- realtime partner sync -----------------------------------------------
/**
 * Refetch one table (debounced 200ms) and splice it into the snapshot. Runs on
 * every realtime event for the household; refetch is idempotent so own-echoes
 * are harmless (no skip-own-echo needed).
 */
function scheduleRefetch(table: RealtimeTable): void {
  clearTimeout(refetchTimers[table]);
  refetchTimers[table] = setTimeout(() => {
    void (async () => {
      try {
        const get: Get = useAppStore.getState;
        const set: Set = (p) => useAppStore.setState(p);
        if (table === 'txs') commitSnapshot(get, set, { txs: await repo.fetchTxs() });
        else if (table === 'spaces') commitSnapshot(get, set, { spaces: await repo.fetchSpaces() });
        else if (table === 'recurring') commitSnapshot(get, set, { recurring: await repo.fetchRecurring() });
        else if (table === 'people') {
          const people = await repo.fetchPeople();
          commitSnapshot(get, set, { household: { ...get().snapshot.household, people } });
        } else if (table === 'settings') {
          const s = await repo.fetchSettings();
          const settings = { ...get().snapshot.settings, ...s };
          applyTheme(settings.theme);
          commitSnapshot(get, set, { settings });
        }
      } catch (err) {
        console.error('[sprout] realtime refetch failed', err);
      }
    })();
  }, 200);
}

function startRealtime(): void {
  teardownRealtime();
  unsubscribeRealtime = repo.subscribeRealtime(scheduleRefetch);
}

function teardownRealtime(): void {
  if (unsubscribeRealtime) {
    unsubscribeRealtime();
    unsubscribeRealtime = null;
  }
}

// Debug handle: expose the store so tooling (and manual debugging in the
// console) can inspect state and trigger a manual cloud refetch. Harmless in
// production; carries no secrets.
if (typeof window !== 'undefined') {
  (window as unknown as { useAppStore?: typeof useAppStore }).useAppStore = useAppStore;
}

// Resync triggers: iOS suspends the realtime socket when the PWA is backgrounded
// and missed events are not replayed on resume, so refetch a fresh snapshot (and
// resubscribe realtime) when the app returns to foreground or the network comes
// back. resync()'s 2s throttle absorbs both firing together.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') useAppStore.getState().resync();
  });
}
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().resync();
  });
}
