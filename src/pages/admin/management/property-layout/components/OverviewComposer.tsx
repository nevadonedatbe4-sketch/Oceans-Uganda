import { useState } from 'react';
import type { OverviewField, OverviewSettings } from '@/hooks/usePropertyLayout';

interface Props {
  settings: OverviewSettings;
  onChange: (s: OverviewSettings) => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${value ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function FieldRow({
  field, idx, total, onMoveUp, onMoveDown, onToggle, enabled,
}: {
  field: OverviewField; idx: number; total: number;
  onMoveUp: () => void; onMoveDown: () => void; onToggle: () => void; enabled: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-colors ${enabled ? 'hover:bg-[#f5f5f5]/60' : 'bg-[#f5f5f5]/40 hover:bg-[#f5f5f5]'}`}>
      {enabled && (
        <div className="flex flex-col gap-0 shrink-0">
          <button onClick={onMoveUp} disabled={idx === 0} className="w-4 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer">
            <i className="ri-arrow-up-s-line text-xs" />
          </button>
          <button onClick={onMoveDown} disabled={idx === total - 1} className="w-4 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer">
            <i className="ri-arrow-down-s-line text-xs" />
          </button>
        </div>
      )}
      {!enabled && <div className="w-4 h-8 shrink-0" />}
      <div className={`w-7 h-7 flex items-center justify-center rounded-lg shrink-0 ${enabled ? 'bg-[#1B4332]/8' : 'bg-stone-100'}`}>
        <i className={`${field.icon} text-sm ${enabled ? 'text-[#1B4332]' : 'text-stone-400'}`} />
      </div>
      <span className={`flex-1 text-sm font-medium ${enabled ? 'text-stone-800' : 'text-stone-400'}`}>{field.label}</span>
      <Toggle value={enabled} onChange={onToggle} />
    </div>
  );
}

export default function OverviewComposer({ settings, onChange }: Props) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragging(id);
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (id !== dragging) setDragOver(id); };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragging || dragging === targetId) { handleDragEnd(); return; }
    const arr = [...settings.enabled_fields];
    const fromIdx = arr.findIndex(f => f.id === dragging);
    const toIdx = arr.findIndex(f => f.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { handleDragEnd(); return; }
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    onChange({ ...settings, enabled_fields: arr.map((f, i) => ({ ...f, order: i })) });
    handleDragEnd();
  };

  const moveField = (id: string, dir: -1 | 1) => {
    const arr = [...settings.enabled_fields];
    const idx = arr.findIndex(f => f.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    onChange({ ...settings, enabled_fields: arr.map((f, i) => ({ ...f, order: i })) });
  };

  const toggleField = (field: OverviewField, fromEnabled: boolean) => {
    if (fromEnabled) {
      const newEnabled = settings.enabled_fields.filter(f => f.id !== field.id).map((f, i) => ({ ...f, order: i }));
      const newDisabled = [...settings.disabled_fields, { ...field, order: settings.disabled_fields.length }];
      onChange({ ...settings, enabled_fields: newEnabled, disabled_fields: newDisabled });
    } else {
      const newDisabled = settings.disabled_fields.filter(f => f.id !== field.id).map((f, i) => ({ ...f, order: i }));
      const newEnabled = [...settings.enabled_fields, { ...field, order: settings.enabled_fields.length }];
      onChange({ ...settings, enabled_fields: newEnabled, disabled_fields: newDisabled });
    }
  };

  const COLUMN_OPTIONS = [
    { value: 2, label: '2 Columns' },
    { value: 3, label: '3 Columns' },
    { value: 4, label: '4 Columns' },
    { value: 5, label: '5 Columns' },
  ];

  return (
    <div className="space-y-5">
      {/* Property ID toggle */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-800">Show Property ID in Section Header</p>
            <p className="text-xs text-stone-400 mt-0.5">Display the short property ID alongside the overview bar title</p>
          </div>
          <Toggle value={settings.show_property_id} onChange={v => onChange({ ...settings, show_property_id: v })} />
        </div>
      </div>

      {/* Columns in a row */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
        <p className="text-sm font-semibold text-stone-800">Overview Section Columns in a Row</p>
        <div className="grid grid-cols-4 gap-2">
          {COLUMN_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...settings, columns: opt.value })}
              className={`py-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap
                ${settings.columns === opt.value ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview V2 height */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
        <p className="text-sm font-semibold text-stone-800">Overview V2 Height</p>
        <p className="text-xs text-stone-400">Used when Overview V2 section is enabled</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={settings.v2_height}
            onChange={e => onChange({ ...settings, v2_height: parseInt(e.target.value, 10) || 180 })}
            className="w-32 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
            min={80}
            max={400}
          />
          <span className="text-sm text-stone-400">pixels</span>
        </div>
      </div>

      {/* Overview Data Composer */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-stone-800">Overview Data Composer</p>
            <p className="text-xs text-stone-400 mt-0.5">Drag to reorder · toggle to show/hide each field</p>
          </div>
          <i className="ri-drag-move-2-line text-stone-300 text-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-stone-100">
          {/* Enabled fields */}
          <div>
            <div className="px-4 py-2.5 bg-[#f5f5f5] border-b border-stone-100">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Enabled — {settings.enabled_fields.length} fields</p>
            </div>
            <div className="divide-y divide-stone-100 min-h-[40px]">
              {settings.enabled_fields.map((field, idx) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(field.id)}
                  onDragOver={(e) => handleDragOver(e, field.id)}
                  onDrop={(e) => handleDrop(e, field.id)}
                  onDragEnd={handleDragEnd}
                  className={`${dragging === field.id ? 'opacity-40' : ''} ${dragOver === field.id ? 'border-t-2 border-[#1B4332]' : ''} cursor-grab`}
                >
                  <FieldRow
                    field={field} idx={idx} total={settings.enabled_fields.length}
                    onMoveUp={() => moveField(field.id, -1)}
                    onMoveDown={() => moveField(field.id, 1)}
                    onToggle={() => toggleField(field, true)}
                    enabled
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Disabled fields */}
          <div>
            <div className="px-4 py-2.5 bg-[#f5f5f5] border-b border-stone-100">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Disabled — {settings.disabled_fields.length} fields</p>
            </div>
            <div className="divide-y divide-stone-100 min-h-[40px]">
              {settings.disabled_fields.map((field) => (
                <FieldRow
                  key={field.id}
                  field={field} idx={0} total={1}
                  onMoveUp={() => {}}
                  onMoveDown={() => {}}
                  onToggle={() => toggleField(field, false)}
                  enabled={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
