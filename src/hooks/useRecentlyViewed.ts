import { useState, useCallback, useEffect } from 'react';

export interface RecentlyViewedItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  image: string;
  property_type: string;
  beds: number | null;
  baths: number | null;
  viewedAt: number;
}

const STORAGE_KEY = 'pk_recently_viewed';
const MAX_ITEMS = 5;

function readStorage(): RecentlyViewedItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeStorage(items: RecentlyViewedItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function recordView(item: Omit<RecentlyViewedItem, 'viewedAt'>): void {
  const existing = readStorage();
  const filtered = existing.filter((i) => i.id !== item.id);
  const updated = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
  writeStorage(updated);
  window.dispatchEvent(new Event('pk_recently_viewed_updated'));
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>(readStorage);

  const refresh = useCallback(() => setItems(readStorage()), []);

  useEffect(() => {
    window.addEventListener('pk_recently_viewed_updated', refresh);
    return () => window.removeEventListener('pk_recently_viewed_updated', refresh);
  }, [refresh]);

  const clearAll = useCallback(() => {
    writeStorage([]);
    setItems([]);
  }, []);

  return { items, clearAll };
}
