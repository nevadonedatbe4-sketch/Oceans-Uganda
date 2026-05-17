import { Link } from 'react-router-dom';
import PropertyCard from '@/components/base/PropertyCard';
import type { Property } from '@/types/property';

interface SearchResultsGridProps {
  properties: Property[];
  loading: boolean;
  viewMode: 'grid' | 'list';
  onClearFilters: () => void;
}

export default function SearchResultsGrid({
  properties,
  loading,
  viewMode,
  onClearFilters,
}: SearchResultsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-sm h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 bg-gray-50 rounded-full">
          <i className="ri-search-line text-3xl text-gray-300" />
        </div>
        <p className="text-primary font-prata text-xl mb-2">No properties found</p>
        <p className="text-text-gray font-roboto text-sm mb-6 max-w-sm mx-auto">
          We couldn&apos;t find any properties matching your current filters. Try broadening your search.
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary text-primary text-xs font-roboto uppercase tracking-wider cursor-pointer hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
        >
          <i className="ri-refresh-line" />
          Clear all filters
        </button>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {properties.map((property) =>
          property.slug ? (
            <Link key={property.id} to={`/property/${property.slug}`} className="block">
              <ListPropertyCard property={property} />
            </Link>
          ) : (
            <ListPropertyCard key={property.id} property={property} />
          )
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

function ListPropertyCard({ property }: { property: Property }) {
  return (
    <div
      className="flex bg-white overflow-hidden group cursor-pointer transition-all duration-200"
      style={{ boxShadow: '0 2px 12px rgba(0,23,49,0.08)' }}
    >
      <div className="relative w-56 flex-shrink-0 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 text-xs font-roboto font-medium rounded-sm text-white whitespace-nowrap ${
              property.category === 'sale' ? 'bg-primary' : 'bg-accent'
            }`}
          >
            {property.badge}
          </span>
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <p className="text-text-gray text-xs font-roboto mb-1 flex items-center gap-1">
            <i className="ri-map-pin-2-line text-golden" />
            {property.location}
          </p>
          <h3 className="text-base font-prata text-primary mb-1">{property.title}</h3>
          <p className="text-xs text-text-gray font-roboto uppercase tracking-wider mb-2">{property.type}</p>
          <p className="text-text-gray font-roboto text-xs line-clamp-2 leading-relaxed">{property.description}</p>
        </div>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <div>
            <p className="text-primary font-prata text-sm font-semibold">{property.price}</p>

          </div>
          <div className="flex items-center gap-4 text-xs text-text-gray font-roboto">
            <span className="flex items-center gap-1">
              <i className="ri-hotel-bed-line text-golden" /> {property.beds} bd
            </span>
            <span className="flex items-center gap-1">
              <img
                src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c"
                alt="Bath"
                className="w-3.5 h-3.5 object-contain"
              />
              {' '}{property.baths} ba
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-parking-box-line text-golden" /> {property.parking}
            </span>
            <span className="text-xs font-roboto text-text-gray/60">Listed {property.listingDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
