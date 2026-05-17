import { useState } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

const FONT_FAMILIES = [
  { value: '', label: 'Site Default' },
  { value: 'Prata', label: 'Prata (Serif)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Sans-serif)' },
  { value: 'Roboto', label: 'Roboto (Sans-serif)' },
  { value: 'Lato', label: 'Lato (Sans-serif)' },
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

type TabId = 'content' | 'media' | 'typography' | 'styling' | 'layout' | 'seo';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'content', label: 'Content', icon: 'ri-text' },
  { id: 'media', label: 'Media', icon: 'ri-image-2-line' },
  { id: 'typography', label: 'Typography', icon: 'ri-font-size' },
  { id: 'styling', label: 'Styling', icon: 'ri-palette-line' },
  { id: 'layout', label: 'Layout', icon: 'ri-layout-grid-line' },
  { id: 'seo', label: 'SEO', icon: 'ri-search-2-line' },
];

export default function NeighbourhoodsPageManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('nb_page_settings');
  const [activeTab, setActiveTab] = useState<TabId>('content');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[760px] space-y-5 pb-24">
      <SectionHeader
        icon="ri-map-pin-2-line"
        title="Neighbourhoods Page — Full Control"
        description="Full control over the Neighbourhoods page — hero, intro, area cards, CTA, typography, styling, layout, and SEO."
      />

      <div className="flex items-start gap-3 bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-lg px-4 py-3">
        <i className="ri-information-line text-[#1B4332] mt-0.5 shrink-0" />
        <p className="text-sm text-[#1B4332]/80">
          Individual neighbourhood cards (name, image, description) are managed in <strong>Admin → Neighbourhoods</strong>. This panel controls the page-level content, layout, and styling.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-[#f5f5f5] border border-stone-100 rounded-lg p-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#1B4332] shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <i className={`${tab.icon} text-sm`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT TAB ── */}
      {activeTab === 'content' && (
        <div className="space-y-5">
          {/* Hero */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-image-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Section</h3>
            </div>
            <SettingField label="Show Hero" type="toggle" value={get('nbp_hero_visible', 'true')} onChange={(v) => update('nbp_hero_visible', v)} />
            <SettingField label="Eyebrow / Label" value={get('nbp_hero_eyebrow', 'Explore Kampala')} onChange={(v) => update('nbp_hero_eyebrow', v)} />
            <SettingField label="Hero Title" value={get('nbp_hero_title', 'Neighbourhoods & Guides')} onChange={(v) => update('nbp_hero_title', v)} />
            <SettingField label="Hero Subtitle" type="textarea" value={get('nbp_hero_subtitle', "Discover the character, lifestyle, and property market of every major neighbourhood in Kampala — plus in-depth guides, market insights, and expat advice.")} onChange={(v) => update('nbp_hero_subtitle', v)} />
            <SettingField label="Search Placeholder" value={get('nbp_search_placeholder', 'Search areas or articles…')} onChange={(v) => update('nbp_search_placeholder', v)} />
          </div>

          {/* Intro Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-article-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Intro / Description Section</h3>
            </div>
            <SettingField label="Show Intro Section" type="toggle" value={get('nbp_intro_visible', 'false')} onChange={(v) => update('nbp_intro_visible', v)} />
            <SettingField label="Intro Title" value={get('nbp_intro_title', 'Discover Kampala\'s Finest Areas')} onChange={(v) => update('nbp_intro_title', v)} />
            <SettingField label="Intro Body" type="textarea" value={get('nbp_intro_body', "From the leafy streets of Kololo to the vibrant energy of Nakasero, Kampala's neighbourhoods each have their own distinct character. Our local experts know every street, every school, and every amenity — helping you find not just a property, but the right community.")} onChange={(v) => update('nbp_intro_body', v)} />
          </div>

          {/* Area Cards Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-layout-grid-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Area Cards / Grid</h3>
            </div>
            <SettingField label="Section Eyebrow" value={get('nbp_grid_eyebrow', 'Browse Areas')} onChange={(v) => update('nbp_grid_eyebrow', v)} />
            <SettingField label="Section Title" value={get('nbp_grid_title', 'Kampala Neighbourhoods')} onChange={(v) => update('nbp_grid_title', v)} />
            <SettingField label="Show Listing Count on Cards" type="toggle" value={get('nbp_show_listing_count', 'true')} onChange={(v) => update('nbp_show_listing_count', v)} />
            <SettingField label="Show Sale/Rent Split on Cards" type="toggle" value={get('nbp_show_sale_rent', 'true')} onChange={(v) => update('nbp_show_sale_rent', v)} />
            <SettingField label="Show Search Bar" type="toggle" value={get('nbp_show_search', 'true')} onChange={(v) => update('nbp_show_search', v)} />
            <SettingField label="Show Category Filters" type="toggle" value={get('nbp_show_filters', 'true')} onChange={(v) => update('nbp_show_filters', v)} />
          </div>

          {/* Featured Neighbourhoods */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-star-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Featured Neighbourhoods</h3>
            </div>
            <SettingField label="Show Featured Section" type="toggle" value={get('nbp_featured_visible', 'false')} onChange={(v) => update('nbp_featured_visible', v)} />
            <SettingField label="Featured Section Title" value={get('nbp_featured_title', 'Featured Areas')} onChange={(v) => update('nbp_featured_title', v)} />
            <p className="text-xs text-stone-400">Featured neighbourhoods are pulled from your top-listed areas in Admin → Neighbourhoods.</p>
          </div>

          {/* Stats Strip */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-bar-chart-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Stats Strip</h3>
            </div>
            <SettingField label="Show Stats Strip" type="toggle" value={get('nbp_stats_visible', 'true')} onChange={(v) => update('nbp_stats_visible', v)} />
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-cursor-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Section</h3>
            </div>
            <SettingField label="Show CTA Section" type="toggle" value={get('nbp_cta_visible', 'true')} onChange={(v) => update('nbp_cta_visible', v)} />
            <SettingField label="CTA Eyebrow" value={get('nbp_cta_eyebrow', "Not Sure Where to Start?")} onChange={(v) => update('nbp_cta_eyebrow', v)} />
            <SettingField label="CTA Title" value={get('nbp_cta_title', 'Let Our Agents Guide You')} onChange={(v) => update('nbp_cta_title', v)} />
            <SettingField label="CTA Body" type="textarea" value={get('nbp_cta_body', "Our local experts know every street in Kampala. Tell us what you're looking for and we'll match you with the perfect neighbourhood.")} onChange={(v) => update('nbp_cta_body', v)} />
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Primary Button Label" value={get('nbp_cta_btn1_label', 'Talk to an Agent')} onChange={(v) => update('nbp_cta_btn1_label', v)} />
              <SettingField label="Primary Button Link" value={get('nbp_cta_btn1_link', '/contact')} onChange={(v) => update('nbp_cta_btn1_link', v)} />
              <SettingField label="Secondary Button Label" value={get('nbp_cta_btn2_label', 'Browse Properties')} onChange={(v) => update('nbp_cta_btn2_label', v)} />
              <SettingField label="Secondary Button Link" value={get('nbp_cta_btn2_link', '/buy')} onChange={(v) => update('nbp_cta_btn2_link', v)} />
            </div>
          </div>

          {/* Area Guides / Blog Teaser */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-article-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Area Guides &amp; Blog Tab</h3>
            </div>
            <SettingField label="Show Area Guides Tab" type="toggle" value={get('nbp_show_guides_tab', 'true')} onChange={(v) => update('nbp_show_guides_tab', v)} />
            <SettingField label="Guides Tab Label" value={get('nbp_guides_tab_label', 'Area Guides & Blog')} onChange={(v) => update('nbp_guides_tab_label', v)} />
            <SettingField label="Neighbourhoods Tab Label" value={get('nbp_nb_tab_label', 'Neighbourhoods')} onChange={(v) => update('nbp_nb_tab_label', v)} />
          </div>
        </div>
      )}

      {/* ── MEDIA TAB ── */}
      {activeTab === 'media' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Background Image</h3>
            <p className="text-xs text-stone-400 -mt-2">Full-width background image at the top of the Neighbourhoods page. Recommended: landscape, 1920×700px.</p>
            <SettingField label="Hero Background" type="image_upload" value={get('nbp_hero_image', '')} onChange={(v) => update('nbp_hero_image', v)} hint="Upload from device or paste a URL." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Default Card Fallback Image</h3>
            <p className="text-xs text-stone-400 -mt-2">Shown on neighbourhood cards that don't have their own image set.</p>
            <SettingField label="Default Card Image" type="image_upload" value={get('nbp_card_fallback_image', '')} onChange={(v) => update('nbp_card_fallback_image', v)} hint="Used as fallback when a neighbourhood has no image." />
          </div>
        </div>
      )}

      {/* ── TYPOGRAPHY TAB ── */}
      {activeTab === 'typography' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Typography</h3>
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Hero Title</p>
              <div className="grid grid-cols-2 gap-3">
                <SettingField label="Font Family" type="select" value={get('nbp_hero_title_font', 'Prata')} onChange={(v) => update('nbp_hero_title_font', v)} options={FONT_FAMILIES} />
                <SettingField label="Font Weight" type="select" value={get('nbp_hero_title_weight', '400')} onChange={(v) => update('nbp_hero_title_weight', v)} options={FONT_WEIGHTS} />
                <SettingField label="Font Size" type="number" value={get('nbp_hero_title_size', '48')} onChange={(v) => update('nbp_hero_title_size', v)} unit="px" min={20} max={100} />
                <SettingField label="Text Color" type="color" value={get('nbp_hero_title_color', '#ffffff')} onChange={(v) => update('nbp_hero_title_color', v)} />
                <SettingField label="Letter Spacing" type="number" value={get('nbp_hero_title_spacing', '0')} onChange={(v) => update('nbp_hero_title_spacing', v)} unit="em" />
                <SettingField label="Text Transform" type="select" value={get('nbp_hero_title_transform', 'none')} onChange={(v) => update('nbp_hero_title_transform', v)} options={TEXT_TRANSFORMS} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Headings (H2)</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('nbp_h2_font', 'Prata')} onChange={(v) => update('nbp_h2_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('nbp_h2_weight', '400')} onChange={(v) => update('nbp_h2_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('nbp_h2_size', '30')} onChange={(v) => update('nbp_h2_size', v)} unit="px" min={16} max={72} />
              <SettingField label="Text Color" type="color" value={get('nbp_h2_color', '#001731')} onChange={(v) => update('nbp_h2_color', v)} />
              <SettingField label="Letter Spacing" type="number" value={get('nbp_h2_spacing', '0')} onChange={(v) => update('nbp_h2_spacing', v)} unit="em" />
              <SettingField label="Text Transform" type="select" value={get('nbp_h2_transform', 'none')} onChange={(v) => update('nbp_h2_transform', v)} options={TEXT_TRANSFORMS} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Card Typography</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Card Title Font" type="select" value={get('nbp_card_title_font', 'Prata')} onChange={(v) => update('nbp_card_title_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Card Title Size" type="number" value={get('nbp_card_title_size', '18')} onChange={(v) => update('nbp_card_title_size', v)} unit="px" min={12} max={36} />
              <SettingField label="Card Title Color" type="color" value={get('nbp_card_title_color', '#ffffff')} onChange={(v) => update('nbp_card_title_color', v)} />
              <SettingField label="Card Meta Font Size" type="number" value={get('nbp_card_meta_size', '11')} onChange={(v) => update('nbp_card_meta_size', v)} unit="px" min={9} max={16} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Body Text</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('nbp_body_font', '')} onChange={(v) => update('nbp_body_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Size" type="number" value={get('nbp_body_size', '14')} onChange={(v) => update('nbp_body_size', v)} unit="px" min={10} max={24} />
              <SettingField label="Line Height" type="number" value={get('nbp_body_lh', '1.6')} onChange={(v) => update('nbp_body_lh', v)} placeholder="1.6" />
              <SettingField label="Text Color" type="color" value={get('nbp_body_color', '#4B5563')} onChange={(v) => update('nbp_body_color', v)} />
            </div>
          </div>
        </div>
      )}

      {/* ── STYLING TAB ── */}
      {activeTab === 'styling' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Styling</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Overlay Color" type="color" value={get('nbp_hero_overlay_color', '#000000')} onChange={(v) => update('nbp_hero_overlay_color', v)} />
              <SettingField label="Overlay Opacity" type="number" value={get('nbp_hero_overlay_opacity', '60')} onChange={(v) => update('nbp_hero_overlay_opacity', v)} unit="%" min={0} max={90} />
              <SettingField label="Hero Height" type="number" value={get('nbp_hero_height', '700')} onChange={(v) => update('nbp_hero_height', v)} unit="px" min={300} max={900} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Backgrounds</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Page Background" type="color" value={get('nbp_page_bg', '#ffffff')} onChange={(v) => update('nbp_page_bg', v)} />
              <SettingField label="Stats Strip BG" type="color" value={get('nbp_stats_bg', '#001731')} onChange={(v) => update('nbp_stats_bg', v)} />
              <SettingField label="CTA Section BG" type="color" value={get('nbp_cta_bg', '#ffffff')} onChange={(v) => update('nbp_cta_bg', v)} />
              <SettingField label="Filter Bar BG" type="color" value={get('nbp_filter_bg', '#ffffff')} onChange={(v) => update('nbp_filter_bg', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Card Styling</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Card Overlay Opacity" type="number" value={get('nbp_card_overlay_opacity', '50')} onChange={(v) => update('nbp_card_overlay_opacity', v)} unit="%" min={0} max={90} hint="Dark gradient overlay on neighbourhood cards." />
              <SettingField label="Card Border Radius" type="select" value={get('nbp_card_radius', 'rounded-xl')} onChange={(v) => update('nbp_card_radius', v)} options={[{ value: 'rounded-none', label: 'Square' }, { value: 'rounded-lg', label: 'Rounded' }, { value: 'rounded-xl', label: 'More Rounded' }, { value: 'rounded-2xl', label: 'Very Rounded' }]} />
              <SettingField label="Card Hover Effect" type="select" value={get('nbp_card_hover', 'scale')} onChange={(v) => update('nbp_card_hover', v)} options={[{ value: 'scale', label: 'Scale Up' }, { value: 'lift', label: 'Lift Up' }, { value: 'none', label: 'None' }]} />
              <SettingField label="Accent Color" type="color" value={get('nbp_accent_color', '#C9A84C')} onChange={(v) => update('nbp_accent_color', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Spacing</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Section Vertical Padding" type="number" value={get('nbp_section_py', '56')} onChange={(v) => update('nbp_section_py', v)} unit="px" min={20} max={200} />
              <SettingField label="Card Gap" type="number" value={get('nbp_card_gap', '24')} onChange={(v) => update('nbp_card_gap', v)} unit="px" min={4} max={64} />
              <SettingField label="Card Height" type="number" value={get('nbp_card_height', '340')} onChange={(v) => update('nbp_card_height', v)} unit="px" min={200} max={600} />
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT TAB ── */}
      {activeTab === 'layout' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Visibility</h3>
            <SettingField label="Hero Section" type="toggle" value={get('nbp_hero_visible', 'true')} onChange={(v) => update('nbp_hero_visible', v)} />
            <SettingField label="Intro / Description Section" type="toggle" value={get('nbp_intro_visible', 'false')} onChange={(v) => update('nbp_intro_visible', v)} />
            <SettingField label="Featured Neighbourhoods" type="toggle" value={get('nbp_featured_visible', 'false')} onChange={(v) => update('nbp_featured_visible', v)} />
            <SettingField label="Stats Strip" type="toggle" value={get('nbp_stats_visible', 'true')} onChange={(v) => update('nbp_stats_visible', v)} />
            <SettingField label="Area Guides / Blog Tab" type="toggle" value={get('nbp_show_guides_tab', 'true')} onChange={(v) => update('nbp_show_guides_tab', v)} />
            <SettingField label="CTA Section" type="toggle" value={get('nbp_cta_visible', 'true')} onChange={(v) => update('nbp_cta_visible', v)} />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Grid Layout</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Desktop Columns" type="select" value={get('nbp_grid_cols_desktop', '3')} onChange={(v) => update('nbp_grid_cols_desktop', v)} options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }]} />
              <SettingField label="Tablet Columns" type="select" value={get('nbp_grid_cols_tablet', '2')} onChange={(v) => update('nbp_grid_cols_tablet', v)} options={[{ value: '1', label: '1 Column' }, { value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }]} />
              <SettingField label="Mobile Columns" type="select" value={get('nbp_grid_cols_mobile', '1')} onChange={(v) => update('nbp_grid_cols_mobile', v)} options={[{ value: '1', label: '1 Column' }, { value: '2', label: '2 Columns' }]} />
              <SettingField label="Max Cards Shown" type="number" value={get('nbp_max_cards', '12')} onChange={(v) => update('nbp_max_cards', v)} min={3} max={50} hint="Maximum number of neighbourhood cards to display." />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Filter Options</h3>
            <SettingField label="Show Search Bar" type="toggle" value={get('nbp_show_search', 'true')} onChange={(v) => update('nbp_show_search', v)} />
            <SettingField label="Show Category Filters" type="toggle" value={get('nbp_show_filters', 'true')} onChange={(v) => update('nbp_show_filters', v)} />
            <SettingField label="Sticky Filter Bar" type="toggle" value={get('nbp_sticky_filters', 'true')} onChange={(v) => update('nbp_sticky_filters', v)} hint="Keep the filter bar visible when scrolling." />
          </div>
        </div>
      )}

      {/* ── SEO TAB ── */}
      {activeTab === 'seo' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-search-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">SEO Settings</h3>
            </div>
            <SettingField label="Meta Title" value={get('nbp_seo_title', 'Neighbourhoods in Kampala | Area Guides | Oceans Uganda')} onChange={(v) => update('nbp_seo_title', v)} hint="60 characters max." />
            <SettingField label="Meta Description" type="textarea" value={get('nbp_seo_description', "Explore Kampala's finest neighbourhoods with Oceans Uganda. In-depth area guides, property listings, and local insights for Kololo, Nakasero, Muyenga, and more.")} onChange={(v) => update('nbp_seo_description', v)} hint="120–160 characters." />
            <SettingField label="Keywords" value={get('nbp_seo_keywords', 'neighbourhoods Kampala, area guides Uganda, Kololo Nakasero Muyenga property')} onChange={(v) => update('nbp_seo_keywords', v)} hint="3–5 keywords, comma-separated." />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Open Graph (Social Sharing)</h3>
            <SettingField label="OG Title" value={get('nbp_og_title', 'Neighbourhoods in Kampala | Oceans Uganda')} onChange={(v) => update('nbp_og_title', v)} />
            <SettingField label="OG Description" type="textarea" value={get('nbp_og_description', "Explore Kampala's finest neighbourhoods and area guides with Oceans Uganda.")} onChange={(v) => update('nbp_og_description', v)} />
            <SettingField label="OG Image" type="image_upload" value={get('nbp_og_image', '')} onChange={(v) => update('nbp_og_image', v)} hint="Recommended: 1200×630px." />
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
