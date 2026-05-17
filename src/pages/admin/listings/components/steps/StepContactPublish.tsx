import { ListingFormData, AgentOption } from '@/pages/admin/listings/types';

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center shrink-0 bg-[#151515] rounded-md">
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

function Field({ label, children, hint }: { label?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-[#0d1f2d] mb-2">{label}</label>}
      {children}
      {hint && <p className="text-xs text-[#7a8a99] mt-1.5">{hint}</p>}
    </div>
  );
}

const selectClass = 'w-full text-sm font-medium border-2 border-[#e8edf2] rounded-lg px-4 py-3 text-[#0d1f2d] outline-none focus:border-[#0d5959] focus:ring-4 focus:ring-[#0d5959]/10 transition-all bg-white placeholder:text-[#b0bec5] placeholder:font-normal cursor-pointer';

interface StepContactPublishProps {
  data: ListingFormData;
  agents: AgentOption[];
  onChange: (field: keyof ListingFormData, value: string | boolean | string[]) => void;
  onSaveSection: () => void;
  savingSection: boolean;
  isEdit: boolean;
}

export default function StepContactPublish({ data, agents, onChange, onSaveSection, savingSection, isEdit }: StepContactPublishProps) {
  return (
    <div className="w-full space-y-10 md:space-y-12">

      {/* Agent Assignment */}
      <section className="pb-2">
        <SectionTitle icon="ri-user-star-line" title="Agent Assignment" subtitle="Assign an agent to handle inquiries" />
        <Field hint="The assigned agent will be shown on the property detail page">
          <select value={data.agent_id} onChange={(e) => onChange('agent_id', e.target.value)} className={selectClass}>
            <option value="">No agent assigned</option>
            {agents.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
          </select>
        </Field>
      </section>

      {/* Featured Toggle */}
      <section className="pb-2">
        <SectionTitle icon="ri-star-line" title="Featured Property" subtitle="Mark this listing to appear in featured sections" />
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className={`w-11 h-6 flex items-center rounded-full transition-colors px-0.5 ${data.featured ? 'bg-[#D5A91C]' : 'bg-[#e8edf2]'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${data.featured ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0d1f2d]">{data.featured ? 'Featured' : 'Not Featured'}</p>
            <p className="text-xs text-[#7a8a99]">{data.featured ? 'This property will appear in featured sections on the homepage and search.' : 'Toggle on to feature this property across the site.'}</p>
          </div>
          <input type="checkbox" checked={data.featured} onChange={(e) => onChange('featured', e.target.checked)} className="sr-only" />
        </label>
      </section>

      {/* Preview + Save row */}
      {isEdit && (
        <section className="pb-2">
          <SectionTitle icon="ri-eye-line" title="Preview on Site" subtitle="See how this listing looks to the public" />
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/property/${data.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-[#0d1f2d] text-white text-sm font-medium rounded-lg hover:bg-[#1a3347] transition-colors whitespace-nowrap"
            >
              <i className="ri-external-link-line" />
              Preview on Site
            </a>
            <button
              type="button"
              onClick={onSaveSection}
              disabled={savingSection}
              className="flex items-center gap-2 px-5 py-3 border-2 border-[#0d5959] text-[#0d5959] text-sm font-medium rounded-lg hover:bg-[#0d5959] hover:text-white transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
            >
              {savingSection ? (
                <>
                  <i className="ri-loader-4-line animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <i className="ri-save-line" />
                  Save This Section
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* Property Summary */}
      <section className="pb-2">
        <div className="bg-[#001731] border-l-2 border-[#d3bb6e] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <i className="ri-file-list-line text-[#d3bb6e]" />
            <p className="text-sm font-semibold text-[#d3bb6e] uppercase tracking-wide">Property Summary</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: 'Title', value: data.title || '—' },
              { label: 'Type', value: data.property_type || '—' },
              { label: 'Location', value: data.location || '—' },
              { label: 'Price', value: data.price ? `${data.currency} ${Number(data.price).toLocaleString()}` : '—' },
              { label: 'Bedrooms', value: data.bedrooms || '0' },
              { label: 'Bathrooms', value: data.bathrooms || '0' },
              { label: 'Featured', value: data.featured ? 'Yes' : 'No' },
            ].map(({ label, value }) => (
              <div key={label}>
                <span className="text-xs font-bold text-[#d3bb6e]/70 uppercase tracking-wide">{label}</span>
                <p className="text-sm font-semibold text-white mt-1 truncate">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-[#d3bb6e]/20 flex items-center gap-3 flex-wrap">
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${data.images.length > 0 ? 'bg-[#d3bb6e]/15 text-[#d3bb6e]' : 'bg-red-500/10 text-red-300'}`}>
              <i className="ri-image-line" />
              {data.images.length > 0 ? `${data.images.length} photo${data.images.length > 1 ? 's' : ''}` : 'No photos yet'}
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${data.amenities.length > 0 ? 'bg-[#d3bb6e]/15 text-[#d3bb6e]' : 'bg-white/10 text-white/40'}`}>
              <i className="ri-list-check" />
              {data.amenities.length} amenities
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${data.featured ? 'bg-[#d3bb6e]/15 text-[#d3bb6e]' : 'bg-white/10 text-white/40'}`}>
              <i className={data.featured ? 'ri-star-fill' : 'ri-star-line'} />
              {data.featured ? 'Featured' : 'Not Featured'}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}