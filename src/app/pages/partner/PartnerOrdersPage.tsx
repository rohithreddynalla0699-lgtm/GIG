import { useMemo, useState } from 'react';
import OrderTable from '../../components/partner/OrderTable';
import EmptyState from '../../components/shared/EmptyState';
import SectionCard from '../../components/shared/SectionCard';
import { getMockPartnerWorkspaceOrders } from '../../data/mock/partners';
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

export default function PartnerOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('reserved');

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

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="surface-card p-6 md:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-[52rem]">
            <div className="editorial-eyebrow mb-3">Orders</div>
            <h1 className="font-['Fraunces',serif] text-[32px] leading-[1.08] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[38px]">
              Reserved orders
            </h1>
            <p className="body-large mt-3 max-w-[58ch]">
              Review the current pickup queue, keep pickup codes easy to find, and open any order that needs a closer look.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
            <div className="operational-label mb-2">Reserved</div>
            <div className="text-[28px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.reserved}</div>
          </div>
          <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
            <div className="operational-label mb-2">Collected</div>
            <div className="text-[28px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.collected}</div>
          </div>
          <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
            <div className="operational-label mb-2">Today&apos;s pickups</div>
            <div className="text-[28px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{summary.today}</div>
          </div>
        </div>
      </section>

      <SectionCard
        title="Order queue"
        description="Switch between reserved, collected, and full order history for your outlets."
      >
        <div className="mb-5 flex flex-wrap gap-2.5">
          {(Object.keys(filterLabels) as OrderFilter[]).map((filter) => {
            const active = filter === activeFilter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`min-h-[42px] rounded-full px-4 py-2.5 text-[13px] font-semibold transition ${
                  active
                    ? 'bg-[#1E2F24] text-white'
                    : 'bg-[rgba(255,255,255,0.68)] text-[#4D5E53] hover:bg-white'
                }`}
              >
                {filterLabels[filter]}
              </button>
            );
          })}
        </div>

        {visibleOrders.length === 0 ? (
          <EmptyState
            title="No orders in this view"
            description="Reserved orders will appear here after customers reserve your rescue bags."
          />
        ) : (
          <OrderTable orders={visibleOrders} />
        )}
      </SectionCard>
    </div>
  );
}
