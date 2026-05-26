import type { PartnerSettings } from '../../types/settings';
import { currentPartner } from './partners';

export const partnerSettings: PartnerSettings = {
  partnerId: currentPartner.id,
  businessName: currentPartner.businessName,
  businessType: currentPartner.businessType,
  legalEntityName: 'Hearth Hospitality Collective Private Limited',
  contactPerson: currentPartner.contactPerson,
  contactEmail: currentPartner.contactEmail,
  contactPhone: currentPartner.contactPhone,
  outlets: currentPartner.outlets.map((outlet) => ({
    outletId: outlet.id,
    outletName: outlet.name,
    addressLine: outlet.addressLine,
    city: outlet.city,
    area: outlet.area,
    operatingHours: outlet.operatingHours,
    pickupRules: outlet.pickupRules,
  })),
  notificationPreferences: {
    pickupReminders: true,
    orderAlerts: true,
    payoutUpdates: true,
    weeklySummary: false,
  },
  foodSafetyContact: {
    supportName: 'Kiran Varma',
    supportPhone: '+91 99891 67***',
    supportEmail: 'foodsafety@hearthbakehouse.in',
    fssaiNumber: '1362201100XXXX',
    gstNumber: '36AABCH3271Q1ZP',
  },
};
