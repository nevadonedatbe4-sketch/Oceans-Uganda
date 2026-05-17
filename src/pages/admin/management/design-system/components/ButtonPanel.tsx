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

const TRANSFORM_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Capitalize', value: 'capitalize' },
];

export default function ButtonPanel({ get, update }: Props) {
  const [btnState, setBtnState] = useState<BtnState>('normal');
  const sfx = btnState === 'hover' ? '_hover' : '';

  const radius = get('btn_radius', '0');
  const textColor = get(`btn_text_color${sfx}`, btnState === 'hover' ? '#ffffff' : '#ffffff');
  const bgColor = get(`btn_bg_color${sfx}`, btnState === 'hover' ? '#0D5959' : '#001731');
  const borderColor = get(`btn_border_color${sfx}`, btnState === 'hover' ? '#0D5959' : '#001731');
  const borderType = get('btn_border_type', 'solid');

  const buildBtnStyle = () => ({
    padding: `${get('btn_pad_y', '10')}px ${get('btn_pad_x', '24')}px`,
    color: textColor,
    background: bgColor,
    border: borderType !== 'none' ? `1px ${borderType} ${borderColor}` : 'none',
    borderRadius: `${radius}px`,
    textTransform: get('btn_text_transform', 'uppercase') as 'uppercase' | 'capitalize' | 'none',
    letterSpacing: get('btn_tracking', '0.1em'),
    fontSize: `${get('btn_font_size', '12')}px`,
    fontWeight: get('btn_font_weight', '600'),
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <div className="space-y-6">
      {/* Padding & Shape */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-cursor-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Button Shape &amp; Size</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Padding Top/Bottom" type="number" value={get('btn_pad_y', '10')} onChange={(v) => update('btn_pad_y', v)} unit="px" min={4} max={32} />
          <SettingField label="Padding Left/Right" type="number" value={get('btn_pad_x', '24')} onChange={(v) => update('btn_pad_x', v)} unit="px" min={8} max={64} />
          <SettingField label="Border Radius" type="number" value={radius} onChange={(v) => update('btn_radius', v)} unit="px" min={0} max={999} />
          <SettingField label="Font Size" type="number" value={get('btn_font_size', '12')} onChange={(v) => update('btn_font_size', v)} unit="px" min={10} max={20} />
          <SettingField label="Font Weight" type="select" value={get('btn_font_weight', '600')} onChange={(v) => update('btn_font_weight', v)} options={[
            { label: '400 — Regular', value: '400' },
            { label: '500 — Medium', value: '500' },
            { label: '600 — SemiBold', value: '600' },
            { label: '700 — Bold', value: '700' },
          ]} />
          <SettingField label="Text Transform" type="select" value={get('btn_text_transform', 'uppercase')} onChange={(v) => update('btn_text_transform', v)} options={TRANSFORM_OPTIONS} />
          <SettingField label="Letter Spacing" type="text" value={get('btn_tracking', '0.1em')} onChange={(v) => update('btn_tracking', v)} placeholder="0.1em" hint="e.g. 0.05em, 0.1em, normal" />
          <SettingField label="Border Type" type="select" value={borderType} onChange={(v) => update('btn_border_type', v)} options={BORDER_TYPE_OPTIONS} />
        </div>
      </div>

      {/* Colors by state */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-drop-fill text-[#1B4332] text-sm" />
            </span>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Button Colors</h3>
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
          <SettingField label="Text Color" type="color" value={textColor} onChange={(v) => update(`btn_text_color${sfx}`, v)} />
          <SettingField label="Background Color" type="color" value={bgColor} onChange={(v) => update(`btn_bg_color${sfx}`, v)} />
          <SettingField label="Border Color" type="color" value={borderColor} onChange={(v) => update(`btn_border_color${sfx}`, v)} />
        </div>
      </div>

      {/* Applies to */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Applies To</h3>
        <div className="flex flex-wrap gap-2">
          {['Property Cards', 'CTAs', 'Forms', 'Hero Buttons', 'Search Bar', 'Filter Buttons'].map((label) => (
            <span key={label} className="px-3 py-1 bg-[#1B4332]/8 text-[#1B4332] text-xs font-medium rounded-full">{label}</span>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-3">These styles cascade globally across all button instances on the frontend.</p>
      </div>

      {/* Live preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Button Preview</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <button style={buildBtnStyle()}>View Property</button>
          <button style={{ ...buildBtnStyle(), background: 'transparent', color: get('btn_bg_color', '#001731'), border: `1px solid ${get('btn_bg_color', '#001731')}` }}>
            Contact Agent
          </button>
          <button style={{ ...buildBtnStyle(), background: '#C9A84C', borderColor: '#C9A84C' }}>
            Book Viewing
          </button>
        </div>
        <p className="text-xs text-stone-400 mt-3">Hover state preview: switch to &quot;Hover&quot; tab above and adjust colors.</p>
      </div>
    </div>
  );
}
