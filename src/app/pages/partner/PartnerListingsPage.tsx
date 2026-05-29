import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import ListingCard from '../../components/partner/ListingCard';
import ListingForm from '../../components/partner/ListingForm';
import {
  MAX_RESCUE_BAG_TYPES_PER_PARTNER,
  archiveMockPartnerListing,
  canCreateMockPartnerLiveListing,
  getMockPartnerWorkspaceLiveListingCount,
  getMockPartnerWorkspaceLiveListings,
  getMockPartnerWorkspaceNotLiveReferenceListings,
  updateMockPartnerListingInventory,
} from '../../data/mock/partnerListings';
import {
  getMockPartnerActiveStoreSummary,
  getMockPartnerWorkspaceAccessState,
  getMockPartnerWorkspaceOutlets,
  isMockPartnerVerified,
} from '../../data/mock/partners';
import type { PartnerListing } from '../../types/listing';
import { formatINR } from '../../lib/currency';
import { getListingStatusClasses, getListingStatusLabel } from '../../lib/status';

function CompactStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">{label}</div>
      <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{value}</div>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const previousHtmlOverflow = documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    documentElement.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,34,29,0.32)] px-4 py-6 backdrop-blur-[6px]">
      <div className="max-h-[90vh] w-full max-w-[940px] overflow-y-auto rounded-[28px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,252,246,0.98)] shadow-[0_24px_70px_rgba(31,34,29,0.18)]">
        <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 md:px-6 md:pt-6">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Rescue bags</div>
            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-[#1E1E1E] md:text-[28px]">
              Create rescue bag
            </h2>
            <p className="mt-1 max-w-[42ch] text-[13px] leading-6 text-[color:var(--gig-text-muted)]">
              Set up a live rescue bag type for today&apos;s surplus food.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] bg-white/72 text-[18px] leading-none text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="px-5 pb-5 md:px-6 md:pb-6">{children}</div>
      </div>
    </div>
  );
}

export default function PartnerListingsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [liveListings, setLiveListings] = useState<PartnerListing[]>(() => getMockPartnerWorkspaceLiveListings());
  const [notLiveListings, setNotLiveListings] = useState<PartnerListing[]>(() => getMockPartnerWorkspaceNotLiveReferenceListings());
  const [notice, setNotice] = useState('');

  const canPostBags = isMockPartnerVerified();
  const workspaceAccessState = getMockPartnerWorkspaceAccessState();
  const activeStore = getMockPartnerActiveStoreSummary();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const liveTypeCount = useMemo(() => getMockPartnerWorkspaceLiveListingCount(), [liveListings]);
  const remainingSlots = Math.max(0, MAX_RESCUE_BAG_TYPES_PER_PARTNER - liveTypeCount);
  const canCreate = canCreateMockPartnerLiveListing();

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice('');
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const refreshListings = () => {
    setLiveListings(getMockPartnerWorkspaceLiveListings());
    setNotLiveListings(getMockPartnerWorkspaceNotLiveReferenceListings());
  };

  const handleCreated = () => {
    refreshListings();
    setIsCreateModalOpen(false);
  };

  const handleUpdateInventory = (listingId: string, quantity: number, quantityLeft: number) => {
    updateMockPartnerListingInventory(listingId, quantity, quantityLeft);
    refreshListings();
    setNotice('Rescue bag updated.');
  };

  const handleArchiveListing = (listingId: string) => {
    archiveMockPartnerListing(listingId);
    refreshListings();
    setNotice('Rescue bag archived. You can create another type.');
  };

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
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Rescue bag types</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Rescue bag types will appear here after setup is complete.</p>
            </div>
            <div className="text-[12px] font-medium text-[color:var(--gig-text-muted)]">0 live types</div>
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
            <div className="editorial-eyebrow mb-2">Rescue bag types</div>
            <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
              Rescue bag types
            </h1>
            <p className="mt-1 text-[13px] text-[color:var(--gig-text-muted)]">
              Create up to 3 live rescue bag types. Each type can have its own daily quantity.
            </p>
            <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/78 px-3 py-2 text-[12px] font-medium text-[#4D5E53]">
              <span className="h-2 w-2 rounded-full bg-[#0b7a4d]"></span>
              Pickup hub: {activeStore.storeName} · {activeStore.area}, {activeStore.city}
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!canCreate}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c] disabled:bg-[#D6D9D4] disabled:text-[#8A8F8A] disabled:hover:bg-[#D6D9D4]"
            >
              Create rescue bag
            </button>
            {!canCreate ? (
              <div className="max-w-[28ch] text-[12px] leading-5 font-medium text-[#8A5C2B]">
                You can create up to 3 rescue bag types. Increase quantity inside a type to sell more units.
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <CompactStat label="Live types" value={liveTypeCount} />
          <CompactStat label="Slots left" value={remainingSlots} />
          <CompactStat label="Max types" value={MAX_RESCUE_BAG_TYPES_PER_PARTNER} />
        </div>
      </section>

      <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Live rescue bag types</h2>
            <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">{liveListings.length} live types for your pickup hub</p>
          </div>
          <div className="text-[12px] font-medium text-[color:var(--gig-text-muted)]">{activeStore.area}, {activeStore.city}</div>
        </div>

        {notice ? (
          <div className="mb-4 rounded-[16px] border border-[rgba(39,114,74,0.12)] bg-[rgba(39,114,74,0.08)] px-4 py-3 text-[13px] font-medium text-[#255b3d]">
            {notice}
          </div>
        ) : null}

        {liveListings.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[rgba(32,38,28,0.12)] px-4 py-6 text-center">
            <div className="text-[14px] font-medium text-[#1E1E1E]">No rescue bag types yet.</div>
            <div className="mt-1 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">
              Start with Daily Surprise Bag or create your own.
            </div>
            {canPostBags && canCreate ? (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 inline-flex min-h-[38px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[12px] font-semibold text-[#1E2F24] transition hover:bg-white"
              >
                Create rescue bag
              </button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-3">
            {liveListings.map((listing) => {
              const outlet = workspaceOutlets.find((item) => item.id === listing.outletId);
              return outlet ? (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  outlet={outlet}
                  onUpdateInventory={handleUpdateInventory}
                  onArchive={handleArchiveListing}
                />
              ) : null;
            })}
          </div>
        )}
      </section>

      {notLiveListings.length > 0 ? (
        <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(250,245,236,0.58)] p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Not live</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">
                Archived and sold-out bag types stay here for reference.
              </p>
            </div>
            <div className="text-[12px] font-medium text-[color:var(--gig-text-muted)]">
              {notLiveListings.length} type{notLiveListings.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="space-y-2.5">
            {notLiveListings.map((listing) => {
              return (
                <article
                  key={listing.id}
                  className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3.5"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px] text-[color:var(--gig-text-muted)]">
                        <span className="font-medium text-[color:var(--gig-text-soft)]">{activeStore.storeName}</span>
                        <span>•</span>
                        <span>{listing.category}</span>
                      </div>
                      <h3 className="truncate text-[16px] font-semibold tracking-[-0.03em] text-[color:var(--gig-text)]">
                        {listing.title}
                      </h3>
                      <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">{listing.createdAtLabel}</div>
                    </div>

                    <span
                      className={`inline-flex self-start rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${getListingStatusClasses(listing.status)}`}
                    >
                      {getListingStatusLabel(listing.status)}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <div className="meta-text mb-1">Rescue price</div>
                      <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">{formatINR(listing.rescuePrice)}</div>
                    </div>
                    <div>
                      <div className="meta-text mb-1">Daily quantity</div>
                      <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{listing.quantity}</div>
                    </div>
                    <div>
                      <div className="meta-text mb-1">Last available</div>
                      <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{listing.quantityLeft}</div>
                    </div>
                    <div>
                      <div className="meta-text mb-1">Pickup</div>
                      <div className="text-[14px] font-medium text-[color:var(--gig-text)]">
                        {listing.pickupStart} - {listing.pickupEnd}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {isCreateModalOpen ? (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <ListingForm
            variant="modal"
            initialTitle="Daily Surprise Bag"
            defaultStatus="live"
            redirectOnSuccess={false}
            onCancel={() => setIsCreateModalOpen(false)}
            onCreated={handleCreated}
          />
        </Modal>
      ) : null}
    </div>
  );
}
