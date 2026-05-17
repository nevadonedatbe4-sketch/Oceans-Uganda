import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: 'for-rent', label: 'For Rent' },
  { value: 'for-sale', label: 'For Sale' },
  { value: 'let', label: 'LET' },
  { value: 'new-construction', label: 'New Construction' },
  { value: 'foreclosures', label: 'Foreclosures' },
];

const TYPE_OPTIONS = [
  { value: 'residential', label: 'Residential' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'single-family-home', label: 'Single Family Home' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office' },
  { value: 'land', label: 'Land' },
];

const PRICE_OPTIONS = [
  { value: '5000', label: '$5,000' },
  { value: '10000', label: '$10,000' },
  { value: '50000', label: '$50,000' },
  { value: '100000', label: '$100,000' },
  { value: '200000', label: '$200,000' },
  { value: '300000', label: '$300,000' },
  { value: '500000', label: '$500,000' },
  { value: '750000', label: '$750,000' },
  { value: '1000000', label: '$1,000,000' },
  { value: '1500000', label: '$1,500,000' },
  { value: '2000000', label: '$2,000,000' },
  { value: '5000000', label: '$5,000,000' },
];

export default function HeroSearchBar() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (status) params.set('status', status);
    if (type) params.set('type', type);
    if (maxPrice) params.set('max-price', maxPrice);
    navigate(`/listings?${params.toString()}`);
  };

  const selectClass =
    'w-full h-full bg-transparent text-white text-sm font-roboto tracking-wide appearance-none outline-none cursor-pointer';

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Mobile: stacked vertical layout */}
      <div className="flex flex-col sm:hidden gap-0 border-2 border-white/60 backdrop-blur-md bg-black/40">
        {/* Keyword */}
        <div className="flex items-center px-3 h-[42px] border-b border-white/20">
          <i className="ri-search-line text-white/60 text-sm mr-2.5 flex-shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Address, town or property ID"
            className="flex-1 bg-transparent text-white text-[13px] font-roboto placeholder-white/50 outline-none tracking-wide min-w-0"
          />
        </div>
        {/* Status + Type row */}
        <div className="grid grid-cols-2 border-b border-white/20">
          <div className="relative flex items-center px-3 h-[42px] border-r border-white/20">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-transparent text-white text-[13px] font-roboto tracking-wide appearance-none outline-none cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-white">Status</option>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-gray-900 text-white">{o.label}</option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line text-white/50 text-sm pointer-events-none ml-1 flex-shrink-0" />
          </div>
          <div className="relative flex items-center px-3 h-[42px]">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-transparent text-white text-[13px] font-roboto tracking-wide appearance-none outline-none cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-white">Type</option>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-gray-900 text-white">{o.label}</option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line text-white/50 text-sm pointer-events-none ml-1 flex-shrink-0" />
          </div>
        </div>
        {/* Max price + button */}
        <div className="flex items-stretch">
          <div className="relative flex-1 flex items-center px-3 h-[42px] border-r border-white/20">
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-transparent text-white text-[13px] font-roboto tracking-wide appearance-none outline-none cursor-pointer"
            >
              <option value="" className="bg-gray-900 text-white">Max. Price</option>
              <option value="any" className="bg-gray-900 text-white">Any</option>
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-gray-900 text-white">{o.label}</option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line text-white/50 text-sm pointer-events-none ml-1 flex-shrink-0" />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 h-[42px] bg-golden hover:bg-golden/90 text-white text-[13px] font-roboto font-semibold tracking-[0.2em] uppercase transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-search-line text-sm" />
            Search
          </button>
        </div>
      </div>

      {/* Tablet and above: horizontal layout */}
      <div className="hidden sm:flex items-stretch border-2 border-white/60 backdrop-blur-md bg-black/30">
        {/* Keyword */}
        <div className="flex-1 flex items-center px-4 py-3 border-r-2 border-white/30 min-w-0">
          <i className="ri-search-line text-white/60 text-base mr-3 flex-shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Address, town, street or property ID"
            className="flex-1 bg-transparent text-white text-sm font-roboto placeholder-white/50 outline-none tracking-wide min-w-0"
          />
        </div>

        {/* Status */}
        <div className="relative flex items-center px-4 py-3 border-r-2 border-white/30 min-w-[150px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={selectClass}
          >
            <option value="" className="bg-gray-900 text-white">Property Status</option>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-gray-900 text-white">{o.label}</option>
            ))}
          </select>
          <i className="ri-arrow-down-s-line text-white/50 text-base pointer-events-none ml-1 flex-shrink-0" />
        </div>

        {/* Type */}
        <div className="relative flex items-center px-4 py-3 border-r-2 border-white/30 min-w-[150px]">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
          >
            <option value="" className="bg-gray-900 text-white">Property Type</option>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-gray-900 text-white">{o.label}</option>
            ))}
          </select>
          <i className="ri-arrow-down-s-line text-white/50 text-base pointer-events-none ml-1 flex-shrink-0" />
        </div>

        {/* Max Price */}
        <div className="relative flex items-center px-4 py-3 border-r-2 border-white/30 min-w-[140px]">
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={selectClass}
          >
            <option value="" className="bg-gray-900 text-white">Max. Price</option>
            <option value="any" className="bg-gray-900 text-white">Any</option>
            {PRICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-gray-900 text-white">{o.label}</option>
            ))}
          </select>
          <i className="ri-arrow-down-s-line text-white/50 text-base pointer-events-none ml-1 flex-shrink-0" />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-golden hover:bg-golden/90 text-white text-sm font-roboto font-medium tracking-[0.2em] uppercase transition-all duration-200 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-search-line text-base" />
          Search
        </button>
      </div>
    </form>
  );
}
