import type { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Amount,
  Avatar,
  Badge,
  Card,
  CategoryIcon,
  Icon,
  ListRow,
  StatCard,
} from '../design-system';
import type { IconName } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import type { Space, Tx } from '../domain/types';
import {
  entryCount,
  fundBalance,
  spendSpaces as selSpendSpaces,
  spentOf,
  totalBudget as selTotalBudget,
  totalSpent as selTotalSpent,
} from '../domain/selectors';
import { monthLabel, shortDate } from '../domain/format';
import { useIsDesktop, greetingWord } from '../shell/useIsDesktop';

const SAGE: CSSProperties = { color: 'var(--sage-700)' };
const SEG_OPACITY = [0.95, 0.66, 0.4, 0.28, 0.2];

// ---- shared helpers ------------------------------------------------------
function firstWord(name: string): string {
  return name.split(' ')[0];
}

function byDateDesc(a: Tx, b: Tx): number {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}

function SectionHead({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '0 4px 10px',
      }}
    >
      <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
      {action && (
        <button
          onClick={onAction}
          style={{
            border: 'none',
            background: 'none',
            font: 'var(--font-label)',
            color: 'var(--text-accent)',
            cursor: 'pointer',
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

function EmptyLine({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: 'var(--space-4)', font: 'var(--font-body)', color: 'var(--text-muted)', textAlign: 'center' }}>
      {children}
    </div>
  );
}

// ---- data hook -----------------------------------------------------------
function useHomeData() {
  const snapshot = useAppStore((s) => s.snapshot);
  const month = useAppStore((s) => s.month);
  const { spaces, txs } = snapshot;

  const spendList = selSpendSpaces(spaces);
  const total = selTotalSpent(spaces, txs, month);
  const budget = selTotalBudget(spaces);
  const left = budget - total;
  const fund = spaces.find((s) => s.kind === 'fund');
  const invest = spaces.find((s) => s.kind === 'invest');

  const recent = txs
    .filter((t) => spendList.some((s) => s.id === t.spaceId) && t.dir !== 'in')
    .slice()
    .sort(byDateDesc)
    .slice(0, 6);

  const bills = txs
    .filter((t) => t.status && (t.spaceId === 'housing' || t.spaceId === 'car'))
    .slice()
    .sort(byDateDesc);

  return {
    snapshot,
    month,
    spendList,
    total,
    budget,
    left,
    fund,
    invest,
    recent,
    bills,
    txs,
    spaces,
  };
}

// ---- hero card (shared) --------------------------------------------------
function HeroCard({ desktop = false }: { desktop?: boolean }) {
  const { spendList, total, budget, left, txs, month } = useHomeData();

  const segFor = (s: Space) => (total > 0 ? spentOf(s, txs, month) / total : 0);

  return (
    <Card
      padding="lg"
      style={{
        background: 'var(--accent)',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        ...(desktop ? { gridColumn: 'span 2' } : {}),
      }}
    >
      <span style={{ font: 'var(--font-label)', color: 'rgba(255,255,255,0.85)' }}>
        Total spent · {spendList.map((s) => firstWord(s.name)).join(' + ') || 'this month'}
      </span>
      <Amount
        value={total}
        size="hero"
        style={{ color: '#fff', display: 'block', margin: desktop ? '10px 0 4px' : '6px 0 0', ...(desktop ? { fontSize: 54 } : {}) }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: desktop ? 10 : 8,
          marginTop: 6,
          marginBottom: desktop ? 20 : 16,
        }}
      >
        <span style={{ font: desktop ? 'var(--font-label)' : 'var(--font-caption)', fontWeight: 'var(--fw-semibold)', color: '#fff' }}>
          RM {Math.round(left).toLocaleString()} left
        </span>
        <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.8)' }}>
          of RM {budget.toLocaleString()} budget
        </span>
      </div>

      <div
        style={{
          marginTop: desktop ? 'auto' : 0,
          display: 'flex',
          gap: 3,
          height: desktop ? 10 : 8,
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.22)',
        }}
      >
        {spendList.map((s, i) => (
          <span
            key={s.id}
            style={{ width: `${segFor(s) * 100}%`, background: `rgba(255,255,255,${SEG_OPACITY[i] ?? 0.2})` }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: desktop ? 12 : 10, gap: 8 }}>
        {spendList.map((s) => (
          <span
            key={s.id}
            style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)', fontWeight: 'var(--fw-medium)' }}
          >
            {desktop
              ? `${s.name} · RM ${spentOf(s, txs, month).toLocaleString()}`
              : `${s.short ?? firstWord(s.name)} ${total > 0 ? Math.round(segFor(s) * 100) : 0}%`}
          </span>
        ))}
      </div>
    </Card>
  );
}

// ---- two stat cards (shared) ---------------------------------------------
function BalanceCards({ column = false }: { column?: boolean }) {
  const { snapshot, fund, invest } = useHomeData();
  const fundValue = fund ? fundBalance(fund, snapshot.txs) : 0;
  return (
    <div
      style={
        column
          ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }
          : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }
      }
    >
      <StatCard
        label="Joint Fund"
        value={fundValue}
        icon="wallet"
        footer="Shared balance"
        amountProps={{ style: SAGE }}
      />
      <StatCard
        label={invest?.sub ? `Investment · ${invest.sub}` : 'Investment'}
        value={invest?.value ?? 0}
        icon="trending-up"
        footer="Portfolio value"
        amountProps={{ style: SAGE }}
      />
    </div>
  );
}

function spaceTile(icon: IconName) {
  return (
    <span
      style={{
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent-soft)',
        color: 'var(--accent-soft-fg)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={20} />
    </span>
  );
}

function billBadge(t: Tx): ReactNode {
  if (t.status === 'paid') return <Badge tone="income" dot>Paid</Badge>;
  if (t.status === 'due') return <Badge tone="warning" dot>{`Due ${shortDate(t.date)}`}</Badge>;
  return shortDate(t.date);
}

// ============================================================
// MOBILE HOME
// ============================================================
function MobileHome() {
  const navigate = useNavigate();
  const { snapshot, month, spendList, txs, recent } = useHomeData();
  const people = snapshot.household.people;
  const name = people[0]?.name ?? 'there';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
            {greetingWord()}, {name} 🌿
          </div>
          <div style={{ font: 'var(--font-h2)', color: 'var(--text-strong)' }}>{monthLabel(month)}</div>
        </div>
        <div style={{ display: 'flex', marginRight: 6 }}>
          {people.map((p, i) => (
            <Avatar
              key={p.id}
              name={p.name}
              size={34}
              style={{ marginLeft: i === 0 ? 0 : -10, boxShadow: '0 0 0 2px var(--surface-canvas)' }}
            />
          ))}
        </div>
      </div>

      <HeroCard />
      <BalanceCards />

      {/* spaces */}
      <div>
        <SectionHead title="Spaces" action="Manage" onAction={() => navigate('/spaces')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {spendList.map((s) => (
            <Card key={s.id} interactive padding="sm" onClick={() => navigate(`/spaces/${s.id}`)}>
              <ListRow
                leading={spaceTile(s.icon as IconName)}
                title={s.name}
                subtitle={s.sub ? s.sub : `${entryCount(s.id, txs, month)} entries`}
                trailing={<Amount value={spentOf(s, txs, month)} />}
                meta={s.budget ? `of RM ${s.budget.toLocaleString()}` : 'this month'}
                chevron
              />
            </Card>
          ))}
          {spendList.length === 0 && (
            <Card padding="sm">
              <EmptyLine>No spaces yet</EmptyLine>
            </Card>
          )}
        </div>
      </div>

      {/* recent */}
      <div>
        <SectionHead title="Recent activity" action="See all" onAction={() => navigate('/spaces/expenses')} />
        <Card padding="sm">
          {recent.length === 0 ? (
            <EmptyLine>No entries yet</EmptyLine>
          ) : (
            recent.map((e, i) => (
              <ListRow
                key={e.id}
                leading={<CategoryIcon category={e.cat} />}
                title={e.title}
                subtitle={[e.note, e.payer].filter(Boolean).join(' · ')}
                trailing={<Amount value={e.amount} />}
                meta={shortDate(e.date)}
                divider={i < recent.length - 1}
              />
            ))
          )}
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// DESKTOP OVERVIEW
// ============================================================
function DesktopOverview() {
  const navigate = useNavigate();
  const { recent, bills } = useHomeData();

  return (
    <>
      <div className="row-3">
        <HeroCard desktop />
        <BalanceCards column />
      </div>

      <div className="row-2">
        <div>
          <SectionHead title="Recent · Everyday Expenses" action="Open" onAction={() => navigate('/spaces/expenses')} />
          <Card padding="sm">
            {recent.length === 0 ? (
              <EmptyLine>No entries yet</EmptyLine>
            ) : (
              recent.map((e, i) => (
                <ListRow
                  key={e.id}
                  leading={<CategoryIcon category={e.cat} />}
                  title={e.title}
                  subtitle={[e.note, e.payer].filter(Boolean).join(' · ')}
                  trailing={<Amount value={e.amount} />}
                  meta={shortDate(e.date)}
                  divider={i < recent.length - 1}
                />
              ))
            )}
          </Card>
        </div>
        <div>
          <SectionHead title="Bills & installments" action="Housing" onAction={() => navigate('/spaces/housing')} />
          <Card padding="sm">
            {bills.length === 0 ? (
              <EmptyLine>No bills yet</EmptyLine>
            ) : (
              bills.map((c, i) => (
                <ListRow
                  key={c.id}
                  leading={<CategoryIcon category={c.cat} />}
                  title={c.title}
                  subtitle={`Paid by ${c.payer || 'Unspecified'}`}
                  trailing={<Amount value={c.amount} />}
                  meta={billBadge(c)}
                  divider={i < bills.length - 1}
                />
              ))
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export function Home() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopOverview /> : <MobileHome />;
}
