import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

export default function LandlordsManagementPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('landlords_settings');

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
        icon="ri-home-heart-line"
        title="Landlords Page"
        description="Control the images, text, and content shown on the Landlords / Property Owners page."
      />

      <div className="flex items-start gap-3 bg-[#1B4332]/5 border border-[#1B4332]/20 rounded-lg px-4 py-3">
        <i className="ri-information-line text-[#1B4332] mt-0.5 shrink-0" />
        <p className="text-sm text-[#1B4332]/80">
          Upload images directly from your PC or mobile — no URL needed. Changes take effect after saving.
        </p>
      </div>

      {/* HERO IMAGES */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
        <div className="flex items-center gap-2">
          <i className="ri-image-2-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Section Images</h3>
        </div>
        <p className="text-xs text-stone-400 -mt-2">
          The large background image at the top of the Landlords page. Recommended: landscape, at least 1920×750px.
        </p>

        <SettingField
          label="Hero Background Image"
          type="image_upload"
          value={get('landlords_hero_image', '')}
          onChange={(v) => update('landlords_hero_image', v)}
          hint="Full-width hero background. Upload from your device or paste a URL."
        />
      </div>

      {/* HERO TEXT */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <i className="ri-text text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Hero Text</h3>
        </div>

        <SettingField
          label="Eyebrow / Label"
          value={get('landlords_hero_eyebrow', 'For Landlords & Property Owners')}
          onChange={(v) => update('landlords_hero_eyebrow', v)}
          placeholder="For Landlords & Property Owners"
          hint="Small label above the main title."
        />
        <SettingField
          label="Hero Title"
          type="textarea"
          value={get('landlords_hero_title', 'Let or Sell Your Property With Confidence')}
          onChange={(v) => update('landlords_hero_title', v)}
          placeholder="Let or Sell Your Property With Confidence"
        />
        <SettingField
          label="Hero Subtitle / Body"
          type="textarea"
          value={get('landlords_hero_subtitle', "Kampala's most trusted letting and management agency. We find quality tenants fast, collect your rent reliably, and protect your investment for the long term.")}
          onChange={(v) => update('landlords_hero_subtitle', v)}
          placeholder="Subtitle text..."
        />
        <div className="grid grid-cols-2 gap-4">
          <SettingField
            label="Primary Button Label"
            value={get('landlords_btn1_label', 'List My Property')}
            onChange={(v) => update('landlords_btn1_label', v)}
          />
          <SettingField
            label="Secondary Button Label"
            value={get('landlords_btn2_label', 'Free Valuation')}
            onChange={(v) => update('landlords_btn2_label', v)}
          />
        </div>
      </div>

      {/* INTRO SECTION */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-5">
        <div className="flex items-center gap-2">
          <i className="ri-image-edit-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Intro Section Image</h3>
        </div>
        <p className="text-xs text-stone-400 -mt-2">
          The photo shown beside the "Your Property Is Our Priority" intro text. Recommended: landscape, around 700×480px.
        </p>

        <SettingField
          label="Intro / Office Photo"
          type="image_upload"
          value={get('landlords_intro_image', '')}
          onChange={(v) => update('landlords_intro_image', v)}
          hint="Shown next to the intro paragraph on the Landlords page."
        />

        <div className="border-t border-stone-100" />

        <SettingField
          label="Intro Title"
          value={get('landlords_intro_title', 'Your Property Is Our Priority')}
          onChange={(v) => update('landlords_intro_title', v)}
        />
        <SettingField
          label="Intro Body (Paragraph 1)"
          type="textarea"
          value={get('landlords_intro_body1', "At Oceans Uganda, we understand that your property is more than an asset — it's a significant investment. Our dedicated landlord team treats every property as if it were their own: maximising returns, minimising voids, and ensuring every tenancy runs smoothly.")}
          onChange={(v) => update('landlords_intro_body1', v)}
        />
        <SettingField
          label="Intro Body (Paragraph 2)"
          type="textarea"
          value={get('landlords_intro_body2', "With deep roots in Kampala's premium property market, we have the network, experience, and systems to consistently deliver outstanding results for landlords across Kololo, Nakasero, Muyenga, and beyond.")}
          onChange={(v) => update('landlords_intro_body2', v)}
        />
        <SettingField
          label="Stat Badge Value"
          value={get('landlords_stat_badge_value', '98%')}
          onChange={(v) => update('landlords_stat_badge_value', v)}
          hint="The number shown in the gold badge (e.g. 98%)."
        />
        <SettingField
          label="Stat Badge Label"
          value={get('landlords_stat_badge_label', 'Occupancy Rate')}
          onChange={(v) => update('landlords_stat_badge_label', v)}
        />
      </div>

      {/* STATS STRIP */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <i className="ri-bar-chart-2-line text-[#1B4332] text-base" />
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Stats Strip</h3>
        </div>
        <p className="text-xs text-stone-400 -mt-2">The 4 numbers shown in the dark strip below the hero.</p>
        <div className="grid grid-cols-2 gap-4">
          <SettingField label="Stat 1 Value" value={get('landlords_stat1_value', '200+')} onChange={(v) => update('landlords_stat1_value', v)} />
          <SettingField label="Stat 1 Label" value={get('landlords_stat1_label', 'Properties Managed')} onChange={(v) => update('landlords_stat1_label', v)} />
          <SettingField label="Stat 2 Value" value={get('landlords_stat2_value', '98%')} onChange={(v) => update('landlords_stat2_value', v)} />
          <SettingField label="Stat 2 Label" value={get('landlords_stat2_label', 'Occupancy Rate')} onChange={(v) => update('landlords_stat2_label', v)} />
          <SettingField label="Stat 3 Value" value={get('landlords_stat3_value', '12+')} onChange={(v) => update('landlords_stat3_value', v)} />
          <SettingField label="Stat 3 Label" value={get('landlords_stat3_label', 'Years Experience')} onChange={(v) => update('landlords_stat3_label', v)} />
          <SettingField label="Stat 4 Value" value={get('landlords_stat4_value', '14 days')} onChange={(v) => update('landlords_stat4_value', v)} />
          <SettingField label="Stat 4 Label" value={get('landlords_stat4_label', 'Avg. Time to Let')} onChange={(v) => update('landlords_stat4_label', v)} />
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
