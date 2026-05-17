import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import {
  type UserProfile,
  ROLE_LABELS,
  ROLE_COLORS,
  STATUS_COLORS,
  STATUS_ICONS,
  type UserRole,
} from '../types';

interface Props {
  user: UserProfile;
  onClose: () => void;
  onUpdated: (u: UserProfile) => void;
}

export default function UserDetailDrawer({ user, onClose, onUpdated }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: user.full_name,
    title: user.title ?? '',
    phone: user.phone ?? '',
    role: user.role as UserRole,
    status: user.status,
    bio: user.bio ?? '',
  });

  const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('user_profiles')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .maybeSingle();
    setSaving(false);
    if (err) { setError(err.message); return; }
    if (data) onUpdated(data as UserProfile);
    onClose();
  };

  const quickStatus = async (status: UserProfile['status']) => {
    setSaving(true);
    const { data, error: err } = await supabase
      .from('user_profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .maybeSingle();
    setSaving(false);
    if (!err && data) onUpdated(data as UserProfile);
    if (!err) onClose();
    else setError(err.message);
  };

  const inputClass = "w-full px-3.5 py-2.5 border border-[#e8e2d9] rounded-md text-sm font-roboto text-[#0d1f2d] bg-white focus:outline-none focus:border-[#D5A91C] focus:ring-1 focus:ring-[#D5A91C]/30 transition-colors";
  const labelClass = "block text-[11px] font-roboto font-semibold text-[#0d1f2d]/55 mb-1.5 uppercase tracking-widest";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[420px] max-w-full bg-white z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e2d9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0d1f2d]/10 flex items-center justify-center shrink-0">
              {user.photo ? (
                <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-[#0d1f2d] font-roboto font-semibold text-sm">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-[#0d1f2d] font-roboto font-semibold text-sm">{user.full_name}</p>
              <p className="text-[#a0a0a0] text-xs font-roboto">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f7f5f0] text-[#a0a0a0] hover:text-[#0d1f2d] transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-base" />
          </button>
        </div>

        {/* Status quick actions */}
        <div className="px-6 py-3 bg-[#f7f5f0] border-b border-[#e8e2d9] flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-roboto font-medium ${STATUS_COLORS[user.status]}`}>
            <i className={`${STATUS_ICONS[user.status]} text-xs`} />
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {user.status !== 'active' && (
              <button
                onClick={() => quickStatus('active')}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <i className="ri-checkbox-circle-line" />
                Approve
              </button>
            )}
            {user.status !== 'suspended' && (
              <button
                onClick={() => quickStatus('suspended')}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <i className="ri-forbid-2-line" />
                Suspend
              </button>
            )}
            {user.status === 'suspended' && (
              <button
                onClick={() => quickStatus('pending')}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <i className="ri-restart-line" />
                Set Pending
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Full Name</label>
              <input type="text" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} className={inputClass} />
            </div>
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
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={`${inputClass} appearance-none`}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Title / Position</label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Sales Agent" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+256 700 000 000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+256 700 000 000" className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => set('bio', e.target.value)}
                rows={3}
                maxLength={500}
                className={`${inputClass} resize-none`}
                placeholder="Short bio..."
              />
            </div>
          </div>

          {/* Role badge preview */}
          <div className="bg-[#f7f5f0] rounded-md p-3">
            <p className="text-[11px] font-roboto text-[#a0a0a0] mb-2 uppercase tracking-widest font-semibold">Role Access</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-roboto font-medium ${ROLE_COLORS[form.role as UserRole]}`}>
                {ROLE_LABELS[form.role as UserRole]}
              </span>
              {form.role === 'super_admin' && <span className="text-xs text-[#a0a0a0] font-roboto">Full system access</span>}
              {form.role === 'admin' && <span className="text-xs text-[#a0a0a0] font-roboto">All content + settings</span>}
              {form.role === 'editor' && <span className="text-xs text-[#a0a0a0] font-roboto">Content only, no settings</span>}
              {form.role === 'agent' && <span className="text-xs text-[#a0a0a0] font-roboto">Own listings & leads only</span>}
            </div>
          </div>

          {/* Joined info */}
          <div className="text-xs font-roboto text-[#a0a0a0] pt-1 border-t border-[#e8e2d9]">
            <p>Joined: {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            {user.updated_at && <p>Last updated: {new Date(user.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-md">
              <i className="ri-error-warning-line text-red-500 text-sm" />
              <p className="text-red-600 text-xs font-roboto">{error}</p>
            </div>
          )}
        </form>

        {/* Footer actions */}
        <div className="border-t border-[#e8e2d9] px-6 py-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#e8e2d9] text-[#0d1f2d] text-sm font-roboto rounded-md hover:bg-[#f7f5f0] transition-colors cursor-pointer whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            form=""
            onClick={handleSave}
            disabled={saving}
            className="flex-[2] py-2.5 bg-[#0d1f2d] hover:bg-[#1a3347] text-white text-sm font-roboto font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><i className="ri-loader-4-line animate-spin" /> Saving...</>
            ) : (
              <><i className="ri-save-line" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
