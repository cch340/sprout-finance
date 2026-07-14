// Remote repository over Supabase — the only module that talks to the cloud
// tables. Mirrors the async CRUD surface the store already uses, mapping the
// snake_case / jsonb rows ↔ the existing camelCase TS domain types. Domain
// types and selectors are untouched: pure functions stay the core.
//
// household_id is resolved from the authed context at boot (setCurrentHousehold)
// and injected into every scoped read/write. Composite PK is (household_id, id).

import { supabase } from './supabase';
import { SETTINGS_ID } from '../domain/types';
import type {
  Household, Person, RecurringItem, Settings, Snapshot, Space, Tx,
} from '../domain/types';
import { migrateLegacyCategory } from '../domain/legacy-emoji';

// ---- current household context -------------------------------------------
let currentHouseholdId: string | null = null;

/** Set the active household (called at boot / after create / join). */
export function setCurrentHousehold(id: string | null): void {
  currentHouseholdId = id;
}
export function getCurrentHousehold(): string | null {
  return currentHouseholdId;
}
function hid(): string {
  if (!currentHouseholdId) throw new Error('No active household');
  return currentHouseholdId;
}

/** Throw on a Supabase error so store mutations can catch + revert. */
function must<T>(res: { data: T; error: unknown | null }): T {
  if (res.error) throw res.error;
  return res.data;
}

// ---- row shapes ----------------------------------------------------------
interface HouseholdRow {
  id: string; currency: string; onboarded: boolean; invite_code: string;
}
interface PersonRow { household_id: string; id: string; name: string }
interface SpaceRow {
  household_id: string; id: string; name: string; short: string | null; sub: string | null;
  grp: Space['group']; icon: string; kind: Space['kind']; cats: Space['cats']; fields: Space['fields'];
  budget: number | null; base_balance: number | null; value: number | null; sort_order: number;
}
interface TxRow {
  household_id: string; id: string; space_id: string; title: string;
  field_values: Record<string, string>; note: string; cat: string; amount: number; date: string;
  payer: string | null; dir: Tx['dir']; status: Tx['status'] | null;
  link_id: string | null; link_space_id: string | null;
}
interface RecurringRow {
  household_id: string; id: string; space_id: string; label: string; cat: string; amount: number;
  remark: string | null;
}
interface SettingsRow {
  household_id: string; theme: Settings['theme']; bill_reminders: boolean;
}

// ---- mappers: row → domain -----------------------------------------------
function toSpace(r: SpaceRow): Space {
  return {
    id: r.id, name: r.name, short: r.short ?? undefined, sub: r.sub ?? undefined,
    group: r.grp, icon: r.icon, kind: r.kind,
    // Normalize any category persisted with the legacy `emoji` field to `icon`.
    cats: (r.cats ?? []).map(migrateLegacyCategory), fields: r.fields ?? [],
    budget: r.budget ?? undefined, baseBalance: r.base_balance ?? undefined,
    value: r.value ?? undefined, sortOrder: r.sort_order,
  };
}
function toTx(r: TxRow): Tx {
  return {
    id: r.id, spaceId: r.space_id, title: r.title, fieldValues: r.field_values ?? {},
    note: r.note ?? '', cat: r.cat, amount: r.amount, date: r.date,
    payer: r.payer ?? undefined, dir: r.dir, status: r.status ?? undefined,
    linkId: r.link_id ?? undefined, linkSpaceId: r.link_space_id ?? undefined,
  };
}
function toRecurring(r: RecurringRow): RecurringItem {
  return { id: r.id, spaceId: r.space_id, label: r.label, cat: r.cat, amount: r.amount, remark: r.remark ?? undefined };
}

// ---- mappers: domain → row (full insert) ---------------------------------
function spaceRow(s: Space): SpaceRow {
  return {
    household_id: hid(), id: s.id, name: s.name, short: s.short ?? null, sub: s.sub ?? null,
    grp: s.group, icon: s.icon, kind: s.kind, cats: s.cats, fields: s.fields,
    budget: s.budget ?? null, base_balance: s.baseBalance ?? null, value: s.value ?? null,
    sort_order: s.sortOrder,
  };
}
function txRow(t: Tx): TxRow {
  return {
    household_id: hid(), id: t.id, space_id: t.spaceId, title: t.title,
    field_values: t.fieldValues ?? {}, note: t.note ?? '', cat: t.cat, amount: t.amount,
    date: t.date, payer: t.payer ?? null, dir: t.dir, status: t.status ?? null,
    link_id: t.linkId ?? null, link_space_id: t.linkSpaceId ?? null,
  };
}
function recurringRow(r: RecurringItem): RecurringRow {
  return { household_id: hid(), id: r.id, space_id: r.spaceId, label: r.label, cat: r.cat, amount: r.amount, remark: r.remark ?? null };
}

// ---- mappers: partial patch → row columns --------------------------------
function spacePatch(p: Partial<Space>): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  if ('name' in p) o.name = p.name;
  if ('short' in p) o.short = p.short ?? null;
  if ('sub' in p) o.sub = p.sub ?? null;
  if ('group' in p) o.grp = p.group;
  if ('icon' in p) o.icon = p.icon;
  if ('kind' in p) o.kind = p.kind;
  if ('cats' in p) o.cats = p.cats;
  if ('fields' in p) o.fields = p.fields;
  if ('budget' in p) o.budget = p.budget ?? null;
  if ('baseBalance' in p) o.base_balance = p.baseBalance ?? null;
  if ('value' in p) o.value = p.value ?? null;
  if ('sortOrder' in p) o.sort_order = p.sortOrder;
  return o;
}
function txPatch(p: Partial<Tx>): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  if ('spaceId' in p) o.space_id = p.spaceId;
  if ('title' in p) o.title = p.title;
  if ('fieldValues' in p) o.field_values = p.fieldValues;
  if ('note' in p) o.note = p.note;
  if ('cat' in p) o.cat = p.cat;
  if ('amount' in p) o.amount = p.amount;
  if ('date' in p) o.date = p.date;
  if ('payer' in p) o.payer = p.payer ?? null;
  if ('dir' in p) o.dir = p.dir;
  if ('status' in p) o.status = p.status ?? null;
  if ('linkId' in p) o.link_id = p.linkId ?? null;
  if ('linkSpaceId' in p) o.link_space_id = p.linkSpaceId ?? null;
  return o;
}

// ---- household RPCs -------------------------------------------------------
/** Create a household + owner membership. Returns the new household row. */
export async function createHousehold(): Promise<HouseholdRow> {
  const data = must(await supabase.rpc('create_household'));
  const row = (Array.isArray(data) ? data[0] : data) as HouseholdRow;
  setCurrentHousehold(row.id);
  return row;
}
/** Join an existing household by invite code. Returns its household row. */
export async function joinHousehold(code: string): Promise<HouseholdRow> {
  const data = must(await supabase.rpc('join_household', { code: code.trim() }));
  const row = (Array.isArray(data) ? data[0] : data) as HouseholdRow;
  setCurrentHousehold(row.id);
  return row;
}
/** The caller's household row, or null when they belong to none. */
export async function myHousehold(): Promise<HouseholdRow | null> {
  const data = must(await supabase.rpc('my_household'));
  const row = (Array.isArray(data) ? data[0] : data) as HouseholdRow | undefined;
  // A composite-returning RPC yields an all-NULL row when the caller has no
  // household — treat a null id as "none".
  return row && row.id ? row : null;
}

// ---- snapshot load -------------------------------------------------------
/** Load every table for the active household into a single Snapshot. */
export async function loadSnapshot(): Promise<Snapshot> {
  const id = hid();
  const [hh, people, spaces, txs, recurring, settings] = await Promise.all([
    supabase.from('households').select('*').eq('id', id).single(),
    supabase.from('people').select('*').eq('household_id', id),
    supabase.from('spaces').select('*').eq('household_id', id).order('sort_order'),
    supabase.from('txs').select('*').eq('household_id', id),
    supabase.from('recurring').select('*').eq('household_id', id),
    supabase.from('settings').select('*').eq('household_id', id).maybeSingle(),
  ]);
  const hhRow = must(hh) as HouseholdRow;
  const peopleRows = (must(people) as PersonRow[]).map<Person>((p) => ({ id: p.id, name: p.name }));
  const settingsRow = must(settings) as SettingsRow | null;

  const household: Household = {
    id: hhRow.id, people: peopleRows, currency: hhRow.currency ?? 'RM',
    onboarded: hhRow.onboarded,
  };
  const settingsObj: Settings = {
    id: SETTINGS_ID,
    theme: settingsRow?.theme ?? 'light',
    billReminders: settingsRow?.bill_reminders ?? true,
    currency: hhRow.currency ?? 'RM',
  };
  return {
    spaces: (must(spaces) as SpaceRow[]).map(toSpace),
    txs: (must(txs) as TxRow[]).map(toTx),
    recurring: (must(recurring) as RecurringRow[]).map(toRecurring),
    household,
    settings: settingsObj,
  };
}

// ---- per-table refetch (realtime handlers) -------------------------------
export async function fetchSpaces(): Promise<Space[]> {
  const r = must(await supabase.from('spaces').select('*').eq('household_id', hid()).order('sort_order'));
  return (r as SpaceRow[]).map(toSpace);
}
export async function fetchTxs(): Promise<Tx[]> {
  const r = must(await supabase.from('txs').select('*').eq('household_id', hid()));
  return (r as TxRow[]).map(toTx);
}
export async function fetchRecurring(): Promise<RecurringItem[]> {
  const r = must(await supabase.from('recurring').select('*').eq('household_id', hid()));
  return (r as RecurringRow[]).map(toRecurring);
}
export async function fetchPeople(): Promise<Person[]> {
  const r = must(await supabase.from('people').select('*').eq('household_id', hid()));
  return (r as PersonRow[]).map((p) => ({ id: p.id, name: p.name }));
}
export async function fetchSettings(): Promise<Pick<Settings, 'theme' | 'billReminders'>> {
  const r = must(await supabase.from('settings').select('*').eq('household_id', hid()).maybeSingle()) as SettingsRow | null;
  return { theme: r?.theme ?? 'light', billReminders: r?.bill_reminders ?? true };
}

// ---- transactions --------------------------------------------------------
export async function addTx(tx: Tx): Promise<void> {
  must(await supabase.from('txs').insert(txRow(tx)));
}
/** Insert several txs in one call (an entry plus its linked fund mirror). */
export async function addTxs(txs: Tx[]): Promise<void> {
  must(await supabase.from('txs').insert(txs.map(txRow)));
}
export async function updateTx(id: string, patch: Partial<Tx>): Promise<void> {
  must(await supabase.from('txs').update(txPatch(patch)).eq('household_id', hid()).eq('id', id));
}
export async function deleteTx(id: string): Promise<void> {
  must(await supabase.from('txs').delete().eq('household_id', hid()).eq('id', id));
}
/** Delete several txs in one call (an entry plus its linked fund mirror). */
export async function deleteTxs(ids: string[]): Promise<void> {
  must(await supabase.from('txs').delete().eq('household_id', hid()).in('id', ids));
}
/**
 * Rewrite the `field_values` map on a batch of entries — used when a custom
 * field is deleted, to strip its now-orphaned value from every entry that
 * carried one. Each entry needs its own value, so these go as parallel updates.
 */
export async function updateTxsFieldValues(
  updates: { id: string; fieldValues: Record<string, string> }[],
): Promise<void> {
  await Promise.all(updates.map((u) => updateTx(u.id, { fieldValues: u.fieldValues })));
}
/**
 * Move every entry in a space that uses `fromCat` onto `toCat` in one write —
 * used when a category is deleted so its entries fall back to "Other" instead
 * of keeping an orphaned key.
 */
export async function reassignCategory(spaceId: string, fromCat: string, toCat: string): Promise<void> {
  must(await supabase.from('txs').update({ cat: toCat }).eq('household_id', hid()).eq('space_id', spaceId).eq('cat', fromCat));
}

// ---- spaces --------------------------------------------------------------
export async function addSpace(space: Space): Promise<void> {
  must(await supabase.from('spaces').insert(spaceRow(space)));
}
export async function updateSpace(id: string, patch: Partial<Space>): Promise<void> {
  must(await supabase.from('spaces').update(spacePatch(patch)).eq('household_id', hid()).eq('id', id));
}
export async function deleteSpace(id: string): Promise<void> {
  const h = hid();
  // Remove the space and everything scoped to it.
  must(await supabase.from('txs').delete().eq('household_id', h).eq('space_id', id));
  must(await supabase.from('recurring').delete().eq('household_id', h).eq('space_id', id));
  must(await supabase.from('spaces').delete().eq('household_id', h).eq('id', id));
}

// ---- recurring -----------------------------------------------------------
export async function addRecurring(item: RecurringItem): Promise<void> {
  must(await supabase.from('recurring').insert(recurringRow(item)));
}
export async function updateRecurring(id: string, patch: Partial<RecurringItem>): Promise<void> {
  const o: Record<string, unknown> = {};
  if ('spaceId' in patch) o.space_id = patch.spaceId;
  if ('label' in patch) o.label = patch.label;
  if ('cat' in patch) o.cat = patch.cat;
  if ('amount' in patch) o.amount = patch.amount;
  if ('remark' in patch) o.remark = patch.remark ?? null;
  must(await supabase.from('recurring').update(o).eq('household_id', hid()).eq('id', id));
}
export async function deleteRecurring(id: string): Promise<void> {
  must(await supabase.from('recurring').delete().eq('household_id', hid()).eq('id', id));
}

// ---- singletons ----------------------------------------------------------
/** Persist household people + currency/onboarded. Ids come from the context. */
export async function saveHousehold(household: Household): Promise<void> {
  const h = hid();
  must(await supabase.from('households').update({
    currency: household.currency, onboarded: household.onboarded,
  }).eq('id', h));
  // Replace the people set (small; simplest reconciliation).
  must(await supabase.from('people').delete().eq('household_id', h));
  if (household.people.length) {
    must(await supabase.from('people').insert(
      household.people.map((p) => ({ household_id: h, id: p.id, name: p.name })),
    ));
  }
}
export async function saveSettings(settings: Settings): Promise<void> {
  must(await supabase.from('settings').upsert({
    household_id: hid(), theme: settings.theme, bill_reminders: settings.billReminders,
  }, { onConflict: 'household_id' }));
}

// ---- lifecycle -----------------------------------------------------------
/** Delete all household DATA (not the household or its memberships). */
export async function resetAll(): Promise<void> {
  const h = hid();
  must(await supabase.from('txs').delete().eq('household_id', h));
  must(await supabase.from('recurring').delete().eq('household_id', h));
  must(await supabase.from('spaces').delete().eq('household_id', h));
  must(await supabase.from('people').delete().eq('household_id', h));
  must(await supabase.from('settings').delete().eq('household_id', h));
  must(await supabase.from('households').update({ onboarded: false }).eq('id', h));
}

// ---- realtime ------------------------------------------------------------
export type RealtimeTable = 'txs' | 'spaces' | 'recurring' | 'settings' | 'people';

/**
 * Subscribe to postgres_changes on this household's tables. `onChange(table)`
 * fires for every insert/update/delete; the caller refetches that table (simple
 * + robust; refetch is idempotent so own-echoes are harmless). Returns an
 * unsubscribe fn.
 */
export function subscribeRealtime(onChange: (table: RealtimeTable) => void): () => void {
  const h = hid();
  const tables: RealtimeTable[] = ['txs', 'spaces', 'recurring', 'settings', 'people'];
  const channel = supabase.channel(`household:${h}`);
  for (const table of tables) {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table, filter: `household_id=eq.${h}` },
      () => onChange(table),
    );
  }
  channel.subscribe();
  return () => { void supabase.removeChannel(channel); };
}

/** Generate a unique id (UUID where available, timestamp+random fallback). */
export function newId(prefix = 'id'): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return `${prefix}-${c.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
