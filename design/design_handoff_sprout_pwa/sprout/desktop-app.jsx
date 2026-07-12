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


// ===== Dashboard.jsx =====
// Desktop — Sprout on a wide screen: sidebar of spaces + roll-up / space views.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Icon, Avatar, Button, IconButton, StatCard, Card, ListRow, Amount, Badge, CategoryIcon, SegmentedControl, Tag, Dialog, Input, Select } = K;
  const D = window.SproutData;
  const SAGE = { color: 'var(--sage-700)' };

  // Add / edit a recurring commitment (mock — updates in-session).
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

  function Sidebar({ active, setActive, onNewSpace }) {
    const item = (id, icon, label, sub) => (
      <button key={id} onClick={() => setActive(id)} data-active={active === id} className="nav-item">
        <Icon name={icon} size={18} /> <span>{label}</span>
        {sub && <em style={{ marginLeft: 'auto', fontStyle: 'normal', font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>{sub}</em>}
      </button>
    );
    const shared = D.spaces.filter((s) => s.group === 'shared');
    return (
      <aside className="sidebar">
        <div className="brand"><img src="sprout/assets/sprout-mark.svg" width="30" height="30" alt="" /><span>Sprout</span></div>
        <nav className="nav">
          {item('home', 'pie-chart', 'Overview')}
          {item('reports', 'bar-chart', 'Reports')}
        </nav>
        <div>
          <div className="navlabel">Shared</div>
          <nav className="nav">
            {shared.map((s) => item(s.id, s.icon, s.name, s.sub))}
            <button className="nav-item" onClick={onNewSpace} style={{ color: 'var(--text-accent)' }}>
              <Icon name="plus" size={18} /> <span>New space</span>
            </button>
          </nav>
        </div>
        <div>
          <div className="navlabel">Personal</div>
          <nav className="nav">
            {item('jc', 'user', 'JC')}
            {item('ch', 'user', 'CH')}
          </nav>
        </div>
        <div className="account">
          <Avatar name="JC" size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>JC &amp; CH</div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Household</div>
          </div>
          <Icon name="settings" size={16} style={{ color: 'var(--text-subtle)' }} />
        </div>
      </aside>
    );
  }

  function Topbar({ title, sub, onAdd, extra }) {
    return (
      <header className="topbar">
        <div>
          <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{sub}</div>
          <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {extra}
          <div style={{ display: 'flex' }}>
            <Avatar name="JC" size={34} style={{ boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
            <Avatar name="CH" size={34} style={{ marginLeft: -8, boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
            <Avatar name="Leo" size={34} style={{ marginLeft: -8, boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
          </div>
          <IconButton icon="search" label="Search" variant="secondary" />
          <IconButton icon="bell" label="Alerts" variant="secondary" />
          <Button iconStart="plus" onClick={onAdd}>Add entry</Button>
        </div>
      </header>
    );
  }

  function Home({ onAdd, goSpace }) {
    const spendSpaces = D.spaces.filter((s) => s.kind === 'spend');
    const joint = D.space('joint'); const invest = D.space('investment');
    const left = D.budget - D.totalSpent;
    const recent = D.space('expenses').tx.slice(0, 6);
    const bills = D.space('housing').tx.concat(D.space('car').tx).filter((t) => t.status);
    return (
      <div className="main">
        <Topbar title="Overview" sub={`Household · ${D.monthLabel}`} onAdd={onAdd} />
        <div className="scroll">
          <div className="row-3">
            <Card padding="lg" style={{ background: 'var(--accent)', border: 'none', gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
              <span style={{ font: 'var(--font-label)', color: 'rgba(255,255,255,0.85)' }}>Total spent · Everyday + Housing + Car</span>
              <Amount value={D.totalSpent} size="hero" style={{ color: '#fff', display: 'block', margin: '10px 0 4px', fontSize: '54px' }} />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                <span style={{ font: 'var(--font-label)', color: '#fff' }}>RM {Math.round(left).toLocaleString()} left</span>
                <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.82)' }}>of RM {D.budget.toLocaleString()} budget</span>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', gap: 3, height: 10, borderRadius: 'var(--radius-pill)', overflow: 'hidden', background: 'rgba(255,255,255,0.22)' }}>
                {spendSpaces.map((s, i) => (
                  <span key={s.id} style={{ width: `${(D.spentOf(s) / D.totalSpent) * 100}%`, background: `rgba(255,255,255,${[0.95, 0.66, 0.4][i]})` }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                {spendSpaces.map((s) => (
                  <span key={s.id} style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)', fontWeight: 'var(--fw-medium)' }}>{s.name} · RM {D.spentOf(s).toLocaleString()}</span>
                ))}
              </div>
            </Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <StatCard label="Joint Fund" value={joint.balance} icon="wallet" footer="Shared balance" amountProps={{ style: SAGE }} />
              <StatCard label="Investment · AIA" value={invest.value} icon="trending-up" footer="Portfolio value" amountProps={{ style: SAGE }} />
            </div>
          </div>

          <div className="row-2">
            <div>
              <SectionHead title="Recent · Everyday Expenses" action="Open" onAction={() => goSpace('expenses')} />
              <Card padding="sm">
                {recent.map((e, i) => (
                  <ListRow key={e.id} leading={<CategoryIcon category={e.cat} />} title={e.vendor}
                    subtitle={`${e.note} · ${e.payer}`} trailing={<Amount value={e.amount} />} meta={e.date}
                    divider={i < recent.length - 1} />
                ))}
              </Card>
            </div>
            <div>
              <SectionHead title="Bills & installments" action="Housing" onAction={() => goSpace('housing')} />
              <Card padding="sm">
                {bills.map((c, i) => (
                  <ListRow key={c.id + c.vendor} leading={<CategoryIcon category={c.cat} />} title={c.vendor}
                    subtitle={`Paid by ${c.payer}`} trailing={<Amount value={c.amount} />}
                    meta={<Badge tone={c.status === 'paid' ? 'income' : c.status === 'due' ? 'warning' : 'neutral'} dot>{c.status === 'due' ? 'Due ' + c.date : c.status === 'paid' ? 'Paid' : c.date}</Badge>}
                    divider={i < bills.length - 1} />
                ))}
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SpaceView({ spaceId, onAdd, onSettings }) {
    const isPersonal = spaceId === 'jc' || spaceId === 'ch';
    const [cat, setCat] = React.useState('all');
    const space = isPersonal ? D.personal[spaceId] : D.space(spaceId);
    const person = isPersonal ? D.personal[spaceId] : null;

    const [cats, setCats] = React.useState(space.cats);
    const secondary = D.secondaryFields(space);
    const subtitleFor = (t) => [...secondary.map((f) => t[f.key]).filter(Boolean), t.note, t.payer].filter(Boolean).join(' · ');
    let tx = isPersonal ? person.tx : space.tx;
    if (cat !== 'all') tx = tx.filter((t) => t.cat === cat);

    const title = isPersonal ? `${person.name} · Personal` : space.name;
    const headVal = isPersonal
      ? { label: 'Spent this month', v: person.tx.filter((t) => t.dir === 'out').reduce((a, t) => a + t.amount, 0) }
      : space.kind === 'fund' ? { label: 'Shared balance', v: space.balance }
      : space.kind === 'invest' ? { label: 'Portfolio value', v: space.value }
      : { label: 'Spent this month', v: D.spentOf(space) };

    const [tab, setTab] = React.useState('activity');
    const [rec, setRec] = React.useState(space.recurring || []);
    const [editRec, setEditRec] = React.useState(false);
    const [recDlg, setRecDlg] = React.useState(false);
    const [budget, setBudget] = React.useState(space.budget);
    const [budgetDlg, setBudgetDlg] = React.useState(false);
    const [editCat, setEditCat] = React.useState(false);
    const [catDlg, setCatDlg] = React.useState(false);
    React.useEffect(() => { setTab('activity'); setRec(space.recurring || []); setEditRec(false); setBudget(space.budget); setCats(space.cats); setEditCat(false); }, [spaceId]);
    const hasRecurring = !!(space.recurring && space.recurring.length > 0);
    const isFund = space.kind === 'fund';
    const removeCat = (key) => { setCats((cs) => cs.filter((c) => c.key !== key)); if (cat === key) setCat('all'); };
    const addCat = (label) => setCats((cs) => [...cs, { key: slug(label) || 'cat-' + cs.length, label }]);

    const activityBlock = (
      <>
        {cats.length > 0 || editCat ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 8px' }}>
              <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)' }}>Categories</span>
              <button onClick={() => setEditCat((e) => !e)} style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--font-label)', color: 'var(--accent)', padding: 4 }}>{editCat ? 'Done' : 'Edit'}</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {!editCat && <Tag selected={cat === 'all'} onClick={() => setCat('all')}>All</Tag>}
              {cats.map((c) => (
                <Tag key={c.key} selected={!editCat && cat === c.key} onClick={() => editCat ? removeCat(c.key) : setCat(c.key)}>
                  <CategoryIcon category={c.key} size={18} radius="var(--radius-xs)" style={{ marginRight: 4 }} />{c.label}
                  {editCat && <span style={{ marginLeft: 6, color: 'var(--text-muted)', fontWeight: 'var(--fw-bold)' }}>×</span>}
                </Tag>
              ))}
              {editCat && <Tag onClick={() => setCatDlg(true)}><span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>+ Add</span></Tag>}
            </div>
          </div>
        ) : null}
        <Card padding="sm">
          {tx.map((t, i) => (
            <ListRow key={t.id + t.vendor} leading={<CategoryIcon category={t.cat} />} title={t.vendor}
              subtitle={subtitleFor(t)}
              trailing={<Amount value={t.amount} kind={t.dir === 'in' ? 'in' : 'neutral'} showSign={t.dir === 'in'} />}
              meta={t.status ? <Badge tone={t.status === 'paid' ? 'income' : t.status === 'due' ? 'warning' : 'neutral'} dot>{t.status === 'due' ? 'Due ' + t.date : t.status === 'paid' ? 'Paid' : t.date}</Badge> : t.date}
              divider={i < tx.length - 1} />
          ))}
        </Card>
      </>
    );

    const recSum = rec.reduce((a, r) => a + r.amount, 0);
    const recurringBlock = (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 12px' }}>
          <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>{isFund ? 'How the fund is formed' : 'Monthly commitments'}</h3>
          <button onClick={() => setEditRec((e) => !e)} style={{ border: 'none', background: 'none', font: 'var(--font-label)', color: 'var(--accent)', cursor: 'pointer' }}>{editRec ? 'Done' : 'Edit'}</button>
        </div>
        <Card padding="sm">
          {rec.map((r, i) => (
            <ListRow key={i} leading={<CategoryIcon category={r.cat} />} title={r.label}
              trailing={editRec ? <IconButton icon="x" label="Remove" variant="ghost" size="sm" onClick={() => setRec((x) => x.filter((_, j) => j !== i))} /> : <Amount value={r.amount} kind={isFund ? 'in' : 'neutral'} showSign={isFund} />}
              divider />
          ))}
          {editRec && (
            <ListRow leading={<div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>+</div>}
              title={<span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>Add commitment</span>} onClick={() => setRecDlg(true)} divider />
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)' }}>
            <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)' }}>{isFund ? 'Total contributed' : 'Total / month'}</span>
            <Amount value={recSum} kind={isFund ? 'in' : 'neutral'} showSign={isFund} weight="var(--fw-extra)" />
          </div>
        </Card>
      </div>
    );

    return (
      <div className="main">
        <Topbar title={title} sub={space && space.sub ? space.sub : 'June 2026'} onAdd={onAdd}
          extra={<IconButton icon="settings" label="Space settings" variant="secondary" onClick={() => onSettings(spaceId)} />} />
        <div className="scroll">
          <div className="row-2">
            <Card padding="lg" style={{ background: 'var(--accent)', border: 'none' }}>
              <span style={{ font: 'var(--font-label)', color: 'rgba(255,255,255,0.85)' }}>{headVal.label}</span>
              <Amount value={headVal.v} size="hero" style={{ color: '#fff', display: 'block', marginTop: 6, fontSize: '48px' }} />
              {space.kind === 'spend' && (
                <div style={{ marginTop: 16 }}>
                  {budget ? (
                    <>
                      <div style={{ height: 8, borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.22)', overflow: 'hidden' }}>
                        <div style={{ width: Math.min(100, (headVal.v / budget) * 100) + '%', height: '100%', background: '#fff', borderRadius: 'var(--radius-pill)' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)' }}>
                        <button onClick={() => setBudgetDlg(true)} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)', textAlign: 'left' }}>
                          {Math.round((headVal.v / budget) * 100)}% of RM {budget.toLocaleString()} <span style={{ fontWeight: 'var(--fw-semibold)', textDecoration: 'underline' }}>Edit</span>
                        </button>
                        <span style={{ fontWeight: 'var(--fw-semibold)' }}>{headVal.v > budget ? 'RM ' + Math.round(headVal.v - budget).toLocaleString() + ' over' : 'RM ' + Math.round(budget - headVal.v).toLocaleString() + ' left'}</span>
                      </div>
                    </>
                  ) : (
                    <button onClick={() => setBudgetDlg(true)} style={{ border: '1.5px dashed rgba(255,255,255,0.6)', background: 'none', cursor: 'pointer', font: 'var(--font-label)', color: '#fff', padding: '8px 14px', borderRadius: 'var(--radius-md)' }}>+ Set a monthly budget</button>
                  )}
                </div>
              )}
            </Card>
            {isPersonal && (
              <StatCard label="Income" value={person.tx.filter((t) => t.dir === 'in').reduce((a, t) => a + t.amount, 0)} icon="banknote" footer={`${person.name} · ${D.monthLabel}`} amountProps={{ kind: 'in' }} />
            )}
          </div>

          {hasRecurring ? (
            <>
              <SegmentedControl style={{ maxWidth: 340 }} value={tab} onChange={setTab} options={[
                { value: 'activity', label: 'Activity' },
                { value: 'recurring', label: isFund ? 'Contributions' : 'Recurring' },
              ]} />
              {tab === 'recurring' ? recurringBlock : activityBlock}
            </>
          ) : activityBlock}
          <RecurringDialog open={recDlg} onClose={() => setRecDlg(false)} onAdd={(item) => setRec((r) => [...r, item])} cats={cats} />
          <BudgetDialog open={budgetDlg} onClose={() => setBudgetDlg(false)} value={budget} onSave={setBudget} spaceName={space.name} />
          <CategoryDialog open={catDlg} onClose={() => setCatDlg(false)} onAdd={addCat} />
        </div>
      </div>
    );
  }

  function SectionHead({ title, action, onAction }) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 4px 12px' }}>
        <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
        {action && <button onClick={onAction} style={{ border: 'none', background: 'none', font: 'var(--font-label)', color: 'var(--text-accent)', cursor: 'pointer' }}>{action}</button>}
      </div>
    );
  }

  window.DesktopSidebar = Sidebar;
  window.DesktopHome = Home;
  window.DesktopSpaceView = SpaceView;
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


// ===== desktop-orchestrator.jsx =====
// Desktop orchestrator — assembles the Sprout PWA on a wide screen: a start-menu
// launcher, sidebar navigation, roll-up overview + scoped space views, Reports,
// live "add entry" (mutates the ledger), and a light/dark toggle.
// Registers window.DesktopApp. Reuses window.DesktopHome / DesktopSpaceView /
// ReportsScreen / AddExpenseDialog / NewSpaceDialog / SpaceSettingsDialog.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Icon, Avatar, Button, IconButton, Card, ListRow, Toast } = K;
  const D = window.SproutData;

  // --- Sidebar (forked from the kit so we can add launcher + theme controls) --
  function AppSidebar({ active, setActive, onNewSpace, onMenu, dark, onToggleTheme }) {
    const item = (id, icon, label, sub) => (
      <button key={id} onClick={() => setActive(id)} data-active={active === id} className="nav-item">
        <Icon name={icon} size={18} /> <span>{label}</span>
        {sub && <em style={{ marginLeft: 'auto', fontStyle: 'normal', font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>{sub}</em>}
      </button>
    );
    const shared = D.spaces.filter((s) => s.group === 'shared');
    return (
      <aside className="sidebar">
        <div className="brand"><img src="sprout/assets/sprout-mark.svg" width="30" height="30" alt="" /><span>Sprout</span></div>
        <nav className="nav">
          {item('home', 'pie-chart', 'Overview')}
          {item('reports', 'bar-chart', 'Reports')}
        </nav>
        <div>
          <div className="navlabel">Shared</div>
          <nav className="nav">
            {shared.map((s) => item(s.id, s.icon, s.name, s.sub))}
            <button className="nav-item" onClick={onNewSpace} style={{ color: 'var(--text-accent)' }}>
              <Icon name="plus" size={18} /> <span>New space</span>
            </button>
          </nav>
        </div>
        <div>
          <div className="navlabel">Personal</div>
          <nav className="nav">
            {item('jc', 'user', 'JC')}
            {item('ch', 'user', 'CH')}
          </nav>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 6, padding: '0 4px 8px' }}>
            <button className="nav-item" onClick={onMenu} style={{ flex: 1 }}><Icon name="menu" size={18} /> <span>Start menu</span></button>
            <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" variant="secondary" onClick={onToggleTheme} />
          </div>
          <div className="account">
            <Avatar name="JC" size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>JC &amp; CH</div>
              <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Household</div>
            </div>
            <Icon name="settings" size={16} style={{ color: 'var(--text-subtle)' }} />
          </div>
        </div>
      </aside>
    );
  }

  const LAUNCH = [
    { key: 'home', icon: 'pie-chart', title: 'Overview', desc: 'Household roll-up + balances' },
    { key: 'reports', icon: 'bar-chart', title: 'Reports', desc: 'Trend, who paid, top categories' },
    { key: 'expenses', icon: 'receipt', title: 'A space', desc: 'Everyday Expenses — scoped ledger' },
    { key: 'jc', icon: 'user', title: 'Personal', desc: "JC's income & spending" },
    { key: 'add', icon: 'plus', title: 'Add an entry', desc: 'Scoped add flow with live totals' },
    { key: 'new', icon: 'wallet', title: 'New space', desc: 'Create a space, pick an icon' },
  ];

  function DesktopLauncher({ onPick, dark, onToggleTheme }) {
    const tile = (icon) => (
      <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={23} />
      </span>
    );
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, boxSizing: 'border-box' }}>
        <div style={{ width: 720, maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img src="sprout/assets/sprout-icon.svg" width="52" height="52" alt="Sprout" style={{ borderRadius: 14, boxShadow: 'var(--shadow-sm)' }} />
              <div>
                <div style={{ font: 'var(--font-h1)', fontWeight: 'var(--fw-extra)', color: 'var(--text-strong)', lineHeight: 1.05 }}>Sprout</div>
                <div style={{ font: 'var(--font-body)', color: 'var(--text-muted)' }}>Prototype · desktop — pick a starting point</div>
              </div>
            </div>
            <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" variant="secondary" onClick={onToggleTheme} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            {LAUNCH.map((it) => (
              <Card key={it.key} interactive padding="md" onClick={() => onPick(it.key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {tile(it.icon)}
                  <div style={{ flex: 1 }}>
                    <div style={{ font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{it.title}</div>
                    <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{it.desc}</div>
                  </div>
                  <Icon name="chevron-right" size={18} style={{ color: 'var(--text-subtle)' }} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function DesktopReports() {
    const { Card, Amount, ProgressBar, CategoryIcon, SegmentedControl, Icon } = K;
    const [range, setRange] = React.useState('6m');
    const [openPerson, setOpenPerson] = React.useState(null);
    const n = range === '3m' ? 3 : 6;
    const hist = D.history.slice(-n);
    const maxV = Math.max(...hist.map((h) => h.v));
    const avg = hist.reduce((a, h) => a + h.v, 0) / hist.length;
    const byPerson = D.spendByPerson();
    const personTotal = Object.values(byPerson).reduce((a, b) => a + b, 0);
    const bySpace = D.spendBySpace();
    const spaceTotal = bySpace.reduce((a, s) => a + s.value, 0);
    const top = D.topCategories();
    const topMax = Math.max(...top.map((t) => t.value));
    const personColor = { JC: 'var(--sage-500)', CH: 'var(--sage-300)', Joint: 'var(--sage-700)' };
    const personBySpace = (p) => bySpace.map((s) => {
      const sp = D.space(s.id);
      const v = sp.tx.filter((t) => t.payer === p).reduce((a, t) => a + t.amount, 0);
      return { name: s.short, icon: s.icon, value: v };
    }).filter((x) => x.value > 0);
    const H = ({ children }) => <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: '0 4px 12px' }}>{children}</h3>;
    return (
      <div className="main">
        <header className="topbar">
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Household · {D.monthLabel}</div>
            <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>Reports</h1>
          </div>
          <SegmentedControl size="sm" value={range} onChange={setRange} options={[{ value: '3m', label: '3M' }, { value: '6m', label: '6M' }]} />
        </header>
        <div className="scroll">
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 4px 12px' }}>
              <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>Spending trend</h3>
              <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>avg RM {Math.round(avg).toLocaleString()}/mo</span>
            </div>
            <Card padding="lg">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, height: 200 }}>
                {hist.map((h, i) => { const isNow = i === hist.length - 1; return (
                  <div key={h.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-semibold)', color: isNow ? 'var(--sage-700)' : 'var(--text-subtle)' }}>{(h.v / 1000).toFixed(1)}k</span>
                    <div style={{ width: '100%', maxWidth: 60, height: `${(h.v / maxV) * 100}%`, borderRadius: 'var(--radius-sm)', background: isNow ? 'var(--accent)' : 'var(--sage-200)' }} />
                    <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{h.m}</span>
                  </div>); })}
              </div>
            </Card>
          </div>
          <div className="row-2">
            <div>
              <H>By space</H>
              <Card padding="lg">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {bySpace.map((s) => (
                    <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--font-label)', color: 'var(--text-body)' }}><Icon name={s.icon} size={16} style={{ color: 'var(--text-muted)' }} />{s.name}</span>
                        <Amount value={s.value} />
                      </div>
                      <ProgressBar value={s.value} max={spaceTotal} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <H>Who paid</H>
              <Card padding="lg">
                <div style={{ display: 'flex', gap: 3, height: 12, borderRadius: 'var(--radius-pill)', overflow: 'hidden', marginBottom: 16 }}>
                  {['JC', 'CH', 'Joint'].map((p) => <span key={p} style={{ width: `${(byPerson[p] / personTotal) * 100}%`, background: personColor[p] }} />)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {['JC', 'CH', 'Joint'].map((p) => { const open = openPerson === p; const label = p === 'Joint' ? 'Joint Fund' : p; return (
                    <div key={p}>
                      <button onClick={() => setOpenPerson(open ? null : p)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', border: 'none', background: 'none', cursor: 'pointer' }}>
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
                    </div>); })}
                </div>
              </Card>
            </div>
          </div>
          <div>
            <H>Top categories</H>
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
      </div>
    );
  }
  window.DesktopReports = DesktopReports;

  window.DesktopApp = function DesktopApp() {
    const [route, setRoute] = React.useState('menu'); // menu | app
    const [dark, setDark] = React.useState(false);
    const [active, setActive] = React.useState('home');
    const [addOpen, setAddOpen] = React.useState(false);
    const [newSpaceOpen, setNewSpaceOpen] = React.useState(false);
    const [settingsSpace, setSettingsSpace] = React.useState(null);
    const [toast, setToast] = React.useState(null);
    const [ver, setVer] = React.useState(0);
    const timer = React.useRef(null);

    const notify = (title, desc) => { setToast({ title, desc }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 3200); };
    const onSave = (entry) => {
      const tx = D.addTx(entry);
      const amt = parseFloat(entry.amount) || 0;
      setAddOpen(false); setVer((v) => v + 1);
      notify(entry.dir === 'in' ? 'Income added' : 'Entry added', `RM ${amt.toFixed(2)} · ${(tx && tx.vendor) || 'Saved'}`);
    };
    const onCreate = (sp) => { setNewSpaceOpen(false); notify('Space created', `${sp.name} is ready — add your categories`); };
    const openAdd = () => setAddOpen(true);
    const goSpace = (id) => setActive(id);
    const addSpace = (active === 'home' || active === 'reports') ? 'expenses' : active;

    const launch = (key) => {
      if (key === 'add') { setRoute('app'); setActive('home'); setAddOpen(true); return; }
      if (key === 'new') { setRoute('app'); setActive('home'); setNewSpaceOpen(true); return; }
      setRoute('app'); setActive(key);
    };

    const MainView = active === 'home'
      ? <window.DesktopHome onAdd={openAdd} goSpace={goSpace} />
      : active === 'reports'
        ? <window.DesktopReports />
        : <window.DesktopSpaceView spaceId={active} onAdd={openAdd} onSettings={(id) => setSettingsSpace(id)} />;

    return (
      <div data-theme={dark ? 'dark' : undefined} style={{ minHeight: '100vh', background: 'var(--surface-canvas)', fontFamily: 'var(--font-sans)', transition: 'background var(--dur-base)' }}>
        {route === 'menu'
          ? <DesktopLauncher onPick={launch} dark={dark} onToggleTheme={() => setDark((d) => !d)} />
          : (
            <div className="app">
              <AppSidebar active={active} setActive={setActive} onNewSpace={() => setNewSpaceOpen(true)} onMenu={() => setRoute('menu')} dark={dark} onToggleTheme={() => setDark((d) => !d)} />
              <div style={{ display: 'contents' }} key={active + ':' + ver}>{MainView}</div>
            </div>
          )}

        <window.AddExpenseDialog open={addOpen} initialSpace={addSpace} onClose={() => setAddOpen(false)} onSave={onSave} />
        <window.NewSpaceDialog open={newSpaceOpen} onClose={() => setNewSpaceOpen(false)} onCreate={onCreate} />
        <window.SpaceSettingsDialog open={!!settingsSpace} spaceId={settingsSpace} onClose={() => setSettingsSpace(null)} />
        {toast && (
          <div style={{ position: 'fixed', right: 28, bottom: 28, zIndex: 2000 }}>
            <Toast title={toast.title} description={toast.desc} action="Undo" onAction={() => setToast(null)} />
          </div>
        )}
      </div>
    );
  };
})();

