import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyPreviewModal from '@/components/base/PropertyPreviewModal';
import { supabase } from '@/lib/supabase';
import { RecentProperty } from '../page';

interface Props {
  properties: RecentProperty[];
}

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available', color: '#0d5959', bg: 'bg-[#0d5959]/8' },
  { value: 'sold',      label: 'Sold',      color: '#7A7A7A', bg: 'bg-[#7A7A7A]/8' },
  { value: 'rented',    label: 'Rented',    color: '#001731', bg: 'bg-[#001731]/8' },
  { value: 'hidden',    label: 'Draft',     color: '#7A7A7A', bg: 'bg-[#7A7A7A]/8' },
];

const purposeMeta: Record<string, { label: string; color: string }> = {
  sale:       { label: 'For Sale',   color: '#001731' },
  rent:       { label: 'For Rent',   color: '#0d5959' },
  short_stay: { label: 'Short Stay', color: '#0d5959' },
  new_dev:    { label: 'New Dev',    color: '#001731' },
};

function formatPrice(price: number | null, currency: string): string {
  if (!price) return '\u2014';
  if (price >= 1_000_000) return `${currency} ${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${currency} ${(price / 1_000).toFixed(0)}K`;
  return `${currency} ${price}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

/* \u2014\u2014 Inline status dropdown \u2014\u2014 */
interface StatusDropdownProps {
  propertyId: string;
  currentStatus: string;
  onStatusChange: (id: string, newStatus: string) => void;
}

function StatusDropdown({ propertyId, currentStatus, onStatusChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const current = STATUS_OPTIONS.find(s => s.value === currentStatus) ?? STATUS_OPTIONS[0];

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = async (value: string) => {
    if (value === currentStatus) { setOpen(false); return; }
    setSaving(true);
    setOpen(false);

    /* optimistic update */
    onStatusChange(propertyId, value);

    const { error } = await supabase
      .from('listings')
      .update({ status: value, updated_at: new Date().toISOString() })
      .eq('id', propertyId);

    setSaving(false);

    if (error) {
      /* revert on failure */
      onStatusChange(propertyId, currentStatus);
      setToast('Failed to update status');
    } else {
      const label = STATUS_OPTIONS.find(s => s.value === value)?.label ?? value;
      setToast(`Status \u2192 ${label}`);
    }

    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div ref={ref} className="relative">
      {/* Toast */}
      {toast && (
        <div className="absolute -top-8 right-0 z-50 bg-primary text-white text-[10px] font-roboto px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm animate-fade-in">
          {toast}
        </div>
      )}

      {/* Trigger badge */}
      <button
        onClick={() => setOpen(v => !v)}
        disabled={saving}
        title="Change status"
        className={`
          flex items-center gap-1 text-[10px] font-roboto font-semibold px-2 py-0.5 rounded-full
          ${current.bg} transition-all cursor-pointer whitespace-nowrap
          hover:ring-1 hover:ring-offset-1 hover:ring-accent/20
          ${saving ? 'opacity-50' : ''}
        `}
        style={{ color: current.color }}
      >
        {saving ? (
          <i className="ri-loader-4-line animate-spin text-[9px]" />
        ) : (
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: current.color }}
          />
        )}
        {current.label}
        <i className="ri-arrow-down-s-line text-[10px] opacity-60" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden w-36 py-1">
          <p className="text-[9px] font-roboto font-semibold text-text-gray uppercase tracking-widest px-3 pt-1.5 pb-1">
            Set status
          </p>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-roboto
                hover:bg-gray-50 transition-colors cursor-pointer
                ${opt.value === currentStatus ? 'font-semibold' : 'text-gray-600'}
              `}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: opt.color }}
              />
              <span style={{ color: opt.value === currentStatus ? opt.color : undefined }}>
                {opt.label}
              </span>
              {opt.value === currentStatus && (
                <i className="ri-check-line ml-auto text-[10px]" style={{ color: opt.color }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* \u2014\u2014 Main component \u2014\u2014 */
export default function DashboardPropertiesSnapshot({ properties: initialProperties }: Props) {
  const [properties, setProperties] = useState<RecentProperty[]>(initialProperties);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  /* keep in sync if parent re-fetches */
  useEffect(() => { setProperties(initialProperties); }, [initialProperties]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setProperties(prev =>
      prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#e8edf2] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8edf2] bg-[#0d5959]/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0d5959]/10 rounded-lg flex items-center justify-center">
              <i className="ri-building-2-line text-accent text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary font-roboto">Recent Properties</h3>
              <p className="text-[11px] text-text-gray font-roboto">Latest additions to the portfolio</p>
            </div>
          </div>
          <Link
            to="/admin/listings"
            className="flex items-center gap-1 text-xs font-roboto font-medium text-accent hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
          >
            View all
            <i className="ri-arrow-right-line text-xs" />
          </Link>
        </div>

        {/* Property rows */}
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-14 h-14 bg-[#0d5959]/5 rounded-full flex items-center justify-center mb-4">
              <i className="ri-building-2-line text-2xl text-accent/15" />
            </div>
            <p className="text-sm font-roboto text-text-gray mb-1">No properties yet</p>
            <Link
              to="/admin/listings/new"
              className="text-xs font-roboto text-accent hover:underline cursor-pointer"
            >
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {properties.map((prop) => {
              const purpose = purposeMeta[prop.purpose] ?? { label: prop.purpose, color: '#7A7A7A' };
              return (
                <div
                  key={prop.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[#0d5959]/3 transition-colors group"
                >
                  {/* Thumbnail with quick-view overlay */}
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {prop.cover_image ? (
                      <img
                        src={prop.cover_image}
                        alt={prop.title}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="ri-building-2-line text-gray-300 text-lg" />
                      </div>
                    )}
                    {prop.slug && (
                      <button
                        onClick={() => setPreviewSlug(prop.slug)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Quick preview"
                      >
                        <i className="ri-eye-line text-white text-sm" />
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/admin/listings/${prop.id}`}
                      className="text-sm font-roboto font-medium text-primary truncate block hover:text-accent transition-colors cursor-pointer"
                    >
                      {prop.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-roboto text-text-gray truncate">
                        {prop.location ?? prop.property_type ?? '\u2014'}
                      </span>
                      <span className="text-gray-200">\u00b7</span>
                      <span className="text-[11px] font-roboto" style={{ color: purpose.color }}>
                        {purpose.label}
                      </span>
                    </div>
                  </div>

                  {/* Price + inline status edit + actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Price */}
                    <p className="text-sm font-roboto font-semibold text-primary hidden sm:block">
                      {formatPrice(prop.price, prop.currency)}
                    </p>

                    {/* Inline status dropdown */}
                    <StatusDropdown
                      propertyId={prop.id}
                      currentStatus={prop.status}
                      onStatusChange={handleStatusChange}
                    />

                    {/* Time ago */}
                    <span className="text-[10px] font-roboto text-text-gray hidden md:block">
                      {timeAgo(prop.created_at)}
                    </span>

                    {/* Quick-view eye button */}
                    {prop.slug && (
                      <button
                        onClick={() => setPreviewSlug(prop.slug)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8edf2] text-text-gray hover:text-accent hover:border-accent/20 hover:bg-[#0d5959]/3 opacity-0 group-hover:opacity-100 transition-all cursor-pointer whitespace-nowrap shrink-0"
                        title="Quick preview"
                      >
                        <i className="ri-eye-line text-sm" />
                      </button>
                    )}

                    {/* Edit link */}
                    <Link
                      to={`/admin/listings/${prop.id}`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8edf2] text-text-gray hover:text-accent hover:border-accent/20 hover:bg-[#0d5959]/3 opacity-0 group-hover:opacity-100 transition-all cursor-pointer whitespace-nowrap shrink-0"
                      title="Edit property"
                    >
                      <i className="ri-pencil-line text-sm" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        <div className="px-5 py-3 border-t border-[#e8edf2] bg-[#0d5959]/3">
          <Link
            to="/admin/listings/new"
            className="flex items-center justify-center gap-2 text-xs font-roboto font-medium text-accent hover:text-primary transition-colors cursor-pointer"
          >
            <i className="ri-add-circle-line" />
            Add new property
          </Link>
        </div>
      </div>

      {/* Quick-view modal */}
      {previewSlug && (
        <PropertyPreviewModal
          slug={previewSlug}
          onClose={() => setPreviewSlug(null)}
        />
      )}
    </>
  );
}