import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import TestimonialModal, { type TestimonialDraft } from './components/TestimonialModal';

interface Testimonial {
  id: string;
  client_name: string;
  role_company: string | null;
  testimonial_text: string | null;
  photo: string | null;
  rating: number;
  featured: boolean;
  created_at: string;
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data as Testimonial[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setModalOpen(true); };

  const handleSave = async (draft: TestimonialDraft) => {
    const payload = {
      client_name: draft.client_name,
      role_company: draft.role_company || null,
      testimonial_text: draft.testimonial_text || null,
      photo: draft.photo || null,
      rating: draft.rating,
      featured: draft.featured,
    };
    if (editing) {
      const { data } = await supabase.from('testimonials').update(payload).eq('id', editing.id).select().maybeSingle();
      if (data) setItems((prev) => prev.map((t) => (t.id === editing.id ? data as Testimonial : t)));
    } else {
      const { data } = await supabase.from('testimonials').insert(payload).select().maybeSingle();
      if (data) setItems((prev) => [data as Testimonial, ...prev]);
    }
  };

  const toggleFeatured = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ featured: !t.featured }).eq('id', t.id);
    setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, featured: !x.featured } : x)));
  };

  const handleDelete = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    setItems((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirm(null);
  };

  const featuredCount = items.filter((t) => t.featured).length;

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <i key={s} className={`ri-star-fill text-xs ${s <= rating ? 'text-amber-400' : 'text-stone-200'}`}></i>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-jost font-bold text-stone-800">Testimonials</h1>
          <p className="text-sm text-stone-500 mt-1">
            {items.length} reviews · {featuredCount} featured
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#163828] cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line"></i> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-lg">
          <i className="ri-chat-quote-line text-4xl text-stone-300 block mb-3"></i>
          <h3 className="text-stone-600 font-medium">No testimonials yet</h3>
          <p className="text-sm text-stone-400 mt-1 mb-4">Add your first client review</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-[#1B4332] text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-[#163828] cursor-pointer"
          >
            <i className="ri-add-line"></i> Add Testimonial
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <div key={t.id} className={`bg-white border rounded-lg p-5 ${t.featured ? 'border-amber-200' : 'border-stone-200'}`}>
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                {t.photo ? (
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-stone-200 shrink-0">
                    <img src={t.photo} alt={t.client_name} className="w-full h-full object-cover object-top" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                    <i className="ri-user-3-line text-[#1B4332]"></i>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 text-sm leading-tight truncate">{t.client_name}</p>
                  {t.role_company && (
                    <p className="text-xs text-stone-400 truncate">{t.role_company}</p>
                  )}
                  <StarRating rating={t.rating} />
                </div>
                {t.featured && (
                  <span className="shrink-0 text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    Featured
                  </span>
                )}
              </div>

              {/* Quote */}
              {t.testimonial_text && (
                <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 italic">
                  &ldquo;{t.testimonial_text}&rdquo;
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-stone-100">
                <button
                  onClick={() => openEdit(t)}
                  className="flex-1 text-sm font-medium text-[#1B4332] border border-[#1B4332]/30 rounded-md py-1.5 hover:bg-[#1B4332]/5 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-pencil-line mr-1"></i> Edit
                </button>
                <button
                  onClick={() => toggleFeatured(t)}
                  title={t.featured ? 'Remove from featured' : 'Mark as featured'}
                  className={`w-8 h-8 flex items-center justify-center border rounded-md cursor-pointer transition-colors ${
                    t.featured ? 'border-amber-300 text-amber-500 bg-amber-50' : 'border-stone-200 text-stone-400 hover:border-amber-300 hover:text-amber-400'
                  }`}
                >
                  <i className={t.featured ? 'ri-star-fill' : 'ri-star-line'}></i>
                </button>
                <button
                  onClick={() => setDeleteConfirm(t.id)}
                  className="w-8 h-8 flex items-center justify-center border border-stone-200 rounded-md text-stone-400 hover:border-red-200 hover:text-red-500 cursor-pointer"
                >
                  <i className="ri-delete-bin-line text-sm"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <TestimonialModal
          initial={editing ? {
            client_name: editing.client_name,
            role_company: editing.role_company ?? '',
            testimonial_text: editing.testimonial_text ?? '',
            photo: editing.photo ?? '',
            rating: editing.rating,
            featured: editing.featured,
          } : null}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="font-semibold text-stone-800">Delete Testimonial?</h3>
            <p className="text-sm text-stone-500 mt-2">This review will be permanently removed.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-stone-200 rounded-md py-2 text-sm text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white rounded-md py-2 text-sm font-medium hover:bg-red-600 cursor-pointer whitespace-nowrap">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
