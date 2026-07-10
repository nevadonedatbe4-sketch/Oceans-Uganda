import { Link } from 'react-router-dom';
import { Listing, statusColor } from '@/pages/admin/listings/types';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Props {
  listing: Listing;
  onTogglePublish: (id: string, currentStatus: string) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

function acreageLabel(l: Listing): string {
  if (l.land_area) return `${l.land_area} ${l.land_area_postfix || 'acres'}`;
  if (l.size_sqm) return `${l.size_sqm.toLocaleString()} sqm`;
  return '—';
}

export default function LandListingCard({ listing: l, onTogglePublish, onToggleFeatured }: Props) {
  const { formatAdminPrice } = useCurrency();
  const isJV = l.purpose === 'joint_venture';
  const isPublished = l.status === 'published';

  const askDisplay = isJV ? (l.jv_structure || 'JV structure') : formatAdminPrice(l.price, l.currency);

  return (
    <div className="bg-white border border-[#e8edf2] rounded-lg overflow-hidden flex flex-col">
      <div className="relative h-40 shrink-0">
        <img src={l.cover_image || FALLBACK_IMAGE} alt={l.title} className="w-full h-full object-cover" />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide ${isJV ? 'bg-[#D5A91C] text-[#0d1f2d]' : 'bg-[#0d1f2d] text-white'}`}>
            {isJV ? 'JV Opportunity' : 'For Sale'}
          </span>
          <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wide ${statusColor(l.status)}`}>
            {l.status === 'pending_review' ? 'Under Review' : l.status.replace('_', ' ')}
          </span>
        </div>
        {l.featured && (
          <span className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center bg-[#D5A91C] rounded-full">
            <i className="ri-star-fill text-[#0d1f2d] text-xs" />
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-bold text-[#0d1f2d] leading-snug line-clamp-1">{l.title}</h3>
        <p className="text-xs text-[#7a8a99] mt-1 flex items-center gap-1">
          <i className="ri-map-pin-2-line" />
          {[l.location, l.city].filter(Boolean).join(', ') || '—'}
        </p>

        <div className="h-px bg-[#f0f4f8] my-3" />

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-[10px] text-[#7a8a99] uppercase tracking-wide">Acreage</p>
            <p className="font-bold text-[#0d1f2d] mt-0.5">{acreageLabel(l)}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#7a8a99] uppercase tracking-wide">Title</p>
            <p className="font-bold text-[#0d1f2d] mt-0.5">{l.tenure || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#7a8a99] uppercase tracking-wide">Ask</p>
            <p className="font-bold text-[#D5A91C] mt-0.5 truncate">{askDisplay}</p>
          </div>
        </div>

        {l.short_description && (
          <p className="text-xs text-[#7a8a99] mt-3 line-clamp-2 leading-relaxed">{l.short_description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onTogglePublish(l.id, l.status)}
              className="flex items-center gap-1 text-xs font-semibold text-[#7a8a99] hover:text-[#0d1f2d] transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className={isPublished ? 'ri-eye-off-line' : 'ri-eye-line'} />
              {isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={() => onToggleFeatured(l.id, l.featured)}
              className="flex items-center gap-1 text-xs font-semibold text-[#7a8a99] hover:text-[#D5A91C] transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className={l.featured ? 'ri-star-fill' : 'ri-star-line'} />
              Feature
            </button>
          </div>
          <Link
            to={`/admin/listings/${l.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#0d1f2d] hover:text-[#D5A91C] transition-colors cursor-pointer whitespace-nowrap"
          >
            Edit <i className="ri-arrow-right-line" />
          </Link>
        </div>
      </div>
    </div>
  );
}
