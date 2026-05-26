export interface OutletSettings {
  outletId: string;
  outletName: string;
  addressLine: string;
  city: string;
  area: string;
  operatingHours: string;
  pickupRules: string;
}

export interface NotificationPreferences {
  pickupReminders: boolean;
  orderAlerts: boolean;
  payoutUpdates: boolean;
  weeklySummary: boolean;
}

export interface FoodSafetyContact {
  supportName: string;
  supportPhone: string;
  supportEmail: string;
  fssaiNumber: string;
  gstNumber: string;
}

export interface PartnerSettings {
  partnerId: string;
  businessName: string;
  businessType: string;
  legalEntityName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  outlets: OutletSettings[];
  notificationPreferences: NotificationPreferences;
  foodSafetyContact: FoodSafetyContact;
}
