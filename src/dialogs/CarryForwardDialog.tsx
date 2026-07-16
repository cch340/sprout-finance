import { useEffect, useMemo, useState } from 'react';
import { Button, CategoryIcon, Checkbox, Dialog, Input, Select } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import type { Space, Tx } from '../domain/types';
import { isoMonth, monthLabel } from '../domain/format';

// ---- month helpers (app code — Date is fine here) ------------------------
/** Add n calendar months to a yyyy-mm key. */
function addMonths(key: string, n: number): string {
  const [y, m] = key.split('-').map(Number);
  const idx = y * 12 + (m - 1) + n;
  return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, '0')}`;
}
/** Inclusive ascending list of yyyy-mm keys from `from` to `to`. */
function monthRange(from: string, to: string): string[] {
  const out: string[] = [];
  let k = from;
  // Guard against a runaway loop if inputs are malformed.
  for (let i = 0; i < 60 && k <= to; i++) {
    out.push(k);
    k = addMonths(k, 1);
  }
  return out;
}
/** Days in the month of a yyyy-mm key. */
function daysInMonth(key: string): number {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

/**
 * A row is a fund "paid from" mirror when it lives in a fund space and carries a
 * link. Those are the other half of an expense elsewhere and must not be carried
 * forward on their own — everything else in the space is fair game.
 */
function isMirror(space: Space, t: Tx): boolean {
  return space.kind === 'fund' && !!t.linkId;
}

export function CarryForwardDialog({
  open,
  onClose,
  space,
  defaultSource,
  defaultTarget,
}: {
  open: boolean;
  onClose: () => void;
  space: Space;
  /** Preselect the source month (yyyy-mm). Falls back to the latest month with entries. */
  defaultSource?: string;
  /** Preselect the target month (yyyy-mm). Falls back to the current calendar month. */
  defaultTarget?: string;
}) {
  const snapshot = useAppStore((s) => s.snapshot);
  const carryForward = useAppStore((s) => s.carryForward);
  const currency = snapshot.settings.currency;

  const spaceTxs = useMemo(
    () => snapshot.txs.filter((t) => t.spaceId === space.id),
    [snapshot.txs, space.id],
  );

  // Months that actually have carryable entries, newest first (source options).
  const sourceMonths = useMemo(() => {
    const set = new Set<string>();
    for (const t of spaceTxs) if (!isMirror(space, t)) set.add(t.date.slice(0, 7));
    return [...set].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
  }, [spaceTxs, space]);

  const now = isoMonth(new Date());
  // Target options: from the earliest data (or this month) forward a year, so you
  // can backfill past months or seed ahead.
  const targetMonths = useMemo(() => {
    const earliest = sourceMonths.length ? sourceMonths[sourceMonths.length - 1] : now;
    const from = earliest < now ? earliest : now;
    return monthRange(from, addMonths(now, 11));
  }, [sourceMonths, now]);

  const [sourceMonth, setSourceMonth] = useState('');
  const [targetMonth, setTargetMonth] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  // Carryable source rows for the chosen source month.
  const rows = useMemo(
    () =>
      spaceTxs
        .filter((t) => !isMirror(space, t) && t.date.slice(0, 7) === sourceMonth)
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
    [spaceTxs, space, sourceMonth],
  );

  // Titles already present in the target month (for duplicate awareness).
  const targetKeys = useMemo(() => {
    const set = new Set<string>();
    for (const t of spaceTxs) {
      if (t.date.slice(0, 7) === targetMonth) set.add(`${t.dir}::${t.title}`);
    }
    return set;
  }, [spaceTxs, targetMonth]);
  const isDupe = (t: Tx) => targetKeys.has(`${t.dir}::${t.title}`);

  // Initialise / re-initialise when opened or the months change: default source =
  // latest month with data, target = current month (or the provided defaults).
  useEffect(() => {
    if (!open) return;
    setSourceMonth(defaultSource ?? sourceMonths[0] ?? now);
    setTargetMonth(defaultTarget ?? now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Whenever the source/target month changes, select all non-duplicate rows and
  // seed each editable amount from its source value.
  useEffect(() => {
    if (!open || !sourceMonth) return;
    const next = new Set<string>();
    const amt: Record<string, string> = {};
    for (const t of rows) {
      amt[t.id] = String(t.amount);
      if (!isDupe(t)) next.add(t.id);
    }
    setSelected(next);
    setAmounts(amt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sourceMonth, targetMonth]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const sameMonth = sourceMonth === targetMonth;
  const count = selected.size;
  const canConfirm = count > 0 && !sameMonth && !!targetMonth;

  const confirm = async () => {
    const days = daysInMonth(targetMonth);
    const drafts: Omit<Tx, 'id'>[] = rows
      .filter((t) => selected.has(t.id))
      .map((t) => {
        const srcDay = Number(t.date.slice(8, 10)) || 1;
        const day = Math.min(srcDay, days);
        return {
          spaceId: space.id,
          title: t.title,
          fieldValues: { ...t.fieldValues },
          note: t.note,
          cat: t.cat,
          amount: parseFloat(amounts[t.id]) || 0,
          date: `${targetMonth}-${String(day).padStart(2, '0')}`,
          payer: t.payer,
          dir: t.dir,
        };
      });
    const n = await carryForward(drafts);
    if (n > 0) onClose();
  };

  const selectAll = () => setSelected(new Set(rows.map((t) => t.id)));
  const selectNone = () => setSelected(new Set());

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Carry forward"
      description="Copy a month's entries into another month. Amounts stay editable."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button iconStart="repeat" onClick={confirm} disabled={!canConfirm}>
            {count > 0 ? `Add ${count} to ${monthLabel(targetMonth)}` : 'Add entries'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <Select
              label="From"
              value={sourceMonth}
              onChange={(e) => setSourceMonth(e.target.value)}
              options={sourceMonths.map((k) => ({ value: k, label: monthLabel(k) }))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select
              label="To"
              value={targetMonth}
              onChange={(e) => setTargetMonth(e.target.value)}
              options={targetMonths.map((k) => ({ value: k, label: monthLabel(k) }))}
            />
          </div>
        </div>

        {sameMonth ? (
          <div style={{ font: 'var(--font-caption)', color: 'var(--money-over)', padding: '0 2px' }}>
            Pick a different month to copy into.
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
              {count} of {rows.length} selected
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button type="button" onClick={selectAll} style={linkBtn}>
                All
              </button>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <button type="button" onClick={selectNone} style={linkBtn}>
                None
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {rows.length === 0 && (
            <div style={{ padding: 'var(--space-6)', textAlign: 'center', font: 'var(--font-body)', color: 'var(--text-muted)' }}>
              Nothing to carry forward from this month.
            </div>
          )}
          {rows.map((t) => {
            const dupe = isDupe(t);
            const on = selected.has(t.id);
            return (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  background: on ? 'var(--surface-sunken)' : 'transparent',
                }}
              >
                <Checkbox checked={on} onChange={() => toggle(t.id)} disabled={sameMonth} />
                <CategoryIcon category={t.cat} icon={space.cats.find((c) => c.key === t.cat)?.icon} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.title}
                  </div>
                  <div style={{ font: 'var(--font-caption)', color: dupe ? 'var(--money-over)' : 'var(--text-muted)' }}>
                    {t.dir === 'in' ? 'Income' : 'Expense'}
                    {dupe ? ` · already in ${monthLabel(targetMonth)}` : ''}
                  </div>
                </div>
                <div style={{ width: 116, flexShrink: 0 }}>
                  <Input
                    size="sm"
                    prefix={currency}
                    inputMode="decimal"
                    value={amounts[t.id] ?? ''}
                    onChange={(e) => setAmounts((a) => ({ ...a, [t.id]: e.target.value }))}
                    disabled={!on}
                    aria-label={`Amount for ${t.title}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
}

const linkBtn: React.CSSProperties = {
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  font: 'var(--font-caption)',
  fontWeight: 'var(--fw-semibold)',
  color: 'var(--accent)',
};
