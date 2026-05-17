import { useState } from 'react';
import type { NeighborhoodOption } from '@/hooks/useListings';
import type { ListingFilters } from './ListingsFilterBar';

interface PriceBracket {
  label: string;
  min: number | null;
  max: number | null;
}

interface ListingsSidebarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  onClear: () => void;
  neighborhoods: NeighborhoodOption[];
  priceBrackets: PriceBracket[];
  typeOptions: string[];
  showFurnished?: boolean;
  furnishedOptions?: string[];
  totalResults: number;
  loading: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const BEDS_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
];

function SidebarSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-gray-50/60 transition-colors"
      >
        <span className="text-xs font-roboto font-semibold text-primary uppercase tracking-wider">
          {title}
        </span>
        <i className={`text-text-gray text-sm ${open ? 'ri-subtract-line' : 'ri-add-line'}`} />
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}

export default function ListingsSidebar({
  filters,
  onChange,
  onClear,
  neighborhoods,
  priceBrackets,
  typeOptions,
  showFurnished = false,
  furnishedOptions = [],
  totalResults,
  loading,
  mobileOpen,
  onMobileClose,
}: ListingsSidebarProps) {
  const set = (partial: Partial<ListingFilters>) => onChange({ ...filters, ...partial });

  const hasAnyFilter =
    filters.type !== '' ||
    filters.area !== '' ||
    filters.priceBracket !== 'Any Price' ||
    filters.beds !== '' ||
    (filters.furnished ?? '') !== '' ||
    filters.search.trim() !== '';

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <p className="text-[10px] font-roboto text-text-gray uppercase tracking-widest mb-0.5">
            Filters
          </p>
          <p className="text-primary font-prata text-base leading-tight">
            {loading ? '...' : `${totalResults} ${totalResults === 1 ? 'Property' : 'Properties'}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasAnyFilter && (
            <button
              onClick={onClear}
              className="text-xs text-golden font-roboto underline cursor-pointer whitespace-nowrap hover:text-golden/80 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onMobileClose}
            className="md:hidden w-8 h-8 flex items-center justify-center text-primary cursor-pointer"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-text-gray/50 text-sm" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search title or area..."
            className="w-full border border-gray-200 rounded-sm pl-9 pr-4 py-2 text-xs font-roboto text-primary placeholder:text-text-gray/50 focus:outline-none focus:border-primary/40 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => set({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-gray/50 hover:text-primary cursor-pointer"
            >
              <i className="ri-close-line text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Property Type */}
      <SidebarSection title="Property Type">
        <div className="flex flex-wrap gap-1.5">
          {typeOptions
            .filter((t) => t !== 'All Types')
            .map((t) => (
              <button
                key={t}
                onClick={() => set({ type: filters.type === t ? '' : t })}
                className={`px-3 py-1.5 text-xs font-roboto cursor-pointer whitespace-nowrap transition-colors rounded-sm ${
                  filters.type === t
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 text-text-gray hover:border-primary hover:text-primary'
                }`}
              >
                {t}
              </button>
            ))}
        </div>
      </SidebarSection>

      {/* Price Range */}
      <SidebarSection title="Price Range">
        <div className="space-y-1.5">
          {priceBrackets.map((b) => (
            <button
              key={b.label}
              onClick={() =>
                set({ priceBracket: filters.priceBracket === b.label ? 'Any Price' : b.label })
              }
              className={`w-full text-left px-3 py-2 text-xs font-roboto cursor-pointer transition-colors flex items-center justify-between rounded-sm ${
                filters.priceBracket === b.label
                  ? 'bg-primary/8 text-primary font-medium'
                  : 'text-text-gray hover:text-primary hover:bg-gray-50'
              }`}
            >
              {b.label}
              {filters.priceBracket === b.label && (
                <i className="ri-check-line text-primary text-xs" />
              )}
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* Bedrooms */}
      <SidebarSection title="Bedrooms">
        <div className="flex gap-1.5 flex-wrap">
          {BEDS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set({ beds: filters.beds === opt.value ? '' : opt.value })}
              className={`flex-1 min-w-[40px] py-2 text-xs font-roboto cursor-pointer whitespace-nowrap transition-colors rounded-sm ${
                filters.beds === opt.value
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-text-gray hover:border-primary hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* Area / Neighbourhood */}
      <SidebarSection title="Area">
        <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => set({ area: '' })}
            className={`w-full text-left px-3 py-2 text-xs font-roboto cursor-pointer transition-colors rounded-sm ${
              filters.area === ''
                ? 'bg-primary/8 text-primary font-medium'
                : 'text-text-gray hover:text-primary hover:bg-gray-50'
            }`}
          >
            All Areas
          </button>
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => set({ area: filters.area === n.name ? '' : n.name })}
              className={`w-full text-left px-3 py-2 text-xs font-roboto cursor-pointer transition-colors flex items-center justify-between rounded-sm ${
                filters.area === n.name
                  ? 'bg-primary/8 text-primary font-medium'
                  : 'text-text-gray hover:text-primary hover:bg-gray-50'
              }`}
            >
              {n.name}
              {filters.area === n.name && <i className="ri-check-line text-primary text-xs" />}
            </button>
          ))}
        </div>
      </SidebarSection>

      {/* Furnished */}
      {showFurnished && furnishedOptions.length > 0 && (
        <SidebarSection title="Furnished" defaultOpen={false}>
          <div className="space-y-1.5">
            {furnishedOptions.map((o) => {
              const val = o === 'Any' ? '' : o;
              return (
                <button
                  key={o}
                  onClick={() => set({ furnished: (filters.furnished ?? '') === val ? '' : val })}
                  className={`w-full text-left px-3 py-2 text-xs font-roboto cursor-pointer transition-colors flex items-center justify-between rounded-sm ${
                    (filters.furnished ?? '') === val
                      ? 'bg-primary/8 text-primary font-medium'
                      : 'text-text-gray hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {o}
                  {(filters.furnished ?? '') === val && val !== '' && (
                    <i className="ri-check-line text-primary text-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </SidebarSection>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-l border-gray-100 bg-white self-start sticky top-[64px] max-h-[calc(100vh-64px)] overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="relative bg-white w-72 max-w-[85vw] h-full shadow-xl z-10 overflow-hidden">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
