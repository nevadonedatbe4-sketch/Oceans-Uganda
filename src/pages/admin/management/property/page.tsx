import { useState } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

type Tab = 'general' | 'fields' | 'display';

const REQUIRED_FIELDS = [
  { key: 'req_listing_title', label: 'Title' },
  { key: 'req_field_type', label: 'Property Type' },
  { key: 'req_listing_status', label: 'Status (Sale/Rent)' },
  { key: 'req_field_label', label: 'Property Label' },
  { key: 'req_listing_price', label: 'Sale / Rent Price' },
  { key: 'req_field_second_price', label: 'Second Price' },
  { key: 'req_field_prop_id', label: 'Property ID' },
  { key: 'req_field_bedrooms', label: 'Bedrooms' },
  { key: 'req_field_rooms', label: 'Rooms' },
  { key: 'req_field_bathrooms', label: 'Bathrooms' },
  { key: 'req_field_area_size', label: 'Area Size' },
  { key: 'req_field_land_area', label: 'Land Area' },
  { key: 'req_field_garages', label: 'Garages' },
  { key: 'req_field_year_built', label: 'Year Built' },
  { key: 'req_field_energy_class', label: 'Energy Class' },
  { key: 'req_field_map_address', label: 'Map Address' },
  { key: 'req_field_country', label: 'Country' },
  { key: 'req_field_state', label: 'State / Region' },
  { key: 'req_field_city', label: 'City' },
  { key: 'req_field_area', label: 'Area / Neighborhood' },
  { key: 'req_listing_description', label: 'Description' },
  { key: 'req_listing_location', label: 'Full Address' },
  { key: 'req_listing_photos', label: 'Photos (at least 1)' },
  { key: 'req_listing_agent', label: 'Assigned Agent' },
];

export default function PropertyManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('property_settings');
  const [tab, setTab] = useState<Tab>('general');

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" /></div>;

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'general', label: 'General', icon: 'ri-settings-3-line' },
    { key: 'fields', label: 'Required Fields', icon: 'ri-checkbox-circle-line' },
    { key: 'display', label: 'Card Display', icon: 'ri-layout-2-line' },
  ];

  const titleLen = parseInt(get('prop_title_char_limit', '80'), 10);

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader icon="ri-building-2-line" title="Property Settings" description="Control listing defaults, field requirements, price labelling, and card display behaviour." />

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${tab === t.key ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            <i className={`${t.icon} text-sm`} />{t.label}
          </button>
        ))}
      </div>

      {/* GENERAL TAB */}
      {tab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Title & ID Controls</h3>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-stone-700 block">Property Title Character Limit</label>
              <div className="flex items-center gap-3">
                <input type="range" min={40} max={200} value={titleLen} onChange={e => update('prop_title_char_limit', e.target.value)} className="flex-1 accent-[#1B4332]" />
                <span className="w-12 text-center text-sm font-semibold text-[#1B4332] tabular-nums">{titleLen}</span>
              </div>
              <p className="text-xs text-stone-400">Admin warning shown when title exceeds this limit. Recommended: 60–80 characters.</p>
            </div>
            <SettingField label="Property ID Behavior" type="select" value={get('prop_id_behavior', 'auto')}
              onChange={v => update('prop_id_behavior', v)}
              options={[{ value: 'auto', label: 'Auto-generate (sequential)' }, { value: 'manual', label: 'Manual entry by admin' }, { value: 'slug', label: 'Use slug as ID' }]} />
            <SettingField label="Slug Generation Rule" type="select" value={get('prop_slug_rule', 'title')}
              onChange={v => update('prop_slug_rule', v)}
              options={[{ value: 'title', label: 'From title only (e.g. 4br-villa-kololo)' }, { value: 'id', label: 'From ID only' }, { value: 'title-id', label: 'Title + ID (e.g. 4br-villa-kololo-1024)' }]} />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Status & Gallery Defaults</h3>
            <SettingField label="Default Listing Status" type="select" value={get('prop_default_status', 'for-sale')}
              onChange={v => update('prop_default_status', v)}
              options={[{ value: 'for-sale', label: 'For Sale' }, { value: 'for-rent', label: 'For Rent' }, { value: 'draft', label: 'Draft (unpublished)' }]} />
            <SettingField label="Minimum Gallery Images Required" type="number" value={get('prop_gallery_min_images', '1')} onChange={v => update('prop_gallery_min_images', v)} min={0} max={20} unit="images" hint="Warn admin if they try to publish with fewer than this many photos." />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Watermarking</h3>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <i className="ri-information-line text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-700/80">
                Watermarks are applied to all property images shown on the detail page only. Listing previews (search results, homepage, cards) will not be watermarked.
              </p>
            </div>
            <SettingField label="Enable Watermarks" type="toggle" value={get('watermark_enabled', 'false')} onChange={v => update('watermark_enabled', v)} />
            <SettingField label="Watermark Text" value={get('watermark_text', '')} onChange={v => update('watermark_text', v)} placeholder="e.g. oceans.co.ug" hint="Text shown on every property detail image." />
            <SettingField
              label="Watermark Position"
              type="select"
              value={get('watermark_position', 'bottom-right')}
              onChange={v => update('watermark_position', v)}
              options={[
                { value: 'bottom-right', label: 'Bottom Right — small corner badge' },
                { value: 'bottom-left', label: 'Bottom Left — small corner badge' },
                { value: 'center', label: 'Center — large centered text' },
                { value: 'diagonal', label: 'Diagonal — tiled across entire image' },
              ]}
              hint="Where the watermark appears on each property image."
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Price Labels</h3>
            <SettingField label="Price Label" value={get('prop_price_label', 'Price')} onChange={v => update('prop_price_label', v)} placeholder="Price" hint='Shown before the price on listing cards. E.g. "Price", "Starting From", "Asking Price".' />
            <SettingField label="After Price Label" value={get('prop_price_after_label', '')} onChange={v => update('prop_price_after_label', v)} placeholder="/month" hint='Shown after the price. Leave blank for sale listings. Use "/month" for rentals.' />
          </div>
        </div>
      )}

      {/* REQUIRED FIELDS TAB */}
      {tab === 'fields' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-lg px-4 py-3">
            <i className="ri-information-line text-[#1B4332] mt-0.5 shrink-0" />
            <p className="text-sm text-[#1B4332]/80">
              Required fields prevent a listing from being published until they are filled. Toggle each field to enforce it as mandatory.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="grid grid-cols-1 gap-0">
              {REQUIRED_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
                  <span className="text-sm text-stone-700">{f.label}</span>
                  <button
                    type="button"
                    onClick={() => update(f.key, get(f.key, 'false') === 'true' ? 'false' : 'true')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${get(f.key, 'false') === 'true' ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${get(f.key, 'false') === 'true' ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DISPLAY TAB */}
      {tab === 'display' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Card Layout</h3>
            <SettingField label="Cards Per Row (Desktop)" type="select" value={get('prop_cards_per_row_desktop', '3')} onChange={v => update('prop_cards_per_row_desktop', v)}
              options={[{ value: '2', label: '2 per row' }, { value: '3', label: '3 per row' }, { value: '4', label: '4 per row' }]} />
            <SettingField label="Gallery Style" type="select" value={get('prop_gallery_style', 'slider')} onChange={v => update('prop_gallery_style', v)}
              options={[{ value: 'slider', label: 'Slider / Carousel' }, { value: 'grid', label: 'Photo Grid' }, { value: 'masonry', label: 'Masonry Grid' }]} />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Card Info Visibility</h3>
            <SettingField label="Show Price" type="toggle" value={get('prop_show_price', 'true')} onChange={v => update('prop_show_price', v)} />
            <SettingField label="Show Agent" type="toggle" value={get('prop_show_agent', 'true')} onChange={v => update('prop_show_agent', v)} />
            <SettingField label="Show Listed Date" type="toggle" value={get('prop_show_date', 'true')} onChange={v => update('prop_show_date', v)} />
            <SettingField label="Show View Count" type="toggle" value={get('prop_show_views', 'true')} onChange={v => update('prop_show_views', v)} />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Badges</h3>
            <SettingField label='Show NEW badge (listings &lt; 7 days)' type="toggle" value={get('prop_show_badge_new', 'true')} onChange={v => update('prop_show_badge_new', v)} />
            <SettingField label="Show FEATURED badge" type="toggle" value={get('prop_show_badge_featured', 'true')} onChange={v => update('prop_show_badge_featured', v)} />
            <SettingField label="Show PRICE REDUCED badge" type="toggle" value={get('prop_show_badge_reduced', 'true')} onChange={v => update('prop_show_badge_reduced', v)} />
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
