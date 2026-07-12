import { Button, Dialog } from '../design-system';
import { useAppStore } from '../store/useAppStore';

/**
 * Placeholder Add-entry dialog. The full multi-step entry flow lands in Phase 5;
 * for now this keeps the FAB / "Add entry" wiring functional without crashing.
 */
export function AddEntryDialog() {
  const open = useAppStore((s) => s.addEntryOpen);
  const close = useAppStore((s) => s.closeAddEntry);
  return (
    <Dialog
      open={open}
      onClose={close}
      title="Add entry"
      description="The full entry flow arrives in Phase 5."
      footer={<Button onClick={close}>Got it</Button>}
    >
      <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 0 }}>
        Add entry — coming in Phase 5. You'll pick a space, amount, category and payer here.
      </p>
    </Dialog>
  );
}
