import { Link } from 'react-router-dom';
import LogoLoading from '@/components/base/LogoLoading';
import type { Property } from '@/types/property';

interface AllPropertiesGridProps {
  properties: Property[];
  loading: boolean;
  visibleCount: number;
  onLoadMore: () => void;
  error?: string | null;
}

function PropertyGridCard({ property }: { property: Property }) {
  const isRent = property.category === 'rent';
  const purposeLabel = isRent ? 'FOR RENT' : 'FOR SALE';
  const inner = (
    <div className="bg-white border border-gray-200 overflow-hidden group cursor-pointer flex flex-col w-full h-full transition-all duration-300 hover:border-gray-300 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: '210px' }}>
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0">
          <span
            className="block px-3 py-1.5 text-[10px] font-roboto font-bold uppercase tracking-wider text-white whitespace-nowrap"
            style={{ background: '#1a6b3a' }}
          >
            {purposeLabel}
          </span>
        </div>
        {property.featured && (
          <div className="absolute top-0 left-0">
            <span
              className="block px-3 py-1.5 text-[10px] font-roboto font-bold uppercase tracking-wider text-white whitespace-nowrap"
              style={{ background: '#c8a951' }}
            >
              FEATURED
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-1">
          {property.type || 'PROPERTY'}
        </p>
        <p className="font-roboto font-bold text-xl text-stone-900 leading-tight mb-2 whitespace-nowrap">
          {property.price}
        </p>
        <h3 className="font-roboto text-sm font-semibold leading-snug line-clamp-2 mb-2 text-stone-700 group-hover:text-stone-900 transition-colors">
          {property.title}
        </h3>
        <p className="text-xs font-roboto text-stone-400 flex items-center gap-1 mb-3 truncate">
          <i className="ri-map-pin-line shrink-0 text-xs" />
          {property.location}
        </p>
        <div className="flex items-center gap-3 text-xs font-roboto text-stone-500 mb-4">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <i className="ri-hotel-bed-line text-stone-400" />
            <span>Beds {property.beds ?? 0}</span>
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <img
              src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c"
              alt="Bath"
              className="w-3.5 h-3.5 object-contain"
            />
            <span>Baths {property.baths ?? 0}</span>
          </span>
          {(property.parking ?? 0) > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <i className="ri-car-line text-stone-400" />
              <span>Parking {property.parking}</span>
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-auto">
          <a
            href="tel:+256741573131"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-primary text-primary text-xs font-roboto font-semibold uppercase tracking-wider hover:bg-primary hover:text-white transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-phone-line text-sm" />
            Call
          </a>
        </div>
      </div>
    </div>
  );

  return property.slug ? (
    <Link to={`/property/${property.slug}`} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default function AllPropertiesGrid({
  properties,
  loading,
  visibleCount,
  onLoadMore,
  error,
}: AllPropertiesGridProps) {
  const visible = properties.slice(0, visibleCount);
  const hasMore = visibleCount < properties.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LogoLoading label="Loading properties…" size={64} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
          <i className="ri-error-warning-line text-4xl text-red-400" />
        </div>
        <p className="font-prata text-red-600 text-lg mb-2">Something went wrong</p>
        <p className="text-stone-400 font-roboto text-sm">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
          <i className="ri-search-line text-4xl text-gray-300" />
        </div>
        <p className="font-prata text-primary text-lg mb-2">No properties found</p>
        <p className="text-stone-400 font-roboto text-sm">Try a different neighbourhood or search term.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
        {visible.map((p) => (
          <PropertyGridCard key={p.id} property={p} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 px-10 py-3.5 border border-primary text-primary text-xs font-roboto font-semibold uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer whitespace-nowrap"
          >
            Load More
          </button>
        </div>
      )}

      {!hasMore && properties.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-stone-400 font-roboto text-xs">
            Showing all <span className="text-primary font-semibold">{properties.length}</span> properties
          </p>
        </div>
      )}
    </div>
  );
}
