import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ListingFilters } from './ListingsFilterBar';

interface PriceBracket {
  label: string;
  min: number | null;
  max: number | null;
}

interface DesktopTopSearchBarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  onClear: () => void;
  priceBrackets: PriceBracket[];
  typeOptions: string[];
  neighborhoods?: { id: string; name: string }[];
  purpose: 'sale' | 'rent';
  showFurnished?: boolean;
}

const BEDS_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
];

function DropItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm font-roboto transition-colors cursor-pointer whitespace-nowrap flex items-center justify-between gap-3 ${
        active ? 'text-primary font-semibold bg-primary/5' : 'text-stone-600 hover:bg-[#f5f5f5]'
      }`}
    >
      <span>{label}</span>
      {active && <i className="ri-check-line text-xs text-primary" />}
    </button>
  );
}

function FilterDropdown({
  label,
  value,
  active,
  children,
  onOpen,
  isOpen,
}: {
  label: string;
  value: string;
  active: boolean;
  children: React.ReactNode;
  onOpen: () => void;
  isOpen: boolean;
}) {
  return (
    <div className="relative flex-1 min-w-[130px]">
      <button
        type="button"
        onClick={onOpen}
        className={`w-full flex flex-col items-start gap-0.5 px-4 py-3 rounded-sm border transition-all cursor-pointer text-left ${
          active ? 'border-[#0D5959] bg-[#0D5959]/5' : 'border-gray-200 hover:border-[#0D5959]/40 bg-white'
        }`}
      >
        <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">
          {label}
        </span>
        <div className="flex items-center justify-between w-full gap-1 mt-0.5">
          <span className={`text-sm font-roboto leading-tight truncate ${active ? 'text-[#0D5959] font-semibold' : 'text-stone-500'}`}>
            {active && value ? value : 'Any'}
          </span>
          <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
            <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white border border-gray-200 rounded-sm z-50 shadow-[0_8px_32px_rgba(0,0,0,0.22)] overflow-hidden max-h-56 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export default function DesktopTopSearchBar({
  filters,
  onChange,
  onClear,
  priceBrackets,
  typeOptions,
  neighborhoods = [],
  purpose,
  showFurnished,
}: DesktopTopSearchBarProps) {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const set = (partial: Partial<ListingFilters>) => onChange({ ...filters, ...partial });

  const currentCurrency = (filters as Record<string, unknown>).currency as string ?? '';
  const currentBaths = (filters as Record<string, unknown>).baths as string ?? '';
  const currentFurnished = (filters as Record<string, unknown>).furnished as string ?? '';

  const activeFilterCount = [
    filters.area,
    filters.beds,
    currentBaths,
    currentFurnished,
    currentCurrency,
    filters.priceBracket !== 'Any Price' ? filters.priceBracket : '',
    filters.type,
  ].filter(Boolean).length;

  const filteredTypes = typeOptions.filter((t) => t !== 'All Types');

  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key));

  const handleClear = () => {
    onClear();
    setOpenDropdown(null);
    setFiltersOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="hidden lg:block px-10 pb-4 pt-4 bg-white border-b border-gray-100" ref={wrapRef}>
      {/* Main bar */}
      <div className="flex items-stretch bg-white overflow-visible border border-gray-200 rounded-sm" style={{ height: '52px' }}>
        {/* Search input */}
        <div className="flex items-center gap-2.5 px-5 flex-[2] min-w-0 border-r border-gray-200">
          <span className="w-4 h-4 flex items-center justify-center shrink-0">
            <i className="ri-search-line text-stone-400 text-sm" />
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && setFiltersOpen(false)}
            placeholder="Enter an address, town, street, zip or property ID"
            className="flex-1 min-w-0 text-sm font-roboto text-primary placeholder:text-stone-400 focus:outline-none bg-transparent"
          />
          {filters.search && (
            <button onClick={() => set({ search: '' })} className="w-4 h-4 flex items-center justify-center text-stone-300 hover:text-stone-500 cursor-pointer shrink-0">
              <i className="ri-close-line text-sm" />
            </button>
          )}
        </div>

        {/* Purpose */}
        <div className="relative h-full border-r border-gray-200">
          <button
            type="button"
            onClick={() => toggle('purpose')}
            className="h-full flex items-center gap-2 px-5 text-sm font-roboto font-medium text-stone-600 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{purpose === 'sale' ? 'For Sale' : 'For Rent'}</span>
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
              <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${openDropdown === 'purpose' ? 'rotate-180' : ''}`} />
            </span>
          </button>
          {openDropdown === 'purpose' && (
            <div className="absolute top-full left-0 mt-1 min-w-[160px] bg-white border border-gray-200 rounded-sm z-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
              <DropItem label="For Sale" active={purpose === 'sale'} onClick={() => { setOpenDropdown(null); navigate('/buy'); }} />
              <DropItem label="For Rent" active={purpose === 'rent'} onClick={() => { setOpenDropdown(null); navigate('/rent'); }} />
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="relative h-full hidden md:block border-r border-gray-200">
          <button
            type="button"
            onClick={() => toggle('type')}
            className="h-full flex items-center gap-1.5 px-4 text-sm font-roboto font-medium transition-colors cursor-pointer whitespace-nowrap text-stone-500 hover:text-primary"
          >
            <span>{filters.type || 'Property Type'}</span>
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
              <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
            </span>
          </button>
          {openDropdown === 'type' && (
            <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white border border-gray-200 rounded-sm z-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden max-h-64 overflow-y-auto">
              <DropItem label="All Types" active={!filters.type} onClick={() => { set({ type: '' }); setOpenDropdown(null); }} />
              {filteredTypes.map((t) => (
                <DropItem key={t} label={t} active={filters.type === t} onClick={() => { set({ type: t }); setOpenDropdown(null); }} />
              ))}
            </div>
          )}
        </div>

        {/* Max Price */}
        <div className="relative h-full border-r border-gray-200">
          <button
            type="button"
            onClick={() => toggle('price')}
            className="h-full flex items-center gap-2 px-5 text-sm font-roboto font-medium transition-colors cursor-pointer whitespace-nowrap text-stone-500 hover:text-primary"
          >
            <span>{filters.priceBracket !== 'Any Price' ? filters.priceBracket : 'Max. Price'}</span>
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
              <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
            </span>
          </button>
          {openDropdown === 'price' && (
            <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white border border-gray-200 rounded-sm z-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden max-h-64 overflow-y-auto">
              {priceBrackets.map((b) => (
                <DropItem key={b.label} label={b.label} active={filters.priceBracket === b.label} onClick={() => { set({ priceBracket: b.label }); setOpenDropdown(null); }} />
              ))}
            </div>
          )}
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={`flex items-center gap-2 px-5 text-sm font-roboto font-medium transition-all duration-200 cursor-pointer whitespace-nowrap border-r border-gray-200 ${
            filtersOpen ? 'text-white bg-[#0D5959]' : 'text-[#0D5959] hover:bg-[#0D5959] hover:text-white'
          }`}
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-equalizer-3-line text-sm" />
          </span>
          Advanced
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold leading-none bg-primary text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Search button */}
        <button
          onClick={() => setFiltersOpen(false)}
          className="px-9 bg-[#0D5959] text-white text-sm font-roboto font-semibold whitespace-nowrap cursor-pointer hover:bg-[#094545] transition-colors flex items-center gap-2 shrink-0 rounded-r-sm"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-search-line text-sm" />
          </span>
          Search
        </button>
      </div>

      {/* Expanded advanced panel */}
      {filtersOpen && (
        <div className="mt-0 bg-white border-t border-gray-100 overflow-visible">
          <div className="px-5 pt-4 pb-3 flex flex-wrap gap-3">
            <FilterDropdown label="Location" value={filters.area || ''} active={!!filters.area} isOpen={openDropdown === 'loc'} onOpen={() => toggle('loc')}>
              <div className="py-1 max-h-56 overflow-y-auto">
                <DropItem label="Any Location" active={!filters.area} onClick={() => { set({ area: '' }); setOpenDropdown(null); }} />
                {neighborhoods.map((n) => (
                  <DropItem key={n.id} label={n.name} active={filters.area === n.name} onClick={() => { set({ area: n.name }); setOpenDropdown(null); }} />
                ))}
                {neighborhoods.length === 0 && <p className="px-4 py-3 text-xs text-stone-400 font-roboto">No neighbourhoods available</p>}
              </div>
            </FilterDropdown>
            <FilterDropdown label="Bedrooms" value={filters.beds ? `${filters.beds}+ Beds` : ''} active={!!filters.beds} isOpen={openDropdown === 'beds'} onOpen={() => toggle('beds')}>
              <div className="py-1">
                {BEDS_OPTIONS.map((opt) => (
                  <DropItem key={opt.label} label={opt.label === 'Any' ? 'Any Bedrooms' : `${opt.label} Bedrooms`} active={filters.beds === opt.value} onClick={() => { set({ beds: opt.value }); setOpenDropdown(null); }} />
                ))}
              </div>
            </FilterDropdown>
            <FilterDropdown label="Bathrooms" value={currentBaths ? `${currentBaths}+ Baths` : ''} active={!!currentBaths} isOpen={openDropdown === 'baths'} onOpen={() => toggle('baths')}>
              <div className="py-1">
                {[{ label: 'Any Bathrooms', value: '' }, { label: '1+ Bathrooms', value: '1' }, { label: '2+ Bathrooms', value: '2' }, { label: '3+ Bathrooms', value: '3' }, { label: '4+ Bathrooms', value: '4' }].map((opt) => (
                  <DropItem key={opt.value} label={opt.label} active={currentBaths === opt.value} onClick={() => { set({ baths: opt.value } as Partial<ListingFilters>); setOpenDropdown(null); }} />
                ))}
              </div>
            </FilterDropdown>
            <FilterDropdown label="Price Range" value={filters.priceBracket !== 'Any Price' ? filters.priceBracket : ''} active={filters.priceBracket !== 'Any Price'} isOpen={openDropdown === 'price-adv'} onOpen={() => toggle('price-adv')}>
              <div className="py-1">
                {priceBrackets.map((b) => (
                  <DropItem key={b.label} label={b.label} active={filters.priceBracket === b.label} onClick={() => { set({ priceBracket: b.label }); setOpenDropdown(null); }} />
                ))}
              </div>
            </FilterDropdown>
            {showFurnished && (
              <FilterDropdown label="Furnished" value={currentFurnished || ''} active={!!currentFurnished} isOpen={openDropdown === 'furnished'} onOpen={() => toggle('furnished')}>
                <div className="py-1">
                  {['Any', 'Furnished', 'Unfurnished'].map((opt) => {
                    const val = opt === 'Any' ? '' : opt;
                    return <DropItem key={opt} label={opt} active={currentFurnished === val} onClick={() => { set({ furnished: val } as Partial<ListingFilters>); setOpenDropdown(null); }} />;
                  })}
                </div>
              </FilterDropdown>
            )}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-4">
            <p className="text-xs font-roboto text-stone-500">
              Use the filters above to narrow your search
            </p>
            <button onClick={handleClear} className="text-xs font-roboto text-stone-400 hover:text-[#0D5959] transition-colors cursor-pointer whitespace-nowrap underline underline-offset-2">
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
