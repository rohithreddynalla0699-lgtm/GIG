import PayoutLedgerTable from '../../components/partner/PayoutLedgerTable';
import PayoutSummaryCard from '../../components/partner/PayoutSummaryCard';
import SectionCard from '../../components/shared/SectionCard';
import { payouts } from '../../data/mock/payouts';
import { orders } from '../../data/mock/orders';
import { currentPartner } from '../../data/mock/partners';
import { formatINR } from '../../lib/currency';
import { formatCycleLabel } from '../../lib/dates';
import { getPayoutStatusClasses, getPayoutStatusLabel } from '../../lib/status';

export default function PartnerPayoutsPage() {
  const partnerPayouts = payouts.filter((cycle) => cycle.partnerId === currentPartner.id);
  const currentCycle = partnerPayouts[0];
  const currentCycleOrders = orders.filter((order) => currentCycle.sourceOrderIds.includes(order.id));
  const paidTotal = partnerPayouts
    .filter((cycle) => cycle.status === 'paid')
    .reduce((sum, cycle) => sum + cycle.netPayout, 0);

  return (
    <div className="space-y-7 md:space-y-8">
      <section className="surface-card p-6 md:p-7">
        <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="editorial-eyebrow mb-3">Payouts</div>
            <h1 className="page-title max-w-[12ch]">Private finance tracking for verified collections and cycle settlements.</h1>
            <p className="body-large mt-3 max-w-[65ch]">
              Keep this view restrained and operational. It shows what is pending, what has cleared, and how refunds or adjustments affect each cycle.
            </p>
          </div>

          <div className="rounded-[28px] bg-[#1E2F24] p-5 text-white">
            <p className="editorial-eyebrow !text-[#A8D8B7]">Current cycle</p>
            <p className="mt-3 text-[30px] font-semibold tracking-[-0.03em]">{formatINR(currentCycle.netPayout)}</p>
            <p className="mt-2 text-[15px] leading-7 text-white/74">
              {formatCycleLabel(currentCycle.periodLabel, currentCycle.payoutDateLabel)}
            </p>
            <p className="mt-1 text-[13px] text-white/66">
              {currentCycleOrders.length} verified orders contribute to this settlement.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <PayoutSummaryCard label="Gross sales" value={formatINR(currentCycle.grossSales)} note="Sales included in the active cycle." emphasis />
          <PayoutSummaryCard label="Partner share" value={formatINR(currentCycle.partnerShare)} note="Private earnings before final adjustments." />
          <PayoutSummaryCard label="Pending payout" value={formatINR(currentCycle.netPayout)} note="Net amount moving toward settlement." />
          <PayoutSummaryCard label="Paid to date" value={formatINR(paidTotal)} note="Amount already settled across prior cycles." />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Current payout cycle"
          description="Collections are reconciled first, then refund or adjustment rows are applied before release."
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className={`inline-flex rounded-full px-3 py-[7px] text-[12px] font-semibold ${getPayoutStatusClasses(currentCycle.status)}`}>
              {getPayoutStatusLabel(currentCycle.status)}
            </span>
            <p className="metadata-caption">
              Private finance context for partner-only routes. Public customer surfaces do not show payout or share details.
            </p>
          </div>

          <PayoutLedgerTable rows={currentCycle.ledger} />
        </SectionCard>

        <SectionCard
          title="Payout history"
          description="Recent settlement cycles tied to completed and verified orders."
        >
          <div className="space-y-3">
            {partnerPayouts.map((cycle) => (
              <div key={cycle.id} className="rounded-[20px] bg-[rgba(255,255,255,0.74)] px-4 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1E1E1E]">{cycle.periodLabel}</h3>
                    <p className="metadata-caption mt-1">Payout target {cycle.payoutDateLabel}</p>
                  </div>
                  <span className={`inline-flex self-start rounded-full px-3 py-[7px] text-[12px] font-semibold ${getPayoutStatusClasses(cycle.status)}`}>
                    {getPayoutStatusLabel(cycle.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="operational-label mb-1">Net payout</p>
                    <p className="text-[18px] font-semibold text-[#1E1E1E]">{formatINR(cycle.netPayout)}</p>
                  </div>
                  <div>
                    <p className="operational-label mb-1">Refunds and adjustments</p>
                    <p className="text-[18px] font-semibold text-[#1E1E1E]">{formatINR(cycle.refunds + cycle.adjustments)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
