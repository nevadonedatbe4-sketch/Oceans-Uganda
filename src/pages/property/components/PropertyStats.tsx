import { usePropertyLayout } from '@/hooks/usePropertyLayout';
import type { FullListing } from '../page';

interface Props {
  listing: FullListing;
}

function getFieldValue(fieldId: string, listing: FullListing): string {
  const shortId = listing.id.slice(0, 8).toUpperCase();
  switch (fieldId) {
    case 'property_type': return listing.property_type || '—';
    case 'bedrooms':      return listing.bedrooms > 0 ? String(listing.bedrooms) : '—';
    case 'bathrooms':     return listing.bathrooms > 0 ? String(listing.bathrooms) : '—';
    case 'garage':        return listing.parking > 0 ? String(listing.parking) : '—';
    case 'property_id':   return shortId;
    case 'rooms':         return listing.bedrooms > 0 ? String(listing.bedrooms) : '—';
    case 'land_area':     return listing.size_sqm ? `${listing.size_sqm} m²` : '—';
    case 'year_built':    return '—';
    case 'area_size':     return listing.size_sqm ? `${listing.size_sqm} m²` : '—';
    default:              return '—';
  }
}

/* Icon map for each field */
const FIELD_ICONS: Record<string, string> = {
  property_type: 'ri-home-4-line',
  bedrooms:      'ri-hotel-bed-line',
  bathrooms:     'ri-showers-line',
  garage:        'ri-car-line',
  property_id:   'ri-fingerprint-line',
  rooms:         'ri-door-open-line',
  land_area:     'ri-landscape-line',
  year_built:    'ri-calendar-line',
  area_size:     'ri-fullscreen-line',
};

/* Image icon overrides for specific fields */
const FIELD_ICON_IMAGES: Record<string, string> = {
  bathrooms: 'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/eb69730b-498d-4003-a1ed-d99751a53d5c_218-2188448_bathtub-shower-comments-bathroom-icon-png.png?v=0a25a96732facd626d36b15d1ce0735c',
};

/* Short label forms for mobile */
const SHORT_LABELS: Record<string, string> = {
  property_type: 'Type',
  bedrooms:      'Beds',
  bathrooms:     'Baths',
  garage:        'Garage',
  property_id:   'ID',
  rooms:         'Rooms',
  land_area:     'Area',
  year_built:    'Year',
  area_size:     'Area',
};

export default function PropertyStats({ listing }: Props) {
  const { settings, loading } = usePropertyLayout();

  if (loading) {
    return (
      <div className="flex border border-[#e5e5e5] overflow-hidden animate-pulse" style={{ borderRadius: '2px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center px-4 py-5 gap-2 border-r border-[#e5e5e5] last:border-r-0">
            <div className="h-5 w-5 bg-[#e5e5e5] rounded-full" />
            <div className="h-3 w-10 bg-[#e5e5e5] rounded" />
            <div className="h-2 w-8 bg-[#f0ede8] rounded" />
          </div>
        ))}
      </div>
    );
  }

  const { enabled_fields, show_property_id } = settings.overview_settings;

  const fields = show_property_id
    ? enabled_fields
    : enabled_fields.filter(f => f.id !== 'property_id');

  return (
    <div className="flex w-full border border-[#e5e5e5] overflow-hidden" style={{ borderRadius: '2px' }}>
      {fields.map((field, idx) => {
        const value = getFieldValue(field.id, listing);
        const icon  = FIELD_ICONS[field.id] || field.icon || 'ri-home-line';
        const isLast = idx === fields.length - 1;

        return (
          <div
            key={field.id}
            className={`flex-1 flex flex-col items-center justify-center px-0.5 py-2 md:px-3 md:py-4 text-center min-w-0 overflow-hidden ${!isLast ? 'border-r border-[#e5e5e5]' : ''}`}
            style={{ background: '#fff' }}
          >
            {/* Icon + value compact row */}
            <div className="flex items-center justify-center gap-0.5 md:gap-1.5 mb-0.5 w-full">
              <div className="w-3 h-3 md:w-4 md:h-4 flex items-center justify-center shrink-0">
                {FIELD_ICON_IMAGES[field.id] ? (
                  <img
                    src={FIELD_ICON_IMAGES[field.id]}
                    alt={field.label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <i className={`${icon} text-[10px] md:text-sm`} style={{ color: '#333' }} />
                )}
              </div>
              <span className="text-[10px] md:text-sm font-roboto font-bold leading-tight truncate" style={{ color: '#111' }}>
                {value}
              </span>
            </div>
            {/* Label — short form on mobile */}
            <p className="text-[8px] md:text-[10px] font-roboto font-semibold uppercase tracking-wide truncate w-full" style={{ color: '#888' }}>
              {SHORT_LABELS[field.id] || field.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}