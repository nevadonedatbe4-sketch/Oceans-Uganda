import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

/* ── Main search bar options (unchanged) ── */
const RADIUS_OPTIONS = [
  'This area only',
  '½ mile',
  '1 mile',
  '3 miles',
  '5 miles',
  '10 miles',
  '15 miles',
  '20 miles',
  '30 miles',
  '40 miles',
] as const;

const BEDS_OPTIONS = ['Any beds', 'Studio', '1+', '2+', '3+', '4+', '5+'] as const;

const PRICE_OPTIONS_RENT = [
  'Any price',
  'Under $250 pcm',
  '$250 – $500 pcm',
  '$500 – $750 pcm',
  '$750 – $1,000 pcm',
  '$1,000 – $1,500 pcm',
  '$1,500 – $2,500 pcm',
  '$2,500 – $5,000 pcm',
  '$5,000 – $7,500 pcm',
  '$7,500 – $10,000 pcm',
  '$10,000 – $20,000 pcm',
  '$20,000 – $30,000 pcm',
  'Over $30,000 pcm',
] as const;

const PRICE_OPTIONS_BUY = [
  'Any price',
  'Under $50K',
  '$50K – $100K',
  '$100K – $200K',
  '$200K – $300K',
  '$300K – $500K',
  '$500K – $750K',
  '$750K – $1M',
  '$1M – $1.5M',
  '$1.5M – $2.5M',
  '$2.5M – $5M',
  '$5M – $10M',
  'Over $10M',
] as const;

const TYPE_OPTIONS = [
  'Any type',
  'Apartment',
  'House',
  'Villa',
  'Penthouse',
  'Townhouse',
  'Studio',
  'Land',
  'Commercial',
] as const;

const STATUS_OPTIONS = ['For Sale', 'For Rent'] as const;

/* ── Advanced filter options ── */
const ADVANCED_PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Villa',
  'Penthouse',
  'Townhouse',
  'Studio',
  'Land',
  'Commercial',
] as const;

const PROPERTY_FEATURES = [
  'New',
  'Period property',
  'Cottage',
  'Modern',
  'Utility room',
  'Basement',
  'Conservatory',
  'Home office',
  'En-suite',
  'Bathtub',
  'Patio',
  'Kitchen island',
] as const;

const MUST_HAVES = [
  'Garden',
  'Parking/garage',
  'Balcony/terrace',
  'Pets allowed',
  'Bills included',
  'Swimming pool',
  'Gym',
  'Power backup',
] as const;

const FURNISHING_OPTIONS = ['Any', 'Furnished', 'Part-furnished', 'Unfurnished'] as const;

const AVAILABILITY_OPTIONS = [
  'Show all',
  'Immediately',
  'Within 1 month',
  'Within 3 months',
  'Within 6 months',
  'Within 1 year',
] as const;

const ADDED_OPTIONS = [
  'Anytime',
  'Last 24 hours',
  'Last 3 days',
  'Last 7 days',
  'Last 14 days',
  'Last 30 days',
] as const;

const INCLUDE_EXCLUDE_OPTIONS = ['House share', 'Student accommodation'] as const;

const BEDS_MIN_OPTIONS = ['No min', 'Studio', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'] as const;
const BEDS_MAX_OPTIONS = ['No max', 'Studio', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'] as const;
const BATHS_MIN_OPTIONS = ['No min', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'] as const;
const BATHS_MAX_OPTIONS = ['No max', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'] as const;
const PRICE_MIN_OPTIONS_RENT = ['No min', '$250', '$500', '$750', '$1,000', '$1,500', '$2,500', '$5,000', '$7,500', '$10,000', '$20,000', '$30,000'] as const;
const PRICE_MAX_OPTIONS_RENT = ['No max', '$250', '$500', '$750', '$1,000', '$1,500', '$2,500', '$5,000', '$7,500', '$10,000', '$20,000', '$30,000'] as const;
const PRICE_MIN_OPTIONS_BUY = ['No min', '$50K', '$100K', '$200K', '$300K', '$500K', '$750K', '$1M', '$1.5M', '$2.5M', '$5M', '$10M'] as const;
const PRICE_MAX_OPTIONS_BUY = ['No max', '$50K', '$100K', '$200K', '$300K', '$500K', '$750K', '$1M', '$1.5M', '$2.5M', '$5M', '$10M'] as const;
const PRICE_FREQ_OPTIONS = ['Daily', 'Weekly', 'Monthly'] as const;

type TriState = 'include' | 'exclude' | 'show_only' | null;

/* ── Types ── */
export interface SearchBarValue {
  query: string;
  status: string;
  type: string;
  maxPrice: string;
  location: string;
  beds: string;
  baths: string;
  priceRange: string;
  radius?: string;
  /* Advanced filters */
  advancedPropertyTypes?: string[];
  includeExcludeFilters?: Record<string, TriState>;
  mustHaves?: string[];
  propertyFeatures?: string[];
  furnishing?: string;
  availability?: string;
  addedToSite?: string;
  advancedKeywords?: string;
  showLetAgreed?: boolean;
  showSold?: boolean;
  /* Mobile min/max filters */
  bedsMin?: string;
  bedsMax?: string;
  bathsMin?: string;
  bathsMax?: string;
  priceMin?: string;
  priceMax?: string;
  priceFrequency?: string;
}

interface OceansPropertySearchBarProps {
  targetPath?: string;
  controlled?: boolean;
  value?: SearchBarValue;
  onChange?: (value: SearchBarValue) => void;
  onSearch?: (value: SearchBarValue) => void;
}

interface Suggestion {
  label: string;
  value: string;
  type: 'neighborhood' | 'city' | 'address';
}

const DEFAULT_VALUE: SearchBarValue = {
  query: '',
  status: 'For Sale',
  type: 'Any type',
  maxPrice: 'Max. Price',
  location: 'Any',
  beds: 'Any beds',
  baths: 'Any',
  priceRange: 'Any',
  radius: 'This area only',
  advancedPropertyTypes: [],
  includeExcludeFilters: {},
  mustHaves: [],
  propertyFeatures: [],
  furnishing: 'Any',
  availability: 'Show all',
  addedToSite: 'Anytime',
  advancedKeywords: '',
  showLetAgreed: false,
  showSold: false,
  bedsMin: 'No min',
  bedsMax: 'No max',
  bathsMin: 'No min',
  bathsMax: 'No max',
  priceMin: 'No min',
  priceMax: 'No max',
  priceFrequency: 'Monthly',
};

function isRentPath(path: string): boolean {
  return path.includes('/rent');
}

function valueFromParams(params: URLSearchParams): SearchBarValue {
  const purpose = params.get('purpose');
  let status = DEFAULT_VALUE.status;
  if (purpose === 'rent') status = 'For Rent';
  else if (purpose === 'sale') status = 'For Sale';

  return {
    query: params.get('q') || '',
    status,
    type: params.get('type') || 'Any type',
    maxPrice: params.get('maxPrice') ? `$${params.get('maxPrice')}` : 'Max. Price',
    location: params.get('area') || 'Any',
    beds: params.get('beds') ? `${params.get('beds')}+` : 'Any beds',
    baths: 'Any',
    priceRange: params.get('priceRange') || 'Any',
    radius: params.get('radius') || 'This area only',
    advancedPropertyTypes: [],
    includeExcludeFilters: {},
    mustHaves: [],
    propertyFeatures: [],
    furnishing: 'Any',
    availability: 'Show all',
    addedToSite: 'Anytime',
    advancedKeywords: '',
    showLetAgreed: false,
  };
}

/* ── Select Styling Helper ── */
const selectBaseClass =
  'appearance-none h-11 px-4 pr-9 text-base font-roboto font-medium text-[#374151] bg-white border border-[#d1d5db] rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer whitespace-nowrap transition-colors';

/* ── TriState Toggle Component ── */
function TriStateToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: TriState;
  onChange: (v: TriState) => void;
}) {
  const states: { key: TriState; label: string; icon: string }[] = [
    { key: 'include', label: 'Include', icon: 'ri-add-circle-line' },
    { key: 'exclude', label: 'Exclude', icon: 'ri-close-circle-line' },
    { key: 'show_only', label: 'Show only', icon: 'ri-checkbox-circle-line' },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </span>
      <div className="flex gap-0.5 bg-stone-100 rounded-lg p-0.5">
        {states.map((s) => {
          const isActive = value === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange(isActive ? null : s.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-roboto font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-[#374151] shadow-sm'
                  : 'text-stone-400 hover:text-stone-500'
              }`}
            >
              <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                <i className={`${s.icon} text-xs`} />
              </span>
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Shared select for advanced panel ── */
function PanelSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <label className="block text-[12px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full h-11 px-3 pr-9 text-sm font-roboto font-medium text-[#374151] bg-white border border-[#d1d5db] rounded-lg focus:outline-none focus:border-primary cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="w-4 h-4 flex items-center justify-center absolute right-2.5 bottom-[11px] text-stone-400 pointer-events-none">
        <i className="ri-arrow-down-s-line text-sm" />
      </span>
    </div>
  );
}

/* ── Checkbox chip ── */
function CheckChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? 'bg-primary border-primary'
            : 'border-[#d1d5db] bg-white group-hover:border-stone-400'
        }`}
      >
        {checked && <i className="ri-check-line text-[10px] text-white" />}
      </span>
      <span className="text-sm font-roboto text-[#374151] whitespace-nowrap">{label}</span>
    </label>
  );
}

export default function OceansPropertySearchBar({
  targetPath = '/all-properties',
  controlled = false,
  value,
  onChange,
  onSearch,
}: OceansPropertySearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRent = isRentPath(targetPath);
  const { user } = useAuth();

  const isControlled = controlled && value !== undefined;
  const initialValue = isControlled ? value! : valueFromParams(searchParams);

  /* ── Main search state ── */
  const [query, setQuery] = useState(initialValue.query);
  const [status, setStatus] = useState(initialValue.status);
  const [radius, setRadius] = useState(initialValue.radius || 'This area only');
  const [beds, setBeds] = useState(initialValue.beds);
  const [priceRange, setPriceRange] = useState(
    initialValue.priceRange === 'Any' ? 'Any price' : initialValue.priceRange
  );
  const [type, setType] = useState(initialValue.type);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ── Advanced filter state ── */
  const [advancedPropertyTypes, setAdvancedPropertyTypes] = useState<string[]>(
    initialValue.advancedPropertyTypes || []
  );
  const [includeExcludeFilters, setIncludeExcludeFilters] = useState<Record<string, TriState>>(
    initialValue.includeExcludeFilters || {}
  );
  const [mustHaves, setMustHaves] = useState<string[]>(initialValue.mustHaves || []);
  const [propertyFeatures, setPropertyFeatures] = useState<string[]>(
    initialValue.propertyFeatures || []
  );
  const [furnishing, setFurnishing] = useState(initialValue.furnishing || 'Any');
  const [availability, setAvailability] = useState(initialValue.availability || 'Show all');
  const [addedToSite, setAddedToSite] = useState(initialValue.addedToSite || 'Anytime');
  const [advancedKeywords, setAdvancedKeywords] = useState(initialValue.advancedKeywords || '');
  const [showLetAgreed, setShowLetAgreed] = useState(initialValue.showLetAgreed || false);
  const [showSold, setShowSold] = useState(initialValue.showSold || false);
  /* Mobile min/max state */
  const [bedsMin, setBedsMin] = useState(initialValue.bedsMin || 'No min');
  const [bedsMax, setBedsMax] = useState(initialValue.bedsMax || 'No max');
  const [bathsMin, setBathsMin] = useState(initialValue.bathsMin || 'No min');
  const [bathsMax, setBathsMax] = useState(initialValue.bathsMax || 'No max');
  const [priceMin, setPriceMin] = useState(initialValue.priceMin || 'No min');
  const [priceMax, setPriceMax] = useState(initialValue.priceMax || 'No max');
  const [priceFrequency, setPriceFrequency] = useState(initialValue.priceFrequency || 'Monthly');

  /* Autocomplete */
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const queryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Save search modal */
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const filtersPanelRef = useRef<HTMLDivElement>(null);

  /* ── Price options based on status select ── */
  const priceOptions = status === 'For Rent' ? PRICE_OPTIONS_RENT : PRICE_OPTIONS_BUY;

  /* ── Sync with external value (controlled) ── */
  useEffect(() => {
    if (!isControlled || !value) return;
    setQuery(value.query);
    setStatus(value.status);
    setRadius(value.radius || 'This area only');
    setBeds(value.beds === 'Any' ? 'Any beds' : value.beds);
    setPriceRange(value.priceRange === 'Any' ? 'Any price' : value.priceRange);
    setType(value.type);
    setAdvancedPropertyTypes(value.advancedPropertyTypes || []);
    setIncludeExcludeFilters(value.includeExcludeFilters || {});
    setMustHaves(value.mustHaves || []);
    setPropertyFeatures(value.propertyFeatures || []);
    setFurnishing(value.furnishing || 'Any');
    setAvailability(value.availability || 'Show all');
    setAddedToSite(value.addedToSite || 'Anytime');
    setAdvancedKeywords(value.advancedKeywords || '');
    setShowLetAgreed(value.showLetAgreed || false);
    setShowSold(value.showSold || false);
    setBedsMin(value.bedsMin || 'No min');
    setBedsMax(value.bedsMax || 'No max');
    setBathsMin(value.bathsMin || 'No min');
    setBathsMax(value.bathsMax || 'No max');
    setPriceMin(value.priceMin || 'No min');
    setPriceMax(value.priceMax || 'No max');
    setPriceFrequency(value.priceFrequency || 'Monthly');
  }, [isControlled, value]);

  /* ── Sync with URL params (uncontrolled) ── */
  useEffect(() => {
    if (controlled) return;
    const v = valueFromParams(searchParams);
    setQuery(v.query);
    setStatus(v.status);
    setRadius(v.radius || 'This area only');
    setBeds(v.beds === 'Any' ? 'Any beds' : v.beds);
    setPriceRange(v.priceRange === 'Any' ? 'Any price' : v.priceRange);
    setType(v.type);
    setAdvancedPropertyTypes(v.advancedPropertyTypes || []);
    setIncludeExcludeFilters(v.includeExcludeFilters || {});
    setMustHaves(v.mustHaves || []);
    setPropertyFeatures(v.propertyFeatures || []);
    setFurnishing(v.furnishing || 'Any');
    setAvailability(v.availability || 'Show all');
    setAddedToSite(v.addedToSite || 'Anytime');
    setAdvancedKeywords(v.advancedKeywords || '');
    setShowLetAgreed(v.showLetAgreed || false);
    setShowSold(v.showSold || false);
    setBedsMin(v.bedsMin || 'No min');
    setBedsMax(v.bedsMax || 'No max');
    setBathsMin(v.bathsMin || 'No min');
    setBathsMax(v.bathsMax || 'No max');
    setPriceMin(v.priceMin || 'No min');
    setPriceMax(v.priceMax || 'No max');
    setPriceFrequency(v.priceFrequency || 'Monthly');
  }, [searchParams, controlled]);

  /* ── Click outside ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ── Close filters panel on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        filtersPanelRef.current &&
        !filtersPanelRef.current.contains(e.target as Node) &&
        barRef.current &&
        !barRef.current.contains(e.target as Node)
      ) {
        setFiltersOpen(false);
      }
    }
    if (filtersOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [filtersOpen]);

  /* ── Autocomplete ── */
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

    const [
      { data: nbByName },
      { data: nbByCity },
      { data: lsByAddr },
      { data: lsByCity },
      { data: lsByLoc },
    ] = await Promise.all([
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
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
        {suggestions.map((s, i) => (
          <div
            key={`${s.type}-${s.value}-${i}`}
            className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
              i === highlightedIndex ? 'bg-primary/8' : 'hover:bg-gray-50'
            }`}
            onClick={() => selectSuggestion(s)}
            onMouseEnter={() => setHighlightedIndex(i)}
          >
            <span className="w-4 h-4 flex items-center justify-center shrink-0">
              <i
                className={`text-stone-400 text-sm ${
                  s.type === 'neighborhood'
                    ? 'ri-map-pin-line'
                    : s.type === 'city'
                      ? 'ri-building-line'
                      : 'ri-home-4-line'
                }`}
              />
            </span>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-roboto text-[#374151] truncate">{s.label}</span>
              <span className="text-[11px] font-roboto text-stone-400 capitalize leading-tight">
                {s.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Build the current value snapshot ── */
  function buildValue(overrides: Partial<SearchBarValue> = {}): SearchBarValue {
    return {
      query: overrides.query ?? query,
      status: overrides.status ?? status,
      type: overrides.type ?? type,
      maxPrice: overrides.maxPrice ?? (priceRange === 'Any price' ? 'Max. Price' : priceRange),
      location: overrides.location ?? 'Any',
      beds: overrides.beds ?? beds,
      baths: overrides.baths ?? 'Any',
      priceRange: overrides.priceRange ?? priceRange,
      radius: overrides.radius ?? radius,
      advancedPropertyTypes: overrides.advancedPropertyTypes ?? advancedPropertyTypes,
      includeExcludeFilters: overrides.includeExcludeFilters ?? includeExcludeFilters,
      mustHaves: overrides.mustHaves ?? mustHaves,
      propertyFeatures: overrides.propertyFeatures ?? propertyFeatures,
      furnishing: overrides.furnishing ?? furnishing,
      availability: overrides.availability ?? availability,
      addedToSite: overrides.addedToSite ?? addedToSite,
      advancedKeywords: overrides.advancedKeywords ?? advancedKeywords,
      showLetAgreed: overrides.showLetAgreed ?? showLetAgreed,
      showSold: overrides.showSold ?? showSold,
      bedsMin: overrides.bedsMin ?? bedsMin,
      bedsMax: overrides.bedsMax ?? bedsMax,
      bathsMin: overrides.bathsMin ?? bathsMin,
      bathsMax: overrides.bathsMax ?? bathsMax,
      priceMin: overrides.priceMin ?? priceMin,
      priceMax: overrides.priceMax ?? priceMax,
      priceFrequency: overrides.priceFrequency ?? priceFrequency,
    };
  }

  function emitChange(overrides: Partial<SearchBarValue> = {}) {
    if (onChange) {
      onChange(buildValue(overrides));
    }
  }

  function handleSearch(overrideQuery?: string) {
    const q = overrideQuery ?? query;
    const effectiveStatus = status;
    const purposeParam = effectiveStatus === 'For Rent' ? 'rent' : 'sale';
    const currentValue = buildValue({ query: q, status: effectiveStatus });

    if (isControlled && onSearch) {
      onSearch(currentValue);
      return;
    }

    if (isControlled && onChange) {
      emitChange({ query: q, status: effectiveStatus });
      return;
    }
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    params.set('purpose', purposeParam);
    if (type !== 'Any type') params.set('type', type);
    if (priceRange !== 'Any price') params.set('priceRange', priceRange);
    if (beds !== 'Any beds') params.set('beds', beds.replace('+', ''));
    if (radius !== 'This area only') params.set('radius', radius);
    if (advancedPropertyTypes.length > 0) params.set('advTypes', advancedPropertyTypes.join(','));
    if (furnishing !== 'Any') params.set('furnishing', furnishing);
    if (availability !== 'Show all') params.set('availability', availability);
    if (addedToSite !== 'Anytime') params.set('added', addedToSite);
    if (advancedKeywords.trim()) params.set('advKeywords', advancedKeywords.trim());
    if (showLetAgreed) params.set('letAgreed', '1');
    navigate(`${targetPath}?${params.toString()}`);
  }

  function handleClear() {
    setQuery('');
    setStatus(isRent ? 'For Rent' : 'For Sale');
    setRadius('This area only');
    setBeds('Any beds');
    setPriceRange('Any price');
    setType('Any type');
    setAdvancedPropertyTypes([]);
    setIncludeExcludeFilters({});
    setMustHaves([]);
    setPropertyFeatures([]);
    setFurnishing('Any');
    setAvailability('Show all');
    setAddedToSite('Anytime');
    setAdvancedKeywords('');
    setShowLetAgreed(false);
    setShowSold(false);
    setBedsMin('No min');
    setBedsMax('No max');
    setBathsMin('No min');
    setBathsMax('No max');
    setPriceMin('No min');
    setPriceMax('No max');
    setPriceFrequency('Monthly');
    setFiltersOpen(false);
    setSuggestions([]);
    setSuggestionsOpen(false);
    setHighlightedIndex(-1);
    if (onChange) onChange({ ...DEFAULT_VALUE, status: isRent ? 'For Rent' : 'For Sale' });
    if (!controlled) navigate(targetPath);
  }

  function handleSaveSearch() {
    if (!user) {
      if (onChange) emitChange();
      return;
    }
    const currentValue = buildValue();
    setSaveName(currentValue.query || `Search — ${new Date().toLocaleDateString()}`);
    setSaveError(null);
    setSaveSuccess(false);
    setSaveModalOpen(true);
  }

  async function handleSaveConfirm() {
    if (!user || !saveName.trim()) return;
    setSaveLoading(true);
    setSaveError(null);
    const criteria = buildValue();
    const { error } = await supabase.from('saved_searches').insert({
      user_id: user.id,
      name: saveName.trim(),
      criteria,
      alert_enabled: false,
      frequency: 'daily',
    });
    setSaveLoading(false);
    if (error) {
      setSaveError(error.message);
    } else {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveModalOpen(false);
        setSaveSuccess(false);
        setSaveName('');
      }, 1500);
    }
  }

  /* ── Shared inline select component ── */
  function InlineSelect({
    options,
    value,
    onChange: onSelectChange,
    id,
  }: {
    options: readonly string[];
    value: string;
    onChange: (v: string) => void;
    id: string;
  }) {
    const selectId = `searchbar-${id}`;
    return (
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onSelectChange(e.target.value)}
          className={selectBaseClass}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="w-4 h-4 flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
          <i className="ri-arrow-down-s-line text-sm" />
        </span>
      </div>
    );
  }

  /* ── Toggle advanced type chip ── */
  function toggleAdvancedType(t: string) {
    setAdvancedPropertyTypes((prev) => {
      const next = prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t];
      emitChange({ advancedPropertyTypes: next });
      return next;
    });
  }

  function toggleMustHave(m: string) {
    setMustHaves((prev) => {
      const next = prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m];
      emitChange({ mustHaves: next });
      return next;
    });
  }

  function toggleFeature(f: string) {
    setPropertyFeatures((prev) => {
      const next = prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f];
      emitChange({ propertyFeatures: next });
      return next;
    });
  }

  function setTriState(key: string, state: TriState) {
    setIncludeExcludeFilters((prev) => {
      const next = { ...prev };
      if (state === null) {
        delete next[key];
      } else {
        next[key] = state;
      }
      emitChange({ includeExcludeFilters: next });
      return next;
    });
  }

  const isRentPage = status === 'For Rent';
  const hasAnyAdvancedFilter =
    advancedPropertyTypes.length > 0 ||
    Object.keys(includeExcludeFilters).length > 0 ||
    mustHaves.length > 0 ||
    propertyFeatures.length > 0 ||
    furnishing !== 'Any' ||
    availability !== 'Show all' ||
    addedToSite !== 'Anytime' ||
    advancedKeywords.trim().length > 0 ||
    showLetAgreed ||
    showSold;

  /* ══════════════════════════════════════════
     MOBILE ADVANCED FILTERS PANEL
     Starts with search → radius → beds min/max → baths min/max → price min/max → type → include/exclude → must-haves → actions
     ══════════════════════════════════════════ */
  function renderMobileAdvancedFiltersPanel() {
    const priceMinOpts = status === 'For Rent' ? PRICE_MIN_OPTIONS_RENT : PRICE_MIN_OPTIONS_BUY;
    const priceMaxOpts = status === 'For Rent' ? PRICE_MAX_OPTIONS_RENT : PRICE_MAX_OPTIONS_BUY;

    return (
      <div className="px-4 py-4">
        {/* ── Main search + Radius ── */}
        <div className="mb-4">
          <label className="block text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none mb-1.5">
            Radius
          </label>
          <InlineSelect
            id="mobile-radius"
            options={RADIUS_OPTIONS}
            value={radius}
            onChange={(v) => {
              setRadius(v);
              emitChange({ radius: v });
            }}
          />
        </div>

        <div className="w-full h-px bg-stone-100 mb-4" />

        {/* ── Bedrooms (min/max) ── */}
        <div className="mb-4">
          <h4 className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Bedrooms
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <PanelSelect
              label="Min beds"
              options={BEDS_MIN_OPTIONS}
              value={bedsMin}
              onChange={(v) => {
                setBedsMin(v);
                emitChange({ bedsMin: v });
              }}
            />
            <PanelSelect
              label="Max beds"
              options={BEDS_MAX_OPTIONS}
              value={bedsMax}
              onChange={(v) => {
                setBedsMax(v);
                emitChange({ bedsMax: v });
              }}
            />
          </div>
        </div>

        <div className="w-full h-px bg-stone-100 mb-4" />

        {/* ── Bathrooms (min/max) ── */}
        <div className="mb-4">
          <h4 className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Bathrooms
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <PanelSelect
              label="Min baths"
              options={BATHS_MIN_OPTIONS}
              value={bathsMin}
              onChange={(v) => {
                setBathsMin(v);
                emitChange({ bathsMin: v });
              }}
            />
            <PanelSelect
              label="Max baths"
              options={BATHS_MAX_OPTIONS}
              value={bathsMax}
              onChange={(v) => {
                setBathsMax(v);
                emitChange({ bathsMax: v });
              }}
            />
          </div>
        </div>

        <div className="w-full h-px bg-stone-100 mb-4" />

        {/* ── Price (min/max + frequency) ── */}
        <div className="mb-4">
          <h4 className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Price
          </h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <PanelSelect
              label="Min price"
              options={priceMinOpts}
              value={priceMin}
              onChange={(v) => {
                setPriceMin(v);
                emitChange({ priceMin: v });
              }}
            />
            <PanelSelect
              label="Max price"
              options={priceMaxOpts}
              value={priceMax}
              onChange={(v) => {
                setPriceMax(v);
                emitChange({ priceMax: v });
              }}
            />
          </div>
          <PanelSelect
            label="Price per"
            options={PRICE_FREQ_OPTIONS}
            value={priceFrequency}
            onChange={(v) => {
              setPriceFrequency(v);
              emitChange({ priceFrequency: v });
            }}
          />
        </div>

        <div className="w-full h-px bg-stone-100 mb-4" />

        {/* ── Property type checkboxes ── */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Property type
            </h4>
            <button
              type="button"
              onClick={() => {
                setAdvancedPropertyTypes([...ADVANCED_PROPERTY_TYPES]);
                emitChange({ advancedPropertyTypes: [...ADVANCED_PROPERTY_TYPES] });
              }}
              className="text-[10px] font-roboto font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer whitespace-nowrap ml-auto"
            >
              Show all
            </button>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {ADVANCED_PROPERTY_TYPES.map((t) => (
              <CheckChip
                key={t}
                label={t}
                checked={advancedPropertyTypes.includes(t)}
                onChange={() => toggleAdvancedType(t)}
              />
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-stone-100 mb-4" />

        {/* ── Include / Exclude / Show only ── */}
        <div className="mb-4">
          <h4 className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Include, exclude &amp; show only
          </h4>
          <div className="flex flex-col gap-3">
            {INCLUDE_EXCLUDE_OPTIONS.map((opt) => (
              <TriStateToggle
                key={opt}
                label={opt}
                value={includeExcludeFilters[opt] || null}
                onChange={(s) => setTriState(opt, s)}
              />
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-stone-100 mb-4" />

        {/* ── Must-haves ── */}
        <div className="mb-4">
          <h4 className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Must-haves
          </h4>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {MUST_HAVES.map((m) => (
              <CheckChip
                key={m}
                label={m}
                checked={mustHaves.includes(m)}
                onChange={() => toggleMustHave(m)}
              />
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-stone-100 mb-4" />

        {/* ── Property type selects (furnishing / availability / added) ── */}
        <div className="flex flex-col gap-3 mb-4">
          <PanelSelect
            label="Furnishing"
            options={FURNISHING_OPTIONS}
            value={furnishing}
            onChange={(v) => {
              setFurnishing(v);
              emitChange({ furnishing: v });
            }}
          />
          <PanelSelect
            label="Availability"
            options={AVAILABILITY_OPTIONS}
            value={availability}
            onChange={(v) => {
              setAvailability(v);
              emitChange({ availability: v });
            }}
          />
          <PanelSelect
            label="Added to site"
            options={ADDED_OPTIONS}
            value={addedToSite}
            onChange={(v) => {
              setAddedToSite(v);
              emitChange({ addedToSite: v });
            }}
          />
        </div>

        <div className="w-full h-px bg-stone-100 mb-4" />

        {/* ── Keywords ── */}
        <div className="mb-4">
          <label className="block text-[10px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none mb-1.5">
            Keywords
          </label>
          <input
            type="text"
            value={advancedKeywords}
            onChange={(e) => {
              setAdvancedKeywords(e.target.value);
              emitChange({ advancedKeywords: e.target.value });
            }}
            placeholder='e.g. conservatory or "double garage"'
            className="w-full h-11 px-4 text-[13px] font-roboto font-medium text-[#374151] placeholder:text-stone-400 bg-white border border-[#d1d5db] rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* ── Show Let Agreed / Sold ── */}
        <div className="mb-5 flex flex-col gap-3">
          {/* Let agreed toggle — show on rent pages and all-properties */}
          {(!targetPath.includes('/buy') && !targetPath.includes('/sale')) || targetPath.includes('/all-properties') || isRentPage ? (
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLetAgreed}
                  onChange={(e) => {
                    setShowLetAgreed(e.target.checked);
                    emitChange({ showLetAgreed: e.target.checked });
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-9 h-5 rounded-full transition-colors ${
                    showLetAgreed ? 'bg-primary' : 'bg-stone-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${
                      showLetAgreed ? 'translate-x-[18px]' : 'translate-x-[2px]'
                    }`}
                  />
                </div>
              </label>
              <span className="text-[13px] font-roboto font-medium text-[#374151]">
                Show let or let agreed
              </span>
            </div>
          ) : null}

          {/* Sold toggle — show on sale pages and all-properties */}
          {(!targetPath.includes('/rent')) || targetPath.includes('/all-properties') || !isRentPage ? (
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSold}
                  onChange={(e) => {
                    setShowSold(e.target.checked);
                    emitChange({ showSold: e.target.checked });
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-9 h-5 rounded-full transition-colors ${
                    showSold ? 'bg-primary' : 'bg-stone-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${
                      showSold ? 'translate-x-[18px]' : 'translate-x-[2px]'
                    }`}
                  />
                </div>
              </label>
              <span className="text-[13px] font-roboto font-medium text-[#374151]">
                Show sold
              </span>
            </div>
          ) : null}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 h-11 px-4 text-base font-roboto font-medium text-[#374151] border border-[#d1d5db] rounded-lg hover:border-[#9ca3af] transition-colors cursor-pointer whitespace-nowrap"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="flex items-center gap-2 h-11 px-6 bg-primary text-white text-base font-roboto font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap ml-auto"
          >
            Apply &amp; Search
          </button>
        </div>
      </div>
    );
  }
  function renderAdvancedFiltersPanel() {
    return (
      <div className="px-4 md:px-6 py-5 max-w-[1400px] mx-auto">
        {/* ── Row 1: Property type checkboxes ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-[12px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Property type
            </h4>
            <button
              type="button"
              onClick={() => {
                setAdvancedPropertyTypes([...ADVANCED_PROPERTY_TYPES]);
                emitChange({ advancedPropertyTypes: [...ADVANCED_PROPERTY_TYPES] });
              }}
              className="text-[12px] font-roboto font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer whitespace-nowrap ml-auto"
            >
              Show all
            </button>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {ADVANCED_PROPERTY_TYPES.map((t) => (
              <CheckChip
                key={t}
                label={t}
                checked={advancedPropertyTypes.includes(t)}
                onChange={() => toggleAdvancedType(t)}
              />
            ))}
          </div>
        </div>


        {/* ── Row 3: Must-haves ── */}
        <div className="mb-5">
          <h4 className="text-[12px] font-roboto font-semibold uppercase tracking-widest text-stone-400 mb-3">
            Must-haves
          </h4>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {MUST_HAVES.map((m) => (
              <CheckChip
                key={m}
                label={m}
                checked={mustHaves.includes(m)}
                onChange={() => toggleMustHave(m)}
              />
            ))}
          </div>
        </div>

        {/* ── Row 4: Property features ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-[12px] font-roboto font-semibold uppercase tracking-widest text-stone-400">
              Property features
            </h4>
            <button
              type="button"
              onClick={() => {
                setPropertyFeatures([...PROPERTY_FEATURES]);
                emitChange({ propertyFeatures: [...PROPERTY_FEATURES] });
              }}
              className="text-[12px] font-roboto font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer whitespace-nowrap ml-auto"
            >
              Show all
            </button>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5">
            {PROPERTY_FEATURES.map((f) => (
              <CheckChip
                key={f}
                label={f}
                checked={propertyFeatures.includes(f)}
                onChange={() => toggleFeature(f)}
              />
            ))}
          </div>
        </div>

        {/* ── Row 5: Furnishing / Availability / Added / Beds ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <PanelSelect
            label="Furnishing"
            options={FURNISHING_OPTIONS}
            value={furnishing}
            onChange={(v) => {
              setFurnishing(v);
              emitChange({ furnishing: v });
            }}
          />
          <PanelSelect
            label="Availability"
            options={AVAILABILITY_OPTIONS}
            value={availability}
            onChange={(v) => {
              setAvailability(v);
              emitChange({ availability: v });
            }}
          />
          <PanelSelect
            label="Added to site"
            options={ADDED_OPTIONS}
            value={addedToSite}
            onChange={(v) => {
              setAddedToSite(v);
              emitChange({ addedToSite: v });
            }}
          />
          <PanelSelect
            label="Beds"
            options={BEDS_OPTIONS}
            value={beds}
            onChange={(v) => {
              setBeds(v);
              emitChange({ beds: v });
            }}
          />
        </div>

        {/* ── Row 6: Keywords ── */}
        <div className="mb-5">
          <label className="block text-[12px] font-roboto font-semibold uppercase tracking-widest text-stone-400 leading-none mb-1.5">
            Keywords
          </label>
          <div className="relative">
            <input
              type="text"
              value={advancedKeywords}
              onChange={(e) => {
                setAdvancedKeywords(e.target.value);
                emitChange({ advancedKeywords: e.target.value });
              }}
              placeholder='e.g. conservatory or "double garage"'
              className="w-full h-11 px-4 text-sm font-roboto font-medium text-[#374151] placeholder:text-stone-400 bg-white border border-[#d1d5db] rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <p className="text-[11px] font-roboto text-stone-400 mt-1 leading-tight">
              Search for phrases by using quotation marks e.g. "double garage", or exclude terms by prefixing them with a minus sign e.g. -studio.
            </p>
          </div>
        </div>

        {/* ── Row 7: Show let / let agreed toggle ── */}
        <div className="mb-5 flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showLetAgreed}
              onChange={(e) => {
                setShowLetAgreed(e.target.checked);
                emitChange({ showLetAgreed: e.target.checked });
              }}
              className="sr-only"
            />
            <div
              className={`w-9 h-5 rounded-full transition-colors ${
                showLetAgreed ? 'bg-primary' : 'bg-stone-200'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${
                  showLetAgreed ? 'translate-x-[18px]' : 'translate-x-[2px]'
                }`}
              />
            </div>
          </label>
          <span className="text-sm font-roboto font-medium text-[#374151]">
            Show let or let agreed
          </span>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 h-11 px-4 text-base font-roboto font-medium text-[#374151] border border-[#d1d5db] rounded-lg hover:border-[#9ca3af] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-close-circle-line text-sm" />
            </span>
            Clear all
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="flex items-center gap-2 h-11 px-6 bg-primary text-white text-base font-roboto font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-sm" />
            </span>
            Apply &amp; Search
          </button>
          <span className="text-xs font-roboto text-stone-400 ml-auto">
            {hasAnyAdvancedFilter ? 'Filters active' : 'No advanced filters applied'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={barRef} className="bg-white border-b border-gray-100">
      {/* ═════════════ DESKTOP (lg+) ═════════════ */}
      <div className="hidden lg:block px-4 md:px-6 lg:px-10 pt-10 pb-5">
        <div className="flex items-stretch gap-2 max-w-[1400px] mx-auto">
          {/* Address input */}
          <div className="relative flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0 flex items-center gap-2.5 px-4 h-11 bg-white border border-[#d1d5db] rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <i className="ri-map-pin-line text-stone-400 text-base" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  emitChange({ query: e.target.value });
                }}
                onKeyDown={handleQueryKeyDown}
                placeholder={isRentPage ? "e.g. 'Kololo', 'Muyenga', or '3 bed apartment'" : "e.g. 'Nakasero', 'Bugolobi', or '4 bed villa'"}
                className="flex-1 min-w-0 text-base font-roboto font-medium text-[#374151] placeholder:text-stone-400 focus:outline-none bg-transparent"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    emitChange({ query: '' });
                  }}
                  className="w-4 h-4 flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <i className="ri-close-circle-line text-stone-400 text-sm" />
                </button>
              )}
            </div>
            {renderSuggestionsDropdown()}
          </div>

          {/* Inline selects */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            <InlineSelect
              id="status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(v) => {
                setStatus(v);
                const newPriceOpts = v === 'For Rent' ? PRICE_OPTIONS_RENT : PRICE_OPTIONS_BUY;
                const currentStillValid = (newPriceOpts as readonly string[]).includes(priceRange);
                if (!currentStillValid) {
                  setPriceRange('Any price');
                  emitChange({ status: v, priceRange: 'Any price' });
                } else {
                  emitChange({ status: v });
                }
              }}
            />
            <InlineSelect
              id="radius"
              options={RADIUS_OPTIONS}
              value={radius}
              onChange={(v) => {
                setRadius(v);
                emitChange({ radius: v });
              }}
            />
            <InlineSelect
              id="price"
              options={priceOptions}
              value={priceRange}
              onChange={(v) => {
                setPriceRange(v);
                emitChange({ priceRange: v, maxPrice: v === 'Any price' ? 'Max. Price' : v });
              }}
            />
            <InlineSelect
              id="type"
              options={TYPE_OPTIONS}
              value={type}
              onChange={(v) => {
                setType(v);
                emitChange({ type: v });
              }}
            />
          </div>

          {/* Filters button */}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={`hidden md:flex items-center gap-2 h-11 px-4 text-base font-roboto font-semibold border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filtersOpen || hasAnyAdvancedFilter
                ? 'text-primary border-primary bg-primary/5'
                : 'text-[#374151] border-[#d1d5db] hover:border-primary hover:text-primary'
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-equalizer-line text-sm" />
            </span>
            Advanced Filters{hasAnyAdvancedFilter ? ` (${Object.values(includeExcludeFilters).filter(Boolean).length + advancedPropertyTypes.length + mustHaves.length + propertyFeatures.length + (furnishing !== 'Any' ? 1 : 0) + (availability !== 'Show all' ? 1 : 0) + (addedToSite !== 'Anytime' ? 1 : 0) + (advancedKeywords.trim() ? 1 : 0) + (showLetAgreed ? 1 : 0) + (showSold ? 1 : 0)})` : ''}
          </button>

          {/* Search button */}
          <button
            type="button"
            onClick={() => handleSearch()}
            className="hidden md:flex items-center gap-2 h-11 px-5 bg-primary text-white text-base font-roboto font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-sm" />
            </span>
            Search
          </button>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSaveSearch}
            className="hidden md:flex items-center gap-2 h-11 px-4 border border-[#d1d5db] text-base font-roboto font-semibold text-[#374151] rounded-lg hover:border-primary hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
            title="Save this search"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-heart-line text-sm" />
            </span>
            Save
          </button>

          {/* Mobile-only filter + search buttons */}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={`md:hidden flex items-center justify-center w-11 h-11 border rounded-lg cursor-pointer transition-colors ${
              filtersOpen || hasAnyAdvancedFilter
                ? 'text-primary border-primary bg-primary/5'
                : 'text-[#374151] border-[#d1d5db] hover:border-primary hover:text-primary'
            }`}
          >
            <i className="ri-equalizer-line text-lg" />
          </button>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="md:hidden flex items-center justify-center w-11 h-11 bg-primary text-white rounded-lg cursor-pointer disabled:opacity-60 hover:bg-primary/90 transition-colors"
          >
            <i className="ri-search-line text-lg" />
          </button>
        </div>

        {/* ═════════════ Filters Panel (desktop) ═════════════ */}
        {filtersOpen && (
          <div ref={filtersPanelRef} className="mt-2 bg-white border border-[#d1d5db] rounded-lg overflow-hidden max-w-[1400px] mx-auto">
            {renderAdvancedFiltersPanel()}
          </div>
        )}
      </div>

      {/* ═════════════ TABLET (md → lg) ═════════════ */}
      <div className="hidden md:block lg:hidden px-4 md:px-6 py-3">
        <div className="flex items-stretch gap-2 max-w-[1400px] mx-auto">
          {/* Address input */}
          <div className="relative flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0 flex items-center gap-2.5 px-4 h-11 bg-white border border-[#d1d5db] rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <i className="ri-map-pin-line text-stone-400 text-base" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  emitChange({ query: e.target.value });
                }}
                onKeyDown={handleQueryKeyDown}
                placeholder="Enter a location"
                className="flex-1 min-w-0 text-base font-roboto font-medium text-[#374151] placeholder:text-stone-400 focus:outline-none bg-transparent"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    emitChange({ query: '' });
                  }}
                  className="w-4 h-4 flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <i className="ri-close-circle-line text-stone-400 text-sm" />
                </button>
              )}
            </div>
            {renderSuggestionsDropdown()}
          </div>

          <InlineSelect
            id="status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(v) => {
              setStatus(v);
              const newPriceOpts = v === 'For Rent' ? PRICE_OPTIONS_RENT : PRICE_OPTIONS_BUY;
              const currentStillValid = (newPriceOpts as readonly string[]).includes(priceRange);
              if (!currentStillValid) {
                setPriceRange('Any price');
                emitChange({ status: v, priceRange: 'Any price' });
              } else {
                emitChange({ status: v });
              }
            }}
          />
          <InlineSelect
            id="price"
            options={priceOptions}
            value={priceRange}
            onChange={(v) => {
              setPriceRange(v);
              emitChange({ priceRange: v, maxPrice: v === 'Any price' ? 'Max. Price' : v });
            }}
          />
          <InlineSelect
            id="type"
            options={TYPE_OPTIONS}
            value={type}
            onChange={(v) => {
              setType(v);
              emitChange({ type: v });
            }}
          />

          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={`flex items-center gap-2 h-11 px-3 text-base font-roboto font-semibold border rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filtersOpen || hasAnyAdvancedFilter
                ? 'text-primary border-primary bg-primary/5'
                : 'text-[#374151] border-[#d1d5db] hover:border-primary hover:text-primary'
            }`}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-equalizer-line text-sm" />
            </span>
            Advanced Filters
          </button>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="flex items-center gap-2 h-11 px-4 bg-primary text-white text-base font-roboto font-semibold rounded-lg hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-sm" />
            </span>
            Search
          </button>
        </div>

        {/* Tablet filters panel */}
        {filtersOpen && (
          <div ref={filtersPanelRef} className="mt-2 bg-white border border-[#d1d5db] rounded-lg overflow-hidden max-w-[1400px] mx-auto">
            {renderAdvancedFiltersPanel()}
          </div>
        )}
      </div>

      {/* ═════════════ MOBILE (<md) ═════════════ */}
      <div className="md:hidden px-4 py-3">
        <div className="flex items-stretch gap-2">
          {/* Search input */}
          <div className="relative flex-1 min-w-0 flex items-center gap-2.5 px-4 h-11 bg-white border border-[#d1d5db] rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              <i className="ri-map-pin-line text-stone-400 text-base" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                emitChange({ query: e.target.value });
              }}
              onKeyDown={handleQueryKeyDown}
              placeholder="Enter a location"
              className="flex-1 min-w-0 text-base font-roboto font-medium text-[#374151] placeholder:text-stone-400 focus:outline-none bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  emitChange({ query: '' });
                }}
                className="w-4 h-4 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <i className="ri-close-circle-line text-stone-400 text-sm" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={`flex items-center justify-center w-11 h-11 border rounded-lg cursor-pointer transition-colors ${
              filtersOpen || hasAnyAdvancedFilter
                ? 'text-primary border-primary bg-primary/5'
                : 'text-[#374151] border-[#d1d5db] hover:border-primary hover:text-primary'
            }`}
          >
            <i className="ri-equalizer-line text-lg" />
          </button>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="flex items-center justify-center w-11 h-11 bg-primary text-white rounded-lg cursor-pointer disabled:opacity-60 hover:bg-primary/90 transition-colors"
          >
            <i className="ri-search-line text-lg" />
          </button>
        </div>

        {renderSuggestionsDropdown()}

        {/* Mobile filters panel */}
        {filtersOpen && (
          <div ref={filtersPanelRef} className="mt-2 bg-white border border-[#d1d5db] rounded-lg overflow-hidden max-h-[70vh] overflow-y-auto">
            {renderMobileAdvancedFiltersPanel()}
          </div>
        )}
      </div>

      {/* ── Save Search Modal ── */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40" onClick={() => !saveLoading && setSaveModalOpen(false)}>
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {saveSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <i className="ri-check-line text-2xl text-emerald-500" />
                </div>
                <h3 className="text-sm font-roboto font-bold text-[#374151] mb-1">Search saved!</h3>
                <p className="text-xs font-roboto text-stone-400">You can find it in your saved searches.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-roboto font-bold text-[#374151]">Save this search</h3>
                  <button
                    type="button"
                    onClick={() => setSaveModalOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 cursor-pointer transition-colors"
                  >
                    <i className="ri-close-line text-stone-400" />
                  </button>
                </div>

                <label className="block text-[11px] font-roboto font-semibold uppercase tracking-widest text-stone-400 mb-1.5">
                  Search name
                </label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveConfirm(); }}
                  placeholder="e.g. 3-bed rentals in Kololo"
                  autoFocus
                  className="w-full h-11 px-4 text-sm font-roboto font-medium text-[#374151] placeholder:text-stone-400 bg-white border border-[#d1d5db] rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all mb-4"
                />

                {saveError && (
                  <p className="text-xs font-roboto text-red-500 mb-3 flex items-center gap-1">
                    <i className="ri-error-warning-line text-sm" />
                    {saveError}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSaveModalOpen(false)}
                    className="flex-1 py-2.5 border border-[#d1d5db] text-[#374151] text-sm font-roboto font-semibold rounded-lg hover:bg-stone-50 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveConfirm}
                    disabled={saveLoading || !saveName.trim()}
                    className="flex-1 py-2.5 bg-primary text-white text-sm font-roboto font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    {saveLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}