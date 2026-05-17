import { useState } from 'react';
import SettingField from '../../components/SettingField';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

type BtnState = 'normal' | 'hover';

const BORDER_TYPE_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
];

export default function CarouselPanel({ get, update }: Props) {
  const [btnState, setBtnState] = useState<BtnState>('normal');
  const sfx = btnState === 'hover' ? '_hover' : '';

  const navRadius = get('carousel_nav_radius', '0');
  const navBg = get(`carousel_nav_bg${sfx}`, btnState === 'hover' ? '#001731' : 'rgba(255,255,255,0.9)');
  const navBorder = get(`carousel_nav_border${sfx}`, btnState === 'hover' ? '#001731' : '#e5e7eb');
  const navIconColor = get(`carousel_nav_icon${sfx}`, btnState === 'hover' ? '#ffffff' : '#374151');

  // Dot settings
  const dotSize = get('carousel_dot_size', '8');
  const dotGap = get('carousel_dot_gap', '8');
  const dotMt = get('carousel_dot_mt', '24');
  const dotOpacity = get('carousel_dot_opacity', '40');
  const dotActiveOpacity = get('carousel_dot_active_opacity', '100');
  const dotColor = get('carousel_dot_color', '#001731');
  const dotActiveColor = get('carousel_dot_active_color', '#001731');
  const dotActiveWidth = get('carousel_dot_active_width', '24');

  return (
    <div className="space-y-6">
      {/* Carousel Behaviour */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-slideshow-3-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Carousel Behaviour</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Auto-play" type="toggle" value={get('carousel_autoplay', 'true')} onChange={(v) => update('carousel_autoplay', v)} hint="Automatically advance slides." />
          <SettingField label="Auto-play Interval" type="number" value={get('carousel_interval', '4000')} onChange={(v) => update('carousel_interval', v)} unit="ms" min={1000} max={10000} />
          <SettingField label="Infinite Loop" type="toggle" value={get('carousel_infinite', 'true')} onChange={(v) => update('carousel_infinite', v)} />
          <SettingField label="Pause on Hover" type="toggle" value={get('carousel_pause_hover', 'true')} onChange={(v) => update('carousel_pause_hover', v)} />
          <SettingField label="Slides (Desktop)" type="number" value={get('carousel_slides_desktop', '3')} onChange={(v) => update('carousel_slides_desktop', v)} min={1} max={6} />
          <SettingField label="Slides (Mobile)" type="number" value={get('carousel_slides_mobile', '1')} onChange={(v) => update('carousel_slides_mobile', v)} min={1} max={3} />
        </div>
      </div>

      {/* ── DOTS SYSTEM ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-more-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Dots System</h3>
          <span className="text-[10px] text-stone-400 ml-1">— applies to all sliders</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField
            label="Show Dots"
            type="toggle"
            value={get('carousel_show_dots', 'true')}
            onChange={(v) => update('carousel_show_dots', v)}
            hint="Show pagination dots below all carousels."
          />
          <SettingField
            label="Dot Size"
            type="number"
            value={dotSize}
            onChange={(v) => update('carousel_dot_size', v)}
            unit="px"
            min={4}
            max={20}
            hint="Diameter of inactive dots."
          />
          <SettingField
            label="Active Dot Width"
            type="number"
            value={dotActiveWidth}
            onChange={(v) => update('carousel_dot_active_width', v)}
            unit="px"
            min={4}
            max={48}
            hint="Width of the active dot (pill shape)."
          />
          <SettingField
            label="Space Between Dots"
            type="number"
            value={dotGap}
            onChange={(v) => update('carousel_dot_gap', v)}
            unit="px"
            min={2}
            max={24}
            hint="Gap between each dot."
          />
          <SettingField
            label="Margin Top"
            type="number"
            value={dotMt}
            onChange={(v) => update('carousel_dot_mt', v)}
            unit="px"
            min={4}
            max={64}
            hint="Space above the dots row."
          />
          <SettingField
            label="Dot Color"
            type="color"
            value={dotColor}
            onChange={(v) => update('carousel_dot_color', v)}
            hint="Color of inactive dots."
          />
          <SettingField
            label="Active Dot Color"
            type="color"
            value={dotActiveColor}
            onChange={(v) => update('carousel_dot_active_color', v)}
            hint="Color of the active/current dot."
          />
          <SettingField
            label="Opacity (inactive)"
            type="number"
            value={dotOpacity}
            onChange={(v) => update('carousel_dot_opacity', v)}
            unit="%"
            min={5}
            max={100}
            hint="Opacity of inactive dots."
          />
          <SettingField
            label="Opacity (active)"
            type="number"
            value={dotActiveOpacity}
            onChange={(v) => update('carousel_dot_active_opacity', v)}
            unit="%"
            min={10}
            max={100}
            hint="Opacity of the active dot."
          />
        </div>

        {/* Dots live preview */}
        <div className="pt-4 border-t border-stone-100">
          <p className="text-[11px] text-stone-400 uppercase tracking-widest mb-3 font-medium">Dots Preview</p>
          <div
            className="flex items-center"
            style={{ gap: `${dotGap}px`, marginTop: '0' }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: i === 2 ? `${dotActiveWidth}px` : `${dotSize}px`,
                  height: `${dotSize}px`,
                  background: i === 2 ? dotActiveColor : dotColor,
                  opacity: i === 2 ? Number(dotActiveOpacity) / 100 : Number(dotOpacity) / 100,
                }}
              />
            ))}
          </div>
          <p className="text-[10px] text-stone-400 mt-2">Dot 3 shown as active state.</p>
        </div>
      </div>

      {/* Prev/Next Button Styling */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-left-right-line text-[#1B4332] text-sm" />
            </span>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Prev / Next Button Styling</h3>
          </div>
          <div className="flex items-center gap-1 bg-stone-100 rounded-md p-0.5">
            {(['normal', 'hover'] as BtnState[]).map((s) => (
              <button
                key={s}
                onClick={() => setBtnState(s)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${btnState === s ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Padding (Top/Bottom)" type="number" value={get('carousel_nav_pad_y', '10')} onChange={(v) => update('carousel_nav_pad_y', v)} unit="px" min={4} max={32} />
          <SettingField label="Padding (Left/Right)" type="number" value={get('carousel_nav_pad_x', '12')} onChange={(v) => update('carousel_nav_pad_x', v)} unit="px" min={4} max={32} />
          <SettingField label="Border Radius" type="number" value={navRadius} onChange={(v) => update('carousel_nav_radius', v)} unit="px" min={0} max={999} />
          <SettingField label="Border Type" type="select" value={get('carousel_nav_border_type', 'solid')} onChange={(v) => update('carousel_nav_border_type', v)} options={BORDER_TYPE_OPTIONS} />
          <SettingField label="Text Color" type="color" value={get(`carousel_nav_text${sfx}`, btnState === 'hover' ? '#ffffff' : '#374151')} onChange={(v) => update(`carousel_nav_text${sfx}`, v)} />
          <SettingField label="Background Color" type="color" value={navBg} onChange={(v) => update(`carousel_nav_bg${sfx}`, v)} />
          <SettingField label="Border Color" type="color" value={navBorder} onChange={(v) => update(`carousel_nav_border${sfx}`, v)} />
        </div>
      </div>

      {/* Arrow Controls */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-arrow-left-s-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Arrow Controls</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Show Arrows" type="toggle" value={get('carousel_show_arrows', 'true')} onChange={(v) => update('carousel_show_arrows', v)} />
          <SettingField label="Arrow Icon Size" type="number" value={get('carousel_arrow_size', '16')} onChange={(v) => update('carousel_arrow_size', v)} unit="px" min={10} max={32} />
          <SettingField label="Arrow Icon Color" type="color" value={navIconColor} onChange={(v) => update(`carousel_nav_icon${sfx}`, v)} />
          <SettingField label="Arrow Background" type="color" value={navBg} onChange={(v) => update(`carousel_nav_bg${sfx}`, v)} />
          <SettingField label="Arrow Border Color" type="color" value={navBorder} onChange={(v) => update(`carousel_nav_border${sfx}`, v)} />
        </div>
      </div>

      {/* Live preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Arrow Button Preview</h3>
        <div className="flex items-center gap-4 flex-wrap">
          {['prev', 'next'].map((dir) => (
            <button
              key={dir}
              className="flex items-center justify-center transition-all cursor-pointer"
              style={{
                padding: `${get('carousel_nav_pad_y', '10')}px ${get('carousel_nav_pad_x', '12')}px`,
                background: navBg,
                border: get('carousel_nav_border_type', 'solid') !== 'none' ? `1px ${get('carousel_nav_border_type', 'solid')} ${navBorder}` : 'none',
                borderRadius: `${navRadius}px`,
              }}
            >
              <i
                className={`${dir === 'prev' ? 'ri-arrow-left-s-line' : 'ri-arrow-right-s-line'}`}
                style={{ color: navIconColor, fontSize: `${get('carousel_arrow_size', '16')}px` }}
              />
            </button>
          ))}
          <div className="flex items-center" style={{ gap: `${dotGap}px`, marginLeft: '16px' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === 1 ? `${dotActiveWidth}px` : `${dotSize}px`,
                  height: `${dotSize}px`,
                  background: i === 1 ? dotActiveColor : dotColor,
                  opacity: i === 1 ? Number(dotActiveOpacity) / 100 : Number(dotOpacity) / 100,
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-3">Switch to &quot;Hover&quot; tab above to preview hover state colors.</p>
      </div>
    </div>
  );
}
