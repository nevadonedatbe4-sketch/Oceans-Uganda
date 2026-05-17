import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '@/pages/admin/listings/types';

interface ActionGroup {
  label: string;
  items: ActionItem[];
}

interface ActionItem {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
  warning?: boolean;
  disabled?: boolean;
  badge?: string;
}

interface PropertyActionsMenuProps {
  listing: Listing;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onQuickEdit: () => void;
  onAssignAgent: () => void;
  onAddNotes: () => void;
  onExtendExpiry: () => void;
  onToggleFeatured: () => void;
  onStatusChange: (status: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onTogglePinned: () => void;
  onToggleHideFromSearch: () => void;
  duplicating?: boolean;
}

export default function PropertyActionsMenu({
  listing,
  onClose,
  onQuickEdit,
  onAssignAgent,
  onAddNotes,
  onExtendExpiry,
  onToggleFeatured,
  onStatusChange,
  onDuplicate,
  onDelete,
  onArchive,
  onTogglePinned,
  onToggleHideFromSearch,
  duplicating,
}: PropertyActionsMenuProps) {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const slug = listing.slug || listing.id;
  const propertyUrl = `/property/${slug}`;

  const copyLink = () => {
    const url = `${window.location.origin}${propertyUrl}`;
    navigator.clipboard.writeText(url).then(() => {}).catch(() => {});
    onClose();
  };

  const shareWhatsApp = () => {
    const url = encodeURIComponent(`${window.location.origin}${propertyUrl}`);
    window.open(`https://wa.me/?text=${url}`, '_blank');
    onClose();
  };

  const shareEmail = () => {
    const url = `${window.location.origin}${propertyUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(listing.title)}&body=${encodeURIComponent(url)}`, '_blank');
    onClose();
  };

  const groups: ActionGroup[] = [
    {
      label: 'View & Performance',
      items: [
        {
          icon: 'ri-bar-chart-2-line',
          label: 'View Stats',
          onClick: () => { navigate(`/admin/listings/${listing.id}?tab=stats`); onClose(); },
        },
        {
          icon: 'ri-external-link-line',
          label: 'View Public Page',
          onClick: () => { window.open(propertyUrl, '_blank'); onClose(); },
        },
        {
          icon: 'ri-eye-line',
          label: 'Preview Listing',
          onClick: () => { window.open(`${propertyUrl}?preview=1`, '_blank'); onClose(); },
        },
        {
          icon: 'ri-mail-line',
          label: 'View Inquiries',
          onClick: () => { navigate(`/admin/leads?listing=${listing.id}`); onClose(); },
        },
      ],
    },
    {
      label: 'Edit & Management',
      items: [
        {
          icon: 'ri-edit-2-line',
          label: 'Edit Property',
          onClick: () => { navigate(`/admin/listings/${listing.id}`); onClose(); },
        },
        {
          icon: 'ri-flashlight-line',
          label: 'Quick Edit',
          onClick: () => { onQuickEdit(); onClose(); },
        },
        {
          icon: 'ri-file-copy-line',
          label: duplicating ? 'Duplicating…' : 'Duplicate Listing',
          onClick: () => { onDuplicate(); onClose(); },
          disabled: duplicating,
        },
        {
          icon: 'ri-image-2-line',
          label: 'Edit Media Only',
          onClick: () => { navigate(`/admin/listings/${listing.id}?tab=media`); onClose(); },
        },
        {
          icon: 'ri-map-pin-2-line',
          label: 'Edit Location',
          onClick: () => { navigate(`/admin/listings/${listing.id}?tab=location`); onClose(); },
        },
        {
          icon: 'ri-search-eye-line',
          label: 'Edit SEO / Meta',
          onClick: () => { navigate(`/admin/listings/${listing.id}?tab=seo`); onClose(); },
        },
      ],
    },
    {
      label: 'Status Control',
      items: [
        ...(listing.status !== 'published' ? [{
          icon: 'ri-checkbox-circle-line',
          label: 'Publish / Go Live',
          onClick: () => { onStatusChange('published'); onClose(); },
        }] : []),
        ...(listing.status !== 'archived' ? [{
          icon: 'ri-archive-line',
          label: 'Archive',
          onClick: () => { onStatusChange('archived'); onClose(); },
          warning: true,
        }] : []),
        {
          icon: 'ri-pause-circle-line',
          label: 'Put On Hold',
          onClick: () => { onStatusChange('on_hold'); onClose(); },
          warning: listing.status === 'on_hold',
        },
        {
          icon: 'ri-home-smile-line',
          label: 'Mark as Sold',
          onClick: () => { onStatusChange('sold'); onClose(); },
          warning: listing.status === 'sold',
        },
        {
          icon: 'ri-key-2-line',
          label: 'Mark as Rented',
          onClick: () => { onStatusChange('rented'); onClose(); },
          warning: listing.status === 'rented',
        },
        {
          icon: 'ri-restart-line',
          label: 'Send to Review',
          onClick: () => { onStatusChange('pending_review'); onClose(); },
        },
        {
          icon: 'ri-close-circle-line',
          label: 'Reject',
          onClick: () => { onStatusChange('rejected'); onClose(); },
          danger: true,
        },
      ],
    },
    {
      label: 'Feature & Visibility',
      items: [
        {
          icon: listing.featured ? 'ri-star-fill' : 'ri-star-line',
          label: listing.featured ? 'Remove Featured' : 'Mark as Featured',
          onClick: () => { onToggleFeatured(); onClose(); },
          badge: listing.featured ? '★' : undefined,
        },
        {
          icon: 'ri-pushpin-line',
          label: 'Pin to Top',
          onClick: () => { onTogglePinned(); onClose(); },
        },
        {
          icon: 'ri-search-line',
          label: 'Hide from Search',
          onClick: () => { onToggleHideFromSearch(); onClose(); },
        },
        {
          icon: 'ri-home-4-line',
          label: 'Show in Homepage',
          onClick: () => { navigate('/admin/management/homepage'); onClose(); },
        },
      ],
    },
    {
      label: 'Media & Sharing',
      items: [
        {
          icon: 'ri-gallery-line',
          label: 'Open Gallery Manager',
          onClick: () => { navigate(`/admin/listings/${listing.id}?tab=media`); onClose(); },
        },
        {
          icon: 'ri-links-line',
          label: 'Copy Listing Link',
          onClick: copyLink,
        },
        {
          icon: 'ri-whatsapp-line',
          label: 'Share to WhatsApp',
          onClick: shareWhatsApp,
        },
        {
          icon: 'ri-mail-send-line',
          label: 'Share via Email',
          onClick: shareEmail,
        },
      ],
    },
    {
      label: 'CRM & Leads',
      items: [
        {
          icon: 'ri-inbox-line',
          label: 'View Leads',
          onClick: () => { navigate(`/admin/leads?listing=${listing.id}`); onClose(); },
        },
        {
          icon: 'ri-user-settings-line',
          label: 'Assign Agent',
          onClick: () => { onAssignAgent(); onClose(); },
        },
        {
          icon: 'ri-sticky-note-line',
          label: 'Add Internal Notes',
          onClick: () => { onAddNotes(); onClose(); },
        },
        {
          icon: 'ri-history-line',
          label: 'View Activity Log',
          onClick: () => { navigate(`/admin/listings/${listing.id}?tab=activity`); onClose(); },
        },
      ],
    },
    {
      label: 'Listing Settings',
      items: [
        {
          icon: 'ri-calendar-event-line',
          label: 'Extend Expiry Date',
          onClick: () => { onExtendExpiry(); onClose(); },
        },
      ],
    },
    {
      label: 'Danger Zone',
      items: [
        {
          icon: 'ri-archive-line',
          label: 'Archive Property',
          onClick: () => { onArchive(); onClose(); },
          warning: true,
        },
        {
          icon: 'ri-delete-bin-line',
          label: 'Delete Permanently',
          onClick: () => { onDelete(); onClose(); },
          danger: true,
        },
      ],
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-100 rounded-xl shadow-xl w-64 max-h-[80vh] overflow-y-auto"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      {groups.map((group, gi) => (
        <div key={group.label}>
          {gi > 0 && <div className="border-t border-gray-100 my-1" />}
          <div className="px-3 pt-2 pb-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{group.label}</span>
          </div>
          {group.items.map((item) => (
            <button
              key={item.label}
              onClick={item.disabled ? undefined : item.onClick}
              disabled={item.disabled}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${
                item.danger
                  ? 'text-red-500 hover:bg-red-50'
                  : item.warning
                  ? 'text-amber-600 hover:bg-amber-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center shrink-0 ${
                item.danger ? 'text-red-400' : item.warning ? 'text-amber-500' : 'text-gray-400'
              }`}>
                <i className={`${item.icon} text-sm`} />
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-[#b8965a]/10 text-[#b8965a] px-1.5 py-0.5 rounded-full font-medium">{item.badge}</span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
