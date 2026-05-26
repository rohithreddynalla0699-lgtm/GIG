import { Link, NavLink } from 'react-router';
import {
  currentPartner,
  getMockPartnerActivationState,
  getMockPartnerCreateBagRoute,
  getMockPartnerProfile,
  isMockPartnerVerified,
} from '../../data/mock/partners';

export default function PartnerSidebar({ onSignOut }: { onSignOut: () => void }) {
  const profile = getMockPartnerProfile();
  const canPostBags = isMockPartnerVerified();
  const activationState = getMockPartnerActivationState();
  const navigationGroups = [
    {
      label: 'Partner',
      links: [
        { label: 'Dashboard', to: '/partner' },
        { label: 'Profile', to: '/partner/profile' },
        { label: 'Rescue bags', to: '/partner/listings' },
        { label: 'Create bag', to: getMockPartnerCreateBagRoute() },
        { label: 'Orders', to: '/partner/orders' },
      ],
    },
  ];

  return (
    <aside className="bg-[rgba(255,253,248,0.92)] border-r border-[rgba(32,38,28,0.08)] lg:h-[calc(100vh-76px)] lg:sticky lg:top-[76px] overflow-y-auto">
      <div className="p-5 border-b border-[rgba(32,38,28,0.08)]">
        <div className="operational-label text-[#0b7a4d] mb-2">Partner console</div>
        <div className="text-[17px] font-semibold text-[#1f221d] mb-1">{profile.legalBusinessName || currentPartner.businessName}</div>
        <div className="body-regular mb-3">{profile.city || currentPartner.city}, {profile.stateRegion || 'India'}</div>
        <div className="inline-flex items-center gap-2 bg-[rgba(11,122,77,0.08)] text-[#0b7a4d] rounded-full px-3 py-[7px] text-[12px] font-semibold">
          {activationState === 'active'
            ? 'Verified partner'
            : activationState === 'billing_required'
              ? 'Billing setup required'
              : 'Verification pending'}
        </div>
      </div>

      <nav className="p-3 space-y-5">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <div className="operational-label px-3 mb-2">{group.label}</div>
            <div className="space-y-1">
              {group.links.map((link) =>
                link.label === 'Create bag' && !canPostBags ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex min-h-[46px] items-center justify-between rounded-[16px] px-4 py-3 text-[14px] font-medium text-[#565b54] transition-colors hover:bg-[rgba(32,38,28,0.04)] hover:text-[#1f221d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661]"
                  >
                    <span>{link.label}</span>
                  </Link>
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    end={link.to === '/partner'}
                    className={({ isActive }) =>
                      `flex min-h-[46px] items-center justify-between px-4 py-3 rounded-[16px] text-[14px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661] transition-colors ${
                        isActive ? 'bg-[rgba(11,122,77,0.08)] text-[#0b7a4d]' : 'text-[#565b54] hover:bg-[rgba(32,38,28,0.04)] hover:text-[#1f221d]'
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

        <div>
          <div className="operational-label px-3 mb-2">Session</div>
          <button
            type="button"
            onClick={onSignOut}
            className="flex min-h-[46px] w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-[14px] font-medium text-[#565b54] transition-colors hover:bg-[rgba(32,38,28,0.04)] hover:text-[#1f221d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A661]"
          >
            <span>Sign out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
