import { useState, FormEvent } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const ENQUIRY_TYPES = [
  { value: 'buy', label: 'Buying a Property' },
  { value: 'rent', label: 'Renting a Property' },
  { value: 'sell', label: 'Selling a Property' },
  { value: 'let', label: 'Letting / Landlord Services' },
  { value: 'valuation', label: 'Property Valuation' },
  { value: 'general', label: 'General Enquiry' },
];

const DEFAULT_SIDEBAR_IMG =
  'https://readdy.ai/api/search-image?query=professional%20real%20estate%20agent%20smiling%20friendly%20Kampala%20Uganda%20portrait%20business%20attire%20modern%20office%20background%20confident%20warm%20approachable%20person&width=480&height=640&seq=inner-contact-agent&orientation=portrait';

export default function InnerContactSection() {
  const { get } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const phone = get('phone', '+256 (0) 741 573131');
  const whatsapp = get('whatsapp', '+256741573131');
  const email = get('email', 'info@oceans.co.ug');
  const address = get('office_address', '785 Luthuli Avenue, Bugolobi, Kampala');
  const companyName = get('company_name', 'Oceans');
  const whatsappDirect =
    get('whatsapp_direct_url') || `https://wa.me/${(whatsapp || phone).replace(/\D/g, '')}`;
  const sidebarImage = get('cp_sidebar_image', '') || DEFAULT_SIDEBAR_IMG;

  // Split address for the "Location | City" display
  const addressParts = address.split(',');
  const locationLabel =
    addressParts.length >= 2
      ? `${addressParts[addressParts.length - 2].trim()} | ${addressParts[addressParts.length - 1].trim()}`
      : address;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') data.append(key, value);
    });
    try {
      await fetch('https://readdy.ai/api/form/d7i61unhkiob2r09it70', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      setSubmitted(true);
      form.reset();
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-14 sm:py-20 px-3 md:px-6 lg:px-10"
      style={{ backgroundColor: 'rgb(242,242,240)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 items-start">

          {/* ── LEFT: Agent / Company card ── */}
          <div
            className="md:col-span-1 pb-6 md:pb-8"
            style={{ backgroundColor: 'rgb(242,242,240)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            {/* Portrait photo */}
            <div className="w-full overflow-hidden mb-5" style={{ aspectRatio: '4/5' }}>
              <img
                src={sidebarImage}
                alt={companyName}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Name */}
            <h3 className="font-prata text-primary text-2xl leading-snug mb-0.5">
              {companyName}
            </h3>

            {/* Role */}
            <p
              className="font-roboto text-[10px] font-semibold uppercase tracking-[0.28em] mb-5"
              style={{ color: '#C9A84C' }}
            >
              Estate &amp; Letting Agents
            </p>

            {/* Location + Address */}
            <div className="mb-4">
              <p className="font-roboto text-sm font-bold text-primary mb-0.5">
                {locationLabel}
              </p>
              <p className="font-roboto text-sm text-stone-500 leading-relaxed">
                {address}
              </p>
            </div>

            {/* WhatsApp */}
            {(whatsapp || phone) && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-whatsapp-line text-base" style={{ color: '#C9A84C' }} />
                </div>
                <a
                  href={whatsappDirect}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="font-roboto text-sm text-stone-600 hover:text-primary transition-colors cursor-pointer"
                >
                  {whatsapp || phone}
                </a>
              </div>
            )}

            {/* Email */}
            {email && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-mail-line text-base" style={{ color: '#C9A84C' }} />
                </div>
                <a
                  href={`mailto:${email}`}
                  className="font-roboto text-sm text-stone-600 hover:text-primary transition-colors cursor-pointer"
                >
                  {email}
                </a>
              </div>
            )}
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="md:col-span-2 pb-6 md:pb-8">
            {/* Heading */}
            <div className="mb-6">
              <h2 className="font-prata text-primary mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                Contact Us
              </h2>
              <p
                className="font-roboto font-semibold uppercase whitespace-nowrap"
                style={{ color: '#C9A84C', fontSize: 'clamp(0.75rem, 1.6vw, 1.125rem)', letterSpacing: 'clamp(0.03em, 0.2vw, 0.3em)' }}
              >
                Buying, Renting or Leasing Prime Residential?
              </p>
            </div>

            {/* Form card */}
            <div
              className="bg-white p-6 sm:p-8 md:p-10 w-full"
              style={{ boxShadow: '0 8px 48px rgba(0,23,49,0.13)', borderRadius: '2px' }}
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full mb-5"
                    style={{ backgroundColor: 'rgba(201,168,76,0.12)' }}>
                    <i className="ri-check-double-line text-3xl" style={{ color: '#C9A84C' }} />
                  </div>
                  <h3 className="text-primary font-prata text-xl mb-2">Message Sent!</h3>
                  <p className="text-stone-500 font-roboto text-sm max-w-xs leading-relaxed">
                    Thank you for reaching out. A member of our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm font-roboto underline cursor-pointer"
                    style={{ color: '#C9A84C' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form data-readdy-form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1: First + Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-roboto font-semibold text-primary mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        required
                        placeholder="Enter your name"
                        className="w-full px-4 py-2.5 border border-stone-200 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                        style={{ borderRadius: '1px' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-roboto font-semibold text-primary mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        required
                        placeholder="Enter your last name"
                        className="w-full px-4 py-2.5 border border-stone-200 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                        style={{ borderRadius: '1px' }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-roboto font-semibold text-primary mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Enter your email"
                        className="w-full px-4 py-2.5 border border-stone-200 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                        style={{ borderRadius: '1px' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-roboto font-semibold text-primary mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone"
                        className="w-full px-4 py-2.5 border border-stone-200 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                        style={{ borderRadius: '1px' }}
                      />
                    </div>
                  </div>

                  {/* Enquiry type */}
                  <div>
                    <label className="block text-sm font-roboto font-semibold text-primary mb-1.5">
                      Enquiry Type
                    </label>
                    <select
                      name="enquiry_type"
                      className="w-full px-4 py-2.5 border border-stone-200 text-sm font-roboto text-primary focus:outline-none focus:border-stone-400 cursor-pointer"
                      style={{ borderRadius: '1px' }}
                    >
                      {ENQUIRY_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-roboto font-semibold text-primary mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      maxLength={500}
                      placeholder="Message"
                      className="w-full px-4 py-2.5 border border-stone-200 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none"
                      style={{ borderRadius: '1px' }}
                    />
                  </div>

                  {/* Submit — gold Houzez style */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-primary hover:bg-golden text-white font-roboto text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ borderRadius: '1px' }}
                  >
                    {submitting ? (
                      <><i className="ri-loader-4-line animate-spin" /> Sending…</>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
