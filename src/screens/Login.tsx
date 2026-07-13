import { useState } from 'react';
import { Button, Card, Input } from '../design-system';
import { supabase } from '../data/supabase';
import { useAppStore } from '../store/useAppStore';
import markUrl from '../assets/sprout-mark.svg';

type Mode = 'signin' | 'signup';

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'That email and password don’t match.';
  if (m.includes('email not confirmed')) return 'Please confirm your email first — check your inbox.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'That email already has an account — sign in instead.';
  if (m.includes('password')) return 'Password must be at least 6 characters.';
  if (m.includes('unable to validate') || m.includes('valid email')) return 'Please enter a valid email address.';
  return message || 'Something went wrong. Please try again.';
}

export function Login() {
  const refreshAfterAuth = useAppStore((s) => s.refreshAfterAuth);
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) { setError(friendlyError(err.message)); return; }
        await refreshAfterAuth();
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) { setError(friendlyError(err.message)); return; }
        if (!data.session) {
          setNotice('Check your email to confirm your account, then sign in.');
          setMode('signin');
          return;
        }
        await refreshAfterAuth();
      }
    } catch {
      setError('Couldn’t reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError(null);
    setNotice(null);
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
      <Card padding="lg" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
            <img src={markUrl} width={64} height={64} alt="Sprout" style={{ borderRadius: 20, boxShadow: 'var(--shadow-lg)' }} />
            <div>
              <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>
                {mode === 'signin'
                  ? 'Sign in to your shared household.'
                  : 'Track money together — start in a minute.'}
              </p>
            </div>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div style={{ font: 'var(--font-caption)', color: 'var(--money-over)', padding: '2px 2px' }}>{error}</div>
            )}
            {notice && (
              <div style={{ font: 'var(--font-caption)', color: 'var(--sage-700)', padding: '2px 2px' }}>{notice}</div>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading || !email.trim() || !password}
            >
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={toggle}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent)', font: 'inherit', fontWeight: 'var(--fw-semibold)' }}
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
