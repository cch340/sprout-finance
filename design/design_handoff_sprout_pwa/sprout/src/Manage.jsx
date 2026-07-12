// Manage flows — create a new space, and edit a space's categories + fields.
// Interactive mocks (local state) so the shape of "make it your own" is clear.
(function () {
  const K = window.KiraDesignSystem_c378eb;
  const { Dialog, Input, Button, IconButton, SegmentedControl, CategoryIcon, Icon, Tag, Badge } = K;
  const D = window.SproutData;

  // A field row in settings: name + type, remove, and preset-value management.
  // Adding preset values turns the field into a dropdown at entry time.
  function FieldRow({ field, onRemove }) {
    const [opts, setOpts] = React.useState(field.options ? field.options.slice() : []);
    const [np, setNp] = React.useState('');
    const isSelect = opts.length > 0;
    const addOpt = () => { if (!np.trim()) return; setOpts((o) => [...o, np.trim()]); setNp(''); };
    return (
      <div style={{ padding: '10px 12px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="tag" size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ flex: 1, font: 'var(--font-label)', color: 'var(--text-strong)' }}>{field.label}{field.primary ? ' · title' : ''}</span>
          <Badge tone={isSelect ? 'accent' : 'neutral'}>{isSelect ? 'dropdown' : 'text'}</Badge>
          {!field.primary && <IconButton icon="x" label="Remove field" variant="ghost" size="sm" onClick={onRemove} />}
        </div>
        {opts.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {opts.map((o, i) => (
              <Tag key={o + i} size="sm" onRemove={() => setOpts((x) => x.filter((_, j) => j !== i))}>{o}</Tag>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}><Input placeholder="Add a preset value…" value={np} onChange={(e) => setNp(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addOpt()} /></div>
          <Button variant="ghost" size="sm" iconStart="plus" onClick={addOpt}>Preset</Button>
        </div>
      </div>
    );
  }

  // ---- New space -----------------------------------------------------------
  window.NewSpaceDialog = function NewSpaceDialog({ open, onClose, onCreate }) {
    const [name, setName] = React.useState('');
    const [icon, setIcon] = React.useState('wallet');
    const [kind, setKind] = React.useState('spend');
    const [budget, setBudget] = React.useState('');

    const create = () => { onCreate && onCreate({ name, icon, kind, budget: kind === 'spend' ? (parseFloat(budget) || null) : null }); setName(''); setIcon('wallet'); setKind('spend'); setBudget(''); };

    return (
      <Dialog open={open} onClose={onClose} title="New space" description="Spaces keep money separate — e.g. another investment, a renovation, a trip."
        footer={<>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button iconStart="plus" onClick={create} disabled={!name}>Create space</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
            <span style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={icon} size={24} />
            </span>
            <div style={{ flex: 1 }}>
              <Input label="Space name" placeholder="e.g. Versa Investment" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {D.spaceIcons.map((ic) => (
                <IconButton key={ic} icon={ic} label={ic} variant={icon === ic ? 'primary' : 'secondary'} onClick={() => setIcon(ic)} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Type</label>
            <SegmentedControl fullWidth value={kind} onChange={setKind} options={[
              { value: 'spend', label: 'Spending' }, { value: 'fund', label: 'Fund' }, { value: 'invest', label: 'Investment' },
            ]} />
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>You can add categories &amp; fields after creating.</span>
          </div>

          {kind === 'spend' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Input label="Monthly budget (optional)" prefix="RM" placeholder="0.00" inputMode="decimal" value={budget} onChange={(e) => setBudget(e.target.value)} />
              <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>Set a target now, or add one later from the space.</span>
            </div>
          )}
        </div>
      </Dialog>
    );
  };

  // ---- Space settings: categories + fields ---------------------------------
  window.SpaceSettingsDialog = function SpaceSettingsDialog({ open, onClose, spaceId }) {
    const base = spaceId && (spaceId === 'jc' || spaceId === 'ch' ? D.personal[spaceId] : D.space(spaceId));
    const [name, setName] = React.useState(base ? base.name : '');
    const [cats, setCats] = React.useState(base ? base.cats.slice() : []);
    const [fields, setFields] = React.useState(base ? (base.fields || []).slice() : []);
    const [newCat, setNewCat] = React.useState('');
    const [newField, setNewField] = React.useState('');

    React.useEffect(() => {
      if (!base) return;
      setName(base.name); setCats(base.cats.slice()); setFields((base.fields || []).slice());
    }, [spaceId, open]);

    if (!base) return null;
    const addCat = () => { if (!newCat.trim()) return; setCats((c) => [...c, { key: 'other', label: newCat.trim() }]); setNewCat(''); };
    const addField = () => { if (!newField.trim()) return; setFields((f) => [...f, { key: 'custom' + f.length, label: newField.trim(), type: 'text' }]); setNewField(''); };

    return (
      <Dialog open={open} onClose={onClose} title={`${base.name} · settings`} size="md"
        footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button iconStart="check" onClick={onClose}>Save</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Input label="Space name" value={name} onChange={(e) => setName(e.target.value)} />

          {/* categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Categories</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {cats.map((c, i) => (
                <Tag key={c.key + i} onRemove={() => setCats((x) => x.filter((_, j) => j !== i))}>
                  <CategoryIcon category={c.key} size={18} radius="var(--radius-xs)" style={{ marginRight: 4 }} />{c.label}
                </Tag>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}><Input placeholder="Add a category" value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCat()} /></div>
              <Button variant="soft" iconStart="plus" onClick={addCat}>Add</Button>
            </div>
          </div>

          {/* fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Extra info fields</label>
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)', marginTop: -4 }}>Shown when adding to this space. Everyday uses Store &amp; Location.</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {fields.map((f, i) => (
                <FieldRow key={f.key + i} field={f} onRemove={() => setFields((x) => x.filter((_, j) => j !== i))} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}><Input placeholder="Add a field, e.g. Warranty" value={newField} onChange={(e) => setNewField(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addField()} /></div>
              <Button variant="soft" iconStart="plus" onClick={addField}>Add</Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  };
})();
