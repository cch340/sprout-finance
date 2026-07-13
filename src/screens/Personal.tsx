import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Amount,
  Avatar,
  Button,
  Card,
  CategoryIcon,
  ListRow,
  SegmentedControl,
  Select,
  StatCard,
} from '../design-system';
import { useAppStore } from '../store/useAppStore';
import type { Category, Tx } from '../domain/types';
import { incomeOf, leftThisMonth, spentOfPersonal } from '../domain/selectors';
import { monthLabel, shortDate } from '../domain/format';
import { CarryForwardDialog } from '../dialogs/CarryForwardDialog';
import { useIsDesktop } from '../shell/useIsDesktop';

const PAGE = 30;
const byDateDesc = (a: Tx, b: Tx) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

function EmptyLine({ children }: { children: string }) {
  return (
    <div style={{ padding: 'var(--space-8)', textAlign: 'center', font: 'var(--font-body)', color: 'var(--text-muted)' }}>
      {children}
    </div>
  );
}

function txRows(list: Tx[], cats: Category[], onOpen: (id: string) => void) {
  return list.map((t, i) => (
    <ListRow
      key={t.id}
      leading={<CategoryIcon category={t.cat} emoji={cats.find((c) => c.key === t.cat)?.emoji} />}
      title={t.title}
      subtitle={t.note}
      trailing={
        <Amount
          value={t.amount}
          kind={t.dir === 'in' ? 'in' : 'neutral'}
          showSign={t.dir === 'in'}
        />
      }
      meta={shortDate(t.date)}
      onClick={() => onOpen(t.id)}
      divider={i < list.length - 1}
    />
  ));
}

export function Personal() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const { who } = useParams();
  const snapshot = useAppStore((s) => s.snapshot);
  const month = useAppStore((s) => s.month);
  const openEntryDetail = useAppStore((s) => s.openEntryDetail);
  const { spaces, txs } = snapshot;

  // Incremental "show more" + the ledger month filter ('all' shows full history,
  // so seeded past months are visible). Carry-forward dialog prefill or null.
  const [visible, setVisible] = useState(PAGE);
  const [monthSel, setMonthSel] = useState('all');
  const [carry, setCarry] = useState<{ source?: string; target?: string } | null>(null);

  const people = spaces
    .filter((s) => s.kind === 'personal')
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const person = people.find((p) => p.id === who);

  // A person's whole ledger (all months) — personal spaces never hold fund mirrors.
  const personTxs = useMemo(
    () => (person ? txs.filter((t) => t.spaceId === person.id) : []),
    [txs, person],
  );
  // Months that actually have entries (newest first) for the filter.
  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    for (const t of personTxs) set.add(t.date.slice(0, 7));
    const keys = [...set].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    return [{ value: 'all', label: 'All months' }, ...keys.map((k) => ({ value: k, label: monthLabel(k) }))];
  }, [personTxs]);

  useEffect(() => {
    setVisible(PAGE);
    setMonthSel('all');
  }, [who]);
  useEffect(() => setVisible(PAGE), [monthSel]);

  if (!person) return <EmptyLine>That person could not be found.</EmptyLine>;

  // Hero stays "this month" (current calendar month), regardless of the filter.
  const income = incomeOf(person.id, txs, month);
  const spent = spentOfPersonal(person.id, txs, month);
  const left = leftThisMonth(person.id, txs, month);

  // The ledger shows all months by default; the Select narrows it.
  const list = personTxs
    .filter((t) => (monthSel === 'all' ? true : t.date.slice(0, 7) === monthSel))
    .slice()
    .sort(byDateDesc);

  // Carry forward: latest month with data, and whether the current month is empty.
  let latestMonth = '';
  for (const t of personTxs) if (t.date.slice(0, 7) > latestMonth) latestMonth = t.date.slice(0, 7);
  const currentMonthHasEntries = personTxs.some((t) => t.date.slice(0, 7) === month);
  const showCarryBanner = personTxs.length > 0 && !currentMonthHasEntries && !!latestMonth && latestMonth !== month;

  const hero = (extra?: CSSProperties) => (
    <Card padding="lg" style={{ background: 'var(--accent)', border: 'none', ...extra }}>
      <span style={{ font: 'var(--font-label)', color: 'rgba(255,255,255,0.85)' }}>Left this month</span>
      <Amount value={left} size="hero" style={{ color: '#fff', display: 'block', marginTop: 4 }} />
      <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
        <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)' }}>
          Income RM {income.toLocaleString()}
        </span>
        <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)' }}>
          Spent RM {spent.toLocaleString()}
        </span>
      </div>
    </Card>
  );

  const banner = showCarryBanner ? (
    <Card padding="sm" style={{ background: 'var(--surface-sunken)', border: '1px dashed var(--border-strong)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-1)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>
            Nothing in {monthLabel(month)} yet
          </div>
          <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
            Carry {person.name}'s entries forward from {monthLabel(latestMonth)}.
          </div>
        </div>
        <Button variant="secondary" size="sm" iconStart="repeat" onClick={() => setCarry({ source: latestMonth, target: month })}>
          Carry forward
        </Button>
      </div>
    </Card>
  ) : null;

  const controls =
    monthOptions.length > 1 || (personTxs.length > 0 && !showCarryBanner) ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', justifyContent: 'space-between' }}>
        {monthOptions.length > 1 ? (
          <div style={{ maxWidth: 200, flex: 1 }}>
            <Select
              size="sm"
              aria-label="Filter by month"
              value={monthSel}
              onChange={(e) => setMonthSel(e.target.value)}
              options={monthOptions}
            />
          </div>
        ) : (
          <span />
        )}
        {personTxs.length > 0 && !showCarryBanner && (
          <Button
            variant="ghost"
            size="sm"
            iconStart="repeat"
            onClick={() => setCarry({ source: monthSel !== 'all' ? monthSel : latestMonth, target: month })}
          >
            Carry forward
          </Button>
        )}
      </div>
    ) : null;

  const shown = list.slice(0, visible);
  const ledger = (
    <>
      <Card padding="sm">
        {list.length === 0 ? (
          <EmptyLine>{monthSel === 'all' ? 'No entries yet.' : 'No entries this month.'}</EmptyLine>
        ) : (
          txRows(shown, person.cats, openEntryDetail)
        )}
      </Card>
      {list.length > PAGE && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          {visible < list.length && (
            <Button variant="soft" onClick={() => setVisible((v) => v + PAGE)}>
              Show more
            </Button>
          )}
          <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
            Showing {Math.min(visible, list.length)} of {list.length}
          </span>
        </div>
      )}
    </>
  );

  const dialog = (
    <CarryForwardDialog
      open={carry !== null}
      onClose={() => setCarry(null)}
      space={person}
      defaultSource={carry?.source}
      defaultTarget={carry?.target}
    />
  );

  if (isDesktop) {
    return (
      <>
        <div className="row-2">
          {hero()}
          <StatCard
            label="Income"
            value={income}
            icon="banknote"
            footer={`${person.name} · ${monthLabel(month)}`}
            amountProps={{ kind: 'in' }}
          />
        </div>
        {banner}
        {controls}
        {ledger}
        {dialog}
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Avatar name={person.name} size={40} />
        <div>
          <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
            Personal · {monthLabel(month)}
          </div>
          <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-strong)', margin: 0 }}>
            {person.name}'s money
          </h2>
        </div>
      </div>

      {people.length > 1 && (
        <SegmentedControl
          fullWidth
          value={person.id}
          onChange={(v) => navigate(`/personal/${v}`)}
          options={people.map((p) => ({ value: p.id, label: p.name }))}
        />
      )}

      {hero()}
      {banner}
      {controls}
      {ledger}
      {dialog}
    </div>
  );
}
