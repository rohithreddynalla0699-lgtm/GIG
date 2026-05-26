import type { Subscription } from '../../types/subscription';

export const subscriptions: Subscription[] = [
  {
    id: 'sub-hearth-2026',
    partnerId: 'partner-hearth-hospitality',
    planName: 'Monthly listing plan',
    priceMonthly: 199,
    renewalDateLabel: '1 June 2026',
    status: 'active',
    billingStatus: 'Auto-renew enabled',
    paymentMethodLabel: 'Visa ending 2042',
  },
];

export const currentSubscription = subscriptions[0];
