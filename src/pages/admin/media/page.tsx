import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import MediaUploadModal, { type MediaItemDraft } from './components/MediaUploadModal';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  alt_text: string | null;
  tags: string[];
  content_type: string;
  created_at: string;
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  general: 'General',
  listing: 'Property Photo',
  neighborhood: 'Neighborhood',
  agent: 'Agent Photo',
  blog: 'Blog Image',
  banner: 'Banner / Hero',
  testimonial: 'Testimonial Photo',
};

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('media_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data as MediaItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async (draft: MediaItemDraft) => {
    const { data } = await supabase.from('media_items').insert(draft).select().maybeSingle();
    if (data) setItems((prev) => [data as MediaItem, ...prev]);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('media_items').delete().eq('id', id);
    setItems((prev) => prev.filter((m) => m.id !== id));
    setDeleteConfirm(null);
  };

  const copyUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = items.filter((m) => {
    if (filterType !== 'all' && m.content_type !== filterType) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || (m.alt_text ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  const allTypes = ['all', ...Array.from(new Set(items.map((m) => m.content_type)))];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="p-6 space-y-6 max-w-[1300px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-jost font-bold text-stone-800">Media Library</h1>
          <p className="text-sm text-stone-500 mt-1">{items.length} images stored</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#163828] cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i> Add Image
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or alt text…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
        >
          {allTypes.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All Types' : CONTENT_TYPE_LABELS[t] ?? t}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-lg">
          <i className="ri-image-2-line text-4xl text-stone-300 block mb-3"></i>
          <h3 className="text-stone-600 font-medium">
            {items.length === 0 ? 'No images yet' : 'No images match your filters'}
          </h3>
          <p className="text-sm text-stone-400 mt-1 mb-4">
            {items.length === 0 ? 'Add your first image to the library' : 'Try adjusting your search or type filter'}
          </p>
          {items.length === 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-[#163828] cursor-pointer"
            >
              <i className="ri-add-line"></i> Add Image
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white border border-stone-200 rounded-lg overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative w-full h-36 bg-stone-100">
                <img
                  src={item.url}
                  alt={item.alt_text ?? item.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(item.url, item.id)}
                    className="bg-white text-stone-700 rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap hover:bg-stone-100"
                  >
                    {copied === item.id ? (
                      <><i className="ri-check-line mr-1 text-green-600"></i>Copied!</>
                    ) : (
                      <><i className="ri-clipboard-line mr-1"></i>Copy URL</>
                    )}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-medium text-stone-700 truncate" title={item.name}>{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-stone-400 bg-[#f5f5f5] px-1.5 py-0.5 rounded">
                    {CONTENT_TYPE_LABELS[item.content_type] ?? item.content_type}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyUrl(item.url, item.id)}
                      title="Copy URL"
                      className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-[#1B4332] cursor-pointer"
                    >
                      <i className="ri-clipboard-line text-xs"></i>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      title="Delete"
                      className="w-6 h-6 flex items-center justify-center text-stone-400 hover:text-red-500 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line text-xs"></i>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-stone-300 mt-1">{formatDate(item.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <MediaUploadModal onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="font-semibold text-stone-800">Remove from Library?</h3>
            <p className="text-sm text-stone-500 mt-2">This will remove the image record. The source image is not deleted.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-stone-200 rounded-md py-2 text-sm text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white rounded-md py-2 text-sm font-medium hover:bg-red-600 cursor-pointer whitespace-nowrap">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
