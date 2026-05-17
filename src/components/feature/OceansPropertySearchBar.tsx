import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const STATUS_OPTIONS = ['For Sale', 'For Rent'];
const TYPE_OPTIONS = ['Any Type', 'Apartment', 'House', 'Villa', 'Office', 'Land', 'Commercial', 'Penthouse', 'Townhouse', 'Studio'];
const MAX_PRICE_OPTIONS = ['Max. Price', '$500', '$1,000', '$2,000', '$5,000', '$10,000', '$20,000', '$50,000', '$100,000', '$200,000', '$500,000', '$1,000,000+'];
const LOCATION_OPTIONS = ['Any', 'Kololo', 'Nakasero', 'Muyenga', 'Bugolobi', 'Naguru', 'Munyonyo', 'Ntinda', 'Bukoto', 'Kisaasi'];
const BEDS_OPTIONS = ['Any beds', '1+ beds', '2+ beds', '3+ beds', '4+ beds', '5+ beds'];
const BATHS_OPTIONS = ['Any baths', '1+ baths', '2+ baths', '3+ baths', '4+ baths'];
const PRICE_RANGE_OPTIONS = ['Any price', 'Under $100K', '$100K–$300K', '$300K–$500K', '$500K–$1M', 'Over $1M'];
const RADIUS_OPTIONS = ['Any radius', 'This area only', '+ 1 km', '+ 3 km', '+ 5 km', '+ 10 km'];

/* ── Design System Tokens ── */
const DS = {
  height: 'h-12',
  radius: 'rounded-[4px]',
  weight: 'font-semibold',
  transition: 'transition-all duration-200 ease',
  primary: {
    bg: 'bg-[#0d5959]',
    bgHover: 'hover:bg-[#0b4f4f]',
    text: 'text-white',
    textHover: '',
    border: 'border border-transparent',
    borderHover: '',
  },
  secondary: {
    bg: 'bg-white',
    bgHover: 'hover:bg-[#0d5959]',
    text: 'text-[#0d5959]',
    textHover: 'hover:text-white',
    border: 'border border-[#d1d5db]',
    borderHover: 'hover:border-[#0d5959]',
  },
  utility: {
    bg: 'bg-white',
    bgHover: 'hover:bg-[#001731]',
    text: 'text-[#001731]',
    textHover: 'hover:text-white',
    border: 'border border-[#9ca3af]',
    borderHover: 'hover:border-[#001731]',
  },
} as const;

function btnClass(variant: 'primary' | 'secondary' | 'utility', extra = '') {
  const v = DS[variant];
  return [
    'flex items-center gap-2',
    'text-sm font-roboto',
    DS.height,
    DS.radius,
    DS.weight,
    DS.transition,
    'cursor-pointer whitespace-nowrap',
    v.bg,
    v.bgHover,
    v.text,
    ...(v.textHover ? [v.textHover] : []),
    v.border,
    ...(v.borderHover ? [v.borderHover] : []),
    extra,
  ].join(' ');
}

interface DropdownProps {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

function Dropdown({ open, children, className = '' }: DropdownProps) {
  if (!open) return null;
  return (
    <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 z-50 min-w-[160px] py-1 ${className}`}>
      {children}
    </div>
  );
}

interface OceansPropertySearchBarProps {
  targetPath?: string;
  controlled?: boolean;
  value?: SearchBarValue;
  onChange?: (value: SearchBarValue) => void;
}

export interface SearchBarValue {
  query: string;
  status: string;
  type: string;
  maxPrice: string;
  location: string;
  beds: string;
  baths: string;
  priceRange: string;
}

interface Suggestion {
  label: string;
  value: string;
  type: 'neighborhood' | 'city' | 'address';
}

const DEFAULT_VALUE: SearchBarValue = {
  query: '',
  status: 'For Sale',
  type: 'Any Type',
  maxPrice: 'Max. Price',
  location: 'Any',
  beds: 'Any',
  baths: 'Any',
  priceRange: 'Any',
};

function valueFromParams(params: URLSearchParams): SearchBarValue {
  const purpose = params.get('purpose');
  let status = DEFAULT_VALUE.status;
  if (purpose === 'rent') status = 'For Rent';
  else if (purpose === 'sale') status = 'For Sale';

  return {
    query: params.get('q') || '',
    status,
    type: params.get('type') || 'Any Type',
    maxPrice: params.get('maxPrice') ? `$${params.get('maxPrice')}` : 'Max. Price',
    location: params.get('area') || 'Any',
    beds: params.get('beds') ? `${params.get('beds')}+` : 'Any',
    baths: 'Any',
    priceRange: 'Any',
  };
}

export default function OceansPropertySearchBar({
  targetPath = '/all-properties',
  controlled = false,
  value,
  onChange,
}: OceansPropertySearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isControlled = controlled && value !== undefined;
  const initialValue = isControlled ? value! : valueFromParams(searchParams);

  const [query, setQuery] = useState(initialValue.query);
  const [status, setStatus] = useState(initialValue.status);
  const [type, setType] = useState(initialValue.type);
  const [maxPrice, setMaxPrice] = useState(initialValue.maxPrice);
  const [advanced, setAdvanced] = useState(false);

  const [location, setLocation] = useState(initialValue.location);
  const [beds, setBeds] = useState(initialValue.beds);
  const [baths, setBaths] = useState(initialValue.baths);
  const [priceRange, setPriceRange] = useState(initialValue.priceRange);
  const [radius, setRadius] = useState('Any radius');

  /* Autocomplete */
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const queryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [statusOpen, setStatusOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [bedsOpen, setBedsOpen] = useState(false);
  const [bathsOpen, setBathsOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [radiusOpen, setRadiusOpen] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);

  /* ── Autocomplete fetch ── */
  useEffect(() => {
    if (queryTimeoutRef.current) clearTimeout(queryTimeoutRef.current);
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
    queryTimeoutRef.current = setTimeout(() => fetchSuggestions(query.trim()), 250);
    return () => {
      if (queryTimeoutRef.current) clearTimeout(queryTimeoutRef.current);
    };
  }, [query]);

  async function fetchSuggestions(q: string) {
    const escaped = q.replace(/[%_]/g, '\\$&');

    const [{ data: nbByName }, { data: nbByCity }, { data: lsByAddr }, { data: lsByCity }, { data: lsByLoc }] = await Promise.all([
      supabase.from('neighborhoods').select('name, city').ilike('name', `%${escaped}%`).eq('published', true).limit(3),
      supabase.from('neighborhoods').select('name, city').ilike('city', `%${escaped}%`).eq('published', true).limit(2),
      supabase.from('listings').select('address, city, location').ilike('address', `%${escaped}%`).eq('published', true).limit(3),
      supabase.from('listings').select('address, city, location').ilike('city', `%${escaped}%`).eq('published', true).limit(2),
      supabase.from('listings').select('address, city, location').ilike('location', `%${escaped}%`).eq('published', true).limit(2),
    ]);

    const all: Suggestion[] = [];
    const seen = new Set<string>();

    const push = (s: Suggestion) => {
      const key = s.value.toLowerCase().trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        all.push(s);
      }
    };

    nbByName?.forEach((n) => push({ label: n.name, value: n.name, type: 'neighborhood' }));
    nbByCity?.forEach((n) => { if (n.city) push({ label: n.city, value: n.city, type: 'city' }); });
    lsByAddr?.forEach((l) => { if (l.address) push({ label: l.address, value: l.address, type: 'address' }); });
    lsByCity?.forEach((l) => { if (l.city) push({ label: l.city, value: l.city, type: 'city' }); });
    lsByLoc?.forEach((l) => { if (l.location) push({ label: l.location, value: l.location, type: 'address' }); });

    setSuggestions(all.slice(0, 8));
    setSuggestionsOpen(all.length > 0);
    setHighlightedIndex(-1);
  }

  function selectSuggestion(s: Suggestion) {
    setQuery(s.value);
    emitChange({ query: s.value });
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleQueryKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' && suggestionsOpen) {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp' && suggestionsOpen) {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (suggestionsOpen && highlightedIndex >= 0) {
        e.preventDefault();
        const s = suggestions[highlightedIndex];
        setQuery(s.value);
        emitChange({ query: s.value });
        setSuggestionsOpen(false);
        setHighlightedIndex(-1);
        handleSearch(s.value);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setSuggestionsOpen(false);
      setHighlightedIndex(-1);
    }
  }

  function renderSuggestionsDropdown() {
    if (!suggestionsOpen || suggestions.length === 0) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[4px] shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
        {suggestions.map((s, i) => (
          <div
            key={`${s.type}-${s.value}-${i}`}
            className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
              i === highlightedIndex ? 'bg-[#f0f7f7]' : 'hover:bg-[#f5f5f5]'
            }`}
            onClick={() => selectSuggestion(s)}
            onMouseEnter={() => setHighlightedIndex(i)}
          >
            <span className="w-4 h-4 flex items-center justify-center shrink-0">
              <i className={`text-stone-400 text-sm ${
                s.type === 'neighborhood' ? 'ri-map-pin-line' :
                s.type === 'city' ? 'ri-building-line' :
                'ri-home-4-line'
              }`} />
            </span>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-roboto text-[#374151] truncate">{s.label}</span>
              <span className="text-[11px] font-roboto text-stone-400 capitalize leading-tight">{s.type}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  useEffect(() => {
    if (controlled) return;
    const v = valueFromParams(searchParams);
    setQuery(v.query);
    setStatus(v.status);
    setType(v.type);
    setMaxPrice(v.maxPrice);
    setLocation(v.location);
    setBeds(v.beds);
    setBaths(v.baths);
    setPriceRange(v.priceRange);
  }, [searchParams, controlled]);

  useEffect(() => {
    if (!isControlled || !value) return;
    setQuery(value.query);
    setStatus(value.status);
    setType(value.type);
    setMaxPrice(value.maxPrice);
    setLocation(value.location);
    setBeds(value.beds);
    setBaths(value.baths);
    setPriceRange(value.priceRange);
  }, [isControlled, value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
        setTypeOpen(false);
        setPriceOpen(false);
        setLocationOpen(false);
        setBedsOpen(false);
        setBathsOpen(false);
        setPriceRangeOpen(false);
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function closeAll() {
    setStatusOpen(false);
    setTypeOpen(false);
    setPriceOpen(false);
    setLocationOpen(false);
    setBedsOpen(false);
    setBathsOpen(false);
    setPriceRangeOpen(false);
    setRadiusOpen(false);
    setSuggestionsOpen(false);
  }

  function emitChange(overrides: Partial<SearchBarValue> = {}) {
    if (onChange) {
      onChange({
        query,
        status,
        type,
        maxPrice,
        location,
        beds,
        baths,
        priceRange,
        ...overrides,
      });
    }
  }

  function handleSearch(overrideQuery?: string) {
    const q = overrideQuery ?? query;
    if (isControlled && onChange) {
      emitChange({ query: q });
      return;
    }
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    params.set('purpose', status === 'For Rent' ? 'rent' : 'sale');
    if (type !== 'Any Type') params.set('type', type);
    if (maxPrice !== 'Max. Price') params.set('maxPrice', maxPrice.replace(/[^0-9]/g, ''));
    if (location !== 'Any') params.set('area', location);
    if (beds !== 'Any') params.set('beds', beds.replace('+', ''));
    navigate(`${targetPath}?${params.toString()}`);
  }

  function handleClear() {
    setQuery('');
    setStatus('For Sale');
    setType('Any Type');
    setMaxPrice('Max. Price');
    setLocation('Any');
    setBeds('Any beds');
    setBaths('Any baths');
    setPriceRange('Any price');
    setRadius('Any radius');
    setAdvanced(false);
    setSuggestions([]);
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
    closeAll();
    if (onChange) onChange({ ...DEFAULT_VALUE });
    if (!controlled) navigate(`${targetPath}`);
  }

  const optionClass = 'px-4 py-2 text-sm font-roboto text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap transition-colors';
  const activeOptionClass = 'px-4 py-2 text-sm font-roboto text-[#115e59] font-semibold bg-[#f5f5f5] cursor-pointer whitespace-nowrap';

  function MobileField({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between px-3 h-[42px] border border-[#d1d5db] rounded-[4px] bg-white text-left cursor-pointer"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">{label}</span>
          <span className="text-[13px] font-roboto text-stone-600 leading-tight mt-0.5">{value}</span>
        </div>
        <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
          <i className="ri-arrow-down-s-line text-stone-400 text-sm" />
        </span>
      </button>
    );
  }

  function MobileDropdown({ open, children }: { open: boolean; children: React.ReactNode }) {
    if (!open) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-[4px] z-50 py-1 mb-1">
        {children}
      </div>
    );
  }

  return (
    <div ref={barRef} className="bg-white border-b border-gray-100">
      {/* ═════════════ DESKTOP (lg+) ═════════════ */}
      <div className="hidden lg:block px-10 py-3">
        <div className="flex items-stretch gap-3">
          {/* Address input */}
          <div className="relative flex items-center gap-2.5 px-4 bg-white border border-[#d1d5db] rounded-[4px] h-12 flex-[1.5] min-w-0">
            <span className="w-4 h-4 flex items-center justify-center shrink-0">
              <i className="ri-search-line text-stone-400 text-sm" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); emitChange({ query: e.target.value }); }}
              onKeyDown={handleQueryKeyDown}
              placeholder="Enter an address, town, street, zip or property ID"
              className="flex-1 min-w-0 text-sm font-roboto font-semibold text-[#374151] placeholder:text-[#9ca3af] focus:outline-none bg-transparent"
            />
            {renderSuggestionsDropdown()}
          </div>

          {/* Status dropdown */}
          <div className="relative h-12">
            <button
              type="button"
              onClick={() => { closeAll(); setStatusOpen((v) => !v); }}
              className="h-full flex items-center gap-2 px-4 text-sm font-roboto font-semibold text-[#374151] hover:text-[#111827] transition-colors cursor-pointer whitespace-nowrap bg-white border border-[#d1d5db] rounded-[4px] hover:border-[#9ca3af]"
            >
              <span>{status}</span>
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            <Dropdown open={statusOpen}>
              {STATUS_OPTIONS.map((o) => (
                <div
                  key={o}
                  className={o === status ? activeOptionClass : optionClass}
                  onClick={() => { setStatus(o); setStatusOpen(false); emitChange({ status: o }); }}
                >
                  {o}
                </div>
              ))}
            </Dropdown>
          </div>

          {/* Type dropdown */}
          <div className="relative h-12">
            <button
              type="button"
              onClick={() => { closeAll(); setTypeOpen((v) => !v); }}
              className="h-full flex items-center gap-1.5 px-4 text-sm font-roboto font-semibold text-[#374151] hover:text-[#111827] transition-colors cursor-pointer whitespace-nowrap bg-white border border-[#d1d5db] rounded-[4px] hover:border-[#9ca3af]"
            >
              <span>{type === 'Any Type' ? 'Property Type' : type}</span>
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${typeOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            <Dropdown open={typeOpen}>
              {TYPE_OPTIONS.map((o) => (
                <div
                  key={o}
                  className={o === type ? activeOptionClass : optionClass}
                  onClick={() => { setType(o); setTypeOpen(false); emitChange({ type: o }); }}
                >
                  {o}
                </div>
              ))}
            </Dropdown>
          </div>

          {/* Max Price dropdown */}
          <div className="relative h-12">
            <button
              type="button"
              onClick={() => { closeAll(); setPriceOpen((v) => !v); }}
              className="h-full flex items-center gap-2 px-4 text-sm font-roboto font-semibold text-[#374151] hover:text-[#111827] transition-colors cursor-pointer whitespace-nowrap bg-white border border-[#d1d5db] rounded-[4px] hover:border-[#9ca3af]"
            >
              <span>{maxPrice}</span>
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${priceOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            <Dropdown open={priceOpen}>
              {MAX_PRICE_OPTIONS.map((o) => (
                <div
                  key={o}
                  className={o === maxPrice ? activeOptionClass : optionClass}
                  onClick={() => { setMaxPrice(o); setPriceOpen(false); emitChange({ maxPrice: o }); }}
                >
                  {o}
                </div>
              ))}
            </Dropdown>
          </div>

          <button
            type="button"
            onClick={() => setAdvanced((v) => !v)}
            className={btnClass('secondary', 'px-3')}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-equalizer-3-line text-sm" />
            </span>
            Advanced
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className={btnClass('primary', 'px-5')}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-sm" />
            </span>
            Search
          </button>
        </div>

        {advanced && (
          <div className="mt-0 bg-white border border-[#d1d5db] rounded-b-[4px] overflow-hidden">
            <div className="px-4 pt-4 pb-3 flex flex-wrap gap-3 items-end">

              <div className="relative flex-1 min-w-[130px]">
                <button
                  type="button"
                  onClick={() => { closeAll(); setLocationOpen((v) => !v); }}
                  className="w-full flex flex-col items-start gap-0.5 px-4 py-3 rounded-[4px] border border-[#d1d5db] hover:border-[#115e59]/40 bg-white transition-all cursor-pointer text-left"
                >
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Location</span>
                  <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                    <span className="text-sm font-roboto leading-tight truncate text-[#6b7280]">{location}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${locationOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <Dropdown open={locationOpen}>
                  {LOCATION_OPTIONS.map((o) => (
                    <div
                      key={o}
                      className={o === location ? activeOptionClass : optionClass}
                      onClick={() => { setLocation(o); setLocationOpen(false); emitChange({ location: o }); }}
                    >
                      {o}
                    </div>
                  ))}
                </Dropdown>
              </div>

              {/* Bedrooms */}
              <div className="relative flex-1 min-w-[130px]">
                <button
                  type="button"
                  onClick={() => { closeAll(); setBedsOpen((v) => !v); }}
                  className="w-full flex flex-col items-start gap-0.5 px-4 py-3 rounded-[4px] border border-[#d1d5db] hover:border-[#115e59]/40 bg-white transition-all cursor-pointer text-left"
                >
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Bedrooms</span>
                  <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                    <span className="text-sm font-roboto leading-tight truncate text-[#6b7280]">{beds}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${bedsOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <Dropdown open={bedsOpen}>
                  {BEDS_OPTIONS.map((o) => (
                    <div
                      key={o}
                      className={o === beds ? activeOptionClass : optionClass}
                      onClick={() => { setBeds(o); setBedsOpen(false); emitChange({ beds: o }); }}
                    >
                      {o}
                    </div>
                  ))}
                </Dropdown>
              </div>

              {/* Bathrooms */}
              <div className="relative flex-1 min-w-[130px]">
                <button
                  type="button"
                  onClick={() => { closeAll(); setBathsOpen((v) => !v); }}
                  className="w-full flex flex-col items-start gap-0.5 px-4 py-3 rounded-[4px] border border-[#d1d5db] hover:border-[#115e59]/40 bg-white transition-all cursor-pointer text-left"
                >
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Bathrooms</span>
                  <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                    <span className="text-sm font-roboto leading-tight truncate text-[#6b7280]">{baths}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${bathsOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <Dropdown open={bathsOpen}>
                  {BATHS_OPTIONS.map((o) => (
                    <div
                      key={o}
                      className={o === baths ? activeOptionClass : optionClass}
                      onClick={() => { setBaths(o); setBathsOpen(false); emitChange({ baths: o }); }}
                    >
                      {o}
                    </div>
                  ))}
                </Dropdown>
              </div>

              {/* Price Range */}
              <div className="relative flex-1 min-w-[130px]">
                <button
                  type="button"
                  onClick={() => { closeAll(); setPriceRangeOpen((v) => !v); }}
                  className="w-full flex flex-col items-start gap-0.5 px-4 py-3 rounded-[4px] border border-[#d1d5db] hover:border-[#115e59]/40 bg-white transition-all cursor-pointer text-left"
                >
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Price Range</span>
                  <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                    <span className="text-sm font-roboto leading-tight truncate text-[#6b7280]">{priceRange}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${priceRangeOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <Dropdown open={priceRangeOpen}>
                  {PRICE_RANGE_OPTIONS.map((o) => (
                    <div
                      key={o}
                      className={o === priceRange ? activeOptionClass : optionClass}
                      onClick={() => { setPriceRange(o); setPriceRangeOpen(false); emitChange({ priceRange: o }); }}
                    >
                      {o}
                    </div>
                  ))}
                </Dropdown>
              </div>

              {/* Clear all — desktop advanced panel */}
              <button
                type="button"
                onClick={handleClear}
                className={btnClass('utility', 'px-3 h-[66px] shrink-0')}
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-close-circle-line text-sm" />
                </span>
                Clear all
              </button>

            </div>
          </div>
        )}
      </div>

      {/* ═════════════ MOBILE ONLY (<md) ═════════════ */}
      <div className="md:hidden px-3 py-2">
        {/* Row 1: Location + Filters + Search */}
        <div className="flex items-stretch gap-1.5">
          {/* Location input */}
          <div className="relative flex-1 min-w-0 flex items-center gap-2 px-3 h-11 border border-[#d1d5db] rounded-[4px] bg-white">
            <span className="w-4 h-4 flex items-center justify-center shrink-0">
              <i className="ri-map-pin-line text-stone-400 text-sm" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); emitChange({ query: e.target.value }); }}
              onKeyDown={handleQueryKeyDown}
              placeholder="Enter a location"
              className="flex-1 min-w-0 text-[13px] font-roboto font-semibold text-[#374151] placeholder:text-[#9ca3af] focus:outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); emitChange({ query: '' }); }}
                className="w-4 h-4 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <i className="ri-close-circle-line text-stone-400 text-sm" />
              </button>
            )}
            {renderSuggestionsDropdown()}
          </div>

          {/* Filters / Advanced button — icon + text */}
          <button
            type="button"
            onClick={() => setAdvanced((v) => !v)}
            className={`h-11 flex items-center gap-1.5 px-3 rounded-[4px] border transition-colors cursor-pointer shrink-0 ${advanced ? 'bg-[#0d5959] text-white border-[#0d5959]' : 'bg-white text-[#0d5959] border-[#d1d5db] hover:border-[#0d5959]'}`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-equalizer-3-line text-sm" />
            </span>
            <span className="text-xs font-roboto font-semibold whitespace-nowrap">Filters</span>
          </button>

          {/* Search icon */}
          <button
            type="button"
            onClick={handleSearch}
            className="h-11 w-11 flex items-center justify-center bg-[#0d5959] text-white rounded-[4px] hover:bg-[#0b4f4f] transition-colors cursor-pointer shrink-0"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-sm" />
            </span>
          </button>
        </div>

        {/* Row 2: Status + Type + Price — compact label/value buttons (sm only, hidden on xs) */}
        <div className="hidden sm:flex items-stretch gap-1.5 mt-1.5">
          {/* Status */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => { closeAll(); setStatusOpen((v) => !v); }}
              className="w-full h-11 flex flex-col items-start justify-center px-3 rounded-[4px] border border-[#d1d5db] bg-white hover:border-[#115e59]/40 transition-all cursor-pointer text-left"
            >
              <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Sale or Rent</span>
              <div className="flex items-center justify-between w-full mt-0.5">
                <span className="text-[13px] font-roboto font-semibold text-[#374151] leading-tight">{status}</span>
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <i className={`ri-arrow-down-s-line text-stone-400 text-xs transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </button>
            <MobileDropdown open={statusOpen}>
              {STATUS_OPTIONS.map((o) => (
                <div key={o} className={o === status ? activeOptionClass : optionClass} onClick={() => { setStatus(o); setStatusOpen(false); emitChange({ status: o }); }}>{o}</div>
              ))}
            </MobileDropdown>
          </div>

          {/* Type */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => { closeAll(); setTypeOpen((v) => !v); }}
              className="w-full h-11 flex flex-col items-start justify-center px-3 rounded-[4px] border border-[#d1d5db] bg-white hover:border-[#115e59]/40 transition-all cursor-pointer text-left"
            >
              <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Property type</span>
              <div className="flex items-center justify-between w-full mt-0.5">
                <span className="text-[13px] font-roboto font-semibold text-[#374151] leading-tight">{type === 'Any Type' ? 'Show all' : type}</span>
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <i className={`ri-arrow-down-s-line text-stone-400 text-xs transition-transform duration-200 ${typeOpen ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </button>
            <MobileDropdown open={typeOpen}>
              {TYPE_OPTIONS.map((o) => (
                <div key={o} className={o === type ? activeOptionClass : optionClass} onClick={() => { setType(o); setTypeOpen(false); emitChange({ type: o }); }}>{o}</div>
              ))}
            </MobileDropdown>
          </div>

          {/* Price */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => { closeAll(); setPriceOpen((v) => !v); }}
              className="w-full h-11 flex flex-col items-start justify-center px-3 rounded-[4px] border border-[#d1d5db] bg-white hover:border-[#115e59]/40 transition-all cursor-pointer text-left"
            >
              <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Price</span>
              <div className="flex items-center justify-between w-full mt-0.5">
                <span className="text-[13px] font-roboto font-semibold text-[#374151] leading-tight">{maxPrice === 'Max. Price' ? 'Any price' : maxPrice}</span>
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  <i className={`ri-arrow-down-s-line text-stone-400 text-xs transition-transform duration-200 ${priceOpen ? 'rotate-180' : ''}`} />
                </span>
              </div>
            </button>
            <MobileDropdown open={priceOpen}>
              {MAX_PRICE_OPTIONS.map((o) => (
                <div key={o} className={o === maxPrice ? activeOptionClass : optionClass} onClick={() => { setMaxPrice(o); setPriceOpen(false); emitChange({ maxPrice: o }); }}>{o}</div>
              ))}
            </MobileDropdown>
          </div>
        </div>

        {/* Mobile advanced panel */}
        {advanced && (
          <div className="mt-2 space-y-2">
            {/* xs-only: Status / Type / Price (folded into advanced on very small screens) */}
            <div className="sm:hidden grid grid-cols-2 gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { closeAll(); setStatusOpen((v) => !v); }}
                  className="w-full h-11 flex flex-col items-start justify-center px-3 rounded-[4px] border border-[#d1d5db] bg-white hover:border-[#115e59]/40 transition-all cursor-pointer text-left"
                >
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Sale or Rent</span>
                  <div className="flex items-center justify-between w-full mt-0.5">
                    <span className="text-[13px] font-roboto font-semibold text-[#374151] leading-tight">{status}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-xs transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <MobileDropdown open={statusOpen}>
                  {STATUS_OPTIONS.map((o) => (
                    <div key={o} className={o === status ? activeOptionClass : optionClass} onClick={() => { setStatus(o); setStatusOpen(false); emitChange({ status: o }); }}>{o}</div>
                  ))}
                </MobileDropdown>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => { closeAll(); setTypeOpen((v) => !v); }}
                  className="w-full h-11 flex flex-col items-start justify-center px-3 rounded-[4px] border border-[#d1d5db] bg-white hover:border-[#115e59]/40 transition-all cursor-pointer text-left"
                >
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Property type</span>
                  <div className="flex items-center justify-between w-full mt-0.5">
                    <span className="text-[13px] font-roboto font-semibold text-[#374151] leading-tight">{type === 'Any Type' ? 'Show all' : type}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-xs transition-transform duration-200 ${typeOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <MobileDropdown open={typeOpen}>
                  {TYPE_OPTIONS.map((o) => (
                    <div key={o} className={o === type ? activeOptionClass : optionClass} onClick={() => { setType(o); setTypeOpen(false); emitChange({ type: o }); }}>{o}</div>
                  ))}
                </MobileDropdown>
              </div>

              <div className="relative col-span-2">
                <button
                  type="button"
                  onClick={() => { closeAll(); setPriceOpen((v) => !v); }}
                  className="w-full h-11 flex flex-col items-start justify-center px-3 rounded-[4px] border border-[#d1d5db] bg-white hover:border-[#115e59]/40 transition-all cursor-pointer text-left"
                >
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Price</span>
                  <div className="flex items-center justify-between w-full mt-0.5">
                    <span className="text-[13px] font-roboto font-semibold text-[#374151] leading-tight">{maxPrice === 'Max. Price' ? 'Any price' : maxPrice}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-xs transition-transform duration-200 ${priceOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <MobileDropdown open={priceOpen}>
                  {MAX_PRICE_OPTIONS.map((o) => (
                    <div key={o} className={o === maxPrice ? activeOptionClass : optionClass} onClick={() => { setMaxPrice(o); setPriceOpen(false); emitChange({ maxPrice: o }); }}>{o}</div>
                  ))}
                </MobileDropdown>
              </div>
            </div>

            {/* 2-col grid: Location, Radius, Bedrooms, Bathrooms */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <button type="button" onClick={() => { closeAll(); setLocationOpen((v) => !v); }} className="w-full flex items-center justify-between px-3 h-[42px] border border-[#d1d5db] rounded-[4px] bg-white text-left cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Location</span>
                    <span className="text-[13px] font-roboto text-stone-600 leading-tight mt-0.5">{location}</span>
                  </div>
                  <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${locationOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <MobileDropdown open={locationOpen}>
                  {LOCATION_OPTIONS.map((o) => (
                    <div key={o} className={o === location ? activeOptionClass : optionClass} onClick={() => { setLocation(o); setLocationOpen(false); emitChange({ location: o }); }}>{o}</div>
                  ))}
                </MobileDropdown>
              </div>
              <div className="relative">
                <button type="button" onClick={() => { closeAll(); setRadiusOpen((v) => !v); }} className="w-full flex items-center justify-between px-3 h-[42px] border border-[#d1d5db] rounded-[4px] bg-white text-left cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Radius</span>
                    <span className="text-[13px] font-roboto text-stone-600 leading-tight mt-0.5">{radius}</span>
                  </div>
                  <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${radiusOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <MobileDropdown open={radiusOpen}>
                  {RADIUS_OPTIONS.map((o) => (
                    <div key={o} className={o === radius ? activeOptionClass : optionClass} onClick={() => { setRadius(o); setRadiusOpen(false); emitChange({ radius: o }); }}>{o}</div>
                  ))}
                </MobileDropdown>
              </div>
              <div className="relative">
                <button type="button" onClick={() => { closeAll(); setBedsOpen((v) => !v); }} className="w-full flex items-center justify-between px-3 h-[42px] border border-[#d1d5db] rounded-[4px] bg-white text-left cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Bedrooms</span>
                    <span className="text-[13px] font-roboto text-stone-600 leading-tight mt-0.5">{beds}</span>
                  </div>
                  <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${bedsOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <MobileDropdown open={bedsOpen}>
                  {BEDS_OPTIONS.map((o) => (
                    <div key={o} className={o === beds ? activeOptionClass : optionClass} onClick={() => { setBeds(o); setBedsOpen(false); emitChange({ beds: o }); }}>{o}</div>
                  ))}
                </MobileDropdown>
              </div>
              <div className="relative">
                <button type="button" onClick={() => { closeAll(); setBathsOpen((v) => !v); }} className="w-full flex items-center justify-between px-3 h-[42px] border border-[#d1d5db] rounded-[4px] bg-white text-left cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Bathrooms</span>
                    <span className="text-[13px] font-roboto text-stone-600 leading-tight mt-0.5">{baths}</span>
                  </div>
                  <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${bathsOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <MobileDropdown open={bathsOpen}>
                  {BATHS_OPTIONS.map((o) => (
                    <div key={o} className={o === baths ? activeOptionClass : optionClass} onClick={() => { setBaths(o); setBathsOpen(false); emitChange({ baths: o }); }}>{o}</div>
                  ))}
                </MobileDropdown>
              </div>
              <div className="relative col-span-2">
                <button type="button" onClick={() => { closeAll(); setPriceRangeOpen((v) => !v); }} className="w-full flex items-center justify-between px-3 h-[42px] border border-[#d1d5db] rounded-[4px] bg-white text-left cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Price Range</span>
                    <span className="text-[13px] font-roboto text-stone-600 leading-tight mt-0.5">{priceRange}</span>
                  </div>
                  <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${priceRangeOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <MobileDropdown open={priceRangeOpen}>
                  {PRICE_RANGE_OPTIONS.map((o) => (
                    <div key={o} className={o === priceRange ? activeOptionClass : optionClass} onClick={() => { setPriceRange(o); setPriceRangeOpen(false); emitChange({ priceRange: o }); }}>{o}</div>
                  ))}
                </MobileDropdown>
              </div>
            </div>

            {/* Clear button */}
            <button type="button" onClick={handleClear} className={btnClass('utility', 'w-full justify-center h-[42px]')}>
              <span className="w-4 h-4 flex items-center justify-center"><i className="ri-close-circle-line text-sm" /></span>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ═════════════ TABLET (md → lg) ═════════════ */}
      <div className="hidden md:block lg:hidden px-4 py-3">
        <div className="flex items-stretch gap-2">
          {/* Address */}
          <div className="relative flex items-center gap-2 px-3 bg-white border border-[#d1d5db] rounded-[4px] h-11 flex-[2] min-w-0">
            <span className="w-4 h-4 flex items-center justify-center shrink-0">
              <i className="ri-search-line text-stone-400 text-sm" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); emitChange({ query: e.target.value }); }}
              onKeyDown={handleQueryKeyDown}
              placeholder="Enter address, town or property ID"
              className="flex-1 min-w-0 text-sm font-roboto font-semibold text-[#374151] placeholder:text-[#9ca3af] focus:outline-none bg-transparent"
            />
            {renderSuggestionsDropdown()}
          </div>

          {/* Status */}
          <div className="relative h-11">
            <button
              type="button"
              onClick={() => { closeAll(); setStatusOpen((v) => !v); }}
              className="h-full flex items-center gap-1.5 px-3 text-sm font-roboto font-semibold text-[#374151] hover:text-[#111827] transition-colors cursor-pointer whitespace-nowrap bg-white border border-[#d1d5db] rounded-[4px] hover:border-[#9ca3af]"
            >
              <span>{status}</span>
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            <Dropdown open={statusOpen}>
              {STATUS_OPTIONS.map((o) => (
                <div key={o} className={o === status ? activeOptionClass : optionClass} onClick={() => { setStatus(o); setStatusOpen(false); emitChange({ status: o }); }}>{o}</div>
              ))}
            </Dropdown>
          </div>

          {/* Type */}
          <div className="relative h-11">
            <button
              type="button"
              onClick={() => { closeAll(); setTypeOpen((v) => !v); }}
              className="h-full flex items-center gap-1.5 px-3 text-sm font-roboto font-semibold text-[#374151] hover:text-[#111827] transition-colors cursor-pointer whitespace-nowrap bg-white border border-[#d1d5db] rounded-[4px] hover:border-[#9ca3af]"
            >
              <span>{type === 'Any Type' ? 'Property Type' : type}</span>
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${typeOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            <Dropdown open={typeOpen}>
              {TYPE_OPTIONS.map((o) => (
                <div key={o} className={o === type ? activeOptionClass : optionClass} onClick={() => { setType(o); setTypeOpen(false); emitChange({ type: o }); }}>{o}</div>
              ))}
            </Dropdown>
          </div>

          {/* Max Price */}
          <div className="relative h-11">
            <button
              type="button"
              onClick={() => { closeAll(); setPriceOpen((v) => !v); }}
              className="h-full flex items-center gap-1.5 px-3 text-sm font-roboto font-semibold text-[#374151] hover:text-[#111827] transition-colors cursor-pointer whitespace-nowrap bg-white border border-[#d1d5db] rounded-[4px] hover:border-[#9ca3af]"
            >
              <span>{maxPrice}</span>
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${priceOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            <Dropdown open={priceOpen}>
              {MAX_PRICE_OPTIONS.map((o) => (
                <div key={o} className={o === maxPrice ? activeOptionClass : optionClass} onClick={() => { setMaxPrice(o); setPriceOpen(false); emitChange({ maxPrice: o }); }}>{o}</div>
              ))}
            </Dropdown>
          </div>

          {/* Advanced */}
          <button type="button" onClick={() => setAdvanced((v) => !v)} className={btnClass('secondary', 'px-3 h-11')}>
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-equalizer-3-line text-sm" /></span>
            Advanced
          </button>

          {/* Search */}
          <button type="button" onClick={handleSearch} className={btnClass('primary', 'px-4 h-11')}>
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line text-sm" /></span>
            Search
          </button>
        </div>

        {/* Tablet advanced panel */}
        {advanced && (
          <div className="mt-2 bg-white border border-[#d1d5db] rounded-[4px] overflow-hidden">
            <div className="px-3 pt-3 pb-2 flex flex-wrap gap-2 items-end">
              <div className="relative flex-1 min-w-[140px]">
                <button type="button" onClick={() => { closeAll(); setLocationOpen((v) => !v); }} className="w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-[4px] border border-[#d1d5db] hover:border-[#115e59]/40 bg-white transition-all cursor-pointer text-left">
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Location</span>
                  <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                    <span className="text-sm font-roboto leading-tight truncate text-[#6b7280]">{location}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${locationOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <Dropdown open={locationOpen}>
                  {LOCATION_OPTIONS.map((o) => (
                    <div key={o} className={o === location ? activeOptionClass : optionClass} onClick={() => { setLocation(o); setLocationOpen(false); emitChange({ location: o }); }}>{o}</div>
                  ))}
                </Dropdown>
              </div>
              <div className="relative flex-1 min-w-[140px]">
                <button type="button" onClick={() => { closeAll(); setBedsOpen((v) => !v); }} className="w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-[4px] border border-[#d1d5db] hover:border-[#115e59]/40 bg-white transition-all cursor-pointer text-left">
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Bedrooms</span>
                  <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                    <span className="text-sm font-roboto leading-tight truncate text-[#6b7280]">{beds}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${bedsOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <Dropdown open={bedsOpen}>
                  {BEDS_OPTIONS.map((o) => (
                    <div key={o} className={o === beds ? activeOptionClass : optionClass} onClick={() => { setBeds(o); setBedsOpen(false); emitChange({ beds: o }); }}>{o}</div>
                  ))}
                </Dropdown>
              </div>
              <div className="relative flex-1 min-w-[140px]">
                <button type="button" onClick={() => { closeAll(); setBathsOpen((v) => !v); }} className="w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-[4px] border border-[#d1d5db] hover:border-[#115e59]/40 bg-white transition-all cursor-pointer text-left">
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Bathrooms</span>
                  <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                    <span className="text-sm font-roboto leading-tight truncate text-[#6b7280]">{baths}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${bathsOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <Dropdown open={bathsOpen}>
                  {BATHS_OPTIONS.map((o) => (
                    <div key={o} className={o === baths ? activeOptionClass : optionClass} onClick={() => { setBaths(o); setBathsOpen(false); emitChange({ baths: o }); }}>{o}</div>
                  ))}
                </Dropdown>
              </div>
              <div className="relative flex-1 min-w-[140px]">
                <button type="button" onClick={() => { closeAll(); setPriceRangeOpen((v) => !v); }} className="w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-[4px] border border-[#d1d5db] hover:border-[#115e59]/40 bg-white transition-all cursor-pointer text-left">
                  <span className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none">Price Range</span>
                  <div className="flex items-center justify-between w-full gap-1 mt-0.5">
                    <span className="text-sm font-roboto leading-tight truncate text-[#6b7280]">{priceRange}</span>
                    <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                      <i className={`ri-arrow-down-s-line text-stone-400 text-sm transition-transform duration-200 ${priceRangeOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </button>
                <Dropdown open={priceRangeOpen}>
                  {PRICE_RANGE_OPTIONS.map((o) => (
                    <div key={o} className={o === priceRange ? activeOptionClass : optionClass} onClick={() => { setPriceRange(o); setPriceRangeOpen(false); emitChange({ priceRange: o }); }}>{o}</div>
                  ))}
                </Dropdown>
              </div>
              {/* Clear all — tablet advanced panel */}
              <button type="button" onClick={handleClear} className={btnClass('utility', 'px-3 h-[58px] shrink-0')}>
                <span className="w-4 h-4 flex items-center justify-center"><i className="ri-close-circle-line text-sm" /></span>
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}