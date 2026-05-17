import { useState } from 'react';
import { ListingFormData, CardDisplaySettings } from '@/pages/admin/listings/types';

interface Props {
  data: ListingFormData;
  cardDisplay: CardDisplaySettings;
  onClose: () => void;
}

function formatPrice(data: ListingFormData): string {
  if (!data.price) return 'Price on request';
  const num = parseFloat(data.price);
  if (isNaN(num)) return 'Price on request';
  const formatted = new Intl.NumberFormat('en-US').format(num);
  return `${data.currency} ${formatted}`;
}

function getPriceNote(data: ListingFormData): string {
  if (!data.price_frequency) return '';
  const map: Record<string, string> = {
    monthly: ' pcm',
    weekly: '/wk',
    yearly: '/yr',
  };
  return map[data.price_frequency] ?? '';
}

function getListingAge(dateStr: string): string {
  if (!dateStr) return 'Recently listed';
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Listed today';
  if (diffDays === 1) return 'Listed yesterday';
  if (diffDays < 7) return `Listed ${diffDays} days ago`;
  if (diffDays < 30) return `Listed ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `Listed ${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `Listed ${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

function badgeStyle(badge: string): string {
  const lower = badge.toLowerCase();
  if (lower.includes('sale')) return 'bg-[#b8965a] text-white';
  if (lower.includes('rent') || lower.includes('let')) return 'bg-teal-600 text-white';
  if (lower.includes('new')) return 'bg-amber-500 text-white';
  return 'bg-gray-600 text-white';
}

export default function CardPreviewModal({ data, cardDisplay, onClose }: Props) {
  const [saved, setSaved] = useState(false);

  const price = formatPrice(data);
  const priceNote = getPriceNote(data);
  const locationParts = [data.location, data.city, data.country].filter(Boolean).join(', ');
  const badges = (data.listing_status ?? []).map((s) =>
    s === 'for_sale' ? 'FOR SALE' : s === 'for_rent' ? 'FOR RENT' : s.toUpperCase(),
  );
  const coverImage = data.cover_image || data.images?.[0]?.url || '';
  const hasFooter = cardDisplay.show_listing_date || cardDisplay.show_contact_agent || cardDisplay.show_save_button;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Card Preview</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              This is how the property card will appear on listing pages
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-base" />
          </button>
        </div>

        {/* Preview area */}
        <div className="p-6 bg-[#f7f5f0]">
          <div className="flex flex-col bg-white rounded-sm border border-gray-100 overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.07)]">

            {/* Main row */}
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative w-full sm:w-56 flex-shrink-0 overflow-hidden" style={{ minHeight: '180px' }}>
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={data.title || 'Property'}
                    className="w-full h-full object-cover object-top"
                    style={{ minHeight: '180px' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2" style={{ minHeight: '180px' }}>
                    <span className="w-8 h-8 flex items-center justify-center">
                      <i className="ri-image-2-line text-2xl text-gray-300" />
                    </span>
                    <span className="text-[11px] text-gray-300">No image</span>
                  </div>
                )}
                {data.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white uppercase tracking-widest rounded-sm whitespace-nowrap">
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 px-5 py-4 flex flex-col gap-2.5">

                {/* Row 1 — type + price */}
                {(cardDisplay.show_property_type || cardDisplay.show_price) && (
                  <div className="flex items-start justify-between gap-3">
                    {cardDisplay.show_property_type && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {data.property_type || 'Property Type'}
                      </span>
                    )}
                    {cardDisplay.show_price && (
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-[#b8965a] text-base leading-tight">
                          {price}
                          {priceNote && (
                            <span className="text-xs text-gray-400 font-normal ml-1">{priceNote}</span>
                          )}
                        </p>
                        {data.secondary_price && (
                          <p className="text-gray-400 text-[11px] mt-0.5">
                            {data.secondary_price_label ? `${data.secondary_price_label}: ` : ''}
                            <span className="text-[#b8965a]/60">
                              {data.currency} {new Intl.NumberFormat('en-US').format(parseFloat(data.secondary_price))}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Row 2 — badges */}
                {cardDisplay.show_badges && badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {badges.map((badge) => (
                      <span
                        key={badge}
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap ${badgeStyle(badge)}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Row 3 — title */}
                <h3 className="font-semibold text-[#1a1a2e] text-sm leading-snug line-clamp-2">
                  {data.title || 'Property Title'}
                </h3>

                {/* Row 4 — location */}
                {cardDisplay.show_location && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                      <i className="ri-map-pin-2-line text-gray-400 text-xs" />
                    </span>
                    {locationParts || 'Location not set'}
                  </p>
                )}

                {/* Row 5 — meta */}
                {cardDisplay.show_meta && (
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    {data.bedrooms && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-hotel-bed-line text-gray-400 text-sm" />
                        </span>
                        Beds {data.bedrooms}
                      </span>
                    )}
                    {data.bathrooms && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-drop-line text-gray-400 text-sm" />
                        </span>
                        Baths {data.bathrooms}
                      </span>
                    )}
                    {data.parking && data.parking !== '0' && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-parking-box-line text-gray-400 text-sm" />
                        </span>
                        Parking {data.parking}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer bar */}
            {hasFooter && (
              <div className="flex items-center justify-between px-5 py-2 border-t border-gray-100">
                {cardDisplay.show_listing_date ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span className="w-3.5 h-3.5 flex items-center justify-center">
                      <i className="ri-time-line text-xs" />
                    </span>
                    {getListingAge(data.listing_date)}
                  </span>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-2">
                  {cardDisplay.show_save_button && (
                    <button
                      type="button"
                      onClick={() => setSaved((v) => !v)}
                      className={`w-7 h-7 flex items-center justify-center rounded-sm transition-all cursor-pointer ${
                        saved ? 'text-rose-500 bg-rose-50' : 'text-gray-300 hover:text-rose-400 hover:bg-rose-50'
                      }`}
                    >
                      <i className={saved ? 'ri-heart-fill' : 'ri-heart-line'} />
                    </button>
                  )}

                  {cardDisplay.show_save_button && cardDisplay.show_contact_agent && (
                    <span className="w-px h-4 bg-gray-200" />
                  )}

                  {cardDisplay.show_contact_agent && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1a1a2e] uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-[#b8965a] transition-colors">
                      <span className="w-3.5 h-3.5 flex items-center justify-center">
                        <i className="ri-phone-line text-xs" />
                      </span>
                      Contact Agent
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
          <p className="text-[11px] text-gray-400">
            {CARD_DISPLAY_FIELDS_COUNT - Object.values(cardDisplay).filter(Boolean).length > 0
              ? `${Object.values(cardDisplay).filter((v) => !v).length} field${Object.values(cardDisplay).filter((v) => !v).length > 1 ? 's' : ''} hidden`
              : 'All fields visible'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

const CARD_DISPLAY_FIELDS_COUNT = 8;
