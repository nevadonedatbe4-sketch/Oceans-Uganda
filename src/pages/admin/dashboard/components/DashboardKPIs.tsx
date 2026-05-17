import { Link } from 'react-router-dom';
import { DashboardStats } from '../page';

interface Props {
  stats: DashboardStats;
}

function formatValue(value: number, isCurrency?: boolean): string {
  if (isCurrency) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value}`;
  }
  return String(value);
}

interface KPICardProps {
  label: string;
  value: string;
  sub: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend?: { value: string; up: boolean };
  link: string;
  accentBar: string;
}

function KPICard({ label, value, sub, icon, iconBg, iconColor, trend, link, accentBar }: KPICardProps) {
  return (
    <Link
      to={link}
      className="bg-white rounded-xl border border-[#e8edf2] p-3 sm:p-5 hover:border-accent/15 transition-all cursor-pointer group flex flex-col gap-2 sm:gap-4 overflow-hidden relative"
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentBar}`} />
      <div className="flex items-start justify-between">
        <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <i className={`${icon} text-base sm:text-xl ${iconColor}`} />
        </div>
        <i className="ri-arrow-right-up-line text-xs text-[#ddd] group-hover:text-accent/50 transition-colors hidden sm:block" />
      </div>
      <div>
        <p className="text-[22px] sm:text-[28px] font-prata text-primary leading-none mb-0.5 sm:mb-1">{value}</p>
        <p className="text-[10px] sm:text-xs font-roboto text-text-gray leading-tight">{label}</p>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-[#F5F5F5]">
        <span className="text-[10px] sm:text-[11px] font-roboto text-text-gray truncate">{sub}</span>
        {trend && (
          <span className={`hidden sm:flex items-center gap-0.5 text-[11px] font-roboto font-medium shrink-0 ml-1 ${trend.up ? 'text-accent' : 'text-text-gray'}`}>
            <i className={trend.up ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} />
            {trend.value}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function DashboardKPIs({ stats }: Props) {
  const cards: KPICardProps[] = [
    {
      label: 'Total Properties',
      value: String(stats.totalProperties),
      sub: `${stats.activeProperties} active \u00b7 ${stats.featuredProperties} featured`,
      icon: 'ri-building-2-line',
      iconBg: 'bg-[#0d5959]/8',
      iconColor: 'text-accent',
      accentBar: 'bg-accent',
      link: '/admin/listings',
    },
    {
      label: 'Active Leads',
      value: String(stats.openLeads),
      sub: `${stats.newLeadsWeek} new this week \u00b7 ${stats.totalLeads} total`,
      icon: 'ri-user-received-line',
      iconBg: 'bg-[#0d5959]/8',
      iconColor: 'text-accent',
      accentBar: 'bg-accent/70',
      trend: stats.newLeadsWeek > 0 ? { value: `+${stats.newLeadsWeek} this week`, up: true } : undefined,
      link: '/admin/leads',
    },
    {
      label: 'Deals in Pipeline',
      value: String(stats.dealsInPipeline),
      sub: `${stats.wonDeals} closed \u00b7 ${stats.totalDeals} total`,
      icon: 'ri-shake-hands-line',
      iconBg: 'bg-[#001731]/8',
      iconColor: 'text-primary',
      accentBar: 'bg-primary',
      link: '/admin/deals',
    },
    {
      label: 'Pipeline Value',
      value: formatValue(stats.pipelineValue, true),
      sub: `Across ${stats.dealsInPipeline} open deals`,
      icon: 'ri-money-dollar-circle-line',
      iconBg: 'bg-[#001731]/8',
      iconColor: 'text-primary',
      accentBar: 'bg-primary/70',
      link: '/admin/deals',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  );
}