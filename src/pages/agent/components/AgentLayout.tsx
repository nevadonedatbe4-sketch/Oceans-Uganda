import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AgentSidebar from './AgentSidebar';
import AgentBottomNav from './AgentBottomNav';

export default function AgentLayout() {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate('/admin/login', { replace: true });
      } else if (profile && profile.role !== 'agent') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [session, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#D5A91C]/30 border-t-[#D5A91C] rounded-full animate-spin" />
          <p className="text-[#666] text-xs tracking-[0.15em] uppercase font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#111111]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-250 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AgentSidebar onClose={() => setMobileOpen(false)} />
      </div>

      <main className="flex-1 overflow-y-auto bg-white min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#ebebeb] bg-white sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="w-9 h-9 flex items-center justify-center text-[#555] hover:text-[#0f0f0f] transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <i className={`text-xl transition-all duration-200 ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
          </button>
          <img
            src="https://storage.readdy-site.link/project_files/9cd5c10a-ac7d-4fbc-869b-558e145ed2c7/5709557c-85a5-4bd5-827b-de0e149ee94b_logo-main-smal-1.png"
            alt="Oceans"
            className="h-5 w-auto object-contain"
          />
          {/* Spacer to balance the button */}
          <div className="w-9 h-9" />
        </div>

        {profile?.status === 'pending' && (
          <div className="bg-white border-b border-[#ebebeb] px-4 lg:px-8 py-3 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D5A91C] animate-pulse shrink-0" />
            <p className="text-[#888] text-xs tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="font-semibold text-[#D5A91C]">Account under review.</span>{' '}
              Full access granted within 1–2 business days.
            </p>
          </div>
        )}

        {/* Content — extra bottom padding on mobile for the bottom nav */}
        <div className="p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav — mobile only */}
      <AgentBottomNav />
    </div>
  );
}
