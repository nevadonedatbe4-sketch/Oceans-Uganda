import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import PropertyCard from '@/components/base/PropertyCard';
import type { Property } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';

interface SectionMeta {
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  visible: boolean;
}

const VISIBLE = 3;

interface RawListing {
  id: string;
  title: string;
  slug: string;
  property_type: string | null;
  purpose: string;
  price: number | null;
  currency: string;
  price_note: string | null;
  location: string | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size_sqm: number | null;
  cover_image: string | null;
  listing_date: string | null;
  featured: boolean;
  neighborhoods?: { name: string } | null;
}

function mapToProperty(l: RawListing): Property {
  return {
    id: l.id,
    title: l.title,
    slug: l.slug,
    location: l.location || (l.neighborhoods?.name) || 'Kampala',
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
    image: l.cover_image!,
    listingDate: l.listing_date || '',
    featured: l.featured,
    description: '',
  };
}

const SECTION_DEFAULTS: SectionMeta = {
  title: "&nbsp;Residential Homes You'll Love",
  subtitle: 'Explore the Newest Properties Available in Kampala',
  button_text: 'View All Properties',
  button_link: '/all-properties',
  visible: true,
};

interface SectionTypo {
  eyebrow_font_family: string;
  eyebrow_font_weight: string;
  eyebrow_font_size: string;
  eyebrow_letter_spacing: string;
  eyebrow_transform: string;
  title_font_family: string;
  title_font_weight: string;
  title_font_size: string;
  title_letter_spacing: string;
  title_line_height: string;
  title_transform: string;
  subtitle_font_family: string;
  subtitle_font_weight: string;
  subtitle_font_size: string;
  subtitle_letter_spacing: string;
  subtitle_line_height: string;
}

const DEFAULT_TYPO: SectionTypo = {
  eyebrow_font_family: '',
  eyebrow_font_weight: '400',
  eyebrow_font_size: '12',
  eyebrow_letter_spacing: '0.3',
  eyebrow_transform: 'uppercase',
  title_font_family: 'Prata',
  title_font_weight: '400',
  title_font_size: '36',
  title_letter_spacing: '0',
  title_line_height: '1.2',
  title_transform: 'none',
  subtitle_font_family: '',
  subtitle_font_weight: '400',
  subtitle_font_size: '14',
  subtitle_letter_spacing: '0',
  subtitle_line_height: '1.5',
};

export default function PropertiesSection() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'editor';
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sectionMeta, setSectionMeta] = useState<SectionMeta>(SECTION_DEFAULTS);
  const [typo, setTypo] = useState<SectionTypo>(DEFAULT_TYPO);
  const [isHovering, setIsHovering] = useState(false);

  const total = properties.length;
  const maxIndex = Math.max(0, total - VISIBLE);

  useEffect(() => {
    supabase
      .from('homepage_sections')
      .select('title, subtitle, button_text, button_link, visible')
      .eq('section_key', 'featured_listings')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSectionMeta({
            title: data.title || SECTION_DEFAULTS.title,
            subtitle: data.subtitle || SECTION_DEFAULTS.subtitle,
            button_text: data.button_text || SECTION_DEFAULTS.button_text,
            button_link: '/all-properties',
            visible: data.visible ?? true,
          });
        }
      });
  }, []);

  // Load typography settings
  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .like('key', 'hp_section_featured_listings_%')
      .then(({ data }) => {
        if (!data) return;
        const m: Record<string, string> = {};
        data.forEach((r: { key: string; value: string }) => {
          m[r.key.replace('hp_section_featured_listings_', '')] = r.value;
        });
        setTypo((prev) => ({ ...prev, ...m }));
      });
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (total <= VISIBLE || isHovering) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [total, maxIndex, isHovering]);

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, slug, property_type, purpose, price, currency, price_note, location, bedrooms, bathrooms, parking, size_sqm, cover_image, listing_date, featured, neighborhoods(name)')
        .eq('status', 'published')
        .order('listing_date', { ascending: false })
        .limit(12);

      if (error) {
        // eslint-disable-next-line no-console
        console.error('PropertiesSection fetch error:', error);
        setError(error.message);
      }

      if (data && data.length > 0) {
        setProperties((data as unknown as RawListing[]).map(mapToProperty));
      }
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (error) {
    return (
      <section id="properties" className="py-16 px-6 bg-[#f7f8fa]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-4xl text-red-400" />
          </div>
          <p className="font-prata text-red-600 text-lg mb-2">Something went wrong</p>
          <p className="text-stone-400 font-roboto text-sm">{error}</p>
        </div>
      </section>
    );
  }

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;
  const dotCount = maxIndex + 1;

  if (loading) {
    return (
      <section id="properties" className="py-16 px-6 bg-[#f7f8fa]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mb-3" />
            <div className="h-8 bg-gray-200 animate-pulse rounded w-64 mb-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section id="properties" className="py-16 px-6 bg-[#f7f8fa]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-prata text-primary text-lg mb-2">No properties available</p>
          <p className="text-stone-400 font-roboto text-sm">Check back soon for new listings.</p>
        </div>
      </section>
    );
  }
  if (!sectionMeta.visible) return null;

  return (
    <section id="properties" className="relative py-16 px-6 bg-[#f7f8fa]">
      {/* Admin Edit Shortcut */}
      {isAdmin && (
        <Link
          to="/admin/homepage"
          className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white transition-all duration-200 whitespace-nowrap cursor-pointer border border-stone-200"
        >
          <i className="ri-edit-2-line text-sm" />
          Edit Properties Section
        </Link>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 md:mb-10 gap-3 md:gap-4">
          <div>
            <p
              className="mb-1.5 md:mb-3 font-roboto text-xs md:text-sm font-semibold uppercase tracking-[0.35em] md:tracking-[0.4em] whitespace-nowrap"
              style={{ color: '#C9A84C' }}
            >
              Exclusive
            </p>
            <h2
              className="mb-1 md:mb-2"
              style={{
                color: '#001731',
                fontFamily: typo.title_font_family || undefined,
                fontWeight: typo.title_font_weight,
                fontSize: `clamp(1.75rem, ${Number(typo.title_font_size) * 0.04}vw + 1rem, ${typo.title_font_size}px)`,
                letterSpacing: `${typo.title_letter_spacing}em`,
                lineHeight: typo.title_line_height,
                textTransform: (typo.title_transform || 'none') as 'none' | 'uppercase' | 'capitalize' | 'lowercase',
              }}
            >
              {sectionMeta.title}
            </h2>
            <p
              className="text-xs md:text-sm uppercase tracking-[0.25em] md:tracking-[0.3em] font-roboto font-medium"
              style={{
                color: '#C9A84C',
                fontFamily: typo.subtitle_font_family || undefined,
                fontWeight: typo.subtitle_font_weight,
                letterSpacing: `${typo.subtitle_letter_spacing}em`,
                lineHeight: typo.subtitle_line_height,
              }}
            >
              {sectionMeta.subtitle}
            </p>
          </div>
          {/* Nav arrows */}
          <div className="flex items-center gap-3 self-end md:self-auto ml-auto md:ml-0">
            <button
              onClick={prev}
              disabled={!canPrev}
              className={`w-10 h-10 flex items-center justify-center border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                canPrev
                  ? 'border-primary text-primary hover:bg-primary hover:text-white'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Previous"
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
            <button
              onClick={next}
              disabled={!canNext}
              className={`w-10 h-10 flex items-center justify-center border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                canNext
                  ? 'border-primary text-primary hover:bg-primary hover:text-white'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Next"
            >
              <i className="ri-arrow-right-s-line text-xl" />
            </button>
          </div>
        </div>

        {/* Mobile grid (1 col xs, 2 col sm) — no carousel */}
        <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-4">
          {properties.slice(0, 4).map((property) => (
            <PropertyCard key={property.id} property={property} squareCorners className="h-full" />
          ))}
        </div>

        {/* Desktop carousel (3 visible) */}
        <div
          className="hidden md:block overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            className="flex items-stretch gap-5 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex} * (100% / ${VISIBLE} + 20px / ${VISIBLE} * (${VISIBLE} - 1) / ${VISIBLE})))`,
            }}
          >
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 flex flex-col"
                style={{ width: `calc((100% - ${(VISIBLE - 1) * 20}px) / ${VISIBLE})` }}
              >
                <PropertyCard property={property} squareCorners className="h-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {dotCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all duration-300 cursor-pointer whitespace-nowrap rounded-full ${
                  i === currentIndex ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-gray-300 hover:bg-primary/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* View More */}
        <div className="mt-10 text-center">
          <Link
            to={sectionMeta.button_link || '/all-properties'}
            className="inline-flex items-center gap-2 bg-primary hover:bg-[#002349] text-white px-16 py-3.5 text-sm font-roboto transition-colors cursor-pointer whitespace-nowrap"
          >
            View More Properties
            <i className="ri-arrow-right-line" />
          </Link>
        </div>
      </div>
    </section>
  );
}
