import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  /** Adds a subtle hover lift — use for clickable cards. */
  interactive?: boolean
}

/** Solid-ish surface (lighter backdrop than GlassCard) for content blocks. */
export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-surface/60 p-5 transition',
        interactive && 'cursor-pointer hover:border-white/20 hover:bg-surface',
        className,
      )}
    >
      {children}
    </div>
  )
}
