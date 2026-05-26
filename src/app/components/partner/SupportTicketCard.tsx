interface SupportTicketCardProps {
  title: string;
  status: string;
  note: string;
  updatedLabel: string;
}

export default function SupportTicketCard({ title, status, note, updatedLabel }: SupportTicketCardProps) {
  return (
    <div className="surface-card rounded-[22px] p-5">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[17px] font-semibold text-[color:var(--gig-text)]">{title}</div>
          <div className="meta-text mt-1">{updatedLabel}</div>
        </div>
        <span className="inline-flex self-start rounded-full bg-[rgba(36,92,154,0.08)] px-3 py-[8px] text-[12px] font-semibold text-[#245C9A]">
          {status}
        </span>
      </div>
      <p className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{note}</p>
    </div>
  );
}
