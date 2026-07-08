import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import OceansPropertySearchBar, { type SearchBarValue } from '@/components/feature/OceansPropertySearchBar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import InnerContactSection from '@/components/feature/InnerContactSection';
import LogoLoading from '@/components/base/LogoLoading';
import { useListings, useNeighborhoods, type SupabaseListing } from '@/hooks/useListings';
import type { Property } from '@/types/property';
import SearchFiltersSidebar, { type SearchFilters } from './components/SearchFiltersSidebar';
import ActiveFilterTags from './components/ActiveFilterTags';
import ListingsGrid from '@/pages/listings/components/ListingsGrid';
import ListingsToolbar from '@/pages/listings/components/ListingsToolbar';
import { SearchSEO } from '@/components/feature/PageSEO';
import { matchesAdvancedFilters, parsePriceRangeLabel } from '@/pages/listings/utils/advancedSearchFilters';

function mapListingToProperty(l: SupabaseListing): Property {
  const addressParts = [l.address, l.neighborhood_name, l.city].filter(Boolean);
  const fullLocation = addressParts.length > 0 ? addressParts.join(', ') : (l.location || 'Kampala');
  return {
    id: parseInt(l.id) || 0,
    title: l.title,
    location: fullLocation,
    price: '',
    priceUsd: l.price,
    currency: l.currency || 'USD',
    priceNote: l.price_note || undefined,
    beds: l.bedrooms,
    baths: l.bathrooms,
    parking: l.parking,
    type: l.property_type?.toUpperCase() || 'PROPERTY',
    category: l.purpose === 'rent' ? 'rent' : 'sale',
    badge: l.purpose === 'rent' ? 'To Let' : 'For Sale',
    image:
      l.cover_image ||
      'https://readdy.ai/api/search-image?query=luxury%20residential%20property%20Kampala%20Uganda%20modern%20architecture%20premium%20real%20estate%20photography%20elegant%20interior%20natural%20light&width=600&height=400&seq=search-fallback&orientation=landscape',
    listingDate: l.listing_date || l.created_at?.split('T')[0] || '',
    slug: l.slug,
    description: l.address || l.description || '',
    furnished: l.furnished,
    amenities: l.amenities,
  };
}

const DEFAULT_FILTERS: SearchFilters = {
  purpose: 'all',
  type: '',
  area: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  minSize: '',
  maxSize: '',
};

function filtersFromParams(params: URLSearchParams): SearchFilters {
  return {
    purpose: (params.get('purpose') as SearchFilters['purpose']) || 'all',
    type: params.get('type') || '',
    area: params.get('area') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    beds: params.get('beds') || '',
    minSize: params.get('minSize') || '',
    maxSize: params.get('maxSize') || '',
  };
}

function filtersToParams(filters: SearchFilters, query: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.purpose !== 'all') params.purpose = filters.purpose;
  if (filters.type) params.type = filters.type;
  if (filters.area) params.area = filters.area;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.beds) params.beds = filters.beds;
  if (filters.minSize) params.minSize = filters.minSize;
  if (filters.maxSize) params.maxSize = filters.maxSize;
  if (query.trim()) params.q = query.trim();
  return params;
}

function searchBarFromFilters(filters: SearchFilters, query: string): SearchBarValue {
  return {
    query,
    status: filters.purpose === 'rent' ? 'For Rent' : filters.purpose === 'sale' ? 'For Sale' : 'For Sale',
    type: filters.type || 'Any type',
    maxPrice: filters.maxPrice ? `$${filters.maxPrice}` : 'Max. Price',
    location: filters.area || 'Any',
    beds: filters.beds ? `${filters.beds}+` : 'Any',
    baths: 'Any',
    priceRange: 'Any',
  };
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFilters>(() => filtersFromParams(searchParams));
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Search bar controlled value
  const [searchBarValue, setSearchBarValue] = useState<SearchBarValue>(() =>
    searchBarFromFilters(filtersFromParams(searchParams), searchParams.get('q') || '')
  );

  const { listings: saleListings, loading: saleLoading, error: saleError } = useListings('sale');
  const { listings: rentListings, loading: rentLoading, error: rentError } = useListings('rent');
  const { neighborhoods } = useNeighborhoods();

  const loading = saleLoading || rentLoading;

  // Sync URL params → state on back/forward
  useEffect(() => {
    const fromUrl = filtersFromParams(searchParams);
    const q = searchParams.get('q') || '';
    setFilters((prev) => {
      const next = { ...DEFAULT_FILTERS, ...fromUrl };
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });
    setQuery(q);
    setSearchBarValue(searchBarFromFilters(fromUrl, q));
  }, [searchParams]);

  // Sync filters + query → URL params
  useEffect(() => {
    const params = filtersToParams(filters, query);
    const current = Object.fromEntries(searchParams.entries());
    const next = { ...current, ...params };
    Object.keys(next).forEach((k) => {
      if (!next[k]) delete next[k];
    });
    const nextStr = new URLSearchParams(next).toString();
    const currentStr = searchParams.toString();
    if (nextStr !== currentStr) {
      setSearchParams(next, { replace: true });
    }
  }, [filters, query]);

  const allSource = useMemo<Property[]>(() => {
    const sale = !saleLoading ? saleListings.map(mapListingToProperty) : [];
    const rent = !rentLoading ? rentListings.map(mapListingToProperty) : [];
    void saleError;
    void rentError;
    return [...sale, ...rent];
  }, [saleListings, rentListings, saleLoading, rentLoading, saleError, rentError]);

  const filtered = useMemo(() => {
    let list = allSource.filter((p) => {
      if (filters.purpose === 'sale' && p.category !== 'sale') return false;
      if (filters.purpose === 'rent' && p.category !== 'rent') return false;
      if (filters.type && !p.type.toLowerCase().includes(filters.type.toLowerCase())) return false;
      if (filters.area && !p.location.toLowerCase().includes(filters.area.toLowerCase())) return false;
      if (filters.beds) {
        const min = parseInt(filters.beds);
        if (p.beds < min) return false;
      }
      const rawPrice = p.priceUsd;
      if (rawPrice != null) {
        if (filters.minPrice && rawPrice < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && rawPrice > parseFloat(filters.maxPrice)) return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.location.toLowerCase().includes(q) &&
          !p.type.toLowerCase().includes(q) &&
          !(p.description || '').toLowerCase().includes(q)
        )
          return false;
      }
      if (!matchesAdvancedFilters(p, searchBarValue)) return false;
      return true;
    });

    if (sortBy === 'price_asc') list = [...list].sort((a, b) => (a.priceUsd ?? 0) - (b.priceUsd ?? 0));
    else if (sortBy === 'price_desc') list = [...list].sort((a, b) => (b.priceUsd ?? 0) - (a.priceUsd ?? 0));

    return list;
  }, [allSource, filters, query, sortBy, searchBarValue]);

  const handleFiltersChange = (next: SearchFilters) => {
    setFilters(next);
    setSearchBarValue(searchBarFromFilters(next, query));
  };

  const handleRemoveFilter = (partial: Partial<SearchFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...partial };
      setSearchBarValue(searchBarFromFilters(next, query));
      return next;
    });
  };

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery('');
    setSearchBarValue(searchBarFromFilters(DEFAULT_FILTERS, ''));
  };

  // When search bar changes (controlled), update page state in real time
  const handleSearchBarChange = useCallback((value: SearchBarValue) => {
    setSearchBarValue(value);
    setFilters((prev) => {
      const updates: Partial<SearchFilters> = {};
      if (value.status === 'For Rent') updates.purpose = 'rent';
      else if (value.status === 'For Sale') updates.purpose = 'sale';
      else updates.purpose = 'all';
      if (value.type !== 'Any type') updates.type = value.type;
      if (value.location !== 'Any') updates.area = value.location;
      if (value.beds !== 'Any beds' && value.beds !== 'Any') updates.beds = value.beds.replace('+', '');
      if (value.priceRange && value.priceRange !== 'Any price' && value.priceRange !== 'Any') {
        const { min, max } = parsePriceRangeLabel(value.priceRange);
        updates.minPrice = min != null ? String(min) : '';
        updates.maxPrice = max != null ? String(max) : '';
      }
      return { ...prev, ...updates };
    });
    setQuery(value.query);
  }, []);

  // Handle the Search button — refresh the search page with live data
  const handleSearch = useCallback((value: SearchBarValue) => {
    const params = new URLSearchParams();
    if (value.status === 'For Rent') params.set('purpose', 'rent');
    else if (value.status === 'For Sale') params.set('purpose', 'sale');
    if (value.query.trim()) params.set('q', value.query.trim());
    if (value.type !== 'Any type') params.set('type', value.type);
    if (value.location !== 'Any') params.set('area', value.location);
    if (value.beds !== 'Any beds' && value.beds !== 'Any') params.set('beds', value.beds.replace('+', ''));
    if (value.priceRange && value.priceRange !== 'Any price' && value.priceRange !== 'Any') {
      params.set('priceRange', value.priceRange);
    }
    navigate(`/search?${params.toString()}`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[88px] md:pt-[96px]">
      <SearchSEO />
      <Navbar />

      {/* ── Controlled search bar strip ── */}
      <OceansPropertySearchBar
        targetPath="/search"
        controlled
        value={searchBarValue}
        onChange={handleSearchBarChange}
        onSearch={handleSearch}
      />

      {/* Page title + breadcrumb */}
      <div className="px-5 md:px-10 pt-8 pb-2">
        <div className="flex items-center gap-2 text-xs font-roboto text-stone-400 mb-3">
          <Link to="/" className="hover:text-primary transition-colors cursor-pointer">Home</Link>
          <i className="ri-arrow-right-s-line" />
          <span className="text-stone-500">Search</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-prata text-primary">Property Search</h1>
        <p className="text-sm font-roboto text-stone-500 mt-1">
          Find your perfect property across all listings.
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <SearchFiltersSidebar
          filters={filters}
          neighborhoods={neighborhoods}
          onChange={handleFiltersChange}
          onClear={handleClearAll}
          totalResults={filtered.length}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        {/* Results */}
        <main className="flex-1 px-5 md:px-8 py-7 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden inline-flex items-center gap-1.5 px-4 py-2 border border-primary/30 text-primary text-xs font-roboto cursor-pointer whitespace-nowrap hover:bg-primary/5 transition-colors rounded-sm"
              >
                <i className="ri-filter-3-line" />
                Filters
              </button>
              {!loading && (
                <p className="text-text-gray font-roboto text-sm">
                  <span className="text-primary font-prata text-lg">{filtered.length}</span>
                  <span className="ml-2 text-xs">
                    {filtered.length === 1 ? 'property' : 'properties'} found
                  </span>
                </p>
              )}
            </div>
          </div>

          <ActiveFilterTags filters={filters} onRemove={handleRemoveFilter} />

          <ListingsToolbar
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LogoLoading label="Loading results…" size={64} />
            </div>
          ) : (
            <ListingsGrid
              properties={filtered}
              loading={loading}
              viewMode={viewMode}
              onClearFilters={handleClearAll}
            />
          )}

          {!loading && filtered.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100 text-center">
              <p className="text-text-gray font-roboto text-xs">
                Showing all {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </p>
            </div>
          )}
        </main>
      </div>

      <InnerContactSection />
      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
