import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import MotionReveal from './shared/MotionReveal';

const valueBlocks = [
  {
    title: 'Better value, less waste',
    body: 'Fresh surplus becomes something worth checking before it disappears.',
    span: 'md:col-span-2',
  },
  {
    title: 'More reasons to eat local',
    body: 'Discover nearby restaurants, bakeries, cafes, and neighbourhood kitchens.',
    span: '',
  },
  {
    title: 'An easier answer for everyday meals',
    body: 'Clear pricing and pickup windows make same-day food feel effortless.',
    span: '',
  },
  {
    title: 'Food worth finding again',
    body: 'Good meals stay visible instead of quietly going unsold.',
    span: 'md:col-span-2',
  },
];

export default function Mission() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const visualY = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [18, -10, 20]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[linear-gradient(180deg,#12382f_0%,#0d2823_100%)] px-[5%] py-[clamp(64px,8vw,94px)] text-white"
    >
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-start lg:gap-12">
          <div className="relative">
            <MotionReveal className="max-w-[660px]" y={34}>
              <h2 className="font-['Fraunces',serif] text-[clamp(2.35rem,4.8vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-white">
                Good food should stay part of everyday life.
              </h2>
              <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.78] text-white/76 md:text-[18px]">
                GIG helps more fresh surplus get discovered instead of overlooked — making local food feel more accessible, worthwhile, and easy to act on.
              </p>
            </MotionReveal>

            <motion.div
              style={reduceMotion ? undefined : { y: visualY }}
              className="relative mt-8 sm:mt-10"
            >
              <MotionReveal
                delay={0.12}
                y={30}
                className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.05)_100%)] p-3 shadow-[0_28px_56px_rgba(0,0,0,0.2)] backdrop-blur-xl"
              >
                <div className="absolute -left-10 top-10 h-[180px] w-[180px] rounded-full bg-[rgba(47,143,124,0.24)] blur-[42px]" />
                <div className="absolute right-[-18px] top-[28%] h-[150px] w-[150px] rounded-full bg-[rgba(232,185,128,0.18)] blur-[34px]" />
                <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.05),transparent_34%)]" />

                <div className="relative rounded-[28px] bg-[linear-gradient(180deg,#fff8ee_0%,#fff3df_100%)] p-5 text-[color:var(--gig-text)] sm:p-7">
                  <div className="rounded-[26px] bg-[linear-gradient(135deg,#145141_0%,#228069_100%)] px-5 py-6 text-white sm:px-7 sm:py-7">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">Everyday food ritual</div>
                    <div className="mt-12 max-w-[12ch] text-[31px] font-medium leading-[1.02] tracking-[-0.05em] sm:text-[36px]">
                      Good meals stay in the city’s routine.
                    </div>
                    <p className="mt-12 max-w-[28ch] text-[15px] leading-[1.7] text-white/76">
                      Nearby surplus feels easier to notice, easier to want, and easier to bring into everyday meals.
                    </p>
                  </div>
                </div>
              </MotionReveal>
            </motion.div>
          </div>

          <div className="relative lg:pt-8">
            <MotionReveal delay={0.06} y={18} className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bfe7d6]/72">
                What changes
              </div>
            </MotionReveal>

            <div className="pointer-events-none absolute left-0 top-12 h-[220px] w-[180px] rounded-full bg-[radial-gradient(circle,rgba(191,231,214,0.1)_0%,rgba(191,231,214,0)_72%)] blur-[36px]" />
            <div className="pointer-events-none absolute left-0 right-0 top-8 h-px bg-[linear-gradient(90deg,rgba(191,231,214,0)_0%,rgba(191,231,214,0.12)_14%,rgba(191,231,214,0.05)_48%,rgba(191,231,214,0)_100%)]" />

            <div className="relative grid gap-4 md:grid-cols-2 lg:gap-5">
              {valueBlocks.map((block, index) => (
                <MotionReveal
                  key={block.title}
                  delay={0.08 + index * 0.07}
                  y={24}
                  className={`${block.span} ${index === 3 ? 'md:max-w-[24rem]' : ''}`}
                >
                  <motion.div
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className={`rounded-[24px] border border-white/9 bg-white/[0.045] px-4 py-4 backdrop-blur-lg transition-[border-color,background-color,box-shadow] duration-[var(--gig-motion-base)] hover:border-[rgba(191,231,214,0.18)] hover:bg-white/[0.065] hover:shadow-[0_18px_30px_rgba(0,0,0,0.14)] sm:px-5 sm:py-5 ${
                      index === 0 ? 'min-h-[176px]' : index === 3 ? 'md:min-h-[148px]' : 'min-h-[186px]'
                    }`}
                  >
                    <h3 className="max-w-[15ch] text-[24px] font-medium leading-[1.04] tracking-[-0.04em] text-white">
                      {block.title}
                    </h3>
                    <p className="mt-3 max-w-[30ch] text-[15px] leading-[1.7] text-white/72">
                      {block.body}
                    </p>
                  </motion.div>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
