import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';
import SettingField from '../components/SettingField';

interface ComponentSetting {
  id: string;
  component_type: string;
  variant: string;
  settings_json: Record<string, unknown>;
  is_active: boolean;
}

const COMPONENT_TYPES = [
  { key: 'property_card', label: 'Property Card', icon: 'ri-layout-grid-2-line' },
  { key: 'hero', label: 'Hero Section', icon: 'ri-image-2-line' },
  { key: 'cta_block', label: 'CTA Block', icon: 'ri-megaphone-line' },
  { key: 'navbar', label: 'Navbar', icon: 'ri-menu-line' },
  { key: 'footer', label: 'Footer', icon: 'ri-layout-bottom-2-line' },
];

function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-stone-50 last:border-0">
      <div>
        <p className="text-sm text-stone-700 font-medium">{label}</p>
        {hint && <p className="text-[11px] text-stone-400 mt-0.5">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 shrink-0 transition-colors cursor-pointer ${checked ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
        style={{ borderRadius: '10px' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white transition-transform"
          style={{ borderRadius: '8px', transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
}

function TextInput({ label, value, onChange, hint, placeholder }: { label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
      />
      {hint && <p className="text-[11px] text-stone-400">{hint}</p>}
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, unit, hint }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
        />
        {unit && <span className="text-xs text-stone-400">{unit}</span>}
      </div>
      {hint && <p className="text-[11px] text-stone-400">{hint}</p>}
    </div>
  );
}

// ── Property Card Settings Panel ─────────────────────────────────────────────
function PropertyCardPanel({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const s = settings;
  const set = (key: string, val: unknown) => onChange({ ...s, [key]: val });
  const bool = (key: string, def = true) => (s[key] === undefined ? def : Boolean(s[key]));
  const str = (key: string, def = '') => String(s[key] ?? def);
  const num = (key: string, def = 0) => Number(s[key] ?? def);

  return (
    <div className="space-y-6">
      {/* Display Fields */}
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Display Fields</h4>
        <div className="space-y-0">
          <Toggle label="Show Price" checked={bool('show_price')} onChange={(v) => set('show_price', v)} hint="Display the property price prominently." />
          <Toggle label="Show Property Type" checked={bool('show_property_type')} onChange={(v) => set('show_property_type', v)} hint="Show Apartment / House / Villa label." />
          <Toggle label="Show Location" checked={bool('show_location')} onChange={(v) => set('show_location', v)} hint="Show neighbourhood / area name." />
          <Toggle label="Show Bedrooms" checked={bool('show_beds')} onChange={(v) => set('show_beds', v)} />
          <Toggle label="Show Bathrooms" checked={bool('show_baths')} onChange={(v) => set('show_baths', v)} />
          <Toggle label="Show Parking" checked={bool('show_parking')} onChange={(v) => set('show_parking', v)} />
          <Toggle label="Show Size (sqm/sqft)" checked={bool('show_size', false)} onChange={(v) => set('show_size', v)} />
          <Toggle label="Show Status Badge (For Sale / For Rent)" checked={bool('show_badge')} onChange={(v) => set('show_badge', v)} />
          <Toggle label="Show Featured Label" checked={bool('show_featured_label')} onChange={(v) => set('show_featured_label', v)} />
          <Toggle label="Show Listing Date" checked={bool('show_listing_date', false)} onChange={(v) => set('show_listing_date', v)} />
        </div>
      </div>

      {/* Action Buttons */}
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Action Buttons</h4>
        <div className="space-y-0">
          <Toggle label="Show Call Button" checked={bool('show_call_button')} onChange={(v) => set('show_call_button', v)} />
          <Toggle label="Show Email Button" checked={bool('show_email_button', false)} onChange={(v) => set('show_email_button', v)} />
          <Toggle label="Show Favourite Button" checked={bool('show_favorite')} onChange={(v) => set('show_favorite', v)} />
          <Toggle label="Show Compare Button" checked={bool('show_compare')} onChange={(v) => set('show_compare', v)} />
          <Toggle label="Show Quick Preview Button" checked={bool('show_preview')} onChange={(v) => set('show_preview', v)} />
        </div>
      </div>

      {/* Button Labels */}
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Button Labels</h4>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Call Button Label" value={str('call_label', 'Call')} onChange={(v) => set('call_label', v)} placeholder="Call" />
          <TextInput label="Email Button Label" value={str('email_label', 'Email')} onChange={(v) => set('email_label', v)} placeholder="Email" />
          <TextInput label="View Button Label" value={str('view_label', 'View Property')} onChange={(v) => set('view_label', v)} placeholder="View Property" />
          <TextInput label="Enquire Button Label" value={str('enquire_label', 'Enquire')} onChange={(v) => set('enquire_label', v)} placeholder="Enquire" />
        </div>
      </div>

      {/* Card Style */}
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Card Style</h4>
        <div className="grid grid-cols-2 gap-4">
          <NumberInput label="Image Height" value={num('image_height', 210)} onChange={(v) => set('image_height', v)} min={140} max={400} unit="px" hint="Height of the property image area." />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">Card Style</label>
            <select
              value={str('card_style', 'sharp')}
              onChange={(e) => set('card_style', e.target.value)}
              className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] cursor-pointer"
            >
              <option value="sharp">Sharp (no radius)</option>
              <option value="rounded">Rounded (8px)</option>
              <option value="pill">Pill (16px)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Live Card Preview</h4>
        <div
          className="overflow-hidden max-w-[260px] border border-stone-200 bg-white"
          style={{ borderRadius: str('card_style', 'sharp') === 'sharp' ? '0' : str('card_style') === 'pill' ? '16px' : '8px' }}
        >
          <div className="relative overflow-hidden" style={{ height: `${num('image_height', 210)}px` }}>
            <img
              src="https://readdy.ai/api/search-image?query=modern%20luxury%20apartment%20interior%20living%20room%20elegant%20minimal%20design%20bright%20natural%20light%20Kampala%20Uganda&width=520&height=320&seq=comp-card-preview&orientation=landscape"
              alt="preview"
              className="w-full h-full object-cover object-top"
            />
            {bool('show_badge') && (
              <div className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: '#1a6b3a' }}>
                FOR SALE
              </div>
            )}
            {bool('show_featured_label') && (
              <div className="absolute top-0 left-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: '#c8a951' }}>
                FEATURED
              </div>
            )}
            {bool('show_preview') && (
              <div className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center text-white" style={{ background: 'rgba(0,0,0,0.30)' }}>
                <i className="ri-fullscreen-line text-xs" />
              </div>
            )}
          </div>
          <div className="p-4">
            {bool('show_property_type') && <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">APARTMENT</p>}
            {bool('show_price') && <p className="font-bold text-xl text-stone-900 mb-2">$450,000</p>}
            <h3 className="text-sm font-semibold text-stone-700 mb-2 leading-snug">Luxury 3-Bed Apartment, Kololo</h3>
            {bool('show_location') && (
              <p className="text-xs text-stone-400 flex items-center gap-1 mb-3">
                <i className="ri-map-pin-line text-xs" /> Kololo, Kampala
              </p>
            )}
            {(bool('show_beds') || bool('show_baths') || bool('show_parking')) && (
              <div className="flex items-center gap-3 text-xs text-stone-500 mb-4">
                {bool('show_beds') && <span className="flex items-center gap-1"><i className="ri-hotel-bed-line text-stone-400" /> 3</span>}
                {bool('show_baths') && <span className="flex items-center gap-1"><i className="ri-showers-line text-stone-400" /> 2</span>}
                {bool('show_parking') && <span className="flex items-center gap-1"><i className="ri-car-line text-stone-400" /> 2</span>}
              </div>
            )}
            {bool('show_call_button') && (
              <button className="w-full py-2.5 border border-stone-800 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-2 cursor-pointer">
                {str('call_label', 'Call')}
              </button>
            )}
            {bool('show_email_button') && (
              <button className="w-full py-2.5 border border-stone-300 text-stone-600 text-xs font-semibold uppercase tracking-wider cursor-pointer">
                {str('email_label', 'Email')}
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-stone-400 mt-2">Preview updates live as you change settings.</p>
      </div>
    </div>
  );
}

// ── Hero Settings Panel ───────────────────────────────────────────────────────
function HeroPanel({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const s = settings;
  const set = (key: string, val: unknown) => onChange({ ...s, [key]: val });
  const bool = (key: string, def = true) => (s[key] === undefined ? def : Boolean(s[key]));
  const str = (key: string, def = '') => String(s[key] ?? def);
  const num = (key: string, def = 0) => Number(s[key] ?? def);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Layout</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">Text Alignment</label>
            <select value={str('text_align', 'center')} onChange={(e) => set('text_align', e.target.value)} className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] cursor-pointer">
              <option value="center">Center</option>
              <option value="left">Left</option>
            </select>
          </div>
          <NumberInput label="Overlay Opacity" value={num('overlay_opacity', 50)} onChange={(v) => set('overlay_opacity', v)} min={0} max={90} unit="%" hint="Darkness of the image overlay." />
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Visibility</h4>
        <div className="space-y-0">
          <Toggle label="Show Search Bar" checked={bool('show_search_bar')} onChange={(v) => set('show_search_bar', v)} />
          <Toggle label="Show Stats Strip" checked={bool('show_stats')} onChange={(v) => set('show_stats', v)} hint="Show property count, agents, etc." />
        </div>
      </div>
    </div>
  );
}

// ── Navbar Settings Panel ─────────────────────────────────────────────────────
function NavbarPanel({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const s = settings;
  const set = (key: string, val: unknown) => onChange({ ...s, [key]: val });
  const bool = (key: string, def = true) => (s[key] === undefined ? def : Boolean(s[key]));
  const str = (key: string, def = '') => String(s[key] ?? def);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Behaviour</h4>
        <div className="space-y-0">
          <Toggle label="Sticky Navbar" checked={bool('sticky')} onChange={(v) => set('sticky', v)} hint="Keep navbar fixed at top when scrolling." />
          <Toggle label="Transparent on Hero" checked={bool('transparent_on_hero')} onChange={(v) => set('transparent_on_hero', v)} hint="Start transparent, become solid on scroll." />
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Elements</h4>
        <div className="space-y-0">
          <Toggle label="Show Phone Number" checked={bool('show_phone')} onChange={(v) => set('show_phone', v)} />
          <Toggle label="Show CTA Button" checked={bool('show_cta_button')} onChange={(v) => set('show_cta_button', v)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="CTA Button Label" value={str('cta_label', 'Get Valuation')} onChange={(v) => set('cta_label', v)} />
        <TextInput label="CTA Button Link" value={str('cta_link', '/landlords')} onChange={(v) => set('cta_link', v)} />
      </div>
    </div>
  );
}

// ── CTA Block Panel ───────────────────────────────────────────────────────────
function CtaPanel({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const s = settings;
  const set = (key: string, val: unknown) => onChange({ ...s, [key]: val });
  const bool = (key: string, def = true) => (s[key] === undefined ? def : Boolean(s[key]));
  const str = (key: string, def = '') => String(s[key] ?? def);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">CTA Style</label>
          <select value={str('style', 'dark')} onChange={(e) => set('style', e.target.value)} className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] cursor-pointer">
            <option value="dark">Dark Background</option>
            <option value="light">Light Background</option>
            <option value="golden">Golden Accent</option>
            <option value="image">Image Background</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">Button Style</label>
          <select value={str('button_style', 'outline')} onChange={(e) => set('button_style', e.target.value)} className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] cursor-pointer">
            <option value="outline">Outline</option>
            <option value="solid">Solid</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>
      </div>
      <Toggle label="Show Background Image" checked={bool('show_image', false)} onChange={(v) => set('show_image', v)} hint="Display a background image behind the CTA." />
    </div>
  );
}

// ── Footer Panel ──────────────────────────────────────────────────────────────
function FooterPanel({ settings, onChange }: { settings: Record<string, unknown>; onChange: (s: Record<string, unknown>) => void }) {
  const s = settings;
  const set = (key: string, val: unknown) => onChange({ ...s, [key]: val });
  const bool = (key: string, def = true) => (s[key] === undefined ? def : Boolean(s[key]));
  const num = (key: string, def = 0) => Number(s[key] ?? def);

  return (
    <div className="space-y-6">
      <div className="space-y-0">
        <Toggle label="Show Newsletter Signup" checked={bool('show_newsletter')} onChange={(v) => set('show_newsletter', v)} />
        <Toggle label="Show Social Links" checked={bool('show_social')} onChange={(v) => set('show_social', v)} />
        <Toggle label="Show Sitemap Links" checked={bool('show_sitemap')} onChange={(v) => set('show_sitemap', v)} />
      </div>
      <NumberInput label="Footer Columns" value={num('columns', 4)} onChange={(v) => set('columns', v)} min={2} max={5} hint="Number of columns in the footer grid." />
    </div>
  );
}

export default function ComponentSettingsPage() {
  const [activeType, setActiveType] = useState('property_card');
  const [components, setComponents] = useState<Record<string, ComponentSetting>>({});
  const [localSettings, setLocalSettings] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('component_settings')
      .select('*')
      .eq('variant', 'default');

    if (data) {
      const map: Record<string, ComponentSetting> = {};
      const settingsMap: Record<string, Record<string, unknown>> = {};
      (data as ComponentSetting[]).forEach((c) => {
        map[c.component_type] = c;
        settingsMap[c.component_type] = c.settings_json || {};
      });
      setComponents(map);
      setLocalSettings(settingsMap);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (type: string, settings: Record<string, unknown>) => {
    setLocalSettings((prev) => ({ ...prev, [type]: settings }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const type = activeType;
    const settings = localSettings[type] || {};
    const existing = components[type];

    let error;
    if (existing) {
      ({ error } = await supabase
        .from('component_settings')
        .update({ settings_json: settings, updated_at: new Date().toISOString() })
        .eq('id', existing.id));
    } else {
      ({ error } = await supabase
        .from('component_settings')
        .insert({ component_type: type, variant: 'default', settings_json: settings }));
    }

    setSaving(false);
    if (!error) {
      setSaveStatus('success');
      setDirty(false);
      await load();
    } else {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleReset = () => {
    const existing = components[activeType];
    if (existing) {
      setLocalSettings((prev) => ({ ...prev, [activeType]: existing.settings_json || {} }));
      setDirty(false);
    }
  };

  const currentSettings = localSettings[activeType] || {};
  const activeComp = COMPONENT_TYPES.find((c) => c.key === activeType);

  return (
    <div className="max-w-[820px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-puzzle-2-line"
        title="Component Settings"
        description="Configure reusable components used across the site — property cards, hero sections, CTAs, navbar and footer."
      />

      {/* Component type tabs */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="flex border-b border-stone-100 overflow-x-auto">
          {COMPONENT_TYPES.map((ct) => (
            <button
              key={ct.key}
              onClick={() => { setActiveType(ct.key); setDirty(false); }}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px ${
                activeType === ct.key
                  ? 'border-[#1B4332] text-[#1B4332] bg-[#1B4332]/3'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-[#f5f5f5]'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className={`${ct.icon} text-sm`} />
              </span>
              {ct.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-7 h-7 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/8">
                  <i className={`${activeComp?.icon} text-[#1B4332] text-sm`} />
                </div>
                <h3 className="text-sm font-semibold text-stone-800">{activeComp?.label} Settings</h3>
                {components[activeType] && (
                  <span className="ml-auto px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold uppercase tracking-widest">
                    Saved
                  </span>
                )}
              </div>

              {activeType === 'property_card' && (
                <PropertyCardPanel settings={currentSettings} onChange={(s) => handleChange('property_card', s)} />
              )}
              {activeType === 'hero' && (
                <HeroPanel settings={currentSettings} onChange={(s) => handleChange('hero', s)} />
              )}
              {activeType === 'cta_block' && (
                <CtaPanel settings={currentSettings} onChange={(s) => handleChange('cta_block', s)} />
              )}
              {activeType === 'navbar' && (
                <NavbarPanel settings={currentSettings} onChange={(s) => handleChange('navbar', s)} />
              )}
              {activeType === 'footer' && (
                <FooterPanel settings={currentSettings} onChange={(s) => handleChange('footer', s)} />
              )}
            </>
          )}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={handleSave} onReset={handleReset} />
    </div>
  );
}
