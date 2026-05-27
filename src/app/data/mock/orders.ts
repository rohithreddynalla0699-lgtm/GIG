import type { Order } from '../../types/order';

export const MOCK_ORDER_OVERRIDES_KEY = 'gig-order-overrides';
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
};

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
  return orders.map((order) => applyOrderOverride(order, overrides));
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
  const existingOrder = orders.find((order) => order.id === orderId);

  if (!existingOrder) {
    return undefined;
  }

  const overrides = readStoredOrderOverrides();
  const nextOverrides = {
    ...overrides,
    [orderId]: {
      ...overrides[orderId],
      status,
    },
  };

  writeStoredOrderOverrides(nextOverrides);
  return applyOrderOverride(existingOrder, nextOverrides);
}

export function resetMockOrderOverrides() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(MOCK_ORDER_OVERRIDES_KEY);
}
