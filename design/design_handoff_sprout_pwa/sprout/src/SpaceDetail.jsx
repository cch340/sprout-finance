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
