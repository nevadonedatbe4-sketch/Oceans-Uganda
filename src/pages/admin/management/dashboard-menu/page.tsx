import { useState, useCallback } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

type Tab = 'style' | 'menu';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  roles: string[];
  customLabel?: string;
}

const ALL_ROLES = [
  { id: 'super_admin', label: 'Super Admin', color: 'bg-red-100 text-red-700' },
  { id: 'admin', label: 'Admin', color: 'bg-amber-100 text-amber-700' },
  { id: 'editor', label: 'Editor', color: 'bg-blue-100 text-blue-700' },
  { id: 'agent', label: 'Agent', color: 'bg-emerald-100 text-emerald-700' },
];

function ColorInput({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const displayColor = value?.startsWith('#') ? value : '#001731';
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-stone-700 block">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" value={displayColor} onChange={e => onChange(e.target.value)} className="w-9 h-9 rounded border border-stone-200 p-0.5 cursor-pointer shrink-0" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="#001731" className="flex-1 border border-stone-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-golden transition-colors" />
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

export default function DashboardMenuPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('dashboard_menu');
  const [tab, setTab] = useState<Tab>('menu');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const menuItems: MenuItem[] = useCallback((): MenuItem[] => {
    try {
      const parsed = JSON.parse(get('dash_menu_items', '[]'));
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }, [get])();

  const updateItems = (items: MenuItem[]) => {
    update('dash_menu_items', JSON.stringify(items));
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const arr = [...menuItems];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    updateItems(arr);
  };

  const toggleEnabled = (idx: number) => {
    const arr = menuItems.map((item, i) => i === idx ? { ...item, enabled: !item.enabled } : item);
    updateItems(arr);
  };

  const setCustomLabel = (idx: number, label: string) => {
    const arr = menuItems.map((item, i) => i === idx ? { ...item, customLabel: label } : item);
    updateItems(arr);
  };

  const toggleRole = (idx: number, role: string) => {
    const arr = menuItems.map((item, i) => {
      if (i !== idx) return item;
      const roles = item.roles.includes(role) ? item.roles.filter(r => r !== role) : [...item.roles, role];
      return { ...item, roles };
    });
    updateItems(arr);
  };

  const menuBg = get('dash_menu_bg', '#001731');

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-golden border-t-transparent rounded-full animate-spin" /></div>;

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'menu', label: 'Menu Items', icon: 'ri-list-settings-line' },
    { key: 'style', label: 'Visual Style', icon: 'ri-palette-line' },
  ];

  return (
    <div className="max-w-[720px] space-y-6 pb-24">
      <SectionHeader icon="ri-layout-left-2-line" title="Dashboard Menu" description="Control admin sidebar styling, reorder menu items, set custom labels, and manage role-based visibility." />

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${tab === t.key ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            <i className={`${t.icon} text-sm`} />{t.label}
          </button>
        ))}
      </div>

      {/* MENU ITEMS TAB */}
      {tab === 'menu' && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
            <i className="ri-information-line text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-primary/80">
              Reorder items with arrows · Toggle visibility · Set a custom label · Control which roles can see each item. Click an item to expand its options.
            </p>
          </div>

          {menuItems.map((item, idx) => (
            <div key={item.id} className={`rounded-xl border transition-colors ${item.enabled ? 'border-stone-200 bg-white' : 'border-stone-100 bg-[#f5f5f5]'}`}>
              {/* Row */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Move arrows */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="w-5 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer"><i className="ri-arrow-up-s-line text-xs" /></button>
                  <button onClick={() => moveItem(idx, 1)} disabled={idx === menuItems.length - 1} className="w-5 h-4 flex items-center justify-center text-stone-300 hover:text-stone-600 disabled:opacity-20 cursor-pointer"><i className="ri-arrow-down-s-line text-xs" /></button>
                </div>
                <i className="ri-drag-move-2-line text-stone-300 text-sm shrink-0" />
                {/* Icon */}
                <span className={`w-7 h-7 flex items-center justify-center rounded-md shrink-0 ${item.enabled ? 'bg-primary/10 text-primary' : 'bg-stone-200 text-stone-400'}`}>
                  <i className={`${item.icon} text-sm`} />
                </span>
                {/* Label */}
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium ${item.enabled ? 'text-stone-800' : 'text-stone-400'}`}>
                    {item.customLabel || item.label}
                  </span>
                  {item.customLabel && <span className="ml-2 text-xs text-stone-400">(was: {item.label})</span>}
                </div>
                {/* Role chips */}
                <div className="hidden sm:flex items-center gap-1">
                  {item.roles.slice(0, 2).map(r => {
                    const role = ALL_ROLES.find(ar => ar.id === r);
                    return role ? <span key={r} className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${role.color}`}>{role.label}</span> : null;
                  })}
                  {item.roles.length > 2 && <span className="text-xs text-stone-400">+{item.roles.length - 2}</span>}
                </div>
                {/* Enable toggle */}
                <button onClick={() => toggleEnabled(idx)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${item.enabled ? 'bg-[#1B4332]' : 'bg-stone-200'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${item.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                {/* Expand */}
                <button onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-700 cursor-pointer shrink-0 rounded-md hover:bg-stone-100">
                  <i className={`text-sm ${expandedItem === item.id ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                </button>
              </div>

              {/* Expanded panel */}
              {expandedItem === item.id && (
                <div className="px-4 pb-4 pt-0 space-y-4 border-t border-stone-100">
                  <div className="space-y-1.5 pt-3">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Custom Label</label>
                    <input
                      type="text"
                      value={item.customLabel || ''}
                      onChange={e => setCustomLabel(idx, e.target.value)}
                      placeholder={item.label}
                      className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
                    />
                    <p className="text-xs text-stone-400">Rename this menu item. Leave blank to use the default label.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Visible To Roles</label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_ROLES.map(role => {
                        const active = item.roles.includes(role.id);
                        return (
                          <button key={role.id} onClick={() => toggleRole(idx, role.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${active ? role.color : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}>
                            {active ? <><i className="ri-check-line mr-1" />{role.label}</> : role.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-stone-400">At least one role must be selected for the item to be visible to anyone.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* STYLE TAB */}
      {tab === 'style' && (
        <div className="space-y-6">
          {/* Sidebar preview */}
          <div className="rounded-xl overflow-hidden border border-stone-200">
            <div className="px-4 py-2 bg-[#f5f5f5] border-b border-stone-200"><p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Sidebar Preview</p></div>
            <div className="flex" style={{ background: menuBg, minHeight: '140px' }}>
              <div className="flex flex-col gap-1 p-3 w-full">
                {[{ icon: 'ri-dashboard-3-line', label: 'Dashboard' }, { icon: 'ri-building-2-line', label: 'Listings' }, { icon: 'ri-user-received-line', label: get('dash_menu_items', '[]').includes('"customLabel":"') ? 'Custom Label' : 'Leads' }].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-md ${i === 0 ? 'opacity-100' : 'opacity-60'}`} style={{ background: i === 0 ? `${get('dash_active_border_color', '#D5A91C')}20` : 'transparent' }}>
                    <i className={`${item.icon} text-sm`} style={{ color: i === 0 ? get('dash_active_border_color', '#D5A91C') : get('dash_menu_hover_color', '#fff') }} />
                    <span className="text-xs font-medium" style={{ color: i === 0 ? get('dash_active_border_color', '#D5A91C') : get('dash_menu_text_color', 'rgba(255,255,255,0.6)') }}>{item.label}</span>
                    {i === 0 && <span className="ml-auto w-1 h-3 rounded-full" style={{ background: get('dash_active_border_color', '#D5A91C') }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Colors</h3>
            <ColorInput label="Menu Background" value={get('dash_menu_bg', '#1B4332')} onChange={v => update('dash_menu_bg', v)} hint="Main background color of the admin sidebar." />
            <ColorInput label="Menu Tab Text Color" value={get('dash_menu_text_color', 'rgba(255,255,255,0.6)')} onChange={v => update('dash_menu_text_color', v)} />
            <ColorInput label="Tab Hover Text Color" value={get('dash_menu_hover_color', 'rgba(255,255,255,1)')} onChange={v => update('dash_menu_hover_color', v)} />
            <ColorInput label="Active Tab Indicator Color" value={get('dash_active_border_color', '#D5A91C')} onChange={v => update('dash_active_border_color', v)} hint="The dot and highlight color for the currently active menu item." />
            <ColorInput label="Section Title Color" value={get('dash_title_color', 'rgba(255,255,255,0.25)')} onChange={v => update('dash_title_color', v)} hint="Color of group labels like CONTENT, OPERATIONS, MARKETING." />
            <ColorInput label="Logo Area Background" value={get('dash_logo_bg', '#1B4332')} onChange={v => update('dash_logo_bg', v)} />
            <ColorInput label="Logo Area Border" value={get('dash_logo_border', 'rgba(255,255,255,0.05)')} onChange={v => update('dash_logo_border', v)} />
          </div>
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
