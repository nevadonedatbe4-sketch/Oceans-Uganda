import { useState } from 'react';
import { Listing } from '@/pages/admin/listings/types';

interface AddNotesModalProps {
  listing: Listing;
  onClose: () => void;
  onSave: (id: string, notes: string) => Promise<void>;
}

export default function AddNotesModal({ listing, onClose, onSave }: AddNotesModalProps) {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!notes.trim()) return;
    setSaving(true);
    await onSave(listing.id, notes.trim());
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:w-[460px] mx-0 sm:mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Add Internal Notes</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px] sm:max-w-[320px]">{listing.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
            <i className="ri-close-line text-base sm:text-lg" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Note</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 500))}
            placeholder="Add a private note about this property (visible to admins only)…"
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#b8965a] resize-none"
          />
          <p className="text-right text-xs text-gray-400 mt-1">{notes.length}/500</p>
          <div className="mt-3 flex items-start gap-2 px-3 py-2.5 bg-amber-50 rounded-lg">
            <i className="ri-lock-line text-amber-500 text-sm mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">Internal notes are only visible to admins and are not shown to the public.</p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2 sm:py-2.5 border border-gray-200 rounded-md text-xs sm:text-sm text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !notes.trim()}
            className="flex-1 py-2 sm:py-2.5 bg-[#0d1f2d] text-white rounded-md text-xs sm:text-sm font-medium hover:bg-[#1a3347] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            {saving ? <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin" /> Saving…</span> : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
}
