import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import GlobalContactStrip from '@/components/feature/GlobalContactStrip';
import AgentListingCard from './components/AgentListingCard';
import { AgentProfileSEO } from '@/components/feature/PageSEO';
import LogoLoading from '@/components/base/LogoLoading';

interface Agent {
  id: string;
  full_name: string;
  title?: string;
  bio?: string;
  photo?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  social_links?: Record<string, string>;
  active?: boolean;
  created_at?: string;
}

interface Listing {
  id: string;
  slug: string;
  title: string;
  cover_image?: string | null;
  price?: number | null;
  currency?: string;
  price_frequency?: string;
  location?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size_sqm?: number | null;
  purpose?: string;
  status?: string;
}

const HERO_IMG =
  'https://readdy.ai/api/search-image?query=luxury%20residential%20mansion%20with%20manicured%20tropical%20garden%20swimming%20pool%20modern%20architecture%20Kampala%20Uganda%20warm%20golden%20afternoon%20light%20lush%20green%20landscape%20pristine%20clean%20editorial%20photography%20wide%20angle&width=1600&height=480&seq=agentprofilehero1&orientation=landscape';

export default function AgentPublicProfile() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('sale');
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const [agentRes, listingsRes] = await Promise.all([
        supabase.from('agents').select('*').eq('id', id).maybeSingle(),
        supabase
          .from('listings')
          .select('id,slug,title,cover_image,price,currency,price_frequency,location,bedrooms,bathrooms,size_sqm,purpose,status')
          .eq('agent_id', id)
          .order('display_order', { ascending: true })
          .limit(24),
      ]);
      setAgent(agentRes.data);
      setListings(listingsRes.data ?? []);
      setLoading(false);
    };
    load();
  }, [id]);

  const saleListings = listings.filter((l) => l.purpose === 'sale');
  const rentListings = listings.filter((l) => l.purpose === 'rent');
  const displayListings = activeTab === 'sale' ? saleListings : rentListings;

  const joinedYear = agent?.created_at
    ? new Date(agent.created_at).getFullYear()
    : null;

  const bioText = agent?.bio ?? '';
  const bioShort = bioText.length > 280;
  const bioDisplay = bioShort && !bioExpanded ? bioText.slice(0, 280) + '…' : bioText;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
        <LogoLoading label="Loading profile…" size={64} />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-32" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="text-center">
            <p
              className="text-[#0f0f0f] text-3xl font-light mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Agent not found
            </p>
            <p className="text-[#aaa] text-[13px] mb-6">This profile doesn&apos;t exist or has been removed.</p>
            <Link to="/" className="text-[12px] font-medium text-[#0f0f0f] border-b border-[#0f0f0f] pb-px hover:text-[#D5A91C] hover:border-[#D5A91C] transition-colors cursor-pointer">
              Back to home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AgentProfileSEO
        name={agent.full_name}
        title={agent.title}
        bio={agent.bio}
        photo={agent.photo}
        agentId={id ?? ''}
      />
      <Navbar />

      {/* ── Hero cover image ── */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden bg-[#111] mt-[88px]">
        <img
          src={HERO_IMG}
          alt="Agency cover"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* ── Profile header ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Identity strip */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-10 mb-8 relative z-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white bg-[#f5f3ef] shrink-0 flex items-center justify-center">
            {agent.photo ? (
              <img src={agent.photo} alt={agent.full_name} className="w-full h-full object-cover" />
            ) : (
              <span
                className="text-[#aaa] text-3xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {agent.full_name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <p className="text-[#999] text-[11px] mb-1">Real Estate Agent · Oceans Uganda</p>
            <h1
              className="text-[#0f0f0f] font-light leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px' }}
            >
              {agent.full_name}
            </h1>
            {agent.title && (
              <p className="text-[#aaa] text-[12px] mt-0.5">{agent.title}</p>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2 pb-1 shrink-0">
            {agent.phone && (
              <a
                href={`tel:${agent.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0f0f0f] hover:bg-[#222] text-white text-[12px] font-medium tracking-wide rounded transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-phone-line text-sm" />
                Call
              </a>
            )}
            {agent.email && (
              <a
                href={`mailto:${agent.email}`}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#ddd] hover:border-[#aaa] text-[#0f0f0f] text-[12px] font-medium tracking-wide rounded transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-mail-line text-sm" />
                Message
              </a>
            )}
            {agent.whatsapp && (
              <a
                href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-[#ddd] hover:border-[#25D366] hover:text-[#25D366] text-[#888] rounded transition-colors cursor-pointer"
              >
                <i className="ri-whatsapp-line text-base" />
              </a>
            )}
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="flex flex-wrap items-center gap-0 border-t border-b border-[#f0ece5] py-5 mb-10">
          {[
            { label: 'Listings', value: listings.length },
            { label: 'For Sale', value: saleListings.length },
            { label: 'For Rent', value: rentListings.length },
            ...(joinedYear ? [{ label: 'Member since', value: joinedYear }] : []),
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              className={`flex flex-col px-8 ${i === 0 ? 'pl-0' : ''} ${i < arr.length - 1 ? 'border-r border-[#f0ece5]' : ''}`}
            >
              <span
                className="text-[#0f0f0f] text-2xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {stat.value}
              </span>
              <span className="text-[#bbb] text-[10px] tracking-[0.12em] uppercase mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}

          {/* Social links pushed right */}
          <div className="ml-auto flex items-center gap-2">
            {agent.social_links?.linkedin && (
              <a href={agent.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-[#e8e3db] rounded hover:border-[#aaa] text-[#aaa] hover:text-[#0f0f0f] transition-colors cursor-pointer">
                <i className="ri-linkedin-line text-sm" />
              </a>
            )}
            {agent.social_links?.instagram && (
              <a href={agent.social_links.instagram} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-[#e8e3db] rounded hover:border-[#aaa] text-[#aaa] hover:text-[#0f0f0f] transition-colors cursor-pointer">
                <i className="ri-instagram-line text-sm" />
              </a>
            )}
          </div>
        </div>

        {/* ── About ── */}
        {bioText && (
          <div className="mb-12 max-w-2xl">
            <h2
              className="text-[#0f0f0f] font-light mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px' }}
            >
              About
            </h2>
            <p className="text-[#555] text-[13px] leading-[1.85]">{bioDisplay}</p>
            {bioShort && (
              <button
                type="button"
                onClick={() => setBioExpanded((v) => !v)}
                className="mt-3 text-[12px] font-medium text-[#0f0f0f] border-b border-[#0f0f0f] pb-px hover:text-[#D5A91C] hover:border-[#D5A91C] transition-colors cursor-pointer whitespace-nowrap"
              >
                {bioExpanded ? 'show less' : 'view more'}
              </button>
            )}
          </div>
        )}

        {/* Contact info row */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12 pb-10 border-b border-[#f0ece5] text-[12px] text-[#555]">
          {agent.email && (
            <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-[#0f0f0f] transition-colors cursor-pointer">
              <i className="ri-mail-line text-[#bbb]" />
              {agent.email}
            </a>
          )}
          {agent.phone && (
            <a href={`tel:${agent.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-[#0f0f0f] transition-colors cursor-pointer">
              <i className="ri-phone-line text-[#bbb]" />
              {agent.phone}
            </a>
          )}
        </div>

        {/* ── Listings ── */}
        <div className="mb-16">
          <h2
            className="text-[#0f0f0f] font-light mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px' }}
          >
            Listings
          </h2>

          {/* Tab switcher */}
          <div className="flex border-b border-[#f0ece5] mb-6 gap-0">
            {(['sale', 'rent'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-0 pb-3 mr-8 text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-[#0f0f0f] text-[#0f0f0f]'
                    : 'border-transparent text-[#bbb] hover:text-[#888]'
                }`}
              >
                {tab === 'sale' ? 'For Sale' : 'For Rent'}
                <span className="ml-1.5 text-[10px] font-normal text-[#bbb]">
                  {tab === 'sale' ? saleListings.length : rentListings.length}
                </span>
              </button>
            ))}
          </div>

          {displayListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#f5f3ef] mb-4">
                <i className="ri-building-4-line text-[#ccc] text-xl" />
              </div>
              <p
                className="text-[#0f0f0f] font-light text-lg mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                No {activeTab === 'sale' ? 'sale' : 'rental'} listings yet
              </p>
              <p className="text-[#bbb] text-[12px]">Check back soon for new properties.</p>
            </div>
          ) : (
            <>
              <p className="text-[#aaa] text-[11px] tracking-wide mb-5">
                {displayListings.length} listing{displayListings.length !== 1 ? 's' : ''} {activeTab === 'sale' ? 'for sale' : 'for rent'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayListings.map((l) => (
                  <AgentListingCard key={l.id} listing={l} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <GlobalContactStrip />
      <Footer />
    </div>
  );
}
