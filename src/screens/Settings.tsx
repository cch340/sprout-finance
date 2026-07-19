import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Card, Dialog, Icon, Input, ListRow, Switch } from '../design-system';
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
  const households = useAppStore((s) => s.households);
  const householdId = useAppStore((s) => s.householdId);
  const role = useAppStore((s) => s.role);
  const householdName = useAppStore((s) => s.householdName);
  const leaveHousehold = useAppStore((s) => s.leaveHousehold);

  const [copied, setCopied] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const people = snapshot.household.people;
  const adults = people.filter((p) => p.id !== 'leo');
  const kids = people.filter((p) => p.id === 'leo');
  const memberTitle = adults.slice(0, 2).map((p) => p.name).join(' & ') || 'Household';
  const householdTitle = householdName ?? memberTitle;
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
    if (!window.confirm('Reset all data? This permanently deletes all spaces and entries for every member of this household.')) return;
    await resetAll();
    navigate('/onboarding', { replace: true });
  };

  const leave = async () => {
    if (!window.confirm('Leave this household? Your entries stay with the household. You can rejoin later with an invite code.')) return;
    try {
      await leaveHousehold(householdId!);
      showToast('Left household');
      navigate('/', { replace: true });
    } catch {
      showToast("Couldn't leave household");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Household */}
      <Card padding="sm">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
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
            <div style={{ font: 'var(--font-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{householdTitle}</div>
            <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>{householdSub}</div>
          </div>
        </div>
        <ListRow
          leading={<Icon name="edit" size={20} style={{ color: 'var(--text-muted)' }} />}
          title="Rename household"
          onClick={() => setRenameOpen(true)}
          divider
        />
        {households.length > 1 && (
          <ListRow
            leading={<Icon name="repeat" size={20} style={{ color: 'var(--text-muted)' }} />}
            title="Switch household"
            subtitle={`${households.length} households`}
            onClick={() => setSwitchOpen(true)}
            divider
          />
        )}
        <ListRow
          leading={<Icon name="plus-circle" size={20} style={{ color: 'var(--text-muted)' }} />}
          title="Join another household"
          subtitle="Enter a partner's invite code"
          onClick={() => setJoinOpen(true)}
          divider={role === 'member'}
        />
        {role === 'member' && (
          <ListRow
            leading={<Icon name="arrow-left" size={20} style={{ color: 'var(--money-over)' }} />}
            title={<span style={{ color: 'var(--money-over)', fontWeight: 'var(--fw-semibold)' }}>Leave household</span>}
            onClick={() => void leave()}
          />
        )}
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
      {role === 'owner' && (
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
      )}

      <div style={{ textAlign: 'center', font: 'var(--font-caption)', color: 'var(--text-subtle)', padding: '2px 0 10px' }}>
        Sprout · v1
      </div>

      <RenameHouseholdDialog open={renameOpen} onClose={() => setRenameOpen(false)} current={householdTitle} />
      <SwitchHouseholdDialog open={switchOpen} onClose={() => setSwitchOpen(false)} />
      <JoinHouseholdDialog open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}

function RenameHouseholdDialog({ open, onClose, current }: { open: boolean; onClose: () => void; current: string }) {
  const renameHousehold = useAppStore((s) => s.renameHousehold);
  const showToast = useAppStore((s) => s.showToast);
  const [name, setName] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(current);
    setError(null);
    setBusy(false);
  }, [open, current]);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    setBusy(true);
    try {
      await renameHousehold(trimmed);
      showToast('Household renamed');
      onClose();
    } catch {
      setError("Couldn't rename household. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Rename household"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => void save()} loading={busy} disabled={busy || !name.trim()}>Save</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Input
          label="Household name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Home"
          autoFocus
        />
        {error && <span style={{ font: 'var(--font-caption)', color: 'var(--money-over)' }}>{error}</span>}
      </div>
    </Dialog>
  );
}

function SwitchHouseholdDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const households = useAppStore((s) => s.households);
  const activeId = useAppStore((s) => s.householdId);
  const switchHousehold = useAppStore((s) => s.switchHousehold);

  const pick = (id: string) => {
    void switchHousehold(id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Switch household"
      description="Pick which household to view. Your device remembers this choice."
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {households.map((h, i) => {
          const active = h.id === activeId;
          const label = h.name ?? `Household · ${h.invite_code}`;
          return (
            <ListRow
              key={h.id}
              leading={<Avatar name={label} size={36} />}
              title={label}
              subtitle={h.role === 'owner' ? 'Owner' : 'Member'}
              trailing={active ? <Icon name="check" size={18} style={{ color: 'var(--accent)' }} /> : undefined}
              onClick={active ? undefined : () => pick(h.id)}
              divider={i < households.length - 1}
            />
          );
        })}
      </div>
    </Dialog>
  );
}

function JoinHouseholdDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const joinHousehold = useAppStore((s) => s.joinHousehold);
  const showToast = useAppStore((s) => s.showToast);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setCode('');
    setError(null);
    setBusy(false);
  }, [open]);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      await joinHousehold(code.trim());
      showToast('Joined household');
      onClose();
    } catch {
      setError('That invite code didn’t work. Check the 6 characters and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Join another household"
      description="Ask your partner for the 6-character invite code in their Settings."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => void submit()} loading={busy} disabled={busy || code.trim().length < 6}>Join household</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Input
          label="Invite code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABC123"
          autoCapitalize="characters"
          maxLength={6}
          autoFocus
          style={{ letterSpacing: '0.18em', fontWeight: 'var(--fw-semibold)' as React.CSSProperties['fontWeight'] }}
        />
        {error && <span style={{ font: 'var(--font-caption)', color: 'var(--money-over)' }}>{error}</span>}
      </div>
    </Dialog>
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
