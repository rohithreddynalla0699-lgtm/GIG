import { useState } from 'react';
import type { TeamPermission } from '../../types/team';

interface InviteMemberFormProps {
  onInvite: (payload: { name: string; role: string; outletAccess: string; permissions: TeamPermission[] }) => void;
}

const permissionOptions: TeamPermission[] = ['listings', 'orders', 'payouts', 'settings'];

const inputClass =
  'w-full rounded-[18px] border border-[color:var(--gig-border)] bg-white px-4 py-[14px] text-[15px] text-[color:var(--gig-text)] outline-none transition-colors placeholder:text-[color:var(--gig-text-soft)] focus:border-[color:var(--gig-green)]';

export default function InviteMemberForm({ onInvite }: InviteMemberFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Outlet manager');
  const [outletAccess, setOutletAccess] = useState('Hitech City');
  const [permissions, setPermissions] = useState<TeamPermission[]>(['listings', 'orders']);

  const togglePermission = (permission: TeamPermission) => {
    setPermissions((current) =>
      current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onInvite({ name, role, outletAccess, permissions });
    setName('');
    setRole('Outlet manager');
    setOutletAccess('Hitech City');
    setPermissions(['listings', 'orders']);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="operational-label mb-2 block">Team member name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter the staff member name" className={inputClass} required />
        </label>
        <label className="block">
          <span className="operational-label mb-2 block">Role</span>
          <select value={role} onChange={(event) => setRole(event.target.value)} className={inputClass}>
            <option>Outlet manager</option>
            <option>Floor supervisor</option>
            <option>Finance coordinator</option>
            <option>Support contact</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="operational-label mb-2 block">Outlet access</span>
        <input value={outletAccess} onChange={(event) => setOutletAccess(event.target.value)} placeholder="Choose the outlet or area" className={inputClass} required />
      </label>

      <div>
        <div className="operational-label mb-2">Permissions</div>
        <div className="flex flex-wrap gap-2">
          {permissionOptions.map((permission) => {
            const active = permissions.includes(permission);
            return (
              <button
                key={permission}
                type="button"
                onClick={() => togglePermission(permission)}
                className={`min-h-[40px] rounded-full px-4 text-[13px] font-medium capitalize transition-colors ${
                  active
                    ? 'bg-[rgba(11,122,77,0.08)] text-[color:var(--gig-green-deep)]'
                    : 'bg-[rgba(32,38,28,0.05)] text-[color:var(--gig-text-muted)] hover:bg-[rgba(32,38,28,0.08)]'
                }`}
              >
                {permission}
              </button>
            );
          })}
        </div>
      </div>

      <button type="submit" className="btn-primary justify-center">
        Send invite
      </button>
    </form>
  );
}
