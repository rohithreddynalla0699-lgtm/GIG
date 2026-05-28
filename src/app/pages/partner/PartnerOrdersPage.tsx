import { useMemo } from 'react';
import { Link } from 'react-router';
import OrderTable from '../../components/partner/OrderTable';
import {
  getMockPartnerPickupReadinessSummary,
  getMockPartnerQualitySummary,
  getMockPartnerWorkspaceAccessState,
  getMockPartnerWorkspaceOrders,
} from '../../data/mock/partners';
import type { Order } from '../../types/order';

function sortOrdersByPickupWindow(orders: Order[]) {
  return [...orders].sort((first, second) => {
    if (first.pickupDateLabel !== second.pickupDateLabel) {
      return first.pickupDateLabel.localeCompare(second.pickupDateLabel);
    }

    return first.pickupWindow.localeCompare(second.pickupWindow);
  });
}

function getOperationalOrderGroups(orders: Order[]) {
  return {
    active: sortOrdersByPickupWindow(
      orders.filter((order) => order.status === 'new_reserved' || order.status === 'ready_for_pickup'),
    ),
    support: sortOrdersByPickupWindow(
      orders.filter((order) => order.status === 'issue_reported' || order.status === 'no_show'),
    ),
    completed: sortOrdersByPickupWindow(
      orders.filter((order) => order.status === 'collected' || order.status === 'cancelled'),
    ),
  };
}

function QueueSection({
  title,
  description,
  count,
  emptyTitle,
  emptyDescription,
  orders,
}: {
  title: string;
  description: string;
  count: number;
  emptyTitle: string;
  emptyDescription: string;
  orders: Order[];
}) {
  return (
    <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[#1E1E1E]">{title}</h2>
          <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">{description}</p>
        </div>
        <div className="text-[12px] font-medium text-[color:var(--gig-text-muted)]">
          {count} order{count === 1 ? '' : 's'}
        </div>
      </div>

      {orders.length === 0 ? (
        <CompactEmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <OrderTable orders={orders} />
      )}
    </section>
  );
}

function CompactEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[16px] border border-dashed border-[rgba(32,38,28,0.12)] px-4 py-6 text-center">
      <div className="text-[14px] font-medium text-[#1E1E1E]">{title}</div>
      <div className="mt-1 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">{description}</div>
    </div>
  );
}

export default function PartnerOrdersPage() {
  const workspaceAccessState = getMockPartnerWorkspaceAccessState();

  const partnerOrders = useMemo(
    () => getMockPartnerWorkspaceOrders(),
    []
  );

  const groupedOrders = useMemo(() => getOperationalOrderGroups(partnerOrders), [partnerOrders]);
  const qualitySummary = useMemo(() => getMockPartnerQualitySummary(), []);
  const pickupReadiness = useMemo(() => getMockPartnerPickupReadinessSummary(), []);
  const todayOrders = partnerOrders.filter((order) => order.pickupDateLabel === 'Today');

  const summary = {
    active: groupedOrders.active.length,
    support: groupedOrders.support.length,
    completed: groupedOrders.completed.length,
    today: todayOrders.length,
  };

  if (workspaceAccessState === 'restricted') {
    return (
      <div className="space-y-4">
        <section className="flex flex-col gap-3 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="editorial-eyebrow mb-2">Orders</div>
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
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Orders</div>
              <div className="mt-1 text-[14px] font-semibold text-[#1E1E1E]">Pickup queue locked</div>
            </div>
            <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Profile</div>
              <div className="mt-1 text-[14px] font-semibold text-[#1E1E1E]">Complete setup</div>
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
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Queue</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Orders will appear here after setup is complete.</p>
            </div>
            <div className="text-[12px] font-medium text-[color:var(--gig-text-muted)]">0 orders</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-4 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
        <div className="flex flex-col gap-2">
          <div className="editorial-eyebrow">Orders</div>
          <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
            Orders
          </h1>
          <p className="text-[13px] text-[color:var(--gig-text-muted)]">Track reserved pickups, completed handovers, and today&apos;s queue.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Active pickups</div>
            <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.active}</div>
          </div>
          <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Support attention</div>
            <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.support}</div>
          </div>
          <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Closed</div>
            <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.completed}</div>
          </div>
          <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Today</div>
            <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.today}</div>
          </div>
        </div>

        {qualitySummary.isAtRisk ? (
          <div className="rounded-[18px] border border-[rgba(166,107,0,0.16)] bg-[rgba(255,244,214,0.34)] px-4 py-3">
            <div className="text-[13px] font-semibold text-[#8A5600]">Quality review needed</div>
            <div className="mt-1 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">
              Issue rate has crossed the {qualitySummary.threshold}% review threshold.
            </div>
          </div>
        ) : null}

        {pickupReadiness.status === 'prep_needed' ? (
          <div className="rounded-[18px] border border-[rgba(198,146,63,0.16)] bg-[rgba(255,248,229,0.72)] px-4 py-3">
            <div className="text-[13px] font-semibold text-[#7A5210]">Prep needed</div>
            <div className="mt-1 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">
              {pickupReadiness.notYetReadyOrders} new reservation{pickupReadiness.notYetReadyOrders === 1 ? '' : 's'} still need pickup preparation.
            </div>
          </div>
        ) : pickupReadiness.activePickupOrders > 0 && pickupReadiness.readyOrders === pickupReadiness.activePickupOrders ? (
          <div className="rounded-[18px] border border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.06)] px-4 py-3">
            <div className="text-[13px] font-semibold text-[#0b7a4d]">All active pickups are ready</div>
            <div className="mt-1 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">
              {pickupReadiness.readyOrders} order{pickupReadiness.readyOrders === 1 ? '' : 's'} are marked ready for today&apos;s pickup queue.
            </div>
          </div>
        ) : null}
      </section>

      <QueueSection
        title="Active pickup queue"
        description="New reservations and ready pickups appear here first. Prepare bags, verify pickup code, then mark collected."
        count={groupedOrders.active.length}
        emptyTitle="No active pickups."
        emptyDescription="New reservations and ready pickups will appear here."
        orders={groupedOrders.active}
      />

      <QueueSection
        title="Support attention"
        description="Issue-reported and no-show orders stay grouped here for follow-up."
        count={groupedOrders.support.length}
        emptyTitle="No support issues."
        emptyDescription="Issue-reported or no-show orders will appear here if they need attention."
        orders={groupedOrders.support}
      />

      <QueueSection
        title="Completed and closed"
        description="Collected and cancelled orders stay here as closed operational records."
        count={groupedOrders.completed.length}
        emptyTitle="No closed orders yet."
        emptyDescription="Collected and cancelled orders will appear here after the active queue is cleared."
        orders={groupedOrders.completed}
      />
    </div>
  );
}
