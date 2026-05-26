import { Link, NavLink } from 'react-router';
import {
  canMockPartnerAccessFeature,
  currentPartner,
  getMockPartnerProfile,
  getMockPartnerWorkspaceAccessState,
} from '../../data/mock/partners';

export default function PartnerSidebar({ onSignOut }: { onSignOut: () => void }) {
  const profile = getMockPartnerProfile();
  const workspaceAccessState = getMockPartnerWorkspaceAccessState(profile);
  const navigationGroups = [
    {
      label: 'Partner',
      links: [
        { label: 'Dashboard', to: '/partner' },
        { label: 'Profile', to: '/partner/profile' },
        { label: 'Rescue bags', to: '/partner/listings', locked: !canMockPartnerAccessFeature('listings', profile) },
        { label: 'Orders', to: '/partner/orders', locked: !canMockPartnerAccessFeature('orders', profile) },
      ],
    },
  ];

  return (
    <aside className="flex h-full min-h-0 flex-col bg-[rgba(255,253,248,0.94)]">
      <div className="border-b border-[rgba(32,38,28,0.08)] px-4 py-4">
        <div className="operational-label mb-1 text-[#0b7a4d]">Workspace</div>
        <div className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#1f221d]">{profile.legalBusinessName || currentPartner.businessName}</div>
        <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">{profile.city || currentPartner.city}, {profile.stateRegion || 'India'}</div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-[#4D5E53]">
          <span className={`h-1.5 w-1.5 rounded-full ${workspaceAccessState === 'active' ? 'bg-[#0b7a4d]' : 'bg-[#d6a06a]'}`}></span>
          {workspaceAccessState === 'active' ? 'Active' : 'Setup locked'}
        </div>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col px-3 py-3">
        {navigationGroups.map((group) => (
          <div key={group.label} className="space-y-1.5">
            <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">{group.label}</div>
            <div className="space-y-1">
              {group.links.map((link) =>
                link.locked ? (
                  <Link
                    key={link.label}
                    to="/partner/profile"
                    className="flex min-h-[40px] items-center justify-between rounded-[14px] px-3 py-2.5 text-[13px] font-medium text-[#565b54] transition-colors hover:bg-[rgba(32,38,28,0.04)] hover:text-[#1f221d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661]"
                  >
                    <span>{link.label}</span>
                    <span className="rounded-full bg-[rgba(32,38,28,0.05)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Locked</span>
                  </Link>
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    end={link.to === '/partner'}
                    className={({ isActive }) =>
                      `flex min-h-[40px] items-center justify-between rounded-[14px] px-3 py-2.5 text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] transition-colors ${
                        isActive ? 'bg-[#1E2F24] text-white' : 'text-[#565b54] hover:bg-[rgba(32,38,28,0.04)] hover:text-[#1f221d]'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                  </NavLink>
                ),
              )}
            </div>
          </div>
        ))}

        <div className="mt-auto border-t border-[rgba(32,38,28,0.08)] pt-3">
          <button
            type="button"
            onClick={onSignOut}
            className="flex min-h-[40px] w-full items-center justify-between rounded-[14px] px-3 py-2.5 text-left text-[13px] font-medium text-[#565b54] transition-colors hover:bg-[rgba(32,38,28,0.04)] hover:text-[#1f221d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661]"
          >
            <span>Sign out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
