import { motion, useReducedMotion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router';

export default function RouteTransitionOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={location.pathname}
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      {outlet}
    </motion.div>
  );
}
