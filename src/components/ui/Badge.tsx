import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'rose' | 'purple' | 'cyan' | 'slate' | 'success'

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  className?: string
}

const tones: Record<Tone, string> = {
  rose: 'border-brand-rose/40 bg-brand-rose/10 text-brand-rose',
  purple: 'border-brand-purple/40 bg-brand-purple/10 text-brand-purple',
  cyan: 'border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan',
  slate: 'border-white/15 bg-white/5 text-foreground-secondary',
  success: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
}

export function Badge({ children, tone = 'slate', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
