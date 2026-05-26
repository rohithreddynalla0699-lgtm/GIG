import { useState } from 'react';
import PartnerHelpTopicCard from '../../components/partner/PartnerHelpTopicCard';
import SupportTicketCard from '../../components/partner/SupportTicketCard';
import SectionCard from '../../components/shared/SectionCard';

const helpTopics = [
  {
    title: 'Posting surplus',
    description: 'Keep pickup windows tight, update quantities honestly, and pause listings quickly when the batch is no longer available.',
  },
  {
    title: 'Pickup verification',
    description: 'Use the order detail page to confirm the pickup code before handover. If the customer cannot access the code, note the exception locally.',
  },
  {
    title: 'No-show handling',
    description: 'Mark an order as no-show only after the pickup window closes and the collection counter has been checked.',
  },
  {
    title: 'Refunds and issues',
    description: 'Flag the order locally with a clear note so the team has context before finance or support follow-up happens later.',
  },
  {
    title: 'Payouts',
    description: 'Payout cycles reflect verified collections first, then any refund or adjustment rows before release.',
  },
  {
    title: 'Account and billing',
    description: 'Plan and invoice controls live inside the private subscription route, not on public signup pages.',
  },
];

const supportTickets = [
  {
    id: 'ticket-ops-201',
    title: 'Pickup code mismatch at Madhapur outlet',
    status: 'Open',
    note: 'Staff reported that the customer app was slow to refresh. Manual handover was delayed by seven minutes.',
    updatedLabel: 'Updated today · 5:20 PM',
  },
  {
    id: 'ticket-fin-144',
    title: 'Adjustment query for last payout cycle',
    status: 'Awaiting review',
    note: 'The outlet requested a breakdown for one refunded order that was removed from the weekly settlement.',
    updatedLabel: 'Updated yesterday · 11:05 AM',
  },
];

export default function PartnerHelpPage() {
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSupport = () => {
    setContactMessage('Support request saved on this screen. In a full product build, this would create a partner support ticket.');
  };

  return (
    <div className="space-y-7 md:space-y-8">
      <section className="surface-card p-6 md:p-7">
        <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="editorial-eyebrow mb-3">Help</div>
            <h1 className="page-title max-w-[12ch]">Operational guidance, private account help, and support context in one place.</h1>
            <p className="body-large mt-3 max-w-[64ch]">
              Keep help practical for outlet managers, owners, and finance coordinators. Focus on common questions, current tickets, and the quickest next step.
            </p>
          </div>

          <div className="rounded-[28px] bg-[#1E2F24] p-5 text-white">
            <p className="editorial-eyebrow !text-[#A8D8B7]">Support context</p>
            <p className="mt-3 text-[24px] font-semibold">Have the order ID, outlet, and issue note ready.</p>
            <p className="mt-3 text-[15px] leading-7 text-white/76">
              Urgent pickup issues move faster when staff capture the exception clearly before they contact support.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="Common topics"
          description="Daily operational guidance for teams using the partner console."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {helpTopics.map((topic) => (
              <PartnerHelpTopicCard key={topic.title} title={topic.title} description={topic.description} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Contact support"
          description="This action stays on this screen for now."
        >
          {contactMessage && (
            <div className="mb-4 rounded-[18px] bg-[#EEF6EC] px-4 py-3 text-[14px] text-[#33503C]">
              {contactMessage}
            </div>
          )}
          <div className="space-y-4">
            <div className="rounded-[20px] bg-[rgba(255,255,255,0.74)] px-4 py-4 text-[14px] leading-6 text-[#56665A]">
              For urgent pickup issues, keep the order ID, outlet name, and a short explanation ready before reaching support.
            </div>
            <button
              type="button"
              onClick={handleContactSupport}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#1E2F24] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#17241c]"
            >
              Contact support
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent support tickets"
        description="Sample support tickets visible only inside the partner workspace."
      >
        <div className="space-y-4">
          {supportTickets.map((ticket) => (
            <SupportTicketCard
              key={ticket.id}
              title={ticket.title}
              status={ticket.status}
              note={ticket.note}
              updatedLabel={ticket.updatedLabel}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
