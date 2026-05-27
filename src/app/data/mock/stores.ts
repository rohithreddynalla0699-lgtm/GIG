import type { Store } from '../../types/store';
import { getMockPartnerProfile } from './partners';

export const stores: Store[] = [
  {
    id: 'store-hearth-bakehouse',
    slug: 'hearth-bakehouse',
    name: 'Hearth Bakehouse',
    category: 'Bakery',
    cuisines: ['Bakery', 'Cafe Snacks'],
    city: 'Hyderabad',
    area: 'Hitech City',
    pincode: '500081',
    addressLine: 'Mindspace Road, opposite Inorbit Mall, Hitech City, Hyderabad 500081',
    distanceKm: 1.1,
    latitude: 17.4486,
    longitude: 78.3813,
    rating: 4.6,
    reviewCount: 189,
    description: 'Neighbourhood bakehouse with same-day breads, pastries, savouries, and easy pickup windows for rescue bags.',
    pickupInstructions: 'Collect from the takeaway counter and show the pickup code before handover.',
    openingNote: 'during the last fresh-bake run before close',
    vegType: 'veg',
    dietaryTags: ['Vegetarian', 'Bakery items'],
    trustBadges: ['Pickup-ready packing', 'Same-day bakery pickup'],
    cardImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'store-iyengar-bakery',
    slug: 'iyengar-bakery-indiranagar',
    name: 'Iyengar Bakery',
    category: 'Bakery',
    cuisines: ['Bakery', 'Snacks'],
    city: 'Bengaluru',
    area: 'Indiranagar',
    pincode: '560038',
    addressLine: '100 Feet Road, Indiranagar, Bengaluru 560038',
    distanceKm: 1.4,
    latitude: 12.9784,
    longitude: 77.6408,
    rating: 4.6,
    reviewCount: 182,
    description: 'Neighbourhood bakery known for breads, savouries, tea-time bakes, and quick evening pickups.',
    pickupInstructions: 'Show the pickup code at the takeaway counter near closing time.',
    openingNote: 'between the late-evening snack rush and closing pickup window',
    vegType: 'veg',
    dietaryTags: ['Vegetarian', 'Bakery items'],
    trustBadges: ['Pickup-ready packing', 'Popular nearby'],
    cardImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'store-third-wave-coffee',
    slug: 'third-wave-coffee-koramangala',
    name: 'Third Wave Coffee',
    category: 'Cafe',
    cuisines: ['Cafe', 'Coffee', 'Bakes'],
    city: 'Bengaluru',
    area: 'Koramangala',
    pincode: '560034',
    addressLine: '80 Feet Road, Koramangala, Bengaluru 560034',
    distanceKm: 2.1,
    latitude: 12.9352,
    longitude: 77.6245,
    rating: 4.5,
    reviewCount: 264,
    description: 'Cafe counter with same-day savouries, slices, cookies, and coffee-break pickups worth catching before close.',
    pickupInstructions: 'Collect from the front cashier once the pickup code is confirmed.',
    openingNote: 'during the final cafe counter run of the evening',
    vegType: 'egg',
    dietaryTags: ['Egg possible', 'Cafe snacks'],
    trustBadges: ['Fast pickup handoff', 'Coffee-shop favourite'],
    cardImage: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'store-truffles-indiranagar',
    slug: 'truffles-indiranagar',
    name: 'Truffles',
    category: 'Restaurant',
    cuisines: ['Burgers', 'Comfort food'],
    city: 'Bengaluru',
    area: 'Indiranagar',
    pincode: '560038',
    addressLine: '12th Main Road, Indiranagar, Bengaluru 560038',
    distanceKm: 0.9,
    latitude: 12.9728,
    longitude: 77.6414,
    rating: 4.5,
    reviewCount: 241,
    description: 'Casual all-day spot with same-day comfort food pickups built around late service and quick neighbourhood demand.',
    pickupInstructions: 'Collect from the takeaway counter once the pickup code is confirmed.',
    openingNote: 'once the late-evening rush starts slowing down',
    vegType: 'mixed',
    dietaryTags: ['Comfort food', 'Dinner pickup'],
    trustBadges: ['Reliable evening pickups', 'Neighbourhood favourite'],
    cardImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'store-smoor-domlur',
    slug: 'smoor-domlur',
    name: 'Smoor',
    category: 'Cafe',
    cuisines: ['Cafe', 'Desserts', 'Bakes'],
    city: 'Bengaluru',
    area: 'Domlur',
    pincode: '560071',
    addressLine: 'Old Airport Road, Domlur, Bengaluru 560071',
    distanceKm: 2.2,
    latitude: 12.9597,
    longitude: 77.6401,
    rating: 4.4,
    reviewCount: 176,
    description: 'Dessert-led cafe pickup with savouries, slices, and bakery items gathered into an easy same-day rescue bag.',
    pickupInstructions: 'Pickup is handled at the pastry counter near closing time.',
    openingNote: 'during the final pastry counter window of the evening',
    vegType: 'egg',
    dietaryTags: ['Desserts', 'Cafe snacks'],
    trustBadges: ['Quick handoff', 'Good for gifting'],
    cardImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'store-freshmart',
    slug: 'freshmart-hitech-city',
    name: 'FreshMart',
    category: 'Grocery',
    cuisines: ['Grocery', 'Ready to eat'],
    city: 'Hyderabad',
    area: 'Hitech City',
    pincode: '500081',
    addressLine: 'Madhapur Main Road, Hitech City, Hyderabad 500081',
    distanceKm: 1.8,
    latitude: 17.4504,
    longitude: 78.3821,
    rating: 4.4,
    reviewCount: 138,
    description: 'Fresh counter, bakery shelf, and ready-to-eat picks shaped into an easy same-day grocery rescue bag.',
    pickupInstructions: 'Pickup happens at the service desk beside the ready-to-eat counter.',
    openingNote: 'after the evening office rush slows down',
    vegType: 'mixed',
    dietaryTags: ['Mixed selection', 'Fresh counter'],
    trustBadges: ['Counter-packed daily', 'Easy neighbourhood pickup'],
    cardImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'store-andhra-meals-co',
    slug: 'andhra-meals-co-jubilee-hills',
    name: 'Andhra Meals Co.',
    category: 'Restaurant',
    cuisines: ['South Indian', 'Meals'],
    city: 'Hyderabad',
    area: 'Jubilee Hills',
    pincode: '500033',
    addressLine: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
    distanceKm: 3.2,
    latitude: 17.4326,
    longitude: 78.4071,
    rating: 4.7,
    reviewCount: 205,
    description: 'Proper same-day Andhra meal pickups with rice, curries, and sides packed for nearby dinner demand.',
    pickupInstructions: 'Ask for the GIG pickup at the takeaway shelf near the billing desk.',
    openingNote: 'after peak dinner service settles',
    vegType: 'mixed',
    dietaryTags: ['Meal pickup', 'Spice-forward'],
    trustBadges: ['Reliable pickup windows', 'Dinner favourite'],
    cardImage: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'store-bombay-sandwich-house',
    slug: 'bombay-sandwich-house-bandra',
    name: 'Bombay Sandwich House',
    category: 'Restaurant',
    cuisines: ['Street Food', 'Sandwiches'],
    city: 'Mumbai',
    area: 'Bandra',
    pincode: '400050',
    addressLine: 'Hill Road, Bandra West, Mumbai 400050',
    distanceKm: 2.4,
    latitude: 19.0544,
    longitude: 72.8405,
    rating: 4.3,
    reviewCount: 147,
    description: 'Street-style sandwich and snack counter with same-day savoury pickups for nearby evening cravings.',
    pickupInstructions: 'Collect from the side takeaway counter using your pickup code.',
    openingNote: 'as the late-evening takeaway line eases',
    vegType: 'veg',
    dietaryTags: ['Vegetarian', 'Street-style'],
    trustBadges: ['Quick collection', 'Neighbourhood classic'],
    cardImage: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'store-local-tiffin-kitchen',
    slug: 'local-tiffin-kitchen-hinjewadi',
    name: 'Local Tiffin Kitchen',
    category: 'Cloud Kitchen',
    cuisines: ['Home-style', 'Tiffin'],
    city: 'Pune',
    area: 'Hinjewadi',
    pincode: '411057',
    addressLine: 'Phase 1 Service Road, Hinjewadi, Pune 411057',
    distanceKm: 3.6,
    latitude: 18.5912,
    longitude: 73.7389,
    rating: 4.5,
    reviewCount: 121,
    description: 'Home-style kitchen with practical same-day meal bags built for nearby dinner pickup and easy routines.',
    pickupInstructions: 'Pickup is handled at the dispatch shelf once the order code is checked.',
    openingNote: 'during the final dispatch window before close',
    vegType: 'veg',
    dietaryTags: ['Home-style', 'Dinner pickup'],
    trustBadges: ['Pickup shelf ready', 'Built for repeat meals'],
    cardImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80',
  },
];

function normalizeStoreMatchValue(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function doesStoreMatchActivePartnerStore(store: Store, profile = getMockPartnerProfile()) {
  const normalizedStoreName = normalizeStoreMatchValue(store.name);
  const normalizedTradingName = normalizeStoreMatchValue(profile.tradingName || '');
  const normalizedBusinessName = normalizeStoreMatchValue(profile.legalBusinessName || '');
  const sameCity = normalizeStoreMatchValue(store.city) === normalizeStoreMatchValue(profile.city || '');

  if (!sameCity) {
    return false;
  }

  // There is no explicit persisted customer-store id on the partner profile yet.
  // Keep the demo mapping conservative: only override when the active partner
  // profile clearly matches a customer-facing store by name and city.
  return (
    (normalizedTradingName.length > 0 && normalizedTradingName === normalizedStoreName) ||
    (normalizedBusinessName.length > 0 && normalizedBusinessName === normalizedStoreName)
  );
}

export function applyPartnerStoreImageOverride(store: Store): Store {
  const profile = getMockPartnerProfile();
  const storeImageUrl = profile.storeImageUrl?.trim();

  if (!storeImageUrl) {
    return store;
  }

  const matchesExplicitStoreId = profile.customerStoreId?.trim() ? profile.customerStoreId === store.id : false;
  const matchesFallbackStore = !matchesExplicitStoreId && doesStoreMatchActivePartnerStore(store, profile);

  if (!matchesExplicitStoreId && !matchesFallbackStore) {
    return store;
  }

  return {
    ...store,
    cardImage: storeImageUrl,
    heroImage: storeImageUrl,
  };
}

export function getCustomerStoresWithPartnerImageOverrides(): Store[] {
  return stores.map(applyPartnerStoreImageOverride);
}

export function getCustomerStoreByIdWithPartnerImageOverride(storeId: string) {
  const store = stores.find((candidate) => candidate.id === storeId);
  return store ? applyPartnerStoreImageOverride(store) : undefined;
}

export function getCustomerStoreBySlugWithPartnerImageOverride(slug: string) {
  const store = stores.find((candidate) => candidate.slug === slug);
  return store ? applyPartnerStoreImageOverride(store) : undefined;
}

export function getCustomerStoreImageOverrideForStoreId(storeId: string) {
  const store = stores.find((candidate) => candidate.id === storeId);

  if (!store) {
    return undefined;
  }

  const overriddenStore = applyPartnerStoreImageOverride(store);
  return overriddenStore.cardImage !== store.cardImage ? overriddenStore.cardImage : undefined;
}

export function getStoreById(storeId: string) {
  return stores.find((store) => store.id === storeId);
}

export function getStoreBySlug(slug: string) {
  return stores.find((store) => store.slug === slug);
}
