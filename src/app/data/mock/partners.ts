import type {
  MockPartnerLockedFeature,
  MockPartnerProfile,
  MockPartnerWorkspaceAccessState,
  Partner,
  PartnerBillingStatus,
  PartnerOutlet,
  PartnerSignupAcknowledgements,
  PartnerVerificationStatus,
} from '../../types/partner';
import { getMockOrders } from './orders';

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

interface MockPartnerCompletionState {
  complete: boolean;
}

interface MockPartnerOperationalReadiness {
  verificationApproved: boolean;
  billingActive: boolean;
  fssaiComplete: boolean;
  panComplete: boolean;
  bankLinked: boolean;
  complianceComplete: boolean;
  activationEligible: boolean;
}

export interface MockPartnerQualitySummary {
  totalOrders: number;
  issueOrders: number;
  issueRate: number;
  threshold: number;
  isAtRisk: boolean;
}

function createPartnerWorkspaceId(businessName: string) {
  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32);
  return `partner-${slug || 'workspace'}-${Date.now()}`;
}

function buildWorkspaceOutlet(
  profile: Pick<
    MockPartnerProfile,
    'workspaceId' | 'tradingName' | 'legalBusinessName' | 'city' | 'addressLine1' | 'addressLine2' | 'stateRegion'
  >,
): PartnerOutlet {
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
    storeImageUrl: '',
    customerStoreId: 'store-hearth-bakehouse',
    addressLine1: currentPartner.outlets[0]?.addressLine ?? '',
    addressLine2: '',
    city: currentPartner.city,
    stateRegion: 'Telangana',
    pinCode: '',
    country: 'India',
    fssaiLicenseNumber: '13619011001234',
    licenseType: 'State License',
    licenseExpiryDate: '2027-12-31',
    registeredBusinessNameOnLicense: currentPartner.businessName,
    licenseDocumentName: 'hearth-fssai-license.pdf',
    gstin: '',
    pan: 'AABCH1234L',
    panNumber: 'AABCH1234L',
    panHolderName: currentPartner.businessName,
    authorizedRepresentativeConfirmed: true,
    confirmsSafeSurplusFood: true,
    confirmsEdibleSurplusFood: true,
    confirmsNoExtraProduction: true,
    confirmsAllergenResponsibility: true,
    confirmsPackagingResponsibility: true,
    confirmsStorageResponsibility: true,
    confirmsLocalLawCompliance: true,
    confirmsAccurateDisclosure: true,
    confirmsHygieneResponsibility: true,
    confirmsGigReviewRights: true,
    bankAccountHolderName: currentPartner.businessName,
    bankAccountNumber: '50200012345678',
    bankIfsc: 'HDFC0001234',
    bankName: 'HDFC Bank',
    bankProofDocumentName: 'hearth-cancelled-cheque.pdf',
    bankLinked: true,
    acceptedTerms: true,
    acknowledgedFoodSafety: true,
    acknowledgedResponsibility: true,
    acknowledgedLicensing: true,
    acknowledgedPricing: true,
    pricingAcknowledgedAt: '2026-01-10T10:00:00.000Z',
  };
}

function normalizeProfile(profile?: MockPartnerProfile) {
  return profile ?? getMockPartnerProfile();
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
      panNumber: parsed.panNumber || parsed.pan || fallback.panNumber,
      pan: parsed.pan || parsed.panNumber || fallback.pan,
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
      pan: profile.pan || profile.panNumber,
      panNumber: profile.panNumber || profile.pan,
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
    customerStoreId: '',
    registeredBusinessNameOnLicense: input.businessName.trim(),
    gstin: '',
    pan: '',
    panNumber: '',
    panHolderName: '',
    authorizedRepresentativeConfirmed: false,
    acceptedTerms: input.acceptedTerms,
    acknowledgedFoodSafety: input.acknowledgedFoodSafety,
    acknowledgedResponsibility: input.acknowledgedResponsibility,
    acknowledgedLicensing: input.acknowledgedLicensing,
    acknowledgedPricing: input.acknowledgedPricing,
    pricingAcknowledgedAt: input.acknowledgedPricing ? new Date().toISOString() : '',
    confirmsSafeSurplusFood: input.acknowledgedFoodSafety,
    confirmsEdibleSurplusFood: false,
    confirmsNoExtraProduction: false,
    confirmsAllergenResponsibility: false,
    confirmsPackagingResponsibility: false,
    confirmsStorageResponsibility: false,
    confirmsLocalLawCompliance: false,
    confirmsHygieneResponsibility: input.acknowledgedResponsibility,
    confirmsAccurateDisclosure: false,
    confirmsGigReviewRights: false,
    bankAccountHolderName: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankName: '',
    bankProofDocumentName: '',
    bankLinked: false,
    fssaiLicenseNumber: '',
    licenseType: 'Not sure yet',
    licenseExpiryDate: '',
    licenseDocumentName: '',
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

export function getMockPartnerFssaiCompletion(profile?: MockPartnerProfile): MockPartnerCompletionState {
  const current = normalizeProfile(profile);

  return {
    complete:
      current.fssaiLicenseNumber.trim().length > 0 &&
      current.registeredBusinessNameOnLicense.trim().length > 0 &&
      current.licenseExpiryDate.trim().length > 0 &&
      current.licenseDocumentName.trim().length > 0 &&
      current.addressLine1.trim().length > 0 &&
      current.city.trim().length > 0 &&
      current.stateRegion.trim().length > 0,
  };
}

export function getMockPartnerPanCompletion(profile?: MockPartnerProfile): MockPartnerCompletionState {
  const current = normalizeProfile(profile);

  return {
    complete: current.panNumber.trim().length > 0 && current.panHolderName.trim().length > 0,
  };
}

export function getMockPartnerBankCompletion(profile?: MockPartnerProfile): MockPartnerCompletionState {
  const current = normalizeProfile(profile);

  return {
    complete:
      current.bankLinked &&
      current.bankAccountHolderName.trim().length > 0 &&
      current.bankAccountNumber.trim().length > 0 &&
      current.bankIfsc.trim().length > 0 &&
      current.bankName.trim().length > 0 &&
      current.bankProofDocumentName.trim().length > 0,
  };
}

export function getMockPartnerComplianceDeclarationCompletion(profile?: MockPartnerProfile): MockPartnerCompletionState {
  const current = normalizeProfile(profile);

  return {
    complete:
      current.authorizedRepresentativeConfirmed &&
      current.confirmsEdibleSurplusFood &&
      current.confirmsNoExtraProduction &&
      current.confirmsAllergenResponsibility &&
      current.confirmsPackagingResponsibility &&
      current.confirmsStorageResponsibility &&
      current.confirmsLocalLawCompliance &&
      current.confirmsGigReviewRights &&
      current.acknowledgedPricing &&
      current.acknowledgedLicensing &&
      current.acknowledgedResponsibility &&
      current.acknowledgedFoodSafety,
  };
}

export function isMockPartnerFssaiComplete(profile?: MockPartnerProfile) {
  return getMockPartnerFssaiCompletion(profile).complete;
}

export function isMockPartnerPanComplete(profile?: MockPartnerProfile) {
  return getMockPartnerPanCompletion(profile).complete;
}

export function isMockPartnerBankLinked(profile?: MockPartnerProfile) {
  return getMockPartnerBankCompletion(profile).complete;
}

export function isMockPartnerComplianceComplete(profile?: MockPartnerProfile) {
  return getMockPartnerComplianceDeclarationCompletion(profile).complete;
}

export function getMockPartnerOperationalReadiness(profile?: MockPartnerProfile): MockPartnerOperationalReadiness {
  const current = normalizeProfile(profile);
  const verificationApproved = current.verificationStatus === 'approved';
  const billingActive = current.billingStatus === 'active';
  const fssaiComplete = isMockPartnerFssaiComplete(current);
  const panComplete = isMockPartnerPanComplete(current);
  const bankLinked = isMockPartnerBankLinked(current);
  const complianceComplete = isMockPartnerComplianceComplete(current);

  return {
    verificationApproved,
    billingActive,
    fssaiComplete,
    panComplete,
    bankLinked,
    complianceComplete,
    activationEligible:
      verificationApproved &&
      billingActive &&
      fssaiComplete &&
      panComplete &&
      bankLinked &&
      complianceComplete,
  };
}

export function isMockPartnerActivationEligible(profile?: MockPartnerProfile) {
  return getMockPartnerOperationalReadiness(profile).activationEligible;
}

export function getMockPartnerWorkspaceAccessState(profile?: MockPartnerProfile): MockPartnerWorkspaceAccessState {
  return isMockPartnerActivationEligible(profile) ? 'active' : 'restricted';
}

export function isMockPartnerWorkspaceActive(profile?: MockPartnerProfile) {
  return getMockPartnerWorkspaceAccessState(profile) === 'active';
}

export function canMockPartnerAccessFeature(feature: MockPartnerLockedFeature, profile?: MockPartnerProfile) {
  switch (feature) {
    case 'listings':
    case 'create_listing':
    case 'orders':
    case 'payouts':
    case 'team':
    case 'settings':
    case 'help':
      return isMockPartnerWorkspaceActive(profile);
    default:
      return false;
  }
}

export function getMockPartnerLockedFeatureRoute(feature: MockPartnerLockedFeature) {
  switch (feature) {
    case 'listings':
      return '/partner/listings';
    case 'create_listing':
      return '/partner/listings/new';
    case 'orders':
      return '/partner/orders';
    case 'payouts':
      return '/partner/payouts';
    case 'team':
      return '/partner/team';
    case 'settings':
      return '/partner/settings';
    case 'help':
      return '/partner/help';
    default:
      return '/partner/profile';
  }
}

export function isMockPartnerRouteAllowed(pathname: string, profile?: MockPartnerProfile) {
  if (isMockPartnerWorkspaceActive(profile)) {
    return true;
  }

  return pathname === '/partner' || pathname === '/partner/profile' || pathname === '/partner/billing';
}

export function getMockPartnerRestrictedRouteRedirect(pathname: string, profile?: MockPartnerProfile) {
  return isMockPartnerRouteAllowed(pathname, profile) ? pathname : '/partner/profile';
}

export function getMockPartnerActivationState(): MockPartnerActivationState {
  const profile = getMockPartnerProfile();

  if (profile.verificationStatus !== 'approved') {
    return 'verification_required';
  }

  if (profile.billingStatus !== 'active') {
    return 'billing_required';
  }

  return isMockPartnerActivationEligible(profile) ? 'active' : 'verification_required';
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

  return getMockOrders().filter((order) => outletIds.includes(order.outletId));
}

export function getMockPartnerQualitySummary(workspaceId: string = getMockPartnerWorkspaceId()): MockPartnerQualitySummary {
  const workspaceOrders = isSeedPartnerWorkspaceId(workspaceId) ? getMockPartnerWorkspaceOrders() : [];
  const totalOrders = workspaceOrders.length;
  const issueOrders = workspaceOrders.filter((order) => order.status === 'issue_reported').length;
  const threshold = 30;
  const issueRate = totalOrders > 0 ? Math.round((issueOrders / totalOrders) * 100) : 0;

  return {
    totalOrders,
    issueOrders,
    issueRate,
    threshold,
    isAtRisk: totalOrders > 0 && issueRate >= threshold,
  };
}

export function getMockPartnerCreateBagRoute() {
  if (isMockPartnerWorkspaceActive()) {
    return '/partner/listings/new';
  }

  return '/partner/profile';
}

export function isMockPartnerVerified() {
  return isMockPartnerWorkspaceActive();
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
