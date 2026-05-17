import { useState, type FormEvent, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ChangePasswordForm from './components/ChangePasswordForm';

const CURRENCIES = ['KES', 'USD', 'EUR', 'GBP', 'UGX', 'TZS', 'ZAR'];
const PACKAGES = ['Standard', 'Professional', 'Enterprise'];

const SOCIAL_FIELDS = [
  { key: 'facebook_url',  label: 'Facebook',   icon: 'ri-facebook-box-line',  placeholder: 'Enter your Facebook profile URL' },
  { key: 'twitter_url',   label: 'X (Twitter)', icon: 'ri-twitter-x-line',     placeholder: 'Enter your X (Twitter) profile URL' },
  { key: 'linkedin_url',  label: 'LinkedIn',   icon: 'ri-linkedin-box-line',   placeholder: 'Enter your LinkedIn profile URL' },
  { key: 'instagram_url', label: 'Instagram',  icon: 'ri-instagram-line',      placeholder: 'Enter your Instagram profile URL' },
  { key: 'youtube_url',   label: 'YouTube',    icon: 'ri-youtube-line',        placeholder: 'Enter your YouTube channel URL' },
  { key: 'pinterest_url', label: 'Pinterest',  icon: 'ri-pinterest-line',      placeholder: 'Enter your Pinterest profile URL' },
  { key: 'google_url',    label: 'Google',     icon: 'ri-google-line',         placeholder: 'Enter your Google URL' },
  { key: 'tiktok_url',    label: 'TikTok',     icon: 'ri-tiktok-line',         placeholder: 'Enter your TikTok profile URL' },
];

type Section = 'info' | 'social' | 'password' | 'delete';

interface FormState {
  full_name: string;
  title: string;
  phone: string;
  office_phone: string;
  whatsapp: string;
  bio: string;
  photo: string;
  service_areas: string;
  specialties: string;
  package: string;
  currency: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  youtube_url: string;
  pinterest_url: string;
  google_url: string;
  tiktok_url: string;
}

export default function AgentProfile() {
  const { profile, user, refreshProfile } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('info');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    full_name: '', title: '', phone: '', office_phone: '',
    whatsapp: '', bio: '', photo: '',
    service_areas: '', specialties: '',
    package: 'Professional', currency: 'KES',
    facebook_url: '', twitter_url: '', linkedin_url: '',
    instagram_url: '', youtube_url: '', pinterest_url: '',
    google_url: '', tiktok_url: '',
  });

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const { data } = await supabase
        .from('user_profiles').select('*').eq('id', profile.id).maybeSingle();
      if (data) {
        setForm({
          full_name:    data.full_name ?? '',
          title:        data.title ?? '',
          phone:        data.phone ?? '',
          office_phone: data.office_phone ?? '',
          whatsapp:     data.whatsapp ?? '',
          bio:          data.bio ?? '',
          photo:        data.photo ?? '',
          service_areas: data.service_areas ?? '',
          specialties:  data.specialties ?? '',
          package:      data.package ?? 'Professional',
          currency:     data.currency ?? 'KES',
          facebook_url:  data.facebook_url ?? '',
          twitter_url:   data.twitter_url ?? '',
          linkedin_url:  data.linkedin_url ?? '',
          instagram_url: data.instagram_url ?? '',
          youtube_url:   data.youtube_url ?? '',
          pinterest_url: data.pinterest_url ?? '',
          google_url:    data.google_url ?? '',
          tiktok_url:    data.tiktok_url ?? '',
        });
      }
    };
    load();
  }, [profile?.id]);

  const set = (field: keyof FormState, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handlePhotoFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `profiles/agent_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      set('photo', data.publicUrl);
    }
    setUploading(false);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaveError(null);
    const { error } = await supabase.from('user_profiles').update({
      ...form, updated_at: new Date().toISOString(),
    }).eq('id', profile?.id ?? '');
    setSaving(false);
    if (error) { setSaveError(error.message); return; }
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const displayName = form.full_name || user?.email?.split('@')[0] || 'Agent';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const email = profile?.email || user?.email || '';

  const inputCls = 'w-full px-3 py-2.5 border border-stone-200 rounded-lg bg-white text-sm text-stone-800 focus:outline-none focus:border-[#001731] focus:ring-1 focus:ring-[#001731]/15 transition-colors placeholder:text-stone-300';
  const labelCls = 'block text-[10px] font-semibold text-stone-400 mb-1.5 uppercase tracking-wider';

  const NAV: { id: Section; label: string; icon: string }[] = [
    { id: 'info',     label: 'Information',     icon: 'ri-user-3-line' },
    { id: 'social',   label: 'Social Media',    icon: 'ri-share-line' },
    { id: 'password', label: 'Change Password', icon: 'ri-shield-keyhole-line' },
    { id: 'delete',   label: 'Delete Account',  icon: 'ri-delete-bin-6-line' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div className="bg-[#020101] h-10 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <i className="ri-layout-left-2-line text-white/40 text-sm" />
          <a href="/" target="_blank" className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors cursor-pointer">
            <i className="ri-external-link-line text-xs" /> Visit Site
          </a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-[#001731] flex items-center justify-center">
            {form.photo
              ? <img src={form.photo} alt={displayName} className="w-full h-full object-cover" />
              : <span className="text-white text-[10px] font-semibold">{initials}</span>
            }
          </div>
          <span className="text-white/70 text-xs hidden sm:inline">{displayName}</span>
          <i className="ri-arrow-down-s-line text-white/40 text-sm" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-40px)]">
        {/* ── Left sidebar ── */}
        <div className="w-full lg:w-[320px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-stone-100 flex flex-col">
          {/* Breadcrumb */}
          <div className="px-4 lg:px-6 pt-4 lg:pt-5 pb-3 lg:pb-4 border-b border-stone-100">
            <p className="text-[10px] text-stone-400 font-medium">
              author &rsaquo; <span className="text-[#001731]">My Profile</span>
            </p>
          </div>

          {/* Photo area */}
          <div className="flex flex-col items-center px-4 lg:px-6 py-5 lg:py-8 border-b border-stone-100">
            <div
              className="relative group cursor-pointer mb-3 lg:mb-4"
              onClick={() => fileRef.current?.click()}
            >
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white ring-2 ring-stone-100 bg-[#f5f5f5] flex items-center justify-center">
                {form.photo
                  ? <img src={form.photo} alt={displayName} className="w-full h-full object-cover" />
                  : <span className="text-3xl lg:text-4xl font-light text-stone-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{initials}</span>
                }
              </div>
              <div className="absolute inset-0 rounded-full bg-[#001731]/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><i className="ri-camera-line text-white text-lg" /><span className="text-white text-[9px] mt-0.5">Change</span></>
                }
              </div>
              {form.photo && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); set('photo', ''); }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-[10px]" />
                </button>
              )}
            </div>

            <p className="text-sm font-semibold text-stone-800 mb-2">{displayName}</p>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full py-2 border-2 border-[#001731] text-[#001731] text-xs font-semibold rounded-lg hover:bg-[#001731] hover:text-white transition-colors cursor-pointer whitespace-nowrap mb-2"
            >
              {uploading ? 'Uploading...' : 'Update Profile Picture'}
            </button>
            <p className="text-[10px] text-stone-400">Minimum size 300 x 300 px</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handlePhotoFile(e.target.files[0]); }} />
          </div>

          {/* Contact info */}
          <div className="px-4 lg:px-6 py-4 lg:py-5 border-b border-stone-100">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 lg:mb-3">Contact Information</p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <i className="ri-mail-line text-stone-300 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          </div>

          {/* Nav sections — horizontal scroll on mobile, vertical on desktop */}
          <div className="px-4 lg:px-6 py-4 lg:py-5 flex-1">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 lg:mb-3">Settings</p>
            {/* Mobile: horizontal scrollable tabs */}
            <div className="flex lg:hidden gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setActiveSection(n.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeSection === n.id
                      ? n.id === 'delete'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-[#001731] text-white'
                      : n.id === 'delete'
                      ? 'text-red-400 bg-red-50/50'
                      : 'text-stone-500 bg-stone-100'
                  }`}
                >
                  <i className={`${n.icon} text-xs`} />
                  {n.label}
                </button>
              ))}
            </div>
            {/* Desktop: vertical nav */}
            <nav className="hidden lg:flex flex-col space-y-0.5">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setActiveSection(n.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer text-left whitespace-nowrap ${
                    activeSection === n.id
                      ? n.id === 'delete'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-[#001731] text-white'
                      : n.id === 'delete'
                      ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                      : 'text-stone-500 hover:bg-[#f5f5f5] hover:text-stone-800'
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">
                    <i className={`${n.icon} text-sm`} />
                  </span>
                  {n.label}
                  {activeSection === n.id && n.id !== 'delete' && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4A614] shrink-0" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Right content ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[680px]">

            {/* INFORMATION */}
            {activeSection === 'info' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-stone-800 mb-0.5">Information</h2>
                  <p className="text-xs text-stone-400">Manage your personal and contact details</p>
                </div>

                <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-5">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Personal Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input type="text" value={form.full_name.split(' ')[0] ?? ''}
                        onChange={(e) => { const p = form.full_name.split(' '); p[0] = e.target.value; set('full_name', p.join(' ').trim()); }}
                        placeholder="Enter your first name" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input type="text" value={form.full_name.split(' ').slice(1).join(' ')}
                        onChange={(e) => set('full_name', `${form.full_name.split(' ')[0] ?? ''} ${e.target.value}`.trim())}
                        placeholder="Enter your last name" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Title / Position</label>
                      <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
                        placeholder="Enter your job position" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Mobile Number</label>
                      <div className="relative">
                        <i className="ri-smartphone-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm" />
                        <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
                          placeholder="Enter your mobile number" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Office Number</label>
                      <div className="relative">
                        <i className="ri-phone-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm" />
                        <input type="tel" value={form.office_phone} onChange={(e) => set('office_phone', e.target.value)}
                          placeholder="Enter your phone number" className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Service Areas</label>
                      <input type="text" value={form.service_areas} onChange={(e) => set('service_areas', e.target.value)}
                        placeholder="Enter your service areas" className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Specialties</label>
                      <input type="text" value={form.specialties} onChange={(e) => set('specialties', e.target.value)}
                        placeholder="Enter your specialties" className={inputCls} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Preferences</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Allow Agents to Use Package</label>
                      <div className="relative">
                        <select value={form.package} onChange={(e) => set('package', e.target.value)}
                          className={`${inputCls} pr-8 appearance-none cursor-pointer`}>
                          <option value="">Choose</option>
                          {PACKAGES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Choose Currency</label>
                      <div className="relative">
                        <select value={form.currency} onChange={(e) => set('currency', e.target.value)}
                          className={`${inputCls} pr-8 appearance-none cursor-pointer`}>
                          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save bar */}
                <div className="flex items-center justify-between gap-4 bg-white border border-stone-100 rounded-xl px-5 py-3.5">
                  <div>
                    {saveError && <p className="text-xs text-red-500 flex items-center gap-1"><i className="ri-error-warning-line" />{saveError}</p>}
                    {saved && <p className="text-xs text-emerald-600 flex items-center gap-1"><i className="ri-checkbox-circle-line" /> Saved successfully.</p>}
                  </div>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#001731] hover:bg-[#002349] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50">
                    {saving ? <><div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><i className="ri-save-line" /> Save Changes</>}
                  </button>
                </div>
              </form>
            )}

            {/* SOCIAL MEDIA */}
            {activeSection === 'social' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-stone-800 mb-0.5">Social Media</h2>
                  <p className="text-xs text-stone-400">Add your social profiles to display on your agent card</p>
                </div>
                <div className="bg-white rounded-xl border border-stone-100 p-6 space-y-4">
                  {SOCIAL_FIELDS.map((f) => (
                    <div key={f.key}>
                      <label className={labelCls}>{f.label}</label>
                      <div className="relative">
                        <i className={`${f.icon} absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm`} />
                        <input type="url" value={(form as Record<string, string>)[f.key]}
                          onChange={(e) => set(f.key as keyof FormState, e.target.value)}
                          placeholder={f.placeholder} className={`${inputCls} pl-9`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4 bg-white border border-stone-100 rounded-xl px-5 py-3.5">
                  <div>
                    {saved && <p className="text-xs text-emerald-600 flex items-center gap-1"><i className="ri-checkbox-circle-line" /> Saved.</p>}
                  </div>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#001731] hover:bg-[#002349] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50">
                    {saving ? <><div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><i className="ri-save-line" /> Save Social Links</>}
                  </button>
                </div>
              </form>
            )}

            {/* CHANGE PASSWORD */}
            {activeSection === 'password' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-stone-800 mb-0.5">Change Password</h2>
                  <p className="text-xs text-stone-400">Update your login password. Use at least 8 characters.</p>
                </div>
                <div className="bg-white rounded-xl border border-stone-100 p-6">
                  <ChangePasswordForm />
                </div>
              </div>
            )}

            {/* DELETE ACCOUNT */}
            {activeSection === 'delete' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-red-600 mb-0.5">Delete Account</h2>
                  <p className="text-xs text-stone-400">Permanently remove your account and all associated data</p>
                </div>
                <div className="bg-white rounded-xl border border-red-100 p-6">
                  <div className="bg-red-50 rounded-lg p-4 mb-5 space-y-2">
                    {['All personal profile data will be erased', 'You will lose dashboard access immediately', 'All listings created remain but become unassigned', 'This cannot be reversed — no recovery option'].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                        <i className="ri-close-circle-line shrink-0 mt-0.5" />{item}
                      </div>
                    ))}
                  </div>
                  {!showDeleteConfirm ? (
                    <button type="button" onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                      <i className="ri-delete-bin-6-line" /> Delete Account
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-stone-600">Type <strong>DELETE</strong> to confirm:</p>
                      <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="Type DELETE here"
                        className="w-full px-3 py-2.5 border border-red-200 rounded-lg text-sm focus:outline-none focus:border-red-400" />
                      <div className="flex items-center gap-3">
                        <button type="button" disabled={deleteInput !== 'DELETE'}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-40 hover:bg-red-700">
                          <i className="ri-delete-bin-6-line" /> Confirm Delete
                        </button>
                        <button type="button" onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                          className="px-5 py-2.5 bg-stone-100 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-200 cursor-pointer whitespace-nowrap">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
