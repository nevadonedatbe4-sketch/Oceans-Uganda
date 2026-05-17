import { useState } from 'react';
import {
  ListingFormData,
  PROPERTY_TYPES,
  PURPOSES,
  CURRENCIES,
  PRICE_FREQUENCIES,
  LISTING_STATUS_OPTIONS,
  generateSlug,
} from '@/pages/admin/listings/types';

interface CoreTabProps {
  data: ListingFormData;
  onChange: (field: keyof ListingFormData, value: string | boolean | string[]) => void;
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0d1f2d] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#7a8a99] mt-1">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';
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

export default function CoreTab({ data, onChange }: CoreTabProps) {
  const [galleryInput, setGalleryInput] = useState('');

  const handleTitleChange = (val: string) => {
    onChange('title', val);
    if (!data.slug || data.slug === generateSlug(data.title)) {
      onChange('slug', generateSlug(val));
    }
  };

  const toggleListingStatus = (val: string) => {
    const current = data.listing_status || [];
    const updated = current.includes(val)
      ? current.filter((s) => s !== val)
      : [...current, val];
    onChange('listing_status', updated);
  };

  const addGalleryUrl = () => {
    const url = galleryInput.trim();
    if (!url) return;
    const current = data.gallery || [];
    if (!current.includes(url)) {
      onChange('gallery', [...current, url]);
    }
    setGalleryInput('');
  };

  const removeGalleryUrl = (url: string) => {
    onChange('gallery', (data.gallery || []).filter((u) => u !== url));
  };

  return (
    <div className="space-y-10 md:space-y-12">
      {/* ── Title & Slug ── */}
      <div className="space-y-5">
        <Field label="Listing Title" required>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. 5 Bedroom Home All En Suite in Kilimani"
            className={inputClass}
          />
        </Field>

        <Field label="URL Slug" hint="Auto-generated from title. Used in property URL.">
          <input
            type="text"
            value={data.slug}
            onChange={(e) => onChange('slug', e.target.value)}
            placeholder="e.g. 5-bedroom-home-kilimani"
            className={inputClass}
          />
        </Field>
      </div>

      {/* ── Listing Status Badges ── */}
      <Field
        label="Listing Status Badges"
        hint="Select one or more badges shown on the property row card."
      >
        <div className="flex flex-wrap gap-2 mt-1">
          {LISTING_STATUS_OPTIONS.map((opt) => {
            const active = (data.listing_status || []).includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleListingStatus(opt.value)}
                className={`px-4 py-2 text-xs font-semibold rounded-sm border cursor-pointer whitespace-nowrap transition-all ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </Field>

      {/* ── Type & Purpose ── */}
      <div className="grid grid-cols-2 gap-5">
        <Field label="Property Type" required>
          <select
            value={data.property_type}
            onChange={(e) => onChange('property_type', e.target.value)}
            className={selectClass}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" required>
          <select
            value={data.purpose}
            onChange={(e) => onChange('purpose', e.target.value)}
            className={selectClass}
          >
            {PURPOSES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* ── Price Block ── */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Pricing</p>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Main Price">
            <input
              type="number"
              value={data.price}
              onChange={(e) => onChange('price', e.target.value)}
              placeholder="0"
              min="0"
              className={inputClass}
            />
          </Field>

          <Field label="Currency">
            <select
              value={data.currency}
              onChange={(e) => onChange('currency', e.target.value)}
              className={selectClass}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Price Frequency" hint="Adds suffix like /Monthly">
            <select
              value={data.price_frequency}
              onChange={(e) => onChange('price_frequency', e.target.value)}
              className={selectClass}
            >
              {PRICE_FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Secondary Price" hint="Optional. Hidden when empty.">
            <input
              type="number"
              value={data.secondary_price}
              onChange={(e) => onChange('secondary_price', e.target.value)}
              placeholder="0"
              min="0"
              className={inputClass}
            />
          </Field>

          <Field label="Secondary Price Label" hint='e.g. "Service charge" or "Per sqm"'>
            <input
              type="text"
              value={data.secondary_price_label}
              onChange={(e) => onChange('secondary_price_label', e.target.value)}
              placeholder="e.g. Service charge"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Price Note" hint='e.g. "Negotiable", "Inclusive of VAT"'>
          <input
            type="text"
            value={data.price_note}
            onChange={(e) => onChange('price_note', e.target.value)}
            placeholder="e.g. Negotiable"
            className={inputClass}
          />
        </Field>
      </div>

      {/* ── Cover Image ── */}
      <Field
        label="Cover Image URL"
        hint="Paste the main property photo URL. This is the thumbnail shown in the row card."
      >
        <input
          type="url"
          value={data.cover_image}
          onChange={(e) => onChange('cover_image', e.target.value)}
          placeholder="https://…"
          className={inputClass}
        />
        {data.cover_image && (
          <div className="mt-2 rounded-md overflow-hidden w-full h-36 bg-gray-50">
            <img
              src={data.cover_image}
              alt="Cover preview"
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}
      </Field>

      {/* ── Gallery ── */}
      <Field
        label="Gallery Images"
        hint="Add additional photo URLs for the gallery viewer."
      >
        <div className="flex gap-2">
          <input
            type="url"
            value={galleryInput}
            onChange={(e) => setGalleryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryUrl())}
            placeholder="https://… (press Enter or click Add)"
            className={inputClass}
          />
          <button
            type="button"
            onClick={addGalleryUrl}
            className="px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-md cursor-pointer whitespace-nowrap hover:bg-primary/90 transition-colors"
          >
            Add
          </button>
        </div>
        {(data.gallery || []).length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(data.gallery || []).map((url, i) => (
              <div key={i} className="relative group rounded-md overflow-hidden h-20 bg-gray-100">
                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryUrl(url)}
                  className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <i className="ri-close-line text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>
    </div>
  );
}
