import { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

/**
 * Wraps a price and replaces "/pcm" with a styled, hoverable tooltip
 * that shows "per calendar month" on hover.
 *
 * Usage:
 *   <PcmPrice priceUsd={6500} currency="USD" purpose="rent" className="font-bold text-lg" />
 */
interface PcmPriceProps {
  price?: string; // legacy: pre-formatted price string
  priceUsd?: number | null;
  currency?: string;
  purpose?: string;
  className?: string;
  style?: React.CSSProperties;
  tooltipSide?: 'top' | 'bottom';
}

export default function PcmPrice({ price, priceUsd, currency, purpose, className = '', style, tooltipSide = 'bottom' }: PcmPriceProps) {
  const [hovered, setHovered] = useState(false);
  const { formatPrice } = useCurrency();

  // Prefer dynamic currency formatting when raw price data is available
  const displayPrice = (priceUsd != null)
    ? formatPrice(priceUsd, currency, { purpose })
    : (price ?? '');

  const hasPcm = displayPrice.includes(' pcm');
  if (!hasPcm) {
    return <span className={className} style={style}>{displayPrice}</span>;
  }

  const [before] = displayPrice.split(' pcm');

  return (
    <span className={className} style={style}>
      {before}
      &nbsp;
      <span
        className="relative inline-flex items-baseline cursor-help"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="font-inherit" style={{ opacity: 1, fontSize: 'inherit', color: '#002349' }}>
          pcm
        </span>

        {/* Tooltip bubble */}
        {hovered && (
          <span
            className={`
              absolute z-50 whitespace-nowrap pointer-events-none
              px-2.5 py-1.5 rounded-md
              text-[11px] font-roboto font-medium tracking-wide
              bg-[#002349] text-white
              ${tooltipSide === 'top'
                ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                : 'top-full mt-2 left-1/2 -translate-x-1/2'}
            `}
            style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.22)', letterSpacing: '0.02em' }}
          >
            per calendar month
            {/* Arrow */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 ${
                tooltipSide === 'top'
                  ? 'top-full border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1a2a1a]'
                  : 'bottom-full border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#002349]'
              }`}
            />
          </span>
        )}
      </span>
    </span>
  );
}
