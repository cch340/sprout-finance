import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { AppShell } from './shell/AppShell';
import { Home } from './screens/Home';
import { Spaces } from './screens/Spaces';
import { SpaceDetail } from './screens/SpaceDetail';
import { Personal } from './screens/Personal';
import { Onboarding } from './screens/Onboarding';
import { Login } from './screens/Login';
import { Reports } from './screens/Reports';
import { Settings } from './screens/Settings';
import { Gallery } from './screens/Gallery';

function Splash() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--surface-canvas)',
        color: 'var(--text-muted)',
        font: 'var(--font-body)',
      }}
    >
      Loading…
    </div>
  );
}

/** Subtle read-only banner shown when the cloud is unreachable. */
function OfflineBanner() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        textAlign: 'center',
        padding: '6px var(--space-4)',
        background: 'var(--money-over, #C7503F)',
        color: '#fff',
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-semibold)',
      }}
    >
      Offline — showing your last synced data. Changes are paused.
    </div>
  );
}

function Router() {
  const status = useAppStore((s) => s.status);
  const authed = useAppStore((s) => s.authed);
  const hasHousehold = useAppStore((s) => s.hasHousehold);
  const offline = useAppStore((s) => s.offline);
  const boot = useAppStore((s) => s.boot);

  useEffect(() => {
    void boot();
  }, [boot]);

  if (status === 'loading') return <Splash />;

  // Not signed in → Login (gallery stays open for design review).
  if (!authed) {
    return (
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Signed in but no household yet → Onboarding (create or join).
  if (!hasHousehold) {
    return (
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  // Signed in + household loaded → the app.
  return (
    <>
      {offline && <OfflineBanner />}
      <Routes>
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/onboarding" element={<Navigate to="/" replace />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/spaces/:id" element={<SpaceDetail />} />
          <Route path="/personal/:who" element={<Personal />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
