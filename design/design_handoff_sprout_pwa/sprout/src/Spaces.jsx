// Spaces — the launcher listing every space, grouped Shared / Personal.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Card, ListRow, Amount, Icon, Avatar, Button } = K;
  const D = window.SproutData;

  const tile = (icon) => (
    <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={20} />
    </span>
  );

  function valueFor(s) {
    if (s.kind === 'fund') return { v: s.balance, label: 'balance' };
    if (s.kind === 'invest') return { v: s.value, label: 'value' };
    return { v: D.spentOf(s), label: 'this month' };
  }

  window.SpacesScreen = function SpacesScreen({ goSpace, goPersonal, onNewSpace }) {
    const shared = D.spaces.filter((s) => s.group === 'shared');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{D.monthLabel}</div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>Spaces</h2>
          </div>
          <Button variant="soft" size="sm" iconStart="plus" onClick={onNewSpace}>New space</Button>
        </div>

        <div>
          <div style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)', margin: '0 4px 8px' }}>Shared</div>
          <Card padding="sm">
            {shared.map((s, i) => {
              const val = valueFor(s);
              const budgeted = s.kind === 'spend' && s.budget;
              const pct = budgeted ? Math.min(100, (D.spentOf(s) / s.budget) * 100) : 0;
              const over = budgeted && D.spentOf(s) > s.budget;
              const meta = budgeted ? (
                <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                  <span style={{ whiteSpace: 'nowrap', color: over ? 'var(--money-over)' : 'var(--text-muted)' }}>{Math.round((D.spentOf(s) / s.budget) * 100)}% of RM {s.budget.toLocaleString()}</span>
                  <span style={{ width: 68, height: 4, borderRadius: 'var(--radius-pill)', background: 'var(--neutral-200)', overflow: 'hidden', display: 'block' }}>
                    <span style={{ display: 'block', height: '100%', width: pct + '%', borderRadius: 'var(--radius-pill)', background: over ? 'var(--money-over)' : 'var(--sage-400)' }} />
                  </span>
                </span>
              ) : val.label;
              return (
                <ListRow key={s.id} leading={tile(s.icon)} title={s.name}
                  subtitle={s.sub || `${s.tx.length} entries`}
                  trailing={<Amount value={val.v} />} meta={meta}
                  chevron onClick={() => goSpace(s.id)} divider={i < shared.length - 1} />
              );
            })}
          </Card>
        </div>

        <div>
          <div style={{ font: 'var(--font-caption)', fontWeight: 'var(--fw-bold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--text-subtle)', margin: '0 4px 8px' }}>Personal</div>
          <Card padding="sm">
            {['jc', 'ch'].map((pid, i) => {
              const p = D.personal[pid];
              const spent = p.tx.filter((t) => t.dir === 'out').reduce((a, t) => a + t.amount, 0);
              return (
                <ListRow key={pid} leading={<Avatar name={p.name} size={40} />}
                  title={`${p.name} · Personal`} subtitle={`Income RM ${p.income.toLocaleString()}`}
                  trailing={<Amount value={spent} />} meta="spent"
                  chevron onClick={() => goPersonal(pid)} divider={i === 0} />
              );
            })}
          </Card>
        </div>
      </div>
    );
  };
})();
