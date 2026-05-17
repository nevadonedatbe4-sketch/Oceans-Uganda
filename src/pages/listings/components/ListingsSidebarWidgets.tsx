import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/hooks/useListings';

// ─── Widget wrapper ───────────────────────────────────────────────────────────
function Widget({ title, extra, children }: { title: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
      {children}
    </div>
  );
}



// ─── Widget: Featured Properties ─────────────────────────────────────────────
function FeaturedPropertiesWidget() {
  const [items, setItems] = useState<{ id: string; slug: string; title: string; location: string; price: number; price_currency: string; cover_image: string; bedrooms: number | null; listing_type: string[] }[]>([]);

  useEffect(() => {
    supabase
      .from('listings')
      .select('id, slug, title, location, price, price_currency, cover_image, bedrooms, listing_type')
      .eq('featured', true)
      .limit(4)
      .then(({ data }) => { if (data) setItems(data as typeof items); });
  }, []);

  if (items.length === 0) return null;

  return (
    <Widget title="Featured">
      <div className="divide-y divide-stone-50">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/property/${item.slug}`}
            className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#f5f5f5] transition-colors group/item cursor-pointer"
          >
            <div className="w-14 h-12 rounded-sm overflow-hidden shrink-0 bg-stone-100">
              <img
                src={item.cover_image || 'https://readdy.ai/api/search-image?query=modern%20residential%20property%20exterior%20clean%20architecture%20neutral%20background&width=112&height=96&seq=fw1&orientation=squarish'}
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[9px] font-roboto font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm text-white" style={{ background: '#0D5959' }}>
                  Featured
                </span>
              </div>
              <p className="text-[11px] font-roboto font-semibold text-primary leading-snug line-clamp-1 group-hover/item:text-[#0D5959] transition-colors">
                {item.title}
              </p>
              <p className="text-[10px] font-roboto text-stone-400 truncate flex items-center gap-0.5 mt-0.5">
                <i className="ri-map-pin-2-line text-[9px] shrink-0" />
                <span className="truncate">{item.location}</span>
              </p>
              <p className="text-[11px] font-roboto font-bold text-primary mt-0.5">
                {formatPrice(item.price, item.price_currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Widget>
  );
}

// ─── Widget: Property Types ───────────────────────────────────────────────────
function PropertyTypesWidget({ activeType, onSelect, types }: { activeType: string; onSelect: (type: string) => void; types: string[] }) {
  const typeIcons: Record<string, string> = {
    Apartment: 'ri-building-2-line',
    Villa: 'ri-home-heart-line',
    Penthouse: 'ri-building-4-line',
    Townhouse: 'ri-community-line',
    'Family Home': 'ri-home-2-line',
    Studio: 'ri-door-open-line',
    Land: 'ri-landscape-line',
    Commercial: 'ri-store-2-line',
  };

  return (
    <Widget title="Property Type">
      <div className="py-1">
        {types.filter((t) => t !== 'All Types').map((type) => (
          <button
            key={type}
            onClick={() => onSelect(activeType === type ? '' : type)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-roboto transition-all cursor-pointer whitespace-nowrap text-left ${
              activeType === type
                ? 'bg-primary/8 text-primary font-semibold'
                : 'text-stone-600 hover:bg-[#f5f5f5] hover:text-primary'
            }`}
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
              <i className={`${typeIcons[type] ?? 'ri-home-line'} text-xs ${activeType === type ? 'text-primary' : 'text-stone-400'}`} />
            </span>
            <span className="flex-1">{type}</span>
            {activeType === type && <i className="ri-check-line text-[10px] text-primary shrink-0" />}
          </button>
        ))}
      </div>
    </Widget>
  );
}

// ─── Widget: Price Range ──────────────────────────────────────────────────────
function PriceRangeWidget({ activeBracket, brackets, onSelect }: { activeBracket: string; brackets: { label: string }[]; onSelect: (label: string) => void }) {
  return (
    <Widget title="Price Range">
      <div className="py-1">
        {brackets.map((b) => (
          <button
            key={b.label}
            onClick={() => onSelect(activeBracket === b.label ? 'Any Price' : b.label)}
            className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-roboto transition-all cursor-pointer whitespace-nowrap text-left ${
              activeBracket === b.label
                ? 'bg-primary/8 text-primary font-semibold'
                : 'text-stone-600 hover:bg-[#f5f5f5] hover:text-primary'
            }`}
          >
            <span>{b.label}</span>
            {activeBracket === b.label && <i className="ri-check-line text-[10px] text-primary" />}
          </button>
        ))}
      </div>
    </Widget>
  );
}

// ─── Widget: Neighbourhoods ───────────────────────────────────────────────────
function NeighbourhoodsWidget({ neighborhoods, activeArea, onSelect }: { neighborhoods: { id: string; name: string; slug: string }[]; activeArea: string; onSelect: (name: string) => void }) {
  if (neighborhoods.length === 0) return null;

  return (
    <Widget title="Neighbourhoods">
      <div className="py-1">
        {neighborhoods.slice(0, 8).map((nb) => (
          <button
            key={nb.id}
            onClick={() => onSelect(activeArea === nb.name ? '' : nb.name)}
            className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-roboto transition-all cursor-pointer whitespace-nowrap text-left ${
              activeArea === nb.name
                ? 'bg-primary/8 text-primary font-semibold'
                : 'text-stone-600 hover:bg-[#f5f5f5] hover:text-primary'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <i className={`ri-map-pin-2-line text-[10px] ${activeArea === nb.name ? 'text-primary' : 'text-stone-300'}`} />
              {nb.name}
            </span>
            {activeArea === nb.name && <i className="ri-close-line text-[10px] text-primary" />}
          </button>
        ))}
        {neighborhoods.length > 8 && (
          <Link
            to="/neighbourhood"
            className="block text-center text-[10px] font-roboto text-primary/60 hover:text-primary transition-colors mt-0.5 py-1.5 cursor-pointer"
          >
            View all
          </Link>
        )}
      </div>
    </Widget>
  );
}

// ─── Widget: Recently Viewed ──────────────────────────────────────────────────
function RecentlyViewedWidget() {
  const { items, clearAll } = useRecentlyViewed();
  if (items.length === 0) return null;

  return (
    <Widget
      title="Recently Viewed"
      extra={
        <button
          onClick={clearAll}
          className="text-[10px] font-roboto text-stone-400 hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
        >
          Clear
        </button>
      }
    >
      <div className="divide-y divide-stone-50">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/property/${item.slug}`}
            className="flex items-center gap-2 px-2.5 py-2 hover:bg-[#f5f5f5] transition-colors group/item cursor-pointer"
          >
            <div className="w-11 h-9 rounded-sm overflow-hidden shrink-0 bg-stone-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover/item:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-roboto font-semibold text-primary leading-snug line-clamp-1 group-hover/item:text-golden transition-colors">
                {item.title}
              </p>
              <p className="text-[10px] font-roboto text-stone-400 truncate flex items-center gap-0.5 mt-0.5">
                <i className="ri-map-pin-2-line text-[9px] shrink-0" />
                <span className="truncate">{item.location}</span>
              </p>
              <p className="text-[10px] font-roboto font-bold text-primary mt-0.5">{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </Widget>
  );
}

// ─── Widget: Quick Enquiry ────────────────────────────────────────────────────
function EnquiryWidget() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await fetch('https://readdy.ai/api/form/d7826br2hsar0k5m0450', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ name: form.name, email: form.email, phone: form.phone, message: form.message }).toString(),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Widget title="Quick Enquiry">
      <div className="p-3">
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-full mx-auto mb-2">
              <i className="ri-checkbox-circle-line text-emerald-500 text-base" />
            </div>
            <p className="text-xs font-roboto font-medium text-primary">Enquiry sent!</p>
            <p className="text-[10px] text-stone-400 font-roboto mt-0.5">We&apos;ll be in touch shortly.</p>
          </div>
        ) : (
          <form data-readdy-form id="listings-sidebar-enquiry" onSubmit={handleSubmit} className="space-y-2">
            {error && <p className="text-[10px] text-red-500 font-roboto bg-red-50 px-2 py-1.5 rounded-sm">{error}</p>}
            <input
              type="text" name="name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name" required
              className="w-full border border-stone-200 rounded-sm px-2.5 py-1.5 text-[11px] font-roboto text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-primary"
            />
            <input
              type="email" name="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address" required
              className="w-full border border-stone-200 rounded-sm px-2.5 py-1.5 text-[11px] font-roboto text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-primary"
            />
            <input
              type="tel" name="phone" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
              className="w-full border border-stone-200 rounded-sm px-2.5 py-1.5 text-[11px] font-roboto text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-primary"
            />
            <textarea
              name="message" value={form.message}
              onChange={(e) => { if (e.target.value.length <= 500) setForm({ ...form, message: e.target.value }); }}
              placeholder="I am looking for..." rows={2} maxLength={500}
              className="w-full border border-stone-200 rounded-sm px-2.5 py-1.5 text-[11px] font-roboto text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-primary resize-none"
            />
            <button
              type="submit" disabled={submitting}
              className="w-full py-2 bg-primary text-white text-[10px] font-roboto font-semibold uppercase tracking-widest rounded-sm hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </Widget>
  );
}

// ─── Widget: Need Help CTA ────────────────────────────────────────────────────
function NeedHelpWidget() {
  return (
    <div className="bg-primary rounded-sm overflow-hidden">
      <div className="p-4 text-center">
        <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full mx-auto mb-2">
          <i className="ri-customer-service-2-line text-white text-sm" />
        </div>
        <h3 className="text-xs font-prata text-white mb-1">Need Help?</h3>
        <p className="text-white/60 text-[10px] font-roboto leading-relaxed mb-3">
          Our agents are ready to help you find the perfect property.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1 px-4 py-1.5 bg-golden text-white text-[10px] font-roboto font-semibold uppercase tracking-wider rounded-sm hover:bg-golden/90 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-phone-line text-[10px]" />
          Talk to an Agent
        </Link>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export interface SidebarWidgetsProps {
  activeBeds: string;
  onBedsChange: (beds: string) => void;
  activeType: string;
  onTypeChange: (type: string) => void;
  activeBracket: string;
  onBracketChange: (label: string) => void;
  activeArea: string;
  onAreaChange: (area: string) => void;
  typeOptions: string[];
  priceBrackets: { label: string }[];
  neighborhoods: { id: string; name: string; slug: string }[];
}

export default function ListingsSidebarWidgets({
  activeBeds, onBedsChange,
  activeType, onTypeChange,
  activeBracket, onBracketChange,
  activeArea, onAreaChange,
  typeOptions, priceBrackets, neighborhoods,
}: SidebarWidgetsProps) {
  return (
    <aside className="flex flex-col gap-3 w-full">
      <FeaturedPropertiesWidget />
      <PropertyTypesWidget activeType={activeType} onSelect={onTypeChange} types={typeOptions} />
      <PriceRangeWidget activeBracket={activeBracket} brackets={priceBrackets} onSelect={onBracketChange} />
      {neighborhoods.length > 0 && (
        <NeighbourhoodsWidget
          neighborhoods={neighborhoods}
          activeArea={activeArea}
          onSelect={onAreaChange}
        />
      )}
      <RecentlyViewedWidget />
      <EnquiryWidget />
      <NeedHelpWidget />
    </aside>
  );
}
