import { useState } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '@/lib/supabase';

export default function CacheManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading, reload } = useManagementSettings('cache');
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearCache = async () => {
    setClearing(true);
    const timestamp = new Date().toISOString();
    await supabase.from('site_settings').upsert(
      { key: 'cache_last_cleared', value: timestamp, setting_group: 'cache' },
      { onConflict: 'key' }
    );
    await reload();
    setClearing(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  const lastCleared = get('cache_last_cleared');

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
        icon="ri-database-2-line"
        title="Save / Sync / Cache Controls"
        description="Manage caching behaviour, auto-publish rules, and data sync options."
      />

      {/* Clear Cache */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Cache Controls</h3>
        <div className="flex items-center justify-between gap-4 bg-[#f5f5f5] rounded-lg p-4">
          <div>
            <p className="text-sm font-medium text-stone-700">Clear Site Cache</p>
            <p className="text-xs text-stone-400 mt-0.5">
              Forces fresh data to be loaded on the next page visit.
              {lastCleared && ` Last cleared: ${new Date(lastCleared).toLocaleString()}`}
            </p>
          </div>
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60 ${
              cleared ? 'bg-emerald-500 text-white' : 'bg-[#1B4332] text-white hover:bg-[#1B4332]/90'
            }`}
          >
            {clearing ? (
              <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Clearing…</>
            ) : cleared ? (
              <><i className="ri-checkbox-circle-line" />Cache Cleared!</>
            ) : (
              <><i className="ri-refresh-line" />Clear Cache</>
            )}
          </button>
        </div>

        <SettingField
          label="Enable Listing Cache"
          type="toggle"
          value={get('cache_enable_listing_cache', 'true')}
          onChange={(v) => update('cache_enable_listing_cache', v)}
          hint="Cache listing data to reduce database reads. Recommended for production."
        />
        <SettingField
          label="Enable Settings Cache"
          type="toggle"
          value={get('cache_enable_settings_cache', 'true')}
          onChange={(v) => update('cache_enable_settings_cache', v)}
          hint="Cache site settings so they don&rsquo;t reload on every page request."
        />
        <SettingField
          label="Listings Cache TTL"
          type="number"
          value={get('cache_listings_ttl', '300')}
          onChange={(v) => update('cache_listings_ttl', v)}
          unit="seconds"
          min={30}
          max={3600}
          hint="How long listing data is cached before a fresh fetch. 300s = 5 minutes."
        />
      </div>

      {/* Auto-Publish & Sync */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Auto-Publish & Sync</h3>
        <SettingField
          label="Auto-publish Approved Listings"
          type="toggle"
          value={get('sync_auto_publish', 'true')}
          onChange={(v) => update('sync_auto_publish', v)}
          hint="When ON, approved listings go live immediately. When OFF, require a manual publish step."
        />
        <SettingField
          label="Auto-delete Draft Listings After"
          type="number"
          value={get('sync_draft_expiry_days', '30')}
          onChange={(v) => update('sync_draft_expiry_days', v)}
          unit="days"
          min={0}
          hint="Set to 0 to never auto-delete drafts. Recommended: 30–90 days."
        />
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Data Export</h3>
        <p className="text-sm text-stone-500">Export a full snapshot of your site settings for backup or migration.</p>
        <button
          onClick={async () => {
            const { data } = await supabase.from('site_settings').select('*').order('setting_group').order('key');
            if (!data) return;
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `oceans-settings-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
          }}
          className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-sm text-stone-700 rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-download-2-line" />
          Export All Settings (JSON)
        </button>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
