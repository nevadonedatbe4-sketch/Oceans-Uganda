import { ListingFormData, ListingImage } from '@/pages/admin/listings/types';
import MediaUploader from '@/pages/admin/listings/components/MediaUploader';

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-[#0d1f2d] rounded-md">
          <i className={`${icon} text-white text-sm`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-jost text-[13px] font-semibold text-[#0d1f2d] uppercase tracking-[0.5px]">{title}</h4>
          {subtitle && <p className="text-[11px] text-[#7a8a99] mt-0.5 leading-snug">{subtitle}</p>}
        </div>
      </div>
      <div className="h-px bg-[#e5e7eb] mt-2.5" />
    </div>
  );
}

interface Props {
  data: ListingFormData;
  onChange: (field: keyof ListingFormData, value: string | string[]) => void;
  onImagesChange: (images: ListingImage[]) => void;
}

export default function StepMedia({ data, onImagesChange, onChange }: Props) {
  return (
    <div className="w-full space-y-10 md:space-y-12">

      {/* Header */}
      <section className="pb-2">
        <SectionTitle icon="ri-image-2-line" title="Photos &amp; Media" subtitle="Upload high-quality images · drag to reorder · star for cover" />
      </section>

      {/* Photo tips */}
      <section className="pb-2">
        <div className="border-l-2 border-[#0d5959] pl-5 py-1">
          <p className="text-xs font-medium text-[#0d1f2d] mb-2 uppercase tracking-widest">Photo tips</p>
          <ul className="text-xs text-[#7a8a99] space-y-1 font-light">
            <li>Upload multiple photos at once — drag &amp; drop or click to browse</li>
            <li>Drag thumbnails to reorder — the first image appears on property cards</li>
            <li>Click the <i className="ri-star-line text-[#0d5959]" /> star on any photo to set it as the cover image</li>
            <li>Recommended: at least 5 photos · landscape orientation · min 1200px wide</li>
          </ul>
        </div>
      </section>

      <MediaUploader
        images={data.images}
        onChange={onImagesChange}
        videoUrl={data.video_url ?? ''}
        onVideoUrlChange={(url) => onChange('video_url' as keyof ListingFormData, url)}
        floorPlanUrl={data.floor_plan_url ?? ''}
        onFloorPlanUrlChange={(url) => onChange('floor_plan_url' as keyof ListingFormData, url)}
      />
    </div>
  );
}
