export interface PartnerOutlet {
  id: string;
  name: string;
  city: string;
  area: string;
  addressLine: string;
  operatingHours: string;
  pickupRules: string;
}

export type PartnerVerificationStatus =
  | 'approved'
  | 'pending_verification'
  | 'ready_for_review'
  | 'submitted_for_review';

export type PartnerBillingStatus = 'inactive' | 'billing_setup_required' | 'active';

export type MockPartnerWorkspaceAccessState = 'restricted' | 'active';

export type MockPartnerLockedFeature =
  | 'listings'
  | 'create_listing'
  | 'orders'
  | 'payouts'
  | 'team'
  | 'settings'
  | 'help';

export interface Partner {
  id: string;
  businessName: string;
  businessType: string;
  verificationStatus: PartnerVerificationStatus;
  city: string;
  area: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  subscriptionStatus: 'active' | 'trial' | 'pending';
  outlets: PartnerOutlet[];
}

export type PartnerLicenseType =
  | 'FSSAI Registration'
  | 'State License'
  | 'Central License'
  | 'Not sure yet';

export interface PartnerSignupAcknowledgements {
  acceptedTerms: boolean;
  acknowledgedFoodSafety: boolean;
  acknowledgedResponsibility: boolean;
  acknowledgedLicensing: boolean;
  acknowledgedPricing: boolean;
}

export interface MockPartnerProfile {
  partnerId: string;
  workspaceId: string;
  verificationStatus: PartnerVerificationStatus;
  billingStatus: PartnerBillingStatus;
  legalBusinessName: string;
  tradingName: string;
  businessType: string;
  ownerContactName: string;
  contactPhone: string;
  businessEmail: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateRegion: string;
  pinCode: string;
  country: string;
  fssaiLicenseNumber: string;
  licenseType: PartnerLicenseType;
  licenseExpiryDate: string;
  registeredBusinessNameOnLicense: string;
  licenseDocumentName: string;
  gstin: string;
  pan: string;
  panNumber: string;
  panHolderName: string;
  authorizedRepresentativeConfirmed: boolean;
  confirmsSafeSurplusFood: boolean;
  confirmsEdibleSurplusFood: boolean;
  confirmsNoExtraProduction: boolean;
  confirmsAllergenResponsibility: boolean;
  confirmsPackagingResponsibility: boolean;
  confirmsStorageResponsibility: boolean;
  confirmsLocalLawCompliance: boolean;
  confirmsAccurateDisclosure: boolean;
  confirmsHygieneResponsibility: boolean;
  confirmsGigReviewRights: boolean;
  bankAccountHolderName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  bankProofDocumentName: string;
  bankLinked: boolean;
  acceptedTerms: boolean;
  acknowledgedFoodSafety: boolean;
  acknowledgedResponsibility: boolean;
  acknowledgedLicensing: boolean;
  acknowledgedPricing: boolean;
  pricingAcknowledgedAt: string;
}
