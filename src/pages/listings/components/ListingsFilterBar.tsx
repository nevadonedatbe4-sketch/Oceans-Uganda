import type { NeighborhoodOption } from '@/hooks/useListings';

export interface ListingFilters {
  search: string;
  type: string;
  area: string;
  priceBracket: string;
  beds: string;
  furnished?: string;
  currency?: string;
  baths?: string;
}

interface PriceBracket {
  label: string;
  min: number | null;
  max: number | null;
}

interface ListingsFilterBarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  onClear: () => void;
  neighborhoods: NeighborhoodOption[];
  priceBrackets: PriceBracket[];
  bedsOptions: string[];
  typeOptions: string[];
  showFurnished?: boolean;
  furnishedOptions?: string[];
  hasActiveFilters: boolean;
  resultCount: number;
  loading: boolean;
}

export default function ListingsFilterBar({
  filters,
  onChange,
  onClear,
  neighborhoods,
  priceBrackets,
  bedsOptions,
  typeOptions,
  showFurnished = false,
  furnishedOptions = [],
  hasActiveFilters,
  resultCount,
  loading,
}: ListingsFilterBarProps) {
  const set = (partial: Partial<ListingFilters>) => onChange({ ...filters, ...partial });

  return (
    <div className="bg-white border-b border-gray-100 sticky top-[64px] z-40">
      {/* Main filter row */}
      <div className="px-4 md:px-8 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-text-gray/50 text-sm" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="Search by title, area..."
              className="w-full border border-gray-200 rounded-md pl-9 pr-4 py-2 text-sm font-roboto text-primary placeholder:text-text-gray/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => set({ search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray/50 hover:text-primary cursor-pointer"
              >
                <i className="ri-close-line text-sm" />
              </button>
            )}
          </div>

          {/* Type */}
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => set({ type: e.target.value })}
              className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm font-roboto text-primary focus:outline-none focus:border-primary/50 cursor-pointer bg-white transition-colors"
            >
              {typeOptions.map((o) => (
                <option key={o} value={o === 'All Types' ? '' : o}>
                  {o}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-text-gray/50 text-sm pointer-events-none" />
          </div>

          {/* Area */}
          <div className="relative">
            <select
              value={filters.area}
              onChange={(e) => set({ area: e.target.value })}
              className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm font-roboto text-primary focus:outline-none focus:border-primary/50 cursor-pointer bg-white transition-colors"
            >
              <option value="">All Areas</option>
              {neighborhoods.map((n) => (
                <option key={n.id} value={n.name}>{n.name}</option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-text-gray/50 text-sm pointer-events-none" />
          </div>

          {/* Price */}
          <div className="relative">
            <select
              value={filters.priceBracket}
              onChange={(e) => set({ priceBracket: e.target.value })}
              className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm font-roboto text-primary focus:outline-none focus:border-primary/50 cursor-pointer bg-white transition-colors"
            >
              {priceBrackets.map((b) => (
                <option key={b.label} value={b.label}>{b.label}</option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-text-gray/50 text-sm pointer-events-none" />
          </div>

          {/* Beds */}
          <div className="relative">
            <select
              value={filters.beds}
              onChange={(e) => set({ beds: e.target.value })}
              className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm font-roboto text-primary focus:outline-none focus:border-primary/50 cursor-pointer bg-white transition-colors"
            >
              {bedsOptions.map((o) => (
                <option key={o} value={o === 'Any Beds' ? '' : o.replace('+', '')}>
                  {o}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-text-gray/50 text-sm pointer-events-none" />
          </div>

          {/* Furnished (optional) */}
          {showFurnished && furnishedOptions.length > 0 && (
            <div className="relative">
              <select
                value={filters.furnished ?? ''}
                onChange={(e) => set({ furnished: e.target.value })}
                className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm font-roboto text-primary focus:outline-none focus:border-primary/50 cursor-pointer bg-white transition-colors"
              >
                {furnishedOptions.map((o) => (
                  <option key={o} value={o === 'Any' ? '' : o}>{o}</option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-text-gray/50 text-sm pointer-events-none" />
            </div>
          )}

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-roboto text-text-gray border border-gray-200 rounded-md hover:border-primary/40 hover:text-primary cursor-pointer whitespace-nowrap transition-colors"
            >
              <i className="ri-close-line" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count bar */}
      <div className="px-4 md:px-8 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs font-roboto text-text-gray">
          {loading ? (
            <span className="flex items-center gap-1.5">
              <i className="ri-loader-4-line animate-spin text-golden" />
              Loading...
            </span>
          ) : (
            <>
              <span className="text-primary font-prata text-base mr-1">{resultCount}</span>
              {resultCount === 1 ? 'property' : 'properties'} found
              {hasActiveFilters && (
                <span className="ml-1.5 text-golden">(filtered)</span>
              )}
            </>
          )}
        </p>
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5">
            {filters.search && (
              <FilterTag label={`"${filters.search}"`} onRemove={() => set({ search: '' })} />
            )}
            {filters.type && (
              <FilterTag label={filters.type} onRemove={() => set({ type: '' })} />
            )}
            {filters.area && (
              <FilterTag label={filters.area} onRemove={() => set({ area: '' })} />
            )}
            {filters.priceBracket && filters.priceBracket !== 'Any Price' && (
              <FilterTag label={filters.priceBracket} onRemove={() => set({ priceBracket: 'Any Price' })} />
            )}
            {filters.beds && (
              <FilterTag label={`${filters.beds}+ Beds`} onRemove={() => set({ beds: '' })} />
            )}
            {filters.furnished && filters.furnished !== '' && (
              <FilterTag label={filters.furnished} onRemove={() => set({ furnished: '' })} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-xs font-roboto rounded-full cursor-pointer hover:bg-primary/15 transition-colors whitespace-nowrap"
    >
      {label}
      <i className="ri-close-line text-xs" />
    </button>
  );
}
