import { RecentLead, RecentDeal, RecentProperty } from '../page';

interface Props {
  leads: RecentLead[];
  deals: RecentDeal[];
  properties: RecentProperty[];
}

interface ActivityItem {
  id: string;
  type: 'lead' | 'deal' | 'property';
  title: string;
  subtitle: string;
  time: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function DashboardActivityFeed({ leads, deals, properties }: Props) {
  const activities: ActivityItem[] = [
    ...leads.map((l) => ({
      id: `lead-${l.id}`,
      type: 'lead' as const,
      title: l.lead_name,
      subtitle: `New lead \u00b7 ${l.stage}`,
      time: l.created_at,
      icon: 'ri-user-received-line',
      iconBg: 'bg-[#0d5959]/8',
      iconColor: 'text-accent',
    })),
    ...deals.map((d) => ({
      id: `deal-${d.id}`,
      type: 'deal' as const,
      title: d.client_name,
      subtitle: `Deal \u00b7 ${d.stage.replace('_', ' ')}`,
      time: d.created_at,
      icon: 'ri-shake-hands-line',
      iconBg: 'bg-[#001731]/8',
      iconColor: 'text-primary',
    })),
    ...properties.map((p) => ({
      id: `prop-${p.id}`,
      type: 'property' as const,
      title: p.title,
      subtitle: `Property added \u00b7 ${p.status}`,
      time: p.created_at,
      icon: 'ri-building-2-line',
      iconBg: 'bg-[#0d5959]/8',
      iconColor: 'text-accent',
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 12);

  return (
    <div className="bg-white rounded-xl border border-[#e8edf2] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-4 border-b border-[#e8edf2] bg-[#0d5959]/5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#0d5959]/10 rounded-lg flex items-center justify-center shrink-0">
          <i className="ri-pulse-line text-accent text-xs sm:text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-primary font-roboto">Activity Feed</h3>
          <p className="text-[10px] sm:text-[11px] text-text-gray font-roboto hidden sm:block">Recent events across the platform</p>
        </div>
        <span className="ml-auto text-[10px] font-roboto text-accent/50 font-medium">{activities.length} events</span>
      </div>

      {/* Feed */}
      {activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center px-5">
          <div className="w-10 h-10 bg-[#0d5959]/5 rounded-full flex items-center justify-center mb-3">
            <i className="ri-pulse-line text-lg text-accent/20" />
          </div>
          <p className="text-sm font-roboto text-text-gray">No activity yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-5 py-2 sm:py-3 space-y-0">
            {activities.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2.5 sm:gap-3 py-2 sm:py-3 relative border-b border-[#F5F5F5] last:border-0">
                {index < activities.length - 1 && (
                  <div className="absolute left-[15px] sm:left-[19px] top-9 sm:top-10 bottom-0 w-px bg-[#0d5959]/8 hidden sm:block" />
                )}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${item.iconBg}`}>
                  <i className={`${item.icon} text-[10px] sm:text-xs ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] sm:text-sm font-roboto font-medium text-primary truncate leading-tight">{item.title}</p>
                  <p className="text-[10px] sm:text-[11px] font-roboto text-text-gray capitalize truncate">{item.subtitle}</p>
                </div>
                <span className="text-[9px] sm:text-[10px] font-roboto text-accent/25 whitespace-nowrap shrink-0">{timeAgo(item.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-[#e8edf2] bg-[#0d5959]/3">
        <p className="text-[10px] font-roboto text-accent/40 text-center">
          Showing last {activities.length} events
        </p>
      </div>
    </div>
  );
}