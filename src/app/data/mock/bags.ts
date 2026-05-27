import type { Bag } from '../../types/bag';
import type { PartnerListing } from '../../types/listing';
import { getMockPartnerWorkspaceLiveListings } from './partnerListings';
import { getMockPartnerProfile } from './partners';
import { getCustomerStoreByIdWithPartnerImageOverride } from './stores';

export const bags: Bag[] = [
  {
    id: 'bag-hearth-bakehouse-rescue',
    slug: 'hearth-bakehouse-rescue-bag',
    storeId: 'store-hearth-bakehouse',
    title: 'Hearth Bakehouse Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Bakery',
    cuisine: 'Bakery',
    shortDescription: 'Fresh breads, savoury bakes, pastries, or other same-day bakery items depending on availability.',
    fullDescription: 'A same-day bakehouse pickup built around breads, pastries, and savoury items that are still fresh and ready for a quick evening collection.',
    originalPrice: 520,
    rescuePrice: 189,
    quantityTotal: 8,
    quantityLeft: 5,
    pickupDateLabel: 'Today',
    pickupWindow: '4:00 PM - 8:00 PM',
    pickupSlot: 'Evening',
    vegType: 'veg',
    dietaryTags: ['Vegetarian', 'Bakery items'],
    allergenNote: 'Contains wheat, dairy, and may contain nuts depending on the day’s bake.',
    includedItems: ['Bread', 'Pastries', 'Savoury bakes', 'Tea cakes'],
    collectionNote: 'The bakery team packs available items shortly before pickup.',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bag-iyengar-bakery-rescue',
    slug: 'iyengar-bakery-rescue-bag',
    storeId: 'store-iyengar-bakery',
    title: 'Iyengar Bakery Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Bakery',
    cuisine: 'Bakery',
    shortDescription: 'Fresh bread, buns, puffs, tea cakes, or other same-day bakery items depending on availability.',
    fullDescription: 'A same-day bakery pickup built around what is freshest and ready to move before closing. Ideal for an evening snack, breakfast tomorrow, or a quick share at home.',
    originalPrice: 420,
    rescuePrice: 169,
    quantityTotal: 8,
    quantityLeft: 4,
    pickupDateLabel: 'Today',
    pickupWindow: '7:00 PM - 9:00 PM',
    pickupSlot: 'Evening',
    vegType: 'veg',
    dietaryTags: ['Vegetarian', 'Bakery items'],
    allergenNote: 'Contains wheat, dairy, and may contain nuts depending on the day’s bake.',
    includedItems: ['Bread', 'Buns', 'Puffs', 'Tea cakes'],
    collectionNote: 'The bakery team packs available items shortly before pickup.',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bag-third-wave-coffee-rescue',
    slug: 'third-wave-coffee-rescue-bag',
    storeId: 'store-third-wave-coffee',
    title: 'Third Wave Coffee Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Cafe',
    cuisine: 'Cafe',
    shortDescription: 'Sandwich halves, savoury bakes, cookies, cake slices, or other same-day cafe items depending on availability.',
    fullDescription: 'A same-day cafe pickup that usually includes a mix of savoury and baked items from the counter. Best for a late snack or an easy coffee break at home.',
    originalPrice: 390,
    rescuePrice: 159,
    quantityTotal: 9,
    quantityLeft: 5,
    pickupDateLabel: 'Today',
    pickupWindow: '6:30 PM - 8:00 PM',
    pickupSlot: 'Evening',
    vegType: 'egg',
    dietaryTags: ['Cafe snacks', 'Egg possible'],
    allergenNote: 'Contains wheat and dairy. Some items may include egg.',
    includedItems: ['Sandwiches', 'Savoury bakes', 'Cookies', 'Cake slices'],
    collectionNote: 'Cafe staff will confirm the day’s mix before handoff.',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bag-truffles-rescue',
    slug: 'truffles-rescue-bag',
    storeId: 'store-truffles-indiranagar',
    title: 'Truffles Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Restaurant',
    cuisine: 'Comfort food',
    shortDescription: 'Burger buns, fries, pasta portions, savoury sides, or other same-day kitchen items depending on availability.',
    fullDescription: 'A same-day pickup from the kitchen’s final run, shaped around what is still fresh, well-packed, and worth picking up before close.',
    originalPrice: 480,
    rescuePrice: 189,
    quantityTotal: 8,
    quantityLeft: 3,
    pickupDateLabel: 'Today',
    pickupWindow: '8:00 PM - 9:15 PM',
    pickupSlot: 'Evening',
    vegType: 'mixed',
    dietaryTags: ['Comfort food', 'Dinner pickup'],
    allergenNote: 'May include wheat, dairy, and sauces prepared in the kitchen that day.',
    includedItems: ['Burger buns', 'Fries', 'Pasta portions', 'Sides'],
    collectionNote: 'The team confirms the final mix before handoff.',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bag-smoor-rescue',
    slug: 'smoor-rescue-bag',
    storeId: 'store-smoor-domlur',
    title: 'Smoor Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Cafe',
    cuisine: 'Cafe',
    shortDescription: 'Pastries, cake slices, savoury bakes, cookies, or other same-day cafe items depending on availability.',
    fullDescription: 'A same-day cafe pickup built around what is freshest at the pastry counter before close. Ideal for dessert, a late snack, or an easy share.',
    originalPrice: 510,
    rescuePrice: 199,
    quantityTotal: 7,
    quantityLeft: 2,
    pickupDateLabel: 'Today',
    pickupWindow: '7:15 PM - 8:30 PM',
    pickupSlot: 'Evening',
    vegType: 'egg',
    dietaryTags: ['Desserts', 'Cafe snacks'],
    allergenNote: 'Contains wheat and dairy. Some items may include egg or nuts.',
    includedItems: ['Pastries', 'Cake slices', 'Cookies', 'Savoury bakes'],
    collectionNote: 'Available items are packed from the pastry counter shortly before pickup.',
    status: 'limited',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bag-freshmart-rescue',
    slug: 'freshmart-rescue-bag',
    storeId: 'store-freshmart',
    title: 'FreshMart Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Grocery',
    cuisine: 'Grocery',
    shortDescription: 'Fruit cups, salads, wraps, dips, baked snacks, or other same-day grocery counter items depending on availability.',
    fullDescription: 'A same-day grocery pickup shaped by what is freshest in the ready-to-eat and bakery counters that day. Good for a light meal or quick fridge top-up.',
    originalPrice: 460,
    rescuePrice: 189,
    quantityTotal: 7,
    quantityLeft: 3,
    pickupDateLabel: 'Today',
    pickupWindow: '8:00 PM - 9:30 PM',
    pickupSlot: 'Evening',
    vegType: 'mixed',
    dietaryTags: ['Fresh counter', 'Mixed selection'],
    allergenNote: 'Contents vary daily and may include dairy, gluten, or nuts.',
    includedItems: ['Salads', 'Wraps', 'Fruit cups', 'Baked snacks'],
    collectionNote: 'Available bags are packed from that day’s ready-to-eat counter.',
    status: 'limited',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bag-andhra-meals-co-rescue',
    slug: 'andhra-meals-co-rescue-bag',
    storeId: 'store-andhra-meals-co',
    title: 'Andhra Meals Co. Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Restaurant',
    cuisine: 'South Indian',
    shortDescription: 'Rice meals, curries, fry items, chutneys, or other same-day kitchen items depending on availability.',
    fullDescription: 'A same-day meal pickup built around what the kitchen still has ready after peak dinner service. Good for a proper meal with strong local flavour.',
    originalPrice: 360,
    rescuePrice: 149,
    quantityTotal: 10,
    quantityLeft: 6,
    pickupDateLabel: 'Today',
    pickupWindow: '7:30 PM - 8:45 PM',
    pickupSlot: 'Evening',
    vegType: 'mixed',
    dietaryTags: ['Meal pickup', 'Andhra style'],
    allergenNote: 'Spice level and protein selection can vary daily.',
    includedItems: ['Rice', 'Curries', 'Sides', 'Chutneys'],
    collectionNote: 'The team confirms whether the bag is veg or mixed at pickup.',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bag-bombay-sandwich-house-rescue',
    slug: 'bombay-sandwich-house-rescue-bag',
    storeId: 'store-bombay-sandwich-house',
    title: 'Bombay Sandwich House Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Restaurant',
    cuisine: 'Street Food',
    shortDescription: 'Sandwiches, rolls, toasties, chutneys, or other same-day cafe-style items depending on availability.',
    fullDescription: 'A same-day pickup from the sandwich counter, usually with a mix of savoury items packed around the end of service.',
    originalPrice: 340,
    rescuePrice: 139,
    quantityTotal: 8,
    quantityLeft: 2,
    pickupDateLabel: 'Today',
    pickupWindow: '8:15 PM - 9:15 PM',
    pickupSlot: 'Evening',
    vegType: 'veg',
    dietaryTags: ['Street-style', 'Vegetarian'],
    allergenNote: 'Contains wheat, dairy, and sauces prepared in-house.',
    includedItems: ['Sandwiches', 'Rolls', 'Toasties', 'Chutneys'],
    collectionNote: 'Pickup is quickest from the side takeaway counter.',
    status: 'limited',
    imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bag-local-tiffin-kitchen-rescue',
    slug: 'local-tiffin-kitchen-rescue-bag',
    storeId: 'store-local-tiffin-kitchen',
    title: 'Local Tiffin Kitchen Rescue Bag',
    concept: 'Rescue Bag',
    category: 'Cloud Kitchen',
    cuisine: 'Home-style',
    shortDescription: 'Rotis, sabzi, rice, dal, mini meal bowls, or other same-day kitchen items depending on availability.',
    fullDescription: 'A same-day kitchen pickup with practical meal items packed from that day’s final service run. Best for an easy dinner without over-ordering.',
    originalPrice: 320,
    rescuePrice: 129,
    quantityTotal: 6,
    quantityLeft: 4,
    pickupDateLabel: 'Today',
    pickupWindow: '6:45 PM - 8:15 PM',
    pickupSlot: 'Evening',
    vegType: 'veg',
    dietaryTags: ['Home-style', 'Dinner pickup'],
    allergenNote: 'Contents vary daily and may include dairy depending on the menu.',
    includedItems: ['Rotis', 'Sabzi', 'Rice', 'Dal'],
    collectionNote: 'Pickup code is checked at the dispatch shelf before handoff.',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  },
];

function slugifyMarketplaceBagValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseClockHour(time: string) {
  const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const hour = Number.parseInt(match[1], 10);
  const period = match[3].toUpperCase();
  const normalizedHour = hour % 12;

  return period === 'PM' ? normalizedHour + 12 : normalizedHour;
}

function getMarketplacePickupSlot(listing: Pick<PartnerListing, 'pickupStart'>): Bag['pickupSlot'] {
  const startHour = parseClockHour(listing.pickupStart);

  if (startHour === null) {
    return 'Evening';
  }

  if (startHour < 12) {
    return 'Breakfast';
  }

  if (startHour < 16) {
    return 'Lunch';
  }

  if (startHour < 21) {
    return 'Evening';
  }

  return 'Late Night';
}

function getMarketplaceBagStatus(listing: Pick<PartnerListing, 'quantityLeft'>): Bag['status'] {
  if (listing.quantityLeft <= 0) {
    return 'sold_out';
  }

  if (listing.quantityLeft <= 2) {
    return 'limited';
  }

  return 'active';
}

function buildMarketplaceBagDescription(listing: PartnerListing) {
  const dietaryPreview = listing.dietaryTags.slice(0, 2).join(' · ');

  if (dietaryPreview) {
    return `${listing.shortDescription} Pickup runs from ${listing.pickupStart} to ${listing.pickupEnd}. ${dietaryPreview}.`;
  }

  return `${listing.shortDescription} Pickup runs from ${listing.pickupStart} to ${listing.pickupEnd}.`;
}

function buildMarketplaceIncludedItems(listing: PartnerListing) {
  const includedItems = [
    listing.category,
    listing.listingType === 'Surprise Bag' ? 'Same-day surprise mix' : 'Prepared set items',
    listing.dietaryTags[0],
    listing.vegType === 'veg' ? 'Vegetarian selection' : undefined,
  ].filter(Boolean);

  return Array.from(new Set(includedItems)).slice(0, 4) as string[];
}

function createMarketplaceBagFromPartnerListing(listing: PartnerListing, storeId: string): Bag | null {
  const store = getCustomerStoreByIdWithPartnerImageOverride(storeId);

  if (!store || listing.quantityLeft < 1) {
    return null;
  }

  return {
    id: `bag-from-${listing.id}`,
    slug: slugifyMarketplaceBagValue(`${store.slug}-${listing.title}`),
    storeId,
    title: listing.title,
    concept: 'Rescue Bag',
    category: listing.category,
    cuisine: listing.category,
    shortDescription: listing.shortDescription,
    fullDescription: buildMarketplaceBagDescription(listing),
    originalPrice: listing.originalPrice,
    rescuePrice: listing.rescuePrice,
    quantityTotal: listing.quantity,
    quantityLeft: listing.quantityLeft,
    pickupDateLabel: 'Today',
    pickupWindow: `${listing.pickupStart} - ${listing.pickupEnd}`,
    pickupSlot: getMarketplacePickupSlot(listing),
    vegType: listing.vegType,
    dietaryTags: listing.dietaryTags,
    allergenNote: listing.allergenNote,
    includedItems: buildMarketplaceIncludedItems(listing),
    collectionNote: listing.collectionInstructions,
    status: getMarketplaceBagStatus(listing),
    imageUrl: store.cardImage,
  };
}

function getDerivedMarketplaceBagsFromPartnerListings() {
  const profile = getMockPartnerProfile();
  const customerStoreId = profile.customerStoreId?.trim();

  if (!customerStoreId) {
    return [];
  }

  return getMockPartnerWorkspaceLiveListings(profile.workspaceId)
    .map((listing) => createMarketplaceBagFromPartnerListing(listing, customerStoreId))
    .filter((bag): bag is Bag => Boolean(bag));
}

export function getCustomerMarketplaceBags() {
  return [...getDerivedMarketplaceBagsFromPartnerListings(), ...bags];
}

export function getBagById(bagId: string) {
  return getCustomerMarketplaceBags().find((bag) => bag.id === bagId);
}

export function getBagsByStoreId(storeId: string) {
  return getCustomerMarketplaceBags().filter((bag) => bag.storeId === storeId);
}
