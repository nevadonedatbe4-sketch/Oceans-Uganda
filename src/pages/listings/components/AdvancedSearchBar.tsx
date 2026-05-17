import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ListingFilters } from './ListingsFilterBar';

interface PriceBracket {
  label: string;
  min: number | null;
  max: number | null;
}

interface AdvancedSearchBarProps {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  onClear: () => void;
  priceBrackets: PriceBracket[];
  typeOptions: string[];
  showFurnished?: boolean;
  furnishedOptions?: string[];
  totalResults: number;
  loading: boolean;
  title: string;
  neighborhoods?: { id: string; name: string }[];
  purpose: 'sale' | 'rent';
}

const BEDS_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
];

const CURRENCIES = [
  { label: 'Any Currency', value: '' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'UGX (USh)', value: 'UGX' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'KES (KSh)', value: 'KES' },
];

// ─── Reusable dropdown list item ─────────────────────────────────────────────
function DropItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
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

// ─── Desktop inline dropdown (inside the white bar) ──────────────────────────
function InlineDropdown({
  label,
  active,
  children,
  isOpen,
  onToggle,
}: {
  label: string;
  active: boolean;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative h-full hidden md:block border-r border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className={`h-full flex items-center gap-1.5 px-4 text-sm font-roboto font-medium transition-colors cursor-pointer whitespace-nowrap ${
          active ? 'text-primary' : 'text-stone-500 hover:text-primary'
        }`}
      >
        <span>{label}</span>
        <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-0 min-w-[200px] bg-white border border-gray-200 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden rounded-b-sm max-h-64 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Advanced filter panel row item (desktop expanded panel) ─────────────────
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

// ─── Mobile sheet select row ──────────────────────────────────────────────────
function SheetSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-roboto font-semibold uppercase tracking-widest text-stone-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm font-roboto text-stone-700 focus:outline-none focus:border-primary bg-white appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdvancedSearchBar({
  filters,
  onChange,
  onClear,
  priceBrackets,
  typeOptions,
  showFurnished,
  totalResults,
  loading,
  title,
  neighborhoods = [],
  purpose,
}: AdvancedSearchBarProps) {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Detect sticky
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (mobileSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileSheetOpen]);

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

  const hasAnyFilter = activeFilterCount > 0 || filters.search.trim() !== '';

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

  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key));

  const handleClear = () => {
    onClear();
    setOpenDropdown(null);
    setFiltersOpen(false);
    setMobileSheetOpen(false);
  };

  const filteredTypes = typeOptions.filter((t) => t !== 'All Types');
  const currencyLabel = CURRENCIES.find((c) => c.value === currentCurrency)?.label ?? '';

  const typeOptions2 = [
    { label: 'All Types', value: '' },
    ...filteredTypes.map((t) => ({ label: t, value: t })),
  ];
  const bedsOptions2 = BEDS_OPTIONS.map((o) => ({
    label: o.label === 'Any' ? 'Any Bedrooms' : `${o.label} Bedrooms`,
    value: o.value,
  }));
  const bathsOptions2 = [
    { label: 'Any Bathrooms', value: '' },
    { label: '1+ Bathrooms', value: '1' },
    { label: '2+ Bathrooms', value: '2' },
    { label: '3+ Bathrooms', value: '3' },
    { label: '4+ Bathrooms', value: '4' },
  ];
  const nbOptions2 = [
    { label: 'Any Location', value: '' },
    ...neighborhoods.map((n) => ({ label: n.name, value: n.name })),
  ];
  const furnishedOptions2 = [
    { label: 'Any', value: '' },
    { label: 'Furnished', value: 'Furnished' },
    { label: 'Unfurnished', value: 'Unfurnished' },
  ];

  return (
    <>
      {/* Sentinel */}
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />

      <div
        className={`w-full bg-white border-b border-gray-200 sticky top-14 z-40 transition-shadow duration-300 ${
          isStuck ? 'shadow-[0_4px_20px_rgba(0,23,49,0.10)]' : ''
        }`}
      >
        {/* ── Title + breadcrumb — hidden when stuck ── */}
        <div
          className={`px-4 md:px-10 overflow-hidden transition-all duration-300 ${
            isStuck ? 'max-h-0 py-0 opacity-0' : 'max-h-40 pt-6 md:pt-8 pb-3 md:pb-4 opacity-100'
          }`}
        >
          <h1 className="font-prata text-primary text-xl md:text-3xl leading-tight mb-1">{title}</h1>
          <nav className="flex items-center gap-1.5 text-xs font-roboto text-text-gray">
            <a href="/" className="hover:text-primary transition-colors cursor-pointer whitespace-nowrap">Home</a>
            <i className="ri-arrow-right-s-line text-gray-300 text-sm" />
            <span className="text-primary truncate">{title}</span>
          </nav>
        </div>

        {/* ── Spacer ── */}
        <div
          className={`overflow-hidden transition-all duration-300 ${isStuck ? 'max-h-0' : 'max-h-4'}`}
          style={{ height: isStuck ? 0 : '12px' }}
          aria-hidden="true"
        />

        {/* ══════════════════════════════════════════════════════════════
            MOBILE search bar  (< md)
        ══════════════════════════════════════════════════════════════ */}
        <div className="md:hidden px-4 pb-3" ref={wrapRef}>
          {/* Row: search input + filter button */}
          <div className="flex items-stretch gap-2" style={{ height: '44px' }}>
            {/* Search input */}
            <div className="flex items-center gap-2 px-3 flex-1 min-w-0 border border-gray-200 rounded-md bg-white">
              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                <i className="ri-search-line text-stone-400 text-sm" />
              </span>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => set({ search: e.target.value })}
                placeholder="Search location, type…"
                className="flex-1 min-w-0 text-sm font-roboto text-primary placeholder:text-stone-400 focus:outline-none bg-transparent"
              />
              {filters.search && (
                <button onClick={() => set({ search: '' })} className="w-4 h-4 flex items-center justify-center text-stone-300 hover:text-stone-500 cursor-pointer shrink-0">
                  <i className="ri-close-line text-sm" />
                </button>
              )}
            </div>

            {/* Filter sheet trigger */}
            <button
              onClick={() => setMobileSheetOpen(true)}
              className={`flex items-center gap-1.5 px-3 rounded-md border text-sm font-roboto font-medium whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                activeFilterCount > 0
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-stone-600 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              <i className="ri-equalizer-3-line text-sm" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold bg-white text-primary leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active chips row */}
          {hasAnyFilter && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <p className="text-xs font-roboto text-stone-500 shrink-0">
                {loading ? 'Searching…' : <><span className="text-primary font-medium">{totalResults}</span> found</>}
              </p>
              {filters.type && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                  {filters.type}
                  <button onClick={() => set({ type: '' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
                </span>
              )}
              {filters.area && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                  {filters.area}
                  <button onClick={() => set({ area: '' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
                </span>
              )}
              {filters.beds && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                  {filters.beds}+ Beds
                  <button onClick={() => set({ beds: '' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
                </span>
              )}
              {filters.priceBracket !== 'Any Price' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                  {filters.priceBracket}
                  <button onClick={() => set({ priceBracket: 'Any Price' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
                </span>
              )}
              {hasAnyFilter && (
                <button onClick={handleClear} className="text-[11px] font-roboto text-stone-400 hover:text-primary transition-colors cursor-pointer whitespace-nowrap underline underline-offset-2">
                  Clear all
                </button>
              )}
            </div>
          )}

          {!hasAnyFilter && (
            <p className="mt-2 text-xs font-roboto text-stone-500">
              {loading ? 'Searching…' : <><span className="text-primary font-medium">{totalResults}</span> {totalResults === 1 ? 'property' : 'properties'} found</>}
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TABLET search bar  (md → lg)
        ══════════════════════════════════════════════════════════════ */}
        <div className="hidden md:block lg:hidden px-6 pb-4" ref={wrapRef}>
          {/* Row 1: search + purpose + filter button */}
          <div className="flex items-stretch gap-0 border border-gray-200 rounded-md overflow-hidden" style={{ height: '46px' }}>
            {/* Search */}
            <div className="flex items-center gap-2 px-3 flex-1 min-w-0 border-r border-gray-200">
              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                <i className="ri-search-line text-stone-400 text-sm" />
              </span>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => set({ search: e.target.value })}
                placeholder="Address, area or city…"
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
                onClick={() => toggle('purpose-tab')}
                className="h-full flex items-center gap-1.5 px-4 text-sm font-roboto font-medium text-stone-600 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{purpose === 'sale' ? 'For Sale' : 'For Rent'}</span>
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${openDropdown === 'purpose-tab' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'purpose-tab' && (
                <div className="absolute top-full left-0 mt-0 min-w-[160px] bg-white border border-gray-200 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden rounded-b-sm">
                  <DropItem label="For Sale" active={purpose === 'sale'} onClick={() => { setOpenDropdown(null); navigate('/buy'); }} />
                  <DropItem label="For Rent" active={purpose === 'rent'} onClick={() => { setOpenDropdown(null); navigate('/rent'); }} />
                </div>
              )}
            </div>

            {/* Type */}
            <div className="relative h-full border-r border-gray-200">
              <button
                type="button"
                onClick={() => toggle('type-tab')}
                className={`h-full flex items-center gap-1.5 px-4 text-sm font-roboto font-medium transition-colors cursor-pointer whitespace-nowrap ${filters.type ? 'text-primary' : 'text-stone-500 hover:text-primary'}`}
              >
                <span>{filters.type || 'Type'}</span>
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${openDropdown === 'type-tab' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'type-tab' && (
                <div className="absolute top-full left-0 mt-0 min-w-[200px] bg-white border border-gray-200 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden rounded-b-sm max-h-64 overflow-y-auto">
                  <DropItem label="All Types" active={!filters.type} onClick={() => { set({ type: '' }); setOpenDropdown(null); }} />
                  {filteredTypes.map((t) => (
                    <DropItem key={t} label={t} active={filters.type === t} onClick={() => { set({ type: t }); setOpenDropdown(null); }} />
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="relative h-full border-r border-gray-200">
              <button
                type="button"
                onClick={() => toggle('price-tab')}
                className={`h-full flex items-center gap-1.5 px-4 text-sm font-roboto font-medium transition-colors cursor-pointer whitespace-nowrap ${filters.priceBracket !== 'Any Price' ? 'text-primary' : 'text-stone-500 hover:text-primary'}`}
              >
                <span>{filters.priceBracket !== 'Any Price' ? filters.priceBracket : 'Price'}</span>
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${openDropdown === 'price-tab' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'price-tab' && (
                <div className="absolute top-full left-0 mt-0 min-w-[200px] bg-white border border-gray-200 z-50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden rounded-b-sm max-h-64 overflow-y-auto">
                  {priceBrackets.map((b) => (
                    <DropItem key={b.label} label={b.label} active={filters.priceBracket === b.label} onClick={() => { set({ priceBracket: b.label }); setOpenDropdown(null); }} />
                  ))}
                </div>
              )}
            </div>

            {/* More filters */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-4 text-sm font-roboto font-medium transition-all cursor-pointer whitespace-nowrap border-r border-gray-200 ${
                filtersOpen ? 'text-white bg-[#0D5959]' : 'text-[#0D5959] hover:bg-[#0D5959] hover:text-white'
              }`}
            >
              <i className="ri-equalizer-3-line text-sm" />
              More
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold bg-primary text-white leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Search btn */}
            <button
              onClick={() => setFiltersOpen(false)}
              className="px-5 bg-primary text-white text-sm font-roboto font-semibold whitespace-nowrap cursor-pointer hover:bg-primary/90 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <i className="ri-search-line text-sm" />
              Search
            </button>
          </div>

          {/* Expanded advanced panel */}
          {filtersOpen && (
            <div className="mt-0 bg-white border border-t-0 border-gray-200 rounded-b-md overflow-visible">
              <div className="px-4 pt-3 pb-3 flex flex-wrap gap-3">
                <FilterDropdown label="Location" value={filters.area || ''} active={!!filters.area} isOpen={openDropdown === 'loc-tab'} onOpen={() => toggle('loc-tab')}>
                  <div className="py-1">
                    <DropItem label="Any Location" active={!filters.area} onClick={() => { set({ area: '' }); setOpenDropdown(null); }} />
                    {neighborhoods.map((n) => (
                      <DropItem key={n.id} label={n.name} active={filters.area === n.name} onClick={() => { set({ area: n.name }); setOpenDropdown(null); }} />
                    ))}
                  </div>
                </FilterDropdown>
                <FilterDropdown label="Bedrooms" value={filters.beds ? `${filters.beds}+ Beds` : ''} active={!!filters.beds} isOpen={openDropdown === 'beds-tab'} onOpen={() => toggle('beds-tab')}>
                  <div className="py-1">
                    {BEDS_OPTIONS.map((opt) => (
                      <DropItem key={opt.label} label={opt.label === 'Any' ? 'Any Bedrooms' : `${opt.label} Bedrooms`} active={filters.beds === opt.value} onClick={() => { set({ beds: opt.value }); setOpenDropdown(null); }} />
                    ))}
                  </div>
                </FilterDropdown>
                <FilterDropdown label="Bathrooms" value={currentBaths ? `${currentBaths}+ Baths` : ''} active={!!currentBaths} isOpen={openDropdown === 'baths-tab'} onOpen={() => toggle('baths-tab')}>
                  <div className="py-1">
                    {[{ label: 'Any Bathrooms', value: '' }, { label: '1+ Bathrooms', value: '1' }, { label: '2+ Bathrooms', value: '2' }, { label: '3+ Bathrooms', value: '3' }, { label: '4+ Bathrooms', value: '4' }].map((opt) => (
                      <DropItem key={opt.value} label={opt.label} active={currentBaths === opt.value} onClick={() => { set({ baths: opt.value } as Partial<ListingFilters>); setOpenDropdown(null); }} />
                    ))}
                  </div>
                </FilterDropdown>
                <FilterDropdown label="Currency" value={currentCurrency ? currencyLabel : ''} active={!!currentCurrency} isOpen={openDropdown === 'currency-tab'} onOpen={() => toggle('currency-tab')}>
                  <div className="py-1">
                    {CURRENCIES.map((c) => (
                      <DropItem key={c.value} label={c.label} active={currentCurrency === c.value} onClick={() => { set({ currency: c.value } as Partial<ListingFilters>); setOpenDropdown(null); }} />
                    ))}
                  </div>
                </FilterDropdown>
                {showFurnished && (
                  <FilterDropdown label="Furnished" value={currentFurnished || ''} active={!!currentFurnished} isOpen={openDropdown === 'furnished-tab'} onOpen={() => toggle('furnished-tab')}>
                    <div className="py-1">
                      {['Any', 'Furnished', 'Unfurnished'].map((opt) => {
                        const val = opt === 'Any' ? '' : opt;
                        return <DropItem key={opt} label={opt} active={currentFurnished === val} onClick={() => { set({ furnished: val } as Partial<ListingFilters>); setOpenDropdown(null); }} />;
                      })}
                    </div>
                  </FilterDropdown>
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between gap-4">
                <p className="text-xs font-roboto text-stone-500">
                  {loading ? 'Searching…' : <><span className="text-[#0D5959] font-semibold">{totalResults}</span> {totalResults === 1 ? 'property' : 'properties'} found</>}
                </p>
                <button onClick={handleClear} className="text-xs font-roboto text-stone-400 hover:text-[#0D5959] transition-colors cursor-pointer whitespace-nowrap underline underline-offset-2">
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Active chips */}
          <div className="mt-2 flex items-center flex-wrap gap-2">
            <p className="text-xs font-roboto text-text-gray">
              {loading ? 'Searching…' : <><span className="text-primary font-medium">{totalResults}</span> {totalResults === 1 ? 'property' : 'properties'} found</>}
            </p>
            {filters.search.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                &ldquo;{filters.search}&rdquo;
                <button onClick={() => set({ search: '' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                {filters.type}
                <button onClick={() => set({ type: '' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
              </span>
            )}
            {filters.area && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                {filters.area}
                <button onClick={() => set({ area: '' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
              </span>
            )}
            {filters.beds && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                {filters.beds}+ Beds
                <button onClick={() => set({ beds: '' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
              </span>
            )}
            {filters.priceBracket !== 'Any Price' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary text-[11px] font-roboto rounded-sm whitespace-nowrap">
                {filters.priceBracket}
                <button onClick={() => set({ priceBracket: 'Any Price' })} className="cursor-pointer w-3 h-3 flex items-center justify-center"><i className="ri-close-line text-xs" /></button>
              </span>
            )}
            {hasAnyFilter && (
              <button onClick={handleClear} className="text-[11px] font-roboto text-stone-400 hover:text-primary transition-colors cursor-pointer whitespace-nowrap underline underline-offset-2">
                Clear all
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE FILTER SHEET (full-screen bottom drawer)
      ══════════════════════════════════════════════════════════════ */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSheetOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] flex flex-col">
            {/* Handle + header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <i className="ri-equalizer-3-line text-primary text-base" />
                <h2 className="text-sm font-roboto font-semibold text-stone-800">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileSheetOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 cursor-pointer"
              >
                <i className="ri-close-line text-base" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Purpose */}
              <div className="space-y-2">
                <label className="text-[11px] font-roboto font-semibold uppercase tracking-widest text-stone-400">Purpose</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ label: 'For Sale', path: '/buy' }, { label: 'For Rent', path: '/rent' }].map((opt) => {
                    const isActive = (opt.path === '/buy' && purpose === 'sale') || (opt.path === '/rent' && purpose === 'rent');
                    return (
                      <button
                        key={opt.path}
                        onClick={() => { setMobileSheetOpen(false); navigate(opt.path); }}
                        className={`py-2.5 rounded-md text-sm font-roboto font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                          isActive ? 'bg-primary text-white border-primary' : 'bg-white text-stone-600 border-gray-200 hover:border-primary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Property Type */}
              <SheetSelect
                label="Property Type"
                value={filters.type}
                options={typeOptions2}
                onChange={(v) => set({ type: v })}
              />

              {/* Location */}
              <SheetSelect
                label="Location"
                value={filters.area || ''}
                options={nbOptions2}
                onChange={(v) => set({ area: v })}
              />

              {/* Bedrooms */}
              <SheetSelect
                label="Bedrooms"
                value={filters.beds}
                options={bedsOptions2}
                onChange={(v) => set({ beds: v })}
              />

              {/* Bathrooms */}
              <SheetSelect
                label="Bathrooms"
                value={currentBaths}
                options={bathsOptions2}
                onChange={(v) => set({ baths: v } as Partial<ListingFilters>)}
              />

              {/* Price Range */}
              <SheetSelect
                label="Price Range"
                value={filters.priceBracket}
                options={priceBrackets.map((b) => ({ label: b.label, value: b.label }))}
                onChange={(v) => set({ priceBracket: v })}
              />

              {/* Currency */}
              <SheetSelect
                label="Currency"
                value={currentCurrency}
                options={CURRENCIES}
                onChange={(v) => set({ currency: v } as Partial<ListingFilters>)}
              />

              {/* Furnished */}
              {showFurnished && (
                <SheetSelect
                  label="Furnished"
                  value={currentFurnished}
                  options={furnishedOptions2}
                  onChange={(v) => set({ furnished: v } as Partial<ListingFilters>)}
                />
              )}
            </div>

            {/* Footer actions */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
              <button
                onClick={handleClear}
                className="flex-1 py-3 border border-gray-200 rounded-md text-sm font-roboto font-medium text-stone-600 hover:border-stone-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                Clear all
              </button>
              <button
                onClick={() => setMobileSheetOpen(false)}
                className="flex-1 py-3 bg-primary text-white rounded-md text-sm font-roboto font-semibold hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                {loading ? 'Searching…' : `Show ${totalResults} ${totalResults === 1 ? 'property' : 'properties'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
