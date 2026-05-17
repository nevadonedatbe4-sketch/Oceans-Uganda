import { useState } from 'react';
import SettingField from '../../components/SettingField';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

type ColorState = 'normal' | 'hover';

export default function CardBoxPanel({ get, update }: Props) {
  const [colorState, setColorState] = useState<ColorState>('normal');
  const sfx = colorState === 'hover' ? '_hover' : '';

  return (
    <div className="space-y-6">
      {/* Structure */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-layout-grid-2-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">A. Structure</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Card Padding (Top/Bottom)" type="number" value={get('card_pad_y', '16')} onChange={(v) => update('card_pad_y', v)} unit="px" min={0} max={48} />
          <SettingField label="Card Padding (Left/Right)" type="number" value={get('card_pad_x', '16')} onChange={(v) => update('card_pad_x', v)} unit="px" min={0} max={48} />
          <SettingField label="Card Border Radius" type="number" value={get('card_radius', '0')} onChange={(v) => update('card_radius', v)} unit="px" min={0} max={24} />
          <SettingField label="Layout Spacing (between rows)" type="number" value={get('card_row_gap', '12')} onChange={(v) => update('card_row_gap', v)} unit="px" min={0} max={32} />
          <SettingField
            label="Separator Style"
            type="select"
            value={get('card_separator', 'hairline')}
            onChange={(v) => update('card_separator', v)}
            options={[
              { label: 'Hairline (1px solid)', value: 'hairline' },
              { label: 'None', value: 'none' },
            ]}
            hint="Only hairline separators are allowed — no thick borders."
          />
          <SettingField label="Separator Color" type="color" value={get('card_separator_color', '#f0f0f0')} onChange={(v) => update('card_separator_color', v)} />
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-drop-fill text-[#1B4332] text-sm" />
            </span>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">B. Colors</h3>
          </div>
          {/* State switcher */}
          <div className="flex items-center gap-1 bg-stone-100 rounded-md p-0.5">
            {(['normal', 'hover'] as ColorState[]).map((s) => (
              <button
                key={s}
                onClick={() => setColorState(s)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${colorState === s ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Title Color" type="color" value={get(`card_title_color${sfx}`, colorState === 'hover' ? '#0D5959' : '#1a1a1a')} onChange={(v) => update(`card_title_color${sfx}`, v)} />
          <SettingField label="Address Color" type="color" value={get(`card_address_color${sfx}`, '#9ca3af')} onChange={(v) => update(`card_address_color${sfx}`, v)} />
          <SettingField label="Price Color" type="color" value={get(`card_price_color${sfx}`, '#1a1a1a')} onChange={(v) => update(`card_price_color${sfx}`, v)} />
          <SettingField label="Icons Color" type="color" value={get(`card_icon_color${sfx}`, '#9ca3af')} onChange={(v) => update(`card_icon_color${sfx}`, v)} />
          <SettingField label="Figure Color" type="color" value={get(`card_figure_color${sfx}`, '#6b7280')} onChange={(v) => update(`card_figure_color${sfx}`, v)} />
          <SettingField label="Labels Color" type="color" value={get(`card_label_color${sfx}`, '#9ca3af')} onChange={(v) => update(`card_label_color${sfx}`, v)} />
          <SettingField label="Card Background" type="color" value={get(`card_bg_color${sfx}`, '#ffffff')} onChange={(v) => update(`card_bg_color${sfx}`, v)} />
          <SettingField label="Item Tools Background" type="color" value={get(`card_tools_bg${sfx}`, 'rgba(0,0,0,0.08)')} onChange={(v) => update(`card_tools_bg${sfx}`, v)} hint="Background of action icon buttons (heart, compare)." />
          <SettingField label="Item Tools Icon Color" type="color" value={get(`card_tools_icon${sfx}`, '#6b7280')} onChange={(v) => update(`card_tools_icon${sfx}`, v)} />
        </div>

        <div className="mt-2 pt-3 border-t border-stone-100">
          <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
            <i className="ri-information-line" />
            No shadows. No colored borders. Clean minimal only — by design.
          </p>
        </div>
      </div>

      {/* Live mini preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Live Card Preview</h3>
        <div
          className="max-w-[240px] overflow-hidden"
          style={{
            borderRadius: `${get('card_radius', '0')}px`,
            border: get('card_separator', 'hairline') === 'hairline' ? `1px solid ${get('card_separator_color', '#f0f0f0')}` : 'none',
            background: get('card_bg_color', '#ffffff'),
          }}
        >
          <div className="w-full h-36 bg-stone-100 overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=modern%20luxury%20apartment%20interior%20living%20room%20elegant%20minimal%20design%20bright%20natural%20light%20Kampala%20Uganda&width=480&height=288&seq=card-box-preview-1&orientation=landscape"
              alt="preview"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div style={{ padding: `${get('card_pad_y', '16')}px ${get('card_pad_x', '16')}px` }}>
            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: get('card_label_color', '#9ca3af') }}>For Sale · Featured</p>
            <h3 className="text-sm font-semibold leading-snug mb-1" style={{ color: get('card_title_color', '#1a1a1a'), marginBottom: `${get('spacing_desktop_title_mb', '8')}px` }}>
              Luxury 3-Bed Apartment
            </h3>
            <p className="text-xs mb-2" style={{ color: get('card_address_color', '#9ca3af'), marginBottom: `${get('spacing_desktop_address_mb', '12')}px` }}>
              Kololo, Kampala
            </p>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-1 text-xs" style={{ color: get('card_figure_color', '#6b7280') }}>
                <i className="ri-hotel-bed-line" style={{ color: get('card_icon_color', '#9ca3af') }} /> 3 beds
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: get('card_figure_color', '#6b7280') }}>
                <i className="ri-showers-line" style={{ color: get('card_icon_color', '#9ca3af') }} /> 2 baths
              </span>
            </div>
            <div className="flex items-center justify-between pt-2" style={{ borderTop: get('card_separator', 'hairline') === 'hairline' ? `1px solid ${get('card_separator_color', '#f0f0f0')}` : 'none' }}>
              <span className="font-bold text-sm" style={{ color: get('card_price_color', '#1a1a1a') }}>$450,000</span>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 flex items-center justify-center rounded-full" style={{ background: get('card_tools_bg', 'rgba(0,0,0,0.08)') }}>
                  <i className="ri-heart-line text-xs" style={{ color: get('card_tools_icon', '#6b7280') }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
