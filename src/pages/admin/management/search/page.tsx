import { useState } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

type Tab = 'appearance' | 'fields' | 'layout' | 'pages';

const ALL_FIELDS = [
  { id: 'location', label: 'Location', key: 'search_field_location' },
  { id: 'price', label: 'Price Range', key: 'search_field_price' },
  { id: 'type', label: 'Property Type', key: 'search_field_type' },
  { id: 'status', label: 'Status (Sale/Rent)', key: 'search_field_status' },
  { id: 'beds', label: 'Bedrooms', key: 'search_field_beds' },
  { id: 'baths', label: 'Bathrooms', key: 'search_field_baths' },
  { id: 'land_size', label: 'Land Size', key: 'search_field_land_size' },
  { id: 'furnished', label: 'Furnished', key: 'search_field_furnished' },
];

const VIEW_OPTIONS = [
  { value: 'grid', label: 'Grid (cards)' },
  { value: 'list', label: 'List (rows)' },
  { value: 'map', label: 'Map View' },
];

const BTN_STYLES = [
  { value: 'solid', label: 'Solid fill' },
  { value: 'outline', label: 'Outline / Border' },
  { value: 'text', label: 'Text only' },
];

function ColorInput({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-stone-700 block">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" value={value?.startsWith('#') ? value : '#ffffff'} onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded border border-stone-200 p-0.5 cursor-pointer shrink-0" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#FFFFFF"
          className="flex-1 border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] transition-colors" />
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

export default function SearchManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('search');
  const [tab, setTab] = useState<Tab>('appearance');

  const fieldOrder: string[] = (() => {
    try { return JSON.parse(get('search_field_order', '[]')); } catch { return ALL_FIELDS.map(f => f.id); }
  })();

  const moveField = (idx: number, dir: -1 | 1) => {
    const arr = [...fieldOrder];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    update('search_field_order', JSON.stringify(arr));
  };

  const orderedFields = fieldOrder.map(id => ALL_FIELDS.find(f => f.id === id)).filter(Boolean) as typeof ALL_FIELDS;

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" /></div>;

  const PAGE_VISIBILITY_ITEMS = [
    { key: 'search_show_on_buy', label: 'Buy / For Sale', description: '/buy — properties for sale listing page', icon: 'ri-home-2-line' },
    { key: 'search_show_on_rent', label: 'Rent / For Rent', description: '/rent — rental properties listing page', icon: 'ri-key-2-line' },
    { key: 'search_show_on_listings', label: 'All Listings', description: '/listings — general listing archive page', icon: 'ri-building-2-line' },
    { key: 'search_show_on_search', label: 'Search Results', description: '/search — search results page', icon: 'ri-search-2-line' },
    { key: 'search_show_on_neighbourhood', label: 'Neighbourhood', description: '/neighbourhood — area detail page', icon: 'ri-map-pin-2-line' },
    { key: 'search_show_on_new_developments', label: 'New Developments', description: '/new-developments — off-plan properties', icon: 'ri-building-4-line' },
    { key: 'search_show_on_all_properties', label: 'All Properties', description: '/all-properties — full property archive', icon: 'ri-list-check-2' },
  ];

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'appearance', label: 'Appearance', icon: 'ri-palette-line' },
    { key: 'fields', label: 'Fields & Order', icon: 'ri-list-settings-line' },
    { key: 'layout', label: 'Layout & View', icon: 'ri-layout-4-line' },
    { key: 'pages', label: 'Page Visibility', icon: 'ri-eye-line' },
  ];

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader icon="ri-search-2-line" title="Search & Filters" description="Control the visual style, active filters, field order, and default layout of the property search experience." />

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${tab === t.key ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            <i className={`${t.icon} text-sm`} />{t.label}
          </button>
        ))}
      </div>

      {/* APPEARANCE TAB */}
      {tab === 'appearance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Background Colors</h3>
            <ColorInput label="Advanced Search Background" value={get('search_bg_advanced', '#FFFFFF')} onChange={v => update('search_bg_advanced', v)} hint="Background of the expanded advanced search panel." />
            <ColorInput label="Half-Map Search Background" value={get('search_bg_halfmap', '#F5F5F0')} onChange={v => update('search_bg_halfmap', v)} hint="Background of the filter panel in half-map layout." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Input Field Styling</h3>
            <ColorInput label="Field Border Color" value={get('search_field_border_color', '#E5E7EB')} onChange={v => update('search_field_border_color', v)} />
            <ColorInput label="Placeholder Text Color" value={get('search_placeholder_color', '#9CA3AF')} onChange={v => update('search_placeholder_color', v)} />
            <ColorInput label="Input Text Color" value={get('search_text_color', '#1C1C1C')} onChange={v => update('search_text_color', v)} />
            <SettingField label="Field Padding" type="number" value={get('search_field_padding', '12')} onChange={v => update('search_field_padding', v)} unit="px" min={4} max={32} />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Search Button</h3>
            <ColorInput label="Button Background" value={get('search_btn_bg', '#1B4332')} onChange={v => update('search_btn_bg', v)} />
            <ColorInput label="Button Hover Background" value={get('search_btn_hover_bg', '#143527')} onChange={v => update('search_btn_hover_bg', v)} />
            <ColorInput label="Button Text Color" value={get('search_btn_text_color', '#FFFFFF')} onChange={v => update('search_btn_text_color', v)} />
            <ColorInput label="Button Border Color" value={get('search_btn_border_color', 'transparent')} onChange={v => update('search_btn_border_color', v)} />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Utility Buttons</h3>
            <ColorInput label="Clear Button Color" value={get('search_clear_btn_color', '#6B7280')} onChange={v => update('search_clear_btn_color', v)} />
            <ColorInput label="Open/Close Toggle Color" value={get('search_open_btn_color', '#1B4332')} onChange={v => update('search_open_btn_color', v)} />
            <SettingField label="Advanced Search Button Style" type="select" value={get('search_advanced_btn_style', 'outline')} onChange={v => update('search_advanced_btn_style', v)} options={BTN_STYLES} />
          </div>
          {/* Live preview block */}
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-2 bg-[#f5f5f5] border-b border-stone-200"><p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Search Bar Preview</p></div>
            <div className="p-5" style={{ background: get('search_bg_advanced', '#FFFFFF') }}>
              <div className="flex gap-2">
                <div className="flex-1 rounded-md px-3 py-2.5 text-sm" style={{ border: `1px solid ${get('search_field_border_color', '#E5E7EB')}`, color: get('search_placeholder_color', '#9CA3AF'), background: '#fff', paddingTop: `${get('search_field_padding', '12')}px`, paddingBottom: `${get('search_field_padding', '12')}px` }}>
                  Search by location, keyword…
                </div>
                <button className="px-5 py-2 rounded-md text-sm font-medium whitespace-nowrap" style={{ background: get('search_btn_bg', '#1B4332'), color: get('search_btn_text_color', '#FFFFFF'), border: `1px solid ${get('search_btn_border_color', 'transparent')}` }}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIELDS TAB */}
      {tab === 'fields' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-2">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Field Visibility & Order</h3>
            <p className="text-xs text-stone-400 mb-4">Toggle fields on/off and use the arrows to reorder them in the search bar.</p>
            {orderedFields.map((field, idx) => (
              <div key={field.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${get(field.key, 'true') === 'true' ? 'border-[#1B4332]/15 bg-[#1B4332]/3' : 'border-stone-200 bg-[#f5f5f5]'}`}>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveField(idx, -1)} disabled={idx === 0} className="w-5 h-4 flex items-center justify-center text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"><i className="ri-arrow-up-s-line text-xs" /></button>
                  <button onClick={() => moveField(idx, 1)} disabled={idx === orderedFields.length - 1} className="w-5 h-4 flex items-center justify-center text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"><i className="ri-arrow-down-s-line text-xs" /></button>
                </div>
                <i className="ri-drag-move-2-line text-stone-300 text-sm" />
                <span className="flex-1 text-sm text-stone-700 font-medium">{field.label}</span>
                <button
                  onClick={() => update(field.key, get(field.key, 'true') === 'true' ? 'false' : 'true')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${get(field.key, 'true') === 'true' ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${get(field.key, 'true') === 'true' ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LAYOUT TAB */}
      {tab === 'layout' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Default Results Layout</h3>
            <SettingField label="Default Results View" type="select" value={get('search_default_view', 'grid')} onChange={v => update('search_default_view', v)} options={VIEW_OPTIONS} hint="The view users see when they first load the search/browse page." />
            <SettingField label="Default Sort Order" type="select" value={get('search_default_sort', 'newest')} onChange={v => update('search_default_sort', v)}
              options={[{ value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' }, { value: 'price_asc', label: 'Price: Low to High' }, { value: 'price_desc', label: 'Price: High to Low' }, { value: 'featured', label: 'Featured First' }]} />
            <SettingField label="Search Results Per Page" type="number" value={get('search_results_per_page', '12')} onChange={v => update('search_results_per_page', v)} min={4} max={48} unit="listings" />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Layout Toggles</h3>
            <SettingField label="Enable Map View Toggle" type="toggle" value={get('search_show_map_view', 'true')} onChange={v => update('search_show_map_view', v)} hint="Adds a Map / Grid toggle in the search results toolbar." />
            <SettingField label="Enable Half-Map Search Layout" type="toggle" value={get('search_halfmap_enabled', 'false')} onChange={v => update('search_halfmap_enabled', v)} hint="Side-by-side layout with a map panel and results list." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Price Slider Range (UGX)</h3>
            <div className="grid grid-cols-3 gap-4">
              <SettingField label="Min Price" type="number" value={get('search_min_price_ugx', '0')} onChange={v => update('search_min_price_ugx', v)} unit="UGX" />
              <SettingField label="Max Price" type="number" value={get('search_max_price_ugx', '5000000000')} onChange={v => update('search_max_price_ugx', v)} unit="UGX" />
              <SettingField label="Step" type="number" value={get('search_price_step', '10000000')} onChange={v => update('search_price_step', v)} unit="UGX" />
            </div>
          </div>
        </div>
      )}

      {/* PAGES TAB */}
      {tab === 'pages' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Show Search Bar On</h3>
            <p className="text-xs text-stone-400 mb-4">Choose which inner pages display the sticky search bar. The homepage search bar has been removed — the search bar only appears on the pages you enable below.</p>
            {PAGE_VISIBILITY_ITEMS.map((item) => {
              const isOn = get(item.key, 'true') === 'true';
              return (
                <div key={item.key} className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${isOn ? 'border-[#1B4332]/15 bg-[#1B4332]/3' : 'border-stone-200 bg-[#f5f5f5]'}`}>
                  <span className="w-8 h-8 flex items-center justify-center rounded-md bg-stone-100 shrink-0">
                    <i className={`${item.icon} text-stone-500 text-sm`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isOn ? 'text-stone-800' : 'text-stone-500'}`}>{item.label}</p>
                    <p className="text-xs text-stone-400 font-mono truncate">{item.description}</p>
                  </div>
                  <button
                    onClick={() => update(item.key, isOn ? 'false' : 'true')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${isOn ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isOn ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 flex gap-3">
            <i className="ri-information-line text-amber-500 text-base mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 font-roboto leading-relaxed">
              Turning off a page&apos;s search bar will hide the entire sticky filter strip on that page. Users will still be able to use sidebar filters where available.
            </p>
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
