// AUTO-GENERATED bundle — edit sources in sprout/src/ and re-concatenate.

// ===== data.js =====
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
      tx.dir = entry.dir === 'in' ? 'in' : 'out';
    } else {
      tx.payer = payerMap[entry.payer] || 'Joint';
      if (entry.dir === 'in') tx.dir = 'in';
      else if (target.kind === 'fund') tx.dir = 'out';
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


// ===== Home.jsx =====
// Home — a roll-up across every space.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { StatCard, Card, ListRow, Amount, Badge, CategoryIcon, Avatar, Icon } = K;
  const D = window.SproutData;

  const SAGE = { color: 'var(--sage-700)' }; // balances read in sage, not stark black

  function SectionHead({ title, action, onAction }) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 4px 10px' }}>
        <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
        {action && <button onClick={onAction} style={{ border: 'none', background: 'none', font: 'var(--font-label)', color: 'var(--text-accent)', cursor: 'pointer' }}>{action}</button>}
      </div>
    );
  }

  window.HomeScreen = function HomeScreen({ goSpace, goTo }) {
    const shared = D.spaces.filter((s) => s.group === 'shared');
    const spendSpaces = shared.filter((s) => s.kind === 'spend');
    const joint = D.space('joint');
    const invest = D.space('invest') || D.space('investment');
    const left = D.budget - D.totalSpent;
    const recent = D.space('expenses').tx.slice(0, 3);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Good evening, JC 🌿</div>
            <div style={{ font: 'var(--font-h2)', color: 'var(--text-strong)' }}>{D.monthLabel}</div>
          </div>
          <div style={{ display: 'flex', marginRight: 6 }}>
            <Avatar name="JC" size={34} style={{ boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
            <Avatar name="CH" size={34} style={{ marginLeft: -10, boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
            <Avatar name="Leo" size={34} style={{ marginLeft: -10, boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
          </div>
        </div>

        {/* hero total across domains */}
        <Card padding="lg" style={{ background: 'var(--accent)', border: 'none' }}>
          <span style={{ font: 'var(--font-label)', color: 'rgba(255,255,255,0.85)' }}>Total spent · Everyday + Housing + Car</span>
          <Amount value={D.totalSpent} size="hero" style={{ color: '#fff', display: 'block', marginTop: 6 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 16 }}>
            <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-semibold)', color: '#fff' }}>RM {Math.round(left).toLocaleString()} left</span>
            <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.8)' }}>of RM {D.budget.toLocaleString()} budget</span>
          </div>
          <div style={{ display: 'flex', gap: 3, height: 8, borderRadius: 'var(--radius-pill)', overflow: 'hidden', background: 'rgba(255,255,255,0.22)' }}>
            {spendSpaces.map((s, i) => (
              <span key={s.id} style={{ width: `${(D.spentOf(s) / D.totalSpent) * 100}%`, background: `rgba(255,255,255,${[0.95, 0.66, 0.4][i]})` }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            {spendSpaces.map((s) => (
              <span key={s.id} style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.85)', fontWeight: 'var(--fw-medium)' }}>{s.short} {Math.round((D.spentOf(s) / D.totalSpent) * 100)}%</span>
            ))}
          </div>
        </Card>

        {/* balances */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <StatCard label="Joint Fund" value={joint.balance} icon="wallet" footer="Shared balance" amountProps={{ style: SAGE }} />
          <StatCard label="Investment · AIA" value={invest.value} icon="trending-up" footer="Portfolio value" amountProps={{ style: SAGE }} />
        </div>

        {/* spaces */}
        <div>
          <SectionHead title="Spaces" action="Manage" onAction={() => goTo('spaces')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {D.spaces.filter((s) => s.kind === 'spend').map((s) => (
              <Card key={s.id} interactive padding="sm" onClick={() => goSpace(s.id)}>
                <ListRow
                  leading={<span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={s.icon} size={20} /></span>}
                  title={s.name}
                  subtitle={s.sub ? s.sub : `${s.tx.length} entries`}
                  trailing={<Amount value={D.spentOf(s)} />}
                  meta={s.budget ? `of RM ${s.budget.toLocaleString()}` : 'this month'}
                  chevron
                />
              </Card>
            ))}
          </div>
        </div>

        {/* recent everyday */}
        <div>
          <SectionHead title="Recent activity" action="See all" onAction={() => goSpace('expenses')} />
          <Card padding="sm">
            {recent.map((e, i) => (
              <ListRow key={e.id}
                leading={<CategoryIcon category={e.cat} />}
                title={e.vendor} subtitle={`${e.note} · ${e.payer}`}
                trailing={<Amount value={e.amount} />} meta={e.date}
                divider={i < recent.length - 1} />
            ))}
          </Card>
        </div>
      </div>
    );
  };
})();


// ===== Spaces.jsx =====
// Spaces — the launcher listing every space, grouped Shared / Personal.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Card, ListRow, Amount, Icon, Avatar, Button } = K;
  const D = window.SproutData;

  const tile = (icon) => (
    <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={20} />
    </span>
  );

  function valueFor(s) {
    if (s.kind === 'fund') return { v: s.balance, label: 'balance' };
    if (s.kind === 'invest') return { v: s.value, label: 'value' };
    return { v: D.spentOf(s), label: 'this month' };
  }

  window.SpacesScreen = function SpacesScreen({ goSpace, goPersonal, onNewSpace }) {
    const shared = D.spaces.filter((s) => s.group === 'shared');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{D.monthLabel}</div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>Spaces</h2>
          </div>
          <Button variant="soft" size="sm" iconStart="plus" onClick={onNewSpace}>New space</Button>
        </div>

        <div>
          <div style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)', margin: '0 4px 8px' }}>Shared</div>
          <Card padding="sm">
            {shared.map((s, i) => {
              const val = valueFor(s);
              const budgeted = s.kind === 'spend' && s.budget;
              const pct = budgeted ? Math.min(100, (D.spentOf(s) / s.budget) * 100) : 0;
              const over = budgeted && D.spentOf(s) > s.budget;
              const meta = budgeted ? (
                <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                  <span style={{ whiteSpace: 'nowrap', color: over ? 'var(--money-over)' : 'var(--text-muted)' }}>{Math.round((D.spentOf(s) / s.budget) * 100)}% of RM {s.budget.toLocaleString()}</span>
                  <span style={{ width: 68, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-200)', overflow: 'hidden', display: 'block' }}>
                    <span style={{ display: 'block', height: '100%', width: pct + '%', borderRadius: 'var(--radius-pill)', background: over ? 'var(--money-over)' : 'var(--sage-400)' }} />
                  </span>
                </span>
              ) : val.label;
              return (
                <ListRow key={s.id} leading={tile(s.icon)} title={s.name}
                  subtitle={s.sub || `${s.tx.length} entries`}
                  trailing={<Amount value={val.v} />} meta={meta}
                  chevron onClick={() => goSpace(s.id)} divider={i < shared.length - 1} />
              );
            })}
          </Card>
        </div>

        <div>
          <div style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)', margin: '0 4px 8px' }}>Personal</div>
          <Card padding="sm">
            {['jc', 'ch'].map((pid, i) => {
              const p = D.personal[pid];
              const spent = p.tx.filter((t) => t.dir === 'out').reduce((a, t) => a + t.amount, 0);
              const pIncome = p.tx.filter((t) => t.dir === 'in').reduce((a, t) => a + t.amount, 0);
              return (
                <ListRow key={pid} leading={<Avatar name={p.name} size={40} />}
                  title={`${p.name} · Personal`} subtitle={`Income RM ${pIncome.toLocaleString()}`}
                  trailing={<Amount value={spent} />} meta="spent"
                  chevron onClick={() => goPersonal(pid)} divider={i === 0} />
              );
            })}
          </Card>
        </div>
      </div>
    );
  };
})();


// ===== SpaceDetail.jsx =====
// SpaceDetail — one space's ledger. Tabs: Activity (transactions, editable
// categories) + Recurring (fixed monthly breakdown, add/edit-able). Budget is
// editable per space from the hero. Interactive mock — edits persist in-session.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Card, ListRow, Amount, Badge, CategoryIcon, IconButton, Tag, ProgressBar,
    SegmentedControl, Dialog, Input, Select, Button } = K;
  const D = window.SproutData;

  const subtitleFor = (space, t) => [
    ...D.secondaryFields(space).map((f) => t[f.key]).filter(Boolean),
    t.note, t.payer,
  ].filter(Boolean).join(' · ');

  const slug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  function BudgetDialog({ open, onClose, value, onSave, spaceName }) {
    const [v, setV] = React.useState(value || '');
    React.useEffect(() => { if (open) setV(value || ''); }, [open]);
    return (
      <Dialog open={open} onClose={onClose} title="Monthly budget" description={`Set the spending target for ${spaceName}.`}
        footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button iconStart="check" onClick={() => { onSave(parseFloat(v) || 0); onClose(); }} disabled={!v}>Save budget</Button></>}>
        <Input label="Budget / month" prefix="RM" placeholder="0.00" inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} autoFocus />
      </Dialog>
    );
  }

  function CategoryDialog({ open, onClose, onAdd }) {
    const [label, setLabel] = React.useState('');
    React.useEffect(() => { if (open) setLabel(''); }, [open]);
    return (
      <Dialog open={open} onClose={onClose} title="Add category" description="Group transactions within this space."
        footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button iconStart="check" onClick={() => { onAdd(label); onClose(); }} disabled={!label}>Add</Button></>}>
        <Input label="Category name" placeholder="e.g. Subscriptions" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus />
      </Dialog>
    );
  }

  function RecurringDialog({ open, onClose, onAdd, cats }) {
    const [label, setLabel] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [cat, setCat] = React.useState(cats[0]?.key || 'money');
    React.useEffect(() => { if (open) { setLabel(''); setAmount(''); setCat(cats[0]?.key || 'money'); } }, [open]);
    const add = () => { onAdd({ label, amount: parseFloat(amount) || 0, cat }); onClose(); };
    return (
      <Dialog open={open} onClose={onClose} title="Add commitment" description="A fixed amount that repeats every month."
        footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button iconStart="check" onClick={add} disabled={!label || !amount}>Add</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Name" placeholder="e.g. Streaming, Insurance…" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus />
          <Input label="Amount / month" prefix="RM" placeholder="0.00" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {cats.length > 0 && (<Select label="Category" value={cat} onChange={(e) => setCat(e.target.value)} options={cats.map((c) => ({ value: c.key, label: c.label }))} />)}
        </div>
      </Dialog>
    );
  }

  function Header({ space, budget, onEditBudget, onBack, onSettings }) {
    const sub = space.kind === 'fund' ? 'Shared balance'
      : space.kind === 'invest' ? 'AIA · portfolio value'
      : space.sub || 'This month';
    const val = space.kind === 'fund' ? space.balance : space.kind === 'invest' ? space.value : D.spentOf(space);
    const isSpend = space.kind === 'spend';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <IconButton icon="arrow-left" label="Back" variant="ghost" onClick={onBack} style={{ marginLeft: -8 }} />
          <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)', flex: 1 }}>{space.name}</span>
          <IconButton icon="settings" label="Space settings" variant="ghost" onClick={onSettings} />
        </div>
        <Card padding="lg" style={{ background: isSpend ? 'var(--surface-card)' : 'var(--accent)', border: isSpend ? undefined : 'none' }}>
          <span style={{ font: 'var(--font-label)', color: isSpend ? 'var(--text-muted)' : 'rgba(255,255,255,0.85)' }}>{sub}</span>
          <Amount value={val} size="hero" style={{ display: 'block', marginTop: 4, color: isSpend ? 'var(--sage-700)' : '#fff' }} />
          {isSpend && (
            <div style={{ marginTop: 16 }}>
              {budget ? (
                <>
                  <ProgressBar value={val} max={budget} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
                    <button onClick={onEditBudget} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', font: 'var(--font-caption)', color: 'var(--text-muted)', textAlign: 'left' }}>
                      {Math.round((val / budget) * 100)}% of RM {budget.toLocaleString()} budget <span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>· Edit</span>
                    </button>
                    <span style={{ fontWeight: 'var(--fw-semibold)', color: val > budget ? 'var(--money-over)' : 'var(--text-body)', whiteSpace: 'nowrap' }}>
                      {val > budget ? 'RM ' + Math.round(val - budget).toLocaleString() + ' over' : 'RM ' + Math.round(budget - val).toLocaleString() + ' left'}
                    </span>
                  </div>
                </>
              ) : (
                <button onClick={onEditBudget} style={{ border: '1.5px dashed var(--border-strong)', background: 'none', cursor: 'pointer', font: 'var(--font-label)', color: 'var(--accent)', padding: '8px 14px', borderRadius: 'var(--radius-md)', width: '100%' }}>
                  + Set a monthly budget
                </button>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }

  function RecurringPanel({ space }) {
    const isFund = space.kind === 'fund';
    const [rec, setRec] = React.useState(space.recurring || []);
    const [edit, setEdit] = React.useState(false);
    const [dlg, setDlg] = React.useState(false);
    React.useEffect(() => { setRec(space.recurring || []); setEdit(false); }, [space.id]);
    const sum = rec.reduce((a, r) => a + r.amount, 0);

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 8px' }}>
          <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)' }}>
            {isFund ? 'How the fund is formed' : 'Monthly commitments'}
          </span>
          <button onClick={() => setEdit((e) => !e)} style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--font-label)', color: 'var(--accent)', padding: 4 }}>
            {edit ? 'Done' : 'Edit'}
          </button>
        </div>
        <Card padding="sm">
          {rec.map((r, i) => (
            <ListRow key={i} leading={<CategoryIcon category={r.cat} />} title={r.label}
              trailing={edit
                ? <IconButton icon="x" label="Remove" variant="ghost" size="sm" onClick={() => setRec((x) => x.filter((_, j) => j !== i))} />
                : <Amount value={r.amount} kind={isFund ? 'in' : 'neutral'} showSign={isFund} />}
              divider />
          ))}
          {edit && (
            <ListRow leading={<div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>+</div>}
              title={<span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>Add commitment</span>}
              onClick={() => setDlg(true)} divider />
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)' }}>
            <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)' }}>{isFund ? 'Total contributed' : 'Total / month'}</span>
            <Amount value={sum} kind={isFund ? 'in' : 'neutral'} showSign={isFund} weight="var(--fw-extra)" />
          </div>
        </Card>
        <RecurringDialog open={dlg} onClose={() => setDlg(false)} onAdd={(item) => setRec((r) => [...r, item])} cats={space.cats || []} />
      </div>
    );
  }

  function ActivityPanel({ space, cats, setCats }) {
    const [cat, setCat] = React.useState('all');
    const [edit, setEdit] = React.useState(false);
    const [dlg, setDlg] = React.useState(false);
    let list = space.tx;
    if (cat !== 'all') list = list.filter((t) => t.cat === cat);
    const statusTone = (s) => s === 'paid' ? 'income' : s === 'due' ? 'warning' : 'neutral';
    const removeCat = (key) => { setCats((cs) => cs.filter((c) => c.key !== key)); if (cat === key) setCat('all'); };
    const addCat = (label) => setCats((cs) => [...cs, { key: slug(label) || 'cat-' + cs.length, label }]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {(cats.length > 0 || edit) && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 8px' }}>
              <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)' }}>Categories</span>
              <button onClick={() => setEdit((e) => !e)} style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--font-label)', color: 'var(--accent)', padding: 4 }}>{edit ? 'Done' : 'Edit'}</button>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {!edit && <Tag selected={cat === 'all'} onClick={() => setCat('all')}>All</Tag>}
              {cats.map((c) => (
                <Tag key={c.key} selected={!edit && cat === c.key} onClick={() => edit ? removeCat(c.key) : setCat(c.key)}>
                  <CategoryIcon category={c.key} size={18} radius="var(--radius-xs)" style={{ marginRight: 4 }} />{c.label}
                  {edit && <span style={{ marginLeft: 6, color: 'var(--text-muted)', fontWeight: 'var(--fw-bold)' }}>×</span>}
                </Tag>
              ))}
              {edit && (
                <Tag onClick={() => setDlg(true)}><span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>+ Add</span></Tag>
              )}
            </div>
          </div>
        )}
        <Card padding="sm">
          {list.map((t, i) => (
            <ListRow key={t.id}
              leading={<CategoryIcon category={t.cat} />}
              title={t.vendor}
              subtitle={subtitleFor(space, t)}
              trailing={<Amount value={t.amount} kind={t.dir === 'in' ? 'in' : 'neutral'} showSign={t.dir === 'in'} />}
              meta={t.status ? <Badge tone={statusTone(t.status)} dot>{t.status === 'due' ? 'Due ' + t.date : t.status === 'paid' ? 'Paid' : t.date}</Badge> : t.date}
              divider={i < list.length - 1} />
          ))}
          {list.length === 0 && <div style={{ padding: 'var(--space-8)', textAlign: 'center', font: 'var(--font-body)', color: 'var(--text-muted)' }}>Nothing here yet.</div>}
        </Card>
        <CategoryDialog open={dlg} onClose={() => setDlg(false)} onAdd={addCat} />
      </div>
    );
  }

  window.SpaceDetailScreen = function SpaceDetailScreen({ spaceId, onBack, onSettings }) {
    const space = D.space(spaceId);
    const [tab, setTab] = React.useState('activity');
    const [budget, setBudget] = React.useState(space ? space.budget : null);
    const [cats, setCats] = React.useState(space ? space.cats : []);
    const [budgetDlg, setBudgetDlg] = React.useState(false);
    React.useEffect(() => { setTab('activity'); setBudget(space ? space.budget : null); setCats(space ? space.cats : []); }, [spaceId]);
    if (!space) return null;
    const hasRecurring = space.recurring && space.recurring.length > 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Header space={space} budget={budget} onEditBudget={() => setBudgetDlg(true)} onBack={onBack} onSettings={() => onSettings(space.id)} />
        {hasRecurring ? (
          <>
            <SegmentedControl fullWidth value={tab} onChange={setTab} options={[
              { value: 'activity', label: 'Activity' },
              { value: 'recurring', label: space.kind === 'fund' ? 'Contributions' : 'Recurring' },
            ]} />
            {tab === 'activity' ? <ActivityPanel space={space} cats={cats} setCats={setCats} /> : <RecurringPanel space={space} />}
          </>
        ) : (
          <ActivityPanel space={space} cats={cats} setCats={setCats} />
        )}
        <BudgetDialog open={budgetDlg} onClose={() => setBudgetDlg(false)} value={budget} onSave={setBudget} spaceName={space.name} />
      </div>
    );
  };
})();


// ===== Personal.jsx =====
// Personal — JC / CH personal funds (income + personal spending).
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Card, ListRow, Amount, SegmentedControl, StatCard, CategoryIcon, Avatar, Badge } = K;
  const D = window.SproutData;
  const SAGE = { color: 'var(--sage-700)' };

  window.PersonalScreen = function PersonalScreen({ who, setWho }) {
    const p = D.personal[who];
    const income = p.tx.filter((t) => t.dir === 'in').reduce((a, t) => a + t.amount, 0);
    const spent = p.tx.filter((t) => t.dir === 'out').reduce((a, t) => a + t.amount, 0);
    const left = income - spent;
    const list = p.tx;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Avatar name={p.name} size={40} />
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Personal · {D.monthLabel}</div>
            <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-strong)', margin: 0 }}>{p.name}'s money</h2>
          </div>
        </div>

        <SegmentedControl fullWidth value={who} onChange={setWho} options={[
          { value: 'jc', label: 'JC' }, { value: 'ch', label: 'CH' },
        ]} />

        <Card padding="lg" style={{ background: 'var(--accent)', border: 'none' }}>
          <span style={{ font: 'var(--font-label)', color: 'rgba(255,255,255,0.85)' }}>Left this month</span>
          <Amount value={left} size="hero" style={{ color: '#fff', display: 'block', marginTop: 4 }} />
          <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
            <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)' }}>Income RM {income.toLocaleString()}</span>
            <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)' }}>Spent RM {spent.toLocaleString()}</span>
          </div>
        </Card>

        <Card padding="sm">
          {list.map((t, i) => (
            <ListRow key={t.id}
              leading={<CategoryIcon category={t.cat} />}
              title={t.vendor} subtitle={`${t.note}`}
              trailing={<Amount value={t.amount} kind={t.dir === 'in' ? 'in' : 'neutral'} showSign={t.dir === 'in'} />} meta={t.date}
              divider={i < list.length - 1} />
          ))}
        </Card>
      </div>
    );
  };
})();


// ===== AddExpense.jsx =====
// Add-entry dialog — space FIRST, then a category + fields scoped to it.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Dialog, Input, Select, SegmentedControl, Switch, Button, CategoryIcon } = K;
  const D = window.SproutData;

  // Renders a space field as text, or (if it has options) a dropdown with an
  // "Other…" escape hatch that reveals a free-text input.
  function FieldInput({ field, onChange }) {
    const [sel, setSel] = React.useState('');
    const [custom, setCustom] = React.useState('');
    if (field.type === 'select' && field.options) {
      const opts = field.options.map((o) => ({ value: o, label: o })).concat({ value: '__other', label: 'Other…' });
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Select label={field.label} value={sel} placeholder="Choose…" options={opts}
            onChange={(e) => { const v = e.target.value; setSel(v); onChange(v === '__other' ? custom : v); }} />
          {sel === '__other' && (
            <Input placeholder={'Enter ' + field.label.toLowerCase()} value={custom}
              onChange={(e) => { setCustom(e.target.value); onChange(e.target.value); }} autoFocus />
          )}
        </div>
      );
    }
    return <Input label={field.label} placeholder={field.placeholder || ''} onChange={(e) => onChange(e.target.value)} />;
  }

  function spaceOptions() {
    const shared = D.spaces.filter((s) => s.kind !== 'fund').map((s) => ({ value: s.id, label: s.name }));
    return [...shared, { value: 'jc', label: 'JC · Personal' }, { value: 'ch', label: 'CH · Personal' }];
  }
  const spaceById = (id) => (id === 'jc' || id === 'ch') ? D.personal[id] : D.space(id);
  const catsFor = (id) => spaceById(id)?.cats || [];
  const fieldsFor = (id) => spaceById(id)?.fields || [];

  window.AddExpenseDialog = function AddExpenseDialog({ open, onClose, onSave, initialSpace = 'expenses' }) {
    const [space, setSpace] = React.useState(initialSpace);
    const [cat, setCat] = React.useState(catsFor(initialSpace)[0]?.key);
    const [fieldVals, setFieldVals] = React.useState({});
    const [amount, setAmount] = React.useState('');
    const [dir, setDir] = React.useState('out');
    const [payer, setPayer] = React.useState('joint');
    const [note, setNote] = React.useState('');
    const [recurring, setRecurring] = React.useState(false);

    const onSpace = (v) => { setSpace(v); setCat(catsFor(v)[0]?.key); setFieldVals({}); };
    const setField = (k, val) => setFieldVals((s) => ({ ...s, [k]: val }));

    const cats = catsFor(space);
    const fields = fieldsFor(space);
    const primary = fields.find((f) => f.primary);
    const secondary = fields.filter((f) => !f.primary);
    const personal = space === 'jc' || space === 'ch';

    const save = () => {
      onSave && onSave({ space, cat, amount: parseFloat(amount) || 0, payer, note, dir, ...fieldVals });
      setAmount(''); setNote(''); setFieldVals({}); setDir('out');
    };

    return (
      <Dialog open={open} onClose={onClose} title="Add entry" description="Pick a space, then fill in what belongs to it."
        footer={<>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button iconStart="check" onClick={save} disabled={!amount}>Save entry</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Select label="Space" value={space} onChange={(e) => onSpace(e.target.value)} options={spaceOptions()} />

          <SegmentedControl fullWidth value={dir} onChange={setDir} options={[
            { value: 'out', label: 'Expense' }, { value: 'in', label: 'Income' },
          ]} />

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <CategoryIcon category={cat} size={52} />
            <div style={{ flex: 1 }}>
              <Input label="Amount" prefix="RM" placeholder="0.00" inputMode="decimal" size="lg"
                value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>

          <Select label={`Category · ${personal ? 'Personal' : (D.space(space)?.name || '')}`} value={cat}
            onChange={(e) => setCat(e.target.value)} options={cats.map((c) => ({ value: c.key, label: c.label }))} />

          {/* generic per-space fields (text or preset dropdown) */}
          {primary && (
            <FieldInput key={space + ':' + primary.key} field={primary} onChange={(v) => setField(primary.key, v)} />
          )}
          {secondary.map((f) => (
            <FieldInput key={space + ':' + f.key} field={f} onChange={(v) => setField(f.key, v)} />
          ))}

          {!personal && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Paid by</label>
              <SegmentedControl fullWidth value={payer} onChange={setPayer} options={[
                { value: 'joint', label: 'Joint' }, { value: 'jc', label: 'JC' }, { value: 'ch', label: 'CH' },
              ]} />
            </div>
          )}
          <Input label="Note" placeholder="Anything to remember?" value={note} onChange={(e) => setNote(e.target.value)} />
          <Switch label="Recurring monthly" description="Repeats on the same day each month"
            checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
        </div>
      </Dialog>
    );
  };
})();


// ===== Reports.jsx =====
// Reports — trend (with range), by space, who-paid (drill-down), top categories.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Card, Amount, ProgressBar, CategoryIcon, SegmentedControl, Icon } = K;
  const D = window.SproutData;

  function SectionHead({ title, right }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 12px' }}>
        <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
        {right}
      </div>
    );
  }

  const personColor = { JC: 'var(--sage-500)', CH: 'var(--sage-300)', Joint: 'var(--sage-700)' };

  window.ReportsScreen = function ReportsScreen() {
    const [range, setRange] = React.useState('6m');
    const [openPerson, setOpenPerson] = React.useState(null);

    const n = range === '3m' ? 3 : 6;
    const hist = D.history.slice(-n);
    const maxV = Math.max(...hist.map((h) => h.v));
    const rangeTotal = hist.reduce((a, h) => a + h.v, 0);
    const avg = rangeTotal / hist.length;

    const byPerson = D.spendByPerson();
    const personTotal = Object.values(byPerson).reduce((a, b) => a + b, 0);
    const bySpace = D.spendBySpace();
    const spaceTotal = bySpace.reduce((a, s) => a + s.value, 0);
    const top = D.topCategories();
    const topMax = Math.max(...top.map((t) => t.value));

    const personBySpace = (p) => bySpace.map((s) => {
      const sp = D.space(s.id);
      const v = sp.tx.filter((t) => t.payer === p).reduce((a, t) => a + t.amount, 0);
      return { name: s.short, icon: s.icon, value: v };
    }).filter((x) => x.value > 0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{D.monthLabel}</div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>Reports</h2>
          </div>
          <SegmentedControl size="sm" value={range} onChange={setRange} options={[
            { value: '3m', label: '3M' }, { value: '6m', label: '6M' },
          ]} />
        </div>

        {/* trend */}
        <div>
          <SectionHead title="Spending trend" right={<span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>avg RM {Math.round(avg).toLocaleString()}/mo</span>} />
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, height: 148 }}>
              {hist.map((h, i) => {
                const isNow = i === hist.length - 1;
                return (
                  <div key={h.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-semibold)', color: isNow ? 'var(--sage-700)' : 'var(--text-subtle)' }}>{(h.v / 1000).toFixed(1)}k</span>
                    <div style={{ width: '100%', maxWidth: 34, height: `${(h.v / maxV) * 100}%`, borderRadius: 'var(--radius-sm)', background: isNow ? 'var(--accent)' : 'var(--sage-200)' }} />
                    <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{h.m}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* by space */}
        <div>
          <SectionHead title="By space" />
          <Card padding="lg">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {bySpace.map((s) => (
                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--font-label)', color: 'var(--text-body)' }}>
                      <Icon name={s.icon} size={16} style={{ color: 'var(--text-muted)' }} />{s.name}
                    </span>
                    <Amount value={s.value} />
                  </div>
                  <ProgressBar value={s.value} max={spaceTotal} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* who paid — tappable drill-down */}
        <div>
          <SectionHead title="Who paid" right={<span style={{ font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>tap to break down</span>} />
          <Card padding="lg">
            <div style={{ display: 'flex', gap: 3, height: 12, borderRadius: 'var(--radius-pill)', overflow: 'hidden', marginBottom: 16 }}>
              {['JC', 'CH', 'Joint'].map((p) => (
                <span key={p} style={{ width: `${(byPerson[p] / personTotal) * 100}%`, background: personColor[p] }} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {['JC', 'CH', 'Joint'].map((p) => {
                const open = openPerson === p;
                const label = p === 'Joint' ? 'Joint Fund' : p;
                return (
                  <div key={p}>
                    <button onClick={() => setOpenPerson(open ? null : p)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', border: 'none', background: 'none', cursor: 'pointer' }}>
                      <span style={{ width: 12, height: 12, borderRadius: 4, background: personColor[p] }} />
                      <span style={{ flex: 1, textAlign: 'left', font: 'var(--font-label)', color: 'var(--text-body)' }}>{label}</span>
                      <Amount value={byPerson[p]} />
                      <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} style={{ color: 'var(--text-subtle)' }} />
                    </button>
                    {open && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '6px 4px 12px 26px' }}>
                        {personBySpace(p).map((r) => (
                          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Icon name={r.icon} size={14} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ flex: 1, font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{r.name}</span>
                            <Amount value={r.value} size="sm" />
                          </div>
                        ))}
                        {personBySpace(p).length === 0 && <span style={{ font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>No shared spending this month.</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* top categories */}
        <div>
          <SectionHead title="Top categories" />
          <Card padding="sm">
            {top.map((t, i) => (
              <div key={t.cat} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderBottom: i < top.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <CategoryIcon category={t.cat} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{t.label}</div>
                  <div style={{ height: 5, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-200)', marginTop: 5 }}>
                    <div style={{ width: `${(t.value / topMax) * 100}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: 'var(--sage-400)' }} />
                  </div>
                </div>
                <Amount value={t.value} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    );
  };
})();


// ===== Manage.jsx =====
// Manage flows — create a new space, and edit a space's categories + fields.
// Interactive mocks (local state) so the shape of "make it your own" is clear.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Dialog, Input, Button, IconButton, SegmentedControl, CategoryIcon, Icon, Tag, Badge } = K;
  const D = window.SproutData;

  // A field row in settings: name + type, remove, and preset-value management.
  // Adding preset values turns the field into a dropdown at entry time.
  function FieldRow({ field, onRemove }) {
    const [opts, setOpts] = React.useState(field.options ? field.options.slice() : []);
    const [np, setNp] = React.useState('');
    const isSelect = opts.length > 0;
    const addOpt = () => { if (!np.trim()) return; setOpts((o) => [...o, np.trim()]); setNp(''); };
    return (
      <div style={{ padding: '10px 12px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="tag" size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ flex: 1, font: 'var(--font-label)', color: 'var(--text-strong)' }}>{field.label}{field.primary ? ' · title' : ''}</span>
          <Badge tone={isSelect ? 'accent' : 'neutral'}>{isSelect ? 'dropdown' : 'text'}</Badge>
          {!field.primary && <IconButton icon="x" label="Remove field" variant="ghost" size="sm" onClick={onRemove} />}
        </div>
        {opts.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {opts.map((o, i) => (
              <Tag key={o + i} size="sm" onRemove={() => setOpts((x) => x.filter((_, j) => j !== i))}>{o}</Tag>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}><Input placeholder="Add a preset value…" value={np} onChange={(e) => setNp(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addOpt()} /></div>
          <Button variant="ghost" size="sm" iconStart="plus" onClick={addOpt}>Preset</Button>
        </div>
      </div>
    );
  }

  // ---- New space -----------------------------------------------------------
  window.NewSpaceDialog = function NewSpaceDialog({ open, onClose, onCreate }) {
    const [name, setName] = React.useState('');
    const [icon, setIcon] = React.useState('wallet');
    const [kind, setKind] = React.useState('spend');
    const [budget, setBudget] = React.useState('');

    const create = () => { onCreate && onCreate({ name, icon, kind, budget: kind === 'spend' ? (parseFloat(budget) || null) : null }); setName(''); setIcon('wallet'); setKind('spend'); setBudget(''); };

    return (
      <Dialog open={open} onClose={onClose} title="New space" description="Spaces keep money separate — e.g. another investment, a renovation, a trip."
        footer={<>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button iconStart="plus" onClick={create} disabled={!name}>Create space</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <span style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={icon} size={24} />
            </span>
            <div style={{ flex: 1 }}>
              <Input label="Space name" placeholder="e.g. Versa Investment" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {D.spaceIcons.map((ic) => (
                <IconButton key={ic} icon={ic} label={ic} variant={icon === ic ? 'primary' : 'secondary'} onClick={() => setIcon(ic)} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Type</label>
            <SegmentedControl fullWidth value={kind} onChange={setKind} options={[
              { value: 'spend', label: 'Spending' }, { value: 'fund', label: 'Fund' }, { value: 'invest', label: 'Investment' },
            ]} />
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>You can add categories &amp; fields after creating.</span>
          </div>

          {kind === 'spend' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Input label="Monthly budget (optional)" prefix="RM" placeholder="0.00" inputMode="decimal" value={budget} onChange={(e) => setBudget(e.target.value)} />
              <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Set a target now, or add one later from the space.</span>
            </div>
          )}
        </div>
      </Dialog>
    );
  };

  // ---- Space settings: categories + fields ---------------------------------
  window.SpaceSettingsDialog = function SpaceSettingsDialog({ open, onClose, spaceId }) {
    const base = spaceId && (spaceId === 'jc' || spaceId === 'ch' ? D.personal[spaceId] : D.space(spaceId));
    const [name, setName] = React.useState(base ? base.name : '');
    const [cats, setCats] = React.useState(base ? base.cats.slice() : []);
    const [fields, setFields] = React.useState(base ? (base.fields || []).slice() : []);
    const [newCat, setNewCat] = React.useState('');
    const [newField, setNewField] = React.useState('');

    React.useEffect(() => {
      if (!base) return;
      setName(base.name); setCats(base.cats.slice()); setFields((base.fields || []).slice());
    }, [spaceId, open]);

    if (!base) return null;
    const addCat = () => { if (!newCat.trim()) return; setCats((c) => [...c, { key: 'other', label: newCat.trim() }]); setNewCat(''); };
    const addField = () => { if (!newField.trim()) return; setFields((f) => [...f, { key: 'custom' + f.length, label: newField.trim(), type: 'text' }]); setNewField(''); };

    return (
      <Dialog open={open} onClose={onClose} title={`${base.name} · settings`} size="md"
        footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button iconStart="check" onClick={onClose}>Save</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Input label="Space name" value={name} onChange={(e) => setName(e.target.value)} />

          {/* categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Categories</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {cats.map((c, i) => (
                <Tag key={c.key + i} onRemove={() => setCats((x) => x.filter((_, j) => j !== i))}>
                  <CategoryIcon category={c.key} size={18} radius="var(--radius-xs)" style={{ marginRight: 4 }} />{c.label}
                </Tag>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}><Input placeholder="Add a category" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCat()} /></div>
              <Button variant="soft" iconStart="plus" onClick={addCat}>Add</Button>
            </div>
          </div>

          {/* fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Extra info fields</label>
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)', marginTop: -4 }}>Shown when adding to this space. Everyday uses Store &amp; Location.</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {fields.map((f, i) => (
                <FieldRow key={f.key + i} field={f} onRemove={() => setFields((x) => x.filter((_, j) => j !== i))} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}><Input placeholder="Add a field, e.g. Warranty" value={newField} onChange={(e) => setNewField(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addField()} /></div>
              <Button variant="soft" iconStart="plus" onClick={addField}>Add</Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  };
})();


// ===== Onboarding.jsx =====
// Onboarding — Sprout first-run flow (welcome → household → spaces → budget → done).
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Card, Button, Input, Icon, Avatar, IconButton, Amount } = K;

  const SUGGESTED = [
    { id: 'expenses', name: 'Everyday Expenses', icon: 'receipt', on: true },
    { id: 'housing', name: 'Housing', icon: 'home', on: true },
    { id: 'car', name: 'Car', icon: 'repeat', on: true },
    { id: 'investment', name: 'Investment', icon: 'trending-up', on: false },
    { id: 'joint', name: 'Joint Fund', icon: 'wallet', on: true },
  ];

  function Dots({ step, total }) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{ width: i === step ? 22 : 7, height: 7, borderRadius: 'var(--radius-pill)', background: i === step ? 'var(--accent)' : 'var(--neutral-300)', transition: 'width var(--dur-base) var(--ease-out), background-color var(--dur-base)' }} />
        ))}
      </div>
    );
  }

  window.OnboardingScreen = function OnboardingScreen({ onDone }) {
    const [step, setStep] = React.useState(0);
    const [p1, setP1] = React.useState('JC');
    const [p2, setP2] = React.useState('CH');
    const [spaces, setSpaces] = React.useState(SUGGESTED.map((s) => ({ ...s })));
    const [budgets, setBudgets] = React.useState({ expenses: '1500', housing: '2100', car: '800' });
    const setB = (k, v) => setBudgets((b) => ({ ...b, [k]: v }));
    const budgetTotal = Object.values(budgets).reduce((a, v) => a + (parseFloat(v) || 0), 0);

    const TOTAL = 5;
    const next = () => setStep((s) => Math.min(TOTAL - 1, s + 1));
    const back = () => setStep((s) => Math.max(0, s - 1));
    const toggle = (id) => setSpaces((xs) => xs.map((x) => x.id === id ? { ...x, on: !x.on } : x));
    const chosen = spaces.filter((s) => s.on).length;

    const wrap = (children, footer) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 40 }}>
          {step > 0 && step < 4 && <IconButton icon="arrow-left" label="Back" variant="ghost" onClick={back} style={{ marginLeft: -8 }} />}
          <div style={{ flex: 1 }} />
          {step > 0 && step < 4 && <Dots step={step - 1} total={3} />}
          <div style={{ flex: 1 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>{children}</div>
        {footer}
      </div>
    );

    // Step 0 — welcome
    if (step === 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'center', paddingTop: 'var(--space-9)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)' }}>
            <img src="sprout/assets/sprout-icon.svg" width="88" height="88" alt="Sprout" style={{ borderRadius: 24, boxShadow: 'var(--shadow-lg)' }} />
            <div>
              <h1 style={{ font: 'var(--font-display)', color: 'var(--text-strong)', margin: 0 }}>Track money,<br />together.</h1>
              <p style={{ font: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--text-muted)', margin: 'var(--space-3) auto 0', maxWidth: '30ch' }}>
                Expenses, monthly bills, and who paid what — in one calm place for you both.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingBottom: 'var(--space-6)' }}>
            <Button size="lg" fullWidth onClick={next}>Get started</Button>
            <Button size="lg" variant="ghost" fullWidth>I already have an account</Button>
          </div>
        </div>
      );
    }

    // Step 1 — household
    if (step === 1) {
      return wrap(
        <>
          <div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Who's in your household?</h2>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>Sprout is better with two. You can invite more later.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
              <Avatar name={p1 || '?'} size={52} />
              <div style={{ flex: 1 }}><Input label="You" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Your name" /></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
              <Avatar name={p2 || '?'} size={52} />
              <div style={{ flex: 1 }}><Input label="Partner" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Their name" /></div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'none', color: 'var(--text-accent)', font: 'var(--font-label)', cursor: 'pointer', padding: 4 }}>
              <Icon name="plus" size={16} /> Add another person
            </button>
          </div>
        </>,
        <Button size="lg" fullWidth iconEnd="arrow-right" onClick={next} disabled={!p1 || !p2}>Continue</Button>
      );
    }

    // Step 2 — choose spaces
    if (step === 2) {
      return wrap(
        <>
          <div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Choose your spaces</h2>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>Keep areas of money separate. Add or remove any anytime.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {spaces.map((s) => (
              <Card key={s.id} interactive padding="sm" onClick={() => toggle(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderColor: s.on ? 'var(--accent)' : 'var(--border-subtle)' }}>
                <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={s.icon} size={20} />
                </span>
                <span style={{ flex: 1, font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{s.name}</span>
                <span style={{ width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: s.on ? 'var(--accent)' : 'transparent', border: s.on ? 'none' : '2px solid var(--border-strong)', color: '#fff' }}>
                  {s.on && <Icon name="check" size={15} strokeWidth={3} />}
                </span>
              </Card>
            ))}
          </div>
        </>,
        <Button size="lg" fullWidth iconEnd="arrow-right" onClick={next} disabled={chosen === 0}>Continue with {chosen}</Button>
      );
    }

    // Step 3 — per-space budgets
    if (step === 3) {
      const rows = [
        { id: 'expenses', name: 'Everyday Expenses', icon: 'receipt' },
        { id: 'housing', name: 'Housing', icon: 'home' },
        { id: 'car', name: 'Car', icon: 'repeat' },
      ];
      return wrap(
        <>
          <div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Set a budget per space</h2>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>A gentle monthly guide for each — change any of them anytime.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {rows.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={r.icon} size={20} />
                </span>
                <span style={{ flex: 1, font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{r.name}</span>
                <div style={{ width: 130 }}>
                  <Input prefix="RM" inputMode="decimal" value={budgets[r.id]} onChange={(e) => setB(r.id, e.target.value)} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px 0', borderTop: '1px solid var(--border-subtle)', marginTop: 4 }}>
              <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)' }}>Total budget</span>
              <Amount value={budgetTotal} size="lg" style={{ color: 'var(--sage-700)' }} />
            </div>
          </div>
        </>,
        <Button size="lg" fullWidth onClick={next} disabled={budgetTotal <= 0}>Finish setup</Button>
      );
    }

    // Step 4 — done
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)' }}>
          <span style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
            <Icon name="check" size={44} strokeWidth={2.6} style={{ color: '#fff' }} />
          </span>
          <div>
            <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>You're all set, {p1}! 🌿</h1>
            <p style={{ font: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--text-muted)', margin: 'var(--space-3) auto 0', maxWidth: '30ch' }}>
              {chosen} spaces ready for you and {p2}. Budget set to <strong style={{ color: 'var(--text-body)' }}>RM {budgetTotal.toLocaleString()}</strong>.
            </p>
          </div>
        </div>
        <div style={{ paddingBottom: 'var(--space-6)' }}>
          <Button size="lg" fullWidth iconStart="home" onClick={onDone}>Open Sprout</Button>
        </div>
      </div>
    );
  };
})();


// ===== mobile-orchestrator.jsx =====
// Mobile orchestrator — assembles the Sprout PWA screens into one clickable
// app: a start-menu launcher, full routing, live "add entry" (mutates the
// ledger), onboarding, and a light/dark toggle. Registers window.MobileApp.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Icon, IconButton, Card, ListRow, Toast } = K;
  const D = window.SproutData;

  const softTile = (icon) => (
    <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={21} />
    </span>
  );

  const LAUNCH = [
    { key: 'onboarding', icon: 'wand', title: 'First-run onboarding', desc: 'Welcome → household → spaces → budget' },
    { key: 'home', icon: 'home', title: 'Home', desc: 'Roll-up across every space' },
    { key: 'spaces', icon: 'wallet', title: 'Spaces', desc: 'Shared & personal launcher' },
    { key: 'reports', icon: 'pie-chart', title: 'Reports', desc: 'Trend, who paid, top categories' },
    { key: 'personal', icon: 'user', title: 'Personal', desc: "JC & CH's own money" },
    { key: 'add', icon: 'plus', title: 'Add an entry', desc: 'Scoped add flow with live totals' },
  ];

  function Launcher({ onPick, dark, onToggleTheme }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '26px 20px 22px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="sprout/assets/sprout-icon.svg" width="40" height="40" alt="Sprout" style={{ borderRadius: 11, boxShadow: 'var(--shadow-sm)' }} />
            <div>
              <div style={{ font: 'var(--font-h3)', fontWeight: 'var(--fw-extra)', color: 'var(--text-strong)', lineHeight: 1.05 }}>Sprout</div>
              <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Prototype · mobile</div>
            </div>
          </div>
          <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" variant="secondary" onClick={onToggleTheme} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Where to start?</h1>
          <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: '6px 0 0' }}>Jump into any screen — everything's fully clickable.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {LAUNCH.map((it) => (
            <Card key={it.key} interactive padding="sm" onClick={() => onPick(it.key)}>
              <ListRow leading={softTile(it.icon)} title={it.title} subtitle={it.desc} chevron />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function SettingsScreen({ dark, setDark, goTo, onNewSpace }) {
    const { Card, ListRow, Switch, Avatar, Icon } = K;
    const [reminders, setReminders] = React.useState(true);
    const secLabel = (t) => (
      <div style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)', margin: '0 4px 8px' }}>{t}</div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div>
          <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{D.monthLabel}</div>
          <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>Settings</h2>
        </div>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex' }}>
              <Avatar name="JC" size={40} style={{ boxShadow: '0 0 0 2px var(--surface-card)' }} />
              <Avatar name="CH" size={40} style={{ marginLeft: -10, boxShadow: '0 0 0 2px var(--surface-card)' }} />
              <Avatar name="Leo" size={40} style={{ marginLeft: -10, boxShadow: '0 0 0 2px var(--surface-card)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>JC &amp; CH</div>
              <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Household · 2 members + Leo</div>
            </div>
            <Icon name="chevron-right" size={18} style={{ color: 'var(--text-subtle)' }} />
          </div>
        </Card>
        <div>
          {secLabel('Appearance')}
          <Card padding="sm">
            <div style={{ padding: 'var(--space-3)' }}>
              <Switch label="Dark mode" description="Easier on the eyes at night" checked={dark} onChange={(e) => setDark(e.target.checked)} />
            </div>
          </Card>
        </div>
        <div>
          {secLabel('Preferences')}
          <Card padding="sm">
            <ListRow leading={<Icon name="banknote" size={20} style={{ color: 'var(--text-muted)' }} />} title="Currency" trailing={<span style={{ font: 'var(--font-body)', color: 'var(--text-muted)' }}>RM · Ringgit</span>} divider />
            <div style={{ padding: 'var(--space-3)' }}>
              <Switch label="Bill reminders" description="Nudge before a bill is due" checked={reminders} onChange={(e) => setReminders(e.target.checked)} />
            </div>
          </Card>
        </div>
        <div>
          {secLabel('Spaces')}
          <Card padding="sm">
            <ListRow leading={<Icon name="wallet" size={20} style={{ color: 'var(--text-muted)' }} />} title="Manage spaces" subtitle="Categories, fields & budgets" chevron onClick={() => goTo('spaces')} divider />
            <ListRow leading={<Icon name="plus" size={20} style={{ color: 'var(--accent)' }} />} title={<span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>New space</span>} onClick={onNewSpace} />
          </Card>
        </div>
        <div style={{ textAlign: 'center', font: 'var(--font-caption)', color: 'var(--text-subtle)', padding: '2px 0 10px' }}>Sprout · prototype v1</div>
      </div>
    );
  }

  window.MobileApp = function MobileApp() {
    const [route, setRoute] = React.useState('menu');   // menu | onboarding | app
    const [dark, setDark] = React.useState(false);
    const [view, setView] = React.useState('home');     // home | spaces | space | reports | personal
    const [spaceId, setSpaceId] = React.useState('expenses');
    const [who, setWho] = React.useState('jc');
    const [addOpen, setAddOpen] = React.useState(false);
    const [addSpace, setAddSpace] = React.useState('expenses');
    const [newSpaceOpen, setNewSpaceOpen] = React.useState(false);
    const [settingsSpace, setSettingsSpace] = React.useState(null);
    const [toast, setToast] = React.useState(null);
    const [ver, setVer] = React.useState(0);            // bump to remount screens after a mutation
    const contentRef = React.useRef(null);
    const timer = React.useRef(null);

    const notify = (title, desc) => { setToast({ title, desc }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 3200); };
    const scrollTop = () => { if (contentRef.current) contentRef.current.scrollTop = 0; };
    const go = (v) => { setView(v); scrollTop(); };
    const goSpace = (id) => { setSpaceId(id); setView('space'); scrollTop(); };
    const goPersonal = (pid) => { setWho(pid); setView('personal'); scrollTop(); };
    const openAdd = () => { setAddSpace(view === 'space' ? spaceId : view === 'personal' ? who : 'expenses'); setAddOpen(true); };

    const onSave = (entry) => {
      const tx = D.addTx(entry);
      const amt = parseFloat(entry.amount) || 0;
      setAddOpen(false); setVer((v) => v + 1);
      notify(entry.dir === 'in' ? 'Income added' : 'Entry added', `RM ${amt.toFixed(2)} · ${(tx && tx.vendor) || 'Saved'}`);
    };
    const onCreate = (sp) => { setNewSpaceOpen(false); notify('Space created', `${sp.name} is ready — add your categories`); };

    const launch = (key) => {
      if (key === 'onboarding') { setRoute('onboarding'); return; }
      setRoute('app');
      if (key === 'add') { setView('home'); setAddSpace('expenses'); setAddOpen(true); }
      else if (key === 'personal') { setWho('jc'); setView('personal'); }
      else setView(key);
    };

    let Screen;
    if (view === 'home') Screen = <window.HomeScreen goSpace={goSpace} goTo={go} />;
    else if (view === 'spaces') Screen = <window.SpacesScreen goSpace={goSpace} goPersonal={goPersonal} onNewSpace={() => setNewSpaceOpen(true)} />;
    else if (view === 'space') Screen = <window.SpaceDetailScreen spaceId={spaceId} onBack={() => go('spaces')} onSettings={(id) => setSettingsSpace(id)} />;
    else if (view === 'reports') Screen = <window.ReportsScreen />;
    else if (view === 'settings') Screen = <SettingsScreen dark={dark} setDark={setDark} goTo={go} onNewSpace={() => setNewSpaceOpen(true)} />;
    else Screen = <window.PersonalScreen who={who} setWho={setWho} />;

    const tabOf = (view === 'space' || view === 'personal') ? 'spaces' : view;
    const tab = (id, icon, label) => (
      <button onClick={() => go(id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'none', cursor: 'pointer', font: 'var(--font-caption)', fontWeight: 'var(--fw-semibold)', color: tabOf === id ? 'var(--accent)' : 'var(--text-subtle)', width: 64, transition: 'color var(--dur-fast)' }}>
        <Icon name={icon} size={22} /> {label}
      </button>
    );

    const shell = (
      <>
        <div style={{ height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px 0 8px' }}>
          <IconButton icon="menu" label="Start menu" variant="ghost" onClick={() => setRoute('menu')} />
          <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" variant="ghost" onClick={() => setDark((d) => !d)} />
        </div>
        <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 120px' }}>
          <div key={view + ':' + spaceId + ':' + who + ':' + ver}>{Screen}</div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 84, background: 'color-mix(in srgb, var(--surface-card) 88%, transparent)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 12 }}>
          {tab('home', 'home', 'Home')}
          {tab('spaces', 'wallet', 'Spaces')}
          <button onClick={openAdd} aria-label="Add entry" style={{ width: 58, height: 58, borderRadius: 'var(--radius-pill)', background: 'var(--accent)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 18px rgb(79 138 107 / 0.42)', marginTop: -18, transition: 'transform var(--dur-fast) var(--ease-out)' }}>
            <Icon name="plus" size={26} strokeWidth={2.4} />
          </button>
          {tab('reports', 'pie-chart', 'Reports')}
          {tab('settings', 'settings', 'Settings')}
        </div>
        {toast && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 100, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}><Toast title={toast.title} description={toast.desc} action="Undo" onAction={() => setToast(null)} /></div>
          </div>
        )}
      </>
    );

    return (
      <div data-theme={dark ? 'dark' : undefined} style={{ minHeight: '100vh', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: dark ? '#0E120C' : '#DFE3DA', transition: 'background var(--dur-base)' }}>
        <div style={{ width: 412, height: 868, maxHeight: 'calc(100vh - 48px)', background: 'var(--surface-canvas)', borderRadius: 40, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', transform: 'translateZ(0)', boxShadow: dark ? '0 30px 80px rgba(0,0,0,0.55)' : '0 30px 80px rgba(37,41,31,0.26)', fontFamily: 'var(--font-sans)' }}>
          {route === 'menu' && <Launcher onPick={launch} dark={dark} onToggleTheme={() => setDark((d) => !d)} />}
          {route === 'onboarding' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 24px' }}>
              <window.OnboardingScreen onDone={() => { setRoute('app'); setView('home'); }} />
            </div>
          )}
          {route === 'app' && shell}

          <window.AddExpenseDialog open={addOpen} initialSpace={addSpace} onClose={() => setAddOpen(false)} onSave={onSave} />
          <window.NewSpaceDialog open={newSpaceOpen} onClose={() => setNewSpaceOpen(false)} onCreate={onCreate} />
          <window.SpaceSettingsDialog open={!!settingsSpace} spaceId={settingsSpace} onClose={() => setSettingsSpace(null)} />
        </div>
      </div>
    );
  };
})();

