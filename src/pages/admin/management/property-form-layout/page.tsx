import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { FormModule } from '@/hooks/usePropertyFormLayout';

const DEFAULT_MODULES: FormModule[] = [
  { id: '', module_key: 'description_price', label: 'Description & Price', description: 'Property title, type, purpose, listing status, price, currency and frequency', icon: 'ri-file-info-line', enabled: true, sort_order: 1 },
  { id: '', module_key: 'property_details', label: 'Property Details', description: 'Bedrooms, bathrooms, parking, sizes, property ID, featured toggle and labels', icon: 'ri-home-4-line', enabled: true, sort_order: 2 },
  { id: '', module_key: 'features', label: 'Features & Amenities', description: 'Amenities, indoor/outdoor features, full description and custom features', icon: 'ri-list-check', enabled: true, sort_order: 3 },
  { id: '', module_key: 'media', label: 'Media & Photos', description: 'Cover image, photo gallery, floor plans and virtual tour', icon: 'ri-image-2-line', enabled: true, sort_order: 4 },
  { id: '', module_key: 'location', label: 'Location', description: 'Country, city, area, neighborhood, address, coordinates and map', icon: 'ri-map-pin-2-line', enabled: true, sort_order: 5 },
  { id: '', module_key: 'agent_publish', label: 'Agent & Publish', description: 'Agent assignment, listing status, SEO settings and publish actions', icon: 'ri-check-double-line', enabled: true, sort_order: 6 },
];

export default function PropertyFormLayoutPage() {
  const [modules, setModules] = useState<FormModule[]>(DEFAULT_MODULES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dirty, setDirty] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('property_form_layout')
      .select('*')
      .order('sort_order');
    if (!error && data && data.length > 0) {
      setModules(data as FormModule[]);
    } else {
      setModules(DEFAULT_MODULES);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleEnabled = (key: string) => {
    setModules((prev) =>
      prev.map((m) => m.module_key === key ? { ...m, enabled: !m.enabled } : m)
    );
    setDirty(true);
  };

  const handleDragStart = (key: string) => setDragging(key);
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    if (key !== dragging) setDragOver(key);
  };

  const handleDrop = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    if (!dragging || dragging === targetKey) { setDragging(null); setDragOver(null); return; }
    setModules((prev) => {
      const arr = [...prev];
      const fromIdx = arr.findIndex((m) => m.module_key === dragging);
      const toIdx = arr.findIndex((m) => m.module_key === targetKey);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr.map((m, i) => ({ ...m, sort_order: i + 1 }));
    });
    setDirty(true);
    setDragging(null);
    setDragOver(null);
  };

  const moveUp = (key: string) => {
    setModules((prev) => {
      const arr = [...prev];
      const idx = arr.findIndex((m) => m.module_key === key);
      if (idx <= 0) return prev;
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr.map((m, i) => ({ ...m, sort_order: i + 1 }));
    });
    setDirty(true);
  };

  const moveDown = (key: string) => {
    setModules((prev) => {
      const arr = [...prev];
      const idx = arr.findIndex((m) => m.module_key === key);
      if (idx === -1 || idx >= arr.length - 1) return prev;
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.map((m, i) => ({ ...m, sort_order: i + 1 }));
    });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    const payload = modules.map((m, i) => ({
      module_key: m.module_key,
      label: m.label,
      description: m.description,
      icon: m.icon,
      enabled: m.enabled,
      sort_order: i + 1,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase
      .from('property_form_layout')
      .upsert(payload, { onConflict: 'module_key' });
    setSaving(false);
    if (!error) { setSaveStatus('success'); setDirty(false); await load(); }
    else { setSaveStatus('error'); }
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const enabledModules = modules.filter((m) => m.enabled).sort((a, b) => a.sort_order - b.sort_order);
  const disabledModules = modules.filter((m) => !m.enabled);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-stone-400">
          <i className="ri-loader-4-line animate-spin text-xl" />
          <span className="text-sm">Loading layout configuration…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-stone-800">Add New Property Form Layout Manager</h2>
          <p className="text-sm text-stone-500 mt-1">
            Drag-and-drop each module to quickly organize your property submission form layout
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-6">
          {saveStatus === 'success' && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <i className="ri-checkbox-circle-line" /> Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
              <i className="ri-error-warning-line" /> Save failed
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] text-white text-sm font-medium rounded-lg hover:bg-[#163828] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {saving ? <><i className="ri-loader-4-line animate-spin" /> Saving…</> : <><i className="ri-save-line" /> Save Layout</>}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT — Enabled Modules */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-800">Enabled modules</p>
                <p className="text-xs text-stone-400 mt-0.5">{enabledModules.length} active · drag to reorder</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-stone-400">
                <i className="ri-drag-move-2-line text-sm" />
                Drag to reorder
              </span>
            </div>
          </div>

          <div className="divide-y divide-stone-100 min-h-[80px]">
            {enabledModules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                <i className="ri-inbox-line text-3xl text-stone-200 mb-2" />
                <p className="text-sm text-stone-400">No enabled modules</p>
                <p className="text-xs text-stone-300 mt-0.5">Enable modules from the right panel</p>
              </div>
            ) : (
              enabledModules.map((module, index) => (
                <div
                  key={module.module_key}
                  draggable
                  onDragStart={() => handleDragStart(module.module_key)}
                  onDragOver={(e) => handleDragOver(e, module.module_key)}
                  onDrop={(e) => handleDrop(e, module.module_key)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-all cursor-grab active:cursor-grabbing select-none ${
                    dragging === module.module_key ? 'opacity-40 bg-[#f5f5f5]' : 'bg-white hover:bg-[#f5f5f5]/60'
                  } ${dragOver === module.module_key ? 'border-t-2 border-[#1B4332]' : ''}`}
                >
                  {/* Drag handle */}
                  <div className="w-4 h-4 flex items-center justify-center text-stone-300 shrink-0">
                    <i className="ri-drag-move-2-line text-base" />
                  </div>

                  {/* Step number */}
                  <div className="w-6 h-6 flex items-center justify-center bg-[#1B4332]/10 text-[#1B4332] rounded-full text-[11px] font-bold shrink-0">
                    {index + 1}
                  </div>

                  {/* Module icon */}
                  <div className="w-8 h-8 flex items-center justify-center bg-[#1B4332]/8 rounded-lg shrink-0">
                    <i className={`${module.icon} text-[#1B4332] text-sm`} />
                  </div>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 leading-tight">{module.label}</p>
                    <p className="text-xs text-stone-400 truncate mt-0.5">{module.description}</p>
                  </div>

                  {/* Up/down arrows */}
                  <div className="flex flex-col gap-0 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveUp(module.module_key)}
                      disabled={index === 0}
                      className="w-5 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <i className="ri-arrow-up-s-line text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(module.module_key)}
                      disabled={index === enabledModules.length - 1}
                      className="w-5 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <i className="ri-arrow-down-s-line text-sm" />
                    </button>
                  </div>

                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleEnabled(module.module_key)}
                    className="relative w-9 h-5 rounded-full bg-[#1B4332] transition-colors cursor-pointer shrink-0"
                    title="Disable module"
                  >
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT — Disabled Modules */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <div>
              <p className="text-sm font-semibold text-stone-800">Disabled modules</p>
              <p className="text-xs text-stone-400 mt-0.5">{disabledModules.length} hidden · toggle to enable</p>
            </div>
          </div>

          <div className="divide-y divide-stone-100 min-h-[80px]">
            {disabledModules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                <i className="ri-checkbox-circle-line text-3xl text-stone-200 mb-2" />
                <p className="text-sm text-stone-400">All modules are enabled</p>
              </div>
            ) : (
              disabledModules.map((module) => (
                <div
                  key={module.module_key}
                  className="flex items-center gap-3 px-4 py-3.5 bg-[#f5f5f5]/40 hover:bg-[#f5f5f5] transition-colors"
                >
                  {/* Spacer for drag handle */}
                  <div className="w-4 h-4 shrink-0" />

                  {/* Hidden indicator */}
                  <div className="w-6 h-6 flex items-center justify-center bg-stone-100 rounded-full shrink-0">
                    <i className="ri-eye-off-line text-stone-400 text-[11px]" />
                  </div>

                  {/* Module icon */}
                  <div className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-lg shrink-0">
                    <i className={`${module.icon} text-stone-400 text-sm`} />
                  </div>

                  {/* Label + description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-400 leading-tight">{module.label}</p>
                    <p className="text-xs text-stone-300 truncate mt-0.5">{module.description}</p>
                  </div>

                  {/* Toggle off */}
                  <button
                    type="button"
                    onClick={() => toggleEnabled(module.module_key)}
                    className="relative w-9 h-5 rounded-full bg-stone-200 transition-colors cursor-pointer shrink-0"
                    title="Enable module"
                  >
                    <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 bg-[#1B4332]/5 border border-[#1B4332]/10 rounded-xl">
        <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
          <i className="ri-information-line text-[#1B4332] text-base" />
        </div>
        <p className="text-sm text-stone-600">
          <span className="font-medium text-stone-700">How this works — </span>
          The Add Property multi-step form reads this saved configuration on every load. Each enabled module becomes one step in the wizard, in the exact order shown on the left. Changes take effect immediately after saving — no code edits required.
        </p>
      </div>
    </div>
  );
}
