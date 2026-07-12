// Sprout sample data — SPACES model (user-configurable), grounded in the
// couple's real sheet (RM, JC/CH/Leo, June 2026).
//
// Reworked for the interactive prototype: `totalSpent` and `budget` are LIVE
// getters, and `addTx()` mutates the ledger so adding an entry updates every
// roll-up on the next render.
(function () {
  const CATS = {
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

  const FIELDS = {
    expenses:   [{ key: 'vendor', label: 'Store / Vendor', type: 'text', primary: true, placeholder: 'Jaya Grocer' },
                 { key: 'location', label: 'Location', type: 'select', options: ['Gurney Plaza', 'Queensbay', 'Aeon · Seberang Jaya', 'Lotus · Bayan Baru', 'Shopee', 'Taobao', 'Online'] }],
    housing:    [{ key: 'vendor', label: 'Bill / Item', type: 'text', primary: true, placeholder: 'Electric Bill' },
                 { key: 'provider', label: 'Provider', type: 'select', options: ['TNB', 'PBAPP', 'Time Fibre', 'Maybank', 'Astro'] }],
    car:        [{ key: 'vendor', label: 'Item', type: 'text', primary: true, placeholder: 'Service' },
                 { key: 'workshop', label: 'Workshop / Station', type: 'select', options: ['Petronas', 'Shell', 'Perodua SC', 'Toyota SC'] }],
    investment: [{ key: 'vendor', label: 'Item', type: 'text', primary: true, placeholder: 'Contribution' },
                 { key: 'platform', label: 'Platform', type: 'select', options: ['AIA', 'Versa', 'StashAway'] }],
    joint:      [{ key: 'vendor', label: 'Description', type: 'text', primary: true }],
    personal:   [{ key: 'vendor', label: 'Payee', type: 'text', primary: true }],
  };

  const spaces = [
    {
      id: 'expenses', name: 'Everyday Expenses', short: 'Expenses', group: 'shared',
      icon: 'receipt', kind: 'spend', cats: CATS.expenses, fields: FIELDS.expenses, budget: 1500,
      tx: [
        { id: 1, vendor: 'Jaya Grocer', location: 'Gurney Plaza', note: 'Grocery, meals', cat: 'grocery', amount: 218.4, date: '14 Jun', payer: 'Joint' },
        { id: 2, vendor: 'Shopee', location: 'Online', note: 'Diapers, milk, biscuits', cat: 'baby', amount: 143.9, date: '12 Jun', payer: 'CH' },
        { id: 3, vendor: 'Aeon', location: 'Seberang Jaya', note: 'Milk powder, snacks', cat: 'grocery', amount: 96.3, date: '11 Jun', payer: 'Joint' },
        { id: 4, vendor: 'Bes Kopitiam', location: 'Gurney Plaza', note: 'Lunch out', cat: 'meals', amount: 88.0, date: '9 Jun', payer: 'CH' },
        { id: 5, vendor: 'Taobao', location: 'Online', note: 'Leo shirt, toys', cat: 'baby', amount: 78.5, date: '8 Jun', payer: 'CH' },
        { id: 6, vendor: 'Lotus', location: 'Bayan Baru', note: '2 weeks grocery', cat: 'grocery', amount: 264.2, date: '7 Jun', payer: 'Joint' },
        { id: 7, vendor: 'Jalan Jalan Japan', location: 'Queensbay', note: 'Leo clothes', cat: 'shopping', amount: 62.0, date: '5 Jun', payer: 'CH' },
      ],
    },
    {
      id: 'housing', name: 'Housing', short: 'Housing', sub: 'TreeO', group: 'shared',
      icon: 'home', kind: 'spend', cats: CATS.housing, fields: FIELDS.housing, budget: 2100,
      recurring: [
        { label: 'House installment', cat: 'installment', amount: 1450.0 },
        { label: 'Electric (avg)', cat: 'electric', amount: 180.0 },
        { label: 'Water (avg)', cat: 'water', amount: 60.0 },
        { label: 'Internet · Time Fibre', cat: 'internet', amount: 159.0 },
      ],
      tx: [
        { id: 1, vendor: 'House installment', provider: 'Maybank', note: 'Monthly', cat: 'installment', amount: 1450.0, date: '1 Jun', payer: 'Joint', status: 'paid' },
        { id: 2, vendor: 'Electric Bill · Jun', provider: 'TNB', note: '', cat: 'electric', amount: 186.0, date: '28 Jun', payer: 'JC', status: 'due' },
        { id: 3, vendor: 'Water Bill · May–Jun', provider: 'PBAPP', note: '', cat: 'water', amount: 62.4, date: '30 Jun', payer: 'Joint', status: 'due' },
        { id: 4, vendor: 'Internet', provider: 'Time Fibre', note: '500 Mbps', cat: 'internet', amount: 159.0, date: '5 Jun', payer: 'CH', status: 'paid' },
        { id: 5, vendor: 'Air Purifier filter', provider: 'LG', note: 'Replacement', cat: 'appliance', amount: 120.0, date: '6 Jun', payer: 'Joint', status: 'paid' },
      ],
    },
    {
      id: 'car', name: 'Car', short: 'Car', group: 'shared',
      icon: 'repeat', kind: 'spend', cats: CATS.car, fields: FIELDS.car, budget: 800,
      recurring: [
        { label: 'Myvi installment', cat: 'installment', amount: 545.0 },
        { label: 'Road tax + insurance (monthly)', cat: 'roadtax', amount: 120.0 },
      ],
      tx: [
        { id: 1, vendor: 'Myvi loan · PQC 9059', workshop: 'Maybank', note: 'Monthly installment', cat: 'installment', amount: 545.0, date: '10 Jun', payer: 'JC', status: 'paid' },
        { id: 2, vendor: 'Alza service', workshop: 'Perodua SC', note: 'Maintenance', cat: 'maintenance', amount: 235.0, date: '18 Jun', payer: 'JC', status: 'paid' },
      ],
    },
    {
      id: 'investment', name: 'Investment', short: 'Invest', sub: 'AIA', group: 'shared',
      icon: 'trending-up', kind: 'invest', cats: CATS.investment, fields: FIELDS.investment, value: 12480.0,
      recurring: [
        { label: 'AIA monthly contribution', cat: 'investment', amount: 300.0 },
      ],
      tx: [
        { id: 1, vendor: 'AIA contribution', platform: 'AIA', note: 'Monthly', cat: 'investment', amount: 300.0, date: '15 Jun', payer: 'Joint', status: 'paid' },
      ],
    },
    {
      id: 'joint', name: 'Joint Fund', short: 'Joint', group: 'shared',
      icon: 'wallet', kind: 'fund', cats: [], fields: FIELDS.joint, balance: 8420.0, carry: 2100.0,
      recurring: [
        { label: 'Carry forward from 2025', cat: 'joint', amount: 2100.0 },
        { label: 'JC monthly contribution', cat: 'joint', amount: 1500.0 },
        { label: 'CH monthly contribution', cat: 'joint', amount: 1500.0 },
      ],
      tx: [
        { id: 1, vendor: 'JC contribution', note: 'Monthly top-up', cat: 'joint', amount: 1500.0, date: '1 Jun', payer: 'JC', dir: 'in' },
        { id: 2, vendor: 'CH contribution', note: 'Monthly top-up', cat: 'joint', amount: 1500.0, date: '1 Jun', payer: 'CH', dir: 'in' },
        { id: 3, vendor: 'House installment', note: 'Paid from fund', cat: 'house', amount: 1450.0, date: '1 Jun', payer: 'Joint', dir: 'out' },
        { id: 4, vendor: 'Groceries (Lotus)', note: 'Paid from fund', cat: 'grocery', amount: 264.2, date: '7 Jun', payer: 'Joint', dir: 'out' },
      ],
    },
  ];

  const personal = {
    jc: {
      id: 'jc', name: 'JC', group: 'personal', cats: CATS.personal, fields: FIELDS.personal, income: 6117.0,
      tx: [
        { id: 1, vendor: 'Nett Salary', note: 'June', cat: 'income', amount: 6117.0, date: '25 Jun', dir: 'in' },
        { id: 2, vendor: 'Joint Fund', note: 'Monthly top-up', cat: 'joint', amount: 1500.0, date: '1 Jun', dir: 'out' },
        { id: 3, vendor: 'AIA', note: 'Insurance', cat: 'insurance', amount: 220.0, date: '18 Jun', dir: 'out' },
        { id: 4, vendor: 'PTPTN', note: 'Study loan', cat: 'ptptn', amount: 220.0, date: '12 Jun', dir: 'out' },
        { id: 5, vendor: 'Google AI Pro', note: 'Subscription', cat: 'subscriptions', amount: 97.0, date: '20 Jun', dir: 'out' },
        { id: 6, vendor: 'YouTube Premium', note: 'Subscription', cat: 'subscriptions', amount: 17.9, date: '12 Jun', dir: 'out' },
        { id: 7, vendor: 'Petronas', note: 'Petrol', cat: 'petrol', amount: 235.0, date: '10 Jun', dir: 'out' },
        { id: 8, vendor: 'Hotlink', note: 'Mobile plan', cat: 'mobile', amount: 30.0, date: '8 Jun', dir: 'out' },
        { id: 9, vendor: 'Parents', note: 'Monthly', cat: 'parent', amount: 500.0, date: '5 Jun', dir: 'out' },
      ],
    },
    ch: {
      id: 'ch', name: 'CH', group: 'personal', cats: CATS.personal, fields: FIELDS.personal, income: 6600.0,
      tx: [
        { id: 1, vendor: 'Nett Salary', note: 'June', cat: 'income', amount: 6600.0, date: '25 Jun', dir: 'in' },
        { id: 2, vendor: 'Joint Fund', note: 'Monthly top-up', cat: 'joint', amount: 1500.0, date: '1 Jun', dir: 'out' },
        { id: 3, vendor: 'Allianz', note: 'Insurance', cat: 'insurance', amount: 180.0, date: '18 Jun', dir: 'out' },
        { id: 4, vendor: 'Apple One', note: 'Subscription', cat: 'subscriptions', amount: 34.9, date: '14 Jun', dir: 'out' },
        { id: 5, vendor: 'Sinaran Rental', note: 'House', cat: 'house', amount: 450.0, date: '3 Jun', dir: 'out' },
        { id: 6, vendor: 'Hotlink', note: 'Mobile plan', cat: 'mobile', amount: 30.0, date: '8 Jun', dir: 'out' },
        { id: 7, vendor: 'Parents', note: 'Monthly', cat: 'parent', amount: 300.0, date: '5 Jun', dir: 'out' },
      ],
    },
  };

  const history = [
    { m: 'Jan', v: 4310 }, { m: 'Feb', v: 3980 }, { m: 'Mar', v: 4620 },
    { m: 'Apr', v: 4180 }, { m: 'May', v: 4980 }, { m: 'Jun', v: 3708.7 },
  ];

  const spaceIcons = ['receipt', 'home', 'repeat', 'trending-up', 'wallet', 'target', 'pie-chart', 'banknote', 'credit-card', 'tag'];

  // ---- helpers (defined before the export so getters can use them) ---------
  const findSpace = (id) => spaces.find((s) => s.id === id);
  const spentOf = (sp) => sp.tx.filter((t) => t.dir !== 'in').reduce((s, t) => s + (t.dir === 'out' && sp.kind === 'fund' ? 0 : t.amount), 0);
  const DOMAIN = ['expenses', 'housing', 'car'];
  const domainSpend = () => DOMAIN.reduce((s, id) => s + spentOf(findSpace(id)), 0);
  const totalBudget = DOMAIN.reduce((s, id) => s + (findSpace(id).budget || 0), 0);
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

  function spendByPerson() {
    const out = { JC: 0, CH: 0, Joint: 0 };
    DOMAIN.forEach((id) => {
      findSpace(id).tx.forEach((t) => { if (out[t.payer] != null) out[t.payer] += t.amount; });
    });
    return out;
  }
  function spendBySpace() {
    return DOMAIN.map((id) => {
      const s = findSpace(id);
      return { id, name: s.name, short: s.short, icon: s.icon, value: spentOf(s) };
    });
  }
  function topCategories() {
    const agg = {};
    DOMAIN.forEach((id) => {
      const s = findSpace(id);
      s.tx.forEach((t) => {
        const label = (s.cats.find((c) => c.key === t.cat) || {}).label || t.cat;
        const k = t.cat + '|' + label;
        agg[k] = (agg[k] || 0) + t.amount;
      });
    });
    return Object.entries(agg).map(([k, v]) => ({ cat: k.split('|')[0], label: k.split('|')[1], value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 5);
  }

  // ---- live mutation: add an entry, updating the ledger in place ----------
  let seq = 1000;
  function addTx(entry) {
    const sid = entry.space;
    const isPersonal = sid === 'jc' || sid === 'ch';
    const target = isPersonal ? personal[sid] : findSpace(sid);
    if (!target) return null;
    const extra = {};
    ['vendor', 'location', 'provider', 'workshop', 'platform'].forEach((k) => { if (entry[k]) extra[k] = entry[k]; });
    const payerMap = { joint: 'Joint', jc: 'JC', ch: 'CH' };
    const tx = {
      id: ++seq,
      vendor: extra.vendor || entry.note || cap(entry.cat) || 'Entry',
      ...extra,
      note: entry.note || '',
      cat: entry.cat || 'other',
      amount: parseFloat(entry.amount) || 0,
      date: 'Today',
    };
    if (isPersonal) {
      tx.dir = 'out';
    } else {
      tx.payer = payerMap[entry.payer] || 'Joint';
      if (target.kind === 'fund') tx.dir = 'out';
    }
    target.tx.unshift(tx);
    return tx;
  }

  window.SproutData = {
    monthLabel: 'June 2026', lastMonthSpend: 4980,
    get budget() { return totalBudget; },
    get totalSpent() { return domainSpend(); },
    spaces, personal, history, spaceIcons,
    spentOf, space: findSpace,
    spendByPerson, spendBySpace, topCategories, addTx,
    secondaryFields: (sp) => (sp.fields || []).filter((f) => !f.primary),
  };
})();
