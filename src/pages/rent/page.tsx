import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import InnerContactSection from '@/components/feature/InnerContactSection';
import { useListings, useNeighborhoods, type SupabaseListing } from '@/hooks/useListings';
import type { Property } from '@/types/property';
import ListingsToolbar from '@/pages/listings/components/ListingsToolbar';
import ListingsGrid from '@/pages/listings/components/ListingsGrid';
import ListingsSidebarWidgets from '@/pages/listings/components/ListingsSidebarWidgets';
import RecentlyViewedStrip from '@/components/feature/RecentlyViewedStrip';
import Pagination from '@/components/base/Pagination';

import type { ListingFilters } from '@/pages/listings/components/ListingsFilterBar';
import { RentSEO } from '@/components/feature/PageSEO';
import OceansPropertySearchBar, { type SearchBarValue } from '@/components/feature/OceansPropertySearchBar';
import { matchesAdvancedFilters, parsePriceRangeLabel } from '@/pages/listings/utils/advancedSearchFilters';

const PRICE_BRACKETS = [
  { label: 'Any Price', min: null, max: null },
  { label: 'Under $500 pcm', min: null, max: 500 },
  { label: '$500 – $1,000 pcm', min: 500, max: 1000 },
  { label: '$1,000 – $2,500 pcm', min: 1000, max: 2500 },
  { label: '$2,500 – $5,000 pcm', min: 2500, max: 5000 },
  { label: 'Over $5,000 pcm', min: 5000, max: null },
];

const TYPE_OPTIONS = ['All Types', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Family Home', 'Studio', 'Commercial'];
const FURNISHED_OPTIONS = ['Any', 'Furnished', 'Unfurnished'];

const DEFAULT_FILTERS: ListingFilters = {
  search: '',
  type: '',
  area: '',
  priceBracket: 'Any Price',
  beds: '',
  furnished: '',
  currency: '',
};

const PER_PAGE_OPTIONS = [9, 18, 36];

function mapListingToProperty(l: SupabaseListing): Property {
  const fallback = 'https://readdy.ai/api/search-image?query=premium%20rental%20apartment%20Kampala%20Uganda%20furnished%20interior%20modern%20living%20room%20tropical%20garden%20elegant%20expat%20home%20bright%20airy%20spaces&width=600&height=400&seq=rent-placeholder&orientation=landscape';
  const addressParts = [l.address, l.neighborhood_name, l.city].filter(Boolean);
  const fullLocation = addressParts.length > 0 ? addressParts.join(', ') : (l.location || 'Kampala');
  return {
    id: l.id,
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
    category: 'rent',
    badge: 'For Rent',
    image: l.cover_image || fallback,
    images: l.gallery_images && l.gallery_images.length > 0 ? l.gallery_images : undefined,
    listingDate: l.listing_date || '',
    slug: l.slug,
    description: l.address || '',
    furnished: l.furnished,
    amenities: l.amenities,
  };
}

function searchBarFromFilters(filters: ListingFilters): SearchBarValue {
  return {
    query: filters.search,
    status: 'For Rent',
    type: filters.type || 'Any type',
    maxPrice: 'Max. Price',
    location: filters.area || 'Any',
    beds: filters.beds ? `${filters.beds}+` : 'Any',
    baths: 'Any',
    priceRange: filters.priceBracket === 'Any Price' ? 'Any' : filters.priceBracket,
  };
}

function filtersFromParams(params: URLSearchParams): ListingFilters {
  return {
    search: params.get('q') || '',
    type: params.get('type') || '',
    area: params.get('area') || '',
    priceBracket: params.get('price') || 'Any Price',
    beds: params.get('beds') || '',
    furnished: params.get('furnished') || '',
    currency: '',
  };
}

function paramsFromFilters(filters: ListingFilters): Record<string, string> {
  const p: Record<string, string> = {};
  if (filters.search.trim()) p.q = filters.search.trim();
  if (filters.type) p.type = filters.type;
  if (filters.area) p.area = filters.area;
  if (filters.priceBracket && filters.priceBracket !== 'Any Price') p.price = filters.priceBracket;
  if (filters.beds) p.beds = filters.beds;
  if (filters.furnished) p.furnished = filters.furnished;
  return p;
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-50 w-11 h-11 flex items-center justify-center bg-primary text-white cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-110"
    >
      <i className="ri-arrow-up-line text-lg" />
    </button>
  );
}

export default function RentPage() {
  const { listings: supabaseListings, loading, error } = useListings('rent');
  const { neighborhoods } = useNeighborhoods();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters state — seeded from URL params
  const [filters, setFilters] = useState<ListingFilters>(() => {
    const fromUrl = filtersFromParams(searchParams);
    return { ...DEFAULT_FILTERS, ...fromUrl };
  });

  // Search bar controlled value
  const [searchBarValue, setSearchBarValue] = useState<SearchBarValue>(() =>
    searchBarFromFilters({ ...DEFAULT_FILTERS, ...filtersFromParams(searchParams) })
  );

  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'row'>(() =>
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'row' : 'grid'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Sync URL params → filters on back/forward navigation
  useEffect(() => {
    const fromUrl = filtersFromParams(searchParams);
    setFilters((prev) => {
      const next = { ...DEFAULT_FILTERS, ...fromUrl };
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });
    setSearchBarValue(searchBarFromFilters({ ...DEFAULT_FILTERS, ...fromUrl }));
  }, [searchParams]);

  // Sync filters → URL params
  useEffect(() => {
    const params = paramsFromFilters(filters);
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
  }, [filters]);

  const sourceListings: Property[] = useMemo(() => {
    if (!loading) return supabaseListings.map(mapListingToProperty);
    return [];
  }, [supabaseListings, loading]);

  const bracket =
    PRICE_BRACKETS.find((b) => b.label === filters.priceBracket) ||
    parsePriceRangeLabel(filters.priceBracket);
  const currentCurrency = (filters as Record<string, unknown>).currency as string ?? '';

  const filteredAndSorted = useMemo(() => {
    let list = sourceListings.filter((p) => {
      if (filters.type && !p.type.toLowerCase().includes(filters.type.toLowerCase())) return false;
      if (filters.area && !p.location.toLowerCase().includes(filters.area.toLowerCase())) return false;
      if (filters.beds) {
        const min = parseInt(filters.beds);
        if (p.beds < min) return false;
      }
      if (bracket.min !== null || bracket.max !== null) {
        const price = p.priceUsd;
        if (price != null) {
          if (bracket.min !== null && price < bracket.min) return false;
          if (bracket.max !== null && price > bracket.max) return false;
        }
      }
      if (currentCurrency && (p.currency || 'USD') !== currentCurrency) return false;
      // Furnished filter (real furnished flag, not a text-match guess)
      if (filters.furnished === 'Furnished' && p.furnished !== true) return false;
      if (filters.furnished === 'Unfurnished' && p.furnished !== false) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
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

    if (sortBy === 'price_asc')
      list = [...list].sort((a, b) => (a.priceUsd ?? 0) - (b.priceUsd ?? 0));
    else if (sortBy === 'price_desc')
      list = [...list].sort((a, b) => (b.priceUsd ?? 0) - (a.priceUsd ?? 0));

    return list;
  }, [sourceListings, filters, sortBy, bracket, currentCurrency, searchBarValue]);

  // Reset to page 1 whenever filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage, itemsPerPage]);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchBarValue(searchBarFromFilters(DEFAULT_FILTERS));
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // When search bar changes, map back to page filters immediately (real-time)
  const handleSearchBarChange = useCallback((value: SearchBarValue) => {
    setSearchBarValue(value);
    setFilters((prev) => {
      const updates: Partial<ListingFilters> = {};
      // Always apply search query
      updates.search = value.query;
      // Only override type if it's a real selection (not default)
      if (value.type !== 'Any type') updates.type = value.type;
      // Only override area if it's a real selection
      if (value.location !== 'Any') updates.area = value.location;
      // Only override beds if it's a real selection
      if (value.beds !== 'Any beds' && value.beds !== 'Any') updates.beds = value.beds.replace('+', '');
      // Map price dropdown to priceBracket — only if non-default
      if (value.priceRange && value.priceRange !== 'Any price' && value.priceRange !== 'Any') {
        updates.priceBracket = value.priceRange;
      }
      return { ...prev, ...updates };
    });
  }, []);

  // Handle the Search button — navigate to /search page with live Supabase data
  const handleSearch = useCallback((value: SearchBarValue) => {
    const params = new URLSearchParams();
    params.set('purpose', 'rent');
    if (value.query.trim()) params.set('q', value.query.trim());
    if (value.type !== 'Any type') params.set('type', value.type);
    if (value.location !== 'Any') params.set('area', value.location);
    if (value.beds !== 'Any beds' && value.beds !== 'Any') params.set('beds', value.beds.replace('+', ''));
    if (value.priceRange && value.priceRange !== 'Any price' && value.priceRange !== 'Any') {
      params.set('priceRange', value.priceRange);
    }
    navigate(`/search?${params.toString()}`);
  }, [navigate]);

  // When sidebar widgets change, sync back to search bar
  const updateFilters = useCallback((partial: Partial<ListingFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...partial };
      setSearchBarValue(searchBarFromFilters(next));
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[88px] md:pt-[96px]">
      <RentSEO count={sourceListings.length} />
      <Navbar />

      {/* ── Controlled search bar strip ── */}
      <OceansPropertySearchBar
        targetPath="/rent"
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
          <span className="text-stone-500">Rent</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-prata text-primary">Properties To Rent</h1>
        <p className="text-sm font-roboto text-stone-500 mt-1">
          Find your perfect home across Kampala&apos;s most desirable locations.
        </p>
      </div>

      {/* Results area */}
      <main className="flex-1 px-5 md:px-10 py-7">

        <div className="flex flex-col lg:flex-row gap-7">
          {/* Listings column */}
          <div className="flex-1 min-w-0">
            {/* Toolbar row with filter pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                {filteredAndSorted.length !== sourceListings.length && (
                  <span className="text-xs font-roboto text-text-gray">
                    <span className="text-primary font-semibold">{filteredAndSorted.length}</span>
                    {' '}of{' '}
                    <span className="text-primary font-semibold">{sourceListings.length}</span>
                    {' '}rentals
                  </span>
                )}
                {filteredAndSorted.length === sourceListings.length && (
                  <span className="text-xs font-roboto text-text-gray">
                    <span className="text-primary font-semibold">{sourceListings.length}</span> rentals
                  </span>
                )}
                {/* Active filter pills */}
                {filters.type && (
                  <FilterPill label={filters.type} onRemove={() => updateFilters({ type: '' })} />
                )}
                {filters.area && (
                  <FilterPill label={filters.area} onRemove={() => updateFilters({ area: '' })} />
                )}
                {filters.beds && (
                  <FilterPill label={`${filters.beds}+ beds`} onRemove={() => updateFilters({ beds: '' })} />
                )}
                {filters.priceBracket && filters.priceBracket !== 'Any Price' && (
                  <FilterPill label={filters.priceBracket} onRemove={() => updateFilters({ priceBracket: 'Any Price' })} />
                )}
                {filters.furnished && filters.furnished !== '' && (
                  <FilterPill label={filters.furnished} onRemove={() => updateFilters({ furnished: '' })} />
                )}
                {filters.search.trim() && (
                  <FilterPill label={`"${filters.search}"`} onRemove={() => updateFilters({ search: '' })} />
                )}
                {(filters.type || filters.area || filters.beds || filters.furnished || (filters.priceBracket && filters.priceBracket !== 'Any Price') || filters.search.trim()) && (
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-roboto text-text-gray underline hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <ListingsToolbar
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>

            <ListingsGrid
              properties={paginatedListings}
              loading={loading}
              viewMode={viewMode}
              onClearFilters={clearFilters}
              emptyTitle="No rentals match your filters"
              emptySubtitle="Try broadening your search criteria or clearing some filters."
            />

            {!loading && filteredAndSorted.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAndSorted.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={setItemsPerPage}
                itemsPerPageOptions={PER_PAGE_OPTIONS}
                itemLabel="rentals"
              />
            )}
          </div>

          {/* Sidebar widgets */}
          <div className="hidden lg:block lg:w-52 xl:w-56 shrink-0">
            <div className="sticky top-24">
              <ListingsSidebarWidgets
                activeBeds={filters.beds}
                onBedsChange={(beds) => updateFilters({ beds })}
                activeType={filters.type}
                onTypeChange={(type) => updateFilters({ type })}
                activeBracket={filters.priceBracket}
                onBracketChange={(priceBracket) => updateFilters({ priceBracket })}
                activeArea={filters.area}
                onAreaChange={(area) => updateFilters({ area })}
                typeOptions={TYPE_OPTIONS}
                priceBrackets={PRICE_BRACKETS}
                neighborhoods={neighborhoods}
              />
            </div>
          </div>
        </div>
      </main>

      <RecentlyViewedStrip />

      {/* CTA Banner */}
      <div
        className="relative py-16 px-6 text-center overflow-hidden"
        style={{
          backgroundImage:
            'url(https://readdy.ai/api/search-image?query=modern%20Kampala%20Uganda%20apartment%20building%20exterior%20tropical%20landscaping%20premium%20residential%20complex%20warm%20afternoon%20light%20real%20estate%20photography&width=1920&height=400&seq=rent-cta1&orientation=landscape)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-10">
          <p className="text-golden text-sm md:text-base font-roboto tracking-widest uppercase mb-3">
            Own a Property?
          </p>
          <h2 className="text-white font-prata text-2xl md:text-3xl mb-3">
            List Your Property With Us
          </h2>
          <p className="text-white/70 font-roboto text-sm mb-7 max-w-md mx-auto">
            Reach thousands of qualified tenants. Get a free rental assessment from our expert team today.
          </p>
          <Link
            to="/landlords"
            className="inline-flex items-center gap-2 px-8 py-3 bg-golden text-white font-roboto text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-golden/90 transition-colors"
          >
            <i className="ri-home-heart-line" />
            Get Rental Valuation
          </Link>
        </div>
      </div>

      <InnerContactSection />
      <GlobalContactStrip />
      <Footer />
      <BackToTopButton />
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/8 text-primary text-[10px] font-roboto rounded-full cursor-pointer hover:bg-primary/15 transition-colors whitespace-nowrap"
    >
      {label}
      <i className="ri-close-line text-[10px]" />
    </button>
  );
}
