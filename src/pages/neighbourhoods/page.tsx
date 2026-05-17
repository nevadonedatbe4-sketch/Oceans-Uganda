import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import OceansPropertySearchBar from '@/components/feature/OceansPropertySearchBar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import InnerContactSection from '@/components/feature/InnerContactSection';
import { supabase } from '@/lib/supabase';
import NeighbourhoodCard, { type NeighbourhoodCardData } from './components/NeighbourhoodCard';
import { NeighbourhoodsSEO } from '@/components/feature/PageSEO';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  featured_image: string | null;
  excerpt: string | null;
  publish_date: string;
}

const NB_CATEGORIES = ['All Areas', 'For Sale', 'For Rent', 'Luxury', 'Family'];
const BLOG_CATEGORIES = ['All', 'Neighborhood Spotlight', 'Market Insights', 'Buying Guide', 'Renting Guide', 'Investment', 'Tips & Advice'];

const DEFAULT_HERO_IMAGE = 'https://readdy.ai/api/search-image?query=Kampala%20Uganda%20aerial%20panoramic%20cityscape%20dramatic%20golden%20hour%20light%20rolling%20green%20hills%20dense%20tropical%20canopy%20luxury%20rooftops%20emerging%20above%20trees%20sweeping%20urban%20landscape%20wide%20angle%20photography&width=1920&height=700&seq=nb_index_hero&orientation=landscape';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NeighbourhoodsPage() {
  const { get } = useSiteSettings();
  const [neighbourhoods, setNeighbourhoods] = useState<NeighbourhoodCardData[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Areas');
  const [activeBlogCat, setActiveBlogCat] = useState('All');
  const [activeTab, setActiveTab] = useState<'neighbourhoods' | 'guides'>('neighbourhoods');

  const heroImage = get('nbp_hero_image', '') || DEFAULT_HERO_IMAGE;
  const heroEyebrow = get('nbp_hero_eyebrow', 'Explore Kampala');
  const heroTitle = get('nbp_hero_title', 'Neighbourhoods & Guides');
  const heroSubtitle = get('nbp_hero_subtitle', "Discover the character, lifestyle, and property market of every major neighbourhood in Kampala.");
  const searchPlaceholder = get('nbp_search_placeholder', 'Search areas or articles...');
  const gridEyebrow = get('nbp_grid_eyebrow', 'Browse Areas');
  const gridTitle = get('nbp_grid_title', 'Kampala Neighbourhoods');
  const showStats = get('nbp_stats_visible', 'true') !== 'false';
  const showGuidesTab = get('nbp_show_guides_tab', 'true') !== 'false';
  const nbTabLabel = get('nbp_nb_tab_label', 'Neighbourhoods');
  const guidesTabLabel = get('nbp_guides_tab_label', 'Area Guides & Blog');
  const ctaVisible = get('nbp_cta_visible', 'true') !== 'false';
  const ctaEyebrow = get('nbp_cta_eyebrow', "Not Sure Where to Start?");
  const ctaTitle = get('nbp_cta_title', 'Let Our Agents Guide You');
  const ctaBody = get('nbp_cta_body', "Our local experts know every street in Kampala. Tell us what you're looking for and we'll match you with the perfect neighbourhood.");
  const ctaBtn1Label = get('nbp_cta_btn1_label', 'Talk to an Agent');
  const ctaBtn1Link = get('nbp_cta_btn1_link', '/contact');
  const ctaBtn2Label = get('nbp_cta_btn2_label', 'Browse Properties');
  const ctaBtn2Link = get('nbp_cta_btn2_link', '/buy');
  const accentColor = get('nbp_accent_color', '#C9A84C');
  const statsBg = get('nbp_stats_bg', '#001731');
  const ctaBg = get('nbp_cta_bg', '#ffffff');

  useEffect(() => {
    async function loadNeighbourhoods() {
      setLoading(true);
      const { data: nbs, error: nbsError } = await supabase
        .from('neighborhoods')
        .select('id, name, slug, hero_image, description:short_intro')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (nbsError) {
        console.error('Neighborhoods fetch error:', nbsError);
      }

      if (!nbs || nbs.length === 0) {
        setNeighbourhoods([]);
        setLoading(false);
        return;
      }

      const { data: listings } = await supabase
        .from('listings')
        .select('neighborhood_id, purpose')
        .neq('status', 'archived');

      const countMap: Record<string, { total: number; sale: number; rent: number }> = {};
      (listings ?? []).forEach((l: { neighborhood_id: string; purpose: string }) => {
        if (!l.neighborhood_id) return;
        if (!countMap[l.neighborhood_id]) countMap[l.neighborhood_id] = { total: 0, sale: 0, rent: 0 };
        countMap[l.neighborhood_id].total++;
        if (l.purpose === 'sale') countMap[l.neighborhood_id].sale++;
        if (l.purpose === 'rent') countMap[l.neighborhood_id].rent++;
      });

      const enriched: NeighbourhoodCardData[] = (nbs as { id: string; name: string; slug: string; hero_image: string | null; description: string | null }[]).map((nb) => ({
        ...nb,
        listing_count: countMap[nb.id]?.total ?? 0,
        sale_count: countMap[nb.id]?.sale ?? 0,
        rent_count: countMap[nb.id]?.rent ?? 0,
      }));

      setNeighbourhoods(enriched);
      setLoading(false);
    }

    async function loadBlog() {
      setBlogLoading(true);
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, category, featured_image, excerpt, publish_date')
        .eq('published', true)
        .order('publish_date', { ascending: false });
      setBlogPosts((data ?? []) as BlogPost[]);
      setBlogLoading(false);
    }

    loadNeighbourhoods();
    loadBlog();
  }, []);

  const filteredNbs = useMemo(() => {
    return neighbourhoods.filter((nb) => {
      if (search.trim() && !nb.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeCategory === 'For Sale' && nb.sale_count === 0) return false;
      if (activeCategory === 'For Rent' && nb.rent_count === 0) return false;
      return true;
    });
  }, [neighbourhoods, search, activeCategory]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((p) => {
      if (activeBlogCat !== 'All' && p.category !== activeBlogCat) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !(p.excerpt ?? '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [blogPosts, activeBlogCat, search]);

  const featuredPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <NeighbourhoodsSEO />
      <Navbar />

      {/* Search bar */}
      <OceansPropertySearchBar />

      {/* Hero — tight Rightmove-style */}
      <div
        className="relative pt-16 md:pt-20 pb-10 md:pb-12 px-4 md:px-6 text-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-sm md:text-base font-roboto tracking-[0.25em] uppercase mb-2" style={{ color: accentColor }}>
            {heroEyebrow}
          </p>
          <h1 className="font-prata text-white text-3xl md:text-5xl leading-tight mb-3">
            {heroTitle}
          </h1>
          <p className="text-white/70 font-roboto text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-5">
            {heroSubtitle}
          </p>

          {/* Search */}
          <div className="max-w-sm mx-auto relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2.5 rounded-md bg-white text-sm font-roboto text-primary placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          {/* Tab switcher */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('neighbourhoods')}
              className={`px-4 md:px-5 py-1.5 text-[10px] md:text-xs font-roboto font-semibold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'neighbourhoods'
                  ? 'bg-golden text-primary'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <i className="ri-map-pin-2-line mr-1.5" />
              {nbTabLabel}
            </button>
            {showGuidesTab && (
              <button
                onClick={() => setActiveTab('guides')}
                className={`px-4 md:px-5 py-1.5 text-[10px] md:text-xs font-roboto font-semibold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'guides'
                    ? 'bg-golden text-primary'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <i className="ri-article-line mr-1.5" />
                {guidesTabLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── TAB: NEIGHBOURHOODS ─── */}
      {activeTab === 'neighbourhoods' && (
        <>
          {/* Category filter — tighter, cleaner */}
          <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {NB_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-[11px] font-roboto font-medium whitespace-nowrap cursor-pointer transition-all rounded-sm ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-[11px] font-roboto text-gray-400 whitespace-nowrap shrink-0">
                {filteredNbs.length} area{filteredNbs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Neighbourhood grid — tight Houzez style */}
          <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 animate-pulse h-[220px] sm:h-[260px]" />
                ))}
              </div>
            ) : filteredNbs.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
                {/* Editorial title block */}
                <div className="flex flex-col justify-center bg-white px-3 md:px-8 py-4 md:py-10 min-h-[220px] sm:min-h-[260px]">
                  <p
                    className="text-sm md:text-base font-roboto font-bold uppercase tracking-[0.25em] mb-2"
                    style={{ color: accentColor }}
                  >
                    {gridEyebrow}
                  </p>
                  <h2 className="font-prata text-primary text-lg md:text-2xl leading-snug mb-2">
                    {gridTitle}
                  </h2>
                  <p className="text-gray-500 font-roboto text-[11px] leading-relaxed mb-4 max-w-xs">
                    Discover the character, lifestyle, and property market of every major neighbourhood.
                  </p>
                  <div className="flex gap-px">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-0.5 rotate-[-35deg] origin-left"
                        style={{ backgroundColor: accentColor, marginRight: '3px' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Cards */}
                {filteredNbs.map((nb) => (
                  <div key={nb.id} className="h-[220px] sm:h-[260px]">
                    <NeighbourhoodCard nb={nb} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-3">
                  <i className="ri-map-pin-line text-xl text-gray-300" />
                </div>
                <h3 className="font-prata text-primary text-lg mb-1">No neighbourhoods found</h3>
                <p className="text-xs text-gray-400 font-roboto mb-4">Try a different search term or filter.</p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All Areas'); }}
                  className="px-4 py-2 bg-primary text-white text-xs font-roboto hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap rounded-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* Quick stats — compact strip */}
          {showStats && (
            <section className="py-8 md:py-10 px-4 md:px-6" style={{ backgroundColor: statsBg }}>
              <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { icon: 'ri-map-pin-2-line', value: `${neighbourhoods.length}+`, label: 'Neighbourhoods' },
                  { icon: 'ri-building-2-line', value: `${neighbourhoods.reduce((s, n) => s + n.listing_count, 0)}+`, label: 'Active Listings' },
                  { icon: 'ri-price-tag-3-line', value: `${neighbourhoods.reduce((s, n) => s + n.sale_count, 0)}+`, label: 'For Sale' },
                  { icon: 'ri-key-2-line', value: `${neighbourhoods.reduce((s, n) => s + n.rent_count, 0)}+`, label: 'To Let' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full mx-auto mb-2">
                      <i className={`${stat.icon} text-sm`} style={{ color: accentColor }} />
                    </div>
                    <p className="font-prata text-white text-xl md:text-2xl mb-0.5">{stat.value}</p>
                    <p className="text-white/50 font-roboto text-[10px] uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Teaser: switch to guides */}
          {showGuidesTab && (
            <section className="py-10 px-4 md:px-6 bg-[#f5f5f5] border-t border-gray-100 text-center">
              <div className="max-w-lg mx-auto">
                <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Local Knowledge</p>
                <h2 className="font-prata text-primary text-xl md:text-2xl mb-3">
                  {blogPosts.length > 0 ? `${blogPosts.length} Area Guides & Articles` : 'Area Guides & Insights'}
                </h2>
                <p className="text-gray-500 font-roboto text-xs leading-relaxed mb-5">
                  In-depth neighbourhood guides, market insights, and expert advice written for expats and property seekers.
                </p>
                <button
                  onClick={() => setActiveTab('guides')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-roboto text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap rounded-sm"
                >
                  <i className="ri-article-line" />
                  Read Area Guides
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {/* ─── TAB: AREA GUIDES & BLOG ─── */}
      {activeTab === 'guides' && showGuidesTab && (
        <>
          {/* Blog category filter */}
          <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveBlogCat(cat)}
                  className={`px-3 py-1 text-[11px] font-roboto font-medium whitespace-nowrap cursor-pointer transition-all rounded-sm ${
                    activeBlogCat === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-[11px] font-roboto text-gray-400 whitespace-nowrap shrink-0">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-12">
            <div className="mb-6">
              <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>Insights &amp; Guides</p>
              <h2 className="font-prata text-primary text-xl md:text-2xl">Kampala Area Guides &amp; Blog</h2>
            </div>

            {blogLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-lg bg-gray-100 animate-pulse" style={{ height: '300px' }} />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-3">
                  <i className="ri-article-line text-xl text-gray-300" />
                </div>
                <h3 className="font-prata text-primary text-lg mb-1">No articles found</h3>
                <p className="text-xs text-gray-400 font-roboto mb-4">Try a different search or category.</p>
                <button
                  onClick={() => { setSearch(''); setActiveBlogCat('All'); }}
                  className="px-4 py-2 bg-primary text-white text-xs font-roboto hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap rounded-sm"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {featuredPost && (
                  <Link to={`/blog/${featuredPost.slug}`} className="group block mb-8 cursor-pointer">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-lg overflow-hidden border border-gray-100">
                      <div className="relative overflow-hidden" style={{ minHeight: '300px' }}>
                        {featuredPost.featured_image ? (
                          <img src={featuredPost.featured_image} alt={featuredPost.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 absolute inset-0" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center absolute inset-0">
                            <i className="ri-article-line text-4xl text-gray-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/15 lg:block hidden" />
                      </div>
                      <div className="bg-white p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3">
                          {featuredPost.category && (
                            <span className="px-2.5 py-0.5 text-[10px] font-roboto font-bold uppercase tracking-widest rounded-sm whitespace-nowrap" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                              {featuredPost.category}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-roboto whitespace-nowrap">Featured</span>
                        </div>
                        <h2 className="font-prata text-primary text-xl md:text-2xl leading-snug mb-3 group-hover:text-golden transition-colors">
                          {featuredPost.title}
                        </h2>
                        {featuredPost.excerpt && (
                          <p className="text-gray-500 font-roboto text-xs leading-relaxed mb-4 line-clamp-3">{featuredPost.excerpt}</p>
                        )}
                        <div className="flex items-center gap-3 text-[11px] font-roboto text-gray-400 mt-auto">
                          <span className="flex items-center gap-1">
                            <i className="ri-calendar-line" style={{ color: accentColor }} />
                            {formatDate(featuredPost.publish_date)}
                          </span>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-1.5 text-primary text-[11px] font-roboto font-semibold uppercase tracking-widest group-hover:text-golden transition-colors">
                          Read Article <i className="ri-arrow-right-line" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {restPosts.length > 0 && (
                  <>
                    <div className="mb-5">
                      <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>More Articles</p>
                      <h2 className="font-prata text-primary text-lg md:text-xl">Area Guides &amp; Insights</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {restPosts.map((post) => (
                        <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                          <div className="relative overflow-hidden" style={{ height: '130px' }}>
                            {post.featured_image ? (
                              <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <i className="ri-article-line text-2xl text-gray-300" />
                              </div>
                            )}
                            {post.category && (
                              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary/90 text-white text-[8px] font-roboto font-bold uppercase tracking-wider rounded-sm whitespace-nowrap">
                                {post.category}
                              </span>
                            )}
                          </div>
                          <div className="p-3 flex flex-col flex-1">
                            <h3 className="font-prata text-primary text-xs sm:text-sm leading-snug mb-1 line-clamp-2 group-hover:text-golden transition-colors">{post.title}</h3>
                            {post.excerpt && <p className="text-gray-400 text-[10px] font-roboto leading-relaxed line-clamp-2 mb-2 hidden sm:block">{post.excerpt}</p>}
                            <div className="mt-auto flex items-center justify-between text-[10px] font-roboto text-gray-400 pt-1.5 border-t border-gray-50">
                              <span className="flex items-center gap-1">
                                <i className="ri-calendar-line text-[9px]" style={{ color: accentColor }} />
                                {formatDate(post.publish_date)}
                              </span>
                              <span className="flex items-center gap-1 text-primary font-medium group-hover:text-golden transition-colors whitespace-nowrap">
                                Read <i className="ri-arrow-right-line text-[9px]" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Switch back to neighbourhoods */}
          <section className="bg-[#f5f5f5] border-t border-gray-100 py-10 px-4 md:px-6 text-center">
            <div className="max-w-lg mx-auto">
              <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Ready to Find Your Home?</p>
              <h2 className="font-prata text-primary text-xl md:text-2xl mb-3">Explore Kampala Neighbourhoods</h2>
              <p className="text-gray-500 font-roboto text-xs leading-relaxed mb-5">
                Browse listings or speak to an agent today.
              </p>
              <div className="flex items-center justify-center gap-2 flex-col sm:flex-row">
                <button
                  onClick={() => setActiveTab('neighbourhoods')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white font-roboto text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap rounded-sm w-full sm:w-auto"
                >
                  <i className="ri-map-pin-2-line" />
                  Browse Neighbourhoods
                </button>
                <Link to="/contact" className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-primary text-primary font-roboto text-xs tracking-widest uppercase hover:bg-primary hover:text-white transition-colors cursor-pointer whitespace-nowrap rounded-sm w-full sm:w-auto">
                  <i className="ri-chat-1-line" />
                  Talk to an Agent
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── CTA ─── */}
      {ctaVisible && (
        <section className="py-10 md:py-12 px-4 md:px-6 text-center" style={{ backgroundColor: ctaBg }}>
          <div className="max-w-lg mx-auto">
            <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>{ctaEyebrow}</p>
            <h2 className="font-prata text-primary text-xl md:text-2xl mb-3">{ctaTitle}</h2>
            <p className="text-gray-500 font-roboto text-xs leading-relaxed mb-5">{ctaBody}</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link
                to={ctaBtn1Link}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white font-roboto text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap rounded-sm"
              >
                <i className="ri-chat-1-line" />
                {ctaBtn1Label}
              </Link>
              <Link
                to={ctaBtn2Link}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-primary text-primary font-roboto text-xs tracking-widest uppercase hover:bg-primary hover:text-white transition-colors cursor-pointer whitespace-nowrap rounded-sm"
              >
                <i className="ri-search-line" />
                {ctaBtn2Label}
              </Link>
            </div>
          </div>
        </section>
      )}

      <InnerContactSection />
      <GlobalContactStrip />
      <Footer />
    </div>
  );
}