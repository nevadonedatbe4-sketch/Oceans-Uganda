import { useCallback } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

interface DetailSection {
  id: string;
  label: string;
  enabled: boolean;
  order: number;
}

const BREADCRUMB_STYLES = [
  { value: 'type', label: 'Property Type (e.g. Villa)' },
  { value: 'status', label: 'Property Status (e.g. For Sale)' },
  { value: 'status-type', label: 'Status + Type (e.g. For Sale › Villa)' },
  { value: 'city', label: 'City only (e.g. Kampala)' },
  { value: 'area', label: 'Area only (e.g. Kololo)' },
  { value: 'city-area', label: 'City + Area (e.g. Kampala › Kololo)' },
];

function ColorInput({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const safe = value?.startsWith('#') ? value : '#ffffff';
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-stone-700 block">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" value={safe} onChange={e => onChange(e.target.value)} className="w-9 h-9 rounded border border-stone-200 p-0.5 cursor-pointer shrink-0" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="#FFFFFF" className="flex-1 border border-stone-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1B4332] transition-colors" />
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

export default function PropertyDetailsPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('property_details');

  const sections: DetailSection[] = useCallback((): DetailSection[] => {
    try {
      const parsed = JSON.parse(get('prop_detail_sections', '[]'));
      return Array.isArray(parsed) ? [...parsed].sort((a, b) => a.order - b.order) : [];
    } catch { return []; }
  }, [get])();

  const updateSections = (items: DetailSection[]) => {
    update('prop_detail_sections', JSON.stringify(items));
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const arr = [...sections];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx].order, arr[swap].order] = [arr[swap].order, arr[idx].order];
    updateSections(arr);
  };

  const toggleSection = (idx: number) => {
    const arr = sections.map((s, i) => i === idx ? { ...s, enabled: !s.enabled } : s);
    updateSections(arr);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader icon="ri-article-line" title="Property Details & Breadcrumbs" description="Control which sections appear on property detail pages, reorder them, and configure breadcrumb display." />

      {/* Module Styling */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Module Appearance</h3>
        <ColorInput label="Module Background Color" value={get('prop_detail_module_bg', '#FFFFFF')} onChange={v => update('prop_detail_module_bg', v)} hint="Background of each content block on the property detail page." />
        <ColorInput label="Module Border Color" value={get('prop_detail_border_color', '#E5E7EB')} onChange={v => update('prop_detail_border_color', v)} />
      </div>

      {/* Section Order */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Order & Visibility</h3>
          <span className="text-xs text-stone-400">{sections.filter(s => s.enabled).length} of {sections.length} visible</span>
        </div>
        <p className="text-xs text-stone-400">Reorder sections using the arrows. Toggle the switch to show or hide each section.</p>
        {sections.map((section, idx) => (
          <div key={section.id} className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors ${section.enabled ? 'border-[#1B4332]/15 bg-[#1B4332]/3' : 'border-stone-100 bg-[#f5f5f5]'}`}>
            <div className="flex flex-col gap-0.5 shrink-0">
              <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="w-5 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer"><i className="ri-arrow-up-s-line text-xs" /></button>
              <button onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1} className="w-5 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer"><i className="ri-arrow-down-s-line text-xs" /></button>
            </div>
            <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-400 shrink-0">{idx + 1}</span>
            <i className="ri-drag-move-2-line text-stone-300 text-sm shrink-0" />
            <span className={`flex-1 text-sm font-medium ${section.enabled ? 'text-stone-800' : 'text-stone-400'}`}>{section.label}</span>
            <button
              onClick={() => toggleSection(idx)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${section.enabled ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${section.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Breadcrumb Settings</h3>
        <SettingField
          label="Enable Breadcrumbs"
          type="toggle"
          value={get('breadcrumb_enabled', 'true') ?? 'true'}
          onChange={v => update('breadcrumb_enabled', v)}
          hint="Master toggle for all breadcrumbs."
        />
        <SettingField
          label="Breadcrumb Style"
          type="select"
          value={get('breadcrumb_style', 'type')}
          onChange={v => update('breadcrumb_style', v)}
          options={BREADCRUMB_STYLES}
          hint="Controls the middle segment of the breadcrumb trail on property pages."
        />
        {/* Live breadcrumb preview */}
        <div className="bg-[#f5f5f5] rounded-lg px-4 py-3">
          <p className="text-xs text-stone-400 mb-2">Preview</p>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-[#1B4332]">{get('breadcrumb_custom_home_label', 'Home')}</span>
            <span className="text-stone-300">{get('breadcrumb_separator', '/')}</span>
            <span className="text-[#1B4332]">{get('breadcrumb_custom_listings_label', 'Properties')}</span>
            <span className="text-stone-300">{get('breadcrumb_separator', '/')}</span>
            {get('breadcrumb_style', 'type') === 'city' && <><span className="text-[#1B4332]">Kampala</span><span className="text-stone-300">{get('breadcrumb_separator', '/')}</span></>}
            {get('breadcrumb_style', 'type') === 'city-area' && <><span className="text-[#1B4332]">Kampala</span><span className="text-stone-300">{get('breadcrumb_separator', '/')}</span><span className="text-[#1B4332]">Kololo</span><span className="text-stone-300">{get('breadcrumb_separator', '/')}</span></>}
            {get('breadcrumb_style', 'type') === 'area' && <><span className="text-[#1B4332]">Kololo</span><span className="text-stone-300">{get('breadcrumb_separator', '/')}</span></>}
            {(get('breadcrumb_style', 'type') === 'type' || get('breadcrumb_style', 'type') === 'status-type') && <><span className="text-[#1B4332]">Villa</span><span className="text-stone-300">{get('breadcrumb_separator', '/')}</span></>}
            {(get('breadcrumb_style', 'type') === 'status' || get('breadcrumb_style', 'type') === 'status-type') && <><span className="text-[#1B4332]">For Sale</span><span className="text-stone-300">{get('breadcrumb_separator', '/')}</span></>}
            <span className="text-stone-600 font-medium">4BR Villa — Kololo Hill</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Home Label" value={get('breadcrumb_custom_home_label', 'Home')} onChange={v => update('breadcrumb_custom_home_label', v)} placeholder="Home" />
          <SettingField label="Listings Label" value={get('breadcrumb_custom_listings_label', 'Properties')} onChange={v => update('breadcrumb_custom_listings_label', v)} placeholder="Properties" />
        </div>
        <SettingField
          label="Separator Character"
          type="select"
          value={get('breadcrumb_separator', '/')}
          onChange={v => update('breadcrumb_separator', v)}
          options={[{ value: '/', label: '/ Slash' }, { value: '›', label: '› Angle' }, { value: '»', label: '» Double Angle' }, { value: '·', label: '· Dot' }, { value: '|', label: '| Pipe' }]}
        />
      </div>

      {/* ─── Similar Properties ─── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <i className="ri-layout-grid-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Similar Properties Section</h3>
        </div>
        <p className="text-xs text-stone-400 -mt-2">Control the "You Might Also Like" section shown at the bottom of every property detail page.</p>

        {/* Enable / disable */}
        <SettingField
          label="Show Similar Properties"
          type="toggle"
          value={get('similar_props_enabled', 'true')}
          onChange={v => update('similar_props_enabled', v)}
          hint="Toggle the entire similar properties section on or off."
        />

        {get('similar_props_enabled', 'true') === 'true' && (
          <>
            {/* Section heading */}
            <div className="grid grid-cols-2 gap-4">
              <SettingField
                label="Section Eyebrow"
                value={get('similar_props_eyebrow', 'You Might Also Like')}
                onChange={v => update('similar_props_eyebrow', v)}
                placeholder="You Might Also Like"
                hint="Small label above the heading."
              />
              <SettingField
                label="Section Heading"
                value={get('similar_props_heading', 'Similar Properties')}
                onChange={v => update('similar_props_heading', v)}
                placeholder="Similar Properties"
              />
            </div>

            {/* How many to show */}
            <SettingField
              label="Number of Properties to Show"
              type="number"
              value={get('similar_props_count', '4')}
              onChange={v => update('similar_props_count', v)}
              min={1}
              max={12}
              unit="properties"
              hint="How many similar listings to display (1–12)."
            />

            {/* View mode */}
            <SettingField
              label="Display Layout"
              type="radio"
              value={get('similar_props_view', 'grid')}
              onChange={v => update('similar_props_view', v)}
              options={[
                { value: 'grid', label: 'Grid — cards side by side' },
                { value: 'list', label: 'List — full-width horizontal rows' },
              ]}
            />

            {/* Grid columns (only relevant for grid) */}
            {get('similar_props_view', 'grid') === 'grid' && (
              <SettingField
                label="Grid Columns (desktop)"
                type="select"
                value={get('similar_props_cols', '4')}
                onChange={v => update('similar_props_cols', v)}
                options={[
                  { value: '2', label: '2 columns' },
                  { value: '3', label: '3 columns' },
                  { value: '4', label: '4 columns' },
                ]}
                hint="Number of columns on large screens. Automatically stacks on mobile."
              />
            )}

            {/* Match criteria */}
            <SettingField
              label="Match By"
              type="select"
              value={get('similar_props_match', 'purpose')}
              onChange={v => update('similar_props_match', v)}
              options={[
                { value: 'purpose', label: 'Same purpose (Sale / Rent)' },
                { value: 'type', label: 'Same property type' },
                { value: 'location', label: 'Same location / area' },
                { value: 'purpose_type', label: 'Same purpose + property type' },
              ]}
              hint="How to find similar listings to recommend."
            />

            {/* Featured only */}
            <SettingField
              label="Featured Listings Only"
              type="toggle"
              value={get('similar_props_featured_only', 'false')}
              onChange={v => update('similar_props_featured_only', v)}
              hint="When on, only featured listings will appear in this section."
            />

            {/* Live preview badge */}
            <div className="bg-[#f5f5f5] rounded-lg px-4 py-3 flex items-center gap-3">
              <i className="ri-eye-line text-stone-400 text-sm shrink-0" />
              <p className="text-xs text-stone-500">
                Showing up to <strong className="text-stone-700">{get('similar_props_count', '4')}</strong> properties in{' '}
                <strong className="text-stone-700">{get('similar_props_view', 'grid') === 'grid' ? `${get('similar_props_cols', '4')}-column grid` : 'list'}</strong> layout,
                matched by <strong className="text-stone-700">
                  {({ purpose: 'same purpose', type: 'property type', location: 'location', purpose_type: 'purpose + type' } as Record<string, string>)[get('similar_props_match', 'purpose')] ?? 'same purpose'}
                </strong>.
                {get('similar_props_featured_only', 'false') === 'true' && ' Featured only.'}
              </p>
            </div>
          </>
        )}
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
