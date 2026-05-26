import { Link, NavLink } from 'react-router';
import {
  currentPartner,
  getMockPartnerActivationState,
  getMockPartnerCreateBagRoute,
  getMockPartnerProfile,
  isMockPartnerVerified,
} from '../../data/mock/partners';

export default function PartnerTopbar({
  onMenuToggle,
  onSignOut,
}: {
  onMenuToggle: () => void;
  onSignOut: () => void;
}) {
  const profile = getMockPartnerProfile();
  const canPostBags = isMockPartnerVerified();
  const activationState = getMockPartnerActivationState();
  const createBagRoute = getMockPartnerCreateBagRoute();

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(32,38,28,0.08)] bg-[rgba(251,250,246,0.84)] backdrop-blur-[18px]">
      <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-6 px-[5%]">
        <div className="flex min-w-0 items-center gap-[10px]">
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
          <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#00A661] to-[#0b7a4d] shadow-[0_6px_14px_rgba(0,166,97,0.16)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.5 8.5L22 9.5L17 14.5L18 21L12 18L6 21L7 14.5L2 9.5L8.5 8.5L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-['Fraunces',serif] text-[23px] font-bold leading-none tracking-[-0.04em] text-[#1f221d]">
              Grab It <span className="text-[#00A661]">Good</span>
            </div>
            <div className="meta-text truncate">{profile.tradingName || currentPartner.outlets[0].name}</div>
          </div>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/partner" end className={({ isActive }) => `rounded-full px-3 py-2 text-[14px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] ${isActive ? 'bg-[rgba(11,122,77,0.08)] text-[#0b7a4d]' : 'text-[#5f635c] hover:text-[#0b7a4d]'}`}>Dashboard</NavLink>
          <NavLink to="/partner/profile" className={({ isActive }) => `rounded-full px-3 py-2 text-[14px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] ${isActive ? 'bg-[rgba(11,122,77,0.08)] text-[#0b7a4d]' : 'text-[#5f635c] hover:text-[#0b7a4d]'}`}>Profile</NavLink>
          <NavLink to="/partner/listings" className={({ isActive }) => `rounded-full px-3 py-2 text-[14px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] ${isActive ? 'bg-[rgba(11,122,77,0.08)] text-[#0b7a4d]' : 'text-[#5f635c] hover:text-[#0b7a4d]'}`}>Rescue bags</NavLink>
          {canPostBags ? (
            <NavLink to={createBagRoute} className={({ isActive }) => `rounded-full px-3 py-2 text-[14px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] ${isActive ? 'bg-[rgba(11,122,77,0.08)] text-[#0b7a4d]' : 'text-[#5f635c] hover:text-[#0b7a4d]'}`}>Create bag</NavLink>
          ) : (
            <Link
              to={createBagRoute}
              className="rounded-full px-3 py-2 text-[14px] font-medium text-[#5f635c] transition hover:text-[#0b7a4d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661]"
            >
              Create bag
            </Link>
          )}
          <NavLink to="/partner/orders" className={({ isActive }) => `rounded-full px-3 py-2 text-[14px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] ${isActive ? 'bg-[rgba(11,122,77,0.08)] text-[#0b7a4d]' : 'text-[#5f635c] hover:text-[#0b7a4d]'}`}>Orders</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-[14px] font-semibold text-[#1f221d]">{profile.ownerContactName || currentPartner.contactPerson}</div>
            <div className="meta-text">
              {activationState === 'active'
                ? 'Verified access'
                : activationState === 'billing_required'
                  ? 'Billing setup required'
                  : 'Pending verification'}
            </div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="hidden min-h-[44px] items-center justify-center rounded-full px-4 py-[10px] text-[14px] font-semibold text-[#5f635c] transition hover:text-[#1f221d] lg:inline-flex"
          >
            Sign out
          </button>
          <Link to="/" className="btn-secondary min-h-[44px] px-4 py-[10px] text-[14px]">
            View website
          </Link>
        </div>
      </div>
    </header>
  );
}
