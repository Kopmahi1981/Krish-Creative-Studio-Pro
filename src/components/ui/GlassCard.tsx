import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type NeonAccent = 'none' | 'rose' | 'purple' | 'cyan'

interface GlassCardProps {
  children: ReactNode
  className?: string
  /** Optional neon accent applied to the top border of the card. */
  accent?: NeonAccent
  /** Render with a stronger, more opaque backdrop. */
  strong?: boolean
}

const accentBorder: Record<NeonAccent, string> = {
  none: '',
  rose: 'before:bg-brand-rose',
  purple: 'before:bg-brand-purple',
  cyan: 'before:bg-brand-cyan',
}

/**
 * Reusable glassmorphism surface used across the app shell.
 * The optional neon accent renders a 2px glowing top edge.
 */
export function GlassCard({
  children,
  className,
  accent = 'none',
  strong = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5',
        strong ? 'glass-strong' : 'glass',
        accent !== 'none' &&
          'before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:opacity-80',
        accentBorder[accent],
        className,
      )}
    >
      {children}
    </div>
  )
}
