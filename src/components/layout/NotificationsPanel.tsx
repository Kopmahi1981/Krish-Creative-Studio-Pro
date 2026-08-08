import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Popover, Badge } from '@/components/ui'
import { t, useLanguage } from '@/i18n'

interface NotificationMock {
  id: string
  titleKey: string
  detailKey: string
  timeKey: string
  tone: 'rose' | 'purple' | 'cyan' | 'slate'
  /** Route the item navigates to when clicked (visual only). */
  to: string
}

const MOCK_NOTIFICATIONS: NotificationMock[] = [
  { id: 'n1', titleKey: 'notif.exportReady', detailKey: 'notif.exportReady.detail', timeKey: 'notif.time.2m', tone: 'cyan', to: '/assets' },
  { id: 'n2', titleKey: 'notif.templateUpdated', detailKey: 'notif.templateUpdated.detail', timeKey: 'notif.time.1h', tone: 'purple', to: '/templates' },
  { id: 'n3', titleKey: 'notif.brandKit', detailKey: 'notif.brandKit.detail', timeKey: 'notif.time.yesterday', tone: 'rose', to: '/profile' },
]

const dotGlow: Record<NotificationMock['tone'], string> = {
  rose: 'shadow-neon-rose',
  purple: 'shadow-neon-purple',
  cyan: 'shadow-neon-cyan',
  slate: '',
}

/**
 * Notifications panel. Each item is clickable and routes to a relevant placeholder
 * page; "View all" routes to /notifications. Mock data; no backend in Phase 2.
 * All strings are localized via the i18n `t()` key system.
 */
export function NotificationsPanel() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  // Subscribe to language so the panel re-renders on switch.
  useLanguage()

  const go = (to: string) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <span className="relative inline-grid">
          <span className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-foreground-secondary transition hover:bg-white/10 hover:text-brand-cyan hover:shadow-neon-cyan">
            <Bell className="h-5 w-5" />
          </span>
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-rose px-1 text-[10px] font-bold text-white shadow-neon-rose">
            {MOCK_NOTIFICATIONS.length}
          </span>
        </span>
      }
      panelClassName="w-[380px] max-w-[calc(100vw-2rem)] p-4 -mr-[73px]"
    >
      <div className="flex flex-col overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{t('notif.title')}</p>
          <Badge tone="cyan">{t('notif.new', { count: MOCK_NOTIFICATIONS.length })}</Badge>
        </div>

        <ul className="space-y-4">
          {MOCK_NOTIFICATIONS.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => go(n.to)}
                className="group flex w-full cursor-pointer gap-3 rounded-xl border border-transparent p-3 text-left transition-colors duration-150 hover:border-white/10 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/70"
              >
                <span
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-${n.tone} ${dotGlow[n.tone]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{t(n.titleKey)}</p>
                  <p className="mt-1 line-clamp-2 break-words text-xs leading-relaxed text-foreground-muted">
                    {t(n.detailKey)}
                  </p>
                  <p className="mt-1.5 text-[11px] text-foreground-muted">{t(n.timeKey)}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => go('/notifications')}
          className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-center text-sm font-medium text-foreground-secondary transition-colors duration-150 hover:bg-white/10 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/70"
        >
          {t('notif.viewAll')}
        </button>
      </div>
    </Popover>
  )
}
