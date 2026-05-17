import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface LayoutSection {
  id: string;
  label: string;
  icon: string;
  order: number;
}

export interface OverviewField {
  id: string;
  label: string;
  icon: string;
  order: number;
}

export interface MediaTab {
  id: string;
  label: string;
  icon: string;
  order: number;
}

export interface GallerySettings {
  visible_images: number;
  images_per_row: number;
}

export interface OverviewSettings {
  show_property_id: boolean;
  columns: number;
  v2_height: number;
  enabled_fields: OverviewField[];
  disabled_fields: OverviewField[];
}

export interface BannerSettings {
  banner_version: string;
  content_layout: string;
  active_tab: string;
  full_width: boolean;
}

export interface MediaTabsSettings {
  enabled: MediaTab[];
  disabled: MediaTab[];
}

export interface ColumnSettings {
  details: number;
  address: number;
  features: number;
}

export interface MobileSettings {
  tools_position: string;
}

export interface NavigationSettings {
  sticky_nav: boolean;
  enable_map_in_address: boolean;
}

export interface AgentMessageSettings {
  receive_copy: boolean;
}

export interface PropertyLayoutSettings {
  enabled_sections: LayoutSection[];
  disabled_sections: LayoutSection[];
  gallery_settings: GallerySettings;
  overview_settings: OverviewSettings;
  banner_settings: BannerSettings;
  media_tabs: MediaTabsSettings;
  column_settings: ColumnSettings;
  mobile_settings: MobileSettings;
  navigation_settings: NavigationSettings;
  agent_message_settings: AgentMessageSettings;
}

const DEFAULTS: PropertyLayoutSettings = {
  enabled_sections: [
    { id: 'overview', label: 'Overview', icon: 'ri-grid-line', order: 0 },
    { id: 'description', label: 'Description', icon: 'ri-file-text-line', order: 1 },
    { id: 'address', label: 'Address', icon: 'ri-map-pin-2-line', order: 2 },
    { id: 'details', label: 'Details', icon: 'ri-list-check-2', order: 3 },
    { id: 'features', label: 'Features', icon: 'ri-checkbox-multiple-line', order: 4 },
  ],
  disabled_sections: [
    { id: 'floor_plans', label: 'Floor Plans', icon: 'ri-layout-2-line', order: 0 },
    { id: 'video', label: 'Video', icon: 'ri-video-line', order: 1 },
    { id: 'similar_listings', label: 'Similar Listings', icon: 'ri-building-4-line', order: 2 },
  ],
  gallery_settings: { visible_images: 9, images_per_row: 3 },
  overview_settings: {
    show_property_id: true,
    columns: 5,
    v2_height: 180,
    enabled_fields: [
      { id: 'property_type', label: 'Property Type', icon: 'ri-home-4-line', order: 0 },
      { id: 'bedrooms', label: 'Bedrooms', icon: 'ri-hotel-bed-line', order: 1 },
      { id: 'bathrooms', label: 'Bathrooms', icon: 'ri-showers-line', order: 2 },
      { id: 'garage', label: 'Garage', icon: 'ri-car-line', order: 3 },
      { id: 'property_id', label: 'Property ID', icon: 'ri-fingerprint-line', order: 4 },
    ],
    disabled_fields: [
      { id: 'rooms', label: 'Rooms', icon: 'ri-door-open-line', order: 0 },
      { id: 'land_area', label: 'Land Area', icon: 'ri-landscape-line', order: 1 },
      { id: 'year_built', label: 'Year Built', icon: 'ri-building-line', order: 2 },
      { id: 'area_size', label: 'Area Size', icon: 'ri-fullscreen-line', order: 3 },
    ],
  },
  banner_settings: { banner_version: 'version1', content_layout: 'boxed', active_tab: 'gallery', full_width: false },
  media_tabs: {
    enabled: [{ id: 'gallery', label: 'Image/Gallery', icon: 'ri-image-2-line', order: 0 }],
    disabled: [
      { id: 'virtual_tour', label: '360° Virtual Tour', icon: 'ri-vidicon-line', order: 0 },
      { id: 'street_view', label: 'Street View', icon: 'ri-road-map-line', order: 1 },
      { id: 'map_view', label: 'Map View', icon: 'ri-map-2-line', order: 2 },
      { id: 'video', label: 'Video', icon: 'ri-video-line', order: 3 },
    ],
  },
  column_settings: { details: 3, address: 1, features: 3 },
  mobile_settings: { tools_position: 'under_banner' },
  navigation_settings: { sticky_nav: false, enable_map_in_address: true },
  agent_message_settings: { receive_copy: false },
};

export function usePropertyLayout() {
  const [settings, setSettings] = useState<PropertyLayoutSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('property_layout_settings')
      .select('*')
      .eq('layout_type', 'default')
      .maybeSingle();
    if (data) {
      setSettings({
        enabled_sections: (data.enabled_sections as LayoutSection[]) || DEFAULTS.enabled_sections,
        disabled_sections: (data.disabled_sections as LayoutSection[]) || DEFAULTS.disabled_sections,
        gallery_settings: (data.gallery_settings as GallerySettings) || DEFAULTS.gallery_settings,
        overview_settings: (data.overview_settings as OverviewSettings) || DEFAULTS.overview_settings,
        banner_settings: (data.banner_settings as BannerSettings) || DEFAULTS.banner_settings,
        media_tabs: (data.media_tabs as MediaTabsSettings) || DEFAULTS.media_tabs,
        column_settings: (data.column_settings as ColumnSettings) || DEFAULTS.column_settings,
        mobile_settings: (data.mobile_settings as MobileSettings) || DEFAULTS.mobile_settings,
        navigation_settings: (data.navigation_settings as NavigationSettings) || DEFAULTS.navigation_settings,
        agent_message_settings: (data.agent_message_settings as AgentMessageSettings) || DEFAULTS.agent_message_settings,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = useCallback((patch: Partial<PropertyLayoutSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    setDirty(true);
  }, []);

  const save = useCallback(async (current: PropertyLayoutSettings) => {
    setSaving(true);
    const { error } = await supabase
      .from('property_layout_settings')
      .upsert({
        layout_type: 'default',
        enabled_sections: current.enabled_sections,
        disabled_sections: current.disabled_sections,
        gallery_settings: current.gallery_settings,
        overview_settings: current.overview_settings,
        banner_settings: current.banner_settings,
        media_tabs: current.media_tabs,
        column_settings: current.column_settings,
        mobile_settings: current.mobile_settings,
        navigation_settings: current.navigation_settings,
        agent_message_settings: current.agent_message_settings,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'layout_type' });
    setSaving(false);
    setSaveStatus(error ? 'error' : 'success');
    if (!error) setDirty(false);
    setTimeout(() => setSaveStatus('idle'), 3000);
  }, []);

  const reset = useCallback(() => { load(); setDirty(false); }, [load]);

  return { settings, setSettings, loading, saving, saveStatus, dirty, setDirty, save, reset, load };
}
