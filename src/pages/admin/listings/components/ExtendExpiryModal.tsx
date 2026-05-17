import { useState } from 'react';
import { Listing } from '@/pages/admin/listings/types';

interface ExtendExpiryModalProps {
  listing: Listing;
  onClose: () => void;
  onSave: (id: string, expiryDate: string) => Promise<void>;
}

const QUICK_OPTIONS = [
  { label: '+7 days', days: 7 },
  { label: '+30 days', days: 30 },
  { label: '+60 days', days: 60 },
  { label: '+90 days', days: 90 },
  { label: '+6 months', days: 180 },
  { label: '+1 year', days: 365 },
];

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function ExtendExpiryModal({ listing, onClose, onSave }: ExtendExpiryModalProps) {
  const [expiryDate, setExpiryDate] = useState(addDays(30));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(listing.id, expiryDate);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:w-[440px] mx-0 sm:mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Extend Expiry Date</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px] sm:max-w-[320px]">{listing.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
            <i className="ri-close-line text-base sm:text-lg" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-3 sm:space-y-4">
          {/* Quick options */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Quick Select</label>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_OPTIONS.map((opt) => {
                const val = addDays(opt.days);
                return (
                  <button
                    key={opt.label}
                    onClick={() => setExpiryDate(val)}
                    className={`py-2 px-3 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      expiryDate === val
                        ? 'bg-[#0d1f2d] text-white border-[#0d1f2d]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Custom Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b8965a] cursor-pointer"
            />
          </div>

          {/* Preview */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#f7f5f0] rounded-lg">
            <i className="ri-calendar-check-line text-[#b8965a] text-sm" />
            <p className="text-xs text-gray-600">
              Listing will expire on <strong>{new Date(expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2 sm:py-2.5 border border-gray-200 rounded-md text-xs sm:text-sm text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 sm:py-2.5 bg-[#0d1f2d] text-white rounded-md text-xs sm:text-sm font-medium hover:bg-[#1a3347] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            {saving ? <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin" /> Saving…</span> : 'Set Expiry Date'}
          </button>
        </div>
      </div>
    </div>
  );
}
