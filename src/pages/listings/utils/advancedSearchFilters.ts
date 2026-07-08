import type { Property } from '@/types/property';
import type { SearchBarValue } from '@/components/feature/OceansPropertySearchBar';

const ADDED_TO_SITE_DAYS: Record<string, number> = {
  'Last 24 hours': 1,
  'Last 3 days': 3,
  'Last 7 days': 7,
  'Last 14 days': 14,
  'Last 30 days': 30,
};

export function parseMoneyToken(token: string): number | null {
  const cleaned = token.replace(/,/g, '').match(/[\d.]+[KM]?/i)?.[0];
  if (!cleaned) return null;
  const mult = /M$/i.test(cleaned) ? 1_000_000 : /K$/i.test(cleaned) ? 1_000 : 1;
  const num = parseFloat(cleaned.replace(/[KM]/gi, ''));
  return isNaN(num) ? null : num * mult;
}

/**
 * Parses free-form price-bracket labels like "Under $50K", "$500K – $750K",
 * "Over $10M", "$5,000+/mo" into a {min, max} range. Used because the search
 * bar's own price-range labels don't always match a page's local bracket list.
 */
export function parsePriceRangeLabel(label: string): { min: number | null; max: number | null } {
  if (!label || /any/i.test(label)) return { min: null, max: null };
  const nums = (label.match(/[\d,.]+[KM]?/gi) || [])
    .map(parseMoneyToken)
    .filter((n): n is number => n !== null);
  if (nums.length === 0) return { min: null, max: null };
  if (/under/i.test(label)) return { min: null, max: nums[0] };
  if (/over/i.test(label) || label.includes('+')) return { min: nums[0], max: null };
  if (nums.length >= 2) return { min: nums[0], max: nums[1] };
  return { min: nums[0], max: null };
}

function parseIntToken(token: string): number | null {
  const n = parseInt(token, 10);
  return isNaN(n) ? null : n;
}

/** Supports quoted "phrases" (required) and -excluded tokens, ANDed together. */
function matchesKeywords(haystack: string, keywords: string): boolean {
  const trimmed = keywords.trim();
  if (!trimmed) return true;
  const tokens = trimmed.match(/-?"[^"]+"|-?\S+/g) || [];
  const lower = haystack.toLowerCase();
  for (const raw of tokens) {
    const exclude = raw.startsWith('-');
    const word = (exclude ? raw.slice(1) : raw).replace(/"/g, '').trim().toLowerCase();
    if (!word) continue;
    const found = lower.includes(word);
    if (exclude && found) return false;
    if (!exclude && !found) return false;
  }
  return true;
}

/** Whether any advanced (non-default) filter is currently set. */
export function hasActiveAdvancedFilters(v: SearchBarValue): boolean {
  return Boolean(
    (v.advancedPropertyTypes && v.advancedPropertyTypes.length > 0) ||
    (v.includeExcludeFilters && Object.keys(v.includeExcludeFilters).length > 0) ||
    (v.mustHaves && v.mustHaves.length > 0) ||
    (v.propertyFeatures && v.propertyFeatures.length > 0) ||
    (v.furnishing && v.furnishing !== 'Any') ||
    (v.availability && v.availability !== 'Show all') ||
    (v.addedToSite && v.addedToSite !== 'Anytime') ||
    (v.advancedKeywords && v.advancedKeywords.trim().length > 0) ||
    (v.bedsMin && v.bedsMin !== 'No min') ||
    (v.bedsMax && v.bedsMax !== 'No max') ||
    (v.bathsMin && v.bathsMin !== 'No min') ||
    (v.bathsMax && v.bathsMax !== 'No max') ||
    (v.priceMin && v.priceMin !== 'No min') ||
    (v.priceMax && v.priceMax !== 'No max')
  );
}

/**
 * Applies every field captured by the search bar's Advanced Filters panel
 * against a single property. Returns false as soon as one active filter
 * excludes the property.
 */
export function matchesAdvancedFilters(p: Property, v: SearchBarValue): boolean {
  if (v.advancedPropertyTypes && v.advancedPropertyTypes.length > 0) {
    const typeLower = (p.type || '').toLowerCase();
    if (!v.advancedPropertyTypes.some((t) => typeLower.includes(t.toLowerCase()))) return false;
  }

  const amenitiesLower = (p.amenities || []).map((a) => a.toLowerCase());
  const hasAmenity = (label: string) => {
    const l = label.toLowerCase();
    return amenitiesLower.some((a) => a.includes(l) || l.includes(a));
  };

  if (v.mustHaves && v.mustHaves.length > 0) {
    if (!v.mustHaves.every(hasAmenity)) return false;
  }

  if (v.propertyFeatures && v.propertyFeatures.length > 0) {
    if (!v.propertyFeatures.every(hasAmenity)) return false;
  }

  if (v.includeExcludeFilters) {
    for (const [key, state] of Object.entries(v.includeExcludeFilters)) {
      if (!state) continue;
      const present = hasAmenity(key);
      if ((state === 'include' || state === 'show_only') && !present) return false;
      if (state === 'exclude' && present) return false;
    }
  }

  if (v.furnishing && v.furnishing !== 'Any') {
    if (v.furnishing === 'Furnished' && p.furnished !== true) return false;
    if (v.furnishing === 'Unfurnished' && p.furnished !== false) return false;
    // 'Part-furnished' has no backing data on the listing — treat as unfiltered
  }

  const bedsMin = v.bedsMin && v.bedsMin !== 'No min' ? parseIntToken(v.bedsMin) : null;
  if (bedsMin !== null && p.beds < bedsMin) return false;
  const bedsMax = v.bedsMax && v.bedsMax !== 'No max' ? parseIntToken(v.bedsMax) : null;
  if (bedsMax !== null && p.beds > bedsMax) return false;

  const bathsMin = v.bathsMin && v.bathsMin !== 'No min' ? parseIntToken(v.bathsMin) : null;
  if (bathsMin !== null && p.baths < bathsMin) return false;
  const bathsMax = v.bathsMax && v.bathsMax !== 'No max' ? parseIntToken(v.bathsMax) : null;
  if (bathsMax !== null && p.baths > bathsMax) return false;

  const priceMin = v.priceMin && v.priceMin !== 'No min' ? parseMoneyToken(v.priceMin) : null;
  if (priceMin !== null && (p.priceUsd ?? 0) < priceMin) return false;
  const priceMax = v.priceMax && v.priceMax !== 'No max' ? parseMoneyToken(v.priceMax) : null;
  if (priceMax !== null && p.priceUsd != null && p.priceUsd > priceMax) return false;

  if (v.advancedKeywords && v.advancedKeywords.trim()) {
    const haystack = `${p.title} ${p.location} ${p.type} ${p.description || ''}`;
    if (!matchesKeywords(haystack, v.advancedKeywords)) return false;
  }

  if (v.addedToSite && v.addedToSite !== 'Anytime' && p.listingDate) {
    const days = ADDED_TO_SITE_DAYS[v.addedToSite];
    if (days) {
      const listed = new Date(p.listingDate).getTime();
      const cutoff = Date.now() - days * 86_400_000;
      if (isNaN(listed) || listed < cutoff) return false;
    }
  }

  return true;
}
