import { useState } from 'react';
import { usePropertyLayout } from '@/hooks/usePropertyLayout';
import SectionManager from './components/SectionManager';
import OverviewComposer from './components/OverviewComposer';
import MediaTabsManager from './components/MediaTabsManager';
import LayoutControls from './components/LayoutControls';

type Tab = 'sections' | 'overview' | 'media' | 'layout';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'sections', label: 'Section Layout', icon: 'ri-layout-masonry-line' },
  { id: 'overview', label: 'Overview', icon: 'ri-grid-line' },
  { id: 'media', label: 'Media Tabs', icon: 'ri-image-2-line' },
  { id: 'layout', label: 'Layout & Controls', icon: 'ri-settings-3-line' },
];

export default function PropertyLayoutPage() {
  const { settings, setSettings, loading, saving, saveStatus, dirty, setDirty, save } = usePropertyLayout();
  const [activeTab, setActiveTab] = useState<Tab>('sections');

  const handleSave = () => save(settings);

  const handleSectionsChange = (enabled: typeof settings.enabled_sections, disabled: typeof settings.disabled_sections) => {
    setSettings(prev => ({ ...prev, enabled_sections: enabled, disabled_sections: disabled }));
    setDirty(true);
  };

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
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-800">Property Detail Layout Manager</h2>
          <p className="text-sm text-stone-500 mt-1">
            Control section order, visibility, overview fields, media tabs, and layout settings for all property detail pages.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
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
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] text-white text-sm font-medium rounded-lg hover:bg-[#163828] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {saving ? <><i className="ri-loader-4-line animate-spin" /> Saving…</> : <><i className="ri-save-line" /> Save Layout</>}
          </button>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1B4332]/5 border border-[#1B4332]/10 rounded-xl">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <p className="text-sm text-stone-700">
          <span className="font-medium">{settings.enabled_sections.length} sections enabled</span>
          {' · '}
          {settings.overview_settings.enabled_fields.length} overview fields
          {' · '}
          {settings.media_tabs.enabled.length} media tab{settings.media_tabs.enabled.length !== 1 ? 's' : ''}
          {' · '}
          Content layout: <span className="font-medium capitalize">{settings.banner_settings.content_layout.replace('_', ' ')}</span>
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex bg-white border border-stone-200 rounded-xl p-1 gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-1 justify-center
              ${activeTab === tab.id ? 'bg-[#1B4332] text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-[#f5f5f5]'}`}
          >
            <i className={`${tab.icon} text-sm`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'sections' && (
        <SectionManager
          enabledSections={settings.enabled_sections}
          disabledSections={settings.disabled_sections}
          onChange={handleSectionsChange}
        />
      )}

      {activeTab === 'overview' && (
        <OverviewComposer
          settings={settings.overview_settings}
          onChange={s => { setSettings(prev => ({ ...prev, overview_settings: s })); setDirty(true); }}
        />
      )}

      {activeTab === 'media' && (
        <MediaTabsManager
          settings={settings.media_tabs}
          onChange={s => { setSettings(prev => ({ ...prev, media_tabs: s })); setDirty(true); }}
        />
      )}

      {activeTab === 'layout' && (
        <LayoutControls
          banner={settings.banner_settings}
          columns={settings.column_settings}
          gallery={settings.gallery_settings}
          mobile={settings.mobile_settings}
          navigation={settings.navigation_settings}
          agentMessage={settings.agent_message_settings}
          onBanner={s => { setSettings(prev => ({ ...prev, banner_settings: s })); setDirty(true); }}
          onColumns={s => { setSettings(prev => ({ ...prev, column_settings: s })); setDirty(true); }}
          onGallery={s => { setSettings(prev => ({ ...prev, gallery_settings: s })); setDirty(true); }}
          onMobile={s => { setSettings(prev => ({ ...prev, mobile_settings: s })); setDirty(true); }}
          onNavigation={s => { setSettings(prev => ({ ...prev, navigation_settings: s })); setDirty(true); }}
          onAgentMessage={s => { setSettings(prev => ({ ...prev, agent_message_settings: s })); setDirty(true); }}
        />
      )}

      {/* Sticky save bar */}
      {dirty && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-stone-600 flex items-center gap-2">
            <i className="ri-edit-line text-amber-500" />
            You have unsaved changes
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1B4332] text-white text-sm font-medium rounded-lg hover:bg-[#163828] transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            {saving ? <><i className="ri-loader-4-line animate-spin" /> Saving…</> : <><i className="ri-save-line" /> Save All Changes</>}
          </button>
        </div>
      )}
    </div>
  );
}
