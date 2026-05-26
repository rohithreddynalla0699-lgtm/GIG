import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  children?: ReactNode;
}

export default function EmptyState({ title, description, actionLabel, actionTo, children }: EmptyStateProps) {
  return (
    <div className="surface-quiet p-8 md:p-10 text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[rgba(11,122,77,0.07)] border border-[rgba(11,122,77,0.12)]" />
      <h2 className="section-title mb-3">{title}</h2>
      <p className="body-regular max-w-[520px] mx-auto mb-6">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="btn-primary"
        >
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
