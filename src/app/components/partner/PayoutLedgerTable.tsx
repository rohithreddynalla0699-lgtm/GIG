import type { PayoutLedgerRow } from '../../types/payout';
import { formatINR } from '../../lib/currency';

interface PayoutLedgerTableProps {
  rows: PayoutLedgerRow[];
}

export default function PayoutLedgerTable({ rows }: PayoutLedgerTableProps) {
  return (
    <div className="surface-card overflow-hidden rounded-[26px]">
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="border-b border-[color:var(--gig-border)] bg-[rgba(32,38,28,0.03)]">
            <tr>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Row</th>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Type</th>
              <th className="px-5 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Note</th>
              <th className="px-5 py-4 text-right text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-text-soft)]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[color:var(--gig-border)] last:border-b-0">
                <td className="px-5 py-4">
                  <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{row.label}</div>
                </td>
                <td className="px-5 py-4 text-[14px] capitalize text-[color:var(--gig-text-muted)]">{row.type.replace(/_/g, ' ')}</td>
                <td className="px-5 py-4 text-[14px] text-[color:var(--gig-text-muted)]">{row.note}</td>
                <td className="px-5 py-4 text-right">
                  <div className={`text-[15px] font-semibold ${row.amount < 0 ? 'text-[#A6572E]' : 'text-[color:var(--gig-text)]'}`}>
                    {row.amount < 0 ? `-${formatINR(Math.abs(row.amount))}` : formatINR(row.amount)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 p-4 lg:hidden">
        {rows.map((row) => (
          <div key={row.id} className="rounded-[22px] bg-[rgba(32,38,28,0.04)] p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{row.label}</div>
              <div className={`text-[15px] font-semibold ${row.amount < 0 ? 'text-[#A6572E]' : 'text-[color:var(--gig-text)]'}`}>
                {row.amount < 0 ? `-${formatINR(Math.abs(row.amount))}` : formatINR(row.amount)}
              </div>
            </div>
            <div className="meta-text mb-2 capitalize">{row.type.replace(/_/g, ' ')}</div>
            <div className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{row.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
