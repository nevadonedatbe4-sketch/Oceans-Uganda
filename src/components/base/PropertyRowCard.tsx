import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BathIcon from '@/components/base/BathIcon';
import { CardDisplaySettings, DEFAULT_CARD_DISPLAY } from '@/pages/admin/listings/types';
import PropertyPreviewModal from '@/components/base/PropertyPreviewModal';
import { recordView } from '@/hooks/useRecentlyViewed';
import PcmPrice from '@/components/base/PcmTooltip';
import { useCurrency } from '@/contexts/CurrencyContext';

// ─── Utility ────────────────────────────────────────────────────────────────

function getAge(listingDate?: string): string {
  if (!listingDate) return 'Recently listed';
  const isoMatch = listingDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const d = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
    const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diffDays === 0) return 'Listed today';
    if (diffDays === 1) return 'Listed 1 day ago';
    if (diffDays < 7) return `Listed ${diffDays} days ago`;
    if (diffDays < 30) return `Listed ${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Listed ${Math.floor(diffDays / 30)} months ago`;
    return `Listed ${Math.floor(diffDays / 365)}y ago`;
  }
  const parts = listingDate.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (parts) {
    const months: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const d = new Date(parseInt(parts[3]), months[parts[2]] ?? 0, parseInt(parts[1]));
    const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diffDays === 0) return 'Listed today';
    if (diffDays < 7) return `Listed ${diffDays} days ago`;
    if (diffDays < 30) return `Listed ${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `Listed ${Math.floor(diffDays / 30)} months ago`;
    return `Listed ${Math.floor(diffDays / 365)}y ago`;
  }
  return `Listed ${listingDate}`;
}

function statusLabel(s: string): string {
  if (s === 'for_sale') return 'FOR SALE';
  if (s === 'for_rent') return 'FOR RENT';
  return s.toUpperCase();
}

function tagBg(_label: string): string {
  return '#30343a';
}

// ─── Inline SVG Icons ───────────────────────────────────────────────────────

const PinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 21s-6-5.33-6-11a6 6 0 1112 0c0 5.67-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const BedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 11h18" />
    <path d="M4 11V7h6a3 3 0 013 3v1" />
    <path d="M13 11V9h5a2 2 0 012 2v0" />
    <path d="M4 11v5" />
    <path d="M20 11v5" />
    <path d="M2 16h20" />
  </svg>
);



const CarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 14l1.5-4h11L19 14" />
    <path d="M4 14h16v4H4z" />
    <circle cx="7" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
    <path d="M8.5 10l1.2-2h4.6l1.2 2" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.9">
    <path d="M4 6h16v12H4z" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.9">
    <path d="M15 3h6v6" />
    <path d="M21 3l-7 7" />
    <path d="M9 21H3v-6" />
    <path d="M3 21l7-7" />
  </svg>
);

// ─── Main Export ────────────────────────────────────────────────────────────

export interface PropertyRowData {
  id: string;
  slug: string;
  title: string;
  location: string;
  city?: string | null;
  country?: string | null;
  listing_status: string[];
  featured: boolean;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  price: string;
  priceUsd?: number | null;
  currency?: string;
  priceNote?: string;
  secondaryPrice?: string | null;
  secondaryPriceLabel?: string | null;
  image: string;
  images?: string[];
  listingDate?: string;
  cardDisplay?: CardDisplaySettings;
}

interface PropertyRowCardProps {
  property: PropertyRowData;
}

export default function PropertyRowCard({ property }: PropertyRowCardProps) {
  const navigate = useNavigate();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const { formatPrice } = useCurrency();

  // Determine target page based on listing status
  const isRent = property.listing_status.some((s) =>
    s.toLowerCase().includes('rent') || s.toLowerCase().includes('let')
  );
  const typePage = isRent ? '/rent' : '/buy';

  const locationParts = [property.location, property.city, property.country]
    .filter(Boolean)
    .join(', ');

  const badges = property.listing_status.map(statusLabel);
  const cardDisplay: CardDisplaySettings = property.cardDisplay ?? { ...DEFAULT_CARD_DISPLAY };

  const metaItems = [
    { Icon: BedIcon, label: 'Beds', value: property.bedrooms },
    { isBath: true as const, label: 'Baths', value: property.bathrooms },
    { Icon: CarIcon, label: 'Parking', value: property.parking },
  ].filter((item) => item.value !== null && item.value !== undefined);

  const handleCardClick = useCallback(() => {
    if (!property.slug) return;
    recordView({
      id: property.id,
      slug: property.slug,
      title: property.title,
      location: locationParts || property.location,
      price: property.price,
      image: property.image,
      property_type: property.property_type,
      beds: property.bedrooms,
      baths: property.bathrooms,
    });
    navigate(`/property/${property.slug}`);
  }, [property, locationParts, navigate]);

  const handleToggleSave = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((v) => !v);
  }, []);

  // Dynamic currency-aware price
  const priceDisplay = property.priceUsd != null
    ? formatPrice(property.priceUsd, property.currency, { purpose: isRent ? 'rent' : 'sale' })
    : property.price;

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group border border-[#e8e8e8] bg-white hover:border-[#c8c8c8] transition-all duration-200 cursor-pointer"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.11)'}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'}
      >
        <div className="grid grid-cols-1 gap-0 md:grid-cols-[320px_1fr]">

          {/* ── Image Column ── */}
          <div className="flex flex-col flex-shrink-0">
          <div className="relative h-[215px] overflow-hidden bg-[#ececec]">
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />

            {/* Featured badge */}
            {property.featured && (
              <div className="absolute left-3 top-3 z-10">
                <span
                  className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white whitespace-nowrap"
                  style={{ background: '#1B7C29', borderRadius: '4px' }}
                >
                  Featured
                </span>
              </div>
            )}

            {/* Status badges */}
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 items-end">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white whitespace-nowrap"
                  style={{ background: tagBg(badge), borderRadius: '4px' }}
                >
                  {badge}
                </span>
              ))}
            </div>



            {/* Expand icon on hover */}
            <button
              onClick={(e) => { e.stopPropagation(); setQuickViewOpen(true); }}
              className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 flex items-center justify-center text-white cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.30)', borderRadius: '4px' }}
            >
              <ExpandIcon />
            </button>
          </div>

          {cardDisplay.show_listing_date && (
            <div className="px-3 pt-4 pb-1 flex items-center gap-1.5">
              <i className="ri-time-line text-[12px]" style={{ color: '#0D5959' }} />
              <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: '#0D5959' }}>
                {getAge(property.listingDate)}
              </span>
            </div>
          )}
          </div>

          {/* ── Info Column ── */}
          <div className="flex flex-col justify-between px-6 py-5 min-h-[215px]">

            {/* Top section */}
            <div className="flex flex-col gap-0">
              {/* Property type — clickable: filters listings by this type */}
              {cardDisplay.show_property_type && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`${typePage}?type=${encodeURIComponent(property.property_type)}`);
                  }}
                  className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#1d1d1d] hover:text-[#0D5959] transition-colors duration-150 cursor-pointer text-left group/type"
                  title={`Browse all ${property.property_type} listings`}
                >
                  {property.property_type}
                  <i className="ri-arrow-right-s-line text-[11px] ml-0.5 opacity-0 group-hover/type:opacity-100 transition-opacity duration-150" />
                </button>
              )}

              {/* Price */}
              {cardDisplay.show_price && (
                <div className="mt-2">
                  <PcmPrice
                    price={property.price}
                    priceUsd={property.priceUsd}
                    currency={property.currency}
                    purpose={isRent ? 'rent' : 'sale'}
                    className="text-[19px] font-bold text-[#111111] leading-tight whitespace-nowrap"
                    tooltipSide="bottom"
                  />
                  {property.secondaryPrice && (
                    <span className="text-[12px] text-[#888] ml-2">
                      {property.secondaryPriceLabel ? `${property.secondaryPriceLabel}: ` : ''}
                      {property.secondaryPrice}
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 className="mt-4 font-serif text-[21px] leading-[1.32] text-[#1f1f1f] max-w-[680px] group-hover:text-[#002349] transition-colors duration-200">
                {property.title}
              </h3>

              {/* Location */}
              {cardDisplay.show_location && (
                <div className="mt-3 flex items-center gap-2 text-[14px] text-[#6b6b6b]">
                  <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-[#6b6b6b]">
                    <PinIcon />
                  </span>
                  <span className="truncate">{locationParts || property.location}</span>
                </div>
              )}

              {/* Meta — Beds / Baths / Parking */}
              {cardDisplay.show_meta && metaItems.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-2">
                  {metaItems.map((item) => (
                    <span key={item.label} className="flex items-center gap-2 text-[15px] text-[#111111]">
                      <span className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0 text-[#444]">
                        {'isBath' in item ? <BathIcon size={18} /> : <item.Icon />}
                      </span>
                      <span className="font-medium">{item.value}</span>
                      <span className="text-[13px] text-[#888] -ml-1">{item.label}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Footer row ── */}
            <div className="mt-5 pt-4 border-t border-[#f0f0f0] flex items-center justify-between gap-3">

              {/* Left: save heart */}
              <div className="flex items-center gap-3">
                {cardDisplay.show_save_button && (
                  <button
                    onClick={handleToggleSave}
                    title={saved ? 'Saved' : 'Save'}
                    className={`w-7 h-7 flex items-center justify-center transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      saved ? 'text-rose-500' : 'text-[#c0c0c0] hover:text-rose-400'
                    }`}
                  >
                    <i className={saved ? 'ri-heart-fill text-base' : 'ri-heart-line text-base'} />
                  </button>
                )}
              </div>

              {/* Right: Email + Call buttons */}
              <div className="flex items-center gap-2">
                {/* Email button */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#d0d0d0] text-[#333] text-[11px] font-bold uppercase tracking-[0.08em] hover:border-[#0D5959] hover:text-[#0D5959] transition-colors duration-200 whitespace-nowrap cursor-pointer"
                  style={{ height: '36px' }}
                >
                  <span className="w-4 h-4 flex items-center justify-center"><MailIcon /></span>
                  Email
                </button>

                {/* Call button */}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1d1d1d] text-white text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-[#0D5959] transition-colors duration-200 whitespace-nowrap cursor-pointer"
                  style={{ height: '36px' }}
                >
                  <i className="ri-phone-line text-[13px]" />
                  Call
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {quickViewOpen && property.slug && (
        <PropertyPreviewModal
          slug={property.slug}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
