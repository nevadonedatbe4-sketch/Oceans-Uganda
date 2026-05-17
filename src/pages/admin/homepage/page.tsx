import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import HomepageSectionCard, { type HomepageSection } from './components/HomepageSectionCard';

export default function AdminHomepage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState('');

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('sort_order')
      .order('section_key');
    if (data) setSections(data as HomepageSection[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleUpdated = (updated: HomepageSection) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  // ── Arrow-based reorder ──
  const moveSection = useCallback(async (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    const withOrder = reordered.map((s, i) => ({ ...s, sort_order: i + 1 }));
    setSections(withOrder);
    setOrderDirty(true);
  }, [sections]);

  // ── Drag handlers ──
  const handleDragStart = (idx: number) => {
    dragIndex.current = idx;
    setDraggingIdx(idx);
  };

  const handleDragEnter = (idx: number) => {
    dragOverIndex.current = idx;
    if (dragIndex.current === null || dragIndex.current === idx) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(idx, 0, moved);
    dragIndex.current = idx;
    setSections(reordered.map((s, i) => ({ ...s, sort_order: i + 1 })));
    setOrderDirty(true);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    dragOverIndex.current = null;
    setDraggingIdx(null);
  };

  // ── Save order to DB ──
  const saveOrder = async () => {
    setSaving(true);
    const updates = sections.map((s, i) =>
      supabase.from('homepage_sections').update({ sort_order: i + 1 }).eq('id', s.id)
    );
    await Promise.all(updates);
    setSaving(false);
    setOrderDirty(false);
    setSaveFeedback('Order saved!');
    setTimeout(() => setSaveFeedback(''), 2500);
  };

  const visibleCount = sections.filter((s) => s.visible).length;

  return (
    <div className="p-6 space-y-6 max-w-[900px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-jost font-bold text-stone-800">Homepage Sections</h1>
          <p className="text-sm text-stone-500 mt-1">
            {sections.length} sections · {visibleCount} currently visible
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 border border-stone-200 text-stone-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap"
        >
          <i className="ri-external-link-line" /> Preview Homepage
        </a>
      </div>

      {/* Live banner */}
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
        <i className="ri-checkbox-circle-line text-emerald-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Frontend is live — changes go live instantly</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Drag sections to reorder, or use the ↑↓ arrows. Click <strong>Save Order</strong> to persist the new order.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-lg">
          <i className="ri-layout-top-line text-4xl text-stone-300 block mb-3" />
          <h3 className="text-stone-600 font-medium">No homepage sections found</h3>
          <p className="text-sm text-stone-400 mt-1">Make sure the homepage_sections table has been seeded</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Legend + Save Order bar */}
          <div className="flex items-center justify-between text-xs text-stone-400 px-1 pb-1">
            <span className="flex items-center gap-1.5">
              <i className="ri-draggable text-stone-300" />
              Drag rows or use ↑↓ arrows to reorder sections
            </span>
            <div className="flex items-center gap-2">
              {saveFeedback && (
                <span className="text-emerald-600 flex items-center gap-1">
                  <i className="ri-check-line" /> {saveFeedback}
                </span>
              )}
              {orderDirty && (
                <button
                  onClick={saveOrder}
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#163828] disabled:opacity-60 cursor-pointer whitespace-nowrap transition-colors"
                >
                  {saving ? (
                    <><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  ) : (
                    <><i className="ri-save-line" /> Save Order</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Section cards — draggable */}
          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragEnter={() => handleDragEnter(idx)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="transition-all duration-150"
                style={{ opacity: draggingIdx === idx ? 0.5 : 1 }}
              >
                <HomepageSectionCard
                  section={section}
                  onUpdated={handleUpdated}
                  onMoveUp={() => moveSection(idx, idx - 1)}
                  onMoveDown={() => moveSection(idx, idx + 1)}
                  isFirst={idx === 0}
                  isLast={idx === sections.length - 1}
                  isDragging={draggingIdx === idx}
                  dragHandleProps={{
                    onMouseDown: (e) => e.stopPropagation(),
                  }}
                />
              </div>
            ))}
          </div>

          {/* Floating save bar when order is dirty */}
          {orderDirty && (
            <div className="sticky bottom-4 z-20 flex items-center justify-between bg-[#1B4332] text-white rounded-lg px-5 py-3">
              <span className="text-sm font-medium">
                <i className="ri-drag-move-2-line mr-2" />
                Section order changed — save to apply on the homepage
              </span>
              <button
                onClick={saveOrder}
                disabled={saving}
                className="bg-white text-[#1B4332] px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-stone-100 disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                {saving ? 'Saving…' : 'Save Order'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
