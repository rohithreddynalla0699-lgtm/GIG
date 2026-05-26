import { Link } from 'react-router';
import ListingForm from '../../components/partner/ListingForm';
import SectionCard from '../../components/shared/SectionCard';
import { getMockPartnerActivationState, isMockPartnerVerified } from '../../data/mock/partners';

export default function PartnerNewListingPage() {
  const canPostBags = isMockPartnerVerified();
  const activationState = getMockPartnerActivationState();

  if (!canPostBags) {
    return (
      <div className="space-y-7 md:space-y-8">
        <section className="surface-card p-6 md:p-7">
          <div className="editorial-eyebrow mb-3">
            {activationState === 'billing_required' ? 'Billing setup required' : 'Verification required'}
          </div>
          <h1 className="page-title max-w-[14ch]">
            {activationState === 'billing_required'
              ? 'Complete billing setup before posting rescue bags.'
              : 'Complete partner verification before posting rescue bags.'}
          </h1>
          <p className="body-large mt-3 max-w-[66ch]">
            {activationState === 'billing_required'
              ? 'Your business has been approved in demo mode, but rescue bag posting stays blocked until billing setup is completed.'
              : 'Your account has been created, but rescue bag posting stays blocked until your business verification details are reviewed.'}
          </p>
          <div className="mt-6">
            <Link
              to={activationState === 'billing_required' ? '/partner/billing' : '/partner/profile'}
              className="btn-primary justify-center whitespace-nowrap"
            >
              {activationState === 'billing_required' ? 'Complete billing setup' : 'Complete verification details'}
            </Link>
          </div>
        </section>

        <SectionCard
          title="What happens next"
          description="This frontend-only MVP keeps the approval state simple while still making the verification step visible."
        >
          <div className="space-y-3 body-regular">
            {activationState === 'billing_required' ? (
              <>
                <p>Verification is already complete in this demo flow, so the next step is billing activation.</p>
                <p>Billing setup stays frontend-only for now and acts as the final gate before posting is enabled.</p>
                <p>Once billing is active later, Create bag will reopen the normal rescue-bag posting flow.</p>
              </>
            ) : (
              <>
                <p>Save your business identity, address, and food license details in Partner Profile.</p>
                <p>Your verification status remains pending until a real review workflow is added later.</p>
                <p>Once approved, Create bag will move to billing setup before the normal posting flow opens.</p>
              </>
            )}
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-7 md:space-y-8">
      <section className="surface-card p-6 md:p-7">
        <div className="editorial-eyebrow mb-3">New bag</div>
        <h1 className="page-title max-w-[13ch]">Create a rescue bag the outlet team can prep and hand over smoothly.</h1>
        <p className="body-large mt-3 max-w-[66ch]">
          Group the basics first, set clear rescue pricing, define the pickup window, and keep safety notes practical for counter staff.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <ListingForm />

        <div className="space-y-5">
          <SectionCard
            title="Before you publish"
            description="A calm checklist for staff-facing accuracy."
          >
            <div className="space-y-3 body-regular">
              <p>Use the title to describe the bag clearly, not to market it.</p>
              <p>Keep original and rescue pricing close to what the counter staff can explain quickly.</p>
              <p>Choose a pickup slot that the kitchen or pastry counter can actually support on time.</p>
            </div>
          </SectionCard>

          <SectionCard
            title="How this demo flow works"
            description="This is still a frontend-only partner demo, but the bag you create will appear in Rescue bags right away."
          >
            <div className="space-y-3 body-regular">
              <p>Submit to create a mock rescue bag using the shared local demo data source.</p>
              <p>Refresh keeps the created bag visible until the local demo data is cleared.</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
