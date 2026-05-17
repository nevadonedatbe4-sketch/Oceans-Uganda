import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useAuth } from '@/contexts/AuthContext';

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Family Home', 'Studio', 'Land', 'Commercial'];
const BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4', '5', '6+'];
const SERVICE_OPTIONS = [
  { value: 'full_management', label: 'Full Management' },
  { value: 'let_only', label: 'Let Only' },
  { value: 'sale', label: 'I Want to Sell' },
  { value: 'not_sure', label: 'Not Sure Yet' },
];
const STATUS_OPTIONS = [
  { value: 'vacant', label: 'Currently Vacant' },
  { value: 'occupied', label: 'Currently Tenanted' },
  { value: 'owner_occupied', label: 'Owner Occupied' },
  { value: 'under_refurb', label: 'Under Renovation' },
];

export default function LandlordEnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const { get } = useSiteSettings();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'editor';
  const sidebarImage = get('cp_sidebar_image', '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const body = new URLSearchParams();
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      if (typeof value === 'string') body.append(key, value);
    });
    try {
      await fetch('https://readdy.ai/api/form/d76oehl4hjod66j2euo0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      form.reset();
      const redirectUrl = get('form_redirect_landlord', '/');
      navigate(redirectUrl);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="landlord-form" className="relative py-20 px-6" style={{ background: 'rgb(245,247,247)' }}>
      {/* Admin edit button */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => navigate('/admin/management/contact')}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-stone-700 text-xs font-medium rounded-md hover:bg-white transition-colors cursor-pointer whitespace-nowrap border border-stone-200"
        >
          <i className="ri-edit-2-line text-sm" />
          Edit Enquiry Form Info
        </button>
      )}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Left info panel */}
          <div className="lg:col-span-2">
            {/* Sidebar image */}
            {sidebarImage && (
              <div className="w-full aspect-square overflow-hidden mb-8">
                <img
                  src={sidebarImage}
                  alt="Oceans Estate &amp; Letting Agents"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            )}

            <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-3">Get Started</p>
            <h2 className="text-3xl font-prata text-primary mb-5 leading-snug">
              Let's Talk About Your Property
            </h2>
            <p className="text-text-gray font-roboto text-sm leading-relaxed mb-10">
              Fill in the short form and one of our dedicated landlord specialists will be in touch within 24 hours to discuss how we can maximise your rental return.
            </p>

            <div className="space-y-6">
              {[
                { icon: 'ri-phone-line', title: 'Call Us Directly', value: '+256(0)758671270' },
                { icon: 'ri-mail-line', title: 'Email Us', value: 'info@oceans.co.ug' },
                { icon: 'ri-map-pin-2-line', title: 'Visit Our Office', value: '785 Luthuli Avenue, Bugolobi, Kampala' },
                { icon: 'ri-time-line', title: 'Office Hours', value: 'Mon – Fri: 8:30am – 5:30pm' },
              ].map((c) => (
                <div key={c.title} className="flex gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/8 rounded-full flex-shrink-0" style={{ background: 'rgba(13,89,89,0.08)' }}>
                    <i className={`${c.icon} text-primary`} />
                  </div>
                  <div>
                    <p className="text-primary font-roboto text-xs font-semibold uppercase tracking-wider mb-0.5">{c.title}</p>
                    <p className="text-text-gray font-roboto text-sm">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white border border-stone-100 p-8 md:p-10" style={{ boxShadow: '0 8px 48px rgba(0,23,49,0.13)', borderRadius: '2px' }}>
            {submitted ? (
              <div className="py-14 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-golden/10 rounded-full mx-auto mb-5">
                  <i className="ri-check-double-line text-golden text-3xl" />
                </div>
                <h3 className="text-primary font-prata text-2xl mb-3">Enquiry Received!</h3>
                <p className="text-text-gray font-roboto text-sm leading-relaxed max-w-xs mx-auto mb-2">
                  Thank you for getting in touch. A member of our landlord team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-5 text-golden font-roboto text-sm underline cursor-pointer"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form ref={formRef} data-readdy-form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="text-primary font-roboto text-xs tracking-widest uppercase font-semibold mb-4 pb-2 border-b border-stone-100">
                    About Your Property
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">
                        Property Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="property_address"
                        type="text"
                        required
                        placeholder="e.g. 14 Hill Drive, Muyenga"
                        className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                        style={{ borderRadius: '1px' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">Property Type</label>
                        <select
                          name="property_type"
                          className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary focus:outline-none focus:border-stone-400 cursor-pointer"
                          style={{ borderRadius: '1px' }}
                        >
                          {PROPERTY_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">Bedrooms</label>
                        <select
                          name="bedrooms"
                          className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary focus:outline-none focus:border-stone-400 cursor-pointer"
                          style={{ borderRadius: '1px' }}
                        >
                          {BEDROOM_OPTIONS.map((b) => (
                            <option key={b} value={b}>{b === 'Studio' ? 'Studio' : `${b} Bed${b !== '1' ? 's' : ''}`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">Service Required</label>
                        <select
                          name="service_required"
                          className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary focus:outline-none focus:border-stone-400 cursor-pointer"
                          style={{ borderRadius: '1px' }}
                        >
                          {SERVICE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">Current Status</label>
                        <select
                          name="current_status"
                          className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary focus:outline-none focus:border-stone-400 cursor-pointer"
                          style={{ borderRadius: '1px' }}
                        >
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-primary font-roboto text-xs tracking-widest uppercase font-semibold mb-4 pb-2 border-b border-stone-100">
                    Your Details
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="full_name"
                        type="text"
                        required
                        placeholder="Your full name"
                        className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                        style={{ borderRadius: '1px' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                          style={{ borderRadius: '1px' }}
                        />
                      </div>
                      <div>
                        <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">
                          Phone <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          required
                          placeholder="+256 700 000 000"
                          className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                          style={{ borderRadius: '1px' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-primary font-roboto text-sm font-semibold mb-1.5">Message / Additional Details</label>
                      <textarea
                        name="message"
                        rows={3}
                        maxLength={500}
                        placeholder="Tell us anything else about your property or requirements..."
                        className="w-full border border-stone-200 px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none"
                        style={{ borderRadius: '1px' }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-primary hover:bg-golden text-white font-roboto text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ borderRadius: '1px' }}
                >
                  {submitting ? (
                    <><i className="ri-loader-4-line animate-spin" /> Sending...</>
                  ) : (
                    'Submit'
                  )}
                </button>
                <p className="text-stone-400 font-roboto text-xs text-center">
                  We respond within 24 hours. No obligation, no pressure.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
