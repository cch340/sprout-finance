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
import { Onboarding } from './screens/Onboarding';
import {
  PersonalStub,
  ReportsStub,
  SettingsStub,
  SpaceDetailStub,
  SpacesStub,
} from './screens/stubs';
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
        <Route path="/spaces" element={<SpacesStub />} />
        <Route path="/spaces/:id" element={<SpaceDetailStub />} />
        <Route path="/personal/:who" element={<PersonalStub />} />
        <Route path="/reports" element={<ReportsStub />} />
        <Route path="/settings" element={<SettingsStub />} />
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
