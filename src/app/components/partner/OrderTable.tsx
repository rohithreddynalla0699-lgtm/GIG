import { Link } from 'react-router';
import type { Order } from '../../types/order';
import { formatINR } from '../../lib/currency';
import { formatPickupWindow } from '../../lib/dates';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderTableProps {
  orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="surface-card overflow-hidden rounded-[26px]">
      <div className="hidden xl:block">
        <table className="w-full">
          <thead className="border-b border-[color:var(--gig-border)] bg-[rgba(32,38,28,0.03)]">
            <tr>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Order</th>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Customer</th>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Listing</th>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Pickup</th>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Amount</th>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Status</th>
              <th className="px-5 py-4 text-right text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[color:var(--gig-border)] last:border-b-0">
                <td className="px-5 py-4 align-top">
                  <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">#{order.id}</div>
                  <div className="meta-text mt-1">Qty {order.quantity}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{order.customerName}</div>
                  <div className="meta-text mt-1">{order.customerPhoneMasked}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{order.listingTitle}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}</div>
                  <div className="meta-text mt-1">Code {order.pickupCode}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{formatINR(order.amountPaid)}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4 text-right align-top">
                  <Link to={`/partner/orders/${order.id}`} className="btn-secondary min-h-[40px] px-4 py-2 text-[13px]">
                    Open order
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 p-4 xl:hidden">
        {orders.map((order) => (
          <div key={order.id} className="rounded-[22px] bg-[rgba(32,38,28,0.04)] p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">#{order.id}</div>
                <div className="meta-text mt-1">{order.customerName} · {order.customerPhoneMasked}</div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mb-3 text-[15px] font-semibold text-[color:var(--gig-text)]">{order.listingTitle}</div>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div>
                <div className="meta-text mb-1">Pickup</div>
                <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Amount</div>
                <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{formatINR(order.amountPaid)}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Code</div>
                <div className="text-[14px] font-medium tracking-[0.12em] text-[color:var(--gig-text)]">{order.pickupCode}</div>
              </div>
            </div>
            <Link to={`/partner/orders/${order.id}`} className="btn-secondary justify-center">
              Open order
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
