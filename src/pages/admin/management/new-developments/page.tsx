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

const LAYOUT_OPTIONS = [
  { value: 'center', label: 'Centered' },
  { value: 'left', label: 'Left-aligned' },
];

const GRID_COLS = [
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
  { value: '4', label: '4 Columns' },
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

export default function NewDevelopmentsManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('new_dev_settings');
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
        icon="ri-building-3-line"
        title="New Developments Page"
        description="Full control over the New Developments page — content, images, typography, styling, layout, and SEO."
      />

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
            <SettingField label="Eyebrow / Label" value={get('nd_hero_eyebrow', 'Premium Developments')} onChange={(v) => update('nd_hero_eyebrow', v)} placeholder="Premium Developments" />
            <SettingField label="Hero Title" value={get('nd_hero_title', 'New Developments')} onChange={(v) => update('nd_hero_title', v)} placeholder="New Developments" />
            <SettingField label="Hero Subtitle" type="textarea" value={get('nd_hero_subtitle', "Discover Kampala's finest off-plan and newly completed properties. From luxury apartments to exclusive villas — secure your future home today.")} onChange={(v) => update('nd_hero_subtitle', v)} />
            <SettingField label="Show Hero Section" type="toggle" value={get('nd_hero_visible', 'true')} onChange={(v) => update('nd_hero_visible', v)} />
          </div>

          {/* Intro */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-article-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Intro Section</h3>
            </div>
            <SettingField label="Show Intro Section" type="toggle" value={get('nd_intro_visible', 'true')} onChange={(v) => update('nd_intro_visible', v)} />
            <SettingField label="Intro Eyebrow" value={get('nd_intro_eyebrow', 'About Our Developments')} onChange={(v) => update('nd_intro_eyebrow', v)} />
            <SettingField label="Intro Title" value={get('nd_intro_title', 'Invest in Kampala\'s Future')} onChange={(v) => update('nd_intro_title', v)} />
            <SettingField label="Intro Body" type="textarea" value={get('nd_intro_body', "We partner with Uganda's leading developers to bring you exclusive access to the finest new residential and commercial developments across Kampala and beyond.")} onChange={(v) => update('nd_intro_body', v)} />
          </div>

          {/* Why Buy New — 6 benefit cards */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-star-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Why Buy New — Benefits Section</h3>
            </div>
            <SettingField label="Show Benefits Section" type="toggle" value={get('nd_benefits_visible', 'true')} onChange={(v) => update('nd_benefits_visible', v)} />
            <SettingField label="Section Eyebrow" value={get('nd_benefits_eyebrow', 'The Benefits')} onChange={(v) => update('nd_benefits_eyebrow', v)} />
            <SettingField label="Section Title" value={get('nd_benefits_title', 'Why Buy a New Development?')} onChange={(v) => update('nd_benefits_title', v)} />
            <div className="border-t border-stone-100 pt-4 space-y-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="border border-stone-100 rounded-lg p-4 space-y-3">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Benefit Card {n}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <SettingField label="Title" value={get(`nd_benefit${n}_title`, ['Early-Bird Pricing', 'Customisation Options', 'Modern Standards', 'Capital Appreciation', 'Payment Plans', 'Warranty Protection'][n - 1])} onChange={(v) => update(`nd_benefit${n}_title`, v)} />
                    <SettingField label="Icon (Remix Icon class)" value={get(`nd_benefit${n}_icon`, ['ri-price-tag-3-line', 'ri-palette-line', 'ri-shield-check-line', 'ri-line-chart-line', 'ri-file-list-3-line', 'ri-tools-line'][n - 1])} onChange={(v) => update(`nd_benefit${n}_icon`, v)} placeholder="ri-star-line" />
                  </div>
                  <SettingField label="Description" type="textarea" value={get(`nd_benefit${n}_desc`, ['Secure properties at pre-construction prices, often 15-20% below market value upon completion.', 'Choose finishes, layouts, and fixtures to match your personal taste before construction is complete.', 'Benefit from the latest building codes, energy efficiency, and contemporary design.', 'Properties typically gain significant value between launch and completion.', 'Flexible staged payments tied to construction milestones, making luxury more accessible.', 'New builds come with structural warranties and builder guarantees for peace of mind.'][n - 1])} onChange={(v) => update(`nd_benefit${n}_desc`, v)} />
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-cursor-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Section (Bottom)</h3>
            </div>
            <SettingField label="Show CTA Section" type="toggle" value={get('nd_cta_visible', 'true')} onChange={(v) => update('nd_cta_visible', v)} />
            <SettingField label="CTA Title" value={get('nd_cta_title', 'Have a Development to Sell?')} onChange={(v) => update('nd_cta_title', v)} />
            <SettingField label="CTA Body" type="textarea" value={get('nd_cta_body', "We work with leading developers across Uganda to market and sell premium new developments. Partner with Kampala's most trusted agency.")} onChange={(v) => update('nd_cta_body', v)} />
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Primary Button Label" value={get('nd_cta_btn1_label', 'Contact Our Team')} onChange={(v) => update('nd_cta_btn1_label', v)} />
              <SettingField label="Primary Button Link" value={get('nd_cta_btn1_link', '/contact')} onChange={(v) => update('nd_cta_btn1_link', v)} />
              <SettingField label="Secondary Button Label" value={get('nd_cta_btn2_label', 'Request Valuation')} onChange={(v) => update('nd_cta_btn2_label', v)} />
              <SettingField label="Secondary Button Link" value={get('nd_cta_btn2_link', '/landlords')} onChange={(v) => update('nd_cta_btn2_link', v)} />
            </div>
          </div>

          {/* Investment Highlights */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-bar-chart-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Investment Highlights Strip</h3>
            </div>
            <SettingField label="Show Highlights Strip" type="toggle" value={get('nd_highlights_visible', 'false')} onChange={(v) => update('nd_highlights_visible', v)} />
            <p className="text-xs text-stone-400">Optional stats strip shown above the listings grid.</p>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <>
                  <SettingField key={`v${n}`} label={`Stat ${n} Value`} value={get(`nd_highlight${n}_value`, ['15-20%', '12+', '98%', '5yr'][n - 1])} onChange={(v) => update(`nd_highlight${n}_value`, v)} />
                  <SettingField key={`l${n}`} label={`Stat ${n} Label`} value={get(`nd_highlight${n}_label`, ['Below Market Price', 'Active Developments', 'Occupancy Rate', 'Avg. ROI Period'][n - 1])} onChange={(v) => update(`nd_highlight${n}_label`, v)} />
                </>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MEDIA TAB ── */}
      {activeTab === 'media' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <div className="flex items-center gap-2">
              <i className="ri-image-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Background Image</h3>
            </div>
            <p className="text-xs text-stone-400 -mt-2">Full-width background image at the top of the page. Recommended: landscape, at least 1920×700px.</p>
            <SettingField label="Hero Background Image" type="image_upload" value={get('nd_hero_image', '')} onChange={(v) => update('nd_hero_image', v)} hint="Upload from device or paste a URL." />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <div className="flex items-center gap-2">
              <i className="ri-image-edit-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Intro Section Image</h3>
            </div>
            <SettingField label="Intro / Feature Image" type="image_upload" value={get('nd_intro_image', '')} onChange={(v) => update('nd_intro_image', v)} hint="Shown beside the intro text if intro layout is split." />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <div className="flex items-center gap-2">
              <i className="ri-image-add-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Section Background</h3>
            </div>
            <SettingField label="CTA Background Image" type="image_upload" value={get('nd_cta_image', '')} onChange={(v) => update('nd_cta_image', v)} hint="Optional background image for the bottom CTA section." />
          </div>
        </div>
      )}

      {/* ── TYPOGRAPHY TAB ── */}
      {activeTab === 'typography' && (
        <div className="space-y-5">
          {/* Hero Typography */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Typography</h3>
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Hero Title</p>
              <div className="grid grid-cols-2 gap-3">
                <SettingField label="Font Family" type="select" value={get('nd_hero_title_font', 'Prata')} onChange={(v) => update('nd_hero_title_font', v)} options={FONT_FAMILIES} />
                <SettingField label="Font Weight" type="select" value={get('nd_hero_title_weight', '400')} onChange={(v) => update('nd_hero_title_weight', v)} options={FONT_WEIGHTS} />
                <SettingField label="Font Size" type="number" value={get('nd_hero_title_size', '48')} onChange={(v) => update('nd_hero_title_size', v)} unit="px" min={20} max={100} />
                <SettingField label="Letter Spacing" type="number" value={get('nd_hero_title_spacing', '0')} onChange={(v) => update('nd_hero_title_spacing', v)} unit="em" />
                <SettingField label="Line Height" type="number" value={get('nd_hero_title_lh', '1.2')} onChange={(v) => update('nd_hero_title_lh', v)} placeholder="1.2" />
                <SettingField label="Text Transform" type="select" value={get('nd_hero_title_transform', 'none')} onChange={(v) => update('nd_hero_title_transform', v)} options={TEXT_TRANSFORMS} />
                <SettingField label="Text Color" type="color" value={get('nd_hero_title_color', '#ffffff')} onChange={(v) => update('nd_hero_title_color', v)} />
              </div>
            </div>
            <div className="border-t border-stone-100" />
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Hero Subtitle</p>
              <div className="grid grid-cols-2 gap-3">
                <SettingField label="Font Family" type="select" value={get('nd_hero_sub_font', '')} onChange={(v) => update('nd_hero_sub_font', v)} options={FONT_FAMILIES} />
                <SettingField label="Font Size" type="number" value={get('nd_hero_sub_size', '16')} onChange={(v) => update('nd_hero_sub_size', v)} unit="px" min={12} max={32} />
                <SettingField label="Text Color" type="color" value={get('nd_hero_sub_color', '#ffffffcc')} onChange={(v) => update('nd_hero_sub_color', v)} />
                <SettingField label="Line Height" type="number" value={get('nd_hero_sub_lh', '1.6')} onChange={(v) => update('nd_hero_sub_lh', v)} placeholder="1.6" />
              </div>
            </div>
          </div>

          {/* Section Headings */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Headings (H2)</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('nd_h2_font', 'Prata')} onChange={(v) => update('nd_h2_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('nd_h2_weight', '400')} onChange={(v) => update('nd_h2_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('nd_h2_size', '36')} onChange={(v) => update('nd_h2_size', v)} unit="px" min={16} max={72} />
              <SettingField label="Letter Spacing" type="number" value={get('nd_h2_spacing', '0')} onChange={(v) => update('nd_h2_spacing', v)} unit="em" />
              <SettingField label="Text Color" type="color" value={get('nd_h2_color', '#001731')} onChange={(v) => update('nd_h2_color', v)} />
              <SettingField label="Text Transform" type="select" value={get('nd_h2_transform', 'none')} onChange={(v) => update('nd_h2_transform', v)} options={TEXT_TRANSFORMS} />
            </div>
          </div>

          {/* Body / Card Text */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Body &amp; Card Text</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('nd_body_font', '')} onChange={(v) => update('nd_body_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('nd_body_weight', '400')} onChange={(v) => update('nd_body_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('nd_body_size', '14')} onChange={(v) => update('nd_body_size', v)} unit="px" min={10} max={24} />
              <SettingField label="Line Height" type="number" value={get('nd_body_lh', '1.6')} onChange={(v) => update('nd_body_lh', v)} placeholder="1.6" />
              <SettingField label="Text Color" type="color" value={get('nd_body_color', '#4B5563')} onChange={(v) => update('nd_body_color', v)} />
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
              <SettingField label="Overlay Color" type="color" value={get('nd_hero_overlay_color', '#000000')} onChange={(v) => update('nd_hero_overlay_color', v)} />
              <SettingField label="Overlay Opacity" type="number" value={get('nd_hero_overlay_opacity', '60')} onChange={(v) => update('nd_hero_overlay_opacity', v)} unit="%" min={0} max={90} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Backgrounds</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Benefits Section BG" type="color" value={get('nd_benefits_bg', '#F5F7F7')} onChange={(v) => update('nd_benefits_bg', v)} />
              <SettingField label="CTA Section BG" type="color" value={get('nd_cta_bg', '#001731')} onChange={(v) => update('nd_cta_bg', v)} />
              <SettingField label="Listings Section BG" type="color" value={get('nd_listings_bg', '#ffffff')} onChange={(v) => update('nd_listings_bg', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Benefit Cards</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Card Background" type="color" value={get('nd_card_bg', '#ffffff')} onChange={(v) => update('nd_card_bg', v)} />
              <SettingField label="Card Border Color" type="color" value={get('nd_card_border', '#F3F4F6')} onChange={(v) => update('nd_card_border', v)} />
              <SettingField label="Icon Color" type="color" value={get('nd_card_icon_color', '#C9A84C')} onChange={(v) => update('nd_card_icon_color', v)} />
              <SettingField label="Card Title Color" type="color" value={get('nd_card_title_color', '#001731')} onChange={(v) => update('nd_card_title_color', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Buttons</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Primary Button BG" type="color" value={get('nd_btn_primary_bg', '#C9A84C')} onChange={(v) => update('nd_btn_primary_bg', v)} />
              <SettingField label="Primary Button Text" type="color" value={get('nd_btn_primary_text', '#ffffff')} onChange={(v) => update('nd_btn_primary_text', v)} />
              <SettingField label="Secondary Button Border" type="color" value={get('nd_btn_secondary_border', '#001731')} onChange={(v) => update('nd_btn_secondary_border', v)} />
              <SettingField label="Secondary Button Text" type="color" value={get('nd_btn_secondary_text', '#001731')} onChange={(v) => update('nd_btn_secondary_text', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Spacing</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Section Vertical Padding" type="number" value={get('nd_section_py', '80')} onChange={(v) => update('nd_section_py', v)} unit="px" min={20} max={200} />
              <SettingField label="Card Gap" type="number" value={get('nd_card_gap', '32')} onChange={(v) => update('nd_card_gap', v)} unit="px" min={8} max={80} />
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT TAB ── */}
      {activeTab === 'layout' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Layout</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Content Alignment" type="select" value={get('nd_hero_align', 'center')} onChange={(v) => update('nd_hero_align', v)} options={LAYOUT_OPTIONS} />
              <SettingField label="Hero Height" type="number" value={get('nd_hero_height', '700')} onChange={(v) => update('nd_hero_height', v)} unit="px" min={300} max={1000} hint="Desktop hero height in pixels." />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Benefits Grid</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Desktop Columns" type="select" value={get('nd_benefits_cols', '3')} onChange={(v) => update('nd_benefits_cols', v)} options={GRID_COLS} />
              <SettingField label="Section Alignment" type="select" value={get('nd_benefits_align', 'center')} onChange={(v) => update('nd_benefits_align', v)} options={LAYOUT_OPTIONS} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Listings Grid</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Desktop Columns" type="select" value={get('nd_listings_cols', '3')} onChange={(v) => update('nd_listings_cols', v)} options={GRID_COLS} />
              <SettingField label="Show Filter Bar" type="toggle" value={get('nd_show_filters', 'true')} onChange={(v) => update('nd_show_filters', v)} />
              <SettingField label="Show Sort Controls" type="toggle" value={get('nd_show_sort', 'true')} onChange={(v) => update('nd_show_sort', v)} />
              <SettingField label="Show Featured Developments" type="toggle" value={get('nd_show_featured', 'true')} onChange={(v) => update('nd_show_featured', v)} hint="Large split-layout cards for top developments." />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Order &amp; Visibility</h3>
            <p className="text-xs text-stone-400">Toggle each section on or off.</p>
            <SettingField label="Show Hero" type="toggle" value={get('nd_hero_visible', 'true')} onChange={(v) => update('nd_hero_visible', v)} />
            <SettingField label="Show Intro Section" type="toggle" value={get('nd_intro_visible', 'true')} onChange={(v) => update('nd_intro_visible', v)} />
            <SettingField label="Show Featured Developments" type="toggle" value={get('nd_show_featured', 'true')} onChange={(v) => update('nd_show_featured', v)} />
            <SettingField label="Show Benefits Section" type="toggle" value={get('nd_benefits_visible', 'true')} onChange={(v) => update('nd_benefits_visible', v)} />
            <SettingField label="Show Investment Highlights" type="toggle" value={get('nd_highlights_visible', 'false')} onChange={(v) => update('nd_highlights_visible', v)} />
            <SettingField label="Show CTA Section" type="toggle" value={get('nd_cta_visible', 'true')} onChange={(v) => update('nd_cta_visible', v)} />
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
            <p className="text-xs text-stone-400">These values override the default SEO for the New Developments page.</p>
            <SettingField label="Meta Title" value={get('nd_seo_title', 'New Developments in Kampala | Oceans Uganda')} onChange={(v) => update('nd_seo_title', v)} hint="60 characters max. Shown in browser tab and Google results." />
            <SettingField label="Meta Description" type="textarea" value={get('nd_seo_description', "Discover Kampala's finest new residential developments. Off-plan and newly completed luxury apartments, villas, and townhouses. Secure your future home with Oceans Uganda.")} onChange={(v) => update('nd_seo_description', v)} hint="120–160 characters. Shown in Google search results." />
            <SettingField label="Keywords" value={get('nd_seo_keywords', 'new developments Kampala, off-plan properties Uganda, luxury apartments Kampala')} onChange={(v) => update('nd_seo_keywords', v)} hint="3–5 keywords, comma-separated." />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Open Graph (Social Sharing)</h3>
            <SettingField label="OG Title" value={get('nd_og_title', 'New Developments in Kampala | Oceans Uganda')} onChange={(v) => update('nd_og_title', v)} />
            <SettingField label="OG Description" type="textarea" value={get('nd_og_description', "Explore Kampala's finest new residential developments with Oceans Uganda.")} onChange={(v) => update('nd_og_description', v)} />
            <SettingField label="OG Image" type="image_upload" value={get('nd_og_image', '')} onChange={(v) => update('nd_og_image', v)} hint="Recommended: 1200×630px. Shown when shared on social media." />
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
