import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Amount,
  Badge,
  Button,
  Card,
  CategoryIcon,
  Dialog,
  IconButton,
  Input,
  ListRow,
  ProgressBar,
  SegmentedControl,
  Select,
  Tag,
} from '../design-system';
import type { BadgeTone } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import type { Category, Space, Tx } from '../domain/types';
import { fundBalance, secondaryFields, spentOf } from '../domain/selectors';
import { shortDate } from '../domain/format';
import { useIsDesktop } from '../shell/useIsDesktop';

const byDateDesc = (a: Tx, b: Tx) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function subtitleFor(space: Space, t: Tx): string {
  return [
    ...secondaryFields(space).map((f) => t.fieldValues[f.key]).filter(Boolean),
    t.note,
    t.payer && space.group !== 'personal' ? t.payer : '',
  ]
    .filter(Boolean)
    .join(' · ');
}

function statusTone(s?: Tx['status']): BadgeTone {
  return s === 'paid' ? 'income' : s === 'due' ? 'warning' : 'neutral';
}

function statusMeta(t: Tx) {
  if (!t.status) return shortDate(t.date);
  return (
    <Badge tone={statusTone(t.status)} dot>
      {t.status === 'due' ? `Due ${shortDate(t.date)}` : 'Paid'}
    </Badge>
  );
}

// ---- budget dialog -------------------------------------------------------
function BudgetDialog({
  open,
  onClose,
  value,
  spaceId,
  spaceName,
}: {
  open: boolean;
  onClose: () => void;
  value?: number;
  spaceId: string;
  spaceName: string;
}) {
  const updateSpace = useAppStore((s) => s.updateSpace);
  const [v, setV] = useState(value ? String(value) : '');
  useEffect(() => {
    if (open) setV(value ? String(value) : '');
  }, [open, value]);
  const save = () => {
    void updateSpace(spaceId, { budget: parseFloat(v) || 0 });
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Monthly budget"
      description={`Set the spending target for ${spaceName}.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button iconStart="check" onClick={save} disabled={!v}>
            Save budget
          </Button>
        </>
      }
    >
      <Input
        label="Budget / month"
        prefix="RM"
        placeholder="0.00"
        inputMode="decimal"
        value={v}
        onChange={(e) => setV(e.target.value)}
        autoFocus
      />
    </Dialog>
  );
}

// ---- recurring dialog ----------------------------------------------------
function RecurringDialog({
  open,
  onClose,
  spaceId,
  cats,
}: {
  open: boolean;
  onClose: () => void;
  spaceId: string;
  cats: Category[];
}) {
  const addRecurring = useAppStore((s) => s.addRecurring);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState(cats[0]?.key ?? 'money');
  useEffect(() => {
    if (open) {
      setLabel('');
      setAmount('');
      setCat(cats[0]?.key ?? 'money');
    }
  }, [open, cats]);
  const add = () => {
    void addRecurring({ spaceId, label, cat, amount: parseFloat(amount) || 0 });
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add commitment"
      description="A fixed amount that repeats every month."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button iconStart="check" onClick={add} disabled={!label || !amount}>
            Add
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input
          label="Name"
          placeholder="e.g. Streaming, Insurance…"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
        />
        <Input
          label="Amount / month"
          prefix="RM"
          placeholder="0.00"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {cats.length > 0 && (
          <Select
            label="Category"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            options={cats.map((c) => ({ value: c.key, label: c.label }))}
          />
        )}
      </div>
    </Dialog>
  );
}

// ---- hero ----------------------------------------------------------------
function Hero({ space, desktop }: { space: Space; desktop: boolean }) {
  const snapshot = useAppStore((s) => s.snapshot);
  const month = useAppStore((s) => s.month);
  const [budgetDlg, setBudgetDlg] = useState(false);

  const isSpend = space.kind === 'spend';
  const label =
    space.kind === 'fund'
      ? 'Shared balance'
      : space.kind === 'invest'
        ? `${space.sub ? space.sub + ' · ' : ''}portfolio value`
        : 'Spent this month';
  const value =
    space.kind === 'fund'
      ? fundBalance(space, snapshot.txs)
      : space.kind === 'invest'
        ? space.value ?? 0
        : spentOf(space, snapshot.txs, month);
  const budget = space.budget ?? 0;

  // Desktop hero is always sage; mobile spend hero is a white card.
  const sageCard = desktop || !isSpend;

  const budgetRow = isSpend && (
    <div style={{ marginTop: 16 }}>
      {budget > 0 ? (
        desktop ? (
          <>
            <div style={{ height: 8, borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.22)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (value / budget) * 100)}%`,
                  height: '100%',
                  background: '#fff',
                  borderRadius: 'var(--radius-pill)',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)' }}>
              <button
                onClick={() => setBudgetDlg(true)}
                style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)', textAlign: 'left' }}
              >
                {Math.round((value / budget) * 100)}% of RM {budget.toLocaleString()}{' '}
                <span style={{ fontWeight: 'var(--fw-semibold)', textDecoration: 'underline' }}>Edit</span>
              </button>
              <span style={{ fontWeight: 'var(--fw-semibold)' }}>
                {value > budget
                  ? `RM ${Math.round(value - budget).toLocaleString()} over`
                  : `RM ${Math.round(budget - value).toLocaleString()} left`}
              </span>
            </div>
          </>
        ) : (
          <>
            <ProgressBar value={value} max={budget} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
              <button
                onClick={() => setBudgetDlg(true)}
                style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', font: 'var(--font-caption)', color: 'var(--text-muted)', textAlign: 'left' }}
              >
                {Math.round((value / budget) * 100)}% of RM {budget.toLocaleString()} budget{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>· Edit</span>
              </button>
              <span
                style={{
                  fontWeight: 'var(--fw-semibold)',
                  color: value > budget ? 'var(--money-over)' : 'var(--text-body)',
                  whiteSpace: 'nowrap',
                }}
              >
                {value > budget
                  ? `RM ${Math.round(value - budget).toLocaleString()} over`
                  : `RM ${Math.round(budget - value).toLocaleString()} left`}
              </span>
            </div>
          </>
        )
      ) : (
        <button
          onClick={() => setBudgetDlg(true)}
          style={{
            border: `1.5px dashed ${sageCard ? 'rgba(255,255,255,0.6)' : 'var(--border-strong)'}`,
            background: 'none',
            cursor: 'pointer',
            font: 'var(--font-label)',
            color: sageCard ? '#fff' : 'var(--accent)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            width: '100%',
          }}
        >
          + Set a monthly budget
        </button>
      )}
    </div>
  );

  return (
    <Card
      padding="lg"
      style={{
        background: sageCard ? 'var(--accent)' : 'var(--surface-card)',
        border: sageCard ? 'none' : undefined,
      }}
    >
      <span style={{ font: 'var(--font-label)', color: sageCard ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>
        {label}
      </span>
      <Amount
        value={value}
        size="hero"
        style={{ display: 'block', marginTop: 4, color: sageCard ? '#fff' : 'var(--sage-700)' }}
      />
      {budgetRow}
      <BudgetDialog
        open={budgetDlg}
        onClose={() => setBudgetDlg(false)}
        value={space.budget}
        spaceId={space.id}
        spaceName={space.name}
      />
    </Card>
  );
}

// ---- activity ------------------------------------------------------------
function ActivityPanel({ space, desktop }: { space: Space; desktop: boolean }) {
  const snapshot = useAppStore((s) => s.snapshot);
  const updateSpace = useAppStore((s) => s.updateSpace);
  const [cat, setCat] = useState('all');
  const [edit, setEdit] = useState(false);
  const [newCat, setNewCat] = useState('');

  const cats = space.cats;
  useEffect(() => {
    setCat('all');
    setEdit(false);
  }, [space.id]);

  // The space ledger shows the FULL history (all months), not just the current
  // month: back-dated entries must remain reachable somewhere, and the app has
  // no month switcher. Month-scoped roll-ups (Hero "spent this month", Home,
  // Reports) stay parameterized by `month`, so they are unaffected by this list.
  const list = useMemo(() => {
    let l = snapshot.txs.filter((t) => t.spaceId === space.id);
    if (cat !== 'all') l = l.filter((t) => t.cat === cat);
    return l.slice().sort(byDateDesc);
  }, [snapshot.txs, space.id, cat]);

  const removeCat = (key: string) => {
    void updateSpace(space.id, { cats: cats.filter((c) => c.key !== key) });
    if (cat === key) setCat('all');
  };
  const addCat = () => {
    const label = newCat.trim();
    if (!label) return;
    const key = slug(label) || `cat-${cats.length}`;
    if (!cats.some((c) => c.key === key)) {
      void updateSpace(space.id, { cats: [...cats, { key, label }] });
    }
    setNewCat('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {(cats.length > 0 || edit) && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 8px' }}>
            <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)' }}>
              Categories
            </span>
            <button
              onClick={() => setEdit((e) => !e)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--font-label)', color: 'var(--accent)', padding: 4 }}
            >
              {edit ? 'Done' : 'Edit'}
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              ...(desktop ? { flexWrap: 'wrap' } : { overflowX: 'auto', paddingBottom: 2 }),
            }}
          >
            {!edit && (
              <Tag selected={cat === 'all'} onClick={() => setCat('all')}>
                All
              </Tag>
            )}
            {cats.map((c) => (
              <Tag
                key={c.key}
                selected={!edit && cat === c.key}
                onClick={edit ? undefined : () => setCat(c.key)}
                onRemove={edit ? () => removeCat(c.key) : undefined}
              >
                <CategoryIcon category={c.key} size={18} radius="var(--radius-xs)" style={{ marginRight: 4 }} />
                {c.label}
              </Tag>
            ))}
            {edit && (
              <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCat();
                }}
                placeholder="+ Add category"
                aria-label="Add category"
                style={{
                  height: 32,
                  minWidth: 130,
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px dashed var(--border-strong)',
                  background: 'var(--surface-card)',
                  font: 'var(--font-label)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-strong)',
                  outline: 'none',
                }}
              />
            )}
          </div>
        </div>
      )}
      <Card padding="sm">
        {list.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', font: 'var(--font-body)', color: 'var(--text-muted)' }}>
            No entries yet.
          </div>
        ) : (
          list.map((t, i) => (
            <ListRow
              key={t.id}
              leading={<CategoryIcon category={t.cat} />}
              title={t.title}
              subtitle={subtitleFor(space, t)}
              trailing={
                <Amount value={t.amount} kind={t.dir === 'in' ? 'in' : 'neutral'} showSign={t.dir === 'in'} />
              }
              meta={statusMeta(t)}
              divider={i < list.length - 1}
            />
          ))
        )}
      </Card>
    </div>
  );
}

// ---- recurring -----------------------------------------------------------
function RecurringPanel({ space }: { space: Space }) {
  const snapshot = useAppStore((s) => s.snapshot);
  const deleteRecurring = useAppStore((s) => s.deleteRecurring);
  const [edit, setEdit] = useState(false);
  const [dlg, setDlg] = useState(false);

  const isFund = space.kind === 'fund';
  const items = snapshot.recurring.filter((r) => r.spaceId === space.id);
  const sum = items.reduce((a, r) => a + r.amount, 0);
  useEffect(() => setEdit(false), [space.id]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 8px' }}>
        <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)' }}>
          {isFund ? 'How the fund is formed' : 'Monthly commitments'}
        </span>
        <button
          onClick={() => setEdit((e) => !e)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', font: 'var(--font-label)', color: 'var(--accent)', padding: 4 }}
        >
          {edit ? 'Done' : 'Edit'}
        </button>
      </div>
      <Card padding="sm">
        {items.length === 0 && !edit && (
          <div
            style={{
              padding: 'var(--space-8) var(--space-5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
              textAlign: 'center',
            }}
          >
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 0, maxWidth: 260 }}>
              {isFund
                ? 'No contributions yet. Add the amounts that build this fund each month.'
                : 'No recurring items yet. Add the fixed amounts that repeat every month.'}
            </p>
            <Button variant="secondary" iconStart="plus" onClick={() => setDlg(true)}>
              {isFund ? 'Add contribution' : 'Add recurring'}
            </Button>
          </div>
        )}
        {items.map((r) => (
          <ListRow
            key={r.id}
            leading={<CategoryIcon category={r.cat} />}
            title={r.label}
            trailing={
              edit ? (
                <IconButton icon="x" label="Remove" variant="ghost" size="sm" onClick={() => void deleteRecurring(r.id)} />
              ) : (
                <Amount value={r.amount} kind={isFund ? 'in' : 'neutral'} showSign={isFund} />
              )
            }
            divider
          />
        ))}
        {edit && (
          <ListRow
            leading={
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                +
              </div>
            }
            title={<span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>Add commitment</span>}
            onClick={() => setDlg(true)}
            divider
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)' }}>
          <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)' }}>
            {isFund ? 'Total contributed' : 'Total / month'}
          </span>
          <Amount value={sum} kind={isFund ? 'in' : 'neutral'} showSign={isFund} weight={'var(--fw-extra)' as CSSProperties['fontWeight']} />
        </div>
      </Card>
      <RecurringDialog open={dlg} onClose={() => setDlg(false)} spaceId={space.id} cats={space.cats} />
    </div>
  );
}

// ---- screen --------------------------------------------------------------
export function SpaceDetail() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const { id } = useParams();
  const snapshot = useAppStore((s) => s.snapshot);
  const openSpaceSettings = useAppStore((s) => s.openSpaceSettings);
  const space = snapshot.spaces.find((s) => s.id === id);
  const [tab, setTab] = useState<'activity' | 'recurring'>('activity');
  useEffect(() => setTab('activity'), [id]);

  if (!space) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', font: 'var(--font-body)', color: 'var(--text-muted)' }}>
        That space could not be found.
      </div>
    );
  }

  // Spend/fund/invest spaces all support recurring items — always offer the
  // toggle so the first item is discoverable (and creatable from its empty
  // state), even before any recurring item exists. Personal spaces don't.
  const supportsRecurring = space.kind !== 'personal';

  const panels = (
    <>
      {supportsRecurring ? (
        <>
          <SegmentedControl
            fullWidth={!isDesktop}
            style={isDesktop ? { maxWidth: 340 } : undefined}
            value={tab}
            onChange={(v) => setTab(v as 'activity' | 'recurring')}
            options={[
              { value: 'activity', label: 'Activity' },
              { value: 'recurring', label: space.kind === 'fund' ? 'Contributions' : 'Recurring' },
            ]}
          />
          {tab === 'activity' ? (
            <ActivityPanel space={space} desktop={isDesktop} />
          ) : (
            <RecurringPanel space={space} />
          )}
        </>
      ) : (
        <ActivityPanel space={space} desktop={isDesktop} />
      )}
    </>
  );

  if (isDesktop) {
    return (
      <>
        <div className="row-2">
          <Hero space={space} desktop />
        </div>
        {panels}
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <IconButton
          icon="arrow-left"
          label="Back"
          variant="ghost"
          onClick={() => navigate('/spaces')}
          style={{ marginLeft: -8 }}
        />
        <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)', flex: 1 }}>{space.name}</span>
        <IconButton icon="settings" label="Space settings" variant="ghost" onClick={() => openSpaceSettings(space.id)} />
      </div>
      <Hero space={space} desktop={false} />
      {panels}
    </div>
  );
}
