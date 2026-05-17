import { useState } from 'react';
import {
  ListingFormData,
  PROPERTY_TYPES,
  PURPOSES,
  generateSlug,
} from '@/pages/admin/listings/types';
import RichTextEditor from '@/components/base/RichTextEditor';

/** Map purpose → the auto badge value(s) that go into listing_status */
function purposeToBadges(purpose: string): string[] {
  switch (purpose) {
    case 'sale': return ['for_sale'];
    case 'rent': return ['for_rent'];
    case 'short_stay': return ['for_rent', 'short_stay'];
    case 'new_dev': return ['for_sale', 'new_development'];
    default: return ['for_sale'];
  }
}

// Listing date is auto-set to today — not shown to user

interface Props {
  data: ListingFormData;
  onChange: (field: keyof ListingFormData, value: string | boolean | string[]) => void;
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-[#0d1f2d] rounded-md">
          <i className={`${icon} text-white text-sm`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-jost text-[13px] font-semibold text-[#0d1f2d] uppercase tracking-[0.5px]">{title}</h4>
          {subtitle && <p className="text-[11px] text-[#7a8a99] mt-0.5 leading-snug">{subtitle}</p>}
        </div>
      </div>
      <div className="h-px bg-[#e5e7eb] mt-2.5" />
    </div>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#0d1f2d] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-[#7a8a99] mt-1.5">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';
const selectClass = `${inputClass} cursor-pointer`;

const SUGGESTED_TAGS = [
  'New Development', 'Off-Plan', 'Luxury', 'Waterfront', 'Gated Community',
  'Pet Friendly', 'Serviced', 'Investment', 'Ready to Move', 'Reduced Price',
];

export default function StepBasicInfo({ data, onChange }: Props) {
  const [tagInput, setTagInput] = useState('');

  const handleTitleChange = (val: string) => {
    onChange('title', val);
    // Auto-generate slug silently — never shown to user
    onChange('slug', generateSlug(val));
  };

  const handlePurposeChange = (val: string) => {
    onChange('purpose', val);
    // Auto-sync the base badge(s) — keep any custom tags the user added
    const autoBadges = purposeToBadges(val);
    const customTags = (data.listing_status || []).filter(
      (s) => !['for_sale', 'for_rent', 'short_stay', 'new_development'].includes(s)
    );
    onChange('listing_status', [...autoBadges, ...customTags]);
  };

  // Custom tags = everything that isn't an auto-badge
  const AUTO_BADGE_VALUES = ['for_sale', 'for_rent', 'short_stay', 'new_development'];
  const currentTags: string[] = Array.isArray(data.listing_status)
    ? data.listing_status.filter((s) => !AUTO_BADGE_VALUES.includes(s))
    : [];

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || currentTags.includes(t)) return;
    const autoBadges = (data.listing_status || []).filter((s) => AUTO_BADGE_VALUES.includes(s));
    onChange('listing_status', [...autoBadges, ...currentTags, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    const autoBadges = (data.listing_status || []).filter((s) => AUTO_BADGE_VALUES.includes(s));
    onChange('listing_status', [...autoBadges, ...currentTags.filter((t) => t !== tag)]);
  };

  return (
    <div className="w-full space-y-10 md:space-y-12">

      {/* Title */}
      <section className="pb-2">
        <SectionTitle icon="ri-file-text-line" title="Property Title" subtitle="A compelling headline attracts more buyers" />
        <Field label="Title" required>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Magnificent 4-Bedroom Home in Kilimani"
            className={inputClass}
          />
        </Field>
      </section>

      {/* Description */}
      <section className="pb-2">
        <SectionTitle icon="ri-align-left" title="Description" subtitle="Tell the story of this property" />
        <Field label="Full Description" hint="Detailed description shown on the property detail page">
          <RichTextEditor
            value={data.full_description}
            onChange={(html) => onChange('full_description', html)}
            rows={8}
            maxLength={5000}
            placeholder={`Welcome to this stunning property nestled in the heart of...\n\nThe open-plan living area flows seamlessly into...\n\nKey highlights include...`}
          />
        </Field>
      </section>

      {/* Listing Type */}
      <section className="pb-2">
        <SectionTitle icon="ri-home-4-line" title="Listing Type" subtitle="Classify the property" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Property Type" required>
            <select value={data.property_type} onChange={(e) => onChange('property_type', e.target.value)} className={selectClass}>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Status" required>
            <select value={data.purpose} onChange={(e) => handlePurposeChange(e.target.value)} className={selectClass}>
              {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </Field>
        </div>
        {/* Auto-badge preview */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#7a8a99] font-medium">Auto badges:</span>
          {purposeToBadges(data.purpose).map((b) => (
            <span key={b} className="text-[10px] font-bold px-2.5 py-1 bg-[#0d1f2d] text-white uppercase tracking-wide whitespace-nowrap">
              {b.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </section>

      {/* Labels / Tags */}
      <section className="pb-2">
        <SectionTitle icon="ri-price-tag-3-line" title="Labels &amp; Tags" subtitle="Optional — shown as badges on the card" />
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
              placeholder="Type a custom tag and press Enter..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              disabled={!tagInput.trim()}
              className="px-5 py-3 bg-[#0d5959] text-white text-sm font-bold rounded-lg hover:bg-[#094545] transition-colors cursor-pointer whitespace-nowrap"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.filter((t) => !currentTags.includes(t)).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addTag(t)}
                className="text-xs font-semibold px-3 py-1.5 bg-white border-2 border-[#e8edf2] text-[#7a8a99] hover:border-[#002b4b] hover:text-[#002b4b] transition-colors cursor-pointer whitespace-nowrap"
              >
                + {t}
              </button>
            ))}
          </div>

          {currentTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-[#F5F5F5]">
              {currentTags.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 bg-[#0d1f2d] text-white">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="ml-0.5 hover:text-red-300 transition-colors cursor-pointer">
                    <i className="ri-close-line text-xs" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>


    </div>
  );
}
