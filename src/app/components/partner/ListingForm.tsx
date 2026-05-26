import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { ListingStatus, ListingType } from '../../types/listing';
import { createMockPartnerListing } from '../../data/mock/partnerListings';
import type { VegType } from '../../types/store';
import { getMockPartnerWorkspaceId, getMockPartnerWorkspaceOutlets } from '../../data/mock/partners';

interface ListingFormValues {
  title: string;
  outletId: string;
  listingType: ListingType;
  category: string;
  originalPrice: string;
  rescuePrice: string;
  quantity: string;
  pickupStart: string;
  pickupEnd: string;
  vegType: VegType;
  dietaryTags: string;
  allergenNote: string;
  collectionInstructions: string;
  status: ListingStatus;
}

const inputClass =
  'w-full rounded-[18px] border border-[color:var(--gig-border)] bg-white px-4 py-[14px] text-[15px] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]';

function getInitialValues(outletId: string): ListingFormValues {
  return {
  title: '',
  outletId,
  listingType: 'Surprise Bag',
  category: '',
  originalPrice: '',
  rescuePrice: '',
  quantity: '',
  pickupStart: '',
  pickupEnd: '',
  vegType: 'veg',
  dietaryTags: '',
  allergenNote: '',
  collectionInstructions: '',
  status: 'draft',
  };
}

function FormGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] bg-[rgba(32,38,28,0.04)] p-5 md:p-6">
      <div className="mb-4">
        <div className="text-[20px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{title}</div>
        <p className="mt-1 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function ListingForm() {
  const navigate = useNavigate();
  const workspaceId = getMockPartnerWorkspaceId();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const [values, setValues] = useState<ListingFormValues>(() => getInitialValues(workspaceOutlets[0]?.id ?? ''));

  const updateField = <K extends keyof ListingFormValues>(field: K, nextValue: ListingFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: nextValue }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createMockPartnerListing({
      workspaceId,
      outletId: values.outletId,
      title: values.title,
      listingType: values.listingType,
      category: values.category,
      originalPrice: Number(values.originalPrice),
      rescuePrice: Number(values.rescuePrice),
      quantity: Number(values.quantity),
      pickupStart: values.pickupStart,
      pickupEnd: values.pickupEnd,
      vegType: values.vegType,
      dietaryTags: values.dietaryTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      allergenNote: values.allergenNote,
      collectionInstructions: values.collectionInstructions,
      status: values.status,
    });

    navigate('/partner/listings');
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-[30px] p-6 md:p-8">
        <div className="space-y-5">
          <FormGroup title="Rescue bag basics" description="Define what the customer sees first and which outlet will fulfill the pickup.">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="operational-label mb-2 block">Rescue bag title</span>
                <input
                  value={values.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder="Example: Evening Bake Rescue Bag"
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Store outlet</span>
                <select value={values.outletId} onChange={(event) => updateField('outletId', event.target.value)} className={inputClass}>
                  {workspaceOutlets.map((outlet) => (
                    <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Bag type</span>
                <select value={values.listingType} onChange={(event) => updateField('listingType', event.target.value as ListingType)} className={inputClass}>
                  <option value="Surprise Bag">Surprise Bag</option>
                  <option value="Fixed Meal Box">Fixed Meal Box</option>
                </select>
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Category</span>
                <input
                  value={values.category}
                  onChange={(event) => updateField('category', event.target.value)}
                  placeholder="Bakery, lunch, desserts"
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Food type</span>
                <select value={values.vegType} onChange={(event) => updateField('vegType', event.target.value as VegType)} className={inputClass}>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-veg</option>
                  <option value="mixed">Mixed</option>
                  <option value="egg">Egg possible</option>
                </select>
              </label>
            </div>
          </FormGroup>

          <FormGroup title="Pricing and quantity" description="Set the original value, rescue price, and how many units the team can actually fulfill.">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="operational-label mb-2 block">Original price</span>
                <input value={values.originalPrice} onChange={(event) => updateField('originalPrice', event.target.value)} inputMode="numeric" placeholder="540" className={inputClass} required />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Rescue price</span>
                <input value={values.rescuePrice} onChange={(event) => updateField('rescuePrice', event.target.value)} inputMode="numeric" placeholder="189" className={inputClass} required />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Quantity</span>
                <input value={values.quantity} onChange={(event) => updateField('quantity', event.target.value)} inputMode="numeric" placeholder="8" className={inputClass} required />
              </label>
            </div>
          </FormGroup>

          <FormGroup title="Pickup window" description="Keep timing realistic for both kitchen prep and front-counter handover.">
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="operational-label mb-2 block">Pickup start</span>
                <input value={values.pickupStart} onChange={(event) => updateField('pickupStart', event.target.value)} placeholder="7:30 PM" className={inputClass} required />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Pickup end</span>
                <input value={values.pickupEnd} onChange={(event) => updateField('pickupEnd', event.target.value)} placeholder="8:15 PM" className={inputClass} required />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Publish status</span>
                <select value={values.status} onChange={(event) => updateField('status', event.target.value as ListingStatus)} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="sold_out">Sold out</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>
          </FormGroup>

          <FormGroup title="Food safety and details" description="Set dietary context and clear counter instructions before the rescue bag is shared with customers.">
            <div className="grid gap-4">
              <label className="block">
                <span className="operational-label mb-2 block">Dietary tags</span>
                <input
                  value={values.dietaryTags}
                  onChange={(event) => updateField('dietaryTags', event.target.value)}
                  placeholder="Vegetarian, high-protein, dessert box"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Allergen note</span>
                <textarea
                  value={values.allergenNote}
                  onChange={(event) => updateField('allergenNote', event.target.value)}
                  placeholder="Contains wheat, dairy, and may contain nuts."
                  rows={3}
                  className={inputClass}
                  required
                />
              </label>
              <label className="block">
                <span className="operational-label mb-2 block">Collection instructions</span>
                <textarea
                  value={values.collectionInstructions}
                  onChange={(event) => updateField('collectionInstructions', event.target.value)}
                  placeholder="Explain where staff should keep the order and what to verify at handover."
                  rows={4}
                  className={inputClass}
                  required
                />
              </label>
            </div>
          </FormGroup>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-[color:var(--gig-border)] pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[620px] text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
            Use drafts while prep is uncertain, scheduled once timing is locked, and live only when the counter is ready to hand orders over without confusion.
          </div>
          <button type="submit" className="btn-primary justify-center whitespace-nowrap">
            Create rescue bag
          </button>
        </div>
      </form>
  );
}
