export type TeamPermission = 'listings' | 'orders' | 'payouts' | 'settings';

export type TeamMemberStatus = 'active' | 'invited' | 'suspended';

export interface TeamMember {
  id: string;
  partnerId: string;
  name: string;
  role: string;
  emailMasked: string;
  phoneMasked: string;
  outletAccess: string[];
  status: TeamMemberStatus;
  permissions: TeamPermission[];
  inviteSentLabel?: string;
}
