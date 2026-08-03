import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface SectionHeaderProps {
  title: string
  description?: string
  /** Right-aligned actions (buttons, badges). */
  action?: ReactNode
  className?: string
}

/** Consistent section title used inside pages and cards. */
export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-4', className)}>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-foreground-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
