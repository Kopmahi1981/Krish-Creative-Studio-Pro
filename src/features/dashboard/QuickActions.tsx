import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { t, useLanguage } from '@/i18n'

export interface QuickAction {
  id: string
  labelKey: string
  descKey: string
  icon: LucideIcon
  to: string
  accent?: 'rose' | 'purple' | 'cyan'
}

interface QuickActionsProps {
  actions: QuickAction[]
}

const accentMap = {
  rose: 'text-brand-rose group-hover:shadow-neon-rose',
  purple: 'text-brand-purple group-hover:shadow-neon-purple',
  cyan: 'text-brand-cyan group-hover:shadow-neon-cyan',
} as const

/**
 * Grid of primary call-to-action cards. Navigates on click (visual in Phase 2).
 */
export function QuickActions({ actions }: QuickActionsProps) {
  const navigate = useNavigate()
  // Subscribe so the action labels localize on language switch.
  useLanguage()
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            type="button"
            onClick={() => navigate(action.to)}
            className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/20 hover:bg-white/10"
          >
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 transition ${accentMap[action.accent ?? 'purple']}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{t(action.labelKey)}</span>
              <span className="mt-0.5 block text-xs text-foreground-muted">{t(action.descKey)}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
