import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import MotionReveal from './shared/MotionReveal';

const editorialBlocks = [
  {
    title: 'Good food stays visible longer.',
    copy: 'When same-day availability is easier to discover, more worthwhile meals stay part of the city’s routine.',
    span: 'md:col-span-2',
  },
  {
    title: 'Neighbourhood food becomes easier to discover.',
    copy: 'Local bakeries, cafes, kitchens, and restaurants stay closer to everyday decisions.',
    span: '',
  },
  {
    title: 'Pickup-first habits feel normal.',
    copy: 'Clear timing and local availability make same-day food feel easier to act on.',
    span: '',
  },
];

const ambientTickerItems = [
  'Local discovery',
  'Pickup today',
  'Worthwhile meals',
  'Neighbourhood kitchens',
  'Fresh availability',
  'Built for Indian cities',
];

export default function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <section data-nav-theme="light" className="section-divider bg-[var(--gig-cream)] px-[5%] py-[clamp(60px,7vw,88px)]">
        <div className="section-shell">
          <MotionReveal className="max-w-[760px]">
            <div className="eyebrow mb-3">Impact / City Routine</div>
            <h2 className="font-['Fraunces',serif] text-[clamp(2.45rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[color:var(--gig-text)]">
              A better food routine for the city.
            </h2>
            <p className="mt-4 text-[17px] leading-[1.82] text-[color:var(--gig-text-muted)] md:text-[18px]">
              GIG makes same-day food discovery feel more natural: more neighbourhood visibility, more worthwhile pickups, and fewer good meals quietly disappearing at the end of the day.
            </p>
          </MotionReveal>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch lg:gap-5">
            <MotionReveal delay={0.08} y={26}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col rounded-[28px] border border-[rgba(32,38,28,0.07)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,253,248,0.9))] p-5 shadow-[0_10px_20px_rgba(31,34,29,0.05)] transition-[border-color,box-shadow,transform] duration-[var(--gig-motion-base)] hover:border-[rgba(11,122,77,0.12)] hover:shadow-[0_16px_26px_rgba(31,34,29,0.07)] md:col-span-2 lg:col-span-1 md:p-6"
              >
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--gig-green-deep)]">
                  Everyday effect
                </div>
                <h3 className="mt-4 max-w-[14ch] text-[30px] font-semibold leading-[1.02] tracking-[-0.05em] text-[color:var(--gig-text)]">
                  {editorialBlocks[0].title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.78] text-[color:var(--gig-text-muted)]">
                  {editorialBlocks[0].copy}
                </p>
              </motion.div>
            </MotionReveal>

            {editorialBlocks.slice(1).map((block, index) => (
              <MotionReveal key={block.title} delay={0.14 + index * 0.08} y={22}>
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full flex-col rounded-[26px] border border-[rgba(32,38,28,0.06)] bg-[rgba(255,255,255,0.66)] px-5 py-5 shadow-[0_8px_18px_rgba(31,34,29,0.05)] transition-[border-color,box-shadow,transform] duration-[var(--gig-motion-base)] hover:border-[rgba(11,122,77,0.1)] hover:shadow-[0_14px_24px_rgba(31,34,29,0.07)] md:min-h-[220px] lg:min-h-0"
                >
                  <h3 className="max-w-[16ch] text-[23px] font-semibold leading-[1.05] tracking-[-0.04em] text-[color:var(--gig-text)]">
                    {block.title}
                  </h3>
                  <p className="mt-3 max-w-[29ch] text-[15px] leading-[1.72] text-[color:var(--gig-text-muted)]">
                    {block.copy}
                  </p>
                </motion.div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section data-nav-theme="dark" className="overflow-hidden bg-[linear-gradient(180deg,#0c231f_0%,#081613_100%)] px-[5%] pb-[clamp(68px,8vw,100px)] pt-[clamp(96px,10vw,136px)] text-white">
        <div className="section-shell relative">
          <div className="glow-orb absolute left-[8%] top-[8%] h-[220px] w-[220px] rounded-full bg-[rgba(44,137,120,0.34)]" />
          <div className="glow-orb absolute right-[10%] bottom-[10%] h-[180px] w-[180px] rounded-full bg-[rgba(232,185,128,0.2)]" />

          <MotionReveal className="relative z-10 mx-auto max-w-[980px] text-center">
            <div className="eyebrow mb-3 text-[#b8e7d3]">Final CTA</div>
            <h2 className="mx-auto max-w-[12ch] font-['Fraunces',serif] text-[clamp(2.3rem,5.2vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-white">
              Make better local food part of the routine.
            </h2>
            <p className="mx-auto mt-5 max-w-[62ch] text-[17px] leading-[1.82] text-white/82 md:text-[18px]">
              GIG turns fresh same-day availability into something easier to find, easier to pick up, and easier to make part of everyday city life.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/find-food" className="btn-primary">
                Find food
              </Link>
              <Link to="/find-food" className="btn-secondary border-white/14 bg-white/10 text-white hover:bg-white/14 hover:text-white">
                Find food
              </Link>
              <Link to="/partner/onboarding" className="btn-ghost text-white/72 hover:bg-white/8 hover:text-white">
                Partner with GIG
              </Link>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.18} y={18} className="relative z-10 mt-12 hidden overflow-hidden sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-[linear-gradient(90deg,rgba(8,22,19,0.96)_0%,rgba(8,22,19,0)_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-[linear-gradient(270deg,rgba(8,22,19,0.96)_0%,rgba(8,22,19,0)_100%)]" />

            <motion.div
              animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
              transition={reduceMotion ? undefined : { duration: 34, ease: 'linear', repeat: Infinity }}
              className="flex w-max gap-5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42"
            >
              {[...ambientTickerItems, ...ambientTickerItems, ...ambientTickerItems].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-5">
                  <span>{item}</span>
                  <span className="text-white/20">•</span>
                </span>
              ))}
            </motion.div>
          </MotionReveal>

        </div>
      </section>
    </>
  );
}
