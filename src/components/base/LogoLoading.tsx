import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface LogoLoadingProps {
  label?: string;
  size?: number;
  className?: string;
  minHeight?: string;
}

/**
 * LogoLoading — branded loading state using the site logo instead of a generic spinner.
 * Falls back to a text initials mark if no logo is configured.
 */
export default function LogoLoading({ label, size = 56, className = '', minHeight }: LogoLoadingProps) {
  const { get } = useSiteSettings();
  const logo = get('logo_main', '');
  const siteName = get('site_name', 'Oceans');

  const initials = siteName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const containerStyle: React.CSSProperties = minHeight ? { minHeight } : {};

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      style={containerStyle}
    >
      {logo ? (
        <div
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <img
            src={logo}
            alt={siteName}
            className="max-w-full max-h-full object-contain animate-pulse"
            style={{ filter: 'grayscale(30%)', opacity: 0.85 }}
          />
          {/* Subtle orbit ring around logo */}
          <div
            className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: 'rgba(201,168,76,0.25)',
              borderTopColor: 'transparent',
              width: size + 12,
              height: size + 12,
              top: -6,
              left: -6,
            }}
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold animate-pulse"
          style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
          {initials}
        </div>
      )}

      {label && (
        <p className="text-xs font-roboto tracking-widest uppercase" style={{ color: '#aaa' }}>
          {label}
        </p>
      )}
    </div>
  );
}