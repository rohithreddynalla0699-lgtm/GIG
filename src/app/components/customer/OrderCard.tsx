import { Link } from 'react-router';
import type { Bag } from '../../types/bag';
import type { Order } from '../../types/order';
import type { Store } from '../../types/store';
import { formatINR } from '../../lib/currency';
import { formatPickupWindow } from '../../lib/dates';
import { getCustomerOrderStatusLabel, getOrderStatusClasses } from '../../lib/status';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import MotionReveal from '../shared/MotionReveal';

interface OrderCardProps {
  order: Order;
  bag: Bag;
  store: Store;
  variant: 'upcoming' | 'completed';
  delay?: number;
}

export default function OrderCard({ order, bag, store, variant, delay = 0 }: OrderCardProps) {
  const amountSaved = Math.max(bag.originalPrice - order.amountPaid, 0);
  const isUpcoming = variant === 'upcoming';

  return (
    <MotionReveal delay={delay} y={20} className="h-full">
      <article
        className={`overflow-hidden rounded-[30px] border ${
          isUpcoming
            ? 'border-[rgba(15,48,40,0.16)] bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(248,246,240,0.98))] shadow-[var(--gig-shadow-md)]'
            : 'border-[color:var(--gig-border)] bg-[rgba(255,253,248,0.82)] shadow-[var(--gig-shadow-xs)]'
        }`}
      >
        <div className={`${isUpcoming ? 'grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]' : 'grid gap-0 md:grid-cols-[180px_minmax(0,1fr)]'}`}>
          <div className={`relative overflow-hidden ${isUpcoming ? 'min-h-[212px]' : 'min-h-[154px]'}`}>
            <ImageWithFallback
              src={store.cardImage}
              alt={store.name}
              className="h-full w-full object-cover"
            />
            <div className={`absolute inset-0 ${isUpcoming ? 'bg-[linear-gradient(180deg,rgba(10,20,17,0.16)_0%,rgba(10,20,17,0.62)_100%)]' : 'bg-[linear-gradient(180deg,rgba(10,20,17,0.1)_0%,rgba(10,20,17,0.48)_100%)]'}`} />
            {isUpcoming ? (
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[rgba(255,253,248,0.9)] px-3 py-[7px] text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--gig-text)]">
                  {store.category}
                </span>
                <span className={`inline-flex rounded-full px-3 py-[7px] text-[11px] font-semibold ${getOrderStatusClasses(order.status)}`}>
                  {getCustomerOrderStatusLabel(order.status)}
                </span>
              </div>
            ) : null}
            {isUpcoming ? (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="mb-1 text-[13px] font-medium text-white/78">{store.name}</div>
                <h3 className="max-w-[15ch] text-[26px] font-semibold tracking-[-0.05em] text-white">{bag.title}</h3>
              </div>
            ) : null}
          </div>

          <div className={`flex flex-col ${isUpcoming ? 'p-5 md:p-6' : 'p-5 md:p-5.5'}`}>
            {isUpcoming ? (
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="meta-text mb-1">Pickup window</div>
                  <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                    {formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}
                  </div>
                </div>

                <div className="rounded-[22px] bg-[linear-gradient(135deg,#17362e_0%,#0f241f_100%)] px-4.5 py-4 text-white shadow-[0_16px_34px_rgba(9,26,23,0.16)]">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/52">Pickup code</div>
                  <div className="text-[26px] font-semibold leading-none tracking-[0.16em] text-white">{order.pickupCode}</div>
                </div>
              </div>
            ) : (
              <div className="mb-4.5">
                <div className="mb-3.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-1 text-[13px] font-medium text-[color:var(--gig-text-muted)]">{store.name}</div>
                    <h3 className="max-w-[18ch] text-[22px] font-semibold tracking-[-0.035em] text-[color:var(--gig-text)]">{bag.title}</h3>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-[8px] text-[12px] font-semibold ${getOrderStatusClasses(order.status)}`}>
                    {getCustomerOrderStatusLabel(order.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="meta-text mb-1">Collected</div>
                    <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                      {formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}
                    </div>
                  </div>
                  <div className="rounded-full bg-[rgba(11,122,77,0.08)] px-3 py-2 text-[12px] font-semibold text-[color:var(--gig-green-deep)]">
                    Saved {formatINR(amountSaved)}
                  </div>
                </div>
              </div>
            )}

            <div className={`grid gap-3 rounded-[22px] bg-[rgba(32,38,28,0.04)] p-4 sm:grid-cols-2 xl:grid-cols-4 ${isUpcoming ? 'mb-5' : 'mb-4.5'}`}>
              <div>
                <div className="meta-text mb-1">Pickup location</div>
                <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{store.addressLine}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Amount paid</div>
                <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{formatINR(order.amountPaid)}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Amount saved</div>
                <div className="text-[14px] font-medium text-[color:var(--gig-green-deep)]">{formatINR(amountSaved)}</div>
              </div>
              <div>
                <div className="meta-text mb-1">{isUpcoming ? 'Pickup city' : 'Outlet area'}</div>
                <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{store.area}, {store.city}</div>
              </div>
            </div>

            <div className="mt-auto flex justify-end">
              <Link to={`/orders/${order.id}`} className={`${isUpcoming ? 'btn-primary' : 'btn-secondary'} justify-center whitespace-nowrap`}>
                View details
              </Link>
            </div>
          </div>
        </div>
      </article>
    </MotionReveal>
  );
}
