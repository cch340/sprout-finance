import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Amount, Card, CategoryIcon, Icon, ProgressBar, SegmentedControl } from '../design-system';
import type { IconName } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import {
  history,
  monthsInRange,
  payerSpaceBreakdown,
  spendByPersonRange,
  spendBySpaceRange,
  topCategoriesRange,
  UNSPECIFIED,
} from '../domain/selectors';
import { monthLabel } from '../domain/format';
import { useIsDesktop } from '../shell/useIsDesktop';

type Range = '3m' | '6m';

// Colors for the who-paid buckets: person 1, person 2, Joint.
const PERSON_COLORS = ['var(--sage-500)', 'var(--sage-300)', 'var(--sage-700)'];

function SectionHead({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        margin: '0 4px 12px',
      }}
    >
      <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
      {right}
    </div>
  );
}

function useReportsData(range: Range) {
  const snapshot = useAppStore((s) => s.snapshot);
  const { spaces, txs, household } = snapshot;

  return useMemo(() => {
    const n = range === '3m' ? 3 : 6;
    const months = monthsInRange(n);
    const hist = history(spaces, txs, n);
    const maxV = Math.max(0, ...hist.map((h) => h.value));
    const rangeTotal = hist.reduce((a, h) => a + h.value, 0);
    const avg = hist.length ? rangeTotal / hist.length : 0;

    const bySpace = spendBySpaceRange(spaces, txs, months);
    const spaceTotal = bySpace.reduce((a, s) => a + s.value, 0);

    const byPerson = spendByPersonRange(spaces, txs, months);
    // Bucket order: the named people, then each fund space, then Unspecified
    // (only when some spend is unattributed). Fund keys are the fund's short
    // label (or name), matching how "Paid from" records fund payers.
    const people = household.people.filter((p) => p.id !== 'leo').slice(0, 2).map((p) => p.name);
    const funds = spaces
      .filter((s) => s.kind === 'fund')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => s.short ?? s.name);
    const base = [...people, ...funds];
    const buckets = (byPerson[UNSPECIFIED] ?? 0) > 0 ? [...base, UNSPECIFIED] : base;
    const personTotal = buckets.reduce((a, b) => a + (byPerson[b] ?? 0), 0);

    const top = topCategoriesRange(spaces, txs, months);
    const topMax = Math.max(0, ...top.map((t) => t.value));

    return { months, hist, maxV, avg, bySpace, spaceTotal, byPerson, buckets, personTotal, top, topMax };
  }, [range, spaces, txs, household]);
}

// ---- sections (shared between layouts) -----------------------------------
function TrendChart({ data, barMax, height }: { data: ReturnType<typeof useReportsData>; barMax: number; height: number }) {
  const { hist, maxV } = data;
  return (
    <Card padding="lg">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, height }}>
        {hist.map((h, i) => {
          const isNow = i === hist.length - 1;
          const pct = maxV > 0 ? (h.value / maxV) * 100 : 0;
          return (
            <div
              key={h.month}
              data-testid="trend-bar"
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}
            >
              <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-semibold)', color: isNow ? 'var(--sage-700)' : 'var(--text-subtle)' }}>
                {(h.value / 1000).toFixed(1)}k
              </span>
              <div
                style={{
                  width: '100%',
                  maxWidth: barMax,
                  height: `${Math.max(pct, h.value > 0 ? 2 : 0)}%`,
                  borderRadius: 'var(--radius-sm)',
                  background: isNow ? 'var(--accent)' : 'var(--sage-200)',
                }}
              />
              <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{h.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function BySpace({ data }: { data: ReturnType<typeof useReportsData> }) {
  const { bySpace, spaceTotal } = data;
  return (
    <Card padding="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {bySpace.map((s) => (
          <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--font-label)', color: 'var(--text-body)' }}>
                <Icon name={s.icon as IconName} size={16} style={{ color: 'var(--text-muted)' }} />
                {s.name}
              </span>
              <Amount value={s.value} />
            </div>
            <ProgressBar value={s.value} max={spaceTotal || 1} />
          </div>
        ))}
        {bySpace.length === 0 && (
          <span style={{ font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>No spending in this range.</span>
        )}
      </div>
    </Card>
  );
}

function WhoPaid({ data }: { data: ReturnType<typeof useReportsData> }) {
  const { byPerson, buckets, personTotal, months } = data;
  const spaces = useAppStore((s) => s.snapshot.spaces);
  const txs = useAppStore((s) => s.snapshot.txs);
  const [openPerson, setOpenPerson] = useState<string | null>(null);
  const colorOf = (key: string, i: number) =>
    key === UNSPECIFIED ? 'var(--text-subtle)' : PERSON_COLORS[i] ?? 'var(--sage-400)';
  const labelOf = (key: string) => {
    if (key === UNSPECIFIED) return 'Unspecified';
    const fund = spaces.find((s) => s.kind === 'fund' && (s.short ?? s.name) === key);
    return fund ? fund.name : key;
  };

  return (
    <Card padding="lg">
      <div style={{ display: 'flex', gap: 3, height: 12, borderRadius: 'var(--radius-pill)', overflow: 'hidden', marginBottom: 16, background: 'var(--surface-sunken)' }}>
        {buckets.map((p, i) => (
          <span key={p} style={{ width: personTotal > 0 ? `${((byPerson[p] ?? 0) / personTotal) * 100}%` : '0%', background: colorOf(p, i) }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {buckets.map((p, i) => {
          const open = openPerson === p;
          const label = labelOf(p);
          const rows = open ? payerSpaceBreakdown(spaces, txs, months, p) : [];
          return (
            <div key={p}>
              <button
                data-testid="whopaid-row"
                onClick={() => setOpenPerson(open ? null : p)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <span style={{ width: 12, height: 12, borderRadius: 4, background: colorOf(p, i) }} />
                <span style={{ flex: 1, textAlign: 'left', font: 'var(--font-label)', color: 'var(--text-body)' }}>{label}</span>
                <Amount value={byPerson[p] ?? 0} />
                <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} style={{ color: 'var(--text-subtle)' }} />
              </button>
              {open && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '6px 4px 12px 26px' }}>
                  {rows.map((r) => (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon name={r.icon as IconName} size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ flex: 1, font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{r.name}</span>
                      <Amount value={r.value} size="sm" />
                    </div>
                  ))}
                  {rows.length === 0 && (
                    <span style={{ font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>No shared spending in this range.</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function TopCategories({ data }: { data: ReturnType<typeof useReportsData> }) {
  const { top, topMax } = data;
  return (
    <Card padding="sm">
      {top.length === 0 && (
        <div style={{ padding: 'var(--space-4)', font: 'var(--font-body)', color: 'var(--text-muted)', textAlign: 'center' }}>
          No categories yet
        </div>
      )}
      {top.map((t, i) => (
        <div
          key={t.cat}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderBottom: i < top.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
        >
          <CategoryIcon category={t.cat} emoji={t.emoji} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{t.label}</div>
            <div style={{ height: 5, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-200)', marginTop: 5 }}>
              <div style={{ width: topMax > 0 ? `${(t.value / topMax) * 100}%` : '0%', height: '100%', borderRadius: 'var(--radius-pill)', background: 'var(--sage-400)' }} />
            </div>
          </div>
          <Amount value={t.value} />
        </div>
      ))}
    </Card>
  );
}

const avgCaption = (avg: number): string => `avg RM ${Math.round(avg).toLocaleString()}/mo`;

function RangeToggle({ range, setRange }: { range: Range; setRange: (r: Range) => void }) {
  return (
    <SegmentedControl
      size="sm"
      value={range}
      onChange={(v) => setRange(v as Range)}
      options={[
        { value: '3m', label: '3M' },
        { value: '6m', label: '6M' },
      ]}
    />
  );
}

// ============================================================
// MOBILE
// ============================================================
function MobileReports({ range, setRange, data }: { range: Range; setRange: (r: Range) => void; data: ReturnType<typeof useReportsData> }) {
  const month = useAppStore((s) => s.month);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{monthLabel(month)}</div>
          <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>Reports</h1>
        </div>
        <RangeToggle range={range} setRange={setRange} />
      </div>

      <div>
        <SectionHead title="Spending trend" right={<span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{avgCaption(data.avg)}</span>} />
        <TrendChart data={data} barMax={34} height={148} />
      </div>
      <div>
        <SectionHead title="By space" />
        <BySpace data={data} />
      </div>
      <div>
        <SectionHead title="Who paid" right={<span style={{ font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>tap to break down</span>} />
        <WhoPaid data={data} />
      </div>
      <div>
        <SectionHead title="Top categories" />
        <TopCategories data={data} />
      </div>
    </div>
  );
}

// ============================================================
// DESKTOP
// ============================================================
function DesktopReports({ range, setRange, data }: { range: Range; setRange: (r: Range) => void; data: ReturnType<typeof useReportsData> }) {
  const rightAlign: CSSProperties = { display: 'flex', justifyContent: 'flex-end', marginTop: -4 };
  return (
    <>
      <div style={rightAlign}>
        <RangeToggle range={range} setRange={setRange} />
      </div>
      <div>
        <SectionHead title="Spending trend" right={<span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{avgCaption(data.avg)}</span>} />
        <TrendChart data={data} barMax={60} height={200} />
      </div>
      <div className="row-2">
        <div>
          <SectionHead title="By space" />
          <BySpace data={data} />
        </div>
        <div>
          <SectionHead title="Who paid" right={<span style={{ font: 'var(--font-caption)', color: 'var(--text-subtle)' }}>tap to break down</span>} />
          <WhoPaid data={data} />
        </div>
      </div>
      <div>
        <SectionHead title="Top categories" />
        <TopCategories data={data} />
      </div>
    </>
  );
}

export function Reports() {
  const isDesktop = useIsDesktop();
  const [range, setRange] = useState<Range>('6m');
  const data = useReportsData(range);
  return isDesktop ? (
    <DesktopReports range={range} setRange={setRange} data={data} />
  ) : (
    <MobileReports range={range} setRange={setRange} data={data} />
  );
}
