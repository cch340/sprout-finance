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
import { evalExpression, hasOperator } from '../domain/calc';
import { categoriesWithOther, resolveCatKey } from '../domain/selectors';
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
  // Initialise from any prefilled value (edit mode): a preset option selects
  // itself; a non-preset non-empty value drops into the "Other…" free-text path.
  const isPreset =
    field.type === 'select' && !!field.options && value !== '' && field.options.includes(value);
  const [sel, setSel] = useState(
    value === '' ? '' : isPreset ? value : field.type === 'select' && field.options ? '__other' : '',
  );
  const [custom, setCustom] = useState(isPreset ? '' : value);

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
  if (field.type === 'date') {
    return (
      <Input
        label={field.label}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === 'number') {
    // Optional field: only flag as invalid when non-empty and non-numeric.
    const invalid = value.trim() !== '' && Number.isNaN(Number(value));
    return (
      <Input
        label={field.label}
        inputMode="decimal"
        placeholder={field.placeholder || '0'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={invalid ? 'Enter a number' : undefined}
      />
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
  const editEntryId = useAppStore((s) => s.editEntryId);
  const close = useAppStore((s) => s.closeAddEntry);
  const spaces = useAppStore((s) => s.snapshot.spaces);
  const txs = useAppStore((s) => s.snapshot.txs);
  const people = useAppStore((s) => s.snapshot.household.people);
  const addEntry = useAppStore((s) => s.addEntry);
  const updateEntry = useAppStore((s) => s.updateEntry);
  const addRecurring = useAppStore((s) => s.addRecurring);

  // Edit mode: prefill from the target tx and lock the space (avoids cross-space
  // migration semantics — the origin entry stays in its space).
  const editTx = editEntryId ? txs.find((t) => t.id === editEntryId) : undefined;
  const isEdit = Boolean(editTx);

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
  // Optional "Paid from" attribution only: '' = not specified, a person name, or
  // a fund's short/name (a reference label; it does not move money between spaces).
  const [payer, setPayer] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(isoToday());
  const [recurring, setRecurring] = useState(false);
  const [showError, setShowError] = useState(false);
  // Bump to re-mount field inputs whenever the space changes (resets local state).
  const [fieldKey, setFieldKey] = useState(0);

  // Reset the whole form each time the dialog opens (honouring preselect); in
  // edit mode prefill every field from the target tx instead.
  useEffect(() => {
    if (!open) return;
    if (editTx) {
      setSpaceId(editTx.spaceId);
      setDir(editTx.dir);
      setAmount(String(editTx.amount));
      // Normalise onto a category the space still defines; a deleted one → Other.
      const eSpace = spaces.find((s) => s.id === editTx.spaceId);
      setCat(eSpace ? resolveCatKey(eSpace, editTx.cat) : editTx.cat);
      setFieldVals({ ...editTx.fieldValues });
      setPayer(editTx.payer ?? '');
      setNote(editTx.note ?? '');
      setDate(editTx.date);
      setRecurring(false);
      setShowError(false);
      setFieldKey((k) => k + 1);
      return;
    }
    const startId = initialSpaceId && spaces.some((s) => s.id === initialSpaceId)
      ? initialSpaceId
      : firstSpaceId;
    const start = spaces.find((s) => s.id === startId);
    setSpaceId(startId);
    setDir('out');
    setAmount('');
    setCat(start?.cats[0]?.key ?? 'other');
    setFieldVals({});
    setPayer('');
    setNote('');
    setDate(isoToday());
    setRecurring(false);
    setShowError(false);
    setFieldKey((k) => k + 1);
  }, [open, editEntryId, initialSpaceId, firstSpaceId, spaces]);

  const onSpace = (id: string) => {
    const next = spaces.find((s) => s.id === id);
    setSpaceId(id);
    setCat(next?.cats[0]?.key ?? 'other');
    setFieldVals({});
    setFieldKey((k) => k + 1);
  };
  const setField = (key: string, v: string) =>
    setFieldVals((s) => ({ ...s, [key]: v }));

  // "Paid from" options: an empty default, each household person, then each fund
  // space. A fund's value is its short label (or name), which also matches legacy
  // 'Joint' payer strings so old + new data co-bucket. Attribution only — the
  // selection is a reference label and never moves money between spaces.
  const payerOptions = useMemo(() => {
    const persons = people
      .filter((p) => p.id !== 'leo')
      .map((p) => ({ value: p.name, label: p.name }));
    const funds = spaces
      .filter((s) => s.kind === 'fund')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((f) => ({ value: f.short ?? f.name, label: f.name }));
    return [{ value: '', label: 'Not specified' }, ...persons, ...funds];
  }, [people, spaces]);

  // The amount field doubles as a mini calculator: users may type an expression
  // like "12.50 + 5" and we evaluate it (null → invalid, treated as 0 on save).
  const amountEval = evalExpression(amount);
  const amountNum = amountEval ?? 0;
  const amountIsExpr = hasOperator(amount);
  const amountInvalid = showError && amountNum <= 0;
  // Live "= 37.50" preview while typing an expression (hint hides when errored).
  const amountHint = amountIsExpr
    ? amountEval !== null
      ? `= ${amountEval.toFixed(2)}`
      : 'Incomplete expression'
    : undefined;
  // On blur/Enter, fold a valid expression down to its rounded numeric result.
  const commitAmount = () => {
    if (amountIsExpr && amountEval !== null) {
      setAmount(String(Math.round(amountEval * 100) / 100));
    }
  };

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
    if (isEdit && editTx) {
      await updateEntry(editTx.id, {
        amount: amountNum,
        cat,
        dir,
        payer: isPersonal ? undefined : payer,
        note: note.trim(),
        title,
        date,
        fieldValues: { ...fieldVals },
      });
      close();
      return;
    }
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
      title={isEdit ? 'Edit entry' : 'Add entry'}
      description={
        isEdit
          ? 'Update the details below. The space stays the same.'
          : 'Pick a space, then fill in what belongs to it.'
      }
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button iconStart="check" onClick={() => void save()}>
            {isEdit ? 'Save changes' : dir === 'in' ? 'Save income' : 'Save entry'}
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
          disabled={isEdit}
          hint={isEdit ? 'Locked while editing' : undefined}
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
          <CategoryIcon category={cat} icon={cats.find((c) => c.key === cat)?.icon} size={52} />
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
              onBlur={commitAmount}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitAmount();
              }}
              hint={amountHint}
              error={amountInvalid ? 'Enter an amount greater than 0' : undefined}
            />
          </div>
        </div>

        <Input
          label="Date"
          type="date"
          value={date}
          max={isoToday()}
          required
          onChange={(e) => setDate(e.target.value || isoToday())}
        />

        <Select
          label={catLabel}
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          options={categoriesWithOther({ cats }).map((c) => ({ value: c.key, label: c.label }))}
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
          <Select
            label="Paid from"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            options={payerOptions}
            hint="Optional — pick a person, or a fund to draw the money from it."
          />
        )}

        <Input
          label="Note"
          placeholder="Anything to remember?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {!isEdit && (
          <Switch
            label="Recurring monthly"
            description="Also save this as a monthly commitment"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
          />
        )}
      </div>
    </Dialog>
  );
}
