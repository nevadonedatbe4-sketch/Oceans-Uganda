import SettingField from '../../components/SettingField';

const FONT_OPTIONS = [
  { label: 'Prata (Serif)', value: 'Prata' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { label: 'Lora', value: 'Lora' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'EB Garamond', value: 'EB Garamond' },
  { label: 'Roboto (Sans-serif)', value: 'Roboto' },
  { label: 'Inter', value: 'Inter' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Jost', value: 'Jost' },
  { label: 'Outfit', value: 'Outfit' },
];

const WEIGHT_OPTIONS = [
  { label: '300 — Light', value: '300' },
  { label: '400 — Regular', value: '400' },
  { label: '500 — Medium', value: '500' },
  { label: '600 — SemiBold', value: '600' },
  { label: '700 — Bold', value: '700' },
  { label: '800 — ExtraBold', value: '800' },
];

const TRANSFORM_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Capitalize', value: 'capitalize' },
  { label: 'Lowercase', value: 'lowercase' },
];

const TRACKING_OPTIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Wide (0.05em)', value: '0.05em' },
  { label: 'Wider (0.1em)', value: '0.1em' },
  { label: 'Widest (0.15em)', value: '0.15em' },
];

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

const ELEMENTS = [
  { key: 'prop_title', label: 'Property Title' },
  { key: 'address', label: 'Address' },
  { key: 'meta_label', label: 'Meta Labels (beds, baths…)' },
  { key: 'meta_figure', label: 'Meta Figures' },
  { key: 'price', label: 'Price' },
  { key: 'sub_price', label: 'Sub Price' },
  { key: 'prop_type', label: 'Property Type' },
  { key: 'area_postfix', label: 'Area Postfix' },
  { key: 'btn_text', label: 'Buttons' },
  { key: 'agent_name', label: 'Agent Name' },
  { key: 'date_text', label: 'Date' },
];

export default function TypographyPanel({ get, update }: Props) {
  const headingFont = get('ds_heading_font', 'Prata');
  const bodyFont = get('ds_body_font', 'Roboto');

  return (
    <div className="space-y-6">
      {/* Global Fonts */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-text text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Global Fonts</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingField label="Heading Font" type="select" value={headingFont} onChange={(v) => update('ds_heading_font', v)} options={FONT_OPTIONS} hint="Used for page titles, section headings and property names." />
          <SettingField label="Body Font" type="select" value={bodyFont} onChange={(v) => update('ds_body_font', v)} options={FONT_OPTIONS} hint="Used for paragraphs, labels, buttons and UI text." />
          <SettingField label="Base Font Size" type="number" value={get('ds_base_font_size', '14')} onChange={(v) => update('ds_base_font_size', v)} unit="px" min={10} max={22} hint="Base body text size." />
          <SettingField label="Line Height" type="number" value={get('ds_line_height', '160')} onChange={(v) => update('ds_line_height', v)} unit="%" min={100} max={220} hint="Body text line height." />
        </div>
        {/* Font preview */}
        <div className="mt-2 pt-4 border-t border-stone-100 p-4 bg-[#f5f5f5] rounded-lg">
          <p className="text-2xl mb-2 text-stone-800" style={{ fontFamily: `'${headingFont}', serif` }}>
            Luxury 3-Bedroom Apartment in Kololo
          </p>
          <p className="text-sm text-stone-500 leading-relaxed" style={{ fontFamily: `'${bodyFont}', sans-serif`, fontSize: `${get('ds_base_font_size', '14')}px` }}>
            Discover this stunning property nestled in the heart of Kampala&apos;s most prestigious neighbourhood.
          </p>
        </div>
      </div>

      {/* Per-Element Typography */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-font-size text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Per-Element Typography</h3>
          <span className="text-[10px] text-stone-400 ml-1">— overrides global font for specific elements</span>
        </div>

        <div className="space-y-5">
          {ELEMENTS.map((el) => (
            <div key={el.key} className="border border-stone-100 rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-stone-600 uppercase tracking-widest">{el.label}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <SettingField
                  label="Font Family"
                  type="select"
                  value={get(`typo_${el.key}_font`, 'inherit')}
                  onChange={(v) => update(`typo_${el.key}_font`, v)}
                  options={[{ label: 'Inherit Global', value: 'inherit' }, ...FONT_OPTIONS]}
                />
                <SettingField
                  label="Size"
                  type="number"
                  value={get(`typo_${el.key}_size`, '')}
                  onChange={(v) => update(`typo_${el.key}_size`, v)}
                  unit="px"
                  min={8}
                  max={72}
                  placeholder="auto"
                />
                <SettingField
                  label="Weight"
                  type="select"
                  value={get(`typo_${el.key}_weight`, '400')}
                  onChange={(v) => update(`typo_${el.key}_weight`, v)}
                  options={WEIGHT_OPTIONS}
                />
                <SettingField
                  label="Transform"
                  type="select"
                  value={get(`typo_${el.key}_transform`, 'none')}
                  onChange={(v) => update(`typo_${el.key}_transform`, v)}
                  options={TRANSFORM_OPTIONS}
                />
                <SettingField
                  label="Letter Spacing"
                  type="select"
                  value={get(`typo_${el.key}_tracking`, 'normal')}
                  onChange={(v) => update(`typo_${el.key}_tracking`, v)}
                  options={TRACKING_OPTIONS}
                />
                <SettingField
                  label="Line Height"
                  type="number"
                  value={get(`typo_${el.key}_lh`, '')}
                  onChange={(v) => update(`typo_${el.key}_lh`, v)}
                  unit="%"
                  min={100}
                  max={220}
                  placeholder="auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
