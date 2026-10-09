import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type RecoveryStatus = 'checking' | 'valid' | 'invalid';

/**
 * Tells a reset-password page whether the visitor arrived through a valid
 * recovery link. Supabase consumes the URL hash and stores a session, so we
 * check for that session (or a recovery event) rather than the raw hash.
 */
export function useRecoverySession(timeoutMs = 3000): RecoveryStatus {
  const [status, setStatus] = useState<RecoveryStatus>('checking');

  useEffect(() => {
    // Expired / already-used links come back as #error=...&error_code=otp_expired
    if (window.location.hash.includes('error=')) {
      setStatus('invalid');
      return;
    }

    let resolved = false;
    const markValid = () => {
      resolved = true;
      setStatus('valid');
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) markValid();
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) markValid();
    });

    const timer = setTimeout(() => {
      if (!resolved) setStatus('invalid');
    }, timeoutMs);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [timeoutMs]);

  return status;
}
