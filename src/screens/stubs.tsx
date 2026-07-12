import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

/** Tiny placeholder screen — replaced by full implementations in later phases. */
function Stub({ title, note }: { title: string; note: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>{title}</h1>
      <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 0 }}>{note}</p>
    </div>
  );
}

export function SpacesStub() {
  return <Stub title="Spaces" note="Your shared and personal spaces — coming in a later phase." />;
}

export function SpaceDetailStub() {
  const { id } = useParams();
  const space = useAppStore((s) => s.snapshot.spaces.find((sp) => sp.id === id));
  return <Stub title={space?.name ?? 'Space'} note="Space detail — coming in a later phase." />;
}

export function PersonalStub() {
  const { who } = useParams();
  const person = useAppStore((s) => s.snapshot.spaces.find((sp) => sp.id === who));
  return <Stub title={`${person?.name ?? who ?? 'Personal'} · Personal`} note="Personal ledger — coming in a later phase." />;
}

export function ReportsStub() {
  return <Stub title="Reports" note="Spending trends and breakdowns — coming in a later phase." />;
}

export function SettingsStub() {
  return <Stub title="Settings" note="Household, appearance and preferences — coming in a later phase." />;
}
