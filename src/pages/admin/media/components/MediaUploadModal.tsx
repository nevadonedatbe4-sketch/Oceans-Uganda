import { useState } from 'react';

export interface MediaItemDraft {
  name: string;
  url: string;
  alt_text: string;
  content_type: string;
  tags: string[];
}

interface Props {
  onSave: (data: MediaItemDraft) => Promise<void>;
  onClose: () => void;
}

const CONTENT_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'listing', label: 'Property Photo' },
  { value: 'neighborhood', label: 'Neighborhood' },
  { value: 'agent', label: 'Agent Photo' },
  { value: 'blog', label: 'Blog Image' },
  { value: 'banner', label: 'Banner / Hero' },
  { value: 'testimonial', label: 'Testimonial Photo' },
];

const EMPTY: MediaItemDraft = {
  name: '',
  url: '',
  alt_text: '',
  content_type: 'general',
  tags: [],
};

export default function MediaUploadModal({ onSave, onClose }: Props) {
  const [data, setData] = useState<MediaItemDraft>(EMPTY);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (partial: Partial<MediaItemDraft>) => setData((d) => ({ ...d, ...partial }));

  const addTag = () => {
    if (!newTag.trim()) return;
    set({ tags: [...data.tags, newTag.trim()] });
    setNewTag('');
  };

  const removeTag = (i: number) =>
    set({ tags: data.tags.filter((_, idx) => idx !== i) });

  const handleSave = async () => {
    if (!data.url.trim()) { setError('Image URL is required'); return; }
    if (!data.name.trim()) { setError('Name is required'); return; }
    setSaving(true);
    try {
      await onSave(data);
      onClose();
    } catch {
      setError('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-bold text-stone-800 text-lg">Add Image to Library</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded hover:bg-stone-100 text-stone-400 cursor-pointer">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Image URL *</label>
            <input
              type="url"
              value={data.url}
              onChange={(e) => set({ url: e.target.value })}
              placeholder="https://…"
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
            {data.url && (
              <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                <img src={data.url} alt="Preview" className="w-full h-full object-cover object-top" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Name *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="e.g. Kololo villa pool"
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Type</label>
              <select
                value={data.content_type}
                onChange={(e) => set({ content_type: e.target.value })}
                className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 cursor-pointer"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Alt Text (for SEO)</label>
            <input
              type="text"
              value={data.alt_text}
              onChange={(e) => set({ alt_text: e.target.value })}
              placeholder="Describe the image for screen readers…"
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {data.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full text-xs">
                  {tag}
                  <button onClick={() => removeTag(i)} className="text-stone-400 hover:text-red-500 cursor-pointer">
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag…"
                className="flex-1 text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-stone-100 text-stone-600 rounded-md text-sm hover:bg-stone-200 cursor-pointer whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <i className="ri-error-warning-line"></i> {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-stone-100">
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
            {saving ? 'Saving…' : 'Add to Library'}
          </button>
        </div>
      </div>
    </div>
  );
}
