import type { TeamMember } from '../../types/team';
import { getTeamMemberStatusClasses, getTeamMemberStatusLabel } from '../../lib/status';

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="surface-card rounded-[24px] p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[20px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{member.name}</div>
          <div className="mt-1 text-[14px] text-[color:var(--gig-text-muted)]">{member.role}</div>
        </div>
        <span className={`inline-flex self-start rounded-full px-3 py-[8px] text-[12px] font-semibold ${getTeamMemberStatusClasses(member.status)}`}>
          {getTeamMemberStatusLabel(member.status)}
        </span>
      </div>

      <div className="mb-4 grid gap-4 rounded-[22px] bg-[rgba(32,38,28,0.04)] p-4 md:grid-cols-2">
        <div>
          <div className="meta-text mb-1">Contact</div>
          <div className="text-[14px] leading-[1.7] text-[color:var(--gig-text)]">{member.emailMasked}</div>
          <div className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{member.phoneMasked}</div>
        </div>
        <div>
          <div className="meta-text mb-1">Outlet access</div>
          <div className="text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{member.outletAccess.join(', ')}</div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {member.permissions.map((permission) => (
          <span key={permission} className="rounded-full bg-[rgba(32,38,28,0.05)] px-3 py-[7px] text-[12px] font-medium capitalize text-[color:var(--gig-text-muted)]">
            {permission}
          </span>
        ))}
      </div>

      {member.inviteSentLabel ? <div className="meta-text">{member.inviteSentLabel}</div> : null}
    </div>
  );
}
