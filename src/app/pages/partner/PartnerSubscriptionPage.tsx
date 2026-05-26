import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  getMockPartnerProfile,
  PARTNER_COMMISSION_RATE,
  PARTNER_PLATFORM_FEE_INR,
  saveMockPartnerProfile,
} from '../../data/mock/partners';

const checkboxClass =
  'mt-0.5 h-4 w-4 rounded border-[color:var(--gig-border)] text-[color:var(--gig-green-deep)] focus:ring-[rgba(11,122,77,0.16)]';

const paymentOptions = [
  {
    label: 'UPI AutoPay',
    note: 'Demo option',
  },
  {
    label: 'Card mandate',
    note: 'Demo option',
  },
  {
    label: 'eMandate',
    note: 'Demo option',
  },
];

function CompactStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">{label}</div>
      <div className="mt-1 text-[16px] font-semibold text-[#1E1E1E]">{value}</div>
    </div>
  );
}

function MethodRow({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3">
      <div className="text-[14px] font-semibold text-[#1E1E1E]">{label}</div>
      <div className="text-[12px] text-[color:var(--gig-text-muted)]">{note}</div>
    </div>
  );
}

export default function PartnerSubscriptionPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getMockPartnerProfile());
  const [authorizedRecurringFee, setAuthorizedRecurringFee] = useState(profile.billingStatus === 'active');
  const [notice, setNotice] = useState('');

  const verificationApproved = profile.verificationStatus === 'approved';
  const billingActive = profile.billingStatus === 'active';
  const statusLabel = billingActive ? 'Active' : verificationApproved ? 'Ready' : 'Locked';

  const handleActivate = () => {
    if (!authorizedRecurringFee) {
      setNotice('Please confirm the billing fee first.');
      return;
    }

    const nextProfile = {
      ...profile,
      billingStatus: 'active' as const,
    };

    saveMockPartnerProfile(nextProfile);
    setProfile(nextProfile);
    setNotice('Demo billing is active. You can now use Rescue bags.');
  };

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-4 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="editorial-eyebrow mb-2">Billing</div>
            <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
              {billingActive ? 'Billing active' : 'Activate billing'}
            </h1>
            <p className="mt-1 text-[13px] text-[color:var(--gig-text-muted)]">Demo only. No payment is collected.</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/78 px-3 py-2 text-[12px] font-medium text-[#4D5E53]">
            <span className={`h-2 w-2 rounded-full ${billingActive ? 'bg-[#0b7a4d]' : verificationApproved ? 'bg-[#d6a06a]' : 'bg-[#B7BBB5]'}`}></span>
            {statusLabel}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <CompactStat label="Monthly fee" value={`₹${PARTNER_PLATFORM_FEE_INR}/month`} />
          <CompactStat label="Commission" value={`${Math.round(PARTNER_COMMISSION_RATE * 100)}%`} />
          <CompactStat label="Status" value={statusLabel} />
        </div>
      </section>

      {notice ? (
        <div className="rounded-[18px] border border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.05)] px-4 py-3 text-[13px] leading-6 text-[#1E2F24]">
          {notice}
        </div>
      ) : null}

      {!verificationApproved ? (
        <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Finish setup</h2>
              <p className="mt-0.5 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">
                Complete your profile, food license, bank details, and billing to start selling rescue bags.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/78 px-3 py-2 text-[12px] font-medium text-[#4D5E53]">
              <span className="h-2 w-2 rounded-full bg-[#d6a06a]"></span>
              Locked until setup is complete
            </div>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link to="/partner/profile" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]">
              Continue setup
            </Link>
            <Link to="/partner" className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[13px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]">
              Back to dashboard
            </Link>
          </div>
        </section>
      ) : billingActive ? (
        <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(11,122,77,0.12)] bg-[rgba(11,122,77,0.06)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0b7a4d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0b7a4d]"></span>
                Active
              </div>
              <p className="mt-3 text-[13px] text-[color:var(--gig-text-muted)]">Demo only. No payment is collected.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <CompactStat label="Monthly fee" value={`₹${PARTNER_PLATFORM_FEE_INR}/month`} />
              <CompactStat label="Commission" value={`${Math.round(PARTNER_COMMISSION_RATE * 100)}%`} />
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link to="/partner/listings" className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]">
              Go to Rescue Bags
            </Link>
            <button
              type="button"
              onClick={() => navigate('/partner')}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[rgba(32,38,28,0.08)] px-4 py-2 text-[13px] font-semibold text-[#4D5E53] transition hover:bg-white hover:text-[#1f221d]"
            >
              Go to dashboard
            </button>
          </div>
        </section>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
          <section className="space-y-4 rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Billing method</h2>
              <p className="mt-0.5 text-[12px] text-[color:var(--gig-text-muted)]">Choose a demo option.</p>
            </div>

            <div className="space-y-2.5">
              {paymentOptions.map((option) => (
                <MethodRow key={option.label} label={option.label} note={option.note} />
              ))}
            </div>

            <label className="flex gap-3 rounded-[16px] border border-[color:var(--gig-border)] bg-white/78 px-4 py-3">
              <input
                type="checkbox"
                checked={authorizedRecurringFee}
                onChange={(event) => {
                  setAuthorizedRecurringFee(event.target.checked);
                  setNotice('');
                }}
                className={checkboxClass}
              />
              <span className="text-[13px] leading-6 text-[color:var(--gig-text)]">
                I understand GIG charges ₹{PARTNER_PLATFORM_FEE_INR}/month and {Math.round(PARTNER_COMMISSION_RATE * 100)}% commission.
              </span>
            </label>
          </section>

          <aside className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="mb-3">
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Summary</h2>
            </div>
            <div className="space-y-2.5">
              <CompactStat label="Monthly fee" value={`₹${PARTNER_PLATFORM_FEE_INR}/month`} />
              <CompactStat label="Commission" value={`${Math.round(PARTNER_COMMISSION_RATE * 100)}%`} />
              <CompactStat label="Status" value="Ready" />
            </div>

            <button
              type="button"
              onClick={handleActivate}
              className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]"
            >
              Activate demo billing
            </button>

            <p className="mt-2 text-[12px] leading-6 text-[color:var(--gig-text-muted)]">No payment is collected.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
