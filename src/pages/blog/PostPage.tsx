import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import LogoLoading from '@/components/base/LogoLoading';
import { supabase } from '@/lib/supabase';
import { BlogPostSEO } from '@/components/feature/PageSEO';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  featured_image: string | null;
  excerpt: string | null;
  full_body: string | null;
  publish_date: string;
  seo_title: string | null;
  seo_description: string | null;
  author?: { full_name: string; avatar_url?: string } | null;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  featured_image: string | null;
  excerpt: string | null;
  publish_date: string;
  category: string | null;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Very simple markdown-ish renderer — handles ## headings, **bold**, - lists, paragraphs */
function renderBody(body: string): string {
  const lines = body.split('\n');
  let html = '';
  let inList = false;

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2 class="font-prata text-primary text-xl md:text-2xl mt-10 mb-4">${line.slice(3)}</h2>`;
    } else if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3 class="font-prata text-primary text-lg mt-8 mb-3">${line.slice(4)}</h3>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { html += '<ul class="space-y-2 my-4 pl-0">'; inList = true; }
      const content = formatInline(line.slice(2));
      html += `<li class="flex items-start gap-2.5 text-stone-600 font-roboto text-sm leading-relaxed"><span class="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5"><i class="ri-checkbox-circle-fill text-golden text-xs"></i></span><span>${content}</span></li>`;
    } else if (line === '') {
      if (inList) { html += '</ul>'; inList = false; }
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      const content = formatInline(line);
      html += `<p class="text-stone-600 font-roboto text-sm leading-relaxed mb-4">${content}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-golden underline hover:text-primary transition-colors" rel="nofollow">$1</a>');
}

export default function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setNotFound(false);

      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, category, featured_image, excerpt, full_body, publish_date, seo_title, seo_description, author:agents!blog_posts_author_id_fkey(full_name, avatar_url)')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPost(data as BlogPost);

      // Fetch related posts (same category, exclude current)
      const { data: rel } = await supabase
        .from('blog_posts')
        .select('id, title, slug, featured_image, excerpt, publish_date, category')
        .eq('published', true)
        .eq('category', data.category ?? '')
        .neq('slug', slug)
        .order('publish_date', { ascending: false })
        .limit(3);

      setRelated((rel ?? []) as RelatedPost[]);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LogoLoading label="Loading article…" size={64} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <i className="ri-article-line text-5xl text-stone-200 mb-4" />
          <h1 className="font-prata text-primary text-2xl mb-2">Article Not Found</h1>
          <p className="text-stone-400 font-roboto text-sm mb-6">This article may have been moved or removed.</p>
          <Link to="/blog" className="px-6 py-2.5 bg-primary text-white text-sm font-roboto rounded hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const bodyHtml = post.full_body ? renderBody(post.full_body) : '';
  const wordCount = (post.full_body ?? '').split(' ').length;
  const readTime = Math.max(3, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-white">
      <BlogPostSEO
        title={post.title}
        description={post.seo_description || post.excerpt || ''}
        slug={post.slug}
        image={post.featured_image}
        publishDate={post.publish_date}
        category={post.category}
        authorName={post.author?.full_name || undefined}
      />
      <Navbar />

      {/* ── Hero image ── */}
      {post.featured_image && (
        <div className="relative w-full" style={{ height: '480px' }}>
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Breadcrumb */}
          <div className="absolute top-0 left-0 right-0 pt-28 px-6 md:px-10">
            <div className="max-w-4xl mx-auto">
              <nav className="flex items-center gap-2 text-white/60 text-xs font-roboto flex-wrap">
                <Link to="/" className="hover:text-white transition-colors cursor-pointer whitespace-nowrap">Home</Link>
                <i className="ri-arrow-right-s-line" />
                <Link to="/blog" className="hover:text-white transition-colors cursor-pointer whitespace-nowrap">Blog</Link>
                <i className="ri-arrow-right-s-line" />
                <span className="text-white/80 line-clamp-1">{post.title}</span>
              </nav>
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-10">
            <div className="max-w-4xl mx-auto">
              {post.category && (
                <span className="inline-block px-3 py-1 bg-golden text-primary text-[10px] font-roboto font-bold uppercase tracking-widest rounded-sm mb-4 whitespace-nowrap">
                  {post.category}
                </span>
              )}
              <h1 className="font-prata text-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 max-w-3xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-5 flex-wrap text-white/60 text-xs font-roboto">
                {post.author?.full_name && (
                  <span className="flex items-center gap-1.5">
                    <i className="ri-user-line text-golden" />
                    {post.author.full_name}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <i className="ri-calendar-line text-golden" />
                  {formatDate(post.publish_date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="ri-time-line text-golden" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── No image: simple header ── */}
      {!post.featured_image && (
        <div className="pt-32 pb-10 px-6 md:px-10 bg-[#f5f5f5] border-b border-stone-100">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center gap-2 text-stone-400 text-xs font-roboto mb-6 flex-wrap">
              <Link to="/" className="hover:text-primary transition-colors cursor-pointer whitespace-nowrap">Home</Link>
              <i className="ri-arrow-right-s-line" />
              <Link to="/blog" className="hover:text-primary transition-colors cursor-pointer whitespace-nowrap">Blog</Link>
              <i className="ri-arrow-right-s-line" />
              <span className="text-stone-600 line-clamp-1">{post.title}</span>
            </nav>
            {post.category && (
              <span className="inline-block px-3 py-1 bg-golden/10 text-golden text-[10px] font-roboto font-bold uppercase tracking-widest rounded-sm mb-4 whitespace-nowrap">
                {post.category}
              </span>
            )}
            <h1 className="font-prata text-primary text-3xl md:text-4xl leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-5 flex-wrap text-stone-400 text-xs font-roboto">
              {post.author?.full_name && (
                <span className="flex items-center gap-1.5">
                  <i className="ri-user-line text-golden" />
                  {post.author.full_name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <i className="ri-calendar-line text-golden" />
                {formatDate(post.publish_date)}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="ri-time-line text-golden" />
                {readTime} min read
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Article body ── */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content */}
          <article className="lg:col-span-2">
            {post.excerpt && (
              <p className="text-stone-500 font-roboto text-base leading-relaxed mb-8 pb-8 border-b border-stone-100 italic">
                {post.excerpt}
              </p>
            )}
            {bodyHtml ? (
              <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            ) : (
              <p className="text-stone-400 font-roboto text-sm italic">No content available for this article.</p>
            )}

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-stone-100">
              <p className="text-xs font-roboto font-bold uppercase tracking-widest text-stone-400 mb-4">Share this article</p>
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-xs font-roboto rounded hover:bg-[#1ebe5d] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-whatsapp-fill" /> WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white text-xs font-roboto rounded hover:bg-[#1464d8] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-facebook-fill" /> Facebook
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-stone-500 text-xs font-roboto rounded hover:bg-[#f5f5f5] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-link" /> Copy Link
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* CTA card */}
            <div className="bg-primary rounded-xl p-6">
              <p className="text-golden text-[10px] font-roboto font-bold uppercase tracking-widest mb-2">Interested?</p>
              <h3 className="font-prata text-white text-lg mb-3 leading-snug">Find a Property in This Area</h3>
              <p className="text-white/65 font-roboto text-xs leading-relaxed mb-5">
                Our agents know every street in Kampala. Let us help you find the right home.
              </p>
              <Link
                to="/neighbourhoods"
                className="block text-center px-4 py-2.5 bg-golden text-primary text-xs font-roboto font-semibold uppercase tracking-widest rounded hover:bg-golden/90 transition-colors cursor-pointer whitespace-nowrap mb-2"
              >
                Browse Neighbourhoods
              </Link>
              <Link
                to="/contact"
                className="block text-center px-4 py-2.5 border border-white/30 text-white text-xs font-roboto uppercase tracking-widest rounded hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                Talk to an Agent
              </Link>
            </div>

            {/* Quick links */}
            <div className="bg-[#f5f5f5] rounded-xl p-5 border border-stone-100">
              <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-stone-400 mb-4">Explore Areas</p>
              <div className="space-y-2">
                {['Kololo', 'Muyenga', 'Nakasero', 'Bugolobi', 'Naguru', 'Munyonyo'].map((area) => (
                  <Link
                    key={area}
                    to={`/neighbourhood/${area.toLowerCase()}`}
                    className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0 text-xs font-roboto text-stone-600 hover:text-golden transition-colors cursor-pointer group"
                  >
                    <span>{area}</span>
                    <i className="ri-arrow-right-line text-stone-300 group-hover:text-golden transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Back to blog */}
            <Link
              to="/blog"
              className="flex items-center gap-2 text-sm font-roboto text-stone-400 hover:text-primary transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line" />
              All Articles
            </Link>
          </aside>
        </div>
      </div>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="bg-[#f5f5f5] border-t border-stone-100 py-14 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <p className="text-[11px] font-roboto font-bold uppercase tracking-widest text-golden mb-2">More Like This</p>
            <h2 className="font-prata text-primary text-2xl mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden" style={{ height: '180px' }}>
                    {rp.featured_image ? (
                      <img
                        src={rp.featured_image}
                        alt={rp.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                        <i className="ri-article-line text-4xl text-stone-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-prata text-primary text-sm leading-snug mb-2 line-clamp-2 group-hover:text-golden transition-colors">
                      {rp.title}
                    </h3>
                    <p className="text-stone-400 text-xs font-roboto line-clamp-2 mb-3">{rp.excerpt}</p>
                    <div className="flex items-center justify-between text-xs font-roboto text-stone-400 pt-3 border-t border-stone-100">
                      <span>{formatDate(rp.publish_date)}</span>
                      <span className="text-primary group-hover:text-golden transition-colors whitespace-nowrap">
                        Read <i className="ri-arrow-right-line" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
