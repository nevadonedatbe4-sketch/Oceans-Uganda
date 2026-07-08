import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  ListingFormData, ListingImage, AgentOption, NeighborhoodOption,
  INIT_FORM, generateSlug, CardDisplaySettings, DEFAULT_CARD_DISPLAY,
} from '@/pages/admin/listings/types';
import ListingForm from '@/pages/admin/listings/components/ListingForm';

/* ── Debounce hook ─────────────────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

/* ── Build DB payload from form data ───────────────────────────────────── */
function buildPropertyPayload(data: ListingFormData): Record<string, unknown> {
  const slug = data.slug.trim() || generateSlug(data.title);
  const coverImg = data.images.find((img) => img.is_cover) ?? data.images[0];
  const coverImageUrl = coverImg?.url ?? data.cover_image ?? null;

  return {
    title: data.title.trim() || 'Untitled Draft',
    slug,
    property_type: data.property_type || null,
    purpose: data.purpose,
    price: data.price ? parseFloat(data.price) : null,
    currency: data.currency,
    price_note: data.price_note || null,
    price_frequency: data.price_frequency || null,
    secondary_price: data.secondary_price ? parseFloat(data.secondary_price) : null,
    secondary_price_label: data.secondary_price_label || null,
    price_negotiable: data.price_negotiable ?? true,
    location: data.location || null,
    city: data.city || 'Kampala',
    country: data.country || 'Uganda',
    neighborhood_id: data.neighborhood_id || null,
    address: data.address || null,
    bedrooms: parseInt(data.bedrooms) || 0,
    bathrooms: parseInt(data.bathrooms) || 0,
    parking: parseInt(data.parking) || 0,
    size_sqm: data.size_sqm ? parseFloat(data.size_sqm) : null,
    property_size_postfix: data.property_size_postfix || null,
    land_area: data.land_area ? parseFloat(data.land_area) : null,
    land_area_postfix: data.land_area_postfix || null,
    year_built: data.year_built ? parseInt(data.year_built) : null,
    furnished: data.furnished,
    featured: data.featured,
    listing_status: data.listing_status ?? [],
    short_description: data.short_description || null,
    full_description: data.full_description || null,
    cover_image: coverImageUrl,
    gallery: data.images.map((img) => img.url),
    agent_id: data.agent_id || null,
    listing_date: data.listing_date || new Date().toISOString().split('T')[0],
    seo_title: data.seo_title || null,
    seo_description: data.seo_description || null,
    video_url: data.video_url || null,
    floor_plan_url: data.floor_plan_url || null,
    updated_at: new Date().toISOString(),
    has_backup_power: data.has_backup_power ?? false,
    backup_power: data.backup_power || null,
    gated_community: data.gated_community ?? false,
    staff_quarters_count: parseInt(data.staff_quarters_count || '0') || 0,
    swimming_pool: data.swimming_pool ?? false,
    gym: data.gym ?? false,
    proximity_to_amenities: data.proximity_to_amenities || null,
    unique_features: data.unique_features || null,
    status: data.status || 'draft',
    published: data.published ?? false,
  };
}

/* ── Generate unique draft slug ───────────────────────────────────────── */
function generateDraftSlug(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `draft-${ts}-${rand}`;
}

export default function ListingFormPage() {
  const { id: routeId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  /* ── Mode detection ────────────────────────────────────────────────────
     isEdit = user opened an EXISTING listing via /admin/listings/:id
     isNew  = user clicked "Add Property" → /admin/listings/new
     When a draft is created mid-session we store a session flag so
     refreshes still treat it as "new" mode, not edit mode.           */
  const [draftId, setDraftId] = useState<string | null>(routeId ?? null);
  const isNewSession = useRef(!routeId || sessionStorage.getItem(`listing-draft-${routeId}`) === 'true');
  const isEdit = Boolean(routeId) && !isNewSession.current;

  const [formData, setFormData] = useState<ListingFormData>(INIT_FORM);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const hasUnsavedChangesRef = useRef(false);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Load dropdowns (always) ───────────────────────────────────────── */
  useEffect(() => {
    const loadDropdowns = async () => {
      const [agentsRes, nbRes] = await Promise.all([
        supabase.from('agents').select('id, full_name').eq('active', true).order('display_order'),
        supabase.from('neighborhoods').select('id, name').order('name'),
      ]);
      if (agentsRes.data) setAgents(agentsRes.data);
      if (nbRes.data) setNeighborhoods(nbRes.data);
    };
    loadDropdowns();
  }, []);

  /* ── NEW mode: create blank draft immediately ────────────────────────── */
  useEffect(() => {
    if (isEdit || draftId) {
      setLoading(false);
      return;
    }

    const createDraft = async () => {
      setLoading(true);
      setDraftError(null);

      const draftSlug = generateDraftSlug();

      const { data, error } = await supabase
        .from('listings')
        .insert([{
          title: 'Untitled Draft',
          slug: draftSlug,
          status: 'draft',
          published: false,
          property_type: 'Apartment',
          purpose: 'sale',
          bedrooms: 0,
          bathrooms: 0,
          parking: 0,
          currency: 'USD',
          listing_status: ['for_sale'],
          listing_date: new Date().toISOString().split('T')[0],
        }])
        .select('id')
        .maybeSingle();

      if (error || !data) {
        const errMsg = error?.message || 'Unknown database error';
        setDraftError(errMsg);
        showToast('error', `Failed to create draft: ${errMsg}`);
        setLoading(false);
        return;
      }

      setDraftId(data.id);
      sessionStorage.setItem(`listing-draft-${data.id}`, 'true');
      window.history.replaceState(null, '', `/admin/listings/${data.id}`);
      setLoading(false);
    };

    createDraft();
  }, [isEdit, draftId]);

  /* ── Load existing data (edit OR resume draft) ──────────────────────── */
  useEffect(() => {
    const id = routeId ?? draftId;
    if (!id) return;

    const loadProperty = async () => {
      setLoading(true);
      const [listingRes, imagesRes, amenitiesRes] = await Promise.all([
        supabase.from('listings').select('*').eq('id', id).maybeSingle(),
        supabase.from('listing_images').select('*').eq('listing_id', id).order('sort_order'),
        supabase.from('listing_amenities').select('*').eq('listing_id', id),
      ]);

      if (!listingRes.data) {
        showToast('error', 'Property not found');
        navigate('/admin/listings');
        return;
      }

      const l = listingRes.data;
      const loadedImages: ListingImage[] = (imagesRes.data ?? []).map(
        (img: { id: string; url: string; sort_order: number; is_cover: boolean }) => ({
          id: img.id,
          url: img.url,
          sort_order: img.sort_order,
          is_cover: img.is_cover ?? false,
        })
      );

      if (loadedImages.length > 0 && !loadedImages.some((img) => img.is_cover)) {
        loadedImages[0].is_cover = true;
      }

      setFormData({
        title: l.title ?? '',
        slug: l.slug ?? '',
        property_type: l.property_type ?? 'Apartment',
        purpose: l.purpose ?? 'sale',
        price: l.price != null ? String(l.price) : '',
        currency: l.currency ?? 'USD',
        price_note: l.price_note ?? '',
        price_frequency: l.price_frequency ?? '',
        secondary_price: l.secondary_price != null ? String(l.secondary_price) : '',
        secondary_price_label: l.secondary_price_label ?? '',
        price_negotiable: l.price_negotiable ?? true,
        location: l.location ?? '',
        city: l.city || 'Kampala',
        country: l.country || 'Uganda',
        neighborhood_id: l.neighborhood_id ?? '',
        address: l.address ?? '',
        bedrooms: String(l.bedrooms ?? 0),
        bathrooms: String(l.bathrooms ?? 0),
        parking: String(l.parking ?? 0),
        size_sqm: l.size_sqm != null ? String(l.size_sqm) : '',
        property_size_postfix: l.property_size_postfix ?? 'sqm',
        land_area: l.land_area != null ? String(l.land_area) : '',
        land_area_postfix: l.land_area_postfix ?? 'sqm',
        year_built: l.year_built != null ? String(l.year_built) : '',
        furnished: l.furnished ?? false,
        featured: l.featured ?? false,
        listing_status: l.listing_status ?? [],
        status: l.status ?? 'draft',
        published: l.status === 'published',
        display_order: l.display_order != null ? String(l.display_order) : '',
        short_description: l.short_description ?? '',
        full_description: l.full_description ?? '',
        cover_image: l.cover_image ?? '',
        gallery: Array.isArray(l.gallery) ? l.gallery : [],
        agent_id: l.agent_id ?? '',
        listing_date: l.listing_date ?? new Date().toISOString().split('T')[0],
        seo_title: l.seo_title ?? '',
        seo_description: l.seo_description ?? '',
        images: loadedImages,
        amenities: (amenitiesRes.data ?? []).map((a: { amenity: string }) => a.amenity),
        card_display: (l.card_display && typeof l.card_display === 'object')
          ? { ...DEFAULT_CARD_DISPLAY, ...l.card_display }
          : { ...DEFAULT_CARD_DISPLAY },
        video_url: l.video_url ?? '',
        floor_plan_url: l.floor_plan_url ?? '',
        price_negotiable: l.price_negotiable ?? true,
        has_backup_power: l.has_backup_power ?? false,
        backup_power: l.backup_power ?? '',
        gated_community: l.gated_community ?? false,
        staff_quarters_count: String(l.staff_quarters_count ?? 0),
        swimming_pool: l.swimming_pool ?? false,
        gym: l.gym ?? false,
        proximity_to_amenities: l.proximity_to_amenities ?? '',
        unique_features: l.unique_features ?? '',
      });
      setLoading(false);
    };

    loadProperty();
  }, [routeId, draftId, navigate]);

  /* ── Form change handler ────────────────────────────────────────────── */
  const handleChange = useCallback((field: keyof ListingFormData, value: string | boolean | number | string[] | CardDisplaySettings) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    hasUnsavedChangesRef.current = true;
  }, []);

  /* ── Auto-save (debounced) ──────────────────────────────────────────── */
  const debouncedFormData = useDebounce(formData, 2000);

  useEffect(() => {
    const id = routeId ?? draftId;
    if (!id || loading || !hasUnsavedChangesRef.current) return;

    setAutoSaving(true);
    const timer = setTimeout(async () => {
      await persistToDb(id, false);
      setAutoSaving(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [debouncedFormData, routeId, draftId, loading]);

  /* ── Core DB persistence (no status change) ─────────────────────────── */
  async function persistToDb(id: string, showNotification = true) {
    if (!id) return;
    setSaving(true);

    try {
      const payload = buildPropertyPayload(formData);
      const { error } = await supabase.from('listings').update(payload).eq('id', id);
      if (error) throw error;

      // Sync images
      await supabase.from('listing_images').delete().eq('listing_id', id);
      if (formData.images.length > 0) {
        await supabase.from('listing_images').insert(
          formData.images.map((img, idx) => ({
            listing_id: id,
            url: img.url,
            sort_order: idx,
            is_cover: img.is_cover ?? false,
          }))
        );
      }

      // Sync amenities
      await supabase.from('listing_amenities').delete().eq('listing_id', id);
      if (formData.amenities.length > 0) {
        await supabase.from('listing_amenities').insert(
          formData.amenities.map((a) => ({ listing_id: id, amenity: a }))
        );
      }

      hasUnsavedChangesRef.current = false;
      if (showNotification) showToast('success', 'Draft saved');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      if (showNotification) showToast('error', msg);
    } finally {
      setSaving(false);
    }
  }

  /* ── Manual "Save Draft" ────────────────────────────────────────────── */
  const handleManualSaveDraft = async () => {
    const id = routeId ?? draftId;
    if (!id) return;
    await persistToDb(id, true);
  };

  /* ── FINAL SUBMIT — status changes ONLY here ──────────────────────────
     Default: pending_review (admin approval required)
     Direct publish: status = published immediately                        */
  const handleSubmitForReview = async () => {
    const id = routeId ?? draftId;
    if (!id) {
      showToast('error', 'No draft ID found');
      return;
    }

    if (!formData.title.trim()) {
      showToast('error', 'Title is required before submitting');
      return;
    }

    setSaving(true);
    try {
      await persistToDb(id, false);
      const { error } = await supabase.from('listings').update({
        status: 'pending_review',
        updated_at: new Date().toISOString(),
      }).eq('id', id);

      if (error) throw error;

      showToast('success', 'Submitted for review');
      setTimeout(() => navigate('/admin/listings', { state: { publishedToast: 'Property submitted for review' } }), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submit failed';
      showToast('error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishDirectly = async () => {
    const id = routeId ?? draftId;
    if (!id) {
      showToast('error', 'No draft ID found');
      return;
    }

    if (!formData.title.trim()) {
      showToast('error', 'Title is required before publishing');
      return;
    }

    setSaving(true);
    try {
      await persistToDb(id, false);
      const { error } = await supabase.from('listings').update({
        status: 'published',
        published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', id);

      if (error) throw error;

      // Update local state so the form reflects published status immediately
      setFormData((prev) => ({ ...prev, status: 'published', published: true }));
      showToast('success', 'Property published successfully');
      setTimeout(() => navigate('/admin/listings', { state: { publishedToast: 'Property published successfully' } }), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish failed';
      showToast('error', msg);
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit-mode save (keeps current status) ──────────────────────────── */
  const handleEditSave = async () => {
    const id = routeId ?? draftId;
    if (!id) return;
    if (!formData.title.trim()) {
      showToast('error', 'Title is required');
      return;
    }
    await persistToDb(id, true);
  };

  /* ── Cancel / exit ──────────────────────────────────────────────────── */
  const handleCancel = () => {
    navigate('/admin/listings');
  };

  /* ── Retry draft creation ───────────────────────────────────────────── */
  const handleRetryDraft = () => {
    setDraftError(null);
    setDraftId(null);
    // Force re-run the createDraft effect by clearing draftId
    // The effect depends on [isEdit, draftId], and isEdit is false here
  };

  /* ── Loading states ─────────────────────────────────────────────────── */
  if (loading && !routeId && !draftId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <i className="ri-loader-4-line animate-spin text-xl" />
          <span className="text-sm">Preparing draft…</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <i className="ri-loader-4-line animate-spin text-xl" />
          <span className="text-sm">Loading property…</span>
        </div>
      </div>
    );
  }

  /* ── Draft creation failed ──────────────────────────────────────────── */
  if (draftError && !draftId) {
    return (
      <div className="w-full max-w-xl mx-auto mt-16 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto mb-4">
            <i className="ri-error-warning-line text-xl" />
          </div>
          <h3 className="text-base font-semibold text-red-800 mb-1">Failed to create draft</h3>
          <p className="text-sm text-red-600 mb-4">{draftError}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRetryDraft}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-refresh-line mr-1.5" />
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-primary hover:bg-white transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line text-base" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-primary">
              {isEdit ? 'Edit Property' : 'New Property'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit
                ? `Editing: ${formData.title || '…'}`
                : autoSaving
                  ? 'Auto-saving…'
                  : 'Draft auto-saves as you type'}
            </p>
          </div>
        </div>
        {saving && (
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <i className="ri-loader-4-line animate-spin" /> Saving…
          </span>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
          <i className={toast.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} />
          {toast.msg}
        </div>
      )}

      <ListingForm
        formData={formData}
        agents={agents}
        neighborhoods={neighborhoods}
        saving={saving}
        isEdit={isEdit}
        onChange={handleChange}
        onImagesChange={(images) => {
          setFormData((p) => ({ ...p, images }));
          hasUnsavedChangesRef.current = true;
        }}
        onAmenitiesChange={(amenities) => {
          setFormData((p) => ({ ...p, amenities }));
          hasUnsavedChangesRef.current = true;
        }}
        onSave={isEdit ? handleEditSave : handleManualSaveDraft}
        onSubmit={handleSubmitForReview}
        onPublish={handlePublishDirectly}
        onCancel={handleCancel}
      />
    </div>
  );
}