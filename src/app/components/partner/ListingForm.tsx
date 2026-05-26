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
  'w-full rounded-[16px] border border-[color:var(--gig-border)] bg-white px-4 py-3 text-[14px] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]';

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
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/76 p-4">
      <div className="mb-3 text-[15px] font-semibold text-[color:var(--gig-text)]">{title}</div>
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
    <form onSubmit={handleSubmit} className="rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4 md:p-5">
      <div className="space-y-3">
        <FormGroup title="Bag details">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="operational-label mb-2 block">Rescue bag title</span>
              <input
                value={values.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Example: Evening bakery bag"
                className={inputClass}
                required
              />
            </label>
            <label className="block">
              <span className="operational-label mb-2 block">Outlet</span>
              <select value={values.outletId} onChange={(event) => updateField('outletId', event.target.value)} className={inputClass}>
                {workspaceOutlets.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="operational-label mb-2 block">Type</span>
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

        <div className="grid gap-3 xl:grid-cols-2">
          <FormGroup title="Price and quantity">
            <div className="grid gap-3 md:grid-cols-3">
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

          <FormGroup title="Pickup time">
            <div className="grid gap-3 md:grid-cols-3">
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
        </div>

        <FormGroup title="Food details">
          <div className="grid gap-3">
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
              <span className="operational-label mb-2 block">Pickup instructions</span>
              <textarea
                value={values.collectionInstructions}
                onChange={(event) => updateField('collectionInstructions', event.target.value)}
                placeholder="Tell staff where to keep the order and what to check."
                rows={3}
                className={inputClass}
                required
              />
            </label>
          </div>
        </FormGroup>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-[color:var(--gig-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[12px] text-[color:var(--gig-text-muted)]">
          Save as draft if you are not ready to go live yet.
        </div>
        <button type="submit" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c] whitespace-nowrap">
          Create rescue bag
        </button>
      </div>
    </form>
  );
}
