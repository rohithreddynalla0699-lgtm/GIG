import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import OtpVerificationCard from '../../components/partner/OtpVerificationCard';
import OrderStatusBadge from '../../components/partner/OrderStatusBadge';
import SectionCard from '../../components/shared/SectionCard';
import { getBagById } from '../../data/mock/bags';
import { getMockPartnerWorkspaceOrders, getMockPartnerWorkspaceOutlets } from '../../data/mock/partners';
import { formatINR } from '../../lib/currency';
import { formatPickupWindow } from '../../lib/dates';
import { getPaymentStatusClasses, getPaymentStatusLabel, getVegTypeLabel } from '../../lib/status';
import type { OrderStatus } from '../../types/order';

export default function PartnerOrderDetailsPage() {
  const { id } = useParams();
  const workspaceOrders = getMockPartnerWorkspaceOrders();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const order = id ? workspaceOrders.find((entry) => entry.id === id) : undefined;
  const bag = order ? getBagById(order.bagId) : undefined;
  const outlet = order ? workspaceOutlets.find((item) => item.id === order.outletId) : undefined;

  const [status, setStatus] = useState<OrderStatus | null>(order?.status ?? null);

  const actions = useMemo(
    () => ({
      markReady: () => {
        setStatus('ready_for_pickup');
      },
      markCollected: () => {
        setStatus('collected');
      },
    }),
    []
  );

  if (!order || !bag || !outlet || !status) {
    return (
      <SectionCard title="Order not found" description="This partner order is not available in the current demo data.">
        <Link to="/partner/orders" className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#1E2F24] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#17241c]">
          Back to orders
        </Link>
      </SectionCard>
    );
  }

  const canMarkReady = status === 'new_reserved';
  const canVerifyPickup = status === 'ready_for_pickup';

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="surface-card p-6 md:p-7">
        <Link to="/partner/orders" className="metadata-caption mb-4 inline-flex transition hover:text-[#1E2F24]">
          Back to orders
        </Link>
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="editorial-eyebrow mb-3">Order detail</div>
            <h1 className="font-['Fraunces',serif] text-[32px] leading-[1.08] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[38px]">
              Order #{order.id}
            </h1>
            <p className="body-large mt-3 max-w-[58ch]">
              Keep the pickup code easy to scan, confirm the customer and pickup window, and complete the handover when the order is ready.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={status} />
              <span className={`inline-flex items-center rounded-full px-3 py-[7px] text-[12px] font-semibold ${getPaymentStatusClasses(order.paymentStatus)}`}>
                {getPaymentStatusLabel(order.paymentStatus)}
              </span>
            </div>
          </div>

          <div className="rounded-[28px] bg-[#1E2F24] p-5 text-white md:p-6">
            <p className="editorial-eyebrow !text-[#A8D8B7]">Pickup code</p>
            <div className="mt-3 text-[40px] font-semibold tracking-[0.14em]">{order.pickupCode}</div>
            <p className="mt-2 text-[15px] leading-7 text-white/76">
              {formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.92fr]">
        <div className="space-y-5">
          <SectionCard
            title={order.listingTitle}
            description={`${outlet.name} · ${formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}`}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                <p className="operational-label mb-1">Customer</p>
                <p className="text-[16px] font-semibold text-[#1E1E1E]">{order.customerName}</p>
                <p className="metadata-caption mt-1">{order.customerPhoneMasked}</p>
              </div>
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                <p className="operational-label mb-1">Amount paid</p>
                <p className="text-[16px] font-semibold text-[#1E1E1E]">{formatINR(order.amountPaid)}</p>
                <p className="metadata-caption mt-1">{order.paymentSummary}</p>
              </div>
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                <p className="operational-label mb-1">Outlet</p>
                <p className="text-[16px] font-semibold text-[#1E1E1E]">{outlet.name}</p>
                <p className="metadata-caption mt-1">{outlet.addressLine}</p>
              </div>
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                <p className="operational-label mb-1">Pickup window</p>
                <p className="text-[16px] font-semibold text-[#1E1E1E]">{formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}</p>
                <p className="metadata-caption mt-1">Qty {order.quantity}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="operational-label mb-2">Listing details</p>
                <p className="body-regular">{bag.shortDescription}</p>
                <p className="metadata-caption mt-2">
                  {getVegTypeLabel(bag.vegType)} · {bag.category}
                </p>
              </div>
              <div>
                <p className="operational-label mb-2">Pickup instructions</p>
                <p className="body-regular">{order.collectionInstructions}</p>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard
            title="Pickup actions"
            description="Use the smallest set of actions needed to move this order forward."
          >
            <div className="space-y-4">
              <button
                type="button"
                onClick={actions.markReady}
                disabled={!canMarkReady}
                className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-[#1E2F24] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#17241c] disabled:bg-[#D6D9D4] disabled:text-[#8A8F8A] disabled:hover:bg-[#D6D9D4]"
              >
                Mark ready
              </button>

              <OtpVerificationCard expectedCode={order.pickupCode} canCollect={canVerifyPickup} onCollected={actions.markCollected} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
