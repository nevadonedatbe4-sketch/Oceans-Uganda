import { useState } from 'react';
import { usePropertyLayout } from '@/hooks/usePropertyLayout';
import { useCurrency } from '@/contexts/CurrencyContext';
import WatermarkedImage from '@/components/base/WatermarkedImage';
import type { FullListing } from '../page';

/* ── helpers ──────────────────────────────────────────────────── */
function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?byline=0&portrait=0`;
  return null;
}

function relativeDateLabel(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
}

const AMENITY_ICONS: Record<string, string> = {
  pool: 'ri-drop-fill', gym: 'ri-riding-line', parking: 'ri-parking-box-line',
  garden: 'ri-plant-line', security: 'ri-shield-check-line', generator: 'ri-flashlight-line',
  internet: 'ri-wifi-line', wifi: 'ri-wifi-line', cctv: 'ri-camera-lens-line',
  balcony: 'ri-home-line', elevator: 'ri-arrow-up-down-line',
  'air conditioning': 'ri-temp-cold-line', borehole: 'ri-water-flash-line',
  solar: 'ri-sun-line', storage: 'ri-archive-line', laundry: 'ri-t-shirt-line',
  tv: 'ri-tv-line', kitchen: 'ri-restaurant-line', backup: 'ri-flashlight-line',
  furnished: 'ri-sofa-line', gated: 'ri-community-line',
};
function getAmenityIcon(a: string) {
  const l = a.toLowerCase();
  for (const k of Object.keys(AMENITY_ICONS)) { if (l.includes(k)) return AMENITY_ICONS[k]; }
  return 'ri-checkbox-circle-line';
}

const DESC_LIMIT = 500;
const FEATURES_VISIBLE = 12;

/* ── Oceans section heading ───────────────────────────────────── */
function SectionHeading({ id, title }: { id?: string; title: string }) {
  return (
    <div id={id} className="mb-3 md:mb-5 scroll-mt-24">
      <h2
        className="font-roboto font-bold text-xs md:text-sm uppercase tracking-[0.12em] md:tracking-[0.15em] pb-2 md:pb-3 border-b-2"
        style={{ color: '#001731', borderColor: '#ccc' }}
      >
        {title}
      </h2>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────── */
interface PropertyBodyProps {
  listing: FullListing;
  amenities: string[];
  neighborhoodName?: string;
}

export default function PropertyBody({ listing, amenities, neighborhoodName }: PropertyBodyProps) {
  const { settings } = usePropertyLayout();
  const { formatPrice } = useCurrency();

  const [descExpanded, setDescExpanded]   = useState(false);
  const [showAllFeatures, setShowAll]     = useState(false);
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);

  const { column_settings, enabled_sections, navigation_settings } = settings;
  const featCols = column_settings?.features || 3;

  const BODY_SECTION_IDS = new Set(['description', 'details', 'features', 'floor_plans', 'video']);
  const orderedSections = (enabled_sections || [])
    .filter(s => BODY_SECTION_IDS.has(s.id))
    .sort((a, b) => a.order - b.order);

  const description  = listing.full_description ?? listing.short_description ?? '';
  const isLongDesc   = description.length > DESC_LIMIT;
  const displayDesc  = isLongDesc && !descExpanded ? description.slice(0, DESC_LIMIT) + '…' : description;
  const updatedLabel = relativeDateLabel(listing.updated_at);
  const listedLabel  = relativeDateLabel(listing.listing_date);
  const purposeLabel = listing.purpose === 'sale' ? 'For Sale' : 'For Rent';
  const furnished    = listing.furnished ? 'Furnished' : 'Unfurnished';
  const shortId      = listing.id.slice(0, 8).toUpperCase();
  const embedUrl     = getVideoEmbedUrl(listing.video_url ?? '');
  const mapQuery     = encodeURIComponent(
    [listing.address, listing.location, listing.city, neighborhoodName, listing.country, 'Uganda']
      .filter(Boolean).join(', ')
  );

  const priceDisplay = formatPrice(
    listing.price,
    listing.currency,
    { note: listing.price_note, frequency: listing.price_frequency, purpose: listing.purpose }
  );

  const secondaryPriceDisplay = listing.secondary_price != null && listing.secondary_price_label
    ? `${listing.secondary_price_label}: ${formatPrice(listing.secondary_price, listing.currency, { purpose: listing.purpose })}`
    : '';

  /* Oceans-style details table rows */
  const detailRows: { label: string; value: string }[] = [
    { label: 'Property ID',      value: shortId },
    { label: 'Price',            value: priceDisplay },
    { label: 'Bedrooms',         value: listing.bedrooms > 0 ? `${listing.bedrooms}` : '—' },
    { label: 'Bathrooms',        value: listing.bathrooms > 0 ? `${listing.bathrooms}` : '—' },
    { label: 'Garage / Parking', value: listing.parking > 0 ? `${listing.parking}` : '—' },
    { label: 'Property Size',    value: listing.size_sqm ? `${listing.size_sqm} m²` : '—' },
    { label: 'Property Type',    value: listing.property_type ?? '—' },
    { label: 'Furnished',        value: furnished },
    { label: 'Property Status',  value: purposeLabel },
    ...(listing.listing_date ? [{ label: 'Date Listed', value: new Date(listing.listing_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + (listedLabel ? ` (${listedLabel})` : '') }] : []),
    ...(listing.address ? [{ label: 'Address', value: listing.address }] : []),
    ...(listing.city ? [{ label: 'City', value: listing.city }] : []),
  ];

  const visibleAmenities = showAllFeatures ? amenities : amenities.slice(0, FEATURES_VISIBLE);

  const featColsClass: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
  };

  /* ── DESCRIPTION ──────────────────────────────────────────── */
  function renderDescription() {
    if (!description) return null;
    return (
      <section key="description" className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#e5e5e5]">
        <SectionHeading id="section-description" title="Description" />
        <div
          className="font-roboto text-sm leading-relaxed"
          style={{ color: '#555', lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: displayDesc.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }}
        />
        {isLongDesc && (
          <button
            onClick={() => setDescExpanded(v => !v)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-roboto font-semibold uppercase tracking-wider transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: '#555' }}
          >
            {descExpanded ? 'Show less' : 'Read more'}
            <i className={`text-sm ${descExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
          </button>
        )}
      </section>
    );
  }

  /* ── DETAILS — clean contact-form style ────────────────────── */
  function renderDetails() {
    const mid = Math.ceil(detailRows.length / 2);
    const leftRows = detailRows.slice(0, mid);
    const rightRows = detailRows.slice(mid);

    return (
      <section key="details" className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2
            id="section-details"
            className="font-roboto font-semibold text-sm md:text-base text-[#001731] scroll-mt-24"
          >
            Property Details
          </h2>
          {updatedLabel && (
            <span className="flex items-center gap-1.5 text-[11px] font-roboto text-stone-400">
              <i className="ri-refresh-line text-xs" />
              Updated {updatedLabel}
            </span>
          )}
        </div>

        <div className="bg-white border-2 border-stone-300 p-5 md:p-7" style={{ borderRadius: '2px' }}>
          {/* Mobile: single column — unchanged */}
          <div className="md:hidden flex flex-col">
            {detailRows.map((row, idx) => (
              <div
                key={row.label + idx}
                className="flex items-center justify-between py-3 px-1 border-b border-stone-100"
              >
                <span className="text-xs font-roboto font-semibold text-stone-800">
                  {row.label}
                </span>
                <span
                  className="text-sm font-roboto font-bold text-right ml-4"
                  style={{ color: row.label === 'Price' ? '#012042' : '#000' }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Desktop: two balanced columns with divider */}
          <div className="hidden md:flex md:flex-row">
            {/* Left column */}
            <div className="flex-1 flex flex-col">
              {leftRows.map((row, idx) => (
                <div
                  key={row.label + idx}
                  className="flex items-center justify-between py-3 px-1 border-b border-stone-100"
                >
                  <span className="text-xs font-roboto font-semibold text-stone-800">
                    {row.label}
                  </span>
                  <span
                    className="text-sm font-roboto font-bold text-right ml-4"
                    style={{ color: row.label === 'Price' ? '#012042' : '#000' }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Vertical divider */}
            <div className="mx-5 lg:mx-6 border-r border-stone-200 self-stretch" />

            {/* Right column */}
            <div className="flex-1 flex flex-col">
              {rightRows.map((row, idx) => (
                <div
                  key={row.label + idx}
                  className="flex items-center justify-between py-3 px-1 border-b border-stone-100"
                >
                  <span className="text-xs font-roboto font-semibold text-stone-800">
                    {row.label}
                  </span>
                  <span
                    className="text-sm font-roboto font-bold text-right ml-4"
                    style={{ color: row.label === 'Price' ? '#012042' : '#000' }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── FEATURES ───────────────────────────────────────────────── */
  function renderFeatures() {
    if (amenities.length === 0) return null;
    const gridClass = featColsClass[featCols] || 'grid-cols-2 sm:grid-cols-3';
    return (
      <section key="features" className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#e5e5e5]">
        <SectionHeading id="section-features" title="Features &amp; Amenities" />
        <div className={`grid ${gridClass} gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3`}>
          {visibleAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center shrink-0">
                <i className={`${getAmenityIcon(amenity)} text-xs md:text-sm`} style={{ color: '#888' }} />
              </div>
              <span className="text-xs md:text-sm font-roboto capitalize" style={{ color: '#555' }}>
                {amenity}
              </span>
            </div>
          ))}
        </div>
        {amenities.length > FEATURES_VISIBLE && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="mt-4 md:mt-5 inline-flex items-center gap-1.5 text-xs font-roboto font-semibold uppercase tracking-wider transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: '#555' }}
          >
            {showAllFeatures ? 'Show fewer' : `View all ${amenities.length} features`}
            <i className={`text-sm ${showAllFeatures ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
          </button>
        )}
      </section>
    );
  }

  /* ── ADDRESS / MAP ──────────────────────────────────────────── */
  function renderAddress() {
    const showMap = navigation_settings?.enable_map_in_address !== false;
    const locationStr = [listing.address, listing.location, listing.city, neighborhoodName, listing.country]
      .filter(Boolean).join(', ');

    return (
      <section key="address" className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#e5e5e5]">
        <SectionHeading id="section-address" title="Location &amp; Address" />

        {locationStr && (
          <div className="flex items-start gap-2 mb-3 md:mb-4 p-3 md:p-4 border border-[#e5e5e5]" style={{ background: '#f5f5f5', borderRadius: '2px' }}>
            <i className="ri-map-pin-2-line mt-0.5 shrink-0 text-sm md:text-base" style={{ color: '#888' }} />
            <p className="text-xs md:text-sm font-roboto" style={{ color: '#555' }}>{locationStr}</p>
          </div>
        )}

        {showMap && (
          <>
            <div className="overflow-hidden border border-[#e5e5e5]" style={{ height: '220px', borderRadius: '2px' }}>
              <iframe
                title="Property Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${mapQuery}&zoom=15`}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="nofollow noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-roboto font-semibold uppercase tracking-wider transition-opacity hover:opacity-70 cursor-pointer"
              style={{ color: '#555' }}
            >
              <i className="ri-external-link-line text-sm" />
              Open in Google Maps
            </a>
          </>
        )}
      </section>
    );
  }

  /* ── FLOOR PLANS ────────────────────────────────────────────── */
  function renderFloorPlans() {
    if (!listing.floor_plan_url) return null;
    return (
      <section key="floor_plans" className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#e5e5e5]">
        <SectionHeading id="section-floor-plans" title="Floor Plan" />
        <div
          className="relative overflow-hidden border border-[#e5e5e5] cursor-pointer group"
          style={{ maxHeight: '340px', borderRadius: '2px' }}
          onClick={() => setFloorPlanOpen(true)}
        >
          <WatermarkedImage
            src={listing.floor_plan_url}
            alt="Floor Plan"
            className="w-full object-contain object-center group-hover:scale-[1.02] transition-transform duration-500"
            style={{ maxHeight: '340px' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity w-11 h-11 flex items-center justify-center rounded-full bg-white/90">
              <i className="ri-zoom-in-line text-xl" style={{ color: '#001731' }} />
            </div>
          </div>
        </div>
        <button
          onClick={() => setFloorPlanOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-roboto font-semibold uppercase tracking-wider cursor-pointer hover:opacity-70 transition-opacity"
          style={{ color: '#555' }}
        >
          <i className="ri-fullscreen-line text-sm" />
          View full floor plan
        </button>
        {floorPlanOpen && (
          <div className="fixed inset-0 z-[100] bg-black/94 flex items-center justify-center p-4 md:p-8" onClick={() => setFloorPlanOpen(false)}>
            <button onClick={() => setFloorPlanOpen(false)} className="absolute top-3 right-3 md:top-5 md:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer">
              <i className="ri-close-line text-xl" />
            </button>
            <WatermarkedImage
              src={listing.floor_plan_url}
              alt="Floor Plan"
              className="max-w-full max-h-full object-contain"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </section>
    );
  }

  /* ── VIDEO TOUR ─────────────────────────────────────────────── */
  function renderVideo() {
    if (!embedUrl) return null;
    return (
      <section key="video" className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#e5e5e5]">
        <SectionHeading id="section-video" title="Video Tour" />
        <div className="relative overflow-hidden bg-[#f0ede8]" style={{ paddingBottom: '56.25%', borderRadius: '2px' }}>
          <iframe
            src={embedUrl}
            title="Property Video Tour"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>
    );
  }

  const SECTION_RENDERERS: Record<string, () => React.ReactNode> = {
    description: renderDescription,
    details:     renderDetails,
    features:    renderFeatures,
    floor_plans: renderFloorPlans,
    video:       renderVideo,
  };

  const sectionsToRender = orderedSections.length > 0
    ? orderedSections
    : [
        { id: 'description', order: 0, label: '', icon: '' },
        { id: 'details',     order: 1, label: '', icon: '' },
        { id: 'features',    order: 2, label: '', icon: '' },
      ];

  return (
    <div>
      {sectionsToRender.map(section => {
        const renderer = SECTION_RENDERERS[section.id];
        return renderer ? renderer() : null;
      })}
    </div>
  );
}