// Onboarding — Sprout first-run flow (welcome → household → spaces → budget → done).
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Card, Button, Input, Icon, Avatar, IconButton, Amount } = K;

  const SUGGESTED = [
    { id: 'expenses', name: 'Everyday Expenses', icon: 'receipt', on: true },
    { id: 'housing', name: 'Housing', icon: 'home', on: true },
    { id: 'car', name: 'Car', icon: 'repeat', on: true },
    { id: 'investment', name: 'Investment', icon: 'trending-up', on: false },
    { id: 'joint', name: 'Joint Fund', icon: 'wallet', on: true },
  ];

  function Dots({ step, total }) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{ width: i === step ? 22 : 7, height: 7, borderRadius: 'var(--radius-pill)', background: i === step ? 'var(--accent)' : 'var(--neutral-300)', transition: 'width var(--dur-base) var(--ease-out), background-color var(--dur-base)' }} />
        ))}
      </div>
    );
  }

  window.OnboardingScreen = function OnboardingScreen({ onDone }) {
    const [step, setStep] = React.useState(0);
    const [p1, setP1] = React.useState('JC');
    const [p2, setP2] = React.useState('CH');
    const [spaces, setSpaces] = React.useState(SUGGESTED.map((s) => ({ ...s })));
    const [budgets, setBudgets] = React.useState({ expenses: '1500', housing: '2100', car: '800' });
    const setB = (k, v) => setBudgets((b) => ({ ...b, [k]: v }));
    const budgetTotal = Object.values(budgets).reduce((a, v) => a + (parseFloat(v) || 0), 0);

    const TOTAL = 5;
    const next = () => setStep((s) => Math.min(TOTAL - 1, s + 1));
    const back = () => setStep((s) => Math.max(0, s - 1));
    const toggle = (id) => setSpaces((xs) => xs.map((x) => x.id === id ? { ...x, on: !x.on } : x));
    const chosen = spaces.filter((s) => s.on).length;

    const wrap = (children, footer) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 40 }}>
          {step > 0 && step < 4 && <IconButton icon="arrow-left" label="Back" variant="ghost" onClick={back} style={{ marginLeft: -8 }} />}
          <div style={{ flex: 1 }} />
          {step > 0 && step < 4 && <Dots step={step - 1} total={3} />}
          <div style={{ flex: 1 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>{children}</div>
        {footer}
      </div>
    );

    // Step 0 — welcome
    if (step === 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'center', paddingTop: 'var(--space-9)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)' }}>
            <img src="sprout/assets/sprout-icon.svg" width="88" height="88" alt="Sprout" style={{ borderRadius: 24, boxShadow: 'var(--shadow-lg)' }} />
            <div>
              <h1 style={{ font: 'var(--font-display)', color: 'var(--text-strong)', margin: 0 }}>Track money,<br />together.</h1>
              <p style={{ font: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--text-muted)', margin: 'var(--space-3) auto 0', maxWidth: '30ch' }}>
                Expenses, monthly bills, and who paid what — in one calm place for you both.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingBottom: 'var(--space-6)' }}>
            <Button size="lg" fullWidth onClick={next}>Get started</Button>
            <Button size="lg" variant="ghost" fullWidth>I already have an account</Button>
          </div>
        </div>
      );
    }

    // Step 1 — household
    if (step === 1) {
      return wrap(
        <>
          <div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Who's in your household?</h2>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>Sprout is better with two. You can invite more later.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
              <Avatar name={p1 || '?'} size={52} />
              <div style={{ flex: 1 }}><Input label="You" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Your name" /></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
              <Avatar name={p2 || '?'} size={52} />
              <div style={{ flex: 1 }}><Input label="Partner" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Their name" /></div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'none', color: 'var(--text-accent)', font: 'var(--font-label)', cursor: 'pointer', padding: 4 }}>
              <Icon name="plus" size={16} /> Add another person
            </button>
          </div>
        </>,
        <Button size="lg" fullWidth iconEnd="arrow-right" onClick={next} disabled={!p1 || !p2}>Continue</Button>
      );
    }

    // Step 2 — choose spaces
    if (step === 2) {
      return wrap(
        <>
          <div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Choose your spaces</h2>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>Keep areas of money separate. Add or remove any anytime.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {spaces.map((s) => (
              <Card key={s.id} interactive padding="sm" onClick={() => toggle(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderColor: s.on ? 'var(--accent)' : 'var(--border-subtle)' }}>
                <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={s.icon} size={20} />
                </span>
                <span style={{ flex: 1, font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{s.name}</span>
                <span style={{ width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: s.on ? 'var(--accent)' : 'transparent', border: s.on ? 'none' : '2px solid var(--border-strong)', color: '#fff' }}>
                  {s.on && <Icon name="check" size={15} strokeWidth={3} />}
                </span>
              </Card>
            ))}
          </div>
        </>,
        <Button size="lg" fullWidth iconEnd="arrow-right" onClick={next} disabled={chosen === 0}>Continue with {chosen}</Button>
      );
    }

    // Step 3 — per-space budgets
    if (step === 3) {
      const rows = [
        { id: 'expenses', name: 'Everyday Expenses', icon: 'receipt' },
        { id: 'housing', name: 'Housing', icon: 'home' },
        { id: 'car', name: 'Car', icon: 'repeat' },
      ];
      return wrap(
        <>
          <div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Set a budget per space</h2>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>A gentle monthly guide for each — change any of them anytime.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {rows.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={r.icon} size={20} />
                </span>
                <span style={{ flex: 1, font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{r.name}</span>
                <div style={{ width: 130 }}>
                  <Input prefix="RM" inputMode="decimal" value={budgets[r.id]} onChange={(e) => setB(r.id, e.target.value)} />
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px 0', borderTop: '1px solid var(--border-subtle)', marginTop: 4 }}>
              <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)' }}>Total budget</span>
              <Amount value={budgetTotal} size="lg" style={{ color: 'var(--sage-700)' }} />
            </div>
          </div>
        </>,
        <Button size="lg" fullWidth onClick={next} disabled={budgetTotal <= 0}>Finish setup</Button>
      );
    }

    // Step 4 — done
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)' }}>
          <span style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
            <Icon name="check" size={44} strokeWidth={2.6} style={{ color: '#fff' }} />
          </span>
          <div>
            <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>You're all set, {p1}! 🌿</h1>
            <p style={{ font: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--text-muted)', margin: 'var(--space-3) auto 0', maxWidth: '30ch' }}>
              {chosen} spaces ready for you and {p2}. Budget set to <strong style={{ color: 'var(--text-body)' }}>RM {budgetTotal.toLocaleString()}</strong>.
            </p>
          </div>
        </div>
        <div style={{ paddingBottom: 'var(--space-6)' }}>
          <Button size="lg" fullWidth iconStart="home" onClick={onDone}>Open Sprout</Button>
        </div>
      </div>
    );
  };
})();
