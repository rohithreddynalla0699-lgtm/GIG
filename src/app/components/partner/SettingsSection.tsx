import type { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="surface-card rounded-[24px] p-5 md:p-6">
      <div className="mb-4">
        <h3 className="text-[22px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">{title}</h3>
        <p className="mt-1 text-[14px] leading-[1.7] text-[color:var(--gig-text-muted)]">{description}</p>
      </div>
      {children}
    </section>
  );
}
