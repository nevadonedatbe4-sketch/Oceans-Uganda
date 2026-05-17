import { useState, useEffect } from 'react';

interface SearchOverlayFilters {
  search: string;
  status: string;
  neighbourhood: string;
  type: string;
  beds: string;
  priceBracket: string;
}

interface AllPropertiesSearchOverlayProps {
  open: boolean;
  onClose: () => void;
  filters: SearchOverlayFilters;
  onApply: (filters: SearchOverlayFilters) => void;
  neighbourhoodTabs: string[];
  totalCount: number;
  loading: boolean;
}

const STATUS_OPTS = [
  { label: 'All', value: 'All' },
  { label: 'For Rent', value: 'For Rent' },
  { label: 'For Sale', value: 'For Sale' },
];

const TYPE_OPTS = [
  'All Types',
  'Apartment',
  'House',
  'Villa',
  'Condo',
  'Townhouse',
  'Studio',
  'Penthouse',
  'Commercial',
  'Land',
];

const BEDS_OPTS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
];

const PRICE_OPTS = [
  'Any Price',
  'Under $500/mo',
  '$500 – $1,000/mo',
  '$1,000 – $2,000/mo',
  '$2,000 – $5,000/mo',
  '$5,000+/mo',
  'Under $50,000',
  '$50,000 – $100,000',
  '$100,000 – $250,000',
  '$250,000 – $500,000',
  '$500,000+',
];

export default function AllPropertiesSearchOverlay({
  open,
  onClose,
  filters,
  onApply,
  neighbourhoodTabs,
  totalCount,
  loading,
}: AllPropertiesSearchOverlayProps) {
  const [local, setLocal] = useState<SearchOverlayFilters>(filters);

  // Sync when opened
  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set = (partial: Partial<SearchOverlayFilters>) =>
    setLocal((prev) => ({ ...prev, ...partial }));

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleClear = () => {
    const cleared: SearchOverlayFilters = {
      search: '',
      status: 'All',
      neighbourhood: 'All',
      type: '',
      beds: '',
      priceBracket: 'Any Price',
    };
    setLocal(cleared);
    onApply(cleared);
    onClose();
  };

  const activeCount = [
    local.search.trim(),
    local.status !== 'All' ? local.status : '',
    local.neighbourhood !== 'All' ? local.neighbourhood : '',
    local.type,
    local.beds,
    local.priceBracket !== 'Any Price' ? local.priceBracket : '',
  ].filter(Boolean).length;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Panel — slides in from right */}
      <div className="relative ml-auto w-full max-w-sm bg-white flex flex-col h-full shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 text-stone-500 hover:border-primary hover:text-primary transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <i className="ri-arrow-left-line text-sm" />
            </button>
            <h2 className="font-prata text-primary text-base">Search Properties</h2>
          </div>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-roboto font-semibold">
              {activeCount} active
            </span>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

          {/* Keyword search */}
          <div className="space-y-1">
            <label className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Keyword Search
            </label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
              <input
                type="text"
                value={local.search}
                onChange={(e) => set({ search: e.target.value })}
                placeholder="Address, title, area…"
                className="w-full pl-9 pr-9 h-[42px] border border-gray-200 text-[13px] font-roboto text-primary placeholder:text-stone-400 focus:outline-none focus:border-primary transition-colors"
              />
              {local.search && (
                <button
                  onClick={() => set({ search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 cursor-pointer w-4 h-4 flex items-center justify-center"
                >
                  <i className="ri-close-line text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Status toggle */}
          <div className="space-y-1">
            <label className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Looking For
            </label>
            <div className="flex gap-0 border border-gray-200 overflow-hidden rounded-[4px]">
              {STATUS_OPTS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set({ status: opt.value })}
                  className={`flex-1 h-[42px] text-[13px] font-roboto font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    local.status === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-white text-stone-500 hover:bg-[#f5f5f5]'
                  } ${opt.value !== STATUS_OPTS[STATUS_OPTS.length - 1].value ? 'border-r border-gray-200' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Neighbourhood */}
          <div className="space-y-1">
            <label className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Neighbourhood
            </label>
            <div className="relative">
              <select
                value={local.neighbourhood}
                onChange={(e) => set({ neighbourhood: e.target.value })}
                className="w-full appearance-none border border-gray-200 px-3 h-[42px] pr-9 text-[13px] font-roboto text-stone-600 focus:outline-none focus:border-primary transition-colors cursor-pointer bg-white rounded-[4px]"
              >
                {neighbourhoodTabs.map((t) => (
                  <option key={t} value={t}>
                    {t === 'All' ? 'All Neighbourhoods' : t}
                  </option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none" />
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Property Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TYPE_OPTS.map((t) => {
                const val = t === 'All Types' ? '' : t;
                const active = local.type === val;
                return (
                  <button
                    key={t}
                    onClick={() => set({ type: val })}
                    className={`px-2.5 py-[5px] text-[11px] font-roboto font-medium border transition-colors cursor-pointer whitespace-nowrap rounded-[4px] ${
                      active
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-stone-500 border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1">
            <label className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Bedrooms
            </label>
            <div className="flex gap-0 border border-gray-200 overflow-hidden rounded-[4px]">
              {BEDS_OPTS.map((opt, i) => (
                <button
                  key={opt.value}
                  onClick={() => set({ beds: opt.value })}
                  className={`flex-1 h-[42px] text-[13px] font-roboto font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    local.beds === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-white text-stone-500 hover:bg-[#f5f5f5]'
                  } ${i < BEDS_OPTS.length - 1 ? 'border-r border-gray-200' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Price Range
            </label>
            <div className="relative">
              <select
                value={local.priceBracket}
                onChange={(e) => set({ priceBracket: e.target.value })}
                className="w-full appearance-none border border-gray-200 px-3 h-[42px] pr-9 text-[13px] font-roboto text-stone-600 focus:outline-none focus:border-primary transition-colors cursor-pointer bg-white rounded-[4px]"
              >
                {PRICE_OPTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 py-3.5 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-[11px] font-roboto text-stone-400 flex-1">
              {loading
                ? 'Searching…'
                : (
                  <>
                    <span className="text-primary font-semibold">{totalCount}</span>
                    {' '}{totalCount === 1 ? 'property' : 'properties'} found
                  </>
                )}
            </p>
            {activeCount > 0 && (
              <button
                onClick={handleClear}
                className="text-[11px] font-roboto text-stone-400 hover:text-primary transition-colors cursor-pointer whitespace-nowrap underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>
          <button
            onClick={handleApply}
            className="w-full h-[42px] bg-primary text-white text-[13px] font-roboto font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap rounded-[4px]"
          >
            Show {totalCount} {totalCount === 1 ? 'Property' : 'Properties'}
          </button>
        </div>
      </div>
    </div>
  );
}
