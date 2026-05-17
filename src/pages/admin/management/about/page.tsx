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

type TabId = 'content' | 'media' | 'typography' | 'styling' | 'layout' | 'seo';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'content', label: 'Content', icon: 'ri-text' },
  { id: 'media', label: 'Media', icon: 'ri-image-2-line' },
  { id: 'typography', label: 'Typography', icon: 'ri-font-size' },
  { id: 'styling', label: 'Styling', icon: 'ri-palette-line' },
  { id: 'layout', label: 'Layout', icon: 'ri-layout-grid-line' },
  { id: 'seo', label: 'SEO', icon: 'ri-search-2-line' },
];

export default function AboutManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('about_settings');
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
        icon="ri-information-line"
        title="About Us Page"
        description="Full control over the About Us page — content, images, typography, styling, layout, and SEO."
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
            <SettingField label="Show Hero" type="toggle" value={get('about_hero_visible', 'true')} onChange={(v) => update('about_hero_visible', v)} />
            <SettingField label="Eyebrow / Label" value={get('about_hero_eyebrow', 'About Oceans Uganda')} onChange={(v) => update('about_hero_eyebrow', v)} />
            <SettingField label="Hero Title" value={get('about_hero_title', 'Kampala\'s Most Trusted Property Agency')} onChange={(v) => update('about_hero_title', v)} />
            <SettingField label="Hero Subtitle" type="textarea" value={get('about_hero_subtitle', "For over a decade, we've been connecting people with exceptional properties across Uganda's finest neighbourhoods.")} onChange={(v) => update('about_hero_subtitle', v)} />
          </div>

          {/* Company Intro */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-building-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Company Introduction</h3>
            </div>
            <SettingField label="Show Section" type="toggle" value={get('about_intro_visible', 'true')} onChange={(v) => update('about_intro_visible', v)} />
            <SettingField label="Section Eyebrow" value={get('about_intro_eyebrow', 'Who We Are')} onChange={(v) => update('about_intro_eyebrow', v)} />
            <SettingField label="Section Title" value={get('about_intro_title', 'Built on Trust, Driven by Results')} onChange={(v) => update('about_intro_title', v)} />
            <SettingField label="Paragraph 1" type="textarea" value={get('about_intro_p1', "Oceans Uganda was founded with a single mission: to make premium property accessible, transparent, and stress-free for every client. From first-time buyers to seasoned investors, we bring the same level of dedication and expertise to every transaction.")} onChange={(v) => update('about_intro_p1', v)} />
            <SettingField label="Paragraph 2" type="textarea" value={get('about_intro_p2', "With deep roots in Kampala's property market and a team of experienced agents, we have built a reputation for integrity, market knowledge, and exceptional client service. Our portfolio spans residential sales, lettings, property management, and new developments.")} onChange={(v) => update('about_intro_p2', v)} />
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-focus-3-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Mission &amp; Vision</h3>
            </div>
            <SettingField label="Show Section" type="toggle" value={get('about_mv_visible', 'true')} onChange={(v) => update('about_mv_visible', v)} />
            <SettingField label="Mission Title" value={get('about_mission_title', 'Our Mission')} onChange={(v) => update('about_mission_title', v)} />
            <SettingField label="Mission Text" type="textarea" value={get('about_mission_text', "To connect people with exceptional properties through honest advice, deep market knowledge, and a commitment to long-term relationships.")} onChange={(v) => update('about_mission_text', v)} />
            <SettingField label="Vision Title" value={get('about_vision_title', 'Our Vision')} onChange={(v) => update('about_vision_title', v)} />
            <SettingField label="Vision Text" type="textarea" value={get('about_vision_text', "To be Uganda's most respected and trusted property agency — known for integrity, innovation, and delivering outstanding results for every client.")} onChange={(v) => update('about_vision_text', v)} />
          </div>

          {/* Brand Values */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-heart-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Brand Values</h3>
            </div>
            <SettingField label="Show Section" type="toggle" value={get('about_values_visible', 'true')} onChange={(v) => update('about_values_visible', v)} />
            <SettingField label="Section Title" value={get('about_values_title', 'What We Stand For')} onChange={(v) => update('about_values_title', v)} />
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Value {n}</p>
                <div className="grid grid-cols-2 gap-3">
                  <SettingField label="Title" value={get(`about_value${n}_title`, ['Integrity', 'Expertise', 'Client-First', 'Innovation'][n - 1])} onChange={(v) => update(`about_value${n}_title`, v)} />
                  <SettingField label="Icon" value={get(`about_value${n}_icon`, ['ri-shield-check-line', 'ri-award-line', 'ri-user-heart-line', 'ri-lightbulb-line'][n - 1])} onChange={(v) => update(`about_value${n}_icon`, v)} placeholder="ri-star-line" />
                </div>
                <SettingField label="Description" type="textarea" value={get(`about_value${n}_desc`, ['We operate with complete transparency and honesty in every transaction.', 'Our team brings deep market knowledge and professional expertise to every deal.', 'Your goals are our goals. We listen, advise, and deliver results that matter to you.', 'We continuously evolve our approach to deliver better outcomes for our clients.'][n - 1])} onChange={(v) => update(`about_value${n}_desc`, v)} />
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-star-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Why Choose Us</h3>
            </div>
            <SettingField label="Show Section" type="toggle" value={get('about_why_visible', 'true')} onChange={(v) => update('about_why_visible', v)} />
            <SettingField label="Section Eyebrow" value={get('about_why_eyebrow', 'Why Oceans Uganda')} onChange={(v) => update('about_why_eyebrow', v)} />
            <SettingField label="Section Title" value={get('about_why_title', 'The Oceans Difference')} onChange={(v) => update('about_why_title', v)} />
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Point {n}</p>
                <SettingField label="Title" value={get(`about_why${n}_title`, ['Local Market Leaders', 'End-to-End Service', 'Proven Track Record'][n - 1])} onChange={(v) => update(`about_why${n}_title`, v)} />
                <SettingField label="Description" type="textarea" value={get(`about_why${n}_desc`, ['12+ years of deep expertise in Kampala\'s premium property market.', 'From search to completion, we handle every step of your property journey.', 'Hundreds of successful transactions and thousands of satisfied clients.'][n - 1])} onChange={(v) => update(`about_why${n}_desc`, v)} />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-bar-chart-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Company Stats</h3>
            </div>
            <SettingField label="Show Stats Strip" type="toggle" value={get('about_stats_visible', 'true')} onChange={(v) => update('about_stats_visible', v)} />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <>
                  <SettingField key={`sv${n}`} label={`Stat ${n} Value`} value={get(`about_stat${n}_value`, ['12+', '500+', '98%', '200+'][n - 1])} onChange={(v) => update(`about_stat${n}_value`, v)} />
                  <SettingField key={`sl${n}`} label={`Stat ${n} Label`} value={get(`about_stat${n}_label`, ['Years Experience', 'Properties Sold', 'Client Satisfaction', 'Properties Managed'][n - 1])} onChange={(v) => update(`about_stat${n}_label`, v)} />
                </>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-team-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Team Section</h3>
            </div>
            <SettingField label="Show Team Section" type="toggle" value={get('about_team_visible', 'true')} onChange={(v) => update('about_team_visible', v)} />
            <SettingField label="Section Eyebrow" value={get('about_team_eyebrow', 'Meet the Team')} onChange={(v) => update('about_team_eyebrow', v)} />
            <SettingField label="Section Title" value={get('about_team_title', 'The People Behind Oceans Uganda')} onChange={(v) => update('about_team_title', v)} />
            <SettingField label="Section Subtitle" type="textarea" value={get('about_team_subtitle', "Our team of experienced property professionals is dedicated to delivering exceptional results for every client.")} onChange={(v) => update('about_team_subtitle', v)} />
            <p className="text-xs text-stone-400">Team members are managed in Admin → Agents. This section pulls from your agents database automatically.</p>
          </div>

          {/* Brand Story */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-history-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Brand Story</h3>
            </div>
            <SettingField label="Show Brand Story" type="toggle" value={get('about_story_visible', 'true')} onChange={(v) => update('about_story_visible', v)} />
            <SettingField label="Story Eyebrow" value={get('about_story_eyebrow', 'Our Story')} onChange={(v) => update('about_story_eyebrow', v)} />
            <SettingField label="Story Title" value={get('about_story_title', 'From Humble Beginnings to Market Leaders')} onChange={(v) => update('about_story_title', v)} />
            <SettingField label="Story Paragraph 1" type="textarea" value={get('about_story_p1', "Oceans Uganda was founded in 2012 with a vision to transform the property experience in Kampala. Starting with a small team of three agents and a handful of listings, we quickly built a reputation for honesty and results.")} onChange={(v) => update('about_story_p1', v)} />
            <SettingField label="Story Paragraph 2" type="textarea" value={get('about_story_p2', "Today, we are proud to be one of Kampala's leading property agencies, with a portfolio spanning residential sales, lettings, property management, and new developments across the city's most sought-after neighbourhoods.")} onChange={(v) => update('about_story_p2', v)} />
            <SettingField label="Founded Year" value={get('about_founded_year', '2012')} onChange={(v) => update('about_founded_year', v)} />
          </div>

          {/* CTA */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-cursor-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Block</h3>
            </div>
            <SettingField label="Show CTA" type="toggle" value={get('about_cta_visible', 'true')} onChange={(v) => update('about_cta_visible', v)} />
            <SettingField label="CTA Title" value={get('about_cta_title', 'Ready to Find Your Perfect Property?')} onChange={(v) => update('about_cta_title', v)} />
            <SettingField label="CTA Body" type="textarea" value={get('about_cta_body', "Whether you're buying, selling, or renting — our team is ready to help. Get in touch today for a free consultation.")} onChange={(v) => update('about_cta_body', v)} />
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Primary Button Label" value={get('about_cta_btn1_label', 'Browse Properties')} onChange={(v) => update('about_cta_btn1_label', v)} />
              <SettingField label="Primary Button Link" value={get('about_cta_btn1_link', '/buy')} onChange={(v) => update('about_cta_btn1_link', v)} />
              <SettingField label="Secondary Button Label" value={get('about_cta_btn2_label', 'Contact Us')} onChange={(v) => update('about_cta_btn2_label', v)} />
              <SettingField label="Secondary Button Link" value={get('about_cta_btn2_link', '/contact')} onChange={(v) => update('about_cta_btn2_link', v)} />
            </div>
          </div>
        </div>
      )}

      {/* ── MEDIA TAB ── */}
      {activeTab === 'media' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Background Image</h3>
            <SettingField label="Hero Background" type="image_upload" value={get('about_hero_image', '')} onChange={(v) => update('about_hero_image', v)} hint="Full-width hero background. Recommended: landscape, 1920×700px." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Company Intro Image</h3>
            <SettingField label="Intro / Office Photo" type="image_upload" value={get('about_intro_image', '')} onChange={(v) => update('about_intro_image', v)} hint="Shown beside the company introduction text." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Brand Story Image</h3>
            <SettingField label="Story / History Photo" type="image_upload" value={get('about_story_image', '')} onChange={(v) => update('about_story_image', v)} hint="Shown beside the brand story section." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Background Image</h3>
            <SettingField label="CTA Background" type="image_upload" value={get('about_cta_image', '')} onChange={(v) => update('about_cta_image', v)} hint="Optional background image for the CTA section." />
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
                <SettingField label="Font Family" type="select" value={get('about_hero_title_font', 'Prata')} onChange={(v) => update('about_hero_title_font', v)} options={FONT_FAMILIES} />
                <SettingField label="Font Weight" type="select" value={get('about_hero_title_weight', '400')} onChange={(v) => update('about_hero_title_weight', v)} options={FONT_WEIGHTS} />
                <SettingField label="Font Size" type="number" value={get('about_hero_title_size', '48')} onChange={(v) => update('about_hero_title_size', v)} unit="px" min={20} max={100} />
                <SettingField label="Text Color" type="color" value={get('about_hero_title_color', '#ffffff')} onChange={(v) => update('about_hero_title_color', v)} />
                <SettingField label="Letter Spacing" type="number" value={get('about_hero_title_spacing', '0')} onChange={(v) => update('about_hero_title_spacing', v)} unit="em" />
                <SettingField label="Text Transform" type="select" value={get('about_hero_title_transform', 'none')} onChange={(v) => update('about_hero_title_transform', v)} options={TEXT_TRANSFORMS} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Headings (H2)</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('about_h2_font', 'Prata')} onChange={(v) => update('about_h2_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('about_h2_weight', '400')} onChange={(v) => update('about_h2_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('about_h2_size', '32')} onChange={(v) => update('about_h2_size', v)} unit="px" min={16} max={72} />
              <SettingField label="Text Color" type="color" value={get('about_h2_color', '#001731')} onChange={(v) => update('about_h2_color', v)} />
              <SettingField label="Letter Spacing" type="number" value={get('about_h2_spacing', '0')} onChange={(v) => update('about_h2_spacing', v)} unit="em" />
              <SettingField label="Text Transform" type="select" value={get('about_h2_transform', 'none')} onChange={(v) => update('about_h2_transform', v)} options={TEXT_TRANSFORMS} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Body Text</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('about_body_font', '')} onChange={(v) => update('about_body_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('about_body_weight', '400')} onChange={(v) => update('about_body_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('about_body_size', '14')} onChange={(v) => update('about_body_size', v)} unit="px" min={10} max={24} />
              <SettingField label="Line Height" type="number" value={get('about_body_lh', '1.7')} onChange={(v) => update('about_body_lh', v)} placeholder="1.7" />
              <SettingField label="Text Color" type="color" value={get('about_body_color', '#4B5563')} onChange={(v) => update('about_body_color', v)} />
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
              <SettingField label="Overlay Color" type="color" value={get('about_hero_overlay_color', '#000000')} onChange={(v) => update('about_hero_overlay_color', v)} />
              <SettingField label="Overlay Opacity" type="number" value={get('about_hero_overlay_opacity', '60')} onChange={(v) => update('about_hero_overlay_opacity', v)} unit="%" min={0} max={90} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Backgrounds</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Intro Section BG" type="color" value={get('about_intro_bg', '#ffffff')} onChange={(v) => update('about_intro_bg', v)} />
              <SettingField label="Mission/Vision BG" type="color" value={get('about_mv_bg', '#F5F7F7')} onChange={(v) => update('about_mv_bg', v)} />
              <SettingField label="Values Section BG" type="color" value={get('about_values_bg', '#ffffff')} onChange={(v) => update('about_values_bg', v)} />
              <SettingField label="Stats Strip BG" type="color" value={get('about_stats_bg', '#001731')} onChange={(v) => update('about_stats_bg', v)} />
              <SettingField label="Team Section BG" type="color" value={get('about_team_bg', '#F5F7F7')} onChange={(v) => update('about_team_bg', v)} />
              <SettingField label="CTA Section BG" type="color" value={get('about_cta_bg', '#001731')} onChange={(v) => update('about_cta_bg', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Accent &amp; Brand Colors</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Accent / Gold Color" type="color" value={get('about_accent_color', '#C9A84C')} onChange={(v) => update('about_accent_color', v)} />
              <SettingField label="Primary Color" type="color" value={get('about_primary_color', '#001731')} onChange={(v) => update('about_primary_color', v)} />
              <SettingField label="Card Background" type="color" value={get('about_card_bg', '#ffffff')} onChange={(v) => update('about_card_bg', v)} />
              <SettingField label="Card Border Color" type="color" value={get('about_card_border', '#F3F4F6')} onChange={(v) => update('about_card_border', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Spacing</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Section Vertical Padding" type="number" value={get('about_section_py', '80')} onChange={(v) => update('about_section_py', v)} unit="px" min={20} max={200} />
              <SettingField label="Card Gap" type="number" value={get('about_card_gap', '32')} onChange={(v) => update('about_card_gap', v)} unit="px" min={8} max={80} />
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT TAB ── */}
      {activeTab === 'layout' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Visibility</h3>
            <p className="text-xs text-stone-400">Toggle each section on or off from the page.</p>
            <SettingField label="Hero Section" type="toggle" value={get('about_hero_visible', 'true')} onChange={(v) => update('about_hero_visible', v)} />
            <SettingField label="Company Introduction" type="toggle" value={get('about_intro_visible', 'true')} onChange={(v) => update('about_intro_visible', v)} />
            <SettingField label="Mission &amp; Vision" type="toggle" value={get('about_mv_visible', 'true')} onChange={(v) => update('about_mv_visible', v)} />
            <SettingField label="Brand Values" type="toggle" value={get('about_values_visible', 'true')} onChange={(v) => update('about_values_visible', v)} />
            <SettingField label="Why Choose Us" type="toggle" value={get('about_why_visible', 'true')} onChange={(v) => update('about_why_visible', v)} />
            <SettingField label="Stats Strip" type="toggle" value={get('about_stats_visible', 'true')} onChange={(v) => update('about_stats_visible', v)} />
            <SettingField label="Team Section" type="toggle" value={get('about_team_visible', 'true')} onChange={(v) => update('about_team_visible', v)} />
            <SettingField label="Brand Story" type="toggle" value={get('about_story_visible', 'true')} onChange={(v) => update('about_story_visible', v)} />
            <SettingField label="CTA Block" type="toggle" value={get('about_cta_visible', 'true')} onChange={(v) => update('about_cta_visible', v)} />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Layout Options</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Intro Image Position" type="select" value={get('about_intro_img_pos', 'right')} onChange={(v) => update('about_intro_img_pos', v)} options={[{ value: 'left', label: 'Image Left' }, { value: 'right', label: 'Image Right' }]} />
              <SettingField label="Story Image Position" type="select" value={get('about_story_img_pos', 'left')} onChange={(v) => update('about_story_img_pos', v)} options={[{ value: 'left', label: 'Image Left' }, { value: 'right', label: 'Image Right' }]} />
              <SettingField label="Values Grid Columns" type="select" value={get('about_values_cols', '4')} onChange={(v) => update('about_values_cols', v)} options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }]} />
              <SettingField label="Team Grid Columns" type="select" value={get('about_team_cols', '3')} onChange={(v) => update('about_team_cols', v)} options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }]} />
            </div>
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
            <SettingField label="Meta Title" value={get('about_seo_title', 'About Oceans Uganda | Kampala\'s Trusted Property Agency')} onChange={(v) => update('about_seo_title', v)} hint="60 characters max." />
            <SettingField label="Meta Description" type="textarea" value={get('about_seo_description', "Learn about Oceans Uganda — Kampala's most trusted property agency. 12+ years of experience in residential sales, lettings, and property management across Uganda.")} onChange={(v) => update('about_seo_description', v)} hint="120–160 characters." />
            <SettingField label="Keywords" value={get('about_seo_keywords', 'about Oceans Uganda, property agency Kampala, real estate Uganda')} onChange={(v) => update('about_seo_keywords', v)} hint="3–5 keywords, comma-separated." />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Open Graph (Social Sharing)</h3>
            <SettingField label="OG Title" value={get('about_og_title', 'About Oceans Uganda | Kampala\'s Trusted Property Agency')} onChange={(v) => update('about_og_title', v)} />
            <SettingField label="OG Description" type="textarea" value={get('about_og_description', "Kampala's most trusted property agency — 12+ years of experience in residential sales, lettings, and property management.")} onChange={(v) => update('about_og_description', v)} />
            <SettingField label="OG Image" type="image_upload" value={get('about_og_image', '')} onChange={(v) => update('about_og_image', v)} hint="Recommended: 1200×630px." />
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
