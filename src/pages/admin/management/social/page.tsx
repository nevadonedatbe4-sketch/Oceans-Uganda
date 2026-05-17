import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

const SOCIAL_FIELDS = [
  { key: 'instagram_url', label: 'Instagram', icon: 'ri-instagram-line', placeholder: 'https://instagram.com/oceansuganda', color: '#E1306C' },
  { key: 'facebook_url', label: 'Facebook', icon: 'ri-facebook-box-line', placeholder: 'https://facebook.com/oceansuganda', color: '#1877F2' },
  { key: 'tiktok_url', label: 'TikTok', icon: 'ri-tiktok-line', placeholder: 'https://tiktok.com/@oceansuganda', color: '#000000' },
  { key: 'youtube_url', label: 'YouTube', icon: 'ri-youtube-line', placeholder: 'https://youtube.com/@oceansuganda', color: '#FF0000' },
  { key: 'linkedin_url', label: 'LinkedIn', icon: 'ri-linkedin-box-line', placeholder: 'https://linkedin.com/company/oceansuganda', color: '#0A66C2' },
  { key: 'twitter_url', label: 'X / Twitter', icon: 'ri-twitter-x-line', placeholder: 'https://x.com/oceansuganda', color: '#000000' },
  { key: 'whatsapp_direct_url', label: 'WhatsApp Direct Link', icon: 'ri-whatsapp-line', placeholder: 'https://wa.me/256700123456', color: '#25D366' },
];

export default function SocialManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('social');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-share-box-line"
        title="Social Media Links"
        description="Add your social profiles and control where icons appear across the site."
      />

      {/* Platform URLs */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Platform URLs</h3>
        {SOCIAL_FIELDS.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <i className={`${field.icon} text-base`} style={{ color: field.color }} />
              </span>
              {field.label}
            </label>
            <input
              type="url"
              value={get(field.key)}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]/20 transition-colors bg-white"
            />
          </div>
        ))}
      </div>

      {/* Placement Visibility */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Show Icons On</h3>
        <p className="text-xs text-stone-400 mb-4">Control where social icons appear across the public site.</p>
        <SettingField
          label="Header / Navigation Bar"
          type="toggle"
          value={get('social_show_header', 'false')}
          onChange={(v) => update('social_show_header', v)}
          hint="Shows a small icon row in the site header."
        />
        <SettingField
          label="Footer"
          type="toggle"
          value={get('social_show_footer', 'true')}
          onChange={(v) => update('social_show_footer', v)}
        />
        <SettingField
          label="Contact Page"
          type="toggle"
          value={get('social_show_contact_page', 'true')}
          onChange={(v) => update('social_show_contact_page', v)}
        />
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Icon Preview</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {SOCIAL_FIELDS.map((field) =>
            get(field.key) ? (
              <a
                key={field.key}
                href={get(field.key)}
                target="_blank"
                rel="nofollow noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-colors cursor-pointer"
                title={field.label}
              >
                <i className={`${field.icon} text-base`} />
              </a>
            ) : null
          )}
          {SOCIAL_FIELDS.every((f) => !get(f.key)) && (
            <p className="text-sm text-stone-400">No social URLs entered yet.</p>
          )}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
