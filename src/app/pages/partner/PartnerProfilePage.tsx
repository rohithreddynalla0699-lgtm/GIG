import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
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
  'w-full rounded-[16px] border border-[color:var(--gig-border)] bg-white px-4 py-3 text-[14px] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]';

const checkboxClass =
  'mt-0.5 h-4 w-4 rounded border-[color:var(--gig-border)] text-[color:var(--gig-green-deep)] focus:ring-[rgba(11,122,77,0.16)]';

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
    fssai:
      isFilled(profile.fssaiLicenseNumber) &&
      isFilled(profile.licenseType) &&
      isFilled(profile.licenseExpiryDate) &&
      isFilled(profile.registeredBusinessNameOnLicense) &&
      isFilled(profile.licenseDocumentName),
    pan:
      isFilled(profile.panNumber) &&
      isFilled(profile.panHolderName),
    bankAccount:
      isFilled(profile.bankAccountHolderName) &&
      isFilled(profile.bankAccountNumber) &&
      isFilled(profile.bankIfsc) &&
      isFilled(profile.bankName) &&
      isFilled(profile.bankProofDocumentName) &&
      profile.bankLinked,
    complianceDeclarations:
      profile.authorizedRepresentativeConfirmed &&
      profile.confirmsEdibleSurplusFood &&
      profile.confirmsNoExtraProduction &&
      profile.confirmsAllergenResponsibility &&
      profile.confirmsPackagingResponsibility &&
      profile.confirmsStorageResponsibility &&
      profile.confirmsLocalLawCompliance &&
      profile.acknowledgedFoodSafety &&
      profile.acknowledgedResponsibility &&
      profile.acknowledgedLicensing &&
      profile.confirmsGigReviewRights &&
      profile.acknowledgedPricing,
    billingAcknowledgement: profile.acknowledgedPricing,
  };
}

function getVerificationStatusLabel(status: PartnerVerificationStatus) {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'ready_for_review':
      return 'Ready for review';
    case 'submitted_for_review':
      return 'Submitted';
    default:
      return 'In progress';
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

function CompactPanel({
  title,
  description,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4 ${className}`}>
      <div className="mb-3">
        <h2 className="text-[16px] font-semibold text-[#1E1E1E]">{title}</h2>
        {description ? <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ChecklistChip({ label, done }: { label: string; done: boolean }) {
  return (
    <div className={`rounded-[16px] border px-3 py-2.5 ${done ? 'border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.06)]' : 'border-[rgba(32,38,28,0.08)] bg-white/78'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-[#1E1E1E]">{label}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${done ? 'bg-[#0b7a4d] text-white' : 'bg-[rgba(32,38,28,0.05)] text-[color:var(--gig-text-soft)]'}`}>
          {done ? 'Done' : 'Pending'}
        </span>
      </div>
    </div>
  );
}

export default function PartnerProfilePage() {
  const [profile, setProfile] = useState(() => getMockPartnerProfile());
  const [savedNotice, setSavedNotice] = useState('');
  const [storeImageError, setStoreImageError] = useState('');
  const [step, setStep] = useState<ProfileStep>('business');

  const updateField = <K extends keyof typeof profile>(field: K, value: (typeof profile)[K]) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSavedNotice('');
  };

  const handleStoreImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setStoreImageError('Please choose an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('storeImageUrl', reader.result);
        setStoreImageError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveStoreImage = () => {
    updateField('storeImageUrl', '');
    setStoreImageError('');
  };

  const completion = useMemo(() => getProfileCompletion(profile), [profile]);
  const allComplete = useMemo(() => Object.values(completion).every(Boolean), [completion]);

  const checklist = [
    { label: 'Business', done: completion.businessIdentity },
    { label: 'Address', done: completion.pickupAddress },
    { label: 'Food license', done: completion.fssai },
    { label: 'PAN', done: completion.pan },
    { label: 'Bank', done: completion.bankAccount },
    { label: 'Safety', done: completion.complianceDeclarations },
    { label: 'Billing', done: completion.billingAcknowledgement },
  ];

  const buildSavedProfile = (nextVerificationStatus: PartnerVerificationStatus) => ({
    ...profile,
    verificationStatus: nextVerificationStatus,
    billingStatus:
      nextVerificationStatus === 'approved' ? 'billing_setup_required' : profile.billingStatus,
    confirmsSafeSurplusFood: profile.acknowledgedFoodSafety,
    pan: profile.panNumber.trim(),
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
        ? 'Saved. Your profile is ready for review.'
        : 'Saved. Complete all required fields to move this profile to review.',
    );
  };

  const handleSubmitForReview = () => {
    if (!allComplete) {
      setSavedNotice('Complete all required fields before you submit for review.');
      return;
    }

    const nextProfile = buildSavedProfile('submitted_for_review');
    persistProfile(nextProfile, 'Submitted for review. Use the demo approval button below to continue.');
  };

  const handleMockApprove = () => {
    const nextProfile = buildSavedProfile('approved');
    persistProfile(nextProfile, 'Approved for demo. Billing is the next step.');
  };

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-3 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="editorial-eyebrow mb-2">Profile</div>
            <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
              Profile setup
            </h1>
            <p className="mt-1 text-[13px] text-[color:var(--gig-text-muted)]">
              Complete your business details and verification to move to review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-[rgba(32,38,28,0.08)] bg-white/78 px-3 py-2 text-[12px] font-medium text-[#4D5E53]">
              {getVerificationStatusLabel(profile.verificationStatus)}
            </div>
            {profile.verificationStatus === 'approved' && profile.billingStatus === 'billing_setup_required' ? (
              <Link to="/partner/billing" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]">
                Go to billing
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {savedNotice ? (
        <div className="rounded-[18px] border border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.05)] px-4 py-3 text-[13px] leading-6 text-[#1E2F24]">
          {savedNotice}
        </div>
      ) : null}

      <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Checklist</h2>
            <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Complete each section.</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {checklist.map((item) => (
            <ChecklistChip key={item.label} label={item.label} done={item.done} />
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-2">
          <div className="grid gap-2 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setStep('business')}
              className={`rounded-[16px] px-4 py-3 text-left transition ${
                step === 'business'
                  ? 'bg-[#1E2F24] text-white'
                  : 'bg-white/70 text-[#4D5E53] hover:bg-white'
              }`}
            >
              <div className="text-[14px] font-semibold">Business</div>
              <div className={`mt-0.5 text-[12px] ${step === 'business' ? 'text-white/72' : 'text-[color:var(--gig-text-muted)]'}`}>
                Business and address
              </div>
            </button>
            <button
              type="button"
              onClick={() => setStep('verification')}
              className={`rounded-[16px] px-4 py-3 text-left transition ${
                step === 'verification'
                  ? 'bg-[#1E2F24] text-white'
                  : 'bg-white/70 text-[#4D5E53] hover:bg-white'
              }`}
            >
              <div className="text-[14px] font-semibold">Verification</div>
              <div className={`mt-0.5 text-[12px] ${step === 'verification' ? 'text-white/72' : 'text-[color:var(--gig-text-muted)]'}`}>
                Food license, PAN, bank, and safety
              </div>
            </button>
          </div>
        </section>

        {step === 'business' ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <CompactPanel title="Business details" description="Add your business details.">
              <div className="grid gap-3 md:grid-cols-2">
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
                  <span className="operational-label mb-2 block">Outlet name</span>
                  <input
                    value={profile.tradingName}
                    onChange={(event) => updateField('tradingName', event.target.value)}
                    placeholder="Customer-facing outlet name"
                    className={inputClass}
                  />
                </label>
                <div className="md:col-span-2 rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-[rgba(250,245,236,0.78)] p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#1E1E1E]">Store image</h3>
                      <p className="mt-0.5 text-[12px] leading-5 text-[color:var(--gig-text-muted)]">
                        Add one photo customers will see for this store.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex min-h-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] bg-white px-4 py-2 text-[12px] font-semibold text-[#1E2F24] transition hover:bg-[rgba(255,255,255,0.92)]">
                        {profile.storeImageUrl ? 'Change image' : 'Upload image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleStoreImageChange}
                          className="sr-only"
                        />
                      </label>
                      {profile.storeImageUrl ? (
                        <button
                          type="button"
                          onClick={handleRemoveStoreImage}
                          className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[12px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {storeImageError ? (
                    <div className="mt-3 rounded-[14px] border border-[rgba(166,94,94,0.18)] bg-[rgba(166,94,94,0.08)] px-3 py-2 text-[12px] text-[#7f4444]">
                      {storeImageError}
                    </div>
                  ) : null}

                  {profile.storeImageUrl ? (
                    <div className="mt-4 overflow-hidden rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white">
                      <img
                        src={profile.storeImageUrl}
                        alt={profile.tradingName || profile.legalBusinessName || 'Store preview'}
                        className="h-[200px] w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[18px] border border-dashed border-[rgba(32,38,28,0.12)] bg-white/72 px-4 py-6 text-center">
                      <div className="text-[13px] font-medium text-[#1E1E1E]">No store image yet.</div>
                      <div className="mt-1 text-[12px] leading-5 text-[color:var(--gig-text-muted)]">
                        Upload one photo to use later on customer-facing store cards.
                      </div>
                    </div>
                  )}
                </div>
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
                  <span className="operational-label mb-2 block">Contact name</span>
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
            </CompactPanel>

            <CompactPanel title="Pickup address" description="Add your pickup address.">
              <div className="grid gap-3 md:grid-cols-2">
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
                  <span className="operational-label mb-2 block">State</span>
                  <input
                    value={profile.stateRegion}
                    onChange={(event) => updateField('stateRegion', event.target.value)}
                    placeholder="e.g., Karnataka"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">PIN code</span>
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
            </CompactPanel>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <CompactPanel title="Food license" description="Add your FSSAI details.">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="operational-label mb-2 block">FSSAI number</span>
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
                    <span className="operational-label mb-2 block">Expiry date</span>
                    <input
                      type="date"
                      value={profile.licenseExpiryDate}
                      onChange={(event) => updateField('licenseExpiryDate', event.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="operational-label mb-2 block">Registered business name</span>
                    <input
                      value={profile.registeredBusinessNameOnLicense}
                      onChange={(event) => updateField('registeredBusinessNameOnLicense', event.target.value)}
                      placeholder="Name on the license"
                      className={inputClass}
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="operational-label mb-2 block">License document</span>
                    <div className="rounded-[16px] border border-[color:var(--gig-border)] bg-white px-4 py-3">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(event) => updateField('licenseDocumentName', event.target.files?.[0]?.name ?? '')}
                        className="block w-full text-[13px] text-[color:var(--gig-text-muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(11,122,77,0.08)] file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-[#0b7a4d]"
                      />
                      {profile.licenseDocumentName ? (
                        <p className="mt-2 text-[13px] text-[color:var(--gig-text)]">Selected: {profile.licenseDocumentName}</p>
                      ) : (
                        <p className="mt-2 text-[12px] text-[color:var(--gig-text-soft)]">Demo file only.</p>
                      )}
                    </div>
                  </label>
                </div>
              </CompactPanel>

              <CompactPanel title="PAN" description="Add PAN details.">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="operational-label mb-2 block">PAN number</span>
                    <input
                      value={profile.panNumber}
                      onChange={(event) => {
                        updateField('panNumber', event.target.value.toUpperCase());
                        updateField('pan', event.target.value.toUpperCase());
                      }}
                      placeholder="ABCDE1234F"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="operational-label mb-2 block">PAN holder name</span>
                    <input
                      value={profile.panHolderName}
                      onChange={(event) => updateField('panHolderName', event.target.value)}
                      placeholder="Exact name on PAN"
                      className={inputClass}
                    />
                  </label>
                  <label className="block md:col-span-2">
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
                </div>
              </CompactPanel>
            </div>

            <CompactPanel title="Bank" description="Add bank details.">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="operational-label mb-2 block">Account holder name</span>
                  <input
                    value={profile.bankAccountHolderName}
                    onChange={(event) => updateField('bankAccountHolderName', event.target.value)}
                    placeholder="Name on bank account"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Account number</span>
                  <input
                    value={profile.bankAccountNumber}
                    onChange={(event) => updateField('bankAccountNumber', event.target.value)}
                    placeholder="Enter account number"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">IFSC</span>
                  <input
                    value={profile.bankIfsc}
                    onChange={(event) => updateField('bankIfsc', event.target.value.toUpperCase())}
                    placeholder="HDFC0001234"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="operational-label mb-2 block">Bank name</span>
                  <input
                    value={profile.bankName}
                    onChange={(event) => updateField('bankName', event.target.value)}
                    placeholder="Enter bank name"
                    className={inputClass}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="operational-label mb-2 block">Cancelled cheque / passbook</span>
                  <div className="rounded-[16px] border border-[color:var(--gig-border)] bg-white px-4 py-3">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => updateField('bankProofDocumentName', event.target.files?.[0]?.name ?? '')}
                      className="block w-full text-[13px] text-[color:var(--gig-text-muted)] file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(11,122,77,0.08)] file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-[#0b7a4d]"
                    />
                    {profile.bankProofDocumentName ? (
                      <p className="mt-2 text-[13px] text-[color:var(--gig-text)]">Selected: {profile.bankProofDocumentName}</p>
                    ) : (
                      <p className="mt-2 text-[12px] text-[color:var(--gig-text-soft)]">Demo file only.</p>
                    )}
                  </div>
                </label>
                <label className="flex gap-3 rounded-[16px] border border-[color:var(--gig-border)] bg-white/70 px-4 py-3 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={profile.bankLinked}
                    onChange={(event) => updateField('bankLinked', event.target.checked)}
                    className={checkboxClass}
                  />
                  <span className="text-[13px] leading-6 text-[color:var(--gig-text)]">
                    Bank linked for demo.
                  </span>
                </label>
              </div>
            </CompactPanel>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <CompactPanel title="Safety" description="Confirm these items.">
                <div className="grid gap-2 md:grid-cols-2">
                  {[
                    {
                      key: 'authorizedRepresentativeConfirmed' as const,
                      label: 'I can manage this business account.',
                    },
                    {
                      key: 'acknowledgedFoodSafety' as const,
                      label: 'Food is safe and edible.',
                    },
                    {
                      key: 'confirmsEdibleSurplusFood' as const,
                      label: 'Food is real surplus, not made only for GIG.',
                    },
                    {
                      key: 'confirmsNoExtraProduction' as const,
                      label: 'No extra food is made only for GIG.',
                    },
                    {
                      key: 'acknowledgedResponsibility' as const,
                      label: 'I will hand over food safely.',
                    },
                    {
                      key: 'confirmsAllergenResponsibility' as const,
                      label: 'I will share allergen details correctly.',
                    },
                    {
                      key: 'confirmsPackagingResponsibility' as const,
                      label: 'I will pack and store food safely.',
                    },
                    {
                      key: 'confirmsStorageResponsibility' as const,
                      label: 'I will keep food stored safely.',
                    },
                    {
                      key: 'confirmsLocalLawCompliance' as const,
                      label: 'I will follow local food rules.',
                    },
                    {
                      key: 'acknowledgedLicensing' as const,
                      label: 'I will provide the required licenses.',
                    },
                    {
                      key: 'confirmsGigReviewRights' as const,
                      label: 'I understand GIG may review my account.',
                    },
                    {
                      key: 'acknowledgedPricing' as const,
                      label: `I understand GIG charges ₹${PARTNER_PLATFORM_FEE_INR}/month and ${Math.round(PARTNER_COMMISSION_RATE * 100)}% commission.`,
                    },
                  ].map((item) => (
                    <label key={item.key} className="flex gap-3 rounded-[16px] border border-[color:var(--gig-border)] bg-white/70 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={profile[item.key]}
                        onChange={(event) => updateField(item.key, event.target.checked)}
                        className={checkboxClass}
                      />
                      <span className="text-[13px] leading-6 text-[color:var(--gig-text)]">{item.label}</span>
                    </label>
                  ))}
                </div>
              </CompactPanel>

              <CompactPanel title="Billing" description="Demo only. No payment is collected.">
                <div className="space-y-2.5">
                  <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                    <div className="meta-text mb-1">Monthly fee</div>
                    <div className="text-[14px] font-semibold text-[#1E1E1E]">Rs. {PARTNER_PLATFORM_FEE_INR}/month</div>
                  </div>
                  <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                    <div className="meta-text mb-1">Sales commission</div>
                    <div className="text-[14px] font-semibold text-[#1E1E1E]">{Math.round(PARTNER_COMMISSION_RATE * 100)}% of sales</div>
                  </div>
                  <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                    <div className="meta-text mb-1">Billing status</div>
                    <div className="text-[14px] font-semibold text-[#1E1E1E]">
                      {profile.billingStatus === 'active'
                        ? 'Active'
                        : profile.billingStatus === 'billing_setup_required'
                          ? 'Ready to activate'
                          : 'Not active yet'}
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
                    <div className="meta-text mb-1">Billing</div>
                    <div className="text-[14px] font-semibold text-[#1E1E1E]">
                      {profile.acknowledgedPricing ? 'Done' : 'Pending'}
                    </div>
                  </div>
                </div>
              </CompactPanel>
            </div>
          </div>
        )}

        <section className="sticky bottom-3 z-10 rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.94)] p-4 shadow-[0_10px_30px_rgba(31,34,29,0.08)] backdrop-blur-[10px]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[14px] font-semibold text-[color:var(--gig-text)]">
                {step === 'business'
                  ? 'Business step'
                  : profile.verificationStatus === 'approved'
                    ? 'Approved for demo'
                    : 'Verification step'}
              </p>
              <p className="mt-1 text-[12px] text-[color:var(--gig-text-muted)]">
                {step === 'business'
                  ? 'Your details stay saved.'
                  : profile.verificationStatus === 'approved'
                    ? 'Go to billing next.'
                    : profile.verificationStatus === 'submitted_for_review'
                      ? 'Your profile is under review.'
                      : profile.verificationStatus === 'ready_for_review'
                        ? 'Save, then submit for review.'
                        : 'Save to keep your changes.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {step === 'verification' ? (
                <button
                  type="button"
                  onClick={() => setStep('business')}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[13px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]"
                >
                  Back
                </button>
              ) : null}

              {step === 'business' ? (
                <button
                  type="button"
                  onClick={() => setStep('verification')}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]"
                >
                  Continue
                </button>
              ) : (
                <>
                  <button type="submit" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]">
                    Save
                  </button>
                  {profile.verificationStatus === 'ready_for_review' ? (
                    <button
                      type="button"
                      onClick={handleSubmitForReview}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[13px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]"
                    >
                      Submit for review
                    </button>
                  ) : null}
                  {profile.verificationStatus === 'submitted_for_review' ? (
                    <button
                      type="button"
                      onClick={handleMockApprove}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[13px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]"
                    >
                      Approve for demo
                    </button>
                  ) : null}
                  {profile.verificationStatus === 'approved' && profile.billingStatus === 'billing_setup_required' ? (
                    <Link to="/partner/billing" className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[13px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]">
                      Go to billing
                    </Link>
                  ) : null}
                  {profile.verificationStatus === 'approved' && profile.billingStatus === 'active' ? (
                    <Link to="/partner/listings" className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[13px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]">
                      Go to Rescue Bags
                    </Link>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
