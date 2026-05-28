import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Store } from '../../types/store';
import { getMockCustomerSavedStoreIds, isMockCustomerSignedIn, toggleMockCustomerSavedStoreId } from '../../data/mock/customers';
import { getVegTypeLabel } from '../../lib/status';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StoreCardProps {
  store: Store;
  bagCount?: number;
  onSavedChange?: () => void;
}

export default function StoreCard({ store, bagCount, onSavedChange }: StoreCardProps) {
  const [signedIn, setSignedIn] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const isSignedIn = isMockCustomerSignedIn();
    setSignedIn(isSignedIn);
    setSaved(isSignedIn && getMockCustomerSavedStoreIds().includes(store.id));
  }, [store.id]);

  return (
    <article className="surface-card lift-hover overflow-hidden rounded-[28px]">
      <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
        <div className="image-hover relative min-h-[220px] overflow-hidden">
          <ImageWithFallback src={store.cardImage} alt={store.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,24,20,0.5)] to-transparent" />
          <div className="absolute bottom-4 left-4">
            <div className="rounded-full bg-white/92 px-3 py-[7px] text-[12px] font-semibold text-[color:var(--gig-text)]">
              {store.category}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[26px] font-semibold tracking-[-0.05em] text-[color:var(--gig-text)]">
                {store.name}
              </h3>
              <div className="mt-1 text-[14px] text-[color:var(--gig-text-muted)]">
                {store.area}, {store.city} · {store.distanceKm.toFixed(1)} km away
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">
                {store.rating.toFixed(1)}
              </div>
              <div className="meta-text">{store.reviewCount} reviews</div>
            </div>
          </div>

          {signedIn ? (
            <button
              type="button"
              onClick={() => {
                const next = toggleMockCustomerSavedStoreId(store.id);
                setSaved(next.includes(store.id));
                onSavedChange?.();
              }}
              className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${
                saved
                  ? 'border-[rgba(39,114,74,0.14)] bg-[rgba(39,114,74,0.08)] text-[color:var(--gig-green-deep)]'
                  : 'border-[rgba(32,38,28,0.1)] bg-white/76 text-[color:var(--gig-text-muted)] hover:text-[color:var(--gig-green-deep)]'
              }`}
            >
              <span>{saved ? '♥' : '♡'}</span>
              <span>{saved ? 'Saved store' : 'Save store'}</span>
            </button>
          ) : null}

          <p className="mb-4 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
            {store.description}
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {[getVegTypeLabel(store.vegType), ...store.trustBadges.slice(0, 1)].map((label) => (
              <span key={label} className="rounded-full bg-[rgba(32,38,28,0.05)] px-3 py-[7px] text-[12px] font-medium text-[color:var(--gig-text-muted)]">
                {label}
              </span>
            ))}
            {typeof bagCount === 'number' ? (
              <span className="rounded-full bg-[rgba(11,122,77,0.08)] px-3 py-[7px] text-[12px] font-semibold text-[color:var(--gig-green-deep)]">
                {bagCount} live today
              </span>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--gig-border)] pt-4">
            <div className="text-[13px] leading-[1.6] text-[color:var(--gig-text-muted)]">
              Pickup is fastest {store.openingNote.toLowerCase()}
            </div>
            <Link to={`/store/${store.id}`} className="btn-secondary whitespace-nowrap">
              View store
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
