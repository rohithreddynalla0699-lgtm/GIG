import type { PartnerOutlet } from '../../types/partner';
import type { PartnerListing } from '../../types/listing';
import { formatINR } from '../../lib/currency';
import { getListingStatusClasses, getListingStatusLabel, getVegTypeLabel } from '../../lib/status';

interface ListingCardProps {
  listing: PartnerListing;
  outlet: PartnerOutlet;
}

export default function ListingCard({ listing, outlet }: ListingCardProps) {
  return (
    <article className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3.5 transition hover:-translate-y-[1px] hover:bg-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px] text-[color:var(--gig-text-muted)]">
            <span className="font-medium text-[color:var(--gig-green-deep)]">{outlet.name}</span>
            <span>•</span>
            <span>{listing.category}</span>
            <span>•</span>
            <span>{getVegTypeLabel(listing.vegType)}</span>
          </div>
          <h3 className="truncate text-[17px] font-semibold tracking-[-0.03em] text-[color:var(--gig-text)]">{listing.title}</h3>
          <div className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">
            {listing.listingType} · {listing.createdAtLabel}
          </div>
        </div>
        <span className={`inline-flex self-start rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${getListingStatusClasses(listing.status)}`}>
          {getListingStatusLabel(listing.status)}
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <div>
          <div className="meta-text mb-1">Price</div>
          <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{formatINR(listing.rescuePrice)}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Left</div>
          <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{listing.quantityLeft} / {listing.quantity}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Pickup</div>
          <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{listing.pickupStart} - {listing.pickupEnd}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Status</div>
          <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{getListingStatusLabel(listing.status)}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Updated</div>
          <div className="text-[14px] font-medium text-[color:var(--gig-text)]">{listing.createdAtLabel}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-[color:var(--gig-text-muted)]">
        <span className="line-through">{formatINR(listing.originalPrice)}</span>
        <span>{listing.quantityLeft === 0 ? 'Sold through' : `${listing.quantityLeft} left`}</span>
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
    </article>
  );
}
