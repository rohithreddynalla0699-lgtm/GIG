export type InvoiceStatus = 'paid' | 'due' | 'failed';

export interface Invoice {
  id: string;
  partnerId: string;
  label: string;
  periodLabel: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
}
