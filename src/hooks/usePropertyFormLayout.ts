import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface FormModule {
  id: string;
  module_key: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
  sort_order: number;
}

const DEFAULT_MODULES: FormModule[] = [
  { id: '1', module_key: 'description_price', label: 'Description & Price', description: 'Property title, type, purpose, listing status, price, currency and frequency', icon: 'ri-file-info-line', enabled: true, sort_order: 1 },
  { id: '2', module_key: 'property_details', label: 'Property Details', description: 'Bedrooms, bathrooms, parking, sizes, property ID, featured toggle and labels', icon: 'ri-home-4-line', enabled: true, sort_order: 2 },
  { id: '3', module_key: 'features', label: 'Features & Amenities', description: 'Amenities, indoor/outdoor features, full description and custom features', icon: 'ri-list-check', enabled: true, sort_order: 3 },
  { id: '4', module_key: 'media', label: 'Media & Photos', description: 'Cover image, photo gallery, floor plans and virtual tour', icon: 'ri-image-2-line', enabled: true, sort_order: 4 },
  { id: '5', module_key: 'location', label: 'Location', description: 'Country, city, area, neighborhood, address, coordinates and map', icon: 'ri-map-pin-2-line', enabled: true, sort_order: 5 },
  { id: '6', module_key: 'agent_publish', label: 'Agent & Publish', description: 'Agent assignment, listing status, SEO settings and publish actions', icon: 'ri-check-double-line', enabled: true, sort_order: 6 },
];

export function usePropertyFormLayout() {
  const [modules, setModules] = useState<FormModule[]>(DEFAULT_MODULES);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('property_form_layout')
      .select('*')
      .order('sort_order');

    if (!error && data && data.length > 0) {
      setModules(data as FormModule[]);
    } else {
      setModules(DEFAULT_MODULES);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const enabledModules = modules
    .filter((m) => m.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  return { modules, enabledModules, loading, reload: load };
}
