import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import OtpVerificationCard from '../../components/partner/OtpVerificationCard';
import OrderStatusBadge from '../../components/partner/OrderStatusBadge';
import OrderTimeline from '../../components/partner/OrderTimeline';
import SectionCard from '../../components/shared/SectionCard';
import { getBagById } from '../../data/mock/bags';
import { MockOrderLifecycleError, updateMockOrderStatus } from '../../data/mock/orders';
import { getMockPartnerWorkspaceOrders, getMockPartnerWorkspaceOutlets } from '../../data/mock/partners';
import { formatINR } from '../../lib/currency';
import { formatPickupWindow } from '../../lib/dates';
import { getPaymentStatusClasses, getPaymentStatusLabel, getVegTypeLabel } from '../../lib/status';
import type { OrderStatus } from '../../types/order';

export default function PartnerOrderDetailsPage() {
  const { id } = useParams();
  const workspaceOrders = getMockPartnerWorkspaceOrders();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const initialOrder = id ? workspaceOrders.find((entry) => entry.id === id) : undefined;
  const [currentOrder, setCurrentOrder] = useState(initialOrder);
  const order = currentOrder;
  const bag = order ? getBagById(order.bagId) : undefined;
  const outlet = order ? workspaceOutlets.find((item) => item.id === order.outletId) : undefined;

  const [status, setStatus] = useState<OrderStatus | null>(order?.status ?? null);
  const [actionError, setActionError] = useState('');

  const actions = useMemo(
    () => ({
      markReady: () => {
        try {
          setActionError('');
          const nextOrder = updateMockOrderStatus(order?.id ?? '', 'ready_for_pickup');
          if (nextOrder) {
            setCurrentOrder(nextOrder);
          }
          setStatus(nextOrder?.status ?? 'ready_for_pickup');
        } catch (error) {
          if (error instanceof MockOrderLifecycleError) {
            setActionError('This order cannot move to ready right now.');
            return;
          }
          setActionError('We could not update this order right now.');
        }
      },
      markCollected: () => {
        try {
          setActionError('');
          const nextOrder = updateMockOrderStatus(order?.id ?? '', 'collected');
          if (nextOrder) {
            setCurrentOrder(nextOrder);
          }
          setStatus(nextOrder?.status ?? 'collected');
        } catch (error) {
          if (error instanceof MockOrderLifecycleError) {
            setActionError('This order cannot move to collected yet.');
            return;
          }
          setActionError('We could not update this order right now.');
        }
      },
      markNoShow: () => {
        try {
          setActionError('');
          const nextOrder = updateMockOrderStatus(order?.id ?? '', 'no_show');
          if (nextOrder) {
            setCurrentOrder(nextOrder);
          }
          setStatus(nextOrder?.status ?? 'no_show');
        } catch (error) {
          if (error instanceof MockOrderLifecycleError) {
            setActionError('This order cannot move to no-show yet.');
            return;
          }
          setActionError('We could not update this order right now.');
        }
      },
      reportIssue: () => {
        try {
          setActionError('');
          const nextOrder = updateMockOrderStatus(order?.id ?? '', 'issue_reported');
          if (nextOrder) {
            setCurrentOrder(nextOrder);
          }
          setStatus(nextOrder?.status ?? 'issue_reported');
        } catch (error) {
          if (error instanceof MockOrderLifecycleError) {
            setActionError('This order cannot be reported right now.');
            return;
          }
          setActionError('We could not update this order right now.');
        }
      },
    }),
    [order?.id]
  );

  if (!order || !bag || !outlet || !status) {
    return (
      <SectionCard title="Order not found" description="This order is not available in the current demo data.">
        <Link to="/partner/orders" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]">
          Back to orders
        </Link>
      </SectionCard>
    );
  }

  const canMarkReady = status === 'new_reserved';
  const canVerifyPickup = status === 'ready_for_pickup';
  const canMarkNoShow = status === 'ready_for_pickup';
  const canReportIssue = ['new_reserved', 'ready_for_pickup', 'collected', 'no_show'].includes(status);

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-4 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
        <Link to="/partner/orders" className="inline-flex text-[12px] font-medium text-[color:var(--gig-text-muted)] transition hover:text-[#1E2F24]">
          Back to orders
        </Link>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="editorial-eyebrow mb-2">Order</div>
            <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
              #{order.id}
            </h1>
            <p className="mt-1 text-[13px] text-[color:var(--gig-text-muted)]">
              {order.customerName} · {formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={status} />
            <span className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${getPaymentStatusClasses(order.paymentStatus)}`}>
              {getPaymentStatusLabel(order.paymentStatus)}
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="mb-3">
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">{order.listingTitle}</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">{outlet.name}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                <div className="meta-text mb-1">Customer</div>
                <div className="text-[14px] font-semibold text-[#1E1E1E]">{order.customerName}</div>
                <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">{order.customerPhoneMasked}</div>
              </div>
              <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                <div className="meta-text mb-1">Amount paid</div>
                <div className="text-[14px] font-semibold text-[#1E1E1E]">{formatINR(order.amountPaid)}</div>
                <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">{order.paymentSummary}</div>
              </div>
              <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                <div className="meta-text mb-1">Payment</div>
                <div className="text-[14px] font-semibold text-[#1E1E1E]">{getPaymentStatusLabel(order.paymentStatus)}</div>
              </div>
              <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                <div className="meta-text mb-1">Outlet</div>
                <div className="text-[14px] font-semibold text-[#1E1E1E]">{outlet.name}</div>
                <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">{outlet.addressLine}</div>
              </div>
              <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                <div className="meta-text mb-1">Pickup window</div>
                <div className="text-[14px] font-semibold text-[#1E1E1E]">{formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}</div>
                <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">Qty {order.quantity}</div>
              </div>
              <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                <div className="meta-text mb-1">Food type</div>
                <div className="text-[14px] font-semibold text-[#1E1E1E]">{getVegTypeLabel(bag.vegType)}</div>
                <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">{bag.category}</div>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="operational-label mb-2">Rescue bag</div>
                <p className="text-[13px] leading-6 text-[color:var(--gig-text-muted)]">{bag.shortDescription}</p>
              </div>
              <div>
                <div className="operational-label mb-2">Order update</div>
                <p className="text-[13px] leading-6 text-[color:var(--gig-text-muted)]">{order.supportNote}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="operational-label mb-2">Pickup instructions</div>
                <p className="text-[13px] leading-6 text-[color:var(--gig-text-muted)]">{order.collectionInstructions}</p>
              </div>
              <div>
                <div className="operational-label mb-2">Order timeline</div>
                <OrderTimeline events={order.timeline} />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="mb-3">
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Pickup actions</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Use the pickup code and move the order forward.</p>
            </div>

            <div className="mb-3 rounded-[16px] bg-[#1E2F24] px-4 py-4 text-white">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/68">Pickup code</div>
              <div className="mt-2 text-[30px] font-semibold tracking-[0.14em]">{order.pickupCode}</div>
              <div className="mt-1 text-[12px] text-white/76">{formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}</div>
            </div>

            <div className="space-y-3">
              {actionError ? (
                <div className="rounded-[16px] border border-[rgba(192,90,43,0.16)] bg-[rgba(192,90,43,0.08)] px-4 py-3 text-[13px] leading-6 text-[color:var(--gig-text-muted)]">
                  {actionError}
                </div>
              ) : null}

              <button
                type="button"
                onClick={actions.markReady}
                disabled={!canMarkReady}
                className="inline-flex min-h-[40px] w-full items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c] disabled:bg-[#D6D9D4] disabled:text-[#8A8F8A] disabled:hover:bg-[#D6D9D4]"
              >
                Mark ready
              </button>

              <OtpVerificationCard expectedCode={order.pickupCode} canCollect={canVerifyPickup} onCollected={actions.markCollected} />

              <button
                type="button"
                onClick={actions.markNoShow}
                disabled={!canMarkNoShow}
                className="inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-[rgba(192,90,43,0.22)] bg-[rgba(255,240,238,0.88)] px-4 py-2 text-[13px] font-semibold text-[#A6572E] transition hover:bg-[rgba(255,240,238,1)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Mark no-show
              </button>

              <button
                type="button"
                onClick={actions.reportIssue}
                disabled={!canReportIssue}
                className="inline-flex min-h-[40px] w-full items-center justify-center rounded-full border border-[rgba(166,107,0,0.18)] bg-[rgba(255,244,214,0.88)] px-4 py-2 text-[13px] font-semibold text-[#A66B00] transition hover:bg-[rgba(255,244,214,1)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Report issue
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
