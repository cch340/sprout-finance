import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Icon, ListRow, Switch } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import { monthLabel } from '../domain/format';
import { useIsDesktop } from '../shell/useIsDesktop';

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--text-subtle)',
        margin: '0 4px 8px',
      }}
    >
      {children}
    </div>
  );
}

function SettingsBody() {
  const navigate = useNavigate();
  const snapshot = useAppStore((s) => s.snapshot);
  const theme = useAppStore((s) => s.snapshot.settings.theme);
  const billReminders = useAppStore((s) => s.snapshot.settings.billReminders);
  const setTheme = useAppStore((s) => s.setTheme);
  const saveSettings = useAppStore((s) => s.saveSettings);
  const resetAll = useAppStore((s) => s.resetAll);
  const openNewSpace = useAppStore((s) => s.openNewSpace);
  const email = useAppStore((s) => s.email);
  const inviteCode = useAppStore((s) => s.inviteCode);
  const signOut = useAppStore((s) => s.signOut);
  const showToast = useAppStore((s) => s.showToast);

  const [copied, setCopied] = useState(false);

  const people = snapshot.household.people;
  const adults = people.filter((p) => p.id !== 'leo');
  const kids = people.filter((p) => p.id === 'leo');
  const householdTitle = adults.slice(0, 2).map((p) => p.name).join(' & ') || 'Household';
  const householdSub =
    `Household · ${adults.length} member${adults.length === 1 ? '' : 's'}` +
    (kids.length ? ` + ${kids.map((k) => k.name).join(', ')}` : '');

  const copyInvite = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      showToast('Invite code copied', inviteCode);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast('Copy failed', inviteCode);
    }
  };

  const doSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const reset = async () => {
    if (!window.confirm('Reset all data? This permanently deletes your spaces and entries.')) return;
    await resetAll();
    navigate('/onboarding', { replace: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Household */}
      <Card padding="md">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex' }}>
            {people.map((p, i) => (
              <Avatar
                key={p.id}
                name={p.name}
                size={40}
                style={{ marginLeft: i === 0 ? 0 : -10, boxShadow: '0 0 0 2px var(--surface-card)' }}
              />
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{householdTitle}</div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{householdSub}</div>
          </div>
          <Icon name="chevron-right" size={18} style={{ color: 'var(--text-subtle)' }} />
        </div>
      </Card>

      {/* Account */}
      <div>
        <SectionLabel>Account</SectionLabel>
        <Card padding="sm">
          <ListRow
            leading={<Icon name="user" size={20} style={{ color: 'var(--text-muted)' }} />}
            title="Signed in"
            trailing={<span style={{ font: 'var(--font-body)', color: 'var(--text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email ?? '—'}</span>}
            divider
          />
          <ListRow
            leading={<Icon name="users" size={20} style={{ color: 'var(--text-muted)' }} />}
            title="Invite partner"
            subtitle="Share this code so they can join"
            trailing={
              <button
                type="button"
                onClick={() => void copyInvite()}
                disabled={!inviteCode}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, cursor: inviteCode ? 'pointer' : 'default',
                  background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', border: 'none',
                  borderRadius: 'var(--radius-md)', padding: '6px 10px',
                  font: 'var(--font-label)', fontWeight: 'var(--fw-bold)', letterSpacing: '0.14em',
                }}
              >
                {inviteCode ?? '——————'}
                <Icon name={copied ? 'check' : 'plus-circle'} size={15} />
              </button>
            }
            divider
          />
          <div style={{ padding: 'var(--space-3)' }}>
            <Button variant="secondary" fullWidth onClick={() => void doSignOut()}>Sign out</Button>
          </div>
        </Card>
      </div>

      {/* Appearance */}
      <div>
        <SectionLabel>Appearance</SectionLabel>
        <Card padding="sm">
          <div style={{ padding: 'var(--space-3)' }}>
            <Switch
              label="Dark mode"
              description="Easier on the eyes at night"
              checked={theme === 'dark'}
              onChange={(e) => void setTheme(e.target.checked ? 'dark' : 'light')}
            />
          </div>
        </Card>
      </div>

      {/* Preferences */}
      <div>
        <SectionLabel>Preferences</SectionLabel>
        <Card padding="sm">
          <ListRow
            leading={<Icon name="banknote" size={20} style={{ color: 'var(--text-muted)' }} />}
            title="Currency"
            trailing={<span style={{ font: 'var(--font-body)', color: 'var(--text-muted)' }}>{snapshot.settings.currency} · Ringgit</span>}
            divider
          />
          <div style={{ padding: 'var(--space-3)' }}>
            <Switch
              label="Bill reminders"
              description="Nudge before a bill is due"
              checked={billReminders}
              onChange={(e) => void saveSettings({ ...snapshot.settings, billReminders: e.target.checked })}
            />
          </div>
        </Card>
      </div>

      {/* Spaces */}
      <div>
        <SectionLabel>Spaces</SectionLabel>
        <Card padding="sm">
          <ListRow
            leading={<Icon name="wallet" size={20} style={{ color: 'var(--text-muted)' }} />}
            title="Manage spaces"
            subtitle="Categories, fields & budgets"
            chevron
            onClick={() => navigate('/spaces')}
            divider
          />
          <ListRow
            leading={<Icon name="plus" size={20} style={{ color: 'var(--accent)' }} />}
            title={<span style={{ color: 'var(--accent)', fontWeight: 'var(--fw-semibold)' }}>New space</span>}
            onClick={openNewSpace}
          />
        </Card>
      </div>

      {/* Data */}
      <div>
        <SectionLabel>Data</SectionLabel>
        <Card padding="sm">
          <ListRow
            leading={<Icon name="trash" size={20} style={{ color: 'var(--money-over)' }} />}
            title={<span style={{ color: 'var(--money-over)', fontWeight: 'var(--fw-semibold)' }}>Reset all data</span>}
            subtitle="Delete everything and start over"
            onClick={() => void reset()}
          />
        </Card>
      </div>

      <div style={{ textAlign: 'center', font: 'var(--font-caption)', color: 'var(--text-subtle)', padding: '2px 0 10px' }}>
        Sprout · v1
      </div>
    </div>
  );
}

export function Settings() {
  const isDesktop = useIsDesktop();
  const month = useAppStore((s) => s.month);

  if (isDesktop) {
    return (
      <div style={{ maxWidth: 640 }}>
        <SettingsBody />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{monthLabel(month)}</div>
        <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>Settings</h1>
      </div>
      <SettingsBody />
    </div>
  );
}
