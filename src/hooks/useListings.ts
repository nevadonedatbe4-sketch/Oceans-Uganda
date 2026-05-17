import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SupabaseListing {
  id: string;
  title: string;
  slug: string;
  property_type: string | null;
  purpose: string;
  price: number | null;
  currency: string;
  price_note: string | null;
  location: string | null;
  neighborhood_id: string | null;
  neighborhood_name: string | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size_sqm: number | null;
  cover_image: string | null;
  listing_date: string | null;
  status: string;
  featured: boolean;
  gallery_images?: string[];
}

export interface NeighborhoodOption {
  id: string;
  name: string;
  slug: string;
}

export function useListings(purpose?: string) {
  const [listings, setListings] = useState<SupabaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Build purpose filter: 'sale' includes both 'sale' and 'new_dev'
      let purposeQuery = supabase
        .from('listings')
        .select('*, neighborhoods(name)');

      const p = purpose || 'sale';
      if (p === 'sale') {
        purposeQuery = purposeQuery.in('purpose', ['sale', 'new_dev']);
      } else {
        purposeQuery = purposeQuery.eq('purpose', p);
      }

      purposeQuery = purposeQuery
        .order('featured', { ascending: false })
        .order('listing_date', { ascending: false });

      const [listingsRes, imagesRes] = await Promise.all([
        purposeQuery,
        supabase
          .from('listing_images')
          .select('listing_id, url, sort_order')
          .order('sort_order', { ascending: true }),
      ]);

      if (cancelled) return;

      if (listingsRes.error) {
        // eslint-disable-next-line no-console
        console.error('useListings fetch error:', listingsRes.error);
        setError(listingsRes.error.message);
        setListings([]);
      } else {
        // Build a map of listing_id → sorted image URLs
        const imageMap: Record<string, string[]> = {};
        (imagesRes.data || []).forEach((img: { listing_id: string; url: string }) => {
          if (!imageMap[img.listing_id]) imageMap[img.listing_id] = [];
          if (img.url) imageMap[img.listing_id].push(img.url);
        });

        const mapped = (listingsRes.data || []).map((item: Record<string, unknown>) => {
          const id = item.id as string;
          const coverImage = item.cover_image as string | null;
          const galleryImages = imageMap[id] || [];
          // Merge: cover first (if not already in gallery), then rest
          const allImages = coverImage
            ? [coverImage, ...galleryImages.filter((u) => u !== coverImage)]
            : galleryImages;

          return {
            id,
            title: item.title as string,
            slug: item.slug as string,
            property_type: item.property_type as string | null,
            purpose: item.purpose as string,
            price: item.price as number | null,
            currency: item.currency as string,
            price_note: item.price_note as string | null,
            location: item.location as string | null,
            neighborhood_id: item.neighborhood_id as string | null,
            neighborhood_name: (item.neighborhoods as { name: string } | null)?.name ?? null,
            bedrooms: item.bedrooms as number,
            bathrooms: item.bathrooms as number,
            parking: item.parking as number,
            size_sqm: item.size_sqm as number | null,
            cover_image: coverImage,
            listing_date: item.listing_date as string | null,
            status: item.status as string,
            featured: item.featured as boolean,
            gallery_images: allImages,
          };
        });
        setListings(mapped);
      }
      setLoading(false);
    };

    fetchData();
    return () => { cancelled = true; };
  }, [purpose]);

  return { listings, loading, error };
}

export function useAllListings() {
  const [listings, setListings] = useState<SupabaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const [listingsRes, imagesRes] = await Promise.all([
        supabase
          .from('listings')
          .select('*, neighborhoods(name)')
          .order('featured', { ascending: false })
          .order('listing_date', { ascending: false }),
        supabase
          .from('listing_images')
          .select('listing_id, url, sort_order')
          .order('sort_order', { ascending: true }),
      ]);

      if (cancelled) return;

      if (listingsRes.error) {
        // eslint-disable-next-line no-console
        console.error('useAllListings fetch error:', listingsRes.error);
        setError(listingsRes.error.message);
        setListings([]);
      } else {
        const imageMap: Record<string, string[]> = {};
        (imagesRes.data || []).forEach((img: { listing_id: string; url: string }) => {
          if (!imageMap[img.listing_id]) imageMap[img.listing_id] = [];
          if (img.url) imageMap[img.listing_id].push(img.url);
        });

        const mapped = (listingsRes.data || []).map((item: Record<string, unknown>) => {
          const id = item.id as string;
          const coverImage = item.cover_image as string | null;
          const galleryImages = imageMap[id] || [];
          const allImages = coverImage
            ? [coverImage, ...galleryImages.filter((u) => u !== coverImage)]
            : galleryImages;

          return {
            id,
            title: item.title as string,
            slug: item.slug as string,
            property_type: item.property_type as string | null,
            purpose: item.purpose as string,
            price: item.price as number | null,
            currency: item.currency as string,
            price_note: item.price_note as string | null,
            location: item.location as string | null,
            neighborhood_id: item.neighborhood_id as string | null,
            neighborhood_name: (item.neighborhoods as { name: string } | null)?.name ?? null,
            bedrooms: item.bedrooms as number,
            bathrooms: item.bathrooms as number,
            parking: item.parking as number,
            size_sqm: item.size_sqm as number | null,
            cover_image: coverImage,
            listing_date: item.listing_date as string | null,
            status: item.status as string,
            featured: item.featured as boolean,
            gallery_images: allImages,
          };
        });
        setListings(mapped);
      }
      setLoading(false);
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { listings, loading, error };
}

export function useNeighborhoods() {
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);

  useEffect(() => {
    supabase
      .from('neighborhoods')
      .select('id, name, slug')
      .order('name')
      .then(({ data }) => {
        if (data) setNeighborhoods(data as NeighborhoodOption[]);
      });
  }, []);

  return { neighborhoods };
}

export function formatPrice(price: number | null, currency: string, purpose: string): string {
  if (!price) return 'Price on request';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'UGX' ? 'UGX' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const formatted = formatter.format(price);
  return purpose === 'rent' ? `${formatted} pcm` : formatted;
}