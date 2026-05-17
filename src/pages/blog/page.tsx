import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import InnerContactSection from '@/components/feature/InnerContactSection';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  featured_image: string | null;
  excerpt: string | null;
  publish_date: string;
  published: boolean;
  author?: { full_name: string } | null;
}

const CATEGORIES = ['All', 'Neighborhood Spotlight', 'Market Insights', 'Buying Guide', 'Renting Guide', 'Investment', 'Tips & Advice'];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function readTime(excerpt: string | null): string {
  const words = (excerpt ?? '').split(' ').length;
  return `${Math.max(3, Math.ceil(words / 200))} min read`;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, category, featured_image, excerpt, publish_date, published, author:agents!blog_posts_author_id_fkey(full_name)')
        .eq('published', true)
        .order('publish_date', { ascending: false });
      setPosts((data ?? []) as BlogPost[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !(p.excerpt ?? '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [posts, activeCategory, search]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <div
        className="relative pt-32 pb-20 px-6 text-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=Kampala%20Uganda%20aerial%20panoramic%20cityscape%20dramatic%20golden%20hour%20light%20rolling%20green%20hills%20dense%20tropical%20canopy%20luxury%20rooftops%20emerging%20above%20trees%20sweeping%20urban%20landscape%20wide%20angle%20photography&width=1920&height=600&seq=blog_index_hero&orientation=landscape)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/70" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-golden text-sm md:text-base font-roboto tracking-[0.3em] uppercase mb-4">Insights &amp; Guides</p>
          <h1 className="font-prata text-white text-4xl md:text-5xl leading-tight mb-4">
            Kampala Area Guides &amp; Blog
          </h1>
          <p className="text-white/70 font-roboto text-sm leading-relaxed max-w-lg mx-auto mb-8">
            In-depth neighbourhood guides, market insights, and expert advice to help you find the right home in Kampala.
          </p>
          <div className="max-w-md mx-auto relative">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white text-sm font-roboto text-primary placeholder:text-stone-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 text-white/50 font-roboto text-xs">
          <Link to="/" className="hover:text-white transition-colors cursor-pointer">Home</Link>
          <i className="ri-arrow-right-s-line" />
          <span className="text-white/80">Blog</span>
        </div>
      </div>

      {/* ── Category filter ── */}
      <div className="bg-white border-b border-stone-100 sticky top-14 z-30">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-roboto font-medium whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs font-roboto text-stone-400 whitespace-nowrap shrink-0">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl bg-stone-100 animate-pulse" style={{ height: '340px' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 flex items-center justify-center bg-stone-100 rounded-full mx-auto mb-4">
              <i className="ri-article-line text-2xl text-stone-300" />
            </div>
            <h3 className="font-prata text-primary text-xl mb-2">No articles found</h3>
            <p className="text-sm text-stone-400 font-roboto mb-5">Try a different search or category.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="px-5 py-2.5 bg-primary text-white text-sm font-roboto rounded hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* ── Featured post ── */}
            {featured && (
              <Link
                to={`/blog/${featured.slug}`}
                className="group block mb-12 cursor-pointer"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-stone-100">
                  <div className="relative overflow-hidden" style={{ minHeight: '360px' }}>
                    {featured.featured_image ? (
                      <img
                        src={featured.featured_image}
                        alt={featured.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 absolute inset-0"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center absolute inset-0">
                        <i className="ri-article-line text-5xl text-stone-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 lg:block hidden" />
                  </div>
                  <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      {featured.category && (
                        <span className="px-3 py-1 bg-golden/10 text-golden text-[10px] font-roboto font-bold uppercase tracking-widest rounded-sm whitespace-nowrap">
                          {featured.category}
                        </span>
                      )}
                      <span className="text-xs text-stone-400 font-roboto whitespace-nowrap">Featured</span>
                    </div>
                    <h2 className="font-prata text-primary text-2xl md:text-3xl leading-snug mb-4 group-hover:text-golden transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-stone-500 font-roboto text-sm leading-relaxed mb-6 line-clamp-3">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs font-roboto text-stone-400 mt-auto">
                      {featured.author?.full_name && (
                        <span className="flex items-center gap-1.5">
                          <i className="ri-user-line text-golden" />
                          {featured.author.full_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <i className="ri-calendar-line text-golden" />
                        {formatDate(featured.publish_date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <i className="ri-time-line text-golden" />
                        {readTime(featured.excerpt)}
                      </span>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-primary text-xs font-roboto font-semibold uppercase tracking-widest group-hover:text-golden transition-colors">
                      Read Article <i className="ri-arrow-right-line" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* ── Grid of remaining posts ── */}
            {rest.length > 0 && (
              <>
                <div className="flex items-end justify-between mb-7">
                  <div>
                    <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest text-golden mb-1">More Articles</p>
                    <h2 className="font-prata text-primary text-xl md:text-2xl">Area Guides &amp; Insights</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                    >
                      <div className="relative overflow-hidden" style={{ height: '200px' }}>
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                            <i className="ri-article-line text-4xl text-stone-300" />
                          </div>
                        )}
                        {post.category && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary/90 text-white text-[9px] font-roboto font-bold uppercase tracking-wider rounded-sm whitespace-nowrap">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-prata text-primary text-base leading-snug mb-2 line-clamp-2 group-hover:text-golden transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-stone-400 text-xs font-roboto leading-relaxed line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between text-xs font-roboto text-stone-400 pt-3 border-t border-stone-100">
                          <span className="flex items-center gap-1">
                            <i className="ri-calendar-line text-golden text-xs" />
                            {formatDate(post.publish_date)}
                          </span>
                          <span className="flex items-center gap-1 text-primary font-medium group-hover:text-golden transition-colors whitespace-nowrap">
                            Read <i className="ri-arrow-right-line text-xs" />
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

      {/* ── CTA ── */}
      <section className="bg-[#f5f5f5] border-t border-stone-100 py-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-sm md:text-base font-roboto font-bold uppercase tracking-widest text-golden mb-3">Ready to Find Your Home?</p>
          <h2 className="font-prata text-primary text-2xl md:text-3xl mb-4">Explore Kampala Properties</h2>
          <p className="text-stone-500 font-roboto text-sm leading-relaxed mb-7">
            Our local experts know every neighbourhood in Kampala. Browse listings or speak to an agent today.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/neighbourhoods"
              className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-roboto text-xs tracking-widest uppercase rounded hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-map-pin-2-line" />
              Explore Neighbourhoods
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 border border-primary text-primary font-roboto text-xs tracking-widest uppercase rounded hover:bg-primary hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-chat-1-line" />
              Talk to an Agent
            </Link>
          </div>
        </div>
      </section>

      <InnerContactSection />
      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
