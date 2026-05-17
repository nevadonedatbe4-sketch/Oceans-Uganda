import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

const FONT_WEIGHTS = [
  { value: '300', label: '300 — Light' },
  { value: '400', label: '400 — Regular' },
  { value: '500', label: '500 — Medium' },
  { value: '600', label: '600 — SemiBold' },
  { value: '700', label: '700 — Bold' },
  { value: '800', label: '800 — ExtraBold' },
  { value: '900', label: '900 — Black' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize Each Word' },
];

const FONT_FAMILIES = [
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Roboto', label: 'Roboto (Sans-serif)' },
  { value: 'Inter', label: 'Inter (Sans-serif)' },
  { value: 'Lato', label: 'Lato (Sans-serif)' },
  { value: 'Montserrat', label: 'Montserrat (Sans-serif)' },
  { value: 'Open Sans', label: 'Open Sans (Sans-serif)' },
  { value: 'Raleway', label: 'Raleway (Sans-serif)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond (Serif)' },
  { value: 'EB Garamond', label: 'EB Garamond (Serif)' },
  { value: 'Georgia', label: 'Georgia (System Serif)' },
];

interface FontGroupProps {
  prefix: string;
  label: string;
  icon: string;
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
  hasTransform?: boolean;
  hasAlign?: boolean;
  preview?: string;
}

function FontGroup({ prefix, label, icon, get, update, hasTransform = false, preview = 'The quick brown fox jumps over the lazy dog' }: FontGroupProps) {
  const family = get(`${prefix}_family`, 'Roboto');
  const size = get(`${prefix}_size`, '16');
  const weight = get(`${prefix}_weight`, '400');
  const lineH = get(`${prefix}_line_height`, '1.5');
  const letterS = get(`${prefix}_letter_spacing`, '0');
  const transform = get(`${prefix}_transform`, 'none');

  return (
    <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 flex items-center justify-center">
          <i className={`${icon} text-[#1B4332]`} />
        </span>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">{label}</h3>
      </div>

      {/* Preview box */}
      <div
        className="rounded-lg border border-stone-100 bg-[#f5f5f5] px-4 py-3 text-stone-800 transition-all"
        style={{
          fontFamily: family,
          fontSize: `${size}px`,
          fontWeight: weight,
          lineHeight: lineH,
          letterSpacing: `${letterS}em`,
          textTransform: hasTransform ? (transform as 'none' | 'uppercase' | 'lowercase' | 'capitalize') : 'none',
        }}
      >
        {preview}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SettingField
          label="Font Family"
          type="select"
          value={family}
          onChange={(v) => update(`${prefix}_family`, v)}
          options={FONT_FAMILIES}
        />
        <SettingField
          label="Font Weight"
          type="select"
          value={weight}
          onChange={(v) => update(`${prefix}_weight`, v)}
          options={FONT_WEIGHTS}
        />
        <SettingField
          label="Font Size"
          type="number"
          value={size}
          onChange={(v) => update(`${prefix}_size`, v)}
          unit="px"
          min={10}
          max={72}
        />
        <SettingField
          label="Line Height"
          type="number"
          value={lineH}
          onChange={(v) => update(`${prefix}_line_height`, v)}
          placeholder="1.5"
          hint="Unitless — e.g. 1.4 or 1.6"
        />
        <SettingField
          label="Letter Spacing"
          type="number"
          value={letterS}
          onChange={(v) => update(`${prefix}_letter_spacing`, v)}
          unit="em"
          placeholder="0"
          hint="Use 0.05 for wide, -0.02 for tight."
        />
        {hasTransform && (
          <SettingField
            label="Text Transform"
            type="select"
            value={transform}
            onChange={(v) => update(`${prefix}_transform`, v)}
            options={TEXT_TRANSFORMS}
          />
        )}
      </div>
    </div>
  );
}

export default function TypographyManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('typography');

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
        icon="ri-text"
        title="Typography"
        description="Control fonts, sizes, weights, and spacing across all major text elements of the site."
      />

      <div className="flex items-start gap-3 bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-lg px-4 py-3">
        <i className="ri-information-line text-[#1B4332] mt-0.5 shrink-0" />
        <p className="text-sm text-[#1B4332]/80">
          Font previews update live as you make changes. Changes apply globally across the site after saving.
          Google Fonts are loaded automatically based on the font family selected.
        </p>
      </div>

      <FontGroup prefix="typo_heading" label="Headings" icon="ri-heading" get={get} update={update} hasTransform preview="Luxury Villas in Kampala" />
      <FontGroup prefix="typo_body" label="Body Text" icon="ri-text" get={get} update={update} preview="Discover premium properties for sale and rent across Uganda's finest neighborhoods." />
      <FontGroup prefix="typo_nav" label="Navigation" icon="ri-navigation-line" get={get} update={update} hasTransform preview="Buy  ·  Rent  ·  Neighborhoods  ·  Agents  ·  Contact" />
      <FontGroup prefix="typo_topbar" label="Top Bar" icon="ri-subtract-line" get={get} update={update} hasTransform preview="+256 700 123 456  |  info@oceansuganda.com" />
      <FontGroup prefix="typo_footer" label="Footer" icon="ri-layout-bottom-line" get={get} update={update} preview="© 2026 Oceans Uganda. All rights reserved. Premium Real Estate in Uganda." />

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
