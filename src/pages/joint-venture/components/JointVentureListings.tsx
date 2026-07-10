import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandListings, JV_PURPOSE, type LandListing } from '@/hooks/useListings';
import { useCurrency } from '@/contexts/CurrencyContext';

type FilterType = 'all' | 'sale' | 'jv';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All opportunities' },
  { key: 'sale', label: 'Outright purchase' },
  { key: 'jv', label: 'Joint venture' },
];

function acreageLabel(l: LandListing): string {
  if (l.land_area) return `${l.land_area} ${l.land_area_postfix || 'acres'}`;
  if (l.size_sqm) return `${l.size_sqm.toLocaleString()} sqm`;
  return '—';
}

function locationLabel(l: LandListing): string {
  return [l.location, l.city].filter(Boolean).join(', ') || '—';
}

function isJV(l: LandListing): boolean {
  return l.purpose === JV_PURPOSE;
}

export default function JointVentureListings() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { listings, loading, error } = useLandListings();
  const { formatPrice } = useCurrency();

  const visible = filter === 'all' ? listings : listings.filter((l) => (filter === 'jv' ? isJV(l) : !isJV(l)));

  return (
    <section className="bg-off-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mb-10">
          <p className="text-golden text-xs font-roboto tracking-widest uppercase mb-3">Available Now</p>
          <h2 className="text-3xl md:text-4xl font-prata text-primary mb-4">Land on the Desk Today</h2>
          <p className="text-text-gray font-roboto text-sm leading-relaxed">
            A mix of plots for outright purchase and open joint venture opportunities, drawn live from our listings.
          </p>
        </div>

        <div className="flex gap-2.5 mb-9 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-roboto tracking-wide uppercase cursor-pointer whitespace-nowrap border transition-colors ${
                filter === f.key
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-gray border-stone-200 hover:border-primary/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-text-gray font-roboto text-sm">Loading listings…</p>
        ) : error ? (
          <p className="text-text-gray font-roboto text-sm">Couldn't load listings right now. Please try again shortly.</p>
        ) : visible.length === 0 ? (
          <p className="text-text-gray font-roboto text-sm">No land listings match this filter yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((l) => (
              <Link
                key={l.id}
                to={`/land/${l.slug}`}
                className="block bg-white border border-stone-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <span className="font-roboto text-[11px] text-text-gray tracking-wide">LAND/{l.id.slice(0, 8).toUpperCase()}</span>
                <div>
                  <span
                    className={`inline-block mt-2.5 px-2.5 py-1 rounded-sm text-[11px] font-roboto font-semibold uppercase tracking-widest ${
                      isJV(l) ? 'bg-golden/15 text-golden-dark' : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {isJV(l) ? 'JV Opportunity' : 'For Sale'}
                  </span>
                </div>
                <h4 className="font-prata text-xl text-primary mt-3.5">{l.title}</h4>
                <p className="text-text-gray font-roboto text-sm mt-1">{locationLabel(l)}</p>
                <hr className="border-0 border-t border-dashed border-stone-200 my-4" />
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="block text-[11px] text-text-gray uppercase tracking-wide font-roboto">Acreage</span>
                    <span className="block font-roboto text-primary text-sm mt-0.5">{acreageLabel(l)}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-text-gray uppercase tracking-wide font-roboto">Title</span>
                    <span className="block font-roboto text-primary text-sm mt-0.5">{l.tenure || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-text-gray uppercase tracking-wide font-roboto">Ask</span>
                    <span className="block font-roboto text-primary text-sm mt-0.5">
                      {isJV(l) ? l.jv_structure || 'JV structure' : formatPrice(l.price, l.currency, { note: l.price_note, purpose: 'sale' })}
                    </span>
                  </div>
                </div>
                {l.short_description && (
                  <p className="text-text-gray font-roboto text-sm leading-relaxed mt-3.5">{l.short_description}</p>
                )}
                <span className="mt-5 block text-center px-4 py-2.5 border border-primary/25 text-primary font-roboto text-xs tracking-widest uppercase whitespace-nowrap hover:bg-primary hover:text-white transition-colors">
                  View This Plot
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
