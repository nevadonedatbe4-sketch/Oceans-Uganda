import type { AgentDraft, SocialLinks } from '../types';

interface Props {
  data: AgentDraft;
  onChange: (data: AgentDraft) => void;
  saving: boolean;
  onSave: () => void;
  isEdit: boolean;
}

export default function AgentForm({ data, onChange, saving, onSave, isEdit }: Props) {
  const set = (partial: Partial<AgentDraft>) => onChange({ ...data, ...partial });
  const setSocial = (partial: Partial<SocialLinks>) =>
    set({ social_links: { ...data.social_links, ...partial } });

  const Section = ({ title, icon }: { title: string; icon: string }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/10 rounded-md">
        <i className={`${icon} text-[#1B4332] text-sm`}></i>
      </div>
      <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">{title}</h3>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: main form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile */}
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <Section title="Profile" icon="ri-user-line" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={data.full_name}
                  onChange={(e) => set({ full_name: e.target.value })}
                  placeholder="e.g. Sarah Nakamya"
                  className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={data.title ?? ''}
                  onChange={(e) => set({ title: e.target.value || null })}
                  placeholder="e.g. Senior Property Consultant"
                  className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Bio</label>
              <textarea
                rows={5}
                value={data.bio ?? ''}
                onChange={(e) => set({ bio: e.target.value || null })}
                placeholder="A brief introduction to this agent — their expertise, experience, and specialties…"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <Section title="Contact" icon="ri-contacts-line" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={data.phone ?? ''}
                onChange={(e) => set({ phone: e.target.value || null })}
                placeholder="+256 700 000 000"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={data.email ?? ''}
                onChange={(e) => set({ email: e.target.value || null })}
                placeholder="agent@oceansuganda.com"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">WhatsApp Number</label>
              <input
                type="tel"
                value={data.whatsapp ?? ''}
                onChange={(e) => set({ whatsapp: e.target.value || null })}
                placeholder="+256 700 000 000"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <Section title="Social Media" icon="ri-share-line" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                <i className="ri-instagram-line mr-1"></i>Instagram URL
              </label>
              <input
                type="url"
                value={data.social_links.instagram ?? ''}
                onChange={(e) => setSocial({ instagram: e.target.value || undefined })}
                placeholder="https://instagram.com/…"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                <i className="ri-linkedin-line mr-1"></i>LinkedIn URL
              </label>
              <input
                type="url"
                value={data.social_links.linkedin ?? ''}
                onChange={(e) => setSocial({ linkedin: e.target.value || undefined })}
                placeholder="https://linkedin.com/in/…"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                <i className="ri-facebook-line mr-1"></i>Facebook URL
              </label>
              <input
                type="url"
                value={data.social_links.facebook ?? ''}
                onChange={(e) => setSocial({ facebook: e.target.value || undefined })}
                placeholder="https://facebook.com/…"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                <i className="ri-twitter-x-line mr-1"></i>Twitter / X URL
              </label>
              <input
                type="url"
                value={data.social_links.twitter ?? ''}
                onChange={(e) => setSocial({ twitter: e.target.value || undefined })}
                placeholder="https://x.com/…"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        {/* Photo */}
        <div className="bg-white border border-stone-200 rounded-lg p-5">
          <label className="block text-sm font-semibold text-stone-700 mb-3">Agent Photo</label>
          <input
            type="url"
            value={data.photo ?? ''}
            onChange={(e) => set({ photo: e.target.value || null })}
            placeholder="Paste photo URL…"
            className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
          />
          {data.photo ? (
            <div className="mt-3 w-full h-48 rounded-lg overflow-hidden border border-stone-200">
              <img src={data.photo} alt="Agent photo preview" className="w-full h-full object-cover object-top" />
            </div>
          ) : (
            <div className="mt-3 w-full h-48 rounded-lg border-2 border-dashed border-stone-200 flex items-center justify-center">
              <div className="text-center">
                <i className="ri-user-3-line text-3xl text-stone-300 block"></i>
                <p className="text-xs text-stone-400 mt-1">No photo</p>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <label className="block text-sm font-semibold text-stone-700">Settings</label>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-700">Active</p>
              <p className="text-xs text-stone-400">Show on public pages</p>
            </div>
            <button
              onClick={() => set({ active: !data.active })}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${data.active ? 'bg-[#1B4332]' : 'bg-stone-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.active ? 'left-5' : 'left-0.5'}`}></span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Display Order</label>
            <input
              type="number"
              value={data.display_order}
              onChange={(e) => set({ display_order: Number(e.target.value) })}
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
            <p className="text-xs text-stone-400 mt-1">Lower = appears first</p>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={saving || !data.full_name}
          className="w-full py-3 bg-[#1B4332] text-white rounded-md text-sm font-semibold hover:bg-[#163828] disabled:opacity-60 cursor-pointer whitespace-nowrap"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Agent'}
        </button>
      </div>
    </div>
  );
}
