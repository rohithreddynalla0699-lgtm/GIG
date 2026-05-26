import type { Order } from '../../types/order';

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

export function getOrderById(orderId: string) {
  return orders.find((order) => order.id === orderId);
}

export function getOrdersByStoreId(storeId: string) {
  return orders.filter((order) => order.storeId === storeId);
}

export function getOrdersByBagId(bagId: string) {
  return orders.filter((order) => order.bagId === bagId);
}
