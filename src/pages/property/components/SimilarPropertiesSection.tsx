import { Link } from 'react-router-dom';
import PropertyMeta from '@/components/base/PropertyMeta';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SimilarListing {
  id: string;
  slug: string;
  title: string;
  location: string;
  property_type: string;
  purpose: string;
  price: string;
  priceNote?: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  image: string;
  featured: boolean;
  priceUsd?: number | null;
  currency?: string;
}

interface Props {
  properties: SimilarListing[];
  currentPurpose: string;
}

export default function SimilarPropertiesSection({ properties, currentPurpose }: Props) {
  const { formatPrice } = useCurrency();

  if (properties.length === 0) return null;

  const label = currentPurpose === 'sale' ? 'Similar Properties For Sale' : 'Similar Properties For Rent';

  return (
    <div className="border-t border-[#e5e5e5]" style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-roboto font-bold text-sm uppercase tracking-[0.15em]" style={{ color: '#001731' }}>
            {label}
          </h2>
          <Link
            to={`/${currentPurpose === 'sale' ? 'buy' : 'rent'}`}
            className="text-[10px] font-roboto font-semibold uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: '#555' }}
          >
            View All <i className="ri-arrow-right-line text-[10px]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {properties.map((p) => {
            const dynamicPrice = p.priceUsd != null
              ? formatPrice(p.priceUsd, p.currency, { purpose: p.purpose })
              : p.price;

            return (
              <Link
                key={p.id}
                to={`/property/${p.slug}`}
                className="group block bg-white border border-[#e5e5e5] overflow-hidden hover:border-[#ccc] transition-all duration-200"
                style={{ borderRadius: '2px' }}
              >
                <div className="relative w-full overflow-hidden" style={{ height: '180px' }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.featured && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm whitespace-nowrap text-white" style={{ background: '#1B7C29' }}>
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-roboto font-semibold uppercase tracking-widest mb-1" style={{ color: '#aaa' }}>
                    {p.property_type}
                  </p>
                  <p className="text-sm font-roboto font-bold mb-1" style={{ color: '#012042' }}>{dynamicPrice}</p>
                  <h3 className="text-xs font-roboto font-semibold leading-snug line-clamp-2 mb-1" style={{ color: '#333' }}>
                    {p.title}
                  </h3>
                  <p className="text-[11px] font-roboto truncate" style={{ color: '#888' }}>{p.location}</p>
                  <div className="mt-2">
                    <PropertyMeta
                      beds={p.bedrooms}
                      baths={p.bathrooms}
                      parking={p.parking}
                      iconSize={10}
                      strokeWidth={1.5}
                      textSize="text-[11px] font-roboto"
                      textColor="#888"
                      iconColor="#888"
                      gap="gap-3"
                      innerGap="gap-1"
                      pluralize
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
