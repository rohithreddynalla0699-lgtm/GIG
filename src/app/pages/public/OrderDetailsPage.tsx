import { Link, useParams } from 'react-router';
import EmptyState from '../../components/shared/EmptyState';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import Footer from '../../components/Footer';
import { getBagById } from '../../data/mock/bags';
import { getOrderById } from '../../data/mock/orders';
import { getCustomerStoreByIdWithPartnerImageOverride } from '../../data/mock/stores';
import { formatINR } from '../../lib/currency';
import { formatPickupWindow } from '../../lib/dates';
import {
  getCustomerOrderStatusLabel,
  getOrderDetailSupportSummary,
  getOrderStatusClasses,
  getSupportFollowUpStatusLabel,
} from '../../lib/status';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const order = id ? getOrderById(id) : undefined;
  const bag = order ? getBagById(order.bagId) : undefined;
  const store = order ? getCustomerStoreByIdWithPartnerImageOverride(order.storeId) : undefined;

  if (!order || !bag || !store) {
    return (
      <div className="min-h-screen">
        <MarketplaceHeader />
        <main className="px-[5%] py-16">
          <div className="mx-auto max-w-[1000px]">
            <EmptyState title="Order not found" description="This order is not available right now." actionLabel="Back to orders" actionTo="/orders" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isUpcoming = ['new_reserved', 'ready_for_pickup'].includes(order.status);
  const amountSaved = Math.max(bag.originalPrice - order.amountPaid, 0);
  const orderUpdateSummary = getOrderDetailSupportSummary(
    order.status,
    order.supportNote,
    order.supportFollowUpStatus,
    order.supportFollowUpNote,
  );

  return (
    <div className="min-h-screen">
      <MarketplaceHeader navTheme="adaptive" />

      <main data-nav-theme="light" className="px-[5%] pb-10 pt-[92px] md:pb-12 md:pt-[100px]">
        <div className="mx-auto max-w-[980px]">
          <Link to="/orders" className="mb-5 inline-flex items-center text-[14px] text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-green-deep)]">
            Back to orders
          </Link>

          <section className="motion-reveal surface-card rounded-[30px] p-6 md:p-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 text-[13px] font-medium text-[color:var(--gig-green-deep)]">
                  {store.name} · {store.area}, {store.city}
                </div>
                <h1 className="text-[32px] font-semibold tracking-[-0.05em] text-[color:var(--gig-text)]">{bag.title}</h1>
              </div>
              <span className={`inline-flex rounded-full px-3 py-[8px] text-[12px] font-semibold ${getOrderStatusClasses(order.status)}`}>
                {getCustomerOrderStatusLabel(order.status)}
              </span>
            </div>

            {isUpcoming ? (
              <div className="mb-5 rounded-[24px] bg-[linear-gradient(135deg,#17362e_0%,#0f241f_100%)] px-5 py-5 text-white">
                <div className="meta-text mb-2 text-white/62">Pickup code</div>
                <div className="text-[34px] font-semibold tracking-[0.16em] text-white">{order.pickupCode}</div>
              </div>
            ) : null}

            <div className="grid gap-3 rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5 sm:grid-cols-2">
              <div>
                <div className="meta-text mb-1">Pickup window</div>
                <div className="text-[15px] font-medium text-[color:var(--gig-text)]">{formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Pickup location</div>
                <div className="text-[15px] font-medium text-[color:var(--gig-text)]">{store.addressLine}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Amount paid</div>
                <div className="text-[15px] font-medium text-[color:var(--gig-text)]">{formatINR(order.amountPaid)}</div>
              </div>
              <div>
                <div className="meta-text mb-1">Amount saved</div>
                <div className="text-[15px] font-medium text-[color:var(--gig-green-deep)]">{formatINR(amountSaved)}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Order update</div>
              <p className="body-regular">{orderUpdateSummary}</p>
            </div>

            {order.issueNote ? (
              <div className="mt-5 rounded-[24px] border border-[rgba(166,107,0,0.16)] bg-[rgba(255,244,214,0.34)] p-5">
                <div className="operational-label mb-2 text-[#A66B00]">Issue note</div>
                <p className="body-regular">{order.issueNote}</p>
              </div>
            ) : null}

            {order.status === 'issue_reported' ? (
              <div className="mt-5 rounded-[24px] border border-[rgba(166,107,0,0.16)] bg-[rgba(255,248,230,0.4)] p-5">
                <div className="operational-label mb-2 text-[#A66B00]">Support follow-up</div>
                <div className="text-[15px] font-semibold text-[#8A5600]">
                  {getSupportFollowUpStatusLabel(order.supportFollowUpStatus ?? 'needs_follow_up')}
                </div>
              </div>
            ) : null}

            <div className="mt-5 grid gap-5 lg:grid-cols-[0.94fr_1.06fr]">
              <div className="rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5">
                <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Collection instructions</div>
                <p className="body-regular">{order.collectionInstructions}</p>
              </div>

              <div className="rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5">
                <div className="operational-label mb-3 text-[color:var(--gig-green-deep)]">Order timeline</div>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="mt-[6px] h-3 w-3 rounded-full bg-[color:var(--gig-green)]" />
                        {index < order.timeline.length - 1 ? (
                          <div className="mt-2 w-[2px] flex-1 bg-[rgba(11,122,77,0.18)]" />
                        ) : null}
                      </div>
                      <div className="pb-4">
                        <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">
                          {event.timeLabel}
                        </div>
                        <div className="mb-1 text-[16px] font-semibold text-[color:var(--gig-text)]">{event.title}</div>
                        <div className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
