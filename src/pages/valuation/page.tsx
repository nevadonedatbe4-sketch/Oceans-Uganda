import { useState, useRef } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import InnerContactSection from '@/components/feature/InnerContactSection';

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Family Home', 'Studio', 'Land', 'Commercial'];
const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5', '6+'];
const PURPOSE_OPTIONS = [
  { value: 'sell', label: 'I want to Sell' },
  { value: 'rent_out', label: 'I want to Rent Out' },
  { value: 'curious', label: 'Just Curious About Value' },
];

const BENEFITS = [
  { icon: 'ri-bar-chart-2-line', title: 'Accurate Market Analysis', desc: 'We compare your property against recent sales and active listings in your area to give a data-driven valuation.' },
  { icon: 'ri-shield-check-line', title: 'No Obligation', desc: 'Our valuation service is completely free with zero pressure. Get the information you need to make informed decisions.' },
  { icon: 'ri-user-star-line', title: 'Expert Local Agents', desc: 'Our valuers have deep knowledge of Kampala\'s premium neighbourhoods and current market trends.' },
  { icon: 'ri-time-line', title: 'Fast Turnaround', desc: 'Receive your detailed property valuation report within 24–48 hours of the assessment.' },
];

const STATS = [
  { value: '500+', label: 'Properties Valued' },
  { value: '12+', label: 'Years Experience' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '48h', label: 'Report Turnaround' },
];

export default function ValuationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new URLSearchParams();
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      if (typeof value === 'string') data.append(key, value);
    });

    try {
      await fetch('https://readdy.ai/api/form/d76obiflpdqvlupfq3ng', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      setSubmitted(true);
      form.reset();
    } catch {
      // no-op
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div
        className="relative pt-36 pb-24 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=elegant%20luxury%20residential%20property%20Kampala%20Uganda%20aerial%20drone%20view%20tropical%20garden%20lush%20green%20premium%20estate%20colonial%20architecture%20warm%20golden%20hour%20photography%20cinematic%20real%20estate%20high%20contrast%20vivid%20colors&width=1920&height=700&seq=val-hero1&orientation=landscape)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6">
          <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-4">Free Service · No Obligation</p>
          <h1 className="text-4xl md:text-6xl font-prata text-white mb-5 leading-tight">
            Free Property<br />Valuation
          </h1>
          <p className="text-white/80 font-roboto text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Know exactly what your property is worth in today's Kampala market. Our expert agents deliver accurate, data-backed valuations within 48 hours.
          </p>
          <a
            href="#valuation-form"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-golden text-white font-roboto text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-golden/90 transition-colors"
          >
            <i className="ri-arrow-down-line" />
            Request Valuation
          </a>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-primary">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-golden font-prata text-3xl">{s.value}</p>
              <p className="text-white/60 font-roboto text-xs mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content: Benefits + Form */}
      <div id="valuation-form" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Benefits */}
          <div className="pb-6 md:pb-8">
            <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-3">Why Get Valued?</p>
            <h2 className="text-3xl md:text-4xl font-prata text-primary mb-6 leading-snug">
              Unlock Your Property's True Market Value
            </h2>
            <p className="text-text-gray font-roboto text-sm leading-relaxed mb-10">
              Whether you're planning to sell, rent out, or simply want to know what your property is worth, our expert valuation service gives you the clarity and confidence to act.
            </p>

            <div className="space-y-7">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-4 p-4 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 bg-white border border-gray-100">
                  <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-golden/10 rounded-full">
                    <i className={`${b.icon} text-golden text-lg`} />
                  </div>
                  <div>
                    <h3 className="text-primary font-prata text-base mb-1">{b.title}</h3>
                    <p className="text-text-gray font-roboto text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial pull-quote */}
            <div className="mt-12 bg-primary/5 border-l-4 border-golden p-6 shadow-sm rounded-sm">
              <p className="text-primary font-prata text-base italic leading-relaxed mb-3">
                "The valuation was spot-on. They sold our Kololo home in 3 weeks at the exact price they predicted."
              </p>
              <p className="text-text-gray font-roboto text-sm">— Sarah M., Kololo</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white border border-gray-100 p-8 md:p-10 pb-6 md:pb-8" style={{ boxShadow: '0 4px 40px rgba(0,23,49,0.08)' }}>
            <h3 className="text-primary font-prata text-2xl mb-2">Request Your Free Valuation</h3>
            <p className="text-text-gray font-roboto text-sm mb-8">Fill in the details below and one of our agents will contact you shortly.</p>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-golden/10 rounded-full mx-auto mb-5">
                  <i className="ri-check-double-line text-golden text-3xl" />
                </div>
                <h4 className="text-primary font-prata text-xl mb-3">Request Received!</h4>
                <p className="text-text-gray font-roboto text-sm leading-relaxed max-w-xs mx-auto">
                  Thank you! One of our agents will reach out within 24 hours to schedule your property assessment.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-golden font-roboto text-sm underline cursor-pointer"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                data-readdy-form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Property Details */}
                <div>
                  <p className="text-primary font-roboto text-xs tracking-widest uppercase font-semibold mb-4 pb-2 border-b border-gray-100">
                    Property Details
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-primary font-roboto text-xs font-medium mb-1.5">
                        Property Address / Location <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="property_address"
                        type="text"
                        required
                        placeholder="e.g. 12 Acacia Avenue, Kololo"
                        className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-300 focus:outline-none focus:border-golden transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primary font-roboto text-xs font-medium mb-1.5">Property Type</label>
                        <select
                          name="property_type"
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary focus:outline-none focus:border-golden cursor-pointer"
                        >
                          {PROPERTY_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-primary font-roboto text-xs font-medium mb-1.5">Bedrooms</label>
                        <select
                          name="bedrooms"
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary focus:outline-none focus:border-golden cursor-pointer"
                        >
                          {BEDROOM_OPTIONS.map((b) => (
                            <option key={b} value={b}>{b} Bed{b !== '1' ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primary font-roboto text-xs font-medium mb-1.5">Approx. Size (sqm)</label>
                        <input
                          name="size_sqm"
                          type="number"
                          min="0"
                          placeholder="e.g. 250"
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-300 focus:outline-none focus:border-golden transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-primary font-roboto text-xs font-medium mb-1.5">I want to...</label>
                        <select
                          name="purpose"
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary focus:outline-none focus:border-golden cursor-pointer"
                        >
                          {PURPOSE_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <p className="text-primary font-roboto text-xs tracking-widest uppercase font-semibold mb-4 pb-2 border-b border-gray-100">
                    Your Contact Details
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-primary font-roboto text-xs font-medium mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="full_name"
                        type="text"
                        required
                        placeholder="Your full name"
                        className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-300 focus:outline-none focus:border-golden transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primary font-roboto text-xs font-medium mb-1.5">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-300 focus:outline-none focus:border-golden transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-primary font-roboto text-xs font-medium mb-1.5">
                          Phone <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          required
                          placeholder="+256 700 000 000"
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-300 focus:outline-none focus:border-golden transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-primary font-roboto text-xs font-medium mb-1.5">Preferred Inspection Date</label>
                      <input
                        name="preferred_date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary focus:outline-none focus:border-golden transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-primary font-roboto text-xs font-medium mb-1.5">Additional Notes</label>
                      <textarea
                        name="additional_notes"
                        rows={3}
                        maxLength={500}
                        placeholder="Any additional information about your property..."
                        className="w-full border border-gray-200 rounded-sm px-4 py-2.5 text-sm font-roboto text-primary placeholder:text-gray-300 focus:outline-none focus:border-golden transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-golden text-white font-roboto text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-golden/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line" />
                      Request Free Valuation
                    </>
                  )}
                </button>

                <p className="text-text-gray font-roboto text-xs text-center">
                  By submitting, you agree to be contacted by Oceans Uganda regarding your property.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Process steps */}
      <div className="bg-gray-50/70 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="text-3xl font-prata text-primary">Your Valuation in 3 Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: 'ri-file-list-3-line', title: 'Submit Your Details', desc: 'Fill in the form above with your property and contact information. Takes less than 2 minutes.' },
              { step: '02', icon: 'ri-search-eye-line', title: 'Property Assessment', desc: 'One of our expert agents will visit your property and conduct a thorough market comparison analysis.' },
              { step: '03', icon: 'ri-bar-chart-grouped-line', title: 'Receive Your Report', desc: 'Get a detailed valuation report with market insights, pricing strategy, and our recommended next steps.' },
            ].map((item) => (
              <div key={item.step} className="text-center px-4 py-6 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-gray-100">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 flex items-center justify-center bg-primary rounded-full mx-auto">
                    <i className={`${item.icon} text-white text-2xl`} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center bg-golden rounded-full text-white font-roboto text-xs font-bold">
                    {item.step.replace('0', '')}
                  </span>
                </div>
                <h3 className="text-primary font-prata text-lg mb-3">{item.title}</h3>
                <p className="text-text-gray font-roboto text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InnerContactSection />
      <Footer />
    </div>
  );
}
