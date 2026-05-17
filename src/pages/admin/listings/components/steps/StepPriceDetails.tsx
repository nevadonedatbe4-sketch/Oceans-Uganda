import { useState, useEffect } from 'react';
import { ListingFormData, CURRENCIES, PRICE_FREQUENCIES } from '@/pages/admin/listings/types';

interface Props {
  data: ListingFormData;
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

function Stepper({ label, icon, value, onChange, min = 0, max = 20, hint }: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  const num = parseInt(value) || 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-white border-2 border-[#e8edf2]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center bg-[#0d1f2d]/[0.06] shrink-0">
            <i className={`${icon} text-[#0d1f2d] text-sm`} />
          </div>
          <span className="text-sm font-bold text-[#0d1f2d] truncate">{label}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => num > min && onChange(String(num - 1))}
            disabled={num <= min}
            className="w-9 h-9 flex items-center justify-center border-2 border-[#e8edf2] text-[#7a8a99] hover:border-[#0d1f2d] hover:text-[#0d1f2d] hover:bg-[#F5F5F5] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
          >
            &minus;
          </button>
          <span className="w-10 text-center text-lg font-bold text-[#0d1f2d]">{num}</span>
          <button
            type="button"
            onClick={() => num < max && onChange(String(num + 1))}
            disabled={num >= max}
            className="w-9 h-9 flex items-center justify-center border-2 border-[#e8edf2] text-[#7a8a99] hover:border-[#0d1f2d] hover:text-[#0d1f2d] hover:bg-[#F5F5F5] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
          >
            +
          </button>
        </div>
      </div>
      {hint && <p className="text-xs text-[#7a8a99] mt-1 pl-1">{hint}</p>}
    </div>
  );
}

const inputClass = 'w-full text-sm font-medium border-2 border-[#e8edf2] px-3 py-2.5 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';
const selectClass = `${inputClass} cursor-pointer`;

const SIZE_UNITS = [
  { value: 'sqm', label: 'm\u00B2' },
  { value: 'sqft', label: 'ft\u00B2' },
];

const LAND_UNITS = [
  { value: 'sqm', label: 'Sq Metres (m\u00B2)' },
  { value: 'sqft', label: 'Sq Feet (ft\u00B2)' },
  { value: 'acres', label: 'Acres' },
  { value: 'decimals', label: 'Decimals' },
  { value: 'hectares', label: 'Hectares' },
  { value: 'marla', label: 'Marla' },
  { value: 'kanal', label: 'Kanal' },
  { value: 'perches', label: 'Perches' },
  { value: 'rood', label: 'Rood' },
];

function ToggleRow({
  label,
  sublabel,
  icon,
  activeIcon,
  checked,
  onToggle,
}: {
  label: string;
  sublabel?: string;
  icon: string;
  activeIcon?: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-white border-2 border-[#e8edf2]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-[#0d1f2d]/[0.06] shrink-0">
          <i className={`${checked && activeIcon ? activeIcon : icon} text-[#0d1f2d] text-sm`} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0d1f2d]">{label}</p>
          {sublabel && <p className="text-xs text-[#7a8a99] mt-0.5">{sublabel}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? 'bg-[#0d5959]' : 'bg-stone-200'}`}
      >
        <span
          className={`absolute left-0.5 h-6 w-6 rounded-full bg-white shadow transition-all duration-200 ${checked ? 'translate-x-7' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}

export default function StepPriceDetails({ data, onChange }: Props) {
  const [showSecondaryPrice, setShowSecondaryPrice] = useState(!!data.secondary_price);
  useEffect(() => {
    if (data.purpose === 'sale' && !data.price_note && !data.price_on_request) {
      onChange('price_note', 'Guide Price');
    }
  }, [data.purpose]);

  const handlePlaceholderToggle = (enabled: boolean) => {
    onChange('price_on_request', enabled);
    if (enabled) {
      onChange('price', '');
      onChange('price_note', 'Price on Request');
      onChange('price_frequency', '');
    } else {
      onChange('price_note', data.purpose === 'sale' ? 'Guide Price' : '');
    }
  };

  return (
    <div className="w-full space-y-10 md:space-y-12">

      {/* Pricing */}
      <section className="pb-2">
        <SectionTitle icon="ri-money-dollar-circle-line" title="Pricing" subtitle="Set the asking price and billing details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Currency">
            <select
              value={data.currency}
              onChange={(e) => onChange('currency', e.target.value)}
              disabled={data.price_on_request}
              className={`${selectClass} ${data.price_on_request ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Price" required={!data.price_on_request}>
            <input
              type="number"
              value={data.price_on_request ? '' : data.price}
              onChange={(e) => onChange('price', e.target.value)}
              placeholder={data.price_on_request ? 'Price on request' : 'Enter the asking price'}
              min="0"
              disabled={data.price_on_request}
              className={`${inputClass} ${data.price_on_request ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
            />
          </Field>
          <Field label="Frequency">
            <select
              value={data.price_frequency}
              onChange={(e) => onChange('price_frequency', e.target.value)}
              disabled={data.price_on_request}
              className={`${selectClass} ${data.price_on_request ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
            >
              {PRICE_FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </Field>
          <Field label="Price Prefix" hint={data.purpose === 'sale' ? 'Auto-set to "Guide Price" for sale listings' : 'Text shown before the price'}>
            <input
              type="text"
              value={data.price_note}
              onChange={(e) => onChange('price_note', e.target.value)}
              placeholder={data.purpose === 'sale' ? 'Guide Price' : 'e.g. From'}
              disabled={data.price_on_request}
              className={`${inputClass} ${data.price_on_request ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
            />
          </Field>
        </div>

        <ToggleRow
          label="Enable Price Placeholder"
          sublabel="Hides price, currency, frequency and prefix from the listing"
          icon="ri-price-tag-3-line"
          checked={data.price_on_request}
          onToggle={() => handlePlaceholderToggle(!data.price_on_request)}
        />

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="ri-file-list-3-line text-[#0d1f2d] text-sm" />
            <h5 className="text-sm font-bold text-[#0d1f2d] uppercase tracking-wide">Price Condition</h5>
            <div className="flex-1 h-px bg-[#e8edf2]" />
          </div>
          <ToggleRow
            label={data.price_negotiable ? 'Negotiable' : 'Fixed Price'}
            sublabel={data.price_negotiable ? 'Buyers can make an offer' : 'Price is non-negotiable'}
            icon={data.price_negotiable ? 'ri-hand-heart-line' : 'ri-lock-line'}
            checked={data.price_negotiable}
            onToggle={() => onChange('price_negotiable', !data.price_negotiable)}
          />
        </div>

        <ToggleRow
          label="Second Price (Optional)"
          sublabel="e.g. service charge or per sqm rate"
          icon="ri-coins-line"
          checked={showSecondaryPrice}
          onToggle={() => setShowSecondaryPrice(!showSecondaryPrice)}
        />

        {showSecondaryPrice && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#0d5959]/[0.05] border-2 border-[#0d5959]/20">
            <Field label="Second Amount">
              <input type="number" value={data.secondary_price} onChange={(e) => onChange('secondary_price', e.target.value)} placeholder="0" min="0" className={inputClass} />
            </Field>
            <Field label="After The Price" hint="Label shown next to the second price">
              <input type="text" value={data.secondary_price_label} onChange={(e) => onChange('secondary_price_label', e.target.value)} placeholder="e.g. Service charge" className={inputClass} />
            </Field>
          </div>
        )}
      </section>

      {/* Property Facts */}
      <section className="pb-2">
        <SectionTitle icon="ri-home-4-line" title="Property Details" subtitle="Key facts about the property" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Stepper
            label="Bedrooms"
            icon="ri-hotel-bed-line"
            value={String(data.bedrooms ?? 0)}
            onChange={(v) => onChange('bedrooms', v)}
            max={15}
            hint="Total number of bedrooms"
          />
          <Stepper
            label="Bathrooms"
            icon="ri-showers-line"
            value={String(data.bathrooms ?? 0)}
            onChange={(v) => onChange('bathrooms', v)}
            max={10}
            hint="Total number of bathrooms"
          />
          <Stepper
            label="Parking Spaces"
            icon="ri-car-line"
            value={String(data.parking ?? 0)}
            onChange={(v) => onChange('parking', v)}
            max={10}
            hint="Garages or parking bays available"
          />
        </div>
      </section>

      {/* Additional Details */}
      <section className="pb-2">
        <SectionTitle icon="ri-more-fill" title="Additional Details" subtitle="Extra highlights that elevate this listing" />
        <div className="space-y-3">
          {/* Proximity to Amenities - full width, first */}
          <Field label="Proximity to Amenities" hint="e.g. 2 min walk to mall, 5 min to hospital">
            <input
              type="text"
              value={data.proximity_to_amenities}
              onChange={(e) => onChange('proximity_to_amenities', e.target.value)}
              placeholder="Describe nearby amenities"
              className={inputClass}
            />
          </Field>

          {/* Backup Power */}
          <ToggleRow
            label="Backup Power"
            sublabel="Property has a backup power system"
            icon="ri-flashlight-line"
            activeIcon="ri-flashlight-fill"
            checked={data.has_backup_power}
            onToggle={() => onChange('has_backup_power', !data.has_backup_power)}
          />
          {data.has_backup_power && (
            <Field label="Describe Backup Setup" hint="e.g. Generator, Solar, Inverter">
              <input
                type="text"
                value={data.backup_power}
                onChange={(e) => onChange('backup_power', e.target.value)}
                placeholder="Describe backup power setup"
                className={inputClass}
              />
            </Field>
          )}

          <ToggleRow
            label="Gated Community"
            sublabel="Property is located within a secure gated estate"
            icon="ri-door-closed-line"
            activeIcon="ri-door-open-line"
            checked={data.gated_community}
            onToggle={() => onChange('gated_community', !data.gated_community)}
          />

          {/* Staff Quarters */}
          <ToggleRow
            label="Staff Quarters"
            sublabel="Dedicated living quarters for domestic staff"
            icon="ri-home-gear-line"
            checked={data.staff_quarters_count !== '0'}
            onToggle={() => onChange('staff_quarters_count', data.staff_quarters_count !== '0' ? '0' : '1')}
          />
          {data.staff_quarters_count !== '0' && (
            <Stepper
              label="Staff Quarters Rooms"
              icon="ri-home-gear-line"
              value={String(data.staff_quarters_count ?? 0)}
              onChange={(v) => onChange('staff_quarters_count', v)}
              max={10}
              hint="Number of staff quarters rooms"
            />
          )}

          {/* Swimming Pool */}
          <ToggleRow
            label="Swimming Pool"
            sublabel="Property includes a private or shared swimming pool"
            icon="ri-water-flash-line"
            activeIcon="ri-drop-fill"
            checked={data.swimming_pool}
            onToggle={() => onChange('swimming_pool', !data.swimming_pool)}
          />

          {/* Gym */}
          <ToggleRow
            label="Gym / Fitness Centre"
            sublabel="Property includes a private or shared gym facility"
            icon="ri-heart-pulse-line"
            activeIcon="ri-heart-pulse-fill"
            checked={data.gym}
            onToggle={() => onChange('gym', !data.gym)}
          />

          {/* Unique Features */}
          <Field label="Unique Features" hint="Any standout feature not listed above (e.g. Smart Home, Cinema Room, Wine Cellar)">
            <input
              type="text"
              value={data.unique_features}
              onChange={(e) => onChange('unique_features', e.target.value)}
              placeholder="Describe unique features"
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* Size & Year */}
      <section className="pb-2">
        <SectionTitle icon="ri-ruler-2-line" title="Size & Year" subtitle="Measurements and construction year" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Property Size" hint="Total built-up / covered area">
            <div className="flex gap-2">
              <input
                type="number"
                value={data.size_sqm}
                onChange={(e) => onChange('size_sqm', e.target.value)}
                placeholder="Enter property area size"
                min="0"
                className={`${inputClass} flex-[3]`}
              />
              <select
                value={data.property_size_postfix || 'sqm'}
                onChange={(e) => onChange('property_size_postfix', e.target.value)}
                className={`${selectClass} flex-1 min-w-0`}
              >
                {SIZE_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </Field>
          <Field label="Land Area" hint="Total plot / land size (if applicable)">
            <div className="flex gap-2">
              <input
                type="number"
                value={data.land_area}
                onChange={(e) => onChange('land_area', e.target.value)}
                placeholder="Enter property land area"
                min="0"
                className={`${inputClass} flex-[3]`}
              />
              <select
                value={data.land_area_postfix || 'sqm'}
                onChange={(e) => onChange('land_area_postfix', e.target.value)}
                className={`${selectClass} flex-1 min-w-0`}
              >
                {LAND_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </Field>
          <div className="col-span-1 sm:col-span-2">
            <Field label="Year Built" hint="Year the property was constructed">
              <input
                type="number"
                value={data.year_built}
                onChange={(e) => onChange('year_built', e.target.value)}
                placeholder="Enter year built"
                min="1800"
                max={new Date().getFullYear() + 5}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* Furnishing */}
      <section className="pb-2">
        <SectionTitle icon="ri-sofa-line" title="Furnishing" />
        <ToggleRow
          label={data.furnished ? 'Furnished' : 'Unfurnished'}
          sublabel="Property comes with furniture"
          icon={data.furnished ? 'ri-home-smile-line' : 'ri-home-line'}
          checked={data.furnished}
          onToggle={() => onChange('furnished', !data.furnished)}
        />
      </section>

    </div>
  );
}