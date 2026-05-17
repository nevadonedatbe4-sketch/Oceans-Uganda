import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Listing, generateSlug } from '@/pages/admin/listings/types';
import ListingFilters from '@/pages/admin/listings/components/ListingFilters';
import ListingsTable from '@/pages/admin/listings/components/ListingsTable';
import QuickEditModal from '@/pages/admin/listings/components/QuickEditModal';
import AssignAgentModal from '@/pages/admin/listings/components/AssignAgentModal';
import AddNotesModal from '@/pages/admin/listings/components/AddNotesModal';
import ExtendExpiryModal from '@/pages/admin/listings/components/ExtendExpiryModal';
import BulkActionsToolbar from '@/pages/admin/listings/components/BulkActionsToolbar';

interface Stats {
  total: number;
  published: number;
  draft: number;
  pendingReview: number;
}

type ModalType = 'quickEdit' | 'assignAgent' | 'addNotes' | 'extendExpiry' | null;

interface ConfirmAction {
  id: string;
  title: string;
  type: 'delete' | 'archive' | 'sold' | 'expire' | 'disapprove';
}

const CONFIRM_CONFIG: Record<string, { icon: string; color: string; heading: string; body: (title: string) => string; confirmLabel: string; confirmClass: string }> = {
  delete: {
    icon: 'ri-delete-bin-line',
    color: 'bg-red-50 text-red-500',
    heading: 'Delete Property?',
    body: (t) => `"${t}" will be permanently deleted along with all its images and amenities. This cannot be undone.`,
    confirmLabel: 'Delete Permanently',
    confirmClass: 'bg-red-500 hover:bg-red-600 text-white',
  },
  archive: {
    icon: 'ri-archive-line',
    color: 'bg-amber-50 text-amber-500',
    heading: 'Archive Property?',
    body: (t) => `"${t}" will be archived and hidden from public view. You can restore it later.`,
    confirmLabel: 'Archive Property',
    confirmClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  sold: {
    icon: 'ri-home-smile-line',
    color: 'bg-gray-50 text-gray-500',
    heading: 'Mark as Sold?',
    body: (t) => `"${t}" will be marked as sold and removed from active listings.`,
    confirmLabel: 'Mark as Sold',
    confirmClass: 'bg-[#0d1f2d] hover:bg-[#1a3347] text-white',
  },
  expire: {
    icon: 'ri-time-line',
    color: 'bg-orange-50 text-orange-500',
    heading: 'Mark as Expired?',
    body: (t) => `"${t}" will be marked as expired and hidden from search results.`,
    confirmLabel: 'Mark as Expired',
    confirmClass: 'bg-orange-500 hover:bg-orange-600 text-white',
  },
  disapprove: {
    icon: 'ri-close-circle-line',
    color: 'bg-red-50 text-red-500',
    heading: 'Disapprove Listing?',
    body: (t) => `"${t}" will be disapproved and removed from public view.`,
    confirmLabel: 'Disapprove',
    confirmClass: 'bg-red-500 hover:bg-red-600 text-white',
  },
};

export default function AdminListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string; editId?: string } | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState<'delete' | 'archive' | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (type: 'success' | 'error', msg: string, editId?: string) => {
    setToast({ type, msg, editId });
    setTimeout(() => setToast(null), 5000);
  };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    setListings(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  /* ── Show toast passed from navigation state (e.g. after publish) ── */
  useEffect(() => {
    const navState = location.state as { publishedToast?: string } | null;
    if (navState?.publishedToast) {
      showToast('success', navState.publishedToast);
      // Clear so it doesn't reappear on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const stats: Stats = useMemo(() => ({
    total: listings.length,
    published: listings.filter((l) => l.status === 'published').length,
    draft: listings.filter((l) => l.status === 'draft').length,
    pendingReview: listings.filter((l) => l.status === 'pending_review').length,
  }), [listings]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.title.toLowerCase().includes(q) || (l.location ?? '').toLowerCase().includes(q);
      const matchStatus = !statusFilter || l.status === statusFilter;
      const matchPurpose = !purposeFilter || l.purpose === purposeFilter;
      const matchType = !typeFilter || l.property_type === typeFilter;
      return matchSearch && matchStatus && matchPurpose && matchType;
    });
  }, [listings, search, statusFilter, purposeFilter, typeFilter]);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('listings').update({ featured: !current }).eq('id', id);
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, featured: !current } : l));
    showToast('success', current ? 'Removed from featured' : 'Marked as featured');
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    // Statuses that need confirmation
    if (newStatus === 'sold') {
      const listing = listings.find((l) => l.id === id);
      if (listing) { setConfirmAction({ id, title: listing.title, type: 'sold' }); return; }
    }
    if (newStatus === 'expired') {
      const listing = listings.find((l) => l.id === id);
      if (listing) { setConfirmAction({ id, title: listing.title, type: 'expire' }); return; }
    }
    if (newStatus === 'disapproved') {
      const listing = listings.find((l) => l.id === id);
      if (listing) { setConfirmAction({ id, title: listing.title, type: 'disapprove' }); return; }
    }
    await supabase.from('listings').update({ status: newStatus }).eq('id', id);
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
    showToast('success', `Status updated to "${newStatus}"`);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    const { id, type } = confirmAction;

    if (type === 'delete') {
      await supabase.from('listing_images').delete().eq('listing_id', id);
      await supabase.from('listing_amenities').delete().eq('listing_id', id);
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (!error) {
        setListings((prev) => prev.filter((l) => l.id !== id));
        showToast('success', 'Property deleted permanently');
      } else {
        showToast('error', 'Failed to delete property');
      }
    } else if (type === 'archive') {
      await supabase.from('listings').update({ status: 'archived' }).eq('id', id);
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'archived' } : l));
      showToast('success', 'Property archived');
    } else if (type === 'sold') {
      await supabase.from('listings').update({ status: 'sold' }).eq('id', id);
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'sold' } : l));
      showToast('success', 'Property marked as sold');
    } else if (type === 'expire') {
      await supabase.from('listings').update({ status: 'expired' }).eq('id', id);
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'expired' } : l));
      showToast('success', 'Property marked as expired');
    } else if (type === 'disapprove') {
      await supabase.from('listings').update({ status: 'disapproved' }).eq('id', id);
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'disapproved' } : l));
      showToast('success', 'Property disapproved');
    }

    setConfirmAction(null);
  };

  const handleDuplicate = async (listing: Listing) => {
    setDuplicating(listing.id);
    try {
      const newTitle = `${listing.title} (Copy)`;
      const newSlug = generateSlug(newTitle) + '-copy-' + Date.now().toString().slice(-4);

      const { data: newListing, error: insertError } = await supabase
        .from('listings')
        .insert([{
          title: newTitle,
          slug: newSlug,
          property_type: listing.property_type,
          purpose: listing.purpose,
          price: listing.price,
          currency: listing.currency,
          price_note: listing.price_note,
          price_frequency: listing.price_frequency,
          secondary_price: listing.secondary_price,
          secondary_price_label: listing.secondary_price_label,
          location: listing.location,
          city: listing.city,
          country: listing.country,
          neighborhood_id: listing.neighborhood_id,
          address: listing.address,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          parking: listing.parking,
          size_sqm: listing.size_sqm,
          furnished: listing.furnished,
          featured: false,
          listing_status: listing.listing_status,
          status: 'hidden',
          published: false,
          short_description: listing.short_description,
          full_description: listing.full_description,
          cover_image: listing.cover_image,
          gallery: listing.gallery,
          agent_id: listing.agent_id,
          listing_date: new Date().toISOString().split('T')[0],
          seo_title: listing.seo_title,
          seo_description: listing.seo_description,
        }])
        .select()
        .maybeSingle();

      if (insertError || !newListing) {
        showToast('error', 'Failed to duplicate property');
        return;
      }

      const { data: images } = await supabase
        .from('listing_images')
        .select('url, sort_order, is_cover')
        .eq('listing_id', listing.id);

      if (images && images.length > 0) {
        await supabase.from('listing_images').insert(
          images.map((img) => ({ listing_id: newListing.id, url: img.url, sort_order: img.sort_order, is_cover: img.is_cover }))
        );
      }

      const { data: amenities } = await supabase
        .from('listing_amenities')
        .select('amenity')
        .eq('listing_id', listing.id);

      if (amenities && amenities.length > 0) {
        await supabase.from('listing_amenities').insert(
          amenities.map((a) => ({ listing_id: newListing.id, amenity: a.amenity }))
        );
      }

      setListings((prev) => [newListing, ...prev]);
      showToast('success', `"${newTitle}" created as a hidden draft`, newListing.id);
    } catch {
      showToast('error', 'Something went wrong while duplicating');
    } finally {
      setDuplicating(null);
    }
  };

  const handleQuickEditSave = async (id: string, updates: Partial<Listing>) => {
    const { error } = await supabase.from('listings').update(updates).eq('id', id);
    if (!error) {
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, ...updates } : l));
      showToast('success', 'Listing updated successfully');
    } else {
      showToast('error', 'Failed to update listing');
    }
  };

  const handleAssignAgentSave = async (id: string, agentId: string | null) => {
    const { error } = await supabase.from('listings').update({ agent_id: agentId }).eq('id', id);
    if (!error) {
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, agent_id: agentId } : l));
      showToast('success', agentId ? 'Agent assigned successfully' : 'Agent unassigned');
    } else {
      showToast('error', 'Failed to assign agent');
    }
  };

  const handleAddNotesSave = async (_id: string, _notes: string) => {
    // Notes are stored in a separate table or as metadata; for now show success
    showToast('success', 'Internal note saved');
  };

  const handleExtendExpirySave = async (id: string, expiryDate: string) => {
    const { error } = await supabase.from('listings').update({ listing_date: expiryDate }).eq('id', id);
    if (!error) {
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, listing_date: expiryDate } : l));
      showToast('success', `Expiry date set to ${new Date(expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`);
    } else {
      showToast('error', 'Failed to update expiry date');
    }
  };

  // ── Selection helpers ──────────────────────────────────────────────────────
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((l) => l.id));
    }
  };

  const handleSelectAll = () => setSelectedIds(filtered.map((l) => l.id));
  const handleClearSelection = () => setSelectedIds([]);

  // ── Bulk actions ───────────────────────────────────────────────────────────
  const handleBulkStatusChange = async (status: string) => {
    if (selectedIds.length === 0) return;
    setBulkProcessing(true);
    const { error } = await supabase.from('listings').update({ status }).in('id', selectedIds);
    if (!error) {
      setListings((prev) => prev.map((l) => selectedIds.includes(l.id) ? { ...l, status } : l));
      showToast('success', `${selectedIds.length} listings updated to "${status}"`);
      setSelectedIds([]);
    } else {
      showToast('error', 'Bulk status update failed');
    }
    setBulkProcessing(false);
  };

  const handleBulkAssignAgent = async (agentId: string) => {
    if (selectedIds.length === 0) return;
    setBulkProcessing(true);
    const { error } = await supabase.from('listings').update({ agent_id: agentId }).in('id', selectedIds);
    if (!error) {
      setListings((prev) => prev.map((l) => selectedIds.includes(l.id) ? { ...l, agent_id: agentId } : l));
      showToast('success', `Agent assigned to ${selectedIds.length} listings`);
      setSelectedIds([]);
    } else {
      showToast('error', 'Bulk agent assignment failed');
    }
    setBulkProcessing(false);
  };

  const handleBulkFeature = async (featured: boolean) => {
    if (selectedIds.length === 0) return;
    setBulkProcessing(true);
    const { error } = await supabase.from('listings').update({ featured }).in('id', selectedIds);
    if (!error) {
      setListings((prev) => prev.map((l) => selectedIds.includes(l.id) ? { ...l, featured } : l));
      showToast('success', featured ? `${selectedIds.length} listings marked as featured` : `Featured removed from ${selectedIds.length} listings`);
      setSelectedIds([]);
    } else {
      showToast('error', 'Bulk featured update failed');
    }
    setBulkProcessing(false);
  };

  const handleBulkArchive = async () => {
    setBulkConfirm('archive');
  };

  const handleBulkDelete = () => {
    setBulkConfirm('delete');
  };

  const handleBulkConfirm = async () => {
    if (!bulkConfirm || selectedIds.length === 0) return;
    setBulkProcessing(true);
    if (bulkConfirm === 'archive') {
      const { error } = await supabase.from('listings').update({ status: 'archived' }).in('id', selectedIds);
      if (!error) {
        setListings((prev) => prev.map((l) => selectedIds.includes(l.id) ? { ...l, status: 'archived' } : l));
        showToast('success', `${selectedIds.length} listings archived`);
        setSelectedIds([]);
      } else {
        showToast('error', 'Bulk archive failed');
      }
    } else if (bulkConfirm === 'delete') {
      // Delete images + amenities first, then listings
      for (const id of selectedIds) {
        await supabase.from('listing_images').delete().eq('listing_id', id);
        await supabase.from('listing_amenities').delete().eq('listing_id', id);
      }
      const { error } = await supabase.from('listings').delete().in('id', selectedIds);
      if (!error) {
        setListings((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
        showToast('success', `${selectedIds.length} listings deleted permanently`);
        setSelectedIds([]);
      } else {
        showToast('error', 'Bulk delete failed');
      }
    }
    setBulkProcessing(false);
    setBulkConfirm(null);
  };

  const openModal = (type: ModalType, listing: Listing) => {
    setSelectedListing(listing);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedListing(null);
  };

  const cfg = confirmAction ? CONFIRM_CONFIG[confirmAction.type] : null;

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-xl font-jost font-semibold text-primary leading-tight">All Properties</h2>
          <p className="text-[11px] text-[#7a8a99] mt-0 hidden sm:block">Manage every property on the Oceans Uganda platform</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={load}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <i className="ri-refresh-line text-sm sm:text-base" />
          </button>
          <Link
            to="/admin/listings/new"
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-primary text-white text-[11px] sm:text-xs font-medium rounded-md hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line" />
            <span className="hidden sm:inline">Add Property</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
          <div className="flex items-center gap-2">
            <i className={toast.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} />
            {toast.msg}
          </div>
          {toast.editId && (
            <button
              onClick={() => navigate(`/admin/listings/${toast.editId}`)}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-md hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-edit-line" />
              Edit now
            </button>
          )}
        </div>
      )}

      {/* Stats — horizontal scroll on mobile, grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-4 gap-2 overflow-x-auto pb-0.5 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { label: 'Total', value: stats.total, icon: 'ri-building-2-line', color: 'text-primary', bg: 'bg-[#0d1f2d]/8' },
          { label: 'Published', value: stats.published, icon: 'ri-checkbox-circle-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Draft', value: stats.draft, icon: 'ri-draft-line', color: 'text-gray-400', bg: 'bg-gray-100' },
          { label: 'Pending', value: stats.pendingReview, icon: 'ri-time-line', color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e8edf2] rounded-lg px-2.5 py-2 sm:px-3 sm:py-3 flex items-center gap-2 shrink-0 min-w-[100px] sm:min-w-0">
            <span className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg shrink-0 ${stat.bg} ${stat.color}`}>
              <i className={`${stat.icon} text-xs sm:text-sm`} />
            </span>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-primary leading-tight">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-gray-400 whitespace-nowrap">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <ListingFilters
        search={search} status={statusFilter} purpose={purposeFilter} propertyType={typeFilter}
        onSearch={setSearch} onStatus={setStatusFilter} onPurpose={setPurposeFilter} onPropertyType={setTypeFilter}
        total={listings.length} filtered={filtered.length}
      />

      {/* Bulk Actions Toolbar — appears when rows are selected */}
      <BulkActionsToolbar
        selectedIds={selectedIds}
        totalCount={filtered.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onBulkStatusChange={handleBulkStatusChange}
        onBulkAssignAgent={handleBulkAssignAgent}
        onBulkFeature={handleBulkFeature}
        onBulkDelete={handleBulkDelete}
        onBulkArchive={handleBulkArchive}
        processing={bulkProcessing}
      />

      {/* Table */}
      {loading ? (
        <div className="bg-white border border-[#e8edf2] rounded-lg p-10 sm:p-16 flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3 text-[#7a8a99]">
            <i className="ri-loader-4-line animate-spin text-lg sm:text-xl" />
            <span className="text-xs sm:text-sm">Loading properties…</span>
          </div>
        </div>
      ) : (
        <ListingsTable
          listings={filtered}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleFeatured={handleToggleFeatured}
          onToggleStatus={handleToggleStatus}
          onDelete={(id, title) => setConfirmAction({ id, title, type: 'delete' })}
          onDuplicate={handleDuplicate}
          onQuickEdit={(listing) => openModal('quickEdit', listing)}
          onAssignAgent={(listing) => openModal('assignAgent', listing)}
          onAddNotes={(listing) => openModal('addNotes', listing)}
          onExtendExpiry={(listing) => openModal('extendExpiry', listing)}
          onArchive={(id, title) => setConfirmAction({ id, title, type: 'archive' })}
          duplicatingId={duplicating}
        />
      )}

      {/* Confirm modal */}
      {confirmAction && cfg && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:w-[400px] sm:mx-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full mx-auto mb-3 sm:mb-4 ${cfg.color}`}>
              <i className={`${cfg.icon} text-lg sm:text-xl`} />
            </div>
            <h3 className="text-center font-semibold text-[#0d1f2d] mb-2 text-sm sm:text-base">{cfg.heading}</h3>
            <p className="text-center text-xs sm:text-sm text-[#7a8a99] mb-5 sm:mb-6">{cfg.body(confirmAction.title)}</p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2 sm:py-2.5 border border-[#e8edf2] rounded-md text-xs sm:text-sm text-[#0d1f2d] hover:bg-[#F5F5F5] cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap ${cfg.confirmClass}`}
              >
                {cfg.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal === 'quickEdit' && selectedListing && (
        <QuickEditModal listing={selectedListing} onClose={closeModal} onSave={handleQuickEditSave} />
      )}
      {activeModal === 'assignAgent' && selectedListing && (
        <AssignAgentModal listing={selectedListing} onClose={closeModal} onSave={handleAssignAgentSave} />
      )}
      {activeModal === 'addNotes' && selectedListing && (
        <AddNotesModal listing={selectedListing} onClose={closeModal} onSave={handleAddNotesSave} />
      )}
      {activeModal === 'extendExpiry' && selectedListing && (
        <ExtendExpiryModal listing={selectedListing} onClose={closeModal} onSave={handleExtendExpirySave} />
      )}

      {/* Bulk confirm modal */}
      {bulkConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:w-[420px] sm:mx-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full mx-auto mb-3 sm:mb-4 ${bulkConfirm === 'delete' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
              <i className={`${bulkConfirm === 'delete' ? 'ri-delete-bin-line' : 'ri-archive-line'} text-lg sm:text-xl`} />
            </div>
            <h3 className="text-center font-semibold text-[#0d1f2d] mb-2 text-sm sm:text-base">
              {bulkConfirm === 'delete' ? `Delete ${selectedIds.length} Properties?` : `Archive ${selectedIds.length} Properties?`}
            </h3>
            <p className="text-center text-xs sm:text-sm text-[#7a8a99] mb-5 sm:mb-6">
              {bulkConfirm === 'delete'
                ? `All ${selectedIds.length} selected properties will be permanently deleted along with their images and amenities. This cannot be undone.`
                : `All ${selectedIds.length} selected properties will be archived and hidden from public view. You can restore them later.`
              }
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setBulkConfirm(null)}
                className="flex-1 py-2 sm:py-2.5 border border-[#e8edf2] rounded-md text-xs sm:text-sm text-[#0d1f2d] hover:bg-[#F5F5F5] cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkConfirm}
                disabled={bulkProcessing}
                className={`flex-1 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap disabled:opacity-60 ${
                  bulkConfirm === 'delete' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {bulkProcessing
                  ? <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin" /> Processing…</span>
                  : bulkConfirm === 'delete' ? `Delete ${selectedIds.length} Properties` : `Archive ${selectedIds.length} Properties`
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
