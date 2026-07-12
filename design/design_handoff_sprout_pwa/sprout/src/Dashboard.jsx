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
    let tx = isPersonal ? person.tx.filter((t) => t.dir === 'out') : space.tx;
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
              <StatCard label="Income" value={person.income} icon="banknote" footer={`${person.name} · ${D.monthLabel}`} amountProps={{ kind: 'in' }} />
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
