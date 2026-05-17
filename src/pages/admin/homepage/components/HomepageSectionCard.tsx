import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body_text: string | null;
  button_text: string | null;
  button_link: string | null;
  image_url: string | null;
  visible: boolean;
  sort_order: number;
}

interface Props {
  section: HomepageSection;
  onUpdated: (updated: HomepageSection) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
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

export default function HomepageSectionCard({
  section,
  onUpdated,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isDragging,
  dragHandleProps,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState<HomepageSection>(section);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [typoTab, setTypoTab] = useState(false);

  // Typography state (stored in site_settings with section-specific keys)
  const typoKey = `hp_section_${section.section_key}`;
  const [typo, setTypo] = useState({
    eyebrow_font_family: '',
    eyebrow_font_weight: '400',
    eyebrow_font_size: '12',
    eyebrow_letter_spacing: '0.3',
    eyebrow_transform: 'uppercase',
    title_font_family: 'Prata',
    title_font_weight: '400',
    title_font_size: '36',
    title_letter_spacing: '0',
    title_line_height: '1.2',
    title_transform: 'none',
    subtitle_font_family: '',
    subtitle_font_weight: '400',
    subtitle_font_size: '14',
    subtitle_letter_spacing: '0',
    subtitle_line_height: '1.5',
    subtitle_transform: 'none',
  });
  const [typoLoaded, setTypoLoaded] = useState(false);

  const loadTypo = async () => {
    if (typoLoaded) return;
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .like('key', `${typoKey}_%`);
    if (data) {
      const m: Record<string, string> = {};
      data.forEach((r: { key: string; value: string }) => {
        m[r.key.replace(`${typoKey}_`, '')] = r.value;
      });
      setTypo((prev) => ({ ...prev, ...m }));
    }
    setTypoLoaded(true);
  };

  const saveTypo = async () => {
    const entries = Object.entries(typo).map(([k, v]) => ({
      key: `${typoKey}_${k}`,
      value: v,
      setting_group: `hp_section_typo_${section.section_key}`,
    }));
    for (const entry of entries) {
      await supabase.from('site_settings').upsert(entry, { onConflict: 'key' });
    }
  };

  const set = (partial: Partial<HomepageSection>) => setDraft((prev) => ({ ...prev, ...partial }));

  const handleToggleVisible = async () => {
    const updated = { ...section, visible: !section.visible };
    await supabase.from('homepage_sections').update({ visible: updated.visible }).eq('id', section.id);
    onUpdated(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: draft.title || null,
      subtitle: draft.subtitle || null,
      body_text: draft.body_text || null,
      button_text: draft.button_text || null,
      button_link: draft.button_link || null,
      image_url: draft.image_url || null,
      sort_order: draft.sort_order,
    };
    const [{ error }] = await Promise.all([
      supabase.from('homepage_sections').update(payload).eq('id', section.id),
      saveTypo(),
    ]);
    setSaving(false);
    if (!error) {
      setSaved(true);
      onUpdated({ ...section, ...payload, visible: section.visible });
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const keyLabel = section.section_key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const sectionIcon: Record<string, string> = {
    hero: 'ri-image-2-line',
    featured_listings: 'ri-building-2-line',
    featured_neighborhoods: 'ri-map-pin-2-line',
    about_oceans: 'ri-information-line',
    stats: 'ri-bar-chart-2-line',
    testimonials: 'ri-chat-quote-line',
    cta_banner: 'ri-megaphone-line',
    latest_blog: 'ri-article-line',
  };

  const icon = sectionIcon[section.section_key] || 'ri-layout-line';

  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden transition-all ${
        isDragging ? 'border-[#1B4332]/40 ring-2 ring-[#1B4332]/20 opacity-80' : expanded ? 'border-[#1B4332]/30' : 'border-stone-200'
      }`}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div
          {...dragHandleProps}
          className="w-7 h-7 flex items-center justify-center text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing shrink-0 transition-colors"
          title="Drag to reorder"
        >
          <i className="ri-draggable text-lg" />
        </div>

        <div className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-md shrink-0">
          <i className={`${icon} text-stone-500 text-sm`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono bg-stone-100 text-stone-500 px-2 py-0.5 rounded">
              {section.section_key}
            </span>
            {!section.visible && (
              <span className="text-xs text-stone-400 italic">Hidden</span>
            )}
          </div>
          <p className="text-sm font-semibold text-stone-800 mt-0.5 truncate">
            {section.title || <span className="text-stone-400 italic font-normal">No title — {keyLabel}</span>}
          </p>
        </div>

        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move up"
            className={`w-6 h-5 flex items-center justify-center rounded text-xs transition-colors cursor-pointer ${
              isFirst ? 'text-stone-200 cursor-not-allowed' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
          >
            <i className="ri-arrow-up-s-line" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            title="Move down"
            className={`w-6 h-5 flex items-center justify-center rounded text-xs transition-colors cursor-pointer ${
              isLast ? 'text-stone-200 cursor-not-allowed' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
            }`}
          >
            <i className="ri-arrow-down-s-line" />
          </button>
        </div>

        <button
          onClick={handleToggleVisible}
          title={section.visible ? 'Hide section' : 'Show section'}
          className={`w-8 h-8 flex items-center justify-center rounded-md border cursor-pointer transition-colors shrink-0 ${
            section.visible
              ? 'border-stone-200 text-stone-500 hover:bg-[#f5f5f5]'
              : 'border-stone-200 text-stone-300 hover:bg-[#f5f5f5]'
          }`}
        >
          <i className={section.visible ? 'ri-eye-line' : 'ri-eye-off-line'} />
        </button>

        <button
          onClick={() => { setExpanded((e) => !e); if (!expanded) loadTypo(); }}
          className="px-3 py-1.5 text-xs font-medium border border-stone-200 rounded-md text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0"
        >
          <i className={expanded ? 'ri-arrow-up-s-line' : 'ri-pencil-line'} />
          {expanded ? 'Collapse' : 'Edit'}
        </button>
      </div>

      {/* Expanded edit form */}
      {expanded && (
        <div className="border-t border-stone-100 bg-[#f5f5f5]/50">
          {/* Sub-tabs */}
          <div className="flex gap-1 px-5 pt-4">
            <button
              onClick={() => setTypoTab(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap transition-colors ${!typoTab ? 'bg-[#1B4332] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              <i className="ri-layout-line mr-1" />Content
            </button>
            <button
              onClick={() => setTypoTab(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap transition-colors ${typoTab ? 'bg-[#1B4332] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              <i className="ri-font-size mr-1" />Typography
            </button>
          </div>

          {/* Content tab */}
          {!typoTab && (
            <div className="px-5 py-5 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={draft.title ?? ''}
                    onChange={(e) => set({ title: e.target.value })}
                    placeholder="Section heading…"
                    className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={draft.subtitle ?? ''}
                    onChange={(e) => set({ subtitle: e.target.value })}
                    placeholder="Subheading / tagline…"
                    className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Body Text</label>
                <textarea
                  rows={3}
                  value={draft.body_text ?? ''}
                  onChange={(e) => set({ body_text: e.target.value })}
                  placeholder="Main paragraph text for this section…"
                  className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={draft.button_text ?? ''}
                    onChange={(e) => set({ button_text: e.target.value })}
                    placeholder="e.g. Explore Listings"
                    className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={draft.button_link ?? ''}
                    onChange={(e) => set({ button_link: e.target.value })}
                    placeholder="/buy or https://…"
                    className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Image / Banner URL</label>
                <input
                  type="url"
                  value={draft.image_url ?? ''}
                  onChange={(e) => set({ image_url: e.target.value })}
                  placeholder="https://…"
                  className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 bg-white"
                />
              </div>

              {draft.image_url && (
                <div className="w-full h-32 rounded-lg overflow-hidden border border-stone-200">
                  <img src={draft.image_url} alt="Preview" className="w-full h-full object-cover object-top" />
                </div>
              )}
            </div>
          )}

          {/* Typography tab */}
          {typoTab && (
            <div className="px-5 py-5 space-y-6">
              {/* Eyebrow */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Eyebrow / Label</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Family</label>
                    <select value={typo.eyebrow_font_family} onChange={(e) => setTypo((t) => ({ ...t, eyebrow_font_family: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Weight</label>
                    <select value={typo.eyebrow_font_weight} onChange={(e) => setTypo((t) => ({ ...t, eyebrow_font_weight: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {FONT_WEIGHTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Size (px)</label>
                    <input type="number" value={typo.eyebrow_font_size} onChange={(e) => setTypo((t) => ({ ...t, eyebrow_font_size: e.target.value }))} min={10} max={32} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Letter Spacing (em)</label>
                    <input type="number" value={typo.eyebrow_letter_spacing} onChange={(e) => setTypo((t) => ({ ...t, eyebrow_letter_spacing: e.target.value }))} step={0.05} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Text Transform</label>
                    <select value={typo.eyebrow_transform} onChange={(e) => setTypo((t) => ({ ...t, eyebrow_transform: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {TEXT_TRANSFORMS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-100" />

              {/* Title */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Section Title</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Family</label>
                    <select value={typo.title_font_family} onChange={(e) => setTypo((t) => ({ ...t, title_font_family: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Weight</label>
                    <select value={typo.title_font_weight} onChange={(e) => setTypo((t) => ({ ...t, title_font_weight: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {FONT_WEIGHTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Size (px)</label>
                    <input type="number" value={typo.title_font_size} onChange={(e) => setTypo((t) => ({ ...t, title_font_size: e.target.value }))} min={16} max={80} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Letter Spacing (em)</label>
                    <input type="number" value={typo.title_letter_spacing} onChange={(e) => setTypo((t) => ({ ...t, title_letter_spacing: e.target.value }))} step={0.01} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Line Height</label>
                    <input type="number" value={typo.title_line_height} onChange={(e) => setTypo((t) => ({ ...t, title_line_height: e.target.value }))} step={0.1} min={1} max={3} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Text Transform</label>
                    <select value={typo.title_transform} onChange={(e) => setTypo((t) => ({ ...t, title_transform: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {TEXT_TRANSFORMS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-100" />

              {/* Subtitle */}
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Subtitle</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Family</label>
                    <select value={typo.subtitle_font_family} onChange={(e) => setTypo((t) => ({ ...t, subtitle_font_family: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Weight</label>
                    <select value={typo.subtitle_font_weight} onChange={(e) => setTypo((t) => ({ ...t, subtitle_font_weight: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {FONT_WEIGHTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Font Size (px)</label>
                    <input type="number" value={typo.subtitle_font_size} onChange={(e) => setTypo((t) => ({ ...t, subtitle_font_size: e.target.value }))} min={10} max={32} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Letter Spacing (em)</label>
                    <input type="number" value={typo.subtitle_letter_spacing} onChange={(e) => setTypo((t) => ({ ...t, subtitle_letter_spacing: e.target.value }))} step={0.01} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Line Height</label>
                    <input type="number" value={typo.subtitle_line_height} onChange={(e) => setTypo((t) => ({ ...t, subtitle_line_height: e.target.value }))} step={0.1} min={1} max={3} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-600 block">Text Transform</label>
                    <select value={typo.subtitle_transform} onChange={(e) => setTypo((t) => ({ ...t, subtitle_transform: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332] bg-white">
                      {TEXT_TRANSFORMS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Live preview */}
              <div className="rounded-lg bg-white border border-stone-200 p-4 space-y-1">
                <p className="text-[10px] text-stone-400 mb-2 uppercase tracking-wider">Live Preview</p>
                <p style={{ fontFamily: typo.eyebrow_font_family || undefined, fontWeight: typo.eyebrow_font_weight, fontSize: `${typo.eyebrow_font_size}px`, letterSpacing: `${typo.eyebrow_letter_spacing}em`, textTransform: typo.eyebrow_transform as 'none' | 'uppercase' | 'capitalize' | 'lowercase' }} className="text-amber-600">
                  Featured
                </p>
                <p style={{ fontFamily: typo.title_font_family || undefined, fontWeight: typo.title_font_weight, fontSize: `${typo.title_font_size}px`, letterSpacing: `${typo.title_letter_spacing}em`, lineHeight: typo.title_line_height, textTransform: typo.title_transform as 'none' | 'uppercase' | 'capitalize' | 'lowercase' }} className="text-stone-800">
                  {draft.title || 'Section Title'}
                </p>
                <p style={{ fontFamily: typo.subtitle_font_family || undefined, fontWeight: typo.subtitle_font_weight, fontSize: `${typo.subtitle_font_size}px`, letterSpacing: `${typo.subtitle_letter_spacing}em`, lineHeight: typo.subtitle_line_height, textTransform: typo.subtitle_transform as 'none' | 'uppercase' | 'capitalize' | 'lowercase' }} className="text-stone-500">
                  {draft.subtitle || 'Section subtitle text goes here'}
                </p>
              </div>
            </div>
          )}

          {/* Save bar */}
          <div className="flex items-center justify-between px-5 pb-5 pt-2">
            {saved ? (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <i className="ri-check-line" /> Saved successfully
              </span>
            ) : <span />}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setDraft(section); setExpanded(false); }}
                className="px-4 py-2 border border-stone-200 rounded-md text-sm text-stone-600 hover:bg-white cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-[#1B4332] text-white rounded-md text-sm font-semibold hover:bg-[#163828] disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                {saving ? 'Saving…' : 'Save Section'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
