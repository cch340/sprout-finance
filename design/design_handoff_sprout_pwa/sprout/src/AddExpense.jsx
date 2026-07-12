// Add-entry dialog — space FIRST, then a category + fields scoped to it.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Dialog, Input, Select, SegmentedControl, Switch, Button, CategoryIcon } = K;
  const D = window.SproutData;

  // Renders a space field as text, or (if it has options) a dropdown with an
  // "Other…" escape hatch that reveals a free-text input.
  function FieldInput({ field, onChange }) {
    const [sel, setSel] = React.useState('');
    const [custom, setCustom] = React.useState('');
    if (field.type === 'select' && field.options) {
      const opts = field.options.map((o) => ({ value: o, label: o })).concat({ value: '__other', label: 'Other…' });
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Select label={field.label} value={sel} placeholder="Choose…" options={opts}
            onChange={(e) => { const v = e.target.value; setSel(v); onChange(v === '__other' ? custom : v); }} />
          {sel === '__other' && (
            <Input placeholder={'Enter ' + field.label.toLowerCase()} value={custom}
              onChange={(e) => { setCustom(e.target.value); onChange(e.target.value); }} autoFocus />
          )}
        </div>
      );
    }
    return <Input label={field.label} placeholder={field.placeholder || ''} onChange={(e) => onChange(e.target.value)} />;
  }

  function spaceOptions() {
    const shared = D.spaces.filter((s) => s.kind !== 'fund').map((s) => ({ value: s.id, label: s.name }));
    return [...shared, { value: 'jc', label: 'JC · Personal' }, { value: 'ch', label: 'CH · Personal' }];
  }
  const spaceById = (id) => (id === 'jc' || id === 'ch') ? D.personal[id] : D.space(id);
  const catsFor = (id) => spaceById(id)?.cats || [];
  const fieldsFor = (id) => spaceById(id)?.fields || [];

  window.AddExpenseDialog = function AddExpenseDialog({ open, onClose, onSave, initialSpace = 'expenses' }) {
    const [space, setSpace] = React.useState(initialSpace);
    const [cat, setCat] = React.useState(catsFor(initialSpace)[0]?.key);
    const [fieldVals, setFieldVals] = React.useState({});
    const [amount, setAmount] = React.useState('');
    const [payer, setPayer] = React.useState('joint');
    const [note, setNote] = React.useState('');
    const [recurring, setRecurring] = React.useState(false);

    const onSpace = (v) => { setSpace(v); setCat(catsFor(v)[0]?.key); setFieldVals({}); };
    const setField = (k, val) => setFieldVals((s) => ({ ...s, [k]: val }));

    const cats = catsFor(space);
    const fields = fieldsFor(space);
    const primary = fields.find((f) => f.primary);
    const secondary = fields.filter((f) => !f.primary);
    const personal = space === 'jc' || space === 'ch';

    const save = () => {
      onSave && onSave({ space, cat, amount: parseFloat(amount) || 0, payer, note, ...fieldVals });
      setAmount(''); setNote(''); setFieldVals({});
    };

    return (
      <Dialog open={open} onClose={onClose} title="Add entry" description="Pick a space, then fill in what belongs to it."
        footer={<>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button iconStart="check" onClick={save} disabled={!amount}>Save entry</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Select label="Space" value={space} onChange={(e) => onSpace(e.target.value)} options={spaceOptions()} />

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <CategoryIcon category={cat} size={52} />
            <div style={{ flex: 1 }}>
              <Input label="Amount" prefix="RM" placeholder="0.00" inputMode="decimal" size="lg"
                value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
            </div>
          </div>

          <Select label={`Category · ${personal ? 'Personal' : (D.space(space)?.name || '')}`} value={cat}
            onChange={(e) => setCat(e.target.value)} options={cats.map((c) => ({ value: c.key, label: c.label }))} />

          {/* generic per-space fields (text or preset dropdown) */}
          {primary && (
            <FieldInput key={space + ':' + primary.key} field={primary} onChange={(v) => setField(primary.key, v)} />
          )}
          {secondary.map((f) => (
            <FieldInput key={space + ':' + f.key} field={f} onChange={(v) => setField(f.key, v)} />
          ))}

          {!personal && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Paid by</label>
              <SegmentedControl fullWidth value={payer} onChange={setPayer} options={[
                { value: 'joint', label: 'Joint' }, { value: 'jc', label: 'JC' }, { value: 'ch', label: 'CH' },
              ]} />
            </div>
          )}
          <Input label="Note" placeholder="Anything to remember?" value={note} onChange={(e) => setNote(e.target.value)} />
          <Switch label="Recurring monthly" description="Repeats on the same day each month"
            checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
        </div>
      </Dialog>
    );
  };
})();
