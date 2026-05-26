import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import OrderTable from '../../components/partner/OrderTable';
import { getMockPartnerWorkspaceAccessState, getMockPartnerWorkspaceOrders } from '../../data/mock/partners';
import type { Order } from '../../types/order';

type OrderFilter = 'reserved' | 'collected' | 'all';

const filterLabels: Record<OrderFilter, string> = {
  reserved: 'Reserved',
  collected: 'Collected',
  all: 'All',
};

function matchesFilter(order: Order, filter: OrderFilter) {
  switch (filter) {
    case 'reserved':
      return ['new_reserved', 'ready_for_pickup'].includes(order.status);
    case 'collected':
      return order.status === 'collected';
    case 'all':
    default:
      return true;
  }
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
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('reserved');
  const workspaceAccessState = getMockPartnerWorkspaceAccessState();

  const partnerOrders = useMemo(
    () => getMockPartnerWorkspaceOrders(),
    []
  );

  const visibleOrders = partnerOrders.filter((order) => matchesFilter(order, activeFilter));
  const reservedOrders = partnerOrders.filter((order) => ['new_reserved', 'ready_for_pickup'].includes(order.status));
  const collectedOrders = partnerOrders.filter((order) => order.status === 'collected');
  const todayOrders = partnerOrders.filter((order) => order.pickupDateLabel === 'Today');

  const summary = {
    reserved: reservedOrders.length,
    collected: collectedOrders.length,
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

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Reserved</div>
            <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.reserved}</div>
          </div>
          <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Collected</div>
            <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.collected}</div>
          </div>
          <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Today</div>
            <div className="mt-1 text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.today}</div>
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Queue</h2>
            <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">{visibleOrders.length} orders in this view</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(filterLabels) as OrderFilter[]).map((filter) => {
              const active = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`min-h-[34px] rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                    active
                      ? 'bg-[#1E2F24] text-white'
                      : 'border border-[rgba(32,38,28,0.08)] bg-white/78 text-[#4D5E53] hover:bg-white'
                  }`}
                >
                  {filterLabels[filter]}
                </button>
              );
            })}
          </div>
        </div>

        {visibleOrders.length === 0 ? (
          <CompactEmptyState
            title="No orders yet."
            description="Orders will appear after customers reserve your rescue bags."
          />
        ) : (
          <OrderTable orders={visibleOrders} />
        )}
      </section>
    </div>
  );
}
