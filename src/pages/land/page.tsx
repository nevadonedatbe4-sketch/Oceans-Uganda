import { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import LogoLoading from '@/components/base/LogoLoading';
import { supabase } from '@/lib/supabase';
import { useCurrency } from '@/contexts/CurrencyContext';
import { JV_PURPOSE } from '@/hooks/useListings';
import { LandDetailSEO } from '@/components/feature/PageSEO';

interface LandDetail {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  city: string | null;
  country: string | null;
  price: number | null;
  currency: string;
  price_note: string | null;
  purpose: string;
  land_area: number | null;
  land_area_postfix: string | null;
  size_sqm: number | null;
  cover_image: string | null;
  short_description: string | null;
  full_description: string | null;
  jv_structure: string | null;
  tenure: string | null;
  featured: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80';

export default function LandDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { formatPrice } = useCurrency();

  const [listing, setListing] = useState<LandDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      setNotFound(false);

      const { data: l } = await supabase
        .from('listings')
        .select('id, title, slug, location, city, country, price, currency, price_note, purpose, land_area, land_area_postfix, size_sqm, cover_image, short_description, full_description, jv_structure, tenure, featured')
        .eq('slug', slug)
        .eq('property_type', 'Land')
        .eq('status', 'published')
        .maybeSingle();

      if (!l) { setNotFound(true); setLoading(false); return; }
      const listingData = l as LandDetail;
      setListing(listingData);
      setForm((f) => ({ ...f, message: `Hello, I'm interested in ${listingData.title}. Please get in touch with me.` }));

      const [imgsRes, amnsRes] = await Promise.all([
        supabase.from('listing_images').select('url, is_cover, sort_order').eq('listing_id', listingData.id).order('sort_order'),
        supabase.from('listing_amenities').select('amenity').eq('listing_id', listingData.id),
      ]);

      const imgRows = (imgsRes.data ?? []) as { url: string; is_cover: boolean; sort_order: number }[];
      const galleryUrls = imgRows.map((r) => r.url).filter(Boolean);
      const cover = imgRows.find((r) => r.is_cover)?.url || listingData.cover_image;
      const allImages = cover ? [cover, ...galleryUrls.filter((u) => u !== cover)] : galleryUrls;
      setImages(allImages.length ? allImages : [FALLBACK_IMAGE]);

      setAmenities((amnsRes.data ?? []).map((r: { amenity: string }) => r.amenity));

      setLoading(false);
    }
    fetchListing();
  }, [slug]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    if (!form.name.trim() || !form.phone.trim()) { setError('Name and phone are required.'); return; }
    setError('');
    setSubmitting(true);

    const { error: insertError } = await supabase.from('leads').insert({
      lead_name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      listing_id: listing.id,
      source_page: `Land Detail — ${listing.title}`,
      message: form.message || null,
      stage: 'new',
      inquiry_type: listing.purpose === JV_PURPOSE ? 'joint_venture_investor' : 'land_enquiry',
      property_title: listing.title,
    });

    setSubmitting(false);
    if (insertError) { setError(insertError.message); return; }
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <LogoLoading label="Loading land listing…" size={72} />
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />
        <div className="pt-[88px] md:pt-[96px] flex flex-col items-center justify-center py-32 px-6 text-center">
          <h1 className="font-prata text-2xl text-primary mb-3">Listing Not Found</h1>
          <p className="text-text-gray font-roboto text-sm mb-8">This land listing may have been removed or the link is incorrect.</p>
          <Link to="/joint-venture" className="px-6 py-3 bg-golden text-primary font-roboto text-xs tracking-widest uppercase font-semibold hover:bg-golden-light transition-colors">
            Back to Joint Ventures
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const acreage = listing.land_area
    ? `${listing.land_area} ${listing.land_area_postfix || 'acres'}`
    : listing.size_sqm
      ? `${listing.size_sqm.toLocaleString()} sqm`
      : '—';

  const listingIsJV = listing.purpose === JV_PURPOSE;

  const askDisplay = listingIsJV
    ? listing.jv_structure || 'Joint venture'
    : formatPrice(listing.price, listing.currency, { note: listing.price_note, purpose: 'sale' });

  const fullLocation = [listing.location, listing.city, listing.country].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-off-white">
      <LandDetailSEO listing={listing} location={fullLocation} image={images[0]} askDisplay={askDisplay} />
      <Navbar />

      {/* Page wrapper — push content down past the fixed navbar */}
      <div className="pt-[88px] md:pt-[96px]">

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-6 text-xs font-roboto text-text-gray">
        <Link to="/joint-venture" className="hover:text-primary transition-colors">Joint Ventures</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{listing.title}</span>
      </div>

      {/* Hero image */}
      <div className="max-w-6xl mx-auto px-6 mt-4">
        <div className="relative border border-stone-200 overflow-hidden">
          <img src={images[0]} alt={listing.title} className="w-full h-[320px] md:h-[440px] object-cover" />
          <span
            className={`absolute top-4 left-4 px-3 py-1.5 rounded-sm text-[11px] font-roboto font-semibold uppercase tracking-widest ${
              listingIsJV ? 'bg-golden text-primary' : 'bg-accent text-white'
            }`}
          >
            {listingIsJV ? 'JV Opportunity' : 'For Sale'}
          </span>
        </div>
        {images.length > 1 && (
          <div className="flex gap-3 mt-3 overflow-x-auto">
            {images.slice(1, 6).map((img) => (
              <img key={img} src={img} alt={listing.title} className="w-28 h-20 object-cover border border-stone-200 shrink-0" />
            ))}
          </div>
        )}
      </div>

      {/* Title + stats + body */}
      <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start pb-20">
        <div className="min-w-0">
          <h1 className="font-prata text-3xl md:text-4xl text-primary">{listing.title}</h1>
          {fullLocation && (
            <p className="text-text-gray font-roboto text-sm mt-2 flex items-center gap-1.5">
              <i className="ri-map-pin-2-line" />
              {fullLocation}
            </p>
          )}

          <div className="grid grid-cols-3 gap-4 mt-8 border border-stone-200 divide-x divide-stone-200 bg-white">
            <div className="p-5">
              <span className="block text-[11px] text-text-gray uppercase tracking-wide font-roboto">Acreage</span>
              <span className="block font-prata text-lg text-primary mt-1">{acreage}</span>
            </div>
            <div className="p-5">
              <span className="block text-[11px] text-text-gray uppercase tracking-wide font-roboto">Title</span>
              <span className="block font-prata text-lg text-primary mt-1">{listing.tenure || '—'}</span>
            </div>
            <div className="p-5">
              <span className="block text-[11px] text-text-gray uppercase tracking-wide font-roboto">Ask</span>
              <span className="block font-prata text-lg text-primary mt-1">{askDisplay}</span>
            </div>
          </div>

          {(listing.full_description || listing.short_description) && (
            <div className="mt-10">
              <h2 className="font-prata text-xl text-primary mb-3">About This Plot</h2>
              <p className="text-text-gray font-roboto text-sm leading-relaxed whitespace-pre-line">
                {listing.full_description || listing.short_description}
              </p>
            </div>
          )}

          {amenities.length > 0 && (
            <div className="mt-10">
              <h2 className="font-prata text-xl text-primary mb-3">Site Features</h2>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-text-gray font-roboto text-sm">
                {amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <i className="ri-checkbox-circle-line text-golden" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Enquiry panel */}
        <div className="lg:sticky lg:top-[110px] bg-primary p-7">
          <h3 className="font-prata text-xl text-white mb-2">
            {listingIsJV ? 'Enquire About This JV' : 'Enquire About This Plot'}
          </h3>
          <p className="text-white/60 font-roboto text-xs mb-5 leading-relaxed">
            A member of the Oceans Uganda land team will respond within 48 hours.
          </p>

          {submitted ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 flex items-center justify-center bg-golden/15 rounded-full mx-auto mb-3">
                <i className="ri-check-double-line text-golden text-xl" />
              </div>
              <p className="text-white font-roboto text-sm">Enquiry received. We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <input
                type="text" required placeholder="Full name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 px-4 bg-white/[0.06] border border-white/15 text-white placeholder:text-white/35 text-sm font-roboto focus:outline-none focus:border-golden transition-colors rounded-sm"
              />
              <input
                type="tel" required placeholder="Phone / WhatsApp" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full h-11 px-4 bg-white/[0.06] border border-white/15 text-white placeholder:text-white/35 text-sm font-roboto focus:outline-none focus:border-golden transition-colors rounded-sm"
              />
              <input
                type="email" placeholder="Email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 px-4 bg-white/[0.06] border border-white/15 text-white placeholder:text-white/35 text-sm font-roboto focus:outline-none focus:border-golden transition-colors rounded-sm"
              />
              <textarea
                rows={3} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.06] border border-white/15 text-white placeholder:text-white/35 text-sm font-roboto focus:outline-none focus:border-golden transition-colors rounded-sm resize-none"
              />
              {error && <p className="text-red-300 text-xs font-roboto">{error}</p>}
              <button
                type="submit" disabled={submitting}
                className="w-full px-6 py-3.5 bg-golden text-primary font-roboto text-xs tracking-widest uppercase font-semibold hover:bg-golden-light transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Send Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>

      </div>

      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
