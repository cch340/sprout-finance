// Supabase client singleton. The app is online-first: this client is the source
// of truth for auth, data, and realtime partner sync. The publishable key is safe
// to embed; env overrides let a different project be pointed at for testing.
import { createClient } from '@supabase/supabase-js';

const env = (import.meta as ImportMeta).env as Record<string, string | undefined>;

const SUPABASE_URL = env.VITE_SUPABASE_URL ?? 'https://vvepwejxnrhtytvflhsv.supabase.co';
const SUPABASE_KEY =
  env.VITE_SUPABASE_KEY ?? 'sb_publishable_7nHiXiGdLgibdjznvqZzsg_scoeYZy0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
