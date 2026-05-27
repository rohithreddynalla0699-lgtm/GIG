import type { Order } from '../../types/order';
import { getBagById, updateMockBagQuantityLeft } from './bags';
import { currentCustomer, isMockCustomerSignedIn } from './customers';
import { getMockPartnerProfile, getMockPartnerWorkspaceOutlets } from './partners';
import { getCustomerStoreByIdWithPartnerImageOverride } from './stores';

export const MOCK_ORDER_OVERRIDES_KEY = 'gig-order-overrides';
export const MOCK_CREATED_ORDERS_KEY = 'gig-created-orders';
const VALID_ORDER_STATUSES = new Set<Order['status']>([
  'new_reserved',
  'ready_for_pickup',
  'collected',
  'no_show',
  'cancelled',
  'issue_reported',
  'refunded',
]);

export const orders: Order[] = [
  {
    id: 'order-7418',
    customerId: 'customer-rahul',
    customerName: 'Rahul Sharma',
    customerPhoneMasked: '+91 98765 43••',
    storeId: 'store-iyengar-bakery',
    outletId: 'outlet-iyengar-bakery-indiranagar',
    bagId: 'bag-iyengar-bakery-rescue',
    listingTitle: 'Iyengar Bakery Rescue Bag',
    quantity: 1,
    status: 'ready_for_pickup',
    paymentStatus: 'paid',
    orderedAt: '2026-05-21T18:05:00+05:30',
    pickupDateLabel: 'Today',
    pickupWindow: '7:00 PM - 9:00 PM',
    pickupCode: '7418',
    amountPaid: 169,
    paymentSummary: 'Paid in app via UPI',
    collectionInstructions: 'Show your pickup code at the takeaway counter near the front display.',
    supportNote: 'Pickup is ready during the listed window.',
    relatedPartnerListingId: 'listing-iyengar-bakery-rescue',
    timeline: [
      {
        id: '7418-1',
        timeLabel: '6:05 PM',
        title: 'Reserved',
        description: 'Your rescue bag was reserved and payment went through.',
      },
      {
        id: '7418-2',
        timeLabel: '6:52 PM',
        title: 'Ready for pickup',
        description: 'The bag has been packed and is ready at the counter.',
      },
    ],
  },
  {
    id: 'order-6284',
    customerId: 'customer-rahul',
    customerName: 'Rahul Sharma',
    customerPhoneMasked: '+91 98765 43••',
    storeId: 'store-third-wave-coffee',
    outletId: 'outlet-third-wave-coffee-koramangala',
    bagId: 'bag-third-wave-coffee-rescue',
    listingTitle: 'Third Wave Coffee Rescue Bag',
    quantity: 1,
    status: 'new_reserved',
    paymentStatus: 'paid',
    orderedAt: '2026-05-21T15:20:00+05:30',
    pickupDateLabel: 'Tomorrow',
    pickupWindow: '6:30 PM - 8:00 PM',
    pickupCode: '6284',
    amountPaid: 159,
    paymentSummary: 'Paid in app via UPI',
    collectionInstructions: 'Collect from the front cashier once your code is confirmed.',
    supportNote: 'Your reservation is confirmed for tomorrow’s pickup window.',
    relatedPartnerListingId: 'listing-third-wave-coffee-rescue',
    timeline: [
      {
        id: '6284-1',
        timeLabel: '3:20 PM',
        title: 'Reserved',
        description: 'Your pickup was booked successfully for tomorrow.',
      },
    ],
  },
  {
    id: 'order-5930',
    customerId: 'customer-rahul',
    customerName: 'Rahul Sharma',
    customerPhoneMasked: '+91 98765 43••',
    storeId: 'store-andhra-meals-co',
    outletId: 'outlet-andhra-meals-co-jubilee-hills',
    bagId: 'bag-andhra-meals-co-rescue',
    listingTitle: 'Andhra Meals Co. Rescue Bag',
    quantity: 1,
    status: 'collected',
    paymentStatus: 'paid',
    orderedAt: '2026-05-18T18:42:00+05:30',
    pickupDateLabel: '18 May',
    pickupWindow: '7:30 PM - 8:45 PM',
    pickupCode: '5930',
    amountPaid: 149,
    paymentSummary: 'Paid in app via card',
    collectionInstructions: 'Collected at the takeaway shelf near the billing desk.',
    supportNote: 'Pickup completed successfully.',
    relatedPartnerListingId: 'listing-andhra-meals-co-rescue',
    timeline: [
      {
        id: '5930-1',
        timeLabel: '6:42 PM',
        title: 'Reserved',
        description: 'Payment was confirmed and pickup code was generated.',
      },
      {
        id: '5930-2',
        timeLabel: '7:55 PM',
        title: 'Collected',
        description: 'Your rescue bag was handed over at pickup.',
      },
    ],
  },
  {
    id: 'order-3506',
    customerId: 'customer-rahul',
    customerName: 'Rahul Sharma',
    customerPhoneMasked: '+91 98765 43••',
    storeId: 'store-local-tiffin-kitchen',
    outletId: 'outlet-local-tiffin-kitchen-hinjewadi',
    bagId: 'bag-local-tiffin-kitchen-rescue',
    listingTitle: 'Local Tiffin Kitchen Rescue Bag',
    quantity: 1,
    status: 'collected',
    paymentStatus: 'paid',
    orderedAt: '2026-05-14T18:10:00+05:30',
    pickupDateLabel: '14 May',
    pickupWindow: '6:45 PM - 8:15 PM',
    pickupCode: '3506',
    amountPaid: 129,
    paymentSummary: 'Paid in app via UPI',
    collectionInstructions: 'Collected from the dispatch shelf after code verification.',
    supportNote: 'Pickup completed successfully.',
    relatedPartnerListingId: 'listing-local-tiffin-kitchen-rescue',
    timeline: [
      {
        id: '3506-1',
        timeLabel: '6:10 PM',
        title: 'Reserved',
        description: 'Your dinner pickup was reserved successfully.',
      },
      {
        id: '3506-2',
        timeLabel: '7:12 PM',
        title: 'Collected',
        description: 'The rescue bag was picked up during the evening window.',
      },
    ],
  },
];

type MockOrderOverride = {
  status?: Order['status'];
  supportNote?: string;
  timeline?: Order['timeline'];
};

export class MockReservationError extends Error {
  code: 'not_signed_in' | 'bag_not_found' | 'sold_out';

  constructor(code: 'not_signed_in' | 'bag_not_found' | 'sold_out', message: string) {
    super(message);
    this.name = 'MockReservationError';
    this.code = code;
  }
}

function readStoredCreatedOrders() {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(MOCK_CREATED_ORDERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

function writeStoredCreatedOrders(nextOrders: Order[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MOCK_CREATED_ORDERS_KEY, JSON.stringify(nextOrders));
}

function readStoredOrderOverrides() {
  if (typeof window === 'undefined') {
    return {};
  }

  const raw = window.localStorage.getItem(MOCK_ORDER_OVERRIDES_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, MockOrderOverride>;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).flatMap(([orderId, override]) => {
        if (!override || typeof override !== 'object') {
          return [];
        }

        const nextOverride: MockOrderOverride = {};

        if (
          typeof override.status === 'string' &&
          VALID_ORDER_STATUSES.has(override.status as Order['status'])
        ) {
          nextOverride.status = override.status as Order['status'];
        }

        if (typeof override.supportNote === 'string' && override.supportNote.trim().length > 0) {
          nextOverride.supportNote = override.supportNote;
        }

        if (Array.isArray(override.timeline)) {
          const nextTimeline = override.timeline.flatMap((event) => {
            if (!event || typeof event !== 'object') {
              return [];
            }

            const candidate = event as Partial<Order['timeline'][number]>;

            if (
              typeof candidate.id !== 'string' ||
              typeof candidate.timeLabel !== 'string' ||
              typeof candidate.title !== 'string' ||
              typeof candidate.description !== 'string'
            ) {
              return [];
            }

            return [
              {
                id: candidate.id,
                timeLabel: candidate.timeLabel,
                title: candidate.title,
                description: candidate.description,
              },
            ];
          });

          if (nextTimeline.length > 0) {
            nextOverride.timeline = nextTimeline;
          }
        }

        return Object.keys(nextOverride).length > 0 ? [[orderId, nextOverride]] : [];
      }),
    );
  } catch {
    return {};
  }
}

function writeStoredOrderOverrides(overrides: Record<string, MockOrderOverride>) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MOCK_ORDER_OVERRIDES_KEY, JSON.stringify(overrides));
}

function getLifecycleSupportNote(status: Order['status']) {
  switch (status) {
    case 'ready_for_pickup':
      return 'Your order is packed and ready during the listed pickup window.';
    case 'collected':
      return 'Pickup completed successfully.';
    case 'new_reserved':
    default:
      return 'Your reservation is confirmed for the listed pickup window.';
  }
}

function getLifecycleTimelineEvent(order: Order, status: Order['status']): Order['timeline'][number] | null {
  const timeLabel = getOrderedAtTimeLabel(new Date().toISOString());

  switch (status) {
    case 'ready_for_pickup':
      return {
        id: `${order.id}-ready`,
        timeLabel,
        title: 'Ready for pickup',
        description: 'The rescue bag has been packed and is ready at the pickup point.',
      };
    case 'collected':
      return {
        id: `${order.id}-collected`,
        timeLabel,
        title: 'Collected',
        description: 'The pickup code was verified and the rescue bag was handed over successfully.',
      };
    case 'new_reserved':
    default:
      return null;
  }
}

function mergeLifecycleTimeline(order: Order, status: Order['status']) {
  if (status === 'new_reserved') {
    return order.timeline;
  }

  const nextEvent = getLifecycleTimelineEvent(order, status);

  if (!nextEvent) {
    return order.timeline;
  }

  const preservedEvents = order.timeline.filter((event) => event.title !== nextEvent.title);
  return [...preservedEvents, nextEvent];
}

function getAllMockOrders() {
  return [...readStoredCreatedOrders(), ...orders];
}

function applyOrderOverride(order: Order, overrides: Record<string, MockOrderOverride>) {
  const override = overrides[order.id];

  if (!override) {
    return order;
  }

  return {
    ...order,
    ...override,
  };
}

export function getMockOrders() {
  const overrides = readStoredOrderOverrides();
  return getAllMockOrders().map((order) => applyOrderOverride(order, overrides));
}

export function getOrderById(orderId: string) {
  return getMockOrders().find((order) => order.id === orderId);
}

export function getOrdersByStoreId(storeId: string) {
  return getMockOrders().filter((order) => order.storeId === storeId);
}

export function getOrdersByBagId(bagId: string) {
  return getMockOrders().filter((order) => order.bagId === bagId);
}

export function updateMockOrderStatus(orderId: string, status: Order['status']) {
  const existingOrder = getAllMockOrders().find((order) => order.id === orderId);

  if (!existingOrder) {
    return undefined;
  }

  const overrides = readStoredOrderOverrides();
  const nextTimeline = mergeLifecycleTimeline(existingOrder, status);
  const nextOverrides = {
    ...overrides,
    [orderId]: {
      ...overrides[orderId],
      status,
      supportNote: getLifecycleSupportNote(status),
      timeline: nextTimeline,
    },
  };

  writeStoredOrderOverrides(nextOverrides);
  return applyOrderOverride(existingOrder, nextOverrides);
}

function createPickupCode() {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
}

function getOrderedAtTimeLabel(orderedAt: string) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(new Date(orderedAt));
}

function getReservationOutletId(storeId: string, relatedPartnerListingId?: string) {
  const outlets = getMockPartnerWorkspaceOutlets();
  const partnerProfile = getMockPartnerProfile();

  if (partnerProfile.customerStoreId === storeId) {
    if (relatedPartnerListingId) {
      return outlets[0]?.id ?? `outlet-${storeId}`;
    }

    return outlets[0]?.id ?? `outlet-${storeId}`;
  }

  return `outlet-${storeId.replace(/^store-/, '')}`;
}

export function createMockReservationFromBag(bagId: string) {
  if (!isMockCustomerSignedIn()) {
    throw new MockReservationError('not_signed_in', 'Please sign in to reserve this rescue bag.');
  }

  const bag = getBagById(bagId);

  if (!bag) {
    throw new MockReservationError('bag_not_found', 'This rescue bag is not available right now.');
  }

  if (bag.quantityLeft <= 0 || bag.status === 'sold_out') {
    throw new MockReservationError('sold_out', 'This rescue bag is sold out.');
  }

  const store = getCustomerStoreByIdWithPartnerImageOverride(bag.storeId);
  const orderedAt = new Date().toISOString();
  const pickupCode = createPickupCode();
  const orderId = `order-${Date.now()}`;
  const nextQuantityLeft = bag.quantityLeft - 1;

  const nextBag = updateMockBagQuantityLeft(bag.id, nextQuantityLeft);

  if (!nextBag) {
    throw new MockReservationError('bag_not_found', 'This rescue bag is not available right now.');
  }

  const nextOrder: Order = {
    id: orderId,
    customerId: currentCustomer.id,
    customerName: currentCustomer.name,
    customerPhoneMasked: `${currentCustomer.phone.slice(0, 9)}••`,
    storeId: bag.storeId,
    outletId: getReservationOutletId(bag.storeId, bag.relatedPartnerListingId),
    bagId: bag.id,
    listingTitle: bag.title,
    quantity: 1,
    status: 'new_reserved',
    paymentStatus: 'paid',
    orderedAt,
    pickupDateLabel: bag.pickupDateLabel,
    pickupWindow: bag.pickupWindow,
    pickupCode,
    amountPaid: bag.rescuePrice,
    paymentSummary: 'Reserved in app · payment mocked for demo',
    collectionInstructions: bag.collectionNote || store?.pickupInstructions || 'Show the pickup code at collection.',
    supportNote: 'Your reservation is confirmed for the listed pickup window.',
    relatedPartnerListingId: bag.relatedPartnerListingId,
    timeline: [
      {
        id: `${orderId}-reserved`,
        timeLabel: getOrderedAtTimeLabel(orderedAt),
        title: 'Reserved',
        description: 'Your rescue bag was reserved successfully.',
      },
    ],
  };

  const createdOrders = readStoredCreatedOrders();
  writeStoredCreatedOrders([nextOrder, ...createdOrders]);
  return nextOrder;
}

export function resetMockOrderOverrides() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(MOCK_ORDER_OVERRIDES_KEY);
  window.localStorage.removeItem(MOCK_CREATED_ORDERS_KEY);
}
