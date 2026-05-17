import type { Lead, LeadStage } from '../types';
import { STAGE_CONFIG, STAGE_ORDER } from '../types';

interface Props {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
}

export default function LeadStageBoard({ leads, onSelect }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const isOverdue = (lead: Lead) => {
    if (!lead.follow_up_date) return false;
    const today = new Date().toISOString().split('T')[0];
    return lead.follow_up_date < today && !['won', 'lost', 'archived'].includes(lead.stage);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGE_ORDER.map((stage: LeadStage) => {
        const config = STAGE_CONFIG[stage];
        const stageLeads = leads.filter((l) => l.stage === stage);
        return (
          <div key={stage} className="flex-shrink-0 w-64">
            {/* Column header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg ${config.bg}`}>
              <div className="flex items-center gap-2">
                <i className={`${config.icon} text-sm ${config.color}`}></i>
                <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
              </div>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/70 ${config.color}`}>
                {stageLeads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="bg-[#f5f5f5] rounded-b-lg border border-t-0 border-stone-200 min-h-[200px] p-2 space-y-2">
              {stageLeads.length === 0 && (
                <p className="text-center text-xs text-stone-300 py-8">No leads</p>
              )}
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelect(lead)}
                  className="bg-white border border-stone-200 rounded-lg p-3 cursor-pointer hover:border-[#0D5959]/30 transition-colors"
                >
                  <p className="font-medium text-stone-800 text-sm leading-tight">{lead.lead_name}</p>
                  {lead.listing && (
                    <p className="text-xs text-stone-400 mt-1 truncate">{lead.listing.title}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-stone-400">{formatDate(lead.created_at)}</span>
                    <div className="flex items-center gap-1">
                      {isOverdue(lead) && (
                        <span title="Follow-up overdue">
                          <i className="ri-alarm-warning-line text-[#001731] text-xs"></i>
                        </span>
                      )}
                      {lead.agent ? (
                        <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full max-w-[80px] truncate">
                          {lead.agent.full_name.split(' ')[0]}
                        </span>
                      ) : (
                        <span className="text-xs text-stone-300 italic">Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
