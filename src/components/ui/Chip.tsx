import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ChipProps {
  children: ReactNode
  onRemove?: () => void
  active?: boolean
  onClick?: () => void
  className?: string
}

/**
 * Compact, pill-shaped tag. Supports selection (active) and optional removal.
 */
export function Chip({ children, onRemove, active = false, onClick, className }: ChipProps) {
  const interactive = Boolean(onClick) || Boolean(onRemove)
  return (
    <span
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
        active
          ? 'border-brand-purple/50 bg-brand-purple/15 text-brand-purple shadow-neon-purple'
          : 'border-white/10 bg-white/5 text-foreground-secondary',
        interactive && 'cursor-pointer hover:bg-white/10',
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="grid h-4 w-4 place-items-center rounded-full text-foreground-muted transition hover:text-brand-rose"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
