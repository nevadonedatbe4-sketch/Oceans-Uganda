import { useState } from 'react';
import SettingField from '../../components/SettingField';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

type SubTab = 'content' | 'style' | 'advanced';

const FONT_OPTIONS = [
  { label: 'Inherit Global', value: 'inherit' },
  { label: 'Prata (Serif)', value: 'Prata' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { label: 'Roboto (Sans-serif)', value: 'Roboto' },
  { label: 'Inter', value: 'Inter' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Jost', value: 'Jost' },
  { label: 'Outfit', value: 'Outfit' },
];

const WEIGHT_OPTIONS = [
  { label: '300 — Light', value: '300' },
  { label: '400 — Regular', value: '400' },
  { label: '500 — Medium', value: '500' },
  { label: '600 — SemiBold', value: '600' },
  { label: '700 — Bold', value: '700' },
];

const TRANSFORM_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Capitalize', value: 'capitalize' },
];

const HOVER_OPTIONS = [
  { label: 'Lift (translate up)', value: 'lift' },
  { label: 'Scale (zoom in)', value: 'scale' },
  { label: 'Glow (border highlight)', value: 'glow' },
  { label: 'Fade (opacity)', value: 'fade' },
  { label: 'None', value: 'none' },
];

const ANIMATION_OPTIONS = [
  { label: 'Fade In Up', value: 'fade_up' },
  { label: 'Fade In', value: 'fade' },
  { label: 'Slide In', value: 'slide' },
  { label: 'None', value: 'none' },
];

const LAYOUT_OPTIONS = [
  { label: 'Vertical (image top)', value: 'vertical' },
  { label: 'Horizontal (image left)', value: 'horizontal' },
  { label: 'Overlay (text on image)', value: 'overlay' },
];

export default function CardV7Panel({ get, update }: Props) {
  const [subTab, setSubTab] = useState<SubTab>('content');

  const SUB_TABS: { id: SubTab; label: string; icon: string }[] = [
    { id: 'content', label: 'A. Content', icon: 'ri-list-check' },
    { id: 'style', label: 'B. Style', icon: 'ri-palette-line' },
    { id: 'advanced', label: 'C. Advanced', icon: 'ri-settings-4-line' },
  ];

  return (
    <div className="space-y-5">
      {/* Sub-tab header */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="flex border-b border-stone-100">
          {SUB_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                subTab === t.id
                  ? 'border-[#1B4332] text-[#1B4332] bg-[#1B4332]/4'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-[#f5f5f5]'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className={`${t.icon} text-sm`} />
              </span>
              {t.label}
            </button>
          ))}
        </div>
        <div className="px-5 py-2.5 bg-[#f5f5f5] border-b border-stone-100">
          <p className="text-[11px] text-stone-400">
            {subTab === 'content' && 'Control field visibility, order and data binding for property card v7'}
            {subTab === 'style' && 'Typography, colors and spacing for each card element'}
            {subTab === 'advanced' && 'Hover behavior, animations and responsive layout overrides'}
          </p>
        </div>
      </div>

      {/* ── A. CONTENT ─────────────────────────────────────────────────────── */}
      {subTab === 'content' && (
        <div className="space-y-5">
          {/* Field Visibility */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Field Visibility</h3>
            {[
              { key: 'v7_show_status', label: 'Status Label (For Sale / For Rent)', default: 'true' },
              { key: 'v7_show_featured', label: 'Featured Badge', default: 'true' },
              { key: 'v7_show_title', label: 'Property Title', default: 'true' },
              { key: 'v7_show_address', label: 'Address / Location', default: 'true' },
              { key: 'v7_show_meta', label: 'Meta (Beds, Baths, Parking)', default: 'true' },
              { key: 'v7_show_type', label: 'Property Type', default: 'true' },
              { key: 'v7_show_area', label: 'Area / Size (sqm)', default: 'false' },
              { key: 'v7_show_price', label: 'Price', default: 'true' },
              { key: 'v7_show_sub_price', label: 'Sub Price (PCM)', default: 'true' },
              { key: 'v7_show_agent', label: 'Agent Name', default: 'false' },
              { key: 'v7_show_date', label: 'Listed Date', default: 'true' },
              { key: 'v7_show_cta', label: 'CTA Button', default: 'false' },
            ].map((f) => (
              <SettingField
                key={f.key}
                label={f.label}
                type="toggle"
                value={get(f.key, f.default)}
                onChange={(v) => update(f.key, v)}
              />
            ))}
          </div>

          {/* Data Binding */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Data Binding</h3>
            <p className="text-xs text-stone-400 mb-3">Control how data is sourced and displayed for each field.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SettingField
                label="Price Source"
                type="select"
                value={get('v7_price_source', 'price')}
                onChange={(v) => update('v7_price_source', v)}
                options={[
                  { label: 'Price field', value: 'price' },
                  { label: 'Price + Note', value: 'price_note' },
                ]}
              />
              <SettingField
                label="Title Max Lines"
                type="number"
                value={get('v7_title_lines', '2')}
                onChange={(v) => update('v7_title_lines', v)}
                min={1}
                max={4}
                hint="Clamp title to N lines."
              />
              <SettingField
                label="Address Max Lines"
                type="number"
                value={get('v7_address_lines', '1')}
                onChange={(v) => update('v7_address_lines', v)}
                min={1}
                max={3}
              />
              <SettingField
                label="CTA Button Label"
                type="text"
                value={get('v7_cta_label', 'View Property')}
                onChange={(v) => update('v7_cta_label', v)}
              />
              <SettingField
                label="Date Format"
                type="select"
                value={get('v7_date_format', 'relative')}
                onChange={(v) => update('v7_date_format', v)}
                options={[
                  { label: 'Relative (3 days ago)', value: 'relative' },
                  { label: 'Short (Jan 12, 2025)', value: 'short' },
                  { label: 'Long (12 January 2025)', value: 'long' },
                ]}
              />
              <SettingField
                label="Show Location Icon"
                type="toggle"
                value={get('v7_show_location_icon', 'true')}
                onChange={(v) => update('v7_show_location_icon', v)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── B. STYLE ───────────────────────────────────────────────────────── */}
      {subTab === 'style' && (
        <div className="space-y-5">
          {/* Typography per element */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Typography</h3>
            {[
              { prefix: 'v7_typo_title', label: 'Title' },
              { prefix: 'v7_typo_address', label: 'Address' },
              { prefix: 'v7_typo_meta', label: 'Meta (beds/baths)' },
              { prefix: 'v7_typo_price', label: 'Price' },
              { prefix: 'v7_typo_label', label: 'Labels / Status' },
            ].map((el) => (
              <div key={el.prefix} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-stone-600 uppercase tracking-widest">{el.label}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <SettingField label="Font" type="select" value={get(`${el.prefix}_font`, 'inherit')} onChange={(v) => update(`${el.prefix}_font`, v)} options={FONT_OPTIONS} />
                  <SettingField label="Size" type="number" value={get(`${el.prefix}_size`, '')} onChange={(v) => update(`${el.prefix}_size`, v)} unit="px" min={8} max={48} placeholder="auto" />
                  <SettingField label="Weight" type="select" value={get(`${el.prefix}_weight`, '400')} onChange={(v) => update(`${el.prefix}_weight`, v)} options={WEIGHT_OPTIONS} />
                  <SettingField label="Transform" type="select" value={get(`${el.prefix}_transform`, 'none')} onChange={(v) => update(`${el.prefix}_transform`, v)} options={TRANSFORM_OPTIONS} />
                  <SettingField label="Color" type="color" value={get(`${el.prefix}_color`, '#1a1a1a')} onChange={(v) => update(`${el.prefix}_color`, v)} />
                </div>
              </div>
            ))}
          </div>

          {/* Card Colors */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Card Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SettingField label="Card Background" type="color" value={get('v7_card_bg', '#ffffff')} onChange={(v) => update('v7_card_bg', v)} />
              <SettingField label="Border Color" type="color" value={get('v7_card_border_color', '#f0f0f0')} onChange={(v) => update('v7_card_border_color', v)} />
              <SettingField label="Icon Color" type="color" value={get('v7_icon_color', '#9ca3af')} onChange={(v) => update('v7_icon_color', v)} />
              <SettingField label="Tools BG" type="color" value={get('v7_tools_bg', 'rgba(0,0,0,0.08)')} onChange={(v) => update('v7_tools_bg', v)} />
              <SettingField label="Tools Icon Color" type="color" value={get('v7_tools_icon', '#6b7280')} onChange={(v) => update('v7_tools_icon', v)} />
              <SettingField label="Separator Color" type="color" value={get('v7_separator_color', '#f0f0f0')} onChange={(v) => update('v7_separator_color', v)} />
            </div>
          </div>

          {/* Spacing */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Spacing</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SettingField label="Card Padding X" type="number" value={get('v7_pad_x', '16')} onChange={(v) => update('v7_pad_x', v)} unit="px" min={0} max={48} />
              <SettingField label="Card Padding Y" type="number" value={get('v7_pad_y', '16')} onChange={(v) => update('v7_pad_y', v)} unit="px" min={0} max={48} />
              <SettingField label="Title Margin Bottom" type="number" value={get('v7_title_mb', '8')} onChange={(v) => update('v7_title_mb', v)} unit="px" min={0} max={32} />
              <SettingField label="Address Margin Bottom" type="number" value={get('v7_address_mb', '12')} onChange={(v) => update('v7_address_mb', v)} unit="px" min={0} max={32} />
              <SettingField label="Meta Row Gap" type="number" value={get('v7_meta_gap', '16')} onChange={(v) => update('v7_meta_gap', v)} unit="px" min={4} max={32} />
              <SettingField label="Card Border Radius" type="number" value={get('v7_radius', '0')} onChange={(v) => update('v7_radius', v)} unit="px" min={0} max={24} />
            </div>
          </div>

          {/* Card Layout */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Card Layout</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SettingField
                label="Card Layout"
                type="select"
                value={get('v7_layout', 'vertical')}
                onChange={(v) => update('v7_layout', v)}
                options={LAYOUT_OPTIONS}
                hint="How the image and content are arranged."
              />
              <SettingField label="Image Height" type="number" value={get('v7_img_height', '260')} onChange={(v) => update('v7_img_height', v)} unit="px" min={100} max={500} />
              <SettingField label="Image Border Radius" type="number" value={get('v7_img_radius', '0')} onChange={(v) => update('v7_img_radius', v)} unit="px" min={0} max={24} />
            </div>
          </div>
        </div>
      )}

      {/* ── C. ADVANCED ────────────────────────────────────────────────────── */}
      {subTab === 'advanced' && (
        <div className="space-y-5">
          {/* Hover Behavior */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Hover Behavior</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SettingField
                label="Hover Effect"
                type="select"
                value={get('v7_hover_effect', 'lift')}
                onChange={(v) => update('v7_hover_effect', v)}
                options={HOVER_OPTIONS}
                hint="What happens when user hovers over the card."
              />
              <SettingField label="Hover Transition Duration" type="number" value={get('v7_hover_duration', '300')} onChange={(v) => update('v7_hover_duration', v)} unit="ms" min={100} max={1000} />
              <SettingField label="Hover Lift Amount" type="number" value={get('v7_hover_lift', '4')} onChange={(v) => update('v7_hover_lift', v)} unit="px" min={0} max={20} hint="How many px the card lifts on hover." />
              <SettingField label="Image Zoom on Hover" type="toggle" value={get('v7_img_zoom', 'true')} onChange={(v) => update('v7_img_zoom', v)} />
              <SettingField label="Image Overlay on Hover" type="toggle" value={get('v7_img_overlay', 'true')} onChange={(v) => update('v7_img_overlay', v)} />
              <SettingField label="Title Color Change on Hover" type="toggle" value={get('v7_title_hover_color_enabled', 'true')} onChange={(v) => update('v7_title_hover_color_enabled', v)} />
              <SettingField label="Title Hover Color" type="color" value={get('v7_title_hover_color', '#0D5959')} onChange={(v) => update('v7_title_hover_color', v)} />
            </div>
          </div>

          {/* Animation */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Animation</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SettingField
                label="Card Entrance Animation"
                type="select"
                value={get('v7_animation', 'fade_up')}
                onChange={(v) => update('v7_animation', v)}
                options={ANIMATION_OPTIONS}
                hint="Animation when cards enter the viewport."
              />
              <SettingField label="Animation Duration" type="number" value={get('v7_anim_duration', '400')} onChange={(v) => update('v7_anim_duration', v)} unit="ms" min={100} max={2000} />
              <SettingField label="Animation Stagger" type="number" value={get('v7_anim_stagger', '80')} onChange={(v) => update('v7_anim_stagger', v)} unit="ms" min={0} max={500} hint="Delay between each card animating in." />
              <SettingField label="Enable Animations" type="toggle" value={get('v7_anim_enabled', 'true')} onChange={(v) => update('v7_anim_enabled', v)} hint="Toggle all card animations on/off." />
            </div>
          </div>

          {/* Responsive Layout Overrides */}
          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-1">Responsive Layout Overrides</h3>
            <p className="text-xs text-stone-400">Override card layout settings per device. Leave blank to inherit from Style tab.</p>

            {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
              <div key={device} className="border border-stone-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className={`${device === 'desktop' ? 'ri-computer-line' : device === 'tablet' ? 'ri-tablet-line' : 'ri-smartphone-line'} text-sm text-[#1B4332]`} />
                  </span>
                  <p className="text-xs font-semibold text-stone-600 uppercase tracking-widest">{device}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <SettingField
                    label="Columns"
                    type="number"
                    value={get(`v7_${device}_cols`, device === 'desktop' ? '3' : device === 'tablet' ? '2' : '1')}
                    onChange={(v) => update(`v7_${device}_cols`, v)}
                    min={1}
                    max={6}
                    hint="Grid columns on this device."
                  />
                  <SettingField
                    label="Image Height"
                    type="number"
                    value={get(`v7_${device}_img_height`, device === 'mobile' ? '200' : '')}
                    onChange={(v) => update(`v7_${device}_img_height`, v)}
                    unit="px"
                    min={80}
                    max={500}
                    placeholder="inherit"
                  />
                  <SettingField
                    label="Card Padding X"
                    type="number"
                    value={get(`v7_${device}_pad_x`, '')}
                    onChange={(v) => update(`v7_${device}_pad_x`, v)}
                    unit="px"
                    min={0}
                    max={48}
                    placeholder="inherit"
                  />
                  <SettingField
                    label="Font Size Override"
                    type="number"
                    value={get(`v7_${device}_font_size`, '')}
                    onChange={(v) => update(`v7_${device}_font_size`, v)}
                    unit="px"
                    min={8}
                    max={24}
                    placeholder="inherit"
                  />
                  <SettingField
                    label="Show Meta"
                    type="toggle"
                    value={get(`v7_${device}_show_meta`, 'true')}
                    onChange={(v) => update(`v7_${device}_show_meta`, v)}
                  />
                  <SettingField
                    label="Show Date"
                    type="toggle"
                    value={get(`v7_${device}_show_date`, device === 'mobile' ? 'false' : 'true')}
                    onChange={(v) => update(`v7_${device}_show_date`, v)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
