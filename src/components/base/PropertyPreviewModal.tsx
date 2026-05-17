import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import PcmPrice from '@/components/base/PcmTooltip';

interface PreviewListing {
  id: string;
  title: string;
  slug: string;
  property_type: string | null;
  purpose: string;
  price: number | null;
  currency: string;
  price_note: string | null;
  location: string | null;
  address: string | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size_sqm: number | null;
  furnished: boolean;
  featured: boolean;
  status: string;
  short_description: string | null;
  full_description: string | null;
  cover_image: string | null;
  listing_date: string | null;
}

interface PropertyPreviewModalProps {
  slug: string;
  onClose: () => void;
}

const AMENITY_ICONS: Record<string, string> = {
  pool: 'ri-drop-line',
  gym: 'ri-riding-line',
  parking: 'ri-parking-box-line',
  garden: 'ri-plant-line',
  security: 'ri-shield-check-line',
  generator: 'ri-flashlight-line',
  internet: 'ri-wifi-line',
  wifi: 'ri-wifi-line',
  cctv: 'ri-camera-lens-line',
  balcony: 'ri-home-line',
  elevator: 'ri-arrow-up-down-line',
  'air conditioning': 'ri-temp-cold-line',
  borehole: 'ri-water-flash-line',
  staff: 'ri-user-line',
  fireplace: 'ri-fire-line',
  solar: 'ri-sun-line',
  storage: 'ri-archive-line',
  laundry: 'ri-t-shirt-line',
  tv: 'ri-tv-line',
};

function getAmenityIcon(amenity: string): string {
  const lower = amenity.toLowerCase();
  for (const key of Object.keys(AMENITY_ICONS)) {
    if (lower.includes(key)) return AMENITY_ICONS[key];
  }
  return 'ri-checkbox-circle-line';
}

function purposeLabel(p: string) {
  if (p === 'sale') return 'For Sale';
  if (p === 'rent') return 'For Rent';
  return p;
}

// ─── Mini Gallery ─────────────────────────────────────────────────────────────
function MiniGallery({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-64 bg-stone-100 overflow-hidden flex-shrink-0">
      <img
        src={images[current]}
        alt={`${title} — ${current + 1}`}
        className="w-full h-full object-cover object-top transition-opacity duration-300"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 text-white rounded-sm hover:bg-black/60 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-s-line text-lg" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 text-white rounded-sm hover:bg-black/60 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-right-s-line text-lg" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${current === i ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 text-white text-[10px] font-roboto rounded-sm">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function PropertyPreviewModal({ slug, onClose }: PropertyPreviewModalProps) {
  const [listing, setListing] = useState<PreviewListing | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

  // Fetch
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: l } = await supabase
        .from('listings')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!l) { setLoading(false); return; }
      setListing(l as PreviewListing);

      const [imagesRes, amenitiesRes] = await Promise.all([
        supabase.from('listing_images').select('url').eq('listing_id', l.id).order('sort_order'),
        supabase.from('listing_amenities').select('amenity').eq('listing_id', l.id),
      ]);

      const imgUrls = (imagesRes.data ?? []).map((r: { url: string }) => r.url).filter(Boolean);
      setImages(l.cover_image ? [l.cover_image, ...imgUrls.filter((u: string) => u !== l.cover_image)] : imgUrls);
      setAmenities((amenitiesRes.data ?? []).map((r: { amenity: string }) => r.amenity));
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  const priceDisplay = listing?.price
    ? `${listing.currency === 'UGX' ? 'UGX ' : '$'}${new Intl.NumberFormat('en-US').format(listing.price)}${listing.purpose === 'rent' ? ' pcm' : ''}`
    : 'POA';

  return (
    <div
      className={`fixed inset-0 z-[9990] flex transition-all duration-300 ${visible ? 'bg-black/50' : 'bg-black/0'}`}
      onClick={handleClose}
    >
      {/* Drawer panel — slides in from right */}
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className={`ml-auto w-full max-w-[480px] h-full bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 shrink-0">
          <span className="text-xs font-roboto font-semibold text-stone-400 uppercase tracking-widest">Property Preview</span>
          <div className="flex items-center gap-2">
            {listing && (
              <Link
                to={`/property/${listing.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[11px] font-roboto font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-external-link-line text-xs" />
                Full Details
              </Link>
            )}
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-close-line text-lg" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !listing ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <i className="ri-building-line text-4xl text-stone-200 mb-3" />
              <p className="text-sm text-stone-400 font-roboto">Property not found</p>
            </div>
          ) : (
            <>
              {/* Gallery */}
              <MiniGallery images={images} title={listing.title} />

              {/* Title + Price */}
              <div className="px-5 pt-4 pb-3 border-b border-stone-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {listing.featured && (
                        <span className="px-2 py-0.5 text-[9px] font-roboto font-bold bg-golden text-primary uppercase tracking-widest rounded-sm whitespace-nowrap">Featured</span>
                      )}
                      <span className={`px-2 py-0.5 text-[9px] font-roboto font-bold uppercase tracking-widest rounded-sm whitespace-nowrap text-white ${listing.purpose === 'sale' ? 'bg-primary' : 'bg-teal-600'}`}>
                        {purposeLabel(listing.purpose)}
                      </span>
                    </div>
                    <h2 className="text-base font-prata text-primary leading-snug">{listing.title}</h2>
                    {listing.location && (
                      <p className="flex items-center gap-1 text-xs text-stone-500 font-roboto mt-1.5">
                        <i className="ri-map-pin-2-line text-golden text-xs" />
                        {listing.location}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <PcmPrice
                      price={priceDisplay}
                      priceUsd={listing.price}
                      currency={listing.currency}
                      purpose={listing.purpose}
                      className="text-lg font-prata text-primary leading-tight"
                      tooltipSide="bottom"
                    />
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-4 divide-x divide-stone-100 border-b border-stone-100">
                {[
                  { icon: 'ri-hotel-bed-line', label: 'Beds', value: listing.bedrooms > 0 ? listing.bedrooms : '—' },
                  { icon: 'bath', label: 'Baths', value: listing.bathrooms > 0 ? listing.bathrooms : '—' },
                  { icon: 'ri-parking-box-line', label: 'Parking', value: listing.parking > 0 ? listing.parking : '—' },
                  { icon: 'ri-aspect-ratio-line', label: 'Size', value: listing.size_sqm ? `${listing.size_sqm}m²` : '—' },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center justify-center py-3 px-2 text-center">
                    <div className="w-4 h-4 flex items-center justify-center mb-1">
                      {stat.icon === 'bath' ? (
                        <img
                          src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c"
                          alt="Bath"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <i className={`${stat.icon} text-stone-400 text-sm`} />
                      )}
                    </div>
                    <p className="text-sm font-roboto font-semibold text-primary">{String(stat.value)}</p>
                    <p className="text-[9px] text-stone-400 font-roboto uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {(listing.full_description ?? listing.short_description) && (
                <div className="px-5 py-4 border-b border-stone-100">
                  <h3 className="text-xs font-roboto font-semibold text-primary uppercase tracking-wider mb-2.5">Description</h3>
                  <div
                    className="text-xs text-stone-600 font-roboto leading-relaxed line-clamp-6"
                    dangerouslySetInnerHTML={{
                      __html: (listing.full_description ?? listing.short_description ?? '').replace(/\n/g, '<br/>'),
                    }}
                  />
                </div>
              )}

              {/* Details grid */}
              <div className="px-5 py-4 border-b border-stone-100">
                <h3 className="text-xs font-roboto font-semibold text-primary uppercase tracking-wider mb-3">Details</h3>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {[
                    { label: 'Property Type', value: listing.property_type ?? '—' },
                    { label: 'Status', value: purposeLabel(listing.purpose) },
                    { label: 'Bedrooms', value: listing.bedrooms > 0 ? listing.bedrooms : '—' },
                    { label: 'Bathrooms', value: listing.bathrooms > 0 ? listing.bathrooms : '—' },
                    { label: 'Parking', value: listing.parking > 0 ? listing.parking : '—' },
                    { label: 'Size', value: listing.size_sqm ? `${listing.size_sqm} m²` : '—' },
                    { label: 'Furnished', value: listing.furnished ? 'Yes' : 'No' },
                    { label: 'Property ID', value: listing.id.slice(0, 8).toUpperCase() },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-stone-50">
                      <span className="text-[11px] text-stone-400 font-roboto">{row.label}</span>
                      <span className="text-[11px] text-primary font-roboto font-medium">{String(row.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="px-5 py-4 border-b border-stone-100">
                  <h3 className="text-xs font-roboto font-semibold text-primary uppercase tracking-wider mb-3">Features &amp; Amenities</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {amenities.map((a) => (
                      <span
                        key={a}
                        className="px-2.5 py-1 text-[11px] font-roboto font-medium text-primary bg-stone-100 rounded-full capitalize whitespace-nowrap"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="px-5 py-5">
                <Link
                  to={`/property/${listing.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-xs font-roboto font-semibold uppercase tracking-widest rounded-sm hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-building-line text-sm" />
                  View Full Property Details
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
