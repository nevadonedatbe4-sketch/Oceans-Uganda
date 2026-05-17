import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SavedSearch {
  id: string;
  name: string;
  criteria: Record<string, string | number | boolean>;
  resultCount: number;
  newResults: number;
  lastChecked: string;
  alertEnabled: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  createdAt: string;
}

const MOCK_SEARCHES: SavedSearch[] = [
  {
    id: 'ss-1',
    name: '3-4 Bed Rentals in Kololo',
    criteria: { purpose: 'Rent', bedrooms: '3–4', location: 'Kololo', maxPrice: 'UGX 4,000,000' },
    resultCount: 14,
    newResults: 3,
    lastChecked: '2026-04-14T08:00:00',
    alertEnabled: true,
    frequency: 'daily',
    createdAt: '2026-03-12',
  },
  {
    id: 'ss-2',
    name: 'For Sale — Naguru & Mbuya',
    criteria: { purpose: 'Sale', location: 'Naguru / Mbuya', minBed: '4', maxPrice: '$350,000' },
    resultCount: 8,
    newResults: 1,
    lastChecked: '2026-04-13T20:00:00',
    alertEnabled: true,
    frequency: 'weekly',
    createdAt: '2026-03-28',
  },
  {
    id: 'ss-3',
    name: 'Studio & 1-Bed Apartments',
    criteria: { purpose: 'Rent', bedrooms: '0–1', maxPrice: 'UGX 2,000,000', furnished: true },
    resultCount: 22,
    newResults: 0,
    lastChecked: '2026-04-14T06:00:00',
    alertEnabled: false,
    frequency: 'daily',
    createdAt: '2026-02-15',
  },
  {
    id: 'ss-4',
    name: 'Luxury Villas — All Areas',
    criteria: { purpose: 'Sale', minBed: '5', minPrice: '$500,000', features: 'Pool, Garden' },
    resultCount: 4,
    newResults: 0,
    lastChecked: '2026-04-10T12:00:00',
    alertEnabled: false,
    frequency: 'weekly',
    createdAt: '2026-01-20',
  },
  {
    id: 'ss-5',
    name: 'Commercial — Kampala Central',
    criteria: { purpose: 'Rent', type: 'Commercial', location: 'Kampala Central' },
    resultCount: 6,
    newResults: 2,
    lastChecked: '2026-04-14T07:30:00',
    alertEnabled: true,
    frequency: 'instant',
    createdAt: '2026-04-01',
  },
];

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

const FREQ_LABELS: Record<string, string> = {
  instant: 'Instant',
  daily: 'Daily',
  weekly: 'Weekly',
};

export default function AdminSavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>(MOCK_SEARCHES);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggleAlert = (id: string) => {
    setSearches((prev) => prev.map((s) => s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s));
  };

  const handleDelete = (id: string) => {
    setSearches((prev) => prev.filter((s) => s.id !== id));
    setConfirmDelete(null);
  };

  const buildSearchUrl = (search: SavedSearch): string => {
    const params = new URLSearchParams();
    const c = search.criteria;
    if (typeof c.purpose === 'string') params.set('purpose', c.purpose.toLowerCase());
    if (typeof c.location === 'string') params.set('location', c.location);
    return `/search?${params.toString()}`;
  };

  return (
    <div className="space-y-4 max-w-[960px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-jost font-bold text-[#0d1f2d]">Saved Searches</h1>
          <p className="text-xs text-[#7a8a99] mt-0.5 hidden sm:block">Stored search criteria with new listing alerts</p>
        </div>
        <Link
          to="/search"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#0d1f2d] text-white text-xs font-semibold rounded-lg hover:bg-[#1a3448] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-search-line" /> New Search
        </Link>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Saved Searches', value: searches.length, icon: 'ri-bookmark-3-line', color: '#2563eb' },
          { label: 'With Alerts', value: searches.filter((s) => s.alertEnabled).length, icon: 'ri-notification-3-line', color: '#0d1f2d' },
          { label: 'New Results', value: searches.reduce((a, s) => a + s.newResults, 0), icon: 'ri-building-2-line', color: '#059669' },
          { label: 'Total Matches', value: searches.reduce((a, s) => a + s.resultCount, 0), icon: 'ri-list-check-2', color: '#2563eb' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e8edf2] rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${stat.color}12` }}>
              <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-lg font-bold text-[#0d1f2d] leading-tight">{stat.value}</p>
              <p className="text-[10px] text-[#7a8a99] leading-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Searches list */}
      {searches.length === 0 ? (
        <div className="bg-white border border-[#e8edf2] rounded-xl py-16 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
            <i className="ri-bookmark-3-line text-xl text-blue-500" />
          </div>
          <p className="text-sm font-bold text-[#0d1f2d]">No saved searches</p>
          <p className="text-xs text-[#7a8a99] max-w-xs">Run a search on the property portal and save the criteria to track new listings.</p>
          <Link to="/search" className="mt-2 px-4 py-2 bg-[#0d1f2d] text-white text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap">
            Search Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {searches.map((search) => (
            <div key={search.id} className="bg-white border border-[#e8edf2] rounded-xl overflow-hidden hover:border-blue-200 transition-colors group">

              {/* ── TOP ROW: icon + name + badges + actions ── */}
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#f0f4f8]">
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <i className="ri-search-2-line text-blue-500 text-sm" />
                </div>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm font-bold text-[#0d1f2d] truncate">{search.name}</h3>
                    {search.newResults > 0 && (
                      <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-full shrink-0">
                        +{search.newResults} new
                      </span>
                    )}
                    {search.alertEnabled && (
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-semibold rounded-full flex items-center gap-0.5 shrink-0">
                        <i className="ri-notification-3-line text-[8px]" />
                        {FREQ_LABELS[search.frequency]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons — always visible at top */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Alert toggle */}
                  <button
                    onClick={() => toggleAlert(search.id)}
                    title={search.alertEnabled ? 'Disable alerts' : 'Enable alerts'}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      search.alertEnabled
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-[#f0f4f8] text-[#b0bec5] hover:bg-[#e8edf2] hover:text-[#0d1f2d]'
                    }`}
                  >
                    <i className={`${search.alertEnabled ? 'ri-notification-3-fill' : 'ri-notification-off-line'} text-xs`} />
                  </button>

                  {/* View results */}
                  <Link
                    to={buildSearchUrl(search)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-[11px] font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-external-link-line text-[10px]" /> View
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => setConfirmDelete(search.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-[#b0bec5] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <i className="ri-delete-bin-line text-xs" />
                  </button>
                </div>
              </div>

              {/* ── BOTTOM ROW: criteria chips + meta ── */}
              <div className="px-4 py-2.5">
                {/* Criteria chips */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {Object.entries(search.criteria).map(([key, val]) => (
                    <span key={key} className="px-2 py-0.5 bg-[#f0f4f8] text-[#3a4a5a] text-[10px] font-medium rounded-md capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}: {String(val)}
                    </span>
                  ))}
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 flex-wrap text-[10px] text-[#7a8a99]">
                  <span className="flex items-center gap-1">
                    <i className="ri-building-2-line" />{search.resultCount} listings
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line" />Checked {timeAgo(search.lastChecked)}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-calendar-line" />Saved {search.createdAt}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm">
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <i className="ri-delete-bin-line text-lg text-red-500" />
            </div>
            <h3 className="text-sm font-bold text-[#0d1f2d] text-center mb-1.5">Delete saved search?</h3>
            <p className="text-xs text-[#7a8a99] text-center mb-5">This action cannot be undone. Any alerts for this search will also be removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-[#e8edf2] text-[#0d1f2d] text-sm font-semibold rounded-lg hover:bg-[#f0f4f8] cursor-pointer transition-colors whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 cursor-pointer transition-colors whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
