import { useState, FormEvent, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PropertyCardEnquiryModalProps {
  propertyTitle: string;
  propertyId?: string;
  agentPhone?: string;
  onClose: () => void;
}

export default function PropertyCardEnquiryModal({
  propertyTitle,
  propertyId,
  agentPhone,
  onClose,
}: PropertyCardEnquiryModalProps) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: `Hello, I am interested in ${propertyTitle}. Please get in touch with me.`,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.email.trim()) {
      setError('First name and email are required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const body = new URLSearchParams({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        property: propertyTitle,
        property_id: propertyId ?? '',
        type: 'Property Card Enquiry',
      });

      await fetch('https://readdy.ai/api/form/d7emoa5fi84lst2k07fg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      // Save to Supabase leads for CRM
      await supabase.from('leads').insert({
        lead_name: `${form.first_name} ${form.last_name}`.trim(),
        email: form.email || null,
        phone: form.phone || null,
        listing_id: propertyId || null,
        source_page: 'All Properties — Card Enquiry',
        message: form.message || null,
        stage: 'new',
        inquiry_type: 'info',
        property_title: propertyTitle,
      });

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,23,49,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-sm overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(0,23,49,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-prata text-primary">Contact Us</h2>
            <p className="text-stone-400 text-xs font-roboto mt-0.5 leading-snug max-w-xs line-clamp-2">
              {propertyTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer shrink-0 mt-0.5"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 flex items-center justify-center bg-green-50 rounded-full mx-auto mb-4">
                <i className="ri-checkbox-circle-line text-green-500 text-3xl" />
              </div>
              <p className="font-roboto font-medium text-primary text-lg mb-1">Message Sent!</p>
              <p className="text-stone-400 text-sm font-roboto">We&apos;ll get back to you within 24 hours.</p>
              {agentPhone && (
                <a
                  href={`tel:${agentPhone}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-roboto text-primary underline cursor-pointer"
                >
                  <i className="ri-phone-line" /> Or call us now
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="mt-5 block mx-auto w-full py-3 bg-primary text-white text-xs font-roboto font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap rounded-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form
              data-readdy-form
              id="property-card-enquiry-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-roboto text-primary mb-1.5">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    placeholder="First name"
                    className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-400 focus:outline-none focus:border-golden transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-roboto text-primary mb-1.5">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    placeholder="Last name"
                    className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-400 focus:outline-none focus:border-golden transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-roboto text-primary mb-1.5">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Your email"
                    className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-400 focus:outline-none focus:border-golden transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-roboto text-primary mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-400 focus:outline-none focus:border-golden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-roboto text-primary mb-1.5">Message</label>
                <textarea
                  name="message"
                  rows={3}
                  maxLength={500}
                  value={form.message}
                  onChange={(e) => { if (e.target.value.length <= 500) setForm({ ...form, message: e.target.value }); }}
                  className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-400 focus:outline-none focus:border-golden transition-colors resize-none"
                />
                <p className="text-[10px] text-stone-300 text-right mt-0.5">{form.message.length}/500</p>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-roboto bg-red-50 px-3 py-2 rounded-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white border-2 border-primary hover:bg-transparent hover:text-golden hover:border-golden py-3.5 text-sm font-roboto font-medium tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-60 whitespace-nowrap rounded-sm"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin inline-block" />
                    Sending...
                  </span>
                ) : (
                  'Submit Enquiry'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
