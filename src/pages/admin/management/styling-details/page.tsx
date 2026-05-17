import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

export default function StylingDetailsPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('styling_details');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[760px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-article-line"
        title="Property Details Page Styling"
        description="Control the visual appearance of the single property detail page — typography, colors, sections, and containers."
      />

      {/* Header / Title Area */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Header &amp; Title Area</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Property Title Font Size" type="number" value={get('detail_title_size', '24')} onChange={(v) => update('detail_title_size', v)} unit="px" min={16} max={48} />
          <SettingField label="Title Color" type="color" value={get('detail_title_color', '#001731')} onChange={(v) => update('detail_title_color', v)} />
          <SettingField label="Location Text Color" type="color" value={get('detail_location_color', '#78716c')} onChange={(v) => update('detail_location_color', v)} />
          <SettingField label="Location Icon Color" type="color" value={get('detail_location_icon_color', '#D5A91C')} onChange={(v) => update('detail_location_icon_color', v)} />
          <SettingField label="Header Spacing (bottom)" type="number" value={get('detail_header_spacing', '20')} onChange={(v) => update('detail_header_spacing', v)} unit="px" min={8} max={60} />
          <SettingField label="Page Background Color" type="color" value={get('detail_page_bg', '#f8f7f4')} onChange={(v) => update('detail_page_bg', v)} hint="Background color of the entire detail page." />
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Price Section</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Price Font Size" type="number" value={get('detail_price_size', '24')} onChange={(v) => update('detail_price_size', v)} unit="px" min={14} max={48} />
          <SettingField label="Price Color" type="color" value={get('detail_price_color', '#001731')} onChange={(v) => update('detail_price_color', v)} />
          <SettingField label="Price Note Color" type="color" value={get('detail_price_note_color', '#78716c')} onChange={(v) => update('detail_price_note_color', v)} hint="Color for the price note / frequency text." />
          <SettingField label="Currency Style" type="select" value={get('detail_currency_style', 'symbol')} onChange={(v) => update('detail_currency_style', v)} options={[{ value: 'symbol', label: 'Symbol ($, UGX)' }, { value: 'code', label: 'Code (USD, UGX)' }, { value: 'both', label: 'Both' }]} />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Meta / Stats Bar</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Stats Bar Background" type="color" value={get('detail_stats_bg', '#ffffff')} onChange={(v) => update('detail_stats_bg', v)} />
          <SettingField label="Stats Bar Border Color" type="color" value={get('detail_stats_border', '#e7e5e4')} onChange={(v) => update('detail_stats_border', v)} />
          <SettingField label="Stats Icon Color" type="color" value={get('detail_stats_icon_color', '#a8a29e')} onChange={(v) => update('detail_stats_icon_color', v)} />
          <SettingField label="Stats Value Color" type="color" value={get('detail_stats_value_color', '#001731')} onChange={(v) => update('detail_stats_value_color', v)} />
          <SettingField label="Stats Label Color" type="color" value={get('detail_stats_label_color', '#a8a29e')} onChange={(v) => update('detail_stats_label_color', v)} />
          <SettingField label="Stats Bar Border Radius" type="number" value={get('detail_stats_radius', '2')} onChange={(v) => update('detail_stats_radius', v)} unit="px" min={0} max={20} />
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Gallery &amp; Media</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Gallery Border Radius" type="number" value={get('detail_gallery_radius', '4')} onChange={(v) => update('detail_gallery_radius', v)} unit="px" min={0} max={24} />
          <SettingField label="Thumbnail Border Radius" type="number" value={get('detail_thumb_radius', '3')} onChange={(v) => update('detail_thumb_radius', v)} unit="px" min={0} max={16} />
          <SettingField label="Active Thumbnail Border Color" type="color" value={get('detail_thumb_active_color', '#D5A91C')} onChange={(v) => update('detail_thumb_active_color', v)} hint="Border color of the selected thumbnail." />
          <SettingField label="Gallery Spacing" type="number" value={get('detail_gallery_gap', '8')} onChange={(v) => update('detail_gallery_gap', v)} unit="px" min={0} max={24} />
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Content Sections (Overview, Features, Description…)</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Section Title Font Size" type="number" value={get('detail_section_title_size', '15')} onChange={(v) => update('detail_section_title_size', v)} unit="px" min={12} max={32} />
          <SettingField label="Section Title Color" type="color" value={get('detail_section_title_color', '#001731')} onChange={(v) => update('detail_section_title_color', v)} />
          <SettingField label="Section Top Spacing" type="number" value={get('detail_section_spacing_top', '24')} onChange={(v) => update('detail_section_spacing_top', v)} unit="px" min={8} max={80} />
          <SettingField label="Section Bottom Spacing" type="number" value={get('detail_section_spacing_bottom', '24')} onChange={(v) => update('detail_section_spacing_bottom', v)} unit="px" min={8} max={80} />
          <SettingField label="Section Background Color" type="color" value={get('detail_section_bg', '#ffffff')} onChange={(v) => update('detail_section_bg', v)} hint="Background of each content section card." />
          <SettingField label="Section Border Color" type="color" value={get('detail_section_border', '#e7e5e4')} onChange={(v) => update('detail_section_border', v)} />
          <SettingField label="Section Border Radius" type="number" value={get('detail_section_radius', '4')} onChange={(v) => update('detail_section_radius', v)} unit="px" min={0} max={24} />
          <SettingField label="Section Shadow" type="select" value={get('detail_section_shadow', 'none')} onChange={(v) => update('detail_section_shadow', v)} options={[{ value: 'none', label: 'None' }, { value: 'soft', label: 'Soft' }, { value: 'strong', label: 'Strong' }]} />
          <SettingField label="Body Text Color" type="color" value={get('detail_body_text_color', '#44403c')} onChange={(v) => update('detail_body_text_color', v)} hint="Color for description and body text." />
          <SettingField label="Body Text Font Size" type="number" value={get('detail_body_text_size', '14')} onChange={(v) => update('detail_body_text_size', v)} unit="px" min={12} max={20} />
        </div>
      </div>

      {/* Amenity / Feature Chips */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Amenity &amp; Feature Chips</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Chip Background Color" type="color" value={get('detail_chip_bg', '#f5f5f4')} onChange={(v) => update('detail_chip_bg', v)} />
          <SettingField label="Chip Text Color" type="color" value={get('detail_chip_text', '#44403c')} onChange={(v) => update('detail_chip_text', v)} />
          <SettingField label="Chip Icon Color" type="color" value={get('detail_chip_icon', '#D5A91C')} onChange={(v) => update('detail_chip_icon', v)} />
          <SettingField label="Chip Border Radius" type="number" value={get('detail_chip_radius', '4')} onChange={(v) => update('detail_chip_radius', v)} unit="px" min={0} max={24} />
        </div>
      </div>

      {/* Contact / Agent Box */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Contact &amp; Agent Box</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Agent Box Background" type="color" value={get('detail_agent_bg', '#ffffff')} onChange={(v) => update('detail_agent_bg', v)} />
          <SettingField label="Agent Box Border Color" type="color" value={get('detail_agent_border', '#e7e5e4')} onChange={(v) => update('detail_agent_border', v)} />
          <SettingField label="Agent Box Border Radius" type="number" value={get('detail_agent_radius', '4')} onChange={(v) => update('detail_agent_radius', v)} unit="px" min={0} max={24} />
          <SettingField label="Agent Name Color" type="color" value={get('detail_agent_name_color', '#001731')} onChange={(v) => update('detail_agent_name_color', v)} />
          <SettingField label="Contact Button Background" type="color" value={get('detail_contact_btn_bg', '#1B4332')} onChange={(v) => update('detail_contact_btn_bg', v)} />
          <SettingField label="Contact Button Text Color" type="color" value={get('detail_contact_btn_text', '#ffffff')} onChange={(v) => update('detail_contact_btn_text', v)} />
          <SettingField label="Contact Button Border Radius" type="number" value={get('detail_contact_btn_radius', '4')} onChange={(v) => update('detail_contact_btn_radius', v)} unit="px" min={0} max={32} />
          <SettingField label="WhatsApp Button Color" type="color" value={get('detail_whatsapp_btn_color', '#25D366')} onChange={(v) => update('detail_whatsapp_btn_color', v)} />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Breadcrumb Bar</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Breadcrumb Background" type="color" value={get('detail_breadcrumb_bg', '#ffffff')} onChange={(v) => update('detail_breadcrumb_bg', v)} />
          <SettingField label="Breadcrumb Text Color" type="color" value={get('detail_breadcrumb_text', '#a8a29e')} onChange={(v) => update('detail_breadcrumb_text', v)} />
          <SettingField label="Breadcrumb Active Color" type="color" value={get('detail_breadcrumb_active', '#44403c')} onChange={(v) => update('detail_breadcrumb_active', v)} />
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
