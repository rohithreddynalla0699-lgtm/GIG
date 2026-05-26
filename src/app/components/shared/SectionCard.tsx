import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({ title, description, children, className = '' }: SectionCardProps) {
  return (
    <section className={`surface-card p-5 md:p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-5 md:mb-6">
          {title && <h2 className="section-title mb-2">{title}</h2>}
          {description && <p className="body-regular max-w-[60ch]">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
