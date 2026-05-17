import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminChangePassword() {
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStrength = (pw: string) => {
    if (!pw) return { label: '', pct: 0, color: 'bg-stone-200' };
    if (pw.length < 6) return { label: 'Too short', pct: 15, color: 'bg-red-400' };
    if (pw.length < 8) return { label: 'Weak', pct: 35, color: 'bg-orange-400' };
    const score = [/[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
    if (score === 3) return { label: 'Strong', pct: 100, color: 'bg-emerald-500' };
    if (score === 2) return { label: 'Good', pct: 75, color: 'bg-[#D4A614]' };
    return { label: 'Fair', pct: 55, color: 'bg-yellow-400' };
  };

  const strength = getStrength(newPw);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPw.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirm) { setError('Passwords do not match.'); return; }
    setSaving(true);
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPw });
    setSaving(false);
    if (updateErr) { setError(updateErr.message); return; }
    setSuccess(true);
    setNewPw(''); setConfirm('');
    setTimeout(() => setSuccess(false), 4000);
  };

  const inputCls =
    'w-full px-3 py-2.5 border border-stone-200 rounded-lg bg-white text-sm text-stone-800 focus:outline-none focus:border-[#001731] focus:ring-1 focus:ring-[#001731]/15 transition-colors placeholder:text-stone-300';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* New Password */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
            placeholder="Enter your new password"
            className={`${inputCls} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-stone-300 hover:text-stone-600 cursor-pointer"
          >
            <i className={`${showNew ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
          </button>
        </div>
        {newPw.length > 0 && (
          <div className="mt-2">
            <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.pct}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">{strength.label}</p>
          </div>
        )}
      </div>

      {/* Confirm */}
      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="Enter your new password again"
            className={`${inputCls} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-stone-300 hover:text-stone-600 cursor-pointer"
          >
            <i className={`${showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
          </button>
        </div>
        {confirm.length > 0 && (
          <p className={`text-[10px] mt-1 ${newPw === confirm && newPw.length >= 8 ? 'text-emerald-500' : 'text-red-400'}`}>
            {newPw === confirm && newPw.length >= 8 ? 'Passwords match' : "Passwords don't match"}
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-500">
          <i className="ri-error-warning-line shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-600">
          <i className="ri-checkbox-circle-line shrink-0" />
          Password updated successfully.
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#001731] hover:bg-[#002349] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
              Updating...
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
