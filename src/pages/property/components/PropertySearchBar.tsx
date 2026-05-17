import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = ['Any Status', 'For Sale', 'For Rent'];
const TYPE_OPTIONS   = ['Any Type', 'Apartment', 'House', 'Villa', 'Office', 'Land', 'Commercial'];
const PRICE_OPTIONS  = ['Max. Price', '$500', '$1,000', '$2,000', '$5,000', '$10,000', '$20,000', '$50,000', '$100,000+'];

export default function PropertySearchBar() {
  const navigate = useNavigate();
  const [query,    setQuery]    = useState('');
  const [status,   setStatus]   = useState('Any Status');
  const [type,     setType]     = useState('Any Type');
  const [maxPrice, setMaxPrice] = useState('Max. Price');
  const [advanced, setAdvanced] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim())                params.set('q', query.trim());
    if (status !== 'Any Status')     params.set('purpose', status === 'For Rent' ? 'rent' : 'sale');
    if (type !== 'Any Type')         params.set('type', type);
    if (maxPrice !== 'Max. Price')   params.set('maxPrice', maxPrice.replace(/[^0-9]/g, ''));
    navigate(`/all-properties?${params.toString()}`);
  }

  return (
    <div className="w-full bg-white border-b border-[#e5e5e5]">
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex items-stretch w-full min-h-[52px]">

          {/* Search input */}
          <div className="flex-1 flex items-center border-r border-[#e5e5e5] px-4 gap-2 min-w-0">
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <i className="ri-search-line text-sm" style={{ color: '#aaa' }} />
            </div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter an address, town, street, zip or property ID"
              className="flex-1 min-w-0 bg-transparent outline-none text-sm font-roboto placeholder:text-[#bbb]"
              style={{ color: '#333', fontSize: '13px' }}
            />
          </div>

          {/* Status dropdown */}
          <div className="relative border-r border-[#e5e5e5] shrink-0">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="h-full appearance-none bg-transparent pl-4 pr-8 text-sm font-roboto outline-none cursor-pointer whitespace-nowrap"
              style={{ color: '#444', fontSize: '13px', minWidth: '140px' }}
            >
              {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-sm" style={{ color: '#aaa' }} />
            </div>
          </div>

          {/* Type dropdown */}
          <div className="relative border-r border-[#e5e5e5] shrink-0 hidden sm:block">
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="h-full appearance-none bg-transparent pl-4 pr-8 text-sm font-roboto outline-none cursor-pointer whitespace-nowrap"
              style={{ color: '#444', fontSize: '13px', minWidth: '140px' }}
            >
              {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-sm" style={{ color: '#aaa' }} />
            </div>
          </div>

          {/* Max Price dropdown */}
          <div className="relative border-r border-[#e5e5e5] shrink-0 hidden md:block">
            <select
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="h-full appearance-none bg-transparent pl-4 pr-8 text-sm font-roboto outline-none cursor-pointer whitespace-nowrap"
              style={{ color: '#444', fontSize: '13px', minWidth: '130px' }}
            >
              {PRICE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-down-s-line text-sm" style={{ color: '#aaa' }} />
            </div>
          </div>

          {/* Advanced button */}
          <button
            type="button"
            onClick={() => setAdvanced(v => !v)}
            className={`hidden lg:flex items-center gap-2 px-4 border-r border-[#e5e5e5] text-xs font-roboto font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors shrink-0 ${advanced ? 'bg-[#f5f5f5]' : 'hover:bg-[#f5f5f5]'}`}
            style={{ color: '#555' }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-settings-3-line text-sm" />
            </div>
            Advanced
          </button>

          {/* Search button */}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 text-white text-sm font-roboto font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:opacity-90 transition-opacity shrink-0"
            style={{ background: '#0f766e', fontSize: '13px' }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-sm" />
            </div>
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Advanced panel */}
        {advanced && (
          <div className="border-t border-[#e5e5e5] px-4 py-3 flex flex-wrap gap-3 bg-[#f5f5f5]">
            <div className="flex items-center gap-2">
              <label className="text-xs font-roboto font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#888' }}>Min Beds</label>
              <select className="border border-[#e5e5e5] text-xs font-roboto px-2 py-1 outline-none cursor-pointer" style={{ color: '#444', borderRadius: '2px' }}>
                {['Any', '1', '2', '3', '4', '5+'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-roboto font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#888' }}>Min Baths</label>
              <select className="border border-[#e5e5e5] text-xs font-roboto px-2 py-1 outline-none cursor-pointer" style={{ color: '#444', borderRadius: '2px' }}>
                {['Any', '1', '2', '3', '4+'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-roboto font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#888' }}>Min Price</label>
              <select className="border border-[#e5e5e5] text-xs font-roboto px-2 py-1 outline-none cursor-pointer" style={{ color: '#444', borderRadius: '2px' }}>
                {['Any', '$500', '$1,000', '$2,000', '$5,000', '$10,000'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-roboto font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: '#888' }}>Furnished</label>
              <select className="border border-[#e5e5e5] text-xs font-roboto px-2 py-1 outline-none cursor-pointer" style={{ color: '#444', borderRadius: '2px' }}>
                {['Any', 'Furnished', 'Unfurnished'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
