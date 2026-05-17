import type { MediaTab, MediaTabsSettings } from '@/hooks/usePropertyLayout';

interface Props {
  settings: MediaTabsSettings;
  onChange: (s: MediaTabsSettings) => void;
}

export default function MediaTabsManager({ settings, onChange }: Props) {
  const moveUp = (id: string) => {
    const arr = [...settings.enabled];
    const idx = arr.findIndex(t => t.id === id);
    if (idx <= 0) return;
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange({ ...settings, enabled: arr.map((t, i) => ({ ...t, order: i })) });
  };

  const moveDown = (id: string) => {
    const arr = [...settings.enabled];
    const idx = arr.findIndex(t => t.id === id);
    if (idx === -1 || idx >= arr.length - 1) return;
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange({ ...settings, enabled: arr.map((t, i) => ({ ...t, order: i })) });
  };

  const toggleTab = (tab: MediaTab, fromEnabled: boolean) => {
    if (fromEnabled) {
      const newEnabled = settings.enabled.filter(t => t.id !== tab.id).map((t, i) => ({ ...t, order: i }));
      const newDisabled = [...settings.disabled, { ...tab, order: settings.disabled.length }];
      onChange({ enabled: newEnabled, disabled: newDisabled });
    } else {
      const newDisabled = settings.disabled.filter(t => t.id !== tab.id).map((t, i) => ({ ...t, order: i }));
      const newEnabled = [...settings.enabled, { ...tab, order: settings.enabled.length }];
      onChange({ enabled: newEnabled, disabled: newDisabled });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <i className="ri-information-line text-amber-600 text-base mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Media Tabs Manager</span> — Controls which tabs appear in the property banner (gallery, video, map, etc). The frontend renders only enabled tabs in saved order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Enabled tabs */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <p className="text-sm font-semibold text-stone-800">Enabled Tabs</p>
            <p className="text-xs text-stone-400 mt-0.5">{settings.enabled.length} visible · reorder with arrows</p>
          </div>
          <div className="divide-y divide-stone-100 min-h-[50px]">
            {settings.enabled.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">No enabled tabs</p>
            ) : (
              settings.enabled.map((tab, idx) => (
                <div key={tab.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#f5f5f5]/60 transition-colors">
                  <div className="w-7 h-7 flex items-center justify-center bg-[#1B4332]/8 rounded-lg shrink-0">
                    <i className={`${tab.icon} text-[#1B4332] text-sm`} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-stone-800">{tab.label}</span>
                  <div className="flex flex-col gap-0 shrink-0">
                    <button onClick={() => moveUp(tab.id)} disabled={idx === 0} className="w-4 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer">
                      <i className="ri-arrow-up-s-line text-xs" />
                    </button>
                    <button onClick={() => moveDown(tab.id)} disabled={idx === settings.enabled.length - 1} className="w-4 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer">
                      <i className="ri-arrow-down-s-line text-xs" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleTab(tab, true)}
                    className="relative w-9 h-5 rounded-full bg-[#1B4332] cursor-pointer shrink-0"
                  >
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Disabled tabs */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <p className="text-sm font-semibold text-stone-800">Disabled Tabs</p>
            <p className="text-xs text-stone-400 mt-0.5">{settings.disabled.length} hidden · toggle to enable</p>
          </div>
          <div className="divide-y divide-stone-100 min-h-[50px]">
            {settings.disabled.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">All tabs enabled</p>
            ) : (
              settings.disabled.map(tab => (
                <div key={tab.id} className="flex items-center gap-3 px-4 py-3.5 bg-[#f5f5f5]/40 hover:bg-[#f5f5f5] transition-colors">
                  <div className="w-7 h-7 flex items-center justify-center bg-stone-100 rounded-lg shrink-0">
                    <i className={`${tab.icon} text-stone-400 text-sm`} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-stone-400">{tab.label}</span>
                  <button
                    onClick={() => toggleTab(tab, false)}
                    className="relative w-9 h-5 rounded-full bg-stone-200 cursor-pointer shrink-0"
                  >
                    <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
