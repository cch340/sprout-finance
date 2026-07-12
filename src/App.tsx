import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { AppShell } from './shell/AppShell';
import { Home } from './screens/Home';
import { Spaces } from './screens/Spaces';
import { SpaceDetail } from './screens/SpaceDetail';
import { Personal } from './screens/Personal';
import { Onboarding } from './screens/Onboarding';
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

/** Redirect to onboarding when the household has not completed setup. */
function RequireOnboarded({ children }: { children: React.ReactNode }) {
  const onboarded = useAppStore((s) => s.snapshot.household.onboarded);
  const location = useLocation();
  if (!onboarded) return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

function Router() {
  const status = useAppStore((s) => s.status);
  const boot = useAppStore((s) => s.boot);

  useEffect(() => {
    void boot();
  }, [boot]);

  if (status === 'loading') return <Splash />;

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route
        element={
          <RequireOnboarded>
            <AppShell />
          </RequireOnboarded>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/spaces/:id" element={<SpaceDetail />} />
        <Route path="/personal/:who" element={<Personal />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
