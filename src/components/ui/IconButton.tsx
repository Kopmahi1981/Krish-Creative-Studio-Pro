import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label — required since the button has no visible text. */
  label: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'default' | 'rose' | 'purple' | 'cyan'
}

const sizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' } as const

const toneMap = {
  default: 'hover:bg-white/10 hover:text-foreground',
  rose: 'hover:bg-brand-rose/15 hover:text-brand-rose hover:shadow-neon-rose',
  purple: 'hover:bg-brand-purple/15 hover:text-brand-purple hover:shadow-neon-purple',
  cyan: 'hover:bg-brand-cyan/15 hover:text-brand-cyan hover:shadow-neon-cyan',
} as const

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = 'md', tone = 'default', className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-grid place-items-center rounded-xl border border-white/10 bg-white/5 text-foreground-secondary transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeMap[size],
        toneMap[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
