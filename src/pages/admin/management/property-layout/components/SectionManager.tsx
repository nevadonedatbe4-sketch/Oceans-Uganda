import { useRef, useState } from 'react';
import type { LayoutSection } from '@/hooks/usePropertyLayout';

interface Props {
  enabledSections: LayoutSection[];
  disabledSections: LayoutSection[];
  onChange: (enabled: LayoutSection[], disabled: LayoutSection[]) => void;
}

export default function SectionManager({ enabledSections, disabledSections, onChange }: Props) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const dragZone = useRef<'enabled' | null>(null);

  const handleDragStart = (id: string) => { setDragging(id); dragZone.current = 'enabled'; };
  const handleDragEnd = () => { setDragging(null); setDragOver(null); dragZone.current = null; };
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (id !== dragging) setDragOver(id); };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragging || dragging === targetId) { handleDragEnd(); return; }
    const arr = [...enabledSections];
    const fromIdx = arr.findIndex(s => s.id === dragging);
    const toIdx = arr.findIndex(s => s.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { handleDragEnd(); return; }
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    onChange(arr.map((s, i) => ({ ...s, order: i })), disabledSections);
    handleDragEnd();
  };

  const moveUp = (id: string) => {
    const arr = [...enabledSections];
    const idx = arr.findIndex(s => s.id === id);
    if (idx <= 0) return;
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr.map((s, i) => ({ ...s, order: i })), disabledSections);
  };

  const moveDown = (id: string) => {
    const arr = [...enabledSections];
    const idx = arr.findIndex(s => s.id === id);
    if (idx === -1 || idx >= arr.length - 1) return;
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange(arr.map((s, i) => ({ ...s, order: i })), disabledSections);
  };

  const toggleSection = (section: LayoutSection, fromEnabled: boolean) => {
    if (fromEnabled) {
      const newEnabled = enabledSections.filter(s => s.id !== section.id).map((s, i) => ({ ...s, order: i }));
      const newDisabled = [...disabledSections, { ...section, order: disabledSections.length }];
      onChange(newEnabled, newDisabled);
    } else {
      const newDisabled = disabledSections.filter(s => s.id !== section.id).map((s, i) => ({ ...s, order: i }));
      const newEnabled = [...enabledSections, { ...section, order: enabledSections.length }];
      onChange(newEnabled, newDisabled);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Enabled */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-800">Enabled Sections</p>
              <p className="text-xs text-stone-400 mt-0.5">{enabledSections.length} active · drag to reorder</p>
            </div>
            <i className="ri-drag-move-2-line text-stone-300 text-lg" />
          </div>
          <div className="divide-y divide-stone-100 min-h-[60px]">
            {enabledSections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <i className="ri-inbox-line text-2xl text-stone-200 mb-1" />
                <p className="text-xs text-stone-400">No enabled sections</p>
              </div>
            ) : (
              enabledSections.map((section, idx) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(section.id)}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDrop={(e) => handleDrop(e, section.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-all select-none cursor-grab active:cursor-grabbing
                    ${dragging === section.id ? 'opacity-40 bg-[#f5f5f5]' : 'hover:bg-[#f5f5f5]/60'}
                    ${dragOver === section.id ? 'border-t-2 border-[#1B4332]' : ''}`}
                >
                  <i className="ri-drag-move-2-line text-stone-300 text-sm shrink-0" />
                  <div className="w-5 h-5 flex items-center justify-center bg-[#1B4332]/10 text-[#1B4332] rounded-full text-[10px] font-bold shrink-0">{idx + 1}</div>
                  <div className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/8 rounded-lg shrink-0">
                    <i className={`${section.icon} text-[#1B4332] text-sm`} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-stone-800 truncate">{section.label}</span>
                  <div className="flex flex-col gap-0 shrink-0">
                    <button onClick={() => moveUp(section.id)} disabled={idx === 0} className="w-4 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer">
                      <i className="ri-arrow-up-s-line text-xs" />
                    </button>
                    <button onClick={() => moveDown(section.id)} disabled={idx === enabledSections.length - 1} className="w-4 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer">
                      <i className="ri-arrow-down-s-line text-xs" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleSection(section, true)}
                    className="relative w-9 h-5 rounded-full bg-[#1B4332] transition-colors cursor-pointer shrink-0"
                  >
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Disabled */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <p className="text-sm font-semibold text-stone-800">Disabled Sections</p>
            <p className="text-xs text-stone-400 mt-0.5">{disabledSections.length} hidden · toggle to enable</p>
          </div>
          <div className="divide-y divide-stone-100 min-h-[60px]">
            {disabledSections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <i className="ri-checkbox-circle-line text-2xl text-stone-200 mb-1" />
                <p className="text-xs text-stone-400">All sections enabled</p>
              </div>
            ) : (
              disabledSections.map((section) => (
                <div key={section.id} className="flex items-center gap-3 px-4 py-3.5 bg-[#f5f5f5]/40 hover:bg-[#f5f5f5] transition-colors">
                  <div className="w-4 shrink-0" />
                  <div className="w-5 h-5 flex items-center justify-center bg-stone-100 rounded-full shrink-0">
                    <i className="ri-eye-off-line text-stone-400 text-[10px]" />
                  </div>
                  <div className="w-7 h-7 flex items-center justify-center bg-stone-100 rounded-lg shrink-0">
                    <i className={`${section.icon} text-stone-400 text-sm`} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-stone-400 truncate">{section.label}</span>
                  <button
                    onClick={() => toggleSection(section, false)}
                    className="relative w-9 h-5 rounded-full bg-stone-200 transition-colors cursor-pointer shrink-0"
                  >
                    <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-[#1B4332]/5 border border-[#1B4332]/10 rounded-xl">
        <i className="ri-information-line text-[#1B4332] text-base mt-0.5 shrink-0" />
        <p className="text-sm text-stone-600">
          <span className="font-medium text-stone-700">How this works — </span>
          The frontend property detail page reads this saved order on every load. Enabled sections appear in order. Changes take effect immediately after saving — no redeploy required.
        </p>
      </div>
    </div>
  );
}
