import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Neighborhood } from './types';

export default function AdminNeighborhoods() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('neighborhoods')
      .select('id, name, slug, city, country, hero_image, short_intro, highlights, lifestyle_tags, featured, published, sort_order, seo_title, seo_description, created_at')
      .order('sort_order')
      .order('name');
    if (data) setNeighborhoods(data as Neighborhood[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const toggleFeatured = async (n: Neighborhood) => {
    await supabase
      .from('neighborhoods')
      .update({ featured: !n.featured })
      .eq('id', n.id);
    setNeighborhoods((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, featured: !x.featured } : x))
    );
  };

  const handleDelete = async (id: string) => {
    await supabase.from('neighborhoods').delete().eq('id', id);
    setNeighborhoods((prev) => prev.filter((n) => n.id !== id));
    setDeleteConfirm(null);
  };

  const featuredCount = neighborhoods.filter((n) => n.featured).length;

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-jost font-bold text-stone-800">Neighborhoods</h1>
          <p className="text-sm text-stone-500 mt-1">
            {neighborhoods.length} areas · {featuredCount} featured on homepage
          </p>
        </div>
        <Link
          to="/admin/neighborhoods/new"
          className="flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#163828] cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i> Add Neighborhood
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : neighborhoods.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-lg">
          <i className="ri-map-pin-2-line text-4xl text-stone-300 block mb-3"></i>
          <h3 className="text-stone-600 font-medium">No neighborhoods yet</h3>
          <p className="text-sm text-stone-400 mt-1 mb-4">Add your first area to get started</p>
          <Link
            to="/admin/neighborhoods/new"
            className="inline-flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-[#163828] cursor-pointer"
          >
            <i className="ri-add-line"></i> Add Neighborhood
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {neighborhoods.map((n) => (
            <div key={n.id} className="bg-white border border-stone-200 rounded-lg overflow-hidden group">
              {/* Hero image */}
              <div className="relative w-full h-44 bg-stone-100">
                {n.hero_image ? (
                  <img
                    src={n.hero_image}
                    alt={n.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="ri-image-line text-3xl text-stone-300"></i>
                  </div>
                )}
                {/* Featured badge */}
                <button
                  onClick={() => toggleFeatured(n)}
                  title={n.featured ? 'Remove from featured' : 'Mark as featured'}
                  className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all ${
                    n.featured
                      ? 'bg-amber-400 text-white'
                      : 'bg-white/80 text-stone-400 hover:bg-white'
                  }`}
                >
                  <i className={n.featured ? 'ri-star-fill' : 'ri-star-line'}></i>
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-stone-800 truncate">{n.name}</h3>
                      {!n.published && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-400 rounded font-medium whitespace-nowrap">Draft</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{n.city}, {n.country}</p>
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">#{n.sort_order}</span>
                </div>

                {n.short_intro && (
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2">{n.short_intro}</p>
                )}

                {/* Tags */}
                {n.lifestyle_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {n.lifestyle_tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {n.lifestyle_tags.length > 3 && (
                      <span className="text-xs text-stone-400">+{n.lifestyle_tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                  <Link
                    to={`/admin/neighborhoods/${n.id}`}
                    className="flex-1 text-center text-sm font-medium text-[#1B4332] border border-[#1B4332]/30 rounded-md py-2 hover:bg-[#1B4332]/5 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-pencil-line mr-1"></i> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(n.id)}
                    className="w-9 h-9 flex items-center justify-center border border-stone-200 rounded-md text-stone-400 hover:border-red-200 hover:text-red-500 cursor-pointer"
                  >
                    <i className="ri-delete-bin-line text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="font-semibold text-stone-800">Delete Neighborhood?</h3>
            <p className="text-sm text-stone-500 mt-2">
              This will permanently delete the neighborhood and its data. Listings in this area will not be deleted.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-stone-200 rounded-md py-2 text-sm text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white rounded-md py-2 text-sm font-medium hover:bg-red-600 cursor-pointer whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
