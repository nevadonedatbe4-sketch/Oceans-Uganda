import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

interface Activity {
  id: string;
  type: 'lead' | 'deal' | 'property' | 'agent' | 'blog' | 'media';
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatDateTime(ts: string): string {
  return new Date(ts).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Activity' },
  { value: 'lead', label: 'Leads' },
  { value: 'deal', label: 'Deals' },
  { value: 'property', label: 'Properties' },
  { value: 'agent', label: 'Agents' },
  { value: 'blog', label: 'Blog' },
];

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const results: Activity[] = [];

      const [{ data: leads }, { data: deals }, { data: listings }, { data: agents }, { data: blogs }] =
        await Promise.all([
          supabase.from('leads').select('id, lead_name, stage, inquiry_type, created_at').order('created_at', { ascending: false }).limit(20),
          supabase.from('deals').select('id, client_name, stage, created_at').order('created_at', { ascending: false }).limit(15),
          supabase.from('listings').select('id, title, slug, status, created_at').order('created_at', { ascending: false }).limit(15),
          supabase.from('agents').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(10),
          supabase.from('blog_posts').select('id, title, created_at').order('created_at', { ascending: false }).limit(10),
        ]);

      (leads ?? []).forEach((l: { id: string; lead_name: string; stage: string; inquiry_type: string; created_at: string }) => {
        results.push({
          id: `lead-${l.id}`,
          type: 'lead',
          icon: l.inquiry_type === 'tour' ? 'ri-calendar-check-line' : 'ri-mail-open-line',
          iconBg: 'bg-[#D5A91C]/10',
          iconColor: 'text-[#D5A91C]',
          title: `New ${l.inquiry_type === 'tour' ? 'Tour Request' : 'Inquiry'} from ${l.lead_name}`,
          description: `Lead stage: ${l.stage}`,
          timestamp: l.created_at,
          link: '/admin/leads',
        });
      });

      (deals ?? []).forEach((d: { id: string; client_name: string; stage: string; created_at: string }) => {
        results.push({
          id: `deal-${d.id}`,
          type: 'deal',
          icon: 'ri-shake-hands-line',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          title: `Deal — ${d.client_name}`,
          description: `Stage: ${d.stage.replace(/_/g, ' ')}`,
          timestamp: d.created_at,
          link: '/admin/deals',
        });
      });

      (listings ?? []).forEach((p: { id: string; title: string; slug: string; status: string; created_at: string }) => {
        results.push({
          id: `prop-${p.id}`,
          type: 'property',
          icon: 'ri-building-2-line',
          iconBg: 'bg-[#0d1f2d]/8',
          iconColor: 'text-[#0d1f2d]',
          title: `Property listed: ${p.title}`,
          description: `Status: ${p.status}`,
          timestamp: p.created_at,
          link: `/admin/listings/${p.id}`,
        });
      });

      (agents ?? []).forEach((a: { id: string; full_name: string; created_at: string }) => {
        results.push({
          id: `agent-${a.id}`,
          type: 'agent',
          icon: 'ri-user-star-line',
          iconBg: 'bg-sky-50',
          iconColor: 'text-sky-700',
          title: `Agent added: ${a.full_name}`,
          description: 'New agent profile created',
          timestamp: a.created_at,
          link: '/admin/agents',
        });
      });

      (blogs ?? []).forEach((b: { id: string; title: string; created_at: string }) => {
        results.push({
          id: `blog-${b.id}`,
          type: 'blog',
          icon: 'ri-article-line',
          iconBg: 'bg-violet-50',
          iconColor: 'text-violet-600',
          title: `Blog post: ${b.title}`,
          description: 'Published to Blog / Insights',
          timestamp: b.created_at,
          link: '/admin/blog',
        });
      });

      results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(results);
      setLoading(false);
    };

    load();
  }, []);

  const filtered = activities.filter((a) => {
    if (filter !== 'all' && a.type !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group by date
  const grouped: Record<string, Activity[]> = {};
  filtered.forEach((a) => {
    const d = new Date(a.timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let key: string;
    if (d.toDateString() === today.toDateString()) key = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) key = 'Yesterday';
    else key = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  });

  return (
    <div className="space-y-6 max-w-[900px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-jost font-bold text-[#0d1f2d]">Activity Feed</h1>
          <p className="text-sm text-[#7a8a99] mt-0.5">All recent actions across leads, deals, properties, and content</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7a8a99] bg-white border border-[#e8edf2] rounded-lg px-3 py-1.5">
            {filtered.length} events
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e8edf2] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#b0bec5] text-sm" />
          <input
            type="text"
            placeholder="Search activity…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#f0f4f8] border border-transparent rounded-lg text-[#0d1f2d] placeholder-[#b0bec5] focus:outline-none focus:border-[#D5A91C] focus:bg-white transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                filter === opt.value ? 'bg-[#0d1f2d] text-white' : 'bg-[#f0f4f8] text-[#7a8a99] hover:bg-[#e8edf2] hover:text-[#0d1f2d]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="bg-white border border-[#e8edf2] rounded-xl py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0d1f2d] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#e8edf2] rounded-xl py-20 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-[#f0f4f8] flex items-center justify-center">
            <i className="ri-pulse-line text-xl text-[#D5A91C]" />
          </div>
          <p className="text-sm font-semibold text-[#0d1f2d]">No activity found</p>
          <p className="text-xs text-[#7a8a99]">Try changing the filter or search term</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-[#7a8a99] uppercase tracking-wider whitespace-nowrap">{date}</span>
                <div className="flex-1 h-px bg-[#e8edf2]" />
                <span className="text-xs text-[#b0bec5] shrink-0">{items.length} events</span>
              </div>

              <div className="bg-white border border-[#e8edf2] rounded-xl overflow-hidden">
                {items.map((a, idx) => (
                  <div
                    key={a.id}
                    className={`flex items-start gap-4 px-5 py-4 ${idx < items.length - 1 ? 'border-b border-[#f5f7fa]' : ''} hover:bg-[#fafbfc] transition-colors`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${a.iconBg}`}>
                      <i className={`${a.icon} text-sm ${a.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0d1f2d] truncate">{a.title}</p>
                      <p className="text-xs text-[#7a8a99] mt-0.5">{a.description}</p>
                    </div>

                    {/* Time + link */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[10px] text-[#b0bec5] whitespace-nowrap" title={formatDateTime(a.timestamp)}>
                        {timeAgo(a.timestamp)}
                      </span>
                      {a.link && (
                        <Link
                          to={a.link}
                          className="text-[10px] text-[#D5A91C] font-semibold hover:underline whitespace-nowrap"
                        >
                          View <i className="ri-arrow-right-line" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
