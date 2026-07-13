// The app is now online-first: the repository is implemented against Supabase in
// `remote-repo.ts`. This module is kept as the stable import path (`data/repo`)
// the store and dialogs already use, re-exporting the cloud implementation. The
// old Dexie-backed local repository was removed (Dexie is now only a boot cache;
// see `db.ts`).
export * from './remote-repo';
