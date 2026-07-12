import { Button, Dialog } from '../design-system';
import { useAppStore } from '../store/useAppStore';

/** Placeholder New-space dialog (full builder in a later phase). */
export function NewSpaceDialog() {
  const open = useAppStore((s) => s.newSpaceOpen);
  const close = useAppStore((s) => s.closeNewSpace);
  return (
    <Dialog
      open={open}
      onClose={close}
      title="New space"
      description="Create a new ledger for a category of money."
      footer={<Button onClick={close}>Got it</Button>}
    >
      <p style={{ font: 'var(--font-body)', color: 'var(--text-muted)', margin: 0 }}>
        New space — coming in a later phase.
      </p>
    </Dialog>
  );
}
