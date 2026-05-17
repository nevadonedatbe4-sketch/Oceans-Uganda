import { useState } from 'react';

interface Props {
  images: string[];
  name: string;
}

export default function NbGallerySection({ images, name }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) return null;

  const prev = () => setLightbox((l) => (l !== null ? (l - 1 + images.length) % images.length : null));
  const next = () => setLightbox((l) => (l !== null ? (l + 1) % images.length : null));

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      <p className="text-[11px] font-roboto font-bold uppercase tracking-widest text-golden mb-2">Photo Gallery</p>
      <h2 className="font-prata text-primary text-xl md:text-2xl mb-6">{name} in Pictures</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div
            key={i}
            onClick={() => setLightbox(i)}
            className={`relative overflow-hidden rounded-xl cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            style={{ height: i === 0 ? '320px' : '150px' }}
          >
            <img src={url} alt={`${name} ${i + 1}`} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            {i === 0 && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-roboto px-3 py-1.5 rounded-full">
                <i className="ri-image-2-line" /> {images.length} photos
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer">
            <i className="ri-arrow-left-s-line text-xl" />
          </button>
          <img
            src={images[lightbox]}
            alt={`${name} ${lightbox + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer">
            <i className="ri-arrow-right-s-line text-xl" />
          </button>
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer">
            <i className="ri-close-line" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs font-roboto">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
