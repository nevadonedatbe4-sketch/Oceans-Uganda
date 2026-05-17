import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface SettingRow {
  id: string;
  key: string;
  value: string | null;
  label: string | null;
  setting_group: string;
}

interface Props {
  group: string;
  label: string;
  icon: string;
  settings: SettingRow[];
  onUpdated: (updated: SettingRow) => void;
}

export default function SettingsGroup({ group, label, icon, settings, onUpdated }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    settings.forEach((s) => { init[s.id] = s.value ?? ''; });
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleSaveGroup = async () => {
    setSaving(true);
    const updates = settings.map((s) =>
      supabase.from('site_settings').update({ value: drafts[s.id] || null }).eq('id', s.id)
    );
    await Promise.all(updates);
    settings.forEach((s) => onUpdated({ ...s, value: drafts[s.id] || null }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isTextarea = (key: string) =>
    ['footer_text', 'about_text', 'copyright_text', 'tagline'].includes(key);

  const isUrl = (key: string) =>
    key.includes('url') || key.includes('link') || key.includes('logo') ||
    key.includes('favicon') || key.startsWith('instagram') || key.startsWith('facebook') ||
    key.startsWith('linkedin') || key.startsWith('twitter') || key.startsWith('whatsapp');

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      {/* Group header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f5f5f5] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#1B4332]/10 rounded-md">
            <i className={`${icon} text-[#1B4332] text-sm`}></i>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-stone-800">{label}</p>
            <p className="text-xs text-stone-400">{settings.length} settings</p>
          </div>
        </div>
        <i className={`${expanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} text-stone-400 text-lg`}></i>
      </button>

      {/* Settings fields */}
      {expanded && (
        <div className="border-t border-stone-100 px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settings.map((s) => (
              <div key={s.id} className={isTextarea(s.key) ? 'sm:col-span-2' : ''}>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  {s.label ?? s.key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                {isTextarea(s.key) ? (
                  <textarea
                    rows={3}
                    value={drafts[s.id] ?? ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [s.id]: e.target.value }))}
                    className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none"
                  />
                ) : (
                  <input
                    type={isUrl(s.key) ? 'url' : s.key.includes('email') ? 'email' : s.key.includes('phone') || s.key.includes('whatsapp') ? 'tel' : 'text'}
                    value={drafts[s.id] ?? ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [s.id]: e.target.value }))}
                    placeholder={isUrl(s.key) ? 'https://…' : ''}
                    className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                  />
                )}
                <p className="text-xs text-stone-300 mt-0.5 font-mono">{s.key}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-stone-100">
            {saved ? (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <i className="ri-check-line"></i> {label} saved
              </span>
            ) : <span></span>}
            <button
              onClick={handleSaveGroup}
              disabled={saving}
              className="px-5 py-2 bg-[#1B4332] text-white rounded-md text-sm font-semibold hover:bg-[#163828] disabled:opacity-60 cursor-pointer whitespace-nowrap"
            >
              {saving ? 'Saving…' : `Save ${label}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
