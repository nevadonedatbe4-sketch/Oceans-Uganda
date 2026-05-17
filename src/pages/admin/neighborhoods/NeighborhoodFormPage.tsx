import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { NeighborhoodDraft } from './types';
import { EMPTY_NEIGHBORHOOD } from './types';
import NeighborhoodForm from './components/NeighborhoodForm';

export default function NeighborhoodFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [data, setData] = useState<NeighborhoodDraft>(EMPTY_NEIGHBORHOOD);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      const { data: row } = await supabase
        .from('neighborhoods')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (row) {
        setData({
          name: row.name ?? '',
          slug: row.slug ?? '',
          city: row.city ?? 'Kampala',
          country: row.country ?? 'Uganda',
          hero_image: row.hero_image ?? null,
          short_intro: row.short_intro ?? null,
          long_description: row.long_description ?? null,
          why_live_here: row.why_live_here ?? null,
          expat_appeal: row.expat_appeal ?? null,
          lifestyle_desc: row.lifestyle_desc ?? null,
          safety_notes: row.safety_notes ?? null,
          cost_of_living: row.cost_of_living ?? null,
          rental_range_ugx: row.rental_range_ugx ?? null,
          rental_range_usd: row.rental_range_usd ?? null,
          avg_sale_price: row.avg_sale_price ?? null,
          target_market: row.target_market ?? null,
          vibe: row.vibe ?? null,
          map_embed: row.map_embed ?? null,
          image_gallery: (row.image_gallery as string[]) ?? [],
          practical_schools: (row.practical_schools as { name: string; note?: string }[]) ?? [],
          practical_hospitals: (row.practical_hospitals as { name: string; note?: string }[]) ?? [],
          practical_embassies: (row.practical_embassies as { name: string; note?: string }[]) ?? [],
          practical_restaurants: (row.practical_restaurants as { name: string; note?: string }[]) ?? [],
          commute_notes: row.commute_notes ?? null,
          faqs: (row.faqs as { question: string; answer: string }[]) ?? [],
          highlights: (row.highlights as string[]) ?? [],
          lifestyle_tags: (row.lifestyle_tags as string[]) ?? [],
          featured: row.featured ?? false,
          published: row.published ?? true,
          sort_order: row.sort_order ?? 0,
          seo_title: row.seo_title ?? null,
          seo_description: row.seo_description ?? null,
          meta_keywords: row.meta_keywords ?? null,
          section_visibility: (row.section_visibility as Record<string, boolean>) ?? {},
        });
      }
      setLoading(false);
    };
    load();
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!data.name) return;
    setSaving(true);
    setError(null);

    const payload = {
      name: data.name,
      slug: data.slug,
      city: data.city,
      country: data.country,
      hero_image: data.hero_image || null,
      short_intro: data.short_intro || null,
      long_description: data.long_description || null,
      why_live_here: data.why_live_here || null,
      expat_appeal: data.expat_appeal || null,
      lifestyle_desc: data.lifestyle_desc || null,
      safety_notes: data.safety_notes || null,
      cost_of_living: data.cost_of_living || null,
      rental_range_ugx: data.rental_range_ugx || null,
      rental_range_usd: data.rental_range_usd || null,
      avg_sale_price: data.avg_sale_price || null,
      target_market: data.target_market || null,
      vibe: data.vibe || null,
      map_embed: data.map_embed || null,
      image_gallery: data.image_gallery,
      practical_schools: data.practical_schools,
      practical_hospitals: data.practical_hospitals,
      practical_embassies: data.practical_embassies,
      practical_restaurants: data.practical_restaurants,
      commute_notes: data.commute_notes || null,
      faqs: data.faqs,
      highlights: data.highlights,
      lifestyle_tags: data.lifestyle_tags,
      featured: data.featured,
      published: data.published,
      sort_order: data.sort_order,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      meta_keywords: data.meta_keywords || null,
      section_visibility: data.section_visibility,
    };

    const { error: err } = isEdit
      ? await supabase.from('neighborhoods').update(payload).eq('id', id)
      : await supabase.from('neighborhoods').insert(payload);

    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      navigate('/admin/neighborhoods');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1100px] space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/neighborhoods"
          className="w-8 h-8 flex items-center justify-center rounded-md border border-stone-200 text-stone-500 hover:bg-[#f5f5f5] cursor-pointer"
        >
          <i className="ri-arrow-left-line" />
        </Link>
        <div>
          <h1 className="text-xl font-jost font-bold text-stone-800">
            {isEdit ? `Edit: ${data.name || 'Neighbourhood'}` : 'Add Neighbourhood'}
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {isEdit ? 'Update content, SEO, gallery, FAQs and practical info' : 'Create a new neighbourhood area page'}
          </p>
        </div>
        {isEdit && (
          <a
            href={`/neighbourhood/${data.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 text-stone-500 rounded-md text-xs hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap"
          >
            <i className="ri-external-link-line" /> Preview
          </a>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
          <i className="ri-error-warning-line" /> {error}
        </div>
      )}

      <NeighborhoodForm
        data={data}
        onChange={setData}
        saving={saving}
        onSave={handleSave}
        isEdit={isEdit}
      />
    </div>
  );
}
