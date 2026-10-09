import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string;

// A password-recovery link that lands on any page other than a reset page (e.g. the
// site root when Supabase falls back to its Site URL) would be consumed by the client
// below and silently sign the user in. Move it to the set-password page first, keeping
// the token hash, so the user is asked for a new password instead.
if (
  typeof window !== 'undefined' &&
  window.location.hash.includes('type=recovery') &&
  !window.location.pathname.includes('reset-password')
) {
  const base = __BASE_PATH__.replace(/\/$/, '');
  window.history.replaceState(null, '', `${base}/admin/reset-password${window.location.hash}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
