import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import HeroSearchBar from './HeroSearchBar';
import SocialIcons from '@/components/feature/SocialIcons';

const DEFAULT_BG =
  'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/c87bb61c-c786-4ffd-86e9-7a2f02b6db8a_kla-oceans.jpg?v=986cb4b80dda40b17ef86d6852562384';

const DEFAULT_LOGO =
  'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png?v=baab6056156e05218f44fc6ee7472eef';

function getBtnClasses(style: string): string {
  switch (style) {
    case 'solid-white':
      return 'bg-white text-[#001731] border-2 border-white hover:bg-golden hover:text-white hover:border-golden shadow-sm';
    case 'solid-gold':
      return 'bg-golden text-white border-2 border-golden hover:bg-golden/90 shadow-sm';
    case 'solid-primary':
      return 'bg-primary text-white border-2 border-primary hover:bg-golden hover:border-golden shadow-sm';
    case 'outline-gold':
      return 'bg-transparent text-golden border-2 border-golden hover:bg-golden hover:text-white';
    case 'outline-white':
    default:
      return 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/80 hover:bg-golden hover:border-golden hover:text-white';
  }
}

function getBtnPadding(size: string): string {
  switch (size) {
    case 'sm': return 'py-2 px-4';
    case 'lg': return 'py-4 px-8';
    case 'xl': return 'py-5 px-10';
    case 'md':
    default: return 'py-3.5 px-6';
  }
}

function getBtnRadius(radius: string): string {
  switch (radius) {
    case 'sm': return 'rounded-sm';
    case 'md': return 'rounded-md';
    case 'lg': return 'rounded-lg';
    case 'full': return 'rounded-full';
    case 'none':
    default: return 'rounded-none';
  }
}

export default function HeroSection() {
  const { get } = useSiteSettings();
  const { profile } = useAuth();

  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'editor';

  // Visibility
  const visible = get('hero_visible', 'true') === 'true';
  const showSearch = get('hero_show_search', 'false') === 'true';
  const showLogo = get('hero_show_logo', 'true') === 'true';
  const showSocials = get('hero_show_socials', 'true') === 'true';

  // Background
  const bgImage = get('hero_bg_image', '') || DEFAULT_BG;
  const overlayOpacity = parseInt(get('hero_overlay_opacity', '55'), 10);
  const overlayColor = get('hero_overlay_color', '#000000');

  // Layout
  const heightDesktop = get('hero_height_desktop', '100vh');
  const heightMobile = get('hero_height_mobile', '100vh');
  const alignment = get('hero_alignment', 'center') as 'left' | 'center' | 'right';
  const paddingY = parseInt(get('hero_padding_y', '96'), 10);

  // Text content
  const title = get('hero_title', '');
  const subtitle = get('hero_subtitle', '');
  const bodyText = get('hero_body_text', '');
  const titleColor = get('hero_title_color', '#ffffff');
  const subtitleColor = get('hero_subtitle_color', '#ffffff');
  const bodyColor = get('hero_body_color', '#ffffff');

  // Title typography
  const titleFontFamily = get('hero_title_font_family', "'Prata', serif");
  const titleFontWeight = get('hero_title_font_weight', '400');
  const titleFontSize = parseInt(get('hero_title_font_size', '42'), 10);
  const titleLetterSpacing = parseFloat(get('hero_title_letter_spacing', '0'));
  const titleTextTransform = get('hero_title_text_transform', 'none') as React.CSSProperties['textTransform'];
  const titleLineHeight = parseFloat(get('hero_title_line_height', '1.2'));

  // Subtitle typography
  const subtitleFontFamily = get('hero_subtitle_font_family', "'Roboto', sans-serif");
  const subtitleFontWeight = get('hero_subtitle_font_weight', '500');
  const subtitleFontSize = parseInt(get('hero_subtitle_font_size', '13'), 10);
  const subtitleLetterSpacing = parseFloat(get('hero_subtitle_letter_spacing', '6.3'));
  const subtitleTextTransform = get('hero_subtitle_text_transform', 'uppercase') as React.CSSProperties['textTransform'];

  // Body typography
  const bodyFontFamily = get('hero_body_font_family', 'inherit');
  const bodyFontWeight = get('hero_body_font_weight', '400');
  const bodyFontSize = parseInt(get('hero_body_font_size', '14'), 10);
  const bodyLineHeight = parseFloat(get('hero_body_line_height', '1.7'));

  // Buttons
  const btn1Visible = get('hero_btn1_visible', 'true') === 'true';
  const btn1Label = get('hero_btn1_label', 'RENT');
  const btn1Link = get('hero_btn1_link', '/rent');
  const btn1Style = get('hero_btn1_style', 'outline-white');

  const btn2Visible = get('hero_btn2_visible', 'true') === 'true';
  const btn2Label = get('hero_btn2_label', 'BUY');
  const btn2Link = get('hero_btn2_link', '/buy');
  const btn2Style = get('hero_btn2_style', 'outline-white');

  const btn3Visible = get('hero_btn3_visible', 'true') === 'true';
  const btn3Label = get('hero_btn3_label', 'EVALUATION');
  const btn3Link = get('hero_btn3_link', '/valuation');
  const btn3Style = get('hero_btn3_style', 'outline-white');

  // Button appearance
  const btnSize = get('hero_btn_size', 'md');
  const btnRadius = get('hero_btn_radius', 'none');
  const btnFontFamily = get('hero_btn_font_family', "'Roboto', sans-serif");
  const btnFontWeight = get('hero_btn_font_weight', '500');
  const btnFontSize = parseInt(get('hero_btn_font_size', '13'), 10);
  const btnLetterSpacing = parseFloat(get('hero_btn_letter_spacing', '6.3'));
  const btnTextTransform = get('hero_btn_text_transform', 'uppercase') as React.CSSProperties['textTransform'];

  // Logo
  const logoSrc = get('logo_main', '') || DEFAULT_LOGO;

  const alignClass =
    alignment === 'left'
      ? 'items-start text-left'
      : alignment === 'right'
      ? 'items-end text-right'
      : 'items-center text-center';

  const btnStyle: React.CSSProperties = {
    fontFamily: btnFontFamily,
    fontWeight: btnFontWeight,
    textTransform: btnTextTransform,
    letterSpacing: `${btnLetterSpacing}px`,
    fontSize: `${btnFontSize}px`,
  };

  const titleStyle: React.CSSProperties = {
    color: titleColor,
    fontFamily: titleFontFamily,
    fontWeight: titleFontWeight,
    fontSize: `clamp(${Math.round(titleFontSize * 0.65)}px, ${titleFontSize * 0.04}vw + 1rem, ${titleFontSize}px)`,
    letterSpacing: `${titleLetterSpacing}px`,
    textTransform: titleTextTransform,
    lineHeight: titleLineHeight,
  };

  const subtitleStyle: React.CSSProperties = {
    color: subtitleColor,
    fontFamily: subtitleFontFamily,
    fontWeight: subtitleFontWeight,
    fontSize: `${subtitleFontSize}px`,
    letterSpacing: `${subtitleLetterSpacing}px`,
    textTransform: subtitleTextTransform,
  };

  const bodyStyle: React.CSSProperties = {
    color: bodyColor,
    fontFamily: bodyFontFamily,
    fontWeight: bodyFontWeight,
    fontSize: `${bodyFontSize}px`,
    lineHeight: bodyLineHeight,
  };

  const btnPaddingClass = getBtnPadding(btnSize);
  const btnRadiusClass = getBtnRadius(btnRadius);

  if (!visible) return null;

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: heightMobile,
      }}
    >
      {/* Responsive height override for desktop */}
      <style>{`
        @media (min-width: 768px) {
          .hero-section-inner { min-height: ${heightDesktop}; }
        }
      `}</style>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity / 100,
        }}
      />

      {/* Admin Edit Shortcut */}
      {isAdmin && (
        <Link
          to="/admin/management/hero"
          className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white transition-all duration-200 whitespace-nowrap cursor-pointer border border-stone-200"
        >
          <i className="ri-edit-2-line text-sm" />
          Edit Hero Content
        </Link>
      )}

      {/* Content */}
      <div
        className={`hero-section-inner relative z-10 w-full max-w-2xl md:max-w-5xl lg:max-w-6xl mx-auto flex flex-col ${alignClass} px-6 items-center justify-center`}
        style={{ paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}
      >
        {/* Logo */}
        {showLogo && (
          <img
            src={logoSrc}
            alt="Logo"
            className="mx-auto mb-4 sm:mb-6 max-w-[280px] sm:max-w-[320px] md:max-w-[400px] w-full h-auto brightness-0 invert"
          />
        )}

        {/* Title */}
        {title && (
          <h1
            className="mb-3 leading-snug"
            style={titleStyle}
          >
            {title}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p
            className="mb-4 font-roboto text-xs md:text-sm font-semibold uppercase tracking-[0.35em] md:tracking-[0.4em] whitespace-nowrap"
            style={{ color: '#ffffff' }}
          >
            {subtitle}
          </p>
        )}

        {/* Body text */}
        {bodyText && (
          <p className="mb-6 max-w-lg" style={bodyStyle}>
            {bodyText}
          </p>
        )}

        {/* Social icons */}
        {showSocials && (
          <SocialIcons
            variant="plain"
            className="justify-center mb-8 sm:mb-12"
            iconClassName="text-white"
            gap="gap-4 sm:gap-6"
            size="md"
          />
        )}

        {/* Search bar */}
        {showSearch && (
          <div className="hidden sm:block w-full mb-10 sm:mb-12">
            <HeroSearchBar />
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          {(btn1Visible || btn2Visible) && (
            <div className="flex flex-row w-full gap-3">
              {btn1Visible && (
                <Link
                  to={btn1Link}
                  className={`flex-1 transition-all duration-300 text-center whitespace-nowrap cursor-pointer ${getBtnClasses(btn1Style)} ${btnPaddingClass} ${btnRadiusClass}`}
                  style={btnStyle}
                >
                  {btn1Label}
                </Link>
              )}
              {btn2Visible && (
                <Link
                  to={btn2Link}
                  className={`flex-1 transition-all duration-300 text-center whitespace-nowrap cursor-pointer ${getBtnClasses(btn2Style)} ${btnPaddingClass} ${btnRadiusClass}`}
                  style={btnStyle}
                >
                  {btn2Label}
                </Link>
              )}
            </div>
          )}
          {btn3Visible && (
            <Link
              to={btn3Link}
              className={`w-full text-center transition-all duration-300 whitespace-nowrap cursor-pointer ${getBtnClasses(btn3Style)} ${btnPaddingClass} ${btnRadiusClass}`}
              style={btnStyle}
            >
              {btn3Label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
