interface ListingsToolbarProps {
  sortBy: 'newest' | 'price_asc' | 'price_desc';
  onSortChange: (sort: 'newest' | 'price_asc' | 'price_desc') => void;
  viewMode: 'grid' | 'row';
  onViewModeChange: (mode: 'grid' | 'row') => void;
  onMobileFiltersOpen?: () => void;
  showMobileFiltersButton?: boolean;
}

const VIEW_MODES: { mode: 'grid' | 'row'; icon: string; title: string }[] = [
  { mode: 'row', icon: 'ri-layout-row-line', title: 'Row view' },
  { mode: 'grid', icon: 'ri-grid-fill', title: 'Grid view' },
];

export default function ListingsToolbar({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onMobileFiltersOpen,
  showMobileFiltersButton = false,
}: ListingsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2">
        {showMobileFiltersButton && (
          <button
            onClick={onMobileFiltersOpen}
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-primary text-xs font-roboto cursor-pointer whitespace-nowrap hover:border-primary/40 transition-colors rounded-sm"
          >
            <i className="ri-filter-3-line" />
            Filters
          </button>
        )}
        <span className="text-xs text-text-gray font-roboto hidden sm:block">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
            className="appearance-none border border-gray-200 rounded-sm pl-3 pr-8 py-1.5 text-xs font-roboto text-primary focus:outline-none focus:border-primary/50 cursor-pointer bg-white transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-text-gray/50 text-xs pointer-events-none" />
        </div>
      </div>

      {/* View toggle — Row / Grid / List */}
      <div className="flex border border-gray-200 rounded-sm overflow-hidden">
        {VIEW_MODES.map(({ mode, icon, title }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-colors ${
              viewMode === mode ? 'bg-primary text-white' : 'text-text-gray hover:bg-gray-50'
            }`}
            title={title}
          >
            <i className={`${icon} text-sm`} />
          </button>
        ))}
      </div>
    </div>
  );
}
