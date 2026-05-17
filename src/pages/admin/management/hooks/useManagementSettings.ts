import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { triggerGlobalSettingsReload } from '@/contexts/SiteSettingsContext';

export interface SettingRow {
  id: string;
  key: string;
  value: string;
  label: string;
  setting_group: string;
  updated_at?: string;
}

export function useManagementSettings(group: string) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<SettingRow[]>([]);
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('setting_group', group)
      .order('key');
    if (data) {
      setRows(data as SettingRow[]);
      const map: Record<string, string> = {};
      (data as SettingRow[]).forEach((r) => { map[r.key] = r.value ?? ''; });
      setSettings(map);
      setSaved(map);
    }
    setLoading(false);
  }, [group]);

  useEffect(() => { load(); }, [load]);

  const update = useCallback((key: string, value: string) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      setDirty(true);
      return next;
    });
  }, []);

  const save = useCallback(async () => {
    setSaving(true);

    const upsertPayload = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      setting_group: group,
    }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(upsertPayload, { onConflict: 'key' });

    setSaving(false);
    if (!error) {
      setSaved({ ...settings });
      setDirty(false);
      setSaveStatus('success');
      // Reload global settings so Navbar, Footer, Sidebar reflect changes immediately
      triggerGlobalSettingsReload();
    } else {
      setSaveStatus('error');
    }
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setSaveStatus('idle'), 3000);
  }, [settings, group]);

  const reset = useCallback(() => {
    setSettings({ ...saved });
    setDirty(false);
  }, [saved]);

  const get = useCallback((key: string, fallback = '') => settings[key] ?? fallback, [settings]);

  return { settings, rows, loading, saving, dirty, saveStatus, update, save, reset, get, reload: load };
}
