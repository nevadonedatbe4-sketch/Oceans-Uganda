import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface NavProperty {
  slug: string;
  title: string;
  location: string | null;
  cover_image: string | null;
  price_display: string;
}

interface PrevNextPropertyStripProps {
  prev: NavProperty | null;
  next: NavProperty | null;
}

export default function PrevNextPropertyStrip({ prev, next }: PrevNextPropertyStripProps) {
  const { get } = useSiteSettings();
  const accentColor = get('detail_chip_icon', '#D4A853');
  const titleColor = get('detail_title_color', '#001731');

  if (!prev && !next) return null;

  return (
    <div className="border-t border-b border-stone-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">

          {/* ── PREV ── */}
          <div className="flex items-stretch min-h-0">
            {prev ? (
              <Link
                to={`/property/${prev.slug}`}
                className="flex items-center gap-3 md:gap-4 py-3.5 md:py-5 pr-4 md:pr-10 w-full group cursor-pointer hover:bg-[#f5f5f5]/60 transition-colors"
              >
                {/* Arrow */}
                <div
                  className="shrink-0 w-9 h-9 flex items-center justify-center border border-stone-200 group-hover:border-stone-400 transition-colors"
                >
                  <i className="ri-arrow-left-line text-base text-stone-500 group-hover:text-stone-800 transition-colors" />
                </div>

                {/* Thumbnail */}
                <div className="shrink-0 w-16 h-12 md:w-20 md:h-14 overflow-hidden bg-stone-100">
                  {prev.cover_image ? (
                    <img
                      src={prev.cover_image}
                      alt={prev.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ri-building-line text-stone-300 text-xl" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-roboto uppercase tracking-[0.18em] text-stone-400 mb-1.5">
                    Previous Property
                  </p>
                  <p
                    className="text-sm font-roboto font-semibold leading-snug line-clamp-2 group-hover:underline transition-all"
                    style={{ color: titleColor }}
                  >
                    {prev.title}
                  </p>
                  {prev.location && (
                    <p className="text-xs font-roboto text-stone-400 mt-0.5 truncate">
                      <i className="ri-map-pin-2-line text-[10px] mr-1" style={{ color: accentColor }} />
                      {prev.location}
                    </p>
                  )}
                  <p className="text-xs font-roboto font-semibold mt-1" style={{ color: accentColor }}>
                    {prev.price_display}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 md:gap-4 py-3.5 md:py-5 pr-4 md:pr-10 w-full opacity-30 cursor-default select-none">
                <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-stone-200">
                  <i className="ri-arrow-left-line text-base text-stone-400" />
                </div>
                <p className="text-xs font-roboto text-stone-400">No previous property</p>
              </div>
            )}
          </div>

          {/* ── NEXT ── */}
          <div className="flex items-stretch min-h-0">
            {next ? (
              <Link
                to={`/property/${next.slug}`}
                className="flex items-center gap-3 md:gap-4 py-3.5 md:py-5 pl-4 md:pl-10 w-full group cursor-pointer hover:bg-[#f5f5f5]/60 transition-colors justify-end md:justify-start"
              >
                {/* Text */}
                <div className="min-w-0 flex-1 text-right md:text-left">
                  <p className="text-[9px] font-roboto uppercase tracking-[0.18em] text-stone-400 mb-1.5">
                    Next Property
                  </p>
                  <p
                    className="text-sm font-roboto font-semibold leading-snug line-clamp-2 group-hover:underline transition-all"
                    style={{ color: titleColor }}
                  >
                    {next.title}
                  </p>
                  {next.location && (
                    <p className="text-xs font-roboto text-stone-400 mt-0.5 truncate">
                      <i className="ri-map-pin-2-line text-[10px] mr-1" style={{ color: accentColor }} />
                      {next.location}
                    </p>
                  )}
                  <p className="text-xs font-roboto font-semibold mt-1" style={{ color: accentColor }}>
                    {next.price_display}
                  </p>
                </div>

                {/* Thumbnail */}
                <div className="shrink-0 w-16 h-12 md:w-20 md:h-14 overflow-hidden bg-stone-100">
                  {next.cover_image ? (
                    <img
                      src={next.cover_image}
                      alt={next.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ri-building-line text-stone-300 text-xl" />
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div
                  className="shrink-0 w-9 h-9 flex items-center justify-center border border-stone-200 group-hover:border-stone-400 transition-colors"
                >
                  <i className="ri-arrow-right-line text-base text-stone-500 group-hover:text-stone-800 transition-colors" />
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-end gap-3 md:gap-4 py-3.5 md:py-5 pl-4 md:pl-10 w-full opacity-30 cursor-default select-none">
                <p className="text-xs font-roboto text-stone-400">No next property</p>
                <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-stone-200">
                  <i className="ri-arrow-right-line text-base text-stone-400" />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
