import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Amount, Avatar, Button, Card, Icon, IconButton, Input } from '../design-system';
import type { IconName } from '../design-system';
import type { Space } from '../domain/types';
import { DEFAULT_SETTINGS } from '../domain/types';
import { useAppStore } from '../store/useAppStore';
import { SPACE_TEMPLATES, personalSpace } from '../data/seed-demo';
import markUrl from '../assets/sprout-mark.svg';

const TOTAL = 5;

type Screen = 'choice' | 'join' | 'steps';

interface Toggle {
  id: string;
  on: boolean;
}

function slug(name: string, fallback: string): string {
  const s = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return s || fallback;
}

function Dots({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: i === step ? 22 : 7,
            height: 7,
            borderRadius: 'var(--radius-pill)',
            background: i === step ? 'var(--accent)' : 'var(--neutral-300)',
            transition: 'width var(--dur-base) var(--ease-out), background-color var(--dur-base)',
          }}
        />
      ))}
    </div>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  const addSpace = useAppStore((s) => s.addSpace);
  const saveHousehold = useAppStore((s) => s.saveHousehold);
  const saveSettings = useAppStore((s) => s.saveSettings);
  const createHousehold = useAppStore((s) => s.createHousehold);
  const joinHousehold = useAppStore((s) => s.joinHousehold);
  const loadHousehold = useAppStore((s) => s.loadHousehold);
  const currency = useAppStore((s) => s.snapshot.household.currency);

  const [screen, setScreen] = useState<Screen>('choice');
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Join-a-household state.
  const [code, setCode] = useState('');

  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [toggles, setToggles] = useState<Toggle[]>(
    SPACE_TEMPLATES.map((t) => ({ id: t.id, on: t.defaultOn })),
  );
  const [budgets, setBudgets] = useState<Record<string, string>>(
    Object.fromEntries(SPACE_TEMPLATES.filter((t) => t.defaultBudget).map((t) => [t.id, String(t.defaultBudget)])),
  );

  const chosenIds = toggles.filter((t) => t.on).map((t) => t.id);
  const chosenTemplates = SPACE_TEMPLATES.filter((t) => chosenIds.includes(t.id));
  const spendTemplates = chosenTemplates.filter((t) => t.kind === 'spend');
  const budgetTotal = spendTemplates.reduce((a, t) => a + (parseFloat(budgets[t.id]) || 0), 0);

  const next = () => setStep((s) => Math.min(TOTAL - 1, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const toggle = (id: string) => setToggles((xs) => xs.map((x) => (x.id === id ? { ...x, on: !x.on } : x)));
  const setBudget = (id: string, v: string) => setBudgets((b) => ({ ...b, [id]: v }));

  const join = async () => {
    setError(null);
    setBusy(true);
    try {
      await joinHousehold(code.trim());
      navigate('/', { replace: true });
    } catch {
      setError('That invite code didn’t work. Check the 6 characters and try again.');
    } finally {
      setBusy(false);
    }
  };

  const finish = async () => {
    setError(null);
    setBusy(true);
    try {
      const id1 = slug(p1, 'you');
      let id2 = slug(p2, 'partner');
      if (id2 === id1) id2 = `${id2}-2`;
      const people = [
        { id: id1, name: p1.trim() || 'You' },
        { id: id2, name: p2.trim() || 'Partner' },
      ];

      // Provision the household in the cloud (sets the active context).
      await createHousehold();

      // Create chosen shared spaces (empty ledgers, budgets from step 4).
      let order = 0;
      for (const t of chosenTemplates) {
        const space: Omit<Space, 'sortOrder'> & { sortOrder?: number } = {
          id: t.id,
          name: t.name,
          short: t.short,
          group: 'shared',
          icon: t.icon,
          kind: t.kind,
          cats: t.cats,
          fields: t.fields,
          budget: t.kind === 'spend' ? parseFloat(budgets[t.id]) || 0 : undefined,
          baseBalance: t.kind === 'fund' ? 0 : undefined,
          value: t.kind === 'invest' ? 0 : undefined,
          sortOrder: order++,
        };
        await addSpace(space);
      }
      // Two personal spaces for the named people.
      await addSpace(personalSpace(people[0].id, people[0].name, order++));
      await addSpace(personalSpace(people[1].id, people[1].name, order++));

      // Default settings row, then flip the household to onboarded.
      await saveSettings({ ...DEFAULT_SETTINGS, currency: currency || 'RM' });
      await saveHousehold({ id: 'main', people, currency: currency || 'RM', onboarded: true });

      // Reload from the cloud (authoritative) and start realtime sync.
      await loadHousehold();
      navigate('/', { replace: true });
    } catch {
      setError('Couldn’t set up your household. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const shell = (children: React.ReactNode, footer: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 520, gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minHeight: 40 }}>
        {step < TOTAL - 1 && (
          <IconButton icon="arrow-left" label="Back" variant="ghost" onClick={step === 1 ? () => setScreen('choice') : back} style={{ marginLeft: -8 }} />
        )}
        <div style={{ flex: 1 }} />
        {step < TOTAL - 1 && <Dots step={step - 1} total={3} />}
        <div style={{ flex: 1 }} />
      </div>
      <div key={step} className="ob-step" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {children}
      </div>
      {error && <div style={{ font: 'var(--font-caption)', color: 'var(--money-over)', textAlign: 'center' }}>{error}</div>}
      {footer}
    </div>
  );

  let content: React.ReactNode;

  if (screen === 'choice') {
    content = (
      <div key="choice" className="ob-step" style={{ display: 'flex', flexDirection: 'column', minHeight: 520, textAlign: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)' }}>
          <img src={markUrl} width={80} height={80} alt="Sprout" style={{ borderRadius: 24, boxShadow: 'var(--shadow-lg)' }} />
          <div>
            <h1 style={{ font: 'var(--font-display)', color: 'var(--text-strong)', margin: 0 }}>
              Track money,<br />together.
            </h1>
            <p style={{ font: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--text-muted)', margin: 'var(--space-3) auto 0', maxWidth: '30ch' }}>
              Start a new household, or join the one your partner already set up.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingTop: 'var(--space-6)' }}>
          <Button size="lg" fullWidth iconStart="plus" onClick={() => { setScreen('steps'); setStep(1); }}>
            Start a new household
          </Button>
          <Button size="lg" variant="ghost" fullWidth iconStart="users" onClick={() => { setError(null); setScreen('join'); }}>
            Join your partner&apos;s household
          </Button>
        </div>
      </div>
    );
  } else if (screen === 'join') {
    content = (
      <div key="join" className="ob-step" style={{ display: 'flex', flexDirection: 'column', minHeight: 520, gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 40 }}>
          <IconButton icon="arrow-left" label="Back" variant="ghost" onClick={() => { setError(null); setScreen('choice'); }} style={{ marginLeft: -8 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div>
            <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Join a household</h2>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>
              Ask your partner for the 6-character invite code in their Settings.
            </p>
          </div>
          <Input
            label="Invite code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            autoCapitalize="characters"
            maxLength={6}
            style={{ letterSpacing: '0.18em', fontWeight: 'var(--fw-semibold)' as React.CSSProperties['fontWeight'] }}
          />
          {error && <div style={{ font: 'var(--font-caption)', color: 'var(--money-over)' }}>{error}</div>}
        </div>
        <Button size="lg" fullWidth loading={busy} disabled={busy || code.trim().length < 6} onClick={() => void join()}>
          Join household
        </Button>
      </div>
    );
  } else if (step === 1) {
    content = shell(
      <>
        <div>
          <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Who&apos;s in your household?</h2>
          <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>
            Sprout is better with two. You can invite more later.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <Avatar name={p1 || '?'} size={52} />
            <div style={{ flex: 1 }}>
              <Input label="You" value={p1} onChange={(e) => setP1(e.target.value)} placeholder="JC" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <Avatar name={p2 || '?'} size={52} />
            <div style={{ flex: 1 }}>
              <Input label="Partner" value={p2} onChange={(e) => setP2(e.target.value)} placeholder="CH" />
            </div>
          </div>
        </div>
      </>,
      <Button size="lg" fullWidth iconEnd="arrow-right" onClick={next} disabled={!p1.trim() || !p2.trim()}>
        Continue
      </Button>,
    );
  } else if (step === 2) {
    content = shell(
      <>
        <div>
          <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Choose your spaces</h2>
          <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>
            Keep areas of money separate. Add or remove any anytime.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {SPACE_TEMPLATES.map((t) => {
            const on = toggles.find((x) => x.id === t.id)?.on ?? false;
            return (
              <Card
                key={t.id}
                interactive
                padding="sm"
                onClick={() => toggle(t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderColor: on ? 'var(--accent)' : 'var(--border-subtle)' }}
              >
                <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={t.icon as IconName} size={20} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{t.name}</span>
                  <span style={{ display: 'block', font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{t.description}</span>
                </span>
                <span style={{ width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--accent)' : 'transparent', border: on ? 'none' : '2px solid var(--border-strong)', color: '#fff', flexShrink: 0 }}>
                  {on && <Icon name="check" size={15} strokeWidth={3} />}
                </span>
              </Card>
            );
          })}
        </div>
      </>,
      <Button size="lg" fullWidth iconEnd="arrow-right" onClick={next} disabled={chosenIds.length === 0}>
        Continue with {chosenIds.length}
      </Button>,
    );
  } else if (step === 3) {
    content = shell(
      <>
        <div>
          <h2 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>Set a budget per space</h2>
          <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>
            A gentle monthly guide for each — change any of them anytime.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {spendTemplates.map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={t.icon as IconName} size={20} />
              </span>
              <span style={{ flex: 1, font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{t.name}</span>
              <div style={{ width: 130 }}>
                <Input prefix="RM" inputMode="decimal" value={budgets[t.id] ?? ''} onChange={(e) => setBudget(t.id, e.target.value)} />
              </div>
            </div>
          ))}
          {spendTemplates.length === 0 && (
            <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 0 }}>No spending spaces selected — you can add budgets later.</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px 0', borderTop: '1px solid var(--border-subtle)', marginTop: 4 }}>
            <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)' }}>Total budget</span>
            <Amount value={budgetTotal} size="lg" style={{ color: 'var(--sage-700)' }} />
          </div>
        </div>
      </>,
      <Button size="lg" fullWidth onClick={next}>Finish setup</Button>,
    );
  } else {
    content = (
      <div key="s4" className="ob-step" style={{ display: 'flex', flexDirection: 'column', minHeight: 520, textAlign: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)' }}>
          <span style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
            <Icon name="check" size={44} strokeWidth={2.6} style={{ color: '#fff' }} />
          </span>
          <div>
            <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
              You&apos;re all set, {p1.trim() || 'friend'}!
              <Icon name="sprout" size={24} style={{ display: 'inline-block', verticalAlign: '-0.1em', color: 'var(--accent)' }} />
            </h1>
            <p style={{ font: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--text-muted)', margin: 'var(--space-3) auto 0', maxWidth: '30ch' }}>
              {chosenIds.length} spaces ready for you and {p2.trim() || 'your partner'}. Budget set to{' '}
              <strong style={{ color: 'var(--text-body)' }}>RM {budgetTotal.toLocaleString()}</strong>.
            </p>
          </div>
        </div>
        {error && <div style={{ font: 'var(--font-caption)', color: 'var(--money-over)', textAlign: 'center', paddingBottom: 'var(--space-3)' }}>{error}</div>}
        <div style={{ paddingTop: 'var(--space-6)' }}>
          <Button size="lg" fullWidth iconStart="home" loading={busy} disabled={busy} onClick={() => void finish()}>Open Sprout</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
        background: 'var(--surface-canvas)',
      }}
    >
      <style>{`
        .ob-step { animation: ob-in var(--dur-base) var(--ease-out) both; }
        @media (prefers-reduced-motion: reduce) { .ob-step { animation: none; } }
        @keyframes ob-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
      <Card padding="lg" style={{ width: '100%', maxWidth: 460 }}>
        {content}
      </Card>
    </div>
  );
}
