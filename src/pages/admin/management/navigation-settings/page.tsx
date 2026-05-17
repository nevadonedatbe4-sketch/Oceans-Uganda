import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import SectionHeader from '../components/SectionHeader';
import SaveBar from '../components/SaveBar';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  openInNewTab: boolean;
}

interface NavSettings {
  logo_url: string;
  logo_redirect_url: string;
  phone_number: string;
  show_phone: boolean;
  show_cta: boolean;
  cta_label: string;
  cta_link: string;
  sticky: boolean;
  transparent_hero: boolean;
  menu_items: MenuItem[];
}

const DEFAULT_MENU: MenuItem[] = [
  { id: '1', label: 'Buy', href: '/buy', visible: true, openInNewTab: false },
  { id: '2', label: 'Rent', href: '/rent', visible: true, openInNewTab: false },
  { id: '3', label: 'Properties', href: '/all-properties', visible: true, openInNewTab: false },
  { id: '4', label: 'Landlords', href: '/landlords', visible: true, openInNewTab: false },
  { id: '5', label: 'Neighbourhoods', href: '/neighbourhoods', visible: true, openInNewTab: false },
  { id: '6', label: 'About Us', href: '/about', visible: false, openInNewTab: false },
  { id: '7', label: 'Contact', href: '/contact', visible: true, openInNewTab: false },
];

const DEFAULT_SETTINGS: NavSettings = {
  logo_url: '',
  logo_redirect_url: '/',
  phone_number: '+256 741 573 131',
  show_phone: true,
  show_cta: true,
  cta_label: 'Get Valuation',
  cta_link: '/landlords',
  sticky: true,
  transparent_hero: true,
  menu_items: DEFAULT_MENU,
};

function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-stone-50 last:border-0">
      <div>
        <p className="text-sm text-stone-700 font-medium">{label}</p>
        {hint && <p className="text-[11px] text-stone-400 mt-0.5">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 shrink-0 transition-colors cursor-pointer ${checked ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
        style={{ borderRadius: '10px' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white transition-transform"
          style={{ borderRadius: '8px', transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
}

export default function NavigationSettingsPage() {
  const [settings, setSettings] = useState<NavSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemHref, setNewItemHref] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('component_settings')
      .select('settings_json')
      .eq('component_type', 'navbar')
      .eq('variant', 'navigation')
      .maybeSingle();

    if (data?.settings_json) {
      const s = data.settings_json as Record<string, unknown>;
      setSettings({
        logo_url: String(s.logo_url ?? ''),
        logo_redirect_url: String(s.logo_redirect_url ?? '/'),
        phone_number: String(s.phone_number ?? '+256 741 573 131'),
        show_phone: Boolean(s.show_phone ?? true),
        show_cta: Boolean(s.show_cta ?? true),
        cta_label: String(s.cta_label ?? 'Get Valuation'),
        cta_link: String(s.cta_link ?? '/landlords'),
        sticky: Boolean(s.sticky ?? true),
        transparent_hero: Boolean(s.transparent_hero ?? true),
        menu_items: (s.menu_items as MenuItem[]) || DEFAULT_MENU,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (partial: Partial<NavSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    setDirty(true);
  };

  const updateMenuItem = (id: string, partial: Partial<MenuItem>) => {
    set({
      menu_items: settings.menu_items.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      ),
    });
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const items = [...settings.menu_items];
    const idx = items.findIndex((i) => i.id === id);
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= items.length) return;
    [items[idx], items[target]] = [items[target], items[idx]];
    set({ menu_items: items });
  };

  const removeItem = (id: string) => {
    set({ menu_items: settings.menu_items.filter((i) => i.id !== id) });
  };

  const addItem = () => {
    if (!newItemLabel.trim() || !newItemHref.trim()) return;
    const newItem: MenuItem = {
      id: Date.now().toString(),
      label: newItemLabel.trim(),
      href: newItemHref.trim(),
      visible: true,
      openInNewTab: false,
    };
    set({ menu_items: [...settings.menu_items, newItem] });
    setNewItemLabel('');
    setNewItemHref('');
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('component_settings')
      .upsert(
        { component_type: 'navbar', variant: 'navigation', settings_json: settings as unknown as Record<string, unknown>, updated_at: new Date().toISOString() },
        { onConflict: 'component_type,variant' }
      );
    setSaving(false);
    setSaveStatus(error ? 'error' : 'success');
    if (!error) setDirty(false);
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleReset = () => { load(); setDirty(false); };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[820px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-navigation-line"
        title="Navigation Settings"
        description="Manage the navbar logo, menu links, CTA button and behaviour. Changes here control the site-wide navigation."
      />

      {/* ── Logo & Identity ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-image-edit-line text-[#1B4332] text-sm" />
          </div>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Logo &amp; Identity</h3>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">Logo Image URL</label>
            <input
              type="text"
              value={settings.logo_url}
              onChange={(e) => set({ logo_url: e.target.value })}
              placeholder="https://... (leave blank to use text logo)"
              className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
            />
            <p className="text-[11px] text-stone-400">Upload your logo to Supabase Storage and paste the URL here.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">Logo Click Destination</label>
            <input
              type="text"
              value={settings.logo_redirect_url}
              onChange={(e) => set({ logo_redirect_url: e.target.value })}
              placeholder="/"
              className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Behaviour ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-settings-3-line text-[#1B4332] text-sm" />
          </div>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Behaviour</h3>
        </div>
        <Toggle label="Sticky Navbar" checked={settings.sticky} onChange={(v) => set({ sticky: v })} hint="Keep navbar fixed at top when scrolling." />
        <Toggle label="Transparent on Hero" checked={settings.transparent_hero} onChange={(v) => set({ transparent_hero: v })} hint="Start transparent over hero images, become solid on scroll." />
        <Toggle label="Show Phone Number" checked={settings.show_phone} onChange={(v) => set({ show_phone: v })} />
        {settings.show_phone && (
          <div className="mt-3 space-y-1.5">
            <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">Phone Number</label>
            <input
              type="text"
              value={settings.phone_number}
              onChange={(e) => set({ phone_number: e.target.value })}
              placeholder="+256 741 573 131"
              className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
            />
          </div>
        )}
      </div>

      {/* ── CTA Button ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-cursor-line text-[#1B4332] text-sm" />
          </div>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">CTA Button</h3>
        </div>
        <Toggle label="Show CTA Button in Navbar" checked={settings.show_cta} onChange={(v) => set({ show_cta: v })} />
        {settings.show_cta && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">Button Label</label>
              <input
                type="text"
                value={settings.cta_label}
                onChange={(e) => set({ cta_label: e.target.value })}
                placeholder="Get Valuation"
                className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500 uppercase tracking-widest">Button Link</label>
              <input
                type="text"
                value={settings.cta_link}
                onChange={(e) => set({ cta_link: e.target.value })}
                placeholder="/landlords"
                className="w-full border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Menu Items ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-menu-line text-[#1B4332] text-sm" />
            </div>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Menu Items</h3>
          </div>
          <span className="text-xs text-stone-400">{settings.menu_items.filter((i) => i.visible).length} visible</span>
        </div>

        <div className="space-y-2 mb-5">
          {settings.menu_items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                item.visible ? 'border-stone-200 bg-white' : 'border-stone-100 bg-[#f5f5f5] opacity-60'
              }`}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => moveItem(item.id, 'up')} disabled={index === 0} className={`w-5 h-5 flex items-center justify-center cursor-pointer ${index === 0 ? 'text-stone-200' : 'text-stone-400 hover:text-stone-700'}`}>
                  <i className="ri-arrow-up-s-line text-xs" />
                </button>
                <button onClick={() => moveItem(item.id, 'down')} disabled={index === settings.menu_items.length - 1} className={`w-5 h-5 flex items-center justify-center cursor-pointer ${index === settings.menu_items.length - 1 ? 'text-stone-200' : 'text-stone-400 hover:text-stone-700'}`}>
                  <i className="ri-arrow-down-s-line text-xs" />
                </button>
              </div>

              {/* Label */}
              {editingItem === item.id ? (
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateMenuItem(item.id, { label: e.target.value })}
                  onBlur={() => setEditingItem(null)}
                  autoFocus
                  className="flex-1 border border-[#1B4332] px-2 py-1 text-sm font-roboto text-stone-700 focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => setEditingItem(item.id)}
                  className="flex-1 text-left text-sm font-medium text-stone-700 hover:text-[#1B4332] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}

              {/* Href */}
              <span className="text-xs font-mono text-stone-400 hidden sm:block">{item.href}</span>

              {/* Visibility */}
              <button
                onClick={() => updateMenuItem(item.id, { visible: !item.visible })}
                className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${item.visible ? 'text-[#1B4332]' : 'text-stone-300'}`}
                title={item.visible ? 'Hide from nav' : 'Show in nav'}
              >
                <i className={item.visible ? 'ri-eye-line text-sm' : 'ri-eye-off-line text-sm'} />
              </button>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 flex items-center justify-center text-stone-300 hover:text-red-400 transition-colors cursor-pointer"
                title="Remove item"
              >
                <i className="ri-delete-bin-line text-sm" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new item */}
        <div className="pt-4 border-t border-stone-100">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">Add Menu Item</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder="Label (e.g. About Us)"
              className="flex-1 border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
            />
            <input
              type="text"
              value={newItemHref}
              onChange={(e) => setNewItemHref(e.target.value)}
              placeholder="Link (e.g. /about)"
              className="flex-1 border border-stone-200 px-3 py-2 text-sm font-roboto text-stone-700 focus:outline-none focus:border-[#1B4332] transition-colors"
            />
            <button
              onClick={addItem}
              disabled={!newItemLabel.trim() || !newItemHref.trim()}
              className="px-4 py-2 bg-[#1B4332] text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1B4332]/90"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* ── Preview ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-eye-line text-[#1B4332] text-sm" />
          </div>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Nav Preview</h3>
        </div>
        <div className="bg-[#001731] px-6 py-3 flex items-center gap-6 overflow-x-auto">
          <span className="text-white font-prata text-sm whitespace-nowrap">Oceans</span>
          <div className="flex items-center gap-5 flex-1">
            {settings.menu_items.filter((i) => i.visible).map((item) => (
              <span key={item.id} className="text-white/80 text-xs font-roboto whitespace-nowrap hover:text-white cursor-pointer">
                {item.label}
              </span>
            ))}
          </div>
          {settings.show_phone && (
            <span className="text-white/60 text-xs font-roboto whitespace-nowrap">{settings.phone_number}</span>
          )}
          {settings.show_cta && (
            <span className="px-3 py-1.5 bg-white/10 text-white text-xs font-roboto whitespace-nowrap border border-white/20">
              {settings.cta_label}
            </span>
          )}
        </div>
        <p className="text-[11px] text-stone-400 mt-2">Preview of visible nav items. Save to apply changes to the live site.</p>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={handleSave} onReset={handleReset} />
    </div>
  );
}
