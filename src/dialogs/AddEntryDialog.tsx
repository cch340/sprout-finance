import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  CategoryIcon,
  Dialog,
  Input,
  SegmentedControl,
  Select,
  Switch,
} from '../design-system';
import { useAppStore } from '../store/useAppStore';
import { isoToday } from '../domain/format';
import type { FieldDef, Space, TxDir } from '../domain/types';

/**
 * Renders a space's generic field as a text input, or — when it has preset
 * options — a dropdown with an "Other…" escape that swaps to a free-text input
 * (with a way back to the preset list).
 */
function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  // `sel` is the chosen dropdown value ('' = none, '__other' = free text).
  const [sel, setSel] = useState('');
  const [custom, setCustom] = useState('');

  if (field.type === 'select' && field.options && field.options.length > 0) {
    const options = field.options
      .map((o) => ({ value: o, label: o }))
      .concat({ value: '__other', label: 'Other…' });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Select
          label={field.label}
          value={sel}
          placeholder="Choose…"
          options={options}
          onChange={(e) => {
            const v = e.target.value;
            setSel(v);
            onChange(v === '__other' ? custom : v);
          }}
        />
        {sel === '__other' && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  onChange(e.target.value);
                }}
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSel('');
                setCustom('');
                onChange('');
              }}
            >
              Back
            </Button>
          </div>
        )}
      </div>
    );
  }
  return (
    <Input
      label={field.label}
      placeholder={field.placeholder || ''}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function AddEntryDialog() {
  const open = useAppStore((s) => s.addEntryOpen);
  const initialSpaceId = useAppStore((s) => s.addEntrySpaceId);
  const close = useAppStore((s) => s.closeAddEntry);
  const spaces = useAppStore((s) => s.snapshot.spaces);
  const people = useAppStore((s) => s.snapshot.household.people);
  const addEntry = useAppStore((s) => s.addEntry);
  const addRecurring = useAppStore((s) => s.addRecurring);

  // Space picker: all shared spaces (spend/fund/invest) then personal spaces.
  const spaceOptions = useMemo(() => {
    const shared = spaces
      .filter((s) => s.group === 'shared')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ value: s.id, label: s.name }));
    const personal = spaces
      .filter((s) => s.kind === 'personal')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({ value: s.id, label: `${s.name} · Personal` }));
    return [...shared, ...personal];
  }, [spaces]);

  const firstSpaceId = spaceOptions[0]?.value ?? '';
  const [spaceId, setSpaceId] = useState(firstSpaceId);
  const space: Space | undefined = spaces.find((s) => s.id === spaceId);
  const cats = space?.cats ?? [];
  const fields = space?.fields ?? [];
  const primary = fields.find((f) => f.primary);
  const secondary = fields.filter((f) => !f.primary);
  const isPersonal = space?.group === 'personal';

  const [dir, setDir] = useState<TxDir>('out');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState(cats[0]?.key ?? 'other');
  const [fieldVals, setFieldVals] = useState<Record<string, string>>({});
  const [payer, setPayer] = useState('Joint');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(isoToday());
  const [recurring, setRecurring] = useState(false);
  const [showError, setShowError] = useState(false);
  // Bump to re-mount field inputs whenever the space changes (resets local state).
  const [fieldKey, setFieldKey] = useState(0);

  // Reset the whole form each time the dialog opens (honouring preselect).
  useEffect(() => {
    if (!open) return;
    const startId = initialSpaceId && spaces.some((s) => s.id === initialSpaceId)
      ? initialSpaceId
      : firstSpaceId;
    const start = spaces.find((s) => s.id === startId);
    setSpaceId(startId);
    setDir('out');
    setAmount('');
    setCat(start?.cats[0]?.key ?? 'other');
    setFieldVals({});
    setPayer('Joint');
    setNote('');
    setDate(isoToday());
    setRecurring(false);
    setShowError(false);
    setFieldKey((k) => k + 1);
  }, [open, initialSpaceId, firstSpaceId, spaces]);

  const onSpace = (id: string) => {
    const next = spaces.find((s) => s.id === id);
    setSpaceId(id);
    setCat(next?.cats[0]?.key ?? 'other');
    setFieldVals({});
    setFieldKey((k) => k + 1);
  };
  const setField = (key: string, v: string) =>
    setFieldVals((s) => ({ ...s, [key]: v }));

  const amountNum = parseFloat(amount) || 0;
  const amountInvalid = showError && amountNum <= 0;

  const save = async () => {
    if (amountNum <= 0) {
      setShowError(true);
      return;
    }
    if (!space) return;
    const title =
      (primary ? fieldVals[primary.key]?.trim() : '') ||
      note.trim() ||
      cats.find((c) => c.key === cat)?.label ||
      'Entry';
    await addEntry({
      spaceId: space.id,
      amount: amountNum,
      cat,
      dir,
      payer: isPersonal ? undefined : payer,
      note: note.trim(),
      title,
      date,
      fieldValues: { ...fieldVals },
    });
    if (recurring) {
      await addRecurring({ spaceId: space.id, label: title, cat, amount: amountNum });
    }
    close();
  };

  const catLabel = `Category · ${isPersonal ? 'Personal' : space?.name ?? ''}`;

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Add entry"
      description="Pick a space, then fill in what belongs to it."
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button iconStart="check" onClick={() => void save()}>
            {dir === 'in' ? 'Save income' : 'Save entry'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Select
          label="Space"
          value={spaceId}
          onChange={(e) => onSpace(e.target.value)}
          options={spaceOptions}
        />

        <SegmentedControl
          fullWidth
          value={dir}
          onChange={(v) => setDir(v as TxDir)}
          options={[
            { value: 'out', label: 'Expense' },
            { value: 'in', label: 'Income' },
          ]}
        />

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
          <CategoryIcon category={cat} size={52} />
          <div style={{ flex: 1 }}>
            <Input
              label="Amount"
              prefix="RM"
              placeholder="0.00"
              inputMode="decimal"
              size="lg"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (showError) setShowError(false);
              }}
              error={amountInvalid ? 'Enter an amount greater than 0' : undefined}
            />
          </div>
        </div>

        <Select
          label={catLabel}
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          options={cats.map((c) => ({ value: c.key, label: c.label }))}
        />

        {primary && (
          <FieldInput
            key={`${fieldKey}:${primary.key}`}
            field={primary}
            value={fieldVals[primary.key] ?? ''}
            onChange={(v) => setField(primary.key, v)}
          />
        )}
        {secondary.map((f) => (
          <FieldInput
            key={`${fieldKey}:${f.key}`}
            field={f}
            value={fieldVals[f.key] ?? ''}
            onChange={(v) => setField(f.key, v)}
          />
        ))}

        {!isPersonal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Paid by</label>
            <SegmentedControl
              fullWidth
              value={payer}
              onChange={setPayer}
              options={[
                { value: 'Joint', label: 'Joint' },
                ...people
                  .filter((p) => p.id !== 'leo')
                  .slice(0, 2)
                  .map((p) => ({ value: p.name, label: p.name })),
              ]}
            />
          </div>
        )}

        <Input
          label="Note"
          placeholder="Anything to remember?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Input
          label="Date"
          type="date"
          value={date}
          max={isoToday()}
          required
          onChange={(e) => setDate(e.target.value || isoToday())}
        />

        <Switch
          label="Recurring monthly"
          description="Also save this as a monthly commitment"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />
      </div>
    </Dialog>
  );
}
