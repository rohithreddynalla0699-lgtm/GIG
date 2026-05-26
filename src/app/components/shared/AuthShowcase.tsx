import type { ReactNode } from 'react';

type AuthShowcaseProps = {
  actions?: ReactNode;
  description: string;
  eyebrow: string;
  highlights: Array<{ description: string; title: string }>;
  note?: ReactNode;
  title: string;
};

export default function AuthShowcase({
  actions,
  description,
  eyebrow,
  highlights,
  note,
  title,
}: AuthShowcaseProps) {
  return (
    <section className="auth-showcase rounded-[34px] p-7 md:p-9">
      <div className="relative z-10">
        <div className="eyebrow mb-4 text-[#cde7db]">{eyebrow}</div>
        <h1 className="font-['Fraunces',serif] text-[clamp(2.35rem,4.8vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
          {title}
        </h1>
        <p className="mt-4 max-w-[54ch] text-[16px] leading-[1.85] text-white/76 md:text-[17px]">
          {description}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {highlights.map((highlight) => (
            <div key={highlight.title} className="rounded-[24px] border border-white/10 bg-white/6 p-5">
              <div className="operational-label mb-2 text-[#b8e7d3]">{highlight.title}</div>
              <p className="text-[13px] leading-[1.65] text-white/68">{highlight.description}</p>
            </div>
          ))}
        </div>

        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}

        {note ? (
          <div className="mt-8 rounded-[26px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-4 text-[14px] leading-[1.75] text-white/70">
            {note}
          </div>
        ) : null}
      </div>
    </section>
  );
}
