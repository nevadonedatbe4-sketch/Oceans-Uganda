import { ListingFormData } from '@/pages/admin/listings/types';

interface Props {
  data: ListingFormData;
  onChange: (field: keyof ListingFormData, value: string) => void;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0d1f2d] mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#7a8a99] mt-1">{hint}</p>}
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-[#0d1f2d] rounded-md">
          <i className={`${icon} text-white text-sm`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-jost text-[13px] font-semibold text-[#0d1f2d] uppercase tracking-[0.5px]">{title}</h4>
        </div>
      </div>
      <div className="h-px bg-[#e5e7eb] mt-2.5" />
    </div>
  );
}

const textareaClass =
  'w-full text-sm font-medium border-2 border-[#e8edf2] px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal';

export default function DescriptionTab({ data, onChange }: Props) {
  return (
    <div className="space-y-10 md:space-y-12">
      <section className="pb-2">
        <SectionHeader title="Description" icon="ri-align-left" />
        <div className="space-y-5">
          <Field label="Short Description" hint="Shown on listing cards and search results. Keep it to 1–2 sentences.">
            <textarea
              value={data.short_description}
              onChange={(e) => onChange('short_description', e.target.value)}
              rows={3}
              placeholder="A concise teaser that highlights the best features of this property…"
              className={`${textareaClass} resize-none`}
              maxLength={300}
            />
            <p className="text-xs text-[#7a8a99] mt-1 text-right">{data.short_description.length}/300</p>
          </Field>

          <Field label="Full Description" hint="Shown on the property detail page. Describe everything — layout, views, finishes, building amenities, transport links.">
            <textarea
              value={data.full_description}
              onChange={(e) => onChange('full_description', e.target.value)}
              rows={12}
              placeholder="Welcome to this stunning property nestled in the heart of…&#10;&#10;The open-plan living area flows seamlessly into…&#10;&#10;Key highlights include…"
              className={`${textareaClass} resize-y`}
              maxLength={5000}
            />
            <p className="text-xs text-[#7a8a99] mt-1 text-right">{data.full_description.length}/5000</p>
          </Field>
        </div>
      </section>
    </div>
  );
}