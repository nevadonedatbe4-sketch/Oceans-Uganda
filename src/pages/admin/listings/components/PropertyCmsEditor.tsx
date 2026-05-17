import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ListingFormData, ListingImage, AgentOption, NeighborhoodOption,
  CardDisplaySettings, PROPERTY_TYPES, PURPOSES, CURRENCIES,
  PRICE_FREQUENCIES, LISTING_STATUS_OPTIONS, STATUSES, generateSlug,
} from '@/pages/admin/listings/types';
import MediaUploader from '@/pages/admin/listings/components/MediaUploader';
import RichTextEditor from '@/components/base/RichTextEditor';

interface Props {
  formData: ListingFormData;
  agents: AgentOption[];
  neighborhoods: NeighborhoodOption[];
  saving: boolean;
  isEdit: boolean;
  onChange: (field: keyof ListingFormData, value: string | boolean | number | string[] | CardDisplaySettings) => void;
  onImagesChange: (images: ListingImage[]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
  onSave: (status: string) => void;
  onCancel: () => void;
}

const SECTIONS = [
  { id: 'description', label: 'Description & Price', icon: 'ri-file-text-line' },
  { id: 'details', label: 'Details', icon: 'ri-home-4-line' },
  { id: 'features', label: 'Features', icon: 'ri-list-check' },
  { id: 'media', label: 'Media', icon: 'ri-image-2-line' },
  { id: 'location', label: 'Location', icon: 'ri-map-pin-2-line' },
  { id: 'settings', label: 'Property Settings', icon: 'ri-settings-3-line' },
];

const inputCls = 'w-full text-sm border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 outline-none focus:border-[#b8965a] focus:ring-2 focus:ring-[#b8965a]/10 transition-all bg-white';
const selectCls = `${inputCls} cursor-pointer`;
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide';

function Field({ label, required, hint, children }: { label?: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && (
        <label className={labelCls}>
          {label}{required && <span className="text-red-400 ml-0.5 normal-case">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function SectionCard({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) {
  return (
    <div id={id} className="bg-white border border-gray-100 rounded-xl overflow-hidden scroll-mt-6">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-[#f5f5f5]">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#b8965a]/10">
          <i className={`${icon} text-[#b8965a] text-sm`} />
        </div>
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange, label, hint }: { value: boolean; onChange: () => void; label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${value ? 'bg-[#b8965a]' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function Stepper({ value, onChange, min = 0, max = 20 }: { value: string; onChange: (v: string) => void; min?: number; max?: number }) {
  const num = parseInt(value) || 0;
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-fit">
      <button type="button" onClick={() => num > min && onChange(String(num - 1))} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors cursor-pointer">
        <i className="ri-subtract-line text-sm" />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-gray-700">{num}</span>
      <button type="button" onClick={() => num < max && onChange(String(num + 1))} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors cursor-pointer">
        <i className="ri-add-line text-sm" />
      </button>
    </div>
  );
}

const SUGGESTED_AMENITIES = [
  'Swimming Pool', 'Gym / Fitness Centre', '24/7 Security', 'CCTV Surveillance',
  'Generator Backup', 'Borehole / Water Tank', 'Garden / Landscaping', 'Rooftop Terrace',
  'Concierge Service', 'Lift / Elevator', 'Underground Parking', 'Electric Fence',
  'Smart Home System', 'Air Conditioning', 'High-Speed Internet', 'Balcony',
  'Staff Quarters', 'Laundry Room', 'Pet Friendly', 'Guest Suite',
];

const SUGGESTED_TAGS = [
  'New Development', 'Off-Plan', 'Luxury', 'Waterfront', 'Gated Community',
  'Pet Friendly', 'Serviced', 'Investment', 'Ready to Move', 'Reduced Price',
];

export default function PropertyCmsEditor({
  formData, agents, neighborhoods, saving, isEdit,
  onChange, onImagesChange, onAmenitiesChange, onSave, onCancel,
}: Props) {
  const [activeSection, setActiveSection] = useState('description');
  const [slugEdited, setSlugEdited] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showSecondaryPrice, setShowSecondaryPrice] = useState(!!formData.secondary_price);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollingRef = useRef(false);

  // Scroll spy
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (scrollingRef.current) return;
      const containerTop = container.getBoundingClientRect().top;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = sectionRefs.current[s.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= 80) current = s.id;
      }
      setActiveSection(current);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = sectionRefs.current[id];
    const container = contentRef.current;
    if (!el || !container) return;
    setActiveSection(id);
    scrollingRef.current = true;
    container.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' });
    setTimeout(() => { scrollingRef.current = false; }, 800);
  }, []);

  const handleTitleChange = (val: string) => {
    onChange('title', val);
    if (!slugEdited) onChange('slug', generateSlug(val));
  };

  const addAmenity = (a: string) => {
    const t = a.trim();
    if (!t || formData.amenities.includes(t)) return;
    onAmenitiesChange([...formData.amenities, t]);
    setAmenityInput('');
  };

  const removeAmenity = (a: string) => onAmenitiesChange(formData.amenities.filter((x) => x !== a));

  const customTags = (formData.listing_status || []).filter((s) => !['for_sale', 'for_rent'].includes(s));

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || customTags.includes(t)) return;
    const base = (formData.listing_status || []).filter((s) => ['for_sale', 'for_rent'].includes(s));
    onChange('listing_status', [...base, ...customTags, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    const base = (formData.listing_status || []).filter((s) => ['for_sale', 'for_rent'].includes(s));
    onChange('listing_status', [...base, ...customTags.filter((t) => t !== tag)]);
  };

  const toggleListingStatus = (val: string) => {
    const current = formData.listing_status || [];
    const updated = current.includes(val) ? current.filter((s) => s !== val) : [...current, val];
    onChange('listing_status', updated);
  };

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="w-full flex bg-white border border-gray-100 rounded-xl overflow-hidden" style={{ minHeight: '85vh' }}>

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-52 shrink-0 border-r border-gray-100 bg-[#f5f5f5] flex flex-col">
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sections</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer group ${
                activeSection === s.id
                  ? 'bg-white shadow-sm border border-gray-100 text-[#b8965a]'
                  : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'
              }`}
            >
              <div className={`w-6 h-6 flex items-center justify-center shrink-0 ${activeSection === s.id ? 'text-[#b8965a]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                <i className={`${s.icon} text-sm`} />
              </div>
              <span className={`text-xs font-medium leading-tight ${activeSection === s.id ? 'text-[#b8965a]' : ''}`}>
                {s.label}
              </span>
              {activeSection === s.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#b8965a] shrink-0" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar footer actions */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          <button
            type="button"
            onClick={() => onSave('hidden')}
            disabled={saving}
            className="w-full py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => onSave('available')}
            disabled={saving}
            className="w-full py-2 text-xs font-semibold text-white bg-[#b8965a] rounded-lg hover:bg-[#a07840] transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            {saving ? 'Publishing…' : isEdit ? 'Save Changes' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ── RIGHT CONTENT ── */}
      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* ── 1. DESCRIPTION & PRICE ── */}
          <div ref={setSectionRef('description')}>
            <SectionCard id="description" title="Description & Price" icon="ri-file-text-line">
              <div className="space-y-5">
                {/* Title */}
                <Field label="Property Title" required>
                  <input type="text" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. 5 Bedroom Home All En Suite in Kilimani" className={inputCls} />
                </Field>

                {/* Slug */}
                <Field label="URL Slug" hint="Auto-generated from title">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#b8965a] focus-within:ring-2 focus-within:ring-[#b8965a]/10 bg-white">
                    <span className="px-3 text-xs text-gray-400 whitespace-nowrap border-r border-gray-200 bg-gray-50 py-2.5">/property/</span>
                    <input type="text" value={formData.slug} onChange={(e) => { setSlugEdited(true); onChange('slug', e.target.value); }} placeholder="property-url-slug" className="flex-1 text-sm px-3 py-2.5 text-gray-700 outline-none bg-white" />
                  </div>
                </Field>

                {/* Description */}
                <Field label="Short Description" hint="Shown on property cards — keep to 1–2 sentences">
                  <textarea value={formData.short_description} onChange={(e) => onChange('short_description', e.target.value)} rows={2} placeholder="A concise teaser..." className={`${inputCls} resize-none`} maxLength={300} />
                  <p className="text-xs text-gray-400 mt-1 text-right">{formData.short_description.length}/300</p>
                </Field>

                <Field label="Full Description">
                  <RichTextEditor
                    value={formData.full_description}
                    onChange={(html) => onChange('full_description', html)}
                    rows={6}
                    maxLength={5000}
                    placeholder="Detailed description for the property page..."
                  />
                </Field>

                <div className="border-t border-gray-100 pt-5">
                  <p className={`${labelCls} mb-3`}>Listing Type</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Field label="Status">
                      <select value={formData.purpose} onChange={(e) => onChange('purpose', e.target.value)} className={selectCls}>
                        {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Property Type" required>
                      <select value={formData.property_type} onChange={(e) => onChange('property_type', e.target.value)} className={selectCls}>
                        {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Status">
                      <select value={formData.status} onChange={(e) => onChange('status', e.target.value)} className={selectCls}>
                        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Listing Date">
                      <input type="date" value={formData.listing_date} onChange={(e) => onChange('listing_date', e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* Listing status badges */}
                <div>
                  <p className={labelCls}>Listing Badges</p>
                  <div className="flex gap-3 flex-wrap">
                    {LISTING_STATUS_OPTIONS.map((opt) => {
                      const active = (formData.listing_status || []).includes(opt.value);
                      return (
                        <button key={opt.value} type="button" onClick={() => toggleListingStatus(opt.value)}
                          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border-2 cursor-pointer whitespace-nowrap transition-all ${active ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'}`}>
                          {active && <i className="ri-check-line" />}{opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-gray-100 pt-5">
                  <p className={`${labelCls} mb-3`}>Pricing</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Field label="Price" required>
                      <input type="number" value={formData.price} onChange={(e) => onChange('price', e.target.value)} placeholder="0" min="0" className={inputCls} />
                    </Field>
                    <Field label="Currency">
                      <select value={formData.currency} onChange={(e) => onChange('currency', e.target.value)} className={selectCls}>
                        {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Frequency">
                      <select value={formData.price_frequency} onChange={(e) => onChange('price_frequency', e.target.value)} className={selectCls}>
                        {PRICE_FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Price Note" hint="e.g. Negotiable">
                      <input type="text" value={formData.price_note} onChange={(e) => onChange('price_note', e.target.value)} placeholder="e.g. Negotiable" className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* Secondary price toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Secondary Price</p>
                    <p className="text-xs text-gray-400">Add an extra price line (e.g. service charge)</p>
                  </div>
                  <button type="button" onClick={() => setShowSecondaryPrice(!showSecondaryPrice)}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${showSecondaryPrice ? 'bg-[#b8965a]' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showSecondaryPrice ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {showSecondaryPrice && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Secondary Amount">
                      <input type="number" value={formData.secondary_price} onChange={(e) => onChange('secondary_price', e.target.value)} placeholder="0" min="0" className={inputCls} />
                    </Field>
                    <Field label="Secondary Label" hint='e.g. "Service charge"'>
                      <input type="text" value={formData.secondary_price_label} onChange={(e) => onChange('secondary_price_label', e.target.value)} placeholder="e.g. Service charge" className={inputCls} />
                    </Field>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* ── 2. DETAILS ── */}
          <div ref={setSectionRef('details')}>
            <SectionCard id="details" title="Details" icon="ri-home-4-line">
              <div className="space-y-6">
                {/* Beds / Baths / Parking */}
                <div>
                  <p className={`${labelCls} mb-3`}>Rooms & Parking</p>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { label: 'Bedrooms', field: 'bedrooms' as keyof ListingFormData, max: 15 },
                      { label: 'Bathrooms', field: 'bathrooms' as keyof ListingFormData, max: 10 },
                      { label: 'Parking Spaces', field: 'parking' as keyof ListingFormData, max: 10 },
                    ].map(({ label, field, max }) => (
                      <div key={field}>
                        <p className="text-xs text-gray-500 mb-2">{label}</p>
                        <Stepper value={String(formData[field] ?? 0)} onChange={(v) => onChange(field, v)} max={max} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <p className={`${labelCls} mb-3`}>Size</p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <Field label="Building Size (sqm)">
                      <input type="number" value={formData.size_sqm} onChange={(e) => onChange('size_sqm', e.target.value)} placeholder="e.g. 250" min="0" className={inputCls} />
                    </Field>
                    <Field label="Land Area (sqm)">
                      <input type="number" value={formData.display_order} onChange={(e) => onChange('display_order', e.target.value)} placeholder="e.g. 500" min="0" className={inputCls} />
                    </Field>
                    <Field label="Property ID / Reference">
                      <input type="text" value={formData.seo_title} onChange={(e) => onChange('seo_title', e.target.value)} placeholder="e.g. OCN-2024-001" className={inputCls} />
                    </Field>
                  </div>
                </div>

                {/* Labels / Tags */}
                <div>
                  <p className={`${labelCls} mb-2`}>Labels &amp; Tags</p>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))} placeholder="Type a tag and press Enter..." className={inputCls} />
                    <button type="button" onClick={() => addTag(tagInput)} disabled={!tagInput.trim()} className="px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 cursor-pointer disabled:opacity-40 whitespace-nowrap">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SUGGESTED_TAGS.filter((t) => !customTags.includes(t)).map((t) => (
                      <button key={t} type="button" onClick={() => addTag(t)} className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-[#b8965a] hover:text-[#b8965a] transition-colors cursor-pointer whitespace-nowrap">+ {t}</button>
                    ))}
                  </div>
                  {customTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {customTags.map((t) => (
                        <span key={t} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#b8965a]/10 text-[#b8965a] rounded-full">
                          <i className="ri-price-tag-3-line text-xs" />{t}
                          <button type="button" onClick={() => removeTag(t)} className="ml-0.5 hover:text-red-500 cursor-pointer"><i className="ri-close-line text-xs" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── 3. FEATURES ── */}
          <div ref={setSectionRef('features')}>
            <SectionCard id="features" title="Features" icon="ri-list-check">
              <div className="space-y-5">
                <div>
                  <p className={`${labelCls} mb-2`}>Amenities &amp; Features <span className="normal-case font-normal text-gray-400">({formData.amenities.length} selected)</span></p>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(amenityInput))} placeholder="Type a custom amenity and press Enter..." className={inputCls} />
                    <button type="button" onClick={() => addAmenity(amenityInput)} disabled={!amenityInput.trim()} className="px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 cursor-pointer disabled:opacity-40 whitespace-nowrap">Add</button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_AMENITIES.filter((a) => !formData.amenities.includes(a)).map((a) => (
                        <button key={a} type="button" onClick={() => addAmenity(a)} className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-[#b8965a] hover:text-[#b8965a] transition-colors cursor-pointer whitespace-nowrap">+ {a}</button>
                      ))}
                    </div>
                  </div>
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 mt-3">
                      {formData.amenities.map((a) => (
                        <span key={a} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#b8965a]/10 text-[#b8965a] rounded-full">
                          <i className="ri-check-line text-xs" />{a}
                          <button type="button" onClick={() => removeAmenity(a)} className="ml-1 hover:text-red-500 cursor-pointer"><i className="ri-close-line text-xs" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── 4. MEDIA ── */}
          <div ref={setSectionRef('media')}>
            <SectionCard id="media" title="Media" icon="ri-image-2-line">
              <MediaUploader
                images={formData.images}
                onChange={onImagesChange}
                videoUrl={formData.video_url ?? ''}
                onVideoUrlChange={(url) => onChange('video_url' as keyof ListingFormData, url)}
                floorPlanUrl={formData.floor_plan_url ?? ''}
                onFloorPlanUrlChange={(url) => onChange('floor_plan_url' as keyof ListingFormData, url)}
              />
            </SectionCard>
          </div>

          {/* ── 5. LOCATION ── */}
          <div ref={setSectionRef('location')}>
            <SectionCard id="location" title="Location" icon="ri-map-pin-2-line">
              <div className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Field label="Country">
                    <input type="text" value={formData.country} onChange={(e) => onChange('country', e.target.value)} placeholder="e.g. Kenya" className={inputCls} />
                  </Field>
                  <Field label="City">
                    <input type="text" value={formData.city} onChange={(e) => onChange('city', e.target.value)} placeholder="e.g. Nairobi" className={inputCls} />
                  </Field>
                  <Field label="Area / Location" required hint="Shown on property card">
                    <input type="text" value={formData.location} onChange={(e) => onChange('location', e.target.value)} placeholder="e.g. Kilimani" className={inputCls} />
                  </Field>
                  <Field label="Neighborhood">
                    <select value={formData.neighborhood_id} onChange={(e) => onChange('neighborhood_id', e.target.value)} className={selectCls}>
                      <option value="">Select neighborhood...</option>
                      {neighborhoods.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Full Address">
                  <input type="text" value={formData.address} onChange={(e) => onChange('address', e.target.value)} placeholder="e.g. Plot 24, Acacia Avenue, Kilimani" className={inputCls} />
                </Field>

                <Field label="Display Location Label" hint="Override the location text shown to visitors. Leave blank to use Area above.">
                  <input type="text" value={formData.price_note} onChange={(e) => onChange('price_note', e.target.value)} placeholder="e.g. Kilimani, Nairobi — Kenya" className={inputCls} />
                </Field>

                {/* Coordinates */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className={`${labelCls} mb-3 flex items-center gap-1.5`}>
                    <i className="ri-crosshair-2-line text-[#b8965a]" />
                    Map Coordinates <span className="normal-case font-normal text-gray-400">— optional</span>
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Field label="Latitude" hint="e.g. -1.2921">
                      <input type="text" placeholder="-1.2921" className={inputCls} />
                    </Field>
                    <Field label="Longitude" hint="e.g. 36.8219">
                      <input type="text" placeholder="36.8219" className={inputCls} />
                    </Field>
                  </div>
                  <div className="h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <i className="ri-map-2-line text-2xl text-gray-300 mb-1" />
                      <p className="text-xs text-gray-400">Map preview — enter coordinates above</p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── 6. PROPERTY SETTINGS ── */}
          <div ref={setSectionRef('settings')}>
            <SectionCard id="settings" title="Property Settings" icon="ri-settings-3-line">
              <div className="space-y-6">
                {/* Agent */}
                <div>
                  <p className={`${labelCls} mb-2`}>Agent Assignment</p>
                  <select value={formData.agent_id} onChange={(e) => onChange('agent_id', e.target.value)} className={selectCls}>
                    <option value="">No agent assigned</option>
                    {agents.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                  </select>
                </div>

                {/* Toggles */}
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  <div className="px-4">
                    <Toggle value={formData.featured} onChange={() => onChange('featured', !formData.featured)} label="Featured Property" hint="Appears in homepage hero and search highlights" />
                  </div>
                  <div className="px-4">
                    <Toggle value={formData.published} onChange={() => onChange('published', !formData.published)} label="Published" hint="Visible to the public on the website" />
                  </div>
                  <div className="px-4">
                    <Toggle value={formData.furnished} onChange={() => onChange('furnished', !formData.furnished)} label="Furnished" hint="Property comes with furniture" />
                  </div>
                </div>

                {/* SEO */}
                <div>
                  <p className={`${labelCls} mb-3`}>SEO Settings</p>
                  <div className="space-y-4">
                    <Field label="SEO Title" hint="If blank, the property title will be used">
                      <input type="text" value={formData.seo_description} onChange={(e) => onChange('seo_description', e.target.value)} placeholder="Override the page title tag..." maxLength={70} className={inputCls} />
                      <p className="text-xs text-right text-gray-400 mt-1">{formData.seo_description.length}/70</p>
                    </Field>
                    <Field label="SEO Meta Description">
                      <textarea value={formData.seo_description} onChange={(e) => onChange('seo_description', e.target.value)} rows={3} placeholder="A compelling description for search engines..." maxLength={160} className={`${inputCls} resize-none`} />
                      <p className="text-xs text-right text-gray-400 mt-1">{formData.seo_description.length}/160</p>
                    </Field>
                  </div>
                </div>

                {/* Card display */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className={labelCls}>Card Display Settings</p>
                    <button type="button" onClick={() => {
                      const allOn = Object.values(formData.card_display).every((v) => v);
                      const updated = Object.keys(formData.card_display).reduce((acc, k) => ({ ...acc, [k]: !allOn }), {} as CardDisplaySettings);
                      onChange('card_display', updated);
                    }} className="text-xs font-semibold text-[#b8965a] hover:text-[#a07840] cursor-pointer">
                      {Object.values(formData.card_display).every((v) => v) ? 'Hide All' : 'Show All'}
                    </button>
                  </div>
                  <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                    {[
                      { key: 'show_price', label: 'Price' },
                      { key: 'show_property_type', label: 'Property Type' },
                      { key: 'show_badges', label: 'Status Badges' },
                      { key: 'show_location', label: 'Location' },
                      { key: 'show_meta', label: 'Beds · Baths · Parking' },
                    ].map((f) => (
                      <div key={f.key} className="flex items-center justify-between px-4 py-3">
                        <p className="text-sm text-gray-700">{f.label}</p>
                        <button type="button" onClick={() => onChange('card_display', { ...formData.card_display, [f.key]: !formData.card_display[f.key as keyof CardDisplaySettings] })}
                          className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${formData.card_display[f.key as keyof CardDisplaySettings] ? 'bg-[#b8965a]' : 'bg-gray-200'}`}>
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.card_display[f.key as keyof CardDisplaySettings] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-5 bg-primary rounded-xl text-white">
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2 opacity-70">
                    <i className="ri-file-list-line" />Property Summary
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    {[
                      { label: 'Title', value: formData.title || 'Not set' },
                      { label: 'Type', value: formData.property_type },
                      { label: 'Location', value: formData.location || 'Not set' },
                      { label: 'Price', value: formData.price ? `${formData.currency} ${formData.price}` : 'Not set' },
                      { label: 'Bedrooms', value: formData.bedrooms },
                      { label: 'Bathrooms', value: formData.bathrooms },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-white/50 text-xs">{label}</span>
                        <p className="font-medium truncate">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Bottom publish bar */}
          <div className="flex items-center justify-between pt-2 pb-4">
            <button type="button" onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">Cancel</button>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => onSave('hidden')} disabled={saving} className="px-5 py-2.5 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-white font-medium cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors">
                {saving ? 'Saving…' : 'Save as Draft'}
              </button>
              <button type="button" onClick={() => onSave('available')} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm bg-[#b8965a] text-white rounded-lg hover:bg-[#a07840] font-semibold cursor-pointer disabled:opacity-40 whitespace-nowrap transition-colors">
                {saving ? 'Publishing…' : isEdit ? 'Save Changes' : 'Publish Property'}
                <i className="ri-check-line text-xs" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
