import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

interface HomepageSectionToggleProps {
  sectionKey: string;
  label: string;
  icon: string;
  countKey?: string;
  countLabel?: string;
  get: (key: string, fallback?: string) => string;
  update: (key: string, value: string) => void;
  countMin?: number;
  countMax?: number;
}

function HomepageSectionToggle({ sectionKey, label, icon, countKey, countLabel, get, update, countMin = 2, countMax = 12 }: HomepageSectionToggleProps) {
  const enabled = get(sectionKey, 'true') === 'true';
  return (
    <div className={`border rounded-lg p-4 transition-colors ${enabled ? 'border-[#1B4332]/20 bg-[#1B4332]/3' : 'border-stone-200 bg-[#f5f5f5]'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 flex items-center justify-center rounded-md ${enabled ? 'bg-[#1B4332]/15 text-[#1B4332]' : 'bg-stone-200 text-stone-400'}`}>
            <i className={`${icon} text-sm`} />
          </div>
          <span className={`text-sm font-medium ${enabled ? 'text-stone-800' : 'text-stone-400'}`}>{label}</span>
        </div>
        <button
          type="button"
          onClick={() => update(sectionKey, enabled ? 'false' : 'true')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${enabled ? 'bg-[#1B4332]' : 'bg-stone-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      {countKey && enabled && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-stone-500 whitespace-nowrap">{countLabel ?? 'Count'}:</span>
          <input
            type="number"
            value={get(countKey, '6')}
            onChange={(e) => update(countKey, e.target.value)}
            min={countMin}
            max={countMax}
            className="w-20 border border-stone-200 rounded px-2 py-1 text-sm text-stone-800 focus:outline-none focus:border-[#1B4332]"
          />
          <span className="text-xs text-stone-400">items shown</span>
        </div>
      )}
    </div>
  );
}

export default function HomepageControlsPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } = useManagementSettings('homepage_controls');

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
        icon="ri-layout-top-line"
        title="Homepage Controls"
        description="Toggle which sections appear on the homepage and how many items each section shows."
      />

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <i className="ri-information-line text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          For deep content editing of each section (titles, subtitles, images, CTAs), go to
          <strong> Marketing → Homepage Sections</strong> in the main sidebar.
          This page only controls visibility and item counts.
        </p>
      </div>

      <div className="space-y-3">
        <HomepageSectionToggle sectionKey="hp_show_hero" label="Hero / Banner Section" icon="ri-image-2-line" get={get} update={update} />
        <HomepageSectionToggle sectionKey="hp_show_stats_bar" label="Stats / Numbers Bar" icon="ri-bar-chart-2-line" get={get} update={update} />
        <HomepageSectionToggle sectionKey="hp_show_featured_listings" label="Featured Listings" icon="ri-building-2-line" countKey="hp_featured_listings_count" countLabel="Listings" get={get} update={update} countMax={12} />
        <HomepageSectionToggle sectionKey="hp_show_neighborhoods" label="Neighborhoods Section" icon="ri-map-pin-2-line" countKey="hp_neighborhoods_count" countLabel="Neighborhoods" get={get} update={update} countMax={12} />
        <HomepageSectionToggle sectionKey="hp_show_agents" label="Our Team / Agents" icon="ri-user-star-line" countKey="hp_agents_count" countLabel="Agents" get={get} update={update} countMax={8} />
        <HomepageSectionToggle sectionKey="hp_show_testimonials" label="Testimonials Section" icon="ri-chat-quote-line" countKey="hp_testimonials_count" countLabel="Testimonials" get={get} update={update} countMax={12} />
        <HomepageSectionToggle sectionKey="hp_show_blog" label="Blog / Insights Section" icon="ri-article-line" countKey="hp_blog_count" countLabel="Posts" get={get} update={update} countMax={6} />
        <HomepageSectionToggle sectionKey="hp_show_cta_banner" label="CTA Banner Section" icon="ri-megaphone-line" get={get} update={update} />
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
