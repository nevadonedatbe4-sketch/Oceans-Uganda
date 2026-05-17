import { useState } from 'react';
import SettingField from '../../components/SettingField';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

type Device = 'desktop' | 'tablet' | 'mobile';

interface DeviceDef {
  key: Device;
  label: string;
  icon: string;
  breakpoint: string;
  description: string;
}

const DEVICES: DeviceDef[] = [
  { key: 'desktop', label: 'Desktop', icon: 'ri-computer-line', breakpoint: '≥ 1024px', description: 'Full desktop layout — primary design target.' },
  { key: 'tablet', label: 'Tablet', icon: 'ri-tablet-line', breakpoint: '768px – 1023px', description: 'Tablet layout — 2-column grids, adjusted spacing.' },
  { key: 'mobile', label: 'Mobile', icon: 'ri-smartphone-line', breakpoint: '< 768px', description: 'Mobile layout — single column, compact spacing.' },
];

const FONT_SIZE_OPTIONS = [
  { label: 'XS (10px)', value: '10' },
  { label: 'SM (12px)', value: '12' },
  { label: 'Base (14px)', value: '14' },
  { label: 'MD (16px)', value: '16' },
  { label: 'LG (18px)', value: '18' },
];

export default function ResponsivePanel({ get, update }: Props) {
  const [device, setDevice] = useState<Device>('desktop');
  const dev = DEVICES.find((d) => d.key === device)!;
  const pfx = `resp_${device}`;

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="bg-[#1B4332]/5 border border-[#1B4332]/15 rounded-xl p-4 flex items-start gap-3">
        <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
          <i className="ri-device-line text-[#1B4332] text-sm" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#1B4332] mb-1">Responsive Control — No Breaking Layouts</p>
          <p className="text-xs text-stone-600">
            Each setting supports Desktop, Tablet and Mobile overrides. Desktop-first — tablet and mobile inherit from desktop unless overridden here. All settings use CSS variables — no hardcoded breakpoint styles.
          </p>
        </div>
      </div>

      {/* Device tabs */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="flex border-b border-stone-100">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3.5 text-xs font-medium transition-colors cursor-pointer border-b-2 ${
                device === d.key
                  ? 'border-[#1B4332] text-[#1B4332] bg-[#1B4332]/4'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-[#f5f5f5]'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center">
                <i className={`${d.icon} text-base`} />
              </span>
              <span>{d.label}</span>
              <span className="text-[9px] font-mono text-stone-400">{d.breakpoint}</span>
            </button>
          ))}
        </div>
        <div className="px-5 py-2.5 bg-[#f5f5f5] border-b border-stone-100">
          <p className="text-xs text-stone-500">{dev.description}</p>
        </div>
      </div>

      {/* Typography overrides */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-text text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Typography Overrides</h3>
          {device !== 'desktop' && <span className="text-[10px] text-stone-400 ml-1">— leave blank to inherit desktop</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField
            label="Base Font Size"
            type="number"
            value={get(`${pfx}_base_font`, device === 'desktop' ? '14' : device === 'tablet' ? '13' : '12')}
            onChange={(v) => update(`${pfx}_base_font`, v)}
            unit="px"
            min={10}
            max={20}
            hint="Body text size on this device."
          />
          <SettingField
            label="Heading Scale"
            type="select"
            value={get(`${pfx}_heading_scale`, device === 'mobile' ? '0.8' : '1')}
            onChange={(v) => update(`${pfx}_heading_scale`, v)}
            options={[
              { label: '100% (full size)', value: '1' },
              { label: '90%', value: '0.9' },
              { label: '80%', value: '0.8' },
              { label: '70%', value: '0.7' },
            ]}
            hint="Scale headings proportionally."
          />
          <SettingField
            label="Line Height"
            type="number"
            value={get(`${pfx}_line_height`, '160')}
            onChange={(v) => update(`${pfx}_line_height`, v)}
            unit="%"
            min={120}
            max={200}
          />
          <SettingField
            label="Card Title Size"
            type="select"
            value={get(`${pfx}_card_title_size`, device === 'mobile' ? '13' : '14')}
            onChange={(v) => update(`${pfx}_card_title_size`, v)}
            options={FONT_SIZE_OPTIONS}
          />
          <SettingField
            label="Price Size"
            type="number"
            value={get(`${pfx}_price_size`, device === 'mobile' ? '14' : '16')}
            onChange={(v) => update(`${pfx}_price_size`, v)}
            unit="px"
            min={10}
            max={28}
          />
          <SettingField
            label="Meta Label Size"
            type="number"
            value={get(`${pfx}_meta_size`, '12')}
            onChange={(v) => update(`${pfx}_meta_size`, v)}
            unit="px"
            min={8}
            max={16}
          />
        </div>
      </div>

      {/* Spacing overrides */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-layout-4-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Spacing Overrides</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField
            label="Section Padding (Top/Bottom)"
            type="number"
            value={get(`${pfx}_section_pad`, device === 'desktop' ? '80' : device === 'tablet' ? '56' : '40')}
            onChange={(v) => update(`${pfx}_section_pad`, v)}
            unit="px"
            min={16}
            max={160}
          />
          <SettingField
            label="Container Padding (Left/Right)"
            type="number"
            value={get(`${pfx}_container_pad`, device === 'desktop' ? '24' : device === 'tablet' ? '20' : '16')}
            onChange={(v) => update(`${pfx}_container_pad`, v)}
            unit="px"
            min={8}
            max={64}
          />
          <SettingField
            label="Card Gap"
            type="number"
            value={get(`${pfx}_card_gap`, device === 'desktop' ? '20' : device === 'tablet' ? '16' : '12')}
            onChange={(v) => update(`${pfx}_card_gap`, v)}
            unit="px"
            min={4}
            max={48}
          />
          <SettingField
            label="Card Padding X"
            type="number"
            value={get(`${pfx}_card_pad_x`, device === 'mobile' ? '12' : '16')}
            onChange={(v) => update(`${pfx}_card_pad_x`, v)}
            unit="px"
            min={0}
            max={40}
          />
          <SettingField
            label="Card Padding Y"
            type="number"
            value={get(`${pfx}_card_pad_y`, device === 'mobile' ? '12' : '16')}
            onChange={(v) => update(`${pfx}_card_pad_y`, v)}
            unit="px"
            min={0}
            max={40}
          />
          <SettingField
            label="Title Margin Bottom"
            type="number"
            value={get(`${pfx}_title_mb`, '8')}
            onChange={(v) => update(`${pfx}_title_mb`, v)}
            unit="px"
            min={0}
            max={32}
          />
        </div>
      </div>

      {/* Grid & Layout overrides */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-layout-grid-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Grid &amp; Layout Overrides</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField
            label="Property Grid Columns"
            type="number"
            value={get(`${pfx}_grid_cols`, device === 'desktop' ? '3' : device === 'tablet' ? '2' : '1')}
            onChange={(v) => update(`${pfx}_grid_cols`, v)}
            min={1}
            max={6}
            hint="Columns in property listing grids."
          />
          <SettingField
            label="Card Image Height"
            type="number"
            value={get(`${pfx}_img_height`, device === 'desktop' ? '260' : device === 'tablet' ? '220' : '200')}
            onChange={(v) => update(`${pfx}_img_height`, v)}
            unit="px"
            min={80}
            max={500}
          />
          <SettingField
            label="Carousel Slides Visible"
            type="number"
            value={get(`${pfx}_carousel_slides`, device === 'desktop' ? '3' : device === 'tablet' ? '2' : '1')}
            onChange={(v) => update(`${pfx}_carousel_slides`, v)}
            min={1}
            max={6}
          />
          <SettingField
            label="Show Sidebar"
            type="toggle"
            value={get(`${pfx}_show_sidebar`, device === 'mobile' ? 'false' : 'true')}
            onChange={(v) => update(`${pfx}_show_sidebar`, v)}
            hint="Show filter sidebar on listing pages."
          />
          <SettingField
            label="Show Meta Labels"
            type="toggle"
            value={get(`${pfx}_show_meta`, 'true')}
            onChange={(v) => update(`${pfx}_show_meta`, v)}
            hint="Show beds/baths/parking on cards."
          />
          <SettingField
            label="Show Listed Date"
            type="toggle"
            value={get(`${pfx}_show_date`, device === 'mobile' ? 'false' : 'true')}
            onChange={(v) => update(`${pfx}_show_date`, v)}
          />
        </div>
      </div>

      {/* Breakpoint reference */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Breakpoint Reference</h3>
        <div className="space-y-2">
          {DEVICES.map((d) => (
            <div key={d.key} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${device === d.key ? 'bg-[#1B4332]/5 border border-[#1B4332]/15' : 'bg-[#f5f5f5]'}`}>
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <i className={`${d.icon} text-sm ${device === d.key ? 'text-[#1B4332]' : 'text-stone-400'}`} />
              </span>
              <span className={`text-sm font-medium ${device === d.key ? 'text-[#1B4332]' : 'text-stone-600'}`}>{d.label}</span>
              <span className="font-mono text-xs text-stone-400 ml-auto">{d.breakpoint}</span>
              {device === d.key && <span className="text-[10px] text-[#1B4332] font-semibold bg-[#1B4332]/10 px-2 py-0.5 rounded-full">Editing</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-3 flex items-center gap-1.5">
          <i className="ri-information-line" />
          Desktop-first: tablet and mobile inherit desktop values unless explicitly overridden above.
        </p>
      </div>
    </div>
  );
}
