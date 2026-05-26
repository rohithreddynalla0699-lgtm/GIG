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
    <article className="surface-card rounded-[26px] p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 text-[13px] font-medium text-[color:var(--gig-green-deep)]">{outlet.name}</div>
          <h3 className="text-[22px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{listing.title}</h3>
          <div className="mt-1 text-[14px] text-[color:var(--gig-text-muted)]">
            {listing.listingType} · {listing.category} · {getVegTypeLabel(listing.vegType)}
          </div>
        </div>
        <span className={`inline-flex self-start rounded-full px-3 py-[8px] text-[12px] font-semibold ${getListingStatusClasses(listing.status)}`}>
          {getListingStatusLabel(listing.status)}
        </span>
      </div>

      <div className="grid gap-3 rounded-[22px] bg-[rgba(32,38,28,0.04)] p-4 md:grid-cols-4">
        <div>
          <div className="meta-text mb-1">Rescue price</div>
          <div className="text-[18px] font-semibold text-[color:var(--gig-text)]">{formatINR(listing.rescuePrice)}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Quantity left</div>
          <div className="text-[15px] font-medium text-[color:var(--gig-text)]">{listing.quantityLeft} / {listing.quantity} left</div>
        </div>
        <div>
          <div className="meta-text mb-1">Pickup</div>
          <div className="text-[15px] font-medium text-[color:var(--gig-text)]">{listing.pickupStart} to {listing.pickupEnd}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Status</div>
          <div className="text-[15px] font-medium text-[color:var(--gig-text)]">{getListingStatusLabel(listing.status)}</div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[color:var(--gig-text-muted)]">
        <span className="line-through">{formatINR(listing.originalPrice)}</span>
        <span>{listing.createdAtLabel}</span>
      </div>

      {listing.dietaryTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {listing.dietaryTags.map((tag) => (
            <span key={tag} className="rounded-full bg-[rgba(32,38,28,0.05)] px-3 py-[7px] text-[12px] font-medium text-[color:var(--gig-text-muted)]">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-4 border-t border-[color:var(--gig-border)] pt-4 md:grid-cols-2">
        <div>
          <div className="operational-label mb-1">Allergen note</div>
          <p className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{listing.allergenNote}</p>
        </div>
        <div>
          <div className="operational-label mb-1">Collection</div>
          <p className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{listing.collectionInstructions}</p>
        </div>
      </div>
    </article>
  );
}
