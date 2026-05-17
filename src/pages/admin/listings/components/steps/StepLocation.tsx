import { useEffect, useState } from 'react';
import { ListingFormData, NeighborhoodOption } from '@/pages/admin/listings/types';

interface Props {
  data: ListingFormData;
  neighborhoods: NeighborhoodOption[];
  onChange: (field: keyof ListingFormData, value: string | boolean | number) => void;
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

function Field({ label, required, children, hint }: {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#0d1f2d] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-[#7a8a99] mt-1">{hint}</p>}
    </div>
  );
}

const inputClass = 'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';
const selectClass = `${inputClass} cursor-pointer`;
const lockedClass = 'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#7a8a99] outline-none bg-[#f6f8fa] cursor-not-allowed select-none';

export default function StepLocation({ data, neighborhoods, onChange }: Props) {
  const [locationInput, setLocationInput] = useState(data.location);

  // Lock city/country to Kampala/Uganda always
  useEffect(() => {
    if (data.city !== 'Kampala') onChange('city', 'Kampala');
    if (data.country !== 'Uganda') onChange('country', 'Uganda');
  }, []);

  const handleLocationChange = (val: string) => {
    setLocationInput(val);
    onChange('location', val);
  };

  return (
    <div className="w-full space-y-10 md:space-y-12">

      {/* Location Details */}
      <section className="pb-2">
        <SectionTitle icon="ri-map-pin-2-line" title="Location Details" subtitle="Where is this property situated?" />
        <div className="space-y-4">

          {/* 1. Full Address — text input */}
          <Field label="Full Street Address" required hint="Street address, plot number, or building name">
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="e.g. Plot 24, Acacia Avenue"
              className={inputClass}
            />
          </Field>

          {/* 2. Area / Neighbourhood — dropdown */}
          <Field label="Area / Neighbourhood" required hint="Select the neighbourhood where the property is located">
            <select
              value={data.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Select neighbourhood</option>
              {neighborhoods.map((nb) => (
                <option key={nb.id} value={nb.name}>
                  {nb.name}
                </option>
              ))}
            </select>

            {/* Show selected + allow custom override */}
            {data.location && (
              <div className="mt-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  placeholder="Or type a custom area name…"
                  className={inputClass}
                />
              </div>
            )}
          </Field>

          {/* 3. City — locked to Kampala */}
          <Field label="City" hint="Automatically set">
            <div className={lockedClass}>
              Kampala
            </div>
          </Field>

          {/* 4. Country — locked to Uganda */}
          <Field label="Country" hint="Automatically set">
            <div className={lockedClass}>
              Uganda
            </div>
          </Field>
        </div>
      </section>

    </div>
  );
}
