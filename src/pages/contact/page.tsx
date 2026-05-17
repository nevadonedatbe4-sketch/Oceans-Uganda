import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import ContactForm from '@/pages/contact/components/ContactForm';
import ContactSidebar from '@/pages/contact/components/ContactSidebar';
import { Link, useNavigate } from 'react-router-dom';
import { ContactSEO } from '@/components/feature/PageSEO';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_CONTACT_HERO = 'https://readdy.ai/api/search-image?query=modern%20professional%20real%20estate%20office%20interior%20Kampala%20Uganda%20elegant%20reception%20desk%20wooden%20warm%20tones%20lush%20green%20plants%20premium%20corporate%20design%20high%20ceilings%20natural%20light%20luxury%20workspace&width=1920&height=650&seq=contact-hero1&orientation=landscape';

export default function ContactPage() {
  const { get } = useSiteSettings();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'editor';

  // Hero settings
  const heroVisible = get('cp_hero_visible', 'true') !== 'false';
  const heroImage = get('cp_hero_image', '') || get('contact_hero_image', '') || DEFAULT_CONTACT_HERO;
  const heroHeight = parseInt(get('cp_hero_height', '650'));
  const heroOverlayColor = get('cp_hero_overlay_color', '#000000');
  const heroOverlayOpacity = parseInt(get('cp_hero_overlay_opacity', '65')) / 100;
  const heroEyebrow = get('cp_hero_eyebrow', "We're Here to Help");
  const heroTitle = get('cp_hero_title', 'Get In Touch');
  const heroSubtitle = get('cp_hero_subtitle', "Whether you're buying, selling, renting, or just have a question — our team is ready and happy to help.");

  // Form section
  const showForm = get('cp_show_form', 'true') !== 'false';
  const formEyebrow = get('cp_form_eyebrow', 'Send a Message');
  const formTitle = get('cp_form_title', 'How Can We Help You?');
  const formIntro = get('cp_form_intro', 'Fill in the form below and one of our agents will be in touch within 24 hours. For urgent matters, call us directly.');
  const formSectionBg = get('cp_form_section_bg', '#ffffff');
  const formLayout = get('cp_form_layout', 'sidebar');

  // Sidebar
  const showSidebar = get('cp_show_sidebar', 'true') !== 'false';
  const detailsEyebrow = get('cp_details_eyebrow', 'Our Details');
  const detailsTitle = get('cp_details_title', 'Visit or Call Us');

  // Map
  const mapHeight = parseInt(get('cp_map_height', '520'));

  // Office strip
  const showOfficeStrip = get('cp_show_office_strip', 'true') !== 'false';
  const officeEyebrow = get('cp_office_eyebrow', 'Our Location');
  const officeTitle = get('cp_office_title', 'Find Our Office');
  const gettingHere = get('cp_getting_here', 'We are located off Luthuli Avenue in Bugolobi. Ample parking is available on-site. 10 minutes from Kampala City Centre.');
  const bookMeeting = get('cp_book_meeting', 'Prefer a face-to-face consultation? Call ahead to book a time with one of our property specialists.');
  const officeStripBg = get('cp_office_strip_bg', '#ffffff');

  // Quick links strip
  const showQuickLinks = get('cp_show_quick_links', 'true') !== 'false';
  const quickLinksBg = get('cp_quick_links_bg', '#001731');
  const accentColor = get('cp_accent_color', '#C9A84C');

  const QUICK_LINKS = [1, 2, 3, 4].map((n) => ({
    icon: ['ri-building-2-line', 'ri-key-2-line', 'ri-home-heart-line', 'ri-bar-chart-2-line'][n - 1],
    label: get(`cp_ql${n}_label`, ['Browse Properties For Sale', 'Properties To Rent', 'Landlord Services', 'Free Valuation'][n - 1]),
    href: get(`cp_ql${n}_link`, ['/buy', '/rent', '/landlords', '/valuation'][n - 1]),
  }));

  const phone = get('phone', '+256(0)758671270');

  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[96px]">
      <ContactSEO />
      <Navbar />

      {/* Hero */}
      {heroVisible && (
        <div
          className="relative flex flex-col items-center justify-center text-center overflow-hidden pt-10 pb-10 md:pt-14 md:pb-14"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '320px',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: heroOverlayColor, opacity: heroOverlayOpacity }} />

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin/management/contact-page')}
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-stone-700 text-xs font-medium rounded-md hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-edit-line text-sm" />
              Edit Contact Page
            </button>
          )}

          <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
            <p className="text-sm md:text-base font-roboto font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: accentColor }}>{heroEyebrow}</p>
            <h1 className="text-3xl md:text-5xl font-prata text-white mb-3 leading-tight">{heroTitle}</h1>
            <p className="text-white/75 font-roboto text-sm leading-relaxed max-w-md mx-auto">{heroSubtitle}</p>
          </div>

          <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 text-white/50 font-roboto text-[11px]">
            <Link to="/" className="hover:text-white transition-colors cursor-pointer">Home</Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-white/80">Contact</span>
          </div>
        </div>
      )}

      {/* Quick link cards */}
      {showQuickLinks && (
        <div style={{ backgroundColor: quickLinksBg }}>
          <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_LINKS.map((ql) => (
              <Link
                key={ql.label}
                to={ql.href}
                className="flex items-center gap-2 bg-white/8 border border-white/10 px-3 py-2.5 hover:bg-white/15 hover:shadow-md transition-all cursor-pointer group rounded-sm"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 flex-shrink-0">
                  <i className={`${ql.icon} text-xs`} style={{ color: accentColor }} />
                </div>
                <span className="text-white/80 font-roboto text-[11px] leading-tight group-hover:text-white transition-colors">{ql.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main: Form + Sidebar + Map */}
      {(showForm || showSidebar) && (
        <section className="relative max-w-6xl mx-auto px-6 py-10 md:py-14" style={{ backgroundColor: formSectionBg }}>
          {isAdmin && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/admin/management/contact-page')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B4332] text-white text-xs font-medium rounded-md hover:bg-[#163828] transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-edit-2-line text-sm" />
                Edit Contact Info &amp; Form
              </button>
            </div>
          )}

          {formLayout === 'full' ? (
            <div className="max-w-3xl mx-auto">
              {showForm && (
                <div>
                  <div className="mb-5">
                    <p className="text-sm md:text-base font-roboto tracking-[0.2em] uppercase mb-2" style={{ color: accentColor }}>{formEyebrow}</p>
                    <h2 className="text-2xl font-prata text-primary mb-2">{formTitle}</h2>
                    <p className="text-text-gray font-roboto text-sm leading-relaxed">{formIntro}</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-6 md:p-10" style={{ boxShadow: '0 4px 24px rgba(0,23,49,0.10)' }}>
                    <ContactForm />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {showForm && (
                <div className="lg:col-span-8 flex flex-col h-full pb-6 md:pb-8">
                  <div className="mb-5">
                    <p className="text-sm md:text-base font-roboto font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: accentColor }}>{formEyebrow}</p>
                    <h2 className="text-2xl font-prata text-primary mb-2">{formTitle}</h2>
                    <p className="text-text-gray font-roboto text-sm leading-relaxed">{formIntro}</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-6 md:p-10" style={{ boxShadow: '0 4px 24px rgba(0,23,49,0.10)' }}>
                    <ContactForm />
                  </div>

                  <div className="flex-1 min-h-4" />

                  {/* Map at bottom left */}
                  <div className="border border-gray-300 overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,23,49,0.10)' }}>
                    {/* Dark navy header bar */}
                    <div className="bg-[#0D1B2A] px-4 py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-full shrink-0">
                          <i className="ri-map-pin-2-fill text-xs" style={{ color: accentColor }} />
                        </div>
                        <p className="text-white font-roboto text-xs font-bold truncate">
                          {get('office_address', 'plot 1 Hill Lane, kololo, Kampala, Uganda')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${phone.replace(/\s/g, '')}`}
                          className="hidden sm:flex items-center gap-1 text-white font-roboto text-xs hover:text-white/80 transition-colors cursor-pointer"
                        >
                          <i className="ri-phone-line text-xs" />
                          {get('phone', '+256(0)778694068')}
                        </a>
                        <a
                          href={get('google_maps_directions', `https://www.google.com/maps/dir//${encodeURIComponent(get('office_address', 'plot 1 Hill Lane, kololo, Kampala, Uganda'))}`)}
                          target="_blank"
                          rel="nofollow noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-roboto font-medium text-[#0D1B2A] hover:brightness-110 transition cursor-pointer whitespace-nowrap"
                          style={{ backgroundColor: accentColor }}
                        >
                          <i className="ri-navigation-fill text-xs" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <iframe
                        title="Oceans Uganda Office Location"
                        src={get('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.745!2d32.5833!3d0.3333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb8b3b3b3b3b%3A0x0!2sKololo%2C+Kampala%2C+Uganda!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug')}
                        width="100%"
                        height={mapHeight}
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>
              )}

              {showSidebar && (
                <div className="lg:col-span-4 relative pb-6 md:pb-8">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => navigate('/admin/management/contact-page')}
                      className="absolute -top-3 right-0 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-md hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-phone-line text-xs" />
                      Edit Details
                    </button>
                  )}
                  <div className="bg-white border border-gray-200/80 rounded-xl p-7 space-y-8 shadow-sm lg:sticky lg:top-24 lg:self-start">
                    <div>
                      <p className="text-sm md:text-base font-roboto font-semibold tracking-widest uppercase mb-2" style={{ color: accentColor }}>{detailsEyebrow}</p>
                      <h2 className="text-2xl font-prata text-primary">{detailsTitle}</h2>
                    </div>
                    <ContactSidebar />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Office strip */}
      {showOfficeStrip && (
        <section className="py-10 md:py-12 px-6 md:px-12 border-t border-gray-100" style={{ backgroundColor: officeStripBg }}>
          <div className="w-full">
            <div className="text-center mb-8">
              <p className="text-sm md:text-base font-roboto font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: accentColor }}>{officeEyebrow}</p>
              <h2 className="text-2xl font-prata text-primary">{officeTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
              <div className="text-center flex flex-col items-center">
                <div className="w-11 h-11 flex items-center justify-center bg-primary/5 rounded-full mx-auto mb-3">
                  <i className="ri-map-pin-2-line text-primary text-lg" />
                </div>
                <h3 className="text-primary font-prata text-sm mb-1">Our Address</h3>
                <p className="text-text-gray font-roboto text-xs leading-relaxed">
                  {get('office_address', '785 Luthuli Avenue, Bugolobi, Kampala, Uganda').split(',').map((part, i, arr) => (
                    <span key={i}>{part.trim()}{i < arr.length - 1 && <br />}</span>
                  ))}
                </p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="w-11 h-11 flex items-center justify-center bg-primary/5 rounded-full mx-auto mb-3">
                  <i className="ri-car-line text-primary text-lg" />
                </div>
                <h3 className="text-primary font-prata text-sm mb-1">Getting Here</h3>
                <p className="text-text-gray font-roboto text-xs leading-relaxed max-w-sm mx-auto">{gettingHere}</p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="w-11 h-11 flex items-center justify-center bg-primary/5 rounded-full mx-auto mb-3">
                  <i className="ri-calendar-line text-primary text-lg" />
                </div>
                <h3 className="text-primary font-prata text-sm mb-1">Book a Meeting</h3>
                <p className="text-text-gray font-roboto text-xs leading-relaxed mb-3 max-w-sm mx-auto">{bookMeeting}</p>
                <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 font-roboto text-xs hover:underline cursor-pointer mt-auto" style={{ color: accentColor }}>
                  <i className="ri-phone-line" />
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
