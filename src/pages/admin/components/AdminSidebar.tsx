import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/admin/dashboard' },
      { label: 'Activities', icon: 'ri-pulse-line', path: '/admin/activities' },
      { label: 'Insights', icon: 'ri-bar-chart-box-line', path: '/admin/insights' },
    ],
  },
  {
    title: 'CRM',
    items: [
      { label: 'Deals', icon: 'ri-shake-hands-line', path: '/admin/deals' },
      { label: 'Leads', icon: 'ri-user-received-line', path: '/admin/leads' },
      { label: 'Inquiries', icon: 'ri-mail-open-line', path: '/admin/inquiries' },
    ],
  },
  {
    title: 'Properties',
    items: [
      { label: 'Properties', icon: 'ri-building-2-line', path: '/admin/listings' },
      { label: 'Add Property', icon: 'ri-add-circle-line', path: '/admin/listings/new' },
      { label: 'Favorites', icon: 'ri-heart-3-line', path: '/admin/favorites' },
    ],
  },
  {
    title: 'Other',
    items: [
      { label: 'Saved Searches', icon: 'ri-bookmark-3-line', path: '/admin/saved-searches' },
      { label: 'Messages', icon: 'ri-message-3-line', path: '/admin/messages' },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Neighborhoods', icon: 'ri-map-pin-2-line', path: '/admin/neighborhoods' },
      { label: 'Agents', icon: 'ri-user-star-line', path: '/admin/agents' },
      { label: 'Homepage', icon: 'ri-layout-top-line', path: '/admin/homepage' },
      { label: 'Testimonials', icon: 'ri-chat-quote-line', path: '/admin/testimonials' },
      { label: 'Blog / Insights', icon: 'ri-article-line', path: '/admin/blog' },
      { label: 'Media Library', icon: 'ri-image-2-line', path: '/admin/media' },
    ],
  },
  {
    title: 'Config',
    items: [
      { label: 'SEO', icon: 'ri-search-eye-line', path: '/admin/seo' },
      { label: 'Settings', icon: 'ri-settings-4-line', path: '/admin/settings' },
      { label: 'Users & Roles', icon: 'ri-shield-user-line', path: '/admin/users' },
    ],
  },
];

const MANAGEMENT_SUB_ITEMS = [
  { path: '/admin/management/general', label: 'General', icon: 'ri-settings-3-line' },
  { path: '/admin/management/branding', label: 'Logos & Branding', icon: 'ri-image-edit-line' },
  { path: '/admin/management/currency', label: 'Price & Currency', icon: 'ri-currency-line' },
  { path: '/admin/management/typography', label: 'Typography', icon: 'ri-text' },
  { path: '/admin/management/listings-pages', label: 'Properties Pages', icon: 'ri-layout-grid-line' },
  { path: '/admin/management/search', label: 'Search & Filters', icon: 'ri-search-2-line' },
  { path: '/admin/management/property', label: 'Property Settings', icon: 'ri-building-2-line' },
  { path: '/admin/management/required', label: 'Required Fields', icon: 'ri-checkbox-circle-line' },
  { path: '/admin/management/hero', label: 'Hero Section', icon: 'ri-image-2-line' },
  { path: '/admin/management/homepage', label: 'Homepage Controls', icon: 'ri-layout-top-line' },
  { path: '/admin/management/breadcrumbs', label: 'Breadcrumbs', icon: 'ri-arrow-right-s-line' },
  { path: '/admin/management/contact', label: 'Contact & Company', icon: 'ri-contacts-book-2-line' },
  { path: '/admin/management/social', label: 'Social Media', icon: 'ri-share-box-line' },
  { path: '/admin/management/maps', label: 'Maps & Location', icon: 'ri-map-pin-2-line' },
  { path: '/admin/management/property-details', label: 'Property Details', icon: 'ri-article-line' },
  { path: '/admin/management/styling-cards', label: 'Property Cards Style', icon: 'ri-layout-grid-line' },
  { path: '/admin/management/styling-details', label: 'Property Detail Style', icon: 'ri-file-list-3-line' },
  { path: '/admin/management/dashboard-menu', label: 'Dashboard Menu', icon: 'ri-layout-left-2-line' },
  { path: '/admin/management/cache', label: 'Save / Sync / Cache', icon: 'ri-database-2-line' },
];

const FALLBACK_LOGO = 'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png';

function SidebarContent({
  collapsed,
  onClose,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { get } = useSiteSettings();
  const isMgmtActive = location.pathname.startsWith('/admin/management');
  const [mgmtOpen, setMgmtOpen] = useState(isMgmtActive);

  const menuBg = get('dash_menu_bg', '#1B4332');
  const activeColor = get('dash_active_border_color', '#0d5959');
  const logoSrc = get('logo_dashboard') || get('logo_main') || FALLBACK_LOGO;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const renderItem = (item: NavItem) => {
    const active = isActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer group whitespace-nowrap relative ${
          active ? 'text-white bg-white/10' : 'text-white/55 hover:text-white hover:bg-white/5'
        }`}
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
            style={{ backgroundColor: activeColor }}
          />
        )}
        <span
          className={`w-5 h-5 flex items-center justify-center shrink-0 ${
            active ? 'text-white' : 'text-white/40 group-hover:text-white/80'
          }`}
          style={active ? { color: activeColor } : {}}
        >
          <i className={`${item.icon} text-[15px]`} />
        </span>
        {!collapsed && (
          <span className="text-[13px] font-roboto font-medium tracking-[0.01em]">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  const renderGroup = (group: NavGroup) => (
    <div key={group.title} className="mb-1">
      {!collapsed ? (
        <p className="px-3 pt-4 pb-1.5 text-[10px] font-roboto font-semibold uppercase tracking-[0.12em] text-white/25 select-none">
          {group.title}
        </p>
      ) : (
        <div className="my-3 mx-3 border-t border-white/8" />
      )}
      <div className="space-y-0.5">
        {group.items.map(renderItem)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: menuBg }}>
      {/* Logo + collapse toggle */}
      <div
        className={`shrink-0 border-b border-white/8 ${
          collapsed ? 'flex items-center justify-center py-5' : 'px-5 py-5'
        }`}
      >
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'justify-between gap-2'}`}>
          {!collapsed ? (
            <img
              src={logoSrc}
              alt="Admin"
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="w-8 h-8 flex items-center justify-center">
              <i className="ri-building-4-line text-xl" style={{ color: activeColor }} />
            </span>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-150 cursor-pointer shrink-0"
            >
              <i
                className={`text-sm ${
                  collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
        {NAV_GROUPS.map(renderGroup)}

        {/* Management accordion */}
        <div className="mb-1">
          {!collapsed ? (
            <p className="px-3 pt-4 pb-1.5 text-[10px] font-roboto font-semibold uppercase tracking-[0.12em] text-white/25 select-none">
              Management
            </p>
          ) : (
            <div className="my-3 mx-3 border-t border-white/8" />
          )}

          <button
            type="button"
            onClick={() => !collapsed && setMgmtOpen((o) => !o)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer group whitespace-nowrap relative ${
              isMgmtActive ? 'text-white bg-white/10' : 'text-white/55 hover:text-white hover:bg-white/5'
            }`}
          >
            {isMgmtActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                style={{ backgroundColor: activeColor }}
              />
            )}
            <span
              className={`w-5 h-5 flex items-center justify-center shrink-0 ${
                isMgmtActive ? '' : 'text-white/40 group-hover:text-white/80'
              }`}
              style={isMgmtActive ? { color: activeColor } : {}}
            >
              <i className="ri-equalizer-2-line text-[15px]" />
            </span>
            {!collapsed && (
              <>
                <span className="text-[13px] font-roboto font-medium flex-1 text-left">
                  Management Options
                </span>
                <i
                  className={`text-xs text-white/25 transition-transform duration-200 ${
                    mgmtOpen ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'
                  }`}
                />
              </>
            )}
          </button>

          {!collapsed && mgmtOpen && (
            <div className="ml-3 pl-3 border-l border-white/10 mt-1 space-y-0.5">
              {MANAGEMENT_SUB_ITEMS.map((item) => {
                const active =
                  location.pathname === item.path ||
                  location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      active ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                      <i className={`${item.icon} text-xs`} style={active ? { color: activeColor } : {}} />
                    </span>
                    <span className="text-[12px] font-roboto">{item.label}</span>
                    {active && (
                      <span
                        className="ml-auto w-1 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: activeColor }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/8 px-3 py-3 space-y-1">
        {!collapsed && (
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-colors cursor-pointer group whitespace-nowrap"
          >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              <i className="ri-external-link-line text-[14px]" />
            </span>
            <span className="text-[12px] font-roboto">View Public Site</span>
          </Link>
        )}

        {!collapsed && (
          <p className="px-3 pt-2 pb-1 text-[10px] font-roboto font-semibold uppercase tracking-[0.12em] text-white/25 select-none">
            Account
          </p>
        )}

        <Link
          to="/admin/profile"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer group whitespace-nowrap relative ${
            isActive('/admin/profile') ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white hover:bg-white/5'
          }`}
        >
          {isActive('/admin/profile') && (
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
              style={{ backgroundColor: activeColor }}
            />
          )}
          <span className="w-5 h-5 flex items-center justify-center shrink-0 text-white/40 group-hover:text-white/80">
            <i className="ri-user-settings-line text-[15px]" />
          </span>
          {!collapsed && (
            <span className="text-[13px] font-roboto font-medium">My Profile</span>
          )}
        </Link>

        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${activeColor}22` }}
          >
            <i className="ri-user-line text-[11px]" style={{ color: activeColor }} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white/75 text-[12px] font-roboto font-medium truncate leading-tight">
                {user?.email?.split('@')[0] ?? 'Admin'}
              </p>
              <p className="text-white/25 text-[10px] font-roboto truncate leading-tight">
                {user?.email ?? ''}
              </p>
            </div>
          )}
          <button
            onClick={signOut}
            title="Log out"
            className="w-6 h-6 flex items-center justify-center rounded text-white/25 hover:text-red-400 transition-colors cursor-pointer shrink-0"
          >
            <i className="ri-logout-box-r-line text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { get } = useSiteSettings();
  const location = useLocation();
  const menuBg = get('dash_menu_bg', '#1B4332');

  // Auto-close drawer on any route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        data-mobile-menu
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center text-white rounded-lg cursor-pointer"
        style={{ backgroundColor: menuBg }}
      >
        <i className="ri-menu-line text-base" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-[290px] flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ minHeight: '100dvh', backgroundColor: menuBg }}
      >
        <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-white/6 transition-all duration-200 shrink-0 ${
          collapsed ? 'w-[64px]' : 'w-[290px]'
        }`}
        style={{ minHeight: '100vh', backgroundColor: menuBg }}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      </aside>
    </>
  );
}
