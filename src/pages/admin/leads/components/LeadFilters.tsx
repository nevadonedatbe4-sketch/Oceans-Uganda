import { useState } from 'react';
import type { AgentOption, LeadFiltersState, LeadStage } from '../types';
import { STAGE_CONFIG } from '../types';

interface Props {
  filters: LeadFiltersState;
  agents: AgentOption[];
  sourcePage: string[];
  onChange: (filters: LeadFiltersState) => void;
  view: 'list' | 'board';
  onViewChange: (view: 'list' | 'board') => void;
  totalCount: number;
  filteredCount: number;
}

const ALL_STAGES: (LeadStage | 'all')[] = [
  'all', 'new', 'contacted', 'viewing', 'negotiating', 'won', 'lost', 'archived',
];

export default function LeadFilters({
  filters, agents, sourcePage, onChange, view, onViewChange, totalCount, filteredCount,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const set = (partial: Partial<LeadFiltersState>) => onChange({ ...filters, ...partial });

  const activeFilterCount = [
    filters.stage !== 'all',
    filters.assigned_to !== 'all',
    filters.source_page !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      {/* Always-visible top row: search + filter toggle + view */}
      <div className="flex items-center gap-2 p-3 sm:p-4">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
          <input
            type="text"
            placeholder="Search name, email, phone…"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D5959]/20"
          />
        </div>

        {/* Filter toggle — mobile only */}
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className={`sm:hidden relative flex items-center gap-1.5 px-3 py-2 text-sm border rounded-md cursor-pointer whitespace-nowrap transition-colors ${
            filtersOpen || activeFilterCount > 0
              ? 'bg-[#001731] text-white border-[#001731]'
              : 'border-stone-200 text-stone-600 hover:bg-[#f5f5f5]'
          }`}
        >
          <i className="ri-equalizer-2-line text-sm" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0D5959] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View toggle */}
        <div className="flex items-center border border-stone-200 rounded-md overflow-hidden shrink-0">
          <button
            onClick={() => onViewChange('list')}
            className={`px-2.5 sm:px-3 py-2 text-sm flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
              view === 'list' ? 'bg-[#001731] text-white' : 'text-stone-500 hover:bg-[#f5f5f5]'
            }`}
            title="List view"
          >
            <i className="ri-list-check text-sm" />
            <span className="hidden sm:inline text-sm">List</span>
          </button>
          <button
            onClick={() => onViewChange('board')}
            className={`px-2.5 sm:px-3 py-2 text-sm flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
              view === 'board' ? 'bg-[#001731] text-white' : 'text-stone-500 hover:bg-[#f5f5f5]'
            }`}
            title="Board view"
          >
            <i className="ri-layout-column-line text-sm" />
            <span className="hidden sm:inline text-sm">Board</span>
          </button>
        </div>
      </div>

      {/* Desktop filter row — always visible on sm+ */}
      <div className="hidden sm:flex flex-wrap gap-2 px-4 pb-4 items-center">
        <select
          value={filters.stage}
          onChange={(e) => set({ stage: e.target.value as LeadStage | 'all' })}
          className="text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D5959]/20 cursor-pointer"
        >
          {ALL_STAGES.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Stages' : STAGE_CONFIG[s].label}</option>
          ))}
        </select>

        <select
          value={filters.assigned_to}
          onChange={(e) => set({ assigned_to: e.target.value })}
          className="text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D5959]/20 cursor-pointer"
        >
          <option value="all">All Agents</option>
          <option value="unassigned">Unassigned</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
        </select>

        {sourcePage.length > 0 && (
          <select
            value={filters.source_page}
            onChange={(e) => set({ source_page: e.target.value })}
            className="text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0D5959]/20 cursor-pointer"
          >
            <option value="all">All Sources</option>
            {sourcePage.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}

        {filteredCount < totalCount && (
          <p className="text-xs text-stone-500 ml-auto">
            Showing <span className="font-medium text-stone-700">{filteredCount}</span> of {totalCount}
          </p>
        )}
      </div>

      {/* Mobile expandable filter panel */}
      {filtersOpen && (
        <div className="sm:hidden border-t border-stone-100 px-3 pb-3 pt-2 space-y-2">
          <select
            value={filters.stage}
            onChange={(e) => set({ stage: e.target.value as LeadStage | 'all' })}
            className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none cursor-pointer"
          >
            {ALL_STAGES.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Stages' : STAGE_CONFIG[s].label}</option>
            ))}
          </select>

          <select
            value={filters.assigned_to}
            onChange={(e) => set({ assigned_to: e.target.value })}
            className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">All Agents</option>
            <option value="unassigned">Unassigned</option>
            {agents.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
          </select>

          {sourcePage.length > 0 && (
            <select
              value={filters.source_page}
              onChange={(e) => set({ source_page: e.target.value })}
              className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">All Sources</option>
              {sourcePage.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => { set({ stage: 'all', assigned_to: 'all', source_page: 'all' }); setFiltersOpen(false); }}
              className="w-full text-xs text-[#001731] py-1.5 border border-stone-300 rounded-md hover:bg-[#001731]/5 cursor-pointer"
            >
              Clear all filters
            </button>
          )}

          <p className="text-xs text-stone-400 text-center">
            {filteredCount} of {totalCount} leads
          </p>
        </div>
      )}
    </div>
  );
}
