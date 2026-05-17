import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStrength = (pw: string) => {
    if (!pw) return { label: '', pct: 0, color: 'bg-[#e8e3db]' };
    if (pw.length < 6) return { label: 'Too short', pct: 15, color: 'bg-red-400' };
    if (pw.length < 8) return { label: 'Weak', pct: 35, color: 'bg-orange-400' };
    const score = [/[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
    if (score === 3) return { label: 'Strong', pct: 100, color: 'bg-emerald-500' };
    if (score === 2) return { label: 'Good', pct: 75, color: 'bg-[#D5A91C]' };
    return { label: 'Fair', pct: 55, color: 'bg-yellow-400' };
  };

  const strength = getStrength(newPw);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPw.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirm) { setError('Passwords do not match.'); return; }

    setSaving(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const email = sessionData.session?.user?.email;
    if (!email) { setError('Session error. Please log in again.'); setSaving(false); return; }

    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: current });
    if (signInErr) { setError('Current password is incorrect.'); setSaving(false); return; }

    const { error: updateErr } = await supabase.auth.updateUser({ password: newPw });
    setSaving(false);
    if (updateErr) { setError(updateErr.message); return; }

    setSuccess(true);
    setCurrent(''); setNewPw(''); setConfirm('');
    setTimeout(() => setSuccess(false), 4000);
  };

  const inputCls =
    'w-full pl-0 pr-9 py-2.5 border-0 border-b border-[#ebebeb] bg-transparent text-[13px] text-[#0f0f0f] focus:outline-none focus:border-[#D5A91C] transition-colors placeholder:text-[#ccc]';
  const labelCls =
    'block text-[9px] font-semibold tracking-[0.2em] uppercase text-[#aaa] mb-1';

  const PasswordField = ({
    label,
    value,
    onChange,
    show,
    onToggle,
    placeholder,
    hint,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    placeholder: string;
    hint?: React.ReactNode;
  }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
          className={inputCls}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#ccc] hover:text-[#888] cursor-pointer transition-colors"
        >
          <i className={`${show ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
        </button>
      </div>
      {hint}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-7" style={{ fontFamily: "'Inter', sans-serif" }}>

      <PasswordField
        label="Current Password"
        value={current}
        onChange={setCurrent}
        show={showCurrent}
        onToggle={() => setShowCurrent((v) => !v)}
        placeholder="Enter your current password"
      />

      <PasswordField
        label="New Password"
        value={newPw}
        onChange={setNewPw}
        show={showNew}
        onToggle={() => setShowNew((v) => !v)}
        placeholder="Minimum 8 characters"
        hint={
          newPw.length > 0 ? (
            <div className="mt-2.5">
              <div className="h-0.5 w-full bg-[#f0ece5] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.pct}%` }}
                />
              </div>
              <p className="text-[10px] text-[#aaa] mt-1">{strength.label}</p>
            </div>
          ) : null
        }
      />

      <PasswordField
        label="Confirm New Password"
        value={confirm}
        onChange={setConfirm}
        show={showConfirm}
        onToggle={() => setShowConfirm((v) => !v)}
        placeholder="Re-enter new password"
        hint={
          confirm.length > 0 ? (
            <p
              className={`text-[10px] mt-1 ${
                newPw === confirm && newPw.length >= 8
                  ? 'text-emerald-500'
                  : 'text-red-400'
              }`}
            >
              {newPw === confirm && newPw.length >= 8
                ? 'Passwords match'
                : "Passwords don't match"}
            </p>
          ) : null
        }
      />

      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded text-[11px] text-red-500">
          <i className="ri-error-warning-line shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded text-[11px] text-emerald-600">
          <i className="ri-checkbox-circle-line" />
          Password updated successfully.
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-[#ebebeb]">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0f0f0f] hover:bg-[#222] text-white text-[12px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 tracking-wide"
        >
          {saving ? (
            <>
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              Updating…
            </>
          ) : (
            <>
              <i className="ri-shield-check-line" /> Update Password
            </>
          )}
        </button>
      </div>
    </form>
  );
}
