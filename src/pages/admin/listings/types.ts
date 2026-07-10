export interface Listing {
  id: string;
  title: string;
  slug: string;
  property_type: string | null;
  purpose: string;
  price: number | null;
  currency: string;
  price_note: string | null;
  price_frequency: string | null;
  secondary_price: number | null;
  secondary_price_label: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  neighborhood_id: string | null;
  address: string | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size_sqm: number | null;
  land_area: number | null;
  land_area_postfix: string | null;
  furnished: boolean;
  featured: boolean;
  listing_status: string[];
  status: string;
  published: boolean;
  display_order: number | null;
  short_description: string | null;
  full_description: string | null;
  cover_image: string | null;
  gallery: string[];
  agent_id: string | null;
  listing_date: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tenure: string | null;
  jv_structure: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AgentOption {
  id: string;
  full_name: string;
}

export interface NeighborhoodOption {
  id: string;
  name: string;
}

export interface ListingImage {
  id?: string;
  url: string;
  sort_order: number;
  is_cover?: boolean;
}

export interface CardDisplaySettings {
  show_price: boolean;
  show_property_type: boolean;
  show_badges: boolean;
  show_location: boolean;
  show_meta: boolean;
  show_listing_date: boolean;
  show_contact_agent: boolean;
  show_save_button: boolean;
}

export const DEFAULT_CARD_DISPLAY: CardDisplaySettings = {
  show_price: true,
  show_property_type: true,
  show_badges: true,
  show_location: true,
  show_meta: true,
  show_listing_date: true,
  show_contact_agent: true,
  show_save_button: false,
};

export interface ListingFormData {
  title: string;
  slug: string;
  property_type: string;
  purpose: string;
  price: string;
  currency: string;
  price_note: string;
  price_frequency: string;
  price_on_request: boolean;
  secondary_price: string;
  secondary_price_label: string;
  price_negotiable: boolean;
  location: string;
  city: string;
  country: string;
  neighborhood_id: string;
  address: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  size_sqm: string;
  property_size_postfix: string;
  land_area: string;
  land_area_postfix: string;
  year_built: string;
  furnished: boolean;
  featured: boolean;
  listing_status: string[];
  status: string;
  published: boolean;
  display_order: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  gallery: string[];
  agent_id: string;
  listing_date: string;
  seo_title: string;
  seo_description: string;
  images: ListingImage[];
  amenities: string[];
  card_display: CardDisplaySettings;
  video_url: string;
  floor_plan_url: string;
  price_negotiable: boolean;
  has_backup_power: boolean;
  backup_power: string;
  gated_community: boolean;
  staff_quarters_count: string;
  swimming_pool: boolean;
  gym: boolean;
  proximity_to_amenities: string;
  unique_features: string;
  tenure: string;
  jv_structure: string;
}

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Office', 'Studio', 'Land', 'Commercial', 'Semi-Detached', 'Single Family Home'];
export const PURPOSES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'short_stay', label: 'Short Stay' },
  { value: 'new_dev', label: 'New Development' },
  { value: 'joint_venture', label: 'Joint Venture' },
];
export const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Under Review' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'archived', label: 'Archived' },
  { value: 'on_hold', label: 'On Hold' },
];

/** CRM flow statuses — what the public site queries */
export const LIVE_STATUSES = ['published'];
/** Statuses that an admin/authorized user can set directly */
export const ADMIN_CONTROL_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'archived', label: 'Archived' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'rejected', label: 'Rejected' },
];
export const CURRENCIES = ['USD', 'UGX', 'KES', 'GBP', 'EUR'];
export const PRICE_FREQUENCIES = [
  { value: '', label: 'Once Off (no suffix)' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'yearly', label: 'Yearly' },
];
export const LISTING_STATUS_OPTIONS = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'for_rent', label: 'For Rent' },
];
export const TENURE_OPTIONS = ['Freehold', 'Mailo', 'Customary', 'Leasehold'];

export const INIT_FORM: ListingFormData = {
  title: '', slug: '', property_type: 'Apartment', purpose: 'sale',
  price: '', currency: 'USD', price_note: '', price_frequency: '',
  secondary_price: '', secondary_price_label: '',
  location: '', city: 'Kampala', country: 'Uganda', neighborhood_id: '',
  address: '', bedrooms: '1', bathrooms: '1', parking: '0', size_sqm: '',
  property_size_postfix: 'sqm',
  land_area: '',
  land_area_postfix: 'sqm',
  year_built: '',
  furnished: false, featured: false, listing_status: ['for_sale'], price_negotiable: true, price_on_request: false,
  status: 'draft', published: true, display_order: '',
  short_description: '', full_description: '', cover_image: '', gallery: [], agent_id: '',
  listing_date: new Date().toISOString().split('T')[0],
  seo_title: '', seo_description: '', images: [], amenities: [],
  card_display: { show_price: true, show_property_type: true, show_badges: true, show_location: true, show_meta: true, show_listing_date: true, show_contact_agent: true, show_save_button: false },
  video_url: '',
  floor_plan_url: '',
  has_backup_power: false,
  backup_power: '',
  gated_community: false,
  staff_quarters_count: '0',
  swimming_pool: false,
  gym: false,
  proximity_to_amenities: '',
  unique_features: '',
  tenure: '',
  jv_structure: '',
};

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export function statusColor(status: string): string {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-500';
    case 'pending_review': return 'bg-blue-50 text-blue-700';
    case 'published': return 'bg-emerald-50 text-emerald-700';
    case 'rejected': return 'bg-red-50 text-red-600';
    case 'sold': return 'bg-gray-100 text-gray-600';
    case 'rented': return 'bg-amber-50 text-amber-700';
    case 'archived': return 'bg-slate-100 text-slate-500';
    case 'on_hold': return 'bg-orange-50 text-orange-600';
    case 'expired': return 'bg-orange-100 text-orange-700';
    case 'disapproved': return 'bg-red-100 text-red-700';
    case 'pinned': return 'bg-[#D5A91C]/10 text-[#D5A91C]';
    default: return 'bg-gray-100 text-gray-500';
  }
}

export function purposeColor(purpose: string): string {
  switch (purpose) {
    case 'sale': return 'bg-[#D5A91C]/10 text-[#D5A91C]';
    case 'rent': return 'bg-teal-50 text-teal-700';
    case 'short_stay': return 'bg-orange-50 text-orange-700';
    case 'new_dev': return 'bg-violet-50 text-violet-700';
    case 'joint_venture': return 'bg-amber-50 text-amber-700';
    default: return 'bg-gray-100 text-gray-500';
  }
}
