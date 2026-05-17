import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '@/types/property';
import PcmPrice from '@/components/base/PcmTooltip';
import PropertyPreviewModal from '@/components/base/PropertyPreviewModal';
import PropertyMeta from '@/components/base/PropertyMeta';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PropertyCardProps {
  property: Property;
  className?: string;
  squareCorners?: boolean;
}

function formatDate(listingDate: string | undefined, format: string): string | null {
  if (!listingDate) return null;
  const d = new Date(listingDate);
  if (isNaN(d.getTime())) return null;
  if (format === 'relative') {
    const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diffDays === 0) return 'Listed today';
    if (diffDays === 1) return 'Listed 1 day ago';
    if (diffDays < 7) return `Listed ${diffDays} days ago`;
    if (diffDays < 30) return `Listed ${Math.floor(diffDays / 7)} wks ago`;
    if (diffDays < 365) return `Listed ${Math.floor(diffDays / 30)} mo ago`;
    return `Listed ${Math.floor(diffDays / 365)}y ago`;
  }
  if (format === 'short') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PropertyCard({ property, className = '', squareCorners }: PropertyCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { get: getSetting } = useSiteSettings();
  const { formatPrice } = useCurrency();

  // ── Visibility toggles ──────────────────────────────────────────────────
  const hidePreview  = getSetting('card_hide_preview',  'false') === 'true';
  const hideFeatured = getSetting('card_hide_featured', 'false') === 'true';
  const hideStatus   = getSetting('card_hide_status',   'false') === 'true';
  const hideLabels   = getSetting('card_hide_labels',   'false') === 'true';

  // ── Card field visibility from Card Content Manager ─────────────────────
  const fieldVisibleRaw = getSetting('card_field_visible', '');
  const fieldVisible = useMemo<Record<string, boolean>>(() => {
    try { const p = JSON.parse(fieldVisibleRaw); if (p && typeof p === 'object') return p; } catch { /* ignore */ }
    return {};
  }, [fieldVisibleRaw]);

  const isVisible = (id: string, defaultVal = true) =>
    id in fieldVisible ? fieldVisible[id] : defaultVal;

  // ── Card Box colors ─────────────────────────────────────────────────────
  const cardBg         = getSetting('card_bg_color', '#ffffff');
  const titleColor     = getSetting('card_title_color', '#1a1a1a');
  const titleColorHov  = getSetting('card_title_color_hover', '#0D5959');
  const addressColor   = getSetting('card_address_color', '#9ca3af');
  const priceColor     = getSetting('card_price_color', '#1a1a1a');
  const iconColor      = getSetting('card_icon_color', '#9ca3af');
  const figureColor    = getSetting('card_figure_color', '#6b7280');
  const labelColor     = getSetting('card_label_color', '#9ca3af');
  const toolsBg        = getSetting('card_tools_bg', 'rgba(0,0,0,0.08)');
  const toolsIcon      = getSetting('card_tools_icon', '#6b7280');
  const separatorStyle = getSetting('card_separator', 'hairline');
  const separatorColor = getSetting('card_separator_color', '#f0f0f0');
  const cardRadius     = getSetting('card_radius', '0');
  const cardPadX       = getSetting('card_pad_x', '16');
  const cardPadY       = getSetting('card_pad_y', '16');

  // ── Image settings ──────────────────────────────────────────────────────
  const imgRadius    = getSetting('img_border_radius', '0');
  const imgFit       = getSetting('img_fit', 'cover') as 'cover' | 'contain';
  const imgHeight    = getSetting('img_card_height', '260');
  const imgFocal     = getSetting('img_focal_point', 'top');
  const imgZoom      = getSetting('img_hover_zoom', 'true') === 'true';
  const imgOverlay   = getSetting('img_hover_overlay', 'true') === 'true';

  // ── Typography per-element ──────────────────────────────────────────────
  const titleSize    = getSetting('typo_prop_title_size', '');
  const titleWeight  = getSetting('typo_prop_title_weight', '600');
  const titleTransform = getSetting('typo_prop_title_transform', 'none');
  const addrSize     = getSetting('typo_address_size', '');
  const priceSize    = getSetting('typo_price_size', '');
  const priceWeight  = getSetting('typo_price_weight', '700');
  const metaSize     = getSetting('typo_meta_figure_size', '');

  // ── Spacing ─────────────────────────────────────────────────────────────
  const titleMb   = getSetting('spacing_desktop_title_mb', '8');
  const addressMb = getSetting('spacing_desktop_address_mb', '12');
  const iconSize  = getSetting('spacing_desktop_meta_icon_size', '14');

  // ── Date settings ───────────────────────────────────────────────────────
  const dateVisible   = getSetting('date_visible', 'true') === 'true';
  const datePosition  = getSetting('date_position', 'bottom');
  const dateFormat    = getSetting('date_format', 'relative');
  const dateFontSize  = getSetting('date_font_size', '10');
  const dateFontWeight = getSetting('date_font_weight', '400');
  const dateColor     = getSetting('date_color', '#d1d5db');
  const dateShowIcon  = getSetting('date_show_icon', 'true') === 'true';
  const dateTransform = getSetting('date_transform', 'none') as 'none' | 'uppercase' | 'capitalize';

  const formattedDate = formatDate(property.listingDate, dateFormat);

  const isRent = property.category === 'rent';
  const purposeLabel = isRent ? 'For Rent' : 'For Sale';

  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.slug) setPreviewOpen(true);
  }, [property.slug]);

  const dateEl = dateVisible && formattedDate ? (
    <span
      className="flex items-center gap-1 whitespace-nowrap flex-shrink-0"
      style={{
        color: dateColor,
        fontSize: `${dateFontSize}px`,
        fontWeight: dateFontWeight,
        textTransform: dateTransform,
      }}
    >
      {dateShowIcon && <i className="ri-time-line" style={{ fontSize: `${dateFontSize}px` }} />}
      {formattedDate}
    </span>
  ) : null;

  // Dynamic currency-aware price display
  const priceDisplay = property.priceUsd != null
    ? formatPrice(property.priceUsd, property.currency, { purpose: property.category === 'rent' ? 'rent' : 'sale' })
    : property.price;

  const cardContent = (
    <div
      className={`bg-white overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col w-full h-full ${className}`}
      style={{
        background: cardBg,
        borderRadius: squareCorners ? undefined : `${cardRadius}px`,
        border: separatorStyle === 'hairline' ? `1px solid ${separatorColor}` : '1px solid #ebebeb',
      }}
    >
      {/* ── Image ── */}
      <div
        className="relative w-full overflow-hidden flex-shrink-0"
        style={{ height: `${imgHeight}px`, borderRadius: squareCorners ? undefined : `${imgRadius}px ${imgRadius}px 0 0` }}
      >
        <img
          src={property.image}
          alt={property.title}
          className={`w-full h-full transition-transform duration-700 ${imgZoom ? 'group-hover:scale-103' : ''}`}
          style={{ objectFit: imgFit, objectPosition: imgFocal }}
        />

        {imgOverlay && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-400" />
        )}

        {/* Date — top position */}
        {datePosition === 'top' && dateEl && (
          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
            {dateEl}
          </div>
        )}

        {/* Status badge — upper left on image */}
        {!hideStatus && isVisible('status') && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm whitespace-nowrap"
              style={{ color: '#FBFBFB', background: '#333333' }}
            >
              {purposeLabel}
            </span>
          </div>
        )}

        {/* Featured badge — upper right on image */}
        {!hideFeatured && isVisible('featured') && property.featured && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.18em] px-2 py-1 rounded-sm whitespace-nowrap"
              style={{ background: '#1B7C29', color: '#ffffff' }}
            >
              Featured
            </span>
          </div>
        )}

        {/* Expand / Preview button */}
        {!hidePreview && property.slug && (
          <div
            className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1"
            onClick={handleExpandClick}
          >
            {/* "Preview" label */}
            <span
              className="text-white text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded whitespace-nowrap"
              style={{ background: 'rgba(20,20,20,0.75)', backdropFilter: 'blur(4px)' }}
            >
              Preview
            </span>
            {/* Double-arrow expand icon button */}
            <div
              className="w-8 h-8 flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform rounded-sm"
              style={{ background: 'rgba(20,20,20,0.75)', backdropFilter: 'blur(4px)' }}
            >
              <i className="ri-expand-diagonal-line text-base" />
            </div>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div
        className="flex flex-col flex-1"
        style={{ padding: `${cardPadY}px ${cardPadX}px` }}
      >
        {/* Date — top-of-content position */}
        {datePosition === 'top' && dateEl && (
          <div className="mb-1.5">{dateEl}</div>
        )}

        {/* Address */}
        {isVisible('address') && (
          <p
            className="flex items-center gap-1 truncate"
            style={{ color: addressColor, fontSize: addrSize ? `${addrSize}px` : '12px', marginBottom: '6px' }}
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
              <i className="ri-map-pin-line text-xs" style={{ color: iconColor }} />
            </span>
            <span className="truncate">{property.location}</span>
          </p>
        )}

        {/* Title */}
        {isVisible('title') && (
          <h3
            className="leading-snug line-clamp-2 group-hover:transition-colors"
            style={{
              color: titleColor,
              fontSize: titleSize ? `${titleSize}px` : '14px',
              fontWeight: titleWeight,
              textTransform: titleTransform as 'none' | 'uppercase' | 'capitalize' | 'lowercase',
              marginBottom: `${titleMb}px`,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = titleColorHov; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = titleColor; }}
          >
            {property.title}
          </h3>
        )}

        {/* Meta */}
        {!hideLabels && isVisible('meta') && (
          <PropertyMeta
            beds={property.beds}
            baths={property.baths}
            parking={(property as { parking?: number }).parking}
            iconSize={Number(iconSize)}
            strokeWidth={1.5}
            textColor={figureColor}
            iconColor={iconColor}
            gap="gap-4"
            innerGap="gap-1.5"
            pluralize
            style={{ fontSize: metaSize ? `${metaSize}px` : '12px' }}
            className="mb-3"
          />
        )}

        {/* Property type */}
        {isVisible('prop_type') && property.type && (
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: labelColor }}
          >
            {property.type}
          </p>
        )}

        {/* Area postfix */}
        {isVisible('area_postfix') && (property as { area?: string }).area && (
          <p className="text-[11px] mb-2" style={{ color: figureColor }}>
            {(property as { area?: string }).area}
          </p>
        )}

        {/* Divider + Price row */}
        <div
          className="mt-auto pt-3 flex items-end justify-between gap-2"
          style={{ borderTop: separatorStyle === 'hairline' ? `1px solid ${separatorColor}` : 'none' }}
        >
          <div className="flex flex-col gap-0.5">
            {isVisible('price') && (
              <PcmPrice
                price={property.price}
                priceUsd={property.priceUsd}
                currency={property.currency}
                purpose={property.category === 'rent' ? 'rent' : 'sale'}
                className="font-bold leading-tight whitespace-nowrap"
                style={{ color: priceColor, fontSize: priceSize ? `${priceSize}px` : '16px', fontWeight: priceWeight }}
                tooltipSide="top"
              />
            )}
            {isVisible('sub_price') && (property as { subPrice?: string }).subPrice && (
              <span className="text-[11px]" style={{ color: labelColor }}>
                {(property as { subPrice?: string }).subPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Date — inline position */}
            {datePosition === 'inline' && dateEl}
          </div>
        </div>

        {/* Date — bottom position */}
        {datePosition === 'bottom' && dateEl && (
          <div className="mt-2">{dateEl}</div>
        )}

        {/* Agent */}
        {isVisible('agent') && (property as { agentName?: string }).agentName && (
          <p className="text-[11px] mt-2" style={{ color: figureColor }}>
            <i className="ri-user-line mr-1" style={{ color: iconColor }} />
            {(property as { agentName?: string }).agentName}
          </p>
        )}
      </div>

      {/* Preview Modal */}
      {previewOpen && property.slug && (
        <PropertyPreviewModal
          slug={property.slug}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );

  if (property.slug) {
    return (
      <Link to={`/property/${property.slug}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
