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

type TabId = 'content' | 'media' | 'form' | 'typography' | 'styling' | 'layout' | 'seo';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'content', label: 'Content', icon: 'ri-text' },
  { id: 'media', label: 'Media', icon: 'ri-image-2-line' },
  { id: 'form', label: 'Form', icon: 'ri-file-list-3-line' },
  { id: 'typography', label: 'Typography', icon: 'ri-font-size' },
  { id: 'styling', label: 'Styling', icon: 'ri-palette-line' },
  { id: 'layout', label: 'Layout', icon: 'ri-layout-grid-line' },
  { id: 'seo', label: 'SEO', icon: 'ri-search-2-line' },
];

export default function ContactPageManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('contact_page_settings');
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
        icon="ri-mail-send-line"
        title="Contact Page"
        description="Full control over the Contact page — hero, form labels, CTA blocks, typography, styling, layout, and SEO."
      />

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <i className="ri-information-line text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-700">
          <strong>Note:</strong> Contact details (phone, email, address, hours, map) are managed in <strong>Company Info → Contact &amp; Company</strong>. This panel controls the page layout, hero, form labels, and styling.
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
            <SettingField label="Show Hero" type="toggle" value={get('cp_hero_visible', 'true')} onChange={(v) => update('cp_hero_visible', v)} />
            <SettingField label="Eyebrow / Label" value={get('cp_hero_eyebrow', "We're Here to Help")} onChange={(v) => update('cp_hero_eyebrow', v)} />
            <SettingField label="Hero Title" value={get('cp_hero_title', 'Get In Touch')} onChange={(v) => update('cp_hero_title', v)} />
            <SettingField label="Hero Subtitle" type="textarea" value={get('cp_hero_subtitle', "Whether you're buying, selling, renting, or just have a question — our team is ready and happy to help.")} onChange={(v) => update('cp_hero_subtitle', v)} />
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-file-list-3-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Form Section Headings</h3>
            </div>
            <SettingField label="Form Eyebrow" value={get('cp_form_eyebrow', 'Send a Message')} onChange={(v) => update('cp_form_eyebrow', v)} />
            <SettingField label="Form Title" value={get('cp_form_title', 'How Can We Help You?')} onChange={(v) => update('cp_form_title', v)} />
            <SettingField label="Form Intro Text" type="textarea" value={get('cp_form_intro', 'Fill in the form below and one of our agents will be in touch within 24 hours. For urgent matters, call us directly.')} onChange={(v) => update('cp_form_intro', v)} />
          </div>

          {/* Sidebar / Details Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-contacts-book-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Contact Details Section</h3>
            </div>
            <SettingField label="Details Eyebrow" value={get('cp_details_eyebrow', 'Our Details')} onChange={(v) => update('cp_details_eyebrow', v)} />
            <SettingField label="Details Title" value={get('cp_details_title', 'Visit or Call Us')} onChange={(v) => update('cp_details_title', v)} />
            <SettingField label="Show WhatsApp Button" type="toggle" value={get('cp_show_whatsapp', 'true')} onChange={(v) => update('cp_show_whatsapp', v)} />
            <SettingField label="Show Call Button" type="toggle" value={get('cp_show_call', 'true')} onChange={(v) => update('cp_show_call', v)} />
            <SettingField label="Show Email Button" type="toggle" value={get('cp_show_email', 'true')} onChange={(v) => update('cp_show_email', v)} />
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-map-pin-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Map Section</h3>
            </div>
            <SettingField label="Show Map" type="toggle" value={get('cp_show_map', 'true')} onChange={(v) => update('cp_show_map', v)} />
            <SettingField label="Map Height" type="number" value={get('cp_map_height', '440')} onChange={(v) => update('cp_map_height', v)} unit="px" min={200} max={800} />
          </div>

          {/* Office Info Strip */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-building-2-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Office Info Strip</h3>
            </div>
            <SettingField label="Show Office Strip" type="toggle" value={get('cp_show_office_strip', 'true')} onChange={(v) => update('cp_show_office_strip', v)} />
            <SettingField label="Strip Eyebrow" value={get('cp_office_eyebrow', 'Our Location')} onChange={(v) => update('cp_office_eyebrow', v)} />
            <SettingField label="Strip Title" value={get('cp_office_title', 'Find Our Office')} onChange={(v) => update('cp_office_title', v)} />
            <SettingField label="Getting Here Text" type="textarea" value={get('cp_getting_here', 'We are located off Luthuli Avenue in Bugolobi. Ample parking is available on-site. 10 minutes from Kampala City Centre.')} onChange={(v) => update('cp_getting_here', v)} />
            <SettingField label="Book Meeting Text" type="textarea" value={get('cp_book_meeting', 'Prefer a face-to-face consultation? Call ahead to book a time with one of our property specialists.')} onChange={(v) => update('cp_book_meeting', v)} />
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-links-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Quick Link Cards (Dark Strip)</h3>
            </div>
            <SettingField label="Show Quick Links Strip" type="toggle" value={get('cp_show_quick_links', 'true')} onChange={(v) => update('cp_show_quick_links', v)} />
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-stone-100 rounded-lg p-3 space-y-2">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Quick Link {n}</p>
                <div className="grid grid-cols-2 gap-2">
                  <SettingField label="Label" value={get(`cp_ql${n}_label`, ['Browse Properties For Sale', 'Properties To Rent', 'Landlord Services', 'Free Valuation'][n - 1])} onChange={(v) => update(`cp_ql${n}_label`, v)} />
                  <SettingField label="Link" value={get(`cp_ql${n}_link`, ['/buy', '/rent', '/landlords', '/valuation'][n - 1])} onChange={(v) => update(`cp_ql${n}_link`, v)} />
                </div>
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
            <p className="text-xs text-stone-400 -mt-2">This is the same image as in Contact &amp; Company → Page Images. Editing here updates it there too.</p>
            <SettingField label="Hero Background" type="image_upload" value={get('cp_hero_image', '')} onChange={(v) => update('cp_hero_image', v)} hint="Full-width hero background. Recommended: landscape, 1920×650px." />
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Sidebar / Office Photo</h3>
            <SettingField label="Office / Sidebar Photo" type="image_upload" value={get('cp_sidebar_image', '')} onChange={(v) => update('cp_sidebar_image', v)} hint="Optional photo shown in the contact sidebar." />
          </div>
        </div>
      )}

      {/* ── FORM TAB ── */}
      {activeTab === 'form' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <i className="ri-file-list-3-line text-[#1B4332]" />
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Contact Form Labels</h3>
            </div>
            <p className="text-xs text-stone-400">Customise the labels and placeholders shown in the contact form.</p>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="First Name Label" value={get('cp_form_fname_label', 'First Name')} onChange={(v) => update('cp_form_fname_label', v)} />
              <SettingField label="Last Name Label" value={get('cp_form_lname_label', 'Last Name')} onChange={(v) => update('cp_form_lname_label', v)} />
              <SettingField label="Email Label" value={get('cp_form_email_label', 'Email Address')} onChange={(v) => update('cp_form_email_label', v)} />
              <SettingField label="Phone Label" value={get('cp_form_phone_label', 'Phone Number')} onChange={(v) => update('cp_form_phone_label', v)} />
              <SettingField label="Subject Label" value={get('cp_form_subject_label', 'Subject')} onChange={(v) => update('cp_form_subject_label', v)} />
              <SettingField label="Message Label" value={get('cp_form_message_label', 'Your Message')} onChange={(v) => update('cp_form_message_label', v)} />
            </div>
            <SettingField label="Submit Button Label" value={get('cp_form_submit_label', 'Send Message')} onChange={(v) => update('cp_form_submit_label', v)} />
            <SettingField label="Success Message" type="textarea" value={get('cp_form_success_msg', "Thank you! We've received your message and will be in touch within 24 hours.")} onChange={(v) => update('cp_form_success_msg', v)} />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Form Enquiry Types</h3>
            <p className="text-xs text-stone-400">The dropdown options shown in the "Subject" or "Enquiry Type" field.</p>
            {[1, 2, 3, 4, 5].map((n) => (
              <SettingField key={n} label={`Option ${n}`} value={get(`cp_form_type${n}`, ['General Enquiry', 'Property Viewing', 'Valuation Request', 'Landlord Services', 'Investment Advice'][n - 1])} onChange={(v) => update(`cp_form_type${n}`, v)} />
            ))}
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Form Styling</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Submit Button BG" type="color" value={get('cp_form_btn_bg', '#001731')} onChange={(v) => update('cp_form_btn_bg', v)} />
              <SettingField label="Submit Button Text" type="color" value={get('cp_form_btn_text', '#ffffff')} onChange={(v) => update('cp_form_btn_text', v)} />
              <SettingField label="Input Border Color" type="color" value={get('cp_form_input_border', '#E5E7EB')} onChange={(v) => update('cp_form_input_border', v)} />
              <SettingField label="Input Focus Color" type="color" value={get('cp_form_input_focus', '#001731')} onChange={(v) => update('cp_form_input_focus', v)} />
            </div>
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
                <SettingField label="Font Family" type="select" value={get('cp_hero_title_font', 'Prata')} onChange={(v) => update('cp_hero_title_font', v)} options={FONT_FAMILIES} />
                <SettingField label="Font Weight" type="select" value={get('cp_hero_title_weight', '400')} onChange={(v) => update('cp_hero_title_weight', v)} options={FONT_WEIGHTS} />
                <SettingField label="Font Size" type="number" value={get('cp_hero_title_size', '48')} onChange={(v) => update('cp_hero_title_size', v)} unit="px" min={20} max={100} />
                <SettingField label="Text Color" type="color" value={get('cp_hero_title_color', '#ffffff')} onChange={(v) => update('cp_hero_title_color', v)} />
                <SettingField label="Letter Spacing" type="number" value={get('cp_hero_title_spacing', '0')} onChange={(v) => update('cp_hero_title_spacing', v)} unit="em" />
                <SettingField label="Text Transform" type="select" value={get('cp_hero_title_transform', 'none')} onChange={(v) => update('cp_hero_title_transform', v)} options={TEXT_TRANSFORMS} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Headings (H2)</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('cp_h2_font', 'Prata')} onChange={(v) => update('cp_h2_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('cp_h2_weight', '400')} onChange={(v) => update('cp_h2_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('cp_h2_size', '30')} onChange={(v) => update('cp_h2_size', v)} unit="px" min={16} max={72} />
              <SettingField label="Text Color" type="color" value={get('cp_h2_color', '#001731')} onChange={(v) => update('cp_h2_color', v)} />
              <SettingField label="Letter Spacing" type="number" value={get('cp_h2_spacing', '0')} onChange={(v) => update('cp_h2_spacing', v)} unit="em" />
              <SettingField label="Text Transform" type="select" value={get('cp_h2_transform', 'none')} onChange={(v) => update('cp_h2_transform', v)} options={TEXT_TRANSFORMS} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Body Text</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('cp_body_font', '')} onChange={(v) => update('cp_body_font', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('cp_body_weight', '400')} onChange={(v) => update('cp_body_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('cp_body_size', '14')} onChange={(v) => update('cp_body_size', v)} unit="px" min={10} max={24} />
              <SettingField label="Line Height" type="number" value={get('cp_body_lh', '1.6')} onChange={(v) => update('cp_body_lh', v)} placeholder="1.6" />
              <SettingField label="Text Color" type="color" value={get('cp_body_color', '#4B5563')} onChange={(v) => update('cp_body_color', v)} />
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
              <SettingField label="Overlay Color" type="color" value={get('cp_hero_overlay_color', '#000000')} onChange={(v) => update('cp_hero_overlay_color', v)} />
              <SettingField label="Overlay Opacity" type="number" value={get('cp_hero_overlay_opacity', '65')} onChange={(v) => update('cp_hero_overlay_opacity', v)} unit="%" min={0} max={90} />
              <SettingField label="Hero Height" type="number" value={get('cp_hero_height', '650')} onChange={(v) => update('cp_hero_height', v)} unit="px" min={300} max={900} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Backgrounds</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Quick Links Strip BG" type="color" value={get('cp_quick_links_bg', '#001731')} onChange={(v) => update('cp_quick_links_bg', v)} />
              <SettingField label="Form Section BG" type="color" value={get('cp_form_section_bg', '#ffffff')} onChange={(v) => update('cp_form_section_bg', v)} />
              <SettingField label="Office Strip BG" type="color" value={get('cp_office_strip_bg', '#ffffff')} onChange={(v) => update('cp_office_strip_bg', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Accent Colors</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Accent / Gold Color" type="color" value={get('cp_accent_color', '#C9A84C')} onChange={(v) => update('cp_accent_color', v)} />
              <SettingField label="Primary Color" type="color" value={get('cp_primary_color', '#001731')} onChange={(v) => update('cp_primary_color', v)} />
              <SettingField label="Icon BG Color" type="color" value={get('cp_icon_bg', '#001731')} onChange={(v) => update('cp_icon_bg', v)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Spacing</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Section Vertical Padding" type="number" value={get('cp_section_py', '80')} onChange={(v) => update('cp_section_py', v)} unit="px" min={20} max={200} />
              <SettingField label="Form Card Padding" type="number" value={get('cp_form_padding', '40')} onChange={(v) => update('cp_form_padding', v)} unit="px" min={16} max={80} />
            </div>
          </div>
        </div>
      )}

      {/* ── LAYOUT TAB ── */}
      {activeTab === 'layout' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Section Visibility</h3>
            <SettingField label="Hero Section" type="toggle" value={get('cp_hero_visible', 'true')} onChange={(v) => update('cp_hero_visible', v)} />
            <SettingField label="Quick Links Strip" type="toggle" value={get('cp_show_quick_links', 'true')} onChange={(v) => update('cp_show_quick_links', v)} />
            <SettingField label="Contact Form" type="toggle" value={get('cp_show_form', 'true')} onChange={(v) => update('cp_show_form', v)} />
            <SettingField label="Contact Sidebar / Details" type="toggle" value={get('cp_show_sidebar', 'true')} onChange={(v) => update('cp_show_sidebar', v)} />
            <SettingField label="Map Section" type="toggle" value={get('cp_show_map', 'true')} onChange={(v) => update('cp_show_map', v)} />
            <SettingField label="Office Info Strip" type="toggle" value={get('cp_show_office_strip', 'true')} onChange={(v) => update('cp_show_office_strip', v)} />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Layout Options</h3>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Hero Content Alignment" type="select" value={get('cp_hero_align', 'center')} onChange={(v) => update('cp_hero_align', v)} options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }]} />
              <SettingField label="Form Layout" type="select" value={get('cp_form_layout', 'sidebar')} onChange={(v) => update('cp_form_layout', v)} options={[{ value: 'sidebar', label: 'Form + Sidebar (2/3 + 1/3)' }, { value: 'full', label: 'Full Width Form' }]} />
              <SettingField label="Office Strip Columns" type="select" value={get('cp_office_cols', '3')} onChange={(v) => update('cp_office_cols', v)} options={[{ value: '2', label: '2 Columns' }, { value: '3', label: '3 Columns' }]} />
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
            <SettingField label="Meta Title" value={get('cp_seo_title', 'Contact Oceans Uganda | Property Agency Kampala')} onChange={(v) => update('cp_seo_title', v)} hint="60 characters max." />
            <SettingField label="Meta Description" type="textarea" value={get('cp_seo_description', "Get in touch with Oceans Uganda — Kampala's leading property agency. Call, email, or visit our office in Bugolobi. We're here to help with buying, selling, and renting.")} onChange={(v) => update('cp_seo_description', v)} hint="120–160 characters." />
            <SettingField label="Keywords" value={get('cp_seo_keywords', 'contact Oceans Uganda, property agency Kampala, real estate contact Uganda')} onChange={(v) => update('cp_seo_keywords', v)} hint="3–5 keywords, comma-separated." />
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Open Graph (Social Sharing)</h3>
            <SettingField label="OG Title" value={get('cp_og_title', 'Contact Oceans Uganda | Property Agency Kampala')} onChange={(v) => update('cp_og_title', v)} />
            <SettingField label="OG Description" type="textarea" value={get('cp_og_description', "Get in touch with Kampala's leading property agency. We're here to help.")} onChange={(v) => update('cp_og_description', v)} />
            <SettingField label="OG Image" type="image_upload" value={get('cp_og_image', '')} onChange={(v) => update('cp_og_image', v)} hint="Recommended: 1200×630px." />
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
