import { Link, NavLink } from 'react-router';
import {
  canMockPartnerAccessFeature,
  currentPartner,
  getMockPartnerProfile,
  getMockPartnerWorkspaceAccessState,
} from '../../data/mock/partners';

export default function PartnerTopbar({
  onMenuToggle,
  onSignOut,
}: {
  onMenuToggle: () => void;
  onSignOut: () => void;
}) {
  const profile = getMockPartnerProfile();
  const workspaceAccessState = getMockPartnerWorkspaceAccessState(profile);
  const listingsRoute = canMockPartnerAccessFeature('listings', profile) ? '/partner/listings' : '/partner/profile';
  const ordersRoute = canMockPartnerAccessFeature('orders', profile) ? '/partner/orders' : '/partner/profile';
  const navItems = [
    { label: 'Dashboard', to: '/partner' },
    { label: 'Profile', to: '/partner/profile' },
    { label: 'Rescue bags', to: listingsRoute },
    { label: 'Orders', to: ordersRoute },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(32,38,28,0.08)] bg-[rgba(251,250,246,0.86)] backdrop-blur-[16px]">
      <div className="mx-auto flex min-h-[64px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-5 md:px-6 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Open partner navigation"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[color:var(--gig-border)] bg-[rgba(255,253,248,0.9)] text-[color:var(--gig-text)] shadow-[var(--gig-shadow-xs)] transition-colors hover:bg-white lg:hidden"
          >
            <span className="flex flex-col gap-[4px]">
              <span className="h-[1.5px] w-[18px] rounded-full bg-current"></span>
              <span className="h-[1.5px] w-[18px] rounded-full bg-current"></span>
              <span className="h-[1.5px] w-[18px] rounded-full bg-current"></span>
            </span>
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#00A661] to-[#0b7a4d] shadow-[0_6px_14px_rgba(0,166,97,0.16)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.5 8.5L22 9.5L17 14.5L18 21L12 18L6 21L7 14.5L2 9.5L8.5 8.5L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold leading-none text-[#1f221d]">
              {profile.tradingName || currentPartner.outlets[0].name}
            </div>
            <div className="meta-text truncate">Partner workspace</div>
          </div>
        </div>

        <nav className="hidden rounded-full border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.72)] p-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/partner'}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] ${
                  isActive ? 'bg-[#1E2F24] text-white' : 'text-[#5f635c] hover:text-[#0b7a4d]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/70 px-3 py-2 sm:flex">
            <span className={`h-2 w-2 rounded-full ${workspaceAccessState === 'active' ? 'bg-[#0b7a4d]' : 'bg-[#d6a06a]'}`}></span>
            <span className="text-[12px] font-medium text-[#4D5E53]">
              {workspaceAccessState === 'active' ? 'Active' : 'Setup locked'}
            </span>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="hidden min-h-[40px] items-center justify-center rounded-full px-3 py-2 text-[13px] font-semibold text-[#5f635c] transition hover:bg-white hover:text-[#1f221d] lg:inline-flex"
          >
            Sign out
          </button>
          <Link to="/" className="hidden min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-3 py-2 text-[13px] font-medium text-[#5f635c] transition hover:bg-white hover:text-[#1f221d] md:inline-flex">
            Website
          </Link>
        </div>
      </div>
    </header>
  );
}
