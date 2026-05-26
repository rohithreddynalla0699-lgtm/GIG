export type VegType = 'veg' | 'non-veg' | 'mixed' | 'egg';

export interface Store {
  id: string;
  slug: string;
  name: string;
  category: 'Bakery' | 'Cafe' | 'Restaurant' | 'Desserts' | 'Grocery' | 'Cloud Kitchen';
  cuisines: string[];
  city: string;
  area: string;
  pincode: string;
  addressLine: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  description: string;
  pickupInstructions: string;
  openingNote: string;
  vegType: VegType;
  dietaryTags: string[];
  trustBadges: string[];
  cardImage: string;
  heroImage: string;
}
