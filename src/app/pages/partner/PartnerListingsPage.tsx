import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import ListingCard from '../../components/partner/ListingCard';
import { getMockPartnerWorkspaceListings } from '../../data/mock/partnerListings';
import {
  getMockPartnerActivationState,
  getMockPartnerCreateBagRoute,
  getMockPartnerWorkspaceAccessState,
  getMockPartnerWorkspaceOutlets,
  isMockPartnerVerified,
} from '../../data/mock/partners';
import type { ListingStatus } from '../../types/listing';

type ListingFilter = 'all' | 'live' | 'draft' | 'inactive';

const filterConfig: { key: ListingFilter; label: string; matches: ListingStatus[] }[] = [
  { key: 'all', label: 'All', matches: ['live', 'draft', 'scheduled', 'sold_out', 'paused', 'archived'] },
  { key: 'live', label: 'Live', matches: ['live'] },
  { key: 'draft', label: 'Draft', matches: ['draft', 'scheduled'] },
  { key: 'inactive', label: 'Paused / inactive', matches: ['paused', 'sold_out', 'archived'] },
];

function CompactStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">{label}</div>
      <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{value}</div>
    </div>
  );
}

function CompactEmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="rounded-[16px] border border-dashed border-[rgba(32,38,28,0.12)] px-4 py-6 text-center">
      <div className="text-[14px] font-medium text-[#1E1E1E]">{title}</div>
      <div className="mt-1 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">{description}</div>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-4 inline-flex min-h-[38px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[12px] font-semibold text-[#1E2F24] transition hover:bg-white"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default function PartnerListingsPage() {
  const [activeFilter, setActiveFilter] = useState<ListingFilter>('all');
  const listings = getMockPartnerWorkspaceListings();
  const createBagRoute = getMockPartnerCreateBagRoute();
  const activationState = getMockPartnerActivationState();
  const canPostBags = isMockPartnerVerified();
  const workspaceAccessState = getMockPartnerWorkspaceAccessState();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const liveCount = listings.filter((listing) => listing.status === 'live').length;
  const draftCount = listings.filter((listing) => ['draft', 'scheduled'].includes(listing.status)).length;
  const inactiveCount = listings.filter((listing) => ['paused', 'sold_out', 'archived'].includes(listing.status)).length;
  const visibleListings = useMemo(() => {
    const selected = filterConfig.find((item) => item.key === activeFilter) ?? filterConfig[0];
    return listings.filter((listing) => selected.matches.includes(listing.status));
  }, [activeFilter, listings]);

  if (workspaceAccessState === 'restricted') {
    return (
      <div className="space-y-4">
        <section className="flex flex-col gap-3 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="editorial-eyebrow mb-2">Rescue bags</div>
              <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
                Finish setup
              </h1>
              <p className="mt-2 max-w-[58ch] text-[14px] leading-6 text-[color:var(--gig-text-muted)]">
                Complete your profile, food license, bank details, and billing to start selling rescue bags.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/78 px-3 py-2 text-[12px] font-medium text-[#4D5E53]">
                <span className="h-2 w-2 rounded-full bg-[#d6a06a]"></span>
                Locked until setup is complete
              </div>
              <Link to="/partner/profile" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]">
                Continue setup
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Profile</div>
              <div className="mt-1 text-[14px] font-semibold text-[#1E1E1E]">Complete setup</div>
            </div>
            <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Food license</div>
              <div className="mt-1 text-[14px] font-semibold text-[#1E1E1E]">Required</div>
            </div>
            <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Billing</div>
              <div className="mt-1 text-[14px] font-semibold text-[#1E1E1E]">Required</div>
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Inventory</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Rescue bags will appear here after setup is complete.</p>
            </div>
            <div className="text-[12px] font-medium text-[color:var(--gig-text-muted)]">0 bags</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-4 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="editorial-eyebrow mb-2">Rescue bags</div>
            <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
              Rescue bags
            </h1>
            <p className="mt-1 text-[13px] text-[color:var(--gig-text-muted)]">
              {liveCount} live · {draftCount} draft · {inactiveCount} paused / inactive
            </p>
          </div>

          <Link to={createBagRoute} className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]">
            Create rescue bag
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <CompactStat label="Live" value={liveCount} />
          <CompactStat label="Draft" value={draftCount} />
          <CompactStat label="Paused / inactive" value={inactiveCount} />
        </div>
      </section>

      <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Inventory</h2>
            <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">{visibleListings.length} bags in this view</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterConfig.map((filter) => {
              const active = filter.key === activeFilter;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`min-h-[34px] rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                    active
                      ? 'bg-[#1E2F24] text-white'
                      : 'border border-[rgba(32,38,28,0.08)] bg-white/78 text-[#4D5E53] hover:bg-white'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {listings.length === 0 ? (
          <CompactEmptyState
            title="No rescue bags yet."
            description="Create your first rescue bag when setup is complete."
            actionLabel={
              canPostBags
                ? 'Create rescue bag'
                : activationState === 'billing_required'
                  ? 'Complete billing setup'
                  : 'Complete verification details'
            }
            actionTo={createBagRoute}
          />
        ) : visibleListings.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[rgba(32,38,28,0.12)] px-4 py-6 text-center">
            <div className="text-[14px] font-medium text-[#1E1E1E]">No rescue bags yet.</div>
            <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">Try another filter to see more rescue bags.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleListings.map((listing) => {
              const outlet = workspaceOutlets.find((item) => item.id === listing.outletId);
              return outlet ? <ListingCard key={listing.id} listing={listing} outlet={outlet} /> : null;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
