import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import Footer from '../../components/Footer';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import MotionReveal from '../../components/shared/MotionReveal';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import { clearMockCustomerSession, currentCustomer, getMockCustomerLikedStoreIds } from '../../data/mock/customers';
import { getCustomerStoreByIdWithPartnerImageOverride } from '../../data/mock/stores';
import { formatINR } from '../../lib/currency';
import { getCustomerOrderMetrics } from '../../lib/customerMetrics';

function customerMonogram(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const { completedCount, totalSaved } = useMemo(() => getCustomerOrderMetrics(currentCustomer.id), []);

  const likedStores = useMemo(
    () =>
      getMockCustomerLikedStoreIds()
        .map((id) => getCustomerStoreByIdWithPartnerImageOverride(id))
        .filter(Boolean),
    [],
  );

  const pickupLocationLabel = currentCustomer.city
    ? `Preferred area ${currentCustomer.area}, ${currentCustomer.city}`
    : `Preferred area ${currentCustomer.area}`;

  function handleSignOut() {
    clearMockCustomerSession();
    navigate('/find-food');
  }

  return (
    <div className="min-h-screen">
      <MarketplaceHeader navTheme="adaptive" />

      <main data-nav-theme="light" className="px-[5%] pb-12 pt-[92px] md:pb-14 md:pt-[100px]">
        <div className="mx-auto max-w-[1180px]">
          <MotionReveal className="mb-7 overflow-hidden rounded-[34px] bg-[linear-gradient(140deg,#10211c_0%,#163a30_52%,#214b3e_100%)] px-6 py-5 text-white shadow-[var(--gig-shadow-lg)] md:px-7 md:py-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_320px] lg:items-end">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-white/12 bg-white/[0.08] text-[28px] font-semibold tracking-[0.08em] text-white shadow-[0_18px_36px_rgba(0,0,0,0.18)]">
                    {customerMonogram(currentCustomer.name)}
                  </div>
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/56">Customer profile</div>
                    <h1 className="font-['Fraunces',serif] text-[clamp(1.65rem,3vw,2.55rem)] font-semibold leading-[1.02] tracking-[-0.038em] text-white">
                      {currentCustomer.name}
                    </h1>
                    <p className="mt-2 max-w-[40ch] text-[14px] leading-[1.72] text-white/70">
                      {currentCustomer.joinedDateLabel} · {pickupLocationLabel}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Bags rescued</div>
                    <div className="text-[21px] font-semibold tracking-[-0.03em] text-white">{completedCount}</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Saved</div>
                    <div className="text-[21px] font-semibold tracking-[-0.03em] text-white">{formatINR(totalSaved)}</div>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.06] px-4 py-4">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Preferred area</div>
                    <div className="text-[21px] font-semibold tracking-[-0.03em] text-white">{currentCustomer.area}</div>
                    {currentCustomer.city ? <div className="mt-1 text-[12px] text-white/60">{currentCustomer.city}</div> : null}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-5 backdrop-blur-[10px]">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/52">Taste and routine</div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {(currentCustomer.preferredCategories ?? []).map((category) => (
                    <span key={category} className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-[8px] text-[12px] font-medium text-white/82">
                      {category}
                    </span>
                  ))}
                </div>
                <div className="space-y-3 text-[14px] text-white/72">
                  <div className="flex items-center justify-between gap-3">
                    <span>Preferred pickup area</span>
                    <span className="font-medium text-white">{currentCustomer.area}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(currentCustomer.preferredPickupMoments ?? []).map((item) => (
                      <span key={item} className="rounded-full bg-white/[0.08] px-3 py-[7px] text-[12px] font-medium text-white/82">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.04} className="mb-7">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="eyebrow mb-2">Liked outlets</div>
                <h2 className="text-[22px] font-semibold tracking-[-0.035em] text-[color:var(--gig-text)]">Places worth going back to.</h2>
              </div>
              <Link to="/find-food" className="btn-secondary whitespace-nowrap">
                Find food
              </Link>
            </div>

            {likedStores.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {likedStores.map((store) => (
                  <Link
                    key={store.id}
                    to={`/store/${store.id}`}
                    className="surface-card lift-hover group overflow-hidden rounded-[28px]"
                  >
                    <div className="relative h-[180px] overflow-hidden">
                      <ImageWithFallback src={store.cardImage} alt={store.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,24,19,0.6)] via-[rgba(15,24,19,0.12)] to-transparent" />
                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-[rgba(255,253,248,0.9)] px-3 py-[7px] text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--gig-text)]">
                          {store.category}
                        </span>
                        <span className="rounded-full bg-[rgba(13,27,22,0.5)] px-3 py-[7px] text-[11px] font-medium text-white/88">
                          {store.area}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-[23px] font-semibold tracking-[-0.045em] text-white">{store.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="surface-card rounded-[28px] px-6 py-7 text-center text-[15px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                Heart a few nearby places on Find Food and they will show up here.
              </div>
            )}
          </MotionReveal>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.78fr)]">
            <MotionReveal delay={0.08} className="surface-card rounded-[30px] px-6 py-6 md:px-7">
              <div className="mb-5">
                <div className="eyebrow mb-2">History snapshot</div>
                <h2 className="text-[22px] font-semibold tracking-[-0.035em] text-[color:var(--gig-text)]">Pickup rhythm.</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Completed pickups</div>
                  <div className="text-[20px] font-semibold tracking-[-0.03em] text-[color:var(--gig-text)]">{completedCount}</div>
                </div>
                <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Food rescued</div>
                  <div className="text-[20px] font-semibold tracking-[-0.03em] text-[color:var(--gig-text)]">{currentCustomer.impact.co2PreventedKg} kg</div>
                </div>
                <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Money saved</div>
                  <div className="text-[20px] font-semibold tracking-[-0.03em] text-[color:var(--gig-green-deep)]">{formatINR(totalSaved)}</div>
                </div>
                <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] px-4 py-4">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Consistency</div>
                  <div className="text-[20px] font-semibold tracking-[-0.03em] text-[color:var(--gig-text)]">3 week run</div>
                </div>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.12} className="surface-card rounded-[30px] px-6 py-6 md:px-7">
              <div className="mb-5">
                <div className="eyebrow mb-2">Account details</div>
                <h2 className="text-[22px] font-semibold tracking-[-0.035em] text-[color:var(--gig-text)]">Read-only details.</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-[color:var(--gig-border)] pb-4">
                  <div className="meta-text">Email</div>
                  <div className="text-right text-[15px] font-medium text-[color:var(--gig-text)]">{currentCustomer.email}</div>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-[color:var(--gig-border)] pb-4">
                  <div className="meta-text">Phone</div>
                  <div className="text-right text-[15px] font-medium text-[color:var(--gig-text)]">{currentCustomer.phone}</div>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-[color:var(--gig-border)] pb-4">
                  <div className="meta-text">Default area</div>
                  <div className="text-right text-[15px] font-medium text-[color:var(--gig-text)]">
                    {currentCustomer.area}, {currentCustomer.city} · {currentCustomer.defaultPincode}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="meta-text">Account status</div>
                  <div className="rounded-full bg-[rgba(11,122,77,0.08)] px-3 py-2 text-[12px] font-semibold text-[color:var(--gig-green-deep)]">
                    Signed in
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>

          <MotionReveal delay={0.16} className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[color:var(--gig-border)] bg-[rgba(255,253,248,0.9)] px-6 text-[14px] font-medium text-[color:var(--gig-text-muted)] shadow-[var(--gig-shadow-xs)] transition-colors hover:border-[rgba(11,122,77,0.14)] hover:text-[color:var(--gig-green-deep)]"
            >
              Sign out
            </button>
          </MotionReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
