import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import SettingsGroup, { type SettingRow } from './components/SettingsGroup';

const GROUP_CONFIG: Record<string, { label: string; icon: string; order: number }> = {
  general: { label: 'General', icon: 'ri-global-line', order: 1 },
  contact: { label: 'Contact Details', icon: 'ri-contacts-line', order: 2 },
  social: { label: 'Social Media', icon: 'ri-share-line', order: 3 },
  seo: { label: 'SEO & Meta', icon: 'ri-search-line', order: 4 },
  currency: { label: 'Currency', icon: 'ri-coin-line', order: 5 },
  footer: { label: 'Footer', icon: 'ri-layout-bottom-line', order: 6 },
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .order('setting_group')
      .order('key');
    if (data) setSettings(data as SettingRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleUpdated = (updated: SettingRow) => {
    setSettings((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const grouped = settings.reduce<Record<string, SettingRow[]>>((acc, s) => {
    const g = s.setting_group || 'general';
    if (!acc[g]) acc[g] = [];
    acc[g].push(s);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    const orderA = GROUP_CONFIG[a]?.order ?? 99;
    const orderB = GROUP_CONFIG[b]?.order ?? 99;
    return orderA - orderB;
  });

  return (
    <div className="p-6 space-y-6 max-w-[800px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-jost font-bold text-stone-800">Site Settings</h1>
        <p className="text-sm text-stone-500 mt-1">
          Control all global settings — contact details, social links, SEO defaults, and more
        </p>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-lg px-4 py-3">
        <i className="ri-information-line text-[#1B4332] mt-0.5 shrink-0"></i>
        <p className="text-sm text-[#1B4332]/80">
          Settings saved here are stored in your Supabase database. Once the frontend is connected to live data 
          (Phase 7), these values will automatically appear on your public site — no code changes needed.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sortedGroups.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-lg">
          <i className="ri-settings-4-line text-4xl text-stone-300 block mb-3"></i>
          <h3 className="text-stone-600 font-medium">No settings found</h3>
          <p className="text-sm text-stone-400 mt-1">Make sure the site_settings table has been seeded</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedGroups.map(([group, rows]) => {
            const config = GROUP_CONFIG[group] ?? { label: group.charAt(0).toUpperCase() + group.slice(1), icon: 'ri-settings-3-line', order: 99 };
            return (
              <SettingsGroup
                key={group}
                group={group}
                label={config.label}
                icon={config.icon}
                settings={rows}
                onUpdated={handleUpdated}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
