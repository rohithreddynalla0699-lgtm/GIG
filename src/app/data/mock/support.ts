import type { SupportCategory, SupportContact } from '../../types/support';

export const supportCategories: SupportCategory[] = [
  {
    id: 'pickup',
    title: 'Pickup and collection',
    description: 'How to collect smoothly and what to do if you are running late.',
    topics: [
      {
        id: 'pickup-code',
        title: 'Where do I show my pickup code?',
        description: 'Every order includes a 4-digit code visible in the app and on your web order summary.',
        guidance: [
          'Reach the store within the pickup slot shown on your order.',
          'Open the app or order detail screen and show the 4-digit code at handover.',
          'If the store has a separate takeaway counter, use that queue for faster pickup.',
        ],
      },
      {
        id: 'late-arrival',
        title: 'What if I am running late?',
        description: 'Pickup windows are short because food quality matters.',
        guidance: [
          'Open the app to contact the store before the pickup slot closes.',
          'Stores may not be able to hold food beyond the promised window.',
          'If pickup fails, check the app for cancellation or support guidance.',
        ],
      },
    ],
  },
  {
    id: 'refunds',
    title: 'Refunds and cancellations',
    description: 'What happens if a store runs out, closes early, or your order is cancelled.',
    topics: [
      {
        id: 'refund-timeline',
        title: 'How do refunds work?',
        description: 'Refunds are handled through the mobile app payment flow.',
        guidance: [
          'Open the app to see the live refund status for the affected order.',
          'UPI refunds are usually the fastest, followed by cards and wallets.',
          'If your refund looks delayed, contact support with your order ID.',
        ],
      },
      {
        id: 'stock-mismatch',
        title: 'The store says the bag is unavailable',
        description: 'Sometimes a listing can sell out or be withdrawn before pickup.',
        guidance: [
          'Show your order detail to the store team first.',
          'If they still cannot fulfill it, report the issue in the app.',
          'The support team can review and help with refund or replacement options.',
        ],
      },
    ],
  },
  {
    id: 'quality',
    title: 'Food quality and safety',
    description: 'What to expect from surprise bags and how to report issues.',
    topics: [
      {
        id: 'quality-check',
        title: 'How fresh is the food?',
        description: 'Listings are meant for same-day pickup and should be safe to consume.',
        guidance: [
          'Always check the dietary and allergen notes on the bag detail page.',
          'If a bag quality issue appears serious, report it in the app right away.',
          'For mild concerns, include photos and the order ID when contacting support.',
        ],
      },
      {
        id: 'surprise-bag',
        title: 'What exactly comes inside a surprise bag?',
        description: 'The contents vary by store and daily surplus, but pages usually show the likely format.',
        guidance: [
          'Use fixed meal boxes if you want more predictable contents.',
          'Use dietary tags and veg/non-veg badges to narrow choices.',
          'Store pages often mention the typical mix you can expect.',
        ],
      },
    ],
  },
];

export const supportContact: SupportContact = {
  email: 'support@grabitgood.com',
  phone: '+91 40 5555 0199',
  hours: 'Daily, 9:00 AM - 10:00 PM IST',
};
