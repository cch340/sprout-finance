import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import markUrl from '../assets/sprout-mark.svg';

/**
 * Onboarding stub (full 5-step flow arrives in Phase 6). For now it offers a
 * temporary "Load demo data" action so the app is usable and testable today.
 */
export function Onboarding() {
  const navigate = useNavigate();
  const seedDemo = useAppStore((s) => s.seedDemo);

  const loadDemo = async () => {
    await seedDemo();
    navigate('/', { replace: true });
  };

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
      <Card padding="lg" style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <img src={markUrl} width={48} height={48} alt="" style={{ margin: '0 auto var(--space-4)' }} />
        <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '0 0 var(--space-2)' }}>
          Track money, together.
        </h1>
        <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: '0 0 var(--space-6)' }}>
          The guided setup lands in Phase 6. For now, load the sample household to explore Sprout.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Button size="lg" iconStart="wand" onClick={() => void loadDemo()}>
            Load demo data
          </Button>
        </div>
      </Card>
    </div>
  );
}
