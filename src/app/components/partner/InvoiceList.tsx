import type { Invoice } from '../../types/invoice';
import { formatINR } from '../../lib/currency';
import { getInvoiceStatusClasses, getInvoiceStatusLabel } from '../../lib/status';

interface InvoiceListProps {
  invoices: Invoice[];
}

export default function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="surface-card rounded-[22px] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-[17px] font-semibold text-[color:var(--gig-text)]">{invoice.label}</div>
              <div className="mt-1 text-[14px] text-[color:var(--gig-text-muted)]">{invoice.periodLabel}</div>
              <div className="meta-text mt-2">Issued {invoice.issuedAt} · Due {invoice.dueAt}</div>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <span className={`inline-flex rounded-full px-3 py-[8px] text-[12px] font-semibold ${getInvoiceStatusClasses(invoice.status)}`}>
                {getInvoiceStatusLabel(invoice.status)}
              </span>
              <div className="text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{formatINR(invoice.amount)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
