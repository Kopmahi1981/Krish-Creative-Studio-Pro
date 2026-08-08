import { cn } from '@/utils/cn'
import type { FunnelStage } from '../types/template'
import { t, useLanguage } from '@/i18n'

interface FunnelChipProps {
  stage: FunnelStage
  active?: boolean
  onClick?: () => void
}

const CONFIG: Record<
  FunnelStage,
  { label: string; titleKey: string; dot: string; text: string; border: string; glow: string; ring: string }
> = {
  tofu: {
    label: 'TOFU',
    titleKey: 'tpl.funnel.tofu',
    dot: 'bg-cyan-500',
    text: 'text-cyan-500',
    border: 'border-cyan-500/40',
    glow: 'hover:shadow-[0_0_5px_rgba(6,182,212,0.55),0_0_18px_rgba(6,182,212,0.35)]',
    ring: 'focus-visible:ring-cyan-500/70',
  },
  mofu: {
    label: 'MOFU',
    titleKey: 'tpl.funnel.mofu',
    dot: 'bg-brand-purple',
    text: 'text-brand-purple',
    border: 'border-brand-purple/40',
    glow: 'hover:shadow-neon-purple',
    ring: 'focus-visible:ring-brand-purple/70',
  },
  bofu: {
    label: 'BOFU',
    titleKey: 'tpl.funnel.bofu',
    dot: 'bg-brand-rose',
    text: 'text-brand-rose',
    border: 'border-brand-rose/40',
    glow: 'hover:shadow-neon-rose',
    ring: 'focus-visible:ring-brand-rose/70',
  },
}

/**
 * Consistent funnel-stage indicator chip with a colored dot, matching hover
 * glow, and focus ring. Used by the filter bar and the library legend so
 * TOFU / MOFU / BOFU read as visually distinct stages.
 */
export function FunnelChip({ stage, active = false, onClick }: FunnelChipProps) {
  const c = CONFIG[stage]
  const interactive = Boolean(onClick)
  // Subscribe so the funnel title localizes on language switch.
  useLanguage()
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={interactive ? active : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
        c.border,
        c.text,
        active ? 'bg-white/10' : 'bg-white/5',
        interactive && `cursor-pointer hover:bg-white/10 ${c.glow}`,
        c.ring,
        'focus:outline-none',
      )}
    >
      <span className={cn('h-2.5 w-2.5 rounded-full', c.dot, active && c.glow)} />
      {c.label}
      <span className="font-normal opacity-70">{t(c.titleKey)}</span>
    </button>
  )
}
