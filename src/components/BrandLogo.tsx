import { cn } from '@/utils/cn'

interface BrandLogoProps {
  /** When true, render the wordmark next to the mark (used in sidebar / top bar). */
  withWordmark?: boolean
  className?: string
}

/**
 * Brand mark + wordmark for Krish Creative Studio Pro.
 * Purely presentational; the gradient mark evokes the rose→purple neon brand identity.
 */
export function BrandLogo({ withWordmark = false, className }: BrandLogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-rose to-brand-purple shadow-neon-purple">
        <span className="text-lg font-extrabold text-white">K</span>
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/20" />
      </div>
      {withWordmark && (
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight text-foreground">
            Krish Creative
          </p>
          <p className="text-xs font-medium text-brand-cyan neon-cyan">Studio Pro</p>
        </div>
      )}
    </div>
  )
}
