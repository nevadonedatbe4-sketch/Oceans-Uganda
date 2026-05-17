import { useState } from 'react';
import { Listing, STATUSES, CURRENCIES } from '@/pages/admin/listings/types';

interface QuickEditModalProps {
  listing: Listing;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Listing>) => Promise<void>;
}

export default function QuickEditModal({ listing, onClose, onSave }: QuickEditModalProps) {
  const [price, setPrice] = useState(listing.price?.toString() ?? '');
  const [currency, setCurrency] = useState(listing.currency ?? 'USD');
  const [status, setStatus] = useState(listing.status ?? 'available');
  const [featured, setFeatured] = useState(listing.featured ?? false);
  const [priceNote, setPriceNote] = useState(listing.price_note ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(listing.id, {
      price: price ? parseFloat(price) : null,
      currency,
      status,
      featured,
      price_note: priceNote || null,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:w-[460px] mx-0 sm:mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Quick Edit</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px] sm:max-w-[320px]">{listing.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
            <i className="ri-close-line text-base sm:text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-3 sm:space-y-4">
          {/* Price row */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Price</label>
            <div className="flex gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-24 border border-gray-200 rounded-md px-2 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b8965a] cursor-pointer"
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b8965a]"
              />
            </div>
          </div>

          {/* Price note */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Price Note <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="text"
              value={priceNote}
              onChange={(e) => setPriceNote(e.target.value)}
              placeholder="e.g. per month, negotiable"
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#b8965a]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`py-2 px-3 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    status === s.value
                      ? 'bg-[#0d1f2d] text-white border-[#0d1f2d]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-[#f7f5f0] rounded-lg">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#b8965a]/10 text-[#b8965a]">
                <i className="ri-star-line text-base" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-700">Featured Listing</p>
                <p className="text-xs text-gray-400">Highlighted in search results</p>
              </div>
            </div>
            <button
              onClick={() => setFeatured(!featured)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${featured ? 'bg-[#b8965a]' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${featured ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-2.5 border border-gray-200 rounded-md text-xs sm:text-sm text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 sm:py-2.5 bg-[#0d1f2d] text-white rounded-md text-xs sm:text-sm font-medium hover:bg-[#1a3347] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin" /> Saving…
              </span>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
