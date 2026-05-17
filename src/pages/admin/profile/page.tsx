import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import AdminProfilePhotoUploader from './components/ProfilePhotoUploader';
import AdminChangePassword from './components/AdminChangePassword';

type Tab = 'info' | 'social' | 'security' | 'danger';

const CURRENCIES = ['KES', 'USD', 'EUR', 'GBP', 'UGX', 'TZS', 'ZAR', 'NGN', 'GHS'];
const PACKAGES = ['Standard', 'Professional', 'Enterprise'];

const inputCls =
  'w-full px-3 py-2.5 border border-stone-200 rounded-lg bg-white text-sm text-stone-800 focus:outline-none focus:border-[#001731] focus:ring-1 focus:ring-[#001731]/15 transition-colors placeholder:text-stone-300 text-sm';

const labelCls = 'block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide';

interface AdminProfile {
  full_name: string;
  email: string;
  title: string;
  phone: string;
  office_phone: string;
  service_areas: string;
  specialties: string;
  photo: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  youtube_url: string;
  pinterest_url: string;
  google_url: string;
  tiktok_url: string;
  package: string;
  currency: string;
}

const SOCIAL_FIELDS: { key: keyof AdminProfile; label: string; icon: string; placeholder: string }[] = [
  { key: 'facebook_url', label: 'Facebook', icon: 'ri-facebook-box-line', placeholder: 'https://facebook.com/yourpage' },
  { key: 'twitter_url', label: 'X (Twitter)', icon: 'ri-twitter-x-line', placeholder: 'https://x.com/yourhandle' },
  { key: 'linkedin_url', label: 'LinkedIn', icon: 'ri-linkedin-box-line', placeholder: 'https://linkedin.com/in/yourprofile' },
  { key: 'instagram_url', label: 'Instagram', icon: 'ri-instagram-line', placeholder: 'https://instagram.com/yourhandle' },
  { key: 'youtube_url', label: 'YouTube', icon: 'ri-youtube-line', placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'pinterest_url', label: 'Pinterest', icon: 'ri-pinterest-line', placeholder: 'https://pinterest.com/yourprofile' },
  { key: 'google_url', label: 'Google', icon: 'ri-google-line', placeholder: 'https://google.com/...' },
  { key: 'tiktok_url', label: 'TikTok', icon: 'ri-tiktok-line', placeholder: 'https://tiktok.com/@yourhandle' },
];

export default function AdminProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('info');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [form, setForm] = useState<AdminProfile>({
    full_name: '',
    email: '',
    title: '',
    phone: '',
    office_phone: '',
    service_areas: '',
    specialties: '',
    photo: '',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
    youtube_url: '',
    pinterest_url: '',
    google_url: '',
    tiktok_url: '',
    package: 'Professional',
    currency: 'KES',
  });

  useEffect(() => {
    if (!profile) return;
    const fetchExtra = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle();
      if (data) {
        setForm({
          full_name: data.full_name ?? '',
          email: data.email ?? user?.email ?? '',
          title: data.title ?? '',
          phone: data.phone ?? '',
          office_phone: data.office_phone ?? '',
          service_areas: data.service_areas ?? '',
          specialties: data.specialties ?? '',
          photo: data.photo ?? '',
          facebook_url: data.facebook_url ?? '',
          twitter_url: data.twitter_url ?? '',
          linkedin_url: data.linkedin_url ?? '',
          instagram_url: data.instagram_url ?? '',
          youtube_url: data.youtube_url ?? '',
          pinterest_url: data.pinterest_url ?? '',
          google_url: data.google_url ?? '',
          tiktok_url: data.tiktok_url ?? '',
          package: data.package ?? 'Professional',
          currency: data.currency ?? 'KES',
        });
      }
    };
    fetchExtra();
  }, [profile?.id]);

  const set = (field: keyof AdminProfile, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: form.full_name,
        title: form.title,
        phone: form.phone,
        office_phone: form.office_phone,
        service_areas: form.service_areas,
        specialties: form.specialties,
        photo: form.photo,
        facebook_url: form.facebook_url,
        twitter_url: form.twitter_url,
        linkedin_url: form.linkedin_url,
        instagram_url: form.instagram_url,
        youtube_url: form.youtube_url,
        pinterest_url: form.pinterest_url,
        google_url: form.google_url,
        tiktok_url: form.tiktok_url,
        package: form.package,
        currency: form.currency,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile?.id ?? '');
    setSaving(false);
    if (error) { setSaveError(error.message); return; }
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const displayName = form.full_name || user?.email?.split('@')[0] || 'Admin';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'info', label: 'Information', icon: 'ri-user-3-line' },
    { id: 'social', label: 'Social Media', icon: 'ri-share-line' },
    { id: 'security', label: 'Change Password', icon: 'ri-shield-keyhole-line' },
    { id: 'danger', label: 'Delete Account', icon: 'ri-delete-bin-6-line' },
  ];

  return (
    <div className="max-w-[820px] mx-auto space-y-0 pb-24">

      {/* ── Profile Header Card ────────────────────────────────────── */}
      <div className="bg-[#001731] rounded-2xl overflow-hidden mb-6">
        {/* Navy banner */}
        <div
          className="h-28 relative"
          style={{
            background: 'linear-gradient(135deg, #001731 0%, #002349 50%, #0D5959 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #D4A614 0%, transparent 50%), radial-gradient(circle at 80% 50%, #0D5959 0%, transparent 50%)',
            }}
          />
          {/* Visit Site link */}
          <a
            href="/"
            target="_blank"
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-external-link-line text-xs" />
            Visit Site
          </a>
        </div>

        {/* Identity */}
        <div className="px-8 pb-6 -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#001731] bg-[#002349] flex items-center justify-center">
              {form.photo ? (
                <img src={form.photo} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span
                  className="text-3xl font-light text-white/50"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {initials}
                </span>
              )}
            </div>
            {/* Role badge */}
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#D4A614] text-[#001731] text-[9px] font-bold tracking-wider rounded-full whitespace-nowrap uppercase">
              {profile?.role ?? 'admin'}
            </span>
          </div>

          {/* Name + email */}
          <div className="flex-1 pb-1">
            <h2 className="text-white text-xl font-semibold leading-tight">{displayName}</h2>
            {form.title && (
              <p className="text-[#D4A614] text-sm mt-0.5">{form.title}</p>
            )}
            <p className="text-white/40 text-xs mt-1">{form.email || user?.email}</p>
          </div>
        </div>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-white border border-stone-100 rounded-xl p-1 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-1 justify-center ${
              tab === t.id
                ? t.id === 'danger'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-[#001731] text-white'
                : t.id === 'danger'
                ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
                : 'text-stone-400 hover:text-stone-700 hover:bg-[#f5f5f5]'
            }`}
          >
            <i className={`${t.icon} text-base`} />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── INFORMATION TAB ──────────────────────────────────────── */}
      {tab === 'info' && (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Photo + Contact */}
          <div className="bg-white border border-stone-100 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-stone-800 mb-5 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-camera-line text-[#001731]" />
              </span>
              Profile Photo
            </h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <AdminProfilePhotoUploader
                currentPhoto={form.photo || null}
                name={displayName}
                onUploaded={(url) => set('photo', url)}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-700 mb-1">Upload your photo</p>
                <p className="text-xs text-[#7A7A7A] leading-relaxed">
                  Click the avatar or drag an image onto it to upload from your PC.
                  Minimum size <strong>300 × 300 px</strong>. JPG or PNG only, max 5 MB.
                </p>
                {form.photo && (
                  <button
                    type="button"
                    onClick={() => set('photo', '')}
                    className="mt-3 text-xs text-red-400 hover:text-red-600 cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-stone-100 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-stone-800 mb-5 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-contacts-line text-[#001731]" />
              </span>
              Contact Information
            </h3>
            {/* Email read-only */}
            <div className="mb-4">
              <label className={labelCls}>Email Address</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm" />
                  <input
                    type="email"
                    value={form.email || user?.email || ''}
                    readOnly
                    className="w-full pl-9 pr-3 py-2.5 border border-stone-100 rounded-lg bg-[#f5f5f5] text-sm text-stone-400 cursor-not-allowed"
                  />
                </div>
                <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg whitespace-nowrap">
                  <i className="ri-verified-badge-line" /> Verified
                </span>
              </div>
              <p className="text-[10px] text-stone-300 mt-1">Email address cannot be changed here</p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white border border-stone-100 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-stone-800 mb-5 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-user-3-line text-[#001731]" />
              </span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>First Name</label>
                <input
                  type="text"
                  value={form.full_name.split(' ')[0] ?? ''}
                  onChange={(e) => {
                    const parts = form.full_name.split(' ');
                    parts[0] = e.target.value;
                    set('full_name', parts.join(' ').trim());
                  }}
                  placeholder="Enter your first name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Last Name</label>
                <input
                  type="text"
                  value={form.full_name.split(' ').slice(1).join(' ')}
                  onChange={(e) => {
                    const first = form.full_name.split(' ')[0] ?? '';
                    set('full_name', `${first} ${e.target.value}`.trim());
                  }}
                  placeholder="Enter your last name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Title / Position</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="Enter your job position"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Mobile Number</label>
                <div className="relative">
                  <i className="ri-smartphone-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="Enter your mobile number"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Office Number</label>
                <div className="relative">
                  <i className="ri-phone-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm" />
                  <input
                    type="tel"
                    value={form.office_phone}
                    onChange={(e) => set('office_phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Service Areas</label>
                <input
                  type="text"
                  value={form.service_areas}
                  onChange={(e) => set('service_areas', e.target.value)}
                  placeholder="Enter your service areas"
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Specialties</label>
                <input
                  type="text"
                  value={form.specialties}
                  onChange={(e) => set('specialties', e.target.value)}
                  placeholder="Enter your specialties"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Package & Currency */}
          <div className="bg-white border border-stone-100 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-stone-800 mb-5 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-settings-3-line text-[#001731]" />
              </span>
              Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Allow Agents to Use Package</label>
                <div className="relative">
                  <select
                    value={form.package}
                    onChange={(e) => set('package', e.target.value)}
                    className={`${inputCls} pr-8 appearance-none cursor-pointer`}
                  >
                    <option value="">Choose...</option>
                    {PACKAGES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Choose Currency</label>
                <div className="relative">
                  <select
                    value={form.currency}
                    onChange={(e) => set('currency', e.target.value)}
                    className={`${inputCls} pr-8 appearance-none cursor-pointer`}
                  >
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Save bar */}
          <div className="flex items-center justify-between gap-4 bg-white border border-stone-100 rounded-xl px-6 py-4">
            <div>
              {saveError && (
                <div className="flex items-center gap-2 text-red-500 text-xs">
                  <i className="ri-error-warning-line" /> {saveError}
                </div>
              )}
              {saved && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs">
                  <i className="ri-checkbox-circle-line" /> Profile saved successfully.
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#001731] hover:bg-[#002349] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ── SOCIAL MEDIA TAB ─────────────────────────────────────── */}
      {tab === 'social' && (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="bg-white border border-stone-100 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-stone-800 mb-1 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-share-line text-[#001731]" />
              </span>
              Social Media
            </h3>
            <p className="text-xs text-[#7A7A7A] mb-6">
              Add your social media profile URLs. These appear on your public profile and agent cards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOCIAL_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5">
                      <i className={`${field.icon}`} />
                      {field.label}
                    </span>
                  </label>
                  <div className="relative">
                    <i className={`${field.icon} absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm`} />
                    <input
                      type="url"
                      value={form[field.key] as string}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save bar */}
          <div className="flex items-center justify-between gap-4 bg-white border border-stone-100 rounded-xl px-6 py-4">
            <div>
              {saveError && (
                <div className="flex items-center gap-2 text-red-500 text-xs">
                  <i className="ri-error-warning-line" /> {saveError}
                </div>
              )}
              {saved && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs">
                  <i className="ri-checkbox-circle-line" /> Social links saved.
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#001731] hover:bg-[#002349] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line" /> Save Social Links
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ── PASSWORD TAB ─────────────────────────────────────────── */}
      {tab === 'security' && (
        <div className="bg-white border border-stone-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-stone-800 mb-1 flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-shield-keyhole-line text-[#001731]" />
            </span>
            Change Password
          </h3>
          <p className="text-xs text-[#7A7A7A] mb-6">
            Update your admin login password. Use a strong password with at least 8 characters, mixed case, numbers and symbols.
          </p>
          <AdminChangePassword />
        </div>
      )}

      {/* ── DELETE ACCOUNT TAB ───────────────────────────────────── */}
      {tab === 'danger' && (
        <div className="space-y-5">
          <div className="bg-white border border-red-100 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-red-600 mb-1 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-delete-bin-6-line text-red-500" />
              </span>
              Delete Account
            </h3>
            <p className="text-xs text-[#7A7A7A] mb-5 leading-relaxed">
              Permanently deleting your account will remove all your data, profile, and access to the admin panel.
              <strong className="text-stone-700"> This action cannot be undone.</strong>
            </p>

            {/* Consequences list */}
            <div className="bg-red-50 rounded-lg p-4 mb-5 space-y-2">
              {[
                'All your personal profile data will be erased',
                'You will lose access to the admin dashboard immediately',
                'All listings and data created under your account remain',
                'This cannot be reversed — there is no recovery option',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-red-600">
                  <i className="ri-close-circle-line shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-delete-bin-6-line" /> Delete My Account
              </button>
            ) : (
              <div className="space-y-4">
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <p className="text-xs font-semibold text-red-700 mb-2">
                    Type <strong>DELETE</strong> to confirm account deletion:
                  </p>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type DELETE here"
                    className="w-full px-3 py-2 border border-red-200 rounded-lg bg-white text-sm text-stone-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={deleteInput !== 'DELETE'}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700"
                    onClick={() => {
                      // Real delete would call supabase.auth.admin or edge function
                      // For now show a message
                      setDeleteInput('');
                      setShowDeleteConfirm(false);
                    }}
                  >
                    <i className="ri-delete-bin-6-line" /> Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
