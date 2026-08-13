import { motion, useReducedMotion } from 'framer-motion';

/**
 * Reveal  -  scroll-triggered fade + slide wrapper.
 * Respects prefers-reduced-motion (no transform/animation).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  once = true,
  className = '',
  ...rest
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
