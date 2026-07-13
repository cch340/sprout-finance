import { useEffect, useState } from 'react';
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
  StatCard,
} from '../design-system';
import { useAppStore } from '../store/useAppStore';
import type { Category, Tx } from '../domain/types';
import { incomeOf, leftThisMonth, spentOfPersonal } from '../domain/selectors';
import { monthLabel, shortDate } from '../domain/format';
import { useIsDesktop } from '../shell/useIsDesktop';

const PAGE = 30;
const inMonth = (t: Tx, month: string) => t.date.slice(0, 7) === month;
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

  // Incremental "show more": render the first PAGE rows, reveal PAGE more at a
  // time. Reset the chunk when the viewed person or month changes.
  const [visible, setVisible] = useState(PAGE);
  useEffect(() => setVisible(PAGE), [who, month]);

  const people = spaces
    .filter((s) => s.kind === 'personal')
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const person = people.find((p) => p.id === who);

  if (!person) return <EmptyLine>That person could not be found.</EmptyLine>;

  const income = incomeOf(person.id, txs, month);
  const spent = spentOfPersonal(person.id, txs, month);
  const left = leftThisMonth(person.id, txs, month);
  const list = txs
    .filter((t) => t.spaceId === person.id && inMonth(t, month))
    .slice()
    .sort(byDateDesc);

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

  const shown = list.slice(0, visible);
  const ledger = (
    <>
      <Card padding="sm">
        {list.length === 0 ? <EmptyLine>No entries yet this month.</EmptyLine> : txRows(shown, person.cats, openEntryDetail)}
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
        {ledger}
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
      {ledger}
    </div>
  );
}
