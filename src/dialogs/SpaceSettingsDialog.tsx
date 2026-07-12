import { useEffect, useState } from 'react';
import { Button, Dialog, Input } from '../design-system';
import { useAppStore } from '../store/useAppStore';

/**
 * Space settings — rename a space (persists via the store). The fuller field /
 * category / preset editor lands in a later phase; categories are already
 * editable inline on the Space detail Activity tab.
 */
export function SpaceSettingsDialog() {
  const spaceId = useAppStore((s) => s.settingsSpaceId);
  const space = useAppStore((s) => s.snapshot.spaces.find((sp) => sp.id === spaceId));
  const close = useAppStore((s) => s.closeSpaceSettings);
  const updateSpace = useAppStore((s) => s.updateSpace);
  const [name, setName] = useState('');

  useEffect(() => {
    if (space) setName(space.name);
  }, [space]);

  if (!spaceId || !space) return null;

  const save = () => {
    const next = name.trim();
    if (next && next !== space.name) void updateSpace(space.id, { name: next });
    close();
  };

  return (
    <Dialog
      open={Boolean(spaceId)}
      onClose={close}
      title="Space settings"
      description={`Manage ${space.name}.`}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button iconStart="check" onClick={save} disabled={!name.trim()}>
            Save
          </Button>
        </>
      }
    >
      <Input
        label="Space name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
    </Dialog>
  );
}
