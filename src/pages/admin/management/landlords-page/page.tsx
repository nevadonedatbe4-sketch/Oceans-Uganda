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

type TabId = 'content' | 'media' | 'modules' | 'typography' | 'styling' | 'layout' | 'seo';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'content', label: 'Content', icon: 'ri-text' },
  { id: 'media', label: 'Media', icon: 'ri-image-2-line' },
  { id: 'modules', label: 'Modules', icon: 'ri-layout-masonry-line' },
  { id: 'typography', label: 'Typography', icon: 'ri-font-size' },
  { id: 'styling', label: 'Styling', icon: 'ri-palette-line' },
  { id: 'layout', label: 'Layout', icon: 'ri-layout-grid-line' },
  { id: 'seo', label: 'SEO', icon: 'ri-search-2-line' },
];

export default function LandlordsPageManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('landlords_page_settings');
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
        icon="ri-home-heart-line"
        title="Landlords Page — Full Control"
        description="Complete control over every section of the Landlords page — content, modules, media, typography, styling, layout, and SEO."
      />

      <div className="flex items-start gap-3 bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-lg px-4 py-3">
        <i className="ri-information-line text-[#1B4332] mt-0.5 shrink-0" />
        <p className="text-sm text-[#1B4332]/80">
          Basic hero text and images are also editable in <strong>Content &amp; Pages → Landlords Page</strong>. This panel adds full module, typography, styling, and SEO control.
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
            <SettingField label="Eyebrow / Label" value={get('lp_hero_eyebrow', 'For Landlords & Property Owners')} onChange={(v) => update('lp_hero_eyebrow', v)} />
            <SettingField label="Hero Title" type="textarea" value={get('lp_hero_title', 'Let or Sell Your Property With Confidence')} onChange={(v) => update('lp_hero_title', v)} />
            <SettingField label="Hero Subtitle" type="textarea" value={get('lp_hero_subtitle', "Kampala's most trusted letting and management agency. We find quality tenants fast, collect your rent reliably, and protect your investment for the long term.")} onChange={(v) => update('lp_hero_subtitle', v)} />
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Primary Button Label" value={get('lp_btn1_label', 'List My Property')} onChange={(v) => update('lp_btn1_label', v)} />
              <SettingField label="Primary Button Link" value={get('lp_btn1_link', '#landlord-form')} onChange={(v) => update('lp_btn1_link', v)} />
              <SettingField label="Secondary Button Label" value={get('lp_btn2_label', 'Free Valuation')} onChange={(v) => update('lp_btn2_label', v)} />
              <SettingField label="Secondary Button Link" value={get('lp_btn2_link', '#landlord-form')} onChange={(v) => update('lp_btn2_link', v)} />
            </div>
          </div>

          {/* Stats Strip */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-bar-chart-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Stats Strip</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <>
                  <SettingField key={`sv${n}`} label={`Stat ${n} Value`} value={get(`lp_stat${n}_value`, ['200+', '98%', '12+', '14 days'][n - 1])} onChange={(v) => update(`lp_stat${n}_value`, v)} />
                  <SettingField key={`sl${n}`} label={`Stat ${n} Label`} value={get(`lp_stat${n}_label`, ['Properties Managed', 'Occupancy Rate', 'Years Experience', 'Avg. Time to Let'][n - 1])} onChange={(v) => update(`lp_stat${n}_label`, v)} />
                </>
              ))}
            </div>
          </div>

          {/* Intro Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-article-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Intro Section</h3>
            </div>
            <SettingField label="Intro Title" value={get('lp_intro_title', 'Your Property Is Our Priority')} onChange={(v) => update('lp_intro_title', v)} />
            <SettingField label="Intro Paragraph 1" type="textarea" value={get('lp_intro_p1', "At Oceans Uganda, we understand that your property is more than an asset — it's a significant investment. Our dedicated landlord team treats every property as if it were their own: maximising returns, minimising voids, and ensuring every tenancy runs smoothly.")} onChange={(v) => update('lp_intro_p1', v)} />
            <SettingField label="Intro Paragraph 2" type="textarea" value={get('lp_intro_p2', "With deep roots in Kampala's premium property market, we have the network, experience, and systems to consistently deliver outstanding results for landlords across Kololo, Nakasero, Muyenga, and beyond.")} onChange={(v) => update('lp_intro_p2', v)} />
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Stat Badge Value" value={get('lp_badge_value', '98%')} onChange={(v) => update('lp_badge_value', v)} />
              <SettingField label="Stat Badge Label" value={get('lp_badge_label', 'Occupancy Rate')} onChange={(v) => update('lp_badge_label', v)} />
            </div>
          </div>

          {/* Guarantee Strip */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-shield-check-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Guarantee Strip</h3>
            </div>
            <SettingField label="Show Guarantee Strip" type="toggle" value={get('lp_guarantee_visible', 'true')} onChange={(v) => update('lp_guarantee_visible', v)} />
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Guarantee {n}</p>
                <div className="grid grid-cols-2 gap-3">
                  <SettingField label="Title" value={get(`lp_guarantee${n}_title`, ['No Let, No Fee', 'Fully Vetted Tenants', 'Rent Guarantee Option'][n - 1])} onChange={(v) => update(`lp_guarantee${n}_title`, v)} />
                  <SettingField label="Icon" value={get(`lp_guarantee${n}_icon`, ['ri-calendar-check-line', 'ri-shield-check-line', 'ri-money-dollar-circle-line'][n - 1])} onChange={(v) => update(`lp_guarantee${n}_icon`, v)} />
                </div>
                <SettingField label="Description" type="textarea" value={get(`lp_guarantee${n}_desc`, ['You only pay when we successfully place a tenant. Zero risk, zero upfront cost.', 'Every applicant undergoes background checks, employment verification, and reference screening.', 'Ask about our rent guarantee scheme — we pay you whether or not the tenant does.'][n - 1])} onChange={(v) => update(`lp_guarantee${n}_desc`, v)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MEDIA TAB ── */}
      {activeTab === 'media' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Background Image</h3>
            <SettingField label="Hero Background" type="image_upload" value={get('lp_hero_image', '')} onChange={(v) => update('lp_hero_image', v)} hint="Full-width hero background. Recommended: landscape, 1920×750px." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Intro Section Image</h3>
            <SettingField label="Intro / Office Photo" type="image_upload" value={get('lp_intro_image', '')} onChange={(v) => update('lp_intro_image', v)} hint="Shown beside the intro text. Recommended: landscape, 700×480px." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Services Section Image</h3>
            <SettingField label="Services Background / Feature Image" type="image_upload" value={get('lp_services_image', '')} onChange={(v) => update('lp_services_image', v)} hint="Optional image for the services section." />
          </div>
        </div>
      )}

      {/* ── MODULES TAB ── */}
      {activeTab === 'modules' && (
        <div className="space-y-5">
          {/* Services */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-service-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Service Blocks</h3>
            </div>
            <SettingField label="Show Services Section" type="toggle" value={get('lp_services_visible', 'true')} onChange={(v) => update('lp_services_visible', v)} />
            <SettingField label="Services Section Title" value={get('lp_services_title', 'Our Landlord Services')} onChange={(v) => update('lp_services_title', v)} />
            <SettingField label="Services Section Subtitle" type="textarea" value={get('lp_services_subtitle', 'Everything you need to let and manage your property with confidence.')} onChange={(v) => update('lp_services_subtitle', v)} />
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Service {n}</p>
                <div className="grid grid-cols-2 gap-3">
                  <SettingField label="Title" value={get(`lp_service${n}_title`, ['Tenant Finding', 'Full Management', 'Rent Collection', 'Property Maintenance'][n - 1])} onChange={(v) => update(`lp_service${n}_title`, v)} />
                  <SettingField label="Icon" value={get(`lp_service${n}_icon`, ['ri-user-search-line', 'ri-home-gear-line', 'ri-money-dollar-circle-line', 'ri-tools-line'][n - 1])} onChange={(v) => update(`lp_service${n}_icon`, v)} />
                </div>
                <SettingField label="Description" type="textarea" value={get(`lp_service${n}_desc`, ['We market your property across all major platforms and our own database of pre-qualified tenants.', 'We handle everything — from tenant vetting to maintenance coordination and rent collection.', 'Reliable monthly rent collection with detailed statements and direct bank transfers.', 'Trusted contractor network for repairs, inspections, and property upkeep.'][n - 1])} onChange={(v) => update(`lp_service${n}_desc`, v)} />
              </div>
            ))}
          </div>

          {/* Process Steps */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-list-ordered text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Process Steps</h3>
            </div>
            <SettingField label="Show Process Section" type="toggle" value={get('lp_process_visible', 'true')} onChange={(v) => update('lp_process_visible', v)} />
            <SettingField label="Section Title" value={get('lp_process_title', 'How It Works')} onChange={(v) => update('lp_process_title', v)} />
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Step {n}</p>
                <SettingField label="Step Title" value={get(`lp_step${n}_title`, ['Free Valuation', 'Property Listing', 'Tenant Vetting', 'Move In'][n - 1])} onChange={(v) => update(`lp_step${n}_title`, v)} />
                <SettingField label="Step Description" type="textarea" value={get(`lp_step${n}_desc`, ['We assess your property and provide a free, no-obligation rental valuation.', 'Professional photography and listing across all major platforms within 48 hours.', 'Thorough background checks, employment verification, and reference screening.', 'Tenancy agreement, deposit collection, and smooth move-in coordination.'][n - 1])} onChange={(v) => update(`lp_step${n}_desc`, v)} />
              </div>
            ))}
          </div>

          {/* Benefits Cards */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-star-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Benefits Cards</h3>
            </div>
            <SettingField label="Show Benefits Section" type="toggle" value={get('lp_benefits_visible', 'true')} onChange={(v) => update('lp_benefits_visible', v)} />
            <SettingField label="Section Title" value={get('lp_benefits_title', 'Why Landlords Choose Us')} onChange={(v) => update('lp_benefits_title', v)} />
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Benefit {n}</p>
                <SettingField label="Title" value={get(`lp_benefit${n}_title`, ['Maximum Returns', 'Minimum Voids', 'Full Transparency'][n - 1])} onChange={(v) => update(`lp_benefit${n}_title`, v)} />
                <SettingField label="Description" type="textarea" value={get(`lp_benefit${n}_desc`, ['We price your property correctly from day one to maximise your rental income.', 'Our proactive approach means your property is rarely empty between tenancies.', 'Monthly statements, online portal access, and 24/7 communication with your dedicated manager.'][n - 1])} onChange={(v) => update(`lp_benefit${n}_desc`, v)} />
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-question-answer-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">FAQ Section</h3>
            </div>
            <SettingField label="Show FAQ Section" type="toggle" value={get('lp_faq_visible', 'true')} onChange={(v) => update('lp_faq_visible', v)} />
            <SettingField label="FAQ Section Title" value={get('lp_faq_title', 'Frequently Asked Questions')} onChange={(v) => update('lp_faq_title', v)} />
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">FAQ {n}</p>
                <SettingField label="Question" value={get(`lp_faq${n}_q`, ['How much does it cost to let my property?', 'How long does it take to find a tenant?', 'Do you handle maintenance and repairs?', 'What happens if a tenant doesn\'t pay rent?', 'Can I use your tenant-finding service only?'][n - 1])} onChange={(v) => update(`lp_faq${n}_q`, v)} />
                <SettingField label="Answer" type="textarea" value={get(`lp_faq${n}_a`, ['Our fees depend on the service level you choose. Contact us for a personalised quote.', 'On average, we find a qualified tenant within 14 days of listing.', 'Yes — our full management service includes coordinating all maintenance and repairs.', 'We have robust rent collection procedures and can pursue arrears on your behalf.', 'Yes, we offer a tenant-finding only service for landlords who prefer to self-manage.'][n - 1])} onChange={(v) => update(`lp_faq${n}_a`, v)} />
              </div>
            ))}
          </div>

          {/* Landlord CTA */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-cursor-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Landlord CTA Block</h3>
            </div>
            <SettingField label="Show CTA Block" type="toggle" value={get('lp_cta_visible', 'true')} onChange={(v) => update('lp_cta_visible', v)} />
            <SettingField label="CTA Title" value={get('lp_cta_title', 'Ready to Let Your Property?')} onChange={(v) => update('lp_cta_title', v)} />
            <SettingField label="CTA Body" type="textarea" value={get('lp_cta_body', "Get a free, no-obligation rental valuation from our expert team. We'll tell you exactly what your property is worth and how quickly we can find you a tenant.")} onChange={(v) => update('lp_cta_body', v)} />
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="CTA Button Label" value={get('lp_cta_btn_label', 'Get Free Valuation')} onChange={(v) => update('lp_cta_btn_label', v)} />
              <SettingField label="CTA Button Link" value={get('lp_cta_btn_link', '#landlord-form')} onChange={(v) => update('lp_cta_btn_link', v)} />
            </div>
          </div>

          {/* Enquiry Form Block */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-file-list-3-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Enquiry Form Block</h3>
            </div>
            <SettingField label="Show Enquiry Form" type="toggle" value={get('lp_form_visible', 'true')} onChange={(v) => update('lp_form_visible', v)} />
            <SettingField label="Form Section Title" value={get('lp_form_title', 'Get a Free Valuation')} onChange={(v) => update('lp_form_title', v)} />
            <SettingField label="Form Section Subtitle" type="textarea" value={get('lp_form_subtitle', "Tell us about your property and we'll be in touch within 24 hours with a free rental valuation and letting proposal.")} onChange={(v) => update('lp_form_subtitle', v)} />
            <SettingField label="Submit Button Label" value={get('lp_form_submit_label', 'Request Free Valuation')} onChange={(v) => update('lp_form_submit_label', v)} />
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
                <SettingField label="Font Family" type="select" value={get('lp_hero_title_font', 'Prata')} onChange={(v) => update('lp_hero_title_font', v)} options={FONT_FAMILIES} />
                <SettingField label="Font Weight" type="select" value={get('lp_hero_title_weight', '400')} onChange={(v) => update('lp_hero_title_weight', v)} options={FONT_WEIGHTS} />
                <SettingField label="Font Size" type="number" value={get('lp_hero_title_size', '56')} onChange={(v) => update('lp_hero_title_size', v)} unit="px" min={20} max={100} />
                <SettingField label="Text Color" type="color" value={get('lp_hero_title_color', '#ffffff')} onChange={(v) => update('lp_hero_title_color', v)} />
                <SettingField label="Letter Spacing" type="number" value={get('lp_hero_title_spacing', '0')} onChange={(v) => update('lp_hero_title_spacing', v)} unit="em" />
                <SettingField label="Text Transform" type="select" value={get('lp_hero_title_transform', 'none')} onChange={(v) => update('lp_hero_title_transform', v)} options={TEXT_TRANSFORMS} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Headings (H2)</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('lp_h2_font', 'Prata')} onChange={(v) => update('lp_h2_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('lp_h2_weight', '400')} onChange={(v) => update('lp_h2_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('lp_h2_size', '32')} onChange={(v) => update('lp_h2_size', v)} unit="px" min={16} max={72} />
              <SettingField label="Text Color" type="color" value={get('lp_h2_color', '#001731')} onChange={(v) => update('lp_h2_color', v)} />
              <SettingField label="Letter Spacing" type="number" value={get('lp_h2_spacing', '0')} onChange={(v) => update('lp_h2_spacing', v)} unit="em" />
              <SettingField label="Text Transform" type="select" value={get('lp_h2_transform', 'none')} onChange={(v) => update('lp_h2_transform', v)} options={TEXT_TRANSFORMS} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Body Text</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('lp_body_font', '')} onChange={(v) => update('lp_body_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('lp_body_weight', '400')} onChange={(v) => update('lp_body_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('lp_body_size', '14')} onChange={(v) => update('lp_body_size', v)} unit="px" min={10} max={24} />
              <SettingField label="Line Height" type="number" value={get('lp_body_lh', '1.6')} onChange={(v) => update('lp_body_lh', v)} placeholder="1.6" />
              <SettingField label="Text Color" type="color" value={get('lp_body_color', '#4B5563')} onChange={(v) => update('lp_body_color', v)} />
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
              <SettingField label="Overlay Color" type="color" value={get('lp_hero_overlay_color', '#000000')} onChange={(v) => update('lp_hero_overlay_color', v)} />
              <SettingField label="Overlay Opacity" type="number" value={get('lp_hero_overlay_opacity', '60')} onChange={(v) => update('lp_hero_overlay_opacity', v)} unit="%" min={0} max={90} />
              <SettingField label="Hero Height" type="number" value={get('lp_hero_height', '750')} onChange={(v) => update('lp_hero_height', v)} unit="px" min={300} max={1000} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Backgrounds</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Stats Strip BG" type="color" value={get('lp_stats_bg', '#001731')} onChange={(v) => update('lp_stats_bg', v)} />
              <SettingField label="Intro Section BG" type="color" value={get('lp_intro_bg', '#ffffff')} onChange={(v) => update('lp_intro_bg', v)} />
              <SettingField label="Services Section BG" type="color" value={get('lp_services_bg', '#F5F7F7')} onChange={(v) => update('lp_services_bg', v)} />
              <SettingField label="Guarantee Strip BG" type="color" value={get('lp_guarantee_bg', '#001731')} onChange={(v) => update('lp_guarantee_bg', v)} />
              <SettingField label="FAQ Section BG" type="color" value={get('lp_faq_bg', '#ffffff')} onChange={(v) => update('lp_faq_bg', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Accent &amp; Brand Colors</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Accent / Gold Color" type="color" value={get('lp_accent_color', '#C9A84C')} onChange={(v) => update('lp_accent_color', v)} />
              <SettingField label="Primary Color" type="color" value={get('lp_primary_color', '#001731')} onChange={(v) => update('lp_primary_color', v)} />
              <SettingField label="Card Background" type="color" value={get('lp_card_bg', '#ffffff')} onChange={(v) => update('lp_card_bg', v)} />
              <SettingField label="Card Border Color" type="color" value={get('lp_card_border', '#F3F4F6')} onChange={(v) => update('lp_card_border', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Spacing</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Section Vertical Padding" type="number" value={get('lp_section_py', '80')} onChange={(v) => update('lp_section_py', v)} unit="px" min={20} max={200} />
              <SettingField label="Card Gap" type="number" value={get('lp_card_gap', '32')} onChange={(v) => update('lp_card_gap', v)} unit="px" min={8} max={80} />
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT TAB ── */}
      {activeTab === 'layout' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Visibility</h3>
            <SettingField label="Hero Section" type="toggle" value={get('lp_hero_visible', 'true')} onChange={(v) => update('lp_hero_visible', v)} />
            <SettingField label="Stats Strip" type="toggle" value={get('lp_stats_visible', 'true')} onChange={(v) => update('lp_stats_visible', v)} />
            <SettingField label="Intro Section" type="toggle" value={get('lp_intro_visible', 'true')} onChange={(v) => update('lp_intro_visible', v)} />
            <SettingField label="Services Section" type="toggle" value={get('lp_services_visible', 'true')} onChange={(v) => update('lp_services_visible', v)} />
            <SettingField label="Process Steps" type="toggle" value={get('lp_process_visible', 'true')} onChange={(v) => update('lp_process_visible', v)} />
            <SettingField label="Benefits Cards" type="toggle" value={get('lp_benefits_visible', 'true')} onChange={(v) => update('lp_benefits_visible', v)} />
            <SettingField label="Guarantee Strip" type="toggle" value={get('lp_guarantee_visible', 'true')} onChange={(v) => update('lp_guarantee_visible', v)} />
            <SettingField label="FAQ Section" type="toggle" value={get('lp_faq_visible', 'true')} onChange={(v) => update('lp_faq_visible', v)} />
            <SettingField label="Enquiry Form" type="toggle" value={get('lp_form_visible', 'true')} onChange={(v) => update('lp_form_visible', v)} />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Layout Options</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Services Grid Columns" type="select" value={get('lp_services_cols', '2')} onChange={(v) => update('lp_services_cols', v)} options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }, { value: '4', label: '4 Columns' }]} />
              <SettingField label="Intro Image Position" type="select" value={get('lp_intro_img_pos', 'right')} onChange={(v) => update('lp_intro_img_pos', v)} options={[{ value: 'left', label: 'Image Left' }, { value: 'right', label: 'Image Right' }]} />
              <SettingField label="Hero Content Alignment" type="select" value={get('lp_hero_align', 'left')} onChange={(v) => update('lp_hero_align', v)} options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }]} />
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
            <SettingField label="Meta Title" value={get('lp_seo_title', 'Landlord Services Kampala | Let Your Property | Oceans Uganda')} onChange={(v) => update('lp_seo_title', v)} hint="60 characters max." />
            <SettingField label="Meta Description" type="textarea" value={get('lp_seo_description', "Let or sell your property with Oceans Uganda — Kampala's most trusted letting agency. Free valuation, tenant finding, full management, and rent guarantee options.")} onChange={(v) => update('lp_seo_description', v)} hint="120–160 characters." />
            <SettingField label="Keywords" value={get('lp_seo_keywords', 'landlord services Kampala, let property Uganda, property management Kampala')} onChange={(v) => update('lp_seo_keywords', v)} hint="3–5 keywords, comma-separated." />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Open Graph (Social Sharing)</h3>
            <SettingField label="OG Title" value={get('lp_og_title', 'Landlord Services Kampala | Oceans Uganda')} onChange={(v) => update('lp_og_title', v)} />
            <SettingField label="OG Description" type="textarea" value={get('lp_og_description', "Let or sell your property with Kampala's most trusted letting agency.")} onChange={(v) => update('lp_og_description', v)} />
            <SettingField label="OG Image" type="image_upload" value={get('lp_og_image', '')} onChange={(v) => update('lp_og_image', v)} hint="Recommended: 1200×630px." />
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
