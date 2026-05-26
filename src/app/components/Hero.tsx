import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

const supportItems = [
  'Rescue bags that change daily',
  'Good food from nearby kitchens',
  'Priced for tonight, not tomorrow',
  'Built for Indian cities',
];

const collageImageUrls = [
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
];

const heroCarouselImages = [
  { id: 'bread', src: collageImageUrls[0], alt: 'Fresh artisanal bread' },
  { id: 'salad', src: collageImageUrls[1], alt: 'Colorful salad bowl' },
  { id: 'dessert', src: collageImageUrls[2], alt: 'Layered dessert cups' },
  { id: 'pastries', src: collageImageUrls[3], alt: 'Fresh pastries' },
  { id: 'meal', src: collageImageUrls[4], alt: 'Prepared meal bowl' },
];

const carouselSlotOrder = ['center', 'left', 'farLeft', 'farRight', 'right'] as const;
type CarouselSlotName = (typeof carouselSlotOrder)[number];

type CarouselSlotGeometry = {
  aspect: '4/3' | '1.15/1';
  opacity: number;
  scale: number;
  shadow: string;
  width: number;
  x: number;
  y: number;
  zIndex: number;
};

const carouselGeometries: Record<'mobile' | 'tablet' | 'desktop', Record<CarouselSlotName, CarouselSlotGeometry>> = {
  mobile: {
    center: { x: 0, y: -18, width: 258, scale: 1, opacity: 1, zIndex: 30, aspect: '4/3', shadow: '0 22px 44px rgba(0,0,0,0.22)' },
    left: { x: -126, y: 26, width: 146, scale: 0.9, opacity: 0.9, zIndex: 20, aspect: '4/3', shadow: '0 14px 28px rgba(0,0,0,0.16)' },
    right: { x: 126, y: 26, width: 146, scale: 0.9, opacity: 0.9, zIndex: 20, aspect: '4/3', shadow: '0 14px 28px rgba(0,0,0,0.16)' },
    farLeft: { x: -206, y: 56, width: 92, scale: 0.74, opacity: 0.42, zIndex: 10, aspect: '1.15/1', shadow: '0 8px 18px rgba(0,0,0,0.12)' },
    farRight: { x: 206, y: 56, width: 92, scale: 0.74, opacity: 0.42, zIndex: 10, aspect: '1.15/1', shadow: '0 8px 18px rgba(0,0,0,0.12)' },
  },
  tablet: {
    center: { x: 0, y: -28, width: 340, scale: 1, opacity: 1, zIndex: 30, aspect: '4/3', shadow: '0 22px 44px rgba(0,0,0,0.22)' },
    left: { x: -178, y: 34, width: 186, scale: 0.9, opacity: 0.9, zIndex: 20, aspect: '4/3', shadow: '0 14px 28px rgba(0,0,0,0.16)' },
    right: { x: 178, y: 34, width: 186, scale: 0.9, opacity: 0.9, zIndex: 20, aspect: '4/3', shadow: '0 14px 28px rgba(0,0,0,0.16)' },
    farLeft: { x: -282, y: 74, width: 122, scale: 0.74, opacity: 0.42, zIndex: 10, aspect: '1.15/1', shadow: '0 8px 18px rgba(0,0,0,0.12)' },
    farRight: { x: 282, y: 74, width: 122, scale: 0.74, opacity: 0.42, zIndex: 10, aspect: '1.15/1', shadow: '0 8px 18px rgba(0,0,0,0.12)' },
  },
  desktop: {
    center: { x: 0, y: -34, width: 400, scale: 1, opacity: 1, zIndex: 30, aspect: '4/3', shadow: '0 22px 44px rgba(0,0,0,0.22)' },
    left: { x: -210, y: 38, width: 210, scale: 0.9, opacity: 0.9, zIndex: 20, aspect: '4/3', shadow: '0 14px 28px rgba(0,0,0,0.16)' },
    right: { x: 210, y: 38, width: 210, scale: 0.9, opacity: 0.9, zIndex: 20, aspect: '4/3', shadow: '0 14px 28px rgba(0,0,0,0.16)' },
    farLeft: { x: -330, y: 86, width: 132, scale: 0.74, opacity: 0.42, zIndex: 10, aspect: '1.15/1', shadow: '0 8px 18px rgba(0,0,0,0.12)' },
    farRight: { x: 330, y: 86, width: 132, scale: 0.74, opacity: 0.42, zIndex: 10, aspect: '1.15/1', shadow: '0 8px 18px rgba(0,0,0,0.12)' },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [viewportTier, setViewportTier] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 70]);
  const scale = useTransform(scrollY, [0, 500], [1, reduceMotion ? 1 : 1.08]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const updateViewportTier = () => {
      if (mobileQuery.matches) {
        setViewportTier('mobile');
      } else if (desktopQuery.matches) {
        setViewportTier('desktop');
      } else {
        setViewportTier('tablet');
      }
    };

    updateViewportTier();
    mobileQuery.addEventListener('change', updateViewportTier);
    desktopQuery.addEventListener('change', updateViewportTier);

    return () => {
      mobileQuery.removeEventListener('change', updateViewportTier);
      desktopQuery.removeEventListener('change', updateViewportTier);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroCarouselImages.length);
    }, 4200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [reduceMotion]);

  return (
    <section className="relative min-h-[88svh] overflow-hidden bg-[linear-gradient(180deg,var(--gig-green-night)_0%,#0b2621_42%,#112f2a_100%)] px-[5%] pb-10 pt-[92px] text-white md:min-h-[92svh] md:pb-14 md:pt-[104px] lg:min-h-screen lg:pt-[112px]">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <div className="editorial-grid absolute inset-0 opacity-25" />
        <div className="glow-orb absolute left-[-8%] top-[12%] h-[280px] w-[280px] rounded-full bg-[rgba(44,137,120,0.46)]" />
        <div className="glow-orb absolute right-[-6%] top-[20%] h-[320px] w-[320px] rounded-full bg-[rgba(232,185,128,0.28)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(5,14,12,0.08)_0%,rgba(5,14,12,0.48)_100%)]" />
      </motion.div>

      <div className="section-shell relative z-10 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="max-w-[640px]">
          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 24,
                    filter: 'brightness(1.18) drop-shadow(0 0 28px rgba(123,195,171,0.34))',
                    boxShadow: '0 0 0 rgba(123,195,171,0), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }
            }
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                    filter: 'brightness(1) drop-shadow(0 0 0 rgba(123,195,171,0))',
                    boxShadow: '0 0 26px rgba(123,195,171,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }
            }
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex rounded-full border border-[rgba(185,235,218,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.05)_100%)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e2f3eb]"
          >
            Food rescue, made local
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-['Fraunces',serif] text-[clamp(3.1rem,7vw,6.2rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-white"
          >
            Good food deserves a second chance.
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.76, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[58ch] text-[17px] leading-[1.8] text-white/76 md:text-[18px]"
          >
            Discover surplus meals, bakery bags, and same-day finds from nearby restaurants, cafes, and food outlets. GIG makes good food feel worth finding again: local, well-priced, and ready for tonight.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3"
          >
            <div className="flex flex-wrap gap-3">
              <Link to="/find-food" className="btn-primary">
                Find food
              </Link>
            </div>
            <Link
              to="/partner/onboarding"
              className="inline-flex basis-full items-center gap-2 pt-1 text-left text-[14px] font-medium text-white/66 transition-colors hover:text-white md:ml-2 md:basis-auto md:pt-0 md:text-white/70"
            >
              <span>Partner with GIG</span>
              <span aria-hidden="true" className="text-white/42">→</span>
            </Link>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 hidden md:block"
          >
            <div className="grid max-w-[660px] items-start gap-x-3 gap-y-2.5 sm:grid-cols-2">
              {supportItems.map((item, index) => (
                <motion.span
                  key={item}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.58,
                    delay: reduceMotion ? 0 : 0.42 + index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="kicker-chip justify-self-start gap-2 whitespace-nowrap border-white/8 bg-white/[0.045] px-[0.78rem] py-[0.4rem] text-[0.69rem] tracking-[0.07em] text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors duration-[var(--gig-motion-fast)] hover:border-white/12 hover:bg-white/[0.06] hover:text-white/88"
                >
                  <span className="h-[6px] w-[6px] rounded-full bg-[var(--gig-green)]" />
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 28 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative ml-auto min-h-[420px] max-w-[760px] sm:min-h-[520px] lg:min-h-[580px]"
          >
            <div className="glow-orb absolute left-[12%] top-[18%] h-[160px] w-[160px] rounded-full bg-[rgba(44,137,120,0.18)]" />
            <div className="glow-orb absolute right-[10%] bottom-[16%] h-[150px] w-[150px] rounded-full bg-[rgba(232,185,128,0.14)]" />

            <div className="relative min-h-[380px] sm:min-h-[470px] lg:min-h-[520px]">
              {heroCarouselImages.map((image, index) => {
                const slotIndex = reduceMotion
                  ? index
                  : (index - activeIndex + heroCarouselImages.length) % heroCarouselImages.length;
                const slotName = carouselSlotOrder[slotIndex];
                const slot = carouselGeometries[viewportTier][slotName];

                return (
                  <motion.div
                    key={image.id}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={false}
                    animate={{
                      x: slot.x,
                      y: slot.y,
                      width: slot.width,
                      scale: slot.scale,
                      opacity: slot.opacity,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 1.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      zIndex: slot.zIndex,
                      filter: slotName === 'center' ? 'none' : 'saturate(0.92)',
                    }}
                  >
                    <div
                      className={`overflow-hidden rounded-[30px] bg-[rgba(255,255,255,0.03)] ${
                        slot.aspect === '4/3' ? 'aspect-[4/3]' : 'aspect-[1.15/1]'
                      }`}
                      style={{
                        border: slotName === 'center' ? '1px solid rgba(255,255,255,0.10)' : slotName === 'left' || slotName === 'right' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: slot.shadow,
                        borderRadius: slotName === 'center' ? '30px' : slotName === 'left' || slotName === 'right' ? '24px' : '22px',
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="h-full w-full object-cover"
                        loading={slotName === 'center' ? 'eager' : 'lazy'}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.66, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 bottom-5 z-10 hidden justify-center sm:flex lg:bottom-7"
      >
        <a href="#what-is-gig" className="group pointer-events-auto inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white/74">
          Scroll to explore
          <span className="text-[13px] text-white/38 transition-colors group-hover:text-white/60">
            ↓
          </span>
        </a>
      </motion.div>
    </section>
  );
}
