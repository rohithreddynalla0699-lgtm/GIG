export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface PayoutLedgerRow {
  id: string;
  label: string;
  type: 'gross_sales' | 'partner_share' | 'platform_share' | 'review_adjustment' | 'adjustment';
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
  reviewAdjustments: number;
  adjustments: number;
  netPayout: number;
  status: PayoutStatus;
  sourceOrderIds: string[];
  ledger: PayoutLedgerRow[];
}
