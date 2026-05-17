export interface FaqItem {
  question: string;
  answer: string;
}

export interface PracticalItem {
  name: string;
  note?: string;
}

export interface SectionVisibility {
  why_live_here?: boolean;
  expat_appeal?: boolean;
  lifestyle?: boolean;
  practical?: boolean;
  gallery?: boolean;
  faqs?: boolean;
  map?: boolean;
}

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  hero_image: string | null;
  short_intro: string | null;
  long_description: string | null;
  why_live_here: string | null;
  expat_appeal: string | null;
  lifestyle_desc: string | null;
  safety_notes: string | null;
  cost_of_living: string | null;
  rental_range_ugx: string | null;
  rental_range_usd: string | null;
  avg_sale_price: string | null;
  target_market: string | null;
  vibe: string | null;
  map_embed: string | null;
  image_gallery: string[];
  practical_schools: PracticalItem[];
  practical_hospitals: PracticalItem[];
  practical_embassies: PracticalItem[];
  practical_restaurants: PracticalItem[];
  commute_notes: string | null;
  faqs: FaqItem[];
  highlights: string[];
  lifestyle_tags: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  meta_keywords: string | null;
  section_visibility: SectionVisibility;
  created_at: string;
}

export type NeighborhoodDraft = Omit<Neighborhood, 'id' | 'created_at'>;

export const EMPTY_NEIGHBORHOOD: NeighborhoodDraft = {
  name: '',
  slug: '',
  city: 'Kampala',
  country: 'Uganda',
  hero_image: null,
  short_intro: null,
  long_description: null,
  why_live_here: null,
  expat_appeal: null,
  lifestyle_desc: null,
  safety_notes: null,
  cost_of_living: null,
  rental_range_ugx: null,
  rental_range_usd: null,
  avg_sale_price: null,
  target_market: null,
  vibe: null,
  map_embed: null,
  image_gallery: [],
  practical_schools: [],
  practical_hospitals: [],
  practical_embassies: [],
  practical_restaurants: [],
  commute_notes: null,
  faqs: [],
  highlights: [],
  lifestyle_tags: [],
  featured: false,
  published: true,
  sort_order: 0,
  seo_title: null,
  seo_description: null,
  meta_keywords: null,
  section_visibility: {
    why_live_here: true,
    expat_appeal: true,
    lifestyle: true,
    practical: true,
    gallery: true,
    faqs: true,
    map: true,
  },
};
