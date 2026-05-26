import { Link } from 'react-router';
import EmptyState from '../../components/shared/EmptyState';
import SectionCard from '../../components/shared/SectionCard';
import { getMockPartnerWorkspaceListings } from '../../data/mock/partnerListings';
import {
  getMockPartnerActivationState,
  getMockPartnerCreateBagRoute,
  getMockPartnerProfile,
  getMockPartnerWorkspaceOrders,
  getMockPartnerWorkspaceOutlets,
  isMockPartnerVerified,
  PARTNER_COMMISSION_RATE,
  PARTNER_PLATFORM_FEE_INR,
} from '../../data/mock/partners';
import { formatPickupWindow } from '../../lib/dates';

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default function PartnerOverviewPage() {
  const profile = getMockPartnerProfile();
  const canPostBags = isMockPartnerVerified();
  const activationState = getMockPartnerActivationState();
  const createBagRoute = getMockPartnerCreateBagRoute();
  const listings = getMockPartnerWorkspaceListings();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const partnerOrders = getMockPartnerWorkspaceOrders();

  const activeListings = listings.filter((listing) => ['live', 'scheduled'].includes(listing.status));
  const reservedOrders = partnerOrders.filter((order) => ['new_reserved', 'ready_for_pickup'].includes(order.status));
  const todayPickups = partnerOrders.filter((order) => order.pickupDateLabel === 'Today');
  const nextOrders = reservedOrders.slice(0, 3);
  const newestListings = [...listings]
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .slice(0, 3);

  return (
    <div className="space-y-6 md:space-y-7">
      {!canPostBags ? (
        <div className="rounded-[24px] border border-[rgba(214,160,106,0.22)] bg-[rgba(214,160,106,0.12)] px-5 py-4 text-[14px] leading-7 text-[#43352b]">
          {activationState === 'billing_required' ? (
            <>
              Verification has been approved in demo mode, but posting stays blocked until billing setup is completed.
              <Link to="/partner/billing" className="ml-2 font-semibold text-[#1E2F24] underline underline-offset-4">
                Complete billing setup
              </Link>
            </>
          ) : profile.verificationStatus === 'submitted_for_review' ? (
            <>
              Your verification details have been submitted for review. Demo approval is completed from Partner Profile before billing setup can begin.
              <Link to="/partner/profile" className="ml-2 font-semibold text-[#1E2F24] underline underline-offset-4">
                Return to profile
              </Link>
            </>
          ) : (
            <>
              Complete partner verification before posting rescue bags. Your account is currently <span className="font-semibold">pending verification</span>.
              <Link to="/partner/profile" className="ml-2 font-semibold text-[#1E2F24] underline underline-offset-4">
                Complete verification details
              </Link>
            </>
          )}
        </div>
      ) : null}

      <section className="surface-card overflow-hidden p-6 md:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="max-w-[56rem]">
            <div className="editorial-eyebrow mb-3">Partner dashboard</div>
            <h1 className="font-['Fraunces',serif] text-[32px] leading-[1.08] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[38px]">
              Run rescue bags and pickups without the dashboard clutter.
            </h1>
            <p className="body-large mt-3 max-w-[60ch]">
              Start with the essentials: how many rescue bags are active, which orders are reserved, and what needs to be handed over today.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={createBagRoute}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#1E2F24] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#17241c]"
              >
                {canPostBags
                  ? 'Create rescue bag'
                  : activationState === 'billing_required'
                    ? 'Complete billing setup'
                    : 'Complete verification details'}
              </Link>
              <Link
                to="/partner/orders"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(30,47,36,0.12)] px-5 py-3 text-[14px] font-semibold text-[#1E2F24] transition hover:border-[rgba(30,47,36,0.24)] hover:bg-white"
              >
                {partnerOrders.length === 0 ? 'Review order workspace' : 'View reserved orders'}
              </Link>
            </div>
            {partnerOrders.length === 0 ? (
              <p className="mt-3 text-[14px] leading-7 text-[color:var(--gig-text-muted)]">
                Orders stay empty until customers start reserving rescue bags from this workspace.
              </p>
            ) : null}
          </div>

          <div className="rounded-[28px] bg-[#1E2F24] p-5 text-white md:p-6">
            <div className="editorial-eyebrow !text-[#A8D8B7]">Today at a glance</div>
            <p className="mt-3 text-[14px] leading-7 text-white/72">
              {activationState === 'active'
                ? 'Your partner account is approved and can start posting rescue bags.'
                : activationState === 'billing_required'
                  ? 'Verification is approved, but billing setup must be completed before rescue bag posting goes live.'
                  : 'Verification is still pending. Rescue bag posting stays blocked until GIG approves your business.'}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3 xl:grid-cols-1 xl:gap-5">
              <div>
                <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/58">Active rescue bags</div>
                <div className="mt-2 text-[34px] font-semibold tracking-[-0.04em] text-white">{activeListings.length}</div>
                <p className="mt-1 text-[14px] leading-6 text-white/72">
                  {pluralize(activeListings.filter((listing) => listing.status === 'live').length, 'bag is live', 'bags are live')} now.
                </p>
              </div>
              <div>
                <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/58">Reserved orders</div>
                <div className="mt-2 text-[34px] font-semibold tracking-[-0.04em] text-white">{reservedOrders.length}</div>
                <p className="mt-1 text-[14px] leading-6 text-white/72">
                  Orders waiting to be prepared or handed over.
                </p>
              </div>
              <div>
                <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/58">Today&apos;s pickups</div>
                <div className="mt-2 text-[34px] font-semibold tracking-[-0.04em] text-white">{todayPickups.length}</div>
                <p className="mt-1 text-[14px] leading-6 text-white/72">
                  Pickup windows scheduled across your outlets today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Reserved orders"
          description="The next customer pickups your team needs to be ready for."
        >
          {nextOrders.length === 0 ? (
            <EmptyState
              title="No reserved orders yet"
              description="Reserved orders will appear here after customers reserve your rescue bags."
            />
          ) : (
            <div className="space-y-3">
              {nextOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/partner/orders/${order.id}`}
                  className="block rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4 transition hover:-translate-y-[1px] hover:bg-white"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="operational-label mb-1">Order #{order.id}</p>
                      <h3 className="text-[17px] font-semibold text-[#1E1E1E]">{order.listingTitle}</h3>
                      <p className="metadata-caption mt-1">
                        {order.customerName} · {formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#516156]">Pickup code</div>
                      <div className="mt-1 text-[16px] font-semibold tracking-[0.12em] text-[#1E1E1E]">{order.pickupCode}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Billing summary"
          description="A simple view of the partner plan while activation is still pending."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
              <p className="operational-label mb-1">Plan</p>
              <p className="text-[16px] font-semibold text-[#1E1E1E]">Partner starter</p>
            </div>
            <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
              <p className="operational-label mb-1">Status</p>
              <p className="text-[16px] font-semibold text-[#1E1E1E]">
                {profile.billingStatus === 'active'
                  ? 'Active'
                  : profile.billingStatus === 'billing_setup_required'
                    ? 'Billing setup required'
                    : 'Pending activation'}
              </p>
            </div>
            <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
              <p className="operational-label mb-1">Platform fee</p>
              <p className="text-[16px] font-semibold text-[#1E1E1E]">Rs. {PARTNER_PLATFORM_FEE_INR}/month</p>
            </div>
            <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
              <p className="operational-label mb-1">Commission</p>
              <p className="text-[16px] font-semibold text-[#1E1E1E]">{Math.round(PARTNER_COMMISSION_RATE * 100)}% of sales</p>
            </div>
          </div>
          <p className="mt-4 text-[14px] leading-7 text-[color:var(--gig-text-muted)]">
            Billing activation is mocked in this frontend demo. No real payment is collected here yet, and Razorpay autopay setup comes later.
          </p>
        </SectionCard>

        <SectionCard
          title="Recent rescue bags"
          description="A quick view of the bags your team is currently running or preparing."
        >
          {newestListings.length === 0 ? (
            <EmptyState
              title="No rescue bags yet"
              description="Create your first rescue bag to start building this partner workspace."
              actionLabel={canPostBags ? 'Create rescue bag' : undefined}
              actionTo={canPostBags ? '/partner/listings/new' : undefined}
            />
          ) : (
            <div className="space-y-3">
              {newestListings.map((listing) => {
                const outlet = workspaceOutlets.find((item) => item.id === listing.outletId);
                return (
                  <div key={listing.id} className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="operational-label mb-1">
                          {outlet?.name ?? 'Partner outlet'} · {listing.status.replace('_', ' ')}
                        </p>
                        <h3 className="text-[17px] font-semibold text-[#1E1E1E]">{listing.title}</h3>
                        <p className="metadata-caption mt-1">
                          {listing.pickupStart} - {listing.pickupEnd} · Qty {listing.quantityLeft}/{listing.quantity}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#516156]">Rescue price</div>
                        <div className="mt-1 text-[16px] font-semibold text-[#1E1E1E]">Rs. {listing.rescuePrice}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
