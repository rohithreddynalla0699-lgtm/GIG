import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import SectionCard from '../../components/shared/SectionCard';
import {
  getMockPartnerCreateBagRoute,
  getMockPartnerProfile,
  PARTNER_COMMISSION_RATE,
  PARTNER_PLATFORM_FEE_INR,
  saveMockPartnerProfile,
} from '../../data/mock/partners';
import type { MockPartnerProfile, PartnerLicenseType, PartnerVerificationStatus } from '../../types/partner';

const licenseTypes: PartnerLicenseType[] = [
  'FSSAI Registration',
  'State License',
  'Central License',
  'Not sure yet',
] as const;

const inputClass =
  'w-full rounded-[18px] border border-[color:var(--gig-border)] bg-white px-4 py-[14px] text-[15px] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]';

const checkboxClass =
  'mt-1 h-4 w-4 rounded border-[color:var(--gig-border)] text-[color:var(--gig-green-deep)] focus:ring-[rgba(11,122,77,0.16)]';

type ProfileStep = 'business' | 'verification';

function isFilled(value: string) {
  return value.trim().length > 0;
}

function getProfileCompletion(profile: MockPartnerProfile) {
  return {
    businessIdentity:
      isFilled(profile.legalBusinessName) &&
      isFilled(profile.tradingName) &&
      isFilled(profile.businessType) &&
      isFilled(profile.ownerContactName) &&
      isFilled(profile.contactPhone) &&
      isFilled(profile.businessEmail),
    pickupAddress:
      isFilled(profile.addressLine1) &&
      isFilled(profile.city) &&
      isFilled(profile.stateRegion) &&
      isFilled(profile.pinCode) &&
      isFilled(profile.country),
    foodLicense:
      isFilled(profile.fssaiLicenseNumber) &&
      isFilled(profile.licenseType) &&
      isFilled(profile.licenseExpiryDate) &&
      isFilled(profile.registeredBusinessNameOnLicense),
    confirmations:
      profile.acknowledgedFoodSafety &&
      profile.acknowledgedResponsibility &&
      profile.acknowledgedLicensing &&
      profile.confirmsGigReviewRights &&
      profile.acknowledgedPricing,
  };
}

function getVerificationStatusLabel(status: PartnerVerificationStatus) {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'ready_for_review':
      return 'Ready for approval';
    case 'submitted_for_review':
      return 'Submitted for review';
    default:
      return 'Pending verification';
  }
}

function getNextVerificationStatus(
  currentStatus: PartnerVerificationStatus,
  allComplete: boolean,
): PartnerVerificationStatus {
  if (currentStatus === 'approved') {
    return 'approved';
  }

  if (!allComplete) {
    return 'pending_verification';
  }

  if (currentStatus === 'submitted_for_review') {
    return 'submitted_for_review';
  }

  return 'ready_for_review';
}

export default function PartnerProfilePage() {
  const [profile, setProfile] = useState(() => getMockPartnerProfile());
  const [savedNotice, setSavedNotice] = useState('');
  const [step, setStep] = useState<ProfileStep>('business');

  const updateField = <K extends keyof typeof profile>(field: K, value: (typeof profile)[K]) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSavedNotice('');
  };

  const completion = useMemo(() => getProfileCompletion(profile), [profile]);
  const allComplete = useMemo(() => Object.values(completion).every(Boolean), [completion]);
  const createBagRoute = getMockPartnerCreateBagRoute();

  const steps = [
    {
      key: 'business' as const,
      label: 'Business details',
      caption: 'Identity and pickup address',
    },
    {
      key: 'verification' as const,
      label: 'Verification details',
      caption: 'License, confirmations, and billing terms',
    },
  ];

  const checklist = [
    { label: 'Business identity', done: completion.businessIdentity },
    { label: 'Pickup outlet address', done: completion.pickupAddress },
    { label: 'Food license', done: completion.foodLicense },
    { label: 'Partner confirmations', done: completion.confirmations },
  ];

  const buildSavedProfile = (nextVerificationStatus: PartnerVerificationStatus) => ({
    ...profile,
    verificationStatus: nextVerificationStatus,
    billingStatus:
      nextVerificationStatus === 'approved' ? 'billing_setup_required' : profile.billingStatus,
    confirmsSafeSurplusFood: profile.acknowledgedFoodSafety,
    confirmsHygieneResponsibility: profile.acknowledgedResponsibility,
    confirmsAccurateDisclosure: profile.acknowledgedResponsibility,
    pricingAcknowledgedAt:
      profile.acknowledgedPricing
        ? profile.pricingAcknowledgedAt || new Date().toISOString()
        : '',
  });

  const persistProfile = (nextProfile: MockPartnerProfile, notice: string) => {
    saveMockPartnerProfile(nextProfile);
    setProfile(nextProfile);
    setSavedNotice(notice);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextStatus = getNextVerificationStatus(profile.verificationStatus, allComplete);
    const nextProfile = buildSavedProfile(nextStatus);
    persistProfile(
      nextProfile,
      allComplete
        ? 'Verification details saved locally. Your profile is now ready for approval.'
        : 'Verification details saved locally. Complete every required section and partner confirmation to move this profile to review.',
    );
  };

  const handleSubmitForReview = () => {
    if (!allComplete) {
      setSavedNotice('Finish all required business, address, license, and confirmation details before submitting for review.');
      return;
    }

    const nextProfile = buildSavedProfile('submitted_for_review');
    persistProfile(
      nextProfile,
      'Submitted for review. In this frontend-only demo, you can use the mock approval action below to continue to billing setup.',
    );
  };

  const handleMockApprove = () => {
    const nextProfile = buildSavedProfile('approved');
    persistProfile(
      nextProfile,
      'Verification approved in demo mode. Billing setup is now required before this partner can post rescue bags.',
    );
  };

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="surface-card overflow-hidden p-6 md:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="max-w-[56rem]">
            <div className="editorial-eyebrow mb-3">Partner profile</div>
            <h1 className="font-['Fraunces',serif] text-[32px] leading-[1.08] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[38px]">
              Complete business verification before posting rescue bags.
            </h1>
            <p className="body-large mt-3 max-w-[62ch]">
              Your partner account has been created. Add your business verification details now so GIG can review the outlet before rescue bags go live.
            </p>
          </div>

          <div className="rounded-[28px] bg-[#1E2F24] p-5 text-white md:p-6">
            <div className="editorial-eyebrow !text-[#A8D8B7]">Verification status</div>
            <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/84">
              {getVerificationStatusLabel(profile.verificationStatus)}
            </div>
            <p className="mt-4 text-[14px] leading-7 text-white/76">
              {profile.verificationStatus === 'approved'
                ? 'Verification is approved in this demo, but posting stays blocked until billing setup is completed.'
                : profile.verificationStatus === 'submitted_for_review'
                  ? 'Your verification details have been submitted for review. Posting remains blocked until approval and billing setup are completed.'
                  : profile.verificationStatus === 'ready_for_review'
                    ? 'All required verification details are complete. Save and submit this profile for review before billing setup can begin.'
                    : 'Verification is required before your business can post rescue bags. You can still review the dashboard, listings, and reserved orders while approval is pending.'}
            </p>
          </div>
        </div>
      </section>

      {savedNotice ? (
        <div className="rounded-[22px] border border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.05)] px-5 py-4 text-[14px] leading-7 text-[#1E2F24]">
          {savedNotice}
        </div>
      ) : null}

      <SectionCard
        title="Verification checklist"
        description="Complete each section below to prepare your partner account for review."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {checklist.map((item) => (
            <div
              key={item.label}
              className={`rounded-[20px] px-4 py-4 ${
                item.done
                  ? 'bg-[rgba(11,122,77,0.08)] text-[#0b7a4d]'
                  : 'bg-[rgba(32,38,28,0.04)] text-[color:var(--gig-text)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold ${
                    item.done ? 'bg-[#0b7a4d] text-white' : 'bg-white text-[color:var(--gig-text-soft)]'
                  }`}
                >
                  {item.done ? '✓' : '•'}
                </span>
                <span className="text-[14px] font-semibold">{item.label}</span>
              </div>
              <p className="mt-2 text-[12px] uppercase tracking-[0.14em] opacity-72">
                {item.done ? 'Complete' : 'Incomplete'}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Verification flow"
        description="Move through the account details first, then complete the compliance and billing review step."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {steps.map((item, index) => {
            const active = step === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setStep(item.key)}
                className={`rounded-[22px] border px-4 py-4 text-left transition ${
                  active
                    ? 'border-[rgba(11,122,77,0.14)] bg-[rgba(11,122,77,0.06)]'
                    : 'border-[color:var(--gig-border)] bg-[rgba(255,255,255,0.72)] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold ${
                      active ? 'bg-[#0b7a4d] text-white' : 'bg-[rgba(32,38,28,0.06)] text-[color:var(--gig-text-soft)]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{item.label}</div>
                    <div className="metadata-caption mt-1">{item.caption}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 'business' ? (
          <>
            <SectionCard
              title="Business identity"
              description="These are the core details GIG will use when reviewing your business account."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="operational-label mb-2 block">Legal business name</span>
                  <input
                    value={profile.legalBusinessName}
                    onChange={(event) => updateField('legalBusinessName', event.target.value)}
                    placeholder="Registered business name"
                    className={inputClass}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="operational-label mb-2 block">Trading / outlet name</span>
                  <input
                    value={profile.tradingName}
                    onChange={(event) => updateField('tradingName', event.target.value)}
                    placeholder="Customer-facing outlet name"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Business type</span>
                  <select
                    value={profile.businessType}
                    onChange={(event) => updateField('businessType', event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select business type</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Cloud kitchen">Cloud kitchen</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Owner / authorized contact name</span>
                  <input
                    value={profile.ownerContactName}
                    onChange={(event) => updateField('ownerContactName', event.target.value)}
                    placeholder="Authorized contact"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Contact phone</span>
                  <input
                    value={profile.contactPhone}
                    onChange={(event) => updateField('contactPhone', event.target.value)}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Business email</span>
                  <input
                    type="email"
                    value={profile.businessEmail}
                    onChange={(event) => updateField('businessEmail', event.target.value)}
                    placeholder="business@example.com"
                    className={inputClass}
                  />
                </label>
              </div>
            </SectionCard>

            <SectionCard
              title="Pickup outlet address"
              description="Use the address where customers will actually collect rescue bags."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="operational-label mb-2 block">Address line 1</span>
                  <input
                    value={profile.addressLine1}
                    onChange={(event) => updateField('addressLine1', event.target.value)}
                    placeholder="Street address, shop name, building name"
                    className={inputClass}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="operational-label mb-2 block">
                    Address line 2
                    <span className="ml-2 text-[11px] font-medium normal-case tracking-normal text-[color:var(--gig-text-soft)]">
                      Optional
                    </span>
                  </span>
                  <input
                    value={profile.addressLine2}
                    onChange={(event) => updateField('addressLine2', event.target.value)}
                    placeholder="Floor, unit, suite, landmark"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">City</span>
                  <input
                    value={profile.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    placeholder="e.g., Bengaluru"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">State / Province / Region</span>
                  <input
                    value={profile.stateRegion}
                    onChange={(event) => updateField('stateRegion', event.target.value)}
                    placeholder="e.g., Karnataka"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">PIN / Postal code</span>
                  <input
                    value={profile.pinCode}
                    onChange={(event) => updateField('pinCode', event.target.value)}
                    placeholder="e.g., 560038"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Country</span>
                  <input
                    value={profile.country}
                    onChange={(event) => updateField('country', event.target.value)}
                    className={`${inputClass} bg-[rgba(32,38,28,0.03)]`}
                    readOnly
                  />
                </label>
              </div>
            </SectionCard>
          </>
        ) : (
          <>
            <SectionCard
              title="Food license and compliance"
              description="Add the licensing details GIG should review before your outlet can start posting rescue bags."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="operational-label mb-2 block">FSSAI license or registration number</span>
                  <input
                    value={profile.fssaiLicenseNumber}
                    onChange={(event) => updateField('fssaiLicenseNumber', event.target.value)}
                    placeholder="Enter FSSAI number"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">License type</span>
                  <select
                    value={profile.licenseType}
                    onChange={(event) => updateField('licenseType', event.target.value as PartnerLicenseType)}
                    className={inputClass}
                  >
                    {licenseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">License expiry date</span>
                  <input
                    type="date"
                    value={profile.licenseExpiryDate}
                    onChange={(event) => updateField('licenseExpiryDate', event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Registered business name on license</span>
                  <input
                    value={profile.registeredBusinessNameOnLicense}
                    onChange={(event) => updateField('registeredBusinessNameOnLicense', event.target.value)}
                    placeholder="Exact name shown on the license"
                    className={inputClass}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="operational-label mb-2 block">License document upload</span>
                  <div className="rounded-[18px] border border-[color:var(--gig-border)] bg-white px-4 py-4">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => updateField('licenseDocumentName', event.target.files?.[0]?.name ?? '')}
                      className="block w-full text-[14px] text-[color:var(--gig-text-muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(11,122,77,0.08)] file:px-4 file:py-2 file:text-[13px] file:font-semibold file:text-[#0b7a4d]"
                    />
                    <p className="mt-3 text-[13px] leading-6 text-[color:var(--gig-text-soft)]">
                      Frontend demo placeholder only. We store the selected filename locally for now.
                    </p>
                    {profile.licenseDocumentName ? (
                      <p className="mt-2 text-[14px] text-[color:var(--gig-text)]">Selected: {profile.licenseDocumentName}</p>
                    ) : null}
                  </div>
                </label>
              </div>

              <div className="mt-5 rounded-[20px] bg-[rgba(32,38,28,0.03)] px-4 py-4">
                <div className="operational-label mb-3">Optional tax details</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="operational-label mb-2 block">
                      GSTIN
                      <span className="ml-2 text-[11px] font-medium normal-case tracking-normal text-[color:var(--gig-text-soft)]">
                        Optional
                      </span>
                    </span>
                    <input
                      value={profile.gstin}
                      onChange={(event) => updateField('gstin', event.target.value)}
                      placeholder="Enter GSTIN if available"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="operational-label mb-2 block">
                      PAN
                      <span className="ml-2 text-[11px] font-medium normal-case tracking-normal text-[color:var(--gig-text-soft)]">
                        Optional
                      </span>
                    </span>
                    <input
                      value={profile.pan}
                      onChange={(event) => updateField('pan', event.target.value)}
                      placeholder="Enter PAN if available"
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Partner confirmations"
              description="Confirm the core safety, compliance, and pricing responsibilities before your account can be reviewed."
            >
              <div className="grid gap-3">
                {[
                  {
                    key: 'acknowledgedFoodSafety' as const,
                    label: 'I confirm that food listed on GIG will be safe, edible surplus, and fit for customer pickup.',
                  },
                  {
                    key: 'acknowledgedResponsibility' as const,
                    label: 'I confirm that my business is responsible for hygiene, packaging, allergen disclosure, and handover quality.',
                  },
                  {
                    key: 'acknowledgedLicensing' as const,
                    label: 'I confirm that my business has the required licenses and registrations and will provide them before activation.',
                  },
                  {
                    key: 'confirmsGigReviewRights' as const,
                    label: 'I understand that GIG may review, pause, or suspend listings for safety or policy concerns.',
                  },
                  {
                    key: 'acknowledgedPricing' as const,
                    label: `I understand that GIG charges a Rs. ${PARTNER_PLATFORM_FEE_INR}/month recurring platform fee and a ${Math.round(PARTNER_COMMISSION_RATE * 100)}% commission on sales made through the platform.`,
                  },
                ].map((item) => (
                  <label key={item.key} className="flex gap-3 rounded-[18px] border border-[color:var(--gig-border)] bg-white/70 px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={profile[item.key]}
                      onChange={(event) => updateField(item.key, event.target.checked)}
                      className={checkboxClass}
                    />
                    <span className="text-[14px] leading-[1.7] text-[color:var(--gig-text)]">{item.label}</span>
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Partner plan"
              description="Commercial terms are informational here for the frontend MVP. Billing starts only after partner approval and activation."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                  <p className="operational-label mb-1">Platform fee</p>
                  <p className="text-[16px] font-semibold text-[#1E1E1E]">Rs. {PARTNER_PLATFORM_FEE_INR}/month</p>
                </div>
                <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                  <p className="operational-label mb-1">Sales commission</p>
                  <p className="text-[16px] font-semibold text-[#1E1E1E]">{Math.round(PARTNER_COMMISSION_RATE * 100)}% of sales</p>
                </div>
                <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                  <p className="operational-label mb-1">Billing status</p>
                  <p className="text-[16px] font-semibold text-[#1E1E1E]">
                    {profile.billingStatus === 'active'
                      ? 'Active'
                      : profile.billingStatus === 'billing_setup_required'
                        ? 'Billing setup required'
                        : 'Not activated / pending verification'}
                  </p>
                </div>
                <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                  <p className="operational-label mb-1">Pricing terms</p>
                  <p className="text-[16px] font-semibold text-[#1E1E1E]">
                    {profile.acknowledgedPricing ? 'Acknowledged' : 'Pending acknowledgement'}
                  </p>
                  <p className="metadata-caption mt-1">
                    Billing is informational here only. No payment is collected on this page.
                  </p>
                </div>
              </div>
            </SectionCard>
          </>
        )}

        <div className="flex flex-col gap-3 rounded-[24px] border border-[color:var(--gig-border)] bg-[rgba(255,255,255,0.7)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-semibold text-[color:var(--gig-text)]">
              {step === 'business'
                ? 'Continue to verification details'
                : profile.verificationStatus === 'approved'
                  ? 'Verification approved in demo mode'
                  : 'Save verification details'}
            </p>
            <p className="mt-1 text-[14px] leading-7 text-[color:var(--gig-text-muted)]">
              {step === 'business'
                ? 'Your typed values stay in place as you move between steps.'
                : profile.verificationStatus === 'approved'
                  ? 'Billing setup is the next required step before this partner can post rescue bags.'
                  : profile.verificationStatus === 'submitted_for_review'
                    ? 'This profile has been submitted for review. You can use the demo approval action to unlock billing setup.'
                    : profile.verificationStatus === 'ready_for_review'
                      ? 'Saving keeps every field locally and marks the profile ready for approval once every required section is complete.'
                      : 'Saving keeps every field locally and updates the profile status once the required verification details are complete.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {step === 'verification' ? (
              <button
                type="button"
                onClick={() => setStep('business')}
                className="btn-secondary justify-center whitespace-nowrap"
              >
                Back to business details
              </button>
            ) : null}

            {step === 'business' ? (
              <button
                type="button"
                onClick={() => setStep('verification')}
                className="btn-primary justify-center whitespace-nowrap"
              >
                Continue
              </button>
            ) : (
              <>
                <button type="submit" className="btn-primary justify-center whitespace-nowrap">
                  Save verification details
                </button>
                {profile.verificationStatus === 'ready_for_review' ? (
                  <button
                    type="button"
                    onClick={handleSubmitForReview}
                    className="btn-secondary justify-center whitespace-nowrap"
                  >
                    Submit for review
                  </button>
                ) : null}
                {profile.verificationStatus === 'submitted_for_review' ? (
                  <button
                    type="button"
                    onClick={handleMockApprove}
                    className="btn-secondary justify-center whitespace-nowrap"
                  >
                    Mock approve verification
                  </button>
                ) : null}
                {profile.verificationStatus === 'approved' && profile.billingStatus === 'billing_setup_required' ? (
                  <Link to="/partner/billing" className="btn-secondary justify-center whitespace-nowrap">
                    Complete billing setup
                  </Link>
                ) : null}
                {profile.verificationStatus === 'approved' && profile.billingStatus === 'active' ? (
                  <Link to={createBagRoute} className="btn-secondary justify-center whitespace-nowrap">
                    Create rescue bag
                  </Link>
                ) : null}
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
