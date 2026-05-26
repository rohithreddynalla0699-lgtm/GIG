export function formatPickupWindow(dateLabel: string, pickupWindow: string) {
  return `${dateLabel} · ${pickupWindow}`;
}

export function formatCycleLabel(periodLabel: string, payoutDateLabel?: string) {
  return payoutDateLabel ? `${periodLabel} · Payout ${payoutDateLabel}` : periodLabel;
}
