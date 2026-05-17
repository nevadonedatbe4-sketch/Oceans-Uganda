import type { SearchFilters } from './SearchFiltersSidebar';

interface ActiveFilterTagsProps {
  filters: SearchFilters;
  onRemove: (partial: Partial<SearchFilters>) => void;
}

interface Tag {
  label: string;
  clear: Partial<SearchFilters>;
}

function formatPrice(val: string) {
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function ActiveFilterTags({ filters, onRemove }: ActiveFilterTagsProps) {
  const tags: Tag[] = [];

  if (filters.purpose !== 'all') {
    tags.push({
      label: filters.purpose === 'sale' ? 'For Sale' : 'For Rent',
      clear: { purpose: 'all' },
    });
  }

  if (filters.type) {
    tags.push({ label: filters.type, clear: { type: '' } });
  }

  if (filters.area) {
    tags.push({ label: filters.area, clear: { area: '' } });
  }

  if (filters.beds) {
    tags.push({ label: `${filters.beds}+ Beds`, clear: { beds: '' } });
  }

  if (filters.minPrice || filters.maxPrice) {
    const label =
      filters.minPrice && filters.maxPrice
        ? `${formatPrice(filters.minPrice)} – ${formatPrice(filters.maxPrice)}`
        : filters.minPrice
        ? `From ${formatPrice(filters.minPrice)}`
        : `Up to ${formatPrice(filters.maxPrice)}`;
    tags.push({ label, clear: { minPrice: '', maxPrice: '' } });
  }

  if (filters.minSize || filters.maxSize) {
    const label =
      filters.minSize && filters.maxSize
        ? `${filters.minSize}–${filters.maxSize} sqm`
        : filters.minSize
        ? `From ${filters.minSize} sqm`
        : `Up to ${filters.maxSize} sqm`;
    tags.push({ label, clear: { minSize: '', maxSize: '' } });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      <span className="text-xs text-text-gray font-roboto">Active:</span>
      {tags.map((tag) => (
        <button
          key={tag.label}
          onClick={() => onRemove(tag.clear)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 text-primary text-xs font-roboto cursor-pointer whitespace-nowrap hover:bg-primary/10 transition-colors"
        >
          {tag.label}
          <i className="ri-close-line text-xs" />
        </button>
      ))}
    </div>
  );
}
