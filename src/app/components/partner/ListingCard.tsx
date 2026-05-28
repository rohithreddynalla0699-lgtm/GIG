import { useEffect, useState } from 'react';
import type { PartnerOutlet } from '../../types/partner';
import type { PartnerListing } from '../../types/listing';
import { getMockPartnerListingSellThrough } from '../../data/mock/partnerListings';
import { formatINR } from '../../lib/currency';
import { getListingStatusClasses, getListingStatusLabel, getVegTypeLabel } from '../../lib/status';

interface ListingCardProps {
  listing: PartnerListing;
  outlet: PartnerOutlet;
  onUpdateInventory: (listingId: string, quantity: number, quantityLeft: number) => void;
  onArchive: (listingId: string) => void;
}

export default function ListingCard({ listing, outlet, onUpdateInventory, onArchive }: ListingCardProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [quantityValue, setQuantityValue] = useState(String(listing.quantity));
  const [quantityLeftValue, setQuantityLeftValue] = useState(String(listing.quantityLeft));
  const [error, setError] = useState('');

  useEffect(() => {
    setQuantityValue(String(listing.quantity));
    setQuantityLeftValue(String(listing.quantityLeft));
    setShowArchiveConfirm(false);
    setError('');
  }, [listing.id, listing.quantity, listing.quantityLeft]);

  const sellThrough = getMockPartnerListingSellThrough(listing);

  return (
    <article className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3.5 transition hover:-translate-y-[1px] hover:bg-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px] text-[color:var(--gig-text-muted)]">
            <span className="font-medium text-[color:var(--gig-green-deep)]">{outlet.name}</span>
            <span>•</span>
            <span>{listing.category}</span>
          </div>
          <h3 className="truncate text-[17px] font-semibold tracking-[-0.03em] text-[color:var(--gig-text)]">{listing.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[color:var(--gig-text-muted)]">
            <span>{getVegTypeLabel(listing.vegType)}</span>
            <span>•</span>
            <span>{listing.createdAtLabel}</span>
          </div>
        </div>
        <span className={`inline-flex self-start rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${getListingStatusClasses(listing.status)}`}>
          {getListingStatusLabel(listing.status)}
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <div>
          <div className="meta-text mb-1">Daily quantity</div>
          <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{sellThrough.dailyQuantity}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Rescue price</div>
          <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{formatINR(listing.rescuePrice)}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Available today</div>
          <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{sellThrough.availableToday} left</div>
        </div>
        <div>
          <div className="meta-text mb-1">Pickup</div>
          <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{listing.pickupStart} - {listing.pickupEnd}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Updated</div>
          <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{listing.createdAtLabel}</div>
        </div>
      </div>

      <div className="mt-3 rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-[rgba(250,245,236,0.52)] px-4 py-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[12px] font-semibold text-[color:var(--gig-text)]">Sell-through today</div>
            <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">
              Sold {sellThrough.soldToday} of {sellThrough.dailyQuantity}
            </div>
          </div>
          <div className="rounded-full bg-white/86 px-3 py-1.5 text-[12px] font-semibold text-[color:var(--gig-text)]">
            {sellThrough.sellThroughPercent}%
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[rgba(32,38,28,0.08)]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#2f7d32_0%,#6bb55d_100%)] transition-[width]"
            style={{ width: `${sellThrough.sellThroughPercent}%` }}
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <div className="meta-text mb-1">Sold today</div>
            <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{sellThrough.soldToday}</div>
          </div>
          <div>
            <div className="meta-text mb-1">Available today</div>
            <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{sellThrough.availableToday}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-[color:var(--gig-text-muted)]">
        <span className="line-through">{formatINR(listing.originalPrice)}</span>
        <span>{sellThrough.availableToday === 0 ? 'Sold through today' : `${sellThrough.availableToday} units available today`}</span>
      </div>

      {listing.dietaryTags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.dietaryTags.map((tag) => (
            <span key={tag} className="rounded-full bg-[rgba(32,38,28,0.05)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--gig-text-muted)]">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 grid gap-3 border-t border-[color:var(--gig-border)] pt-3 md:grid-cols-2">
        <div>
          <div className="operational-label mb-1">Allergen note</div>
          <p className="text-[13px] leading-6 text-[color:var(--gig-text-muted)]">{listing.allergenNote}</p>
        </div>
        <div>
          <div className="operational-label mb-1">Pickup</div>
          <p className="text-[13px] leading-6 text-[color:var(--gig-text-muted)]">{listing.collectionInstructions}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-[color:var(--gig-border)] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[12px] font-semibold text-[color:var(--gig-text)]">Manage live type</div>
            <p className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">
              Update quantity for today or archive this rescue bag type.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsManaging((current) => !current);
              setShowArchiveConfirm(false);
              setError('');
            }}
            className="rounded-full border border-[rgba(32,38,28,0.12)] px-3.5 py-2 text-[12px] font-semibold text-[color:var(--gig-text)] transition hover:border-[rgba(32,38,28,0.22)] hover:bg-[rgba(250,245,236,0.75)]"
          >
            {isManaging ? 'Close' : 'Manage'}
          </button>
        </div>

        {isManaging ? (
          <div className="mt-4 space-y-4 rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-[rgba(250,245,236,0.66)] p-4">
            {error ? (
              <div className="rounded-[14px] border border-[rgba(166,94,94,0.18)] bg-[rgba(166,94,94,0.08)] px-3 py-2 text-[12px] text-[#7f4444]">
                {error}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--gig-text-soft)]">
                  Daily quantity
                </span>
                <input
                  type="number"
                  min={0}
                  value={quantityValue}
                  onChange={(event) => {
                    setQuantityValue(event.target.value);
                    setError('');
                  }}
                  className="w-full rounded-[14px] border border-[rgba(32,38,28,0.12)] bg-white/92 px-3.5 py-2.5 text-[14px] text-[color:var(--gig-text)] outline-none transition-colors focus:border-[color:var(--gig-green)]"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--gig-text-soft)]">
                  Available today
                </span>
                <input
                  type="number"
                  min={0}
                  value={quantityLeftValue}
                  onChange={(event) => {
                    setQuantityLeftValue(event.target.value);
                    setError('');
                  }}
                  className="w-full rounded-[14px] border border-[rgba(32,38,28,0.12)] bg-white/92 px-3.5 py-2.5 text-[14px] text-[color:var(--gig-text)] outline-none transition-colors focus:border-[color:var(--gig-green)]"
                />
              </label>
            </div>

            <p className="text-[12px] leading-5 text-[color:var(--gig-text-muted)]">
              Setting available quantity to 0 removes this live type from the customer marketplace. You can publish another live type any time.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextQuantity = Number(quantityValue);
                  const nextQuantityLeft = Number(quantityLeftValue);

                  if (!Number.isFinite(nextQuantity) || nextQuantity < 0) {
                    setError('Enter a valid daily quantity.');
                    return;
                  }

                  if (!Number.isFinite(nextQuantityLeft) || nextQuantityLeft < 0 || nextQuantityLeft > nextQuantity) {
                    setError('Available quantity must be between 0 and the daily quantity.');
                    return;
                  }

                  try {
                    onUpdateInventory(listing.id, nextQuantity, nextQuantityLeft);
                    setError('');
                  } catch (caughtError) {
                    setError(caughtError instanceof Error ? caughtError.message : 'Could not update this rescue bag type.');
                  }
                }}
                className="rounded-full bg-[color:var(--gig-green)] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#2f7d32]"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuantityValue(String(listing.quantity));
                  setQuantityLeftValue(String(listing.quantityLeft));
                  setError('');
                }}
                className="rounded-full border border-[rgba(32,38,28,0.12)] px-4 py-2 text-[12px] font-semibold text-[color:var(--gig-text)] transition hover:border-[rgba(32,38,28,0.22)] hover:bg-white/90"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowArchiveConfirm((current) => !current);
                  setError('');
                }}
                className="rounded-full border border-[rgba(128,79,79,0.18)] px-4 py-2 text-[12px] font-semibold text-[#7f4444] transition hover:bg-[rgba(166,94,94,0.08)]"
              >
                {showArchiveConfirm ? 'Cancel archive' : 'Archive'}
              </button>
            </div>

            {showArchiveConfirm ? (
              <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/88 px-4 py-3">
                <div className="text-[13px] font-semibold text-[color:var(--gig-text)]">Archive this rescue bag type?</div>
                <p className="mt-1.5 text-[12px] leading-5 text-[color:var(--gig-text-muted)]">
                  It will be removed from customer marketplace. You can create another type after this.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowArchiveConfirm(false)}
                    className="rounded-full border border-[rgba(32,38,28,0.12)] px-3.5 py-2 text-[12px] font-semibold text-[color:var(--gig-text)] transition hover:bg-[rgba(250,245,236,0.75)]"
                  >
                    Keep live
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        onArchive(listing.id);
                        setError('');
                      } catch (caughtError) {
                        setError(caughtError instanceof Error ? caughtError.message : 'Could not archive this rescue bag type.');
                      }
                    }}
                    className="rounded-full bg-[#7f4444] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#6d3a3a]"
                  >
                    Confirm archive
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
