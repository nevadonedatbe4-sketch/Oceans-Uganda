import { useSiteSettings } from '@/contexts/SiteSettingsContext';

/**
 * GlobalContactStrip — reusable contact bar shown at the bottom of all public pages
 * (except the Contact page itself).
 * Mobile: centered layout. Desktop: horizontal row.
 */
export default function GlobalContactStrip() {
  const { get } = useSiteSettings();

  const phone = get('phone', '+256 (0) 758 671270');
  const email = get('email', 'info@oceans.co.ug');
  const whatsapp = get('whatsapp', '+256741573131');
  const companyName = get('company_name', 'Oceans Uganda');

  const whatsappNumber = (whatsapp || phone).replace(/\D/g, '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(companyName)}%2C%20I%27d%20like%20to%20enquire%20about%20a%20property.`;

  return null;

  return (
    <section className="bg-[#f5f3ef] border-t border-stone-200 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Left: heading */}
        <div className="flex flex-col items-center md:items-start">
          <p className="text-[10px] font-roboto font-bold uppercase tracking-[0.25em] text-golden mb-1">
            Get In Touch
          </p>
          <h3 className="font-prata text-primary text-xl md:text-2xl leading-snug">
            Ready to Find Your Perfect Property?
          </h3>
          <p className="text-stone-500 font-roboto text-sm mt-1 max-w-xs">
            Our team is available 7 days a week to help you buy, rent, or sell.
          </p>
        </div>

        {/* Right: contact details + buttons */}
        <div className="flex flex-col items-center md:items-end gap-4">
          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-roboto text-stone-600">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-phone-line text-golden text-base" />
                </span>
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-mail-line text-golden text-base" />
                </span>
                {email}
              </a>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-end">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary text-primary font-roboto text-xs tracking-widest uppercase rounded-sm hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-phone-line text-sm" />
                </span>
                Call Us
              </a>
            )}
            {whatsappNumber && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="nofollow noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white font-roboto text-xs tracking-widest uppercase rounded-sm hover:bg-[#1ebe5d] transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-whatsapp-line text-sm" />
                </span>
                WhatsApp
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-roboto text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-mail-send-line text-sm" />
                </span>
                Email Us
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
