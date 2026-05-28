import { Link, useLocation, useParams } from 'react-router';
import EmptyState from '../../components/shared/EmptyState';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import Footer from '../../components/Footer';
import { getBagByIdIncludingInactive } from '../../data/mock/bags';
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
  const location = useLocation();
  const { id } = useParams();
  const order = id ? getOrderById(id) : undefined;
  const bag = order ? getBagByIdIncludingInactive(order.bagId) : undefined;
  const store = order ? getCustomerStoreByIdWithPartnerImageOverride(order.storeId) : undefined;
  const routeNotice =
    location.state && typeof location.state === 'object' && 'notice' in location.state && typeof location.state.notice === 'string'
      ? location.state.notice
      : '';
  const routeNoticeDetail =
    location.state &&
    typeof location.state === 'object' &&
    'noticeDetail' in location.state &&
    typeof location.state.noticeDetail === 'string'
      ? location.state.noticeDetail
      : '';

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
            {routeNotice ? (
              <div className="mb-5 rounded-[22px] border border-[rgba(39,114,74,0.12)] bg-[rgba(39,114,74,0.08)] px-5 py-4">
                <div className="text-[14px] font-semibold text-[#255b3d]">{routeNotice}</div>
                {routeNoticeDetail ? (
                  <div className="mt-1 text-[13px] leading-[1.7] text-[color:var(--gig-text-muted)]">{routeNoticeDetail}</div>
                ) : null}
              </div>
            ) : null}

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
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="meta-text mb-2 text-white/62">Pickup code</div>
                    <div className="text-[34px] font-semibold tracking-[0.16em] text-white">{order.pickupCode}</div>
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/[0.08] px-3.5 py-2 text-[12px] font-semibold text-white/88">
                    {getCustomerOrderStatusLabel(order.status)}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="meta-text mb-1 text-white/56">Pickup window</div>
                    <div className="text-[15px] font-medium text-white">
                      {formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}
                    </div>
                  </div>
                  <div>
                    <div className="meta-text mb-1 text-white/56">Store</div>
                    <div className="text-[15px] font-medium text-white">{store.name}</div>
                  </div>
                  <div>
                    <div className="meta-text mb-1 text-white/56">Pickup location</div>
                    <div className="text-[15px] font-medium text-white">{store.addressLine}</div>
                  </div>
                  <div>
                    <div className="meta-text mb-1 text-white/56">What happens next</div>
                    <div className="text-[15px] font-medium text-white">Show this pickup code at the store during your window.</div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-3 rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5 sm:grid-cols-2">
              <div>
                <div className="meta-text mb-1">{isUpcoming ? 'Store location' : 'Pickup window'}</div>
                <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                  {isUpcoming ? `${store.area}, ${store.city}` : formatPickupWindow(order.pickupDateLabel, order.pickupWindow)}
                </div>
              </div>
              <div>
                <div className="meta-text mb-1">{isUpcoming ? 'Amount paid' : 'Pickup location'}</div>
                <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                  {isUpcoming ? formatINR(order.amountPaid) : store.addressLine}
                </div>
              </div>
              <div>
                <div className="meta-text mb-1">{isUpcoming ? 'Amount saved' : 'Amount paid'}</div>
                <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                  {isUpcoming ? formatINR(amountSaved) : formatINR(order.amountPaid)}
                </div>
              </div>
              <div>
                <div className="meta-text mb-1">{isUpcoming ? 'Pickup city' : 'Amount saved'}</div>
                <div className={`text-[15px] font-medium ${isUpcoming ? 'text-[color:var(--gig-text)]' : 'text-[color:var(--gig-green-deep)]'}`}>
                  {isUpcoming ? `${store.area}, ${store.city}` : formatINR(amountSaved)}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5">
              <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Collection instructions</div>
              <p className="body-regular">{order.collectionInstructions}</p>
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
                {order.supportFollowUpStatus === 'reviewed' ? (
                  <>
                    <p className="mt-2 body-regular">{order.supportFollowUpNote || 'Support reviewed this issue.'}</p>
                    {order.supportReviewedAt ? (
                      <div className="mt-2 text-[12px] font-medium text-[color:var(--gig-text-soft)]">
                        {order.supportReviewedAt}
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>
            ) : null}

            <div className="mt-5">
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
