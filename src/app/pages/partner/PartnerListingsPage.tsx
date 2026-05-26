import { Link } from 'react-router';
import ListingCard from '../../components/partner/ListingCard';
import EmptyState from '../../components/shared/EmptyState';
import SectionCard from '../../components/shared/SectionCard';
import { getMockPartnerWorkspaceListings } from '../../data/mock/partnerListings';
import {
  getMockPartnerActivationState,
  getMockPartnerCreateBagRoute,
  getMockPartnerWorkspaceOutlets,
  isMockPartnerVerified,
} from '../../data/mock/partners';
import type { ListingStatus } from '../../types/listing';

const sections: { title: string; statuses: ListingStatus[]; description: string }[] = [
  {
    title: 'Live',
    statuses: ['live'],
    description: 'Rescue bags that customers can reserve right now.',
  },
  {
    title: 'Draft / Scheduled',
    statuses: ['scheduled', 'draft'],
    description: 'Bags your team is preparing before they go live.',
  },
  {
    title: 'Inactive',
    statuses: ['paused', 'sold_out', 'archived'],
    description: 'Reference bags that are not currently open for reservation.',
  },
];

export default function PartnerListingsPage() {
  const listings = getMockPartnerWorkspaceListings();
  const createBagRoute = getMockPartnerCreateBagRoute();
  const activationState = getMockPartnerActivationState();
  const canPostBags = isMockPartnerVerified();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const liveCount = listings.filter((listing) => listing.status === 'live').length;
  const draftCount = listings.filter((listing) => ['draft', 'scheduled'].includes(listing.status)).length;
  const inactiveCount = listings.filter((listing) => ['paused', 'sold_out', 'archived'].includes(listing.status)).length;

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="surface-card p-6 md:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-[52rem]">
            <div className="editorial-eyebrow mb-3">Listings</div>
            <h1 className="font-['Fraunces',serif] text-[32px] leading-[1.08] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[38px]">
              Rescue bags
            </h1>
            <p className="body-large mt-3 max-w-[58ch]">
              Confirm what is live, what is still being prepared, and what is no longer open for pickup.
            </p>
          </div>

          <Link to={createBagRoute} className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#1E2F24] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#17241c]">
            Create rescue bag
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
            <div className="operational-label mb-2">Live</div>
            <div className="text-[28px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{liveCount}</div>
          </div>
          <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
            <div className="operational-label mb-2">Draft / Scheduled</div>
            <div className="text-[28px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{draftCount}</div>
          </div>
          <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
            <div className="operational-label mb-2">Inactive</div>
            <div className="text-[28px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{inactiveCount}</div>
          </div>
        </div>
      </section>

      {listings.length === 0 ? (
        <EmptyState
          title="No rescue bags yet"
          description="Create your first rescue bag and it will appear here. New partner workspaces start empty until you post one."
          actionLabel={
            canPostBags
              ? 'Create rescue bag'
              : activationState === 'billing_required'
                ? 'Complete billing setup'
                : 'Complete verification details'
          }
          actionTo={createBagRoute}
        />
      ) : (
      <div className="space-y-5">
        {sections.map((section) => {
          const entries = listings.filter((listing) => section.statuses.includes(listing.status));
          if (entries.length === 0) {
            return null;
          }

          return (
            <SectionCard
              key={section.title}
              title={section.title}
              description={section.description}
            >
              <div className="space-y-4">
                {entries.map((listing) => {
                  const outlet = workspaceOutlets.find((item) => item.id === listing.outletId);
                  return outlet ? <ListingCard key={listing.id} listing={listing} outlet={outlet} /> : null;
                })}
              </div>
            </SectionCard>
          );
        })}
      </div>
      )}
    </div>
  );
}
