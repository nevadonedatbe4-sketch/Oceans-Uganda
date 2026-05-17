import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { AboutSEO } from '@/components/feature/PageSEO';

interface Agent {
  id: string;
  name: string;
  title: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
}

// ─── Fallback images (used only when admin has NOT uploaded a replacement) ───
const FALLBACK_HERO = 'https://readdy.ai/api/search-image?query=aerial%20panoramic%20view%20Kampala%20Uganda%20cityscape%20golden%20hour%20sunset%20luxury%20real%20estate%20skyline%20lush%20green%20hills%20contemporary%20buildings%20premium%20residential%20neighborhood%20warm%20tone%20cinematic%20photography%20professional&width=1920&height=800&seq=about-hero-2026&orientation=landscape';
const FALLBACK_INTRO = 'https://readdy.ai/api/search-image?query=elegant%20professional%20real%20estate%20agents%20team%20Kampala%20Uganda%20luxury%20office%20interior%20modern%20boardroom%20warm%20wood%20tones%20high%20end%20property%20agency%20collaboration%20refined%20environment%20golden%20natural%20light&width=900&height=700&seq=about-intro-2026&orientation=portrait';
const FALLBACK_STORY = 'https://readdy.ai/api/search-image?query=luxury%20villa%20exterior%20swimming%20pool%20Kampala%20Uganda%20lush%20tropical%20garden%20premium%20property%20modern%20architecture%20warm%20golden%20light%20blue%20sky%20palm%20trees%20high-end%20residential&width=900&height=700&seq=about-story-2026&orientation=landscape';
const FALLBACK_CTA = 'https://readdy.ai/api/search-image?query=real%20estate%20agent%20handshake%20client%20keys%20modern%20apartment%20Kampala%20Uganda%20luxury%20living%20room%20sophisticated%20interior%20design%20trust%20professional%20service%20premium%20property&width=1200&height=600&seq=about-mission-2026&orientation=landscape';

export default function AboutPage() {
  const { get } = useSiteSettings();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'editor';

  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    supabase
      .from('agents')
      .select('id, name, title, photo_url, email, phone')
      .eq('status', 'active')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setAgents(data as Agent[]);
      });
  }, []);

  // ─── Colors & Brand ───────────────────────────────────────
  const accentColor = get('about_accent_color', '#C9A84C');
  const primaryColor = get('about_primary_color', '#001731');

  // ─── Media — always prefer admin-uploaded, fall back to generated ─
  const heroBg       = get('about_hero_image',  '') || FALLBACK_HERO;
  const introImage   = get('about_intro_image', '') || FALLBACK_INTRO;
  const storyImage   = get('about_story_image', '') || FALLBACK_STORY;
  const ctaImage     = get('about_cta_image',   '') || FALLBACK_CTA;

  // ─── Section visibility ────────────────────────────────────
  const heroVisible   = get('about_hero_visible',   'true') !== 'false';
  const introVisible  = get('about_intro_visible',  'true') !== 'false';
  const mvVisible     = get('about_mv_visible',     'true') !== 'false';
  const valuesVisible = get('about_values_visible', 'true') !== 'false';
  const whyVisible    = get('about_why_visible',    'true') !== 'false';
  const statsVisible  = get('about_stats_visible',  'true') !== 'false';
  const teamVisible   = get('about_team_visible',   'true') !== 'false';
  const storyVisible  = get('about_story_visible',  'true') !== 'false';
  const ctaVisible    = get('about_cta_visible',    'true') !== 'false';

  // ─── Hero content ──────────────────────────────────────────
  const heroEyebrow  = get('about_hero_eyebrow',  'Who We Are');
  const heroTitle    = get('about_hero_title',    'Oceans Estate & Letting Agents');
  const heroSubtitle = get('about_hero_subtitle', 'Where luxury meets lifestyle in the heart of Kampala, Uganda');

  // Hero overlay
  const overlayColor   = get('about_hero_overlay_color',   '#000000');
  const overlayOpacity = Number(get('about_hero_overlay_opacity', '60')) / 100;
  const heroOverlay    = `${overlayColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')}`;

  // Hero typography
  const heroTitleFont      = get('about_hero_title_font',      'Prata');
  const heroTitleWeight    = get('about_hero_title_weight',    '400');
  const heroTitleSize      = get('about_hero_title_size',      '48');
  const heroTitleColor     = get('about_hero_title_color',     '#ffffff');
  const heroTitleSpacing   = get('about_hero_title_spacing',   '0');
  const heroTitleTransform = get('about_hero_title_transform', 'none') as React.CSSProperties['textTransform'];

  // Section heading typography
  const h2Font    = get('about_h2_font',    'Prata');
  const h2Weight  = get('about_h2_weight',  '400');
  const h2Size    = get('about_h2_size',    '32');
  const h2Color   = get('about_h2_color',   '#001731');

  // Body text typography
  const bodyFont    = get('about_body_font',    'Roboto, sans-serif') || 'Roboto, sans-serif';
  const bodyWeight  = get('about_body_weight',  '400');
  const bodySize    = get('about_body_size',    '15');
  const bodyLh      = get('about_body_lh',      '1.9');
  const bodyColor   = get('about_body_color',   '#44403c');

  const h2Style: React.CSSProperties = {
    fontFamily: h2Font ? `${h2Font}, serif` : undefined,
    fontWeight: h2Weight,
    fontSize: `${h2Size}px`,
    color: h2Color,
  };
  const bodyStyle: React.CSSProperties = {
    fontFamily: bodyFont,
    fontWeight: bodyWeight,
    fontSize: `${bodySize}px`,
    lineHeight: bodyLh,
    color: bodyColor,
  };

  // ─── Section padding ───────────────────────────────────────
  const sectionPy = `${get('about_section_py', '80')}px`;
  const cardGap   = `${get('about_card_gap',   '32')}px`;

  // ─── Section backgrounds ───────────────────────────────────
  const introBg  = get('about_intro_bg',  '#ffffff');
  const mvBg     = get('about_mv_bg',     '#F5F7F7');
  const statsBg  = get('about_stats_bg',  '#001731');
  const teamBg   = get('about_team_bg',   '#F8F7F5');
  const ctaBg    = get('about_cta_bg',    '#001731');
  const whyBg    = get('about_values_bg', '#f9fafb');

  // ─── Intro section content ─────────────────────────────────
  const introEyebrow = get('about_intro_eyebrow', 'Oceans Estate & Letting Agents');
  const introTitle   = get('about_intro_title',   'About Oceans Uganda');
  const introP1      = get('about_intro_p1',
    "Welcome to Oceans Estate & Lettings Agents, where luxury meets lifestyle in the heart of Kampala, Uganda!");
  const introP2      = get('about_intro_p2',
    "At Oceans, we don't just sell properties — we curate exceptional living experiences for the discerning middle-class to high-end individuals. Our passion for real estate goes beyond bricks and mortar; it's about creating homes that resonate with your aspirations and lifestyle.");
  const introImgPos  = get('about_intro_img_pos', 'left');

  // ─── Mission & Vision ──────────────────────────────────────
  const missionTitle = get('about_mission_title', 'Mission');
  const missionText  = get('about_mission_text',
    'To connect people with exceptional properties through honest advice, deep market knowledge, and a commitment to long-term relationships that extend far beyond the closing of any deal.');
  const visionTitle  = get('about_vision_title', 'Vision');
  const visionText   = get('about_vision_text',
    "To be Uganda's most respected and trusted property agency — known for integrity, innovation, and delivering outstanding results for every single client we serve.");

  // ─── Brand Values ──────────────────────────────────────────
  const valuesTitle = get('about_values_title', 'What We Stand For');
  const valuesCols  = Number(get('about_values_cols', '4'));
  const VALUES = [1, 2, 3, 4].map((n) => ({
    icon:  get(`about_value${n}_icon`,  ['ri-shield-check-line', 'ri-award-line', 'ri-user-heart-line', 'ri-lightbulb-line'][n - 1]),
    title: get(`about_value${n}_title`, ['Integrity', 'Expertise', 'Client-First', 'Innovation'][n - 1]),
    desc:  get(`about_value${n}_desc`,  [
      'We operate with complete transparency and honesty in every transaction, every time.',
      'Our team brings deep market knowledge and professional expertise to every deal.',
      'Your goals are our goals. We listen, advise, and deliver results that matter to you.',
      'We continuously evolve our approach to deliver better outcomes for every client.',
    ][n - 1]),
  }));

  // ─── Why Choose Us ─────────────────────────────────────────
  const whyEyebrow = get('about_why_eyebrow', 'The Oceans Difference');
  const whyTitle   = get('about_why_title',   'Why Choose Oceans?');
  const WHY_ITEMS = [
    {
      icon: 'ri-home-heart-line',
      title: get('about_why1_title', 'Your Home, Your Identity'),
      body:  get('about_why1_desc',  "We understand that your home is more than just a place — it's a reflection of your unique taste, personality, and the life you've worked hard to build."),
    },
    {
      icon: 'ri-award-line',
      title: get('about_why2_title', 'Unparalleled Excellence'),
      body:  get('about_why2_desc',  "Our commitment to excellence starts from the moment you step into our world. You'll experience a personalized approach to real estate that goes far beyond what you'd expect."),
    },
    {
      icon: 'ri-map-pin-2-line',
      title: get('about_why3_title', 'Kampala Market Leaders'),
      body:  get('about_why3_desc',  "With over 12 years of deep expertise in Kampala's premium property market, we know every neighbourhood, every price movement, and every opportunity."),
    },
    {
      icon: 'ri-user-heart-line',
      title: 'Curated Living Experiences',
      body:  "At Oceans, we don't just sell properties — we curate exceptional living experiences for discerning individuals who expect nothing but the best.",
    },
    {
      icon: 'ri-building-2-line',
      title: 'Exclusive Portfolio',
      body:  'From chic urban apartments and luxurious villas to stylish penthouses with panoramic views, our portfolio represents the most exclusive and desirable properties across Kampala.',
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Trust & Transparency',
      body:  "Every transaction we handle is conducted with complete transparency and honesty. Your interests come first — always. That's the Oceans promise.",
    },
  ];

  // ─── Stats ─────────────────────────────────────────────────
  const STATS = [1, 2, 3, 4].map((n) => ({
    value: get(`about_stat${n}_value`, ['12+', '500+', '98%', '200+'][n - 1]),
    label: get(`about_stat${n}_label`, ['Years of Excellence', 'Properties Sold', 'Client Satisfaction', 'Properties Managed'][n - 1]),
  }));

  // ─── Team ──────────────────────────────────────────────────
  const teamEyebrow = get('about_team_eyebrow', 'Meet the Team');
  const teamTitle   = get('about_team_title',   'The People Behind Oceans');
  const teamCols    = Number(get('about_team_cols', '3'));
  const teamColsClass = teamCols === 2 ? 'sm:grid-cols-2' : teamCols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

  // ─── Brand Story ───────────────────────────────────────────
  const storyEyebrow = get('about_story_eyebrow', 'Our Story');
  const storyTitle   = get('about_story_title',   'From Humble Beginnings to Market Leaders');
  const storyP1      = get('about_story_p1',
    `Oceans Uganda was founded in ${get('about_founded_year', '2012')} with a vision to transform the property experience in Kampala. Starting with a small team of dedicated agents and a handful of exceptional listings, we quickly built a reputation for honesty, expertise, and outstanding results.`);
  const storyP2      = get('about_story_p2',
    "Today, we are proud to be one of Kampala's leading property agencies, with a portfolio spanning residential sales, lettings, property management, and new developments across the city's most sought-after neighbourhoods.");
  const storyImgPos  = get('about_story_img_pos', 'right');
  const foundedYear  = get('about_founded_year', '2015');

  // ─── CTA ───────────────────────────────────────────────────
  const ctaTitle    = get('about_cta_title',    'Ready to Find Your Perfect Property?');
  const ctaBody     = get('about_cta_body',     "Whether you're buying, selling, or renting — our team of dedicated property professionals is here to help every step of the way. Contact us today for a free, no-obligation consultation.");
  const ctaBtn1     = get('about_cta_btn1_label', 'Browse Properties');
  const ctaBtn1Link = get('about_cta_btn1_link',  '/all-properties');
  const ctaBtn2     = get('about_cta_btn2_label', 'Contact Us');
  const ctaBtn2Link = get('about_cta_btn2_link',  '/contact');

  // ─── Values cols class ─────────────────────────────────────
  const valuesColsClass = valuesCols === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : valuesCols === 3
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid-cols-2 sm:grid-cols-4';

  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[96px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <AboutSEO />
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────── */}
      {heroVisible && (
        <div
          className="relative flex flex-col items-center justify-center text-center overflow-hidden pt-10 pb-12 md:pt-14 md:pb-16"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            minHeight: '360px',
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, ${heroOverlay}, ${overlayColor}${Math.round(overlayOpacity * 0.72 * 255).toString(16).padStart(2, '0')}, ${heroOverlay})` }}
          />

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin/management/about')}
              className="absolute top-24 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-stone-700 text-xs font-medium rounded-md hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-edit-line text-sm" />
              Edit About Page
            </button>
          )}

          <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-px w-8 inline-block" style={{ backgroundColor: accentColor }} />
              <p className="text-sm md:text-base tracking-[0.2em] uppercase" style={{ color: accentColor }}>
                {heroEyebrow}
              </p>
              <span className="h-px w-8 inline-block" style={{ backgroundColor: accentColor }} />
            </div>
            <h1
              className="mb-4 leading-tight"
              style={{
                fontFamily: heroTitleFont ? `${heroTitleFont}, serif` : 'Prata, serif',
                fontWeight: heroTitleWeight,
                fontSize: `clamp(26px, 4vw, ${heroTitleSize}px)`,
                color: heroTitleColor,
                letterSpacing: heroTitleSpacing !== '0' ? `${heroTitleSpacing}em` : undefined,
                textTransform: heroTitleTransform,
              }}
            >
              {heroTitle}
            </h1>
            <p className="text-sm md:text-base leading-relaxed max-w-xl mx-auto" style={{ color: `${heroTitleColor}BF` }}>
              {heroSubtitle}
            </p>
          </div>

          <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 text-white/45 text-[11px]">
            <Link to="/" className="hover:text-white/80 transition-colors cursor-pointer">Home</Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-white/70">About Us</span>
          </div>
        </div>
      )}

      {/* ─── ABOUT INTRO ─────────────────────────────────── */}
      {introVisible && (
        <section className="px-6" style={{ backgroundColor: introBg, paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-10 pt-6 md:pt-8">
              <div className="hidden lg:block" />
              <div className="lg:col-span-2">
                <p className="text-sm md:text-base tracking-[0.2em] uppercase mb-2" style={{ color: accentColor }}>
                  {introEyebrow}
                </p>
                <h2 className="leading-snug text-xl md:text-2xl mb-0" style={h2Style}>{introTitle}</h2>
                <span className="block mt-3 h-0.5 w-12" style={{ backgroundColor: accentColor }} />
              </div>
            </div>

            <div
              className={`grid grid-cols-1 lg:grid-cols-2 items-start ${introImgPos === 'right' ? '' : 'lg:[&>*:first-child]:order-last'}`}
              style={{ gap: '20px' }}
            >
              {/* Image */}
              <div className="relative">
                <div className="w-full overflow-hidden h-52 sm:h-64 lg:h-[380px]">
                  <img
                    src={introImage}
                    alt="Oceans Estate team"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div
                  className="absolute -bottom-4 -right-4 px-5 py-3 hidden md:block"
                  style={{ backgroundColor: accentColor }}
                >
                  <p className="text-white text-xl" style={{ fontFamily: 'Prata, serif' }}>Est. {foundedYear}</p>
                  <p className="text-white/80 text-[10px] mt-0.5">Kampala, Uganda</p>
                </div>
              </div>

              {/* Text */}
              <div className="lg:pt-2">
                <p className="mb-3" style={{ ...bodyStyle, fontSize: '14px', lineHeight: '1.7' }}>{introP1}</p>
                <p className="mb-3" style={{ ...bodyStyle, fontSize: '14px', lineHeight: '1.7' }}>{introP2}</p>
                <p style={{ ...bodyStyle, fontSize: '14px', lineHeight: '1.7' }}>
                  <strong style={{ color: primaryColor }}>Why Oceans?</strong> Because we understand that your home is more than just a place — it&apos;s a reflection of your unique taste, personality, and the life you&apos;ve worked hard to build. Whether you&apos;re seeking a chic urban apartment, a luxurious villa, or a stylish penthouse with panoramic views, Oceans Estates is your gateway to the most exclusive and desirable properties in Kampala.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <Link
                    to="/all-properties"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <i className="ri-search-line" />
                    Browse Properties
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-[#f5f5f5] transition-colors"
                    style={{ borderColor: primaryColor, color: primaryColor }}
                  >
                    <i className="ri-chat-1-line" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── STATS STRIP ─────────────────────────────────── */}
      {statsVisible && (
        <div style={{ backgroundColor: statsBg }}>
          <div className="max-w-5xl mx-auto px-6 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label} className="py-2">
                <p className="text-2xl md:text-3xl mb-1" style={{ color: accentColor, fontFamily: 'Prata, serif' }}>{s.value}</p>
                <p className="text-white/55 text-[10px] uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── WHY CHOOSE US ───────────────────────────────── */}
      {whyVisible && (
        <section className="px-6" style={{ backgroundColor: whyBg, paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-10">
              <div className="hidden lg:block" />
              <div className="lg:col-span-2">
                <p className="text-sm md:text-base tracking-[0.2em] uppercase mb-2" style={{ color: accentColor }}>{whyEyebrow}</p>
                <h2 className="leading-snug text-xl md:text-2xl" style={h2Style}>{whyTitle}</h2>
                <span className="block mt-3 h-0.5 w-12" style={{ backgroundColor: accentColor }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200">
              {WHY_ITEMS.map((item) => (
                <div key={item.title} className="p-5 md:p-6 shadow-sm rounded-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group" style={{ backgroundColor: introBg }}>
                  <div className="w-9 h-9 flex items-center justify-center rounded-sm mb-3" style={{ backgroundColor: `${primaryColor}0d` }}>
                    <i className={`${item.icon} text-base`} style={{ color: accentColor }} />
                  </div>
                  <h3 className="text-sm md:text-base mb-1.5" style={{ color: primaryColor, fontFamily: 'Prata, serif' }}>{item.title}</h3>
                  <p className="text-stone-500 leading-relaxed" style={{ fontSize: '13px', lineHeight: '1.7' }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── MISSION BANNER ──────────────────────────────── */}
      {mvVisible && (
        <section
          className="relative overflow-hidden px-6"
          style={{
            backgroundImage: `url(${ctaImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            paddingTop: '40px',
            paddingBottom: '40px',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/30" />
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              <p className="text-sm md:text-base tracking-[0.2em] uppercase mb-2" style={{ color: accentColor }}>Our Purpose</p>
              <h2 className="text-white mb-4 leading-snug text-xl md:text-2xl" style={{ fontFamily: 'Prata, serif' }}>
                Our Mission &amp; Vision
              </h2>
              <div className="space-y-5">
                <div className="border-l-2 pl-5" style={{ borderColor: accentColor }}>
                  <h3 className="text-white text-xs uppercase tracking-wider mb-1">{missionTitle}</h3>
                  <p className="text-white/70 leading-relaxed" style={{ fontSize: '13px', lineHeight: '1.7' }}>{missionText}</p>
                </div>
                <div className="border-l-2 pl-5" style={{ borderColor: accentColor }}>
                  <h3 className="text-white text-xs uppercase tracking-wider mb-1">{visionTitle}</h3>
                  <p className="text-white/70 leading-relaxed" style={{ fontSize: '13px', lineHeight: '1.7' }}>{visionText}</p>
                </div>
              </div>
            </div>

            {/* Values */}
            {valuesVisible && (
              <div className={`grid gap-3 ${valuesColsClass}`}>
                {VALUES.map((v) => (
                  <div key={v.title} className="p-4 border border-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                    <div className="w-8 h-8 flex items-center justify-center mb-2" style={{ backgroundColor: `${accentColor}20` }}>
                      <i className={`${v.icon} text-sm`} style={{ color: accentColor }} />
                    </div>
                    <h3 className="text-white text-sm mb-1" style={{ fontFamily: 'Prata, serif' }}>{v.title}</h3>
                    <p className="text-white/55 leading-relaxed" style={{ fontSize: '12px', lineHeight: '1.65' }}>{v.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── BRAND STORY ─────────────────────────────────── */}
      {storyVisible && (
        <section className="px-6 bg-white" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: '20px' }}>
            <div className={storyImgPos === 'right' ? 'lg:order-last' : ''}>
              <p className="text-sm md:text-base tracking-[0.2em] uppercase mb-2" style={{ color: accentColor }}>{storyEyebrow}</p>
              <h2 className="mb-4 leading-snug text-xl md:text-2xl" style={h2Style}>{storyTitle}</h2>
              <p className="mb-3" style={{ ...bodyStyle, fontSize: '14px', lineHeight: '1.7' }}>{storyP1}</p>
              <p style={{ ...bodyStyle, fontSize: '14px', lineHeight: '1.7' }}>{storyP2}</p>

              <div className="mt-6 space-y-3">
                {[
                  { year: foundedYear, event: 'Oceans Estate & Lettings founded in Kampala' },
                  { year: '2016', event: 'Expanded to property management services' },
                  { year: '2020', event: 'Launched New Developments division' },
                  { year: '2024', event: '500+ properties sold & 200+ under management' },
                ].map((m) => (
                  <div key={m.year} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 text-right text-[10px] font-bold tracking-wider pt-0.5" style={{ color: accentColor }}>
                      {m.year}
                    </div>
                    <div className="flex-shrink-0 mt-1 w-px self-stretch" style={{ backgroundColor: `${primaryColor}20` }} />
                    <p className="text-stone-600 leading-relaxed" style={{ fontSize: '13px' }}>{m.event}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative ${storyImgPos === 'right' ? '' : 'lg:order-first'}`}>
              <div className="w-full overflow-hidden h-52 sm:h-64 lg:h-[380px]">
                <img
                  src={storyImage}
                  alt="Oceans Uganda story"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div
                className="absolute -bottom-4 -left-4 px-5 py-3 hidden md:block"
                style={{ backgroundColor: primaryColor }}
              >
                <p className="text-xl" style={{ color: accentColor, fontFamily: 'Prata, serif' }}>Since {foundedYear}</p>
                <p className="text-white/60 text-[10px] mt-0.5">Serving Uganda</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── TEAM ────────────────────────────────────────── */}
      {teamVisible && agents.length > 0 && (
        <section className="px-6" style={{ backgroundColor: teamBg, paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-10">
              <div className="hidden lg:block" />
              <div className="lg:col-span-2">
                <p className="text-sm md:text-base tracking-[0.2em] uppercase mb-2" style={{ color: accentColor }}>{teamEyebrow}</p>
                <h2 className="leading-snug text-xl md:text-2xl" style={h2Style}>{teamTitle}</h2>
                <span className="block mt-3 h-0.5 w-12" style={{ backgroundColor: accentColor }} />
              </div>
            </div>
            <div className={`grid grid-cols-1 ${teamColsClass} gap-6`}>
              {agents.slice(0, teamCols * 2).map((agent) => (
                <div key={agent.id} className="bg-white overflow-hidden shadow-sm rounded-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="w-full overflow-hidden" style={{ height: '220px' }}>
                    {agent.photo_url ? (
                      <img
                        src={agent.photo_url}
                        alt={agent.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}08` }}>
                        <i className="ri-user-line text-3xl" style={{ color: `${primaryColor}30` }} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm md:text-base mb-0.5" style={{ color: primaryColor, fontFamily: 'Prata, serif' }}>{agent.name}</h3>
                    {agent.title && (
                      <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: accentColor }}>{agent.title}</p>
                    )}
                    <div className="flex items-center gap-4 text-[11px]">
                      {agent.phone && (
                        <a href={`tel:${agent.phone}`} className="flex items-center gap-1 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer">
                          <i className="ri-phone-line" /> Call
                        </a>
                      )}
                      {agent.email && (
                        <a href={`mailto:${agent.email}`} className="flex items-center gap-1 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer">
                          <i className="ri-mail-line" /> Email
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─────────────────────────────────────────── */}
      {ctaVisible && (
        <section className="px-6" style={{ backgroundColor: ctaBg, paddingTop: '48px', paddingBottom: '48px' }}>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm md:text-base tracking-[0.2em] uppercase mb-3" style={{ color: accentColor }}>Get Started Today</p>
            <h2 className="text-white mb-3 leading-snug text-xl md:text-2xl" style={{ fontFamily: 'Prata, serif' }}>{ctaTitle}</h2>
            <p className="text-white/65 leading-relaxed mb-7 max-w-lg mx-auto" style={{ fontSize: '14px', lineHeight: '1.7' }}>{ctaBody}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <Link
                to={ctaBtn1Link}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-white text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
                style={{ backgroundColor: accentColor }}
              >
                <i className="ri-search-line" />
                {ctaBtn1}
              </Link>
              <Link
                to={ctaBtn2Link}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/30 text-white text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
              >
                <i className="ri-chat-1-line" />
                {ctaBtn2}
              </Link>
            </div>
          </div>
        </section>
      )}

      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
