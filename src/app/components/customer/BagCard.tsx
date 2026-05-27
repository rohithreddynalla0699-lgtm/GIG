import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Bag } from '../../types/bag';
import type { Store } from '../../types/store';
import { formatINR } from '../../lib/currency';
import { formatPickupWindow } from '../../lib/dates';
import { getDiscountPercentage } from '../../lib/pricing';
import { getMockCustomerLikedStoreIds, isMockCustomerSignedIn, toggleMockCustomerLikedStoreId } from '../../data/mock/customers';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import MotionReveal from '../shared/MotionReveal';

interface BagCardProps {
  bag: Bag;
  store: Store;
  imageUrlOverride?: string;
  distanceKm?: number;
  delay?: number;
  featured?: boolean;
}

export default function BagCard({ bag, store, imageUrlOverride, distanceKm, delay = 0, featured = false }: BagCardProps) {
  const discount = getDiscountPercentage(bag.originalPrice, bag.rescuePrice);
  const [signedIn, setSignedIn] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const isSignedIn = isMockCustomerSignedIn();
    setSignedIn(isSignedIn);
    setLiked(isSignedIn && getMockCustomerLikedStoreIds().includes(store.id));
  }, [store.id]);

  function handleToggleLiked(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const next = toggleMockCustomerLikedStoreId(store.id);
    setLiked(next.includes(store.id));
  }

  return (
    <MotionReveal delay={delay} y={22} className="h-full">
      <article className="surface-card lift-hover flex h-full flex-col overflow-hidden rounded-[28px] border border-[color:var(--gig-border)] bg-[rgba(255,252,247,0.9)]">
        <Link to={`/bag/${bag.id}`} className="block">
          <div className={`image-hover relative overflow-hidden ${featured ? 'h-[236px] md:h-[286px]' : 'h-[220px]'}`}>
            <ImageWithFallback src={imageUrlOverride || bag.imageUrl} alt={bag.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,24,20,0.55)] via-[rgba(20,24,20,0.12)] to-transparent" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[rgba(255,253,248,0.92)] px-3 py-[7px] text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--gig-text)]">
                {store.category}
              </span>
              <span className="rounded-full bg-[rgba(11,122,77,0.9)] px-3 py-[7px] text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                {bag.quantityLeft} bags left
              </span>
            </div>
            {signedIn ? (
              <button
                type="button"
                onClick={handleToggleLiked}
                aria-label={liked ? `Remove ${store.name} from liked outlets` : `Like ${store.name}`}
                className={`absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                  liked
                    ? 'border-white/14 bg-[rgba(255,253,248,0.92)] text-[color:var(--gig-green-deep)]'
                    : 'border-white/14 bg-[rgba(12,22,18,0.38)] text-white/88 hover:bg-[rgba(12,22,18,0.52)]'
                }`}
              >
                <span className="text-[18px] leading-none">{liked ? '♥' : '♡'}</span>
              </button>
            ) : null}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="mb-2 text-[13px] font-medium text-white/84">
                {store.name} · {store.area}, {store.city}
              </div>
              <h3 className={`max-w-[16ch] font-semibold leading-[1.03] tracking-[-0.05em] text-white ${featured ? 'text-[29px] md:text-[33px]' : 'text-[27px]'}`}>
                {bag.title}
              </h3>
            </div>
          </div>
        </Link>

        <div className={`flex flex-1 flex-col ${featured ? 'p-5 md:p-6' : 'p-5'}`}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-1 text-[13px] font-medium text-[color:var(--gig-text-muted)]">{store.name}</div>
              <div className="text-[27px] font-semibold tracking-[-0.04em] text-[color:var(--gig-green-deep)]">
                {formatINR(bag.rescuePrice)}
              </div>
              <div className="text-[13px] text-[color:var(--gig-text-soft)] line-through">
                {formatINR(bag.originalPrice)}
              </div>
            </div>
            <div className="rounded-full bg-[rgba(11,122,77,0.08)] px-3 py-2 text-[12px] font-semibold text-[color:var(--gig-green-deep)]">
              {discount}% off
            </div>
          </div>

          <div className="mb-4">
            <div className="meta-text mb-1">Might contain</div>
            <p className="text-[13.5px] leading-[1.65] text-[color:var(--gig-text-muted)]">{bag.shortDescription}</p>
          </div>

          <div className="mb-4 grid gap-3 rounded-[22px] bg-[rgba(32,38,28,0.04)] p-4 sm:grid-cols-2">
            <div>
              <div className="meta-text mb-1">Pickup</div>
              <div className="text-[13.5px] font-medium text-[color:var(--gig-text)]">
                {formatPickupWindow(bag.pickupDateLabel, bag.pickupWindow)}
              </div>
            </div>
            <div>
              <div className="meta-text mb-1">Available</div>
              <div className="text-[13.5px] font-medium text-[color:var(--gig-text)]">
                {bag.quantityLeft} of {bag.quantityTotal} bags
              </div>
            </div>
            <div>
              <div className="meta-text mb-1">Distance</div>
              <div className="text-[13.5px] font-medium text-[color:var(--gig-text)]">
                {typeof distanceKm === 'number' ? `${distanceKm.toFixed(1)} km away` : `${store.distanceKm.toFixed(1)} km away`}
              </div>
            </div>
            <div>
              <div className="meta-text mb-1">Location</div>
              <div className="text-[13.5px] font-medium text-[color:var(--gig-text)]">
                {store.area}, {store.city} · {store.pincode}
              </div>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {bag.dietaryTags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-[rgba(32,38,28,0.05)] px-3 py-[7px] text-[12px] font-medium text-[color:var(--gig-text-muted)]">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--gig-border)] pt-4">
            <Link to={`/bag/${bag.id}`} className="text-[14px] font-medium text-[color:var(--gig-text-muted)] transition-colors hover:text-[color:var(--gig-green-deep)]">
              View listing
            </Link>
            <Link
              to={signedIn ? `/bag/${bag.id}` : '/customer-auth'}
              state={signedIn ? undefined : { from: `/bag/${bag.id}` }}
              className="btn-primary justify-center whitespace-nowrap"
            >
              Reserve bag
            </Link>
          </div>
        </div>
      </article>
    </MotionReveal>
  );
}
