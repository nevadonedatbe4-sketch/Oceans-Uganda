import { useEffect, useState } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface WatermarkedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'eager' | 'lazy';
  /** Override position from settings. If omitted, reads `watermark_position` setting. */
  position?: WatermarkPosition;
  /** Optional: override the watermark text */
  watermarkText?: string;
  /** Optional: force watermark off even when text exists */
  noWatermark?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
}

type WatermarkPosition = 'bottom-right' | 'bottom-left' | 'center' | 'diagonal';

const POSITIONS: WatermarkPosition[] = ['bottom-right', 'bottom-left', 'center', 'diagonal'];

function drawBottomRight(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number,
  fontSize: number,
  padding: number
) {
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  const x = w - padding;
  const y = h - padding;

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#000';
  ctx.fillRect(x - textWidth - padding, y - textHeight, textWidth + padding * 2, textHeight + padding);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawBottomLeft(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number,
  fontSize: number,
  padding: number
) {
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  const x = padding;
  const y = h - padding;

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#000';
  ctx.fillRect(x - padding, y - textHeight, textWidth + padding * 2, textHeight + padding);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawCenter(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number,
  fontSize: number,
  _padding: number
) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const x = w / 2;
  const y = h / 2;

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.fillRect(x - textWidth / 2 - 16, y - textHeight / 2 - 8, textWidth + 32, textHeight + 16);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawDiagonal(
  ctx: CanvasRenderingContext2D,
  text: string,
  w: number,
  h: number,
  fontSize: number,
  _padding: number
) {
  // Large diagonal text across the whole image, semi-transparent
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 6); // -30 degrees

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const largeFont = Math.max(fontSize * 2.5, Math.floor(Math.min(w, h) * 0.08));
  ctx.font = `bold ${largeFont}px Roboto, sans-serif`;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText(text, 0, 0);
  ctx.restore();

  // Tiled effect: repeat across canvas
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.shadowBlur = 4;
  const stepX = largeFont * 3.5;
  const stepY = largeFont * 2.5;
  const rows = Math.ceil(h / stepY) + 2;
  const cols = Math.ceil(w / stepX) + 2;
  for (let row = -rows; row <= rows; row++) {
    for (let col = -cols; col <= cols; col++) {
      ctx.fillText(text, col * stepX, row * stepY);
    }
  }
  ctx.restore();
}

/**
 * WatermarkedImage
 * ── only watermarks images if `watermark_enabled` is true, `watermark_text` has a value,
 *    and `noWatermark` is not set. Reads position from `watermark_position` setting.
 */
export default function WatermarkedImage({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  position,
  watermarkText,
  noWatermark = false,
  onClick,
}: WatermarkedImageProps) {
  const { get } = useSiteSettings();
  const text = watermarkText || get('watermark_text', '').trim();
  const enabled = get('watermark_enabled', 'false') === 'true';
  const pos: WatermarkPosition = position ||
    (get('watermark_position', 'bottom-right') as WatermarkPosition) ||
    'bottom-right';
  const [dataUrl, setDataUrl] = useState<string>(src);

  const shouldWatermark = !noWatermark && enabled && !!text;

  useEffect(() => {
    if (!shouldWatermark) {
      setDataUrl(src);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setDataUrl(src); return; }

      ctx.drawImage(img, 0, 0);

      const w = canvas.width;
      const h = canvas.height;
      const fontSize = Math.max(14, Math.floor(Math.min(w, h) * 0.03));
      ctx.font = `bold ${fontSize}px Roboto, sans-serif`;
      const padding = Math.max(12, Math.floor(Math.min(w, h) * 0.02));

      switch (pos) {
        case 'bottom-left':
          drawBottomLeft(ctx, text, w, h, fontSize, padding);
          break;
        case 'center':
          drawCenter(ctx, text, w, h, fontSize, padding);
          break;
        case 'diagonal':
          drawDiagonal(ctx, text, w, h, fontSize, padding);
          break;
        case 'bottom-right':
        default:
          drawBottomRight(ctx, text, w, h, fontSize, padding);
          break;
      }

      setDataUrl(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => setDataUrl(src);
    img.src = src;
  }, [src, shouldWatermark, text, pos]);

  return (
    <img
      src={dataUrl}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onClick={onClick}
    />
  );
}