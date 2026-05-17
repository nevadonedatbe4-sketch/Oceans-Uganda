import { BedDouble, Car } from "lucide-react";
import BathIcon from "./BathIcon";
import type { CSSProperties } from "react";

interface PropertyMetaProps {
  beds?: number | null;
  baths?: number | null;
  parking?: number | null;
  iconSize?: number;
  strokeWidth?: number;
  textSize?: string;          // e.g. "text-xs", "text-sm", "text-[11px]"
  textColor?: string;         // e.g. "#888" or "#6b7280"
  iconColor?: string;         // e.g. "#9ca3af"
  gap?: string;               // e.g. "gap-3", "gap-4"
  innerGap?: string;          // e.g. "gap-1", "gap-1.5"
  pluralize?: boolean;        // "Beds" / "Baths" / "Parkings"
  abbreviate?: boolean;       // "bd" / "ba" / "pk"
  showIfZero?: boolean;       // render even if value is 0
  className?: string;
  itemClassName?: string;
  style?: CSSProperties;      // container inline styles (font-size etc.)
}

export default function PropertyMeta({
  beds,
  baths,
  parking,
  iconSize = 14,
  strokeWidth = 1.5,
  textSize = "text-xs",
  textColor = "#888",
  iconColor = "#9ca3af",
  gap = "gap-3",
  innerGap = "gap-1",
  pluralize = false,
  abbreviate = false,
  showIfZero = false,
  className = "",
  itemClassName = "",
  style,
}: PropertyMetaProps) {
  const shouldShow = (val: number | null | undefined) =>
    val != null && (showIfZero || val > 0);

  const bedLabel = abbreviate
    ? "bd"
    : pluralize
    ? `Bed${beds !== 1 ? "s" : ""}`
    : "Bed";
  const bathLabel = abbreviate
    ? "ba"
    : pluralize
    ? `Bath${baths !== 1 ? "s" : ""}`
    : "Bath";
  const parkingLabel = abbreviate ? "pk" : "Parking";

  return (
    <div
      className={`flex items-center ${gap} ${textSize} whitespace-nowrap ${className}`}
      style={{ color: textColor, ...style }}
    >
      {shouldShow(beds) && (
        <span className={`flex items-center ${innerGap} ${itemClassName}`}>
          <BedDouble size={iconSize} strokeWidth={strokeWidth} color={iconColor} />
          <span>
            {beds} {bedLabel}
          </span>
        </span>
      )}
      {shouldShow(baths) && (
        <span className={`flex items-center ${innerGap} ${itemClassName}`}>
          <BathIcon size={iconSize} />
          <span>
            {baths} {bathLabel}
          </span>
        </span>
      )}
      {shouldShow(parking) && (
        <span className={`flex items-center ${innerGap} ${itemClassName}`}>
          <Car size={iconSize} strokeWidth={strokeWidth} color={iconColor} />
          <span>
            {parking} {parkingLabel}
          </span>
        </span>
      )}
    </div>
  );
}