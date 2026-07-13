import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  Icon,
  IconButton,
  Input,
  SegmentedControl,
} from '../design-system';
import type { IconName } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import { newId } from '../data/repo';
import type { FieldDef, SpaceKind } from '../domain/types';

/** Icon set offered when creating a space (mirrors the prototype's spaceIcons). */
const SPACE_ICONS: IconName[] = [
  'receipt', 'home', 'repeat', 'trending-up', 'wallet',
  'target', 'pie-chart', 'banknote', 'credit-card', 'tag',
];

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Primary-field label sensible for each space kind. */
function primaryLabel(kind: SpaceKind): string {
  if (kind === 'fund') return 'Description';
  if (kind === 'invest') return 'Item';
  return 'Store / Vendor';
}

export function NewSpaceDialog() {
  const open = useAppStore((s) => s.newSpaceOpen);
  const close = useAppStore((s) => s.closeNewSpace);
  const addSpace = useAppStore((s) => s.addSpace);
  const showToast = useAppStore((s) => s.showToast);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<IconName>('wallet');
  const [kind, setKind] = useState<SpaceKind>('spend');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    if (!open) return;
    setName('');
    setIcon('wallet');
    setKind('spend');
    setBudget('');
  }, [open]);

  const create = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const field: FieldDef = {
      key: 'vendor',
      label: primaryLabel(kind),
      type: 'text',
      primary: true,
    };
    const budgetNum = kind === 'spend' ? parseFloat(budget) || undefined : undefined;
    const space = await addSpace({
      id: `${slug(trimmed) || 'space'}-${newId().slice(-4)}`,
      name: trimmed,
      group: 'shared',
      icon,
      kind,
      cats: [{ key: 'other', label: 'Other' }],
      fields: [field],
      ...(budgetNum ? { budget: budgetNum } : {}),
      ...(kind === 'fund' ? { baseBalance: 0 } : {}),
      ...(kind === 'invest' ? { value: 0 } : {}),
    });
    close();
    showToast('Space created', trimmed);
    navigate(`/spaces/${space.id}`);
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="New space"
      description="Spaces keep money separate — e.g. another investment, a renovation, a trip."
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button iconStart="plus" onClick={() => void create()} disabled={!name.trim()}>
            Create space
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)' }}>
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-soft)',
              color: 'var(--accent-soft-fg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name={icon} size={24} />
          </span>
          <div style={{ flex: 1 }}>
            <Input
              label="Space name"
              placeholder="e.g. Versa Investment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Icon</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SPACE_ICONS.map((ic) => (
              <IconButton
                key={ic}
                icon={ic}
                label={ic}
                variant={icon === ic ? 'primary' : 'secondary'}
                onClick={() => setIcon(ic)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ font: 'var(--font-label)', color: 'var(--text-body)' }}>Type</label>
          <SegmentedControl
            fullWidth
            value={kind}
            onChange={(v) => setKind(v as SpaceKind)}
            options={[
              { value: 'spend', label: 'Spending' },
              { value: 'fund', label: 'Fund' },
              { value: 'invest', label: 'Investment' },
            ]}
          />
          <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
            You can add categories &amp; fields after creating.
          </span>
        </div>

        {kind === 'spend' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Input
              label="Monthly budget (optional)"
              prefix="RM"
              placeholder="0.00"
              inputMode="decimal"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <span style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
              Set a target now, or add one later from the space.
            </span>
          </div>
        )}
      </div>
    </Dialog>
  );
}
