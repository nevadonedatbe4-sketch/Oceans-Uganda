import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

const SEPARATORS = [
  { value: '/', label: '/ Forward Slash' },
  { value: '›', label: '› Right Angle Quote' },
  { value: '»', label: '» Double Angle Quote' },
  { value: '·', label: '· Middle Dot' },
  { value: '-', label: '- Dash' },
  { value: '|', label: '| Pipe' },
];

export default function BreadcrumbsPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('breadcrumbs');
  const sep = get('breadcrumb_separator', '/');
  const showHome = get('breadcrumb_show_home', 'true') === 'true';

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
        icon="ri-arrow-right-s-line"
        title="Breadcrumbs"
        description="Control breadcrumb navigation visibility and styling across all page types."
      />

      {/* Preview */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Live Preview</h3>
        <div className="flex items-center gap-1.5 text-sm text-stone-500 bg-[#f5f5f5] rounded-lg px-4 py-3">
          {showHome && (
            <>
              <span className="text-[#1B4332] hover:underline cursor-pointer">Home</span>
              <span className="text-stone-300">{sep}</span>
            </>
          )}
          <span className="text-[#1B4332] hover:underline cursor-pointer">Buy</span>
          <span className="text-stone-300">{sep}</span>
          <span className="text-[#1B4332] hover:underline cursor-pointer">Kololo</span>
          <span className="text-stone-300">{sep}</span>
          <span className="text-stone-700 font-medium">4BR Villa — Kololo Hill</span>
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Global Settings</h3>
        <SettingField
          label="Enable Breadcrumbs"
          type="toggle"
          value={get('breadcrumb_enabled', 'true')}
          onChange={(v) => update('breadcrumb_enabled', v)}
          hint="Master toggle — disabling this hides breadcrumbs across all pages."
        />
        <SettingField
          label="Show Home Link"
          type="toggle"
          value={get('breadcrumb_show_home', 'true')}
          onChange={(v) => update('breadcrumb_show_home', v)}
          hint="Show or hide the &lsquo;Home&rsquo; link at the start of the breadcrumb trail."
        />
        <SettingField
          label="Separator Character"
          type="select"
          value={sep}
          onChange={(v) => update('breadcrumb_separator', v)}
          options={SEPARATORS}
        />
      </div>

      {/* Per Page Type */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">Show On</h3>
        <SettingField label="Listing / Property Pages" type="toggle" value={get('breadcrumb_show_on_listings', 'true')} onChange={(v) => update('breadcrumb_show_on_listings', v)} />
        <SettingField label="Blog / Insight Pages" type="toggle" value={get('breadcrumb_show_on_blog', 'true')} onChange={(v) => update('breadcrumb_show_on_blog', v)} />
        <SettingField label="Neighborhood Pages" type="toggle" value={get('breadcrumb_show_on_neighborhoods', 'true')} onChange={(v) => update('breadcrumb_show_on_neighborhoods', v)} />
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
