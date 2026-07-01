import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePropertyLayout } from '@/hooks/usePropertyLayout';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import InnerContactSection from '@/components/feature/InnerContactSection';
import LogoLoading from '@/components/base/LogoLoading';
import { supabase } from '@/lib/supabase';
import PropertyGallery from './components/PropertyGallery';
import PropertyBody from './components/PropertyBody';
import PropertySidebar from './components/PropertySidebar';
import PropertyStats from './components/PropertyStats';
import OceansPropertySearchBar from '@/components/feature/OceansPropertySearchBar';
import PropertyBreadcrumb from './components/PropertyBreadcrumb';
import SimilarPropertiesSection from './components/SimilarPropertiesSection';
import PrevNextPropertyStrip from './components/PrevNextPropertyStrip';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { PropertyDetailSEO } from '@/components/feature/PageSEO';

export interface FullListing {
  id: string;
  title: string;
  slug: string;
  property_type: string | null;
  purpose: string;
  price: number | null;
  currency: string;
  price_note: string | null;
  price_frequency: string | null;
  secondary_price: number | null;
  secondary_price_label: string | null;
  location: string | null;
  neighborhood_id: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size_sqm: number | null;
  furnished: boolean;
  featured: boolean;
  status: string;
  listing_status: string[] | null;
  short_description: string | null;
  full_description: string | null;
  cover_image: string | null;
  agent_id: string | null;
  listing_date: string | null;
  updated_at: string | null;
  video_url: string | null;
  floor_plan_url: string | null;
}

export interface Agent {
  id: string;
  full_name: string;
  title: string | null;
  photo: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
}

interface NavListing {
  slug: string;
  title: string;
  location: string | null;
  cover_image: string | null;
  price_display: string;
}

interface SimilarListing {
  id: string;
  slug: string;
  title: string;
  location: string;
  property_type: string;
  purpose: string;
  price: string;
  priceNote?: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  image: string;
  featured: boolean;
  priceUsd?: number | null;
  currency?: string;
}

export default function PropertyDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { get } = useSiteSettings();
  const { formatPrice } = useCurrency();
  const { settings: layout } = usePropertyLayout();
  const navigate = useNavigate();

  /* ── state ────────────────────────────────────────────────── */
  const [listing, setListing]         = useState<FullListing | null>(null);
  const [images, setImages]           = useState<string[]>([]);
  const [amenities, setAmenities]     = useState<string[]>([]);
  const [agent, setAgent]             = useState<Agent | null>(null);
  const [neighborhoodName, setNbName] = useState('');
  const [similarListings, setSimilar] = useState<SimilarListing[]>([]);
  const [prevProperty, setPrev]       = useState<NavListing | null>(null);
  const [nextProperty, setNext]       = useState<NavListing | null>(null);
  const [loading, setLoading]         = useState(true);
  const [notFound, setNotFound]       = useState(false);

  /* ── layout flags ─────────────────────────────────────────── */
  const enabledIds   = (layout.enabled_sections || []).map(s => s.id);
  const showOverview = enabledIds.includes('overview');
  const showSimilar  = enabledIds.includes('similar_listings');
  const isFullWidth  = layout.banner_settings?.full_width === true;
  const stickyNav    = layout.navigation_settings?.sticky_nav === true;

  /* ── data fetch ───────────────────────────────────────────── */
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setNotFound(false);

      const { data: l } = await supabase
        .from('listings')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!l) { setNotFound(true); setLoading(false); return; }
      setListing(l as FullListing);

      const simCount = parseInt(get('similar_props_count', '4'), 10) || 4;
      const simMatch = get('similar_props_match', 'purpose');
      const simFeaturedOnly = get('similar_props_featured_only', 'false') === 'true';

      let simQ = supabase
        .from('listings')
        .select('id,title,slug,property_type,purpose,price,currency,price_note,location,bedrooms,bathrooms,parking,cover_image,featured')
        .neq('id', l.id);
      if (simMatch === 'purpose' || simMatch === 'purpose_type') simQ = simQ.eq('purpose', l.purpose);
      if ((simMatch === 'type' || simMatch === 'purpose_type') && l.property_type) simQ = simQ.eq('property_type', l.property_type);
      if (simMatch === 'location' && l.location) simQ = simQ.eq('location', l.location);
      if (simFeaturedOnly) simQ = simQ.eq('featured', true);
      simQ = simQ.limit(simCount);

      const [imgsRes, amnsRes, simRes] = await Promise.all([
        supabase.from('listing_images').select('url, is_cover, sort_order').eq('listing_id', l.id).order('sort_order'),
        supabase.from('listing_amenities').select('amenity').eq('listing_id', l.id),
        simQ,
      ]);

      const imgRows = (imgsRes.data ?? []) as { url: string; is_cover: boolean; sort_order: number }[];
      const coverFromGallery = imgRows.find(r => r.is_cover)?.url;
      const coverImg = coverFromGallery || l.cover_image;
      const allImgUrls = imgRows.map(r => r.url).filter(Boolean);
      if (coverImg && allImgUrls.length > 0) {
        const rest = allImgUrls.filter(u => u !== coverImg);
        setImages([coverImg, ...rest]);
      } else if (allImgUrls.length > 0) {
        setImages(allImgUrls);
      } else if (coverImg) {
        setImages([coverImg]);
      } else {
        setImages([]);
      }

      setAmenities((amnsRes.data ?? []).map((r: { amenity: string }) => r.amenity));

      setSimilar((simRes.data ?? []).map((s: Record<string, unknown>) => ({
        id: s.id as string,
        slug: s.slug as string,
        title: s.title as string,
        location: (s.location as string) ?? '',
        property_type: (s.property_type as string) ?? 'Property',
        purpose: s.purpose as string,
        price: formatPrice(s.price as number | null, s.currency as string, { purpose: s.purpose as string }),
        priceNote: s.price_note as string | undefined,
        bedrooms: s.bedrooms as number,
        bathrooms: s.bathrooms as number,
        parking: s.parking as number,
        image: (s.cover_image as string) || '',
        featured: s.featured as boolean,
        priceUsd: s.price as number | null,
        currency: s.currency as string,
      })));

      if (l.agent_id) {
        const { data: ag } = await supabase.from('agents').select('id,full_name,title,photo,phone,email,whatsapp').eq('id', l.agent_id).maybeSingle();
        if (ag) setAgent(ag as Agent);
      }

      if (l.neighborhood_id) {
        const { data: nb } = await supabase.from('neighborhoods').select('name').eq('id', l.neighborhood_id).maybeSingle();
        if (nb) setNbName(nb.name);
      }

      const listingDate = l.listing_date || new Date().toISOString();
      const [prevRes, nextRes] = await Promise.all([
        supabase.from('listings').select('slug,title,location,cover_image,price,currency,purpose,price_note')
          .neq('id', l.id).lt('listing_date', listingDate)
          .order('listing_date', { ascending: false }).limit(1),
        supabase.from('listings').select('slug,title,location,cover_image,price,currency,purpose,price_note')
          .neq('id', l.id).gt('listing_date', listingDate)
          .order('listing_date', { ascending: true }).limit(1),
      ]);

      const toNav = (s: Record<string, unknown>): NavListing => ({
        slug: s.slug as string,
        title: s.title as string,
        location: s.location as string | null,
        cover_image: s.cover_image as string | null,
        price_display: formatPrice(s.price as number | null, s.currency as string, { purpose: s.purpose as string }),
      });

      if (prevRes.data?.length) setPrev(toNav(prevRes.data[0] as Record<string, unknown>));
      if (nextRes.data?.length) setNext(toNav(nextRes.data[0] as Record<string, unknown>));

      setLoading(false);
    }
    fetchAll();
  }, [slug]);

  /* ── loading ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f5' }}>
        <LogoLoading label="Loading property…" size={72} />
      </div>
    );
  }

  /* ── not found ────────────────────────────────────────────── */
  if (notFound || !listing) {
    return (
      <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
          <div className="w-14 h-14 flex items-center justify-center mb-5" style={{ background: '#e5e5e5', borderRadius: '2px' }}>
            <i className="ri-building-line text-3xl" style={{ color: '#ccc' }} />
          </div>
          <h1 className="text-2xl font-roboto font-bold mb-2" style={{ color: '#012042' }}>Property Not Found</h1>
          <p className="text-sm font-roboto mb-8" style={{ color: '#888' }}>This listing may have been removed or the link is incorrect.</p>
          <div className="flex items-center gap-3">
            <Link to="/buy" className="px-5 py-2.5 text-white text-sm font-roboto font-semibold cursor-pointer whitespace-nowrap hover:opacity-85 transition-opacity" style={{ background: '#012042', borderRadius: '2px' }}>Browse For Sale</Link>
            <Link to="/rent" className="px-5 py-2.5 border text-sm font-roboto font-semibold cursor-pointer whitespace-nowrap hover:opacity-85 transition-opacity" style={{ borderColor: '#012042', color: '#012042', borderRadius: '2px' }}>Browse To Let</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── derived values ───────────────────────────────────────── */
  const priceDisplay = formatPrice(listing.price, listing.currency, {
    note: listing.price_note,
    frequency: listing.price_frequency,
    purpose: listing.purpose,
  });

  const locationParts = [listing.address, listing.location, listing.city, neighborhoodName, listing.country].filter(Boolean);
  const fullLocation  = locationParts.join(', ');
  const isFeatured = listing.featured || (listing.listing_status ?? []).includes('featured');

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>
      <PropertyDetailSEO
        title={listing.title}
        description={listing.short_description || listing.full_description || ''}
        price={priceDisplay}
        type={listing.property_type || 'Property'}
        purpose={listing.purpose}
        beds={listing.bedrooms}
        baths={listing.bathrooms}
        location={fullLocation}
        image={images[0] || listing.cover_image || ''}
        slug={listing.slug}
      />
      <Navbar />

      {/* ── Page wrapper — push down past fixed navbar only ── */}
      <div className="pt-[88px] md:pt-[96px]">

        {/* ── Outer container ──────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-10">

          {/* ── Breathing space below navbar ── */}
          <div className="mt-2 md:mt-[15px]" />

          {/* ── Independent search bar ── */}
          <div className="-mx-4 md:-mx-6 lg:-mx-10">
            <OceansPropertySearchBar />
          </div>

          {/* ── Breathing space below search bar ── */}
          <div className="mt-2 md:mt-[15px]" />

          {/* ── Back to search results ────────────────────────────── */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-roboto font-bold underline text-[#888] hover:text-[#012042] transition-colors mb-3 md:mb-4 cursor-pointer whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-left-line text-sm" />
            </div>
            Back to previous page
          </button>

          {/* ── Unified container: Breadcrumb + Gallery ── */}
          <div
            className="border border-[#e5e5e5] overflow-hidden"
            style={{ background: '#fff', borderRadius: '2px' }}
          >
            {/* Breadcrumb + action icons row */}
            <div className="px-4 md:px-6 lg:px-10 py-3 border-b border-[#e5e5e5]">
              <PropertyBreadcrumb
                title={listing.title}
                purpose={listing.purpose}
                listingId={listing.id}
              />
            </div>

            {/* Gallery — flush below breadcrumb, no gap */}
            <PropertyGallery
              images={images}
              title={listing.title}
              purpose={listing.purpose}
            />
          </div>

          {/* ── Property Header — Oceans style ───────────────────────
              White panel, full-width, below unified gallery container
          ─────────────────────────────────────────────────────────── */}
          <div
            className="mt-1.5 md:mt-4 px-2 md:px-6 py-2 md:py-5 border border-[#e5e5e5]"
            style={{ background: '#fff', borderRadius: '2px' }}
          >
            {/* Title + Location (left)  |  Price (right) */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-6">
              {/* Left: Title + Location */}
              <div className="min-w-0">
                <h1
                  className="font-roboto font-bold leading-snug text-primary break-words"
                  style={{ fontSize: 'clamp(16px, 2.2vw, 26px)', letterSpacing: '-0.01em' }}
                >
                  {listing.title}
                </h1>
                {fullLocation && (
                  <p className="flex items-center gap-1 mt-1 md:mt-2 text-xs md:text-sm font-roboto" style={{ color: '#888' }}>
                    <i className="ri-map-pin-2-line text-xs md:text-sm shrink-0" style={{ color: '#888' }} />
                    {fullLocation}
                  </p>
                )}
              </div>

              {/* Right: Price */}
              <div className="shrink-0 md:text-right">
                <p
                  className="font-roboto font-bold whitespace-nowrap leading-tight"
                  style={{ fontSize: 'clamp(18px, 2.4vw, 28px)', color: '#012042' }}
                >
                  {priceDisplay}
                </p>
                {listing.secondary_price && listing.secondary_price_label && (
                  <p className="text-[11px] md:text-xs font-roboto mt-1" style={{ color: '#012042' }}>
                    {listing.secondary_price_label}: {formatPrice(listing.secondary_price, listing.currency, { purpose: listing.purpose })}
                  </p>
                )}
              </div>
            </div>

            {/* ── Overview stats bar — full width, bordered columns ── */}
            {showOverview && (
              <div className="mt-5 md:mt-6">
                <PropertyStats listing={listing} />
              </div>
            )}
          </div>

          {/* ── Sticky section nav ─────────────────────────────────── */}
          {stickyNav && (
            <nav className="hidden lg:block sticky top-[88px] md:top-[96px] z-30 border-b border-[#e5e5e5] mt-0" style={{ background: '#fff' }}>
              <div className="flex items-center overflow-x-auto">
                {(layout.enabled_sections || [])
                  .filter(s => ['description', 'details', 'features', 'address', 'floor_plans', 'video'].includes(s.id))
                  .sort((a, b) => a.order - b.order)
                  .map(s => (
                    <a
                      key={s.id}
                      href={`#section-${s.id.replace(/_/g, '-')}`}
                      className="flex items-center gap-1.5 px-5 py-3.5 text-[10px] font-roboto font-bold uppercase tracking-widest whitespace-nowrap border-b-2 border-transparent hover:border-[#aaa] transition-colors cursor-pointer"
                      style={{ color: '#555' }}
                    >
                      <i className={`${s.icon} text-xs`} />
                      {s.label}
                    </a>
                  ))}
              </div>
            </nav>
          )}

          {/* ── Main content + sidebar ─────────────────────────────── */}
          <div className="mt-3 md:mt-5 pb-24 md:pb-14">
            {isFullWidth ? (
              <div className="w-full space-y-4 md:space-y-6">
                {/* Full-width body */}
                <div className="p-4 md:p-6 border border-[#e5e5e5]" style={{ background: '#fff', borderRadius: '2px' }}>
                  <PropertyBody listing={listing} amenities={amenities} neighborhoodName={neighborhoodName} />
                </div>
                {/* Sidebar below */}
                <PropertySidebar
                  price={listing.price}
                  currency={listing.currency}
                  priceNote={listing.price_note}
                  purpose={listing.purpose}
                  bedrooms={listing.bedrooms}
                  bathrooms={listing.bathrooms}
                  parking={listing.parking}
                  sizeSqm={listing.size_sqm}
                  agent={agent}
                  listingTitle={listing.title}
                  listingId={listing.id}
                />
              </div>
            ) : (
              /* ── Two-column: Body (left) | Sidebar (right) ── */
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 md:gap-5 xl:gap-7 items-start">

                {/* ── Left: white content panel ─────────────────── */}
                <div
                  className="min-w-0 p-4 md:p-6 lg:p-7 border border-[#e5e5e5]"
                  style={{ background: '#fff', borderRadius: '2px' }}
                >
                  <PropertyBody
                    listing={listing}
                    amenities={amenities}
                    neighborhoodName={neighborhoodName}
                  />
                </div>

                {/* ── Right: sticky sidebar ─────────────────────── */}
                <div className="lg:sticky lg:top-[100px] md:lg:top-[108px] w-full">
                  <PropertySidebar
                    price={listing.price}
                    currency={listing.currency}
                    priceNote={listing.price_note}
                    purpose={listing.purpose}
                    bedrooms={listing.bedrooms}
                    bathrooms={listing.bathrooms}
                    parking={listing.parking}
                    sizeSqm={listing.size_sqm}
                    agent={agent}
                    listingTitle={listing.title}
                    listingId={listing.id}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Similar Properties ─────────────────────────────────── */}
        {showSimilar && (
          <SimilarPropertiesSection properties={similarListings} currentPurpose={listing.purpose} />
        )}

        {/* ── Prev / Next strip ─────────────────────────────────── */}
        <PrevNextPropertyStrip prev={prevProperty} next={nextProperty} />

        <InnerContactSection />
        <GlobalContactStrip />
        <Footer />
      </div>

      {/* ── Sticky Mobile CTA ──────────────────────────────────── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#e5e5e5] px-3 py-2 flex items-center gap-2"
        style={{ background: '#fff', paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => {
            window.location.hash = 'tour';
            document.querySelector('[data-readdy-form]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="flex-1 py-2 text-xs font-roboto font-bold tracking-wider cursor-pointer whitespace-nowrap hover:opacity-85 transition-opacity"
          style={{ background: '#012042', color: '#fff', borderRadius: '2px' }}
        >
          Book a viewing
        </button>
        <a
          href={`tel:${agent?.phone || get('phone', '')}`}
          className="py-2 px-3 flex items-center justify-center border border-[#012042] text-[#012042] text-xs font-roboto font-bold tracking-wider cursor-pointer whitespace-nowrap hover:bg-[#012042] hover:text-white transition-all shrink-0"
          style={{ borderRadius: '2px' }}
        >
          <i className="ri-phone-line text-sm" />
        </a>
      </div>
    </div>
  );
}