import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  currentPhoto: string | null;
  name: string;
  onUploaded: (url: string) => void;
}

export default function AdminProfilePhotoUploader({ currentPhoto, name, onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB'); return; }
    if (!file.type.startsWith('image/')) { setError('Only image files allowed'); return; }
    setError(null);
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `profiles/admin_${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: true });
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative group cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white ring-2 ring-[#001731]/10 bg-[#001731]/5 flex items-center justify-center">
          {currentPhoto ? (
            <img src={currentPhoto} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-light text-[#001731]/40" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {initials}
            </span>
          )}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 rounded-full bg-[#001731]/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <i className="ri-camera-line text-white text-lg" />
              <span className="text-white text-[9px] mt-0.5">Change</span>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />

      <div className="text-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs text-[#001731] font-medium hover:text-[#D4A614] transition-colors cursor-pointer whitespace-nowrap"
        >
          Upload Photo
        </button>
        <p className="text-[10px] text-[#7A7A7A] mt-0.5">Min 300 × 300 px · JPG or PNG</p>
      </div>

      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
