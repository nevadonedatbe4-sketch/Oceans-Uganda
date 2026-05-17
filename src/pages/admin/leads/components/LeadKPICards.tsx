import { useMemo } from 'react';
import type { Lead } from '../types';

interface Props {
  leads: Lead[];
  activeFilter: string;
  onFilterChange: (f: string) => void;
}

export default function LeadKPICards({ leads, activeFilter, onFilterChange }: Props) {
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const today = now.toISOString().split('T')[0];

    const tourRequests = leads.filter((l) => l.inquiry_type === 'tour').length;
    const infoInquiries = leads.filter((l) => l.inquiry_type === 'info' || !l.inquiry_type).length;
    const newThisWeek = leads.filter((l) => new Date(l.created_at) >= weekAgo).length;
    const overdueFollowUp = leads.filter(
      (l) =>
        l.follow_up_date &&
        l.follow_up_date < today &&
        l.stage !== 'won' &&
        l.stage !== 'lost' &&
        l.stage !== 'archived'
    ).length;
    const unread = leads.filter((l) => l.stage === 'new').length;
    const wonLeads = leads.filter((l) => l.stage === 'won').length;

    return { tourRequests, infoInquiries, newThisWeek, overdueFollowUp, unread, wonLeads };
  }, [leads]);

  const cards = [
    {
      key: 'all',
      label: 'All Inquiries',
      value: leads.length,
      icon: 'ri-inbox-line',
      iconBg: 'bg-[#0D5959]/8',
      iconColor: 'text-[#001731]',
      accent: '#001731',
    },
    {
      key: 'tour',
      label: 'Tour Requests',
      value: stats.tourRequests,
      icon: 'ri-calendar-check-line',
      iconBg: 'bg-[#0D5959]/8',
      iconColor: 'text-[#0D5959]',
      accent: '#0D5959',
    },
    {
      key: 'info',
      label: 'Info Inquiries',
      value: stats.infoInquiries,
      icon: 'ri-mail-line',
      iconBg: 'bg-[#001731]/8',
      iconColor: 'text-[#001731]',
      accent: '#001731',
    },
    {
      key: 'new',
      label: 'Unread / New',
      value: stats.unread,
      icon: 'ri-notification-badge-line',
      iconBg: 'bg-[#0D5959]/8',
      iconColor: 'text-[#0D5959]',
      accent: '#0D5959',
      highlight: stats.unread > 0,
    },
    {
      key: 'overdue',
      label: 'Overdue Follow-ups',
      value: stats.overdueFollowUp,
      icon: 'ri-alarm-warning-line',
      iconBg: 'bg-[#001731]/8',
      iconColor: 'text-[#001731]',
      accent: '#001731',
      highlight: stats.overdueFollowUp > 0,
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      {cards.map((card) => {
        const isActive = activeFilter === card.key;
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onFilterChange(card.key)}
            className={`text-left bg-white rounded-lg p-2.5 sm:p-4 border transition-all cursor-pointer ${
              isActive
                ? 'border-stone-800 ring-1 ring-stone-800/10'
                : card.highlight
                ? 'border-stone-300 hover:border-stone-400'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-jost text-[10px] text-stone-400 font-semibold uppercase tracking-wider leading-none mb-1 sm:mb-2 truncate">
                  {card.label}
                </p>
                <p
                  className="text-xl sm:text-2xl font-bold leading-none"
                  style={{ color: isActive ? card.accent : '#1c1917' }}
                >
                  {card.value}
                </p>
              </div>
              <div className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg shrink-0 ${card.iconBg}`}>
                <i className={`${card.icon} text-sm sm:text-base ${card.iconColor}`} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
