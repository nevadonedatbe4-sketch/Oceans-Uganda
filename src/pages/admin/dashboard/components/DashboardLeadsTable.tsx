import { Link } from 'react-router-dom';
import { RecentLead } from '../page';

interface Props {
  leads: RecentLead[];
}

const stageMeta: Record<string, { label: string; color: string; bg: string }> = {
  new:          { label: 'New',          color: '#0d5959', bg: 'bg-[#0d5959]/8' },
  contacted:    { label: 'Contacted',    color: '#001731', bg: 'bg-[#001731]/8' },
  viewing:      { label: 'Viewing',      color: '#0d5959', bg: 'bg-[#0d5959]/8' },
  negotiating:  { label: 'Negotiating',  color: '#001731', bg: 'bg-[#001731]/8' },
  won:          { label: 'Won',          color: '#0d5959', bg: 'bg-[#0d5959]/8' },
  lost:         { label: 'Lost',         color: '#7A7A7A', bg: 'bg-[#7A7A7A]/8' },
  archived:     { label: 'Archived',     color: '#7A7A7A', bg: 'bg-[#7A7A7A]/8' },
};

function StageBadge({ stage }: { stage: string }) {
  const meta = stageMeta[stage] ?? { label: stage, color: '#0d5959', bg: 'bg-[#0d5959]/8' };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-roboto font-semibold rounded-full ${meta.bg}`}
      style={{ color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const AVATAR_COLORS = [
  'bg-[#0d5959]/10 text-accent',
  'bg-[#001731]/10 text-primary',
  'bg-[#0d5959]/10 text-accent',
  'bg-[#001731]/10 text-primary',
  'bg-[#7A7A7A]/10 text-text-gray',
];

export default function DashboardLeadsTable({ leads }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#e8edf2] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8edf2] bg-[#0d5959]/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0d5959]/10 rounded-lg flex items-center justify-center">
            <i className="ri-user-received-line text-accent text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary font-roboto">Recent Leads</h3>
            <p className="text-[11px] text-text-gray font-roboto">Latest inquiries from the site</p>
          </div>
        </div>
        <Link
          to="/admin/leads"
          className="flex items-center gap-1 text-xs font-roboto font-medium text-accent hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
        >
          View all
          <i className="ri-arrow-right-line text-xs" />
        </Link>
      </div>

      {/* Content */}
      {leads.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-14 h-14 bg-[#0d5959]/5 rounded-full flex items-center justify-center mb-4">
            <i className="ri-user-received-line text-2xl text-accent/15" />
          </div>
          <p className="text-sm font-roboto text-text-gray mb-1">No leads yet</p>
          <p className="text-xs font-roboto text-[#aaa]">Leads from contact forms will appear here</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="text-left text-[10px] font-roboto font-semibold text-text-gray uppercase tracking-wider px-5 py-3">Lead</th>
                <th className="text-left text-[10px] font-roboto font-semibold text-text-gray uppercase tracking-wider px-3 py-3 hidden sm:table-cell">Source</th>
                <th className="text-left text-[10px] font-roboto font-semibold text-text-gray uppercase tracking-wider px-3 py-3">Stage</th>
                <th className="text-left text-[10px] font-roboto font-semibold text-text-gray uppercase tracking-wider px-3 py-3 pr-5 hidden md:table-cell">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f8]">
              {leads.map((lead, i) => (
                <tr key={lead.id} className="hover:bg-[#0d5959]/3 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold font-roboto ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {lead.lead_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-roboto font-medium text-primary truncate">{lead.lead_name}</p>
                        <p className="text-[11px] font-roboto text-text-gray truncate max-w-[160px]">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 hidden sm:table-cell">
                    <span className="text-xs font-roboto text-text-gray truncate max-w-[120px] block">
                      {lead.source_page ? lead.source_page.replace('/property/', '').replace('/admin/', '') : '\u2014'}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <StageBadge stage={lead.stage} />
                  </td>
                  <td className="px-3 py-3.5 pr-5 hidden md:table-cell">
                    <span className="text-[11px] font-roboto text-text-gray whitespace-nowrap">{timeAgo(lead.created_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}