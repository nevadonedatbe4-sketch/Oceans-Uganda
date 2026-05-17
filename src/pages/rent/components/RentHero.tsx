import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ListingsHero from '@/pages/listings/components/ListingsHero';

const DEFAULT_BG = 'https://readdy.ai/api/search-image?query=premium%20rental%20apartment%20Kampala%20Uganda%20furnished%20interior%20modern%20living%20room%20tropical%20garden%20elegant%20expat%20home%20bright%20airy%20spaces%20wide%20angle%20exterior&width=1920&height=600&seq=rent-hero-bg&orientation=landscape';

interface HeroSettings {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  eyebrow_font_family: string;
  eyebrow_font_weight: string;
  eyebrow_font_size: string;
  eyebrow_letter_spacing: string;
  eyebrow_transform: string;
  title_font_family: string;
  title_font_weight: string;
  title_font_size: string;
  title_letter_spacing: string;
  title_line_height: string;
  title_transform: string;
  subtitle_font_family: string;
  subtitle_font_weight: string;
  subtitle_font_size: string;
  subtitle_letter_spacing: string;
  subtitle_line_height: string;
}

const DEFAULTS: HeroSettings = {
  eyebrow: 'Premium Rentals',
  title: 'Properties To Rent',
  subtitle: "Find your perfect home across Kampala's most desirable locations.",
  image: DEFAULT_BG,
  eyebrow_font_family: '',
  eyebrow_font_weight: '400',
  eyebrow_font_size: '12',
  eyebrow_letter_spacing: '0.3',
  eyebrow_transform: 'uppercase',
  title_font_family: 'Prata',
  title_font_weight: '400',
  title_font_size: '48',
  title_letter_spacing: '0',
  title_line_height: '1.1',
  title_transform: 'none',
  subtitle_font_family: '',
  subtitle_font_weight: '400',
  subtitle_font_size: '14',
  subtitle_letter_spacing: '0',
  subtitle_line_height: '1.5',
};

export default function RentHero() {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULTS);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('key, value')
      .like('key', 'rent_hero_%')
      .then(({ data }) => {
        if (!data) return;
        const m: Record<string, string> = {};
        data.forEach((r: { key: string; value: string }) => {
          m[r.key.replace('rent_hero_', '')] = r.value;
        });
        setSettings((prev) => ({
          ...prev,
          eyebrow: m.eyebrow || prev.eyebrow,
          title: m.title || prev.title,
          subtitle: m.subtitle || prev.subtitle,
          image: m.image || prev.image,
          eyebrow_font_family: m.eyebrow_font_family ?? prev.eyebrow_font_family,
          eyebrow_font_weight: m.eyebrow_font_weight ?? prev.eyebrow_font_weight,
          eyebrow_font_size: m.eyebrow_font_size ?? prev.eyebrow_font_size,
          eyebrow_letter_spacing: m.eyebrow_letter_spacing ?? prev.eyebrow_letter_spacing,
          eyebrow_transform: m.eyebrow_transform ?? prev.eyebrow_transform,
          title_font_family: m.title_font_family ?? prev.title_font_family,
          title_font_weight: m.title_font_weight ?? prev.title_font_weight,
          title_font_size: m.title_font_size ?? prev.title_font_size,
          title_letter_spacing: m.title_letter_spacing ?? prev.title_letter_spacing,
          title_line_height: m.title_line_height ?? prev.title_line_height,
          title_transform: m.title_transform ?? prev.title_transform,
          subtitle_font_family: m.subtitle_font_family ?? prev.subtitle_font_family,
          subtitle_font_weight: m.subtitle_font_weight ?? prev.subtitle_font_weight,
          subtitle_font_size: m.subtitle_font_size ?? prev.subtitle_font_size,
          subtitle_letter_spacing: m.subtitle_letter_spacing ?? prev.subtitle_letter_spacing,
          subtitle_line_height: m.subtitle_line_height ?? prev.subtitle_line_height,
        }));
      });
  }, []);

  return (
    <ListingsHero
      eyebrow={settings.eyebrow}
      title={settings.title}
      subtitle={settings.subtitle}
      backgroundImage={settings.image || DEFAULT_BG}
      typo={{
        eyebrow_font_family: settings.eyebrow_font_family,
        eyebrow_font_weight: settings.eyebrow_font_weight,
        eyebrow_font_size: settings.eyebrow_font_size,
        eyebrow_letter_spacing: settings.eyebrow_letter_spacing,
        eyebrow_transform: settings.eyebrow_transform,
        title_font_family: settings.title_font_family,
        title_font_weight: settings.title_font_weight,
        title_font_size: settings.title_font_size,
        title_letter_spacing: settings.title_letter_spacing,
        title_line_height: settings.title_line_height,
        title_transform: settings.title_transform,
        subtitle_font_family: settings.subtitle_font_family,
        subtitle_font_weight: settings.subtitle_font_weight,
        subtitle_font_size: settings.subtitle_font_size,
        subtitle_letter_spacing: settings.subtitle_letter_spacing,
        subtitle_line_height: settings.subtitle_line_height,
      }}
    />
  );
}
