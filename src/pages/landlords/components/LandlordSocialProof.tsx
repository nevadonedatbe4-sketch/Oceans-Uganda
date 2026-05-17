import { useState } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function LandlordSocialProof() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { get } = useSiteSettings();

  const faqVisible = get('lp_faq_visible', 'true') !== 'false';
  const faqTitle = get('lp_faq_title', 'Frequently Asked Questions');
  const accentColor = get('lp_accent_color', '#C9A84C');
  const primaryColor = get('lp_primary_color', '#001731');
  const faqBg = get('lp_faq_bg', '#ffffff');

  const FAQS = [1, 2, 3, 4, 5].map((n) => ({
    q: get(`lp_faq${n}_q`, [
      'How much does it cost to let my property?',
      'How long does it take to find a tenant?',
      'Do you handle maintenance and repairs?',
      "What happens if a tenant doesn't pay rent?",
      'Can I use your tenant-finding service only?',
    ][n - 1]),
    a: get(`lp_faq${n}_a`, [
      'Our fees depend on the service level you choose. Contact us for a personalised quote.',
      'On average, we find a qualified tenant within 14 days of listing.',
      'Yes — our full management service includes coordinating all maintenance and repairs.',
      'We have robust rent collection procedures and can pursue arrears on your behalf.',
      'Yes, we offer a tenant-finding only service for landlords who prefer to self-manage.',
    ][n - 1]),
  }));

  if (!faqVisible) return null;

  return (
    <section className="py-20 px-6" style={{ backgroundColor: faqBg }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-roboto font-semibold tracking-widest uppercase mb-3" style={{ color: accentColor }}>Common Questions</p>
          <h2 className="text-3xl font-prata" style={{ color: primaryColor }}>{faqTitle}</h2>
        </div>
        <div className="space-y-3">
          {FAQS.filter((f) => f.q.trim()).map((faq, idx) => (
            <div key={idx} className="border border-gray-100 overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-all duration-300">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group hover:bg-gray-50/80 transition-colors"
              >
                <span className="font-prata text-sm pr-4" style={{ color: primaryColor }}>{faq.q}</span>
                <span className="w-7 h-7 flex items-center justify-center flex-shrink-0 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <i className={`text-sm transition-transform duration-300 ${openFaq === idx ? 'ri-subtract-line' : 'ri-add-line'}`} style={{ color: primaryColor }} />
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5">
                  <p className="text-text-gray font-roboto text-sm leading-relaxed border-t border-gray-50 pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
