import { Link } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Props {
  listing: {
    id: string;
    slug: string;
    title: string;
    cover_image?: string | null;
    price?: number | null;
    currency?: string;
    price_frequency?: string;
    location?: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    size_sqm?: number | null;
    purpose?: string;
    status?: string;
  };
}

export default function AgentListingCard({ listing }: Props) {
  const { formatPrice } = useCurrency();

  const displayPrice = formatPrice(listing.price ?? null, listing.currency, {
    frequency: listing.price_frequency,
    purpose: listing.purpose,
  });

  return (
    <Link
      to={`/property/${listing.slug}`}
      className="group block bg-white border border-[#ece8e1] hover:border-[#d4cfc8] transition-colors overflow-hidden rounded-sm"
    >
      {/* Image */}
      <div className="relative w-full h-52 overflow-hidden bg-[#f5f3ef]">
        {listing.cover_image ? (
          <img
            src={listing.cover_image}
            alt={listing.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="ri-building-4-line text-[#ccc] text-3xl" />
          </div>
        )}
        {/* Purpose tag */}
        {listing.purpose && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white text-[10px] font-semibold tracking-[0.12em] uppercase text-[#0f0f0f]">
            {listing.purpose === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p
          className="text-[#0f0f0f] text-lg font-light leading-tight mb-1 line-clamp-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {displayPrice}
        </p>
        <p className="text-[#888] text-[11px] mb-3 truncate">{listing.title}</p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-[11px] text-[#aaa]">
          {listing.bedrooms != null && (
            <span className="flex items-center gap-1">
              <i className="ri-hotel-bed-line text-xs" />
              {listing.bedrooms} {listing.bedrooms === 1 ? 'bed' : 'beds'}
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="flex items-center gap-1">
              <img
                src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c"
                alt="Bath"
                className="w-3.5 h-3.5 object-contain"
              />
              {listing.bathrooms} {listing.bathrooms === 1 ? 'bath' : 'baths'}
            </span>
          )}
          {listing.size_sqm != null && (
            <span className="flex items-center gap-1">
              <i className="ri-aspect-ratio-line text-xs" />
              {Number(listing.size_sqm).toLocaleString()} m²
            </span>
          )}
        </div>

        {listing.location && (
          <p className="text-[11px] text-[#bbb] mt-2 truncate flex items-center gap-1">
            <i className="ri-map-pin-line text-[10px]" />
            {listing.location}
          </p>
        )}
      </div>
    </Link>
  );
}
