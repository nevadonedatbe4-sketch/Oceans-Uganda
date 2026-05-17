interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

interface ColorGroup {
  label: string;
  icon: string;
  description: string;
  fields: { key: string; label: string; default: string; hint: string }[];
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    label: 'Core Palette',
    icon: 'ri-drop-fill',
    description: 'Primary brand colors used across cards, buttons, sections and navigation.',
    fields: [
      { key: 'ds_primary_color', label: 'Primary', default: '#001731', hint: 'Main brand color — headings, nav, primary buttons.' },
      { key: 'ds_secondary_color', label: 'Secondary', default: '#002349', hint: 'Secondary brand color — hover states, sub-sections.' },
      { key: 'ds_accent_color', label: 'Accent', default: '#0D5959', hint: 'Accent — active filters, highlights, links.' },
      { key: 'ds_golden_color', label: 'Golden / Highlight', default: '#C9A84C', hint: 'Labels, badges, featured tags, decorative accents.' },
    ],
  },
  {
    label: 'Text Colors',
    icon: 'ri-font-color',
    description: 'Controls all text rendering across the site.',
    fields: [
      { key: 'ds_text_primary', label: 'Text Primary', default: '#1a1a1a', hint: 'Main body text, headings, card titles.' },
      { key: 'ds_text_secondary', label: 'Text Secondary', default: '#6b7280', hint: 'Subtitles, descriptions, secondary info.' },
      { key: 'ds_text_muted', label: 'Text Muted', default: '#9ca3af', hint: 'Labels, hints, placeholders, meta info.' },
      { key: 'ds_text_inverse', label: 'Text Inverse', default: '#ffffff', hint: 'Text on dark backgrounds (buttons, hero).' },
    ],
  },
  {
    label: 'Background Colors',
    icon: 'ri-layout-fill',
    description: 'Page and section background colors.',
    fields: [
      { key: 'ds_bg_color', label: 'Page Background', default: '#ffffff', hint: 'Default page background.' },
      { key: 'ds_bg_surface', label: 'Surface / Card BG', default: '#ffffff', hint: 'Card and panel backgrounds.' },
      { key: 'ds_bg_subtle', label: 'Subtle BG', default: '#f7f8fa', hint: 'Section backgrounds, alternating rows.' },
      { key: 'ds_bg_dark', label: 'Dark BG', default: '#001731', hint: 'Dark sections, footer, hero overlays.' },
    ],
  },
  {
    label: 'Border & Divider',
    icon: 'ri-separator',
    description: 'Controls all borders, dividers and separators.',
    fields: [
      { key: 'ds_border_color', label: 'Border Default', default: '#f0f0f0', hint: 'Card borders, section dividers.' },
      { key: 'ds_border_strong', label: 'Border Strong', default: '#e5e7eb', hint: 'Stronger borders, form inputs.' },
      { key: 'ds_border_focus', label: 'Border Focus', default: '#0D5959', hint: 'Input focus ring color.' },
    ],
  },
  {
    label: 'State Colors',
    icon: 'ri-checkbox-circle-line',
    description: 'Feedback and status colors.',
    fields: [
      { key: 'ds_color_success', label: 'Success', default: '#16a34a', hint: 'Success messages, available status.' },
      { key: 'ds_color_warning', label: 'Warning', default: '#d97706', hint: 'Warning messages, pending status.' },
      { key: 'ds_color_error', label: 'Error', default: '#dc2626', hint: 'Error messages, unavailable status.' },
      { key: 'ds_color_info', label: 'Info', default: '#0369a1', hint: 'Info messages, neutral status.' },
    ],
  },
];

// CSS variable map — key → CSS var name
const CSS_VAR_MAP: Record<string, string> = {
  ds_primary_color: '--color-primary',
  ds_secondary_color: '--color-secondary',
  ds_accent_color: '--color-accent',
  ds_golden_color: '--color-golden',
  ds_text_primary: '--color-text-primary',
  ds_text_secondary: '--color-text-secondary',
  ds_text_muted: '--color-text-muted',
  ds_text_inverse: '--color-text-inverse',
  ds_bg_color: '--color-bg',
  ds_bg_surface: '--color-surface',
  ds_bg_subtle: '--color-bg-subtle',
  ds_bg_dark: '--color-bg-dark',
  ds_border_color: '--color-border',
  ds_border_strong: '--color-border-strong',
  ds_border_focus: '--color-border-focus',
  ds_color_success: '--color-success',
  ds_color_warning: '--color-warning',
  ds_color_error: '--color-error',
  ds_color_info: '--color-info',
};

const USAGE_TAGS: Record<string, string[]> = {
  ds_primary_color: ['Cards', 'Buttons', 'Nav', 'Sections'],
  ds_secondary_color: ['Hover', 'Sub-sections'],
  ds_accent_color: ['Cards', 'Buttons', 'Sections'],
  ds_golden_color: ['Cards', 'Badges', 'Sections'],
  ds_text_primary: ['Cards', 'Sections'],
  ds_text_secondary: ['Cards', 'Sections'],
  ds_text_muted: ['Cards', 'Forms'],
  ds_bg_color: ['Sections', 'Pages'],
  ds_bg_surface: ['Cards', 'Panels'],
  ds_bg_subtle: ['Sections'],
  ds_bg_dark: ['Footer', 'Hero'],
  ds_border_color: ['Cards', 'Sections'],
};

export default function ColorPanel({ get, update }: Props) {
  const allFields = COLOR_GROUPS.flatMap((g) => g.fields);

  return (
    <div className="space-y-6">
      {/* Usage map */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-information-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Global Color System</h3>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          These colors are injected as CSS variables and cascade across <strong>Cards</strong>, <strong>Buttons</strong>, <strong>Sections</strong>, <strong>Navigation</strong> and all pages — homepage, listing pages, property pages, neighbourhood pages and guide pages.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Cards', 'Buttons', 'Sections', 'Nav', 'Forms', 'Hero', 'Footer', 'Badges', 'Pages'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-[#1B4332]/8 text-[#1B4332] text-[10px] font-semibold rounded-full uppercase tracking-wide">{tag}</span>
          ))}
        </div>
      </div>

      {/* Color groups */}
      {COLOR_GROUPS.map((group) => (
        <div key={group.label} className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 flex items-center justify-center">
              <i className={`${group.icon} text-[#1B4332] text-sm`} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">{group.label}</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">{group.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {group.fields.map((field) => {
              const val = get(field.key, field.default);
              const cssVar = CSS_VAR_MAP[field.key];
              const usageTags = USAGE_TAGS[field.key] || [];
              return (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-stone-600 uppercase tracking-widest">{field.label}</label>
                    {cssVar && (
                      <span className="text-[9px] font-mono text-stone-300 bg-[#f5f5f5] px-1.5 py-0.5 rounded">{cssVar}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={val.startsWith('#') ? val : field.default}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="w-10 h-10 border border-stone-200 cursor-pointer p-0.5 rounded shrink-0"
                    />
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="flex-1 border border-stone-200 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-[#1B4332] font-mono rounded-md"
                      placeholder={field.default}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-stone-400">{field.hint}</p>
                    {usageTags.length > 0 && (
                      <div className="flex gap-1 flex-wrap justify-end">
                        {usageTags.map((t) => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 bg-stone-100 text-stone-400 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Full swatch preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">Full Palette Preview</h3>
        <div className="flex flex-wrap gap-3">
          {allFields.map((field) => {
            const val = get(field.key, field.default);
            return (
              <div key={field.key} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 border border-stone-200 rounded"
                  style={{ background: val.startsWith('#') || val.startsWith('rgb') ? val : field.default }}
                />
                <span className="text-[9px] font-mono text-stone-400 text-center max-w-[56px] leading-tight">{field.label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-stone-400 mt-4 flex items-center gap-1.5">
          <i className="ri-information-line" />
          Colors are injected as CSS variables on save and cascade globally — no hardcoded styles.
        </p>
      </div>
    </div>
  );
}
