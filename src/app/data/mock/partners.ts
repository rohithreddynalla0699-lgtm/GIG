import type {
  MockPartnerProfile,
  Partner,
  PartnerOutlet,
  PartnerBillingStatus,
  PartnerSignupAcknowledgements,
  PartnerVerificationStatus,
} from '../../types/partner';
import { orders } from './orders';

export const MOCK_PARTNER_SESSION_KEY = 'gig-partner-session';
export const MOCK_PARTNER_PROFILE_KEY = 'gig-partner-profile';
export const PARTNER_PLATFORM_FEE_INR = 199;
export const PARTNER_COMMISSION_RATE = 0.2;

export const partners: Partner[] = [
  {
    id: 'partner-hearth-hospitality',
    businessName: 'Hearth Hospitality Collective',
    businessType: 'Bakery',
    verificationStatus: 'approved',
    city: 'Hyderabad',
    area: 'Hitech City',
    contactPerson: 'Asha Menon',
    contactEmail: 'asha@hearthbakehouse.in',
    contactPhone: '+91 98765 44021',
    subscriptionStatus: 'trial',
    outlets: [
      {
        id: 'outlet-hearth-bakehouse-hitech',
        name: 'Hearth Bakehouse · Hitech City',
        city: 'Hyderabad',
        area: 'Hitech City',
        addressLine: 'Mindspace Road, opposite Inorbit Mall',
        operatingHours: '8:00 AM - 9:30 PM',
        pickupRules: 'Please keep rescue bags ready 10 minutes before the pickup window begins.',
      },
      {
        id: 'outlet-hearth-bakehouse-madhapur',
        name: 'Hearth Bakehouse · Madhapur',
        city: 'Hyderabad',
        area: 'Madhapur',
        addressLine: 'Ayyappa Society Main Road',
        operatingHours: '8:30 AM - 9:00 PM',
        pickupRules: 'Use the front takeaway shelf for app pickups and keep labels visible.',
      },
    ],
  },
];

export const currentPartner = partners[0];
const SEED_PARTNER_WORKSPACE_ID = currentPartner.id;

export type MockPartnerActivationState = 'active' | 'verification_required' | 'billing_required';

function createPartnerWorkspaceId(businessName: string) {
  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32);
  return `partner-${slug || 'workspace'}-${Date.now()}`;
}

function buildWorkspaceOutlet(profile: Pick<
  MockPartnerProfile,
  'workspaceId' | 'tradingName' | 'legalBusinessName' | 'city' | 'addressLine1' | 'addressLine2' | 'stateRegion'
>): PartnerOutlet {
  const outletName = profile.tradingName.trim() || profile.legalBusinessName.trim() || 'Primary outlet';
  const addressLine = [profile.addressLine1.trim(), profile.addressLine2.trim()].filter(Boolean).join(', ');

  return {
    id: `outlet-${profile.workspaceId}-primary`,
    name: outletName,
    city: profile.city.trim() || 'Add city',
    area: profile.city.trim() || 'Primary area',
    addressLine: addressLine || 'Complete the pickup outlet address in Partner Profile.',
    operatingHours: 'Add outlet hours later',
    pickupRules: 'Keep rescue bags ready before the pickup window begins and verify the pickup code at handover.',
  };
}

function getDefaultMockPartnerProfile(): MockPartnerProfile {
  return {
    partnerId: currentPartner.id,
    workspaceId: SEED_PARTNER_WORKSPACE_ID,
    verificationStatus: currentPartner.verificationStatus,
    billingStatus: currentPartner.verificationStatus === 'approved' ? 'active' : 'inactive',
    legalBusinessName: currentPartner.businessName,
    tradingName: currentPartner.outlets[0]?.name ?? currentPartner.businessName,
    businessType: currentPartner.businessType,
    ownerContactName: currentPartner.contactPerson,
    contactPhone: currentPartner.contactPhone,
    businessEmail: currentPartner.contactEmail,
    addressLine1: currentPartner.outlets[0]?.addressLine ?? '',
    addressLine2: '',
    city: currentPartner.city,
    stateRegion: 'Telangana',
    pinCode: '',
    country: 'India',
    fssaiLicenseNumber: '',
    licenseType: 'Not sure yet',
    licenseExpiryDate: '',
    registeredBusinessNameOnLicense: currentPartner.businessName,
    licenseDocumentName: '',
    gstin: '',
    pan: '',
    confirmsSafeSurplusFood: false,
    confirmsAccurateDisclosure: false,
    confirmsHygieneResponsibility: false,
    confirmsGigReviewRights: false,
    acceptedTerms: false,
    acknowledgedFoodSafety: false,
    acknowledgedResponsibility: false,
    acknowledgedLicensing: false,
    acknowledgedPricing: false,
    pricingAcknowledgedAt: '',
  };
}

export function getMockPartnerProfile() {
  const fallback = getDefaultMockPartnerProfile();

  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(MOCK_PARTNER_PROFILE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<MockPartnerProfile>;
    return {
      ...fallback,
      ...parsed,
      partnerId: parsed.partnerId || parsed.workspaceId || fallback.partnerId,
      workspaceId: parsed.workspaceId || parsed.partnerId || fallback.workspaceId,
    };
  } catch {
    return fallback;
  }
}

export function saveMockPartnerProfile(profile: MockPartnerProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    MOCK_PARTNER_PROFILE_KEY,
    JSON.stringify({
      ...profile,
      partnerId: profile.partnerId || profile.workspaceId,
      workspaceId: profile.workspaceId || profile.partnerId,
    }),
  );
}

interface SignupProfileInput extends PartnerSignupAcknowledgements {
  businessName: string;
  businessType: string;
  contactName: string;
  businessEmail: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateRegion: string;
  pinCode: string;
  country: string;
}

export function initializeMockPartnerProfileFromSignup(input: SignupProfileInput) {
  const workspaceId = createPartnerWorkspaceId(input.businessName.trim());
  const nextProfile: MockPartnerProfile = {
    ...getDefaultMockPartnerProfile(),
    partnerId: workspaceId,
    workspaceId,
    verificationStatus: 'pending_verification',
    billingStatus: 'inactive',
    legalBusinessName: input.businessName.trim(),
    tradingName: input.businessName.trim(),
    businessType: input.businessType,
    ownerContactName: input.contactName.trim(),
    contactPhone: `+91 ${input.phone}`,
    businessEmail: input.businessEmail.trim(),
    addressLine1: input.addressLine1.trim(),
    addressLine2: input.addressLine2.trim(),
    city: input.city.trim(),
    stateRegion: input.stateRegion.trim(),
    pinCode: input.pinCode.trim(),
    country: input.country.trim() || 'India',
    registeredBusinessNameOnLicense: input.businessName.trim(),
    acceptedTerms: input.acceptedTerms,
    acknowledgedFoodSafety: input.acknowledgedFoodSafety,
    acknowledgedResponsibility: input.acknowledgedResponsibility,
    acknowledgedLicensing: input.acknowledgedLicensing,
    acknowledgedPricing: input.acknowledgedPricing,
    pricingAcknowledgedAt: input.acknowledgedPricing ? new Date().toISOString() : '',
    confirmsSafeSurplusFood: input.acknowledgedFoodSafety,
    confirmsHygieneResponsibility: input.acknowledgedResponsibility,
    confirmsAccurateDisclosure: false,
    confirmsGigReviewRights: false,
  };

  saveMockPartnerProfile(nextProfile);
}

export function setMockPartnerVerificationStatus(status: PartnerVerificationStatus) {
  const profile = getMockPartnerProfile();
  saveMockPartnerProfile({
    ...profile,
    verificationStatus: status,
  });
}

export function setMockPartnerBillingStatus(status: PartnerBillingStatus) {
  const profile = getMockPartnerProfile();
  saveMockPartnerProfile({
    ...profile,
    billingStatus: status,
  });
}

export function getMockPartnerActivationState(): MockPartnerActivationState {
  const profile = getMockPartnerProfile();

  if (profile.verificationStatus !== 'approved') {
    return 'verification_required';
  }

  if (profile.billingStatus !== 'active') {
    return 'billing_required';
  }

  return 'active';
}

export function getMockPartnerWorkspaceId() {
  return getMockPartnerProfile().workspaceId || getMockPartnerProfile().partnerId;
}

export function isMockNewPartnerWorkspace() {
  return getMockPartnerWorkspaceId() !== SEED_PARTNER_WORKSPACE_ID;
}

export function isSeedPartnerWorkspaceId(workspaceId: string) {
  return workspaceId === SEED_PARTNER_WORKSPACE_ID;
}

export function getMockPartnerWorkspaceOutlets() {
  const profile = getMockPartnerProfile();

  if (isSeedPartnerWorkspaceId(profile.workspaceId)) {
    return currentPartner.outlets;
  }

  return [buildWorkspaceOutlet(profile)];
}

export function getMockPartnerWorkspacePartner(): Partner {
  const profile = getMockPartnerProfile();

  if (isSeedPartnerWorkspaceId(profile.workspaceId)) {
    return currentPartner;
  }

  return {
    id: profile.workspaceId,
    businessName: profile.legalBusinessName.trim() || profile.tradingName.trim() || 'New partner workspace',
    businessType: profile.businessType.trim() || 'Restaurant',
    verificationStatus: profile.verificationStatus,
    city: profile.city.trim() || 'Add city',
    area: profile.city.trim() || 'Primary area',
    contactPerson: profile.ownerContactName.trim() || 'Authorized contact',
    contactEmail: profile.businessEmail.trim() || 'partner@example.com',
    contactPhone: profile.contactPhone.trim() || '+91 00000 00000',
    subscriptionStatus: profile.billingStatus === 'active' ? 'active' : 'pending',
    outlets: getMockPartnerWorkspaceOutlets(),
  };
}

export function getMockPartnerWorkspaceOrders() {
  const workspaceOutlets = getMockPartnerWorkspaceOutlets();
  const outletIds = workspaceOutlets.map((outlet) => outlet.id);

  if (!isSeedPartnerWorkspaceId(getMockPartnerWorkspaceId())) {
    return [];
  }

  return orders.filter((order) => outletIds.includes(order.outletId));
}

export function getMockPartnerCreateBagRoute() {
  const activationState = getMockPartnerActivationState();

  if (activationState === 'active') {
    return '/partner/listings/new';
  }

  if (activationState === 'billing_required') {
    return '/partner/billing';
  }

  return '/partner/profile';
}

export function isMockPartnerVerified() {
  return getMockPartnerActivationState() === 'active';
}

export function isMockPartnerSignedIn() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(MOCK_PARTNER_SESSION_KEY) === currentPartner.id;
}

export function setMockPartnerSession(partnerId: string = currentPartner.id) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(MOCK_PARTNER_SESSION_KEY, partnerId);
  window.localStorage.setItem(MOCK_PARTNER_SESSION_KEY, partnerId);
}

export function clearMockPartnerSession() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(MOCK_PARTNER_SESSION_KEY);
  window.localStorage.removeItem(MOCK_PARTNER_SESSION_KEY);
}
