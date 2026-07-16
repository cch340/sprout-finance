import type { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Amount, Avatar, Button, Card, Icon, ListRow } from '../design-system';
import type { IconName, ListRowProps } from '../design-system';
import { useAppStore } from '../store/useAppStore';
import type { Space } from '../domain/types';
import {
  entryCount,
  fundBalance,
  incomeOf,
  spentOf,
  spentOfPersonal,
} from '../domain/selectors';
import { monthLabel } from '../domain/format';
import { useIsDesktop } from '../shell/useIsDesktop';

const SAGE: CSSProperties = { color: 'var(--sage-700)' };

/**
 * A ListRow that can be dragged to reorder within its group. The drag grip is a
 * dedicated handle so the row body stays tappable for navigation; the row moves
 * only when the handle is dragged (mouse) or long-pressed (touch).
 */
function SortableSpaceRow({ id, leading, ...row }: ListRowProps & { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 1 : undefined,
    opacity: isDragging ? 0.7 : 1,
    background: isDragging ? 'var(--surface-hover)' : undefined,
    borderRadius: 'var(--radius-md)',
  };
  const grip = (
    <button
      type="button"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        margin: '-4px 0',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-subtle)',
        cursor: 'grab',
        touchAction: 'none',
        flexShrink: 0,
      }}
    >
      <Icon name="grip-vertical" size={18} />
    </button>
  );
  return (
    <div ref={setNodeRef} style={style}>
      <ListRow
        {...row}
        leading={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {grip}
            {leading}
          </span>
        }
      />
    </div>
  );
}

/** A Card whose child rows can be reordered via drag-and-drop. */
function DraggableCard({
  ids,
  onReorder,
  children,
}: {
  ids: string[];
  onReorder: (ids: string[]) => void;
  children: ReactNode;
}) {
  // Mouse: a small drag distance activates immediately. Touch: a short press-and-
  // hold (long-press) activates, so ordinary vertical swipes still scroll the list.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    onReorder(arrayMove(ids, from, to));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <Card padding="sm">{children}</Card>
      </SortableContext>
    </DndContext>
  );
}

function tile(icon: IconName) {
  return (
    <span
      style={{
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent-soft)',
        color: 'var(--accent-soft-fg)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={20} />
    </span>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-bold)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: 'var(--text-subtle)',
        margin: '0 4px 8px',
      }}
    >
      {children}
    </div>
  );
}

function SubLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        font: 'var(--font-caption)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-subtle)',
        margin: '0 4px 6px',
      }}
    >
      {children}
    </div>
  );
}

function budgetMeta(space: Space, spent: number) {
  const budget = space.budget ?? 0;
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = budget > 0 && spent > budget;
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
      <span style={{ whiteSpace: 'nowrap', color: over ? 'var(--money-over)' : 'var(--text-muted)' }}>
        {budget > 0 ? Math.round((spent / budget) * 100) : 0}% of RM {budget.toLocaleString()}
      </span>
      <span
        style={{
          width: 68,
          height: 4,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--neutral-200)',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        <span
          style={{
            display: 'block',
            height: '100%',
            width: `${pct}%`,
            borderRadius: 'var(--radius-pill)',
            background: over ? 'var(--money-over)' : 'var(--sage-400)',
          }}
        />
      </span>
    </span>
  );
}

function SpacesBody() {
  const navigate = useNavigate();
  const snapshot = useAppStore((s) => s.snapshot);
  const month = useAppStore((s) => s.month);
  const reorderSpaces = useAppStore((s) => s.reorderSpaces);
  const { spaces, txs } = snapshot;

  const shared = spaces
    .filter((s) => s.group === 'shared')
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const personal = spaces
    .filter((s) => s.kind === 'personal')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Group shared spaces by kind so each group's amounts mean one thing
  // (spent vs balance vs value). Empty groups don't render; the sub-labels
  // only appear once there is more than one group to tell apart.
  const sharedGroups = [
    { label: 'Spending', list: shared.filter((s) => s.kind !== 'fund' && s.kind !== 'invest') },
    { label: 'Funds & savings', list: shared.filter((s) => s.kind === 'fund') },
    { label: 'Investments', list: shared.filter((s) => s.kind === 'invest') },
  ].filter((g) => g.list.length > 0);
  const showSubLabels = sharedGroups.length > 1;

  const sharedRow = (s: Space, i: number, len: number) => {
    const spent = spentOf(s, txs, month);
    const value =
      s.kind === 'fund' ? fundBalance(s, txs) : s.kind === 'invest' ? s.value ?? 0 : spent;
    const isBalance = s.kind === 'fund' || s.kind === 'invest';
    const meta =
      s.kind === 'spend' && s.budget
        ? budgetMeta(s, spent)
        : s.kind === 'fund'
          ? 'balance'
          : s.kind === 'invest'
            ? 'value'
            : 'this month';
    return (
      <SortableSpaceRow
        key={s.id}
        id={s.id}
        leading={tile(s.icon as IconName)}
        title={s.name}
        subtitle={s.sub ?? `${entryCount(s.id, txs, month)} entries`}
        trailing={<Amount value={value} style={isBalance ? SAGE : undefined} />}
        meta={meta}
        chevron
        onClick={() => navigate(`/spaces/${s.id}`)}
        divider={i < len - 1}
      />
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <GroupLabel>Shared</GroupLabel>
        {sharedGroups.length === 0 && (
          <Card padding="sm">
            <ListRow title="No shared spaces yet" subtitle="Create one to start tracking" />
          </Card>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {sharedGroups.map((g) => (
            <div key={g.label}>
              {showSubLabels && <SubLabel>{g.label}</SubLabel>}
              <DraggableCard ids={g.list.map((s) => s.id)} onReorder={reorderSpaces}>
                {g.list.map((s, i) => sharedRow(s, i, g.list.length))}
              </DraggableCard>
            </div>
          ))}
        </div>
      </div>

      <div>
        <GroupLabel>Personal</GroupLabel>
        {personal.length === 0 ? (
          <Card padding="sm">
            <ListRow title="No personal spaces yet" subtitle="Add people during onboarding" />
          </Card>
        ) : (
          <DraggableCard ids={personal.map((p) => p.id)} onReorder={reorderSpaces}>
            {personal.map((p, i) => (
              <SortableSpaceRow
                key={p.id}
                id={p.id}
                leading={<Avatar name={p.name} size={40} />}
                title={`${p.name} · Personal`}
                subtitle={`Income RM ${incomeOf(p.id, txs, month).toLocaleString()}`}
                trailing={<Amount value={spentOfPersonal(p.id, txs, month)} />}
                meta="spent"
                chevron
                onClick={() => navigate(`/personal/${p.id}`)}
                divider={i < personal.length - 1}
              />
            ))}
          </DraggableCard>
        )}
      </div>
    </div>
  );
}

export function Spaces() {
  const isDesktop = useIsDesktop();
  const month = useAppStore((s) => s.month);
  const openNewSpace = useAppStore((s) => s.openNewSpace);

  if (isDesktop) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
          <Button variant="soft" size="sm" iconStart="plus" onClick={openNewSpace}>
            New space
          </Button>
        </div>
        <SpacesBody />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ font: 'var(--font-caption)', color: 'var(--text-muted)' }}>
            {monthLabel(month)}
          </div>
          <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: '2px 0 0' }}>
            Spaces
          </h1>
        </div>
        <Button variant="soft" size="sm" iconStart="plus" onClick={openNewSpace}>
          New space
        </Button>
      </div>
      <SpacesBody />
    </div>
  );
}
