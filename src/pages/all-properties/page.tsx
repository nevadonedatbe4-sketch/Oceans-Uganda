import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import OceansPropertySearchBar, { type SearchBarValue } from '@/components/feature/OceansPropertySearchBar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import RecentlyViewedStrip from '@/components/feature/RecentlyViewedStrip';
import AllPropertiesHeader from './components/AllPropertiesHeader';
import AllPropertiesGrid from './components/AllPropertiesGrid';
import AllPropertiesSearchOverlay from './components/AllPropertiesSearchOverlay';
import InnerContactSection from '@/components/feature/InnerContactSection';
import { useAllListings, useNeighborhoods, type SupabaseListing } from '@/hooks/useListings';
import type { Property } from '@/types/property';
import { AllPropertiesSEO } from '@/components/feature/PageSEO';
import { matchesAdvancedFilters, parsePriceRangeLabel } from '@/pages/listings/utils/advancedSearchFilters';

const PAGE_SIZE = 12;

function mapListingToProperty(l: SupabaseListing): Property {
  const fallback =
    'https://readdy.ai/api/search-image?query=premium%20property%20Kampala%20Uganda%20modern%20interior%20elegant%20architecture%20real%20estate%20photography&width=600&height=400&seq=allprop-fallback&orientation=landscape';
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
    category: l.purpose === 'rent' ? 'rent' : 'sale',
    badge: l.purpose === 'rent' ? 'TO LET' : 'FOR SALE',
    image: l.cover_image || fallback,
    images: l.gallery_images && l.gallery_images.length > 0 ? l.gallery_images : undefined,
    listingDate: l.listing_date || '',
    slug: l.slug,
    description: l.address || '',
    sqft: l.size_sqm ? Math.round(l.size_sqm * 10.764) : undefined,
    furnished: l.furnished,
    amenities: l.amenities,
  };
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
      className="fixed bottom-8 right-8 z-50 w-11 h-11 flex items-center justify-center bg-primary text-white cursor-pointer whitespace-nowrap transition-all duration-300 hover:bg-golden"
    >
      <i className="ri-arrow-up-line text-lg" />
    </button>
  );
}

interface OverlayFilters {
  search: string;
  status: string;
  neighbourhood: string;
  type: string;
  beds: string;
  priceBracket: string;
}

const DEFAULT_OVERLAY_FILTERS: OverlayFilters = {
  search: '',
  status: 'All',
  neighbourhood: 'All',
  type: '',
  beds: '',
  priceBracket: 'Any Price',
};

function overlayFromSearchBar(value: SearchBarValue): Partial<OverlayFilters> {
  return {
    search: value.query,
    status: value.status === 'For Rent' ? 'For Rent' : value.status === 'For Sale' ? 'For Sale' : 'All',
    type: value.type === 'Any type' ? '' : value.type,
    neighbourhood: value.location === 'Any' ? 'All' : value.location,
    beds: value.beds === 'Any' || value.beds === 'Any beds' ? '' : value.beds.replace('+', ''),
    priceBracket:
      value.priceRange && value.priceRange !== 'Any price' && value.priceRange !== 'Any'
        ? value.priceRange
        : 'Any Price',
  };
}

function searchBarFromOverlay(overlay: OverlayFilters): SearchBarValue {
  return {
    query: overlay.search,
    status: overlay.status === 'For Rent' ? 'For Rent' : overlay.status === 'For Sale' ? 'For Sale' : 'For Sale',
    type: overlay.type || 'Any type',
    maxPrice: 'Max. Price',
    location: overlay.neighbourhood === 'All' ? 'Any' : overlay.neighbourhood,
    beds: overlay.beds ? `${overlay.beds}+` : 'Any',
    baths: 'Any',
    priceRange: overlay.priceBracket && overlay.priceBracket !== 'Any Price' ? overlay.priceBracket : 'Any',
  };
}

export default function AllPropertiesPage() {
  const { listings: allListings, loading, error: listingsError } = useAllListings();
  const { neighborhoods } = useNeighborhoods();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Simple bar filters (top bar)
  const [activeTab, setActiveTab] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Overlay filters
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayFilters, setOverlayFilters] = useState<OverlayFilters>(DEFAULT_OVERLAY_FILTERS);

  // Search bar controlled value
  const [searchBarValue, setSearchBarValue] = useState<SearchBarValue>(() =>
    searchBarFromOverlay(DEFAULT_OVERLAY_FILTERS)
  );

  // Read URL params into state on mount / navigation
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const purpose = searchParams.get('purpose') || '';
    const type = searchParams.get('type') || '';
    const area = searchParams.get('area') || '';
    const beds = searchParams.get('beds') || '';
    const price = searchParams.get('price') || '';

    setSearchQuery(q);
    setActiveStatus(purpose === 'rent' ? 'For Rent' : purpose === 'sale' ? 'For Sale' : 'All');
    setActiveTab(area || 'All');

    const nextOverlay: OverlayFilters = {
      search: q,
      status: purpose === 'rent' ? 'For Rent' : purpose === 'sale' ? 'For Sale' : 'All',
      neighbourhood: area || 'All',
      type,
      beds: beds ? beds.replace('+', '') : '',
      priceBracket: price || 'Any Price',
    };
    setOverlayFilters(nextOverlay);
    setSearchBarValue(searchBarFromOverlay(nextOverlay));
  }, [searchParams]);

  const sourceListings: Property[] = useMemo(() => {
    if (!loading) return allListings.map(mapListingToProperty);
    return [];
  }, [allListings, loading]);

  const neighborhoodTabs = useMemo(() => {
    const names = neighborhoods.length > 0
      ? neighborhoods.map((n) => n.name)
      : [...new Set(sourceListings.map((p) => p.location.split(',')[0].trim()))];
    return ['All', ...names];
  }, [neighborhoods, sourceListings]);

  // Combined filtering: top bar + overlay
  const filtered = useMemo(() => {
    let list = sourceListings;

    // Top bar: neighbourhood tab
    const nbFilter = overlayFilters.neighbourhood !== 'All' ? overlayFilters.neighbourhood : activeTab;
    if (nbFilter !== 'All') {
      list = list.filter((p) =>
        p.location.toLowerCase().includes(nbFilter.toLowerCase())
      );
    }

    // Status: overlay takes priority over top bar
    const statusFilter = overlayFilters.status !== 'All' ? overlayFilters.status : activeStatus;
    if (statusFilter === 'For Rent') {
      list = list.filter((p) => p.category === 'rent');
    } else if (statusFilter === 'For Sale') {
      list = list.filter((p) => p.category === 'sale');
    }

    // Keyword: overlay takes priority over top bar
    const kw = overlayFilters.search.trim() || searchQuery.trim();
    if (kw) {
      const q = kw.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          (p.type || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }

    // Overlay: property type
    if (overlayFilters.type) {
      list = list.filter((p) =>
        (p.type || '').toLowerCase().includes(overlayFilters.type.toLowerCase())
      );
    }

    // Overlay: bedrooms
    if (overlayFilters.beds) {
      const minBeds = parseInt(overlayFilters.beds, 10);
      list = list.filter((p) => (p.beds ?? 0) >= minBeds);
    }

    // Overlay: price bracket
    const bracket = parsePriceRangeLabel(overlayFilters.priceBracket);
    if (bracket.min !== null || bracket.max !== null) {
      list = list.filter((p) => {
        if (p.priceUsd == null) return true;
        if (bracket.min !== null && p.priceUsd < bracket.min) return false;
        if (bracket.max !== null && p.priceUsd > bracket.max) return false;
        return true;
      });
    }

    // Advanced Filters panel (from the search bar)
    list = list.filter((p) => matchesAdvancedFilters(p, searchBarValue));

    return list;
  }, [sourceListings, activeTab, activeStatus, searchQuery, overlayFilters, searchBarValue]);

  const overlayActiveCount = [
    overlayFilters.search.trim(),
    overlayFilters.status !== 'All' ? overlayFilters.status : '',
    overlayFilters.neighbourhood !== 'All' ? overlayFilters.neighbourhood : '',
    overlayFilters.type,
    overlayFilters.beds,
    overlayFilters.priceBracket !== 'Any Price' ? overlayFilters.priceBracket : '',
  ].filter(Boolean).length;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setVisibleCount(PAGE_SIZE);
    syncUrlParams({ area: tab === 'All' ? '' : tab });
  };

  const handleStatusChange = (s: string) => {
    setActiveStatus(s);
    setVisibleCount(PAGE_SIZE);
    syncUrlParams({ purpose: s === 'All' ? '' : s === 'For Rent' ? 'rent' : 'sale' });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setVisibleCount(PAGE_SIZE);
    syncUrlParams({ q });
  };

  const handleOverlayApply = (f: OverlayFilters) => {
    setOverlayFilters(f);
    setVisibleCount(PAGE_SIZE);
    // Sync top bar with overlay values
    if (f.neighbourhood !== 'All') setActiveTab(f.neighbourhood);
    if (f.status !== 'All') setActiveStatus(f.status);
    if (f.search.trim()) setSearchQuery(f.search);
    setSearchBarValue(searchBarFromOverlay(f));
    syncUrlParams({
      q: f.search,
      purpose: f.status === 'All' ? '' : f.status === 'For Rent' ? 'rent' : 'sale',
      area: f.neighbourhood === 'All' ? '' : f.neighbourhood,
      type: f.type,
      beds: f.beds,
      price: f.priceBracket && f.priceBracket !== 'Any Price' ? f.priceBracket : '',
    });
  };

  function syncUrlParams(updates: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    setSearchParams(next, { replace: true });
  }

  // When search bar changes (controlled), apply to filters
  const handleSearchBarChange = (value: SearchBarValue) => {
    setSearchBarValue(value);
    const overlay = overlayFromSearchBar(value);
    setOverlayFilters((prev) => {
      const next = { ...prev };
      if (overlay.search !== undefined) next.search = overlay.search;
      if (overlay.status && overlay.status !== 'All') next.status = overlay.status;
      if (overlay.neighbourhood && overlay.neighbourhood !== 'All') next.neighbourhood = overlay.neighbourhood;
      if (overlay.type) next.type = overlay.type;
      if (overlay.beds) next.beds = overlay.beds;
      if (overlay.priceBracket && overlay.priceBracket !== 'Any Price') next.priceBracket = overlay.priceBracket;
      return next;
    });
    setSearchQuery(overlay.search || '');
    if (overlay.status && overlay.status !== 'All') setActiveStatus(overlay.status);
    if (overlay.neighbourhood && overlay.neighbourhood !== 'All') setActiveTab(overlay.neighbourhood);
    syncUrlParams({
      q: overlay.search || '',
      purpose: overlay.status === 'All' ? '' : overlay.status === 'For Rent' ? 'rent' : 'sale',
      area: overlay.neighbourhood === 'All' ? '' : overlay.neighbourhood,
      type: overlay.type || '',
      beds: overlay.beds || '',
      price: overlay.priceBracket && overlay.priceBracket !== 'Any Price' ? overlay.priceBracket : '',
    });
  };

  // Handle the Search button — navigate to /search page with live Supabase data
  const handleSearch = (value: SearchBarValue) => {
    const params = new URLSearchParams();
    if (value.query.trim()) params.set('q', value.query.trim());
    if (value.status === 'For Rent') params.set('purpose', 'rent');
    else if (value.status === 'For Sale') params.set('purpose', 'sale');
    if (value.type !== 'Any type') params.set('type', value.type);
    if (value.location !== 'Any') params.set('area', value.location);
    if (value.beds !== 'Any beds' && value.beds !== 'Any') params.set('beds', value.beds.replace('+', ''));
    if (value.priceRange && value.priceRange !== 'Any price' && value.priceRange !== 'Any') {
      params.set('priceRange', value.priceRange);
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-[88px] md:pt-[96px]">
      <AllPropertiesSEO count={sourceListings.length} />
      <Navbar />

      {/* ── Search bar ── */}
      <OceansPropertySearchBar
        targetPath="/all-properties"
        controlled
        value={searchBarValue}
        onChange={handleSearchBarChange}
        onSearch={handleSearch}
      />

      <AllPropertiesHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        neighborhoodTabs={neighborhoodTabs}
        totalCount={filtered.length}
      />

      <main className="flex-1 px-5 md:px-10 py-8">
        <AllPropertiesGrid
          properties={filtered}
          loading={loading}
          visibleCount={visibleCount}
          onLoadMore={() => setVisibleCount((v) => v + PAGE_SIZE)}
          error={listingsError}
        />
      </main>

      <InnerContactSection />
      <GlobalContactStrip />
      <RecentlyViewedStrip />
      <Footer />
      <BackToTopButton />

      <AllPropertiesSearchOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        filters={overlayFilters}
        onApply={handleOverlayApply}
        neighbourhoodTabs={neighborhoodTabs}
        totalCount={filtered.length}
        loading={loading}
      />
    </div>
  );
}
