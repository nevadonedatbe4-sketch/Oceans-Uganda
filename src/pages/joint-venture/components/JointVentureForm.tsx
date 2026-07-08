import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const TITLE_STATUS_OPTIONS = ['Freehold', 'Leasehold', 'Mailo', 'Kibanja / customary', 'In process'];
const STRUCTURE_OPTIONS = [
  'Joint venture — revenue share',
  'Joint venture — equity split',
  'Lease-to-JV',
  'Open to outright sale instead',
  'Not sure — advise me',
];
const INVESTMENT_RANGE_OPTIONS = ['Below UGX 100M', 'UGX 100M – 500M', 'UGX 500M – 1B', 'UGX 1B – 5B', 'Above UGX 5B'];
const PREFERRED_USE_OPTIONS = [
  'Agriculture / agri-processing',
  'Residential estate development',
  'Commercial development',
  'Mixed-use',
  'Outright land purchase only',
];
const TIMELINE_OPTIONS = ['Ready to move within 30 days', '1–3 months', '3–6 months', 'Exploring options'];

type Tab = 'landowner' | 'investor';

interface LandownerFields {
  fullName: string;
  phone: string;
  email: string;
  district: string;
  acreage: string;
  titleStatus: string;
  structure: string;
  details: string;
}

interface InvestorFields {
  fullName: string;
  phone: string;
  email: string;
  investmentRange: string;
  districts: string;
  preferredUse: string;
  timeline: string;
  details: string;
}

const DEFAULT_LANDOWNER: LandownerFields = {
  fullName: '', phone: '', email: '', district: '', acreage: '',
  titleStatus: TITLE_STATUS_OPTIONS[0], structure: STRUCTURE_OPTIONS[0], details: '',
};

const DEFAULT_INVESTOR: InvestorFields = {
  fullName: '', phone: '', email: '', investmentRange: INVESTMENT_RANGE_OPTIONS[0],
  districts: '', preferredUse: PREFERRED_USE_OPTIONS[0], timeline: TIMELINE_OPTIONS[0], details: '',
};

export default function JointVentureForm() {
  const [tab, setTab] = useState<Tab>('landowner');
  const [landowner, setLandowner] = useState<LandownerFields>(DEFAULT_LANDOWNER);
  const [investor, setInvestor] = useState<InvestorFields>(DEFAULT_INVESTOR);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<Tab | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Tab>).detail;
      if (detail === 'landowner' || detail === 'investor') setTab(detail);
    };
    window.addEventListener('jv-desk-tab', handler);
    return () => window.removeEventListener('jv-desk-tab', handler);
  }, []);

  const handleLandownerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const message = [
      `District / location: ${landowner.district}`,
      `Acreage: ${landowner.acreage}`,
      `Title status: ${landowner.titleStatus}`,
      `Preferred structure: ${landowner.structure}`,
      landowner.details ? `Details: ${landowner.details}` : null,
    ].filter(Boolean).join('\n');

    const { error: insertError } = await supabase.from('leads').insert({
      lead_name: landowner.fullName,
      email: landowner.email || null,
      phone: landowner.phone || null,
      listing_id: null,
      source_page: 'Joint Ventures — Landowner Brief',
      message,
      stage: 'new',
      inquiry_type: 'joint_venture_landowner',
    });

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSubmitted('landowner');
    setLandowner(DEFAULT_LANDOWNER);
  };

  const handleInvestorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const message = [
      `Investment range: ${investor.investmentRange}`,
      investor.districts ? `Preferred district(s): ${investor.districts}` : null,
      `Preferred use: ${investor.preferredUse}`,
      `Timeline: ${investor.timeline}`,
      investor.details ? `Details: ${investor.details}` : null,
    ].filter(Boolean).join('\n');

    const { error: insertError } = await supabase.from('leads').insert({
      lead_name: investor.fullName,
      email: investor.email || null,
      phone: investor.phone || null,
      listing_id: null,
      source_page: 'Joint Ventures — Investor Brief',
      message,
      stage: 'new',
      inquiry_type: 'joint_venture_investor',
    });

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSubmitted('investor');
    setInvestor(DEFAULT_INVESTOR);
  };

  const inputClass =
    'w-full h-11 px-4 bg-white/[0.06] border border-white/15 text-white placeholder:text-white/35 text-sm font-roboto focus:outline-none focus:border-golden transition-colors rounded-sm';
  const labelClass = 'block text-[11px] font-roboto uppercase tracking-widest text-white/55 mb-1.5';

  return (
    <section id="jv-desk" className="bg-primary py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-3">Submit a Request</p>
        <h2 className="text-3xl md:text-4xl font-prata text-white mb-4">Open a File With the JV Desk</h2>
        <p className="text-white/60 font-roboto text-sm leading-relaxed mb-10 max-w-2xl">
          Fill in whichever side applies to you. A member of the Oceans Uganda land team reviews every submission and responds within 48 hours.
        </p>

        {/* Tabs */}
        <div className="flex gap-0.5 mb-0 w-fit border border-white/15 rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setTab('landowner')}
            className={`px-6 py-3.5 text-xs font-roboto tracking-widest uppercase transition-colors cursor-pointer whitespace-nowrap ${
              tab === 'landowner' ? 'bg-golden text-primary' : 'bg-white/[0.04] text-white/65 hover:text-white'
            }`}
          >
            I Own Land
          </button>
          <button
            type="button"
            onClick={() => setTab('investor')}
            className={`px-6 py-3.5 text-xs font-roboto tracking-widest uppercase transition-colors cursor-pointer whitespace-nowrap ${
              tab === 'investor' ? 'bg-golden text-primary' : 'bg-white/[0.04] text-white/65 hover:text-white'
            }`}
          >
            I Have Capital
          </button>
        </div>

        <div className="bg-white/[0.04] border border-white/15 border-t-0 p-6 md:p-10">
          {submitted === tab ? (
            <div className="py-10 text-center">
              <div className="w-14 h-14 flex items-center justify-center bg-golden/15 rounded-full mx-auto mb-4">
                <i className="ri-check-double-line text-golden text-2xl" />
              </div>
              <h3 className="text-white font-prata text-xl mb-2">Brief Received</h3>
              <p className="text-white/60 font-roboto text-sm max-w-xs mx-auto mb-4">
                {tab === 'landowner'
                  ? 'The JV desk will call or WhatsApp you within 48 hours.'
                  : 'Expect a shortlist of matching land within 48 hours.'}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(null)}
                className="text-golden font-roboto text-sm underline cursor-pointer"
              >
                Submit another brief
              </button>
            </div>
          ) : tab === 'landowner' ? (
            <form onSubmit={handleLandownerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  type="text" required value={landowner.fullName}
                  onChange={(e) => setLandowner({ ...landowner, fullName: e.target.value })}
                  placeholder="e.g. Sarah Namutebi" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone / WhatsApp</label>
                <input
                  type="tel" required value={landowner.phone}
                  onChange={(e) => setLandowner({ ...landowner, phone: e.target.value })}
                  placeholder="+256 7XX XXX XXX" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email" value={landowner.email}
                  onChange={(e) => setLandowner({ ...landowner, email: e.target.value })}
                  placeholder="you@email.com" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>District / location</label>
                <input
                  type="text" required value={landowner.district}
                  onChange={(e) => setLandowner({ ...landowner, district: e.target.value })}
                  placeholder="e.g. Wakiso, Kira" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Acreage</label>
                <input
                  type="text" required value={landowner.acreage}
                  onChange={(e) => setLandowner({ ...landowner, acreage: e.target.value })}
                  placeholder="e.g. 12 acres" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Title status</label>
                <select
                  value={landowner.titleStatus}
                  onChange={(e) => setLandowner({ ...landowner, titleStatus: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  {TITLE_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Preferred structure</label>
                <select
                  value={landowner.structure}
                  onChange={(e) => setLandowner({ ...landowner, structure: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  {STRUCTURE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Tell us about the land</label>
                <textarea
                  rows={3} value={landowner.details}
                  onChange={(e) => setLandowner({ ...landowner, details: e.target.value })}
                  placeholder="Access road, current use, nearby landmarks, any existing survey or valuation, ideal type of investor…"
                  className={`${inputClass} h-auto py-3 resize-none`}
                />
              </div>

              {error && <p className="md:col-span-2 text-red-300 text-xs font-roboto">{error}</p>}

              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <p className="text-white/40 font-roboto text-xs flex-1">
                  Have a survey map or photos? Mention it here — our team will follow up to collect them by WhatsApp or email.
                </p>
                <button
                  type="submit" disabled={submitting}
                  className="px-8 py-3.5 bg-golden text-primary font-roboto text-xs tracking-widest uppercase font-semibold hover:bg-golden-light transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit Land Brief'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleInvestorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  type="text" required value={investor.fullName}
                  onChange={(e) => setInvestor({ ...investor, fullName: e.target.value })}
                  placeholder="e.g. David Okello" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone / WhatsApp</label>
                <input
                  type="tel" required value={investor.phone}
                  onChange={(e) => setInvestor({ ...investor, phone: e.target.value })}
                  placeholder="+256 7XX XXX XXX" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email" value={investor.email}
                  onChange={(e) => setInvestor({ ...investor, email: e.target.value })}
                  placeholder="you@email.com" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Investment range</label>
                <select
                  value={investor.investmentRange}
                  onChange={(e) => setInvestor({ ...investor, investmentRange: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  {INVESTMENT_RANGE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Preferred district(s)</label>
                <input
                  type="text" value={investor.districts}
                  onChange={(e) => setInvestor({ ...investor, districts: e.target.value })}
                  placeholder="e.g. Mukono, Entebbe, Gulu" className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Preferred use</label>
                <select
                  value={investor.preferredUse}
                  onChange={(e) => setInvestor({ ...investor, preferredUse: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  {PREFERRED_USE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Timeline</label>
                <select
                  value={investor.timeline}
                  onChange={(e) => setInvestor({ ...investor, timeline: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                >
                  {TIMELINE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>What are you looking for?</label>
                <textarea
                  rows={3} value={investor.details}
                  onChange={(e) => setInvestor({ ...investor, details: e.target.value })}
                  placeholder="Minimum acreage, access requirements, JV structure preference, or any land you've already seen…"
                  className={`${inputClass} h-auto py-3 resize-none`}
                />
              </div>

              {error && <p className="md:col-span-2 text-red-300 text-xs font-roboto">{error}</p>}

              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <p className="text-white/40 font-roboto text-xs flex-1">
                  We only share your brief with landowners once you approve a shortlist — your details stay private until then.
                </p>
                <button
                  type="submit" disabled={submitting}
                  className="px-8 py-3.5 bg-golden text-primary font-roboto text-xs tracking-widest uppercase font-semibold hover:bg-golden-light transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Submit Investment Brief'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
