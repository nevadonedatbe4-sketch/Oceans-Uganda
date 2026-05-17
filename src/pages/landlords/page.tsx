import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import LandlordServices from '@/pages/landlords/components/LandlordServices';
import LandlordSocialProof from '@/pages/landlords/components/LandlordSocialProof';
import LandlordEnquiryForm from '@/pages/landlords/components/LandlordEnquiryForm';
import { LandlordsSEO } from '@/components/feature/PageSEO';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DEFAULT_HERO_IMAGE = 'https://readdy.ai/api/search-image?query=premium%20residential%20villa%20aerial%20view%20Kampala%20Uganda%20lush%20tropical%20garden%20manicured%20lawn%20luxury%20estate%20property%20investment%20high%20end%20colonial%20architecture%20warm%20morning%20sunlight%20cinematic%20high%20contrast%20photography%20vivid%20greenery&width=1920&height=750&seq=landlord-hero1&orientation=landscape';
const DEFAULT_INTRO_IMAGE = 'https://readdy.ai/api/search-image?query=professional%20real%20estate%20agent%20showing%20luxury%20property%20interior%20modern%20living%20room%20Kampala%20Uganda%20elegant%20client%20consultation%20warm%20lighting%20premium%20interior%20design%20tropical%20greenery%20visible%20through%20windows&width=700&height=480&seq=landlord-intro1&orientation=landscape';

export default function LandlordsPage() {
  const { get } = useSiteSettings();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'editor';

  // All settings from management (lp_* prefix), with fallbacks to old keys for back-compat
  const heroVisible = get('lp_hero_visible', 'true') !== 'false';
  const heroImage = get('lp_hero_image', '') || get('landlords_hero_image', '') || DEFAULT_HERO_IMAGE;
  const heroHeight = parseInt(get('lp_hero_height', '750'));
  const heroOverlayColor = get('lp_hero_overlay_color', '#000000');
  const heroOverlayOpacity = parseInt(get('lp_hero_overlay_opacity', '80')) / 100;
  const heroEyebrow = get('lp_hero_eyebrow', 'For Landlords & Property Owners');
  const heroTitle = get('lp_hero_title', 'Let or Sell Your\nProperty With\nConfidence');
  const heroTitleColor = get('lp_hero_title_color', '#ffffff');
  const heroTitleSize = get('lp_hero_title_size', '56');
  const heroTitleFont = get('lp_hero_title_font', '');
  const heroSubtitle = get('lp_hero_subtitle', "Kampala's most trusted letting and management agency. We find quality tenants fast, collect your rent reliably, and protect your investment for the long term.");
  const btn1Label = get('lp_btn1_label', 'List My Property');
  const btn1Link = get('lp_btn1_link', '#landlord-form');
  const btn2Label = get('lp_btn2_label', 'Free Valuation');
  const btn2Link = get('lp_btn2_link', '#landlord-form');

  const statsVisible = get('lp_stats_visible', 'true') !== 'false';
  const statsBg = get('lp_stats_bg', '#001731');

  const introVisible = get('lp_intro_visible', 'true') !== 'false';
  const introBg = get('lp_intro_bg', '#ffffff');
  const introImage = get('lp_intro_image', '') || get('landlords_intro_image', '') || DEFAULT_INTRO_IMAGE;
  const introTitle = get('lp_intro_title', 'Your Property Is Our Priority');
  const introBody1 = get('lp_intro_p1', "At Oceans Uganda, we understand that your property is more than an asset — it's a significant investment. Our dedicated landlord team treats every property as if it were their own: maximising returns, minimising voids, and ensuring every tenancy runs smoothly.");
  const introBody2 = get('lp_intro_p2', "With deep roots in Kampala's premium property market, we have the network, experience, and systems to consistently deliver outstanding results for landlords across Kololo, Nakasero, Muyenga, and beyond.");
  const badgeValue = get('lp_badge_value', '98%');
  const badgeLabel = get('lp_badge_label', 'Occupancy Rate');
  const introImgPos = get('lp_intro_img_pos', 'right');

  const guaranteeVisible = get('lp_guarantee_visible', 'true') !== 'false';
  const guaranteeBg = get('lp_guarantee_bg', '#001731');

  const accentColor = get('lp_accent_color', '#C9A84C');

  const STATS = [
    { value: get('lp_stat1_value', '200+'), label: get('lp_stat1_label', 'Properties Managed') },
    { value: get('lp_stat2_value', '98%'), label: get('lp_stat2_label', 'Occupancy Rate') },
    { value: get('lp_stat3_value', '12+'), label: get('lp_stat3_label', 'Years Experience') },
    { value: get('lp_stat4_value', '14 days'), label: get('lp_stat4_label', 'Avg. Time to Let') },
  ];

  const GUARANTEES = [
    {
      icon: get('lp_guarantee1_icon', 'ri-calendar-check-line'),
      title: get('lp_guarantee1_title', 'No Let, No Fee'),
      desc: get('lp_guarantee1_desc', 'You only pay when we successfully place a tenant. Zero risk, zero upfront cost.'),
    },
    {
      icon: get('lp_guarantee2_icon', 'ri-shield-check-line'),
      title: get('lp_guarantee2_title', 'Fully Vetted Tenants'),
      desc: get('lp_guarantee2_desc', 'Every applicant undergoes background checks, employment verification, and reference screening.'),
    },
    {
      icon: get('lp_guarantee3_icon', 'ri-money-dollar-circle-line'),
      title: get('lp_guarantee3_title', 'Rent Guarantee Option'),
      desc: get('lp_guarantee3_desc', 'Ask about our rent guarantee scheme — we pay you whether or not the tenant does.'),
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[96px]">
      <LandlordsSEO />
      <Navbar />

      {/* Hero */}
      {heroVisible && (
        <div
          className="relative flex flex-col items-center justify-center overflow-hidden pt-16 pb-16"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '420px',
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: heroOverlayColor, opacity: heroOverlayOpacity }}
          />
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-roboto font-semibold tracking-widest uppercase mb-4" style={{ color: accentColor }}>{heroEyebrow}</p>
              <h1
                className="font-prata text-white mb-6 leading-tight"
                style={{
                  fontSize: heroTitleSize ? `clamp(28px, 5vw, ${heroTitleSize}px)` : 'clamp(28px, 5vw, 56px)',
                  color: heroTitleColor,
                  fontFamily: heroTitleFont ? `'${heroTitleFont}', serif` : undefined,
                }}
              >
                {heroTitle.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </h1>
              <p className="text-white/80 font-roboto text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                {heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <a
                  href={btn1Link}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 w-full text-white font-roboto text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                >
                  <i className="ri-home-heart-line" />
                  {btn1Label}
                </a>
                <a
                  href={btn2Link}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 w-full border border-white/50 text-white font-roboto text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-white/10 transition-colors"
                >
                  <i className="ri-bar-chart-2-line" />
                  {btn2Label}
                </a>
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin/management/landlords-page')}
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-stone-700 text-xs font-medium rounded-md hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-edit-line text-sm" />
              Edit Landlords Page
            </button>
          )}

          <div className="absolute bottom-8 right-10 hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }}>
              <i className="ri-award-line text-white" />
            </div>
            <div>
              <p className="text-white font-prata text-sm">#1 Letting Agency</p>
              <p className="text-white/60 font-roboto text-xs">Kampala, Uganda</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats strip */}
      {statsVisible && (
        <div style={{ backgroundColor: statsBg }}>
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-prata text-3xl" style={{ color: accentColor }}>{s.value}</p>
                <p className="text-white/60 font-roboto text-xs mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intro strip */}
      {introVisible && (
        <section className="py-16 px-6 border-b border-gray-100" style={{ backgroundColor: introBg }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={introImgPos === 'left' ? 'lg:order-2' : ''}>
              <p className="text-xs font-roboto font-semibold tracking-widest uppercase mb-3" style={{ color: accentColor }}>Our Commitment</p>
              <h2 className="text-3xl font-prata text-primary mb-5 leading-snug">{introTitle}</h2>
              <p className="text-text-gray font-roboto text-sm leading-relaxed mb-5">{introBody1}</p>
              <p className="text-text-gray font-roboto text-sm leading-relaxed">{introBody2}</p>
            </div>
            <div className={`relative ${introImgPos === 'left' ? 'lg:order-1' : ''}`}>
              <div className="w-full h-72 overflow-hidden shadow-lg">
                <img src={introImage} alt="Oceans Uganda agent consulting a landlord client" className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute -bottom-5 -left-5 px-6 py-4 hidden md:block shadow-lg" style={{ backgroundColor: accentColor }}>
                <p className="text-white font-prata text-xl">{badgeValue}</p>
                <p className="text-white/80 font-roboto text-xs">{badgeLabel}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services, Process, FAQ */}
      <LandlordServices />
      <LandlordSocialProof />

      {/* Guarantee strip */}
      {guaranteeVisible && (
        <section className="py-16 px-6" style={{ backgroundColor: guaranteeBg }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {GUARANTEES.map((g) => (
              <div key={g.title} className="flex flex-col items-center">
                <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-full mb-4">
                  <i className={`${g.icon} text-2xl`} style={{ color: accentColor }} />
                </div>
                <h3 className="text-white font-prata text-lg mb-2">{g.title}</h3>
                <p className="text-white/60 font-roboto text-sm leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Enquiry Form */}
      <LandlordEnquiryForm />

      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
