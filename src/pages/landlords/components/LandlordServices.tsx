import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function LandlordServices() {
  const { get } = useSiteSettings();

  const servicesVisible = get('lp_services_visible', 'true') !== 'false';
  const servicesTitle = get('lp_services_title', 'Our Landlord Services');
  const servicesSubtitle = get('lp_services_subtitle', 'Everything you need to let and manage your property with confidence.');
  const servicesBg = get('lp_services_bg', '#F5F7F7');
  const accentColor = get('lp_accent_color', '#C9A84C');
  const primaryColor = get('lp_primary_color', '#001731');
  const cardBg = get('lp_card_bg', '#ffffff');

  const SERVICES = [1, 2, 3, 4].map((n) => ({
    icon: get(`lp_service${n}_icon`, ['ri-user-search-line', 'ri-home-gear-line', 'ri-money-dollar-circle-line', 'ri-tools-line'][n - 1]),
    title: get(`lp_service${n}_title`, ['Tenant Finding', 'Full Management', 'Rent Collection', 'Property Maintenance'][n - 1]),
    desc: get(`lp_service${n}_desc`, [
      'We market your property across all major platforms and our own database of pre-qualified tenants.',
      'We handle everything — from tenant vetting to maintenance coordination and rent collection.',
      'Reliable monthly rent collection with detailed statements and direct bank transfers.',
      'Trusted contractor network for repairs, inspections, and property upkeep.',
    ][n - 1]),
  }));

  const processVisible = get('lp_process_visible', 'true') !== 'false';
  const processTitle = get('lp_process_title', 'How It Works');

  const PROCESS = [1, 2, 3, 4].map((n) => ({
    num: String(n).padStart(2, '0'),
    icon: ['ri-phone-line', 'ri-search-eye-line', 'ri-camera-line', 'ri-user-received-2-line'][n - 1],
    title: get(`lp_step${n}_title`, ['Free Valuation', 'Property Listing', 'Tenant Vetting', 'Move In'][n - 1]),
    desc: get(`lp_step${n}_desc`, [
      'We assess your property and provide a free, no-obligation rental valuation.',
      'Professional photography and listing across all major platforms within 48 hours.',
      'Thorough background checks, employment verification, and reference screening.',
      'Tenancy agreement, deposit collection, and smooth move-in coordination.',
    ][n - 1]),
  }));

  const benefitsVisible = get('lp_benefits_visible', 'true') !== 'false';
  const benefitsTitle = get('lp_benefits_title', 'Why Landlords Choose Us');

  const BENEFITS = [1, 2, 3].map((n) => ({
    icon: ['ri-bar-chart-2-line', 'ri-time-line', 'ri-eye-line'][n - 1],
    title: get(`lp_benefit${n}_title`, ['Maximum Returns', 'Minimum Voids', 'Full Transparency'][n - 1]),
    desc: get(`lp_benefit${n}_desc`, [
      'We price your property correctly from day one to maximise your rental income.',
      'Our proactive approach means your property is rarely empty between tenancies.',
      'Monthly statements, online portal access, and 24/7 communication with your dedicated manager.',
    ][n - 1]),
  }));

  const LET_ONLY = [
    'Professional property photography',
    'Listings on all major portals',
    'Tenant viewings & vetting',
    'Tenancy agreement preparation',
    'Deposit handling & registration',
    'Handover & key release',
  ];

  const FULL_MANAGEMENT = [
    'Everything in Let Only, plus:',
    'Monthly rent collection',
    'Detailed income statements',
    'Maintenance & repair coordination',
    'Periodic property inspections',
    'Tenant dispute resolution',
    'Annual compliance review',
    'Dedicated account manager',
  ];

  return (
    <>
      {/* Services Section */}
      {servicesVisible && (
        <section className="py-20 px-6" style={{ backgroundColor: servicesBg }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-roboto font-semibold tracking-widest uppercase mb-3" style={{ color: accentColor }}>Our Services</p>
              <h2 className="text-3xl md:text-4xl font-prata mb-4" style={{ color: primaryColor }}>{servicesTitle}</h2>
              <p className="text-text-gray font-roboto text-sm max-w-xl mx-auto leading-relaxed">{servicesSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map((item) => (
                <div
                  key={item.title}
                  className="group p-7 border border-gray-100 shadow-sm rounded-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: cardBg }}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full mb-5 transition-colors" style={{ backgroundColor: `${primaryColor}10` }}>
                    <i className={`${item.icon} text-xl`} style={{ color: primaryColor }} />
                  </div>
                  <h3 className="font-prata text-base mb-2" style={{ color: primaryColor }}>{item.title}</h3>
                  <p className="text-text-gray font-roboto text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Tiers */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-roboto font-semibold tracking-widest uppercase mb-3" style={{ color: accentColor }}>Service Options</p>
            <h2 className="text-3xl font-prata mb-4" style={{ color: primaryColor }}>Choose the Right Service for You</h2>
            <p className="text-text-gray font-roboto text-sm max-w-lg mx-auto leading-relaxed">
              Whether you want us to find the tenant and step back, or have us manage everything end-to-end, we have a package that fits.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 overflow-hidden shadow-sm rounded-sm hover:shadow-lg transition-all duration-300">
              <div className="px-8 py-7 border-b border-gray-100">
                <div className="w-10 h-10 flex items-center justify-center rounded-full mb-4" style={{ backgroundColor: `${primaryColor}10` }}>
                  <i className="ri-key-2-line text-lg" style={{ color: primaryColor }} />
                </div>
                <h3 className="font-prata text-2xl mb-1" style={{ color: primaryColor }}>Let Only</h3>
                <p className="text-text-gray font-roboto text-sm">Ideal for landlords who prefer hands-on management after tenant placement.</p>
              </div>
              <div className="px-8 py-7">
                <ul className="space-y-3">
                  {LET_ONLY.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-roboto text-text-gray">
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-check-line" style={{ color: accentColor }} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#landlord-form" className="mt-8 flex items-center justify-center gap-2 w-full py-3 border font-roboto text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:text-white transition-all" style={{ borderColor: primaryColor, color: primaryColor }}>
                  <i className="ri-arrow-right-line" />
                  Enquire About Let Only
                </a>
              </div>
            </div>

            <div className="overflow-hidden relative shadow-xl rounded-sm hover:shadow-2xl transition-all duration-300" style={{ backgroundColor: primaryColor }}>
              <div className="absolute top-5 right-5">
                <span className="text-white font-roboto text-xs px-3 py-1 uppercase tracking-widest whitespace-nowrap" style={{ backgroundColor: accentColor }}>Most Popular</span>
              </div>
              <div className="px-8 py-7 border-b border-white/10">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full mb-4">
                  <i className="ri-building-4-line text-lg" style={{ color: accentColor }} />
                </div>
                <h3 className="text-white font-prata text-2xl mb-1">Full Management</h3>
                <p className="text-white/60 font-roboto text-sm">Complete peace of mind — we handle everything from first listing to ongoing tenancy.</p>
              </div>
              <div className="px-8 py-7">
                <ul className="space-y-3">
                  {FULL_MANAGEMENT.map((item, i) => (
                    <li key={item} className={`flex items-start gap-3 text-sm font-roboto ${i === 0 ? 'font-medium' : 'text-white/75'}`} style={i === 0 ? { color: accentColor } : {}}>
                      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="ri-check-line" style={{ color: accentColor }} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#landlord-form" className="mt-8 flex items-center justify-center gap-2 w-full py-3 text-white font-roboto text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:opacity-90 transition-opacity" style={{ backgroundColor: accentColor }}>
                  <i className="ri-arrow-right-line" />
                  Enquire About Full Management
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      {processVisible && (
        <section className="py-20 px-6 bg-white border-t border-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-roboto font-semibold tracking-widest uppercase mb-3" style={{ color: accentColor }}>How It Works</p>
              <h2 className="text-3xl font-prata" style={{ color: primaryColor }}>{processTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PROCESS.map((item, idx) => (
                <div key={item.num} className="relative text-center p-4 rounded-sm hover:bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  {idx < PROCESS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gray-200" />
                  )}
                  <div className="relative inline-flex items-center justify-center mb-5">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full mx-auto" style={{ backgroundColor: primaryColor }}>
                      <i className={`${item.icon} text-white text-xl`} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full text-white font-roboto text-xs font-bold" style={{ backgroundColor: accentColor }}>
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-prata text-base mb-2" style={{ color: primaryColor }}>{item.title}</h3>
                  <p className="text-text-gray font-roboto text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Cards */}
      {benefitsVisible && (
        <section className="py-20 px-6" style={{ backgroundColor: servicesBg }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-roboto font-semibold tracking-widest uppercase mb-3" style={{ color: accentColor }}>Why Us</p>
              <h2 className="text-3xl font-prata" style={{ color: primaryColor }}>{benefitsTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BENEFITS.map((b) => (
                <div key={b.title} className="p-7 border border-gray-100 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: cardBg }}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full mb-5" style={{ backgroundColor: `${primaryColor}08` }}>
                    <i className={`${b.icon} text-xl`} style={{ color: accentColor }} />
                  </div>
                  <h3 className="font-prata text-base mb-2" style={{ color: primaryColor }}>{b.title}</h3>
                  <p className="text-text-gray font-roboto text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
