import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Agent {
  id: string;
  full_name: string;
  photo_url: string | null;
}

interface BulkActionsToolbarProps {
  selectedIds: string[];
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkStatusChange: (status: string) => void;
  onBulkAssignAgent: (agentId: string) => void;
  onBulkFeature: (featured: boolean) => void;
  onBulkDelete: () => void;
  onBulkArchive: () => void;
  processing: boolean;
}

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available', icon: 'ri-checkbox-circle-line', color: 'text-emerald-600' },
  { value: 'hidden', label: 'Hidden', icon: 'ri-eye-off-line', color: 'text-gray-500' },
  { value: 'on_hold', label: 'On Hold', icon: 'ri-pause-circle-line', color: 'text-orange-500' },
  { value: 'sold', label: 'Sold', icon: 'ri-home-smile-line', color: 'text-gray-600' },
  { value: 'rented', label: 'Rented', icon: 'ri-key-2-line', color: 'text-amber-600' },
  { value: 'expired', label: 'Expired', icon: 'ri-time-line', color: 'text-orange-600' },
];

export default function BulkActionsToolbar({
  selectedIds,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkStatusChange,
  onBulkAssignAgent,
  onBulkFeature,
  onBulkDelete,
  onBulkArchive,
  processing,
}: BulkActionsToolbarProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoaded, setAgentsLoaded] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);

  const count = selectedIds.length;
  const allSelected = count === totalCount && totalCount > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
      if (agentRef.current && !agentRef.current.contains(e.target as Node)) setAgentOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadAgents = async () => {
    if (agentsLoaded) return;
    const { data } = await supabase.from('agents').select('id, full_name, photo_url').order('full_name');
    setAgents(data ?? []);
    setAgentsLoaded(true);
  };

  if (count === 0) return null;

  return (
    <div className="sticky top-0 z-30 animate-in slide-in-from-top-2 duration-200">
      <div className="bg-[#0d1f2d] text-white rounded-lg sm:rounded-xl px-2.5 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Selection info */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-[#D5A91C] rounded text-white shrink-0">
              <i className="ri-check-line text-[9px] sm:text-xs" />
            </div>
            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
              {count} selected
            </span>
          </div>

          <div className="h-3 sm:h-4 w-px bg-white/20" />

          <button
            onClick={allSelected ? onClearSelection : onSelectAll}
            className="text-[10px] sm:text-xs text-white/60 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            {allSelected ? 'Deselect' : `All ${totalCount}`}
          </button>

          <button
            onClick={onClearSelection}
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            title="Clear selection"
          >
            <i className="ri-close-line text-xs sm:text-sm" />
          </button>
        </div>

        <div className="h-3 sm:h-4 w-px bg-white/20 hidden sm:block" />

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap flex-1">

          {/* Change Status */}
          <div ref={statusRef} className="relative">
            <button
              onClick={() => { setStatusOpen((v) => !v); setAgentOpen(false); }}
              disabled={processing}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              <i className="ri-toggle-line text-xs sm:text-sm" />
              <span className="hidden sm:inline">Change Status</span>
              <span className="sm:hidden">Status</span>
              <i className={`ri-arrow-down-s-line text-xs sm:text-sm transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
            </button>
            {statusOpen && (
              <div className="absolute left-0 top-full mt-1.5 bg-white border border-[#e8edf2] rounded-xl shadow-xl w-48 py-1 z-50"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <div className="px-3 pt-2 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7a8a99]">Set status for {count} listings</span>
                </div>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onBulkStatusChange(opt.value); setStatusOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#0d1f2d] hover:bg-[#F5F5F5] cursor-pointer whitespace-nowrap"
                  >
                    <span className={`w-4 h-4 flex items-center justify-center ${opt.color}`}>
                      <i className={`${opt.icon} text-sm`} />
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assign Agent */}
          <div ref={agentRef} className="relative">
            <button
              onClick={() => { setAgentOpen((v) => !v); setStatusOpen(false); loadAgents(); }}
              disabled={processing}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              <i className="ri-user-settings-line text-xs sm:text-sm" />
              <span className="hidden sm:inline">Assign Agent</span>
              <span className="sm:hidden">Agent</span>
              <i className={`ri-arrow-down-s-line text-xs sm:text-sm transition-transform ${agentOpen ? 'rotate-180' : ''}`} />
            </button>
            {agentOpen && (
              <div className="absolute left-0 top-full mt-1.5 bg-white border border-[#e8edf2] rounded-xl shadow-xl w-52 py-1 z-50 max-h-64 overflow-y-auto"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <div className="px-3 pt-2 pb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7a8a99]">Assign to agent</span>
                </div>
                {!agentsLoaded ? (
                  <div className="flex items-center justify-center py-6 text-[#7a8a99]">
                    <i className="ri-loader-4-line animate-spin" />
                  </div>
                ) : agents.length === 0 ? (
                  <p className="text-xs text-[#7a8a99] px-3 py-3">No agents found</p>
                ) : (
                  agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => { onBulkAssignAgent(agent.id); setAgentOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#0d1f2d] hover:bg-[#F5F5F5] cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#0d1f2d] flex items-center justify-center shrink-0 overflow-hidden">
                        {agent.photo_url
                          ? <img src={agent.photo_url} alt={agent.full_name} className="w-full h-full object-cover object-top" />
                          : <span className="text-white text-[10px] font-semibold">{agent.full_name.charAt(0)}</span>
                        }
                      </div>
                      <span className="truncate text-xs">{agent.full_name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Mark Featured */}
          <button
            onClick={() => onBulkFeature(true)}
            disabled={processing}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <i className="ri-star-line text-xs sm:text-sm text-[#D5A91C]" />
            <span className="hidden sm:inline">Mark Featured</span>
            <span className="sm:hidden">Feature</span>
          </button>

          {/* Remove Featured */}
          <button
            onClick={() => onBulkFeature(false)}
            disabled={processing}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 hover:bg-white/20 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <i className="ri-star-off-line text-xs sm:text-sm text-white/50" />
            <span className="hidden sm:inline">Remove Featured</span>
            <span className="sm:hidden">Unfeature</span>
          </button>

          {/* Archive */}
          <button
            onClick={onBulkArchive}
            disabled={processing}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 hover:bg-amber-500/30 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <i className="ri-archive-line text-xs sm:text-sm text-amber-400" />
            <span className="hidden sm:inline">Archive</span>
            <span className="sm:hidden">Archive</span>
          </button>

          {/* Delete — danger */}
          <button
            onClick={onBulkDelete}
            disabled={processing}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium text-red-300 hover:text-red-200 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 ml-auto"
          >
            {processing
              ? <><i className="ri-loader-4-line animate-spin text-xs sm:text-sm" /> Processing…</>
              : <><i className="ri-delete-bin-line text-xs sm:text-sm" /> <span className="hidden sm:inline">Delete {count}</span><span className="sm:hidden">Delete</span></>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
