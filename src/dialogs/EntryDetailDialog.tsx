import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Amount,
  Badge,
  Button,
  CategoryIcon,
  Dialog,
} from '../design-system';
import type { BadgeTone } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import type { Tx } from '../domain/types';
import { shortDate } from '../domain/format';

/** A labelled value row in the detail sheet. */
function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        padding: 'var(--space-3) 0',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <span style={{ font: 'var(--font-label)', color: 'var(--text-muted)', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ font: 'var(--font-body)', color: 'var(--text-strong)', textAlign: 'right', minWidth: 0 }}>
        {children}
      </span>
    </div>
  );
}

function statusTone(s?: Tx['status']): BadgeTone {
  return s === 'paid' ? 'income' : s === 'due' ? 'warning' : 'neutral';
}

export function EntryDetailDialog() {
  const id = useAppStore((s) => s.entryDetailId);
  const close = useAppStore((s) => s.closeEntryDetail);
  const spaces = useAppStore((s) => s.snapshot.spaces);
  const tx = useAppStore((s) => s.snapshot.txs.find((t) => t.id === id));
  const openEditEntry = useAppStore((s) => s.openEditEntry);
  const deleteEntry = useAppStore((s) => s.deleteEntry);
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const open = Boolean(id && tx);
  const space = tx ? spaces.find((s) => s.id === tx.spaceId) : undefined;
  // Origin entries carry linkId === id; a mirror carries a different linkId.
  const isMirror = Boolean(tx?.linkId && tx.linkId !== tx.id);
  const originSpace = isMirror && tx?.linkSpaceId
    ? spaces.find((s) => s.id === tx.linkSpaceId)
    : undefined;

  const onClose = () => {
    setConfirmDelete(false);
    close();
  };

  if (!open || !tx) return null;

  const emoji = space?.cats.find((c) => c.key === tx.cat)?.emoji;
  const catLabel = space?.cats.find((c) => c.key === tx.cat)?.label ?? tx.cat;
  const fieldRows = (space?.fields ?? [])
    .map((f) => ({ f, v: tx.fieldValues[f.key] }))
    .filter((x) => x.v);

  const footer = isMirror ? (
    <>
      <Button variant="ghost" onClick={onClose}>
        Close
      </Button>
      {originSpace && (
        <Button
          iconStart="arrow-right"
          onClick={() => {
            onClose();
            navigate(`/spaces/${originSpace.id}`);
          }}
        >
          Open {originSpace.name}
        </Button>
      )}
    </>
  ) : (
    <>
      {!confirmDelete ? (
        <Button variant="danger" iconStart="trash" onClick={() => setConfirmDelete(true)}>
          Delete
        </Button>
      ) : (
        <Button
          variant="danger"
          iconStart="trash"
          onClick={() => {
            void deleteEntry(tx.id);
            onClose();
          }}
        >
          Confirm delete
        </Button>
      )}
      <div style={{ flex: 1 }} />
      <Button variant="ghost" onClick={onClose}>
        Close
      </Button>
      <Button iconStart="edit" onClick={() => openEditEntry(tx.id)}>
        Edit
      </Button>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={tx.title}
      size="sm"
      footer={footer}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* headline: category tile + amount with direction */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <CategoryIcon category={tx.cat} emoji={emoji} size={52} />
          <div style={{ minWidth: 0 }}>
            <Amount
              value={tx.amount}
              size="xl"
              kind={tx.dir === 'in' ? 'in' : 'neutral'}
              showSign={tx.dir === 'in'}
              style={{ display: 'block' }}
            />
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
              {tx.dir === 'in' ? 'Income' : 'Expense'} · {catLabel}
            </span>
          </div>
        </div>

        {isMirror && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-soft)',
              color: 'var(--accent-soft-fg)',
              font: 'var(--font-caption)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Paid from fund · edit the original entry in {originSpace?.name ?? 'its space'}.
          </div>
        )}

        <DetailRow label="Date">{shortDate(tx.date)}</DetailRow>
        <DetailRow label="Category">
          {catLabel}
        </DetailRow>
        {fieldRows.map(({ f, v }) => (
          <DetailRow key={f.key} label={f.label}>
            {f.type === 'date' ? shortDate(v as string) : v}
          </DetailRow>
        ))}
        {space?.group !== 'personal' && !isMirror && (
          <DetailRow label="Paid from">{tx.payer || 'Unspecified'}</DetailRow>
        )}
        {tx.note && <DetailRow label="Note">{tx.note}</DetailRow>}
        {tx.status && (
          <DetailRow label="Status">
            <Badge tone={statusTone(tx.status)} dot>
              {tx.status === 'due' ? `Due ${shortDate(tx.date)}` : 'Paid'}
            </Badge>
          </DetailRow>
        )}
      </div>
    </Dialog>
  );
}
