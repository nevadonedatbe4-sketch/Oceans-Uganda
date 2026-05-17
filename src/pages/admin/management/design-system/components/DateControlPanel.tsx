import SettingField from '../../components/SettingField';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

export default function DateControlPanel({ get, update }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-calendar-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Date Control System</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField
            label="Show Listed Date"
            type="toggle"
            value={get('date_visible', 'true')}
            onChange={(v) => update('date_visible', v)}
            hint="Toggle visibility of the listed date on property cards."
          />
          <SettingField
            label="Date Position"
            type="select"
            value={get('date_position', 'bottom')}
            onChange={(v) => update('date_position', v)}
            options={[
              { label: 'Bottom (after price)', value: 'bottom' },
              { label: 'Top (before title)', value: 'top' },
              { label: 'Inline (next to price)', value: 'inline' },
            ]}
            hint="Where the date appears inside the card layout."
          />
          <SettingField
            label="Date Format"
            type="select"
            value={get('date_format', 'relative')}
            onChange={(v) => update('date_format', v)}
            options={[
              { label: 'Relative (Listed 3 days ago)', value: 'relative' },
              { label: 'Short (Jan 12, 2025)', value: 'short' },
              { label: 'Long (12 January 2025)', value: 'long' },
            ]}
          />
          <SettingField
            label="Date Font Size"
            type="number"
            value={get('date_font_size', '10')}
            onChange={(v) => update('date_font_size', v)}
            unit="px"
            min={8}
            max={16}
          />
          <SettingField
            label="Date Font Weight"
            type="select"
            value={get('date_font_weight', '400')}
            onChange={(v) => update('date_font_weight', v)}
            options={[
              { label: '300 — Light', value: '300' },
              { label: '400 — Regular', value: '400' },
              { label: '500 — Medium', value: '500' },
              { label: '600 — SemiBold', value: '600' },
            ]}
          />
          <SettingField
            label="Date Color"
            type="color"
            value={get('date_color', '#d1d5db')}
            onChange={(v) => update('date_color', v)}
          />
          <SettingField
            label="Show Clock Icon"
            type="toggle"
            value={get('date_show_icon', 'true')}
            onChange={(v) => update('date_show_icon', v)}
            hint="Show the clock icon next to the date."
          />
          <SettingField
            label="Date Text Transform"
            type="select"
            value={get('date_transform', 'none')}
            onChange={(v) => update('date_transform', v)}
            options={[
              { label: 'None', value: 'none' },
              { label: 'Uppercase', value: 'uppercase' },
              { label: 'Capitalize', value: 'capitalize' },
            ]}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Date Preview</h3>
        <div className="flex items-center gap-2 p-3 bg-[#f5f5f5] rounded-lg w-fit">
          {get('date_show_icon', 'true') === 'true' && (
            <i className="ri-time-line" style={{ color: get('date_color', '#d1d5db'), fontSize: `${get('date_font_size', '10')}px` }} />
          )}
          <span
            style={{
              color: get('date_color', '#d1d5db'),
              fontSize: `${get('date_font_size', '10')}px`,
              fontWeight: get('date_font_weight', '400'),
              textTransform: get('date_transform', 'none') as 'none' | 'uppercase' | 'capitalize',
            }}
          >
            {get('date_format', 'relative') === 'relative' ? 'Listed 3 days ago' : get('date_format', 'relative') === 'short' ? 'Jan 12, 2025' : '12 January 2025'}
          </span>
        </div>
        <p className="text-xs text-stone-400 mt-2">Position is controlled via the Card Content Manager (drag &amp; drop).</p>
      </div>
    </div>
  );
}
