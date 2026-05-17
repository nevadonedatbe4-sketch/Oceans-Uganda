import { useState, useEffect } from 'react';

export interface TestimonialDraft {
  client_name: string;
  role_company: string;
  testimonial_text: string;
  photo: string;
  rating: number;
  featured: boolean;
}

interface Props {
  initial?: TestimonialDraft | null;
  onSave: (data: TestimonialDraft) => Promise<void>;
  onClose: () => void;
}

const EMPTY: TestimonialDraft = {
  client_name: '',
  role_company: '',
  testimonial_text: '',
  photo: '',
  rating: 5,
  featured: false,
};

export default function TestimonialModal({ initial, onSave, onClose }: Props) {
  const [data, setData] = useState<TestimonialDraft>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(initial ?? EMPTY);
    setError('');
  }, [initial]);

  const set = (partial: Partial<TestimonialDraft>) => setData((d) => ({ ...d, ...partial }));

  const handleSave = async () => {
    if (!data.client_name.trim()) { setError('Client name is required'); return; }
    setSaving(true);
    try {
      await onSave(data);
      onClose();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-bold text-stone-800 text-lg">
            {initial ? 'Edit Testimonial' : 'Add Testimonial'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded hover:bg-stone-100 text-stone-400 cursor-pointer">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Photo + name side by side */}
          <div className="flex gap-4 items-start">
            <div className="shrink-0">
              {data.photo ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-stone-200">
                  <img src={data.photo} alt="Preview" className="w-full h-full object-cover object-top" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-stone-100 border-2 border-dashed border-stone-200 flex items-center justify-center">
                  <i className="ri-user-3-line text-stone-300 text-xl"></i>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={data.client_name}
                  onChange={(e) => set({ client_name: e.target.value })}
                  placeholder="e.g. James Ssemakula"
                  className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Role / Company</label>
                <input
                  type="text"
                  value={data.role_company}
                  onChange={(e) => set({ role_company: e.target.value })}
                  placeholder="e.g. Business Owner, Kampala"
                  className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Photo URL</label>
            <input
              type="url"
              value={data.photo}
              onChange={(e) => set({ photo: e.target.value })}
              placeholder="https://…"
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Testimonial Text</label>
            <textarea
              rows={4}
              value={data.testimonial_text}
              onChange={(e) => set({ testimonial_text: e.target.value })}
              placeholder="What did the client say about Oceans Uganda?"
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => set({ rating: star })}
                  className={`text-2xl cursor-pointer transition-colors ${star <= data.rating ? 'text-amber-400' : 'text-stone-200 hover:text-amber-200'}`}
                >
                  <i className="ri-star-fill"></i>
                </button>
              ))}
              <span className="text-sm text-stone-500 ml-2">{data.rating} / 5</span>
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg border border-stone-200">
            <div>
              <p className="text-sm font-medium text-stone-700">Featured</p>
              <p className="text-xs text-stone-400">Show this on homepage testimonials section</p>
            </div>
            <button
              onClick={() => set({ featured: !data.featured })}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${data.featured ? 'bg-[#1B4332]' : 'bg-stone-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.featured ? 'left-5' : 'left-0.5'}`}></span>
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <i className="ri-error-warning-line"></i> {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-stone-100">
          <button
            onClick={onClose}
            className="flex-1 border border-stone-200 rounded-md py-2.5 text-sm text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#1B4332] text-white rounded-md py-2.5 text-sm font-semibold hover:bg-[#163828] disabled:opacity-60 cursor-pointer whitespace-nowrap"
          >
            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Testimonial'}
          </button>
        </div>
      </div>
    </div>
  );
}
