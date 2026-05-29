import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { ListingStatus, ListingType, PartnerListing } from '../../types/listing';
import {
  canCreateMockPartnerLiveListing,
  createMockPartnerListing,
  isMockPartnerListingTitleAvailable,
  MockPartnerListingValidationError,
} from '../../data/mock/partnerListings';
import type { VegType } from '../../types/store';
import { getMockPartnerActiveStoreSummary, getMockPartnerWorkspaceId, getMockPartnerWorkspaceOutlets } from '../../data/mock/partners';

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
  'w-full rounded-[14px] border border-[rgba(32,38,28,0.12)] bg-white/92 px-3.5 py-2.5 text-[14px] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]';

const labelClass = 'mb-1.5 block text-[12px] font-medium text-[color:var(--gig-text-muted)]';
const modalSelectClass = `${inputClass} appearance-none pr-9`;
const pickupSlotOptions = [
  { id: 'morning', label: 'Morning', window: '8:00 AM – 12:00 PM', start: '8:00 AM', end: '12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', window: '12:00 PM – 4:00 PM', start: '12:00 PM', end: '4:00 PM' },
  { id: 'evening', label: 'Evening', window: '4:00 PM – 8:00 PM', start: '4:00 PM', end: '8:00 PM' },
] as const;

function getPickupSlotId(start: string, end: string) {
  return pickupSlotOptions.find((slot) => slot.start === start && slot.end === end)?.id ?? '';
}

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

export default function ListingForm({
  variant = 'page',
  initialTitle = '',
  defaultStatus = 'draft',
  onCreated,
  onCancel,
  redirectOnSuccess = true,
}: {
  variant?: 'page' | 'modal';
  initialTitle?: string;
  defaultStatus?: ListingStatus;
  onCreated?: (listing: PartnerListing) => void;
  onCancel?: () => void;
  redirectOnSuccess?: boolean;
}) {
  const navigate = useNavigate();
  const workspaceId = getMockPartnerWorkspaceId();
  const activeStore = getMockPartnerActiveStoreSummary();
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const [values, setValues] = useState<ListingFormValues>(() => ({
    ...getInitialValues(workspaceOutlets[0]?.id ?? ''),
    title: initialTitle,
    status: defaultStatus,
    pickupStart: variant === 'modal' ? '4:00 PM' : '',
    pickupEnd: variant === 'modal' ? '8:00 PM' : '',
  }));
  const [error, setError] = useState('');
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const selectedPickupSlotId = getPickupSlotId(values.pickupStart, values.pickupEnd);

  useEffect(() => {
    setValues((current) => ({
      ...current,
      title: initialTitle,
      status: defaultStatus,
      outletId: current.outletId || workspaceOutlets[0]?.id || '',
      pickupStart: variant === 'modal' && !current.pickupStart ? '4:00 PM' : current.pickupStart,
      pickupEnd: variant === 'modal' && !current.pickupEnd ? '8:00 PM' : current.pickupEnd,
    }));
  }, [defaultStatus, initialTitle, variant, workspaceOutlets]);

  const updateField = <K extends keyof ListingFormValues>(field: K, nextValue: ListingFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: nextValue }));
    setError('');
  };

  const updatePickupSlot = (slotId: (typeof pickupSlotOptions)[number]['id']) => {
    const slot = pickupSlotOptions.find((item) => item.id === slotId);
    if (!slot) {
      return;
    }

    setValues((current) => ({
      ...current,
      pickupStart: slot.start,
      pickupEnd: slot.end,
    }));
    setError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextStatus = variant === 'modal' ? 'live' : values.status;

    if (!isMockPartnerListingTitleAvailable(values.title, workspaceId)) {
      setError('This rescue bag name already exists.');
      return;
    }

    if (nextStatus === 'live' && !canCreateMockPartnerLiveListing(workspaceId)) {
      setError('You can create up to 3 rescue bag types.');
      return;
    }

    let listing: PartnerListing;

    try {
      listing = createMockPartnerListing({
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
        status: nextStatus,
      });
    } catch (caughtError) {
      if (caughtError instanceof MockPartnerListingValidationError) {
        setError(caughtError.message);
        return;
      }

      throw caughtError;
    }

    onCreated?.(listing);

    if (redirectOnSuccess) {
      navigate('/partner/listings');
    }
  };

  const isModal = variant === 'modal';
  const previewOriginalPrice = values.originalPrice ? `₹${values.originalPrice}` : '₹540';
  const previewTitle = values.title.trim() || initialTitle || 'Daily Surprise Bag';
  const previewPrice = values.rescuePrice ? `₹${values.rescuePrice}` : '₹189';
  const previewQuantity = values.quantity || '8';
  const previewPickupStart = values.pickupStart || '7:30 PM';
  const previewPickupEnd = values.pickupEnd || '8:15 PM';
  const previewFoodType =
    values.vegType === 'non-veg'
      ? 'Non-veg'
      : values.vegType === 'mixed'
        ? 'Mixed'
        : values.vegType === 'egg'
          ? 'Egg possible'
          : 'Veg';

  return (
    <form
      onSubmit={handleSubmit}
      className={isModal ? '' : 'rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4 md:p-5'}
    >
      {error ? (
        <div className={`${isModal ? 'mb-4' : 'mb-3'} rounded-[16px] border border-[rgba(166,94,94,0.18)] bg-[rgba(166,94,94,0.08)] px-4 py-3 text-[13px] text-[#7f4444]`}>
          {error}
        </div>
      ) : null}

      {isModal ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="space-y-5">
            <section className="space-y-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Essentials</div>
                <p className="mt-1 text-[13px] leading-6 text-[color:var(--gig-text-muted)]">
                  Create a reusable live rescue bag type in a few quick steps.
                </p>
              </div>

              <label className="block">
                <span className={labelClass}>Bag name</span>
                <input
                  value={values.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder="Daily Surprise Bag"
                  className={inputClass}
                  required
                />
              </label>

              <label className="block">
                <span className={labelClass}>Store</span>
                <div className="rounded-[14px] border border-[rgba(32,38,28,0.08)] bg-[rgba(250,245,236,0.9)] px-3.5 py-2.5">
                  <div className="text-[14px] font-medium text-[color:var(--gig-text)]">
                    {activeStore.storeName}
                  </div>
                  {activeStore.area ? (
                    <div className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">
                      {activeStore.area}, {activeStore.city}
                    </div>
                  ) : null}
                </div>
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className={labelClass}>Actual price</span>
                  <input
                    value={values.originalPrice}
                    onChange={(event) => updateField('originalPrice', event.target.value)}
                    inputMode="numeric"
                    placeholder="540"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Rescue price</span>
                  <input
                    value={values.rescuePrice}
                    onChange={(event) => updateField('rescuePrice', event.target.value)}
                    inputMode="numeric"
                    placeholder="189"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Daily quantity</span>
                  <input
                    value={values.quantity}
                    onChange={(event) => updateField('quantity', event.target.value)}
                    inputMode="numeric"
                    placeholder="8"
                    className={inputClass}
                    required
                  />
                </label>
              </div>
            </section>

            <section className="space-y-2.5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Pickup slot</div>
                <p className="mt-1 text-[13px] leading-6 text-[color:var(--gig-text-muted)]">
                  Choose when customers can collect this rescue bag.
                </p>
              </div>
              <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/62 p-3">
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {pickupSlotOptions.map((slot) => {
                    const isSelected = selectedPickupSlotId === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => updatePickupSlot(slot.id)}
                        className={`rounded-[16px] border px-3 py-3 text-left transition ${
                          isSelected
                            ? 'border-[rgba(30,47,36,0.22)] bg-[rgba(30,47,36,0.08)] shadow-[0_10px_24px_rgba(31,34,29,0.08)]'
                            : 'border-[rgba(32,38,28,0.08)] bg-white/82 hover:bg-white'
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="text-[13px] font-semibold text-[color:var(--gig-text)]">{slot.label}</div>
                        <div className="mt-1 text-[12px] leading-5 text-[color:var(--gig-text-muted)]">{slot.window}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-white/55">
              <button
                type="button"
                onClick={() => setShowOptionalDetails((current) => !current)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                aria-expanded={showOptionalDetails}
              >
                <div>
                  <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">Add food details</div>
                  <div className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">
                    Category, food type, allergens, and pickup notes.
                  </div>
                </div>
                <span className="text-[18px] leading-none text-[color:var(--gig-text-soft)]">
                  {showOptionalDetails ? '−' : '+'}
                </span>
              </button>

              {showOptionalDetails ? (
                <div className="grid gap-3 px-4 pb-4 pt-1">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>Category</span>
                      <input
                        value={values.category}
                        onChange={(event) => updateField('category', event.target.value)}
                        placeholder="Bakery, lunch, desserts"
                        className={inputClass}
                        required
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Food type</span>
                      <select value={values.vegType} onChange={(event) => updateField('vegType', event.target.value as VegType)} className={inputClass}>
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-veg</option>
                        <option value="mixed">Mixed</option>
                        <option value="egg">Egg possible</option>
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className={labelClass}>Dietary tags</span>
                    <input
                      value={values.dietaryTags}
                      onChange={(event) => updateField('dietaryTags', event.target.value)}
                      placeholder="Vegetarian, high-protein, dessert box"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Allergen note</span>
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
                    <span className={labelClass}>Pickup instructions</span>
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
              ) : null}
            </section>

            <div className="flex flex-col gap-3 border-t border-[rgba(32,38,28,0.08)] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-[12px] text-[color:var(--gig-text-muted)]">
                This rescue bag will go live right away.
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[13px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d] whitespace-nowrap"
                >
                  Cancel
                </button>
                <button type="submit" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c] whitespace-nowrap">
                  Create rescue bag
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-[24px] border border-[rgba(32,38,28,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(246,240,229,0.92))] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--gig-text-soft)]">Live preview</div>
            <div className="mt-3 rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-white/78 p-4 shadow-[0_12px_32px_rgba(31,34,29,0.08)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-[color:var(--gig-text-muted)]">
                    {activeStore.storeName}
                  </div>
                  <div className="mt-1 text-[18px] font-semibold leading-tight tracking-[-0.03em] text-[color:var(--gig-text)]">
                    {previewTitle}
                  </div>
                </div>
                <div className="rounded-full border border-[rgba(30,47,36,0.12)] bg-[rgba(30,47,36,0.08)] px-2.5 py-1 text-[11px] font-semibold text-[#1E2F24]">
                  Live
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[16px] bg-[rgba(250,245,236,0.9)] px-3 py-2.5">
                  <div className="text-[11px] font-medium text-[color:var(--gig-text-soft)]">Actual price</div>
                  <div className="mt-1 text-[14px] font-medium text-[color:var(--gig-text-muted)] line-through">
                    {previewOriginalPrice}
                  </div>
                </div>
                <div className="rounded-[16px] bg-[rgba(250,245,236,0.9)] px-3 py-2.5">
                  <div className="text-[11px] font-medium text-[color:var(--gig-text-soft)]">Rescue price</div>
                  <div className="mt-1 text-[17px] font-semibold text-[color:var(--gig-text)]">{previewPrice}</div>
                </div>
                <div className="rounded-[16px] bg-[rgba(250,245,236,0.9)] px-3 py-2.5">
                  <div className="text-[11px] font-medium text-[color:var(--gig-text-soft)]">Daily quantity</div>
                  <div className="mt-1 text-[17px] font-semibold text-[color:var(--gig-text)]">{previewQuantity}</div>
                </div>
              </div>

              <div className="mt-3 rounded-[16px] bg-[rgba(250,245,236,0.9)] px-3 py-3">
                <div className="text-[11px] font-medium text-[color:var(--gig-text-soft)]">Pickup window</div>
                <div className="mt-1 text-[14px] font-semibold text-[color:var(--gig-text)]">
                  {previewPickupStart} to {previewPickupEnd}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-[rgba(32,38,28,0.08)] bg-white/82 px-2.5 py-1 text-[11px] font-medium text-[color:var(--gig-text-muted)]">
                  {previewFoodType}
                </span>
                <span className="rounded-full border border-[rgba(32,38,28,0.08)] bg-white/82 px-2.5 py-1 text-[11px] font-medium text-[color:var(--gig-text-muted)]">
                  {values.category.trim() || 'Category'}
                </span>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <section className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/76 p-4">
              <div className="mb-3 text-[15px] font-semibold text-[color:var(--gig-text)]">Bag details</div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="operational-label mb-2 block">Rescue bag title</span>
                  <input
                    value={values.title}
                    onChange={(event) => updateField('title', event.target.value)}
                    placeholder="Example: Daily Surprise Bag"
                    className={inputClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Pickup hub</span>
                  <div className="rounded-[14px] border border-[rgba(32,38,28,0.08)] bg-[rgba(250,245,236,0.9)] px-3.5 py-2.5">
                    <div className="text-[14px] font-medium text-[color:var(--gig-text)]">
                      {activeStore.storeName}
                    </div>
                    <div className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">
                      {activeStore.area}, {activeStore.city}
                    </div>
                  </div>
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Type</span>
                  <select value={values.listingType} onChange={(event) => updateField('listingType', event.target.value as ListingType)} className={inputClass}>
                    <option value="Surprise Bag">Surprise Bag</option>
                    <option value="Fixed Meal Box">Fixed Meal Box</option>
                  </select>
                </label>
                <label className="block md:col-span-2">
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
            </section>

            <div className="grid gap-3 xl:grid-cols-2">
              <section className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/76 p-4">
                <div className="mb-3 text-[15px] font-semibold text-[color:var(--gig-text)]">Price and quantity</div>
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
              </section>

              <section className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/76 p-4">
                <div className="mb-3 text-[15px] font-semibold text-[color:var(--gig-text)]">Pickup time</div>
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
              </section>
            </div>

            <section className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/76 p-4">
              <div className="mb-3 text-[15px] font-semibold text-[color:var(--gig-text)]">Food details</div>
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
            </section>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[color:var(--gig-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] text-[color:var(--gig-text-muted)]">
              Save as draft if you are not ready to go live yet.
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="submit" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c] whitespace-nowrap">
                Create rescue bag
              </button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
