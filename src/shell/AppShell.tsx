import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Icon,
  IconButton,
} from '../design-system';
import type { IconName } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import { monthLabel } from '../domain/format';
import { AddEntryDialog } from '../dialogs/AddEntryDialog';
import { NewSpaceDialog } from '../dialogs/NewSpaceDialog';
import { SpaceSettingsDialog } from '../dialogs/SpaceSettingsDialog';
import { useIsDesktop } from './useIsDesktop';
import markUrl from '../assets/sprout-mark.svg';
import './shell.css';

// ---- route metadata (drives desktop topbar + active states) --------------
interface RouteMeta {
  eyebrow: string;
  title: string;
}

function routeMeta(pathname: string, month: string, personName?: string, spaceName?: string): RouteMeta {
  const label = monthLabel(month);
  if (pathname === '/reports') return { eyebrow: `Household · ${label}`, title: 'Reports' };
  if (pathname === '/settings') return { eyebrow: 'Household', title: 'Settings' };
  if (pathname.startsWith('/spaces/')) return { eyebrow: label, title: spaceName ?? 'Space' };
  if (pathname === '/spaces') return { eyebrow: `Household · ${label}`, title: 'Spaces' };
  if (pathname.startsWith('/personal/'))
    return { eyebrow: `Personal · ${label}`, title: `${personName ?? 'Personal'} · Personal` };
  return { eyebrow: `Household · ${label}`, title: 'Overview' };
}

// ---- shell ---------------------------------------------------------------
export function AppShell() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopShell /> : <MobileShell />;
}

/** Scroll a ref back to the top whenever the route path changes. */
function useScrollReset(ref: React.RefObject<HTMLElement>) {
  const { pathname } = useLocation();
  useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [pathname, ref]);
}

function ThemeToggle({ variant = 'ghost' }: { variant?: 'ghost' | 'secondary' }) {
  const theme = useAppStore((s) => s.snapshot.settings.theme);
  const toggle = useAppStore((s) => s.toggleTheme);
  return (
    <IconButton
      icon={theme === 'dark' ? 'sun' : 'moon'}
      label="Toggle theme"
      variant={variant}
      onClick={() => void toggle()}
    />
  );
}

// ============================================================
// MOBILE
// ============================================================
function MobileShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const openAddEntry = useAppStore((s) => s.openAddEntry);
  useScrollReset(contentRef);

  const activeTab = pathname.startsWith('/spaces') || pathname.startsWith('/personal')
    ? 'spaces'
    : pathname === '/reports'
      ? 'reports'
      : pathname === '/settings'
        ? 'settings'
        : 'home';

  const tab = (id: string, icon: IconName, label: string, to: string) => (
    <button className="m-tab" data-active={activeTab === id} onClick={() => navigate(to)}>
      <Icon name={icon} size={22} /> {label}
    </button>
  );

  return (
    <div className="app-mobile">
      <div className="m-utilbar">
        <IconButton icon="menu" label="Menu" variant="ghost" />
        <ThemeToggle />
      </div>
      <div className="m-content" ref={contentRef}>
        <Outlet />
      </div>
      <nav className="m-tabbar">
        {tab('home', 'home', 'Home', '/')}
        {tab('spaces', 'wallet', 'Spaces', '/spaces')}
        <button className="m-fab" aria-label="Add entry" onClick={() => openAddEntry()}>
          <Icon name="plus" size={26} strokeWidth={2.4} />
        </button>
        {tab('reports', 'pie-chart', 'Reports', '/reports')}
        {tab('settings', 'settings', 'Settings', '/settings')}
      </nav>
      <MobileToast />
      <AddEntryDialog />
      <NewSpaceDialog />
      <SpaceSettingsDialog />
    </div>
  );
}

function MobileToast() {
  const toast = useAppStore((s) => s.toast);
  const dismiss = useAppStore((s) => s.dismissToast);
  if (!toast) return null;
  return (
    <div className="m-toast">
      <ToastCard msg={toast.msg} sub={toast.sub} onClose={dismiss} />
    </div>
  );
}

function ToastCard({ msg, sub, onClose }: { msg: string; sub?: string; onClose: () => void }) {
  // Lightweight inline toast card (DS Toast expects title/description props).
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: 'var(--space-3) var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        maxWidth: 340,
      }}
      onClick={onClose}
    >
      <span style={{ display: 'inline-flex', color: 'var(--accent)' }}>
        <Icon name="check-circle" size={20} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>{msg}</span>
        {sub && <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{sub}</span>}
      </span>
    </div>
  );
}

// ============================================================
// DESKTOP
// ============================================================
function DesktopShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const openAddEntry = useAppStore((s) => s.openAddEntry);
  const openNewSpace = useAppStore((s) => s.openNewSpace);
  const snapshot = useAppStore((s) => s.snapshot);
  const month = useAppStore((s) => s.month);
  useScrollReset(scrollRef);

  const people = snapshot.household.people;
  const shared = snapshot.spaces
    .filter((s) => s.group === 'shared')
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const personal = snapshot.spaces
    .filter((s) => s.kind === 'personal')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const personName = personal.find((p) => pathname === `/personal/${p.id}`)?.name;
  const spaceMatch = pathname.startsWith('/spaces/')
    ? snapshot.spaces.find((s) => pathname === `/spaces/${s.id}`)
    : undefined;
  const openSpaceSettings = useAppStore((s) => s.openSpaceSettings);
  const meta = routeMeta(pathname, month, personName, spaceMatch?.name);

  const NavItem = ({
    icon,
    label,
    to,
    active,
    sub,
    onClick,
    accent,
  }: {
    icon: IconName;
    label: string;
    to?: string;
    active?: boolean;
    sub?: ReactNode;
    onClick?: () => void;
    accent?: boolean;
  }) => (
    <button
      className="nav-item"
      data-active={active || undefined}
      onClick={onClick ?? (to ? () => navigate(to) : undefined)}
      style={accent ? { color: 'var(--text-accent)' } : undefined}
    >
      <Icon name={icon} size={18} /> <span>{label}</span>
      {sub != null && <em className="nav-sub">{sub}</em>}
    </button>
  );

  return (
    <div className="app-desktop">
      <aside className="sidebar">
        <div className="brand">
          <img src={markUrl} width={30} height={30} alt="" />
          <span>Sprout</span>
        </div>
        <nav className="nav">
          <NavItem icon="pie-chart" label="Overview" to="/" active={pathname === '/'} />
          <NavItem icon="bar-chart" label="Reports" to="/reports" active={pathname === '/reports'} />
        </nav>
        <div>
          <div className="navlabel">Shared</div>
          <nav className="nav">
            {shared.map((s) => (
              <NavItem
                key={s.id}
                icon={s.icon as IconName}
                label={s.name}
                to={`/spaces/${s.id}`}
                active={pathname === `/spaces/${s.id}`}
                sub={s.sub}
              />
            ))}
            <NavItem icon="plus" label="New space" onClick={openNewSpace} accent />
          </nav>
        </div>
        <div>
          <div className="navlabel">Personal</div>
          <nav className="nav">
            {personal.map((p) => (
              <NavItem
                key={p.id}
                icon="user"
                label={p.name}
                to={`/personal/${p.id}`}
                active={pathname === `/personal/${p.id}`}
              />
            ))}
          </nav>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ padding: '0 4px 4px' }}>
            <ThemeToggle variant="secondary" />
          </div>
          <div className="account">
            <Avatar name={people[0]?.name ?? 'JC'} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>
                {people.slice(0, 2).map((p) => p.name).join(' & ') || 'Household'}
              </div>
              <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Household</div>
            </div>
            <button
              aria-label="Settings"
              onClick={() => navigate('/settings')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'inline-flex' }}
            >
              <Icon name="settings" size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{meta.eyebrow}</div>
            <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>
              {meta.title}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex' }}>
              {people.map((p, i) => (
                <Avatar
                  key={p.id}
                  name={p.name}
                  size={34}
                  style={{
                    marginLeft: i === 0 ? 0 : -8,
                    boxShadow: '0 0 0 2px var(--surface-canvas)',
                  }}
                />
              ))}
            </div>
            {spaceMatch && (
              <IconButton
                icon="settings"
                label="Space settings"
                variant="secondary"
                onClick={() => openSpaceSettings(spaceMatch.id)}
              />
            )}
            <IconButton icon="search" label="Search" variant="secondary" />
            <IconButton icon="bell" label="Alerts" variant="secondary" />
            <Button iconStart="plus" onClick={() => openAddEntry()}>
              Add entry
            </Button>
          </div>
        </header>
        <div className="scroll" ref={scrollRef}>
          <Outlet />
        </div>
      </div>

      <AddEntryDialog />
      <NewSpaceDialog />
      <SpaceSettingsDialog />
    </div>
  );
}
