import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

export default function StylingCardsPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('styling_cards');

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
        icon="ri-layout-grid-line"
        title="Property Cards Styling"
        description="Control the visual appearance of property cards shown in grid and list views across the site."
      />

      {/* Live Preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Live Preview</h3>
        <div
          className="overflow-hidden transition-all"
          style={{
            borderRadius: get('card_border_radius', '8') + 'px',
            border: `1px solid ${get('card_border_color', '#e7e5e4')}`,
            boxShadow: get('card_shadow', 'soft') === 'none' ? 'none' : get('card_shadow', 'soft') === 'strong' ? '0 8px 30px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,23,49,0.10)',
            maxWidth: '280px',
          }}
        >
          <div style={{ height: '160px', background: '#e7e5e4', position: 'relative', overflow: 'hidden' }}>
            <img src="https://readdy.ai/api/search-image?query=modern%20luxury%20apartment%20interior%20living%20room%20elegant%20minimal%20design&width=560&height=320&seq=card-preview-1&orientation=landscape" alt="preview" className="w-full h-full object-cover" />
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <span style={{ background: get('badge_sale_color', '#1B4332'), color: get('badge_text_color', '#ffffff'), fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>For Sale</span>
            </div>
          </div>
          <div style={{ padding: '14px' }}>
            <p style={{ fontSize: '10px', color: get('location_text_color', '#78716c'), marginBottom: '4px' }}>Kololo, Kampala</p>
            <p style={{ fontSize: '10px', fontWeight: 700, color: get('type_label_color', '#D5A91C'), textTransform: get('type_label_style', 'uppercase') as 'uppercase' | 'none', letterSpacing: '0.08em', marginBottom: '4px' }}>Apartment</p>
            <h3 style={{ fontSize: get('title_font_size', '14') + 'px', fontWeight: get('title_font_weight', '700'), color: get('title_color', '#001731'), marginBottom: '10px', lineHeight: 1.3 }}>Luxury 3-Bed Apartment with Pool</h3>
            <p style={{ fontSize: '10px', color: '#78716c', marginBottom: '2px' }}>Guide Price</p>
            <p style={{ fontSize: get('price_font_size', '18') + 'px', fontWeight: 700, color: get('price_color', '#001731') }}>$450,000</p>
            <div style={{ borderTop: '1px solid #f5f5f4', marginTop: '10px', paddingTop: '10px', display: 'flex', gap: '12px' }}>
              {['3 Beds', '2 Baths', '1 Park'].map((s) => (
                <span key={s} style={{ fontSize: '11px', color: get('meta_text_color', '#78716c') }}>{s}</span>
              ))}
            </div>
            <button style={{ marginTop: '10px', width: '100%', padding: '7px', background: get('btn_bg_color', '#1B4332'), color: get('btn_text_color', '#ffffff'), borderRadius: get('btn_border_radius', '4') + 'px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Grid Layout</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '2', label: '2 Columns', icon: 'ri-layout-column-line' },
            { value: '3', label: '3 Columns', icon: 'ri-layout-grid-line' },
            { value: '4', label: '4 Columns', icon: 'ri-layout-masonry-line' },
          ].map((opt) => {
            const active = get('card_grid_cols', '3') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('card_grid_cols', opt.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${active ? 'border-[#1B4332] bg-[#1B4332]/5' : 'border-stone-200 hover:border-stone-300'}`}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  <i className={`${opt.icon} text-xl ${active ? 'text-[#1B4332]' : 'text-stone-400'}`} />
                </span>
                <span className={`text-xs font-medium ${active ? 'text-[#1B4332]' : 'text-stone-500'}`}>{opt.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-stone-400">Applies to all listing pages. On mobile, always collapses to 1 column.</p>
      </div>

      {/* Layout & Structure */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Layout &amp; Structure</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Card Border Radius" type="number" value={get('card_border_radius', '8')} onChange={(v) => update('card_border_radius', v)} unit="px" hint="Rounded corners on the card." min={0} max={32} />
          <SettingField label="Card Border Color" type="color" value={get('card_border_color', '#e7e5e4')} onChange={(v) => update('card_border_color', v)} hint="Border color around each card." />
          <SettingField label="Card Shadow Style" type="select" value={get('card_shadow', 'none')} onChange={(v) => update('card_shadow', v)} options={[{ value: 'none', label: 'None' }, { value: 'soft', label: 'Soft' }, { value: 'strong', label: 'Strong' }]} hint="Drop shadow intensity." />
          <SettingField label="Card Padding" type="number" value={get('card_padding', '14')} onChange={(v) => update('card_padding', v)} unit="px" hint="Inner padding of the card content area." min={8} max={40} />
        </div>
      </div>

      {/* Image Styling */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Image Styling</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Image Height" type="number" value={get('card_image_height', '220')} onChange={(v) => update('card_image_height', v)} unit="px" hint="Height of the card image area." min={120} max={400} />
          <SettingField label="Image Aspect Ratio" type="select" value={get('card_image_ratio', 'landscape')} onChange={(v) => update('card_image_ratio', v)} options={[{ value: 'landscape', label: 'Landscape (16:9)' }, { value: 'square', label: 'Square (1:1)' }, { value: 'portrait', label: 'Portrait (3:4)' }]} hint="Aspect ratio of the card image." />
          <SettingField label="Image Border Radius" type="number" value={get('card_image_radius', '0')} onChange={(v) => update('card_image_radius', v)} unit="px" hint="Rounded corners on the image." min={0} max={24} />
          <SettingField label="Image Hover Overlay Color" type="color" value={get('card_image_overlay', '#00000033')} onChange={(v) => update('card_image_overlay', v)} hint="Overlay tint on image hover." />
        </div>
      </div>

      {/* Text Styling */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Text Styling</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Title Font Size" type="number" value={get('title_font_size', '14')} onChange={(v) => update('title_font_size', v)} unit="px" min={10} max={28} />
          <SettingField label="Title Color" type="color" value={get('title_color', '#001731')} onChange={(v) => update('title_color', v)} />
          <SettingField label="Title Font Weight" type="select" value={get('title_font_weight', '700')} onChange={(v) => update('title_font_weight', v)} options={[{ value: '400', label: 'Regular (400)' }, { value: '500', label: 'Medium (500)' }, { value: '600', label: 'Semi-Bold (600)' }, { value: '700', label: 'Bold (700)' }, { value: '800', label: 'Extra Bold (800)' }]} />
          <SettingField label="Location Text Color" type="color" value={get('location_text_color', '#78716c')} onChange={(v) => update('location_text_color', v)} />
          <SettingField label="Property Meta Color" type="color" value={get('meta_text_color', '#78716c')} onChange={(v) => update('meta_text_color', v)} hint="Color for beds/baths/parking text." />
          <SettingField label="Meta Icon Color" type="color" value={get('meta_icon_color', '#D5A91C')} onChange={(v) => update('meta_icon_color', v)} hint="Color for beds/baths/parking icons." />
          <SettingField label="Property Type Label Style" type="select" value={get('type_label_style', 'uppercase')} onChange={(v) => update('type_label_style', v)} options={[{ value: 'uppercase', label: 'UPPERCASE' }, { value: 'capitalize', label: 'Capitalize' }, { value: 'none', label: 'Normal' }]} />
          <SettingField label="Property Type Label Color" type="color" value={get('type_label_color', '#D5A91C')} onChange={(v) => update('type_label_color', v)} />
          <SettingField label="Price Color" type="color" value={get('price_color', '#001731')} onChange={(v) => update('price_color', v)} />
          <SettingField label="Price Font Size" type="number" value={get('price_font_size', '18')} onChange={(v) => update('price_font_size', v)} unit="px" min={12} max={32} />
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Badges</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Featured Badge Color" type="color" value={get('badge_featured_color', '#D5A91C')} onChange={(v) => update('badge_featured_color', v)} />
          <SettingField label="For Sale Badge Color" type="color" value={get('badge_sale_color', '#1B4332')} onChange={(v) => update('badge_sale_color', v)} />
          <SettingField label="For Rent Badge Color" type="color" value={get('badge_rent_color', '#0f766e')} onChange={(v) => update('badge_rent_color', v)} />
          <SettingField label="Badge Text Color" type="color" value={get('badge_text_color', '#ffffff')} onChange={(v) => update('badge_text_color', v)} />
          <SettingField label="Badge Border Radius" type="number" value={get('badge_border_radius', '3')} onChange={(v) => update('badge_border_radius', v)} unit="px" min={0} max={20} />
          <SettingField label="Badge Position" type="select" value={get('badge_position', 'top-right')} onChange={(v) => update('badge_position', v)} options={[{ value: 'top-left', label: 'Top Left' }, { value: 'top-right', label: 'Top Right' }, { value: 'bottom-left', label: 'Bottom Left' }, { value: 'bottom-right', label: 'Bottom Right' }]} />
        </div>
      </div>

      {/* Buttons */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Card Button</h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Button Background Color" type="color" value={get('btn_bg_color', '#1B4332')} onChange={(v) => update('btn_bg_color', v)} />
          <SettingField label="Button Text Color" type="color" value={get('btn_text_color', '#ffffff')} onChange={(v) => update('btn_text_color', v)} />
          <SettingField label="Button Hover Color" type="color" value={get('btn_hover_color', '#D5A91C')} onChange={(v) => update('btn_hover_color', v)} />
          <SettingField label="Button Border Radius" type="number" value={get('btn_border_radius', '4')} onChange={(v) => update('btn_border_radius', v)} unit="px" min={0} max={32} />
          <SettingField label="Show Details Button" type="toggle" value={get('card_show_btn', 'true')} onChange={(v) => update('card_show_btn', v)} hint="Show a 'View Details' button on each card." />
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
