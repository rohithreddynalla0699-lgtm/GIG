import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import EmptyState from '../../components/shared/EmptyState';
import MarketplaceHeader from '../../components/shared/MarketplaceHeader';
import Footer from '../../components/Footer';
import { getBagById } from '../../data/mock/bags';
import { MockReservationError, createMockReservationFromBag } from '../../data/mock/orders';
import { getCustomerStoreByIdWithPartnerImageOverride } from '../../data/mock/stores';
import { getMockCustomerSavedBagIds, isMockCustomerSignedIn, toggleMockCustomerSavedBagId } from '../../data/mock/customers';
import { formatINR } from '../../lib/currency';
import { getDiscountPercentage } from '../../lib/pricing';
import { getVegTypeLabel } from '../../lib/status';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function BagPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const bag = id ? getBagById(id) : undefined;
  const store = bag ? getCustomerStoreByIdWithPartnerImageOverride(bag.storeId) : undefined;
  const [reservationError, setReservationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!bag || !store) {
    return (
      <div className="min-h-screen">
        <MarketplaceHeader />
        <main className="px-[5%] py-16">
          <div className="mx-auto max-w-[1000px]">
            <EmptyState
              title="Bag not found"
              description="This listing is not available right now."
              actionLabel="Back to find food"
              actionTo="/find-food"
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = getDiscountPercentage(bag.originalPrice, bag.rescuePrice);
  const signedIn = isMockCustomerSignedIn();
  const isSoldOut = bag.quantityLeft <= 0 || bag.status === 'sold_out';

  useEffect(() => {
    setSaved(signedIn && getMockCustomerSavedBagIds().includes(bag.id));
  }, [bag.id, signedIn]);

  async function handleReserveBag() {
    if (!bag) {
      return;
    }

    if (!signedIn) {
      navigate('/customer-auth', { state: { from: `/bag/${bag.id}` } });
      return;
    }

    if (isSoldOut || isSubmitting) {
      return;
    }

    setReservationError('');
    setIsSubmitting(true);

    try {
      const order = createMockReservationFromBag(bag.id);
      navigate(`/orders/${order.id}`, {
        state: {
          notice: 'Reserved successfully',
          noticeDetail: 'Show this pickup code at the store.',
        },
      });
    } catch (error) {
      if (error instanceof MockReservationError) {
        setReservationError(error.message);
      } else {
        setReservationError('We could not reserve this rescue bag right now.');
      }
      setIsSubmitting(false);
    }
  }

  function handleToggleSavedBag() {
    if (!signedIn) {
      navigate('/customer-auth', { state: { from: `/bag/${bag.id}` } });
      return;
    }

    const next = toggleMockCustomerSavedBagId(bag.id);
    setSaved(next.includes(bag.id));
  }

  return (
    <div className="min-h-screen">
      <MarketplaceHeader />

      <main className="px-[5%] py-8 md:py-10">
        <div className="mx-auto max-w-[1240px] pb-24 md:pb-12">
          <Link to={`/store/${store.id}`} className="mb-5 inline-flex items-center text-[14px] text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-green-deep)]">
            Back to {store.name}
          </Link>

          <section className="motion-reveal grid gap-8 xl:grid-cols-[1.06fr_0.94fr] xl:items-start">
            <div className="overflow-hidden rounded-[34px] shadow-[var(--gig-shadow-lg)]">
              <div className="image-hover relative h-[340px] sm:h-[420px] xl:h-[560px]">
                <ImageWithFallback src={bag.imageUrl} alt={bag.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,24,20,0.52)] to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/92 px-3 py-[7px] text-[12px] font-semibold text-[color:var(--gig-text)]">
                    {bag.concept}
                  </span>
                  <span className="rounded-full bg-[rgba(11,122,77,0.92)] px-3 py-[7px] text-[12px] font-semibold text-white">
                    {discount}% off
                  </span>
                </div>
              </div>
            </div>

            <div className="surface-card rounded-[32px] p-6 md:p-8 xl:sticky xl:top-24">
              <div className="mb-3 text-[13px] font-medium text-[color:var(--gig-green-deep)]">
                {store.name} · {store.area}, {store.city}
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  onClick={handleToggleSavedBag}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${
                    saved
                      ? 'border-[rgba(39,114,74,0.14)] bg-[rgba(39,114,74,0.08)] text-[color:var(--gig-green-deep)]'
                      : 'border-[rgba(32,38,28,0.1)] bg-white/76 text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-green-deep)]'
                  }`}
                >
                  <span>{saved ? '♥' : '♡'}</span>
                  <span>{saved ? 'Saved bag' : 'Save bag'}</span>
                </button>
              </div>
              <h1 className="mb-3 font-['Fraunces',serif] text-[clamp(34px,4.3vw,52px)] font-semibold leading-[1.02] tracking-[-0.05em] text-[color:var(--gig-text)]">
                {bag.title}
              </h1>
              <p className="mb-6 text-[15px] leading-[1.75] text-[color:var(--gig-text-muted)]">
                {bag.fullDescription}
              </p>

              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <div className="meta-text mb-1">Rescue price</div>
                  <div className="text-[40px] font-semibold tracking-[-0.06em] text-[color:var(--gig-green-deep)]">
                    {formatINR(bag.rescuePrice)}
                  </div>
                  <div className="text-[16px] text-[color:var(--gig-text-soft)] line-through">
                    {formatINR(bag.originalPrice)}
                  </div>
                </div>
                <div className="rounded-full bg-[rgba(11,122,77,0.08)] px-3 py-2 text-[12px] font-semibold text-[color:var(--gig-green-deep)]">
                  {discount}% off
                </div>
              </div>

              <div className="mb-5 grid gap-3 rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5 sm:grid-cols-2">
                <div>
                  <div className="meta-text mb-1">Pickup window</div>
                  <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                    {bag.pickupDateLabel} · {bag.pickupWindow}
                  </div>
                </div>
                <div>
                  <div className="meta-text mb-1">Quantity left</div>
                  <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                    {bag.quantityLeft} of {bag.quantityTotal}
                  </div>
                </div>
                <div>
                  <div className="meta-text mb-1">Listing type</div>
                  <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                    {bag.concept}
                  </div>
                </div>
                <div>
                  <div className="meta-text mb-1">Dietary</div>
                  <div className="text-[15px] font-medium text-[color:var(--gig-text)]">
                    {getVegTypeLabel(bag.vegType)}
                  </div>
                </div>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {bag.dietaryTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[rgba(32,38,28,0.05)] px-3 py-[7px] text-[12px] font-medium text-[color:var(--gig-text-muted)]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-6 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                {bag.allergenNote}
              </div>

              {reservationError ? (
                <div className="mb-5 rounded-[18px] border border-[rgba(194,93,70,0.18)] bg-[rgba(194,93,70,0.08)] px-4 py-3 text-[13px] font-medium text-[#9a3f2d]">
                  {reservationError}
                </div>
              ) : null}

              {isSoldOut ? (
                <div className="mb-5 rounded-[18px] border border-[rgba(166,107,0,0.16)] bg-[rgba(255,248,230,0.36)] px-4 py-3">
                  <div className="text-[13px] font-semibold text-[#8A5600]">Sold out for today</div>
                  <div className="mt-1 text-[13px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                    Check back for the next pickup window.
                  </div>
                </div>
              ) : null}

              <div className="hidden gap-3 sm:flex">
                <button
                  type="button"
                  onClick={handleReserveBag}
                  disabled={isSoldOut || isSubmitting}
                  className="btn-primary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSoldOut ? 'Sold out' : isSubmitting ? 'Reserving...' : 'Reserve bag'}
                </button>
                <Link to={`/store/${store.id}`} className="btn-secondary flex-1 justify-center">
                  View store
                </Link>
              </div>
            </div>
          </section>

          <section className="motion-reveal mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="surface-card rounded-[28px] p-6">
                <div className="operational-label mb-3 text-[color:var(--gig-green-deep)]">Typical contents</div>
                <div className="space-y-3">
                  {bag.includedItems.map((item) => (
                    <div key={item} className="text-[15px] leading-[1.7] text-[color:var(--gig-text-muted)]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="surface-card rounded-[28px] p-6">
                <div className="operational-label mb-3 text-[color:var(--gig-green-deep)]">Collection instructions</div>
                <p className="body-regular">{bag.collectionNote}</p>
                <p className="meta-text mt-4">{store.pickupInstructions}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="surface-quiet rounded-[28px] p-6">
                <div className="operational-label mb-3 text-[color:var(--gig-green-deep)]">Store trust</div>
                <div className="text-[20px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">
                  {store.rating.toFixed(1)} rating · {store.reviewCount} reviews
                </div>
                <p className="body-regular mt-2">{store.addressLine}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {store.trustBadges.map((badge) => (
                    <span key={badge} className="rounded-full bg-white px-3 py-[7px] text-[12px] font-medium text-[color:var(--gig-text-muted)]">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="surface-quiet rounded-[28px] p-6">
                <div className="operational-label mb-3 text-[color:var(--gig-green-deep)]">App-first ordering</div>
                <p className="body-regular">
                  This page is for browsing and decision-making. Reservation, payment, and pickup code generation continue inside the app so live availability stays accurate.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--gig-border)] bg-[rgba(255,253,248,0.94)] px-[5%] py-3 backdrop-blur-[16px] sm:hidden">
        <div className="mx-auto flex max-w-[1240px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-[color:var(--gig-text-muted)]">{bag.pickupDateLabel} · {bag.pickupWindow}</div>
            <div className="text-[22px] font-semibold tracking-[-0.04em] text-[color:var(--gig-green-deep)]">{formatINR(bag.rescuePrice)}</div>
          </div>
          <button
            type="button"
            onClick={handleReserveBag}
            disabled={isSoldOut || isSubmitting}
            className="btn-primary justify-center whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSoldOut ? 'Sold out' : isSubmitting ? 'Reserving...' : 'Reserve bag'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
