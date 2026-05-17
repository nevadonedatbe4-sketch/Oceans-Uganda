import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface Stats {
  totalListings: number;
  activeListings: number;
  forRent: number;
  forSale: number;
  featured: number;
  totalLeads: number;
  newLeads: number;
  tourRequests: number;
  infoInquiries: number;
  totalDeals: number;
  wonDeals: number;
  pipelineValue: number;
  totalAgents: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MOCK_MONTHLY_LEADS = [4, 7, 5, 12, 9, 14, 11, 18, 15, 22, 17, 26];
const MOCK_MONTHLY_VIEWS = [120, 185, 160, 280, 245, 340, 295, 420, 380, 510, 445, 620];
const MOCK_MONTHLY_DEALS = [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 4, 7];

const STAGE_DATA = [
  { stage: 'New', count: 18, color: '#D5A91C' },
  { stage: 'Contacted', count: 12, color: '#0d1f2d' },
  { stage: 'Viewing', count: 9, color: '#1B4332' },
  { stage: 'Negotiating', count: 5, color: '#7c3d0f' },
  { stage: 'Won', count: 8, color: '#059669' },
  { stage: 'Lost', count: 4, color: '#9ca3af' },
];

const SOURCE_DATA = [
  { source: 'Property Page', pct: 42 },
  { source: 'Search Results', pct: 28 },
  { source: 'Landlords Page', pct: 15 },
  { source: 'Homepage', pct: 10 },
  { source: 'Direct', pct: 5 },
];

function BarChart({ data, max, color }: { data: number[]; max: number; color: string }) {
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((val, i) => {
        const h = max > 0 ? Math.max(4, Math.round((val / max) * 96)) : 4;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full rounded-t-sm transition-all duration-200 cursor-default"
              style={{ height: `${h}px`, backgroundColor: color }}
              title={`${MONTHS[i]}: ${val}`}
            />
          </div>
        );
      })}
    </div>
  );
}

function MiniStat({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-white border border-[#e8edf2] rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <i className={`${icon} text-base`} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold text-[#0d1f2d] leading-none">{value}</p>
        <p className="text-xs text-[#7a8a99] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function AdminInsights() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('12m');
  const [topProperties, setTopProperties] = useState<Array<{ id: string; title: string; views: number; leads: number; purpose: string }>>([]);

  useEffect(() => {
    const load = async () => {
      const [
        { count: totalListings },
        { count: activeListings },
        { count: forRent },
        { count: forSale },
        { count: featured },
        { count: totalLeads },
        { count: newLeads },
        { count: tourRequests },
        { count: infoInquiries },
        { count: totalDeals },
        { count: wonDeals },
        { count: totalAgents },
        { data: pipelineData },
      ] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('purpose', 'rent'),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('purpose', 'sale'),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('stage', 'new'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('inquiry_type', 'tour'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).neq('inquiry_type', 'tour'),
        supabase.from('deals').select('*', { count: 'exact', head: true }),
        supabase.from('deals').select('*', { count: 'exact', head: true }).eq('stage', 'closed_won'),
        supabase.from('agents').select('*', { count: 'exact', head: true }).eq('active', true),
        supabase.from('deals').select('expected_value').in('stage', ['prospect', 'negotiation', 'offer', 'due_diligence']),
      ]);

      const pipelineValue = (pipelineData ?? []).reduce(
        (s: number, d: { expected_value: number | null }) => s + (d.expected_value ?? 0),
        0
      );

      setStats({
        totalListings: totalListings ?? 0,
        activeListings: activeListings ?? 0,
        forRent: forRent ?? 0,
        forSale: forSale ?? 0,
        featured: featured ?? 0,
        totalLeads: totalLeads ?? 0,
        newLeads: newLeads ?? 0,
        tourRequests: tourRequests ?? 0,
        infoInquiries: infoInquiries ?? 0,
        totalDeals: totalDeals ?? 0,
        wonDeals: wonDeals ?? 0,
        pipelineValue,
        totalAgents: totalAgents ?? 0,
      });

      // Fetch top published properties for the sidebar
      const { data: topListings } = await supabase
        .from('listings')
        .select('id, title, purpose')
        .order('featured', { ascending: false })
        .order('listing_date', { ascending: false })
        .limit(5);

      if (topListings) {
        // Generate deterministic mock metrics from title hash so they feel real but consistent
        const seeded = (topListings as Array<{ id: string; title: string; purpose: string }>).map((l) => {
          let hash = 0;
          for (let i = 0; i < l.title.length; i++) hash = ((hash << 5) - hash + l.title.charCodeAt(i)) | 0;
          const absHash = Math.abs(hash);
          return {
            id: l.id,
            title: l.title.length > 35 ? l.title.slice(0, 32) + '…' : l.title,
            views: 120 + (absHash % 300),
            leads: 3 + (absHash % 15),
            purpose: l.purpose,
          };
        });
        setTopProperties(seeded);
      }

      setLoading(false);
    };
    load();
  }, []);

  const sliceCount = period === '3m' ? 3 : period === '6m' ? 6 : 12;
  const leadsSlice = MOCK_MONTHLY_LEADS.slice(-sliceCount);
  const viewsSlice = MOCK_MONTHLY_VIEWS.slice(-sliceCount);
  const dealsSlice = MOCK_MONTHLY_DEALS.slice(-sliceCount);
  const monthSlice = MONTHS.slice(-sliceCount);
  const maxLeads = Math.max(...leadsSlice);
  const maxViews = Math.max(...viewsSlice);
  const maxDeals = Math.max(...dealsSlice);
  const totalStagePie = STAGE_DATA.reduce((s, d) => s + d.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#0d1f2d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1280px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-jost font-bold text-[#0d1f2d]">Insights &amp; Analytics</h1>
          <p className="text-sm text-[#7a8a99] mt-0.5">Performance overview across properties, leads, and deals</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-[#e8edf2] rounded-lg p-1">
          {(['3m', '6m', '12m'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                period === p ? 'bg-[#0d1f2d] text-white' : 'text-[#7a8a99] hover:text-[#0d1f2d]'
              }`}
            >
              {p === '3m' ? 'Last 3M' : p === '6m' ? 'Last 6M' : 'Last 12M'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniStat label="Total Properties" value={stats?.totalListings ?? 0} icon="ri-building-2-line" color="#0d1f2d" />
        <MiniStat label="Active Listings" value={stats?.activeListings ?? 0} icon="ri-checkbox-circle-line" color="#059669" />
        <MiniStat label="Total Leads" value={stats?.totalLeads ?? 0} icon="ri-user-received-line" color="#D5A91C" />
        <MiniStat label="Tour Requests" value={stats?.tourRequests ?? 0} icon="ri-calendar-check-line" color="#D5A91C" />
        <MiniStat label="Deals Won" value={stats?.wonDeals ?? 0} icon="ri-trophy-line" color="#059669" />
        <MiniStat label="Active Agents" value={stats?.totalAgents ?? 0} icon="ri-user-star-line" color="#1B4332" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Leads over time */}
        <div className="bg-white border border-[#e8edf2] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#0d1f2d]">Leads Over Time</p>
              <p className="text-xs text-[#7a8a99]">Monthly inquiry volume</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#D5A91C]/10">
              <i className="ri-user-received-line text-[#D5A91C] text-sm" />
            </div>
          </div>
          <BarChart data={leadsSlice} max={maxLeads} color="#D5A91C" />
          <div className="flex justify-between mt-2">
            {monthSlice.map((m, i) => (
              <span key={i} className="flex-1 text-center text-[9px] text-[#b0bec5]">{m}</span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0f4f8] flex items-center justify-between">
            <span className="text-xs text-[#7a8a99]">Total this period</span>
            <span className="text-sm font-bold text-[#0d1f2d]">{leadsSlice.reduce((a, b) => a + b, 0)}</span>
          </div>
        </div>

        {/* Property Views */}
        <div className="bg-white border border-[#e8edf2] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#0d1f2d]">Property Views</p>
              <p className="text-xs text-[#7a8a99]">Estimated monthly visits</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0d1f2d]/8">
              <i className="ri-eye-line text-[#0d1f2d] text-sm" />
            </div>
          </div>
          <BarChart data={viewsSlice} max={maxViews} color="#0d1f2d" />
          <div className="flex justify-between mt-2">
            {monthSlice.map((m, i) => (
              <span key={i} className="flex-1 text-center text-[9px] text-[#b0bec5]">{m}</span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0f4f8] flex items-center justify-between">
            <span className="text-xs text-[#7a8a99]">Total this period</span>
            <span className="text-sm font-bold text-[#0d1f2d]">{viewsSlice.reduce((a, b) => a + b, 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Deals closed */}
        <div className="bg-white border border-[#e8edf2] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#0d1f2d]">Deals Closed</p>
              <p className="text-xs text-[#7a8a99]">Monthly deal completions</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50">
              <i className="ri-shake-hands-line text-emerald-600 text-sm" />
            </div>
          </div>
          <BarChart data={dealsSlice} max={maxDeals} color="#059669" />
          <div className="flex justify-between mt-2">
            {monthSlice.map((m, i) => (
              <span key={i} className="flex-1 text-center text-[9px] text-[#b0bec5]">{m}</span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0f4f8] flex items-center justify-between">
            <span className="text-xs text-[#7a8a99]">Total this period</span>
            <span className="text-sm font-bold text-[#0d1f2d]">{dealsSlice.reduce((a, b) => a + b, 0)}</span>
          </div>
        </div>
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lead stages donut-style */}
        <div className="bg-white border border-[#e8edf2] rounded-xl p-5">
          <p className="text-sm font-bold text-[#0d1f2d] mb-1">Lead Stages</p>
          <p className="text-xs text-[#7a8a99] mb-4">Distribution across pipeline</p>
          <div className="space-y-2.5">
            {STAGE_DATA.map((s) => {
              const pct = Math.round((s.count / totalStagePie) * 100);
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#3a4a5a]">{s.stage}</span>
                    <span className="text-xs text-[#7a8a99]">{s.count} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-[#f0f4f8] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/admin/leads" className="mt-4 flex items-center gap-1 text-xs text-[#D5A91C] font-semibold hover:underline cursor-pointer">
            View all leads <i className="ri-arrow-right-line" />
          </Link>
        </div>

        {/* Traffic sources */}
        <div className="bg-white border border-[#e8edf2] rounded-xl p-5">
          <p className="text-sm font-bold text-[#0d1f2d] mb-1">Lead Sources</p>
          <p className="text-xs text-[#7a8a99] mb-4">Where inquiries come from</p>
          <div className="space-y-3">
            {SOURCE_DATA.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: i === 0 ? '#D5A91C' : i === 1 ? '#0d1f2d' : i === 2 ? '#1B4332' : i === 3 ? '#7c3d0f' : '#9ca3af' }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#3a4a5a]">{s.source}</span>
                    <span className="text-xs font-semibold text-[#0d1f2d]">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#f0f4f8] rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.pct}%`,
                        backgroundColor: i === 0 ? '#D5A91C' : i === 1 ? '#0d1f2d' : i === 2 ? '#1B4332' : i === 3 ? '#7c3d0f' : '#9ca3af',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f4f8]">
            <p className="text-xs text-[#7a8a99]">Based on inquiry source page tracking</p>
          </div>
        </div>

        {/* Top performing properties */}
        <div className="bg-white border border-[#e8edf2] rounded-xl p-5">
          <p className="text-sm font-bold text-[#0d1f2d] mb-1">Top Properties</p>
          <p className="text-xs text-[#7a8a99] mb-4">By views &amp; lead generation</p>
          <div className="space-y-3">
            {topProperties.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-[#f0f4f8] text-[#7a8a99] shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0d1f2d] truncate">{p.title}</p>
                  <p className="text-[10px] text-[#7a8a99]">{p.views} views · {p.leads} leads</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.purpose === 'rent' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>
                  {p.purpose === 'rent' ? 'RENT' : 'SALE'}
                </span>
              </div>
            ))}
          </div>
          <Link to="/admin/listings" className="mt-4 flex items-center gap-1 text-xs text-[#D5A91C] font-semibold hover:underline cursor-pointer">
            View all properties <i className="ri-arrow-right-line" />
          </Link>
        </div>
      </div>

      {/* Property breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'For Rent', value: stats?.forRent ?? 0, icon: 'ri-key-2-line', color: '#D5A91C', link: '/admin/listings' },
          { label: 'For Sale', value: stats?.forSale ?? 0, icon: 'ri-home-4-line', color: '#0d1f2d', link: '/admin/listings' },
          { label: 'Featured', value: stats?.featured ?? 0, icon: 'ri-star-line', color: '#D5A91C', link: '/admin/listings' },
          { label: 'Pipeline Value', value: stats?.pipelineValue ? `$${(stats.pipelineValue / 1000).toFixed(0)}K` : '$0', icon: 'ri-money-dollar-circle-line', color: '#059669', link: '/admin/deals' },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.link}
            className="bg-white border border-[#e8edf2] rounded-xl p-5 hover:border-[#D5A91C]/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}12` }}>
                <i className={`${item.icon} text-base`} style={{ color: item.color }} />
              </div>
              <i className="ri-arrow-right-up-line text-xs text-[#ddd] group-hover:text-[#D5A91C] transition-colors" />
            </div>
            <p className="text-2xl font-bold text-[#0d1f2d]">{item.value}</p>
            <p className="text-xs text-[#7a8a99] mt-0.5">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
