import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
  /** Route key (use the current pathname) to retrigger the transition. */
  routeKey: string
}

/**
 * Wraps route content with a subtle Framer Motion enter/exit transition.
 * Keyed by `routeKey` so navigating between pages animates smoothly.
 *
 * NOTE: Framer Motion's `ease` prop requires a fixed-length 4-tuple, so the
 * bezier is hardcoded here (mirrors designTokens.transition.easing.emphasized).
 */
export function PageTransition({ children, routeKey }: PageTransitionProps) {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="min-h-[60vh]"
    >
      {children}
    </motion.div>
  )
}
