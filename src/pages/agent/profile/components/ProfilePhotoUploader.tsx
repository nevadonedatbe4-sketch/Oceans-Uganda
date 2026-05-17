import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  currentPhoto: string | null;
  name: string;
  onUploaded: (url: string) => void;
}

export default function ProfilePhotoUploader({ currentPhoto, name, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Image must be under 3 MB.');
      return;
    }
    setError(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const ext = file.name.split('.').pop();
    const fileName = `agent-photos/${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, { upsert: true });

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('property-images').getPublicUrl(fileName);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col items-center gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Avatar */}
      <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
        <div
          className="w-20 h-20 rounded-full overflow-hidden bg-[#f5f3ef] ring-1 ring-[#e8e3db] flex items-center justify-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {preview ? (
            <img src={preview} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span
              className="text-[#aaa] text-2xl font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {name?.charAt(0)?.toUpperCase() ?? 'A'}
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <i className="ri-camera-line text-white text-lg" />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#D5A91C] hover:text-[#b8943d] cursor-pointer disabled:opacity-50 whitespace-nowrap transition-colors"
      >
        {uploading ? 'Uploading…' : 'Change Photo'}
      </button>

      {error && (
        <p className="text-[10px] text-red-400 text-center max-w-[140px]">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
