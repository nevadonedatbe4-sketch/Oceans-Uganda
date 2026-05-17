import { useState } from 'react';
import SettingField from '../../components/SettingField';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

type Device = 'desktop' | 'tablet' | 'mobile';

export default function SpacingPanel({ get, update }: Props) {
  const [device, setDevice] = useState<Device>('desktop');
  const [linkedPadding, setLinkedPadding] = useState(false);

  const prefix = `spacing_${device}`;

  const handlePaddingChange = (side: string, val: string) => {
    if (linkedPadding) {
      ['top', 'right', 'bottom', 'left'].forEach((s) => update(`${prefix}_content_pad_${s}`, val));
    } else {
      update(`${prefix}_content_pad_${side}`, val);
    }
  };

  return (
    <div className="space-y-6">
      {/* Device switcher */}
      <div className="flex items-center gap-2">
        {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${device === d ? 'bg-[#1B4332] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            <i className={`${d === 'desktop' ? 'ri-computer-line' : d === 'tablet' ? 'ri-tablet-line' : 'ri-smartphone-line'} text-sm`} />
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
        <span className="text-xs text-stone-400 ml-2">Editing: <strong className="text-stone-600">{device}</strong> overrides</span>
      </div>

      {/* Typography spacing */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-space text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Typography Spacing</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Title Margin Bottom" type="number" value={get(`${prefix}_title_mb`, '8')} onChange={(v) => update(`${prefix}_title_mb`, v)} unit="px" min={0} max={48} />
          <SettingField label="Address Margin Bottom" type="number" value={get(`${prefix}_address_mb`, '12')} onChange={(v) => update(`${prefix}_address_mb`, v)} unit="px" min={0} max={48} />
          <SettingField label="Meta Icon Size" type="number" value={get(`${prefix}_meta_icon_size`, '14')} onChange={(v) => update(`${prefix}_meta_icon_size`, v)} unit="px" min={10} max={32} hint="Size of beds/baths/parking icons." />
          <SettingField label="Price Margin Top" type="number" value={get(`${prefix}_price_mt`, '12')} onChange={(v) => update(`${prefix}_price_mt`, v)} unit="px" min={0} max={48} />
          <SettingField label="Section Vertical Spacing" type="number" value={get(`${prefix}_section_spacing`, '80')} onChange={(v) => update(`${prefix}_section_spacing`, v)} unit="px" min={20} max={200} hint="Vertical padding between page sections." />
          <SettingField label="Grid Card Gap" type="number" value={get(`${prefix}_card_gap`, '20')} onChange={(v) => update(`${prefix}_card_gap`, v)} unit="px" min={4} max={60} />
        </div>
      </div>

      {/* Content Area Padding */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-layout-4-line text-[#1B4332] text-sm" />
            </span>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Content Area Padding</h3>
          </div>
          <button
            onClick={() => setLinkedPadding(!linkedPadding)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${linkedPadding ? 'bg-[#1B4332] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            <i className={`${linkedPadding ? 'ri-link' : 'ri-link-unlink'} text-xs`} />
            {linkedPadding ? 'Linked' : 'Unlinked'}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['top', 'right', 'bottom', 'left'].map((side) => (
            <SettingField
              key={side}
              label={side.charAt(0).toUpperCase() + side.slice(1)}
              type="number"
              value={get(`${prefix}_content_pad_${side}`, '16')}
              onChange={(v) => handlePaddingChange(side, v)}
              unit="px"
              min={0}
              max={80}
            />
          ))}
        </div>
        {linkedPadding && (
          <p className="text-xs text-[#1B4332] bg-[#1B4332]/5 px-3 py-2 rounded-md">
            <i className="ri-link mr-1" />
            All sides linked — changing one updates all four.
          </p>
        )}
      </div>

      {/* Container & Grid */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-layout-grid-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Container &amp; Grid</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField
            label="Container Max Width"
            type="select"
            value={get('ds_container_width', '1200')}
            onChange={(v) => update('ds_container_width', v)}
            options={[
              { label: 'Narrow (1024px)', value: '1024' },
              { label: 'Standard (1200px)', value: '1200' },
              { label: 'Wide (1400px)', value: '1400' },
              { label: 'Full Width', value: 'full' },
            ]}
          />
          <SettingField label="Grid Columns (Desktop)" type="number" value={get('ds_grid_cols', '3')} onChange={(v) => update('ds_grid_cols', v)} min={2} max={5} hint="Property card columns on desktop." />
          <SettingField label="Grid Columns (Tablet)" type="number" value={get('ds_grid_cols_tablet', '2')} onChange={(v) => update('ds_grid_cols_tablet', v)} min={1} max={4} />
        </div>
      </div>
    </div>
  );
}
