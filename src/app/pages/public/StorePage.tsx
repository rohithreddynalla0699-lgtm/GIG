import { Link, useParams } from 'react-router';
import BagCard from '../../components/customer/BagCard';
import EmptyState from '../../components/shared/EmptyState';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import Footer from '../../components/Footer';
import { bags } from '../../data/mock/bags';
import { getStoreById } from '../../data/mock/stores';
import { getVegTypeLabel } from '../../lib/status';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function StorePage() {
  const { id } = useParams();
  const store = id ? getStoreById(id) : undefined;

  if (!store) {
    return (
      <div className="min-h-screen">
        <MarketplaceHeader />
        <main className="px-[5%] py-16">
          <div className="mx-auto max-w-[1000px]">
            <EmptyState
              title="Store not found"
              description="This store is not available right now."
              actionLabel="Back to find food"
              actionTo="/find-food"
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const storeBags = bags.filter((bag) => bag.storeId === store.id);

  return (
    <div className="min-h-screen">
      <MarketplaceHeader />

      <main className="px-[5%] pb-8 pt-[92px] md:pb-10 md:pt-[100px]">
        <div className="mx-auto max-w-[1240px]">
          <Link to="/find-food" className="mb-5 inline-flex items-center text-[14px] text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-green-deep)]">
            Back to find food
          </Link>

          <section className="motion-reveal overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#1f4d45_0%,#376b62_42%,#e8b981_100%)] shadow-[var(--gig-shadow-lg)]">
            <div className="grid gap-0 lg:grid-cols-[1.06fr_0.94fr]">
              <div className="relative min-h-[380px] overflow-hidden lg:min-h-[500px]">
                <ImageWithFallback src={store.heroImage} alt={store.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,24,20,0.56)] via-[rgba(20,24,20,0.1)] to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="mb-3 inline-flex rounded-full bg-white/92 px-3 py-[7px] text-[12px] font-semibold text-[color:var(--gig-text)]">
                    {store.category} · {store.city}
                  </div>
                  <h1 className="max-w-[12ch] font-['Fraunces',serif] text-[clamp(34px,5vw,54px)] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
                    {store.name}
                  </h1>
                  <p className="mt-3 max-w-[54ch] text-[15px] leading-[1.75] text-white/84">
                    {store.description}
                  </p>
                </div>
              </div>

              <div className="bg-[rgba(255,252,247,0.96)] p-6 md:p-8">
                <div className="mb-5">
                  <div className="eyebrow mb-2">Store details</div>
                  <div className="text-[28px] font-semibold tracking-[-0.05em] text-[color:var(--gig-text)]">
                    {store.area}, {store.city}
                  </div>
                  <p className="body-regular mt-2">
                    {store.rating.toFixed(1)} rating from {store.reviewCount} reviews · {store.distanceKm.toFixed(1)} km away
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="surface-card rounded-[24px] p-5">
                    <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Available now</div>
                    <div className="text-[26px] font-semibold tracking-[-0.05em] text-[color:var(--gig-text)]">
                      {storeBags.length} live bags
                    </div>
                    <p className="meta-text mt-2">Reserve and pay in the app when you are ready to pick up.</p>
                  </div>

                  <div className="surface-card rounded-[24px] p-5">
                    <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Pickup note</div>
                    <p className="body-regular">{store.openingNote}</p>
                    <p className="meta-text mt-3">{store.pickupInstructions}</p>
                  </div>

                  <div className="surface-card rounded-[24px] p-5">
                    <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Trust and dietary</div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {[getVegTypeLabel(store.vegType), ...store.trustBadges.slice(0, 2)].map((label) => (
                        <span key={label} className="rounded-full bg-[rgba(32,38,28,0.05)] px-3 py-[7px] text-[12px] font-medium text-[color:var(--gig-text-muted)]">
                          {label}
                        </span>
                      ))}
                    </div>
                    <p className="meta-text">{store.dietaryTags.join(' · ')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="motion-reveal py-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="eyebrow mb-2">Available bags first</div>
                <h2 className="section-title text-[clamp(28px,3.6vw,42px)]">What you can pick up from this store.</h2>
              </div>
                    <Link to="/customer-auth" className="btn-secondary hidden justify-center md:inline-flex">
                      Sign in to reserve
                    </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.34fr_0.66fr]">
              <div className="grid gap-6 md:grid-cols-2">
                {storeBags.map((bag) => (
                  <BagCard key={bag.id} bag={bag} store={store} />
                ))}
              </div>

              <aside className="space-y-5">
                <div className="surface-quiet rounded-[28px] p-6">
                  <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Collection guidance</div>
                  <p className="body-regular">{store.pickupInstructions}</p>
                  <p className="meta-text mt-4">{store.addressLine}</p>
                </div>

                <div className="surface-quiet rounded-[28px] p-6">
                  <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Why customers save this store</div>
                  <div className="space-y-3">
                    {store.trustBadges.map((badge) => (
                      <div key={badge} className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
