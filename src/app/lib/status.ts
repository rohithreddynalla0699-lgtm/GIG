import type { OrderStatus } from '../types/order';
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
  cancelled: 'bg-[#FFE8E6] text-[#FF3B30]',
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
