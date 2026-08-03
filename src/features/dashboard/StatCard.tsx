import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '@/components/ui'
import { cn } from '@/utils/cn'

interface StatCardProps {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  icon: LucideIcon
  accent?: 'rose' | 'purple' | 'cyan'
}

const accentMap = {
  rose: 'from-brand-rose/25 to-transparent text-brand-rose',
  purple: 'from-brand-purple/25 to-transparent text-brand-purple',
  cyan: 'from-brand-cyan/25 to-transparent text-brand-cyan',
} as const

const trendColor = {
  up: 'text-emerald-400',
  down: 'text-rose-400',
  flat: 'text-foreground-muted',
} as const

/**
 * KPI stat widget. Pure presentational — receives values via props.
 */
export function StatCard({ label, value, delta, trend, icon: Icon, accent = 'purple' }: StatCardProps) {
  return (
    <GlassCard accent={accent} className="relative">
      <div
        className={cn(
          'mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br to-transparent',
          accentMap[accent],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-foreground-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      <p className={cn('mt-1 text-xs font-medium', trendColor[trend])}>{delta}</p>
    </GlassCard>
  )
}
