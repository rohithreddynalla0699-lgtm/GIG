import { motion, useReducedMotion } from 'motion/react';
import MotionReveal from './shared/MotionReveal';

const cards = [
  {
    title: 'Evening Bakery Bag',
    store: 'Sunrise Bakehouse · Jubilee Hills',
    original: '₹420',
    rescue: '₹169',
    pickup: '7:30 PM – 8:00 PM',
    left: '3 bags left',
    tags: ['Vegetarian', 'Baked today', 'Contains gluten'],
  },
  {
    title: 'Cafe Meal Box',
    store: 'Third Wave Kitchen · Koramangala',
    original: '₹360',
    rescue: '₹149',
    pickup: '8:15 PM – 8:45 PM',
    left: '5 left',
    tags: ['Veg options', 'Same-day surplus'],
  },
  {
    title: 'Salad & Bowl Rescue',
    store: 'Bombay Salad Co. · Bandra',
    original: '₹520',
    rescue: '₹219',
    pickup: '6:30 PM – 7:15 PM',
    left: '2 left',
    tags: ['Fresh', 'Pickup-first'],
  },
];

export default function SurpriseBag() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-divider bg-[var(--gig-cream-soft)] px-[5%] py-[clamp(62px,7vw,92px)]">
      <div className="section-shell">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <MotionReveal>
            <div className="eyebrow mb-3">Marketplace Preview</div>
            <h2 className="font-['Fraunces',serif] text-[clamp(2.2rem,4.5vw,3.7rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[color:var(--gig-text)]">
              Rescue bags worth checking first.
            </h2>
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <p className="max-w-[56ch] text-[17px] leading-[1.82] text-[color:var(--gig-text-muted)] md:text-[18px]">
              Clear price, pickup timing, quantity, and notes - all before you decide.
            </p>
          </MotionReveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {cards.map((card, index) => (
            <MotionReveal key={card.title} delay={0.1 + index * 0.08} y={24}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[26px] border border-[color:var(--gig-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,253,248,0.94))] p-4 shadow-[0_12px_24px_rgba(31,34,29,0.06)] transition-[border-color,box-shadow,background-color] duration-[var(--gig-motion-base)] hover:border-[rgba(11,122,77,0.14)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,253,248,0.96))] hover:shadow-[0_18px_30px_rgba(31,34,29,0.1)] md:p-[1.05rem]"
              >
                <div className="mb-3.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="operational-label mb-2 text-[color:var(--gig-green-deep)]">Preview listing</div>
                    <h3 className="text-[23px] font-semibold leading-[1.04] tracking-[-0.05em] text-[color:var(--gig-text)]">
                      {card.title}
                    </h3>
                    <p className="meta-text mt-1.5">{card.store}</p>
                  </div>
                  <div className="rounded-full border border-[rgba(11,122,77,0.08)] bg-[rgba(11,122,77,0.045)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--gig-green-deep)]">
                    {card.left}
                  </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div className="rounded-[18px] bg-[rgba(247,245,238,0.72)] px-3.5 py-3">
                    <div className="meta-text mb-1">Original value</div>
                    <div className="text-[15px] font-semibold text-[color:var(--gig-text-soft)] line-through">{card.original}</div>
                  </div>
                  <div className="rounded-[18px] border border-[rgba(11,122,77,0.08)] bg-[rgba(11,122,77,0.04)] px-3.5 py-3">
                    <div className="meta-text mb-1">Rescue price</div>
                    <div className="text-[25px] font-semibold tracking-[-0.05em] text-[color:var(--gig-green-deep)]">{card.rescue}</div>
                  </div>
                </div>

                <div className="mt-2.5 rounded-[20px] border border-[color:var(--gig-border)] bg-white/88 px-3.5 py-3">
                  <div className="meta-text mb-1">Pickup</div>
                  <div className="text-[14px] font-semibold text-[color:var(--gig-text)]">{card.pickup}</div>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[color:var(--gig-border)] bg-[var(--gig-surface)] px-3 py-1.5 text-[11px] font-semibold text-[color:var(--gig-text-muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
