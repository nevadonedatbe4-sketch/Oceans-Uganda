export type LeadStage =
  | 'new'
  | 'contacted'
  | 'viewing'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'archived';

export type InquiryType = 'tour' | 'info';

export interface Lead {
  id: string;
  lead_name: string;
  email: string | null;
  phone: string | null;
  listing_id: string | null;
  source_page: string | null;
  message: string | null;
  assigned_to: string | null;
  stage: LeadStage;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  // Inquiry enrichment
  inquiry_type: InquiryType | null;
  tour_date: string | null;
  tour_time: string | null;
  tour_type: string | null;
  property_title: string | null;
  agent_name: string | null;
  listing?: { id: string; title: string; slug: string } | null;
  agent?: { id: string; full_name: string } | null;
}

export interface AgentOption {
  id: string;
  full_name: string;
}

export interface LeadFiltersState {
  search: string;
  stage: LeadStage | 'all';
  assigned_to: string | 'all';
  source_page: string | 'all';
}

export const STAGE_CONFIG: Record<LeadStage, { label: string; color: string; bg: string; icon: string }> = {
  new:       { label: 'New',        color: 'text-[#0D5959]',  bg: 'bg-[#0D5959]/8',  icon: 'ri-mail-line' },
  contacted: { label: 'Contacted',  color: 'text-[#001731]',  bg: 'bg-[#001731]/8',  icon: 'ri-phone-line' },
  viewing:   { label: 'Viewing',    color: 'text-[#0D5959]',  bg: 'bg-[#0D5959]/8',  icon: 'ri-eye-line' },
  negotiating:{ label:'Negotiating',color:'text-[#001731]',  bg: 'bg-[#001731]/8',  icon: 'ri-exchange-line' },
  won:       { label: 'Won',        color: 'text-[#0D5959]',  bg: 'bg-[#0D5959]/10', icon: 'ri-trophy-line' },
  lost:      { label: 'Lost',       color: 'text-gray',       bg: 'bg-gray-100',       icon: 'ri-close-circle-line' },
  archived:  { label: 'Archived',   color: 'text-gray',       bg: 'bg-stone-100',      icon: 'ri-archive-line' },
};

export const STAGE_ORDER: LeadStage[] = ['new', 'contacted', 'viewing', 'negotiating', 'won', 'lost'];
