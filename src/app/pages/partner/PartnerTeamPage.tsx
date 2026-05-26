import { useMemo, useState } from 'react';
import InviteMemberForm from '../../components/partner/InviteMemberForm';
import TeamMemberCard from '../../components/partner/TeamMemberCard';
import SectionCard from '../../components/shared/SectionCard';
import { currentPartner } from '../../data/mock/partners';
import { teamMembers } from '../../data/mock/team';
import type { TeamMember, TeamPermission } from '../../types/team';

export default function PartnerTeamPage() {
  const [members, setMembers] = useState(teamMembers);
  const [inviteMessage, setInviteMessage] = useState('');

  const partnerMembers = useMemo(
    () => members.filter((member) => member.partnerId === currentPartner.id),
    [members]
  );

  const summary = {
    active: partnerMembers.filter((member) => member.status === 'active').length,
    invited: partnerMembers.filter((member) => member.status === 'invited').length,
    suspended: partnerMembers.filter((member) => member.status === 'suspended').length,
  };

  const handleInvite = (payload: { name: string; role: string; outletAccess: string; permissions: TeamPermission[] }) => {
    const nextMember: TeamMember = {
      id: `team-${payload.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      partnerId: currentPartner.id,
      name: payload.name,
      role: payload.role,
      emailMasked: 'invite pending',
      phoneMasked: 'invite pending',
      outletAccess: [payload.outletAccess],
      status: 'invited',
      permissions: payload.permissions,
      inviteSentLabel: 'Invite sent just now',
    };

    setMembers((current) => [nextMember, ...current]);
    setInviteMessage(`${payload.name} has been added to the local invite queue for ${payload.outletAccess}.`);
  };

  return (
    <div className="space-y-7 md:space-y-8">
      <section className="surface-card p-6 md:p-7">
        <div className="editorial-eyebrow mb-3">Team</div>
        <h1 className="page-title max-w-[12ch]">Keep outlet access, responsibilities, and finance visibility clear.</h1>
        <p className="body-large mt-3 max-w-[64ch]">
          This is an account tool, not a reporting dashboard. Invite the right people, keep roles simple, and only expose private workflows where needed.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] bg-[rgba(255,255,255,0.74)] px-4 py-4">
            <p className="operational-label mb-1">Active</p>
            <p className="text-[24px] font-semibold text-[#1E1E1E]">{summary.active}</p>
          </div>
          <div className="rounded-[22px] bg-[rgba(255,255,255,0.74)] px-4 py-4">
            <p className="operational-label mb-1">Invited</p>
            <p className="text-[24px] font-semibold text-[#1E1E1E]">{summary.invited}</p>
          </div>
          <div className="rounded-[22px] bg-[rgba(255,255,255,0.74)] px-4 py-4">
            <p className="operational-label mb-1">Suspended</p>
            <p className="text-[24px] font-semibold text-[#1E1E1E]">{summary.suspended}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.94fr_1.06fr]">
        <SectionCard
          title="Invite a team member"
          description="Assign outlet access and permissions before the next shift starts."
        >
          {inviteMessage && (
            <div className="mb-4 rounded-[18px] bg-[#EEF6EC] px-4 py-3 text-[14px] text-[#33503C]">
              {inviteMessage}
            </div>
          )}
          <InviteMemberForm onInvite={handleInvite} />
        </SectionCard>

        <SectionCard
          title="Current team"
          description="Roles, masked contact details, and access levels across the partner account."
        >
          <div className="space-y-4">
            {partnerMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
