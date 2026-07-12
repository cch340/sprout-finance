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
