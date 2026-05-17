import { useState } from 'react';
import type { NeighborhoodOption } from '@/hooks/useListings';

export interface SearchFilters {
  purpose: 'all' | 'sale' | 'rent';
  type: string;
  area: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  minSize: string;
  maxSize: string;
}

interface SearchFiltersSidebarProps {
  filters: SearchFilters;
  neighborhoods: NeighborhoodOption[];
  onChange: (filters: SearchFilters) => void;
  onClear: () => void;
  totalResults: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Family Home', 'Studio', 'Land', 'Commercial'];
const BEDS_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
  { label: '5+', value: '5' },
];

const PRICE_PRESETS_SALE = [
  { label: 'Under $100K', min: '', max: '100000' },
  { label: '$100K–$300K', min: '100000', max: '300000' },
  { label: '$300K–$500K', min: '300000', max: '500000' },
  { label: '$500K–$1M', min: '500000', max: '1000000' },
  { label: 'Over $1M', min: '1000000', max: '' },
];

const PRICE_PRESETS_RENT = [
  { label: 'Under $1K', min: '', max: '1000' },
  { label: '$1K–$2K', min: '1000', max: '2000' },
  { label: '$2K–$4K', min: '2000', max: '4000' },
  { label: '$4K–$7K', min: '4000', max: '7000' },
  { label: 'Over $7K', min: '7000', max: '' },
];

export default function SearchFiltersSidebar({
  filters,
  neighborhoods,
  onChange,
  onClear,
  totalResults,
  mobileOpen,
  onMobileClose,
}: SearchFiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    purpose: true,
    type: true,
    price: true,
    beds: true,
    area: true,
    size: false,
  });

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const set = (partial: Partial<SearchFilters>) => onChange({ ...filters, ...partial });

  const pricePresets = filters.purpose === 'rent' ? PRICE_PRESETS_RENT : PRICE_PRESETS_SALE;

  const isPresetActive = (preset: { min: string; max: string }) =>
    filters.minPrice === preset.min && filters.maxPrice === preset.max;

  const hasAnyFilter =
    filters.purpose !== 'all' ||
    filters.type !== '' ||
    filters.area !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.beds !== '' ||
    filters.minSize !== '' ||
    filters.maxSize !== '';

  const sidebarContent = (
    <div className="w-full flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <p className="text-xs font-roboto text-text-gray uppercase tracking-widest">Filters</p>
          <p className="text-primary font-prata text-base mt-0.5">{totalResults} Properties</p>
        </div>
        <div className="flex items-center gap-2">
          {hasAnyFilter && (
            <button
              onClick={onClear}
              className="text-xs text-golden font-roboto underline cursor-pointer whitespace-nowrap"
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

      {/* Purpose */}
      <FilterSection
        title="Purpose"
        expanded={expandedSections.purpose}
        onToggle={() => toggleSection('purpose')}
      >
        <div className="flex gap-2">
          {(['all', 'sale', 'rent'] as const).map((p) => (
            <button
              key={p}
              onClick={() => set({ purpose: p })}
              className={`flex-1 py-2 text-xs font-roboto uppercase tracking-wider cursor-pointer whitespace-nowrap transition-colors ${
                filters.purpose === p
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-text-gray hover:border-primary hover:text-primary'
              }`}
            >
              {p === 'all' ? 'All' : p === 'sale' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection
        title="Property Type"
        expanded={expandedSections.type}
        onToggle={() => toggleSection('type')}
      >
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => set({ type: filters.type === t ? '' : t })}
              className={`px-3 py-1.5 text-xs font-roboto cursor-pointer whitespace-nowrap transition-colors ${
                filters.type === t
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-text-gray hover:border-primary hover:text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection
        title="Price Range"
        expanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray text-xs">$</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => set({ minPrice: e.target.value })}
                className="w-full border border-gray-200 pl-7 pr-3 py-2 text-xs font-roboto text-primary focus:outline-none focus:border-primary rounded-sm"
              />
            </div>
            <div className="flex items-center text-text-gray text-xs">–</div>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray text-xs">$</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => set({ maxPrice: e.target.value })}
                className="w-full border border-gray-200 pl-7 pr-3 py-2 text-xs font-roboto text-primary focus:outline-none focus:border-primary rounded-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pricePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() =>
                  isPresetActive(preset)
                    ? set({ minPrice: '', maxPrice: '' })
                    : set({ minPrice: preset.min, maxPrice: preset.max })
                }
                className={`px-2.5 py-1 text-xs font-roboto cursor-pointer whitespace-nowrap transition-colors ${
                  isPresetActive(preset)
                    ? 'bg-golden text-white'
                    : 'border border-gray-200 text-text-gray hover:border-golden hover:text-golden'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection
        title="Bedrooms"
        expanded={expandedSections.beds}
        onToggle={() => toggleSection('beds')}
      >
        <div className="flex gap-2">
          {BEDS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set({ beds: filters.beds === opt.value ? '' : opt.value })}
              className={`flex-1 py-2 text-xs font-roboto cursor-pointer whitespace-nowrap transition-colors ${
                filters.beds === opt.value
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-text-gray hover:border-primary hover:text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Area / Neighborhood */}
      <FilterSection
        title="Area"
        expanded={expandedSections.area}
        onToggle={() => toggleSection('area')}
      >
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => set({ area: '' })}
            className={`w-full text-left px-3 py-2 text-xs font-roboto cursor-pointer whitespace-nowrap transition-colors ${
              filters.area === ''
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-text-gray hover:text-primary'
            }`}
          >
            All Areas
          </button>
          {neighborhoods.map((n) => (
            <button
              key={n.id}
              onClick={() => set({ area: filters.area === n.name ? '' : n.name })}
              className={`w-full text-left px-3 py-2 text-xs font-roboto cursor-pointer whitespace-nowrap transition-colors flex items-center justify-between ${
                filters.area === n.name
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-text-gray hover:text-primary'
              }`}
            >
              {n.name}
              {filters.area === n.name && <i className="ri-check-line text-primary" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Property Size */}
      <FilterSection
        title="Size (sqm)"
        expanded={expandedSections.size}
        onToggle={() => toggleSection('size')}
      >
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min sqm"
            value={filters.minSize}
            onChange={(e) => set({ minSize: e.target.value })}
            className="flex-1 border border-gray-200 px-3 py-2 text-xs font-roboto text-primary focus:outline-none focus:border-primary rounded-sm"
          />
          <div className="flex items-center text-text-gray text-xs">–</div>
          <input
            type="number"
            placeholder="Max sqm"
            value={filters.maxSize}
            onChange={(e) => set({ maxSize: e.target.value })}
            className="flex-1 border border-gray-200 px-3 py-2 text-xs font-roboto text-primary focus:outline-none focus:border-primary rounded-sm"
          />
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-72 flex-shrink-0 border-r border-gray-100 bg-white self-start sticky top-[64px] max-h-[calc(100vh-64px)] overflow-hidden">
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

interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, expanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <span className="text-xs font-roboto font-semibold text-primary uppercase tracking-wider">{title}</span>
        <i className={`ri-${expanded ? 'subtract' : 'add'}-line text-text-gray text-sm`} />
      </button>
      {expanded && <div className="px-5 pb-4">{children}</div>}
    </div>
  );
}
