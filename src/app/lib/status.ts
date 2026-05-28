import type { Order, OrderStatus } from '../types/order';
import type { ListingStatus } from '../types/listing';
import type { PayoutStatus } from '../types/payout';
import type { VegType } from '../types/store';
import type { TeamMemberStatus } from '../types/team';

const orderStatusLabels: Record<OrderStatus, string> = {
  new_reserved: 'New / reserved',
  ready_for_pickup: 'Ready for pickup',
  collected: 'Collected',
  no_show: 'No-show',
  cancelled: 'Cancelled',
  issue_reported: 'Issue reported',
  refunded: 'Refunded',
};

const orderStatusClasses: Record<OrderStatus, string> = {
  new_reserved: 'bg-[#EEF5FF] text-[#245C9A]',
  ready_for_pickup: 'bg-[#E8F5E9] text-[#00A661]',
  collected: 'bg-[#F5F5F5] text-[#5A5A5A]',
  no_show: 'bg-[#FFF0EE] text-[#C05A2B]',
  cancelled: 'bg-[#F1F1EF] text-[#6A6A64]',
  issue_reported: 'bg-[#FFF4D6] text-[#A66B00]',
  refunded: 'bg-[#FFF4D6] text-[#A66B00]',
};

const paymentStatusLabels = {
  paid: 'Paid',
  refunded: 'Refunded',
  issue_hold: 'Under review',
} as const;

const paymentStatusClasses = {
  paid: 'bg-[#E8F5E9] text-[#00A661]',
  refunded: 'bg-[#F5F5F5] text-[#5A5A5A]',
  issue_hold: 'bg-[#FFF4D6] text-[#A66B00]',
} as const;

const vegTypeLabels: Record<VegType, string> = {
  veg: 'Veg',
  'non-veg': 'Non-veg',
  mixed: 'Veg and non-veg',
  egg: 'Egg possible',
};

export function getOrderStatusLabel(status: OrderStatus) {
  return orderStatusLabels[status];
}

export function getOrderStatusClasses(status: OrderStatus) {
  return orderStatusClasses[status];
}

export function getPartnerOrderQueueHint(status: OrderStatus) {
  switch (status) {
    case 'new_reserved':
      return 'Needs preparation';
    case 'ready_for_pickup':
      return 'Ready and waiting';
    case 'issue_reported':
      return 'Needs support follow-up';
    case 'no_show':
      return 'Pickup window missed';
    case 'cancelled':
      return 'Cancelled before pickup';
    case 'collected':
      return 'Completed quietly';
    default:
      return '';
  }
}

export function getPartnerOrderRowClasses(status: OrderStatus) {
  switch (status) {
    case 'new_reserved':
      return 'bg-[rgba(238,245,255,0.44)]';
    case 'ready_for_pickup':
      return 'bg-[rgba(232,245,233,0.52)]';
    case 'issue_reported':
      return 'bg-[rgba(255,244,214,0.38)]';
    case 'no_show':
      return 'bg-[rgba(255,240,238,0.42)]';
    case 'collected':
    default:
      return '';
  }
}

const customerOrderStatusLabels: Record<OrderStatus, string> = {
  new_reserved: 'Reserved',
  ready_for_pickup: 'Ready for pickup',
  collected: 'Collected',
  no_show: 'No-show',
  cancelled: 'Cancelled',
  issue_reported: 'Issue reported',
  refunded: 'Refunded',
};

export function getCustomerOrderStatusLabel(status: OrderStatus) {
  return customerOrderStatusLabels[status];
}

export function getOrderSupportHint(status: OrderStatus, supportNote: string) {
  switch (status) {
    case 'new_reserved':
      return 'Show your pickup code at the store.';
    case 'ready_for_pickup':
      return 'Ready during your pickup window.';
    case 'cancelled':
      return 'This reservation was released back to availability.';
    case 'issue_reported':
      return "Issue noted. We'll follow up from support.";
    case 'no_show':
      return 'Pickup window passed without collection.';
    default:
      return supportNote;
  }
}

export function getSupportFollowUpStatusLabel(status: NonNullable<Order['supportFollowUpStatus']>) {
  switch (status) {
    case 'reviewed':
      return 'Reviewed';
    case 'needs_follow_up':
    default:
      return 'Needs follow-up';
  }
}

export function getOrderListSupportHint(
  status: OrderStatus,
  supportNote: string,
  supportFollowUpStatus?: Order['supportFollowUpStatus'],
  supportFollowUpNote?: string,
) {
  if (status === 'issue_reported' && supportFollowUpStatus === 'reviewed') {
    return supportFollowUpNote || 'Support reviewed this issue.';
  }

  return getOrderSupportHint(status, supportNote);
}

export function getOrderDetailSupportSummary(
  status: OrderStatus,
  supportNote: string,
  supportFollowUpStatus?: Order['supportFollowUpStatus'],
  supportFollowUpNote?: string,
) {
  if (status === 'issue_reported' && supportFollowUpStatus === 'reviewed') {
    return supportFollowUpNote || 'Support reviewed this issue.';
  }

  return supportNote;
}

export function getVegTypeLabel(vegType: VegType) {
  return vegTypeLabels[vegType];
}

export function getQuantityLeftLabel(quantityLeft: number) {
  return `${quantityLeft} left`;
}

const listingStatusLabels: Record<ListingStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  live: 'Live',
  sold_out: 'Sold out',
  paused: 'Paused',
  archived: 'Archived',
};

const listingStatusClasses: Record<ListingStatus, string> = {
  draft: 'bg-[#F5F5F5] text-[#5A5A5A]',
  scheduled: 'bg-[#EEF5FF] text-[#245C9A]',
  live: 'bg-[#E8F5E9] text-[#00A661]',
  sold_out: 'bg-[#FFF4D6] text-[#A66B00]',
  paused: 'bg-[#FFF0EE] text-[#C05A2B]',
  archived: 'bg-[#F3F3F3] text-[#7B7B7B]',
};

export function getListingStatusLabel(status: ListingStatus) {
  return listingStatusLabels[status];
}

export function getListingStatusClasses(status: ListingStatus) {
  return listingStatusClasses[status];
}

export function getPaymentStatusLabel(status: keyof typeof paymentStatusLabels) {
  return paymentStatusLabels[status];
}

export function getPaymentStatusClasses(status: keyof typeof paymentStatusClasses) {
  return paymentStatusClasses[status];
}

const payoutStatusLabels: Record<PayoutStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  paid: 'Paid',
  failed: 'Failed',
};

const payoutStatusClasses: Record<PayoutStatus, string> = {
  pending: 'bg-[#EEF5FF] text-[#245C9A]',
  processing: 'bg-[#FFF4D6] text-[#A66B00]',
  paid: 'bg-[#E8F5E9] text-[#00A661]',
  failed: 'bg-[#FFE8E6] text-[#FF3B30]',
};

const teamMemberStatusLabels: Record<TeamMemberStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  suspended: 'Suspended',
};

const teamMemberStatusClasses: Record<TeamMemberStatus, string> = {
  active: 'bg-[#E8F5E9] text-[#00A661]',
  invited: 'bg-[#EEF5FF] text-[#245C9A]',
  suspended: 'bg-[#FFF0EE] text-[#C05A2B]',
};

export function getPayoutStatusLabel(status: PayoutStatus) {
  return payoutStatusLabels[status];
}

export function getPayoutStatusClasses(status: PayoutStatus) {
  return payoutStatusClasses[status];
}

export function getTeamMemberStatusLabel(status: TeamMemberStatus) {
  return teamMemberStatusLabels[status];
}

export function getTeamMemberStatusClasses(status: TeamMemberStatus) {
  return teamMemberStatusClasses[status];
}
