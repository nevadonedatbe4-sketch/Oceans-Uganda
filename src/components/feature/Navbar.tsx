import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import CurrencySwitcher from '@/components/base/CurrencySwitcher';

const navLinks = [
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'Properties', href: '/all-properties' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'Neighbourhoods', href: '/neighbourhoods' },
  { label: 'New Developments', href: '/new-developments' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const FALLBACK_LOGO = 'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png?v=baab6056156e05218f44fc6ee7472eef';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { get } = useSiteSettings();

  const phone = get('phone', '+256(0)758671270');
  const email = get('email', 'info@oceans.co.ug');
  const logoSrc = get('logo_main') || FALLBACK_LOGO;
  const logoHeight = parseInt(get('logo_height_standard', '56'), 10);

  // Typography — nav settings
  const navFamily = get('typo_nav_family', 'Prata');
  const navSize = get('typo_nav_size', '14');
  const navWeight = get('typo_nav_weight', '400');
  const navLetterSpacing = get('typo_nav_letter_spacing', '0');
  const navTransform = get('typo_nav_transform', 'none') as 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  const navStyle: React.CSSProperties = {
    fontFamily: `${navFamily}, sans-serif`,
    fontSize: `${navSize}px`,
    fontWeight: navWeight,
    letterSpacing: navLetterSpacing !== '0' ? `${navLetterSpacing}em` : undefined,
    textTransform: navTransform !== 'none' ? navTransform : undefined,
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchorClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top contact bar */}
      <div className="hidden md:block bg-black border-b border-white/10">
        <div className="flex items-center justify-end px-6 md:px-10 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-1.5 text-white/75 hover:text-golden text-xs font-roboto transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-phone-line text-xs" />
                </span>
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 text-white/75 hover:text-golden text-xs font-roboto transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-mail-line text-xs" />
                </span>
                {email}
              </a>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <CurrencySwitcher variant="topbar" />
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className={`bg-primary transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-3">
          {/* Logo — click to go home */}
          <Link to="/" aria-label="Go to homepage" className="flex items-center gap-3 cursor-pointer flex-shrink-0 hover:opacity-90 transition-opacity">
            <img
              src={logoSrc}
              alt={get('site_name', 'Oceans Uganda')}
              style={{ height: `${logoHeight}px` }}
              className="w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.href ||
                (link.href !== '/' && location.pathname.startsWith(link.href));
              return link.href.startsWith('/#') ? (
                <button
                  key={link.label}
                  onClick={() => handleAnchorClick(link.href)}
                  className="px-4 py-2 transition-colors cursor-pointer whitespace-nowrap text-white/85 hover:text-golden"
                  style={navStyle}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-2 transition-colors cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-golden border-b-2 border-golden pb-1' : 'text-white/85 hover:text-golden'
                  }`}
                  style={navStyle}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile: currency + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <CurrencySwitcher variant="topbar" />
            <button
              className="flex items-center justify-center w-10 h-10 rounded-md cursor-pointer text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <i className={`text-2xl ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-primary border-t border-white/10 shadow-xl max-h-screen overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return link.href.startsWith('/#') ? (
                <button
                  key={link.label}
                  onClick={() => {
                    handleAnchorClick(link.href);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 text-white/85 hover:text-golden hover:bg-white/5 border-b border-white/5 cursor-pointer whitespace-nowrap transition-colors"
                  style={navStyle}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`flex items-center justify-between px-6 py-4 hover:bg-white/5 border-b border-white/5 cursor-pointer whitespace-nowrap transition-colors ${isActive ? 'text-golden' : 'text-white/85 hover:text-golden'}`}
                  style={navStyle}
                >
                  {link.label}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-golden flex-shrink-0" />}
                </Link>
              );
            })}
            {/* Contact info + Currency in mobile menu */}
            <div className="px-6 py-5 border-t border-white/10 flex flex-col gap-3 bg-black/20">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-white/70 font-roboto hover:text-golden transition-colors cursor-pointer">
                <i className="ri-phone-line text-golden text-base" />
                {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-white/70 font-roboto hover:text-golden transition-colors cursor-pointer">
                <i className="ri-mail-line text-golden text-base" />
                {email}
              </a>
              <div className="flex items-center gap-3 text-sm text-white/70 font-roboto pt-2 border-t border-white/10">
                <i className="ri-global-line text-golden text-base" />
                <CurrencySwitcher variant="light" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
