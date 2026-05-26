import { Link } from 'react-router';
import ListingForm from '../../components/partner/ListingForm';
import { getMockPartnerActivationState, isMockPartnerVerified } from '../../data/mock/partners';

function HelpItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-[rgba(32,38,28,0.08)] bg-white/78 px-4 py-3 text-[13px] leading-6 text-[color:var(--gig-text)]">
      {children}
    </div>
  );
}

export default function PartnerNewListingPage() {
  const canPostBags = isMockPartnerVerified();
  const activationState = getMockPartnerActivationState();

  if (!canPostBags) {
    return (
      <div className="space-y-4">
        <section className="flex flex-col gap-3 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="editorial-eyebrow mb-2">Rescue bags</div>
              <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
                Finish setup
              </h1>
              <p className="mt-1 max-w-[58ch] text-[13px] leading-6 text-[color:var(--gig-text-muted)]">
                Complete your profile, food license, bank details, and billing to start selling rescue bags.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(32,38,28,0.08)] bg-white/78 px-3 py-2 text-[12px] font-medium text-[#4D5E53]">
                <span className="h-2 w-2 rounded-full bg-[#d6a06a]"></span>
                Locked until setup is complete
              </div>
              <Link
                to={activationState === 'billing_required' ? '/partner/billing' : '/partner/profile'}
                className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#1E2F24] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#17241c]"
              >
                Continue setup
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-3 rounded-[22px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,253,248,0.88)] p-4 md:p-5">
        <Link to="/partner/listings" className="inline-flex text-[12px] font-medium text-[color:var(--gig-text-muted)] transition hover:text-[#1E2F24]">
          Back to Rescue bags
        </Link>
        <div className="flex flex-col gap-2">
          <div className="editorial-eyebrow">New bag</div>
          <h1 className="font-['Fraunces',serif] text-[28px] leading-[1.02] tracking-[-0.04em] text-[color:var(--gig-text)] md:text-[32px]">
            Create rescue bag
          </h1>
          <p className="text-[13px] text-[color:var(--gig-text-muted)]">
            Add the bag details, price, pickup time, and food notes.
          </p>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_248px]">
        <ListingForm />

        <aside className="space-y-3">
          <section className="rounded-[20px] border border-[rgba(32,38,28,0.08)] bg-[rgba(255,255,255,0.74)] p-4">
            <div className="mb-3">
              <h2 className="text-[16px] font-semibold text-[#1E1E1E]">Quick tips</h2>
            </div>
            <div className="space-y-2.5">
              <HelpItem>Use a clear title.</HelpItem>
              <HelpItem>Set real pickup time.</HelpItem>
              <HelpItem>Only post surplus food.</HelpItem>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
