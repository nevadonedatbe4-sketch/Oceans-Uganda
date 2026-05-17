import { useState, type FormEvent } from 'react';

interface Props {
  onClose: () => void;
  onInvited: () => void;
}

const EDGE_FN = 'https://iisgbnbwbmxrdvhmolee.supabase.co/functions/v1/create-admin-user';

export default function InviteModal({ onClose, onInvited }: Props) {
  const [form, setForm] = useState({ email: '', full_name: '', role: 'agent', title: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [withPassword, setWithPassword] = useState(false);

  const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, string> = {
        action: 'create-user',
        email: form.email,
        full_name: form.full_name,
        role: form.role,
      };
      if (withPassword && form.password) {
        payload.password = form.password;
      }

      const res = await fetch(EDGE_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? 'Failed to create user. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => { onInvited(); onClose(); }, 1800);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 border border-[#e8e2d9] rounded-md text-sm font-roboto text-[#0d1f2d] bg-white focus:outline-none focus:border-[#D5A91C] focus:ring-1 focus:ring-[#D5A91C]/30 transition-colors placeholder:text-[#bbb]";
  const labelClass = "block text-[11px] font-roboto font-semibold text-[#0d1f2d]/55 mb-1.5 uppercase tracking-widest";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg w-full max-w-[440px] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e2d9]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#0d1f2d]/8">
              <i className="ri-mail-send-line text-[#0d1f2d] text-sm" />
            </div>
            <p className="text-[#0d1f2d] font-roboto font-semibold text-sm">Invite Team Member</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f7f5f0] text-[#a0a0a0] hover:text-[#0d1f2d] transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-base" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-100 mx-auto mb-4">
              <i className="ri-checkbox-circle-line text-emerald-600 text-2xl" />
            </div>
            <p className="text-[#0d1f2d] font-roboto font-semibold mb-1">
              {withPassword && form.password ? 'Account created!' : 'Invite sent!'}
            </p>
            <p className="text-[#a0a0a0] text-sm font-roboto">
              {withPassword && form.password
                ? `${form.email} can now sign in with the provided password.`
                : `${form.email} will receive an email to join Oceans Uganda.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
                placeholder="team@oceansuganda.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => set('full_name', e.target.value)}
                required
                placeholder="First and last name"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Role</label>
                <select value={form.role} onChange={(e) => set('role', e.target.value)} className={`${inputClass} appearance-none`}>
                  <option value="agent">Agent</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Sales Agent"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Set password toggle */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setWithPassword((v) => !v)}
                className={`w-9 h-5 rounded-full transition-colors cursor-pointer relative ${withPassword ? 'bg-[#0d1f2d]' : 'bg-[#e8e2d9]'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${withPassword ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
              <span className="text-xs font-roboto text-[#7a7a7a]">Set password now (skip invite email)</span>
            </div>

            {withPassword && (
              <div>
                <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    required={withPassword}
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-[#0d1f2d] cursor-pointer"
                  >
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </button>
                </div>
              </div>
            )}

            {/* Role description */}
            <div className="bg-[#f7f5f0] rounded-md p-3 text-xs font-roboto text-[#7a7a7a]">
              {form.role === 'super_admin' && <><strong className="text-[#0d1f2d]">Super Admin:</strong> Full access to all settings, users, and content.</>}
              {form.role === 'admin' && <><strong className="text-[#0d1f2d]">Admin:</strong> All content + most settings. Cannot delete system config.</>}
              {form.role === 'editor' && <><strong className="text-[#0d1f2d]">Editor:</strong> Manage listings, blog, and content. No system settings access.</>}
              {form.role === 'agent' && <><strong className="text-[#0d1f2d]">Agent:</strong> Personal agent dashboard — own listings and leads only.</>}
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-md">
                <i className="ri-error-warning-line text-red-500 text-sm shrink-0 mt-0.5" />
                <p className="text-red-600 text-xs font-roboto">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-[#e8e2d9] text-[#0d1f2d] text-sm font-roboto rounded-md hover:bg-[#f7f5f0] transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-2.5 bg-[#0d1f2d] hover:bg-[#1a3347] text-white text-sm font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><i className="ri-loader-4-line animate-spin" /> Creating...</>
                ) : withPassword && form.password ? (
                  <><i className="ri-user-add-line" /> Create Account</>
                ) : (
                  <><i className="ri-mail-send-line" /> Send Invite</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
