import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

type SliderFieldProps = {
  label: string;
  settingKey: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
};

function SliderField({ label, settingKey, min, max, step = 1, unit = '', get, update }: SliderFieldProps) {
  const val = Number(get(settingKey, String(min)));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-stone-600">{label}</label>
        <span className="text-xs font-semibold text-[#1B4332] tabular-nums">
          {val}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => update(settingKey, e.target.value)}
        className="w-full h-1.5 rounded-full bg-stone-200 accent-[#1B4332] cursor-pointer"
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[10px] text-stone-400">{min}{unit}</span>
        <span className="text-[10px] text-stone-400">{max}{unit}</span>
      </div>
    </div>
  );
}

type ColorFieldProps = {
  label: string;
  settingKey: string;
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
};

function ColorField({ label, settingKey, get, update }: ColorFieldProps) {
  const val = get(settingKey, '#ffffff');
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-medium text-stone-600 flex-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={val}
          onChange={(e) => update(settingKey, e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-stone-200"
        />
        <input
          type="text"
          value={val}
          onChange={(e) => update(settingKey, e.target.value)}
          className="w-24 border border-stone-200 rounded px-2 py-1.5 text-xs font-mono text-stone-700 focus:outline-none focus:border-[#1B4332]"
        />
      </div>
    </div>
  );
}

type TextFieldProps = {
  label: string;
  settingKey: string;
  placeholder?: string;
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
};

function TextField({ label, settingKey, placeholder, get, update }: TextFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1.5">{label}</label>
      <input
        type="text"
        value={get(settingKey, '')}
        onChange={(e) => update(settingKey, e.target.value)}
        placeholder={placeholder}
        className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] placeholder-stone-300"
      />
    </div>
  );
}

const FONT_FAMILIES = [
  { value: '', label: 'Site Default' },
  { value: 'Prata', label: 'Prata (Serif)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Sans-serif)' },
  { value: 'Roboto', label: 'Roboto (Sans-serif)' },
  { value: 'Lato', label: 'Lato (Sans-serif)' },
  { value: 'Raleway', label: 'Raleway (Sans-serif)' },
  { value: 'Oswald', label: 'Oswald (Sans-serif)' },
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

export default function NeighborhoodsMgmtPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('neighborhoods_settings');

  const enabled = get('nb_show_section', 'true') === 'true';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-map-pin-2-line"
        title="Neighbourhoods Section"
        description="Control how the neighbourhoods grid looks and behaves on the homepage."
      />

      {/* VISIBILITY TOGGLE */}
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-800">Show Section on Homepage</p>
            <p className="text-xs text-stone-400 mt-0.5">Toggle the entire neighbourhoods grid on/off</p>
          </div>
          <button
            type="button"
            onClick={() => update('nb_show_section', enabled ? 'false' : 'true')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${enabled ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-text text-[#1B4332] text-sm" />
          </div>
          <p className="text-sm font-semibold text-stone-800">Section Content</p>
        </div>
        <div className="p-5 space-y-4">
          <TextField
            label="Eyebrow / Label"
            settingKey="nb_section_label"
            placeholder="Explore"
            get={get}
            update={update}
          />
          <TextField
            label="Section Title"
            settingKey="nb_section_title"
            placeholder="Neighbourhoods"
            get={get}
            update={update}
          />
          <TextField
            label="Section Subtitle"
            settingKey="nb_section_subtitle"
            placeholder="Discover Kampala's finest residential areas"
            get={get}
            update={update}
          />

          {/* Item count */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-stone-600">Number of Neighbourhoods to Show</label>
              <span className="text-xs font-semibold text-[#1B4332]">{get('nb_show_count', '9')}</span>
            </div>
            <input
              type="range"
              min={3}
              max={9}
              step={1}
              value={Number(get('nb_show_count', '9'))}
              onChange={(e) => update('nb_show_count', e.target.value)}
              className="w-full h-1.5 rounded-full bg-stone-200 accent-[#1B4332] cursor-pointer"
            />
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-stone-400">3 items</span>
              <span className="text-[10px] text-stone-400">9 items</span>
            </div>
          </div>
        </div>
      </div>

      {/* TYPOGRAPHY */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-font-size text-[#1B4332] text-sm" />
          </div>
          <p className="text-sm font-semibold text-stone-800">Typography</p>
        </div>
        <div className="p-5 space-y-6">
          {/* Label / Eyebrow */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Eyebrow / Label</p>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('nb_label_font_family', '')} onChange={(v) => update('nb_label_font_family', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('nb_label_font_weight', '400')} onChange={(v) => update('nb_label_font_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('nb_label_font_size', '12')} onChange={(v) => update('nb_label_font_size', v)} unit="px" min={10} max={32} />
              <SettingField label="Letter Spacing" type="number" value={get('nb_label_letter_spacing', '0.3')} onChange={(v) => update('nb_label_letter_spacing', v)} unit="em" />
              <SettingField label="Text Transform" type="select" value={get('nb_label_transform', 'uppercase')} onChange={(v) => update('nb_label_transform', v)} options={TEXT_TRANSFORMS} />
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Title */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Section Title</p>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('nb_title_font_family', 'Prata')} onChange={(v) => update('nb_title_font_family', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('nb_title_font_weight', '400')} onChange={(v) => update('nb_title_font_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('nb_title_font_size', '36')} onChange={(v) => update('nb_title_font_size', v)} unit="px" min={16} max={80} />
              <SettingField label="Letter Spacing" type="number" value={get('nb_title_letter_spacing', '0')} onChange={(v) => update('nb_title_letter_spacing', v)} unit="em" />
              <SettingField label="Line Height" type="number" value={get('nb_title_line_height', '1.2')} onChange={(v) => update('nb_title_line_height', v)} placeholder="1.2" />
              <SettingField label="Text Transform" type="select" value={get('nb_title_transform', 'none')} onChange={(v) => update('nb_title_transform', v)} options={TEXT_TRANSFORMS} />
            </div>
          </div>

          <div className="border-t border-stone-100" />

          {/* Subtitle */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Subtitle</p>
            <div className="grid grid-cols-2 gap-3">
              <SettingField label="Font Family" type="select" value={get('nb_subtitle_font_family', '')} onChange={(v) => update('nb_subtitle_font_family', v)} options={FONT_FAMILIES} />
              <SettingField label="Font Weight" type="select" value={get('nb_subtitle_font_weight', '400')} onChange={(v) => update('nb_subtitle_font_weight', v)} options={FONT_WEIGHTS} />
              <SettingField label="Font Size" type="number" value={get('nb_subtitle_font_size', '14')} onChange={(v) => update('nb_subtitle_font_size', v)} unit="px" min={10} max={32} />
              <SettingField label="Letter Spacing" type="number" value={get('nb_subtitle_letter_spacing', '0')} onChange={(v) => update('nb_subtitle_letter_spacing', v)} unit="em" />
              <SettingField label="Line Height" type="number" value={get('nb_subtitle_line_height', '1.5')} onChange={(v) => update('nb_subtitle_line_height', v)} placeholder="1.5" />
            </div>
          </div>

          {/* Live preview */}
          <div className="rounded-lg bg-[#f5f5f5] border border-stone-100 p-4 space-y-1">
            <p
              style={{
                fontFamily: get('nb_label_font_family', '') || undefined,
                fontWeight: get('nb_label_font_weight', '400'),
                fontSize: `${get('nb_label_font_size', '12')}px`,
                letterSpacing: `${get('nb_label_letter_spacing', '0.3')}em`,
                textTransform: (get('nb_label_transform', 'uppercase') as 'none' | 'uppercase' | 'capitalize' | 'lowercase'),
                color: get('nb_label_color', '#C9A84C'),
              }}
            >
              {get('nb_section_label', 'Explore')}
            </p>
            <p
              style={{
                fontFamily: get('nb_title_font_family', 'Prata') || undefined,
                fontWeight: get('nb_title_font_weight', '400'),
                fontSize: `${get('nb_title_font_size', '36')}px`,
                letterSpacing: `${get('nb_title_letter_spacing', '0')}em`,
                lineHeight: get('nb_title_line_height', '1.2'),
                textTransform: (get('nb_title_transform', 'none') as 'none' | 'uppercase' | 'capitalize' | 'lowercase'),
                color: get('nb_title_color', '#001731'),
              }}
            >
              {get('nb_section_title', 'Neighbourhoods')}
            </p>
            <p
              style={{
                fontFamily: get('nb_subtitle_font_family', '') || undefined,
                fontWeight: get('nb_subtitle_font_weight', '400'),
                fontSize: `${get('nb_subtitle_font_size', '14')}px`,
                letterSpacing: `${get('nb_subtitle_letter_spacing', '0')}em`,
                lineHeight: get('nb_subtitle_line_height', '1.5'),
                color: get('nb_subtitle_color', '#6B7280'),
              }}
            >
              {get('nb_section_subtitle', "Discover Kampala's finest residential areas")}
            </p>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT PICKER */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-layout-grid-line text-[#1B4332] text-sm" />
          </div>
          <p className="text-sm font-semibold text-stone-800">Grid Layout Style</p>
          <span className="ml-auto text-[10px] text-stone-400 bg-[#f5f5f5] border border-stone-100 rounded px-2 py-0.5">choose display format</span>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {(['mosaic', 'grid3x3'] as const).map((layout) => {
            const active = get('nb_grid_layout', 'mosaic') === layout;
            return (
              <button
                key={layout}
                type="button"
                onClick={() => update('nb_grid_layout', layout)}
                className={`relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all text-left ${
                  active ? 'border-[#1B4332]' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="p-3 bg-[#f5f5f5]">
                  {layout === 'mosaic' ? (
                    <div className="flex gap-1" style={{ height: '70px' }}>
                      <div className="bg-stone-400 rounded-sm flex-1" style={{ height: '100%' }} />
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="bg-stone-300 rounded-sm flex-1" />
                        <div className="bg-stone-300 rounded-sm flex-1" />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="bg-stone-300 rounded-sm" style={{ height: '40%' }} />
                        <div className="bg-stone-300 rounded-sm" style={{ height: '60%' }} />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="bg-stone-300 rounded-sm flex-1" />
                        <div className="bg-stone-300 rounded-sm flex-1" />
                      </div>
                      <div className="bg-stone-400 rounded-sm flex-1" style={{ height: '100%' }} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-0.5" style={{ height: '70px' }}>
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="relative bg-stone-400 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-700/70 to-transparent" />
                          <div className="absolute bottom-0.5 left-1">
                            <div className="w-4 h-0.5 bg-white/70 rounded-full mb-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-3 py-2 border-t border-stone-100 flex items-center gap-2">
                  {active && (
                    <div className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-[#1B4332] shrink-0">
                      <i className="ri-check-line text-white" style={{ fontSize: '8px' }} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-stone-800">
                      {layout === 'mosaic' ? 'Mosaic' : 'Equal Grid'}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {layout === 'mosaic' ? '5-col bento layout' : '3×3 sharp-edge cards'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MOSAIC HEIGHT */}
      {get('nb_grid_layout', 'mosaic') === 'mosaic' && (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-2.5">
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-expand-up-down-line text-[#1B4332] text-sm" />
            </div>
            <p className="text-sm font-semibold text-stone-800">Mosaic Height</p>
            <span className="ml-auto text-[10px] text-stone-400 bg-[#f5f5f5] border border-stone-100 rounded px-2 py-0.5">mosaic layout only</span>
          </div>
          <div className="p-5 space-y-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-stone-600">Total Mosaic Height</label>
              <span className="text-xs font-semibold text-[#1B4332] tabular-nums">
                {get('nb_mosaic_height', '560')}px
              </span>
            </div>
            <input
              type="range"
              min={380}
              max={800}
              step={10}
              value={Number(get('nb_mosaic_height', '560'))}
              onChange={(e) => update('nb_mosaic_height', e.target.value)}
              className="w-full h-1.5 rounded-full bg-stone-200 accent-[#1B4332] cursor-pointer"
            />
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-stone-400">380px (compact)</span>
              <span className="text-[10px] text-stone-400">800px (tall)</span>
            </div>
          </div>
        </div>
      )}

      {/* SPACING */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-space text-[#1B4332] text-sm" />
          </div>
          <p className="text-sm font-semibold text-stone-800">Spacing</p>
        </div>
        <div className="p-5 space-y-5">
          <SliderField label="Section Vertical Padding" settingKey="nb_section_padding" min={4} max={24} step={2} unit=" units" get={get} update={update} />
          <SliderField label="Gap Between Cards" settingKey="nb_card_gap" min={1} max={8} unit=" units" get={get} update={update} />
          <SliderField label="Gradient Overlay Opacity" settingKey="nb_overlay_opacity" min={20} max={90} unit="%" get={get} update={update} />
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-links-line text-[#1B4332] text-sm" />
          </div>
          <p className="text-sm font-semibold text-stone-800">"View All" CTA Button</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-700">Show "View All Neighbourhoods" Button</p>
              <p className="text-xs text-stone-400 mt-0.5">Displays a CTA link below the grid</p>
            </div>
            <button
              type="button"
              onClick={() => update('nb_show_cta', get('nb_show_cta', 'true') === 'true' ? 'false' : 'true')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                get('nb_show_cta', 'true') === 'true' ? 'bg-[#1B4332]' : 'bg-stone-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                get('nb_show_cta', 'true') === 'true' ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <TextField
            label="Button Label"
            settingKey="nb_cta_label"
            placeholder="View all neighbourhoods"
            get={get}
            update={update}
          />
          <TextField
            label="Button Link / URL"
            settingKey="nb_cta_link"
            placeholder="/neighbourhoods"
            get={get}
            update={update}
          />
        </div>
      </div>

      {/* COLOURS */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-palette-line text-[#1B4332] text-sm" />
          </div>
          <p className="text-sm font-semibold text-stone-800">Colours</p>
        </div>
        <div className="p-5 space-y-3.5">
          <ColorField label="Section Background" settingKey="nb_bg_color" get={get} update={update} />
          <ColorField label="Eyebrow Label Colour" settingKey="nb_label_color" get={get} update={update} />
          <ColorField label="Section Title Colour" settingKey="nb_title_color" get={get} update={update} />
          <ColorField label="Subtitle Colour" settingKey="nb_subtitle_color" get={get} update={update} />
        </div>
      </div>

      {/* Live preview hint */}
      <div className="flex items-start gap-3 bg-[#f5f5f5] border border-stone-200 rounded-lg px-4 py-3">
        <i className="ri-eye-line text-stone-400 mt-0.5 shrink-0" />
        <p className="text-sm text-stone-500">
          Save changes then open the <a href="/" target="_blank" rel="noreferrer" className="underline text-[#1B4332] hover:no-underline">homepage</a> to see updates live.
        </p>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
