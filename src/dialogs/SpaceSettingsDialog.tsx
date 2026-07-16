import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  CategoryIcon,
  CategoryIconPicker,
  Dialog,
  Icon,
  IconButton,
  Input,
  SegmentedControl,
  Tag,
} from '../design-system';
import type { IconName } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import { OTHER_CATEGORY } from '../domain/selectors';
import type { Category, FieldDef, Space } from '../domain/types';

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * A field row in settings: name + type, remove (non-primary), and preset-value
 * management. Adding preset values turns the field into a dropdown; removing the
 * last preset turns it back into free text. All edits persist via `onChange`.
 */
function FieldRow({
  field,
  onRemove,
  onChange,
}: {
  field: FieldDef;
  onRemove?: () => void;
  onChange: (next: FieldDef) => void;
}) {
  const [np, setNp] = useState('');
  // Two-step delete: the X arms an inline confirm rather than removing at once,
  // since removing a field also wipes its saved values from every entry.
  const [confirming, setConfirming] = useState(false);
  // Inline rename — commits on blur/Enter. Only the display label changes;
  // the field's key (which entry values are stored under) stays stable.
  const [label, setLabel] = useState(field.label);
  useEffect(() => setLabel(field.label), [field.label]);
  const commitLabel = () => {
    const next = label.trim();
    if (!next) {
      setLabel(field.label);
      return;
    }
    if (next !== field.label) onChange({ ...field, label: next });
  };
  const opts = field.options ?? [];
  const isSelect = field.type === 'select' && opts.length > 0;
  // Presets (which turn a field into a dropdown) only make sense for text/list.
  const canPreset = field.type === 'text' || field.type === 'select';
  const typeLabel =
    field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : isSelect ? 'dropdown' : 'text';

  const addOpt = () => {
    const v = np.trim();
    if (!v || opts.includes(v)) {
      setNp('');
      return;
    }
    onChange({ ...field, type: 'select', options: [...opts, v] });
    setNp('');
  };
  const removeOpt = (i: number) => {
    const next = opts.filter((_, j) => j !== i);
    if (next.length === 0) {
      onChange({ ...field, type: 'text', options: undefined });
    } else {
      onChange({ ...field, type: 'select', options: next });
    }
  };

  return (
    <div
      style={{
        padding: '10px 12px',
        background: 'var(--surface-sunken)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="tag" size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Input
            size="sm"
            aria-label={`Rename ${field.label}`}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
          />
        </div>
        {field.primary && <Badge tone="accent">title</Badge>}
        <Badge tone={isSelect ? 'accent' : 'neutral'}>{typeLabel}</Badge>
        {!field.primary && onRemove && (
          <IconButton
            icon="x"
            label="Remove field"
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(true)}
          />
        )}
      </div>
      {confirming && onRemove && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
            Remove “{field.label}”? Its saved values on existing entries will be deleted too. This
            can’t be undone.
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="danger"
              size="sm"
              iconStart="trash"
              onClick={() => {
                setConfirming(false);
                onRemove();
              }}
            >
              Remove field
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {opts.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {opts.map((o, i) => (
            <Tag key={o + i} size="sm" onRemove={() => removeOpt(i)}>
              {o}
            </Tag>
          ))}
        </div>
      )}
      {canPreset && (
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Add a preset value…"
              value={np}
              onChange={(e) => setNp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOpt()}
            />
          </div>
          <Button variant="ghost" size="sm" iconStart="plus" onClick={addOpt}>
            Preset
          </Button>
        </div>
      )}
    </div>
  );
}

export function SpaceSettingsDialog() {
  const spaceId = useAppStore((s) => s.settingsSpaceId);
  const space = useAppStore((s) => s.snapshot.spaces.find((sp) => sp.id === spaceId)) as
    | Space
    | undefined;
  const close = useAppStore((s) => s.closeSpaceSettings);
  const updateSpace = useAppStore((s) => s.updateSpace);
  const deleteField = useAppStore((s) => s.deleteField);
  const deleteCategory = useAppStore((s) => s.deleteCategory);
  const deleteSpace = useAppStore((s) => s.deleteSpace);
  const allTxs = useAppStore((s) => s.snapshot.txs);
  const showToast = useAppStore((s) => s.showToast);
  const navigate = useNavigate();

  const [section, setSection] = useState<'general' | 'categories' | 'fields'>('general');
  const [name, setName] = useState('');
  const [newCat, setNewCat] = useState('');
  const [newIcon, setNewIcon] = useState<IconName | undefined>(undefined);
  const [newField, setNewField] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldDef['type']>('text');
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Category pending deletion confirmation (its entries move to "Other").
  const [confirmCat, setConfirmCat] = useState<string | null>(null);

  useEffect(() => {
    if (space) setName(space.name);
    setSection('general');
    setNewCat('');
    setNewIcon(undefined);
    setNewField('');
    setNewFieldType('text');
    setConfirmDelete(false);
    setConfirmCat(null);
  }, [spaceId]);

  if (!spaceId || !space) return null;

  const cats = space.cats;
  const fields = space.fields;

  const commitName = () => {
    const next = name.trim();
    if (next && next !== space.name) void updateSpace(space.id, { name: next });
  };

  const addCat = () => {
    const label = newCat.trim();
    if (!label) return;
    const key = slug(label) || `cat-${cats.length}`;
    // 'other' is the reserved virtual fallback — it can't be created explicitly.
    if (key !== OTHER_CATEGORY.key && !cats.some((c) => c.key === key)) {
      const c: Category = newIcon ? { key, label, icon: newIcon } : { key, label };
      const next: Category[] = [...cats, c];
      void updateSpace(space.id, { cats: next });
    }
    setNewCat('');
    setNewIcon(undefined);
  };
  // Two-step delete: X arms confirmation; confirming moves the category's
  // entries to "Other" (see store deleteCategory).
  const confirmRemoveCat = () => {
    if (!confirmCat) return;
    void deleteCategory(space.id, confirmCat);
    setConfirmCat(null);
  };
  const confirmCatLabel = cats.find((c) => c.key === confirmCat)?.label ?? confirmCat;
  const confirmCatCount = confirmCat
    ? allTxs.filter((t) => t.spaceId === space.id && t.cat === confirmCat).length
    : 0;

  const setFieldAt = (i: number, next: FieldDef) => {
    void updateSpace(space.id, { fields: fields.map((f, j) => (j === i ? next : f)) });
  };
  const addField = () => {
    const label = newField.trim();
    if (!label) return;
    let key = slug(label) || `field-${fields.length}`;
    if (fields.some((f) => f.key === key)) key = `${key}-${fields.length}`;
    const field: FieldDef = { key, label, type: newFieldType };
    void updateSpace(space.id, { fields: [...fields, field] });
    setNewField('');
    setNewFieldType('text');
  };

  const doDelete = async () => {
    const wasName = space.name;
    close();
    await deleteSpace(space.id);
    showToast('Space deleted', wasName);
    navigate('/spaces');
  };

  const onClose = () => {
    commitName();
    close();
  };

  return (
    <Dialog
      open={Boolean(spaceId)}
      onClose={onClose}
      title={`${space.name} · settings`}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button iconStart="check" onClick={onClose}>
            Done
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <SegmentedControl
          fullWidth
          value={section}
          onChange={(v) => {
            if (v !== 'general') commitName();
            setSection(v as 'general' | 'categories' | 'fields');
          }}
          options={[
            { value: 'general', label: 'General' },
            { value: 'categories', label: 'Categories' },
            { value: 'fields', label: 'Fields' },
          ]}
        />

        {/* general */}
        {section === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Input
              label="Space name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitName}
            />

            {/* danger zone — personal ledgers belong to household members and
                can't be deleted from here. */}
            {space.kind !== 'personal' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Danger zone</label>
              {!confirmDelete ? (
                <Button variant="ghost" iconStart="trash" onClick={() => setConfirmDelete(true)} style={{ color: 'var(--danger-500)', alignSelf: 'flex-start' }}>
                  Delete space
                </Button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
                    Delete {space.name} and all its entries? This can’t be undone.
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="danger" iconStart="trash" onClick={() => void doDelete()}>
                      Delete forever
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* categories */}
        {section === 'categories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Categories</label>
            {cats.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {cats.map((c) => (
                  <Tag key={c.key} onRemove={() => setConfirmCat(c.key)}>
                    <CategoryIcon
                      category={c.key}
                      icon={c.icon}
                      size={18}
                      radius="var(--radius-xs)"
                      style={{ marginRight: 4 }}
                    />
                    {c.label}
                  </Tag>
                ))}
              </div>
            )}
            {confirmCat && (
              <div
                style={{
                  padding: '10px 12px',
                  background: 'var(--surface-sunken)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
                  Delete “{confirmCatLabel}”?{' '}
                  {confirmCatCount > 0
                    ? `${confirmCatCount} ${confirmCatCount === 1 ? 'entry' : 'entries'} will move to “Other”.`
                    : 'It has no entries.'}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="danger" size="sm" iconStart="trash" onClick={confirmRemoveCat}>
                    Delete category
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmCat(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="Add a category"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCat()}
                />
              </div>
              <Button variant="soft" iconStart="plus" onClick={addCat}>
                Add
              </Button>
            </div>
            <CategoryIconPicker value={newIcon} onChange={setNewIcon} />
          </div>
        )}

        {/* fields */}
        {section === 'fields' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>
              Extra info fields
            </label>
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)', marginTop: -4 }}>
              Shown when adding to this space. Adding preset values turns a field into a dropdown.
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {fields.map((f, i) => (
                <FieldRow
                  key={f.key + i}
                  field={f}
                  onRemove={f.primary ? undefined : () => void deleteField(space.id, f.key)}
                  onChange={(next) => setFieldAt(i, next)}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="Add a field, e.g. Warranty"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addField()}
                />
              </div>
              <Button variant="soft" iconStart="plus" onClick={addField}>
                Add
              </Button>
            </div>
            <SegmentedControl
              fullWidth
              size="sm"
              value={newFieldType}
              onChange={(v) => setNewFieldType(v as FieldDef['type'])}
              options={[
                { value: 'text', label: 'Text' },
                { value: 'select', label: 'List' },
                { value: 'date', label: 'Date' },
                { value: 'number', label: 'Number' },
              ]}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
}
