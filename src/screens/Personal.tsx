import type { CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Amount,
  Avatar,
  Card,
  CategoryIcon,
  ListRow,
  SegmentedControl,
  StatCard,
} from '../design-system';
import { useAppStore } from '../store/useAppStore';
import type { Tx } from '../domain/types';
import { incomeOf, leftThisMonth, spentOfPersonal } from '../domain/selectors';
import { monthLabel, shortDate } from '../domain/format';
import { useIsDesktop } from '../shell/useIsDesktop';

const inMonth = (t: Tx, month: string) => t.date.slice(0, 7) === month;
const byDateDesc = (a: Tx, b: Tx) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

function EmptyLine({ children }: { children: string }) {
  return (
    <div style={{ padding: 'var(--space-8)', textAlign: 'center', font: 'var(--font-body)', color: 'var(--text-muted)' }}>
      {children}
    </div>
  );
}

function txRows(list: Tx[]) {
  return list.map((t, i) => (
    <ListRow
      key={t.id}
      leading={<CategoryIcon category={t.cat} />}
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
  const { spaces, txs } = snapshot;

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

  const ledger = (
    <Card padding="sm">
      {list.length === 0 ? <EmptyLine>No entries yet this month.</EmptyLine> : txRows(list)}
    </Card>
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
