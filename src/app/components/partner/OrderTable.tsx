import { Link } from 'react-router';
import type { Order } from '../../types/order';
import { formatINR } from '../../lib/currency';
import { formatPickupWindow } from '../../lib/dates';
import { getOrderListSupportHint, getOrderStatusLabel } from '../../lib/status';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderTableProps {
  orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78">
      <div className="hidden xl:block">
        <table className="w-full">
          <thead className="border-b border-[color:var(--gig-border)] bg-[rgba(32,38,28,0.03)]">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Order</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Customer</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Rescue bag</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Pickup</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Code</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Amount</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Status</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const supportHint = getOrderListSupportHint(
                order.status,
                order.supportNote,
                order.supportFollowUpStatus,
                order.supportFollowUpNote,
              );

              return (
                <tr key={order.id} className="border-b border-[color:var(--gig-border)] last:border-b-0">
                  <td className="px-4 py-3 align-top">
                    <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">#{order.id}</div>
                    <div className="meta-text mt-1">Qty {order.quantity}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">{order.customerName}</div>
                    <div className="meta-text mt-1">{order.customerPhoneMasked}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">{order.listingTitle}</div>
                    <div className="meta-text mt-1 max-w-[26ch]">{supportHint}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-[13px] font-medium text-[color:var(--gig-text)]">{formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-[13px] font-semibold tracking-[0.12em] text-[color:var(--gig-text)]">{order.pickupCode}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">{formatINR(order.amountPaid)}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right align-top">
                    <Link to={`/partner/orders/${order.id}`} className="inline-flex min-h-[34px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-3 py-1.5 text-[12px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]">
                      View details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 xl:hidden">
        {orders.map((order) => (
          <div key={order.id} className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/74 px-4 py-3">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">#{order.id}</div>
                <div className="meta-text mt-1">{order.customerName} · {order.customerPhoneMasked}</div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mb-3 text-[14px] font-semibold text-[color:var(--gig-text)]">{order.listingTitle}</div>
            <div className="meta-text mb-3">
              {getOrderListSupportHint(
                order.status,
                order.supportNote,
                order.supportFollowUpStatus,
                order.supportFollowUpNote,
              )}
            </div>
            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              <div>
                <div className="meta-text mb-1">Pickup</div>
                <div className="text-[13px] font-medium text-[color:var(--gig-text)]">{formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Amount</div>
                <div className="text-[13px] font-medium text-[color:var(--gig-text)]">{formatINR(order.amountPaid)}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Code</div>
                <div className="text-[13px] font-medium tracking-[0.12em] text-[color:var(--gig-text)]">{order.pickupCode}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Status</div>
                <div className="text-[13px] font-medium text-[color:var(--gig-text)]">{getOrderStatusLabel(order.status)}</div>
              </div>
            </div>
            <Link to={`/partner/orders/${order.id}`} className="inline-flex min-h-[34px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-3 py-1.5 text-[12px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]">
              View details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
