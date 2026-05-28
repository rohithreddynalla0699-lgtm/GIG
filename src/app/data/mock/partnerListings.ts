import type { PartnerListing } from '../../types/listing';
import { getMockPartnerWorkspaceId, getMockPartnerWorkspaceOutlets, isSeedPartnerWorkspaceId } from './partners';

export const MOCK_PARTNER_LISTINGS_KEY = 'gig-partner-listings';
export const MOCK_PARTNER_LISTING_QUANTITY_OVERRIDES_KEY = 'gig-partner-listing-quantity-overrides';
export const MAX_RESCUE_BAG_TYPES_PER_PARTNER = 3;

export const partnerListings: PartnerListing[] = [
  {
    id: 'listing-evening-bake-bag',
    outletId: 'outlet-hearth-bakehouse-hitech',
    title: 'Evening Bake Rescue Bag',
    listingType: 'Surprise Bag',
    category: 'Bakery',
    originalPrice: 540,
    rescuePrice: 189,
    quantity: 8,
    quantityLeft: 3,
    pickupStart: '7:30 PM',
    pickupEnd: '8:15 PM',
    vegType: 'veg',
    dietaryTags: ['Vegetarian', 'Baked fresh daily'],
    allergenNote: 'Contains wheat, dairy, and may contain nuts.',
    collectionInstructions: 'Keep packed bags ready at the takeaway counter and verify the pickup code at handover.',
    status: 'live',
    shortDescription: 'A same-day mix of breads, croissants, and pastry slices packed for evening pickup.',
    createdAtLabel: 'Updated today',
  },
  {
    id: 'listing-brunch-bread-box',
    outletId: 'outlet-hearth-bakehouse-hitech',
    title: 'Brunch Bread Box',
    listingType: 'Fixed Meal Box',
    category: 'Bakery',
    originalPrice: 420,
    rescuePrice: 169,
    quantity: 6,
    quantityLeft: 6,
    pickupStart: '9:00 AM',
    pickupEnd: '10:00 AM',
    vegType: 'veg',
    dietaryTags: ['Vegetarian'],
    allergenNote: 'Contains wheat and dairy.',
    collectionInstructions: 'Pre-pack the fixed box and store it behind the breakfast display.',
    status: 'scheduled',
    shortDescription: 'A predictable brunch box with focaccia, croissant, and sweet bread.',
    createdAtLabel: 'Scheduled for tomorrow',
  },
  {
    id: 'listing-cafe-snack-bag',
    outletId: 'outlet-hearth-bakehouse-madhapur',
    title: 'Cafe Snack Rescue Bag',
    listingType: 'Surprise Bag',
    category: 'Cafe Snacks',
    originalPrice: 390,
    rescuePrice: 149,
    quantity: 10,
    quantityLeft: 0,
    pickupStart: '6:45 PM',
    pickupEnd: '7:30 PM',
    vegType: 'egg',
    dietaryTags: ['Cafe snacks', 'Egg bakes possible'],
    allergenNote: 'Contains wheat, dairy, and some items may contain egg.',
    collectionInstructions: 'Separate egg items clearly and keep one pickup queue for quick handover.',
    status: 'sold_out',
    shortDescription: 'A mixed bag of sandwiches, savoury puffs, and one bakery item from the cafe counter.',
    createdAtLabel: 'Sold out today',
  },
  {
    id: 'listing-clean-lunch-box',
    outletId: 'outlet-hearth-bakehouse-madhapur',
    title: 'Clean Lunch Meal Box',
    listingType: 'Fixed Meal Box',
    category: 'Lunch',
    originalPrice: 360,
    rescuePrice: 159,
    quantity: 8,
    quantityLeft: 8,
    pickupStart: '1:45 PM',
    pickupEnd: '2:30 PM',
    vegType: 'mixed',
    dietaryTags: ['High-protein', 'Office lunch'],
    allergenNote: 'May contain dairy, gluten, and sesame.',
    collectionInstructions: 'Keep boxes chilled and label veg/non-veg clearly for pickup.',
    status: 'draft',
    shortDescription: 'A weekday lunch box designed for office pickups with labeled meal components.',
    createdAtLabel: 'Saved as draft',
  },
  {
    id: 'listing-dessert-pastry-set',
    outletId: 'outlet-hearth-bakehouse-hitech',
    title: 'Dessert Pastry Set',
    listingType: 'Fixed Meal Box',
    category: 'Desserts',
    originalPrice: 640,
    rescuePrice: 249,
    quantity: 5,
    quantityLeft: 5,
    pickupStart: '8:30 PM',
    pickupEnd: '9:00 PM',
    vegType: 'egg',
    dietaryTags: ['Dessert box', 'Evening pickup'],
    allergenNote: 'Contains wheat, dairy, egg, and may contain nuts.',
    collectionInstructions: 'Store boxes in chilled display and move to pickup shelf when the slot begins.',
    status: 'paused',
    shortDescription: 'A premium pastry set prepared for same-day dessert pickups close to closing.',
    createdAtLabel: 'Paused this week',
  },
];

export interface CreateMockPartnerListingInput {
  workspaceId: string;
  outletId: string;
  title: string;
  listingType: PartnerListing['listingType'];
  category: string;
  originalPrice: number;
  rescuePrice: number;
  quantity: number;
  pickupStart: string;
  pickupEnd: string;
  vegType: PartnerListing['vegType'];
  dietaryTags: string[];
  allergenNote: string;
  collectionInstructions: string;
  status: PartnerListing['status'];
}

export class MockPartnerListingValidationError extends Error {
  code: 'duplicate_title' | 'max_live_types_reached';

  constructor(code: 'duplicate_title' | 'max_live_types_reached', message: string) {
    super(message);
    this.name = 'MockPartnerListingValidationError';
    this.code = code;
  }
}

export class MockPartnerListingManagementError extends Error {
  code: 'listing_not_found' | 'invalid_quantity' | 'invalid_quantity_left';

  constructor(code: 'listing_not_found' | 'invalid_quantity' | 'invalid_quantity_left', message: string) {
    super(message);
    this.name = 'MockPartnerListingManagementError';
    this.code = code;
  }
}

function getCreatedAtLabel(status: PartnerListing['status']) {
  switch (status) {
    case 'live':
      return 'Published just now';
    case 'scheduled':
      return 'Scheduled just now';
    case 'sold_out':
      return 'Marked sold out just now';
    case 'paused':
      return 'Paused just now';
    case 'archived':
      return 'Archived just now';
    case 'draft':
    default:
      return 'Saved just now';
  }
}

function buildShortDescription(input: CreateMockPartnerListingInput) {
  const dietaryPreview = input.dietaryTags.slice(0, 2).join(', ');
  if (dietaryPreview) {
    return `${input.listingType} for ${input.category.toLowerCase()} pickup with ${dietaryPreview.toLowerCase()}.`;
  }

  return `${input.listingType} for ${input.category.toLowerCase()} pickup between ${input.pickupStart} and ${input.pickupEnd}.`;
}

function readStoredPartnerListings() {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(MOCK_PARTNER_LISTINGS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PartnerListing[]) : [];
  } catch {
    return [];
  }
}

function getMergedPartnerListings(storedListings: PartnerListing[]) {
  const storedIds = new Set(storedListings.map((listing) => listing.id));
  const seedListings = partnerListings.filter((listing) => !storedIds.has(listing.id));
  return [...storedListings, ...seedListings];
}

function readStoredPartnerListingQuantityOverrides() {
  if (typeof window === 'undefined') {
    return {};
  }

  const raw = window.localStorage.getItem(MOCK_PARTNER_LISTING_QUANTITY_OVERRIDES_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, number>;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).flatMap(([listingId, quantityLeft]) =>
        typeof quantityLeft === 'number' && Number.isFinite(quantityLeft) && quantityLeft >= 0
          ? [[listingId, quantityLeft]]
          : [],
      ),
    );
  } catch {
    return {};
  }
}

function writeStoredPartnerListingQuantityOverrides(overrides: Record<string, number>) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MOCK_PARTNER_LISTING_QUANTITY_OVERRIDES_KEY, JSON.stringify(overrides));
}

function clearStoredPartnerListingQuantityOverride(listingId: string) {
  const overrides = readStoredPartnerListingQuantityOverrides();

  if (!(listingId in overrides)) {
    return;
  }

  const nextOverrides = { ...overrides };
  delete nextOverrides[listingId];
  writeStoredPartnerListingQuantityOverrides(nextOverrides);
}

function applyPartnerListingQuantityOverride(listing: PartnerListing, overrides: Record<string, number>) {
  const quantityLeft = overrides[listing.id];

  if (typeof quantityLeft !== 'number') {
    return listing;
  }

  return {
    ...listing,
    quantityLeft,
    status: quantityLeft <= 0 ? 'sold_out' : listing.status,
  };
}

function writeStoredPartnerListings(listings: PartnerListing[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MOCK_PARTNER_LISTINGS_KEY, JSON.stringify(listings));
}

function upsertStoredPartnerListing(nextListing: PartnerListing) {
  const storedListings = readStoredPartnerListings().filter((listing) => listing.id !== nextListing.id);
  const nextListings = [nextListing, ...storedListings];
  writeStoredPartnerListings(nextListings);
  return nextListing;
}

export function getMockPartnerListings() {
  const quantityOverrides = readStoredPartnerListingQuantityOverrides();
  return getMergedPartnerListings(readStoredPartnerListings()).map((listing) =>
    applyPartnerListingQuantityOverride(listing, quantityOverrides),
  );
}

export function getMockPartnerWorkspaceListings(workspaceId: string = getMockPartnerWorkspaceId()) {
  const quantityOverrides = readStoredPartnerListingQuantityOverrides();
  const storedListings = readStoredPartnerListings().filter((listing) => listing.workspaceId === workspaceId);

  if (isSeedPartnerWorkspaceId(workspaceId)) {
    const seedStoredListings = readStoredPartnerListings().filter(
      (listing) => listing.workspaceId === workspaceId || partnerListings.some((seedListing) => seedListing.id === listing.id),
    );

    return getMergedPartnerListings(seedStoredListings).map((listing) =>
      applyPartnerListingQuantityOverride(listing, quantityOverrides),
    );
  }

  const workspaceOutletIds = getMockPartnerWorkspaceOutlets().map((outlet) => outlet.id);
  return storedListings
    .filter((listing) => workspaceOutletIds.includes(listing.outletId))
    .map((listing) => applyPartnerListingQuantityOverride(listing, quantityOverrides));
}

export function normalizeMockListingTitle(title: string) {
  return title.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function getMockPartnerWorkspaceLiveListings(workspaceId: string = getMockPartnerWorkspaceId()) {
  return getMockPartnerWorkspaceListings(workspaceId).filter((listing) => listing.status === 'live');
}

export function getMockPartnerWorkspaceLiveListingCount(workspaceId: string = getMockPartnerWorkspaceId()) {
  return new Set(
    getMockPartnerWorkspaceLiveListings(workspaceId)
      .map((listing) => normalizeMockListingTitle(listing.title))
      .filter(Boolean),
  ).size;
}

export function canCreateMockPartnerLiveListing(workspaceId: string = getMockPartnerWorkspaceId()) {
  return getMockPartnerWorkspaceLiveListingCount(workspaceId) < MAX_RESCUE_BAG_TYPES_PER_PARTNER;
}

export function isMockPartnerListingTitleAvailable(title: string, workspaceId: string = getMockPartnerWorkspaceId()) {
  const normalizedTitle = normalizeMockListingTitle(title);

  if (!normalizedTitle) {
    return false;
  }

  return !getMockPartnerWorkspaceListings(workspaceId).some(
    (listing) => normalizeMockListingTitle(listing.title) === normalizedTitle,
  );
}

export function createMockPartnerListing(input: CreateMockPartnerListingInput) {
  const workspaceId = input.workspaceId || getMockPartnerWorkspaceId();

  if (!isMockPartnerListingTitleAvailable(input.title, workspaceId)) {
    throw new MockPartnerListingValidationError('duplicate_title', 'This rescue bag name already exists.');
  }

  if (input.status === 'live' && !canCreateMockPartnerLiveListing(workspaceId)) {
    throw new MockPartnerListingValidationError('max_live_types_reached', 'You can create up to 3 rescue bag types.');
  }

  const listing: PartnerListing = {
    id: `listing-${input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}-${Date.now()}`,
    workspaceId,
    outletId: input.outletId,
    title: input.title.trim(),
    listingType: input.listingType,
    category: input.category.trim(),
    originalPrice: input.originalPrice,
    rescuePrice: input.rescuePrice,
    quantity: input.quantity,
    quantityLeft: input.quantity,
    pickupStart: input.pickupStart.trim(),
    pickupEnd: input.pickupEnd.trim(),
    vegType: input.vegType,
    dietaryTags: input.dietaryTags,
    allergenNote: input.allergenNote.trim(),
    collectionInstructions: input.collectionInstructions.trim(),
    status: input.status,
    shortDescription: buildShortDescription(input),
    createdAtLabel: getCreatedAtLabel(input.status),
    createdAt: Date.now(),
  };

  const storedListings = readStoredPartnerListings();
  const nextListings = [listing, ...storedListings];
  writeStoredPartnerListings(nextListings);
  return listing;
}

export function resetMockPartnerListings() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(MOCK_PARTNER_LISTINGS_KEY);
  window.localStorage.removeItem(MOCK_PARTNER_LISTING_QUANTITY_OVERRIDES_KEY);
}

export function updateMockPartnerListingQuantityLeft(listingId: string, quantityLeft: number) {
  const existingListing = getMockPartnerListings().find((listing) => listing.id === listingId);

  if (!existingListing) {
    return undefined;
  }

  const nextQuantityLeft = Math.max(0, Math.min(existingListing.quantity, quantityLeft));
  const overrides = readStoredPartnerListingQuantityOverrides();
  const nextOverrides = {
    ...overrides,
    [listingId]: nextQuantityLeft,
  };

  writeStoredPartnerListingQuantityOverrides(nextOverrides);
  return applyPartnerListingQuantityOverride(existingListing, nextOverrides);
}

export function updateMockPartnerListingInventory(listingId: string, quantity: number, quantityLeft: number) {
  const existingListing = getMockPartnerListings().find((listing) => listing.id === listingId);

  if (!existingListing) {
    throw new MockPartnerListingManagementError('listing_not_found', 'This rescue bag type could not be found.');
  }

  if (!Number.isFinite(quantity) || quantity < 0) {
    throw new MockPartnerListingManagementError('invalid_quantity', 'Enter a valid daily quantity.');
  }

  if (!Number.isFinite(quantityLeft) || quantityLeft < 0 || quantityLeft > quantity) {
    throw new MockPartnerListingManagementError(
      'invalid_quantity_left',
      'Available quantity must be between 0 and the daily quantity.',
    );
  }

  const normalizedQuantity = Math.floor(quantity);
  const normalizedQuantityLeft = Math.floor(quantityLeft);
  const nextListing: PartnerListing = {
    ...existingListing,
    quantity: normalizedQuantity,
    quantityLeft: normalizedQuantityLeft,
    status: normalizedQuantityLeft <= 0 ? 'sold_out' : existingListing.status === 'live' ? 'live' : existingListing.status,
    createdAtLabel: 'Updated just now',
  };

  clearStoredPartnerListingQuantityOverride(listingId);
  upsertStoredPartnerListing(nextListing);
  return nextListing;
}

export function archiveMockPartnerListing(listingId: string) {
  const existingListing = getMockPartnerListings().find((listing) => listing.id === listingId);

  if (!existingListing) {
    throw new MockPartnerListingManagementError('listing_not_found', 'This rescue bag type could not be found.');
  }

  const nextListing: PartnerListing = {
    ...existingListing,
    status: 'archived',
    createdAtLabel: getCreatedAtLabel('archived'),
  };

  clearStoredPartnerListingQuantityOverride(listingId);
  upsertStoredPartnerListing(nextListing);
  return nextListing;
}
