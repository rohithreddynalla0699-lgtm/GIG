import { Link } from 'react-router';
import MotionReveal from './shared/MotionReveal';

const businessBenefits = [
  'Publish fresh same-day listings',
  'Reach nearby customers while demand is still local',
  'Keep pickup flow clear for service teams',
];

export default function Business() {
  return (
    <section id="for-businesses" className="bg-[linear-gradient(180deg,#102f28_0%,#0a1d1a_100%)] px-[5%] py-[clamp(66px,8vw,96px)] text-white">
      <div className="section-shell overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_32px_74px_rgba(0,0,0,0.28)]">
        <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
          <MotionReveal className="relative overflow-hidden px-6 py-7 md:px-8 md:py-9">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_22%),radial-gradient(circle_at_82%_72%,rgba(44,137,120,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_100%)]" />
            <div className="relative max-w-[500px]">
              <div className="eyebrow mb-3 text-[#b8e7d3]">For Businesses</div>
              <h2 className="font-['Fraunces',serif] text-[clamp(2.2rem,4.5vw,3.7rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                Turn fresh availability into repeat local demand.
              </h2>
              <p className="mt-4 text-[17px] leading-[1.8] text-white/80 md:text-[18px]">
                GIG helps restaurants, cafes, bakeries, and food outlets make same-day availability easier to discover — without disrupting service operations or pickup flow.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/partner/onboarding" className="btn-secondary border-white/14 bg-white text-[color:var(--gig-green-deep)] hover:bg-[var(--gig-cream)]">
                  Partner with GIG
                </Link>
                <Link to="/partner/login" className="btn-ghost text-white/72 hover:bg-white/8 hover:text-white">
                  Partner sign in
                </Link>
              </div>

              <div className="mt-6 rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b8e7d3]">Business note</div>
                <p className="mt-3 text-[15px] leading-[1.75] text-white/78">
                  Partner tools stay private, but the value proposition is simple: publish fresh listings, reach nearby demand, and keep pickup flow easy for the team.
                </p>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.08} className="bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,245,236,0.96)_100%)] px-6 py-8 text-[color:var(--gig-text)] md:px-8 md:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.96fr] lg:gap-7">
              <div>
                <p className="body-large max-w-[46ch]">
                  GIG is designed to fit service reality: a lower-friction way to publish fresh availability, reach nearby customers, and turn occasional buyers into repeat local demand.
                </p>

                <div className="mt-6 space-y-2.5">
                  {businessBenefits.map((benefit, index) => (
                    <div key={benefit} className="rounded-[18px] border border-[rgba(32,38,28,0.06)] bg-[rgba(255,255,255,0.58)] px-4 py-3 shadow-[0_6px_14px_rgba(31,34,29,0.04)]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(11,122,77,0.08)] text-[12px] font-semibold text-[color:var(--gig-green-deep)]">
                          {index + 1}
                        </div>
                        <div className="text-[15px] font-semibold text-[color:var(--gig-text)]">{benefit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] bg-[linear-gradient(180deg,#12352d_0%,#1a5f4f_100%)] p-5 text-white shadow-[0_18px_34px_rgba(0,0,0,0.14)]">
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b8e7d3]">Partner fit</div>
                <div className="mt-4 max-w-[15ch] text-[23px] font-semibold leading-[1.03] tracking-[-0.05em]">
                  Fresh availability that fits real service flow.
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    ['Listing control', 'Only publish what the team can comfortably fulfil that day'],
                    ['Nearby demand', 'Help fresh availability get discovered by customers close to the store'],
                    ['Pickup-ready flow', 'Keep collection timing, quantity, and handoff details clear for staff and customers'],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/68">{label}</div>
                      <div className="mt-2 text-[14px] font-semibold text-white/88">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
