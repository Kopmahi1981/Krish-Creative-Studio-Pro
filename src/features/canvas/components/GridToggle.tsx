import { Grid3x3 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { t, useLanguage } from '@/i18n'

interface GridToggleProps {
  active: boolean
  onChange: (next: boolean) => void
}

/** Toggle the workspace alignment grid. Visual-only in Phase 4.1. */
export function GridToggle({ active, onChange }: GridToggleProps) {
  useLanguage()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={t('canvas.grid')}
      onClick={() => onChange(!active)}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60',
        active
          ? 'border-brand-purple/40 bg-brand-purple/15 text-brand-purple shadow-neon-purple'
          : 'border-white/10 bg-white/5 text-foreground-secondary hover:bg-white/10',
      )}
    >
      <Grid3x3 className="h-4 w-4" />
      {t('canvas.grid')}
    </button>
  )
}
