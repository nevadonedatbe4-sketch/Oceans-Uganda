import { useState, useRef, useCallback, useId } from 'react';
import { supabase } from '@/lib/supabase';
import { ListingImage } from '@/pages/admin/listings/types';

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  preview: string;
  error?: string;
}

interface Props {
  images: ListingImage[];
  onChange: (images: ListingImage[]) => void;
  videoUrl?: string;
  onVideoUrlChange?: (url: string) => void;
  floorPlanUrl?: string;
  onFloorPlanUrlChange?: (url: string) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

/* ─── Video URL helpers ─────────────────────────────────────────────────── */
function detectPlatform(url: string): 'youtube' | 'vimeo' | null {
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url)) return 'vimeo';
  return null;
}

function getEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  const vmMatch = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}?byline=0&portrait=0`;
  return null;
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  return null;
}

interface VideoTourInputProps {
  value: string;
  onChange: (url: string) => void;
}

function VideoTourInput({ value, onChange }: VideoTourInputProps) {
  const [showPreview, setShowPreview] = useState(false);
  const platform = value ? detectPlatform(value) : null;
  const embedUrl = value ? getEmbedUrl(value) : null;
  const ytThumb = value ? getYouTubeThumbnail(value) : null;
  const isValid = !!embedUrl;

  return (
    <div className="pt-2 border-t border-gray-100">
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
          <i className="ri-video-line text-[#b8965a]" />
          Video Tour URL <span className="font-normal text-gray-400">(optional)</span>
        </label>
        {isValid && (
          <button
            type="button"
            onClick={() => setShowPreview(v => !v)}
            className="flex items-center gap-1 text-xs text-[#b8965a] hover:text-[#a07840] transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className={showPreview ? 'ri-eye-off-line' : 'ri-eye-line'} />
            {showPreview ? 'Hide preview' : 'Preview'}
          </button>
        )}
      </div>

      {/* Input */}
      <div className="relative">
        {/* Platform icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
          {platform === 'youtube' && <i className="ri-youtube-line text-red-500 text-base" />}
          {platform === 'vimeo' && <i className="ri-vimeo-line text-sky-500 text-base" />}
          {!platform && <i className="ri-links-line text-gray-300 text-base" />}
        </div>

        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste YouTube or Vimeo URL…"
          className={`w-full text-sm border rounded-lg pl-9 pr-10 py-2.5 text-gray-700 outline-none transition-all bg-white ${
            value && !isValid
              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : isValid
              ? 'border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50'
              : 'border-gray-200 focus:border-[#b8965a] focus:ring-2 focus:ring-[#b8965a]/10'
          }`}
        />

        {/* Status icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
          {isValid && <i className="ri-checkbox-circle-fill text-emerald-500 text-base" />}
          {value && !isValid && <i className="ri-error-warning-fill text-red-400 text-base" />}
        </div>
      </div>

      {/* Helper text */}
      {value && !isValid && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
          <i className="ri-information-line" />
          Please enter a valid YouTube or Vimeo URL
        </p>
      )}
      {!value && (
        <p className="text-xs text-gray-400 mt-1.5">
          Supports: <span className="text-red-400 font-medium">YouTube</span> and <span className="text-sky-500 font-medium">Vimeo</span> — paste any share or watch URL
        </p>
      )}
      {isValid && platform && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-600 mt-1.5">
          <i className="ri-checkbox-circle-line" />
          {platform === 'youtube' ? 'YouTube' : 'Vimeo'} video detected — will show as Video Tour on the property page
        </p>
      )}

      {/* Live preview */}
      {isValid && showPreview && embedUrl && (
        <div className="mt-3 rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%', position: 'relative' }}>
          {/* YouTube thumbnail first, then iframe on click */}
          {platform === 'youtube' && ytThumb && !showPreview ? (
            <img src={ytThumb} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <iframe
              src={embedUrl}
              title="Video Tour Preview"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      )}

      {/* YouTube thumbnail preview (no autoplay) */}
      {isValid && !showPreview && platform === 'youtube' && ytThumb && (
        <div
          className="mt-3 relative rounded-xl overflow-hidden cursor-pointer group"
          style={{ paddingBottom: '30%' }}
          onClick={() => setShowPreview(true)}
        >
          <img src={ytThumb} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center bg-red-600 rounded-full">
              <i className="ri-play-fill text-white text-xl" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-roboto">
            Click to preview
          </div>
        </div>
      )}
    </div>
  );
}

export default function MediaUploader({
  images,
  onChange,
  videoUrl = '',
  onVideoUrlChange,
  floorPlanUrl = '',
  onFloorPlanUrlChange,
}: Props) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropId = useId();

  const uploadFile = useCallback(async (file: File, uploadId: string) => {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `listings/${Date.now()}-${generateId()}.${ext}`;

    setUploading((prev) =>
      prev.map((u) => (u.id === uploadId ? { ...u, progress: 10 } : u))
    );

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error || !data) {
      setUploading((prev) =>
        prev.map((u) =>
          u.id === uploadId
            ? { ...u, status: 'error', progress: 0, error: error?.message ?? 'Upload failed' }
            : u
        )
      );
      return null;
    }

    const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(data.path);
    setUploading((prev) =>
      prev.map((u) => (u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u))
    );
    return urlData.publicUrl;
  }, []);

  const processFiles = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith('image/'));
      if (imageFiles.length === 0) return;

      // Create preview entries immediately
      const newUploading: UploadingFile[] = imageFiles.map((f) => ({
        id: generateId(),
        name: f.name,
        progress: 0,
        status: 'uploading',
        preview: URL.createObjectURL(f),
      }));
      setUploading((prev) => [...prev, ...newUploading]);

      // Upload all in parallel
      const results = await Promise.all(
        imageFiles.map((file, i) => uploadFile(file, newUploading[i].id))
      );

      // Add successful uploads to images list
      const newImages: ListingImage[] = results
        .map((url, i) => {
          if (!url) return null;
          const isFirst = images.length === 0 && i === 0;
          return {
            url,
            sort_order: images.length + i,
            is_cover: isFirst,
          } as ListingImage;
        })
        .filter(Boolean) as ListingImage[];

      if (newImages.length > 0) {
        const merged = [...images, ...newImages];
        // Ensure exactly one cover
        const hasCover = merged.some((img) => img.is_cover);
        if (!hasCover && merged.length > 0) {
          merged[0] = { ...merged[0], is_cover: true };
        }
        onChange(merged.map((img, idx) => ({ ...img, sort_order: idx })));
      }

      // Clean up done entries after a moment
      setTimeout(() => {
        setUploading((prev) => prev.filter((u) => u.status !== 'done'));
      }, 1500);
    },
    [images, onChange, uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    processFiles(files);
    e.target.value = '';
  };

  const setCover = (idx: number) => {
    onChange(
      images.map((img, i) => ({ ...img, is_cover: i === idx }))
    );
  };

  const removeImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sort_order: i }));
    // Ensure cover is set
    if (next.length > 0 && !next.some((img) => img.is_cover)) {
      next[0] = { ...next[0], is_cover: true };
    }
    onChange(next);
  };

  // Drag-to-reorder handlers
  const handleThumbDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleThumbDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIdx(idx);
  };

  const handleThumbDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }
    const reordered = [...images];
    const [moved] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    onChange(reordered.map((img, i) => ({ ...img, sort_order: i })));
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleThumbDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const coverIdx = images.findIndex((img) => img.is_cover);
  const effectiveCoverIdx = coverIdx >= 0 ? coverIdx : 0;

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer select-none ${
          dragOver
            ? 'border-[#b8965a] bg-[#b8965a]/5 scale-[1.01]'
            : 'border-gray-200 bg-gray-50 hover:border-[#b8965a]/50 hover:bg-[#b8965a]/3'
        }`}
        style={{ minHeight: '180px' }}
        role="button"
        aria-label="Upload images"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          id={dropId}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
          <div className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors ${
            dragOver ? 'bg-[#b8965a]/15' : 'bg-gray-100'
          }`}>
            <i className={`ri-upload-cloud-2-line text-2xl transition-colors ${
              dragOver ? 'text-[#b8965a]' : 'text-gray-400'
            }`} />
          </div>
          <div className="text-center">
            <p className={`text-sm font-semibold transition-colors ${dragOver ? 'text-[#b8965a]' : 'text-gray-600'}`}>
              {dragOver ? 'Drop photos here' : 'Drag & drop photos here'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              or <span className="text-[#b8965a] font-medium">click to browse</span> — select multiple at once
            </p>
            <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP supported</p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((u) => (
            <div key={u.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img src={u.preview} alt={u.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{u.name}</p>
                {u.status === 'uploading' && (
                  <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#b8965a] rounded-full transition-all duration-300"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                )}
                {u.status === 'done' && (
                  <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
                    <i className="ri-checkbox-circle-line" /> Uploaded
                  </p>
                )}
                {u.status === 'error' && (
                  <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                    <i className="ri-error-warning-line" /> {u.error}
                  </p>
                )}
              </div>
              {u.status === 'uploading' && (
                <i className="ri-loader-4-line animate-spin text-[#b8965a] text-sm shrink-0" />
              )}
              {u.status === 'done' && (
                <i className="ri-checkbox-circle-fill text-emerald-500 text-base shrink-0" />
              )}
              {u.status === 'error' && (
                <i className="ri-close-circle-fill text-red-400 text-base shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Gallery Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">
              {images.length} {images.length === 1 ? 'photo' : 'photos'} uploaded
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <i className="ri-drag-move-2-line" />
              Drag to reorder · Star to set cover
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const isCover = idx === effectiveCoverIdx;
              const isDragging = draggedIdx === idx;
              const isTarget = dragOverIdx === idx && draggedIdx !== idx;

              return (
                <div
                  key={img.url + idx}
                  draggable
                  onDragStart={(e) => handleThumbDragStart(e, idx)}
                  onDragOver={(e) => handleThumbDragOver(e, idx)}
                  onDrop={(e) => handleThumbDrop(e, idx)}
                  onDragEnd={handleThumbDragEnd}
                  className={`relative group rounded-xl overflow-hidden aspect-square bg-gray-100 cursor-grab active:cursor-grabbing transition-all ${
                    isDragging ? 'opacity-40 scale-95' : ''
                  } ${isTarget ? 'ring-2 ring-[#b8965a] scale-[1.03]' : ''}`}
                >
                  {/* Thumbnail */}
                  <img
                    src={img.url}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                    onClick={() => setLightbox(img.url)}
                  />

                  {/* Cover badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#b8965a] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                      <i className="ri-star-fill text-[9px]" />
                      Cover
                    </div>
                  )}

                  {/* Order badge */}
                  {!isCover && (
                    <div className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center bg-black/50 text-white text-[10px] font-bold rounded-full">
                      {idx + 1}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 gap-2">
                    {/* Star / Set as cover */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCover(idx); }}
                      title={isCover ? 'Cover image' : 'Set as cover'}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                        isCover
                          ? 'bg-[#b8965a] text-white'
                          : 'bg-white/90 text-gray-600 hover:bg-[#b8965a] hover:text-white'
                      }`}
                    >
                      <i className={isCover ? 'ri-star-fill text-sm' : 'ri-star-line text-sm'} />
                    </button>

                    {/* Preview */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setLightbox(img.url); }}
                      title="Preview"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-gray-600 hover:bg-white transition-colors cursor-pointer"
                    >
                      <i className="ri-eye-line text-sm" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      title="Remove"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>

                  {/* Drag handle indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 flex items-center justify-center bg-black/40 rounded-md">
                      <i className="ri-drag-move-2-line text-white text-xs" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#b8965a]/50 hover:text-[#b8965a] hover:bg-[#b8965a]/3 transition-all cursor-pointer"
            >
              <i className="ri-add-line text-xl" />
              <span className="text-xs font-medium">Add more</span>
            </button>
          </div>
        </div>
      )}

      {/* Video Tour URL */}
      <VideoTourInput
        value={videoUrl}
        onChange={(url) => onVideoUrlChange?.(url)}
      />

      {/* Floor Plan URL */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
          <i className="ri-layout-2-line text-[#b8965a]" />
          Floor Plan URL <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          type="url"
          value={floorPlanUrl}
          onChange={(e) => onFloorPlanUrlChange?.(e.target.value)}
          placeholder="https://…"
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 outline-none focus:border-[#b8965a] focus:ring-2 focus:ring-[#b8965a]/10 transition-all bg-white"
        />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl" />
          </button>
          <img
            src={lightbox}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
