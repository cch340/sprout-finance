// Real-data seed — built from the user's Financial_Report_2026.xlsx by
// `scripts/convert-sheet.py`, which emits `seed-sheet.json` (checked in). This
// loader types that JSON into the same `Snapshot` shape the demo seed produces.
//
// The app's "Load demo data" actions (Settings, onboarding, `?demo`) load THIS
// seed via `repo.seedDemo`. `seed-demo.ts` is kept intact as the unit-test
// fixture (selectors.test.ts asserts its totals) — do not wire it into the app.
//
// Space definitions (cats/fields/icons) are reused verbatim from the shared
// SPACE_TEMPLATES so the seeded spaces never drift from the onboarding flow;
// only budget / baseBalance / value are overridden from the sheet.

import { DEFAULT_SETTINGS, HOUSEHOLD_ID } from '../domain/types';
import type {
  Household, RecurringItem, Settings, Snapshot, Space, Tx,
} from '../domain/types';
import { SPACE_TEMPLATES, personalSpace, templateToSpace } from './seed-demo';
import raw from './seed-sheet.json';

interface SpaceOverride {
  budget?: number;
  baseBalance?: number;
  value?: number;
}

interface SheetSeed {
  spaceOverrides: Record<string, SpaceOverride>;
  household: { people: { id: string; name: string }[]; currency: string; onboarded: boolean };
  recurring: Array<Omit<RecurringItem, 'id'>>;
  txs: Tx[];
}

const seed = raw as unknown as SheetSeed;

/**
 * Build the real-data Snapshot. `ref` is accepted for signature-compatibility
 * with the demo seed but ignored: this seed uses the spreadsheet's real ISO
 * dates (multi-year history) rather than mapping onto the current month.
 */
export function buildSheetSeed(_ref: Date = new Date()): Snapshot {
  const spaces: Space[] = [
    ...SPACE_TEMPLATES.map((t, i) => {
      const s = templateToSpace(t, i);
      const o = seed.spaceOverrides[t.id];
      if (o) {
        if (o.budget !== undefined) s.budget = o.budget;
        if (o.baseBalance !== undefined) s.baseBalance = o.baseBalance;
        if (o.value !== undefined) s.value = o.value;
      }
      return s;
    }),
    personalSpace('jc', 'JC', SPACE_TEMPLATES.length),
    personalSpace('ch', 'CH', SPACE_TEMPLATES.length + 1),
  ];

  const recurring: RecurringItem[] = seed.recurring.map((r, i) => ({
    id: `sheet-rec-${i + 1}`,
    ...r,
  }));

  const txs: Tx[] = seed.txs.map((t) => ({ ...t }));

  const household: Household = {
    id: HOUSEHOLD_ID,
    people: seed.household.people,
    currency: seed.household.currency,
    onboarded: seed.household.onboarded,
  };

  const settings: Settings = { ...DEFAULT_SETTINGS };

  return { spaces, txs, recurring, household, settings };
}
