import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Listing, STATUSES } from '@/pages/admin/listings/types';
import LandListingCard from './components/LandListingCard';
import JVSubmissions from './components/JVSubmissions';

type Tab = 'listings' | 'submissions';
type TypeFilter = 'all' | 'joint_venture' | 'sale';

const PAGE_SIZE = 9;

export default function AdminJVDesk() {
  const [tab, setTab] = useState<Tab>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('property_type', 'Land')
      .order('created_at', { ascending: false });
    setListings(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    total: listings.length,
    published: listings.filter((l) => l.status === 'published').length,
    jv: listings.filter((l) => l.purpose === 'joint_venture').length,
    sale: listings.filter((l) => l.purpose !== 'joint_venture').length,
  }), [listings]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.title.toLowerCase().includes(q) || (l.location ?? '').toLowerCase().includes(q);
      const matchType = typeFilter === 'all' || (typeFilter === 'joint_venture' ? l.purpose === 'joint_venture' : l.purpose !== 'joint_venture');
      const matchStatus = !statusFilter || l.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [listings, search, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, typeFilter, statusFilter]);

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    const updatePayload: Record<string, unknown> = { status: nextStatus, published: nextStatus === 'published' };
    if (nextStatus === 'published') updatePayload.published_at = new Date().toISOString();

    const { error } = await supabase.from('listings').update(updatePayload).eq('id', id);
    if (error) { showToast('error', `Failed to update: ${error.message}`); return; }
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: nextStatus, published: nextStatus === 'published' } : l));
    showToast('success', nextStatus === 'published' ? 'Listing published' : 'Listing unpublished');
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from('listings').update({ featured: !current }).eq('id', id);
    if (error) { showToast('error', 'Failed to update featured status'); return; }
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, featured: !current } : l));
    showToast('success', current ? 'Removed from featured' : 'Marked as featured');
  };

  return (
    <div className="space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-jost font-bold text-[#0d1f2d]">Joint Ventures Desk</h1>
          <p className="text-sm text-[#7a8a99] mt-0.5">Manage land listings, JV opportunities, and submissions from landowners &amp; investors</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/listings/new?type=Land"
            className="flex items-center gap-2 px-4 py-2 bg-[#0d1f2d] text-white text-sm font-semibold rounded-lg hover:bg-[#1a3347] transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" /> Add Land Listing
          </Link>
          <Link
            to="/admin/listings"
            className="flex items-center gap-2 px-4 py-2 border border-[#0d1f2d] text-[#0d1f2d] text-sm font-semibold rounded-lg hover:bg-[#f0f4f8] cursor-pointer transition-colors whitespace-nowrap"
          >
            <i className="ri-building-2-line" /> All Properties
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
          <i className={toast.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} />
          {toast.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 w-fit bg-[#f0f4f8] rounded-full p-1">
        {([
          { key: 'listings' as Tab, label: 'Land Listings', icon: 'ri-landscape-line' },
          { key: 'submissions' as Tab, label: 'JV Submissions', icon: 'ri-file-list-3-line' },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full cursor-pointer transition-colors whitespace-nowrap ${
              tab === t.key ? 'bg-white text-[#0d1f2d] shadow-sm' : 'text-[#7a8a99] hover:text-[#0d1f2d]'
            }`}
          >
            <i className={t.icon} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'listings' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Land', value: stats.total, icon: 'ri-landscape-line', color: 'text-[#0d1f2d]', bg: 'bg-[#0d1f2d]/8' },
              { label: 'Published', value: stats.published, icon: 'ri-checkbox-circle-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Joint Venture', value: stats.jv, icon: 'ri-user-received-line', color: 'text-[#D5A91C]', bg: 'bg-[#D5A91C]/10' },
              { label: 'Outright Sale', value: stats.sale, icon: 'ri-price-tag-3-line', color: 'text-sky-600', bg: 'bg-sky-50' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-[#e8edf2] rounded-lg px-3 py-3 flex items-center gap-2.5">
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${stat.bg} ${stat.color}`}>
                  <i className={`${stat.icon} text-sm`} />
                </span>
                <div className="min-w-0">
                  <p className="text-xl font-bold text-[#0d1f2d] leading-tight">{stat.value}</p>
                  <p className="text-[10px] text-[#7a8a99] whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white border border-[#e8edf2] rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#b0bec5] text-sm" />
              <input
                type="text"
                placeholder="Search title, location or district…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#f0f4f8] border border-transparent rounded-lg text-[#0d1f2d] placeholder-[#b0bec5] focus:outline-none focus:border-[#D5A91C] focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                className="text-xs border border-[#e8edf2] rounded-lg px-3 py-2 bg-white text-[#0d1f2d] focus:outline-none focus:border-[#D5A91C] cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="joint_venture">Joint Venture</option>
                <option value="sale">Outright Sale</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-[#e8edf2] rounded-lg px-3 py-2 bg-white text-[#0d1f2d] focus:outline-none focus:border-[#D5A91C] cursor-pointer"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <span className="text-xs text-[#7a8a99] whitespace-nowrap">{filtered.length} land listings</span>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="bg-white border border-[#e8edf2] rounded-lg py-20 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#0d1f2d] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-[#e8edf2] rounded-lg py-20 flex flex-col items-center gap-3 text-center">
              <i className="ri-landscape-line text-3xl text-[#D5A91C]" />
              <p className="text-sm font-bold text-[#0d1f2d]">No land listings found</p>
              <p className="text-xs text-[#7a8a99]">Try adjusting your filters, or add a new land listing</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paged.map((l) => (
                  <LandListingCard
                    key={l.id}
                    listing={l}
                    onTogglePublish={handleTogglePublish}
                    onToggleFeatured={handleToggleFeatured}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7a8a99]">Page {page} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="w-8 h-8 flex items-center justify-center border border-[#e8edf2] rounded-lg text-[#7a8a99] hover:bg-[#f0f4f8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <i className="ri-arrow-left-s-line text-sm" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="w-8 h-8 flex items-center justify-center border border-[#e8edf2] rounded-lg text-[#7a8a99] hover:bg-[#f0f4f8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <i className="ri-arrow-right-s-line text-sm" />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <JVSubmissions />
      )}
    </div>
  );
}
