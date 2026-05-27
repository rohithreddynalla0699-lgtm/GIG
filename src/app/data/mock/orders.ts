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
const VALID_PAYMENT_STATUSES = new Set<Order['paymentStatus']>(['paid', 'refunded', 'issue_hold']);
const VALID_SUPPORT_FOLLOW_UP_STATUSES = new Set<NonNullable<Order['supportFollowUpStatus']>>([
  'needs_follow_up',
  'reviewed',
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
  issueNote?: string;
  supportFollowUpStatus?: Order['supportFollowUpStatus'];
  supportFollowUpNote?: string;
  supportReviewedAt?: string;
};

export class MockReservationError extends Error {
  code: 'not_signed_in' | 'bag_not_found' | 'sold_out';

  constructor(code: 'not_signed_in' | 'bag_not_found' | 'sold_out', message: string) {
    super(message);
    this.name = 'MockReservationError';
    this.code = code;
  }
}

export class MockOrderLifecycleError extends Error {
  code: 'invalid_transition';

  constructor(code: 'invalid_transition', message: string) {
    super(message);
    this.name = 'MockOrderLifecycleError';
    this.code = code;
  }
}

function isValidOrderTimelineEvent(value: unknown): value is Order['timeline'][number] {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Order['timeline'][number]>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.timeLabel === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string'
  );
}

function isValidStoredOrder(value: unknown): value is Order {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Order>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.customerId === 'string' &&
    typeof candidate.customerName === 'string' &&
    typeof candidate.customerPhoneMasked === 'string' &&
    typeof candidate.storeId === 'string' &&
    typeof candidate.outletId === 'string' &&
    typeof candidate.bagId === 'string' &&
    typeof candidate.listingTitle === 'string' &&
    typeof candidate.quantity === 'number' &&
    Number.isFinite(candidate.quantity) &&
    candidate.quantity > 0 &&
    typeof candidate.status === 'string' &&
    VALID_ORDER_STATUSES.has(candidate.status as Order['status']) &&
    typeof candidate.paymentStatus === 'string' &&
    VALID_PAYMENT_STATUSES.has(candidate.paymentStatus as Order['paymentStatus']) &&
    typeof candidate.orderedAt === 'string' &&
    typeof candidate.pickupDateLabel === 'string' &&
    typeof candidate.pickupWindow === 'string' &&
    typeof candidate.pickupCode === 'string' &&
    typeof candidate.amountPaid === 'number' &&
    Number.isFinite(candidate.amountPaid) &&
    typeof candidate.paymentSummary === 'string' &&
    typeof candidate.collectionInstructions === 'string' &&
    typeof candidate.supportNote === 'string' &&
    (typeof candidate.issueNote === 'undefined' || typeof candidate.issueNote === 'string') &&
    (typeof candidate.supportFollowUpStatus === 'undefined' ||
      (typeof candidate.supportFollowUpStatus === 'string' &&
        VALID_SUPPORT_FOLLOW_UP_STATUSES.has(candidate.supportFollowUpStatus))) &&
    (typeof candidate.supportFollowUpNote === 'undefined' || typeof candidate.supportFollowUpNote === 'string') &&
    (typeof candidate.supportReviewedAt === 'undefined' || typeof candidate.supportReviewedAt === 'string') &&
    Array.isArray(candidate.timeline) &&
    candidate.timeline.every((event) => isValidOrderTimelineEvent(event))
  );
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
    return Array.isArray(parsed) ? parsed.filter((order): order is Order => isValidStoredOrder(order)) : [];
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

        if (typeof override.issueNote === 'string' && override.issueNote.trim().length > 0) {
          nextOverride.issueNote = override.issueNote;
        }

        if (
          typeof override.supportFollowUpStatus === 'string' &&
          VALID_SUPPORT_FOLLOW_UP_STATUSES.has(override.supportFollowUpStatus)
        ) {
          nextOverride.supportFollowUpStatus = override.supportFollowUpStatus;
        }

        if (typeof override.supportFollowUpNote === 'string' && override.supportFollowUpNote.trim().length > 0) {
          nextOverride.supportFollowUpNote = override.supportFollowUpNote;
        }

        if (typeof override.supportReviewedAt === 'string' && override.supportReviewedAt.trim().length > 0) {
          nextOverride.supportReviewedAt = override.supportReviewedAt;
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
    case 'no_show':
      return 'Pickup window passed without collection.';
    case 'issue_reported':
      return "Issue noted. We'll follow up from support.";
    case 'new_reserved':
    default:
      return 'Your reservation is confirmed for the listed pickup window.';
  }
}

function canTransitionOrderStatus(currentStatus: Order['status'], nextStatus: Order['status']) {
  if (currentStatus === nextStatus) {
    return true;
  }

  switch (currentStatus) {
    case 'new_reserved':
      return nextStatus === 'ready_for_pickup' || nextStatus === 'issue_reported';
    case 'ready_for_pickup':
      return nextStatus === 'collected' || nextStatus === 'no_show' || nextStatus === 'issue_reported';
    case 'collected':
      return nextStatus === 'issue_reported';
    case 'no_show':
      return nextStatus === 'issue_reported';
    case 'issue_reported':
      return false;
    default:
      return false;
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
    case 'no_show':
      return {
        id: `${order.id}-no-show`,
        timeLabel,
        title: 'Marked no-show',
        description: 'The pickup window ended without collection, so the order was marked as a no-show.',
      };
    case 'issue_reported':
      return {
        id: `${order.id}-issue`,
        timeLabel,
        title: 'Issue reported',
        description: 'An issue was logged for this order and the support team should review the pickup details.',
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

function mergeCustomTimelineEvent(order: Order, nextEvent: Order['timeline'][number]) {
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

export function updateMockOrderStatus(
  orderId: string,
  status: Order['status'],
  options?: { issueNote?: string },
) {
  const existingOrder = getAllMockOrders().find((order) => order.id === orderId);

  if (!existingOrder) {
    return undefined;
  }

  if (existingOrder.status === status) {
    return applyOrderOverride(existingOrder, readStoredOrderOverrides());
  }

  if (!canTransitionOrderStatus(existingOrder.status, status)) {
    throw new MockOrderLifecycleError(
      'invalid_transition',
      `Cannot move order from ${existingOrder.status} to ${status}.`,
    );
  }

  const overrides = readStoredOrderOverrides();
  const nextTimeline = mergeLifecycleTimeline(existingOrder, status);
  const nextIssueNote =
    status === 'issue_reported'
      ? options?.issueNote?.trim() || overrides[orderId]?.issueNote || existingOrder.issueNote
      : overrides[orderId]?.issueNote || existingOrder.issueNote;
  const nextSupportFollowUpStatus =
    status === 'issue_reported'
      ? 'needs_follow_up'
      : overrides[orderId]?.supportFollowUpStatus || existingOrder.supportFollowUpStatus;
  const nextSupportFollowUpNote =
    status === 'issue_reported'
      ? undefined
      : overrides[orderId]?.supportFollowUpNote || existingOrder.supportFollowUpNote;
  const nextSupportReviewedAt =
    status === 'issue_reported'
      ? undefined
      : overrides[orderId]?.supportReviewedAt || existingOrder.supportReviewedAt;
  const nextOverrides = {
    ...overrides,
    [orderId]: {
      ...overrides[orderId],
      status,
      supportNote: getLifecycleSupportNote(status),
      timeline: nextTimeline,
      ...(nextIssueNote ? { issueNote: nextIssueNote } : {}),
      ...(nextSupportFollowUpStatus ? { supportFollowUpStatus: nextSupportFollowUpStatus } : {}),
      ...(nextSupportFollowUpNote ? { supportFollowUpNote: nextSupportFollowUpNote } : {}),
      ...(nextSupportReviewedAt ? { supportReviewedAt: nextSupportReviewedAt } : {}),
    },
  };

  writeStoredOrderOverrides(nextOverrides);
  return applyOrderOverride(existingOrder, nextOverrides);
}

export function updateMockOrderSupportFollowUp(
  orderId: string,
  supportFollowUpStatus: NonNullable<Order['supportFollowUpStatus']>,
) {
  const existingOrder = getAllMockOrders().find((order) => order.id === orderId);

  if (!existingOrder || existingOrder.status !== 'issue_reported') {
    return undefined;
  }

  if (!VALID_SUPPORT_FOLLOW_UP_STATUSES.has(supportFollowUpStatus)) {
    return undefined;
  }

  const mergedOrder = applyOrderOverride(existingOrder, readStoredOrderOverrides());

  if (mergedOrder.supportFollowUpStatus === supportFollowUpStatus) {
    return mergedOrder;
  }

  const overrides = readStoredOrderOverrides();
  const nextEvent = {
    id: `${existingOrder.id}-support-reviewed`,
    timeLabel: getOrderedAtTimeLabel(new Date().toISOString()),
    title: 'Support reviewed',
    description: 'Support reviewed the reported issue and recorded a follow-up update.',
  };
  const nextOverrides = {
    ...overrides,
    [orderId]: {
      ...overrides[orderId],
      supportFollowUpStatus,
      supportFollowUpNote: 'Support reviewed this issue.',
      supportReviewedAt: getSupportReviewedAtLabel(new Date()),
      timeline: mergeCustomTimelineEvent(mergedOrder, nextEvent),
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

function getSupportReviewedAtLabel(reviewedAt: Date) {
  const timeLabel = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(reviewedAt);

  return `Today, ${timeLabel}`;
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
