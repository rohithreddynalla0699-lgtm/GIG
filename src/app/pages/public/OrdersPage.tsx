import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import OrderCard from '../../components/customer/OrderCard';
import EmptyState from '../../components/shared/EmptyState';
import MotionReveal from '../../components/shared/MotionReveal';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import Footer from '../../components/Footer';
import { getBagByIdIncludingInactive } from '../../data/mock/bags';
import { currentCustomer } from '../../data/mock/customers';
import { getCustomerStoresWithPartnerImageOverrides } from '../../data/mock/stores';
import { formatINR } from '../../lib/currency';
import { getCustomerOrderMetrics } from '../../lib/customerMetrics';

type OrdersTab = 'upcoming' | 'past';

function getUpcomingBucket(dateLabel: string) {
  if (dateLabel === 'Today') return 'Today';
  if (dateLabel === 'Tomorrow') return 'Tomorrow';
  return 'This week';
}

export default function OrdersPage() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<OrdersTab>('upcoming');
  const customerStores = useMemo(() => getCustomerStoresWithPartnerImageOverrides(), []);

  const { upcoming, history, completed, totalSaved } = useMemo(() => getCustomerOrderMetrics(currentCustomer.id), []);

  const groupedUpcoming = useMemo(() => {
    const buckets = new Map<string, typeof upcoming>();
    for (const order of upcoming) {
      const bucket = getUpcomingBucket(order.pickupDateLabel);
      buckets.set(bucket, [...(buckets.get(bucket) ?? []), order]);
    }
    return ['Today', 'Tomorrow', 'This week']
      .map((label) => ({ label, orders: buckets.get(label) ?? [] }))
      .filter((group) => group.orders.length > 0);
  }, [upcoming]);

  const tabButtonClass = (tab: OrdersTab) =>
    `relative inline-flex min-h-[42px] items-center rounded-full px-4 text-[13px] font-medium transition-colors ${
      activeTab === tab
        ? 'text-white'
        : 'text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-green-deep)]'
    }`;

  return (
    <div className="min-h-screen">
      <MarketplaceHeader navTheme="adaptive" />

      <main data-nav-theme="light" className="px-[5%] pb-10 pt-[92px] md:pb-12 md:pt-[100px]">
        <div className="mx-auto max-w-[1160px]">
          <MotionReveal className="mb-5 overflow-hidden rounded-[30px] bg-[linear-gradient(140deg,#10211c_0%,#163a30_52%,#214b3e_100%)] px-5 py-4 text-white shadow-[var(--gig-shadow-md)] md:px-6 md:py-4.5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/56">Pickup hub</div>
                <h1 className="font-['Fraunces',serif] text-[clamp(1.45rem,2.2vw,1.9rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-white">
                  Your pickups
                </h1>
                <p className="mt-2 max-w-[44ch] text-[13px] leading-[1.68] text-white/68 md:text-[13.5px]">
                  Track upcoming pickups and closed reservations in one calm timeline.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.055)] p-3.5 backdrop-blur-[10px]">
                <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                  <div className="min-w-[108px]">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Upcoming</div>
                    <div className="text-[21px] font-semibold tracking-[-0.03em] text-white">{upcoming.length}</div>
                  </div>
                  <div className="min-w-[108px] sm:border-l sm:border-white/10 sm:pl-4">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">History</div>
                    <div className="text-[21px] font-semibold tracking-[-0.03em] text-white">{history.length}</div>
                  </div>
                  <div className="min-w-[132px] sm:border-l sm:border-white/10 sm:pl-4">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Total saved</div>
                    <div className="text-[21px] font-semibold tracking-[-0.03em] text-white">{formatINR(totalSaved)}</div>
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.04} className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow mb-1.5">Orders</div>
              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[color:var(--gig-text)]">Upcoming first, then completed and closed history.</h2>
              <p className="mt-1 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                Simple pickup details up top, with quieter closed history below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gig-border)] bg-[rgba(255,253,248,0.82)] p-1 shadow-[var(--gig-shadow-xs)]">
                <button type="button" onClick={() => setActiveTab('upcoming')} className={`${tabButtonClass('upcoming')} relative overflow-hidden`}>
                  {activeTab === 'upcoming' ? (
                    <motion.span
                      layoutId="orders-tab-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[color:var(--gig-green-deep)]"
                    />
                  ) : null}
                  <span className="relative z-10">Upcoming pickups</span>
                </button>
                <button type="button" onClick={() => setActiveTab('past')} className={`${tabButtonClass('past')} relative overflow-hidden`}>
                  {activeTab === 'past' ? (
                    <motion.span
                      layoutId="orders-tab-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[color:var(--gig-green-deep)]"
                    />
                  ) : null}
                  <span className="relative z-10">Past orders</span>
                </button>
              </div>
            </div>
          </MotionReveal>

          <AnimatePresence mode="wait">
            {activeTab === 'upcoming' ? (
              <motion.section
                key="upcoming"
                data-nav-theme="dark"
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f211c_0%,#14362d_100%)] px-5 py-5 text-white shadow-[var(--gig-shadow-lg)] md:px-6 md:py-6"
              >
                {upcoming.length === 0 ? (
                  <EmptyState title="No upcoming pickups" description="Reserve a nearby rescue bag and it will appear here." actionLabel="Find food" actionTo="/find-food" />
                ) : (
                  <div className="space-y-6">
                    {groupedUpcoming.map((group, groupIndex) => (
                      <div key={group.label}>
                        <div className="mb-3.5 flex items-center justify-between gap-3">
                          <div>
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/54">Pickup timeline</div>
                            <h3 className="text-[24px] font-semibold tracking-[-0.035em] text-white">{group.label}</h3>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[12px] font-semibold text-white/72">
                            {group.orders.length} pickup{group.orders.length > 1 ? 's' : ''}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {group.orders.map((order, index) => {
                            const bag = getBagByIdIncludingInactive(order.bagId);
                            const store = customerStores.find((candidate) => candidate.id === order.storeId);
                            return bag && store ? (
                              <OrderCard
                                key={order.id}
                                order={order}
                                bag={bag}
                                store={store}
                                variant="upcoming"
                                delay={groupIndex * 0.04 + index * 0.06}
                              />
                            ) : null;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            ) : (
              <motion.section
                key="past"
                data-nav-theme="light"
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="eyebrow mb-2">History</div>
                    <h3 className="text-[24px] font-semibold tracking-[-0.035em] text-[color:var(--gig-text)]">Past orders</h3>
                  </div>
                <div className="meta-text">{history.length} in history</div>
              </div>

                {history.length === 0 ? (
                  <EmptyState title="No order history yet" description="Collected and closed orders will appear here." />
                ) : (
                  <div className="space-y-4">
                    {history.map((order, index) => {
                      const bag = getBagByIdIncludingInactive(order.bagId);
                      const store = customerStores.find((candidate) => candidate.id === order.storeId);
                      return bag && store ? (
                        <OrderCard
                          key={order.id}
                          order={order}
                          bag={bag}
                          store={store}
                          variant="completed"
                          delay={index * 0.05}
                        />
                      ) : null;
                    })}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          <div className="mt-8 md:hidden">
            <Link to="/find-food" className="btn-primary w-full justify-center">
              Find food
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
