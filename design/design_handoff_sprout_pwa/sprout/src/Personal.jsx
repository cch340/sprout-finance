// Personal — JC / CH personal funds (income + personal spending).
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Card, ListRow, Amount, SegmentedControl, StatCard, CategoryIcon, Avatar, Badge } = K;
  const D = window.SproutData;
  const SAGE = { color: 'var(--sage-700)' };

  window.PersonalScreen = function PersonalScreen({ who, setWho }) {
    const p = D.personal[who];
    const income = p.income;
    const spent = p.tx.filter((t) => t.dir === 'out').reduce((a, t) => a + t.amount, 0);
    const left = income - spent;
    const outTx = p.tx.filter((t) => t.dir === 'out');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Avatar name={p.name} size={40} />
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Personal · {D.monthLabel}</div>
            <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-strong)', margin: 0 }}>{p.name}'s money</h2>
          </div>
        </div>

        <SegmentedControl fullWidth value={who} onChange={setWho} options={[
          { value: 'jc', label: 'JC' }, { value: 'ch', label: 'CH' },
        ]} />

        <Card padding="lg" style={{ background: 'var(--accent)', border: 'none' }}>
          <span style={{ font: 'var(--font-label)', color: 'rgba(255,255,255,0.85)' }}>Left this month</span>
          <Amount value={left} size="hero" style={{ color: '#fff', display: 'block', marginTop: 4 }} />
          <div style={{ display: 'flex', gap: 18, marginTop: 12 }}>
            <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)' }}>Income RM {income.toLocaleString()}</span>
            <span style={{ font: 'var(--font-caption)', color: 'rgba(255,255,255,0.9)' }}>Spent RM {spent.toLocaleString()}</span>
          </div>
        </Card>

        <Card padding="sm">
          {outTx.map((t, i) => (
            <ListRow key={t.id}
              leading={<CategoryIcon category={t.cat} />}
              title={t.vendor} subtitle={`${t.note}`}
              trailing={<Amount value={t.amount} />} meta={t.date}
              divider={i < outTx.length - 1} />
          ))}
        </Card>
      </div>
    );
  };
})();
