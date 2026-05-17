import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TYPE_OPTIONS = [
  'Apartment', 'House', 'Villa', 'Penthouse',
  'Commercial', 'Office', 'Land', 'Townhouse',
];

const PRICE_OPTIONS = [
  { value: '5000',    label: '$5,000' },
  { value: '10000',   label: '$10,000' },
  { value: '50000',   label: '$50,000' },
  { value: '100000',  label: '$100,000' },
  { value: '200000',  label: '$200,000' },
  { value: '300000',  label: '$300,000' },
  { value: '500000',  label: '$500,000' },
  { value: '750000',  label: '$750,000' },
  { value: '1000000', label: '$1,000,000' },
];

const BEDS_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];

interface Props {
  open: boolean;
  onClose: () => void;
}

type Tab = 'rent' | 'buy';

export default function MobileSearchSheet({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('rent');
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [beds, setBeds] = useState('Any');

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (selectedType) params.set('type', selectedType.toLowerCase());
    if (maxPrice) params.set('max-price', maxPrice);
    if (beds !== 'Any') params.set('beds', beds.replace('+', ''));
    params.set('status', tab === 'rent' ? 'for-rent' : 'for-sale');
    navigate(`/listings?${params.toString()}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const activeCount = [selectedType, maxPrice, beds !== 'Any' ? beds : ''].filter(Boolean).length;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet — slides up from bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl overflow-hidden"
        style={{
          maxHeight: '92vh',
          animation: 'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100">
          <p className="text-[13px] font-semibold text-stone-800 tracking-wide">Find a Property</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 cursor-pointer"
          >
            <i className="ri-close-line text-sm" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92vh - 108px)' }}>
          <div className="px-4 pt-3 pb-4 space-y-3">

            {/* Rent / Buy tabs */}
            <div className="flex bg-stone-100 rounded-full p-1">
              {(['rent', 'buy'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-[7px] rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    tab === t
                      ? 'bg-[#001731] text-white'
                      : 'text-stone-500'
                  }`}
                >
                  {t === 'rent' ? 'For Rent' : 'For Sale'}
                </button>
              ))}
            </div>

            {/* Keyword search */}
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Location or keyword
              </label>
              <div className="flex items-center gap-2.5 px-3 h-[42px] bg-[#f5f5f5] border border-stone-200 rounded-[4px]">
                <i className="ri-map-pin-2-line text-[#D4A853] text-sm shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Kololo, Muyenga, Nakasero..."
                  className="flex-1 bg-transparent text-[13px] text-stone-800 placeholder:text-stone-400 outline-none"
                  autoFocus
                />
                {keyword && (
                  <button onClick={() => setKeyword('')} className="text-stone-400 cursor-pointer">
                    <i className="ri-close-circle-line text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Property type chips */}
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                Property Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(selectedType === t ? '' : t)}
                    className={`px-3 py-[5px] rounded-full text-[11px] font-medium border transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      selectedType === t
                        ? 'bg-[#001731] text-white border-[#001731]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Max price */}
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Max. Price
              </label>
              <div className="relative">
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 h-[42px] bg-[#f5f5f5] border border-stone-200 rounded-[4px] text-[13px] text-stone-700 appearance-none outline-none cursor-pointer"
                >
                  <option value="">No limit</option>
                  {PRICE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Bedrooms
              </label>
              <div className="flex gap-1.5">
                {BEDS_OPTIONS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBeds(b)}
                    className={`flex-1 py-[7px] rounded-[4px] text-[11px] font-semibold border transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      beds === b
                        ? 'bg-[#D4A853] text-white border-[#D4A853]'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Sticky search button */}
        <div className="px-4 py-3 border-t border-stone-100 bg-white">
          <button
            onClick={handleSearch}
            className="w-full h-[42px] bg-[#001731] hover:bg-[#002349] text-white text-[13px] font-semibold uppercase tracking-widest rounded-[4px] transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
          >
            <i className="ri-search-line text-sm" />
            Search Properties
            {activeCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-[#D4A853] text-white text-[10px] font-bold rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
