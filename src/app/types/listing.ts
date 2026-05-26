import type { VegType } from './store';

export type ListingType = 'Surprise Bag' | 'Fixed Meal Box';
export type ListingStatus = 'draft' | 'scheduled' | 'live' | 'sold_out' | 'paused' | 'archived';

export interface PartnerListing {
  id: string;
  workspaceId?: string;
  outletId: string;
  title: string;
  listingType: ListingType;
  category: string;
  originalPrice: number;
  rescuePrice: number;
  quantity: number;
  quantityLeft: number;
  pickupStart: string;
  pickupEnd: string;
  vegType: VegType;
  dietaryTags: string[];
  allergenNote: string;
  collectionInstructions: string;
  status: ListingStatus;
  shortDescription: string;
  createdAtLabel: string;
  createdAt?: number;
}
