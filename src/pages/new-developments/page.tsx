import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import InnerContactSection from '@/components/feature/InnerContactSection';
import LogoLoading from '@/components/base/LogoLoading';
import { useListings, useNeighborhoods, type SupabaseListing } from '@/hooks/useListings';
import PropertyCard from '@/components/base/PropertyCard';
import type { Property } from '@/types/property';
import { NewDevelopmentsSEO } from '@/components/feature/PageSEO';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const DEFAULT_HERO_IMAGE = 'https://readdy.ai/api/search-image?query=modern%20luxury%20residential%20development%20construction%20site%20Kampala%20Uganda%20contemporary%20architecture%20crane%20building%20progress%20premium%20real%20estate%20investment%20blue%20sky%20professional%20photography%20high%20contrast&width=1920&height=700&seq=dev-hero1&orientation=landscape';

const PRICE_BRACKETS = [
  { label: 'Any Price', min: null, max: null },
  { label: 'Under $150K', min: null, max: 150000 },
  { label: '$150K – $300K', min: 150000, max: 300000 },
  { label: '$300K – $500K', min: 300000, max: 500000 },
  { label: '$500K – $1M', min: 500000, max: 1000000 },
  { label: 'Over $1M', min: 1000000, max: null },
];

const BEDS_OPTIONS = ['Any Beds', '1+', '2+', '3+', '4+', '5+'];
const PROPERTY_TYPE_OPTIONS = ['All Types', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Family Home', 'Studio'];

function mapListingToProperty(l: SupabaseListing): Property {
  return {
    id: l.id,
    title: l.title,
    location: l.neighborhood_name || l.location || 'Kampala',
    price: '',
    priceUsd: l.price,
    currency: l.currency || 'USD',
    priceNote: l.price_note || undefined,
    beds: l.bedrooms,
    baths: l.bathrooms,
    parking: l.parking,
    type: l.property_type?.toUpperCase() || 'PROPERTY',
    category: 'sale',
    badge: 'New Development',
    image: l.cover_image || 'https://readdy.ai/api/search-image?query=modern%20new%20development%20property%20Kampala%20Uganda%20luxury%20residential%20building%20contemporary%20architecture%20premium%20real%20estate%20photography&width=600&height=400&seq=dev-placeholder&orientation=landscape',
    listingDate: l.listing_date || l.created_at?.split('T')[0] || '',
    slug: l.slug,
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
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white cursor-pointer whitespace-nowrap transition-all duration-300 hover:scale-110"
      style={{ backgroundColor: '#0D5959' }}
    >
      <i className="ri-arrow-up-line text-lg md:text-xl" />
    </button>
  );
}

export default function NewDevelopmentsPage() {
  const { get } = useSiteSettings();
  const { listings: supabaseListings, loading, error } = useListings('new_dev');
  const { neighborhoods } = useNeighborhoods();

  const [typeFilter, setTypeFilter] = useState('All Types');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('');
  const [priceBracket, setPriceBracket] = useState('Any Price');
  const [bedsFilter, setBedsFilter] = useState('Any Beds');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  const sourceListings: Property[] = useMemo(() => {
    if (!loading && supabaseListings.length > 0) return supabaseListings.map(mapListingToProperty);
    return [];
  }, [supabaseListings, loading, error]);

  // Featured = first 3 with cover images
  const featuredListings = useMemo(
    () => sourceListings.filter((p) => p.image && !p.image.includes('readdy.ai')).slice(0, 3),
    [sourceListings]
  );

  const bracket = PRICE_BRACKETS.find((b) => b.label === priceBracket) || PRICE_BRACKETS[0];

  const filtered = useMemo(() => {
    let list = sourceListings.filter((p) => {
      if (typeFilter !== 'All Types' && !p.type.toLowerCase().includes(typeFilter.toLowerCase())) return false;
      if (neighborhoodFilter && !p.location.toLowerCase().includes(neighborhoodFilter.toLowerCase())) return false;
      if (bedsFilter !== 'Any Beds') {
        const min = parseInt(bedsFilter);
        if (p.beds < min) return false;
      }
      if (bracket.min !== null || bracket.max !== null) {
        // For new developments, price is in priceUsd
        const price = p.priceUsd ?? 0;
        if (price > 0) {
          if (bracket.min !== null && price < bracket.min) return false;
          if (bracket.max !== null && price > bracket.max) return false;
        }
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price_asc') list = [...list].sort((a, b) => (a.priceUsd ?? 0) - (b.priceUsd ?? 0));
    else if (sortBy === 'price_desc') list = [...list].sort((a, b) => (b.priceUsd ?? 0) - (a.priceUsd ?? 0));

    return list;
  }, [sourceListings, typeFilter, neighborhoodFilter, priceBracket, bedsFilter, search, sortBy, bracket]);

  const clearFilters = () => {
    setTypeFilter('All Types');
    setNeighborhoodFilter('');
    setPriceBracket('Any Price');
    setBedsFilter('Any Beds');
    setSearch('');
    setSortBy('newest');
  };

  const hasActiveFilters = typeFilter !== 'All Types' || neighborhoodFilter !== '' || priceBracket !== 'Any Price' || bedsFilter !== 'Any Beds' || search.trim() !== '';

  // Settings from management (nd_* prefix)
  const heroVisible = get('nd_hero_visible', 'true') !== 'false';
  const heroImage = get('nd_hero_image', '') || DEFAULT_HERO_IMAGE;
  const heroHeight = parseInt(get('nd_hero_height', '700'));
  const heroAlign = get('nd_hero_align', 'center');
  const heroOverlayColor = get('nd_hero_overlay_color', '#000000');
  const heroOverlayOpacity = parseInt(get('nd_hero_overlay_opacity', '60')) / 100;
  const heroEyebrow = get('nd_hero_eyebrow', 'Premium Developments');
  const heroTitle = get('nd_hero_title', 'New Developments');
  const heroSubtitle = get('nd_hero_subtitle', "Discover Kampala's finest off-plan and newly completed properties. From luxury apartments to exclusive villas — secure your future home today.");

  const benefitsVisible = get('nd_benefits_visible', 'true') !== 'false';
  const benefitsEyebrow = get('nd_benefits_eyebrow', 'The Benefits');
  const benefitsTitle = get('nd_benefits_title', 'Why Buy a New Development?');
  const benefitsBg = get('nd_benefits_bg', '#F5F7F7');

  const WHY_NEW_DEV = [1, 2, 3, 4, 5, 6].map((n) => ({
    icon: get(`nd_benefit${n}_icon`, ['ri-price-tag-3-line', 'ri-palette-line', 'ri-shield-check-line', 'ri-line-chart-line', 'ri-file-list-3-line', 'ri-tools-line'][n - 1]),
    title: get(`nd_benefit${n}_title`, ['Early-Bird Pricing', 'Customisation Options', 'Modern Standards', 'Capital Appreciation', 'Payment Plans', 'Warranty Protection'][n - 1]),
    desc: get(`nd_benefit${n}_desc`, [
      'Secure properties at pre-construction prices, often 15-20% below market value upon completion.',
      'Choose finishes, layouts, and fixtures to match your personal taste before construction is complete.',
      'Benefit from the latest building codes, energy efficiency, and contemporary design.',
      'Properties typically gain significant value between launch and completion.',
      'Flexible staged payments tied to construction milestones, making luxury more accessible.',
      'New builds come with structural warranties and builder guarantees for peace of mind.',
    ][n - 1]),
  }));

  const ctaVisible = get('nd_cta_visible', 'true') !== 'false';
  const ctaTitle = get('nd_cta_title', 'Have a Development to Sell?');
  const ctaBody = get('nd_cta_body', "We work with leading developers across Uganda to market and sell premium new developments. Partner with Kampala's most trusted agency.");
  const ctaBtn1Label = get('nd_cta_btn1_label', 'Contact Our Team');
  const ctaBtn1Link = get('nd_cta_btn1_link', '/contact');
  const ctaBtn2Label = get('nd_cta_btn2_label', 'Request Valuation');
  const ctaBtn2Link = get('nd_cta_btn2_link', '/landlords');
  const ctaBg = get('nd_cta_bg', '#001731');

  const showFeatured = get('nd_show_featured', 'true') !== 'false';
  const accentColor = get('nd_card_icon_color', '#C9A84C');
  const cardBg = get('nd_card_bg', '#ffffff');
  const cardBorder = get('nd_card_border', '#F3F4F6');

  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[96px]">
      <NewDevelopmentsSEO />
      <Navbar />

      {/* Hero */}
      {heroVisible && (
        <div
          className="relative flex flex-col items-center justify-center text-center overflow-hidden pt-12 pb-12 md:pt-16 md:pb-16"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '320px',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: heroOverlayColor, opacity: 0.6 }} />
          <div className={`relative z-10 w-full max-w-3xl mx-auto px-4 md:px-6 ${heroAlign === 'left' ? 'text-left' : 'text-center'}`}>
            <p className="text-sm md:text-base font-roboto font-semibold tracking-widest uppercase mb-3 md:mb-4" style={{ color: accentColor }}>{heroEyebrow}</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-prata text-white mb-4 md:mb-5 leading-tight">{heroTitle}</h1>
            <p className="text-white/80 font-roboto text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mx-auto">
              {heroSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Featured Developments — only shown when real listings exist */}
      {showFeatured && !loading && featuredListings.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-14">
              <p className="text-sm md:text-base font-roboto font-semibold tracking-widest uppercase mb-2 md:mb-3" style={{ color: accentColor }}>Featured Projects</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-prata text-primary">Signature Developments</h2>
            </div>
            <div className="space-y-6 md:space-y-10">
              {featuredListings.map((dev, idx) => (
                <div
                  key={dev.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden border rounded-sm transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: cardBorder, boxShadow: '0 12px 48px rgba(0,23,49,0.10)' }}
                >
                  <div className={`relative h-56 sm:h-64 md:h-72 lg:h-auto ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img src={dev.image} alt={dev.title} className="w-full h-full object-cover object-top" />
                    <div className="absolute top-3 left-3 md:top-4 md:left-4">
                      <span className="text-white font-roboto text-[11px] md:text-xs px-2.5 md:px-3 py-1 md:py-1.5 uppercase tracking-wider" style={{ backgroundColor: accentColor }}>
                        {dev.priceUsd ? `$${dev.priceUsd.toLocaleString()}` : 'POA'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 md:top-4 md:right-4">
                      <span className="text-white font-roboto text-[11px] md:text-xs px-2.5 md:px-3 py-1 md:py-1.5 uppercase tracking-wider" style={{ backgroundColor: '#F66B13' }}>
                        New Development
                      </span>
                    </div>
                  </div>
                  <div className={`p-5 md:p-8 lg:p-10 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:order-1' : ''}`} style={{ backgroundColor: cardBg }}>
                    <p className="text-xs font-roboto font-semibold tracking-widest uppercase mb-2" style={{ color: accentColor }}>New Development</p>
                    <h3 className="text-primary font-prata text-xl md:text-2xl mb-2 md:mb-3">{dev.title}</h3>
                    <p className="text-text-gray font-roboto text-sm flex items-center gap-1.5 mb-3 md:mb-4">
                      <i className="ri-map-pin-2-line" style={{ color: accentColor }} />
                      {dev.location}
                    </p>
                    <div className="flex flex-wrap gap-3 md:gap-4 mb-4 md:mb-6">
                      {dev.beds > 0 && (
                        <div className="flex items-center gap-2 text-xs md:text-sm font-roboto text-text-gray">
                          <i className="ri-hotel-bed-line text-primary" />
                          {dev.beds} Bedrooms
                        </div>
                      )}
                      {dev.baths > 0 && (
                        <div className="flex items-center gap-2 text-xs md:text-sm font-roboto text-text-gray">
                          <img
                            src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c"
                            alt="Bath"
                            className="w-4 h-4 object-contain"
                          />
                          {dev.baths} Bathrooms
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 mt-auto">
                      {dev.slug && (
                        <Link to={`/property/${dev.slug}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-primary text-white font-roboto text-[11px] md:text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-primary/90 transition-colors">
                          <i className="ri-eye-line" />
                          View Development
                        </Link>
                      )}
                      <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 border border-primary text-primary font-roboto text-[11px] md:text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-primary hover:text-white transition-colors">
                        <i className="ri-mail-line" />
                        Enquire Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Buy New */}
      {benefitsVisible && (
        <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6" style={{ background: benefitsBg }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-14">
              <p className="text-sm md:text-base font-roboto font-semibold tracking-widest uppercase mb-2 md:mb-3" style={{ color: accentColor }}>{benefitsEyebrow}</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-prata text-primary">{benefitsTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {WHY_NEW_DEV.map((item) => (
                <div key={item.title} className="p-5 md:p-6 lg:p-7 border rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-primary/5 rounded-full mb-4 md:mb-5">
                    <i className={`${item.icon} text-lg md:text-xl`} style={{ color: accentColor }} />
                  </div>
                  <h3 className="text-primary font-prata text-sm md:text-base mb-2">{item.title}</h3>
                  <p className="text-text-gray font-roboto text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All New Developments */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-white" id="browse">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-sm md:text-base font-roboto font-semibold tracking-widest uppercase mb-2 md:mb-3" style={{ color: accentColor }}>Browse All</p>
            <h2 className="text-2xl md:text-3xl font-prata text-primary">All New Developments</h2>
          </div>

          {/* Filter Bar */}
          <div className="bg-primary px-3 md:px-6 py-3 md:py-5 mb-6 md:mb-10">
            <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-2 md:gap-3">
              <div className="flex flex-1 min-w-0 gap-2">
                <div className="flex-1 min-w-0 relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search developments..."
                    className="w-full bg-white/10 border border-white/20 rounded-sm pl-9 pr-4 py-2 md:py-2.5 text-sm font-roboto text-white placeholder:text-white/40 focus:outline-none focus:border-golden"
                  />
                </div>
                <button
                  onClick={() => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-golden text-white font-roboto text-xs md:text-sm tracking-wider uppercase cursor-pointer whitespace-nowrap hover:bg-golden-dark transition-colors rounded-sm"
                >
                  <i className="ri-search-line" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
              <div className="grid grid-cols-2 md:flex gap-2 md:gap-3">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-white/10 border border-white/20 text-white/80 rounded-sm px-3 md:px-4 py-2 md:py-2.5 text-sm font-roboto focus:outline-none focus:border-golden cursor-pointer min-w-0">
                  {PROPERTY_TYPE_OPTIONS.map((o) => <option key={o} value={o} className="bg-primary text-white">{o}</option>)}
                </select>
                <select value={neighborhoodFilter} onChange={(e) => setNeighborhoodFilter(e.target.value)} className="bg-white/10 border border-white/20 text-white/80 rounded-sm px-3 md:px-4 py-2 md:py-2.5 text-sm font-roboto focus:outline-none focus:border-golden cursor-pointer min-w-0">
                  <option value="" className="bg-primary text-white">All Areas</option>
                  {neighborhoods.map((n) => <option key={n.id} value={n.name} className="bg-primary text-white">{n.name}</option>)}
                </select>
                <select value={priceBracket} onChange={(e) => setPriceBracket(e.target.value)} className="bg-white/10 border border-white/20 text-white/80 rounded-sm px-3 md:px-4 py-2 md:py-2.5 text-sm font-roboto focus:outline-none focus:border-golden cursor-pointer min-w-0">
                  {PRICE_BRACKETS.map((b) => <option key={b.label} value={b.label} className="bg-primary text-white">{b.label}</option>)}
                </select>
                <select value={bedsFilter} onChange={(e) => setBedsFilter(e.target.value)} className="bg-white/10 border border-white/20 text-white/80 rounded-sm px-3 md:px-4 py-2 md:py-2.5 text-sm font-roboto focus:outline-none focus:border-golden cursor-pointer min-w-0">
                  {BEDS_OPTIONS.map((o) => <option key={o} value={o} className="bg-primary text-white">{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Results header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="flex items-center gap-2 text-text-gray font-roboto text-sm">
                  <i className="ri-loader-4-line animate-spin text-golden" />
                  Loading developments...
                </div>
              ) : (
                <p className="text-primary text-sm font-roboto">
                  <span className="font-prata text-xl" style={{ color: accentColor }}>{filtered.length}</span>
                  <span className="ml-2 text-text-gray">{filtered.length === 1 ? 'development' : 'developments'} found{hasActiveFilters && <span className="ml-1" style={{ color: accentColor }}>(filtered)</span>}</span>
                </p>
              )}
              {hasActiveFilters && <button onClick={clearFilters} className="text-xs font-roboto underline cursor-pointer whitespace-nowrap" style={{ color: accentColor }}>Clear all</button>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-gray font-roboto text-xs">Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="border border-gray-200 text-primary rounded-sm px-3 py-1.5 text-sm font-roboto focus:outline-none focus:border-golden cursor-pointer">
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LogoLoading label="Loading developments…" size={64} />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((property) => (
                property.slug ? (
                  <Link key={property.id} to={`/property/${property.slug}`} className="block rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <PropertyCard property={property} />
                  </Link>
                ) : (
                  <div key={property.id} className="rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <PropertyCard property={property} />
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <i className="ri-building-3-line text-5xl text-gray-200 mb-4 block" />
              <p className="text-text-gray font-roboto font-medium">No new developments listed yet.</p>
              <p className="text-text-gray/70 text-sm font-roboto mt-1">Check back soon or contact us to register your interest.</p>
              <Link to="/contact" className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-roboto text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-primary/90 transition-colors">
                <i className="ri-mail-line" />
                Register Interest
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {ctaVisible && (
        <section className="py-10 md:py-14 lg:py-16 px-4 md:px-6" style={{ backgroundColor: ctaBg }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white font-prata text-2xl md:text-3xl mb-3 md:mb-4">{ctaTitle}</h2>
            <p className="text-white/70 font-roboto text-xs md:text-sm mb-6 md:mb-8 max-w-lg mx-auto">{ctaBody}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link to={ctaBtn1Link} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3.5 text-white font-roboto text-xs md:text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity" style={{ backgroundColor: accentColor }}>
                <i className="ri-mail-line" />
                {ctaBtn1Label}
              </Link>
              <Link to={ctaBtn2Link} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3.5 border border-white/50 text-white font-roboto text-xs md:text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-white/10 transition-colors">
                <i className="ri-bar-chart-2-line" />
                {ctaBtn2Label}
              </Link>
            </div>
          </div>
        </section>
      )}

      <InnerContactSection />
      <GlobalContactStrip />
      <Footer />
      <BackToTopButton />
    </div>
  );
}
