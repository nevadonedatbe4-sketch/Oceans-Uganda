import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import SectionHeader from '../components/SectionHeader';

interface PageRow {
  id: string;
  title: string;
  slug: string;
  page_type: string;
  status: string;
}

interface SectionRow {
  id: string;
  page_id: string;
  section_type: string;
  section_key: string;
  position_index: number;
  is_visible: boolean;
  settings_json: Record<string, unknown>;
}

const SECTION_TYPE_META: Record<string, { label: string; icon: string; color: string }> = {
  hero: { label: 'Hero', icon: 'ri-image-2-line', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  featured_properties: { label: 'Featured Properties', icon: 'ri-layout-grid-2-line', color: 'bg-green-50 text-green-700 border-green-200' },
  neighbourhood_grid: { label: 'Neighbourhood Grid', icon: 'ri-map-pin-2-line', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  cta_banner: { label: 'CTA Banner', icon: 'ri-megaphone-line', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  testimonials: { label: 'Testimonials', icon: 'ri-chat-quote-line', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  contact: { label: 'Contact Section', icon: 'ri-contacts-book-2-line', color: 'bg-[#f5f5f5] text-stone-600 border-stone-200' },
  rich_text: { label: 'Rich Text', icon: 'ri-article-line', color: 'bg-[#f5f5f5] text-stone-600 border-stone-200' },
  faq: { label: 'FAQ', icon: 'ri-question-answer-line', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  area_snapshot: { label: 'Area Snapshot', icon: 'ri-map-2-line', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  related_articles: { label: 'Related Articles', icon: 'ri-newspaper-line', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
};

const PAGE_TYPE_ICONS: Record<string, string> = {
  home: 'ri-home-4-line',
  listing_archive: 'ri-layout-grid-line',
  neighbourhood: 'ri-map-pin-2-line',
  contact: 'ri-contacts-book-2-line',
  static_page: 'ri-file-text-line',
};

function SectionCard({
  section,
  index,
  total,
  onToggle,
  onMoveUp,
  onMoveDown,
}: {
  section: SectionRow;
  index: number;
  total: number;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const meta = SECTION_TYPE_META[section.section_type] || {
    label: section.section_type,
    icon: 'ri-layout-line',
    color: 'bg-[#f5f5f5] text-stone-600 border-stone-200',
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white border rounded-lg transition-all ${
        section.is_visible ? 'border-stone-200' : 'border-stone-100 opacity-60'
      }`}
    >
      {/* Drag handle / position */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className={`w-6 h-6 flex items-center justify-center transition-colors cursor-pointer ${
            index === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <i className="ri-arrow-up-s-line text-sm" />
        </button>
        <span className="text-[11px] font-mono text-stone-300 font-bold">{index + 1}</span>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className={`w-6 h-6 flex items-center justify-center transition-colors cursor-pointer ${
            index === total - 1 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <i className="ri-arrow-down-s-line text-sm" />
        </button>
      </div>

      {/* Section type badge */}
      <div className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${meta.color}`}>
        <i className={`${meta.icon} text-sm`} />
        {meta.label}
      </div>

      {/* Section key */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-700 truncate">{section.section_key}</p>
        <p className="text-[11px] text-stone-400 font-mono">{section.section_type}</p>
      </div>

      {/* Visibility toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-stone-400">{section.is_visible ? 'Visible' : 'Hidden'}</span>
        <button
          onClick={onToggle}
          className={`relative w-10 h-5 transition-colors cursor-pointer ${section.is_visible ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
          style={{ borderRadius: '10px' }}
        >
          <span
            className="absolute top-0.5 w-4 h-4 bg-white transition-transform"
            style={{ borderRadius: '8px', transform: section.is_visible ? 'translateX(22px)' : 'translateX(2px)' }}
          />
        </button>
      </div>
    </div>
  );
}

export default function PageBuilderPage() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [activePage, setActivePage] = useState<PageRow | null>(null);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dirty, setDirty] = useState(false);

  // Load pages
  useEffect(() => {
    supabase
      .from('pages')
      .select('*')
      .order('title')
      .then(({ data }) => {
        if (data) {
          setPages(data as PageRow[]);
          if (data.length > 0) setActivePage(data[0] as PageRow);
        }
        setLoading(false);
      });
  }, []);

  // Load sections for active page
  const loadSections = useCallback(async (pageId: string) => {
    setSectionsLoading(true);
    const { data } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', pageId)
      .order('position_index');
    setSections((data as SectionRow[]) || []);
    setSectionsLoading(false);
    setDirty(false);
  }, []);

  useEffect(() => {
    if (activePage) loadSections(activePage.id);
  }, [activePage, loadSections]);

  const handleToggle = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_visible: !s.is_visible } : s))
    );
    setDirty(true);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections.map((s, i) => ({ ...s, position_index: i })));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!activePage) return;
    setSaving(true);

    const updates = sections.map((s, i) =>
      supabase
        .from('page_sections')
        .update({ position_index: i, is_visible: s.is_visible, updated_at: new Date().toISOString() })
        .eq('id', s.id)
    );

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);

    setSaving(false);
    setSaveStatus(hasError ? 'error' : 'success');
    if (!hasError) setDirty(false);
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="max-w-[900px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-layout-masonry-line"
        title="Page Builder"
        description="Control which sections appear on each page, their order, and visibility. Drag sections up/down to reorder."
      />

      <div className="flex gap-5">
        {/* Page list sidebar */}
        <div className="w-52 shrink-0 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 px-2 mb-2">Pages</p>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-9 bg-stone-100 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors cursor-pointer rounded-lg ${
                  activePage?.id === page.id
                    ? 'bg-[#1B4332]/8 text-[#1B4332] font-medium'
                    : 'text-stone-600 hover:bg-[#f5f5f5] hover:text-stone-900'
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className={`${PAGE_TYPE_ICONS[page.page_type] || 'ri-file-text-line'} text-sm`} />
                </span>
                <span className="truncate">{page.title}</span>
                {activePage?.id === page.id && (
                  <span className="ml-auto w-1 h-4 rounded-full bg-[#1B4332] shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Sections panel */}
        <div className="flex-1 min-w-0">
          {activePage && (
            <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/8">
                    <i className={`${PAGE_TYPE_ICONS[activePage.page_type] || 'ri-file-text-line'} text-[#1B4332] text-sm`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{activePage.title}</p>
                    <p className="text-[11px] text-stone-400 font-mono">/{activePage.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {dirty && (
                    <button
                      onClick={() => activePage && loadSections(activePage.id)}
                      className="px-3 py-1.5 text-xs font-medium text-stone-500 border border-stone-200 hover:border-stone-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={!dirty || saving}
                    className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                      dirty
                        ? 'bg-[#1B4332] text-white hover:bg-[#1B4332]/90'
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {saving ? 'Saving…' : saveStatus === 'success' ? 'Saved!' : 'Save Order'}
                  </button>
                </div>
              </div>

              {/* Sections list */}
              <div className="p-5">
                {sectionsLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-[#f5f5f5] animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : sections.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 flex items-center justify-center bg-stone-100 mx-auto mb-3">
                      <i className="ri-layout-line text-2xl text-stone-300" />
                    </div>
                    <p className="text-sm font-medium text-stone-500 mb-1">No sections configured</p>
                    <p className="text-xs text-stone-400">This page has no section definitions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sections.map((section, index) => (
                      <SectionCard
                        key={section.id}
                        section={section}
                        index={index}
                        total={sections.length}
                        onToggle={() => handleToggle(section.id)}
                        onMoveUp={() => handleMove(index, 'up')}
                        onMoveDown={() => handleMove(index, 'down')}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Legend */}
              {sections.length > 0 && (
                <div className="px-5 pb-5">
                  <div className="pt-4 border-t border-stone-100">
                    <p className="text-[11px] text-stone-400 mb-2 uppercase tracking-widest font-medium">Section Types</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(SECTION_TYPE_META).map(([key, meta]) => (
                        <span key={key} className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-semibold uppercase tracking-wider ${meta.color}`}>
                          <i className={`${meta.icon} text-xs`} />
                          {meta.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
