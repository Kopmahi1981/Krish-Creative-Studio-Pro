import type { LucideIcon } from 'lucide-react'
import { GlassCard } from './GlassCard'

interface PagePlaceholderProps {
  icon: LucideIcon
  title: string
  description: string
  /** Short note about when this module ships (e.g. "Phase 4"). */
  phaseNote?: string
}

/**
 * Consistent placeholder used by every Phase 1 page.
 * Keeps the UI premium while clearly signalling that the feature ships later.
 */
export function PagePlaceholder({
  icon: Icon,
  title,
  description,
  phaseNote,
}: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <GlassCard accent="purple" className="w-full max-w-xl text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 animate-float place-items-center rounded-2xl bg-gradient-to-br from-brand-purple/30 to-brand-rose/20 shadow-neon-purple">
          <Icon className="h-8 w-8 text-brand-cyan" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-foreground-secondary">
          {description}
        </p>
        {phaseNote && (
          <span className="mt-5 inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-cyan neon-cyan">
            {phaseNote}
          </span>
        )}
      </GlassCard>
    </div>
  )
}
