import type { Invoice } from '../../types/invoice';

export const invoices: Invoice[] = [
  {
    id: 'invoice-may-2026',
    partnerId: 'partner-hearth-hospitality',
    label: 'Monthly listing plan',
    periodLabel: 'May 2026',
    amount: 199,
    issuedAt: '1 May 2026',
    dueAt: '5 May 2026',
    status: 'paid',
  },
  {
    id: 'invoice-apr-2026',
    partnerId: 'partner-hearth-hospitality',
    label: 'Monthly listing plan',
    periodLabel: 'April 2026',
    amount: 199,
    issuedAt: '1 Apr 2026',
    dueAt: '5 Apr 2026',
    status: 'paid',
  },
  {
    id: 'invoice-jun-2026',
    partnerId: 'partner-hearth-hospitality',
    label: 'Monthly listing plan',
    periodLabel: 'June 2026',
    amount: 199,
    issuedAt: '1 Jun 2026',
    dueAt: '5 Jun 2026',
    status: 'due',
  },
];
