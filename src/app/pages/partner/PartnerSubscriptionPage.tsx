import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import SectionCard from '../../components/shared/SectionCard';
import {
  getMockPartnerProfile,
  PARTNER_COMMISSION_RATE,
  PARTNER_PLATFORM_FEE_INR,
  saveMockPartnerProfile,
} from '../../data/mock/partners';

const checkboxClass =
  'mt-1 h-4 w-4 rounded border-[color:var(--gig-border)] text-[color:var(--gig-green-deep)] focus:ring-[rgba(11,122,77,0.16)]';

const paymentOptions = [
  {
    label: 'UPI AutoPay',
    note: 'India-first recurring setup for future activation.',
  },
  {
    label: 'Card mandate',
    note: 'Stored as a display-only option in this frontend demo.',
  },
  {
    label: 'eMandate',
    note: 'Fallback recurring option for later billing integration.',
  },
];

export default function PartnerSubscriptionPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getMockPartnerProfile());
  const [authorizedRecurringFee, setAuthorizedRecurringFee] = useState(profile.billingStatus === 'active');
  const [notice, setNotice] = useState('');

  const verificationApproved = profile.verificationStatus === 'approved';
  const billingActive = profile.billingStatus === 'active';

  const handleActivate = () => {
    if (!authorizedRecurringFee) {
      setNotice('Authorize the recurring platform fee before mock billing can be activated.');
      return;
    }

    const nextProfile = {
      ...profile,
      billingStatus: 'active' as const,
    };

    saveMockPartnerProfile(nextProfile);
    setProfile(nextProfile);
    setNotice('Mock billing activated. This partner can now create rescue bags in the frontend demo.');
  };

  return (
    <div className="space-y-7 md:space-y-8">
      <section className="surface-card overflow-hidden p-6 md:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="max-w-[58rem]">
            <div className="editorial-eyebrow mb-3">Billing setup</div>
            <h1 className="font-['Fraunces',serif] text-[32px] leading-[1.08] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[38px]">
              Complete the final activation step after verification approval.
            </h1>
            <p className="body-large mt-3 max-w-[62ch]">
              This frontend-only billing screen is the last gate before rescue bag posting unlocks. Razorpay subscription and autopay setup will be added later.
            </p>
          </div>

          <div className="rounded-[28px] bg-[#1E2F24] p-5 text-white md:p-6">
            <div className="editorial-eyebrow !text-[#A8D8B7]">Activation status</div>
            <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/84">
              {billingActive
                ? 'Billing active'
                : verificationApproved
                  ? 'Billing setup required'
                  : 'Verification required'}
            </div>
            <p className="mt-4 text-[14px] leading-7 text-white/76">
              {billingActive
                ? 'Billing is active in this demo, so create-bag access is now unlocked.'
                : verificationApproved
                  ? 'Your business is approved. Activate mock billing to unlock rescue bag posting.'
                  : 'Finish partner verification first. Billing setup becomes available only after verification approval.'}
            </p>
          </div>
        </div>
      </section>

      {notice ? (
        <div className="rounded-[22px] border border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.05)] px-5 py-4 text-[14px] leading-7 text-[#1E2F24]">
          {notice}
        </div>
      ) : null}

      {!verificationApproved ? (
        <SectionCard
          title="Verification required first"
          description="Billing activation stays locked until your business verification is approved."
        >
          <div className="space-y-4">
            <p className="body-regular max-w-[64ch]">
              Complete your business identity, outlet address, license details, and partner confirmations in Partner Profile before returning here.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/partner/profile" className="btn-primary justify-center whitespace-nowrap">
                Return to Partner Profile
              </Link>
              <Link to="/partner" className="btn-secondary justify-center whitespace-nowrap">
                Back to dashboard
              </Link>
            </div>
          </div>
        </SectionCard>
      ) : billingActive ? (
        <SectionCard
          title="Billing activated"
          description="The mock recurring billing step is complete, and posting is now available through the existing partner gating helpers."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
              <p className="operational-label mb-1">Recurring platform fee</p>
              <p className="text-[16px] font-semibold text-[#1E1E1E]">Rs. {PARTNER_PLATFORM_FEE_INR}/month</p>
            </div>
            <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
              <p className="operational-label mb-1">Commission</p>
              <p className="text-[16px] font-semibold text-[#1E1E1E]">{Math.round(PARTNER_COMMISSION_RATE * 100)}% of completed sales</p>
            </div>
          </div>

          <p className="mt-5 text-[14px] leading-7 text-[color:var(--gig-text-muted)]">
            No real payment was collected. This activation is saved only in local demo state, and Razorpay-based recurring billing will be added later.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/partner')}
              className="btn-primary justify-center whitespace-nowrap"
            >
              Go to dashboard
            </button>
            <Link to="/partner/listings/new" className="btn-secondary justify-center whitespace-nowrap">
              Create rescue bag
            </Link>
          </div>
        </SectionCard>
      ) : (
        <>
          <SectionCard
            title="Partner starter"
            description="A clear view of the commercial terms before mock billing activation."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                <p className="operational-label mb-1">Platform fee</p>
                <p className="text-[16px] font-semibold text-[#1E1E1E]">Rs. {PARTNER_PLATFORM_FEE_INR}/month</p>
              </div>
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                <p className="operational-label mb-1">Commission</p>
                <p className="text-[16px] font-semibold text-[#1E1E1E]">{Math.round(PARTNER_COMMISSION_RATE * 100)}% of completed sales</p>
              </div>
              <div className="rounded-[20px] bg-[rgba(255,255,255,0.72)] px-4 py-4">
                <p className="operational-label mb-1">Current billing state</p>
                <p className="text-[16px] font-semibold text-[#1E1E1E]">Billing setup required</p>
              </div>
            </div>

            <p className="mt-5 text-[14px] leading-7 text-[color:var(--gig-text-muted)]">
              Commission is accounted for later through orders and settlements. This page only mocks the recurring platform-fee activation step.
            </p>
          </SectionCard>

          <SectionCard
            title="Billing method"
            description="These are display-only recurring options for the frontend demo. No live mandate or payment collection happens here."
          >
            <div className="grid gap-3 md:grid-cols-3">
              {paymentOptions.map((option) => (
                <div key={option.label} className="rounded-[20px] border border-[color:var(--gig-border)] bg-white/70 px-4 py-4">
                  <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{option.label}</div>
                  <p className="mt-2 text-[13px] leading-6 text-[color:var(--gig-text-soft)]">{option.note}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[14px] leading-7 text-[color:var(--gig-text-muted)]">
              No real payment is collected in this frontend demo. Razorpay subscriptions, UPI AutoPay, and mandate handling will be added later.
            </p>
          </SectionCard>

          <SectionCard
            title="Authorize recurring fee"
            description="This confirmation is required before the mock activation can unlock rescue bag posting."
          >
            <label className="flex gap-3 rounded-[18px] border border-[color:var(--gig-border)] bg-white/70 px-4 py-4">
              <input
                type="checkbox"
                checked={authorizedRecurringFee}
                onChange={(event) => {
                  setAuthorizedRecurringFee(event.target.checked);
                  setNotice('');
                }}
                className={checkboxClass}
              />
              <span className="text-[14px] leading-[1.7] text-[color:var(--gig-text)]">
                I authorize the Rs. {PARTNER_PLATFORM_FEE_INR}/month recurring platform fee after activation.
              </span>
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleActivate}
                className="btn-primary justify-center whitespace-nowrap"
              >
                Activate mock billing
              </button>
              <Link to="/partner" className="btn-secondary justify-center whitespace-nowrap">
                Back to dashboard
              </Link>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
