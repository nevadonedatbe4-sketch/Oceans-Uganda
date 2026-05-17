import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface Inquiry {
  id: string;
  lead_name: string;
  email: string | null;
  phone: string | null;
  inquiry_type: string;
  message: string | null;
  stage: string;
  source_page: string | null;
  property_title: string | null;
  created_at: string;
  listing?: { title: string; slug: string } | null;
}

const STAGE_COLORS: Record<string, string> = {
  new: 'bg-[#D5A91C]/10 text-[#D5A91C]',
  contacted: 'bg-sky-50 text-sky-700',
  viewing: 'bg-violet-50 text-violet-700',
  negotiating: 'bg-orange-50 text-orange-700',
  won: 'bg-emerald-50 text-emerald-700',
  lost: 'bg-stone-100 text-stone-500',
  archived: 'bg-stone-100 text-stone-400',
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'tour' | 'info'>('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select(`
        id, lead_name, email, phone, inquiry_type, message, stage, source_page, property_title, created_at,
        listing:listings(title, slug)
      `)
      .order('created_at', { ascending: false });
    setInquiries((data as Inquiry[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStage = async (id: string, stage: string) => {
    await supabase.from('leads').update({ stage }).eq('id', id);
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, stage } : i));
  };

  const filtered = inquiries.filter((i) => {
    if (typeFilter === 'tour' && i.inquiry_type !== 'tour') return false;
    if (typeFilter === 'info' && i.inquiry_type === 'tour') return false;
    if (stageFilter !== 'all' && i.stage !== stageFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        i.lead_name.toLowerCase().includes(q) ||
        (i.email ?? '').toLowerCase().includes(q) ||
        (i.property_title ?? '').toLowerCase().includes(q) ||
        (i.listing?.title ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const newCount = inquiries.filter((i) => i.stage === 'new').length;
  const tourCount = inquiries.filter((i) => i.inquiry_type === 'tour').length;

  return (
    <div className="space-y-5 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-jost font-bold text-[#0d1f2d]">Inquiries</h1>
            {newCount > 0 && (
              <span className="px-2 py-0.5 bg-[#D5A91C] text-[#0d1f2d] text-xs font-bold rounded-full">
                {newCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-[#7a8a99] mt-0.5">All contact form submissions and property inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="w-9 h-9 flex items-center justify-center border border-[#e8edf2] text-[#7a8a99] rounded-lg hover:bg-[#f0f4f8] cursor-pointer transition-colors"
            title="Refresh"
          >
            <i className="ri-refresh-line text-sm" />
          </button>
          <Link
            to="/admin/leads"
            className="flex items-center gap-2 px-4 py-2 border border-[#0d1f2d] text-[#0d1f2d] text-sm font-semibold rounded-lg hover:bg-[#f0f4f8] cursor-pointer transition-colors whitespace-nowrap"
          >
            <i className="ri-swap-box-line" /> Full CRM View
          </Link>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Inquiries', value: inquiries.length, icon: 'ri-mail-open-line', color: '#0d1f2d' },
          { label: 'New / Unread', value: newCount, icon: 'ri-notification-badge-line', color: '#D5A91C' },
          { label: 'Tour Requests', value: tourCount, icon: 'ri-calendar-check-line', color: '#1B4332' },
          { label: 'Info Inquiries', value: inquiries.length - tourCount, icon: 'ri-chat-3-line', color: '#7c3d0f' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e8edf2] rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}12` }}>
              <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0d1f2d]">{stat.value}</p>
              <p className="text-[10px] text-[#7a8a99]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e8edf2] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#b0bec5] text-sm" />
          <input
            type="text"
            placeholder="Search by name, email, property…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#f0f4f8] border border-transparent rounded-lg text-[#0d1f2d] placeholder-[#b0bec5] focus:outline-none focus:border-[#D5A91C] focus:bg-white transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'tour', 'info'] as const).map((v) => (
            <button key={v} onClick={() => setTypeFilter(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors whitespace-nowrap ${typeFilter === v ? 'bg-[#0d1f2d] text-white' : 'bg-[#f0f4f8] text-[#7a8a99] hover:bg-[#e8edf2]'}`}>
              {v === 'all' ? 'All Types' : v === 'tour' ? 'Tour Requests' : 'Info Inquiries'}
            </button>
          ))}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-xs border border-[#e8edf2] rounded-lg px-3 py-1.5 bg-white text-[#0d1f2d] focus:outline-none focus:border-[#D5A91C] cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="viewing">Viewing</option>
            <option value="negotiating">Negotiating</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white border border-[#e8edf2] rounded-xl py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0d1f2d] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#e8edf2] rounded-xl py-20 flex flex-col items-center gap-3 text-center">
          <i className="ri-inbox-line text-3xl text-[#D5A91C]" />
          <p className="text-sm font-bold text-[#0d1f2d]">No inquiries found</p>
          <p className="text-xs text-[#7a8a99]">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e8edf2] rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_160px_130px_120px_90px_90px] gap-x-4 px-5 py-3 border-b border-[#f0f4f8] text-[10px] font-bold text-[#7a8a99] uppercase tracking-wide">
            <span>Contact &amp; Property</span>
            <span>Type</span>
            <span>Stage</span>
            <span>Source</span>
            <span>Received</span>
            <span></span>
          </div>

          {filtered.map((inq) => (
            <div key={inq.id} className="border-b border-[#f5f7fa] last:border-0">
              {/* Main row */}
              <div
                className="grid grid-cols-1 md:grid-cols-[1fr_160px_130px_120px_90px_90px] gap-x-4 gap-y-2 px-5 py-4 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
              >
                {/* Contact */}
                <div>
                  <p className="text-sm font-bold text-[#0d1f2d]">{inq.lead_name}</p>
                  <p className="text-xs text-[#7a8a99] truncate">{inq.email ?? '—'}</p>
                  {(inq.listing?.title ?? inq.property_title) && (
                    <p className="text-xs text-[#D5A91C] truncate mt-0.5">
                      <i className="ri-building-2-line mr-1" />
                      {inq.listing?.title ?? inq.property_title}
                    </p>
                  )}
                </div>

                {/* Type */}
                <div className="flex items-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${inq.inquiry_type === 'tour' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
                    <i className={inq.inquiry_type === 'tour' ? 'ri-calendar-check-line' : 'ri-mail-open-line'} />
                    {inq.inquiry_type === 'tour' ? 'Tour Request' : 'Info Inquiry'}
                  </span>
                </div>

                {/* Stage select */}
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={inq.stage}
                    onChange={(e) => updateStage(inq.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 focus:outline-none cursor-pointer ${STAGE_COLORS[inq.stage] ?? 'bg-stone-100 text-stone-500'}`}
                  >
                    {['new', 'contacted', 'viewing', 'negotiating', 'won', 'lost', 'archived'].map((s) => (
                      <option key={s} value={s} className="bg-white text-[#0d1f2d] capitalize">{s}</option>
                    ))}
                  </select>
                </div>

                {/* Source */}
                <div className="flex items-center">
                  <span className="text-xs text-[#7a8a99] truncate">{inq.source_page ?? 'Direct'}</span>
                </div>

                {/* Time */}
                <div className="flex items-center">
                  <span className="text-xs text-[#7a8a99]">{timeAgo(inq.created_at)}</span>
                </div>

                {/* Expand */}
                <div className="flex items-center justify-end">
                  <button className="w-7 h-7 flex items-center justify-center rounded text-[#b0bec5] hover:text-[#0d1f2d] transition-colors cursor-pointer">
                    <i className={`text-sm ${expanded === inq.id ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                  </button>
                </div>
              </div>

              {/* Expanded message */}
              {expanded === inq.id && inq.message && (
                <div className="px-5 pb-4 pt-0">
                  <div className="bg-[#f5f7fa] rounded-xl p-4 border-l-2 border-[#D5A91C]">
                    <p className="text-[10px] font-bold text-[#7a8a99] uppercase tracking-wide mb-2">Message</p>
                    <p className="text-sm text-[#1a2a3a] leading-relaxed">{inq.message}</p>
                  </div>
                  {inq.phone && (
                    <p className="text-xs text-[#7a8a99] mt-2">
                      <i className="ri-phone-line mr-1 text-[#D5A91C]" />
                      {inq.phone}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      <div className="flex items-center gap-2 text-xs text-[#b0bec5]">
        <i className="ri-information-line" />
        <span>For full CRM features including follow-up dates and deal linking, use the </span>
        <Link to="/admin/leads" className="text-[#D5A91C] font-semibold hover:underline">Leads page</Link>
      </div>
    </div>
  );
}
