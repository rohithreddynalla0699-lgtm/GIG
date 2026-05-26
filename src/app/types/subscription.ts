export type SubscriptionStatus = 'active' | 'past_due' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  partnerId: string;
  planName: string;
  priceMonthly: number;
  renewalDateLabel: string;
  status: SubscriptionStatus;
  billingStatus: string;
  paymentMethodLabel: string;
}
