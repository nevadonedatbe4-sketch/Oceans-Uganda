import { useState } from 'react';
import { ListingFormData } from '@/pages/admin/listings/types';

interface Props {
  data: ListingFormData;
  onChange: (field: keyof ListingFormData, value: string | string[]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-[#0d1f2d] rounded-md">
          <i className={`${icon} text-white text-sm`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-jost text-[13px] font-semibold text-[#0d1f2d] uppercase tracking-[0.5px]">{title}</h4>
          {subtitle && <p className="text-[11px] text-[#7a8a99] mt-0.5 leading-snug">{subtitle}</p>}
        </div>
      </div>
      <div className="h-px bg-[#e5e7eb] mt-2.5" />
    </div>
  );
}

const inputClass = 'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';

/* ── Feature Groups ─────────────────────────────────────────────────────── */

const OUTDOOR_AMENITIES = [
  'Swimming Pool',
  'Mature Gardens',
  'Rooftop Terrace',
  'Large Balcony',
  'Underground Parking',
  'Electric Fence',
  'Gated Community',
  'BBQ Area',
  'Pet Friendly',
];

const SECURITY_AMENITIES = [
  '24/7 Security',
  'CCTV Surveillance',
  'Guard House',
  'Intercom System',
  'Smart Lock Access',
];

const COMFORT_AMENITIES = [
  'Air Conditioning',
  'Generator Backup',
  'Borehole / Water Tank',
  'Lift / Elevator',
  'Concierge Service',
  'High-Speed Internet',
  'Smart Home System',
];

const INDOOR_FEATURES = [
  'Open Plan Kitchen',
  'En Suite Bedrooms',
  'Walk-in Wardrobe',
  'Home Office',
  'Fireplace',
  'Underfloor Heating',
  'Double Glazing',
  'Storage Room',
  'Utility Room',
  'Wine Cellar',
  'Home Cinema',
  'Jacuzzi',
  'Laundry Room',
  'Guest Suite',
  'Staff Quarters',
];

/* ── Checkbox Item ────────────────────────────────────────────────────── */

function FeatureCheckbox({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`flex items-center gap-3 py-2.5 px-3 border transition-all cursor-pointer group select-none ${
        selected
          ? 'bg-[#0d1f2d] border-[#0d1f2d]'
          : 'bg-white border-[#e8edf2] hover:border-[#0d5959]'
      }`}
    >
      <div className="relative w-[18px] h-[18px] shrink-0">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="peer sr-only"
        />
        <div
          className={`w-[18px] h-[18px] border-2 flex items-center justify-center transition-all ${
            selected
              ? 'border-white bg-white'
              : 'border-[#b0bec5] bg-transparent'
          }`}
        >
          <i
            className={`ri-check-line text-[10px] transition-opacity ${
              selected ? 'text-[#0d1f2d] opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
      <span
        className={`text-sm font-medium transition-colors ${
          selected ? 'text-white' : 'text-[#7a8a99] group-hover:text-[#0d1f2d]'
        }`}
      >
        {label}
      </span>
    </label>
  );
}

/* ── Feature Group ─────────────────────────────────────────────────────── */

function FeatureGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#b0bec5] mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map((item) => (
          <FeatureCheckbox
            key={item}
            label={item}
            selected={selected.includes(item)}
            onToggle={() => onToggle(item)}
          />
        ))}
      </div>
    </div>
  );
}

export default function StepFeatures({ data, onAmenitiesChange }: Props) {
  const [amenityInput, setAmenityInput] = useState('');

  const addAmenity = (amenity: string) => {
    const a = amenity.trim();
    if (!a || data.amenities.includes(a)) return;
    onAmenitiesChange([...data.amenities, a]);
    setAmenityInput('');
  };

  const removeAmenity = (amenity: string) => {
    onAmenitiesChange(data.amenities.filter((a) => a !== amenity));
  };

  const toggleAmenity = (item: string) => {
    if (data.amenities.includes(item)) {
      removeAmenity(item);
    } else {
      addAmenity(item);
    }
  };

  const allGroups = [...OUTDOOR_AMENITIES, ...SECURITY_AMENITIES, ...COMFORT_AMENITIES, ...INDOOR_FEATURES];
  const customAmenities = data.amenities.filter((a) => !allGroups.includes(a));

  return (
    <div className="w-full space-y-10 md:space-y-12">

      {/* Amenities & Features */}
      <section className="pb-2">
        <SectionTitle
          icon="ri-star-smile-line"
          title="Amenities &amp; Features"
          subtitle={data.amenities.length > 0 ? `${data.amenities.length} selected` : 'Add what makes this property special'}
        />

        <div className="space-y-6">
          {/* Custom input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity(amenityInput))}
              placeholder="Type a custom amenity and press Enter..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => addAmenity(amenityInput)}
              disabled={!amenityInput.trim()}
              className="px-5 py-3 bg-[#0d5959] text-white text-sm font-bold hover:bg-[#094545] transition-colors cursor-pointer whitespace-nowrap"
            >
              Add
            </button>
            {data.amenities.length > 0 && (
              <button
                type="button"
                onClick={() => onAmenitiesChange([])}
                className="px-5 py-3 bg-white border-2 border-[#0d5959] text-[#0d5959] text-sm font-bold hover:bg-[#0d5959] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Feature groups */}
          <FeatureGroup
            title="Outdoor & Leisure"
            items={OUTDOOR_AMENITIES}
            selected={data.amenities}
            onToggle={toggleAmenity}
          />
          <FeatureGroup
            title="Security"
            items={SECURITY_AMENITIES}
            selected={data.amenities}
            onToggle={toggleAmenity}
          />
          <FeatureGroup
            title="Comfort & Services"
            items={COMFORT_AMENITIES}
            selected={data.amenities}
            onToggle={toggleAmenity}
          />
          <FeatureGroup
            title="Indoor Features"
            items={INDOOR_FEATURES}
            selected={data.amenities}
            onToggle={toggleAmenity}
          />

          {/* Custom items */}
          {customAmenities.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#b0bec5] mb-3">Custom ({customAmenities.length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {customAmenities.map((a) => (
                  <div
                    key={a}
                    className="flex items-center justify-between gap-3 py-2.5 px-3 bg-[#0d1f2d] text-white border border-[#0d1f2d] select-none"
                  >
                    <span className="text-sm font-medium truncate">{a}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(a)}
                      className="w-5 h-5 flex items-center justify-center hover:text-red-300 transition-colors cursor-pointer shrink-0"
                    >
                      <i className="ri-close-line text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}