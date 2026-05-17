import { useState } from 'react';
import { PROPERTY_TYPES, PURPOSES, STATUSES } from '@/pages/admin/listings/types';

interface ListingFiltersProps {
  search: string;
  status: string;
  purpose: string;
  propertyType: string;
  onSearch: (v: string) => void;
  onStatus: (v: string) => void;
  onPurpose: (v: string) => void;
  onPropertyType: (v: string) => void;
  total: number;
  filtered: number;
}

const selectCls = 'w-full text-sm bg-[#F5F5F5] border border-[#e8edf2] rounded-md px-3 py-2 text-[#0d1f2d] outline-none cursor-pointer hover:border-[#D5A91C] transition-colors appearance-none';

export default function ListingFilters({
  search, status, purpose, propertyType,
  onSearch, onStatus, onPurpose, onPropertyType,
  total, filtered,
}: ListingFiltersProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasFilters = search || status || purpose || propertyType;
  const activeFilterCount = [status, purpose, propertyType].filter(Boolean).length;

  const clearAll = () => {
    onSearch('');
    onStatus('');
    onPurpose('');
    onPropertyType('');
  };

  return (
    <div className="bg-white border border-[#e8edf2] rounded-lg overflow-hidden">
      {/* Search row */}
      <div className="flex items-center gap-2 p-3">
        <div className="flex items-center gap-2 bg-[#F5F5F5] border border-[#e8edf2] rounded-md px-3 py-2 flex-1 focus-within:border-[#D5A91C] transition-colors">
          <span className="w-4 h-4 flex items-center justify-center text-[#7a8a99] shrink-0">
            <i className="ri-search-line text-sm" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search title or location…"
            className="flex-1 bg-transparent text-sm text-[#0d1f2d] placeholder-[#aab] outline-none min-w-0"
          />
          {search && (
            <button onClick={() => onSearch('')} className="text-[#aaa] hover:text-[#0d1f2d] cursor-pointer transition-colors shrink-0">
              <i className="ri-close-line text-sm" />
            </button>
          )}
        </div>

        {/* Filter toggle — mobile */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={`sm:hidden relative flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            filtersOpen || activeFilterCount > 0
              ? 'bg-[#0d1f2d] text-white border-[#0d1f2d]'
              : 'bg-[#F5F5F5] text-[#0d1f2d] border-[#e8edf2]'
          }`}
        >
          <i className="ri-equalizer-line text-sm" />
          Filter
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#D5A91C] text-[#0d1f2d] text-[9px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop: count + clear */}
        <div className="hidden sm:flex items-center gap-2 ml-auto shrink-0">
          <span className="text-xs text-[#7a8a99] whitespace-nowrap">
            {hasFilters ? `${filtered} of ${total}` : `${total} listings`}
          </span>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-[#D5A91C] hover:text-[#b8943d] hover:underline cursor-pointer whitespace-nowrap transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Desktop filter row */}
      <div className="hidden sm:flex flex-wrap gap-2 items-center px-3 pb-3">
        <div className="relative">
          <select value={status} onChange={(e) => onStatus(e.target.value)} className="text-sm bg-[#F5F5F5] border border-[#e8edf2] rounded-md px-3 py-2 text-[#0d1f2d] outline-none cursor-pointer hover:border-[#D5A91C] transition-colors pr-7 appearance-none">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] text-sm pointer-events-none" />
        </div>
        <div className="relative">
          <select value={purpose} onChange={(e) => onPurpose(e.target.value)} className="text-sm bg-[#F5F5F5] border border-[#e8edf2] rounded-md px-3 py-2 text-[#0d1f2d] outline-none cursor-pointer hover:border-[#D5A91C] transition-colors pr-7 appearance-none">
            <option value="">All Purposes</option>
            {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] text-sm pointer-events-none" />
        </div>
        <div className="relative">
          <select value={propertyType} onChange={(e) => onPropertyType(e.target.value)} className="text-sm bg-[#F5F5F5] border border-[#e8edf2] rounded-md px-3 py-2 text-[#0d1f2d] outline-none cursor-pointer hover:border-[#D5A91C] transition-colors pr-7 appearance-none">
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] text-sm pointer-events-none" />
        </div>
      </div>

      {/* Mobile expanded filters — clean panel */}
      {filtersOpen && (
        <div className="sm:hidden border-t border-[#f0f4f8] bg-[#f8f9fb] p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <select value={status} onChange={(e) => onStatus(e.target.value)} className={selectCls}>
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] text-sm pointer-events-none" />
            </div>
            <div className="relative">
              <select value={purpose} onChange={(e) => onPurpose(e.target.value)} className={selectCls}>
                <option value="">All Purposes</option>
                {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] text-sm pointer-events-none" />
            </div>
          </div>
          <div className="relative">
            <select value={propertyType} onChange={(e) => onPropertyType(e.target.value)} className={selectCls}>
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] text-sm pointer-events-none" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#7a8a99]">
              {hasFilters ? `${filtered} of ${total} results` : `${total} listings`}
            </span>
            {hasFilters && (
              <button onClick={clearAll} className="text-[11px] text-[#D5A91C] font-medium hover:underline cursor-pointer whitespace-nowrap">
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
