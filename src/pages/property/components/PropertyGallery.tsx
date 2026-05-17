import { useState, useEffect, useCallback } from 'react';
import WatermarkedImage from '@/components/base/WatermarkedImage';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  purpose: string;
}

/* ─── All-Photos Grid Modal ────────────────────────────────────────────── */
interface GridViewProps {
  images: string[];
  title: string;
  onClose: () => void;
  onSelectImage: (index: number) => void;
}

function GridView({ images, title, onClose, onSelectImage }: GridViewProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      <div className="shrink-0 flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div>
          <p className="text-white font-roboto font-semibold text-base truncate max-w-[60vw]">{title}</p>
          <p className="text-white/40 text-xs font-roboto mt-0.5">{images.length} photos</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
          <i className="ri-close-line text-xl" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3 max-w-7xl mx-auto">
          {images.map((img, i) => (
            <div key={i} className="break-inside-avoid relative group cursor-pointer overflow-hidden mb-3" style={{ borderRadius: '2px' }} onClick={() => { onClose(); onSelectImage(i); }}>
              <WatermarkedImage
                src={img}
                alt={`${title} — photo ${i + 1}`}
                className="w-full h-auto object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-9 h-9 flex items-center justify-center rounded-full bg-white/90">
                  <i className="ri-zoom-in-line text-stone-800 text-base" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Full-screen lightbox ─────────────────────────────────────────────── */
interface LightboxProps {
  images: string[];
  startIndex: number;
  title: string;
  onClose: () => void;
}

function Lightbox({ images, startIndex, title, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);
  const [uiVisible, setUiVisible] = useState(true);
  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col" onClick={() => setUiVisible(v => !v)}>
      {/* Close button — always top-right, subtle */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <i className="ri-close-line text-xl" />
      </button>

      {/* Top info — minimal */}
      <div className={`absolute top-4 left-4 z-20 transition-opacity duration-300 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <p className="text-white/50 text-xs font-roboto truncate max-w-[50vw]">{title}</p>
        <p className="text-white/30 text-[11px] font-roboto mt-0.5">{current + 1} / {images.length}</p>
      </div>

      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
        {/* Prev arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className={`absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/18 text-white/60 hover:text-white transition-all cursor-pointer ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <i className="ri-arrow-left-s-line text-2xl" />
        </button>

        {/* Image */}
        <WatermarkedImage
          key={current}
          src={images[current]}
          alt={`${title} — photo ${current + 1}`}
          className="max-h-screen max-w-screen object-contain"
          onClick={(e) => { e.stopPropagation(); next(); }}
        />

        {/* Next arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className={`absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/18 text-white/60 hover:text-white transition-all cursor-pointer ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <i className="ri-arrow-right-s-line text-2xl" />
        </button>
      </div>

      {/* Bottom strip — tiny thumbnails */}
      <div className={`shrink-0 px-6 py-3 flex items-center justify-center gap-1.5 overflow-x-auto transition-opacity duration-300 ${uiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={e => e.stopPropagation()}>
        {images.map((img, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`shrink-0 w-12 h-8 overflow-hidden border-2 transition-all cursor-pointer ${current === i ? 'border-white/80 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'}`} style={{ borderRadius: '1px' }}>
            <WatermarkedImage src={img} alt="" className="w-full h-full object-cover object-top" noWatermark />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Status Badge ─────────────────────────────────────────────────────── */
function StatusBadge({ purpose }: { purpose: string }) {
  const isForRent = purpose === 'rent';
  const label = isForRent ? 'For Rent' : 'For Sale';
  return (
    <span
      className="absolute top-3 left-3 z-20 px-2.5 py-1 text-[10px] md:text-[11px] font-roboto font-semibold uppercase tracking-[0.12em] whitespace-nowrap text-white"
      style={{ background: '#333333', borderRadius: '2px' }}
    >
      {label}
    </span>
  );
}

/* ─── Main Gallery ─────────────────────────────────────────────────────── */
export default function PropertyGallery({
  images,
  title,
  purpose,
}: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [gridOpen, setGridOpen] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const allImages = images.length > 0 ? images : [];
  const mainImage = allImages[0];
  const sideImages = allImages.slice(1, 5);
  const totalCount = allImages.length;

  const mobilePrev = () => setMobileIndex(i => (i - 1 + allImages.length) % allImages.length);
  const mobileNext = () => setMobileIndex(i => (i + 1) % allImages.length);

  return (
    <>
      {/* ── Mobile gallery ───────────────────────────────────────────────── */}
      <div className="md:hidden relative overflow-hidden" style={{ height: '260px', borderRadius: '2px' }}>
        <StatusBadge purpose={purpose} />
        {allImages.length > 0 ? (
          <WatermarkedImage
            src={allImages[mobileIndex]}
            alt={`${title} — photo ${mobileIndex + 1}`}
            className="w-full h-full object-cover object-top"
            onClick={() => setLightboxIndex(mobileIndex)}
          />
        ) : (
          <div className="w-full h-full bg-[#f0ede8] flex items-center justify-center">
            <i className="ri-building-line text-4xl text-[#ccc]" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        {allImages.length > 1 && (
          <>
            <button onClick={mobilePrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 text-white cursor-pointer" style={{ borderRadius: '2px' }}>
              <i className="ri-arrow-left-s-line text-lg" />
            </button>
            <button onClick={mobileNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 text-white cursor-pointer" style={{ borderRadius: '2px' }}>
              <i className="ri-arrow-right-s-line text-lg" />
            </button>
          </>
        )}
        {allImages.length > 1 && (
          <button onClick={() => setGridOpen(true)} className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-roboto font-medium text-[#333] cursor-pointer whitespace-nowrap" style={{ borderRadius: '2px' }}>
            <i className="ri-grid-line text-xs" /> All photos
          </button>
        )}
      </div>

      {/* ── Desktop gallery — Oceans 60/40 grid ─────────────────────────── */}
      <div className="hidden md:block">
        {allImages.length === 0 ? (
          <div className="w-full bg-[#f0ede8] flex items-center justify-center relative" style={{ height: '460px', borderRadius: '2px' }}>
            <StatusBadge purpose={purpose} />
            <i className="ri-building-line text-6xl text-[#ccc]" />
          </div>
        ) : (
          <div className="relative overflow-hidden" style={{ height: '460px', borderRadius: '2px' }}>
            <StatusBadge purpose={purpose} />
            <div className="flex gap-[3px] h-full">
              {/* Main large image — 60% */}
              <div
                className="relative overflow-hidden group cursor-pointer flex-shrink-0"
                style={{ width: '60%' }}
                onClick={() => setLightboxIndex(0)}
              >
                <WatermarkedImage
                  src={mainImage}
                  alt={title}
                  className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Right 2×2 grid — 40% */}
              <div className="flex-1 grid grid-cols-2 gap-[3px]">
                {[0, 1, 2, 3].map((i) => {
                  const img = sideImages[i];
                  const isLast = i === 3 && totalCount > 5;

                  if (!img) {
                    return <div key={i} className="bg-[#e5e5e5]" />;
                  }

                  return (
                    <div
                      key={i}
                      className="relative overflow-hidden group cursor-pointer"
                      onClick={() => isLast ? setGridOpen(true) : setLightboxIndex(i + 1)}
                    >
                      <WatermarkedImage
                        src={img}
                        alt={`${title} ${i + 2}`}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-300" />
                      {isLast && (
                        <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1 cursor-pointer">
                          <i className="ri-image-2-line text-white text-2xl" />
                          <span className="text-white font-roboto font-semibold text-sm">+{totalCount - 5} more</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Show all photos button — Oceans style: bottom-right of gallery */}
            <button
              onClick={() => setGridOpen(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#f5f5f5] border border-[#ddd] text-sm font-roboto font-medium text-[#333] transition-all cursor-pointer whitespace-nowrap z-10"
              style={{ borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              <i className="ri-camera-line text-base text-[#888]" />
              Show all photos
              {totalCount > 1 && <span className="text-[#aaa] text-xs font-normal">({totalCount})</span>}
            </button>
          </div>
        )}
      </div>

      {/* Grid view */}
      {gridOpen && (
        <GridView images={allImages} title={title} onClose={() => setGridOpen(false)} onSelectImage={(i) => { setGridOpen(false); setLightboxIndex(i); }} />
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox images={allImages} startIndex={lightboxIndex} title={title} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  );
}