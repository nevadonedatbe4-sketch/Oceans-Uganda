export interface Property {
  id: number | string;
  title: string;
  type: string;
  category: 'sale' | 'rent';
  badge: string;
  price: string;
  priceUsd?: number | null;
  currency?: string;
  priceNote?: string;
  description?: string;
  location: string;
  beds: number;
  baths: number;
  parking: number;
  sqft?: number;
  image: string;
  images?: string[];
  featured?: boolean;
  listingDate: string;
  slug?: string;
}
