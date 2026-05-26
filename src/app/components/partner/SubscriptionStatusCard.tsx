import type { SubscriptionStatus } from '../../types/subscription';
import { formatINR } from '../../lib/currency';
import { getSubscriptionStatusClasses, getSubscriptionStatusLabel } from '../../lib/status';

interface SubscriptionStatusCardProps {
  planName: string;
  priceMonthly: number;
  renewalDateLabel: string;
  status: SubscriptionStatus;
  billingStatus: string;
}

export default function SubscriptionStatusCard({
  planName,
  priceMonthly,
  renewalDateLabel,
  status,
  billingStatus,
}: SubscriptionStatusCardProps) {
  return (
    <div className="surface-card rounded-[28px] p-6 md:p-7">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="eyebrow mb-2">Private plan</div>
          <h2 className="text-[28px] font-semibold tracking-[-0.05em] text-[color:var(--gig-text)]">{planName}</h2>
          <div className="mt-2 text-[15px] text-[color:var(--gig-text-muted)]">
            {formatINR(priceMonthly)}/month · Renewal {renewalDateLabel}
          </div>
        </div>
        <span className={`inline-flex self-start rounded-full px-3 py-[8px] text-[12px] font-semibold ${getSubscriptionStatusClasses(status)}`}>
          {getSubscriptionStatusLabel(status)}
        </span>
      </div>

      <div className="rounded-[22px] bg-[rgba(32,38,28,0.04)] p-4">
        <div className="meta-text mb-1">Billing status</div>
        <div className="text-[16px] font-medium text-[color:var(--gig-text)]">{billingStatus}</div>
      </div>
    </div>
  );
}
