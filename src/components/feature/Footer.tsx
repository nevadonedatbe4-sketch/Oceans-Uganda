import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const importantLinks = [
  { label: 'Buy Property', href: '/buy' },
  { label: 'Rent Property', href: '/rent' },
  { label: 'Neighbourhoods', href: '/neighbourhoods' },
  { label: 'New Developments', href: '/new-developments' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'Blog & Guides', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

const SOCIAL_ICONS: { key: string; icon: string; label: string; fallback: string; color: string }[] = [
  { key: 'instagram_url', icon: 'ri-instagram-fill', label: 'Instagram', fallback: 'https://www.instagram.com/oceans_estateagents', color: 'bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]' },
  { key: 'linkedin_url', icon: 'ri-linkedin-fill', label: 'LinkedIn', fallback: 'https://www.linkedin.com/in/oceans-estate-agents-0312a2303/', color: 'bg-[#0A66C2]' },
  { key: 'facebook_url', icon: 'ri-facebook-fill', label: 'Facebook', fallback: 'https://www.facebook.com/profile.php?id=61553088554196', color: 'bg-[#1877F2]' },
  { key: 'twitter_url', icon: 'ri-twitter-x-fill', label: 'X / Twitter', fallback: '', color: 'bg-[#14171A]' },
  { key: 'youtube_url', icon: 'ri-youtube-fill', label: 'YouTube', fallback: 'https://www.youtube.com/channel/UCHGFBxPSNWi_o9tXRMOflPA', color: 'bg-[#FF0000]' },
  { key: 'whatsapp_direct_url', icon: 'ri-whatsapp-fill', label: 'WhatsApp', fallback: 'https://wa.link/ksz8s8', color: 'bg-[#25D366]' },
];

const FALLBACK_LOGO = 'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/ee86f326-2c48-4946-a85a-0b6bae37f11d_logo-21.png?v=6d142c0fdbabe750634bc9bfe54c6d82';
const FALLBACK_LOGO_WHITE = 'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/ef96fe92-ea39-4b3e-b1f3-ece8517d985a_logo-edit2.png?v=766c126943cc2a2a521d7ed560d9a2c1';

export default function Footer() {
  const { get } = useSiteSettings();

  const companyName = get('company_name', 'Oceans Uganda');
  const phone = get('phone', '+256(0)758671270');
  const email = get('email', 'info@oceans.co.ug');
  const address = get('footer_address') || get('office_address', '785 Luthuli Avenue, Bugolobi, Kampala, Uganda');
  const footerText = get('footer_text', `© ${new Date().getFullYear()} Oceans Uganda. All rights reserved.`);
  const logoSrc = get('logo_main') || FALLBACK_LOGO;
  const logoWhiteSrc = get('logo_white') || FALLBACK_LOGO_WHITE;
  const showSocialInFooter = get('social_show_footer', 'true') === 'true';

  const activeSocials = SOCIAL_ICONS.filter((s) => !!(get(s.key) || s.fallback));

  return (
    <footer className="bg-primary text-white">
      {/* Know your worth banner */}
      <div className="bg-[#002349] py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-prata text-white mb-3">
            Know Your Property&apos;s Worth?
          </h3>
          <p className="text-white/60 text-sm font-roboto mb-6">
            Get a free, no-obligation valuation from Kampala&apos;s leading estate agents.
          </p>
          <Link
            to="/landlords"
            className="inline-block bg-primary hover:bg-white hover:text-primary border border-white/20 text-white px-10 py-3 text-sm font-roboto tracking-wider uppercase transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Request Evaluation
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-14 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h4 className="text-white font-prata text-base mb-5">About Us</h4>
            <p className="text-white/60 text-sm font-roboto leading-relaxed">
              Welcome to {companyName}, your trusted partner in Kampala real estate excellence. With integrity, innovation, and client satisfaction at our core, we bring unmatched experience to Uganda&apos;s dynamic property market.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-prata text-base mb-5">Contact Us</h4>
            <div className="space-y-3">
              {address && (
                <div className="flex items-start gap-2 text-white/60 text-sm font-roboto">
                  <i className="ri-map-pin-line mt-0.5 text-golden" />
                  <span>{address}</span>
                </div>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-white/60 text-sm font-roboto hover:text-golden transition-colors cursor-pointer"
                >
                  <i className="ri-phone-line text-golden" />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-white/60 text-sm font-roboto hover:text-golden transition-colors cursor-pointer"
                >
                  <i className="ri-mail-line text-golden" />
                  {email}
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-prata text-base mb-5">Important Links</h4>
            <ul className="space-y-2">
              {importantLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-white/60 text-sm font-roboto hover:text-golden transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-golden" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-white font-prata text-base mb-5">
              Sign Up for Our Newsletter
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white border border-white/20 rounded-sm px-3 py-2 text-sm font-roboto text-primary placeholder:text-gray-400 focus:outline-none focus:border-golden"
              />
              <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-sm text-sm font-roboto font-medium transition-colors cursor-pointer whitespace-nowrap">
                Go
              </button>
            </div>
            <p className="text-white/50 text-xs font-roboto mt-3">
              {companyName} — Your Trusted Real Estate Agents in Kampala.
            </p>


          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <img
            src={logoWhiteSrc}
            alt={companyName}
            className="h-16 w-auto object-contain opacity-90"
          />
          <p className="text-white/40 text-xs font-roboto text-center">
            {footerText || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}
          </p>
          <Link
            to="/admin/login"
            className="text-white/15 hover:text-white/40 text-[10px] font-roboto transition-colors cursor-pointer tracking-widest"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
