import { useState } from 'react';
import { ListingFormData, STATUSES, AgentOption, CardDisplaySettings, DEFAULT_CARD_DISPLAY } from '@/pages/admin/listings/types';
import CardPreviewModal from '@/pages/admin/listings/components/CardPreviewModal';

interface Props {
  data: ListingFormData;
  agents: AgentOption[];
  onChange: (field: keyof ListingFormData, value: string | boolean | string[] | CardDisplaySettings) => void;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0d1f2d] mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#7a8a99] mt-1">{hint}</p>}
    </div>
  );
}

const inputClass = 'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';
const selectClass = `${inputClass} cursor-pointer`;

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-[#0d1f2d] rounded-md">
          <i className={`${icon} text-white text-sm`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-jost text-[13px] font-semibold text-[#0d1f2d] uppercase tracking-[0.5px]">{title}</h4>
        </div>
      </div>
      <div className="h-px bg-[#e5e7eb] mt-2.5" />
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, description, value, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b-2 border-[#F5F5F5] last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-[#0d1f2d]">{label}</p>
        <p className="text-xs text-[#7a8a99] mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors cursor-pointer ${value ? 'bg-[#0d5959]' : 'bg-[#e8edf2]'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}

const CARD_DISPLAY_FIELDS: { key: keyof CardDisplaySettings; label: string; description: string }[] = [
  { key: 'show_price', label: 'Price', description: 'Show the listing price on the card' },
  { key: 'show_property_type', label: 'Property Type', description: 'Show the property type label (e.g. Apartment, Villa)' },
  { key: 'show_badges', label: 'Status Badges', description: 'Show FOR SALE / FOR RENT badges' },
  { key: 'show_location', label: 'Location', description: 'Show the location / city line' },
  { key: 'show_meta', label: 'Beds · Baths · Parking', description: 'Show the property meta details row' },
  { key: 'show_listing_date', label: 'Listing Date', description: 'Show how long ago the property was listed' },
  { key: 'show_contact_agent', label: 'Contact Agent Button', description: 'Show the contact agent link in the card footer' },
  { key: 'show_save_button', label: 'Save / Favourite Button', description: 'Show the heart save button in the card footer' },
];

export default function SettingsTab({ data, agents, onChange }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  const cardDisplay: CardDisplaySettings = data.card_display ?? { ...DEFAULT_CARD_DISPLAY };

  const handleCardDisplayToggle = (key: keyof CardDisplaySettings) => {
    onChange('card_display', { ...cardDisplay, [key]: !cardDisplay[key] });
  };

  const allOn = CARD_DISPLAY_FIELDS.every((f) => cardDisplay[f.key]);
  const handleToggleAll = () => {
    const next = !allOn;
    const updated = CARD_DISPLAY_FIELDS.reduce(
      (acc, f) => ({ ...acc, [f.key]: next }),
      {} as CardDisplaySettings,
    );
    onChange('card_display', updated);
  };

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Listing settings */}
      <section className="pb-2">
        <SectionHeader title="Listing Settings" icon="ri-settings-4-line" />
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="CRM Status" hint="Controls the property lifecycle state. Never editable from the Add Property flow.">
              <select
                value={data.status}
                onChange={(e) => onChange('status', e.target.value)}
                className={selectClass}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Assigned Agent">
              <select
                value={data.agent_id}
                onChange={(e) => onChange('agent_id', e.target.value)}
                className={selectClass}
              >
                <option value="">No agent assigned</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.full_name}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Listing Date">
            <input
              type="date"
              value={data.listing_date}
              onChange={(e) => onChange('listing_date', e.target.value)}
              className={inputClass}
            />
          </Field>

          {/* Featured toggle */}
          <div className="flex items-center justify-between p-4 bg-[#F5F5F5]">
            <div>
              <p className="text-sm font-medium text-[#0d1f2d]">Featured Property</p>
              <p className="text-xs text-[#7a8a99] mt-0.5">
                Featured properties appear in the homepage hero and search highlights
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange('featured', !data.featured)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${data.featured ? 'bg-[#0d5959]' : 'bg-[#e8edf2]'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data.featured ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Card Display Settings */}
      <section className="pb-2">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-[#0d1f2d] rounded-md">
              <i className="ri-layout-masonry-line text-white text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-jost text-[13px] font-semibold text-[#0d1f2d] uppercase tracking-[0.5px]">Card Display</h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-[11px] font-bold text-[#0d5959] hover:text-[#094545] transition-colors cursor-pointer whitespace-nowrap"
            >
              {allOn ? 'Hide All' : 'Show All'}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-[#0d5959] text-white hover:bg-[#094545] transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-eye-line text-xs" />
              Preview Card
            </button>
          </div>
        </div>
        <div className="h-px bg-[#e5e7eb] mb-4" />

        <div className="bg-[#F5F5F5] px-4 py-1">
          {CARD_DISPLAY_FIELDS.map((field) => (
            <ToggleRow
              key={field.key}
              label={field.label}
              description={field.description}
              value={cardDisplay[field.key]}
              onToggle={() => handleCardDisplayToggle(field.key)}
            />
          ))}
        </div>

        <p className="text-xs text-[#7a8a99] mt-2">
          These settings control which fields are visible on property listing cards across the site.
        </p>
      </section>

      {/* SEO section */}
      <section className="pb-2">
        <SectionHeader title="SEO Settings" icon="ri-search-line" />
        <div className="space-y-5">
          <Field label="SEO Title" hint="If blank, the listing title will be used. Aim for 50–60 characters.">
            <input
              type="text"
              value={data.seo_title}
              onChange={(e) => onChange('seo_title', e.target.value)}
              placeholder="Override the page &lt;title&gt; tag for this listing…"
              maxLength={70}
              className={inputClass}
            />
            <p className="text-xs text-right text-[#7a8a99] mt-1">{data.seo_title.length}/70</p>
          </Field>

          <Field label="SEO Meta Description" hint="Shown in Google search results. Aim for 120–155 characters.">
            <textarea
              value={data.seo_description}
              onChange={(e) => onChange('seo_description', e.target.value)}
              rows={3}
              placeholder="A compelling description for search engines…"
              maxLength={160}
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-right text-[#7a8a99] mt-1">{data.seo_description.length}/160</p>
          </Field>

          {/* Search preview */}
          {(data.seo_title || data.title) && (
            <div className="p-4 bg-white border-2 border-[#e8edf2]">
              <p className="text-xs text-[#7a8a99] mb-2 uppercase tracking-widest font-semibold">
                Search Result Preview
              </p>
              <p className="text-[#1a0dab] text-base font-medium leading-snug">
                {data.seo_title || data.title || 'Property Title'}
              </p>
              <p className="text-[#006621] text-xs mt-0.5">
                oceansuganda.com/property/{data.slug || 'your-listing-slug'}
              </p>
              <p className="text-[#545454] text-sm mt-1 leading-relaxed">
                {data.seo_description || data.short_description || 'Add a meta description to preview how this listing appears in Google search results.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Card Preview Modal */}
      {showPreview && (
        <CardPreviewModal
          data={data}
          cardDisplay={cardDisplay}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}