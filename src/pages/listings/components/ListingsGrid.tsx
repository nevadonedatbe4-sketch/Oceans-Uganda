import PropertyCard from '@/components/base/PropertyCard';
import PropertyRowCard from '@/components/base/PropertyRowCard';
import LogoLoading from '@/components/base/LogoLoading';
import type { Property } from '@/types/property';

interface ListingsGridProps {
  properties: Property[];
  loading: boolean;
  viewMode: 'grid' | 'row';
  columns?: 2 | 3 | 4;
  onClearFilters: () => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export default function ListingsGrid({
  properties,
  loading,
  viewMode,
  columns = 3,
  onClearFilters,
  emptyTitle = 'No properties found',
  emptySubtitle = "Try adjusting your filters to find what you're looking for.",
}: ListingsGridProps) {
  const colClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LogoLoading label="Loading properties…" size={64} />
      </div>
    );
  }


  if (properties.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-5 bg-gray-50 rounded-full">
          <i className="ri-building-line text-3xl text-gray-300" />
        </div>
        <p className="text-primary font-prata text-xl mb-2">{emptyTitle}</p>
        <p className="text-text-gray font-roboto text-sm mb-6 max-w-sm mx-auto">{emptySubtitle}</p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-primary text-primary text-xs font-roboto uppercase tracking-wider cursor-pointer hover:bg-primary hover:text-white transition-colors whitespace-nowrap rounded-sm"
        >
          <i className="ri-refresh-line" />
          Clear all filters
        </button>
      </div>
    );
  }

  // ── Row view ──────────────────────────────────────────────────────────────
  if (viewMode === 'row') {
    return (
      <div className="flex flex-col gap-4">
        {properties.map((property) => {
          const rowData = {
            id: String(property.id),
            slug: property.slug || '',
            title: property.title,
            location: property.location,
            listing_status:
              property.category === 'sale'
                ? ['for_sale']
                : property.category === 'rent'
                ? ['for_rent']
                : [],
            featured: property.featured ?? false,
            property_type: property.type,
            bedrooms: property.beds ?? null,
            bathrooms: property.baths ?? null,
            parking: property.parking ?? null,
            price: property.price,
            priceUsd: property.priceUsd,
            currency: property.currency,
            priceNote: property.priceNote,
            image: property.image,
            images: property.images,
            listingDate: property.listingDate,
          };
          return <PropertyRowCard key={property.id} property={rowData} />;
        })}
      </div>
    );
  }

  // ── Grid view ─────────────────────────────────────────────────────────────
  return (
    <div className={`grid ${colClass} gap-6`}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}


