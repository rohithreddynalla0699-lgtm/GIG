import type { VegType } from './store';

export type BagConcept = 'Rescue Bag';
export type BagStatus = 'active' | 'limited' | 'sold_out';

export interface Bag {
  id: string;
  slug: string;
  storeId: string;
  title: string;
  concept: BagConcept;
  category: string;
  cuisine: string;
  shortDescription: string;
  fullDescription: string;
  originalPrice: number;
  rescuePrice: number;
  quantityTotal: number;
  quantityLeft: number;
  pickupDateLabel: string;
  pickupWindow: string;
  pickupSlot: 'Breakfast' | 'Lunch' | 'Evening' | 'Late Night';
  vegType: VegType;
  dietaryTags: string[];
  allergenNote: string;
  includedItems: string[];
  collectionNote: string;
  status: BagStatus;
  imageUrl: string;
}

export interface DisplayBag extends Bag {
  imageUrlOverride?: string;
}
