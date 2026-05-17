import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function NbGalleryUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: FileList) => {
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `neighborhoods/gallery/${Date.now()}-${generateId()}.${ext}`;
      const { data, error: err } = await supabase.storage
        .from('property-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (!err && data) {
        const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path);
        uploaded.push(urlData.publicUrl);
      }
    }
    onChange([...images, ...uploaded]);
    setUploading(false);
  }, [images, onChange]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  const move = (from: number, to: number) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-stone-700">Image Gallery ({images.length} photos)</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B4332]/10 text-[#1B4332] rounded-md text-xs font-medium hover:bg-[#1B4332]/20 cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          {uploading ? <><i className="ri-loader-4-line animate-spin" /> Uploading…</> : <><i className="ri-add-line" /> Add Photos</>}
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div key={url + idx} className="relative group rounded-lg overflow-hidden border border-stone-200" style={{ height: '90px' }}>
              <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {idx > 0 && (
                  <button onClick={() => move(idx, idx - 1)} className="w-6 h-6 flex items-center justify-center bg-white/80 rounded text-stone-700 hover:bg-white cursor-pointer">
                    <i className="ri-arrow-left-s-line text-xs" />
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button onClick={() => move(idx, idx + 1)} className="w-6 h-6 flex items-center justify-center bg-white/80 rounded text-stone-700 hover:bg-white cursor-pointer">
                    <i className="ri-arrow-right-s-line text-xs" />
                  </button>
                )}
                <button onClick={() => remove(idx)} className="w-6 h-6 flex items-center justify-center bg-red-500 rounded text-white hover:bg-red-600 cursor-pointer">
                  <i className="ri-delete-bin-line text-xs" />
                </button>
              </div>
              {idx === 0 && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#1B4332] text-white text-[9px] font-bold rounded">COVER</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-stone-200 rounded-xl bg-[#f5f5f5] flex flex-col items-center justify-center gap-2 py-8 cursor-pointer hover:border-[#1B4332]/40 transition-colors"
        >
          <i className="ri-image-add-line text-2xl text-stone-300" />
          <p className="text-sm text-stone-400">Click to add gallery photos</p>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleInput} />
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
      <p className="text-xs text-stone-400 mt-2">First image is the cover. Use arrows to reorder.</p>
    </div>
  );
}
