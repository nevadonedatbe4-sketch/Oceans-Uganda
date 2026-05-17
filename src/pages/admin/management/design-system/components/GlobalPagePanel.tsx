import { useState } from 'react';
import SettingField from '../../components/SettingField';

interface Props {
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
}

type PageKey = 'home' | 'listing' | 'property' | 'neighbourhood' | 'guide';

interface PageDef {
  key: PageKey;
  label: string;
  icon: string;
  description: string;
  route: string;
}

const PAGES: PageDef[] = [
  { key: 'home', label: 'Homepage', icon: 'ri-home-4-line', description: 'Controls hero, featured listings, neighbourhoods and CTA sections.', route: '/' },
  { key: 'listing', label: 'Listing Pages', icon: 'ri-layout-grid-line', description: 'All properties, buy, rent and search results pages.', route: '/all-properties' },
  { key: 'property', label: 'Property Detail', icon: 'ri-building-2-line', description: 'Individual property page — gallery, details, agent widget.', route: '/property/:slug' },
  { key: 'neighbourhood', label: 'Neighbourhood Pages', icon: 'ri-map-pin-2-line', description: 'Area guide pages — hero, snapshot, listings, FAQ.', route: '/neighbourhood/:slug' },
  { key: 'guide', label: 'Guide / Blog Pages', icon: 'ri-article-line', description: 'Expat guide articles and blog post pages.', route: '/blog/:slug' },
];

const SPACING_OPTIONS = [
  { label: 'Compact', value: 'compact' },
  { label: 'Normal', value: 'normal' },
  { label: 'Relaxed', value: 'relaxed' },
  { label: 'Spacious', value: 'spacious' },
];

const GRID_OPTIONS = [
  { label: '2 Columns', value: '2' },
  { label: '3 Columns', value: '3' },
  { label: '4 Columns', value: '4' },
];

export default function GlobalPagePanel({ get, update }: Props) {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const page = PAGES.find((p) => p.key === activePage)!;
  const pfx = `page_${activePage}`;

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="bg-[#1B4332]/5 border border-[#1B4332]/15 rounded-xl p-4 flex items-start gap-3">
        <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
          <i className="ri-global-line text-[#1B4332] text-sm" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#1B4332] mb-1">ONE System — All Pages</p>
          <p className="text-xs text-stone-600">
            Settings here control the layout, spacing, grid and visibility for each page type. Changes apply globally — no per-page hardcoding. Select a page below to configure it.
          </p>
        </div>
      </div>

      {/* Page selector */}
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-stone-100">
          {PAGES.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 shrink-0 ${
                activePage === p.key
                  ? 'border-[#1B4332] text-[#1B4332] bg-[#1B4332]/4'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-[#f5f5f5]'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className={`${p.icon} text-sm`} />
              </span>
              {p.label}
            </button>
          ))}
        </div>
        <div className="px-5 py-2.5 bg-[#f5f5f5] border-b border-stone-100 flex items-center justify-between">
          <p className="text-xs text-stone-500">{page.description}</p>
          <span className="text-[10px] font-mono text-stone-300 bg-white border border-stone-100 px-2 py-0.5 rounded">{page.route}</span>
        </div>
      </div>

      {/* Global settings (apply to ALL pages) */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-global-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Global — All Pages</h3>
          <span className="text-[10px] text-stone-400 ml-1">applies everywhere</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Show Breadcrumbs" type="toggle" value={get('global_show_breadcrumbs', 'true')} onChange={(v) => update('global_show_breadcrumbs', v)} hint="Show breadcrumb nav on all inner pages." />
          <SettingField label="Show Recently Viewed" type="toggle" value={get('global_show_recently_viewed', 'true')} onChange={(v) => update('global_show_recently_viewed', v)} hint="Show recently viewed strip at bottom." />
          <SettingField label="Show Contact Strip" type="toggle" value={get('global_show_contact_strip', 'true')} onChange={(v) => update('global_show_contact_strip', v)} hint="Show global contact strip." />
          <SettingField label="Section Spacing" type="select" value={get('global_section_spacing', 'normal')} onChange={(v) => update('global_section_spacing', v)} options={SPACING_OPTIONS} hint="Vertical spacing between all page sections." />
          <SettingField label="Container Max Width" type="select" value={get('global_container_width', '1200')} onChange={(v) => update('global_container_width', v)} options={[
            { label: 'Narrow (1024px)', value: '1024' },
            { label: 'Standard (1200px)', value: '1200' },
            { label: 'Wide (1400px)', value: '1400' },
            { label: 'Full Width', value: 'full' },
          ]} />
          <SettingField label="Show Footer Newsletter" type="toggle" value={get('global_footer_newsletter', 'true')} onChange={(v) => update('global_footer_newsletter', v)} />
        </div>
      </div>

      {/* Per-page settings */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className={`${page.icon} text-[#1B4332] text-sm`} />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">{page.label} — Settings</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SettingField label="Page Enabled" type="toggle" value={get(`${pfx}_enabled`, 'true')} onChange={(v) => update(`${pfx}_enabled`, v)} hint={`Enable or disable the ${page.label.toLowerCase()} entirely.`} />
          <SettingField label="Section Spacing Override" type="select" value={get(`${pfx}_spacing`, 'inherit')} onChange={(v) => update(`${pfx}_spacing`, v)} options={[{ label: 'Inherit Global', value: 'inherit' }, ...SPACING_OPTIONS]} />

          {/* Homepage-specific */}
          {activePage === 'home' && (
            <>
              <SettingField label="Show Hero Section" type="toggle" value={get(`${pfx}_show_hero`, 'true')} onChange={(v) => update(`${pfx}_show_hero`, v)} />
              <SettingField label="Show Featured Listings" type="toggle" value={get(`${pfx}_show_listings`, 'true')} onChange={(v) => update(`${pfx}_show_listings`, v)} />
              <SettingField label="Show Neighbourhoods" type="toggle" value={get(`${pfx}_show_neighbourhoods`, 'true')} onChange={(v) => update(`${pfx}_show_neighbourhoods`, v)} />
              <SettingField label="Show Testimonials" type="toggle" value={get(`${pfx}_show_testimonials`, 'true')} onChange={(v) => update(`${pfx}_show_testimonials`, v)} />
              <SettingField label="Show CTA Banner" type="toggle" value={get(`${pfx}_show_cta`, 'true')} onChange={(v) => update(`${pfx}_show_cta`, v)} />
              <SettingField label="Featured Listings Count" type="number" value={get(`${pfx}_listings_count`, '9')} onChange={(v) => update(`${pfx}_listings_count`, v)} min={3} max={24} />
            </>
          )}

          {/* Listing pages */}
          {activePage === 'listing' && (
            <>
              <SettingField label="Default Grid Columns" type="select" value={get(`${pfx}_grid_cols`, '3')} onChange={(v) => update(`${pfx}_grid_cols`, v)} options={GRID_OPTIONS} />
              <SettingField label="Listings Per Page" type="number" value={get(`${pfx}_per_page`, '12')} onChange={(v) => update(`${pfx}_per_page`, v)} min={6} max={48} />
              <SettingField label="Show Map View Toggle" type="toggle" value={get(`${pfx}_show_map_toggle`, 'true')} onChange={(v) => update(`${pfx}_show_map_toggle`, v)} />
              <SettingField label="Show Sort Options" type="toggle" value={get(`${pfx}_show_sort`, 'true')} onChange={(v) => update(`${pfx}_show_sort`, v)} />
              <SettingField label="Show Filter Sidebar" type="toggle" value={get(`${pfx}_show_sidebar`, 'true')} onChange={(v) => update(`${pfx}_show_sidebar`, v)} />
              <SettingField label="Show Hero Section" type="toggle" value={get(`${pfx}_show_hero`, 'true')} onChange={(v) => update(`${pfx}_show_hero`, v)} />
            </>
          )}

          {/* Property detail */}
          {activePage === 'property' && (
            <>
              <SettingField label="Show Gallery" type="toggle" value={get(`${pfx}_show_gallery`, 'true')} onChange={(v) => update(`${pfx}_show_gallery`, v)} />
              <SettingField label="Show Agent Widget" type="toggle" value={get(`${pfx}_show_agent`, 'true')} onChange={(v) => update(`${pfx}_show_agent`, v)} />
              <SettingField label="Show Similar Properties" type="toggle" value={get(`${pfx}_show_similar`, 'true')} onChange={(v) => update(`${pfx}_show_similar`, v)} />
              <SettingField label="Show Map" type="toggle" value={get(`${pfx}_show_map`, 'true')} onChange={(v) => update(`${pfx}_show_map`, v)} />
              <SettingField label="Show Amenities" type="toggle" value={get(`${pfx}_show_amenities`, 'true')} onChange={(v) => update(`${pfx}_show_amenities`, v)} />
              <SettingField label="Similar Properties Count" type="number" value={get(`${pfx}_similar_count`, '3')} onChange={(v) => update(`${pfx}_similar_count`, v)} min={2} max={8} />
            </>
          )}

          {/* Neighbourhood */}
          {activePage === 'neighbourhood' && (
            <>
              <SettingField label="Show Hero" type="toggle" value={get(`${pfx}_show_hero`, 'true')} onChange={(v) => update(`${pfx}_show_hero`, v)} />
              <SettingField label="Show Snapshot Grid" type="toggle" value={get(`${pfx}_show_snapshot`, 'true')} onChange={(v) => update(`${pfx}_show_snapshot`, v)} />
              <SettingField label="Show Gallery" type="toggle" value={get(`${pfx}_show_gallery`, 'true')} onChange={(v) => update(`${pfx}_show_gallery`, v)} />
              <SettingField label="Show Listings" type="toggle" value={get(`${pfx}_show_listings`, 'true')} onChange={(v) => update(`${pfx}_show_listings`, v)} />
              <SettingField label="Show FAQ" type="toggle" value={get(`${pfx}_show_faq`, 'true')} onChange={(v) => update(`${pfx}_show_faq`, v)} />
              <SettingField label="Show Guide Section" type="toggle" value={get(`${pfx}_show_guide`, 'true')} onChange={(v) => update(`${pfx}_show_guide`, v)} />
            </>
          )}

          {/* Guide / Blog */}
          {activePage === 'guide' && (
            <>
              <SettingField label="Show Cover Image" type="toggle" value={get(`${pfx}_show_cover`, 'true')} onChange={(v) => update(`${pfx}_show_cover`, v)} />
              <SettingField label="Show Author" type="toggle" value={get(`${pfx}_show_author`, 'true')} onChange={(v) => update(`${pfx}_show_author`, v)} />
              <SettingField label="Show Related Articles" type="toggle" value={get(`${pfx}_show_related`, 'true')} onChange={(v) => update(`${pfx}_show_related`, v)} />
              <SettingField label="Show CTA Block" type="toggle" value={get(`${pfx}_show_cta`, 'true')} onChange={(v) => update(`${pfx}_show_cta`, v)} />
              <SettingField label="Show FAQ" type="toggle" value={get(`${pfx}_show_faq`, 'true')} onChange={(v) => update(`${pfx}_show_faq`, v)} />
              <SettingField label="Related Articles Count" type="number" value={get(`${pfx}_related_count`, '3')} onChange={(v) => update(`${pfx}_related_count`, v)} min={2} max={6} />
            </>
          )}
        </div>
      </div>

      {/* SEO per page */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 flex items-center justify-center">
            <i className="ri-search-2-line text-[#1B4332] text-sm" />
          </span>
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">{page.label} — SEO Defaults</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <SettingField label="Default Meta Title" type="text" value={get(`${pfx}_seo_title`, '')} onChange={(v) => update(`${pfx}_seo_title`, v)} placeholder={`${page.label} | Oceans Uganda`} hint="Fallback title if no page-specific title is set." />
          <SettingField label="Default Meta Description" type="textarea" value={get(`${pfx}_seo_desc`, '')} onChange={(v) => update(`${pfx}_seo_desc`, v)} placeholder="Describe this page type for search engines..." hint="120–160 characters recommended." />
        </div>
      </div>
    </div>
  );
}
