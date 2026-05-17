import { useState } from 'react';
import { useManagementSettings } from '../hooks/useManagementSettings';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';
import ColorPanel from './components/ColorPanel';
import TypographyPanel from './components/TypographyPanel';
import SpacingPanel from './components/SpacingPanel';
import CardBoxPanel from './components/CardBoxPanel';
import ImagePanel from './components/ImagePanel';
import ButtonPanel from './components/ButtonPanel';
import CardContentPanel from './components/CardContentPanel';
import DateControlPanel from './components/DateControlPanel';
import CarouselPanel from './components/CarouselPanel';
import CardV7Panel from './components/CardV7Panel';
import GlobalPagePanel from './components/GlobalPagePanel';
import ResponsivePanel from './components/ResponsivePanel';
import LivePreviewPanel from './components/LivePreviewPanel';

type TabGroup = {
  group: string;
  tabs: Tab[];
};

type Tab = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

const TAB_GROUPS: TabGroup[] = [
  {
    group: 'Global',
    tabs: [
      { id: 'colors', label: 'Colours', icon: 'ri-drop-fill', description: 'Global colour palette — Primary, Secondary, Accent, Text, Background, Borders, States. Cascades across Cards, Buttons, Sections and all pages.' },
      { id: 'typography', label: 'Typography', icon: 'ri-text', description: 'Global fonts + per-element overrides for Title, Address, Meta, Price, Buttons, Agent, Date.' },
      { id: 'spacing', label: 'Spacing', icon: 'ri-layout-4-line', description: 'Margins, padding, grid columns and container width. Supports Desktop / Tablet / Mobile overrides.' },
      { id: 'button', label: 'Buttons', icon: 'ri-cursor-line', description: 'Global button styles — padding, radius, colors, hover states. Applies to cards, CTAs, forms and hero.' },
      { id: 'image', label: 'Image', icon: 'ri-image-2-line', description: 'Image border radius, fit (cover/contain), card height, focal point and hover effects.' },
    ],
  },
  {
    group: 'Cards',
    tabs: [
      { id: 'card_box', label: 'Card Box', icon: 'ri-layout-grid-2-line', description: 'Card structure (padding, radius, separator) and colors (Normal / Hover states) — no shadows, no colored borders.' },
      { id: 'card_content', label: 'Card Content', icon: 'ri-list-ordered', description: 'Drag-and-drop field ordering and visibility toggle for every card field.' },
      { id: 'card_v7', label: 'Card v7', icon: 'ri-layout-masonry-line', description: 'Property Card v7 — Content, Style and Advanced (hover, animation, responsive overrides).' },
      { id: 'date', label: 'Date', icon: 'ri-calendar-line', description: 'Date display — visibility, position (top/bottom/inline), format, typography and color.' },
    ],
  },
  {
    group: 'Carousel',
    tabs: [
      { id: 'carousel', label: 'Carousel', icon: 'ri-slideshow-3-line', description: 'Prev/Next buttons, arrow controls and Dots System (size, gap, margin, opacity, color) — applies to all sliders.' },
    ],
  },
  {
    group: 'Pages & Responsive',
    tabs: [
      { id: 'global_pages', label: 'Page Control', icon: 'ri-pages-line', description: 'ONE system controlling Homepage, Listing, Property, Neighbourhood and Guide pages — sections, grid, SEO defaults.' },
      { id: 'responsive', label: 'Responsive', icon: 'ri-device-line', description: 'Desktop / Tablet / Mobile overrides for typography, spacing, grid and layout — no breaking layouts.' },
    ],
  },
  {
    group: 'Preview',
    tabs: [
      { id: 'live_preview', label: 'Live Preview', icon: 'ri-eye-line', description: 'Renders the real PropertyCard component using all current Design System settings — Desktop, Tablet and Mobile viewports. No hardcoded styles.' },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap((g) => g.tabs);

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('colors');
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('design_system');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeTabData = ALL_TABS.find((t) => t.id === activeTab);

  return (
    <div className="max-w-[960px] space-y-5 pb-24">
      <SectionHeader
        icon="ri-palette-line"
        title="Global Design System"
        description="Full frontend control — no hardcoded styles, no inline overrides, no duplicate logic. All settings use CSS variables and cascade globally."
      />

      {/* Dev rules badge */}
      <div className="flex flex-wrap gap-2">
        {[
          { icon: 'ri-close-circle-line', text: 'No hardcoded styles', color: 'text-red-500 bg-red-50' },
          { icon: 'ri-close-circle-line', text: 'No inline CSS overrides', color: 'text-red-500 bg-red-50' },
          { icon: 'ri-close-circle-line', text: 'No duplicate styling logic', color: 'text-red-500 bg-red-50' },
          { icon: 'ri-checkbox-circle-line', text: 'CSS variables', color: 'text-[#1B4332] bg-[#1B4332]/8' },
          { icon: 'ri-checkbox-circle-line', text: 'CMS-driven settings', color: 'text-[#1B4332] bg-[#1B4332]/8' },
          { icon: 'ri-checkbox-circle-line', text: 'Reusable components', color: 'text-[#1B4332] bg-[#1B4332]/8' },
        ].map((badge) => (
          <span key={badge.text} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${badge.color}`}>
            <i className={`${badge.icon} text-xs`} />
            {badge.text}
          </span>
        ))}
      </div>

      {/* Tab navigation — grouped */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          {TAB_GROUPS.map((group) => (
            <div key={group.group} className="flex items-center border-b border-stone-100 last:border-0">
              <div className="px-3 py-2 shrink-0 w-[110px] border-r border-stone-100 bg-[#f5f5f5]">
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{group.group}</p>
              </div>
              <div className="flex overflow-x-auto">
                {group.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 shrink-0 ${
                      activeTab === tab.id
                        ? 'border-[#1B4332] text-[#1B4332] bg-[#1B4332]/4'
                        : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-[#f5f5f5]'
                    }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                      <i className={`${tab.icon} text-sm`} />
                    </span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {activeTabData && (
          <div className="px-5 py-3 bg-[#f5f5f5] border-t border-stone-100 flex items-center gap-2">
            <span className="w-4 h-4 flex items-center justify-center shrink-0">
              <i className={`${activeTabData.icon} text-[#1B4332] text-sm`} />
            </span>
            <p className="text-xs text-stone-500 flex-1">{activeTabData.description}</p>
            {dirty && (
              <span className="ml-auto shrink-0 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                Unsaved changes
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'colors'       && <ColorPanel get={get} update={update} />}
        {activeTab === 'typography'   && <TypographyPanel get={get} update={update} />}
        {activeTab === 'spacing'      && <SpacingPanel get={get} update={update} />}
        {activeTab === 'button'       && <ButtonPanel get={get} update={update} />}
        {activeTab === 'image'        && <ImagePanel get={get} update={update} />}
        {activeTab === 'card_box'     && <CardBoxPanel get={get} update={update} />}
        {activeTab === 'card_content' && <CardContentPanel get={get} update={update} />}
        {activeTab === 'card_v7'      && <CardV7Panel get={get} update={update} />}
        {activeTab === 'date'         && <DateControlPanel get={get} update={update} />}
        {activeTab === 'carousel'     && <CarouselPanel get={get} update={update} />}
        {activeTab === 'global_pages' && <GlobalPagePanel get={get} update={update} />}
        {activeTab === 'responsive'   && <ResponsivePanel get={get} update={update} />}
        {activeTab === 'live_preview' && <LivePreviewPanel get={get} />}
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
