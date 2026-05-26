import { useEffect, useMemo, useState } from 'react';
import { Navigate, ScrollRestoration, useLocation, useNavigate } from 'react-router';
import PartnerSidebar from '../components/partner/PartnerSidebar';
import PartnerTopbar from '../components/partner/PartnerTopbar';
import RouteTransitionOutlet from '../components/shared/RouteTransitionOutlet';
import { clearMockPartnerSession, isMockPartnerSignedIn } from '../data/mock/partners';

export default function PartnerDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.hash, location.pathname, location.search],
  );

  const handleSignOut = () => {
    clearMockPartnerSession();
    setSidebarOpen(false);
    navigate('/partner/login', { replace: true });
  };

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  if (!isMockPartnerSignedIn()) {
    return <Navigate to="/partner/login" replace state={{ from: redirectPath }} />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f5ee_0%,#fbfaf6_12%,#ffffff_36%)]">
      <ScrollRestoration />
      <PartnerTopbar onMenuToggle={() => setSidebarOpen(true)} onSignOut={handleSignOut} />
      <div className="grid min-h-[calc(100vh-76px)] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r border-[rgba(32,38,28,0.08)] lg:sticky lg:top-[76px] lg:block lg:h-[calc(100vh-76px)]">
          <PartnerSidebar onSignOut={handleSignOut} />
        </div>
        <main className="w-full">
          <div className="mx-auto max-w-[1440px] px-[5%] py-7 md:py-8">
            <RouteTransitionOutlet />
          </div>
        </main>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-[rgba(31,34,29,0.28)] backdrop-blur-[4px] transition-opacity duration-[var(--gig-motion-base)] lg:hidden ${
          sidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[86%] max-w-[320px] border-r border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.98)] shadow-[var(--gig-shadow-lg)] transition-transform duration-[var(--gig-motion-base)] lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[rgba(32,38,28,0.08)] px-5 py-4">
          <div className="operational-label text-[#0b7a4d]">Partner console</div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-full px-3 py-2 text-[13px] font-medium text-[color:var(--gig-text-muted)] transition-colors hover:text-[color:var(--gig-text)]"
          >
            Close
          </button>
        </div>
        <PartnerSidebar onSignOut={handleSignOut} />
      </div>
    </div>
  );
}
