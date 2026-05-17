import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface FavProperty {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  price: number | null;
  currency: string;
  cover_image: string | null;
  status: string;
  purpose: string;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  featured: boolean;
}

function formatPrice(price: number | null, currency: string): string {
  if (!price) return 'POA';
  const sym = currency === 'USD' ? '$' : currency === 'UGX' ? 'UGX ' : currency + ' ';
  if (price >= 1_000_000) return `${sym}${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${sym}${(price / 1_000).toFixed(0)}K`;
  return `${sym}${price.toLocaleString()}`;
}

export default function AdminFavorites() {
  const [properties, setProperties] = useState<FavProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc'>('recent');
  const [filterPurpose, setFilterPurpose] = useState<'all' | 'rent' | 'sale'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('listings')
      .select('id, title, slug, location, price, currency, cover_image, status, purpose, property_type, bedrooms, bathrooms, area_sqft, featured')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(24);
    setProperties((data as FavProperty[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRemove = (id: string) => {
    setRemoved((prev) => new Set([...prev, id]));
  };

  let displayed = properties.filter((p) => !removed.has(p.id));
  if (filterPurpose !== 'all') displayed = displayed.filter((p) => p.purpose === filterPurpose);
  if (sortBy === 'price_asc') displayed = [...displayed].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (sortBy === 'price_desc') displayed = [...displayed].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

  return (
    <div className="space-y-6 max-w-[1280px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-jost font-bold text-[#0d1f2d]">Favourites</h1>
          <p className="text-sm text-[#7a8a99] mt-0.5">Featured &amp; starred properties in your portfolio</p>
        </div>
        <Link
          to="/admin/listings"
          className="flex items-center gap-2 px-4 py-2 bg-[#0d1f2d] text-white text-sm font-semibold rounded-lg hover:bg-[#1a3448] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line" /> Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white border border-[#e8edf2] rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7a8a99] font-medium">Filter:</span>
          {(['all', 'rent', 'sale'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterPurpose(v)}
              className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors whitespace-nowrap ${
                filterPurpose === v ? 'bg-[#0d1f2d] text-white' : 'bg-[#f0f4f8] text-[#7a8a99] hover:bg-[#e8edf2]'
              }`}
            >
              {v === 'all' ? 'All' : v === 'rent' ? 'For Rent' : 'For Sale'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7a8a99] font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs border border-[#e8edf2] rounded-lg px-3 py-1.5 bg-white text-[#0d1f2d] focus:outline-none focus:border-[#D5A91C] cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
        <span className="text-xs text-[#7a8a99]">{displayed.length} properties</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0d1f2d] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="bg-white border border-[#e8edf2] rounded-xl py-20 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#f0f4f8] flex items-center justify-center">
            <i className="ri-heart-3-line text-2xl text-[#D5A91C]" />
          </div>
          <p className="text-sm font-bold text-[#0d1f2d]">No favourites yet</p>
          <p className="text-xs text-[#7a8a99] max-w-xs">Mark properties as Featured in the listings manager to see them here.</p>
          <Link to="/admin/listings" className="mt-2 px-4 py-2 bg-[#0d1f2d] text-white text-xs font-semibold rounded-lg cursor-pointer">
            Go to Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayed.map((p) => (
            <div key={p.id} className="bg-white border border-[#e8edf2] rounded-xl overflow-hidden group hover:border-[#D5A91C]/40 transition-all">
              {/* Image */}
              <div className="relative w-full h-44 bg-[#f0f4f8] overflow-hidden">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="ri-building-2-line text-3xl text-[#e8edf2]" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${p.purpose === 'rent' ? 'bg-sky-600 text-white' : 'bg-amber-600 text-white'}`}>
                    {p.purpose === 'rent' ? 'RENT' : 'SALE'}
                  </span>
                  {p.status !== 'published' && p.status && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white capitalize">{p.status}</span>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="w-6 h-6 rounded-full bg-[#D5A91C] flex items-center justify-center">
                    <i className="ri-star-fill text-white text-[10px]" />
                  </span>
                </div>
                {/* Remove favourite */}
                <button
                  onClick={() => handleRemove(p.id)}
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Remove from favourites"
                >
                  <i className="ri-heart-fill text-xs" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3.5">
                <p className="text-sm font-bold text-[#0d1f2d] truncate mb-0.5">{p.title}</p>
                <p className="text-xs text-[#7a8a99] flex items-center gap-1 truncate mb-2">
                  <i className="ri-map-pin-2-line text-[#D5A91C]" />
                  {p.location ?? 'Kampala, Uganda'}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-[#7a8a99] mb-3">
                  {p.bedrooms && <span className="flex items-center gap-1"><i className="ri-hotel-bed-line" />{p.bedrooms} bed</span>}
                  {p.bathrooms && <span className="flex items-center gap-1"><i className="ri-showers-line" />{p.bathrooms} bath</span>}
                  {p.area_sqft && <span className="flex items-center gap-1"><i className="ri-aspect-ratio-line" />{p.area_sqft.toLocaleString()} sqft</span>}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#D5A91C]">
                    {formatPrice(p.price, p.currency)}
                    {p.purpose === 'rent' && <span className="text-[10px] text-[#7a8a99] font-normal">/mo</span>}
                  </p>
                  <Link
                    to={`/admin/listings/${p.id}`}
                    className="text-[11px] text-[#0d1f2d] font-semibold hover:text-[#D5A91C] transition-colors cursor-pointer"
                  >
                    Edit <i className="ri-arrow-right-line" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
