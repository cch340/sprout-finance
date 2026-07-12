// Home — a roll-up across every space.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { StatCard, Card, ListRow, Amount, Badge, CategoryIcon, Avatar, Icon } = K;
  const D = window.SproutData;

  const SAGE = { color: 'var(--sage-700)' }; // balances read in sage, not stark black

  function SectionHead({ title, action, onAction }) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 4px 10px' }}>
        <h3 style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', margin: 0 }}>{title}</h3>
        {action && <button onClick={onAction} style={{ border: 'none', background: 'none', font: 'var(--font-label)', color: 'var(--text-accent)', cursor: 'pointer' }}>{action}</button>}
      </div>
    );
  }

  window.HomeScreen = function HomeScreen({ goSpace, goTo }) {
    const shared = D.spaces.filter((s) => s.group === 'shared');
    const spendSpaces = shared.filter((s) => s.kind === 'spend');
    const joint = D.space('joint');
    const invest = D.space('invest') || D.space('investment');
    const left = D.budget - D.totalSpent;
    const recent = D.space('expenses').tx.slice(0, 3);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* greeting */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Good evening, JC 🌿</div>
            <div style={{ font: 'var(--font-h2)', color: 'var(--text-strong)' }}>{D.monthLabel}</div>
          </div>
          <div style={{ display: 'flex', marginRight: 6 }}>
            <Avatar name="JC" size={34} style={{ boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
            <Avatar name="CH" size={34} style={{ marginLeft: -10, boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
            <Avatar name="Leo" size={34} style={{ marginLeft: -10, boxShadow: '0 0 0 2px var(--surface-canvas)' }} />
          </div>
        </div>

        {/* hero total across domains */}
        <Card padding="lg" style={{ background: 'var(--accent)', border: 'none' }}>
          <span style={{ font: 'var(--font-label)', color: 'rgba(255,255,255,0.85)' }}>Total spent · Everyday + Housing + Car</span>
          <Amount value={D.totalSpent} size="hero" style={{ color: '#fff', display: 'block', marginTop: 6 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 16 }}>
            <span style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-semibold)', color: '#fff' }}>RM {Math.round(left).toLocaleString()} left</span>
            <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.8)' }}>of RM {D.budget.toLocaleString()} budget</span>
          </div>
          <div style={{ display: 'flex', gap: 3, height: 8, borderRadius: 'var(--radius-pill)', overflow: 'hidden', background: 'rgba(255,255,255,0.22)' }}>
            {spendSpaces.map((s, i) => (
              <span key={s.id} style={{ width: `${(D.spentOf(s) / D.totalSpent) * 100}%`, background: `rgba(255,255,255,${[0.95, 0.66, 0.4][i]})` }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            {spendSpaces.map((s) => (
              <span key={s.id} style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.85)', fontWeight: 'var(--fw-medium)' }}>{s.short} {Math.round((D.spentOf(s) / D.totalSpent) * 100)}%</span>
            ))}
          </div>
        </Card>

        {/* balances */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <StatCard label="Joint Fund" value={joint.balance} icon="wallet" footer="Shared balance" amountProps={{ style: SAGE }} />
          <StatCard label="Investment · AIA" value={invest.value} icon="trending-up" footer="Portfolio value" amountProps={{ style: SAGE }} />
        </div>

        {/* spaces */}
        <div>
          <SectionHead title="Spaces" action="Manage" onAction={() => goTo('spaces')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {D.spaces.filter((s) => s.kind === 'spend').map((s) => (
              <Card key={s.id} interactive padding="sm" onClick={() => goSpace(s.id)}>
                <ListRow
                  leading={<span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={s.icon} size={20} /></span>}
                  title={s.name}
                  subtitle={s.sub ? s.sub : `${s.tx.length} entries`}
                  trailing={<Amount value={D.spentOf(s)} />}
                  meta={s.budget ? `of RM ${s.budget.toLocaleString()}` : 'this month'}
                  chevron
                />
              </Card>
            ))}
          </div>
        </div>

        {/* recent everyday */}
        <div>
          <SectionHead title="Recent activity" action="See all" onAction={() => goSpace('expenses')} />
          <Card padding="sm">
            {recent.map((e, i) => (
              <ListRow key={e.id}
                leading={<CategoryIcon category={e.cat} />}
                title={e.vendor} subtitle={`${e.note} · ${e.payer}`}
                trailing={<Amount value={e.amount} />} meta={e.date}
                divider={i < recent.length - 1} />
            ))}
          </Card>
        </div>
      </div>
    );
  };
})();
