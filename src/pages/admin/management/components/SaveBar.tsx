interface Props {
  dirty: boolean;
  saving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  onSave: () => void;
  onReset: () => void;
}

export default function SaveBar({ dirty, saving, saveStatus, onSave, onReset }: Props) {
  return (
    <div
      className={`sticky bottom-0 z-10 transition-all duration-300 ${
        dirty || saveStatus !== 'idle' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm px-5 py-3 flex items-center justify-between gap-4 mx-1 mb-1">
        <div className="flex items-center gap-2">
          {saveStatus === 'success' && (
            <>
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-checkbox-circle-fill text-emerald-500" />
              </span>
              <span className="text-sm text-emerald-700 font-medium">Settings saved successfully</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <span className="w-5 h-5 flex items-center justify-center">
                <i className="ri-error-warning-fill text-red-500" />
              </span>
              <span className="text-sm text-red-700 font-medium">Failed to save — please try again</span>
            </>
          )}
          {saveStatus === 'idle' && dirty && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm text-stone-500">You have unsaved changes</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              type="button"
              onClick={onReset}
              disabled={saving}
              className="px-4 py-2 text-sm text-stone-600 border border-stone-200 rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={saving || !dirty}
            className="px-5 py-2 text-sm font-medium bg-[#1B4332] text-white rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <i className="ri-save-3-line text-sm" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
