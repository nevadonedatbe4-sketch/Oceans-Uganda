import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export type SocialIconStyle = 'plain' | 'colored' | 'outline';

interface SocialIconsProps {
  variant?: SocialIconStyle;
  className?: string;
  iconClassName?: string;
  gap?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SOCIALS = [
  { key: 'facebook_url', icon: 'ri-facebook-fill', label: 'Facebook', fallback: 'https://www.facebook.com/profile.php?id=61553088554196' },
  { key: 'twitter_url', icon: 'ri-twitter-x-fill', label: 'Twitter', fallback: '' },
  { key: 'instagram_url', icon: 'ri-instagram-line', label: 'Instagram', fallback: 'https://www.instagram.com/oceans_estateagents' },
  { key: 'linkedin_url', icon: 'ri-linkedin-fill', label: 'LinkedIn', fallback: 'https://www.linkedin.com/in/oceans-estate-agents-0312a2303/' },
  { key: 'youtube_url', icon: 'ri-youtube-fill', label: 'YouTube', fallback: 'https://www.youtube.com/channel/UCHGFBxPSNWi_o9tXRMOflPA' },
  { key: 'whatsapp_direct_url', icon: 'ri-whatsapp-line', label: 'WhatsApp', fallback: 'https://wa.link/ksz8s8' },
];

const SIZE_MAP = {
  sm: { wrap: 'w-8 h-8', icon: 'text-lg' },
  md: { wrap: 'w-9 h-9', icon: 'text-xl' },
  lg: { wrap: 'w-11 h-11', icon: 'text-2xl' },
};

export default function SocialIcons({
  variant = 'plain',
  className = '',
  iconClassName = '',
  gap = 'gap-3',
  size = 'md',
}: SocialIconsProps) {
  const { get } = useSiteSettings();
  const { wrap: wrapSize, icon: iconSize } = SIZE_MAP[size];

  const active = SOCIALS.filter((s) => {
    const val = get(s.key);
    return (val && val !== '#') || s.fallback;
  });

  if (!active.length) return null;

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {active.map((s) => {
        const url = get(s.key) || s.fallback;
        if (!url || url === '#') return null;

        if (variant === 'colored') {
          return (
            <a
              key={s.key}
              href={url}
              rel="nofollow"
              aria-label={s.label}
              target="_blank"
              className={`${wrapSize} flex items-center justify-center rounded-full text-white hover:scale-110 transition-transform duration-300 cursor-pointer bg-primary`}
            >
              <i className={`${s.icon} ${iconSize} ${iconClassName}`} />
            </a>
          );
        }

        if (variant === 'outline') {
          return (
            <a
              key={s.key}
              href={url}
              rel="nofollow"
              aria-label={s.label}
              target="_blank"
              className={`${wrapSize} flex items-center justify-center rounded-full border border-current hover:border-golden hover:text-golden transition-colors duration-300 cursor-pointer`}
            >
              <i className={`${s.icon} ${iconSize} ${iconClassName}`} />
            </a>
          );
        }

        // plain
        return (
          <a
            key={s.key}
            href={url}
            rel="nofollow"
            aria-label={s.label}
            target="_blank"
            className={`w-7 h-7 flex items-center justify-center hover:text-golden transition-colors duration-300 cursor-pointer ${iconClassName}`}
          >
            <i className={`${s.icon} text-2xl sm:text-3xl`} />
          </a>
        );
      })}
    </div>
  );
}