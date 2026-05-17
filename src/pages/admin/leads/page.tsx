import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Lead, AgentOption, LeadFiltersState } from './types';
import LeadKPICards from './components/LeadKPICards';
import LeadFilters from './components/LeadFilters';
import LeadsTable from './components/LeadsTable';
import LeadStageBoard from './components/LeadStageBoard';
import LeadDetailDrawer from './components/LeadDetailDrawer';

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [view, setView] = useState<'list' | 'board'>('list');
  const [kpiFilter, setKpiFilter] = useState<string>('all');
  const [filters, setFilters] = useState<LeadFiltersState>({
    search: '',
    stage: 'all',
    assigned_to: 'all',
    source_page: 'all',
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select(`
        *,
        listing:listings(id, title, slug),
        agent:agents!leads_assigned_to_fkey(id, full_name)
      `)
      .order('created_at', { ascending: false });
    if (data) setLeads(data as Lead[]);
    setLoading(false);
  }, []);

  const fetchAgents = useCallback(async () => {
    const { data } = await supabase
      .from('agents')
      .select('id, full_name')
      .eq('active', true)
      .order('display_order');
    if (data) setAgents(data);
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, [fetchLeads, fetchAgents]);

  const sourcePagesOptions = useMemo(() => {
    const set = new Set(leads.map((l) => l.source_page).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // KPI card filter
      if (kpiFilter === 'tour' && l.inquiry_type !== 'tour') return false;
      if (kpiFilter === 'info' && l.inquiry_type === 'tour') return false;
      if (kpiFilter === 'new' && l.stage !== 'new') return false;
      if (kpiFilter === 'overdue') {
        const today = new Date().toISOString().split('T')[0];
        const isOverdue = l.follow_up_date && l.follow_up_date < today && !['won', 'lost', 'archived'].includes(l.stage);
        if (!isOverdue) return false;
      }

      // Sidebar filters
      if (filters.stage !== 'all' && l.stage !== filters.stage) return false;
      if (filters.assigned_to === 'unassigned' && l.assigned_to !== null) return false;
      if (filters.assigned_to !== 'all' && filters.assigned_to !== 'unassigned' && l.assigned_to !== filters.assigned_to) return false;
      if (filters.source_page !== 'all' && l.source_page !== filters.source_page) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          l.lead_name.toLowerCase().includes(q) ||
          (l.email ?? '').toLowerCase().includes(q) ||
          (l.phone ?? '').includes(q) ||
          (l.property_title ?? '').toLowerCase().includes(q) ||
          (l.listing?.title ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [leads, filters, kpiFilter]);

  const handleDelete = async (id: string) => {
    await supabase.from('leads').delete().eq('id', id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
  };

  const handleUpdated = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLead(updated);
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Stage', 'Property', 'Tour Date', 'Tour Time', 'Tour Format', 'Assigned To', 'Follow-up Date', 'Received'];
    const rows = filteredLeads.map((l) => [
      l.lead_name,
      l.email ?? '',
      l.phone ?? '',
      l.inquiry_type === 'tour' ? 'Tour Request' : 'Info Inquiry',
      l.stage,
      l.listing?.title ?? l.property_title ?? '',
      l.tour_date ?? '',
      l.tour_time ?? '',
      l.tour_type ?? '',
      l.agent?.full_name ?? l.agent_name ?? '',
      l.follow_up_date ?? '',
      new Date(l.created_at).toLocaleDateString('en-GB'),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const newCount = leads.filter((l) => l.stage === 'new').length;

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-base sm:text-xl font-jost font-bold text-stone-800 truncate">Leads &amp; Inquiries</h1>
          {newCount > 0 && (
            <span className="px-2 py-0.5 bg-[#0D5959] text-white text-[10px] sm:text-xs font-bold rounded-full shrink-0">
              {newCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={fetchLeads}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-stone-200 text-stone-500 rounded-md hover:bg-[#f5f5f5] cursor-pointer transition-colors"
            title="Refresh"
          >
            <i className="ri-refresh-line text-sm" />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 border border-stone-200 text-stone-600 rounded-md px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-[#f5f5f5] cursor-pointer whitespace-nowrap transition-colors"
          >
            <i className="ri-download-line" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards — clickable filters */}
      <LeadKPICards
        leads={leads}
        activeFilter={kpiFilter}
        onFilterChange={(f) => setKpiFilter(kpiFilter === f ? 'all' : f)}
      />

      {/* Active KPI filter indicator */}
      {kpiFilter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 hidden sm:inline">Filtered by:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-medium">
            {kpiFilter === 'tour' && <><i className="ri-calendar-check-line text-[#0D5959]" /> Tour Requests</>}
            {kpiFilter === 'info' && <><i className="ri-mail-line text-[#001731]" /> Info Inquiries</>}
            {kpiFilter === 'new' && <><i className="ri-notification-badge-line text-[#0D5959]" /> Unread / New</>}
            {kpiFilter === 'overdue' && <><i className="ri-alarm-warning-line text-[#001731]" /> Overdue</>}
            <button onClick={() => setKpiFilter('all')} className="ml-1 text-stone-400 hover:text-stone-600 cursor-pointer">
              <i className="ri-close-line" />
            </button>
          </span>
        </div>
      )}

      {/* Filters */}
      <LeadFilters
        filters={filters}
        agents={agents}
        sourcePage={sourcePagesOptions}
        onChange={setFilters}
        view={view}
        onViewChange={setView}
        totalCount={leads.length}
        filteredCount={filteredLeads.length}
      />

      {/* Content */}
      {loading ? (
        <div className="bg-white border border-stone-200 rounded-lg py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0D5959] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-400">Loading inquiries…</p>
        </div>
      ) : (
        <>
          {view === 'list' ? (
            <LeadsTable
              leads={filteredLeads}
              onSelect={setSelectedLead}
              onDelete={handleDelete}
            />
          ) : (
            <LeadStageBoard
              leads={filteredLeads}
              onSelect={setSelectedLead}
            />
          )}
        </>
      )}

      {/* Detail drawer */}
      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          agents={agents}
          onClose={() => setSelectedLead(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
