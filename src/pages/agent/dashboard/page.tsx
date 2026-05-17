import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Stats {
  listings: number;
  leads: number;
  activeListings: number;
  views: number;
}

export default function AgentDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({ listings: 0, leads: 0, activeListings: 0, views: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [listingsRes, leadsRes] = await Promise.all([
          supabase
            .from('listings')
            .select('id, title, status, price, created_at, main_image, location')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('leads')
            .select('id, name, email, phone, status, created_at, property_interest')
            .order('created_at', { ascending: false })
            .limit(6),
        ]);

        const listings = listingsRes.data ?? [];
        const leads = leadsRes.data ?? [];

        setStats({
          listings: listings.length,
          leads: leads.length,
          activeListings: listings.filter((l: any) => l.status === 'active').length,
          views: 0,
        });
        setRecentListings(listings);
        setRecentLeads(leads);
      } catch {
        // silent fail
      } finally {
        setLoadingStats(false);
      }
    };
    load();
  }, []);

  const leadStatusConfig: Record<string, { label: string; color: string; dot: string }> = {
    new: { label: 'New', color: 'text-[#D5A91C]', dot: 'bg-[#D5A91C]' },
    contacted: { label: 'Contacted', color: 'text-[#888]', dot: 'bg-[#888]' },
    qualified: { label: 'Qualified', color: 'text-emerald-600', dot: 'bg-emerald-500' },
    viewing: { label: 'Viewing', color: 'text-[#8b6fc7]', dot: 'bg-[#8b6fc7]' },
    closed: { label: 'Closed', color: 'text-[#aaa]', dot: 'bg-[#aaa]' },
  };

  const listingStatusConfig: Record<string, { label: string; color: string }> = {
    active: { label: 'Active', color: 'text-emerald-600' },
    draft: { label: 'Draft', color: 'text-[#888]' },
    sold: { label: 'Sold', color: 'text-[#D5A91C]' },
    rented: { label: 'Rented', color: 'text-[#8b6fc7]' },
    expired: { label: 'Expired', color: 'text-red-400' },
  };

  const kpis = [
    {
      label: 'Total Listings',
      value: stats.listings,
      change: '+2 this month',
      icon: 'ri-building-4-line',
      link: '/agent/listings',
      accent: false,
    },
    {
      label: 'Active',
      value: stats.activeListings,
      change: 'Live on site',
      icon: 'ri-checkbox-circle-line',
      link: '/agent/listings',
      accent: false,
    },
    {
      label: 'Total Leads',
      value: stats.leads,
      change: '+3 this week',
      icon: 'ri-user-received-2-line',
      link: '/agent/leads',
      accent: true,
    },
    {
      label: 'Page Views',
      value: '—',
      change: 'Analytics soon',
      icon: 'ri-eye-line',
      link: '/agent/performance',
      accent: false,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Top header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 lg:mb-10">
        <div>
          <p className="text-[#D5A91C] text-[10px] font-semibold tracking-[0.22em] uppercase mb-1.5">
            {greeting}
          </p>
          <h1 className="text-[#0f0f0f] font-jost text-2xl lg:text-3xl font-semibold tracking-tight leading-tight">
            {profile?.full_name ?? 'Agent'}
          </h1>
          <p className="text-[#999] text-[12px] mt-1 tracking-wide">{dateStr}</p>
        </div>

        <div className="flex items-center gap-2.5 sm:mt-1">
          {profile?.status === 'active' && (
            <Link
              to="/agent/listings"
              className="flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] hover:bg-[#222] text-white text-[12px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap tracking-wide"
            >
              <i className="ri-add-line text-sm" />
              New Listing
            </Link>
          )}
          <Link
            to="/agent/profile"
            className="w-9 h-9 flex items-center justify-center bg-white border border-[#ebebeb] rounded hover:border-[#D5A91C]/40 transition-colors cursor-pointer"
          >
            <i className="ri-user-settings-line text-sm text-[#555]" />
          </Link>
        </div>
      </div>

      {/* ── Pending state ── */}
      {profile?.status === 'pending' && (
        <div className="border border-[#D5A91C]/25 bg-[#fffbf2] rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 flex items-start gap-3 lg:gap-4">
          <div className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded-full bg-[#D5A91C]/10 shrink-0 mt-0.5">
            <i className="ri-time-line text-[#D5A91C] text-base" />
          </div>
          <div>
            <p className="text-[#0f0f0f] font-semibold text-sm mb-1">Account under review</p>
            <p className="text-[#888] text-[12px] leading-relaxed">
              Your application has been submitted. Our team will review it and activate your account within 1–2 business days.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#D5A91C]">
                <i className="ri-checkbox-circle-line" /> Application submitted
              </span>
              <span className="hidden sm:inline text-[#bbb]">·</span>
              <span className="flex items-center gap-1.5 text-[#bbb]">
                <i className="ri-time-line" /> Pending admin review
              </span>
              <span className="hidden sm:inline text-[#bbb]">·</span>
              <span className="flex items-center gap-1.5 text-[#bbb]">
                <i className="ri-lock-line" /> Account activation
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#ebebeb] border border-[#ebebeb] rounded-lg overflow-hidden mb-6 lg:mb-8">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            to={kpi.link}
            className="bg-white hover:bg-[#fafafa] transition-colors cursor-pointer p-4 lg:p-6 flex flex-col gap-2 lg:gap-3"
          >
            <div className="flex items-center justify-between">
              <div className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded ${kpi.accent ? 'bg-[#D5A91C]/10' : 'bg-[#f5f5f5]'}`}>
                <i className={`${kpi.icon} text-sm ${kpi.accent ? 'text-[#D5A91C]' : 'text-[#888]'}`} />
              </div>
              <i className="ri-arrow-right-up-line text-[#ccc] text-xs" />
            </div>
            <div>
              <p className="text-[#0f0f0f] text-2xl lg:text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {loadingStats ? '—' : kpi.value}
              </p>
              <p className="text-[#999] text-[11px] mt-0.5 tracking-wide">{kpi.label}</p>
            </div>
            <p className="text-[#D5A91C] text-[10px] font-medium tracking-wide">{kpi.change}</p>
          </Link>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 mb-4 lg:mb-6">

        {/* Recent listings panel */}
        <div className="lg:col-span-3 bg-white border border-[#ebebeb] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-[#ebebeb]">
            <div>
              <p className="text-[#0f0f0f] font-semibold text-[13px] tracking-wide">Recent Listings</p>
              <p className="text-[#bbb] text-[10px] mt-0.5 tracking-wider uppercase">
                {stats.listings} total
              </p>
            </div>
            <Link
              to="/agent/listings"
              className="flex items-center gap-1.5 text-[11px] text-[#D5A91C] hover:text-[#b8943d] font-medium tracking-wide cursor-pointer whitespace-nowrap transition-colors"
            >
              View all <i className="ri-arrow-right-line text-xs" />
            </Link>
          </div>

          {loadingStats ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#e5e0d8] border-t-[#D5A91C] rounded-full animate-spin" />
            </div>
          ) : recentListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f5f5f5] mb-4">
                <i className="ri-building-4-line text-[#ccc] text-xl" />
              </div>
              <p className="text-[#0f0f0f] font-medium text-sm mb-1.5">No listings yet</p>
              <p className="text-[#bbb] text-xs leading-relaxed mb-5 max-w-[220px]">
                Start adding your properties to reach buyers and renters.
              </p>
              {profile?.status === 'active' && (
                <Link
                  to="/agent/listings"
                  className="px-4 py-2 bg-[#0f0f0f] text-white text-xs rounded tracking-wide hover:bg-[#222] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add first listing
                </Link>
              )}
            </div>
          ) : (
            <div>
              {recentListings.map((listing, idx) => {
                const sc = listingStatusConfig[listing.status] ?? { label: listing.status, color: 'text-[#888]' };
                return (
                  <div
                    key={listing.id}
                    className={`flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 hover:bg-[#fafafa] transition-colors ${idx < recentListings.length - 1 ? 'border-b border-[#ebebeb]' : ''}`}
                  >
                    <div className="w-12 h-9 lg:w-14 lg:h-11 rounded overflow-hidden bg-[#f5f5f5] shrink-0">
                      {listing.main_image ? (
                        <img src={listing.main_image} alt="" className="w-full h-full object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="ri-image-line text-[#ccc] text-sm" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0f0f0f] text-[13px] font-medium truncate">{listing.title}</p>
                      <p className="text-[#aaa] text-[11px] mt-0.5 truncate">
                        {listing.location ?? 'Location not set'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[#0f0f0f] text-[12px] lg:text-[13px] font-medium">
                        {listing.price ? `$${Number(listing.price).toLocaleString()}` : '—'}
                      </p>
                      <p className={`text-[10px] font-medium mt-0.5 ${sc.color}`}>{sc.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent leads panel */}
        <div className="lg:col-span-2 bg-white border border-[#ebebeb] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-[#ebebeb]">
            <div>
              <p className="text-[#0f0f0f] font-semibold text-[13px] tracking-wide">Leads</p>
              <p className="text-[#bbb] text-[10px] mt-0.5 tracking-wider uppercase">
                {stats.leads} total
              </p>
            </div>
            <Link
              to="/agent/leads"
              className="flex items-center gap-1.5 text-[11px] text-[#D5A91C] hover:text-[#b8943d] font-medium tracking-wide cursor-pointer whitespace-nowrap transition-colors"
            >
              View all <i className="ri-arrow-right-line text-xs" />
            </Link>
          </div>

          {loadingStats ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#e5e0d8] border-t-[#D5A91C] rounded-full animate-spin" />
            </div>
          ) : recentLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#f5f5f5] mb-4">
                <i className="ri-user-received-2-line text-[#ccc] text-xl" />
              </div>
              <p className="text-[#0f0f0f] font-medium text-sm mb-1.5">No leads yet</p>
              <p className="text-[#bbb] text-xs leading-relaxed max-w-[200px]">
                Enquiries from your listings will appear here.
              </p>
            </div>
          ) : (
            <div>
              {recentLeads.map((lead, idx) => {
                const sc = leadStatusConfig[lead.status] ?? { label: lead.status, color: 'text-[#888]', dot: 'bg-[#888]' };
                return (
                  <div
                    key={lead.id}
                    className={`px-4 lg:px-6 py-3 lg:py-4 hover:bg-[#fafafa] transition-colors ${idx < recentLeads.length - 1 ? 'border-b border-[#ebebeb]' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#f5f5f5] flex items-center justify-center shrink-0">
                        <span className="text-[#888] text-[10px] font-semibold">
                          {lead.name?.charAt(0)?.toUpperCase() ?? 'L'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0f0f0f] text-[12px] font-medium truncate">{lead.name}</p>
                        <p className="text-[#bbb] text-[10px] truncate mt-0.5">
                          {lead.property_interest ?? lead.email ?? lead.phone ?? 'No info'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        <span className={`text-[10px] font-medium ${sc.color}`}>{sc.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom quick-action strip ── */}
      <div className="bg-white border border-[#ebebeb] rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#ebebeb]">
          {[
            {
              icon: 'ri-add-circle-line',
              label: 'Add New Listing',
              desc: 'Publish a new property',
              to: '/agent/listings',
              gold: false,
            },
            {
              icon: 'ri-user-received-2-line',
              label: 'View All Leads',
              desc: 'Manage your pipeline',
              to: '/agent/leads',
              gold: false,
            },
            {
              icon: 'ri-calendar-check-line',
              label: 'Viewings',
              desc: 'Schedule appointments',
              to: '/agent/viewings',
              gold: false,
            },
            {
              icon: 'ri-user-settings-line',
              label: 'Edit Profile',
              desc: 'Update your agent info',
              to: '/agent/profile',
              gold: true,
            },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-4 lg:py-5 hover:bg-[#fafafa] transition-colors cursor-pointer group"
            >
              <div className={`w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded shrink-0 ${item.gold ? 'bg-[#D5A91C]/10' : 'bg-[#f5f5f5]'} group-hover:scale-105 transition-transform`}>
                <i className={`${item.icon} text-sm ${item.gold ? 'text-[#D5A91C]' : 'text-[#888]'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[#0f0f0f] text-[11px] lg:text-[12px] font-semibold truncate">{item.label}</p>
                <p className="text-[#bbb] text-[10px] lg:text-[11px] truncate hidden sm:block">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
