interface PartnerHelpTopicCardProps {
  title: string;
  description: string;
}

export default function PartnerHelpTopicCard({ title, description }: PartnerHelpTopicCardProps) {
  return (
    <div className="surface-card rounded-[22px] p-5">
      <div className="mb-2 text-[20px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{title}</div>
      <p className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{description}</p>
    </div>
  );
}
