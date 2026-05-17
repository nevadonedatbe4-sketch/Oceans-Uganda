import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Listing, statusColor, purposeColor } from '@/pages/admin/listings/types';
import PropertyActionsMenu from '@/pages/admin/listings/components/PropertyActionsMenu';
import { useCurrency } from '@/contexts/CurrencyContext';

// ── Swipe-to-delete wrapper ──────────────────────────────────────────────────
function SwipeToDelete({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  const startXRef = useRef<number>(0);
  const [offset, setOffset] = useState(0);
  const [committed, setCommitted] = useState(false);
  const THRESHOLD = 80;

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = startXRef.current - e.touches[0].clientX;
    if (dx > 0) setOffset(Math.min(dx, THRESHOLD + 20));
  };

  const onTouchEnd = () => {
    if (offset >= THRESHOLD) {
      setOffset(THRESHOLD);
      setCommitted(true);
    } else {
      setOffset(0);
    }
  };

  const reset = () => { setOffset(0); setCommitted(false); };

  return (
    <div className="relative overflow-hidden">
      {/* Red delete reveal */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 flex flex-col items-center justify-center bg-red-500 cursor-pointer select-none"
        onClick={committed ? onDelete : reset}
      >
        <i className="ri-delete-bin-line text-white text-lg" />
        <span className="text-white text-[9px] font-bold mt-0.5">Delete</span>
      </div>
      {/* Sliding content */}
      <div
        style={{ transform: `translateX(-${offset}px)`, transitionDuration: offset === 0 || committed ? '200ms' : '0ms' }}
        className="relative transition-transform"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => { if (committed) reset(); }}
      >
        {children}
      </div>
    </div>
  );
}

interface ListingsTableProps {
  listings: Listing[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  onToggleStatus: (id: string, newStatus: string) => void;
  onDelete: (id: string, title: string) => void;
  onDuplicate: (listing: Listing) => void;
  onQuickEdit: (listing: Listing) => void;
  onAssignAgent: (listing: Listing) => void;
  onAddNotes: (listing: Listing) => void;
  onExtendExpiry: (listing: Listing) => void;
  onArchive: (id: string, title: string) => void;
  duplicatingId?: string | null;
}

function AdminPriceDisplay({ price, currency, note }: { price: number | null; currency: string; note: string | null }) {
  const { formatAdminPrice } = useCurrency();
  if (!price) return <span>—</span>;
  return (
    <span>
      {formatAdminPrice(price, currency)}
      {note ? <span className="ml-1 text-[11px] text-[#7a8a99]">{note}</span> : null}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    available: 'Available', sold: 'Sold', rented: 'Rented', hidden: 'Hidden',
    on_hold: 'On Hold', expired: 'Expired', disapproved: 'Disapproved', archived: 'Archived',
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full capitalize ${statusColor(status)}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ── Mobile card ──────────────────────────────────────────────────────────────
interface MobileCardProps {
  listing: Listing;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  onToggleStatus: (id: string, newStatus: string) => void;
  onDelete: (id: string, title: string) => void;
  onDuplicate: (listing: Listing) => void;
  onQuickEdit: (listing: Listing) => void;
  onAssignAgent: (listing: Listing) => void;
  onAddNotes: (listing: Listing) => void;
  onExtendExpiry: (listing: Listing) => void;
  onArchive: (id: string, title: string) => void;
  duplicatingId?: string | null;
}

function MobileCard({
  listing, selected, onToggleSelect,
  onToggleFeatured, onToggleStatus, onDelete, onDuplicate,
  onQuickEdit, onAssignAgent, onAddNotes, onExtendExpiry, onArchive, duplicatingId,
}: MobileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const price = listing.price
    ? (listing.currency === 'UGX' ? `UGX ${listing.price.toLocaleString()}` : `$${listing.price.toLocaleString()}`)
    : '—';

  const purposeLabel = listing.purpose === 'sale' ? 'For Sale'
    : listing.purpose === 'rent' ? 'For Rent'
    : listing.purpose === 'short_stay' ? 'Short Stay'
    : listing.purpose === 'new_dev' ? 'New Dev'
    : listing.purpose ?? '';

  return (
    <div className={`border-b border-[#f0f4f8] last:border-0 transition-colors ${selected ? 'bg-[#D5A91C]/5' : 'bg-white'}`}>
      {/* ── Top row: checkbox + image + title/price + star + more ── */}
      <div className="flex items-start gap-2 px-2.5 pt-2.5 pb-1.5">
        {/* Checkbox */}
        <button
          onClick={() => onToggleSelect(listing.id)}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5 ${
            selected ? 'bg-[#D5A91C] border-[#D5A91C] text-white' : 'border-[#d0d8e0]'
          }`}
        >
          {selected && <i className="ri-check-line text-[9px]" />}
        </button>

        {/* Thumbnail */}
        <div className="w-11 h-11 rounded-md overflow-hidden bg-[#F5F5F5] shrink-0">
          {listing.cover_image ? (
            <img src={listing.cover_image} alt={listing.title} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#ccc]">
              <i className="ri-image-line text-sm" />
            </div>
          )}
        </div>

        {/* Title + price + location */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#0d1f2d] leading-tight line-clamp-2">{listing.title}</p>
          {listing.location && (
            <p className="text-[9px] text-[#7a8a99] mt-0.5 truncate">
              <i className="ri-map-pin-2-line mr-0.5" />{listing.location}
            </p>
          )}
          <p className="text-[11px] font-bold text-[#0d1f2d] mt-0.5">
            <AdminPriceDisplay price={listing.price} currency={listing.currency} note={null} />
          </p>
        </div>

        {/* Star + more */}
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <button
            onClick={() => onToggleFeatured(listing.id, listing.featured)}
            className={`w-6 h-6 flex items-center justify-center rounded transition-colors cursor-pointer ${
              listing.featured ? 'text-[#D5A91C] bg-[#D5A91C]/10' : 'text-[#d0d8e0] hover:text-[#D5A91C]'
            }`}
          >
            <i className={listing.featured ? 'ri-star-fill text-xs' : 'ri-star-line text-xs'} />
          </button>
          <div className="relative">
            <button
              ref={btnRef}
              onClick={() => setMenuOpen((v) => !v)}
              className={`w-6 h-6 flex items-center justify-center rounded transition-colors cursor-pointer ${
                menuOpen ? 'bg-[#0d1f2d] text-white' : 'text-[#7a8a99] hover:bg-[#f0f4f8]'
              }`}
            >
              <i className="ri-more-2-fill text-xs" />
            </button>
            {menuOpen && (
              <PropertyActionsMenu
                listing={listing}
                onClose={() => setMenuOpen(false)}
                anchorRef={btnRef}
                onQuickEdit={() => onQuickEdit(listing)}
                onAssignAgent={() => onAssignAgent(listing)}
                onAddNotes={() => onAddNotes(listing)}
                onExtendExpiry={() => onExtendExpiry(listing)}
                onToggleFeatured={() => onToggleFeatured(listing.id, listing.featured)}
                onStatusChange={(s) => onToggleStatus(listing.id, s)}
                onDuplicate={() => onDuplicate(listing)}
                onDelete={() => onDelete(listing.id, listing.title)}
                onArchive={() => onArchive(listing.id, listing.title)}
                onTogglePinned={() => onToggleStatus(listing.id, 'pinned')}
                onToggleHideFromSearch={() => onToggleStatus(listing.id, 'hidden')}
                duplicating={duplicatingId === listing.id}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom row: badges + Edit button ── */}
      <div className="flex items-center justify-between gap-2 px-2.5 pb-2">
        <div className="flex items-center gap-1 flex-wrap">
          <StatusBadge status={listing.status} />
          {purposeLabel && (
            <span className={`text-[8px] font-semibold px-1 py-[2px] rounded-full ${purposeColor(listing.purpose ?? '')}`}>
              {purposeLabel}
            </span>
          )}
          {listing.property_type && (
            <span className="text-[8px] font-medium px-1 py-[2px] rounded-full bg-[#f0f4f8] text-[#7a8a99]">
              {listing.property_type}
            </span>
          )}
          {listing.featured && (
            <span className="text-[8px] font-semibold px-1 py-[2px] rounded-full bg-[#D5A91C]/10 text-[#D5A91C]">
              Featured
            </span>
          )}
        </div>
        <Link
          to={`/admin/listings/${listing.id}`}
          className="flex items-center gap-1 px-2 py-0.5 bg-[#0d1f2d] text-white text-[9px] font-semibold rounded hover:bg-[#1a3347] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <i className="ri-edit-line text-[9px]" /> Edit
        </Link>
      </div>
    </div>
  );
}

interface RowProps {
  listing: Listing;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  onToggleStatus: (id: string, newStatus: string) => void;
  onDelete: (id: string, title: string) => void;
  onDuplicate: (listing: Listing) => void;
  onQuickEdit: (listing: Listing) => void;
  onAssignAgent: (listing: Listing) => void;
  onAddNotes: (listing: Listing) => void;
  onExtendExpiry: (listing: Listing) => void;
  onArchive: (id: string, title: string) => void;
  duplicatingId?: string | null;
}

function ListingRow({
  listing, selected, onToggleSelect,
  onToggleFeatured, onToggleStatus, onDelete, onDuplicate,
  onQuickEdit, onAssignAgent, onAddNotes, onExtendExpiry, onArchive, duplicatingId,
}: RowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <tr className={`transition-colors ${selected ? 'bg-[#D5A91C]/5' : 'hover:bg-[#F5F5F5]'}`}>
      {/* Checkbox */}
      <td className="pl-4 pr-2 py-3 w-10">
        <button
          onClick={() => onToggleSelect(listing.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            selected
              ? 'bg-[#D5A91C] border-[#D5A91C] text-white'
              : 'border-[#d0d8e0] hover:border-[#D5A91C]'
          }`}
        >
          {selected && <i className="ri-check-line text-[10px]" />}
        </button>
      </td>

      {/* Property info */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-[#F5F5F5] shrink-0">
            {listing.cover_image ? (
              <img src={listing.cover_image} alt={listing.title} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#bbb]">
                <i className="ri-image-line text-lg" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#0d1f2d] truncate max-w-[180px]">{listing.title}</p>
            <p className="text-xs text-[#7a8a99] truncate max-w-[180px]">{listing.location || '—'}</p>
          </div>
        </div>
      </td>

      {/* Type + purpose */}
      <td className="px-3 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#0d1f2d]">{listing.property_type || '—'}</span>
          {listing.purpose && (
            <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full w-fit ${purposeColor(listing.purpose)}`}>
              {listing.purpose === 'short_stay' ? 'Short Stay' : listing.purpose === 'new_dev' ? 'New Dev' : listing.purpose === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
          )}
        </div>
      </td>

      {/* Price */}
      <td className="px-3 py-3">
        <span className="text-sm text-[#0d1f2d] whitespace-nowrap">
          <AdminPriceDisplay price={listing.price} currency={listing.currency} note={listing.price_note} />
        </span>
      </td>

      {/* Status */}
      <td className="px-3 py-3">
        <StatusBadge status={listing.status} />
      </td>

      {/* Featured toggle */}
      <td className="px-3 py-3">
        <button
          onClick={() => onToggleFeatured(listing.id, listing.featured)}
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
            listing.featured ? 'text-[#D5A91C] bg-[#D5A91C]/10' : 'text-[#ccc] hover:text-[#D5A91C] hover:bg-[#D5A91C]/5'
          }`}
          title={listing.featured ? 'Remove from featured' : 'Mark as featured'}
        >
          <i className={listing.featured ? 'ri-star-fill text-base' : 'ri-star-line text-base'} />
        </button>
      </td>

      {/* Listed date */}
      <td className="px-3 py-3">
        <span className="text-xs text-[#7a8a99]">
          {listing.listing_date ? new Date(listing.listing_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/listings/${listing.id}`}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            title="Edit"
          >
            <i className="ri-edit-line text-base" />
          </Link>
          <div className="relative">
            <button
              ref={btnRef}
              onClick={() => setMenuOpen((v) => !v)}
              className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                menuOpen ? 'bg-[#0d1f2d] text-white' : 'text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#F5F5F5]'
              }`}
              title="More actions"
            >
              <i className="ri-more-2-fill text-base" />
            </button>
            {menuOpen && (
              <PropertyActionsMenu
                listing={listing}
                onClose={() => setMenuOpen(false)}
                anchorRef={btnRef}
                onQuickEdit={() => onQuickEdit(listing)}
                onAssignAgent={() => onAssignAgent(listing)}
                onAddNotes={() => onAddNotes(listing)}
                onExtendExpiry={() => onExtendExpiry(listing)}
                onToggleFeatured={() => onToggleFeatured(listing.id, listing.featured)}
                onStatusChange={(s) => onToggleStatus(listing.id, s)}
                onDuplicate={() => onDuplicate(listing)}
                onDelete={() => onDelete(listing.id, listing.title)}
                onArchive={() => onArchive(listing.id, listing.title)}
                onTogglePinned={() => onToggleStatus(listing.id, 'pinned')}
                onToggleHideFromSearch={() => onToggleStatus(listing.id, 'hidden')}
                duplicating={duplicatingId === listing.id}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function ListingsTable({
  listings, selectedIds, onToggleSelect, onToggleSelectAll,
  onToggleFeatured, onToggleStatus, onDelete, onDuplicate,
  onQuickEdit, onAssignAgent, onAddNotes, onExtendExpiry, onArchive, duplicatingId,
}: ListingsTableProps) {
  const allSelected = listings.length > 0 && selectedIds.length === listings.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < listings.length;

  if (listings.length === 0) {
    return (
      <div className="bg-white border border-[#e8edf2] rounded-lg p-8 sm:p-16 text-center">
        <span className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-2 sm:mb-3 text-[#ccc]">
          <i className="ri-building-2-line text-3xl sm:text-4xl" />
        </span>
        <p className="text-[#7a8a99] text-xs sm:text-sm">No listings found</p>
        <p className="text-[#aaa] text-[10px] sm:text-xs mt-1">Try adjusting filters or add a new listing</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8edf2] rounded-lg overflow-hidden">

      {/* ── Mobile card list ── */}
      <div className="sm:hidden">
        {/* Select-all bar */}
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 border-b border-[#e8edf2] bg-[#f8f9fb]">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSelectAll}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                allSelected ? 'bg-[#D5A91C] border-[#D5A91C] text-white'
                : someSelected ? 'bg-[#D5A91C]/30 border-[#D5A91C] text-[#D5A91C]'
                : 'border-[#d0d8e0]'
              }`}
            >
              {allSelected && <i className="ri-check-line text-[9px]" />}
              {someSelected && !allSelected && <i className="ri-subtract-line text-[9px]" />}
            </button>
            <span className="text-[10px] text-[#7a8a99]">
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : `${listings.length} properties`}
            </span>
          </div>
          {selectedIds.length > 0 ? (
            <span className="text-[9px] text-[#D5A91C] font-medium">Actions above</span>
          ) : (
            <span className="text-[9px] text-[#b0bec5] flex items-center gap-1">
              <i className="ri-arrow-left-right-line" /> Swipe to delete
            </span>
          )}
        </div>
        {listings.map((listing) => (
          <SwipeToDelete key={listing.id} onDelete={() => onDelete(listing.id, listing.title)}>
            <MobileCard
              listing={listing}
              selected={selectedIds.includes(listing.id)}
              onToggleSelect={onToggleSelect}
              onToggleFeatured={onToggleFeatured}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onQuickEdit={onQuickEdit}
              onAssignAgent={onAssignAgent}
              onAddNotes={onAddNotes}
              onExtendExpiry={onExtendExpiry}
              onArchive={onArchive}
              duplicatingId={duplicatingId}
            />
          </SwipeToDelete>
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead>
            <tr className="border-b border-[#e8edf2] bg-[#F5F5F5]">
              <th className="pl-4 pr-2 py-3 w-10">
                <button
                  onClick={onToggleSelectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                    allSelected ? 'bg-[#D5A91C] border-[#D5A91C] text-white'
                    : someSelected ? 'bg-[#D5A91C]/30 border-[#D5A91C] text-[#D5A91C]'
                    : 'border-[#d0d8e0] hover:border-[#D5A91C]'
                  }`}
                  title={allSelected ? 'Deselect all' : 'Select all'}
                >
                  {allSelected && <i className="ri-check-line text-[10px]" />}
                  {someSelected && !allSelected && <i className="ri-subtract-line text-[10px]" />}
                </button>
              </th>
              {['Property', 'Type', 'Price', 'Status', 'Featured', 'Listed', 'Actions'].map((h, i) => (
                <th
                  key={h}
                  className={`text-[11px] font-semibold uppercase tracking-wider text-[#7a8a99] px-3 py-3 ${i === 6 ? 'text-right' : 'text-left'} ${i === 0 ? 'w-[260px]' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4f8]">
            {listings.map((listing) => (
              <ListingRow
                key={listing.id}
                listing={listing}
                selected={selectedIds.includes(listing.id)}
                onToggleSelect={onToggleSelect}
                onToggleFeatured={onToggleFeatured}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onQuickEdit={onQuickEdit}
                onAssignAgent={onAssignAgent}
                onAddNotes={onAddNotes}
                onExtendExpiry={onExtendExpiry}
                onArchive={onArchive}
                duplicatingId={duplicatingId}
              />
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
