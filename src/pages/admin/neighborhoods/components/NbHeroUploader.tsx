import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export default function NbHeroUploader({ value, onChange, label = 'Hero Image' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, WEBP).');
      return;
    }
    setUploading(true);
    setUploadError(null);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `neighborhoods/${Date.now()}-${generateId()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error || !data) {
      setUploadError(error?.message ?? 'Upload failed.');
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path);
    onChange(urlData.publicUrl);
    setUploading(false);
  }, [onChange]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {value ? (
        <div className="relative w-full h-52 rounded-xl overflow-hidden border border-stone-200 group">
          <img src={value} alt="Preview" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white text-stone-800 rounded-lg text-sm font-medium hover:bg-stone-100 cursor-pointer whitespace-nowrap">
              <i className="ri-refresh-line" /> Replace
            </button>
            <button type="button" onClick={() => onChange(null)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 cursor-pointer whitespace-nowrap">
              <i className="ri-delete-bin-line" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center gap-3 py-10 transition-all ${
            dragOver ? 'border-[#1B4332] bg-[#1B4332]/5' : 'border-stone-200 bg-[#f5f5f5] hover:border-[#1B4332]/40'
          }`}
        >
          {uploading ? (
            <><div className="w-10 h-10 flex items-center justify-center"><i className="ri-loader-4-line animate-spin text-2xl text-[#1B4332]" /></div><p className="text-sm text-stone-600">Uploading…</p></>
          ) : (
            <><div className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-full"><i className="ri-upload-cloud-2-line text-xl text-stone-400" /></div>
            <div className="text-center"><p className="text-sm font-medium text-stone-600">Upload image</p><p className="text-xs text-stone-400 mt-0.5">or <span className="text-[#1B4332]">click to browse</span></p></div></>
          )}
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
      {uploadError && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><i className="ri-error-warning-line" />{uploadError}</p>}
    </div>
  );
}
