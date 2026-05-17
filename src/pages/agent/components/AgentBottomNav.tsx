import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const LEFT_TABS = [
  { icon: 'ri-dashboard-3-line', label: 'Overview', to: '/agent/dashboard' },
  { icon: 'ri-building-4-line', label: 'Listings', to: '/agent/listings' },
];

const RIGHT_TABS = [
  { icon: 'ri-user-received-2-line', label: 'Leads', to: '/agent/leads' },
  { icon: 'ri-user-settings-line', label: 'Profile', to: '/agent/profile' },
];

export default function AgentBottomNav() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isActive = profile?.status === 'active';

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111111] border-t border-white/[0.08]"
      style={{ fontFamily: "'Inter', sans-serif", paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="relative flex items-end h-16">

        {/* Left two tabs */}
        <div className="flex flex-1">
          {LEFT_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive: active }) =>
                `flex flex-col items-center justify-center gap-1 flex-1 h-16 transition-all duration-150 cursor-pointer ${
                  active ? 'text-[#D5A91C]' : 'text-[#444] hover:text-[#777]'
                }`
              }
            >
              {({ isActive: active }) => (
                <>
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {active && (
                      <span className="absolute inset-0 rounded-full bg-[#D5A91C]/12 scale-150" />
                    )}
                    <i className={`${tab.icon} text-lg relative z-10`} />
                  </div>
                  <span className={`text-[10px] font-medium tracking-wide leading-none ${active ? 'text-[#D5A91C]' : 'text-[#444]'}`}>
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Centre FAB slot — raised above the bar */}
        <div className="flex items-end justify-center w-20 pb-2 shrink-0">
          <button
            onClick={() => navigate('/agent/listings/new')}
            disabled={!isActive}
            title={isActive ? 'New Listing' : 'Account pending approval'}
            className={`
              relative -top-4 w-14 h-14 rounded-full flex items-center justify-center
              transition-all duration-200 cursor-pointer
              ${isActive
                ? 'bg-[#D5A91C] hover:bg-[#b8943d] active:scale-95'
                : 'bg-[#2a2a2a] cursor-not-allowed opacity-50'
              }
            `}
            style={{ boxShadow: isActive ? '0 4px 20px rgba(201,168,76,0.45)' : 'none' }}
          >
            <i className={`ri-add-line text-2xl font-light ${isActive ? 'text-[#111]' : 'text-[#555]'}`} />
            {/* Pulse ring when active */}
            {isActive && (
              <span className="absolute inset-0 rounded-full bg-[#D5A91C]/30 animate-ping" style={{ animationDuration: '2.5s' }} />
            )}
          </button>
        </div>

        {/* Right two tabs */}
        <div className="flex flex-1">
          {RIGHT_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive: active }) =>
                `flex flex-col items-center justify-center gap-1 flex-1 h-16 transition-all duration-150 cursor-pointer ${
                  active ? 'text-[#D5A91C]' : 'text-[#444] hover:text-[#777]'
                }`
              }
            >
              {({ isActive: active }) => (
                <>
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {active && (
                      <span className="absolute inset-0 rounded-full bg-[#D5A91C]/12 scale-150" />
                    )}
                    <i className={`${tab.icon} text-lg relative z-10`} />
                  </div>
                  <span className={`text-[10px] font-medium tracking-wide leading-none ${active ? 'text-[#D5A91C]' : 'text-[#444]'}`}>
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

      </div>
    </nav>
  );
}
