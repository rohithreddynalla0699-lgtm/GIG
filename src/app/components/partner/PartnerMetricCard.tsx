interface PartnerMetricCardProps {
  label: string;
  value: string;
  note: string;
  emphasis?: boolean;
}

export default function PartnerMetricCard({ label, value, note, emphasis = false }: PartnerMetricCardProps) {
  return (
    <div
      className={`rounded-[24px] p-5 md:p-6 ${
        emphasis
          ? 'bg-[linear-gradient(135deg,#18483c_0%,#245c4f_100%)] text-white shadow-[var(--gig-shadow-md)]'
          : 'surface-card'
      }`}
    >
      <div className={`mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] ${emphasis ? 'text-white/68' : 'text-[color:var(--gig-text-soft)]'}`}>
        {label}
      </div>
      <div className={`mb-2 text-[34px] font-semibold leading-none tracking-[-0.05em] ${emphasis ? 'text-white' : 'text-[color:var(--gig-text)]'}`}>
        {value}
      </div>
      <div className={`text-[13px] leading-[1.7] ${emphasis ? 'text-white/78' : 'text-[color:var(--gig-text-muted)]'}`}>
        {note}
      </div>
    </div>
  );
}
