import { useState } from 'react';
import type { NeighborhoodDraft, FaqItem, PracticalItem, SectionVisibility } from '../types';
import NbHeroUploader from './NbHeroUploader';
import NbGalleryUploader from './NbGalleryUploader';

interface Props {
  data: NeighborhoodDraft;
  onChange: (data: NeighborhoodDraft) => void;
  saving: boolean;
  onSave: () => void;
  isEdit: boolean;
}

type Tab = 'details' | 'content' | 'expat' | 'practical' | 'gallery' | 'faqs' | 'seo';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'details', label: 'Details', icon: 'ri-information-line' },
  { key: 'content', label: 'Content', icon: 'ri-file-text-line' },
  { key: 'expat', label: 'Expat Guide', icon: 'ri-global-line' },
  { key: 'practical', label: 'Practical Info', icon: 'ri-map-pin-2-line' },
  { key: 'gallery', label: 'Gallery', icon: 'ri-image-2-line' },
  { key: 'faqs', label: 'FAQs', icon: 'ri-question-answer-line' },
  { key: 'seo', label: 'SEO', icon: 'ri-search-line' },
];

/* ── Reusable field components ── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none"
    />
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
    />
  );
}

/* ── Practical list editor ── */
function PracticalListEditor({ label, items, onChange }: { label: string; items: PracticalItem[]; onChange: (items: PracticalItem[]) => void }) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  const add = () => {
    if (!name.trim()) return;
    onChange([...items, { name: name.trim(), note: note.trim() || undefined }]);
    setName('');
    setNote('');
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
      <div className="space-y-1.5 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-[#f5f5f5] rounded-md px-3 py-2">
            <i className="ri-map-pin-line text-[#1B4332] text-sm shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-stone-700 font-medium truncate">{item.name}</p>
              {item.note && <p className="text-xs text-stone-400 truncate">{item.note}</p>}
            </div>
            <button onClick={() => remove(i)} className="text-stone-300 hover:text-red-500 cursor-pointer shrink-0">
              <i className="ri-close-line" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-stone-400 italic">None added yet</p>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Name"
          className="flex-1 text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Note (optional)"
          className="flex-1 text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20"
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-[#1B4332]/10 text-[#1B4332] rounded-md text-sm font-medium hover:bg-[#1B4332]/20 cursor-pointer whitespace-nowrap"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ── FAQ editor ── */
function FaqEditor({ faqs, onChange }: { faqs: FaqItem[]; onChange: (faqs: FaqItem[]) => void }) {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const add = () => {
    if (!q.trim() || !a.trim()) return;
    if (editIdx !== null) {
      const updated = [...faqs];
      updated[editIdx] = { question: q.trim(), answer: a.trim() };
      onChange(updated);
      setEditIdx(null);
    } else {
      onChange([...faqs, { question: q.trim(), answer: a.trim() }]);
    }
    setQ('');
    setA('');
  };

  const edit = (i: number) => {
    setQ(faqs[i].question);
    setA(faqs[i].answer);
    setEditIdx(i);
  };

  const remove = (i: number) => {
    onChange(faqs.filter((_, idx) => idx !== i));
    if (editIdx === i) { setEditIdx(null); setQ(''); setA(''); }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-stone-200 rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-700 mb-1">{faq.question}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => edit(i)} className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-[#1B4332] cursor-pointer">
                  <i className="ri-pencil-line text-sm" />
                </button>
                <button onClick={() => remove(i)} className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-red-500 cursor-pointer">
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="text-center py-8 border border-dashed border-stone-200 rounded-lg">
            <i className="ri-question-answer-line text-2xl text-stone-300 block mb-2" />
            <p className="text-sm text-stone-400">No FAQs yet. Add some below.</p>
          </div>
        )}
      </div>

      <div className="border border-stone-200 rounded-lg p-4 bg-[#f5f5f5] space-y-3">
        <p className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
          {editIdx !== null ? 'Edit FAQ' : 'Add FAQ'}
        </p>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Question (e.g. Is Kololo safe for expats?)"
          className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 bg-white"
        />
        <textarea
          rows={3}
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Answer…"
          className="w-full text-sm border border-stone-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 resize-none bg-white"
        />
        <div className="flex gap-2">
          <button
            onClick={add}
            disabled={!q.trim() || !a.trim()}
            className="px-4 py-2 bg-[#1B4332] text-white rounded-md text-sm font-medium hover:bg-[#163828] disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {editIdx !== null ? 'Update FAQ' : 'Add FAQ'}
          </button>
          {editIdx !== null && (
            <button onClick={() => { setEditIdx(null); setQ(''); setA(''); }}
              className="px-4 py-2 border border-stone-200 text-stone-600 rounded-md text-sm hover:bg-stone-100 cursor-pointer whitespace-nowrap">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Section visibility toggle ── */
function VisibilityToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
      <span className="text-sm text-stone-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${checked ? 'bg-[#1B4332]' : 'bg-stone-300'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

/* ── Main form ── */
export default function NeighborhoodForm({ data, onChange, saving, onSave, isEdit }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [newHighlight, setNewHighlight] = useState('');
  const [newTag, setNewTag] = useState('');

  const set = (partial: Partial<NeighborhoodDraft>) => onChange({ ...data, ...partial });
  const setVis = (key: keyof SectionVisibility, val: boolean) =>
    set({ section_visibility: { ...data.section_visibility, [key]: val } });

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (name: string) => {
    set({ name, slug: isEdit ? data.slug : autoSlug(name) });
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    set({ highlights: [...data.highlights, newHighlight.trim()] });
    setNewHighlight('');
  };

  const removeHighlight = (i: number) => set({ highlights: data.highlights.filter((_, idx) => idx !== i) });

  const addTag = () => {
    if (!newTag.trim()) return;
    set({ lifestyle_tags: [...data.lifestyle_tags, newTag.trim()] });
    setNewTag('');
  };

  const removeTag = (i: number) => set({ lifestyle_tags: data.lifestyle_tags.filter((_, idx) => idx !== i) });

  const sv = data.section_visibility;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-0.5 overflow-x-auto scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === t.key
                ? 'border-[#1B4332] text-[#1B4332]'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <i className={t.icon} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── DETAILS TAB ── */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="lg:col-span-2">
            <Field label="Neighbourhood Name *">
              <Input value={data.name} onChange={handleNameChange} placeholder="e.g. Kololo" />
            </Field>
          </div>

          <Field label="URL Slug *">
            <div className="flex items-center border border-stone-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#1B4332]/20">
              <span className="px-3 py-2.5 bg-[#f5f5f5] text-stone-400 text-sm border-r border-stone-200 whitespace-nowrap">/neighbourhood/</span>
              <input
                type="text"
                value={data.slug}
                onChange={(e) => set({ slug: e.target.value })}
                className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </Field>

          <Field label="Sort Order">
            <Input type="number" value={String(data.sort_order)} onChange={(v) => set({ sort_order: Number(v) })} />
          </Field>

          <Field label="City">
            <Input value={data.city} onChange={(v) => set({ city: v })} />
          </Field>

          <Field label="Country">
            <Input value={data.country} onChange={(v) => set({ country: v })} />
          </Field>

          <Field label="Target Market" hint="e.g. Expats, Diplomats, Families">
            <Input value={data.target_market ?? ''} onChange={(v) => set({ target_market: v || null })} placeholder="e.g. Expats, Diplomats" />
          </Field>

          <Field label="Vibe / Character" hint="e.g. Quiet, Luxury, Central, Lakeside">
            <Input value={data.vibe ?? ''} onChange={(v) => set({ vibe: v || null })} placeholder="e.g. Quiet, Embassy Zone" />
          </Field>

          <Field label="Average Sale Price" hint="e.g. $200K – $800K">
            <Input value={data.avg_sale_price ?? ''} onChange={(v) => set({ avg_sale_price: v || null })} placeholder="$200K – $800K" />
          </Field>

          <Field label="Rental Range (USD/mo)" hint="e.g. $1,500 – $4,000/mo">
            <Input value={data.rental_range_usd ?? ''} onChange={(v) => set({ rental_range_usd: v || null })} placeholder="$1,500 – $4,000/mo" />
          </Field>

          <Field label="Rental Range (UGX/mo)" hint="e.g. UGX 5M – 15M/mo">
            <Input value={data.rental_range_ugx ?? ''} onChange={(v) => set({ rental_range_ugx: v || null })} placeholder="UGX 5M – 15M/mo" />
          </Field>

          <div className="lg:col-span-2">
            <NbHeroUploader value={data.hero_image} onChange={(url) => set({ hero_image: url })} />
          </div>

          {/* Toggles */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-lg border border-stone-200">
              <div>
                <p className="text-sm font-medium text-stone-700">Featured on Homepage</p>
                <p className="text-xs text-stone-400 mt-0.5">Show in homepage neighbourhoods section</p>
              </div>
              <button onClick={() => set({ featured: !data.featured })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${data.featured ? 'bg-[#1B4332]' : 'bg-stone-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.featured ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#f5f5f5] rounded-lg border border-stone-200">
              <div>
                <p className="text-sm font-medium text-stone-700">Published</p>
                <p className="text-xs text-stone-400 mt-0.5">Visible on the public website</p>
              </div>
              <button onClick={() => set({ published: !data.published })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${data.published ? 'bg-[#1B4332]' : 'bg-stone-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${data.published ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Section visibility */}
          <div className="lg:col-span-2 border border-stone-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-stone-700 mb-3">Section Visibility</p>
            <VisibilityToggle label="Why Live Here section" checked={sv.why_live_here !== false} onChange={(v) => setVis('why_live_here', v)} />
            <VisibilityToggle label="Expat Appeal section" checked={sv.expat_appeal !== false} onChange={(v) => setVis('expat_appeal', v)} />
            <VisibilityToggle label="Lifestyle section" checked={sv.lifestyle !== false} onChange={(v) => setVis('lifestyle', v)} />
            <VisibilityToggle label="Practical Living section" checked={sv.practical !== false} onChange={(v) => setVis('practical', v)} />
            <VisibilityToggle label="Photo Gallery" checked={sv.gallery !== false} onChange={(v) => setVis('gallery', v)} />
            <VisibilityToggle label="FAQ section" checked={sv.faqs !== false} onChange={(v) => setVis('faqs', v)} />
            <VisibilityToggle label="Map embed" checked={sv.map !== false} onChange={(v) => setVis('map', v)} />
          </div>
        </div>
      )}

      {/* ── CONTENT TAB ── */}
      {activeTab === 'content' && (
        <div className="space-y-5">
          <Field label="Short Intro" hint="Shown on listing cards and neighbourhood overview (1–2 sentences)">
            <Textarea rows={3} value={data.short_intro ?? ''} onChange={(v) => set({ short_intro: v || null })}
              placeholder="Brief description shown on cards…" />
          </Field>

          <Field label="Overview / About the Area" hint="Long-form blog-style content. Write for expats relocating to Kampala.">
            <Textarea rows={10} value={data.long_description ?? ''} onChange={(v) => set({ long_description: v || null })}
              placeholder="Write a detailed, helpful overview of this neighbourhood. Include history, character, what makes it special, who lives here, and what daily life is like…" />
          </Field>

          <Field label="Cost of Living" hint="General cost of living notes">
            <Textarea rows={3} value={data.cost_of_living ?? ''} onChange={(v) => set({ cost_of_living: v || null })}
              placeholder="e.g. Kololo is one of Kampala's most expensive areas. Expect to pay premium prices for groceries, dining, and services compared to other parts of the city…" />
          </Field>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Key Highlights</label>
            <div className="space-y-2 mb-3">
              {data.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#f5f5f5] rounded-md px-3 py-2">
                  <i className="ri-check-line text-[#1B4332] text-sm" />
                  <span className="flex-1 text-sm text-stone-700">{h}</span>
                  <button onClick={() => removeHighlight(i)} className="text-stone-400 hover:text-red-500 cursor-pointer">
                    <i className="ri-close-line" />
                  </button>
                </div>
              ))}
              {data.highlights.length === 0 && <p className="text-xs text-stone-400 italic">No highlights yet</p>}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder="e.g. Home to most foreign embassies"
                className="flex-1 text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20" />
              <button onClick={addHighlight}
                className="px-4 py-2 bg-[#1B4332]/10 text-[#1B4332] rounded-md text-sm font-medium hover:bg-[#1B4332]/20 cursor-pointer whitespace-nowrap">
                Add
              </button>
            </div>
          </div>

          {/* Lifestyle tags */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Lifestyle Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {data.lifestyle_tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-medium">
                  {tag}
                  <button onClick={() => removeTag(i)} className="text-stone-400 hover:text-red-500 cursor-pointer ml-0.5">
                    <i className="ri-close-line text-xs" />
                  </button>
                </span>
              ))}
              {data.lifestyle_tags.length === 0 && <span className="text-xs text-stone-400">No tags yet</span>}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="e.g. Expat-friendly, Quiet, Embassy Zone…"
                className="flex-1 text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20" />
              <button onClick={addTag}
                className="px-4 py-2 bg-[#1B4332]/10 text-[#1B4332] rounded-md text-sm font-medium hover:bg-[#1B4332]/20 cursor-pointer whitespace-nowrap">
                Add Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPAT GUIDE TAB ── */}
      {activeTab === 'expat' && (
        <div className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <i className="ri-lightbulb-line text-amber-500 text-lg shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              This content is specifically written for expats relocating to Kampala. Be specific, helpful, and honest. 
              Mention real advantages, real challenges, and what daily life actually looks like.
            </p>
          </div>

          <Field label="Why Expats Choose This Area" hint="Bullet-style advantages. Be specific and honest.">
            <Textarea rows={8} value={data.why_live_here ?? ''} onChange={(v) => set({ why_live_here: v || null })}
              placeholder="Write why expats specifically choose this neighbourhood. Include:&#10;- Security and safety&#10;- Proximity to embassies / NGOs&#10;- International schools nearby&#10;- Expat community presence&#10;- Quality of infrastructure&#10;- Walkability / commute&#10;- Social life and dining options" />
          </Field>

          <Field label="Expat Appeal" hint="What makes this area specifically attractive to the international community">
            <Textarea rows={6} value={data.expat_appeal ?? ''} onChange={(v) => set({ expat_appeal: v || null })}
              placeholder="Describe the expat community, international schools, embassies, NGO offices, and why this area has become a hub for the international community in Kampala…" />
          </Field>

          <Field label="Lifestyle Description" hint="Restaurants, cafes, gyms, social life, weekend activities">
            <Textarea rows={6} value={data.lifestyle_desc ?? ''} onChange={(v) => set({ lifestyle_desc: v || null })}
              placeholder="Describe the lifestyle: where people eat, drink, socialise. Mention specific restaurants, cafes, gyms, clubs, and weekend activities available in or near this area…" />
          </Field>

          <Field label="Safety & Security Notes" hint="Honest assessment of safety for expats">
            <Textarea rows={4} value={data.safety_notes ?? ''} onChange={(v) => set({ safety_notes: v || null })}
              placeholder="Honest safety assessment. Mention security guards, gated communities, crime levels compared to other areas, and any precautions expats typically take…" />
          </Field>
        </div>
      )}

      {/* ── PRACTICAL INFO TAB ── */}
      {activeTab === 'practical' && (
        <div className="space-y-6">
          <PracticalListEditor
            label="International Schools Nearby"
            items={data.practical_schools}
            onChange={(items) => set({ practical_schools: items })}
          />
          <PracticalListEditor
            label="Hospitals & Clinics"
            items={data.practical_hospitals}
            onChange={(items) => set({ practical_hospitals: items })}
          />
          <PracticalListEditor
            label="Embassies & NGOs Nearby"
            items={data.practical_embassies}
            onChange={(items) => set({ practical_embassies: items })}
          />
          <PracticalListEditor
            label="Restaurants & Cafes"
            items={data.practical_restaurants}
            onChange={(items) => set({ practical_restaurants: items })}
          />

          <Field label="Traffic & Commute Notes" hint="Honest commute times and traffic patterns">
            <Textarea rows={4} value={data.commute_notes ?? ''} onChange={(v) => set({ commute_notes: v || null })}
              placeholder="Describe commute times to CBD, traffic patterns, best times to travel, and any transport options available…" />
          </Field>

          <Field label="Google Maps Embed URL" hint="Paste the embed URL from Google Maps (Share → Embed a map → copy src URL)">
            <Input value={data.map_embed ?? ''} onChange={(v) => set({ map_embed: v || null })}
              placeholder="https://www.google.com/maps/embed?pb=…" />
          </Field>
        </div>
      )}

      {/* ── GALLERY TAB ── */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="bg-[#f5f5f5] border border-stone-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <i className="ri-image-2-line text-stone-400 text-lg shrink-0 mt-0.5" />
            <p className="text-xs text-stone-500 leading-relaxed">
              Upload multiple photos of the neighbourhood — streets, landmarks, lifestyle shots. 
              The first image becomes the gallery cover. Use arrows to reorder.
            </p>
          </div>
          <NbGalleryUploader
            images={data.image_gallery}
            onChange={(imgs) => set({ image_gallery: imgs })}
          />
        </div>
      )}

      {/* ── FAQS TAB ── */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="bg-[#f5f5f5] border border-stone-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <i className="ri-google-line text-stone-400 text-lg shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-stone-600 mb-1">SEO Tip: FAQs boost Google rankings</p>
              <p className="text-xs text-stone-500 leading-relaxed">
                FAQs are indexed by Google as rich results. Write questions that expats actually search for, like 
                "Is Kololo safe?", "What is rent in Nakasero?", "Best areas for diplomats in Kampala?"
              </p>
            </div>
          </div>
          <FaqEditor faqs={data.faqs} onChange={(faqs) => set({ faqs })} />
        </div>
      )}

      {/* ── SEO TAB ── */}
      {activeTab === 'seo' && (
        <div className="space-y-5">
          <Field label="SEO Title" hint={`${(data.seo_title ?? '').length}/60 characters`}>
            <Input value={data.seo_title ?? ''} onChange={(v) => set({ seo_title: v || null })}
              placeholder={`${data.name} Neighbourhood Guide — Kampala Real Estate | Oceans Uganda`} />
          </Field>

          <Field label="SEO Description" hint={`${(data.seo_description ?? '').length}/160 characters`}>
            <Textarea rows={4} value={data.seo_description ?? ''} onChange={(v) => set({ seo_description: v || null })}
              placeholder="Discover life in [Neighbourhood], Kampala. Expat guide covering rent prices, schools, safety, lifestyle and available properties…" />
          </Field>

          <Field label="Keywords" hint="Comma-separated. 3–5 core keywords.">
            <Input value={data.meta_keywords ?? ''} onChange={(v) => set({ meta_keywords: v || null })}
              placeholder="e.g. Kololo Kampala, expat housing Kampala, luxury apartments Kololo" />
          </Field>

          {(data.seo_title || data.seo_description) && (
            <div className="border border-stone-200 rounded-lg p-4 bg-white">
              <p className="text-xs text-stone-400 mb-2 font-medium uppercase tracking-wider">Google Preview</p>
              <p className="text-[#1a0dab] text-base font-medium leading-snug">
                {data.seo_title || `${data.name} — Oceans Uganda`}
              </p>
              <p className="text-[#006621] text-xs mt-0.5">
                oceansuganda.com/neighbourhood/{data.slug}
              </p>
              <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                {data.seo_description || data.short_intro || 'No description set.'}
              </p>
            </div>
          )}

          <div className="border border-stone-200 rounded-lg p-4 bg-[#f5f5f5]">
            <p className="text-xs font-semibold text-stone-600 mb-3 uppercase tracking-wider">Internal Linking</p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Each neighbourhood page automatically links to related neighbourhoods at the bottom of the page, 
              creating an internal linking network that boosts SEO authority across all neighbourhood pages.
            </p>
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end pt-2 border-t border-stone-100">
        <button
          onClick={onSave}
          disabled={saving || !data.name}
          className="px-6 py-2.5 bg-[#1B4332] text-white rounded-md text-sm font-semibold hover:bg-[#163828] disabled:opacity-60 cursor-pointer whitespace-nowrap"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Neighbourhood'}
        </button>
      </div>
    </div>
  );
}
