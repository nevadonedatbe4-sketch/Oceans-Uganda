import { Link } from 'react-router-dom';
import { RecentDeal, DashboardStats } from '../page';

interface Props {
  deals: RecentDeal[];
  stats: DashboardStats | null;
}

const DEAL_STAGES: { key: string; label: string; color: string }[] = [
  { key: 'prospect',      label: 'Prospect',      color: '#001731' },
  { key: 'negotiation',   label: 'Negotiation',   color: '#002349' },
  { key: 'offer',         label: 'Offer',         color: '#0d5959' },
  { key: 'due_diligence', label: 'Due Diligence', color: '#0d5959' },
  { key: 'closed_won',    label: 'Closed Won',    color: '#0d5959' },
  { key: 'closed_lost',   label: 'Closed Lost',   color: '#7A7A7A' },
];

function formatCurrency(val: number | null): string {
  if (!val) return '\u2014';
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function DashboardDealsPanel({ deals, stats }: Props) {
  const winRate = stats && stats.totalDeals > 0
    ? Math.round((stats.wonDeals / stats.totalDeals) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-[#e8edf2] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8edf2] bg-[#0d5959]/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0d5959]/10 rounded-lg flex items-center justify-center">
            <i className="ri-shake-hands-line text-accent text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary font-roboto">Deals Pipeline</h3>
            <p className="text-[11px] text-text-gray font-roboto">{stats?.dealsInPipeline ?? 0} open deals</p>
          </div>
        </div>
        <Link
          to="/admin/deals"
          className="flex items-center gap-1 text-xs font-roboto font-medium text-accent hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
        >
          View all
          <i className="ri-arrow-right-line text-xs" />
        </Link>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 gap-px bg-[#e8edf2] border-b border-[#e8edf2]">
        <div className="bg-white px-4 py-3 text-center">
          <p className="text-xl font-prata text-primary">{formatCurrency(stats?.pipelineValue ?? 0)}</p>
          <p className="text-[10px] font-roboto text-text-gray mt-0.5">Pipeline Value</p>
        </div>
        <div className="bg-white px-4 py-3 text-center">
          <p className="text-xl font-prata text-accent">{winRate}%</p>
          <p className="text-[10px] font-roboto text-text-gray mt-0.5">Win Rate</p>
        </div>
      </div>

      {/* Stage breakdown bar */}
      {stats && stats.totalDeals > 0 && (
        <div className="px-5 py-4 border-b border-[#f0f4f8]">
          <p className="text-[10px] font-roboto font-semibold text-text-gray uppercase tracking-wider mb-3">Stage Breakdown</p>
          <div className="flex h-2 rounded-full overflow-hidden gap-px">
            {DEAL_STAGES.map((s) => (
              <div
                key={s.key}
                className="h-full rounded-sm"
                style={{ backgroundColor: s.color, width: `${100 / DEAL_STAGES.length}%` }}
                title={s.label}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
            {DEAL_STAGES.slice(0, 4).map((s) => (
              <div key={s.key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] font-roboto text-text-gray">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent deals list */}
      <div className="flex-1 overflow-y-auto">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-5">
            <div className="w-12 h-12 bg-[#0d5959]/5 rounded-full flex items-center justify-center mb-3">
              <i className="ri-shake-hands-line text-xl text-accent/15" />
            </div>
            <p className="text-sm font-roboto text-text-gray mb-1">No deals yet</p>
            <p className="text-xs font-roboto text-[#aaa]">Create your first deal to track pipeline</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0f4f8]">
            {deals.map((deal) => {
              const stage = DEAL_STAGES.find((s) => s.key === deal.stage);
              return (
                <div key={deal.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#0d5959]/3 transition-colors">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: stage?.color ?? '#0d5959' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-roboto font-medium text-primary truncate">{deal.client_name}</p>
                    <p className="text-[11px] font-roboto text-text-gray">{stage?.label ?? deal.stage}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-roboto font-semibold text-primary">{formatCurrency(deal.expected_value)}</p>
                    <p className="text-[10px] font-roboto text-text-gray">{timeAgo(deal.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}