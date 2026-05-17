import { useState } from 'react';
import type { Lead } from '../types';
import { STAGE_CONFIG } from '../types';

interface Props {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

type SortKey = 'created_at' | 'lead_name' | 'stage' | 'follow_up_date';

const INQUIRY_TYPE_CONFIG = {
  tour: {
    label: 'Tour',
    icon: 'ri-calendar-check-line',
    bg: 'bg-[#0D5959]/8',
    color: 'text-[#0D5959]',
    border: 'border-[#0D5959]/15',
  },
  info: {
    label: 'Info',
    icon: 'ri-mail-line',
    bg: 'bg-[#001731]/8',
    color: 'text-[#001731]',
    border: 'border-[#001731]/15',
  },
};

const AVATAR_COLORS = [
  'bg-[#0D5959]/10 text-[#0D5959]',
  'bg-[#001731]/10 text-[#001731]',
  'bg-stone-200 text-stone-600',
  'bg-[#0D5959]/10 text-[#0D5959]',
  'bg-[#001731]/10 text-[#001731]',
];

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(lead: Lead) {
  if (!lead.follow_up_date) return false;
  const today = new Date().toISOString().split('T')[0];
  return lead.follow_up_date < today && !['won', 'lost', 'archived'].includes(lead.stage);
}

/* ── Mobile card ─────────────────────────────────────────────────────────── */
interface MobileCardProps {
  lead: Lead;
  index: number;
  onSelect: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

function MobileLeadCard({ lead, index, onSelect, onDelete }: MobileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sc = STAGE_CONFIG[lead.stage];
  const itype = lead.inquiry_type === 'tour' ? INQUIRY_TYPE_CONFIG.tour : INQUIRY_TYPE_CONFIG.info;
  const isNew = lead.stage === 'new';
  const overdue = isOverdue(lead);
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div
      className={`relative px-3 py-3 border-b border-stone-100 last:border-0 transition-colors ${isNew ? 'bg-[#0D5959]/5' : 'bg-white'}`}
    >
      {/* New dot indicator */}
      {isNew && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#0D5959]" />
      )}

      {/* Row 1: avatar + name + time */}
      <div className="flex items-start gap-2.5" onClick={() => onSelect(lead)}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold uppercase ${avatarColor}`}>
          {lead.lead_name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + time */}
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-stone-800 truncate">{lead.lead_name}</p>
            <span className="text-[10px] text-stone-400 shrink-0">{timeAgo(lead.created_at)}</span>
          </div>

          {/* Email */}
          {lead.email && (
            <p className="text-[11px] text-stone-400 truncate mt-0.5">{lead.email}</p>
          )}

          {/* Badges row */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {/* Stage */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.color}`}>
              <i className={`${sc.icon} text-[9px]`} />
              {sc.label}
            </span>
            {/* Type */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${itype.bg} ${itype.color} ${itype.border}`}>
              <i className={`${itype.icon} text-[9px]`} />
              {itype.label}
            </span>
            {/* Property */}
            {(lead.listing?.title ?? lead.property_title) && (
              <span className="text-[10px] text-stone-400 truncate max-w-[120px]">
                {lead.listing?.title ?? lead.property_title}
              </span>
            )}
          </div>

          {/* Follow-up warning */}
          {overdue && (
            <p className="text-[10px] text-[#001731] mt-1 flex items-center gap-1">
              <i className="ri-alarm-warning-line" />
              Follow-up overdue · {formatDate(lead.follow_up_date)}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: quick-action buttons */}
      <div className="flex items-center gap-2 mt-2.5 pl-11">
        <button
          onClick={() => onSelect(lead)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-stone-600 bg-stone-100 rounded-md cursor-pointer hover:bg-stone-200 transition-colors whitespace-nowrap"
        >
          <i className="ri-eye-line text-xs" /> View
        </button>
        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-[#001731] bg-[#001731]/8 rounded-md cursor-pointer hover:bg-[#001731]/12 transition-colors whitespace-nowrap"
          >
            <i className="ri-phone-line text-xs" /> Call
          </a>
        )}
        {lead.email && (
          <a
            href={`mailto:${lead.email}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-[#0D5959] bg-[#0D5959]/8 rounded-md cursor-pointer hover:bg-[#0D5959]/12 transition-colors whitespace-nowrap"
          >
            <i className="ri-mail-send-line text-xs" /> Email
          </a>
        )}
        {/* More menu */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="w-7 h-7 flex items-center justify-center rounded-md text-stone-400 hover:bg-stone-100 cursor-pointer"
          >
            <i className="ri-more-2-fill text-sm" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 bottom-full mb-1 z-20 bg-white border border-stone-200 rounded-lg shadow-lg w-32 py-1 text-sm">
                <button
                  onClick={() => { onDelete(lead.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-[#001731]/5 flex items-center gap-2 text-[#001731] cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line text-xs" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function LeadsTable({ leads, onSelect, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...leads].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <i className="ri-arrow-up-down-line text-stone-300 text-xs ml-1" />;
    return <i className={`${sortDir === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} text-[#0D5959] text-xs ml-1`} />;
  };

  if (sorted.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-lg py-16 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 flex items-center justify-center bg-stone-100 rounded-full mb-3">
          <i className="ri-inbox-line text-xl text-stone-400" />
        </div>
        <p className="text-sm font-medium text-stone-500">No inquiries found</p>
        <p className="text-xs text-stone-400 mt-1">Adjust your filters or wait for new submissions</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">

        {/* ── Mobile card list ── */}
        <div className="sm:hidden">
          {sorted.map((lead, i) => (
            <MobileLeadCard
              key={lead.id}
              lead={lead}
              index={i}
              onSelect={onSelect}
              onDelete={(id) => setConfirmDelete(id)}
            />
          ))}
        </div>

        {/* ── Desktop table ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-[#f5f5f5]/80">
                <th className="text-left py-3 px-4 font-medium text-stone-500 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('lead_name')}>
                  Contact <SortIcon k="lead_name" />
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 whitespace-nowrap">Type</th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 whitespace-nowrap hidden lg:table-cell">Property</th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('stage')}>
                  Stage <SortIcon k="stage" />
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 whitespace-nowrap hidden lg:table-cell">Assigned</th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 cursor-pointer select-none whitespace-nowrap hidden md:table-cell" onClick={() => handleSort('follow_up_date')}>
                  Follow-up <SortIcon k="follow_up_date" />
                </th>
                <th className="text-left py-3 px-4 font-medium text-stone-500 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('created_at')}>
                  Received <SortIcon k="created_at" />
                </th>
                <th className="py-3 px-4 w-10" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((lead) => {
                const sc = STAGE_CONFIG[lead.stage];
                const itype = lead.inquiry_type === 'tour' ? INQUIRY_TYPE_CONFIG.tour : INQUIRY_TYPE_CONFIG.info;
                const isNew = lead.stage === 'new';
                const overdue = isOverdue(lead);

                return (
                  <tr
                    key={lead.id}
                    className={`border-b border-stone-100 hover:bg-[#0D5959]/3 cursor-pointer transition-colors ${isNew ? 'bg-[#0D5959]/3' : ''}`}
                    onClick={() => onSelect(lead)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-xs font-semibold text-stone-600 uppercase">
                          {lead.lead_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-stone-800 text-sm">{lead.lead_name}</p>
                            {isNew && <span className="w-1.5 h-1.5 rounded-full bg-[#0D5959] shrink-0" title="New" />}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lead.email && <p className="text-xs text-stone-400 truncate max-w-[140px]">{lead.email}</p>}
                            {lead.phone && <p className="text-xs text-stone-400 hidden sm:block">{lead.phone}</p>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${itype.bg} ${itype.color} ${itype.border}`}>
                        <i className={itype.icon} />
                        <span className="hidden sm:inline">{itype.label === 'Tour' ? 'Tour Request' : 'Info Inquiry'}</span>
                      </span>
                      {lead.inquiry_type === 'tour' && lead.tour_date && (
                        <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                          <i className="ri-calendar-line" />{lead.tour_date}{lead.tour_time && ` · ${lead.tour_time}`}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      {(lead.listing?.title ?? lead.property_title) ? (
                        <p className="text-xs text-stone-600 max-w-[160px] truncate">{lead.listing?.title ?? lead.property_title}</p>
                      ) : (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                        <i className={sc.icon} /> {sc.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      {lead.agent ? (
                        <p className="text-xs text-stone-600">{lead.agent.full_name}</p>
                      ) : lead.agent_name ? (
                        <p className="text-xs text-stone-500">{lead.agent_name}</p>
                      ) : (
                        <span className="text-xs text-stone-300">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      {lead.follow_up_date ? (
                        <span className={`text-xs font-medium ${overdue ? 'text-[#001731]' : 'text-stone-600'}`}>
                          {overdue && <i className="ri-alarm-warning-line mr-1" />}
                          {formatDate(lead.follow_up_date)}
                        </span>
                      ) : (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-stone-400 whitespace-nowrap">{timeAgo(lead.created_at)}</td>
                    <td className="py-3.5 px-4 relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenu(openMenu === lead.id ? null : lead.id)}
                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 text-stone-400 cursor-pointer"
                      >
                        <i className="ri-more-2-fill" />
                      </button>
                      {openMenu === lead.id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-stone-200 rounded-lg shadow-sm w-36 py-1 text-sm">
                          <button onClick={() => { onSelect(lead); setOpenMenu(null); }} className="w-full text-left px-3 py-2 hover:bg-[#f5f5f5] flex items-center gap-2 text-stone-600 cursor-pointer whitespace-nowrap">
                            <i className="ri-eye-line" /> View Details
                          </button>
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="w-full text-left px-3 py-2 hover:bg-[#f5f5f5] flex items-center gap-2 text-stone-600 cursor-pointer whitespace-nowrap">
                              <i className="ri-mail-send-line" /> Reply
                            </a>
                          )}
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="w-full text-left px-3 py-2 hover:bg-[#f5f5f5] flex items-center gap-2 text-stone-600 cursor-pointer whitespace-nowrap">
                              <i className="ri-phone-line" /> Call
                            </a>
                          )}
                          <button onClick={() => { setConfirmDelete(lead.id); setOpenMenu(null); }} className="w-full text-left px-3 py-2 hover:bg-[#001731]/5 flex items-center gap-2 text-[#001731] cursor-pointer whitespace-nowrap">
                            <i className="ri-delete-bin-line" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {openMenu && <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-6 w-full sm:w-80">
            <div className="w-10 h-10 bg-[#001731]/8 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-delete-bin-line text-[#001731] text-lg" />
            </div>
            <h3 className="font-semibold text-stone-800 text-base text-center">Delete Inquiry?</h3>
            <p className="text-sm text-stone-500 mt-2 text-center">
              This will permanently delete this inquiry. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-stone-200 rounded-md py-2.5 text-sm text-stone-600 hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
                className="flex-1 bg-[#001731] text-white rounded-md py-2.5 text-sm font-medium hover:bg-[#001731]/80 cursor-pointer whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
