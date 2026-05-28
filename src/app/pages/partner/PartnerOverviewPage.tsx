import { Link } from 'react-router';
import { getMockPartnerWorkspaceListings } from '../../data/mock/partnerListings';
import {
  getMockPartnerActivationState,
  getMockPartnerOperationalReadiness,
  getMockPartnerProfile,
  getMockPartnerQualitySummary,
  getMockPartnerWorkspaceAccessState,
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

function CompactStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">{label}</div>
      <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{value}</div>
      {note ? <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">{note}</div> : null}
    </div>
  );
}

function CompactRow({
  title,
  meta,
  trailing,
}: {
  title: string;
  meta: string;
  trailing?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/74 px-4 py-3">
      <div className="min-w-0">
        <div className="truncate text-[14px] font-semibold text-[#1E1E1E]">{title}</div>
        <div className="mt-0.5 truncate text-[12px] text-[color:var(--gig-text-muted)]">{meta}</div>
      </div>
      {trailing ? <div className="shrink-0 text-[12px] font-medium text-[#4D5E53]">{trailing}</div> : null}
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

export default function PartnerOverviewPage() {
  const profile = getMockPartnerProfile();
  const canPostBags = isMockPartnerVerified();
  const activationState = getMockPartnerActivationState();
  const workspaceAccessState = getMockPartnerWorkspaceAccessState(profile);
  const readiness = getMockPartnerOperationalReadiness(profile);
  const listings = getMockPartnerWorkspaceListings();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const partnerOrders = getMockPartnerWorkspaceOrders();
  const qualitySummary = getMockPartnerQualitySummary();

  const activeListings = listings.filter((listing) => ['live', 'scheduled'].includes(listing.status));
  const reservedOrders = partnerOrders.filter((order) => ['new_reserved', 'ready_for_pickup'].includes(order.status));
  const todayPickups = partnerOrders.filter((order) => order.pickupDateLabel === 'Today');
  const nextOrders = reservedOrders.slice(0, 3);
  const newestListings = [...listings]
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
    .slice(0, 3);
  const readinessItems = [
    { label: 'Profile', done: readiness.verificationApproved },
    { label: 'Food license', done: readiness.fssaiComplete },
    { label: 'Bank', done: readiness.bankLinked && readiness.panComplete && readiness.complianceComplete },
    { label: 'Billing', done: readiness.billingActive },
  ];
  const completedReadiness = readinessItems.filter((item) => item.done).length;

  if (workspaceAccessState === 'restricted') {
    return (
      <div className="space-y-4">
        <section className="flex flex-col gap-3 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="editorial-eyebrow mb-2">Dashboard</div>
              <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
                Finish setup
              </h1>
              <p className="mt-2 max-w-[58ch] text-[14px] leading-6 text-[color:var(--gig-text-muted)]">
                Complete your profile, food license, bank details, and billing to start selling rescue bags.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/78 px-3 py-2 text-[12px] font-medium text-[#4D5E53]">
                <span className="h-2 w-2 rounded-full bg-[#d6a06a]"></span>
                Locked until setup is complete
              </div>
              {activationState === 'billing_required' ? (
                <Link
                  to="/partner/billing"
                  className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(30,47,36,0.12)] px-4 py-2 text-[13px] font-semibold text-[#1E2F24] transition hover:border-[rgba(30,47,36,0.24)] hover:bg-white"
                >
                  Activate billing
                </Link>
              ) : null}
              <Link
                to="/partner/profile"
                className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]"
              >
                Continue setup
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-semibold text-[#1E1E1E]">Setup progress</div>
                  <div className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">{completedReadiness} of {readinessItems.length} done</div>
                </div>
                <div className="text-[24px] font-semibold tracking-[-0.04em] text-[#1E1E1E]">{completedReadiness}/{readinessItems.length}</div>
              </div>
            </div>
            <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
              <div className="text-[13px] font-semibold text-[#1E1E1E]">Next step</div>
              <div className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">
                {activationState === 'billing_required' ? 'Activate billing' : 'Complete your profile'}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {readinessItems.map((item) => (
            <div key={item.label} className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/76 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[13px] font-semibold text-[#1E1E1E]">{item.label}</div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${item.done ? 'bg-[rgba(11,122,77,0.08)] text-[#0b7a4d]' : 'bg-[rgba(32,38,28,0.05)] text-[color:var(--gig-text-soft)]'}`}>
                  {item.done ? 'Done' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!canPostBags ? (
        <div className="rounded-[18px] border border-[rgba(214,160,106,0.22)] bg-[rgba(214,160,106,0.12)] px-4 py-3 text-[13px] leading-6 text-[#43352b]">
          {activationState === 'billing_required' ? (
            <>
              Activate billing to unlock rescue bags.
              <Link to="/partner/billing" className="ml-2 font-semibold text-[#1E2F24] underline underline-offset-4">
                Activate billing
              </Link>
            </>
          ) : profile.verificationStatus === 'submitted_for_review' ? (
            <>
              Your profile is under review.
              <Link to="/partner/profile" className="ml-2 font-semibold text-[#1E2F24] underline underline-offset-4">
                View profile
              </Link>
            </>
          ) : (
            <>
              Finish setup to unlock rescue bags.
              <Link to="/partner/profile" className="ml-2 font-semibold text-[#1E2F24] underline underline-offset-4">
                Continue setup
              </Link>
            </>
          )}
        </div>
      ) : null}

      <section className="flex flex-col gap-4 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="editorial-eyebrow mb-2">Dashboard</div>
            <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
              Partner dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/78 px-3 py-2 text-[12px] font-medium text-[#4D5E53]">
              <span className="h-2 w-2 rounded-full bg-[#0b7a4d]"></span>
              Active
            </div>
            <Link
              to={canPostBags ? '/partner/listings' : activationState === 'billing_required' ? '/partner/billing' : '/partner/profile'}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]"
            >
              {canPostBags
                ? 'Go to Rescue Bags'
                : activationState === 'billing_required'
                  ? 'Activate billing'
                  : 'Complete your profile'}
            </Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <CompactStat
            label="Rescue bags"
            value={activeListings.length}
            note={pluralize(activeListings.filter((listing) => listing.status === 'live').length, 'live bag', 'live bags')}
          />
          <CompactStat label="Orders" value={reservedOrders.length} note="Reserved now" />
          <CompactStat label="Today" value={todayPickups.length} note="Pickups today" />
        </div>

        <div
          className={`rounded-[18px] border px-4 py-3 ${
            qualitySummary.isAtRisk
              ? 'border-[rgba(166,107,0,0.16)] bg-[rgba(255,244,214,0.34)]'
              : 'border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.06)]'
          }`}
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className={`text-[13px] font-semibold ${qualitySummary.isAtRisk ? 'text-[#8A5600]' : 'text-[#0b7a4d]'}`}>
                {qualitySummary.isAtRisk ? 'Quality review needed' : 'Quality standing is healthy'}
              </div>
              <div className="mt-1 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">
                {qualitySummary.isAtRisk
                  ? `Issue rate has crossed the ${qualitySummary.threshold}% review threshold.`
                  : `Issue rate is ${qualitySummary.issueRate}% across ${qualitySummary.totalOrders} total orders.`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/78 px-3 py-2 text-[12px] font-semibold text-[color:var(--gig-text)]">
                {qualitySummary.issueOrders} issue{qualitySummary.issueOrders === 1 ? '' : 's'}
              </div>
              <div className={`text-[24px] font-semibold tracking-[-0.04em] ${qualitySummary.isAtRisk ? 'text-[#8A5600]' : 'text-[color:var(--gig-text)]'}`}>
                {qualitySummary.issueRate}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Recent orders</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Next pickups</p>
            </div>
            <Link to="/partner/orders" className="text-[12px] font-semibold text-[#0b7a4d]">
              View all
            </Link>
          </div>
          {nextOrders.length === 0 ? (
            <CompactEmptyState
              title="Nothing here yet."
              description="Activity will appear after you create rescue bags and receive orders."
            />
          ) : (
            <div className="space-y-3">
              {nextOrders.map((order) => (
                <Link key={order.id} to={`/partner/orders/${order.id}`} className="block transition hover:-translate-y-[1px]">
                  <CompactRow
                    title={order.listingTitle}
                    meta={`${order.customerName} · ${formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}`}
                    trailing={order.pickupCode}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Recent rescue bags</h2>
                <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Latest updates</p>
              </div>
              <Link to="/partner/listings" className="text-[12px] font-semibold text-[#0b7a4d]">
                View all
              </Link>
            </div>
            {newestListings.length === 0 ? (
              <CompactEmptyState
                title="Nothing here yet."
                description="Activity will appear after you create rescue bags and receive orders."
                actionLabel={canPostBags ? 'Create rescue bag' : undefined}
                actionTo={canPostBags ? '/partner/listings/new' : undefined}
              />
            ) : (
              <div className="space-y-2.5">
                {newestListings.map((listing) => {
                  const outlet = workspaceOutlets.find((item) => item.id === listing.outletId);
                  return (
                    <CompactRow
                      key={listing.id}
                      title={listing.title}
                      meta={`${outlet?.name ?? 'Partner outlet'} · ${listing.pickupStart} - ${listing.pickupEnd} · Qty ${listing.quantityLeft}/${listing.quantity}`}
                      trailing={`Rs. ${listing.rescuePrice}`}
                    />
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="mb-3">
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Billing</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Current plan</p>
            </div>
            <div className="space-y-2.5">
              <CompactRow title="Plan" meta="Partner starter" />
              <CompactRow
                title="Status"
                meta={
                  profile.billingStatus === 'active'
                    ? 'Active'
                    : profile.billingStatus === 'billing_setup_required'
                      ? 'Billing setup required'
                      : 'Pending activation'
                }
              />
              <CompactRow title="Monthly fee" meta={`Rs. ${PARTNER_PLATFORM_FEE_INR}/month`} />
              <CompactRow title="Commission" meta={`${Math.round(PARTNER_COMMISSION_RATE * 100)}% of sales`} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
