import { ListingFormData, NeighborhoodOption } from '@/pages/admin/listings/types';

interface Props {
  data: ListingFormData;
  neighborhoods: NeighborhoodOption[];
  onChange: (field: keyof ListingFormData, value: string | boolean | number) => void;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0d1f2d] mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#7a8a99] mt-1">{hint}</p>}
    </div>
  );
}

function Stepper({ value, onChange, min = 0, max = 20 }: { value: string; onChange: (v: string) => void; min?: number; max?: number }) {
  const num = parseInt(value) || 0;
  return (
    <div className="flex items-center border-2 border-[#e8edf2] bg-white w-fit overflow-hidden">
      <button
        type="button"
        onClick={() => num > min && onChange(String(num - 1))}
        className="w-9 h-9 flex items-center justify-center text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
      >
        <i className="ri-subtract-line text-sm" />
      </button>
      <span className="w-10 text-center text-sm font-bold text-[#0d1f2d]">{num}</span>
      <button
        type="button"
        onClick={() => num < max && onChange(String(num + 1))}
        className="w-9 h-9 flex items-center justify-center text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
      >
        <i className="ri-add-line text-sm" />
      </button>
    </div>
  );
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

const inputClass = 'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';
const selectClass = `${inputClass} cursor-pointer`;

export default function LocationFeaturesTab({ data, neighborhoods, onChange }: Props) {
  return (
    <div className="space-y-10 md:space-y-12">
      {/* Location section */}
      <section className="pb-2">
        <SectionHeader title="Location" icon="ri-map-pin-2-line" />
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Area / Location Label">
              <input
                type="text"
                value={data.location}
                onChange={(e) => onChange('location', e.target.value)}
                placeholder="e.g. Kilimani"
                className={inputClass}
              />
            </Field>

            <Field label="Neighborhood">
              <select value={data.neighborhood_id} onChange={(e) => onChange('neighborhood_id', e.target.value)} className={selectClass}>
                <option value="">Select neighbourhood…</option>
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="City">
              <input
                type="text"
                value={data.city}
                onChange={(e) => onChange('city', e.target.value)}
                placeholder="e.g. Nairobi"
                className={inputClass}
              />
            </Field>
            <Field label="Country">
              <input
                type="text"
                value={data.country}
                onChange={(e) => onChange('country', e.target.value)}
                placeholder="e.g. Kenya"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Full Address">
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="e.g. Plot 24, Acacia Avenue, Kilimani"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Features section */}
      <section className="pb-2">
        <SectionHeader title="Property Features" icon="ri-home-4-line" />
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-5">
            <Field label="Bedrooms">
              <Stepper value={data.bedrooms} onChange={(v) => onChange('bedrooms', v)} max={15} />
            </Field>
            <Field label="Bathrooms">
              <Stepper value={data.bathrooms} onChange={(v) => onChange('bathrooms', v)} max={10} />
            </Field>
            <Field label="Parking Spaces">
              <Stepper value={data.parking} onChange={(v) => onChange('parking', v)} max={10} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Size (sqm)">
              <input
                type="number"
                value={data.size_sqm}
                onChange={(e) => onChange('size_sqm', e.target.value)}
                placeholder="e.g. 120"
                min="0"
                className={inputClass}
              />
            </Field>

            <Field label="Furnishing">
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onChange('furnished', !data.furnished)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    data.furnished
                      ? 'bg-[#0d5959]/10 text-[#0d5959] border-2 border-[#0d5959]'
                      : 'bg-white text-[#0d1f2d] border-2 border-[#e8edf2] hover:border-[#0d5959]'
                  }`}
                >
                  <i className={data.furnished ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'} />
                  {data.furnished ? 'Furnished' : 'Unfurnished'}
                </button>
              </div>
            </Field>
          </div>
        </div>
      </section>
    </div>
  );
}