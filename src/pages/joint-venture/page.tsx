import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import { JointVentureSEO } from '@/components/feature/PageSEO';
import JointVentureForm from './components/JointVentureForm';
import JointVentureFAQ from './components/JointVentureFAQ';
import JointVentureListings from './components/JointVentureListings';

const PROJECT_TYPES = ['Apartment blocks', 'Gated communities', 'Hotels & resorts', 'Commercial complexes', 'Agri-processing sites'];

const SERVICES = [
  { code: 'SVC / 01', title: 'Land sourcing & acquisition', desc: 'We identify and vet land opportunities, checking legal standing before anything is listed.' },
  { code: 'SVC / 02', title: 'Investment structuring', desc: 'Revenue share, equity split, or lease-to-JV — we draft the structure that fits both sides.' },
  { code: 'SVC / 03', title: 'Development & project management', desc: 'Once a JV is signed, we help oversee the build so it stays on time and on budget.' },
  { code: 'SVC / 04', title: 'Market analysis & feasibility', desc: 'Demand studies and profitability projections before capital is committed to a plot.' },
  { code: 'SVC / 05', title: 'Financing & capital raising', desc: 'Where a project needs more than one investor, we help arrange equity, debt, or blended funding.' },
  { code: 'SVC / 06', title: 'Legal & regulatory compliance', desc: 'Title verification, land board approvals, and contracts handled under Ugandan land law.' },
];

const TRUST_PILLARS = [
  { tag: 'Reach', title: 'Kampala & beyond', desc: "Active listings and briefs across Kampala's growth corridors and districts further afield — from lakeside plots to upcountry farmland." },
  { tag: 'Transparent', title: 'Legal-first, always', desc: "Every land brief is title-checked before it's shared, and every JV structure is put in writing before any money or land changes hands." },
  { tag: 'Support', title: 'From brief to breaking ground', desc: 'We stay involved from the first enquiry through matching, structuring, and into project delivery — not just the handshake.' },
];

function scrollToDesk(tab?: 'landowner' | 'investor') {
  document.getElementById('jv-desk')?.scrollIntoView({ behavior: 'smooth' });
  if (tab) {
    window.dispatchEvent(new CustomEvent('jv-desk-tab', { detail: tab }));
  }
}

export default function JointVenturePage() {
  return (
    <div className="min-h-screen bg-white pt-[88px] md:pt-[96px]">
      <JointVentureSEO />
      <Navbar />

      {/* Hero */}
      <section className="relative bg-primary overflow-hidden py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_0.9fr] gap-12 items-end">
          <div>
            <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-4">Joint Venture &amp; Land Investment Desk</p>
            <h1 className="text-white font-prata text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Land is the asset.<br />The <em className="text-golden not-italic italic">right partner</em> is the return.
            </h1>
            <p className="text-white/75 font-roboto text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Post your land and find capital, or submit a brief and find a plot. Oceans Uganda matches landowners with investors for joint ventures — and helps source prime land available for outright purchase across Kampala and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => scrollToDesk('landowner')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-golden text-primary font-roboto text-sm tracking-widest uppercase font-semibold cursor-pointer whitespace-nowrap hover:bg-golden-light transition-colors"
              >
                I Own Land
              </button>
              <button
                type="button"
                onClick={() => scrollToDesk('investor')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/40 text-white font-roboto text-sm tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-white/10 transition-colors"
              >
                I Have Capital
              </button>
            </div>
          </div>

          <div className="bg-white/[0.05] border border-white/15 p-6">
            <div className="flex items-center justify-between text-golden text-[11px] font-roboto tracking-widest uppercase mb-4">
              <span>JV Desk — Live Focus</span>
              <span>UG</span>
            </div>
            <div className="space-y-0">
              {[
                { label: 'Districts with active JV interest', value: '14+' },
                { label: 'Land opportunities we can help source', value: '50+' },
                { label: 'Investor & landowner briefs handled', value: '100+' },
              ].map((s, i) => (
                <div key={s.label} className={`flex justify-between items-baseline gap-4 py-3 ${i > 0 ? 'border-t border-dashed border-white/15' : ''}`}>
                  <span className="text-white font-prata text-2xl">{s.value}</span>
                  <span className="text-white/55 font-roboto text-xs text-right max-w-[170px]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project types strip */}
      <section className="bg-off-white border-b border-stone-200 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4 flex-wrap">
          <span className="text-text-gray font-roboto text-xs uppercase tracking-widest whitespace-nowrap">What gets built on JV land</span>
          {PROJECT_TYPES.map((t) => (
            <span key={t} className="px-4 py-2 rounded-full border border-stone-200 bg-white text-primary text-xs font-roboto font-medium">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Two paths */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-12">
            <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-prata text-primary mb-4">Two starting points, one deal room.</h2>
            <p className="text-text-gray font-roboto text-sm leading-relaxed">
              Whichever side of the table you sit on, every request lands with our JV desk, gets verified, and is matched by location, acreage and structure before any introduction is made.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 items-stretch border border-stone-200">
            <div className="p-8 md:p-10 flex flex-col gap-4 bg-off-white">
              <span className="w-fit px-3 py-1 bg-accent/10 text-accent text-[11px] font-roboto font-semibold uppercase tracking-widest rounded-sm">Landowner</span>
              <h3 className="text-2xl font-prata text-primary">Bring the land, find the capital.</h3>
              <ul className="text-text-gray font-roboto text-sm leading-relaxed space-y-2 list-disc pl-4">
                <li>Tell us where the land is, its size and title status.</li>
                <li>Choose a structure — revenue share, equity split, lease-to-JV, or outright sale.</li>
                <li>We verify title and shortlist matched investors.</li>
                <li>You review offers and choose who you work with.</li>
              </ul>
              <button
                type="button"
                onClick={() => scrollToDesk('landowner')}
                className="mt-auto w-fit px-6 py-3 border border-primary/25 text-primary font-roboto text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-primary hover:text-white transition-colors"
              >
                Post Your Land Brief
              </button>
            </div>

            <div className="flex items-center justify-center p-6 lg:p-0">
              <div className="w-24 h-24 rounded-full bg-primary text-golden border border-golden flex items-center justify-center text-center font-prata text-sm font-semibold leading-tight shadow-lg">
                JV<br />Deal<br />Room
              </div>
            </div>

            <div className="p-8 md:p-10 flex flex-col gap-4 bg-off-white">
              <span className="w-fit px-3 py-1 bg-golden/15 text-golden-dark text-[11px] font-roboto font-semibold uppercase tracking-widest rounded-sm">Investor</span>
              <h3 className="text-2xl font-prata text-primary">Bring the capital, find the land.</h3>
              <ul className="text-text-gray font-roboto text-sm leading-relaxed space-y-2 list-disc pl-4">
                <li>Tell us your budget, target districts and preferred use.</li>
                <li>We search verified landowner briefs and any land we're sourcing.</li>
                <li>Receive a shortlist with title status and site notes.</li>
                <li>Structure the JV or purchase directly, your call.</li>
              </ul>
              <button
                type="button"
                onClick={() => scrollToDesk('investor')}
                className="mt-auto w-fit px-6 py-3 border border-primary/25 text-primary font-roboto text-xs tracking-widest uppercase cursor-pointer whitespace-nowrap hover:bg-primary hover:text-white transition-colors"
              >
                Submit Your Investment Brief
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Land on the desk today */}
      <JointVentureListings />

      {/* Services */}
      <section className="bg-secondary py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-12">
            <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-3">What the Desk Handles</p>
            <h2 className="text-3xl md:text-4xl font-prata text-white mb-4">End to end, not just an introduction.</h2>
            <p className="text-white/60 font-roboto text-sm leading-relaxed">
              We don't just connect a name to a name. Every JV brief that gets matched is carried through these six stages before or after the introduction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {SERVICES.map((s) => (
              <div key={s.code} className="bg-secondary p-8 flex flex-col gap-3">
                <span className="text-golden font-roboto text-xs tracking-widest">{s.code}</span>
                <h4 className="text-white font-prata text-lg">{s.title}</h4>
                <p className="text-white/60 font-roboto text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="bg-off-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_PILLARS.map((p) => (
            <div key={p.title} className="bg-white border border-stone-200 p-8">
              <span className="inline-block px-2.5 py-1 bg-golden/15 text-golden-dark text-[11px] font-roboto font-semibold uppercase tracking-widest rounded-sm">{p.tag}</span>
              <h4 className="text-primary font-prata text-xl mt-4 mb-2.5">{p.title}</h4>
              <p className="text-text-gray font-roboto text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form desk */}
      <JointVentureForm />

      {/* FAQ */}
      <JointVentureFAQ />

      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
