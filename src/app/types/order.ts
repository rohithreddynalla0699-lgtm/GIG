export type OrderStatus =
  | 'new_reserved'
  | 'ready_for_pickup'
  | 'collected'
  | 'no_show'
  | 'cancelled'
  | 'issue_reported';

export type SupportFollowUpStatus = 'needs_follow_up' | 'reviewed';

export type PaymentStatus = 'paid';

export interface OrderTimelineEvent {
  id: string;
  timeLabel: string;
  title: string;
  description: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhoneMasked: string;
  storeId: string;
  outletId: string;
  bagId: string;
  listingTitle: string;
  quantity: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderedAt: string;
  pickupDateLabel: string;
  pickupWindow: string;
  pickupCode: string;
  amountPaid: number;
  paymentSummary: string;
  collectionInstructions: string;
  supportNote: string;
  timeline: OrderTimelineEvent[];
  issueNote?: string;
  supportFollowUpStatus?: SupportFollowUpStatus;
  supportFollowUpNote?: string;
  supportReviewedAt?: string;
  relatedPartnerListingId?: string;
}
