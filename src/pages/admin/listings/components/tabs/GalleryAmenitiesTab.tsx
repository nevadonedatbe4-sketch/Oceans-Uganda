import { useState } from 'react';
import { ListingFormData, ListingImage } from '@/pages/admin/listings/types';

interface Props {
  data: ListingFormData;
  onImagesChange: (images: ListingImage[]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-[#0d1f2d] rounded-md">
          <i className={`${icon} text-white text-sm`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-jost text-[13px] font-semibold text-[#0d1f2d] uppercase tracking-[0.5px]">{title}</h4>
        </div>
      </div>
      <div className="h-px bg-[#e5e7eb] mt-2.5" />
    </div>
  );
}

const SUGGESTED_AMENITIES = [
  'Swimming Pool', 'Gym / Fitness Centre', '24/7 Security', 'CCTV Surveillance',
  'Generator Backup', 'Borehole / Water Tank', 'Garden / Landscaping', 'Rooftop Terrace',
  'Concierge Service', 'Lift / Elevator', 'Underground Parking', 'Electric Fence',
  'Smart Home System', 'Air Conditioning', 'High-Speed Internet', 'Balcony',
  'Staff Quarters', 'Laundry Room', 'Pet Friendly', 'Guest Suite',
];

const inputClass = 'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';

export default function GalleryAmenitiesTab({ data, onImagesChange, onAmenitiesChange }: Props) {
  const [imgUrl, setImgUrl] = useState('');
  const [amenityInput, setAmenityInput] = useState('');

  const addImage = () => {
    const url = imgUrl.trim();
    if (!url) return;
    const newImages: ListingImage[] = [...data.images, { url, sort_order: data.images.length }];
    onImagesChange(newImages);
    setImgUrl('');
  };

  const removeImage = (idx: number) => {
    const updated = data.images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sort_order: i }));
    onImagesChange(updated);
  };

  const addAmenity = (amenity: string) => {
    const a = amenity.trim();
    if (!a || data.amenities.includes(a)) return;
    onAmenitiesChange([...data.amenities, a]);
    setAmenityInput('');
  };

  const removeAmenity = (amenity: string) => {
    onAmenitiesChange(data.amenities.filter((am) => am !== amenity));
  };

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Gallery section */}
      <section className="pb-2">
        <SectionHeader title="Photo Gallery" icon="ri-image-2-line" />
        <p className="text-xs text-[#7a8a99] mb-4">Add additional photos by pasting image URLs below. Full drag-and-drop upload coming in Phase 6.</p>

        {/* Add image input */}
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            placeholder="Paste image URL and press Enter or click Add…"
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={addImage}
            disabled={!imgUrl.trim()}
            className="px-5 py-3 bg-[#0d5959] text-white text-sm font-bold hover:bg-[#094545] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Add Photo
          </button>
        </div>

        {data.images.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {data.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-md overflow-hidden aspect-square bg-gray-100">
                <img src={img.url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="w-8 h-8 flex items-center justify-center bg-white/90 rounded-full text-red-500 hover:bg-white transition-colors cursor-pointer"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-[#0d5959] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">First</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#e8edf2] rounded-lg p-8 text-center">
            <span className="w-10 h-10 flex items-center justify-center mx-auto mb-2 text-[#b0bec5]">
              <i className="ri-image-add-line text-3xl" />
            </span>
            <p className="text-sm text-[#7a8a99]">No gallery images yet</p>
            <p className="text-xs text-[#b0bec5] mt-1">Paste image URLs above to build the gallery</p>
          </div>
        )}
      </section>

      {/* Amenities section */}
      <section className="pb-2">
        <SectionHeader title="Amenities &amp; Features" icon="ri-star-smile-line" />

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(amenityInput))}
            placeholder="Type a custom amenity and press Enter…"
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={() => addAmenity(amenityInput)}
            disabled={!amenityInput.trim()}
            className="px-5 py-3 bg-[#0d5959] text-white text-sm font-bold hover:bg-[#094545] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Add
          </button>
        </div>

        {/* Quick-add suggestions */}
        <div className="mb-4">
          <p className="text-[11px] font-medium text-[#7a8a99] mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_AMENITIES.filter((a) => !data.amenities.includes(a)).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => addAmenity(a)}
                className="text-xs font-semibold px-3 py-1.5 bg-white border-2 border-[#e8edf2] text-[#7a8a99] hover:border-[#0d5959] hover:text-[#0d5959] transition-colors cursor-pointer whitespace-nowrap"
              >
                + {a}
              </button>
            ))}
          </div>
        </div>

        {/* Selected amenities */}
        {data.amenities.length > 0 && (
          <div>
            <p className="text-[11px] font-medium text-[#7a8a99] mb-2">Selected ({data.amenities.length}):</p>
            <div className="flex flex-wrap gap-2">
              {data.amenities.map((a) => (
                <span key={a} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0d5959]/10 text-[#0d5959] rounded-md">
                  <i className="ri-check-line text-xs" />
                  {a}
                  <button type="button" onClick={() => removeAmenity(a)} className="ml-1 hover:text-red-500 transition-colors cursor-pointer">
                    <i className="ri-close-line text-xs" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}