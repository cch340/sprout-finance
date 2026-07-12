// Demo seed — ports the prototype's June 2026 ledger (data.js) into the typed
// model. The prototype's "current" month is mapped onto the real current month;
// five prior months are synthesized so history() returns the same trend shape.

import { DEFAULT_SETTINGS, HOUSEHOLD_ID } from '../domain/types';
import type {
  Category, FieldDef, Household, RecurringItem, Settings, Snapshot, Space, Tx, TxDir, TxStatus,
} from '../domain/types';

// ---- scoped categories & fields (verbatim from data.js) ------------------
const CATS: Record<string, Category[]> = {
  expenses: [
    { key: 'grocery', label: 'Grocery' }, { key: 'meals', label: 'Meals' },
    { key: 'baby', label: 'Baby' }, { key: 'shopping', label: 'Shopping' }, { key: 'other', label: 'Other' },
  ],
  housing: [
    { key: 'installment', label: 'Installment' }, { key: 'electric', label: 'Electric' },
    { key: 'water', label: 'Water' }, { key: 'internet', label: 'Internet' },
    { key: 'maintenance', label: 'Maintenance' }, { key: 'furniture', label: 'Furniture' },
    { key: 'appliance', label: 'Appliance' }, { key: 'other', label: 'Other' },
  ],
  car: [
    { key: 'installment', label: 'Installment' }, { key: 'roadtax', label: 'Road tax + Insurance' },
    { key: 'maintenance', label: 'Maintenance' },
  ],
  investment: [{ key: 'investment', label: 'Investment' }],
  personal: [
    { key: 'income', label: 'Income' }, { key: 'subscriptions', label: 'Subscriptions' },
    { key: 'insurance', label: 'Insurance' }, { key: 'parent', label: 'Parent' },
    { key: 'ptptn', label: 'PTPTN' }, { key: 'mobile', label: 'Mobile Plan' },
    { key: 'petrol', label: 'Petrol' }, { key: 'house', label: 'House' }, { key: 'joint', label: 'Joint Fund' },
  ],
};

const FIELDS: Record<string, FieldDef[]> = {
  expenses: [
    { key: 'vendor', label: 'Store / Vendor', type: 'text', primary: true, placeholder: 'Jaya Grocer' },
    { key: 'location', label: 'Location', type: 'select', options: ['Gurney Plaza', 'Queensbay', 'Aeon · Seberang Jaya', 'Lotus · Bayan Baru', 'Shopee', 'Taobao', 'Online'] },
  ],
  housing: [
    { key: 'vendor', label: 'Bill / Item', type: 'text', primary: true, placeholder: 'Electric Bill' },
    { key: 'provider', label: 'Provider', type: 'select', options: ['TNB', 'PBAPP', 'Time Fibre', 'Maybank', 'Astro'] },
  ],
  car: [
    { key: 'vendor', label: 'Item', type: 'text', primary: true, placeholder: 'Service' },
    { key: 'workshop', label: 'Workshop / Station', type: 'select', options: ['Petronas', 'Shell', 'Perodua SC', 'Toyota SC'] },
  ],
  investment: [
    { key: 'vendor', label: 'Item', type: 'text', primary: true, placeholder: 'Contribution' },
    { key: 'platform', label: 'Platform', type: 'select', options: ['AIA', 'Versa', 'StashAway'] },
  ],
  joint: [{ key: 'vendor', label: 'Description', type: 'text', primary: true }],
  personal: [{ key: 'vendor', label: 'Payee', type: 'text', primary: true }],
};

const SPACES: Space[] = [
  { id: 'expenses', name: 'Everyday Expenses', short: 'Expenses', group: 'shared', icon: 'receipt', kind: 'spend', cats: CATS.expenses, fields: FIELDS.expenses, budget: 1500, sortOrder: 0 },
  { id: 'housing', name: 'Housing', short: 'Housing', sub: 'TreeO', group: 'shared', icon: 'home', kind: 'spend', cats: CATS.housing, fields: FIELDS.housing, budget: 2100, sortOrder: 1 },
  { id: 'car', name: 'Car', short: 'Car', group: 'shared', icon: 'repeat', kind: 'spend', cats: CATS.car, fields: FIELDS.car, budget: 800, sortOrder: 2 },
  { id: 'investment', name: 'Investment', short: 'Invest', sub: 'AIA', group: 'shared', icon: 'trending-up', kind: 'invest', cats: CATS.investment, fields: FIELDS.investment, value: 12480, sortOrder: 3 },
  // baseBalance chosen so live balance = 7134.2 + (1500+1500) - (1450+264.2) = 8420.
  { id: 'joint', name: 'Joint Fund', short: 'Joint', group: 'shared', icon: 'wallet', kind: 'fund', cats: [], fields: FIELDS.joint, baseBalance: 7134.2, sortOrder: 4 },
  { id: 'jc', name: 'JC', group: 'personal', icon: 'user', kind: 'personal', cats: CATS.personal, fields: FIELDS.personal, sortOrder: 5 },
  { id: 'ch', name: 'CH', group: 'personal', icon: 'user', kind: 'personal', cats: CATS.personal, fields: FIELDS.personal, sortOrder: 6 },
];

const RECURRING_SRC: Array<Omit<RecurringItem, 'id'>> = [
  { spaceId: 'housing', label: 'House installment', cat: 'installment', amount: 1450 },
  { spaceId: 'housing', label: 'Electric (avg)', cat: 'electric', amount: 180 },
  { spaceId: 'housing', label: 'Water (avg)', cat: 'water', amount: 60 },
  { spaceId: 'housing', label: 'Internet · Time Fibre', cat: 'internet', amount: 159 },
  { spaceId: 'car', label: 'Myvi installment', cat: 'installment', amount: 545 },
  { spaceId: 'car', label: 'Road tax + insurance (monthly)', cat: 'roadtax', amount: 120 },
  { spaceId: 'investment', label: 'AIA monthly contribution', cat: 'investment', amount: 300 },
  { spaceId: 'joint', label: 'Carry forward from 2025', cat: 'joint', amount: 2100 },
  { spaceId: 'joint', label: 'JC monthly contribution', cat: 'joint', amount: 1500 },
  { spaceId: 'joint', label: 'CH monthly contribution', cat: 'joint', amount: 1500 },
];

// ---- current-month ledger (day numbers map onto the real current month) ---
interface SrcTx {
  spaceId: string; day: number; vendor: string; note: string; cat: string; amount: number;
  dir?: TxDir; payer?: string; status?: TxStatus; fields?: Record<string, string>;
}

const CURRENT_TX: SrcTx[] = [
  // Everyday Expenses
  { spaceId: 'expenses', day: 14, vendor: 'Jaya Grocer', note: 'Grocery, meals', cat: 'grocery', amount: 218.4, payer: 'Joint', fields: { location: 'Gurney Plaza' } },
  { spaceId: 'expenses', day: 12, vendor: 'Shopee', note: 'Diapers, milk, biscuits', cat: 'baby', amount: 143.9, payer: 'CH', fields: { location: 'Online' } },
  { spaceId: 'expenses', day: 11, vendor: 'Aeon', note: 'Milk powder, snacks', cat: 'grocery', amount: 96.3, payer: 'Joint', fields: { location: 'Seberang Jaya' } },
  { spaceId: 'expenses', day: 9, vendor: 'Bes Kopitiam', note: 'Lunch out', cat: 'meals', amount: 88, payer: 'CH', fields: { location: 'Gurney Plaza' } },
  { spaceId: 'expenses', day: 8, vendor: 'Taobao', note: 'Leo shirt, toys', cat: 'baby', amount: 78.5, payer: 'CH', fields: { location: 'Online' } },
  { spaceId: 'expenses', day: 7, vendor: 'Lotus', note: '2 weeks grocery', cat: 'grocery', amount: 264.2, payer: 'Joint', fields: { location: 'Bayan Baru' } },
  { spaceId: 'expenses', day: 5, vendor: 'Jalan Jalan Japan', note: 'Leo clothes', cat: 'shopping', amount: 62, payer: 'CH', fields: { location: 'Queensbay' } },
  // Housing
  { spaceId: 'housing', day: 1, vendor: 'House installment', note: 'Monthly', cat: 'installment', amount: 1450, payer: 'Joint', status: 'paid', fields: { provider: 'Maybank' } },
  { spaceId: 'housing', day: 28, vendor: 'Electric Bill · Jun', note: '', cat: 'electric', amount: 186, payer: 'JC', status: 'due', fields: { provider: 'TNB' } },
  { spaceId: 'housing', day: 30, vendor: 'Water Bill · May–Jun', note: '', cat: 'water', amount: 62.4, payer: 'Joint', status: 'due', fields: { provider: 'PBAPP' } },
  { spaceId: 'housing', day: 5, vendor: 'Internet', note: '500 Mbps', cat: 'internet', amount: 159, payer: 'CH', status: 'paid', fields: { provider: 'Time Fibre' } },
  { spaceId: 'housing', day: 6, vendor: 'Air Purifier filter', note: 'Replacement', cat: 'appliance', amount: 120, payer: 'Joint', status: 'paid', fields: { provider: 'LG' } },
  // Car
  { spaceId: 'car', day: 10, vendor: 'Myvi loan · PQC 9059', note: 'Monthly installment', cat: 'installment', amount: 545, payer: 'JC', status: 'paid', fields: { workshop: 'Maybank' } },
  { spaceId: 'car', day: 18, vendor: 'Alza service', note: 'Maintenance', cat: 'maintenance', amount: 235, payer: 'JC', status: 'paid', fields: { workshop: 'Perodua SC' } },
  // Investment
  { spaceId: 'investment', day: 15, vendor: 'AIA contribution', note: 'Monthly', cat: 'investment', amount: 300, payer: 'Joint', status: 'paid', fields: { platform: 'AIA' } },
  // Joint Fund
  { spaceId: 'joint', day: 1, vendor: 'JC contribution', note: 'Monthly top-up', cat: 'joint', amount: 1500, payer: 'JC', dir: 'in' },
  { spaceId: 'joint', day: 1, vendor: 'CH contribution', note: 'Monthly top-up', cat: 'joint', amount: 1500, payer: 'CH', dir: 'in' },
  { spaceId: 'joint', day: 1, vendor: 'House installment', note: 'Paid from fund', cat: 'house', amount: 1450, payer: 'Joint', dir: 'out' },
  { spaceId: 'joint', day: 7, vendor: 'Groceries (Lotus)', note: 'Paid from fund', cat: 'grocery', amount: 264.2, payer: 'Joint', dir: 'out' },
  // JC personal
  { spaceId: 'jc', day: 25, vendor: 'Nett Salary', note: 'June', cat: 'income', amount: 6117, dir: 'in' },
  { spaceId: 'jc', day: 1, vendor: 'Joint Fund', note: 'Monthly top-up', cat: 'joint', amount: 1500, dir: 'out' },
  { spaceId: 'jc', day: 18, vendor: 'AIA', note: 'Insurance', cat: 'insurance', amount: 220, dir: 'out' },
  { spaceId: 'jc', day: 12, vendor: 'PTPTN', note: 'Study loan', cat: 'ptptn', amount: 220, dir: 'out' },
  { spaceId: 'jc', day: 20, vendor: 'Google AI Pro', note: 'Subscription', cat: 'subscriptions', amount: 97, dir: 'out' },
  { spaceId: 'jc', day: 12, vendor: 'YouTube Premium', note: 'Subscription', cat: 'subscriptions', amount: 17.9, dir: 'out' },
  { spaceId: 'jc', day: 10, vendor: 'Petronas', note: 'Petrol', cat: 'petrol', amount: 235, dir: 'out' },
  { spaceId: 'jc', day: 8, vendor: 'Hotlink', note: 'Mobile plan', cat: 'mobile', amount: 30, dir: 'out' },
  { spaceId: 'jc', day: 5, vendor: 'Parents', note: 'Monthly', cat: 'parent', amount: 500, dir: 'out' },
  // CH personal
  { spaceId: 'ch', day: 25, vendor: 'Nett Salary', note: 'June', cat: 'income', amount: 6600, dir: 'in' },
  { spaceId: 'ch', day: 1, vendor: 'Joint Fund', note: 'Monthly top-up', cat: 'joint', amount: 1500, dir: 'out' },
  { spaceId: 'ch', day: 18, vendor: 'Allianz', note: 'Insurance', cat: 'insurance', amount: 180, dir: 'out' },
  { spaceId: 'ch', day: 14, vendor: 'Apple One', note: 'Subscription', cat: 'subscriptions', amount: 34.9, dir: 'out' },
  { spaceId: 'ch', day: 3, vendor: 'Sinaran Rental', note: 'House', cat: 'house', amount: 450, dir: 'out' },
  { spaceId: 'ch', day: 8, vendor: 'Hotlink', note: 'Mobile plan', cat: 'mobile', amount: 30, dir: 'out' },
  { spaceId: 'ch', day: 5, vendor: 'Parents', note: 'Monthly', cat: 'parent', amount: 300, dir: 'out' },
];

// Prior-month totals from data.js history[] (oldest → most recent before now).
const HISTORY_TOTALS = [4310, 3980, 4620, 4180, 4980];
// Split each prior total across spend spaces in current-month proportions.
const SPLIT: Array<{ spaceId: string; cat: string; ratio: number }> = [
  { spaceId: 'expenses', cat: 'grocery', ratio: 951.3 / 3708.7 },
  { spaceId: 'housing', cat: 'installment', ratio: 1977.4 / 3708.7 },
  { spaceId: 'car', cat: 'installment', ratio: 780 / 3708.7 },
];

function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

function isoFor(year: number, month0: number, day: number): string {
  const d = Math.min(day, daysInMonth(year, month0));
  const m = String(month0 + 1).padStart(2, '0');
  return `${year}-${m}-${String(d).padStart(2, '0')}`;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Build a full demo Snapshot. `ref` sets the "current" month (defaults to now);
 * exposed so tests can pin it deterministically.
 */
export function buildSeed(ref: Date = new Date()): Snapshot {
  const curYear = ref.getFullYear();
  const curMonth0 = ref.getMonth();
  const txs: Tx[] = [];
  let seq = 0;
  const nextId = () => `seed-${++seq}`;

  // Current-month ledger.
  for (const s of CURRENT_TX) {
    txs.push({
      id: nextId(),
      spaceId: s.spaceId,
      title: s.vendor,
      fieldValues: { vendor: s.vendor, ...(s.fields ?? {}) },
      note: s.note,
      cat: s.cat,
      amount: s.amount,
      date: isoFor(curYear, curMonth0, s.day),
      payer: s.payer,
      dir: s.dir ?? 'out',
      status: s.status,
    });
  }

  // Synthetic prior months (one aggregate tx per spend space per month).
  HISTORY_TOTALS.forEach((total, idx) => {
    const back = HISTORY_TOTALS.length - idx; // 5..1 months before current
    const d = new Date(curYear, curMonth0 - back, 1);
    const y = d.getFullYear();
    const m0 = d.getMonth();
    for (const part of SPLIT) {
      txs.push({
        id: nextId(),
        spaceId: part.spaceId,
        title: 'Monthly total',
        fieldValues: { vendor: 'Monthly total' },
        note: 'Historical aggregate',
        cat: part.cat,
        amount: round2(total * part.ratio),
        date: isoFor(y, m0, 15),
        payer: 'Joint',
        dir: 'out',
      });
    }
  });

  const recurring: RecurringItem[] = RECURRING_SRC.map((r, i) => ({ id: `rec-${i + 1}`, ...r }));

  const household: Household = {
    id: HOUSEHOLD_ID,
    people: [
      { id: 'jc', name: 'JC' },
      { id: 'ch', name: 'CH' },
      { id: 'leo', name: 'Leo' },
    ],
    currency: 'RM',
    onboarded: true,
  };

  const settings: Settings = { ...DEFAULT_SETTINGS };

  return { spaces: SPACES.map((s) => ({ ...s })), txs, recurring, household, settings };
}
