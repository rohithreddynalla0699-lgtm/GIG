interface PaymentMethodCardProps {
  paymentMethodLabel: string;
  actionStateLabel: string;
  onUpdate: () => void;
}

export default function PaymentMethodCard({ paymentMethodLabel, actionStateLabel, onUpdate }: PaymentMethodCardProps) {
  return (
    <div className="surface-card rounded-[28px] p-6 md:p-7">
      <div className="eyebrow mb-2">Billing method</div>
      <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{paymentMethodLabel}</h2>
      <p className="mt-2 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">
        Review the billing method used for this account. Changes on this screen update local account state only.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="meta-text">{actionStateLabel}</div>
        <button type="button" onClick={onUpdate} className="btn-secondary justify-center">
          Update billing method
        </button>
      </div>
    </div>
  );
}
