import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SiteSettings {
  // system color palette (editable in branding page)
  color_primary: string;
  color_secondary: string;
  color_text: string;
  color_accent: string;
  color_golden: string;
  color_topbar: string;
  color_white: string;
  color_off_white: string;
  // custom colors (stored as JSON string of {id, label, value}[])
  custom_colors: string;
  // legacy branding (kept for backwards compat)
  brand_primary_color: string;
  brand_accent_color: string;
  logo_main: string;
  logo_dashboard: string;
  logo_transparent: string;
  favicon_url: string;
  logo_height_standard: string;
  logo_width_standard: string;
  // contact
  company_name: string;
  phone: string;
  phone_secondary: string;
  email: string;
  sales_email: string;
  whatsapp: string;
  office_address: string;
  footer_address: string;
  working_hours_weekday: string;
  working_hours_saturday: string;
  working_hours_sunday: string;
  google_maps_embed: string;
  google_maps_link: string;
  // social
  instagram_url: string;
  facebook_url: string;
  linkedin_url: string;
  twitter_url: string;
  youtube_url: string;
  tiktok_url: string;
  whatsapp_direct_url: string;
  social_show_footer: string;
  social_show_header: string;
  social_show_contact_page: string;
  // general
  site_name: string;
  tagline: string;
  footer_text: string;
  // general_mgmt
  mgmt_site_name: string;
  mgmt_site_tagline: string;
  mgmt_listings_per_page: string;
  mgmt_featured_count: string;
  mgmt_show_price_on_listing: string;
  mgmt_show_agent_on_listing: string;
  mgmt_allow_inquiries: string;
  mgmt_maintenance_mode: string;
  // dashboard_menu
  dash_menu_bg: string;
  dash_logo_bg: string;
  dash_active_border_color: string;
  dash_menu_text_color: string;
  dash_menu_hover_color: string;
  // currency
  currency_primary: string;
  currency_secondary: string;
  currency_dual_enabled: string;
  currency_manual_rate: string;
  // watermarking
  watermark_text: string;
  watermark_enabled: string;
  watermark_position: string;
  // [key: string] for any extra keys
  [key: string]: string;
}

const DEFAULTS: SiteSettings = {
  // system palette
  color_primary:   '#001731',
  color_secondary: '#002349',
  color_text:      '#7A7A7A',
  color_accent:    '#0D5959',
  color_golden:    '#D4A614',
  color_topbar:    '#020101',
  color_white:     '#FFFFFF',
  color_off_white: '#F5F5F5',
  custom_colors:   '[]',
  // legacy
  brand_primary_color: '#001731',
  brand_accent_color: '#D4A614',
  logo_main: 'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png',
  logo_dashboard: '',
  logo_transparent: '',
  favicon_url: '',
  logo_height_standard: '72',
  logo_width_standard: '160',
  company_name: 'Oceans Uganda',
  phone: '+256(0)758671270',
  phone_secondary: '',
  email: 'info@oceans.co.ug',
  sales_email: 'info@oceans.co.ug',
  whatsapp: '+256758671270',
  office_address: '785 Luthuli Avenue, Bugolobi, Kampala, Uganda',
  footer_address: '785 Luthuli Avenue, Bugolobi, Kampala, Uganda',
  working_hours_weekday: 'Monday – Friday: 8:00 AM – 6:00 PM',
  working_hours_saturday: 'Saturday: 9:00 AM – 4:00 PM',
  working_hours_sunday: 'Sunday: Closed',
  google_maps_embed: '',
  google_maps_link: 'https://maps.google.com',
  instagram_url: '',
  facebook_url: '',
  linkedin_url: '',
  twitter_url: '',
  youtube_url: '',
  tiktok_url: '',
  whatsapp_direct_url: '',
  social_show_footer: 'true',
  social_show_header: 'false',
  social_show_contact_page: 'true',
  site_name: 'Oceans Uganda',
  tagline: 'Premium Real Estate in Uganda',
  footer_text: '© 2026 Oceans Uganda. All rights reserved.',
  mgmt_site_name: 'Oceans Uganda',
  mgmt_site_tagline: 'Premium Real Estate in Uganda',
  mgmt_listings_per_page: '12',
  mgmt_featured_count: '6',
  mgmt_show_price_on_listing: 'true',
  mgmt_show_agent_on_listing: 'true',
  mgmt_allow_inquiries: 'true',
  mgmt_maintenance_mode: 'false',
  dash_menu_bg: '#001731',
  dash_logo_bg: '#001731',
  dash_active_border_color: '#C9A84C',
  dash_menu_text_color: 'rgba(255,255,255,0.6)',
  dash_menu_hover_color: 'rgba(255,255,255,1)',
  currency_primary: 'USD',
  currency_secondary: 'UGX',
  currency_dual_enabled: 'true',
  currency_manual_rate: '3850',
  watermark_text: '',
  watermark_enabled: 'false',
  watermark_position: 'bottom-right',
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  get: (key: keyof SiteSettings | string, fallback?: string) => string;
  reload: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULTS,
  loading: true,
  get: (key, fallback = '') => DEFAULTS[key as keyof SiteSettings] ?? fallback,
  reload: async () => {},
});

// ─── Global reload bridge ─────────────────────────────────────────────────────
// Management pages call this after saving so the frontend re-fetches settings
let _globalReload: (() => Promise<void>) | null = null;
export function registerGlobalSettingsReload(fn: () => Promise<void>) {
  _globalReload = fn;
}
export function triggerGlobalSettingsReload() {
  if (_globalReload) _globalReload().catch(() => null);
}

// ─── CSS variable injection ───────────────────────────────────────────────────
function injectCSSVars(s: SiteSettings) {
  const root = document.documentElement;

  // ── System palette (editable via branding page) ────────────────────────────
  root.style.setProperty('--color-primary',     s.color_primary   || s.brand_primary_color  || '#001731');
  root.style.setProperty('--color-secondary',   s.color_secondary || '#002349');
  root.style.setProperty('--color-accent',      s.color_accent    || '#0D5959');
  root.style.setProperty('--color-text',        s.color_text      || '#7A7A7A');
  root.style.setProperty('--color-topbar',      s.color_topbar    || '#020101');
  root.style.setProperty('--color-white',       s.color_white     || '#FFFFFF');
  root.style.setProperty('--color-off-white',   s.color_off_white || '#F5F5F5');

  // ── Golden (editable) ──────────────────────────────────────────────────────
  const gold = s.color_golden || s.brand_accent_color || '#D4A614';
  root.style.setProperty('--color-golden',      gold);
  root.style.setProperty('--color-golden-dark', '#A8832A');
  root.style.setProperty('--color-golden-light','#E8C97A');

  // ── Dashboard sidebar ──────────────────────────────────────────────────────
  root.style.setProperty('--dash-menu-bg',      s.dash_menu_bg             || s.color_primary || '#001731');
  root.style.setProperty('--dash-active-color', s.dash_active_border_color || gold);

  // ── Design System — Global Color Palette (from Design System panel) ────────
  // Core palette
  if (s.ds_primary_color)   root.style.setProperty('--color-primary',   s.ds_primary_color);
  if (s.ds_secondary_color) root.style.setProperty('--color-secondary', s.ds_secondary_color);
  if (s.ds_accent_color)    root.style.setProperty('--color-accent',    s.ds_accent_color);
  if (s.ds_golden_color)    root.style.setProperty('--color-golden',    s.ds_golden_color);

  // Text colors
  root.style.setProperty('--color-text-primary',   s.ds_text_primary   || '#1a1a1a');
  root.style.setProperty('--color-text-secondary', s.ds_text_secondary || '#6b7280');
  root.style.setProperty('--color-text-muted',     s.ds_text_muted     || '#9ca3af');
  root.style.setProperty('--color-text-inverse',   s.ds_text_inverse   || '#ffffff');

  // Background colors
  root.style.setProperty('--color-bg',        s.ds_bg_color    || '#ffffff');
  root.style.setProperty('--color-surface',   s.ds_bg_surface  || '#ffffff');
  root.style.setProperty('--color-bg-subtle', s.ds_bg_subtle   || '#f7f8fa');
  root.style.setProperty('--color-bg-dark',   s.ds_bg_dark     || '#001731');

  // Border colors
  root.style.setProperty('--color-border',       s.ds_border_color  || '#f0f0f0');
  root.style.setProperty('--color-border-strong', s.ds_border_strong || '#e5e7eb');
  root.style.setProperty('--color-border-focus',  s.ds_border_focus  || '#0D5959');

  // State colors
  root.style.setProperty('--color-success', s.ds_color_success || '#16a34a');
  root.style.setProperty('--color-warning', s.ds_color_warning || '#d97706');
  root.style.setProperty('--color-error',   s.ds_color_error   || '#dc2626');
  root.style.setProperty('--color-info',    s.ds_color_info    || '#0369a1');

  // ── Design System — Typography ─────────────────────────────────────────────
  if (s.ds_base_font_size) root.style.setProperty('--font-size-base', `${s.ds_base_font_size}px`);
  if (s.ds_line_height)    root.style.setProperty('--line-height-base', `${Number(s.ds_line_height) / 100}`);
  if (s.ds_heading_font)   root.style.setProperty('--font-heading', `'${s.ds_heading_font}', serif`);
  if (s.ds_body_font)      root.style.setProperty('--font-body', `'${s.ds_body_font}', sans-serif`);

  // ── Design System — Buttons ────────────────────────────────────────────────
  if (s.btn_radius)    root.style.setProperty('--btn-radius', `${s.btn_radius}px`);
  if (s.btn_pad_y)     root.style.setProperty('--btn-pad-y', `${s.btn_pad_y}px`);
  if (s.btn_pad_x)     root.style.setProperty('--btn-pad-x', `${s.btn_pad_x}px`);
  if (s.btn_bg_color)  root.style.setProperty('--btn-bg', s.btn_bg_color);
  if (s.btn_text_color) root.style.setProperty('--btn-text', s.btn_text_color);
  if (s.btn_border_color) root.style.setProperty('--btn-border', s.btn_border_color);
  if (s.btn_bg_color_hover)   root.style.setProperty('--btn-bg-hover', s.btn_bg_color_hover);
  if (s.btn_text_color_hover) root.style.setProperty('--btn-text-hover', s.btn_text_color_hover);

  // ── Design System — Cards ──────────────────────────────────────────────────
  if (s.card_radius)          root.style.setProperty('--card-radius', `${s.card_radius}px`);
  if (s.card_pad_x)           root.style.setProperty('--card-pad-x', `${s.card_pad_x}px`);
  if (s.card_pad_y)           root.style.setProperty('--card-pad-y', `${s.card_pad_y}px`);
  if (s.card_separator_color) root.style.setProperty('--card-separator', s.card_separator_color);
  if (s.card_title_color)     root.style.setProperty('--card-title', s.card_title_color);
  if (s.card_price_color)     root.style.setProperty('--card-price', s.card_price_color);
  if (s.card_icon_color)      root.style.setProperty('--card-icon', s.card_icon_color);
  if (s.card_bg_color)        root.style.setProperty('--card-bg', s.card_bg_color);

  // ── Design System — Images ─────────────────────────────────────────────────
  if (s.img_border_radius) root.style.setProperty('--img-radius', `${s.img_border_radius}px`);
  if (s.img_card_height)   root.style.setProperty('--img-card-height', `${s.img_card_height}px`);

  // ── Design System — Carousel Dots ─────────────────────────────────────────
  if (s.carousel_dot_size)         root.style.setProperty('--dot-size', `${s.carousel_dot_size}px`);
  if (s.carousel_dot_active_width) root.style.setProperty('--dot-active-width', `${s.carousel_dot_active_width}px`);
  if (s.carousel_dot_gap)          root.style.setProperty('--dot-gap', `${s.carousel_dot_gap}px`);
  if (s.carousel_dot_mt)           root.style.setProperty('--dot-mt', `${s.carousel_dot_mt}px`);
  if (s.carousel_dot_color)        root.style.setProperty('--dot-color', s.carousel_dot_color);
  if (s.carousel_dot_active_color) root.style.setProperty('--dot-active-color', s.carousel_dot_active_color);
  if (s.carousel_dot_opacity)      root.style.setProperty('--dot-opacity', String(Number(s.carousel_dot_opacity) / 100));
  if (s.carousel_dot_active_opacity) root.style.setProperty('--dot-active-opacity', String(Number(s.carousel_dot_active_opacity) / 100));

  // ── Design System — Spacing ────────────────────────────────────────────────
  if (s.ds_card_gap)       root.style.setProperty('--card-gap', `${s.ds_card_gap}px`);
  if (s.ds_container_width && s.ds_container_width !== 'full') {
    root.style.setProperty('--container-max', `${s.ds_container_width}px`);
  } else if (s.ds_container_width === 'full') {
    root.style.setProperty('--container-max', '100%');
  }

  // ── Custom colors (stored as JSON array) ───────────────────────────────────
  try {
    const customs: { id: string; label: string; value: string }[] = JSON.parse(s.custom_colors || '[]');
    customs.forEach(({ id, value }) => {
      if (id && value) {
        root.style.setProperty(`--color-custom-${id}`, value);
      }
    });
  } catch {
    // ignore malformed JSON
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value');
      if (data && data.length > 0) {
        const map: SiteSettings = { ...DEFAULTS };
        (data as { key: string; value: string }[]).forEach((row) => {
          if (row.key) map[row.key] = row.value ?? '';
        });
        setSettings(map);
        injectCSSVars(map);
      } else {
        injectCSSVars(DEFAULTS);
      }
    } catch {
      injectCSSVars(DEFAULTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    // Register this instance's reload so management saves can trigger it
    registerGlobalSettingsReload(load);
  }, [load]);

  const get = useCallback(
    (key: keyof SiteSettings | string, fallback = '') =>
      settings[key as keyof SiteSettings] ?? fallback,
    [settings]
  );

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, get, reload: load }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
