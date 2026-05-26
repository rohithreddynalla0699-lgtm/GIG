export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface PayoutLedgerRow {
  id: string;
  label: string;
  type: 'gross_sales' | 'partner_share' | 'platform_share' | 'refund' | 'adjustment';
  amount: number;
  note: string;
}

export interface PayoutCycle {
  id: string;
  partnerId: string;
  periodLabel: string;
  payoutDateLabel: string;
  grossSales: number;
  partnerShare: number;
  platformShare: number;
  refunds: number;
  adjustments: number;
  netPayout: number;
  status: PayoutStatus;
  sourceOrderIds: string[];
  ledger: PayoutLedgerRow[];
}
