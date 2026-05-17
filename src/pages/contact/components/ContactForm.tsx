import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const ENQUIRY_TYPES = [
  { value: 'buy', label: 'Buying a Property' },
  { value: 'rent', label: 'Renting a Property' },
  { value: 'sell', label: 'Selling a Property' },
  { value: 'let', label: 'Letting / Landlord Services' },
  { value: 'valuation', label: 'Property Valuation' },
  { value: 'general', label: 'General Enquiry' },
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const { get } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });
    try {
      await fetch('https://readdy.ai/api/form/d76ogjsbmgf2o8mm7c90', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      form.reset();
      const redirectUrl = get('form_redirect_contact', '/');
      navigate(redirectUrl);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 flex items-center justify-center bg-golden/10 rounded-full mb-6">
          <i className="ri-check-double-line text-golden text-4xl" />
        </div>
        <h3 className="text-primary font-prata text-2xl mb-3">Message Sent!</h3>
        <p className="text-text-gray font-roboto text-sm leading-relaxed max-w-xs mx-auto">
          Thank you for reaching out. A member of our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-7 inline-flex items-center gap-2 text-golden font-roboto text-sm underline cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} data-readdy-form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-primary font-roboto text-sm font-semibold mb-1">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            name="full_name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full border border-stone-200 px-3.5 py-2 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
            style={{ borderRadius: '1px' }}
          />
        </div>
        <div>
          <label className="block text-primary font-roboto text-sm font-semibold mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="w-full border border-stone-200 px-3.5 py-2 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
            style={{ borderRadius: '1px' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-primary font-roboto text-sm font-semibold mb-1">Phone Number</label>
          <input
            name="phone"
            type="tel"
            placeholder="+256 700 000 000"
            className="w-full border border-stone-200 px-3.5 py-2 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
            style={{ borderRadius: '1px' }}
          />
        </div>
        <div>
          <label className="block text-primary font-roboto text-sm font-semibold mb-1">Enquiry Type</label>
          <select
            name="enquiry_type"
            className="w-full border border-stone-200 px-3.5 py-2 text-sm font-roboto text-primary focus:outline-none focus:border-stone-400 cursor-pointer"
            style={{ borderRadius: '1px' }}
          >
            {ENQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">Subject <span className="text-red-400">*</span></label>
        <input
          name="subject"
          type="text"
          required
          placeholder="How can we help?"
          className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
          style={{ borderRadius: '1px' }}
        />
      </div>

      <div>
        <label className="block text-primary font-roboto text-sm font-semibold mb-1">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          maxLength={500}
          placeholder="Tell us about your property needs, questions, or anything else we can help with..."
          className="w-full border border-stone-200 px-3.5 py-2 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none"
          style={{ borderRadius: '1px' }}
        />
        <p className="text-right text-xs text-stone-300 font-roboto mt-1">Max 500 characters</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-primary hover:bg-golden text-white font-roboto text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ borderRadius: '1px' }}
      >
        {submitting ? (
          <><i className="ri-loader-4-line animate-spin" /> Sending...</>
        ) : (
          'Submit'
        )}
      </button>

      <p className="text-stone-400 font-roboto text-xs text-center">
        We respond to all enquiries within 24 hours during business days.
      </p>
    </form>
  );
}
