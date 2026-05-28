import type { Customer } from '../../types/customer';

export const MOCK_CUSTOMER_SESSION_KEY = 'gig-customer-session';
export const MOCK_CUSTOMER_LIKED_STORES_KEY = 'gig-customer-liked-stores';
export const MOCK_CUSTOMER_SAVED_STORES_KEY = 'gig-customer-saved-stores';
export const MOCK_CUSTOMER_SAVED_BAGS_KEY = 'gig-customer-saved-bags';

export const customers: Customer[] = [
  {
    id: 'customer-rahul',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    joinedDateLabel: 'Member since February 2026',
    city: 'Hyderabad',
    area: 'Madhapur',
    defaultPincode: '500081',
    savedStoreIds: ['store-iyengar-bakery', 'store-third-wave-coffee', 'store-andhra-meals-co'],
    savedBagIds: ['bag-iyengar-bakery-rescue', 'bag-third-wave-coffee-rescue', 'bag-andhra-meals-co-rescue'],
    likedStoreIds: ['store-iyengar-bakery', 'store-third-wave-coffee', 'store-andhra-meals-co'],
    preferredCategories: ['Bakery', 'Cafe', 'Restaurant', 'Grocery'],
    preferredPickupMoments: ['Evening pickups', 'Quick weekday pickup'],
    impact: {
      bagsRescued: 12,
      moneySaved: 2640,
      co2PreventedKg: 31,
    },
  },
];

export const currentCustomer = customers[0];

export function isMockCustomerSignedIn() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(MOCK_CUSTOMER_SESSION_KEY) === currentCustomer.id;
}

export function setMockCustomerSession(customerId = currentCustomer.id) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(MOCK_CUSTOMER_SESSION_KEY, customerId);
  window.localStorage.setItem(MOCK_CUSTOMER_SESSION_KEY, customerId);
}

export function clearMockCustomerSession() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(MOCK_CUSTOMER_SESSION_KEY);
  window.localStorage.removeItem(MOCK_CUSTOMER_SESSION_KEY);
}

export function getMockCustomerLikedStoreIds() {
  if (typeof window === 'undefined') return currentCustomer.likedStoreIds ?? [];
  const stored = window.localStorage.getItem(MOCK_CUSTOMER_LIKED_STORES_KEY);
  if (!stored) return currentCustomer.likedStoreIds ?? [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return currentCustomer.likedStoreIds ?? [];
  }
}

export function toggleMockCustomerLikedStoreId(storeId: string) {
  if (typeof window === 'undefined') return currentCustomer.likedStoreIds ?? [];
  const current = new Set(getMockCustomerLikedStoreIds());

  if (current.has(storeId)) {
    current.delete(storeId);
  } else {
    current.add(storeId);
  }

  const next = Array.from(current);
  window.localStorage.setItem(MOCK_CUSTOMER_LIKED_STORES_KEY, JSON.stringify(next));
  return next;
}

function readStoredStringList(storageKey: string, fallback: string[]) {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) return fallback;

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredStringList(storageKey: string, values: string[]) {
  if (typeof window === 'undefined') return values;
  window.localStorage.setItem(storageKey, JSON.stringify(values));
  return values;
}

export function getMockCustomerSavedStoreIds() {
  return readStoredStringList(MOCK_CUSTOMER_SAVED_STORES_KEY, currentCustomer.savedStoreIds ?? []);
}

export function getMockCustomerSavedBagIds() {
  return readStoredStringList(MOCK_CUSTOMER_SAVED_BAGS_KEY, currentCustomer.savedBagIds ?? []);
}

export function toggleMockCustomerSavedStoreId(storeId: string) {
  const current = new Set(getMockCustomerSavedStoreIds());

  if (current.has(storeId)) {
    current.delete(storeId);
  } else {
    current.add(storeId);
  }

  return writeStoredStringList(MOCK_CUSTOMER_SAVED_STORES_KEY, Array.from(current));
}

export function toggleMockCustomerSavedBagId(bagId: string) {
  const current = new Set(getMockCustomerSavedBagIds());

  if (current.has(bagId)) {
    current.delete(bagId);
  } else {
    current.add(bagId);
  }

  return writeStoredStringList(MOCK_CUSTOMER_SAVED_BAGS_KEY, Array.from(current));
}
