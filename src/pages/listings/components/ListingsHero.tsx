import { type ReactNode } from 'react';

export interface HeroTypo {
  eyebrow_font_family?: string;
  eyebrow_font_weight?: string;
  eyebrow_font_size?: string;
  eyebrow_letter_spacing?: string;
  eyebrow_transform?: string;
  title_font_family?: string;
  title_font_weight?: string;
  title_font_size?: string;
  title_letter_spacing?: string;
  title_line_height?: string;
  title_transform?: string;
  subtitle_font_family?: string;
  subtitle_font_weight?: string;
  subtitle_font_size?: string;
  subtitle_letter_spacing?: string;
  subtitle_line_height?: string;
}

interface ListingsHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  children?: ReactNode;
  typo?: HeroTypo;
}

export default function ListingsHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  children,
  typo,
}: ListingsHeroProps) {
  const t = typo || {};

  return (
    <div
      className="relative pt-28 pb-14 px-6 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        minHeight: '320px',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <p
          className="mb-3 animate-fade-in"
          style={{
            color: '#C9A84C',
            fontFamily: t.eyebrow_font_family || undefined,
            fontWeight: t.eyebrow_font_weight || '400',
            fontSize: t.eyebrow_font_size ? `${t.eyebrow_font_size}px` : '14px',
            letterSpacing: t.eyebrow_letter_spacing ? `${t.eyebrow_letter_spacing}em` : '0.3em',
            textTransform: ((t.eyebrow_transform || 'uppercase') as 'none' | 'uppercase' | 'capitalize' | 'lowercase'),
          }}
        >
          {eyebrow}
        </p>
        <h1
          className="mb-4 text-white leading-tight"
          style={{
            fontFamily: t.title_font_family || undefined,
            fontWeight: t.title_font_weight || '400',
            fontSize: t.title_font_size ? `${t.title_font_size}px` : undefined,
            letterSpacing: t.title_letter_spacing ? `${t.title_letter_spacing}em` : undefined,
            lineHeight: t.title_line_height || '1.1',
            textTransform: ((t.title_transform || 'none') as 'none' | 'uppercase' | 'capitalize' | 'lowercase'),
          }}
        >
          {title}
        </h1>
        <p
          className="max-w-md mx-auto mb-6"
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontFamily: t.subtitle_font_family || undefined,
            fontWeight: t.subtitle_font_weight || '400',
            fontSize: t.subtitle_font_size ? `${t.subtitle_font_size}px` : '14px',
            letterSpacing: t.subtitle_letter_spacing ? `${t.subtitle_letter_spacing}em` : undefined,
            lineHeight: t.subtitle_line_height || '1.5',
          }}
        >
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
}
