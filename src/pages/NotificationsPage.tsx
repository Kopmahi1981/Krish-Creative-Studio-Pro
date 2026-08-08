import { Bell } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/ui'
import { t, useLanguage } from '@/i18n'

/**
 * Placeholder page — reached from the notifications panel. Real list ships later.
 */
export function NotificationsPage() {
  useLanguage()
  return (
    <div className="space-y-6">
      <PageHeader title={t('page.notifications')} description={t('page.notifications.desc')} />
      <EmptyState
        icon={Bell}
        title={t('page.notifications.none')}
        description={t('page.notifications.none.desc')}
      />
    </div>
  )
}
