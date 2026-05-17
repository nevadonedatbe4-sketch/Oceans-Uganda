import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface NavItem {
  icon: string;
  label: string;
  to: string;
}

const NAV: NavItem[] = [
  { icon: 'ri-dashboard-3-line', label: 'Overview', to: '/agent/dashboard' },
  { icon: 'ri-building-4-line', label: 'My Listings', to: '/agent/listings' },
  { icon: 'ri-user-received-2-line', label: 'Leads', to: '/agent/leads' },
  { icon: 'ri-calendar-line', label: 'Viewings', to: '/agent/viewings' },
  { icon: 'ri-line-chart-line', label: 'Performance', to: '/agent/performance' },
];

const BOTTOM_NAV: NavItem[] = [
  { icon: 'ri-user-settings-line', label: 'My Profile', to: '/agent/profile' },
];

interface Props {
  onClose?: () => void;
}

const FALLBACK_LOGO = 'https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png';

export default function AgentSidebar({ onClose }: Props) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { get } = useSiteSettings();
  const logoSrc = get('logo_dashboard') || get('logo_main') || FALLBACK_LOGO;

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const navLinkClass = (isActive: boolean) =>
    `relative flex items-center gap-3.5 px-5 py-2.5 text-[13px] transition-all duration-150 cursor-pointer whitespace-nowrap group ${
      isActive ? 'text-white' : 'text-[#555] hover:text-[#aaa]'
    }`;

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <aside
      className="w-[220px] shrink-0 bg-[#111111] flex flex-col h-screen sticky top-0 border-r border-white/[0.06]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <img
            src={logoSrc}
            alt={get('site_name', 'Oceans')}
            className="h-6 w-auto object-contain brightness-0 invert opacity-90"
          />
        </div>
        {/* Close button — mobile only, large and clear */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <i className="ri-close-line text-lg" />
          </button>
        )}
      </div>

      {/* Agent badge */}
      <div className="px-5 pt-5 pb-3">
        <span className="text-[#D5A91C] text-[9px] font-semibold tracking-[0.2em] uppercase">
          Agent Portal
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#D5A91C] rounded-full" />
                )}
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className={`${item.icon} text-sm ${isActive ? 'text-[#D5A91C]' : 'text-[#555] group-hover:text-[#888]'} transition-colors`} />
                </div>
                <span className={`text-[13px] font-medium ${isActive ? 'text-white' : 'text-[#555] group-hover:text-[#999]'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        <div className="mx-5 my-4 border-t border-white/[0.06]" />

        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#D5A91C] rounded-full" />
                )}
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className={`${item.icon} text-sm ${isActive ? 'text-[#D5A91C]' : 'text-[#555] group-hover:text-[#888]'} transition-colors`} />
                </div>
                <span className={`text-[13px] font-medium ${isActive ? 'text-white' : 'text-[#555] group-hover:text-[#999]'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[#1e1e1e] ring-1 ring-white/10">
            {profile?.photo ? (
              <img src={profile.photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#D5A91C] text-xs font-semibold">
                  {profile?.full_name?.charAt(0) ?? 'A'}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#ccc] text-[12px] font-medium truncate">{profile?.full_name ?? 'Agent'}</p>
            <p className="text-[#444] text-[10px] truncate">
              {profile?.status === 'pending' ? 'Pending approval' : (profile?.title ?? 'Sales Agent')}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="w-7 h-7 flex items-center justify-center text-[#444] hover:text-[#888] transition-colors cursor-pointer shrink-0"
          >
            <i className="ri-logout-box-r-line text-sm" />
          </button>
        </div>
      </div>
    </aside>
  );
}
