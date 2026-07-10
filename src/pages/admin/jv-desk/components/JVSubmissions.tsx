import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface JVLead {
  id: string;
  lead_name: string;
  email: string | null;
  phone: string | null;
  inquiry_type: string;
  message: string | null;
  stage: string;
  source_page: string | null;
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

export default function JVSubmissions() {
  const [leads, setLeads] = useState<JVLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'joint_venture_landowner' | 'joint_venture_investor'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select(`
        id, lead_name, email, phone, inquiry_type, message, stage, source_page, created_at,
        listing:listings(title, slug)
      `)
      .in('inquiry_type', ['joint_venture_landowner', 'joint_venture_investor'])
      .order('created_at', { ascending: false });
    setLeads((data as unknown as JVLead[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStage = async (id: string, stage: string) => {
    await supabase.from('leads').update({ stage }).eq('id', id);
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, stage } : l));
  };

  const filtered = leads.filter((l) => {
    if (typeFilter !== 'all' && l.inquiry_type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.lead_name.toLowerCase().includes(q) ||
        (l.email ?? '').toLowerCase().includes(q) ||
        (l.listing?.title ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const landownerCount = leads.filter((l) => l.inquiry_type === 'joint_venture_landowner').length;
  const investorCount = leads.filter((l) => l.inquiry_type === 'joint_venture_investor').length;

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Submissions', value: leads.length, icon: 'ri-file-list-3-line', color: '#0d1f2d' },
          { label: 'Landowner Briefs', value: landownerCount, icon: 'ri-landscape-line', color: '#1B4332' },
          { label: 'Investor Briefs', value: investorCount, icon: 'ri-user-received-line', color: '#D5A91C' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e8edf2] rounded-lg p-3 flex items-center gap-3">
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
      <div className="bg-white border border-[#e8edf2] rounded-lg p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#b0bec5] text-sm" />
          <input
            type="text"
            placeholder="Search by name, email, land listing…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#f0f4f8] border border-transparent rounded-lg text-[#0d1f2d] placeholder-[#b0bec5] focus:outline-none focus:border-[#D5A91C] focus:bg-white transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {([
            { v: 'all', label: 'All Submissions' },
            { v: 'joint_venture_landowner', label: 'Landowner Briefs' },
            { v: 'joint_venture_investor', label: 'Investor Briefs' },
          ] as const).map(({ v, label }) => (
            <button
              key={v}
              onClick={() => setTypeFilter(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors whitespace-nowrap ${typeFilter === v ? 'bg-[#0d1f2d] text-white' : 'bg-[#f0f4f8] text-[#7a8a99] hover:bg-[#e8edf2]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white border border-[#e8edf2] rounded-lg py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0d1f2d] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#e8edf2] rounded-lg py-20 flex flex-col items-center gap-3 text-center">
          <i className="ri-inbox-line text-3xl text-[#D5A91C]" />
          <p className="text-sm font-bold text-[#0d1f2d]">No JV submissions yet</p>
          <p className="text-xs text-[#7a8a99]">Landowner and investor briefs from the Joint Ventures page will appear here</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e8edf2] rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_160px_130px_120px_90px_90px] gap-x-4 px-5 py-3 border-b border-[#f0f4f8] text-[10px] font-bold text-[#7a8a99] uppercase tracking-wide">
            <span>Contact &amp; Plot</span>
            <span>Type</span>
            <span>Stage</span>
            <span>Source</span>
            <span>Received</span>
            <span></span>
          </div>

          {filtered.map((lead) => (
            <div key={lead.id} className="border-b border-[#f5f7fa] last:border-0">
              <div
                className="grid grid-cols-1 md:grid-cols-[1fr_160px_130px_120px_90px_90px] gap-x-4 gap-y-2 px-5 py-4 hover:bg-[#fafbfc] transition-colors cursor-pointer"
                onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
              >
                <div>
                  <p className="text-sm font-bold text-[#0d1f2d]">{lead.lead_name}</p>
                  <p className="text-xs text-[#7a8a99] truncate">{lead.email ?? '—'}</p>
                  {lead.listing?.title && (
                    <p className="text-xs text-[#D5A91C] truncate mt-0.5">
                      <i className="ri-landscape-line mr-1" />
                      {lead.listing.title}
                    </p>
                  )}
                </div>

                <div className="flex items-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${lead.inquiry_type === 'joint_venture_landowner' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    <i className={lead.inquiry_type === 'joint_venture_landowner' ? 'ri-landscape-line' : 'ri-user-received-line'} />
                    {lead.inquiry_type === 'joint_venture_landowner' ? 'Landowner' : 'Investor'}
                  </span>
                </div>

                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={lead.stage}
                    onChange={(e) => updateStage(lead.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 focus:outline-none cursor-pointer ${STAGE_COLORS[lead.stage] ?? 'bg-stone-100 text-stone-500'}`}
                  >
                    {['new', 'contacted', 'viewing', 'negotiating', 'won', 'lost', 'archived'].map((s) => (
                      <option key={s} value={s} className="bg-white text-[#0d1f2d] capitalize">{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <span className="text-xs text-[#7a8a99] truncate">{lead.source_page ?? 'Direct'}</span>
                </div>

                <div className="flex items-center">
                  <span className="text-xs text-[#7a8a99]">{timeAgo(lead.created_at)}</span>
                </div>

                <div className="flex items-center justify-end">
                  <button className="w-7 h-7 flex items-center justify-center rounded text-[#b0bec5] hover:text-[#0d1f2d] transition-colors cursor-pointer">
                    <i className={`text-sm ${expanded === lead.id ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                  </button>
                </div>
              </div>

              {expanded === lead.id && lead.message && (
                <div className="px-5 pb-4 pt-0">
                  <div className="bg-[#f5f7fa] rounded-xl p-4 border-l-2 border-[#D5A91C]">
                    <p className="text-[10px] font-bold text-[#7a8a99] uppercase tracking-wide mb-2">Brief</p>
                    <p className="text-sm text-[#1a2a3a] leading-relaxed whitespace-pre-line">{lead.message}</p>
                  </div>
                  {lead.phone && (
                    <p className="text-xs text-[#7a8a99] mt-2">
                      <i className="ri-phone-line mr-1 text-[#D5A91C]" />
                      {lead.phone}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
