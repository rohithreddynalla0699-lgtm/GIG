import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import MotionReveal from './shared/MotionReveal';

const steps = [
  {
    number: '01',
    title: 'Discover nearby surplus',
    description: 'Browse rescue bags and same-day listings from nearby food outlets.',
  },
  {
    number: '02',
    title: 'Reserve in the app',
    description: 'Choose what looks good and continue in the app to reserve and pay.',
  },
  {
    number: '03',
    title: 'Pick up on time',
    description: 'Collect during the listed pickup window using your pickup code.',
  },
  {
    number: '04',
    title: 'Collect with confidence',
    description: 'Pickup stays simple because timing, quantity, and collection details are already clear.',
  },
];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const phoneY = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [18, -10, 22]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [0.985, 1, 1.015]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="bg-[linear-gradient(180deg,#0b201c_0%,#0f2c26_100%)] px-[5%] py-[clamp(64px,8vw,96px)] text-white"
    >
      <div className="section-shell">
        <div className="mb-9 grid gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <MotionReveal>
            <div className="eyebrow mb-3 text-[#b8e7d3]">How GIG Works</div>
            <h2 className="font-['Fraunces',serif] text-[clamp(2.25rem,4.5vw,3.8rem)] font-semibold leading-[0.97] tracking-[-0.05em] text-white">
              Four simple steps from discovery to pickup.
            </h2>
          </MotionReveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="lg:sticky lg:top-[92px] lg:h-fit">
            <MotionReveal className="dark-panel editorial-grid relative overflow-hidden rounded-[34px] p-4 sm:p-6" y={34}>
              <motion.div
                style={reduceMotion ? undefined : { y: phoneY, scale: phoneScale }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute right-[-30px] top-10 h-[160px] w-[160px] rounded-full bg-[rgba(232,185,128,0.12)] blur-[26px]" />
                <div className="absolute left-[-20px] bottom-16 h-[150px] w-[150px] rounded-full bg-[rgba(42,134,117,0.18)] blur-[30px]" />

                <div className="relative mx-auto max-w-[320px]">
                  <div className="absolute inset-x-[22%] top-0 h-8 rounded-b-[18px] bg-[#131917]" />
                  <div className="overflow-hidden rounded-[36px] border-[10px] border-[#131917] bg-[#fef7ec] shadow-[0_30px_64px_rgba(0,0,0,0.28)]">
                    <div className="bg-[linear-gradient(180deg,#fff6ea_0%,#fffdf7_100%)] px-4 pb-5 pt-8 text-[color:var(--gig-text)]">
                      <div className="rounded-[22px] bg-[linear-gradient(135deg,#145040_0%,#27816a_60%,#319984_100%)] p-4 text-white">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">App handoff</div>
                        <div className="mt-8 text-[24px] font-semibold leading-[1.02] tracking-[-0.05em]">
                          Reserve, pay, and collect with clarity.
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {[
                          ['Store details', 'Name, area, pickup timing, quantity left'],
                          ['Reserve in app', 'Secure payment, confirmation, and order status'],
                          ['Pickup code', 'Ready when it is time to collect'],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[18px] bg-white p-4 shadow-[0_10px_18px_rgba(25,35,30,0.08)]">
                            <div className="meta-text mb-1">{label}</div>
                            <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </MotionReveal>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <MotionReveal
                key={step.number}
                delay={0.08 + index * 0.08}
                y={24}
              >
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[28px] border border-white/10 bg-white/6 p-4 backdrop-blur-lg transition-[border-color,background-color,box-shadow] duration-[var(--gig-motion-base)] hover:border-[rgba(184,231,211,0.2)] hover:bg-white/[0.075] hover:shadow-[0_18px_30px_rgba(0,0,0,0.14)] md:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b8e7d3]">
                        Step {step.number}
                      </div>
                      <h3 className="mt-2.5 text-[26px] font-semibold leading-[1.02] tracking-[-0.05em] text-white">
                        {step.title}
                      </h3>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-2 text-[12px] font-semibold text-white/70">
                      {step.number}
                    </div>
                  </div>
                  <p className="mt-2.5 text-[15px] leading-[1.68] text-white/78">{step.description}</p>
                </motion.div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
