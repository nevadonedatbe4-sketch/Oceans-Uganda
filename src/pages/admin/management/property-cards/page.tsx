import { useManagementSettings } from '../hooks/useManagementSettings';
import SettingField from '../components/SettingField';
import SaveBar from '../components/SaveBar';
import SectionHeader from '../components/SectionHeader';

export default function PropertyCardsPage() {
  const { get, update, save, saving, dirty, saveStatus, reset, loading } =
    useManagementSettings('property_cards');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[760px] space-y-6 pb-24">
      <SectionHeader
        icon="ri-layout-grid-2-line"
        title="Property Cards"
        description="Control carousel behaviour, filter visibility, and which elements appear on each property card across the site."
      />

      {/* ── Carousel Settings ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
          Carousel Settings
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <SettingField
            label="Auto-play Carousel"
            type="toggle"
            value={get('carousel_autoplay', 'true')}
            onChange={(v) => update('carousel_autoplay', v)}
            hint="Automatically advance slides on the homepage carousel."
          />
          <SettingField
            label="Auto-play Interval"
            type="number"
            value={get('carousel_interval', '4000')}
            onChange={(v) => update('carousel_interval', v)}
            unit="ms"
            min={1000}
            max={10000}
            hint="Time between slides in milliseconds."
          />
          <SettingField
            label="Show Carousel Arrows"
            type="toggle"
            value={get('carousel_show_arrows', 'true')}
            onChange={(v) => update('carousel_show_arrows', v)}
            hint="Display previous / next navigation arrows."
          />
          <SettingField
            label="Show Carousel Dots"
            type="toggle"
            value={get('carousel_show_dots', 'true')}
            onChange={(v) => update('carousel_show_dots', v)}
            hint="Display dot indicators below the carousel."
          />
          <SettingField
            label="Slides Visible (Desktop)"
            type="number"
            value={get('carousel_slides_desktop', '3')}
            onChange={(v) => update('carousel_slides_desktop', v)}
            min={1}
            max={6}
            hint="Number of cards visible at once on desktop."
          />
          <SettingField
            label="Slides Visible (Mobile)"
            type="number"
            value={get('carousel_slides_mobile', '1')}
            onChange={(v) => update('carousel_slides_mobile', v)}
            min={1}
            max={3}
            hint="Number of cards visible at once on mobile."
          />
          <SettingField
            label="Infinite Loop"
            type="toggle"
            value={get('carousel_infinite', 'true')}
            onChange={(v) => update('carousel_infinite', v)}
            hint="Loop back to the first slide after the last."
          />
          <SettingField
            label="Pause on Hover"
            type="toggle"
            value={get('carousel_pause_hover', 'true')}
            onChange={(v) => update('carousel_pause_hover', v)}
            hint="Pause auto-play when the user hovers over the carousel."
          />
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
          Filters
        </h3>
        <SettingField
          label="Show Property Type Filter"
          type="toggle"
          value={get('filter_show_type', 'true')}
          onChange={(v) => update('filter_show_type', v)}
          hint="Display the property type dropdown in filter bars."
        />
        <SettingField
          label="Show Price Range Filter"
          type="toggle"
          value={get('filter_show_price', 'true')}
          onChange={(v) => update('filter_show_price', v)}
          hint="Display the min / max price filter."
        />
        <SettingField
          label="Show Bedrooms Filter"
          type="toggle"
          value={get('filter_show_beds', 'true')}
          onChange={(v) => update('filter_show_beds', v)}
        />
        <SettingField
          label="Show Bathrooms Filter"
          type="toggle"
          value={get('filter_show_baths', 'true')}
          onChange={(v) => update('filter_show_baths', v)}
        />
        <SettingField
          label="Show Area / Neighbourhood Filter"
          type="toggle"
          value={get('filter_show_area', 'true')}
          onChange={(v) => update('filter_show_area', v)}
        />
        <SettingField
          label="Show Furnished Filter"
          type="toggle"
          value={get('filter_show_furnished', 'true')}
          onChange={(v) => update('filter_show_furnished', v)}
        />
        <SettingField
          label="Show Size (sqm) Filter"
          type="toggle"
          value={get('filter_show_size', 'false')}
          onChange={(v) => update('filter_show_size', v)}
        />
        <SettingField
          label="Show Purpose Filter (Buy / Rent / All)"
          type="toggle"
          value={get('filter_show_purpose', 'true')}
          onChange={(v) => update('filter_show_purpose', v)}
        />
      </div>

      {/* ── Show / Hide Data ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5 space-y-1">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
          Show / Hide Data
        </h3>

        {/* Compare */}
        <SettingField
          label="Hide Compare Button"
          type="toggle"
          value={get('card_hide_compare', 'false')}
          onChange={(v) => update('card_hide_compare', v)}
          hint="Remove the compare toggle from property cards."
        />

        {/* Favorite */}
        <SettingField
          label="Hide Favorite Button"
          type="toggle"
          value={get('card_hide_favorite', 'false')}
          onChange={(v) => update('card_hide_favorite', v)}
          hint="Remove the save / heart button from property cards."
        />

        {/* Preview */}
        <SettingField
          label="Hide Preview Button"
          type="toggle"
          value={get('card_hide_preview', 'false')}
          onChange={(v) => update('card_hide_preview', v)}
          hint="Remove the quick-preview (expand) icon from card images."
        />

        {/* Featured label */}
        <SettingField
          label="Hide Featured Label"
          type="toggle"
          value={get('card_hide_featured', 'false')}
          onChange={(v) => update('card_hide_featured', v)}
          hint="Hide the '· Featured' label on featured properties."
        />

        {/* Status badge */}
        <SettingField
          label="Hide Status"
          type="toggle"
          value={get('card_hide_status', 'false')}
          onChange={(v) => update('card_hide_status', v)}
          hint="Hide the For Sale / For Rent status label on cards."
        />

        {/* Labels (beds, baths, parking) */}
        <SettingField
          label="Hide Labels"
          type="toggle"
          value={get('card_hide_labels', 'false')}
          onChange={(v) => update('card_hide_labels', v)}
          hint="Hide the beds, baths, and parking feature labels on cards."
        />
      </div>

      {/* ── Live Preview ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-100 p-5">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-4">
          Card Preview
        </h3>
        <div
          className="overflow-hidden transition-all max-w-[260px]"
          style={{ border: '1px solid #ebebeb' }}
        >
          {/* Image area */}
          <div className="relative w-full overflow-hidden" style={{ height: '160px' }}>
            <img
              src="https://readdy.ai/api/search-image?query=modern%20luxury%20apartment%20interior%20living%20room%20elegant%20minimal%20design%20bright%20natural%20light&width=520&height=320&seq=card-mgmt-preview-1&orientation=landscape"
              alt="preview"
              className="w-full h-full object-cover object-top"
            />
            {/* Preview icon */}
            {get('card_hide_preview', 'false') !== 'true' && (
              <div className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center text-white" style={{ background: 'rgba(0,0,0,0.30)', backdropFilter: 'blur(4px)' }}>
                <i className="ri-fullscreen-line text-xs" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-4 pt-3 pb-4">
            {/* Status */}
            {get('card_hide_status', 'false') !== 'true' && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-1.5">
                For Sale
                {get('card_hide_featured', 'false') !== 'true' && (
                  <span className="ml-2 text-[#0D5959]">· Featured</span>
                )}
              </p>
            )}

            <h3 className="font-semibold text-[13px] leading-snug mb-1.5 text-stone-800">
              Luxury 3-Bed Apartment
            </h3>
            <p className="text-[11px] text-stone-400 mb-2">Kololo, Kampala</p>

            {/* Labels */}
            {get('card_hide_labels', 'false') !== 'true' && (
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-1 text-[11px] text-stone-500">
                  <i className="ri-hotel-bed-line text-xs text-stone-400" /> 3 beds
                </span>
                <span className="flex items-center gap-1 text-[11px] text-stone-500">
                  <i className="ri-showers-line text-xs text-stone-400" /> 2 baths
                </span>
              </div>
            )}

            <div className="border-t border-stone-100 pt-2 flex items-center justify-between">
              <span className="font-bold text-[15px] text-stone-800">$450,000</span>
              <div className="flex items-center gap-1.5">
                {/* Favorite */}
                {get('card_hide_favorite', 'false') !== 'true' && (
                  <div className="w-6 h-6 flex items-center justify-center rounded-full border border-stone-200 cursor-pointer">
                    <i className="ri-heart-line text-xs text-stone-400" />
                  </div>
                )}
                {/* Compare */}
                {get('card_hide_compare', 'false') !== 'true' && (
                  <div className="w-6 h-6 flex items-center justify-center rounded-full border border-stone-200 cursor-pointer">
                    <i className="ri-scales-3-line text-xs text-stone-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-3">Toggle the options above to see how the card changes in real time.</p>
      </div>

      <SaveBar dirty={dirty} saving={saving} saveStatus={saveStatus} onSave={save} onReset={reset} />
    </div>
  );
}
