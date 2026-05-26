import MotionReveal from './shared/MotionReveal';

const statements = [
  {
    title: 'Rescue bags change daily',
    description: 'Fresh surplus varies by store, day, and pickup window.',
  },
  {
    title: 'Nearby food stays discoverable',
    description: 'Find local restaurants, cafes, bakeries, and food outlets in one place.',
  },
  {
    title: 'Listings stay clear',
    description: 'See the store, price, quantity, and pickup notes before deciding.',
  },
];

export default function WhatGigIs() {
  return (
    <section
      id="what-is-gig"
      className="section-divider relative overflow-hidden bg-[linear-gradient(180deg,rgba(247,245,238,0.96)_0%,rgba(248,246,239,1)_16%,rgba(251,250,246,1)_100%)] px-[5%] py-[clamp(60px,7vw,88px)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(9,26,23,0.12)_0%,rgba(247,245,238,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,rgba(251,250,246,0)_0%,rgba(232,245,239,0.34)_100%)]" />
        <div className="absolute left-[-10%] top-[8%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(123,195,171,0.12)_0%,rgba(123,195,171,0)_70%)]" />
        <div className="absolute right-[-4%] top-[22%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(214,160,106,0.1)_0%,rgba(214,160,106,0)_72%)]" />
        <div className="absolute inset-x-[8%] bottom-[10%] h-24 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_72%)]" />
      </div>

      <div className="section-shell relative z-10">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <MotionReveal className="max-w-[540px]">
            <div className="eyebrow mb-3">Mission / Product Definition</div>
            <h2 className="font-['Fraunces',serif] text-[clamp(1.9rem,3.8vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[color:var(--gig-text)]">
              A pickup-first marketplace for surplus food.
            </h2>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <p className="text-[17px] leading-[1.8] text-[color:var(--gig-text-muted)] md:text-[18px]">
              GIG connects customers with nearby food businesses that have fresh surplus to sell before it goes unsold.
            </p>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-[1.75] text-[color:var(--gig-text-soft)]">
              Rescue bags change daily, with clear details on store, price, pickup, and availability.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {statements.map((statement, index) => (
                <MotionReveal
                  key={statement.title}
                  delay={0.15 + index * 0.08}
                  className="rounded-[26px] border border-[color:var(--gig-border)] bg-[rgba(255,255,255,0.78)] p-[1rem] shadow-[0_12px_26px_rgba(22,38,32,0.06)] md:p-[1.05rem]"
                >
                  <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gig-green-deep)]">
                    0{index + 1}
                  </div>
                  <h3 className="text-[22px] font-semibold tracking-[-0.04em] text-[color:var(--gig-text)]">
                    {statement.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-[1.65] text-[color:var(--gig-text-muted)]">{statement.description}</p>
                </MotionReveal>
              ))}
            </div>

          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
