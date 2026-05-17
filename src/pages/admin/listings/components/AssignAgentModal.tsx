import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Listing } from '@/pages/admin/listings/types';

interface Agent {
  id: string;
  full_name: string;
  title: string | null;
  photo_url: string | null;
}

interface AssignAgentModalProps {
  listing: Listing;
  onClose: () => void;
  onSave: (id: string, agentId: string | null) => Promise<void>;
}

export default function AssignAgentModal({ listing, onClose, onSave }: AssignAgentModalProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<string | null>(listing.agent_id ?? null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('agents').select('id, full_name, title, photo_url').order('full_name').then(({ data }) => {
      setAgents(data ?? []);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await onSave(listing.id, selected);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full sm:w-[440px] mx-0 sm:mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Assign Agent</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px] sm:max-w-[320px]">{listing.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
            <i className="ri-close-line text-base sm:text-lg" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-3 sm:py-4 max-h-[50vh] sm:max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <i className="ri-loader-4-line animate-spin text-xl" />
            </div>
          ) : (
            <div className="space-y-2">
              {/* Unassign option */}
              <button
                onClick={() => setSelected(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                  selected === null ? 'border-[#b8965a] bg-[#b8965a]/5' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 shrink-0">
                  <i className="ri-user-unfollow-line text-base" />
                </span>
                <span className="text-sm text-gray-500">Unassigned</span>
                {selected === null && <i className="ri-check-line text-[#b8965a] ml-auto" />}
              </button>

              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelected(agent.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors cursor-pointer ${
                    selected === agent.id ? 'border-[#b8965a] bg-[#b8965a]/5' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0d1f2d] shrink-0 flex items-center justify-center">
                    {agent.photo_url ? (
                      <img src={agent.photo_url} alt={agent.full_name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <span className="text-white text-sm font-semibold">{agent.full_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-800">{agent.full_name}</p>
                    {agent.title && <p className="text-xs text-gray-400">{agent.title}</p>}
                  </div>
                  {selected === agent.id && <i className="ri-check-line text-[#b8965a]" />}
                </button>
              ))}
            </div>
          )}
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
            {saving ? <span className="flex items-center justify-center gap-2"><i className="ri-loader-4-line animate-spin" /> Saving…</span> : 'Assign Agent'}
          </button>
        </div>
      </div>
    </div>
  );
}
