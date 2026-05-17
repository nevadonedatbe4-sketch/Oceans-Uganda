import { useState, useMemo } from 'react';
import PropertyCard from '@/components/base/PropertyCard';
import type { Property } from '@/types/property';

interface Props {
  get: (key: string, fallback?: string) => string;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: 'preview-1',
    title: 'Luxury 3-Bedroom Apartment in Kololo',
    type: 'Apartment',
    category: 'sale',
    badge: 'Featured',
    price: '$450,000',
    priceNote: 'Negotiable',
    description: 'A stunning luxury apartment with panoramic city views.',
    location: 'Kololo, Kampala',
    beds: 3,
    baths: 2,
    parking: 2,
    sqft: 2200,
    image: 'https://readdy.ai/api/search-image?query=modern%20luxury%20apartment%20interior%20living%20room%20elegant%20minimal%20design%20bright%20natural%20light%20high%20ceiling%20Kampala%20Uganda&width=800&height=520&seq=live-preview-prop-1&orientation=landscape',
    featured: true,
    listingDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    slug: 'luxury-3-bed-kololo',
  },
  {
    id: 'preview-2',
    title: 'Contemporary Villa with Pool — Naguru',
    type: 'Villa',
    category: 'rent',
    badge: 'New',
    price: '$3,500/mo',
    priceNote: 'Per month',
    description: 'Spacious villa with private pool and garden.',
    location: 'Naguru, Kampala',
    beds: 5,
    baths: 4,
    parking: 3,
    sqft: 4800,
    image: 'https://readdy.ai/api/search-image?query=contemporary%20villa%20swimming%20pool%20garden%20tropical%20lush%20greenery%20modern%20architecture%20exterior%20Uganda%20Africa&width=800&height=520&seq=live-preview-prop-2&orientation=landscape',
    featured: false,
    listingDate: new Date(Date.now() - 12 * 86400000).toISOString(),
    slug: 'contemporary-villa-naguru',
  },
  {
    id: 'preview-3',
    title: 'Studio Apartment — Bugolobi',
    type: 'Studio',
    category: 'rent',
    badge: '',
    price: '$650/mo',
    priceNote: '',
    description: 'Compact and modern studio in a prime location.',
    location: 'Bugolobi, Kampala',
    beds: 1,
    baths: 1,
    parking: 1,
    sqft: 480,
    image: 'https://readdy.ai/api/search-image?query=modern%20studio%20apartment%20interior%20compact%20minimalist%20design%20clean%20white%20walls%20natural%20light%20urban%20Kampala&width=800&height=520&seq=live-preview-prop-3&orientation=landscape',
    featured: false,
    listingDate: new Date(Date.now() - 45 * 86400000).toISOString(),
    slug: 'studio-bugolobi',
  },
];

type Device = 'desktop' | 'tablet' | 'mobile';
type Layout = 'grid' | 'single';

const DEVICE_CONFIG: Record<Device, { label: string; icon: string; width: string; cols: number }> = {
  desktop: { label: 'Desktop', icon: 'ri-computer-line', width: '100%', cols: 3 },
  tablet:  { label: 'Tablet',  icon: 'ri-tablet-line',  width: '768px', cols: 2 },
  mobile:  { label: 'Mobile',  icon: 'ri-smartphone-line', width: '375px', cols: 1 },
};

export default function LivePreviewPanel({ get }: Props) {
  const [device, setDevice] = useState<Device>('desktop');
  const [layout, setLayout] = useState<Layout>('grid');
  const [selectedProp, setSelectedProp] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const cfg = DEVICE_CONFIG[device];

  // Collect all active settings for the info panel
  const activeSettings = useMemo(() => [
    { label: 'Card Radius',    value: `${get('card_radius', '0')}px` },
    { label: 'Card Padding',   value: `${get('card_pad_y', '16')}px ${get('card_pad_x', '16')}px` },
    { label: 'Image Height',   value: `${get('img_card_height', '260')}px` },
    { label: 'Image Fit',      value: get('img_fit', 'cover') },
    { label: 'Image Radius',   value: `${get('img_border_radius', '0')}px` },
    { label: 'Title Color',    value: get('card_title_color', '#1a1a1a') },
    { label: 'Price Color',    value: get('card_price_color', '#1a1a1a') },
    { label: 'Separator',      value: get('card_separator', 'hairline') },
    { label: 'Date Position',  value: get('date_position', 'bottom') },
    { label: 'Date Visible',   value: get('date_visible', 'true') === 'true' ? 'Yes' : 'No' },
    { label: 'Title Size',     value: get('typo_prop_title_size', '') ? `${get('typo_prop_title_size')}px` : 'default (14px)' },
    { label: 'Price Size',     value: get('typo_price_size', '') ? `${get('typo_price_size')}px` : 'default (16px)' },
  ], [get]);

  const displayProps = layout === 'single' ? [MOCK_PROPERTIES[selectedProp]] : MOCK_PROPERTIES;

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 flex flex-wrap items-center gap-3">
        {/* Device switcher */}
        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
          {(Object.keys(DEVICE_CONFIG) as Device[]).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                device === d ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className={`${DEVICE_CONFIG[d].icon} text-sm`} />
              </span>
              {DEVICE_CONFIG[d].label}
            </button>
          ))}
        </div>

        {/* Layout switcher */}
        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => setLayout('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${layout === 'grid' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-layout-grid-2-line text-sm" />
            </span>
            Grid (3 cards)
          </button>
          <button
            onClick={() => setLayout('single')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${layout === 'single' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-layout-column-line text-sm" />
            </span>
            Single card
          </button>
        </div>

        {/* Property selector (single mode) */}
        {layout === 'single' && (
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
            {MOCK_PROPERTIES.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelectedProp(i)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${selectedProp === i ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
              >
                Card {i + 1}
              </button>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Settings guide toggle */}
          <button
            onClick={() => setShowGuide((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${showGuide ? 'bg-[#1B4332]/8 border-[#1B4332]/20 text-[#1B4332]' : 'border-stone-200 text-stone-500 hover:text-stone-700'}`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-settings-3-line text-sm" />
            </span>
            Active Settings
          </button>

          {/* Viewport badge */}
          <span className="text-[10px] text-stone-400 bg-[#f5f5f5] border border-stone-100 px-2 py-1 rounded-md whitespace-nowrap">
            {cfg.width === '100%' ? 'Full width' : cfg.width}
          </span>
        </div>
      </div>

      {/* Active settings guide */}
      {showGuide && (
        <div className="bg-white rounded-xl border border-stone-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-settings-3-line text-[#1B4332] text-sm" />
            </span>
            <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wide">Active Card Settings</h4>
            <span className="ml-auto text-[10px] text-stone-400">These are the values currently applied to the preview</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {activeSettings.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5 bg-[#f5f5f5] rounded-lg px-3 py-2">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-stone-400">{s.label}</span>
                <div className="flex items-center gap-1.5">
                  {s.label.toLowerCase().includes('color') && s.value.startsWith('#') && (
                    <span
                      className="w-3 h-3 rounded-full border border-stone-200 flex-shrink-0"
                      style={{ background: s.value }}
                    />
                  )}
                  <span className="text-xs font-medium text-stone-700 truncate">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview viewport */}
      <div className="bg-[#f5f5f3] rounded-xl border border-stone-200 overflow-hidden">
        {/* Browser chrome */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-stone-400 font-mono">
            oceans.co.ug/properties — Live Preview
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 flex items-center justify-center">
              <i className={`${cfg.icon} text-stone-400 text-sm`} />
            </span>
            <span className="text-[10px] text-stone-400 font-medium">{cfg.label}</span>
          </div>
        </div>

        {/* Scrollable preview area */}
        <div className="overflow-x-auto py-8 px-6 flex justify-center min-h-[400px]">
          <div
            style={{ width: cfg.width, maxWidth: '100%', transition: 'width 0.3s ease' }}
          >
            {/* Page context header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="h-3 w-32 bg-stone-300 rounded mb-1.5" />
                  <div className="h-5 w-56 bg-stone-400 rounded" />
                </div>
                <div className="h-8 w-24 bg-stone-300 rounded-md" />
              </div>
              <div className="h-px bg-stone-200 mt-4" />
            </div>

            {/* Cards grid */}
            <div
              className={`grid gap-5 ${
                layout === 'single'
                  ? 'grid-cols-1 max-w-[340px] mx-auto'
                  : cfg.cols === 3
                  ? 'grid-cols-3'
                  : cfg.cols === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-1'
              }`}
            >
              {displayProps.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>

            {/* Page context footer skeleton */}
            <div className="mt-8 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`h-7 w-7 rounded flex items-center justify-center text-[10px] font-medium ${n === 1 ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-500'}`}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="bg-white rounded-xl border border-stone-100 p-4">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex items-start gap-2 flex-1 min-w-[200px]">
            <span className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
              <i className="ri-information-line text-[#1B4332] text-sm" />
            </span>
            <div>
              <p className="text-xs font-semibold text-stone-700 mb-0.5">Live Preview</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                This preview renders the actual <strong>PropertyCard</strong> component using all your current Design System settings — no hardcoded styles. Changes made in any panel (Typography, Card Box, Image, Date, etc.) are reflected here instantly after saving.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 flex-1 min-w-[200px]">
            <span className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
              <i className="ri-lightbulb-line text-amber-500 text-sm" />
            </span>
            <div>
              <p className="text-xs font-semibold text-stone-700 mb-0.5">Tip</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Use the <strong>Active Settings</strong> panel above to see exactly which values are driving the current render. Switch between Desktop / Tablet / Mobile to check responsive behaviour.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 flex-1 min-w-[200px]">
            <span className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
              <i className="ri-eye-line text-stone-400 text-sm" />
            </span>
            <div>
              <p className="text-xs font-semibold text-stone-700 mb-0.5">Mock Data</p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                3 sample properties are used: a luxury apartment (For Sale, Featured), a villa (For Rent), and a studio (For Rent) — covering all card states and field combinations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
