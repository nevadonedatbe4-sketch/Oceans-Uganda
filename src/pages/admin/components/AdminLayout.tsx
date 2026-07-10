import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { supabase } from '@/lib/supabase';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/listings': 'Properties',
  '/admin/listings/new': 'Add Property',
  '/admin/jv-desk': 'JV Desk',
  '/admin/neighborhoods': 'Neighborhoods',
  '/admin/agents': 'Agents',
  '/admin/leads': 'Leads',
  '/admin/inquiries': 'Inquiries',
  '/admin/deals': 'Deals Pipeline',
  '/admin/activities': 'Activities',
  '/admin/insights': 'Insights',
  '/admin/favorites': 'Favorites',
  '/admin/saved-searches': 'Saved Searches',
  '/admin/messages': 'Messages',
  '/admin/profile': 'My Profile',
  '/admin/homepage': 'Homepage Sections',
  '/admin/testimonials': 'Testimonials',
  '/admin/blog': 'Blog / Insights',
  '/admin/media': 'Media Library',
  '/admin/seo': 'SEO Settings',
  '/admin/settings': 'Site Settings',
  '/admin/users': 'Users & Roles',
  '/admin/management/general': 'Management — General',
  '/admin/management/branding': 'Management — Logos & Branding',
  '/admin/management/currency': 'Management — Price & Currency',
  '/admin/management/typography': 'Management — Typography',
  '/admin/management/listings-pages': 'Management — Properties Pages',
  '/admin/management/search': 'Management — Search & Filters',
  '/admin/management/property': 'Management — Property Settings',
  '/admin/management/required': 'Management — Required Fields',
  '/admin/management/homepage': 'Management — Homepage Controls',
  '/admin/management/breadcrumbs': 'Management — Breadcrumbs',
  '/admin/management/contact': 'Management — Contact & Company',
  '/admin/management/social': 'Management — Social Media',
  '/admin/management/maps': 'Management — Maps & Location',
  '/admin/management/cache': 'Management — Save / Sync / Cache',
  '/admin/management/dashboard-menu': 'Management — Dashboard Menu',
  '/admin/management/property-details': 'Management — Property Details',
};

function getPageTitle(pathname: string): string {
  for (const [key, val] of Object.entries(pageTitles)) {
    if (pathname === key || pathname.startsWith(key + '/')) return val;
  }
  return 'Admin';
}

const BOTTOM_TABS = [
  { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard', badgeKey: null },
  { label: 'Properties', icon: 'ri-building-2-line', path: '/admin/listings', badgeKey: null },
  { label: 'Leads', icon: 'ri-user-received-line', path: '/admin/leads', badgeKey: 'leads' },
  { label: 'Messages', icon: 'ri-message-3-line', path: '/admin/messages', badgeKey: 'messages' },
  { label: 'More', icon: 'ri-menu-line', path: '__menu__', badgeKey: null },
] as const;

// Pages that have their own sticky bottom nav — hide the tab bar there
const HIDE_TAB_BAR_PREFIXES = ['/admin/listings/new', '/admin/listings/'];

function formatBadge(n: number): string {
  if (n <= 0) return '';
  if (n > 99) return '99+';
  return String(n);
}

export default function AdminLayout() {
  const location = useLocation();
  const { get } = useSiteSettings();
  const title = getPageTitle(location.pathname);
  const activeColor = get('dash_active_border_color', '#0d5959');
  const menuBg = get('dash_menu_bg', '#1B4332');

  const [badges, setBadges] = useState<{ leads: number; messages: number }>({ leads: 0, messages: 0 });

  // Fetch unread counts — new leads (stage=new) + unread messages
  useEffect(() => {
    const fetchBadges = async () => {
      const [{ count: newLeads }, { count: unreadMsgs }] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('stage', 'new'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('stage', 'new'),
      ]);
      // Use leads count for leads badge; messages table may not exist so fallback to 0
      setBadges({ leads: newLeads ?? 0, messages: unreadMsgs ?? 0 });
    };

    // Fetch messages count separately with error handling
    const fetchAll = async () => {
      try {
        const { count: newLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('stage', 'new');

        let msgCount = 0;
        try {
          // Try to get unread inquiries as proxy for messages
          const { count } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .in('stage', ['new', 'contacted'])
            .gte('created_at', new Date(Date.now() - 86400000 * 3).toISOString());
          msgCount = count ?? 0;
        } catch {
          msgCount = 0;
        }

        setBadges({ leads: newLeads ?? 0, messages: msgCount });
      } catch {
        // silently fail — badges just won't show
      }
    };

    fetchAll();
    // Refresh every 60 seconds
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Hide bottom tab bar on form pages that have their own bottom nav
  const hideTabBar = HIDE_TAB_BAR_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix) && location.pathname !== '/admin/listings'
  );

  const isTabActive = (path: string) => {
    if (path === '/admin/listings') {
      return location.pathname === '/admin/listings';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getBadgeCount = (key: string | null): number => {
    if (!key) return 0;
    return badges[key as keyof typeof badges] ?? 0;
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header bar */}
        <header className="h-14 bg-white border-b border-[#e8edf2] flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 shrink-0 md:hidden" />
            <div className="min-w-0">
              <h1 className="text-[#0d1f2d] font-jost font-semibold text-base md:text-lg leading-tight truncate">{title}</h1>
              <p className="text-[#7a8a99] text-[10px] md:text-[11px] font-roboto hidden sm:block">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#f0f4f8] transition-colors cursor-pointer">
              <i className="ri-notification-3-line text-base" />
            </button>
            <button className="w-8 h-8 items-center justify-center rounded-md text-[#7a8a99] hover:text-[#0d1f2d] hover:bg-[#f0f4f8] transition-colors cursor-pointer hidden md:flex">
              <i className="ri-question-line text-base" />
            </button>
          </div>
        </header>

        {/* Scrollable page content — extra bottom padding on mobile for tab bar */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 bg-[#f0f4f8] ${!hideTabBar ? 'pb-20 md:pb-6' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      {!hideTabBar && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[#e8edf2] flex items-stretch"
          style={{ backgroundColor: menuBg }}
        >
          {BOTTOM_TABS.map((tab) => {
            if (tab.path === '__menu__') {
              // "More" opens the sidebar hamburger — we trigger it via the existing button
              return (
                <button
                  key="more"
                  type="button"
                  onClick={() => {
                    const btn = document.querySelector<HTMLButtonElement>('[data-mobile-menu]');
                    btn?.click();
                  }}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 cursor-pointer transition-colors"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <i className={`${tab.icon} text-[18px]`} />
                  </span>
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            }

            const active = isTabActive(tab.path);
            const badgeCount = getBadgeCount(tab.badgeKey);
            const badgeLabel = formatBadge(badgeCount);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 cursor-pointer transition-colors relative"
                style={{ color: active ? activeColor : 'rgba(255,255,255,0.45)' }}
              >
                {/* Active indicator line */}
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ backgroundColor: activeColor }}
                  />
                )}
                {/* Icon + badge */}
                <span className="relative w-5 h-5 flex items-center justify-center">
                  <i className={`${tab.icon} text-[18px]`} />
                  {badgeLabel && (
                    <span
                      className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center leading-none"
                      style={{ backgroundColor: activeColor, color: '#0d1f2d' }}
                    >
                      {badgeLabel}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium whitespace-nowrap">{tab.label}</span>
              </Link>
            );
          })}

          {/* Add Property FAB — sits above the tab bar */}
          <Link
            to="/admin/listings/new"
            className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform active:scale-95"
            style={{ backgroundColor: activeColor }}
            title="Add Property"
          >
            <i className="ri-add-line text-white text-xl" />
          </Link>
        </nav>
      )}
    </div>
  );
}
