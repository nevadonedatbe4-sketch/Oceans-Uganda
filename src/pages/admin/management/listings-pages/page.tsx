import { useState } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

type Tab = 'buy' | 'rent' | 'search' | 'layout';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const VIEW_OPTIONS = [
  { value: 'grid', label: 'Grid (cards)' },
  { value: 'list', label: 'List (rows)' },
];

const COLS_OPTIONS = [
  { value: '2', label: '2 columns' },
  { value: '3', label: '3 columns' },
  { value: '4', label: '4 columns' },
];

const FONT_FAMILIES = [
  { value: '', label: 'Site Default' },
  { value: 'Prata', label: 'Prata (Serif)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Sans-serif)' },
  { value: 'Roboto', label: 'Roboto (Sans-serif)' },
  { value: 'Lato', label: 'Lato (Sans-serif)' },
  { value: 'Raleway', label: 'Raleway (Sans-serif)' },
  { value: 'Inter', label: 'Inter (Sans-serif)' },
];

const FONT_WEIGHTS = [
  { value: '300', label: '300 — Light' },
  { value: '400', label: '400 — Regular' },
  { value: '500', label: '500 — Medium' },
  { value: '600', label: '600 — SemiBold' },
  { value: '700', label: '700 — Bold' },
  { value: '800', label: '800 — ExtraBold' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'Normal' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'capitalize', label: 'Capitalize' },
  { value: 'lowercase', label: 'lowercase' },
];

interface HeroTypoBlockProps {
  prefix: string;
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
  previewTitle: string;
  previewSubtitle: string;
  previewEyebrow: string;
}

function HeroTypoBlock({ prefix, get, update, previewTitle, previewSubtitle, previewEyebrow }: HeroTypoBlockProps) {
  return (
    <div className="space-y-6">
      {/* Eyebrow */}
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Eyebrow / Label</p>
        <div className="grid grid-cols-2 gap-3">
          <SettingField label="Font Family" type="select" value={get(`${prefix}_eyebrow_font_family`, '')} onChange={(v) => update(`${prefix}_eyebrow_font_family`, v)} options={FONT_FAMILIES} />
          <SettingField label="Font Weight" type="select" value={get(`${prefix}_eyebrow_font_weight`, '400')} onChange={(v) => update(`${prefix}_eyebrow_font_weight`, v)} options={FONT_WEIGHTS} />
          <SettingField label="Font Size" type="number" value={get(`${prefix}_eyebrow_font_size`, '12')} onChange={(v) => update(`${prefix}_eyebrow_font_size`, v)} unit="px" min={10} max={32} />
          <SettingField label="Letter Spacing" type="number" value={get(`${prefix}_eyebrow_letter_spacing`, '0.3')} onChange={(v) => update(`${prefix}_eyebrow_letter_spacing`, v)} unit="em" />
          <SettingField label="Text Transform" type="select" value={get(`${prefix}_eyebrow_transform`, 'uppercase')} onChange={(v) => update(`${prefix}_eyebrow_transform`, v)} options={TEXT_TRANSFORMS} />
        </div>
      </div>

      <div className="border-t border-stone-100" />

      {/* Title */}
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Hero Title</p>
        <div className="grid grid-cols-2 gap-3">
          <SettingField label="Font Family" type="select" value={get(`${prefix}_title_font_family`, 'Prata')} onChange={(v) => update(`${prefix}_title_font_family`, v)} options={FONT_FAMILIES} />
          <SettingField label="Font Weight" type="select" value={get(`${prefix}_title_font_weight`, '400')} onChange={(v) => update(`${prefix}_title_font_weight`, v)} options={FONT_WEIGHTS} />
          <SettingField label="Font Size" type="number" value={get(`${prefix}_title_font_size`, '48')} onChange={(v) => update(`${prefix}_title_font_size`, v)} unit="px" min={20} max={96} />
          <SettingField label="Letter Spacing" type="number" value={get(`${prefix}_title_letter_spacing`, '0')} onChange={(v) => update(`${prefix}_title_letter_spacing`, v)} unit="em" />
          <SettingField label="Line Height" type="number" value={get(`${prefix}_title_line_height`, '1.1')} onChange={(v) => update(`${prefix}_title_line_height`, v)} placeholder="1.1" />
          <SettingField label="Text Transform" type="select" value={get(`${prefix}_title_transform`, 'none')} onChange={(v) => update(`${prefix}_title_transform`, v)} options={TEXT_TRANSFORMS} />
        </div>
      </div>

      <div className="border-t border-stone-100" />

      {/* Subtitle */}
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Hero Subtitle</p>
        <div className="grid grid-cols-2 gap-3">
          <SettingField label="Font Family" type="select" value={get(`${prefix}_subtitle_font_family`, '')} onChange={(v) => update(`${prefix}_subtitle_font_family`, v)} options={FONT_FAMILIES} />
          <SettingField label="Font Weight" type="select" value={get(`${prefix}_subtitle_font_weight`, '400')} onChange={(v) => update(`${prefix}_subtitle_font_weight`, v)} options={FONT_WEIGHTS} />
          <SettingField label="Font Size" type="number" value={get(`${prefix}_subtitle_font_size`, '14')} onChange={(v) => update(`${prefix}_subtitle_font_size`, v)} unit="px" min={10} max={32} />
          <SettingField label="Letter Spacing" type="number" value={get(`${prefix}_subtitle_letter_spacing`, '0')} onChange={(v) => update(`${prefix}_subtitle_letter_spacing`, v)} unit="em" />
          <SettingField label="Line Height" type="number" value={get(`${prefix}_subtitle_line_height`, '1.5')} onChange={(v) => update(`${prefix}_subtitle_line_height`, v)} placeholder="1.5" />
        </div>
      </div>

      {/* Live preview */}
      <div
        className="rounded-lg overflow-hidden relative"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.6))', minHeight: '120px', padding: '24px' }}
      >
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3">Hero Preview (dark bg)</p>
        <p
          style={{
            fontFamily: get(`${prefix}_eyebrow_font_family`, '') || undefined,
            fontWeight: get(`${prefix}_eyebrow_font_weight`, '400'),
            fontSize: `${get(`${prefix}_eyebrow_font_size`, '12')}px`,
            letterSpacing: `${get(`${prefix}_eyebrow_letter_spacing`, '0.3')}em`,
            textTransform: (get(`${prefix}_eyebrow_transform`, 'uppercase') as 'none' | 'uppercase' | 'capitalize' | 'lowercase'),
            color: '#C9A84C',
            marginBottom: '6px',
          }}
        >
          {previewEyebrow}
        </p>
        <p
          style={{
            fontFamily: get(`${prefix}_title_font_family`, 'Prata') || undefined,
            fontWeight: get(`${prefix}_title_font_weight`, '400'),
            fontSize: `${get(`${prefix}_title_font_size`, '48')}px`,
            letterSpacing: `${get(`${prefix}_title_letter_spacing`, '0')}em`,
            lineHeight: get(`${prefix}_title_line_height`, '1.1'),
            textTransform: (get(`${prefix}_title_transform`, 'none') as 'none' | 'uppercase' | 'capitalize' | 'lowercase'),
            color: '#ffffff',
            marginBottom: '8px',
          }}
        >
          {previewTitle}
        </p>
        <p
          style={{
            fontFamily: get(`${prefix}_subtitle_font_family`, '') || undefined,
            fontWeight: get(`${prefix}_subtitle_font_weight`, '400'),
            fontSize: `${get(`${prefix}_subtitle_font_size`, '14')}px`,
            letterSpacing: `${get(`${prefix}_subtitle_letter_spacing`, '0')}em`,
            lineHeight: get(`${prefix}_subtitle_line_height`, '1.5'),
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {previewSubtitle}
        </p>
      </div>
    </div>
  );
}

// ImagePreviewField now delegates to SettingField image_upload for local file upload support
function ImagePreviewField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <SettingField
      label={label}
      type="image_upload"
      value={value}
      onChange={onChange}
      hint={hint}
    />
  );
}

export default function ListingsPagesManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('listings_pages');
  const [tab, setTab] = useState<Tab>('buy');

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'buy', label: 'Buy Page', icon: 'ri-home-4-line' },
    { key: 'rent', label: 'Rent Page', icon: 'ri-key-2-line' },
    { key: 'search', label: 'Search Page', icon: 'ri-search-2-line' },
    { key: 'layout', label: 'Layout & Defaults', icon: 'ri-layout-4-line' },
  ];

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-layout-grid-line"
        title="Listings Pages"
        description="Control the hero content, filter options, CTA text, and default layout for the Buy, Rent, and Search pages."
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              tab === t.key
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <i className={`${t.icon} text-sm`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* BUY PAGE TAB */}
      {tab === 'buy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Section</h3>
            <SettingField
              label="Eyebrow Text"
              value={get('buy_hero_eyebrow', 'Premium Properties')}
              onChange={(v) => update('buy_hero_eyebrow', v)}
              placeholder="Premium Properties"
              hint="Small label above the main title."
            />
            <SettingField
              label="Hero Title"
              value={get('buy_hero_title', 'Properties For Sale')}
              onChange={(v) => update('buy_hero_title', v)}
              placeholder="Properties For Sale"
            />
            <SettingField
              label="Hero Subtitle"
              type="textarea"
              value={get('buy_hero_subtitle', "Discover exceptional homes across Kampala's most sought-after neighbourhoods.")}
              onChange={(v) => update('buy_hero_subtitle', v)}
              placeholder="Subtitle text..."
            />
            <ImagePreviewField
              label="Hero Background Image URL"
              value={get('buy_hero_image', '')}
              onChange={(v) => update('buy_hero_image', v)}
              hint="Leave blank to use the default image."
            />
          </div>

          {/* Buy Hero Typography */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-font-size text-[#1B4332] text-base" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Typography</h3>
            </div>
            <HeroTypoBlock
              prefix="buy_hero"
              get={get}
              update={update}
              previewEyebrow={get('buy_hero_eyebrow', 'Premium Properties')}
              previewTitle={get('buy_hero_title', 'Properties For Sale')}
              previewSubtitle={get('buy_hero_subtitle', "Discover exceptional homes across Kampala's most sought-after neighbourhoods.")}
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Banner</h3>
            <SettingField
              label="Show CTA Banner"
              type="toggle"
              value={get('buy_show_cta', 'true')}
              onChange={(v) => update('buy_show_cta', v)}
              hint="The 'Thinking of Selling?' banner at the bottom of the page."
            />
            <SettingField
              label="CTA Eyebrow"
              value={get('buy_cta_eyebrow', 'Thinking of Selling?')}
              onChange={(v) => update('buy_cta_eyebrow', v)}
            />
            <SettingField
              label="CTA Title"
              value={get('buy_cta_title', 'Get a Free Property Valuation')}
              onChange={(v) => update('buy_cta_title', v)}
            />
            <SettingField
              label="CTA Subtitle"
              type="textarea"
              value={get('buy_cta_subtitle', 'Our expert agents will assess your property and provide a no-obligation market valuation.')}
              onChange={(v) => update('buy_cta_subtitle', v)}
            />
            <SettingField
              label="CTA Button Label"
              value={get('buy_cta_button', 'Request Valuation')}
              onChange={(v) => update('buy_cta_button', v)}
            />
            <SettingField
              label="CTA Button Link"
              type="url"
              value={get('buy_cta_link', '/landlords')}
              onChange={(v) => update('buy_cta_link', v)}
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Filter Options</h3>
            <SettingField label="Show Property Type Filter" type="toggle" value={get('buy_filter_type', 'true')} onChange={(v) => update('buy_filter_type', v)} />
            <SettingField label="Show Area / Neighbourhood Filter" type="toggle" value={get('buy_filter_area', 'true')} onChange={(v) => update('buy_filter_area', v)} />
            <SettingField label="Show Price Range Filter" type="toggle" value={get('buy_filter_price', 'true')} onChange={(v) => update('buy_filter_price', v)} />
            <SettingField label="Show Bedrooms Filter" type="toggle" value={get('buy_filter_beds', 'true')} onChange={(v) => update('buy_filter_beds', v)} />
          </div>
        </div>
      )}

      {/* RENT PAGE TAB */}
      {tab === 'rent' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Section</h3>
            <SettingField label="Eyebrow Text" value={get('rent_hero_eyebrow', 'Premium Rentals')} onChange={(v) => update('rent_hero_eyebrow', v)} placeholder="Premium Rentals" />
            <SettingField label="Hero Title" value={get('rent_hero_title', 'Properties To Rent')} onChange={(v) => update('rent_hero_title', v)} placeholder="Properties To Rent" />
            <SettingField label="Hero Subtitle" type="textarea" value={get('rent_hero_subtitle', "Find your perfect home across Kampala's most desirable locations.")} onChange={(v) => update('rent_hero_subtitle', v)} />
            <ImagePreviewField label="Hero Background Image URL" value={get('rent_hero_image', '')} onChange={(v) => update('rent_hero_image', v)} hint="Leave blank to use the default image." />
          </div>

          {/* Rent Hero Typography */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-font-size text-[#1B4332] text-base" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Typography</h3>
            </div>
            <HeroTypoBlock
              prefix="rent_hero"
              get={get}
              update={update}
              previewEyebrow={get('rent_hero_eyebrow', 'Premium Rentals')}
              previewTitle={get('rent_hero_title', 'Properties To Rent')}
              previewSubtitle={get('rent_hero_subtitle', "Find your perfect home across Kampala's most desirable locations.")}
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Banner</h3>
            <SettingField label="Show CTA Banner" type="toggle" value={get('rent_show_cta', 'true')} onChange={(v) => update('rent_show_cta', v)} />
            <SettingField label="CTA Eyebrow" value={get('rent_cta_eyebrow', 'Own a Property?')} onChange={(v) => update('rent_cta_eyebrow', v)} />
            <SettingField label="CTA Title" value={get('rent_cta_title', 'List Your Property With Us')} onChange={(v) => update('rent_cta_title', v)} />
            <SettingField label="CTA Subtitle" type="textarea" value={get('rent_cta_subtitle', 'Reach thousands of qualified tenants. Get a free rental assessment from our expert team today.')} onChange={(v) => update('rent_cta_subtitle', v)} />
            <SettingField label="CTA Button Label" value={get('rent_cta_button', 'Get Rental Valuation')} onChange={(v) => update('rent_cta_button', v)} />
            <SettingField label="CTA Button Link" type="url" value={get('rent_cta_link', '/landlords')} onChange={(v) => update('rent_cta_link', v)} />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Filter Options</h3>
            <SettingField label="Show Property Type Filter" type="toggle" value={get('rent_filter_type', 'true')} onChange={(v) => update('rent_filter_type', v)} />
            <SettingField label="Show Area / Neighbourhood Filter" type="toggle" value={get('rent_filter_area', 'true')} onChange={(v) => update('rent_filter_area', v)} />
            <SettingField label="Show Price Range Filter" type="toggle" value={get('rent_filter_price', 'true')} onChange={(v) => update('rent_filter_price', v)} />
            <SettingField label="Show Bedrooms Filter" type="toggle" value={get('rent_filter_beds', 'true')} onChange={(v) => update('rent_filter_beds', v)} />
            <SettingField label="Show Furnished Filter" type="toggle" value={get('rent_filter_furnished', 'true')} onChange={(v) => update('rent_filter_furnished', v)} />
          </div>
        </div>
      )}

      {/* SEARCH PAGE TAB */}
      {tab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Search Hero</h3>
            <SettingField label="Hero Title" value={get('search_page_title', 'Find Your Perfect Property')} onChange={(v) => update('search_page_title', v)} />
            <SettingField label="Search Placeholder Text" value={get('search_placeholder_text', 'Search by title, area, or type...')} onChange={(v) => update('search_placeholder_text', v)} />
            <ImagePreviewField label="Hero Background Image URL" value={get('search_hero_image', '')} onChange={(v) => update('search_hero_image', v)} hint="Leave blank to use the default image." />
          </div>

          {/* Search Hero Typography */}
          <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-font-size text-[#1B4332] text-base" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Typography</h3>
            </div>
            <HeroTypoBlock
              prefix="search_hero"
              get={get}
              update={update}
              previewEyebrow="Search"
              previewTitle={get('search_page_title', 'Find Your Perfect Property')}
              previewSubtitle={get('search_placeholder_text', 'Search by title, area, or type...')}
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Sidebar Filters</h3>
            <SettingField label="Show Purpose Filter (Buy / Rent / All)" type="toggle" value={get('search_filter_purpose', 'true')} onChange={(v) => update('search_filter_purpose', v)} />
            <SettingField label="Show Property Type Filter" type="toggle" value={get('search_filter_type', 'true')} onChange={(v) => update('search_filter_type', v)} />
            <SettingField label="Show Price Range Filter" type="toggle" value={get('search_filter_price', 'true')} onChange={(v) => update('search_filter_price', v)} />
            <SettingField label="Show Bedrooms Filter" type="toggle" value={get('search_filter_beds', 'true')} onChange={(v) => update('search_filter_beds', v)} />
            <SettingField label="Show Area / Neighbourhood Filter" type="toggle" value={get('search_filter_area', 'true')} onChange={(v) => update('search_filter_area', v)} />
            <SettingField label="Show Size (sqm) Filter" type="toggle" value={get('search_filter_size', 'false')} onChange={(v) => update('search_filter_size', v)} />
          </div>
        </div>
      )}

      {/* LAYOUT & DEFAULTS TAB */}
      {tab === 'layout' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Default View</h3>
            <SettingField
              label="Default Results View (Buy & Rent)"
              type="select"
              value={get('listings_default_view', 'grid')}
              onChange={(v) => update('listings_default_view', v)}
              options={VIEW_OPTIONS}
              hint="The view users see when they first load the Buy or Rent page."
            />
            <SettingField
              label="Default Sort Order"
              type="select"
              value={get('listings_default_sort', 'newest')}
              onChange={(v) => update('listings_default_sort', v)}
              options={SORT_OPTIONS}
            />
            <SettingField
              label="Grid Columns (Desktop)"
              type="select"
              value={get('listings_grid_cols', '3')}
              onChange={(v) => update('listings_grid_cols', v)}
              options={COLS_OPTIONS}
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Page Features</h3>
            <SettingField
              label="Show View Toggle (Grid / List)"
              type="toggle"
              value={get('listings_show_view_toggle', 'true')}
              onChange={(v) => update('listings_show_view_toggle', v)}
            />
            <SettingField
              label="Show Sort Dropdown"
              type="toggle"
              value={get('listings_show_sort', 'true')}
              onChange={(v) => update('listings_show_sort', v)}
            />
            <SettingField
              label="Show Active Filter Tags"
              type="toggle"
              value={get('listings_show_filter_tags', 'true')}
              onChange={(v) => update('listings_show_filter_tags', v)}
            />
            <SettingField
              label="Show Results Count"
              type="toggle"
              value={get('listings_show_count', 'true')}
              onChange={(v) => update('listings_show_count', v)}
            />
            <SettingField
              label="Show Back to Top Button"
              type="toggle"
              value={get('listings_show_back_to_top', 'true')}
              onChange={(v) => update('listings_show_back_to_top', v)}
            />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Pagination</h3>
            <SettingField
              label="Results Per Page"
              type="number"
              value={get('listings_per_page', '0')}
              onChange={(v) => update('listings_per_page', v)}
              min={0}
              max={100}
              unit="listings"
              hint="Set to 0 to show all results without pagination."
            />
          </div>

          {/* Live preview */}
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-2 bg-[#f5f5f5] border-b border-stone-200">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Layout Preview</p>
            </div>
            <div className="p-5 bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 bg-stone-100 rounded" />
                  <div className="h-5 w-24 bg-stone-100 rounded" />
                </div>
                <div className="flex gap-1">
                  <div className={`w-7 h-7 rounded flex items-center justify-center ${get('listings_default_view', 'grid') === 'grid' ? 'bg-[#0D5959] text-white' : 'bg-stone-100'}`}>
                    <i className="ri-grid-fill text-xs" />
                  </div>
                  <div className={`w-7 h-7 rounded flex items-center justify-center ${get('listings_default_view', 'grid') === 'list' ? 'bg-[#0D5959] text-white' : 'bg-stone-100'}`}>
                    <i className="ri-list-unordered text-xs" />
                  </div>
                </div>
              </div>
              <div className={`grid gap-2 ${get('listings_grid_cols', '3') === '2' ? 'grid-cols-2' : get('listings_grid_cols', '3') === '4' ? 'grid-cols-4' : 'grid-cols-3'}`}>
                {Array.from({ length: parseInt(get('listings_grid_cols', '3')) }).map((_, i) => (
                  <div key={i} className="bg-stone-100 rounded h-16 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
