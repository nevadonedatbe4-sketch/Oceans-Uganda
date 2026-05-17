import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';

export interface NbListing {
  id: string;
  slug: string;
  title: string;
  purpose: 'sale' | 'rent';
  property_type: string;
  price: number;
  currency: string;
  price_note: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size_sqm: number;
  cover_image: string;
  featured: boolean;
  listing_date: string;
  short_description: string;
}

interface NbListingCardProps {
  listing: NbListing;
}

export default function NbListingCard({ listing }: NbListingCardProps) {
  const [enquired, setEnquired] = useState(false);
  const { formatPrice } = useCurrency();

  const badge = listing.purpose === 'sale' ? 'FOR SALE' : 'TO LET';
  const badgeBg = listing.purpose === 'sale' ? '#001731' : '#0D5959';

  return (
    <div
      className="bg-white overflow-hidden flex flex-col group cursor-pointer transition-all duration-300"
      style={{ boxShadow: '0 4px 24px rgba(0, 23, 49, 0.10)' }}
    >
      {/* Image */}
      <Link to={`/property/${listing.slug}`} className="relative w-full overflow-hidden flex-shrink-0 block" style={{ height: '220px' }}>
        {listing.cover_image ? (
          <img
            src={listing.cover_image}
            alt={listing.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
            <i className="ri-building-2-line text-4xl text-stone-300" />
          </div>
        )}
        <div
          className="absolute top-3 right-3 px-3 py-1 text-xs font-roboto font-medium text-white rounded-sm whitespace-nowrap"
          style={{ backgroundColor: badgeBg }}
        >
          {badge}
        </div>
        {listing.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-roboto font-medium text-primary bg-golden rounded-sm whitespace-nowrap">
            Featured
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-text-gray text-xs font-roboto mb-1 flex items-center gap-1">
          <i className="ri-map-pin-2-line text-golden text-xs" />
          {listing.location}
        </p>

        <Link to={`/property/${listing.slug}`} className="block">
          <h3 className="text-base font-prata text-primary mb-1 line-clamp-1 hover:text-golden transition-colors">{listing.title}</h3>
        </Link>
        <p className="text-xs text-text-gray font-roboto mb-3 tracking-wider uppercase">{listing.property_type}</p>

        {/* Price & Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mb-3">
          <div>
            <p className="text-primary font-prata text-sm font-semibold">{formatPrice(listing.price, listing.currency, { purpose: listing.purpose })}</p>
            {listing.price_note && (
              <p className="text-text-gray text-xs font-roboto">{listing.price_note}</p>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-text-gray font-roboto">
            {listing.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <i className="ri-hotel-bed-line text-golden" /> {listing.bedrooms}
              </span>
            )}
            {listing.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <img
                  src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c"
                  alt="Bath"
                  className="w-3.5 h-3.5 object-contain"
                />
                {' '}{listing.bathrooms}
              </span>
            )}
            {listing.size_sqm > 0 && (
              <span className="flex items-center gap-1">
                <i className="ri-aspect-ratio-line text-golden" /> {listing.size_sqm}m²
              </span>
            )}
          </div>
        </div>

        {listing.listing_date && (
          <p className="text-xs text-text-gray font-roboto mb-4 flex items-center gap-1">
            <i className="ri-calendar-line text-golden" />
            Listed:{' '}
            <span className="font-medium text-primary/70 ml-1">
              {new Date(listing.listing_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </p>
        )}

        <div className="mt-auto flex gap-2">
          <Link
            to={`/property/${listing.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-white text-xs font-roboto tracking-widest uppercase transition-all duration-200 hover:bg-primary/90 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-eye-line" /> View
          </Link>
          <button
            onClick={() => { setEnquired(true); setTimeout(() => setEnquired(false), 2500); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-primary text-primary text-xs font-roboto tracking-widest uppercase transition-all duration-200 hover:bg-primary hover:text-white cursor-pointer whitespace-nowrap"
          >
            {enquired ? <><i className="ri-check-line" /> Sent</> : <><i className="ri-mail-line" /> Enquire</>}
          </button>
        </div>
      </div>
    </div>
  );
}
