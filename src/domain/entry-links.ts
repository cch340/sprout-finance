// Pure reconciliation logic for "paid from a fund" entry links.
//
// A spend/personal entry ("origin") optionally pairs with a mirror `dir:'out'`
// tx in a fund's ledger (both share `linkId`; the origin's `linkSpaceId` points
// at the fund, the mirror's at the origin space). These helpers compute, without
// touching Dexie or the store, how the mirror must change when an entry is
// edited or deleted — so the fund balance stays a single source of truth.

import type { Space, Tx, TxDir } from './types';

/** The editable fields carried by an entry edit (from AddEntryDialog). */
export interface EntryEdit {
  amount: number;
  date: string;
  cat: string;
  fieldValues: Record<string, string>;
  note: string;
  dir: TxDir;
  payer?: string;
  title: string;
  /** Target fund id chosen in "Paid from", or undefined when not fund-paid. */
  paidFromFundId?: string;
}

/** What must happen to the mirror row as a result of an edit. */
export interface MirrorAction {
  kind: 'none' | 'create' | 'update' | 'delete';
  /** For 'create' — the full new mirror tx to insert. */
  create?: Tx;
  /** For 'update'/'delete' — the existing mirror's id. */
  id?: string;
  /** For 'update' — the fields to patch on the existing mirror. */
  patch?: Partial<Tx>;
  /** For 'create' after a fund change — the stale mirror id to remove first. */
  removeId?: string;
}

export interface EntryUpdatePlan {
  originPatch: Partial<Tx>;
  mirror: MirrorAction;
}

/** Find an origin tx's paired mirror (the other row sharing its linkId). */
export function findMirror(origin: Tx, txs: Tx[]): Tx | undefined {
  if (!origin.linkId) return undefined;
  return txs.find((t) => t.id !== origin.id && t.linkId === origin.linkId);
}

/**
 * Resolve the fund a "Paid from" choice targets, guarding against a fund paying
 * from itself and against non-fund spaces. Returns undefined when not fund-paid.
 */
export function resolvePaidFromFund(
  fundId: string | undefined,
  originSpaceId: string,
  spaces: Space[],
): Space | undefined {
  if (!fundId) return undefined;
  return spaces.find((s) => s.id === fundId && s.kind === 'fund' && s.id !== originSpaceId);
}

/** Build the mirror row for a fund-paid entry (shared by add + edit). */
export function buildMirror(
  id: string,
  linkId: string,
  fund: Space,
  origin: { spaceId: string; title: string; amount: number; date: string },
  originSpaceName: string,
): Tx {
  return {
    id,
    spaceId: fund.id,
    title: origin.title,
    fieldValues: {},
    note: `Paid from fund · ${originSpaceName}`,
    cat: fund.cats[0]?.key ?? 'other',
    amount: origin.amount,
    date: origin.date,
    dir: 'out',
    linkId,
    linkSpaceId: origin.spaceId,
  };
}

/**
 * Plan an entry edit: the patch for the origin tx plus the action needed on its
 * fund mirror (create / update / delete / none) so the fund balance reconciles.
 * Pure — the caller supplies a pre-generated id for any new mirror.
 */
export function planEntryUpdate(
  origin: Tx,
  mirror: Tx | undefined,
  edit: EntryEdit,
  originSpaceName: string,
  fund: Space | undefined,
  newMirrorId: string,
): EntryUpdatePlan {
  // Reuse the existing link id when the entry was already fund-paired so both
  // rows keep the same linkId; otherwise the origin's own id becomes the link.
  const linkId = fund ? origin.linkId ?? origin.id : undefined;

  const originPatch: Partial<Tx> = {
    amount: edit.amount,
    date: edit.date,
    cat: edit.cat,
    fieldValues: edit.fieldValues,
    note: edit.note,
    dir: edit.dir,
    payer: edit.payer,
    title: edit.title,
    linkId,
    linkSpaceId: fund ? fund.id : undefined,
  };

  let mirrorAction: MirrorAction = { kind: 'none' };
  if (fund && mirror && mirror.spaceId === fund.id) {
    // Same fund — keep the row, refresh amount/date/title (note keeps its space label).
    mirrorAction = {
      kind: 'update',
      id: mirror.id,
      patch: { amount: edit.amount, date: edit.date, title: edit.title },
    };
  } else if (fund && mirror) {
    // Fund changed — drop the old mirror, create a fresh one in the new fund.
    mirrorAction = {
      kind: 'create',
      removeId: mirror.id,
      create: buildMirror(
        newMirrorId,
        linkId as string,
        fund,
        { spaceId: origin.spaceId, title: edit.title, amount: edit.amount, date: edit.date },
        originSpaceName,
      ),
    };
  } else if (fund && !mirror) {
    mirrorAction = {
      kind: 'create',
      create: buildMirror(
        newMirrorId,
        linkId as string,
        fund,
        { spaceId: origin.spaceId, title: edit.title, amount: edit.amount, date: edit.date },
        originSpaceName,
      ),
    };
  } else if (!fund && mirror) {
    mirrorAction = { kind: 'delete', id: mirror.id };
  }

  return { originPatch, mirror: mirrorAction };
}
