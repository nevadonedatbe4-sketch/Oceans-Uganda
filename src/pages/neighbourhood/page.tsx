import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import OceansPropertySearchBar from '@/components/feature/OceansPropertySearchBar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import InnerContactSection from '@/components/feature/InnerContactSection';
import LogoLoading from '@/components/base/LogoLoading';
import { supabase } from '@/lib/supabase';
import NbListingCard, { type NbListing } from './components/NbListingCard';
import NbFilterBar from './components/NbFilterBar';
import NbSnapshotGrid from './components/NbSnapshotGrid';
import NbFaqSection from './components/NbFaqSection';
import NbGallerySection from './components/NbGallerySection';
import { NeighbourhoodSEO } from '@/components/feature/PageSEO';

function fromSlug(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const FALLBACK_HERO_IMGS: Record<string, string> = {
  kololo: 'https://readdy.ai/api/search-image?query=Kololo%20Kampala%20Uganda%20dramatic%20aerial%20skyline%20panorama%20hilltop%20neighbourhood%20elevated%20city%20view%20dense%20tropical%20canopy%20luxury%20rooftops%20emerging%20above%20lush%20green%20trees%20golden%20hour%20light%20sweeping%20urban%20landscape%20photography&width=1400&height=700&seq=nb_kololo_hero2&orientation=landscape',
  nakasero: 'https://readdy.ai/api/search-image?query=Nakasero%20Hill%20Kampala%20Uganda%20city%20skyline%20aerial%20view%20central%20business%20district%20modern%20office%20towers%20mixed%20high%20rise%20buildings%20dense%20urban%20core%20sunset%20warm%20amber%20glow%20panoramic%20cityscape%20photography&width=1400&height=700&seq=nb_nakasero_hero2&orientation=landscape',
  muyenga: 'https://readdy.ai/api/search-image?query=Muyenga%20Kampala%20Uganda%20scenic%20hilltop%20skyline%20panorama%20Lake%20Victoria%20shimmering%20water%20visible%20in%20background%20lush%20green%20valley%20luxury%20rooftops%20tropical%20trees%20golden%20dusk%20light%20dramatic%20wide%20angle&width=1400&height=700&seq=nb_muyenga_hero2&orientation=landscape',
  bugolobi: 'https://readdy.ai/api/search-image?query=Bugolobi%20Kampala%20Uganda%20modern%20urban%20skyline%20aerial%20view%20contemporary%20apartment%20blocks%20mixed%20residential%20commercial%20buildings%20wide%20organized%20streets%20tropical%20tree%20lined%20avenues%20bright%20daytime&width=1400&height=700&seq=nb_bugolobi_hero2&orientation=landscape',
  naguru: 'https://readdy.ai/api/search-image?query=Naguru%20Kampala%20Uganda%20hilltop%20panoramic%20skyline%20aerial%20sweeping%20view%20over%20Kampala%20city%20rolling%20green%20hills%20dense%20tropical%20vegetation%20luxury%20villas%20rooftops%20peaking%20through%20canopy%20dramatic%20sky&width=1400&height=700&seq=nb_naguru_hero2&orientation=landscape',
  munyonyo: 'https://readdy.ai/api/search-image?query=Munyonyo%20Kampala%20Uganda%20lakeside%20luxury%20resort%20residential%20area%20Lake%20Victoria%20shoreline%20lush%20green%20slopes%20premium%20homes%20tropical%20paradise%20photography&width=1400&height=700&seq=nb_munyonyo_hero2&orientation=landscape',
};

function getFallbackHero(slug: string): string {
  const key = Object.keys(FALLBACK_HERO_IMGS).find((k) => slug.toLowerCase().includes(k));
  return key
    ? FALLBACK_HERO_IMGS[key]
    : 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20luxury%20residential%20neighbourhood%20aerial%20view%20lush%20tropical%20greenery%20premium%20gated%20community%20homes%20scenic%20wide%20roads%20sunny%20day&width=1400&height=700&seq=nb-hero-fallback2&orientation=landscape';
}

interface DbNeighborhood {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  hero_image: string | null;
  short_intro: string | null;
  long_description: string | null;
  why_live_here: string | null;
  expat_appeal: string | null;
  lifestyle_desc: string | null;
  safety_notes: string | null;
  cost_of_living: string | null;
  rental_range_ugx: string | null;
  rental_range_usd: string | null;
  avg_sale_price: string | null;
  target_market: string | null;
  vibe: string | null;
  map_embed: string | null;
  image_gallery: string[];
  practical_schools: { name: string; note?: string }[];
  practical_hospitals: { name: string; note?: string }[];
  practical_embassies: { name: string; note?: string }[];
  practical_restaurants: { name: string; note?: string }[];
  commute_notes: string | null;
  faqs: { question: string; answer: string }[];
  highlights: string[];
  lifestyle_tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  meta_keywords: string | null;
  section_visibility: Record<string, boolean>;
  published: boolean;
}

interface RelatedNb {
  id: string;
  name: string;
  slug: string;
  hero_image: string | null;
}

function PracticalList({ items, icon }: { items: { name: string; note?: string }[]; icon: string }) {
  if (items.length === 0) return <p className="text-xs text-stone-400 italic">Not listed</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
            <i className={`${icon} text-golden text-sm`} />
          </div>
          <div>
            <p className="text-sm text-stone-700 font-roboto font-medium">{item.name}</p>
            {item.note && <p className="text-xs text-stone-400 font-roboto">{item.note}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function NeighbourhoodDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const name = fromSlug(slug);

  const [nb, setNb] = useState<DbNeighborhood | null>(null);
  const [listings, setListings] = useState<NbListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<RelatedNb[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: nbRow } = await supabase
        .from('neighborhoods')
        .select('*')
        .or(`slug.ilike.${slug},name.ilike.${name}`)
        .maybeSingle();

      setNb(nbRow as DbNeighborhood ?? null);

      if (nbRow?.id) {
        const { data: listingsData } = await supabase
          .from('listings')
          .select('id, title, slug, purpose, property_type, price, currency, price_note, location, bedrooms, bathrooms, parking, size_sqm, cover_image, featured, listing_date, short_description, status')
          .eq('neighborhood_id', nbRow.id)
          .neq('status', 'archived')
          .order('featured', { ascending: false })
          .order('listing_date', { ascending: false });
        setListings((listingsData ?? []) as NbListing[]);
      } else {
        setListings([]);
      }

      const { data: allNbs } = await supabase
        .from('neighborhoods')
        .select('id, name, slug, hero_image')
        .eq('published', true)
        .order('sort_order', { ascending: true });
      setRelated((allNbs ?? []) as RelatedNb[]);

      setLoading(false);
    }
    fetchData();
  }, [slug, name]);

  const [purposeFilter, setPurposeFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [bedsFilter, setBedsFilter] = useState('Any Beds');
  const [priceFilter, setPriceFilter] = useState('Any Price');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (purposeFilter !== 'all' && l.purpose !== purposeFilter) return false;
      if (bedsFilter !== 'Any Beds') {
        const min = parseInt(bedsFilter);
        if (l.bedrooms < min) return false;
      }
      if (priceFilter !== 'Any Price') {
        const usd = l.currency === 'UGX' ? l.price / 3700 : l.price;
        const k = usd / 1000;
        if (priceFilter === 'Under $100K' && k >= 100) return false;
        if (priceFilter === '$100K–300K' && (k < 100 || k > 300)) return false;
        if (priceFilter === '$300K–500K' && (k < 300 || k > 500)) return false;
        if (priceFilter === 'Over $500K' && k <= 500) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!l.title.toLowerCase().includes(q) && !l.location.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [listings, purposeFilter, bedsFilter, priceFilter, search]);

  const saleCount = listings.filter((l) => l.purpose === 'sale').length;
  const rentCount = listings.filter((l) => l.purpose === 'rent').length;

  const heroImage = nb?.hero_image || getFallbackHero(slug);
  const displayName = nb?.name || name;
  const sv = nb?.section_visibility ?? {};

  const seoTitle = nb?.seo_title || `${displayName} Neighbourhood Guide — Kampala Real Estate | Oceans Uganda`;
  const seoDesc = nb?.seo_description || nb?.short_intro || `Discover ${displayName}, Kampala. Expat guide covering rent prices, schools, safety, lifestyle and available properties.`;

  return (
    <div className="min-h-screen bg-white">
      <NeighbourhoodSEO name={displayName} count={listings.length} slug={slug} />

      {/* Override meta with CMS values */}
      {nb?.seo_title && (
        <title>{seoTitle}</title>
      )}

      <Navbar />

      {/* ── Search bar ── */}
      <div className="mt-4">
        <OceansPropertySearchBar />
      </div>
      <div className="mt-4" />

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <LogoLoading label="Loading neighbourhood…" size={64} />
        </div>
      ) : (
        <>
          {/* ── 1. HERO ── */}
          <div className="relative w-full" style={{ minHeight: '520px' }}>
            <img src={heroImage} alt={displayName} className="w-full h-full object-cover object-top absolute inset-0" style={{ height: '520px' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/55 to-primary/20" />

            {/* Breadcrumb */}
            <div className="absolute top-0 left-0 right-0 pt-28 px-6 md:px-10">
              <div className="max-w-6xl mx-auto">
                <nav className="flex items-center gap-2 text-white/60 text-xs font-roboto">
                  <Link to="/" className="hover:text-white transition-colors cursor-pointer whitespace-nowrap">Home</Link>
                  <i className="ri-arrow-right-s-line" />
                  <Link to="/neighbourhoods" className="hover:text-white transition-colors cursor-pointer whitespace-nowrap">Neighbourhoods</Link>
                  <i className="ri-arrow-right-s-line" />
                  <span className="text-white/90">{displayName}</span>
                </nav>
              </div>
            </div>

            {/* Hero content */}
            <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-12" style={{ top: '520px', transform: 'translateY(-100%)' }}>
              <div className="max-w-6xl mx-auto">
                <p className="text-golden text-sm md:text-base font-roboto tracking-[0.3em] uppercase mb-2">Neighbourhood Guide</p>
                <h1 className="text-4xl md:text-6xl font-prata text-white mb-3 leading-tight">{displayName}</h1>
                {nb?.short_intro && (
                  <p className="text-white/75 font-roboto text-base max-w-xl mb-5 leading-relaxed">{nb.short_intro}</p>
                )}

                {/* Lifestyle tags */}
                {nb?.lifestyle_tags && nb.lifestyle_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {nb.lifestyle_tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-roboto rounded-full whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stat pills */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
                    <i className="ri-building-2-line text-golden text-sm" />
                    <span className="text-white text-sm font-roboto"><strong className="font-prata">{listings.length}</strong> Listings</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
                    <i className="ri-price-tag-3-line text-golden text-sm" />
                    <span className="text-white text-sm font-roboto"><strong className="font-prata">{saleCount}</strong> For Sale</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
                    <i className="ri-key-2-line text-golden text-sm" />
                    <span className="text-white text-sm font-roboto"><strong className="font-prata">{rentCount}</strong> To Let</span>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#properties"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-golden text-primary font-roboto text-xs font-bold uppercase tracking-widest rounded hover:bg-golden/90 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-building-2-line" /> View Properties
                </a>
              </div>
            </div>
          </div>

          {/* ── 2. QUICK SNAPSHOT ── */}
          <NbSnapshotGrid
            location={`${displayName}, ${nb?.city ?? 'Kampala'}`}
            targetMarket={nb?.target_market ?? null}
            vibe={nb?.vibe ?? null}
            avgSalePrice={nb?.avg_sale_price ?? null}
            rentalUsd={nb?.rental_range_usd ?? null}
            rentalUgx={nb?.rental_range_ugx ?? null}
          />

          {/* ── 3. ABOUT THE AREA ── */}
          {nb?.long_description && (
            <section className="border-t border-stone-100">
              <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                  <div className="lg:col-span-2">
                    <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest text-golden mb-2">Area Guide</p>
                    <h2 className="font-prata text-primary text-2xl md:text-3xl mb-6">Living in {displayName}</h2>
                    <div className="prose prose-sm max-w-none text-stone-500 font-roboto leading-relaxed space-y-4">
                      {nb.long_description.split('\n').filter(Boolean).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {nb.cost_of_living && (
                      <div className="mt-8 p-5 bg-[#f5f5f5] rounded-xl border border-stone-100">
                        <div className="flex items-center gap-2 mb-3">
                          <i className="ri-money-dollar-circle-line text-golden text-lg" />
                          <p className="text-sm font-semibold text-primary font-roboto">Cost of Living</p>
                        </div>
                        <p className="text-sm text-stone-500 font-roboto leading-relaxed">{nb.cost_of_living}</p>
                      </div>
                    )}
                  </div>

                  {/* Right sidebar: highlights + price guide */}
                  <div className="space-y-5">
                    {nb.highlights && nb.highlights.length > 0 && (
                      <div className="bg-[#f5f5f5] rounded-xl p-5 border border-stone-100">
                        <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-4">Key Highlights</p>
                        <div className="space-y-2.5">
                          {nb.highlights.map((h) => (
                            <div key={h} className="flex items-start gap-2.5">
                              <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                                <i className="ri-checkbox-circle-fill text-golden text-base" />
                              </div>
                              <span className="text-stone-600 font-roboto text-sm">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(nb.avg_sale_price || nb.rental_range_usd) && (
                      <div className="bg-[#f5f5f5] rounded-xl p-5 border border-stone-100">
                        <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-4">Price Guide</p>
                        <div className="space-y-3">
                          {nb.avg_sale_price && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-roboto text-stone-500">
                                <i className="ri-price-tag-3-line text-golden text-sm" /> For Sale
                              </div>
                              <span className="text-primary font-roboto text-xs font-semibold">{nb.avg_sale_price}</span>
                            </div>
                          )}
                          {nb.rental_range_usd && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-roboto text-stone-500">
                                <i className="ri-key-2-line text-golden text-sm" /> To Let (USD)
                              </div>
                              <span className="text-primary font-roboto text-xs font-semibold">{nb.rental_range_usd}</span>
                            </div>
                          )}
                          {nb.rental_range_ugx && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs font-roboto text-stone-500">
                                <i className="ri-money-dollar-circle-line text-golden text-sm" /> To Let (UGX)
                              </div>
                              <span className="text-primary font-roboto text-xs font-semibold">{nb.rental_range_ugx}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 font-roboto mt-3">Indicative ranges. Contact us for current valuations.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── 4. WHY EXPATS CHOOSE THIS AREA ── */}
          {sv.why_live_here !== false && nb?.why_live_here && (
            <section className="bg-primary py-16 px-6 md:px-10">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div>
                    <p className="text-golden text-[11px] font-roboto font-bold uppercase tracking-widest mb-3">Why Expats Choose {displayName}</p>
                    <h2 className="font-prata text-white text-2xl md:text-3xl mb-6">The Expat Advantage</h2>
                    <div className="space-y-3">
                      {nb.why_live_here.split('\n').filter(Boolean).map((line, i) => {
                        const clean = line.replace(/^[-•*]\s*/, '');
                        return (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                              <i className="ri-checkbox-circle-fill text-golden text-base" />
                            </div>
                            <p className="text-white/80 font-roboto text-sm leading-relaxed">{clean}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden" style={{ height: '360px' }}>
                    <img
                      src={heroImage}
                      alt={displayName}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                    {nb.target_market && (
                      <div className="absolute bottom-5 left-5 right-5">
                        <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-golden mb-1">Best For</p>
                        <p className="text-white font-prata text-lg">{nb.target_market}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── 5. EXPAT APPEAL ── */}
          {sv.expat_appeal !== false && nb?.expat_appeal && (
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-14 border-b border-stone-100">
              <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest text-golden mb-2">International Community</p>
              <h2 className="font-prata text-primary text-2xl md:text-3xl mb-6">Expat Life in {displayName}</h2>
              <div className="max-w-3xl">
                {nb.expat_appeal.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-stone-500 font-roboto text-sm leading-relaxed mb-4">{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* ── 5b. LIFESTYLE ── */}
          {sv.lifestyle !== false && nb?.lifestyle_desc && (
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-14 border-b border-stone-100">
              <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest text-golden mb-2">Lifestyle</p>
              <h2 className="font-prata text-primary text-2xl md:text-3xl mb-6">Dining, Social Life & Leisure</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  {nb.lifestyle_desc.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-stone-500 font-roboto text-sm leading-relaxed mb-4">{para}</p>
                  ))}
                </div>
                {nb.practical_restaurants && nb.practical_restaurants.length > 0 && (
                  <div className="bg-[#f5f5f5] rounded-xl p-6 border border-stone-100">
                    <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-4">Restaurants & Cafes</p>
                    <PracticalList items={nb.practical_restaurants} icon="ri-restaurant-line" />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── 6. PRACTICAL LIVING ── */}
          {sv.practical !== false && (
            <section className="bg-[#f5f5f5] border-t border-stone-100 py-14 px-6 md:px-10">
              <div className="max-w-6xl mx-auto">
                <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest text-golden mb-2">Practical Living</p>
                <h2 className="font-prata text-primary text-2xl md:text-3xl mb-8">Everything You Need to Know</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {nb?.practical_schools && nb.practical_schools.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-stone-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-lg">
                          <i className="ri-graduation-cap-line text-golden text-base" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-roboto">Schools</p>
                      </div>
                      <PracticalList items={nb.practical_schools} icon="ri-graduation-cap-line" />
                    </div>
                  )}

                  {nb?.practical_hospitals && nb.practical_hospitals.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-stone-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-lg">
                          <i className="ri-hospital-line text-golden text-base" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-roboto">Healthcare</p>
                      </div>
                      <PracticalList items={nb.practical_hospitals} icon="ri-hospital-line" />
                    </div>
                  )}

                  {nb?.practical_embassies && nb.practical_embassies.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-stone-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-lg">
                          <i className="ri-government-line text-golden text-base" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-roboto">Embassies & NGOs</p>
                      </div>
                      <PracticalList items={nb.practical_embassies} icon="ri-government-line" />
                    </div>
                  )}

                  {nb?.commute_notes && (
                    <div className="bg-white rounded-xl p-5 border border-stone-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-lg">
                          <i className="ri-car-line text-golden text-base" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-roboto">Commute</p>
                      </div>
                      <p className="text-sm text-stone-500 font-roboto leading-relaxed">{nb.commute_notes}</p>
                    </div>
                  )}

                  {nb?.safety_notes && (
                    <div className="bg-white rounded-xl p-5 border border-stone-100 sm:col-span-2">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-golden/10 rounded-lg">
                          <i className="ri-shield-check-line text-golden text-base" />
                        </div>
                        <p className="text-sm font-semibold text-primary font-roboto">Safety & Security</p>
                      </div>
                      <p className="text-sm text-stone-500 font-roboto leading-relaxed">{nb.safety_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ── GALLERY ── */}
          {sv.gallery !== false && nb?.image_gallery && nb.image_gallery.length > 0 && (
            <div className="border-t border-stone-100">
              <NbGallerySection images={nb.image_gallery} name={displayName} />
            </div>
          )}

          {/* ── MAP ── */}
          {sv.map !== false && nb?.map_embed && (
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 border-t border-stone-100">
              <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest text-golden mb-2">Location</p>
              <h2 className="font-prata text-primary text-xl md:text-2xl mb-5">{displayName} on the Map</h2>
              <div className="rounded-2xl overflow-hidden border border-stone-200" style={{ height: '400px' }}>
                <iframe
                  src={nb.map_embed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${displayName} map`}
                />
              </div>
            </section>
          )}

          {/* ── 7. PROPERTIES ── */}
          <section id="properties" className="border-t border-stone-100 py-14">
            <div className="max-w-6xl mx-auto px-6 md:px-10 mb-6">
              <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest text-golden mb-2">Available Now</p>
              <h2 className="font-prata text-primary text-2xl md:text-3xl">Properties in {displayName}</h2>
            </div>

            <NbFilterBar
              purposeFilter={purposeFilter}
              setPurposeFilter={setPurposeFilter}
              bedsFilter={bedsFilter}
              setBedsFilter={setBedsFilter}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              search={search}
              setSearch={setSearch}
              total={filtered.length}
            />

            <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
              {filtered.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((listing) => (
                      <NbListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                  <div className="text-center mt-10">
                    <Link
                      to={`/buy?neighbourhood=${slug}`}
                      className="inline-flex items-center gap-2 px-8 py-3 border border-primary text-primary font-roboto text-xs uppercase tracking-widest rounded hover:bg-primary hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-search-line" /> View All Properties in {displayName}
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-14 h-14 flex items-center justify-center bg-stone-100 rounded-full mx-auto mb-4">
                    <i className="ri-building-line text-2xl text-stone-300" />
                  </div>
                  <h3 className="text-lg font-prata text-primary mb-2">No listings found</h3>
                  <p className="text-sm text-stone-400 font-roboto mb-5">
                    {purposeFilter !== 'all' || bedsFilter !== 'Any Beds' || priceFilter !== 'Any Price' || search
                      ? 'Try adjusting your filters.'
                      : `No listings are currently available in ${displayName}.`}
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {(purposeFilter !== 'all' || bedsFilter !== 'Any Beds' || priceFilter !== 'Any Price' || search) && (
                      <button
                        onClick={() => { setPurposeFilter('all'); setBedsFilter('Any Beds'); setPriceFilter('Any Price'); setSearch(''); }}
                        className="px-5 py-2.5 border border-primary text-primary text-sm font-roboto rounded hover:bg-primary hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Clear Filters
                      </button>
                    )}
                    <Link to="/buy" className="px-5 py-2.5 bg-primary text-white text-sm font-roboto rounded hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap">
                      Browse All Properties
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── 8. FAQ ── */}
          {sv.faqs !== false && nb?.faqs && nb.faqs.length > 0 && (
            <div className="border-t border-stone-100 bg-[#f5f5f5]">
              <NbFaqSection faqs={nb.faqs} name={displayName} />
            </div>
          )}

          {/* ── 9. FINAL CTA ── */}
          <section className="bg-primary py-16 px-6 text-center">
            <div className="max-w-xl mx-auto">
              <p className="text-golden text-[11px] font-roboto font-bold uppercase tracking-widest mb-3">Ready to Move?</p>
              <h2 className="font-prata text-white text-2xl md:text-3xl mb-4">
                Looking for a Home in {displayName}?
              </h2>
              <p className="text-white/70 font-roboto text-sm leading-relaxed mb-8">
                Our local agents know every street in {displayName}. Tell us what you're looking for and we'll find the perfect property for you.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-golden text-primary font-roboto text-xs font-bold uppercase tracking-widest rounded hover:bg-golden/90 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-chat-1-line" /> Talk to an Agent
                </Link>
                <a
                  href="https://wa.me/256700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 border border-white/30 text-white font-roboto text-xs uppercase tracking-widest rounded hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-whatsapp-line" /> WhatsApp Us
                </a>
              </div>
            </div>
          </section>

          {/* ── Related Neighbourhoods ── */}
          {related.length > 1 && (
            <div className="border-t border-stone-100 bg-white py-12 px-6 md:px-10">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-lg font-prata text-primary mb-6">Explore Other Neighbourhoods</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {related
                    .filter((n) => n.slug !== slug && n.name.toLowerCase() !== name.toLowerCase())
                    .slice(0, 6)
                    .map((nb) => {
                      const nbSlug = nb.slug || nb.name.toLowerCase().replace(/\s+/g, '-');
                      const nbHero = nb.hero_image || getFallbackHero(nbSlug);
                      return (
                        <Link
                          key={nb.id}
                          to={`/neighbourhood/${nbSlug}`}
                          className="relative overflow-hidden group cursor-pointer rounded-xl"
                          style={{ height: '110px' }}
                        >
                          <img src={nbHero} alt={nb.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-2 left-3">
                            <p className="text-white text-xs font-prata leading-tight">{nb.name}</p>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <InnerContactSection />
      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
