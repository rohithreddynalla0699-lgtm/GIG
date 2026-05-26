export interface CustomerImpact {
  bagsRescued: number;
  moneySaved: number;
  co2PreventedKg: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDateLabel?: string;
  city: string;
  area: string;
  defaultPincode: string;
  savedStoreIds: string[];
  savedBagIds: string[];
  likedStoreIds?: string[];
  preferredCategories?: string[];
  preferredPickupMoments?: string[];
  impact: CustomerImpact;
}
