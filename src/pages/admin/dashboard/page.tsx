import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import DashboardKPIs from './components/DashboardKPIs';
import DashboardActivityFeed from './components/DashboardActivityFeed';
import DashboardLeadsTable from './components/DashboardLeadsTable';
import DashboardDealsPanel from './components/DashboardDealsPanel';
import DashboardPropertiesSnapshot from './components/DashboardPropertiesSnapshot';

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  featuredProperties: number;
  totalLeads: number;
  newLeadsWeek: number;
  openLeads: number;
  totalDeals: number;
  dealsInPipeline: number;
  pipelineValue: number;
  wonDeals: number;
  totalAgents: number;
}

export interface RecentLead {
  id: string;
  lead_name: string;
  email: string;
  phone: string | null;
  stage: string;
  source_page: string | null;
  created_at: string;
}

export interface RecentDeal {
  id: string;
  client_name: string;
  stage: string;
  expected_value: number | null;
  created_at: string;
}

export interface RecentProperty {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  price: number | null;
  currency: string;
  cover_image: string | null;
  status: string;
  purpose: string;
  property_type: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentDeals, setRecentDeals] = useState<RecentDeal[]>([]);
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString();

      const [
        { count: totalProperties },
        { count: activeProperties },
        { count: featuredProperties },
        { count: totalLeads },
        { count: newLeadsWeek },
        { count: openLeads },
        { count: totalDeals },
        { count: dealsInPipeline },
        { count: wonDeals },
        { count: totalAgents },
        { data: dealsValueData },
        { data: leadsData },
        { data: dealsData },
        { data: propertiesData },
      ] = await Promise.all([
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgoStr),
        supabase.from('leads').select('*', { count: 'exact', head: true }).in('stage', ['new', 'contacted', 'viewing', 'negotiating']),
        supabase.from('deals').select('*', { count: 'exact', head: true }),
        supabase.from('deals').select('*', { count: 'exact', head: true }).in('stage', ['prospect', 'negotiation', 'offer', 'due_diligence']),
        supabase.from('deals').select('*', { count: 'exact', head: true }).eq('stage', 'closed_won'),
        supabase.from('agents').select('*', { count: 'exact', head: true }).eq('active', true),
        supabase.from('deals').select('expected_value').in('stage', ['prospect', 'negotiation', 'offer', 'due_diligence']),
        supabase.from('leads').select('id, lead_name, email, phone, stage, source_page, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('deals').select('id, client_name, stage, expected_value, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('listings').select('id, title, slug, location, price, currency, cover_image, status, purpose, property_type, created_at').order('created_at', { ascending: false }).limit(4),
      ]);

      const pipelineValue = (dealsValueData ?? []).reduce(
        (sum: number, d: { expected_value: number | null }) => sum + (d.expected_value ?? 0),
        0
      );

      setStats({
        totalProperties: totalProperties ?? 0,
        activeProperties: activeProperties ?? 0,
        featuredProperties: featuredProperties ?? 0,
        totalLeads: totalLeads ?? 0,
        newLeadsWeek: newLeadsWeek ?? 0,
        openLeads: openLeads ?? 0,
        totalDeals: totalDeals ?? 0,
        dealsInPipeline: dealsInPipeline ?? 0,
        pipelineValue,
        wonDeals: wonDeals ?? 0,
        totalAgents: totalAgents ?? 0,
      });

      setRecentLeads((leadsData as RecentLead[]) ?? []);
      setRecentDeals((dealsData as RecentDeal[]) ?? []);
      setRecentProperties((propertiesData as RecentProperty[]) ?? []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line text-2xl text-primary animate-spin" />
          <p className="text-sm font-roboto text-[#7a8a99]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-[1280px]">
      {/* Welcome bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-jost font-bold text-primary">Good morning</h2>
          <p className="text-xs sm:text-sm text-[#7a8a99] mt-0.5 font-roboto hidden sm:block">Here's what's happening across your portfolio today.</p>
        </div>
        <Link
          to="/admin/listings/new"
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <i className="ri-add-line" />
          <span className="hidden sm:inline">Add Property</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* KPI Cards */}
      {stats && <DashboardKPIs stats={stats} />}

      {/* Activity feed — shown first on mobile, last on desktop */}
      <div className="sm:hidden">
        <DashboardActivityFeed leads={recentLeads} deals={recentDeals} properties={recentProperties} />
      </div>

      {/* Main grid: Leads + Deals — desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2">
          <DashboardLeadsTable leads={recentLeads} />
        </div>
        <div className="hidden lg:block">
          <DashboardDealsPanel deals={recentDeals} stats={stats} />
        </div>
      </div>

      {/* Bottom grid: Properties + Activity — desktop only */}
      <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <DashboardPropertiesSnapshot properties={recentProperties} />
        </div>
        <div>
          <DashboardActivityFeed leads={recentLeads} deals={recentDeals} properties={recentProperties} />
        </div>
      </div>
    </div>
  );
}